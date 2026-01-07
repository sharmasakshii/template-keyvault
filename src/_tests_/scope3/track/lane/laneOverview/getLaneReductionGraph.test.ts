import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../../constant";
import HttpStatusMessage from "../../../../../constant/responseConstant";
import { commonTestFile } from "../../../commonTest";
import LaneOverviewController from "../../../../../controller/scope3/track/lane/laneOverviewController";

const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            Emission: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: {
                            quarter: 1,
                            year: 2024,
                            carrier_name: "Carrier 1",
                            intensity: 0.5,
                            emissions: 234567,
                            emission: 1000,
                            shipment_count: 200,
                        }
                    },
                    {
                        dataValues:
                        {
                            quarter: 2,
                            year: 2024,
                            carrier_name: "Carrier 2",
                            intensity: 0.6,
                            emission: 1200,
                            emissions: 23456788,
                            shipment_count: 220,
                        }
                    },
                ]),
                findOne: jest.fn<any>().mockResolvedValue(
                    {
                        dataValues: {
                            quarter: 1,
                            year: 2024,
                            carrier_name: "Carrier 1",
                            intensity: 0.5,
                            emissions: 234567,
                            emission: 1000,
                            shipment_count: 200,
                        }
                    },
                ),
            },

            ConfigConstants: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { config_key: "EMISSION_REDUCTION_TARGET_1_YEAR", config_value: 1221 },
                    { config_key: "EMISSION_REDUCTION_TARGET_1", config_value: 123213 },
                    { config_key: "graph_medium_color", config_value: "#0000FF" },
                ])
            },
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get Lane Reduction graph data ",
    controller: LaneOverviewController,
    moduleName: "getLaneReductionGraph",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 with reduction graph",
            body: {
                region_id: 1,
                year: 2024,
                quarter: 2,
                toggel_data: 1,
                lane_name: "Lane A",
                time_id: 3,
                division_id: 5,
            },
            responseStatus: 200,
            responseMessage: "Emissions Reduction",

        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        Emission: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    },
                },
            },
            testName: "should return 200 with not found message when no data exists",
            body: {
                region_id: 2,
                year: 2023,
                quarter: 2,
                toggel_data: 1,
                lane_name: "Lane B",
                time_id: 4,
                division_id: 6,
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return 500 when an error occurs in DB query",
            body: {
                region_id: 3,
                year: 2025,
                quarter: 3,
                toggel_data: 1,
                lane_name: "Lane C",
                time_id: 5,
                division_id: 7,
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
