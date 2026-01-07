import { jest } from "@jest/globals";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import BidPlanningController from "../../../../controller/scope3/act/bidPlanningController";

jest.mock("@azure/storage-blob", () => ({
    BlobServiceClient: {
        fromConnectionString: jest.fn(() => ({
            getContainerClient: jest.fn(() => ({
                getBlockBlobClient: jest.fn(() => ({
                    uploadData: jest.fn<any>().mockResolvedValue(true)
                }))
            }))
        }))
    }
}));

const mockBidData = [
    {
        lane_name: "Chicago,IL_New York,NY",
        scac: "SCAC1",
        rpm: 3.5,
        row_number: 1,
        distance: 120,
        intensity: 0.9,
        emissions: 10,
        cost_impact: 100,
        emission_impact: 5,
        tab_name: "sheet1",
        fuel_type: "diesel",
        error_message: "Invalid SCAC"
    }
];

const mockConnection: any = {
    company: comapnyDbAlias.PEP,
    userData: { id: 1, companies: [{ slug: "test-company" }] },
    [comapnyDbAlias.PEP]: {
        models: {
            BidImport: {
                findAll: jest.fn<any>().mockResolvedValue(mockBidData),
            }
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Download Bid Error Data",
    controller: BidPlanningController,
    moduleName: "downloadBidErrorData",
    testCases: [
        {
            status: true,
            mockConnection,
            testName: "should return 200 and download error file successfully",
            body: {
                file_id: 3,
                file_name: "error_data.xlsx"
            },
            responseStatus: 200,
            responseMessage: "File downloaded Successfully.",
            headers: { authorization: "Bearer XXXXXX" },
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when connection is undefined",
            body: {
                file_id: 3,
                file_name: "error_data.xlsx"
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
        {
            status: true,
            mockConnection,
            testName: "should return 422 when file_id is missing",
            body: {
                file_name: "error_data.xlsx"
            },
            responseStatus: 422,
            responseMessage: "File not specified!",
        }
    ]
};

commonTestFile(payload);
