import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import AdmiUserController from "../../../../controller/admin/userManagement/userController";

const mockConnection: any = {
    schema: "test",
    company: comapnyDbAlias?.PEP,
    userData: { id: 2, companies: [{ UserCompany: { company_id: 1 } }] },
    ["main"]: {
        models: {
            UserActivity: {
                findOne: jest.fn<any>().mockResolvedValue({ dataValues: { login_at: "123123213" } }),
                count: jest.fn<any>().mockResolvedValue(22),
            },
            User: {
                findAll: jest.fn<any>().mockResolvedValue([{ id: 1, email: "test@example.com" }]),
            },
        }
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get user login activity ",
    controller: AdmiUserController,
    moduleName: "getUserLoginActivity",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            query: {
                user_id: 1, status: 1
            },
            responseStatus: 200,
            responseMessage: "User login activity retrieved successfully",
        },
        {
            status: false,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            query: {
                user_id: ""
            },
            responseStatus: 400,
            responseMessage: "Missing user_id parameter",
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            query: {
                user_id: 1
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
