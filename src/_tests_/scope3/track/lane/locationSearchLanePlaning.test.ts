import { jest } from "@jest/globals";
import { commonTestFile } from "../../commonTest";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { comapnyDbAlias } from "../../../../constant";
import LaneController from "../../../../controller/scope3/track/lane/laneController";

// Mocking callStoredProcedure function
const mockCallStoredProcedure = jest.fn<any>().mockResolvedValue([]);

// Mocked connection for testing
const mockConnection = {
    userData: { division_id: 1 },
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            Emission: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { origin: 'VACAVILLE, CA, 95688' },
                    { origin: 'VAL DOR, QC, J9P6Y2' }
                ])
            },
        },
        query: mockCallStoredProcedure,
        QueryTypes: { Select: jest.fn() },
    },
};

// Sample payload for test cases
const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Carrier Search Lane Planning Test",
    controller: LaneController,
    moduleName: "locationSearchLanePlaning",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return a 200 status code and data if stored procedure executes successfully",
            body: {
                keyword: "lane",
                page_limit: "10",
                type: "someType",
                source: "NY",
                dest: "CA"
            },
            responseStatus: 200,
            responseMessage: "Lane Planing data",
            mockCallStoredProcedureReturnValue: [
                { lane_name: "Lane 1", emission: 0.5 },
                { lane_name: "Lane 2", emission: 0.7 }
            ],
            mockCallStoredProcedureTotalCount: 2
        }, 
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 status and fetch lanes using findAll when stored procedure does not execute",
            body: {
                keyword: "",
                page_limit: "10",
                type: "someType",
                source: "",
                dest: ""
            },
            responseStatus: 200,
            responseMessage: "Lane Planing data",
            mockFindAllReturnValue: [
                { lane_name: "Lane 3", emission: 0.8 }
            ],
            mockFindAllTotalCount: 1
        },
        {
            status: false,
            mockConnection: mockConnection,
            testName: "should return 500 error if an exception occurs",
            body: {},
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,

        },
    ]
};

// Modify the commonTestFile function to accept mockCallStoredProcedure
commonTestFile(
    payload,

);
