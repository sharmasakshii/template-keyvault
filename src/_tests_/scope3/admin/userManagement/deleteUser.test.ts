import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import AdmiUserController from "../../../../controller/admin/userManagement/userController";

const mockConnection: any = {
    company: comapnyDbAlias?.PEP,
       userData: { id: 2, companies: [{ UserCompany: { company_id: 1 } }] },
    ["main"]: {
        models: {
            User: {
                update: jest.fn<any>()
            },
            UserToken: {
                update: jest.fn<any>()
            },
            UserCompany: {
                findAll: jest.fn<any>().mockResolvedValue([1])
            }
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Delete user ",
    controller: AdmiUserController,
    moduleName: "deleteUser",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: {
                user_id: [1]
            },
            responseStatus: 200,
            responseMessage: "User deleted successfully",
        },

        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: {
                user_id: [1]
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
