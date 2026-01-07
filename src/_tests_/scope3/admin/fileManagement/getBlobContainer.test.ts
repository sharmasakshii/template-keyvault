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
                update: jest.fn<any>(),
                findAndCountAll: jest.fn<any>().mockResolvedValue({ rows: [{ test: "2" }], count: 1 }),
                count: jest.fn<any>().mockResolvedValue(22),
            }
        }
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get blob detail ",
    controller: FileManagementController,
    moduleName: "getBlobContainer",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: {
                folder_path: "", page_size: 10, page: 1, status: 1, file_management_id: 1
            },
            responseStatus: 200,
            responseMessage: "Successfully listed blobs for container pepsi-container",
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
                            update: jest.fn<any>(),
                            findAndCountAll: jest.fn<any>().mockResolvedValue([]),
                            count: jest.fn<any>().mockResolvedValue(22),
                        }
                    }
                },
            },
            testName: "should return 200 when success",
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
