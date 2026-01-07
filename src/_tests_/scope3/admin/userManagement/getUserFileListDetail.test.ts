import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import AdmiUserController from "../../../../controller/admin/userManagement/userController";

const mockConnection: any = {
    schema: "test",
    company: comapnyDbAlias?.PEP,
    userData: { id: 2 },
    [comapnyDbAlias.PEP]: {
        models: {
            FileManagement: {
                findAll: jest.fn<any>().mockResolvedValue([{ test: "" }])
            }
        }
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "user file details ",
    controller: AdmiUserController,
    moduleName: "getUserFileListDetail",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: {
                user_id: 1, status: 1
            },
            responseStatus: 200,
            responseMessage: "User detail",
        },
        {
            status: true,
            mockConnection: {
                schema: "test",
                company: comapnyDbAlias?.PEP,
                userData: { id: 2 },
                [comapnyDbAlias.PEP]: {
                    models: {
                        FileManagement: {
                            findAll: jest.fn<any>().mockResolvedValue([])
                        }
                    }
                },
            },
            testName: "should return 200 when no data found of user",
            body: {
                user_id: 1, page_size: 10, page_number: 1
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
