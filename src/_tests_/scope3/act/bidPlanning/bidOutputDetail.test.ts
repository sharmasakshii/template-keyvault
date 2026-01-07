import { jest } from "@jest/globals";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import BidPlanningController from "../../../../controller/scope3/act/bidPlanningController";

const mockConnection: any = {
    company: comapnyDbAlias?.PEP,
    schema: "green_sight",
    userData: { id: 1 },
    [comapnyDbAlias?.PEP]: {
        QueryTypes: { Select: jest.fn() },
        query: jest.fn<any>().mockResolvedValue([[
            { emission_impact: 150, cost_impact: 5000 }
        ],"dd"]),
        models: {
            BidImport: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { lane_name: "Lane 1", fuel_type: "B20", emission_impact: 50  },
                    { lane_name: "Lane 2", fuel_type: "EV", emission_impact: 30 }
                ]),
            },
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Bid Output Detail",
    controller: BidPlanningController,
    moduleName: "bidOutputDetail",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when bid output details are fetched successfully",
            body: { file_id: 123, file_name: "test_file" },
            responseStatus: 200,
            responseMessage: "Bid details fetched.",
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                schema: "green_sight",
                userData: { id: 1 },
                [comapnyDbAlias?.PEP]: {
                    QueryTypes: { Select: jest.fn() },
                    query: jest.fn<any>().mockResolvedValue([
                        { emission_impact: 150, cost_impact: 5000 }
                    ]),
                    models: {
                        BidImport: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { lane_name: "Lane 1", fuel_type: "B20", emission_impact: 50  },
                                { lane_name: "Lane 2", fuel_type: "EV", emission_impact: 30 }
                            ]),
                        },
                    },
                },
            },
            testName: "should return 500 when bid output details are calculation fails.",
            body: { file_id: 123, file_name: "test_file" },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
        {
            status: true,
            mockConnection: {
                ...mockConnection,
                [comapnyDbAlias?.PEP]: {
                    ...mockConnection[comapnyDbAlias?.PEP],
                    query: jest.fn<any>().mockResolvedValue([]),
                },
            },
            testName: "should return NOT_FOUND when no bid output details are found",
            body: { file_id: 123, file_name: "test_file" },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: { file_id: 123, file_name: "test_file" },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
