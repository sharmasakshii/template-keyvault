import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import AdmiUserController from "../../../../controller/admin/userManagement/userController";

const mockConnection: any = {
    company: comapnyDbAlias?.PEP,
    userData: { id: 2 },
    [comapnyDbAlias?.PEP]: {
        models: {
            GetUserDetails: {
                findOne: jest.fn<any>().mockResolvedValue({
                    dataValues: { role: 1 }
                }),
            },
            Module: {
                findAll: jest.fn<any>().mockResolvedValue([{ title: "fghj", id: 1, parent_id: 1, slug: "dadas" }])
            },
            RoleAccess: {
                findAll: jest.fn<any>().mockResolvedValue([{ module_id: 1 }])
            },
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get user data by id",
    controller: AdmiUserController,
    moduleName: "getUserDetailById",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: {
                user_id: 1
            },
            responseStatus: 200,
            responseMessage: "User detail",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                userData: { id: 2 },
                [comapnyDbAlias?.PEP]: {
                    models: {
                        GetUserDetails: {
                            findOne: jest.fn<any>().mockResolvedValue(null),
                        },
                    },
                },
            },
            testName: "should return 200 when no data found of user",
            body: {
                user_id: 1
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: {
                user_id: 1
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
