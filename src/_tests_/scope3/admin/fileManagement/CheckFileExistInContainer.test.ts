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


const mockContainerClient = {
    url: "as",
    listBlobsFlat: jest.fn<any>().mockReturnValueOnce([{ name: "axasdsa" }]).mockReturnValueOnce([{ name: "asdasd.xls" }])
};

const mockServiceClient = {
    getContainerClient: jest.fn(() => mockContainerClient)
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "check file exist",
    controller: FileManagementController,
    moduleName: "CheckFileExistInContainer",
    testCases: [
        {
            mockFn: () => (BlobServiceClient.fromConnectionString as jest.Mock).mockReturnValue(mockServiceClient),
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: {
                fileName: "asdasd.xls", folderName: "/sadad/", file_id: 1
            },
            responseStatus: 200,
            responseMessage: "Blob Container Detail",
        },
        {
            mockFn: () => (BlobServiceClient.fromConnectionString as jest.Mock).mockReturnValue(mockServiceClient),
            status: false,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: {
                fileName: "asdasd.xls", folderName: "/", file_id: 1
            },
            responseStatus: 400,
            responseMessage: "File asdasd.xls already exist",
        },
        {
            mockFn: () => (BlobServiceClient.fromConnectionString as jest.Mock).mockReturnValue(mockServiceClient),
            status: false,
            mockConnection: mockConnection,
            testName: "validation error if filename is not exist",
            body: {
                fileName: "", folderName: "sadad/", file_id: 1
            },
            responseStatus: 400,
            responseMessage: "No file found",
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
                            findOne: jest.fn<any>().mockResolvedValue({ base_path: "adasda/asd", save: jest.fn() }),
                            update: jest.fn<any>()
                        },
                        ActivityLog: {
                            create: jest.fn()
                        }
                    }
                },
            },
            testName: "500 error",
            body: {
                fileName: "asd", folderName: "sadad/", file_id: 1
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
jest.mock("../../../../utils", () => ({
    blobMove: jest.fn<any>().mockReturnValue({ status: 200 })
}))

commonTestFile(payload);
