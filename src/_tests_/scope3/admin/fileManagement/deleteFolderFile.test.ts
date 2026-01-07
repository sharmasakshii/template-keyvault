import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import { commonTestFile } from "../../commonTest";
import FileManagementController from "../../../../controller/admin/fileManagement/fileManagementController";
import { BlobServiceClient } from "@azure/storage-blob";
import HttpStatusMessage from "../../../../constant/responseConstant";


const mockConnection: any = {
    schema: "test",
    company: comapnyDbAlias?.PEP,
    userData: { id: 2 },
    [comapnyDbAlias.PEP]: {
        models: {
            FileManagement: {
                update: jest.fn<any>()
            },
            ActivityLog: {
                create: jest.fn()
            }
        }
    },
};


const existsMock = jest.fn<any>().mockReturnValueOnce(true).mockReturnValueOnce(true)

const mockBlobClient = {
    exists: existsMock,
    delete: jest.fn()
};

const mockContainerClient = {
    getBlobClient: jest.fn(() => mockBlobClient)
};

const mockServiceClient = {
    getContainerClient: jest.fn(() => mockContainerClient)
};


const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "delete file ",
    controller: FileManagementController,
    moduleName: "deleteFolderFile",
    testCases: [
        {
            mockFn: () => (BlobServiceClient.fromConnectionString as jest.Mock).mockReturnValue(mockServiceClient),
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: {
                file_id: [{ name: "asdd/asdsd", base_path: "/", id: 1 },

                ]
            },
            responseStatus: 200,
            responseMessage: "Files deleted successfully.",
        },

        {
            mockFn: () => (BlobServiceClient.fromConnectionString as jest.Mock).mockReturnValue(mockServiceClient),
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: {
                file_id: [{ name: "asdd/asdsd", base_path: "testt", id: "" },

                ]
            },
            responseStatus: 200,
            responseMessage: "Files deleted successfully.",
        },
        {
            mockFn: () => (BlobServiceClient.fromConnectionString as jest.Mock).mockReturnValue(mockServiceClient),
            status: false,
            mockConnection: mockConnection,
            testName: "validation error if exist",
            body: {
                file_id: [{ name: "asdd/asdsd", base_path: "testt", id: 1 },

                ]
            },
            responseStatus: 400,
            responseMessage: "This file has been deleted or moved to another folder. Please refresh the page.",
        },
        {
            mockFn: () => (BlobServiceClient.fromConnectionString as jest.Mock).mockReturnValue(mockServiceClient),
            status: false,
            mockConnection: {
                schema: "test",
                company: comapnyDbAlias?.PEP,
                userData: { id: 2 },
                [comapnyDbAlias.PEP]: {
                    models: {
                        FileManagements: {
                            update: jest.fn<any>()
                        },
                        ActivityLog: {
                            create: jest.fn()
                        }
                    }
                },
            },
            testName: "validation error if exist",
            body: {
                file_id: [{ name: "asdd/asdsd", base_path: "testt", id: 1 },
                ]
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        }
    ],
};

jest.mock('@azure/storage-blob', () => ({
    BlobServiceClient: {
        fromConnectionString: jest.fn()
    }
}));
jest.mock("../../../../utils", () => ({
    blobMove: jest.fn<any>().mockReturnValue({ status: 200 })
}))

commonTestFile(payload);
