import { Op } from "sequelize";
import HttpStatusMessage from "../constant/responseConstant";
import { encryptPassword, validatePassword, validator } from "./commonServices";
import { decryptDataFunction } from "./encryptResponseFunction";
import { generateResponse } from "./response";
import bcrypt = require("bcrypt");
import { validationConstant } from "../constant";

export const updateUserPassword = async (prop: any) => {
    let { res, old_password, new_password, user_id, req, encryptedProfileData, userEncryptedData, message, company, getUser } = prop
    try {
        new_password = decryptDataFunction(new_password);
        let validation = await validator({
            new_p: new_password,
            old_p: old_password
        }, {
            new_p: `${validationConstant.Required}`,
            old_p: validationConstant.Required
        }
        );

        if (validation.status) {
            return generateResponse(res, 400, false, 'Validation Errors!', validation);
        }

        if (!validatePassword(new_password)) {
            return generateResponse(res, 400, false, "Invalid password format");
        }
        const loggenInUser = user_id;

        let UserLog: any = await req?.models.UserPasswordLog.findAll({
            where: { [Op.and]: [{ user_id: loggenInUser }] },
            limit: 5,
            order: [['created_at', 'DESC']],
        });

        const payload = {
            res: res,
            UserLog: UserLog, new_password: new_password, getUser: getUser, userEncryptedData: userEncryptedData, encryptedProfileData: encryptedProfileData, req: req, user_id: user_id, loggenInUser: loggenInUser, company: company, message: message
        }
        return checkUserPwdAndUpdatePwdFn(payload)

    } catch (error) {
        console.log("error", error)
        return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
}


const checkUserPwdAndUpdatePwdFn = async (prop: any) => {
    try {
        const { res, UserLog, new_password, userEncryptedData, encryptedProfileData, req, user_id, loggenInUser, message } = prop
        let runQuery: boolean = false
        if (UserLog?.length > 0) {
            for (const data of UserLog) {
                const oldPasswordMatch = await bcrypt.compare(new_password, data.old_password);
                if (oldPasswordMatch) {
                    return generateResponse(res, 400, false, 'Your new password must be different from your previous password.')
                }
                else {
                    runQuery = true
                }
            }
        }
        else {
            runQuery = true
        }
        if (runQuery) {
            let generateHash = await encryptPassword(new_password);
            await req.models.User.update(
                {
                    password: generateHash,
                    ...userEncryptedData
                }, { where: { id: user_id } })

            await req.models.Profile.update(encryptedProfileData, { where: { user_id: user_id } })

            await req.models.UserPasswordLog.create({
                user_id: loggenInUser,
                old_password: generateHash
            });
            return generateResponse(res, 200, true, message);
        }
    }
    catch (err) {
        console.log(err, "err")
        throw err
    }
}

