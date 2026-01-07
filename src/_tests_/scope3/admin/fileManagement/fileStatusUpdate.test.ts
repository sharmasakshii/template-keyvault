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
            FileManagement: {
                findOne: jest.fn<any>().mockResolvedValue({ update: jest.fn(), dataValues: { status_id: 2 } }),
            },
            ActivityLog: {
                create: jest.fn()
            },
            FileStatus: {
                findOne: jest.fn<any>().mockResolvedValue({ update: jest.fn(), dataValues: { status_id: 2 } }),
            },
        }
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "file folder status update ",
    controller: FileManagementController,
    moduleName: "statusUpdate",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: {
                status: 1, file_management_id: 1, folderPath: "badasd", fileName: "test.xls"
            },
            responseStatus: 200,
            responseMessage: "Status updated succesfully",
        },
        {
            status: false,
            mockConnection: {
                schema: "test",
                company: comapnyDbAlias?.PEP,
                userData: { id: 2 },
                [comapnyDbAlias.PEP]: {
                    models: {
                        FileStatus: {
                            findOne: jest.fn<any>().mockResolvedValue(null),
                        },
                    }
                },
            },
            testName: "invalid payload",
            body: {
                status: 15, file_management_id: 1, folderPath: "badasd", fileName: "test.xls"
            },
            responseStatus: 400,
            responseMessage: "Invalid payload",
        },
        {
            status: true,
            mockConnection: mockConnection,
            testName: "when folder in folder ",
            body: {
                status: 1, file_management_id: 1, folderPath: "badasd/asdasd", fileName: "test.xls"
            },
            responseStatus: 200,
            responseMessage: "Status updated succesfully",
        },
        {
            status: true,
            mockConnection: mockConnection,
            testName: "when folder in folder ",
            body: {
                status: 1, file_management_id: 1, folderPath: "badasd/asdasd", fileName: ""
            },
            responseStatus: 200,
            responseMessage: "Status updated succesfully",
        },
        {
            status: false,
            mockConnection: {
                schema: "test",
                company: comapnyDbAlias?.PEP,
                userData: { id: 2 },
                [comapnyDbAlias.PEP]: {
                    models: {
                        FileStatus: {
                            findOne: jest.fn<any>().mockResolvedValue({ 1: 1 }),
                        },
                    }
                },
            },
            testName: "validation error ",
            body: {
                status: 1, file_management_id: 1, folderPath: "", fileName: ""
            },
            responseStatus: 400,
            responseMessage: "Please add file name and folder name",
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: {
                status: 1, file_management_id: 1, folderPath: "", fileName: "test.xls"
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
