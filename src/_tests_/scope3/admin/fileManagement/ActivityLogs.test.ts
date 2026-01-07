import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import FileManagementController from "../../../../controller/admin/fileManagement/fileManagementController";

const mockConnection: any = {
    schema: "test",
    company: comapnyDbAlias?.PEP,
    userData: { id: 2 },
    [comapnyDbAlias.PEP]: {
        models: {
            ActivityLog: {
                findAll: jest.fn<any>().mockResolvedValue([{ name: "sadsad/asdsad", base_path: "" }]),
            }
        }
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get activity logs ",
    controller: FileManagementController,
    moduleName: "ActivityLogs",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: {file_management_id:1
            },
            responseStatus: 200,
            responseMessage: "Activity logs of a particular file or folder",
        },
       
        {
            status: false,
            mockConnection: {
                schema: "test",
                company: comapnyDbAlias?.PEP,
                userData: { id: 2 },
                [comapnyDbAlias.PEP]: {
                    models: {
                        ActivityLog: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        }
                    }
                },
            },
            testName: "should return 200 when success no data found",
            body: {
                file_management_id:1
            },
            responseStatus: 400,
            responseMessage: "This file has been deleted or moved to another folder. Please refresh the page.",
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
