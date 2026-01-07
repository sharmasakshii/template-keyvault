import { jest } from "@jest/globals";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import BidPlanningController from "../../../../controller/scope3/act/bidPlanningController";
import { BlobServiceClient } from "@azure/storage-blob";



const mockConnection: any = {
    company: comapnyDbAlias.PEP,
    userData: { id: 1, companies: [{ slug: "test-company" }] },
    [comapnyDbAlias.PEP]: {
        query: jest.fn<any>().mockResolvedValue([]),
        QueryTypes: { Select: jest.fn() },
        models: {
            BidImport: {
                findAll: jest.fn<any>().mockResolvedValue([{
                    "lane_name": "adsadasd_asdsdasda",
                    "scac": "SSSS",
                    "rpm": 223,
                    "distance": 21123,
                    "intensity": 23213,
                    "emissions": 2112,
                    "cost_impact": 12,
                    "emission_impact": 212,
                    "tab_name": "22",
                    "fuel_type": "cng"
                }])
            },
            BidProcessing: {
                update: jest.fn()
            }
        },
    },
};
const mockBlobClient = {
    uploadData: jest.fn()
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
    describeName: "Blob download",
    controller: BidPlanningController,
    moduleName: "createBlobForDownload",
    testCases: [
        {
            mockFn: () => (BlobServiceClient.fromConnectionString as jest.Mock).mockReturnValue(mockServiceClient),
            status: true,
            mockConnection,
            testName: "should return 200 and download  file successfully",
            body: {
                name: "dfghjkl", file_id: 1
            },
            responseStatus: 200,
            responseMessage: "File Uploaded Successfully.",
        },
        {
            mockFn: () => (BlobServiceClient.fromConnectionString as jest.Mock).mockReturnValue(mockServiceClient),
            status: false,
            mockConnection,
            testName: "validation error ",
            body: {
                name: "", file_id: 1
            },
            responseStatus: 400,
            responseMessage: "Validation Errors!",
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when connection is undefined",
            body: {
                name: "dfghjkl", file_id: 1
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ]
};

jest.mock('@azure/storage-blob', () => ({
    BlobServiceClient: {
        fromConnectionString: jest.fn()
    },
    StorageSharedKeyCredential: jest.fn(),

}));
const worksheetMock = {
    cell: jest.fn(() => ({
        string: jest.fn(() => ({
            style: jest.fn()
        })),
        number: jest.fn(),

        style: jest.fn()
    })),
    row: jest.fn(() => ({
        setHeight: jest.fn()
    })),
    addRow: jest.fn(),
    addImage: jest.fn()
};
jest.mock('excel4node', () => ({
    Workbook: jest.fn().mockImplementation(() => ({
        addWorksheet: jest.fn(() => (worksheetMock)),
        createStyle: jest.fn(() => ({})),
        write: jest.fn(),
        writeToBuffer: jest.fn()
    }))

}
));
commonTestFile(payload);
