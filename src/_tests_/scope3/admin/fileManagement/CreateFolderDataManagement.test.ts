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
                findOne: jest.fn<any>().mockResolvedValue({ update: jest.fn(), dataValues: { status_id: 2 } }),
            },
            ActivityLog: {
                create: jest.fn()
            }
        }
    },
};


const existsMock = jest.fn<any>().mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValueOnce(true);

const mockBlobClient = {
    exists: existsMock,
    upload: jest.fn()
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
    describeName: "Create folder ",
    controller: FileManagementController,
    moduleName: "CreateFolderDataManagement",
    testCases: [
        {
            mockFn: () => (BlobServiceClient.fromConnectionString as jest.Mock).mockReturnValue(mockServiceClient),
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: {
                folderPath: "/", folderName: "test", fileManagementId: 1
            },
            responseStatus: 200,
            responseMessage: "Folder created successfully ",
        },

        {
            mockFn: () => (BlobServiceClient.fromConnectionString as jest.Mock).mockReturnValue(mockServiceClient),
            status: true,
            mockConnection: {
                schema: "test",
                company: comapnyDbAlias?.PEP,
                userData: { id: 2 },
                [comapnyDbAlias.PEP]: {
                    models: {
                        FileManagement: {
                            findOne: jest.fn<any>().mockResolvedValue(null),
                            create: jest.fn()
                        },
                        ActivityLog: {
                            create: jest.fn()
                        }
                    }
                },
            },
            testName: "should return 200 when success file management id not exist",
            body: {
                folderPath: "/", folderName: "test", fileManagementId: ""
            },
            responseStatus: 200,
            responseMessage: "Folder created successfully ",
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
                            creates: jest.fn()
                        },
                        ActivityLog: {
                            create: jest.fn()
                        }
                    }
                },
            },
            testName: "when child function give err",
            body: {
                folderPath: "/", folderName: "test", fileManagementId: ""
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
        {
            mockFn: () => (BlobServiceClient.fromConnectionString as jest.Mock).mockReturnValue(mockServiceClient),
            status: false,
            mockConnection: mockConnection,
            testName: "if folder already exist",
            body: {
                folderPath: "dcd", folderName: "test", fileManagementId: 1
            },
            responseStatus: 400,
            responseMessage: "Folder name already exist!",
        },
        {
            mockFn: () => (BlobServiceClient.fromConnectionString as jest.Mock).mockReturnValue(mockServiceClient),
            status: false,
            mockConnection: mockConnection,
            testName: "if folder name not valid",
            body: {
                folderPath: "/", folderName: "test/?#sd1`1./", fileManagementId: 1
            },
            responseStatus: 400,
            responseMessage: "Invalid folder name. Special characters are not allowed.",
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
                        },
                        ActivityLog: {
                            create: jest.fn()
                        }
                    }
                },
            },
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: {
                folderPath: "/", folderName: "test", fileManagementId: 1
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

jest.mock('@azure/storage-blob', () => ({
    BlobServiceClient: {
        fromConnectionString: jest.fn()
    }
}));

commonTestFile(payload);
