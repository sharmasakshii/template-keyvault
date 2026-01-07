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
            FileStatus: {
                findAll: jest.fn<any>().mockResolvedValue([{ test: "" }]),
            }
        }
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get filemanagement list ",
    controller: FileManagementController,
    moduleName: "FileManagementStatusList",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: {

            },
            responseStatus: 200,
            responseMessage: "File Management Status List",
        },
        {
            status: true,
            mockConnection: {
                schema: "test",
                company: comapnyDbAlias?.PEP,
                userData: { id: 2 },
                [comapnyDbAlias.PEP]: {
                    models: {
                        FileStatus: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        }
                    }
                },
            },
            testName: "should return 200 when success no data found",
            body: {
                folder_path: "/", page_size: 10, page: 1, status: 1, file_management_id: 1
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
