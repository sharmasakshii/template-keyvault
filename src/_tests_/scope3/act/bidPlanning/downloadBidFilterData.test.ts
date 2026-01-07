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

jest.mock("../../../../utils", () => ({
    createBufferSingle: jest.fn<any>().mockResolvedValue(Buffer.from("test")),
    whereClauseFn: jest.fn(() => ({
        [Symbol.for("sequelize.and")]: []
    })),
}));

const mockBidData = [
    {
        lane_name: "LANE1",
        scac: "SCAC1",
        rpm: 3.5,
        distance: 120,
        intensity: 0.9,
        emissions: 10,
        cost_impact: 100,
        emission_impact: 5,
        tab_name: "sheet1",
        fuel_type: "diesel"
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
    describeName: "Download Bid Filter Data",
    controller: BidPlanningController,
    moduleName: "downloadBidFilterData",
    testCases: [
        {
            status: true,
            mockConnection,
            testName: "should return 200 and upload file successfully",
            body: {
                file_id: 3,
                file_name: "test.xlsx",
                scac: "SCAC1",
                origin: "ORIGIN",
                dest: "DEST"
            },
            responseStatus: 200,
            responseMessage: "File Uploaded Successfully.",
            headers: { authorization: "Bearer XXXXXX" },
        },
        {
            status: true,
            mockConnection,
            testName: "should return 200 and upload file successfully, But without destination",
            body: {
                file_id: 3,
                file_name: "test.xlsx",
                scac: "SCAC1",
                origin: "ORIGIN"
            },
            responseStatus: 200,
            responseMessage: "File Uploaded Successfully.",
            headers: { authorization: "Bearer XXXXXX" },
        },
        {
            status: true,
            mockConnection,
            testName: "should return 200 and upload file successfully, But without origin",
            body: {
                file_id: 3,
                file_name: "test.xlsx",
                scac: "SCAC1",
                dest: "ORIGIN"
            },
            responseStatus: 200,
            responseMessage: "File Uploaded Successfully.",
            headers: { authorization: "Bearer XXXXXX" },
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when exception occurs",
            body: {
                file_id: 3,
                file_name: "test.xlsx"
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
        {
            status: true,
            mockConnection,
            testName: "should return 422 when file_id is missing",
            body: {
                file_name: "test.xlsx"
            },
            responseStatus: 422,
            responseMessage: "File not specified!",
        }
    ]
};

commonTestFile(payload);
