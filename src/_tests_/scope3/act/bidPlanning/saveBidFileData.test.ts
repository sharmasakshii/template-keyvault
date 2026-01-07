import { jest } from "@jest/globals";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import BidPlanningController from "../../../../controller/scope3/act/bidPlanningController";
import { Readable } from "stream";

const createMockStream = (content:any) => {
    const stream = new Readable();
    stream.push(content);
    stream.push(null); // End the stream
    return stream;
};

// Mock blob functions and utilities
jest.mock("../../../../BlobService/helper", () => ({
    blobConnection: jest.fn<any>().mockResolvedValue({
        containerClient: {
            getBlobClient: jest.fn(() => ({
                download: jest.fn<any>().mockResolvedValue({
                    readableStreamBody: createMockStream("mocked file content"), // You can return a mock stream if needed
                    _response: { status: 200 },
                  })
            })),
        },
    }),
}));
jest.mock("../../../../utils", () => ({
    saveErrorOfBidPlanning: jest.fn(),
    chunkToSize: jest.fn<any>().mockReturnValue([{ "any": "blabl" }]),
    parseExcelTabsToJSON: jest.fn<any>().mockResolvedValue([{ sheetName: "Sheet1", data: [{ key: "value" }] }]), // Mocked return value
    parseTabsData: jest.fn().mockReturnValue([{ column1: "value1", column2: "value2" }]),
    chunkArray: jest.fn().mockReturnValue([
        [{ column1: "value1", column2: "value2" }], // Mocked chunk
        [{ column1: "value3", column2: "value4" }]
    ]),
    
}));

jest.mock("../../../../services/commonServices", () => ({
    getTotalNewLanes: jest.fn<any>().mockResolvedValue([
        { dataValues: { lane_name: "NewYork_LosAngeles" } },
        { dataValues: { lane_name: "Chicago_Houston" } }
    ]),
}));

// Mock database connection
const mockConnection: any = {
    company: comapnyDbAlias?.PEP,
    userData: { id: 1, companies: [{ slug: "test-company" }] },
    [comapnyDbAlias?.PEP]: {
        models: {
            BidManagement: {
                create: jest.fn<any>().mockResolvedValue({ dataValues: { id: 123 } }),
            },
            BidImport: {
                bulkCreate: jest.fn<any>().mockResolvedValue(true),
            },
            BidLanes: {
                bulkCreate: jest.fn<any>().mockResolvedValue(true),
            },
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Save Bid File Data",
    controller: BidPlanningController,
    moduleName: "saveBidFileData",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when bid file data is saved successfully",
            body: {
                name: "test.xlsx",
                base_path: "/",
                statusId: 1,
                type: "success",
            },
            responseStatus: 200,
            responseMessage: "File uploaded successfully",
        },
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when bid file data is saved successfully when error occured",
            body: {
                name: "test.xlsx",
                base_path: "/",
                statusId: 1,
                type: "error",
                error_message:"sdfsdf"
            },
            responseStatus: 200,
            responseMessage: "File saved successfully bid management",
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return 400 when request body is invalid",
            body: {},
            responseStatus: 400,
            responseMessage: "Invalid request body",
        },
        {
            status: false,
            mockConnection: mockConnection,
            testName: "should return 400 when file format is unsupported",
            body: {
                name: "test.txt",
                base_path: "/",
                statusId: 1,
                type: "success",
            },
            responseStatus: 400,
            responseMessage: "Unsupported file format",
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                userData: { id: 1, companies: [{ slug: "test-company" }] },
                [comapnyDbAlias?.PEP]: {
                    models: {
                        BidImport: {
                            bulkCreate: jest.fn<any>().mockResolvedValue(true),
                        },
                        BidLanes: {
                            bulkCreate: jest.fn<any>().mockResolvedValue(true),
                        },
                    },
                },
            },
            testName: "should return 500 when an error occurs while saving bid file",
            body: {
                name: "test.xlsx",
                base_path: "/",
                statusId: 1,
                type: "error",
                error_message: "File parsing error",
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
