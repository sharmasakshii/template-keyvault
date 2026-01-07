import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import { commonTestFile } from "../../commonTest";
import FileManagementController from "../../../../controller/admin/fileManagement/fileManagementController";
import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import HttpStatusMessage from "../../../../constant/responseConstant";


const mockConnection: any = {
    schema: "test",
    company: comapnyDbAlias?.PEP,
    userData: { id: 2 },
    [comapnyDbAlias.PEP]: {
        models: {
            FileManagement: {
                findOne: jest.fn<any>().mockResolvedValue({ update: jest.fn(), dataValues: { status_id: 2 } }),
                update: jest.fn()
            },
            ActivityLog: {
                create: jest.fn()
            }
        }
    },
};


const existsMock = jest.fn<any>().mockReturnValueOnce(true).mockReturnValueOnce(false).mockReturnValueOnce(true).mockReturnValueOnce(true);

const mockBlobClient = {
    exists: existsMock,
    getBlobClient: jest.fn()
};

const mockContainerClient = {
    getBlockBlobClient: jest.fn(() => mockBlobClient)
};

const mockServiceClient = {
    getContainerClient: jest.fn(() => mockContainerClient)
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "download file of blob ",
    controller: FileManagementController,
    moduleName: "DownloadFileBlob",
    testCases: [
        {
            mockFn: () => (BlobServiceClient.fromConnectionString as jest.Mock).mockReturnValue(mockServiceClient),
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: {
                file_management_id: 1, fileName: "test.xls", downloadPath: "test", folderPath: "ajgd", status: 1
            },
            responseStatus: 200,
            responseMessage: "Return Sas Token for download the  file",
        },
        {
            mockFn: () => (BlobServiceClient.fromConnectionString as jest.Mock).mockReturnValue(mockServiceClient),
            status: false,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: {
                file_management_id: 1, fileName: "test.xls", downloadPath: "test", folderPath: "ajgd", status: 1
            },
            responseStatus: 400,
            responseMessage: "This file has been deleted or moved to another folder. Please refresh the page.",
        },
        {
            status: false,
            mockConnection: {
                schema: "test",
                company: comapnyDbAlias?.PEP,
                userData: { id: 2 },
                [comapnyDbAlias.PEP]: {
                    models: {
                        FileManagement: {
                            findOnes: jest.fn<any>().mockResolvedValue({ update: jest.fn(), dataValues: { status_id: 2 } }),
                            update: jest.fn()
                        },
                        ActivityLog: {
                            create: jest.fn()
                        }
                    }
                },
            },
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: {
                file_management_id: 1, fileName: "test.xls", downloadPath: "test", folderPath: "ajgd", status: 1
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

jest.mock('@azure/storage-blob', () => ({
    BlobServiceClient: {
        fromConnectionString: jest.fn()
    },
    StorageSharedKeyCredential: jest.fn(),
    ContainerSASPermissions: {
        parse: jest.fn().mockReturnValue({
        }),
    },
    generateBlobSASQueryParameters: jest.fn().mockReturnValue({
        toString: jest.fn().mockReturnValue('mocked-sas-token')
    }),
}));

commonTestFile(payload);
