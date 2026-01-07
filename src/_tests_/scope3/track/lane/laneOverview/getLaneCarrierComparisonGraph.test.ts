import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../../constant";
import HttpStatusMessage from "../../../../../constant/responseConstant";
import { commonTestFile } from "../../../commonTest";
import LaneOverviewController from "../../../../../controller/scope3/track/lane/laneOverviewController";

// Mock the necessary functions and models
const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            CarrierEmissions: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { dataValues:{
                        carrier_name: "Carrier 1",
                        intensity: 0.5,
                        emission: 1000,
                        shipment_count: 200,
                   } },
                    { dataValues: 
                       { carrier_name: "Carrier 2",
                        intensity: 0.6,
                        emission: 1200,
                        shipment_count: 220,}
                    },
                ]),
            },
            Emission: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { dataValues : {
                        average_intensity: 0.7,
                        average_emission: 1100,
                    }
                    },
                ]),
            },
            ConfigConstants: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { config_key: "graph_contributor_color", config_value: "#FF0000" },
                    { config_key: "graph_detractor_color", config_value: "#00FF00" },
                    { config_key: "graph_medium_color", config_value: "#0000FF" },
                ])
            },
            BenchmarkDates: {
                findAll: jest.fn<any>().mockResolvedValue([
                    // mock benchmark dates if needed
                ])
            },
        },
    },
};

// Define payload for testing
const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get Lane Carrier Comparison Graph Tests",
    controller: LaneOverviewController,
    moduleName: "getLaneCarrierComparisonGraph",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 with carrier emissions data",
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
            responseMessage: "Carrier Emissions",
            expectedResponse: {
                contributor: [
                    {
                        name: "Carrier 2",
                        value: 0.1,
                        total_emission: 0.0012,
                        total_intensity: 0.6,
                        shipment_count: 220,
                        color: "#FF0000",
                    },
                    {
                        name: "Carrier 1",
                        value: 0.2,
                        total_emission: 0.001,
                        total_intensity: 0.5,
                        shipment_count: 200,
                        color: "#FF0000",
                    },
                ],
                detractor: [
                    {
                        name: "Carrier 2",
                        value: 0.1,
                        total_emission: 0.0012,
                        total_intensity: 0.6,
                        shipment_count: 220,
                        color: "#00FF00",
                    },
                ],
                unit: "tCO2e",
                average: 1100,
            },
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        CarrierEmissions: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
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
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                main: {
                    models: {
                        Emission: {
                            findAll: jest.fn<any>().mockRejectedValue(new Error("DB error")),
                        },
                    },
                },
            },
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

// Execute the test cases
commonTestFile(payload);
