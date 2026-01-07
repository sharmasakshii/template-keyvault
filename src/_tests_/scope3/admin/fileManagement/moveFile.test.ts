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
                findOne: jest.fn<any>().mockResolvedValue({ base_path: "adasda/asd", save: jest.fn() }),
                update: jest.fn<any>()
            },
            ActivityLog: {
                create: jest.fn()
            }
        }
    },
};


const existsMock = jest.fn<any>().mockReturnValueOnce(true).mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(false).mockReturnValueOnce(true).mockReturnValueOnce(false)

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
    describeName: "Move file ",
    controller: FileManagementController,
    moduleName: "moveFile",
    testCases: [
        {
            mockFn: () => (BlobServiceClient.fromConnectionString as jest.Mock).mockReturnValue(mockServiceClient),
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: {
                move_to: "/asdsda", move_from: "dasdsa/sdsa", fileName: "asdas.xls", file_id: 1
            },
            responseStatus: 200,
            responseMessage: "File Moved Successfully.",
        },
        {
            mockFn: () => (BlobServiceClient.fromConnectionString as jest.Mock).mockReturnValue(mockServiceClient),
            status: false,
            mockConnection: mockConnection,
            testName: "file not exist ",
            body: {
                move_to: "folder/subfolder/", move_from: "dasdsa/sdsa", fileName: "asdas.xls", file_id: 1
            },
            responseStatus: 400,
            responseMessage: "This file has been deleted or moved to another folder. Please refresh the page.",
        },
        {
            mockFn: () => (BlobServiceClient.fromConnectionString as jest.Mock).mockReturnValue(mockServiceClient),
            status: false,
            mockConnection: mockConnection,
            testName: "file not exist ",
            body: {
                move_to: "asdsda/", move_from: "dasdsa/sdsa", fileName: "asdas.xls", file_id: 1
            },
            responseStatus: 400,
            responseMessage: "File already exist on destination!",
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
                        FileManagement: {
                            findOne: jest.fn<any>().mockResolvedValue(null),
                            update: jest.fn<any>()
                        },
                        ActivityLog: {
                            create: jest.fn()
                        }
                    }
                },
            },
            testName: "file not found ",
            body: {
                move_to: "", move_from: "", fileName: "asdas.xls", file_id: 1
            },
            responseStatus: 400,
            responseMessage: "File Not Found!",
        },
        {
            mockFn: () => (BlobServiceClient.fromConnectionString as jest.Mock).mockReturnValue(mockServiceClient),
            status: false,
            mockConnection:{
                schema: "test",
                company: comapnyDbAlias?.PEP,
                userData: { id: 2 },
                [comapnyDbAlias.PEP]: {
                    models: {
                        FileManagements: {
                            findOne: jest.fn<any>().mockResolvedValue(null),
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
                move_to: "/asdasd", move_from: "", fileName: "asdas.xls", file_id: 1
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
