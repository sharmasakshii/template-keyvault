import * as dotenv from 'dotenv';
import { Response, NextFunction } from "express";
import { dbConst } from '../connectionDb/dbconst';
import setupSequelize from '../connectionDb/sequilizeSetup';
dotenv.config();

import jwt, { TokenExpiredError } from "jsonwebtoken";
import { isPermissionChecked } from '../services/rolePermissionCheck';
import { generateResponse } from '../services/response';
import { MyUserRequest } from '../interfaces/commonInterface';
import HttpStatusMessage from '../constant/responseConstant';
import { logoutErrorConstatnt, restrictRoutesDivRegionWise, restrictUrlForChatbot } from '../constant/moduleConstant';
import { comapnyDbAlias } from '../constant';

const additionalFn = async (req: MyUserRequest, res: Response, next: NextFunction, roleType?: any, route?: string) => {

    try {
        function clearCookies() {
            res.clearCookie('token', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            });
        }
        const secretKey: any = process.env.JWT_TOKEN;

        const logoutError: any = logoutErrorConstatnt

        const originalUrl = req.originalUrl;
        const afterNode = originalUrl?.split('/node/')[1];
        

        let token: string | undefined = ""


        const logicAppUrl = ["check-logic-app", "update-bid-import-lane"]


        if (logicAppUrl.includes(afterNode)) {
            token = req.headers?.authorization ?? req.headers?.Authorization
        }
        else {
            token = req.cookies.token
        }
        if (!token) {
            return generateResponse(res, 401, false, "Session expired, please login again!")
        }

        let mainDb: any = await setupSequelize("main")

        const tokenDetail = await mainDb.models.UserToken.findOne({
            where: {
                ut_id: token
            }
        })
        if (!tokenDetail) {
            clearCookies()
            return generateResponse(res, 401, false, "Session expired, please login again!")
        }
        if (tokenDetail?.dataValues?.is_logout) {
            await mainDb.models.UserToken?.destroy({
                where: {
                    ut_id: token
                }
            });
            clearCookies()
            return generateResponse(res, 401, false, logoutError[tokenDetail?.dataValues?.logout_reason])
        }

        const checkToken = tokenDetail?.dataValues?.token
        const decodedToken: any = jwt.verify(checkToken, secretKey);

        checkRegionDivisionAccessRoute({ req, decodedToken, route });

        const isChatbotAccess = decodedToken['data']['chatbot_access'];
        const checkRouteForBot = restrictUrlForChatbot.includes(route || "");

        if (checkRouteForBot && !isChatbotAccess) {
            return generateResponse(res, 400, false, "You don't have access for Chatbot module")
        }

        const permission: boolean = (roleType) ? isPermissionChecked(decodedToken["data"]["permissionsData"], roleType).isChecked : true;

        if (permission) {
            const payload = {
                decodedToken: decodedToken, mainDb: mainDb, next: next, req: req
            }
            return connectDatabase(payload).catch((err: any) => {
                return generateResponse(res, 500, false, "Database is currently down! please contact admistartion")
            })
        }
        else {
            return generateResponse(res, 400, false, "You don't have access for this module")
        }
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            console.log(error, "err")

            return generateResponse(res, 401, false, "Session expired, please login again!")
        } else {
            console.log(error, "err")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR)
        }
    }
}

const jwtMiddleware = (roleType?: string, without_middleware?: any, route?: string) => async (req: MyUserRequest, res: any, next: NextFunction) => {
    if (without_middleware) {
        return next()
    }
    else {
        return additionalFn(req, res, next, roleType, route);
    }
};

const connectDatabase = async (prop: any) => {
    try {

        const { req, next, decodedToken, mainDb } = prop

        const constant: any = dbConst
        let company: string;

        company = decodedToken['data']['companies'][0]?.db_alias;

        let connectDatabase = await dbConnection(company)

        req.connectionData = {
            status: 200,
            [company]: connectDatabase,
            userData: decodedToken['data'],
            main: mainDb,
            company: company,
            schema: constant[company]['schema']
        };
        next()
    }
    catch (err) {
        console.log(err, "err")
        throw err
    }
}
const dbConnection = async (company: string) => {
    try {
        return await setupSequelize(company)
    }
    catch (err) {
        console.log(err, "err")
        throw err
    }
}

const checkRegionDivisionAccessRoute = (prop: any) => {
    try {
        const { req, decodedToken, route } = prop
        const keyName = decodedToken['data']['companies'][0]?.db_alias === comapnyDbAlias.PEP ? "division_id" : "region_id";

        let checkDivisionRegion = req?.body?.[keyName] || req?.query?.[keyName];

        let assignedDivisionRegion = decodedToken["data"]?.[keyName];

        const checkRestrictRoutesDivRegionWise = restrictRoutesDivRegionWise.includes(route || "");

        if (checkRestrictRoutesDivRegionWise && assignedDivisionRegion && assignedDivisionRegion != checkDivisionRegion) {
            req.body[keyName] = assignedDivisionRegion;
            req.query[keyName] = assignedDivisionRegion;
        }
    }
    catch (err) {
        console.log(err, "err")
        throw err
    }
}
export default jwtMiddleware;
