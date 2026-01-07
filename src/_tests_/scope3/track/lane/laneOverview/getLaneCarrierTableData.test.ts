import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../../constant";
import HttpStatusMessage from "../../../../../constant/responseConstant";
import { commonTestFile } from "../../../commonTest";
import LaneOverviewController from "../../../../../controller/scope3/track/lane/laneOverviewController";

// Mock the necessary functions and models
const mockConnection = {
    company: comapnyDbAlias?.LW,
    [comapnyDbAlias?.LW]: {
        models: {
            Emission: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { average: 156.4999, average_emission: 0.024999,  count: 10 }
                ]),
            },
            CarrierEmissions: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {dataValues: {
                        intensity: 134.5,
                        emission: 0.000988,
                        shipment_count: 1,
                        carrier: 'ABC',
                        carrier_name: 'ABC PARCEL ACCOUNT',
                        carrier_logo: null
                      }}
                ]),
            },
            ConfigConstants: {
                findAll: jest.fn<any>().mockResolvedValue([

                ])
            },
            smartdataRanking: {
                findAll: jest.fn<any>().mockResolvedValue([

                ])  
            }
        },
    },
};

// Define payload for testing
const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get Lane Carrier Table Data Tests",
    controller: LaneOverviewController,
    moduleName: "getLaneCarrierTableData",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 with processed lane carrier table data when data exists",
            body: {
                region_id: 1,
                year: 2024,
                quarter: 1,
                page: 1,
                page_size: 10,
                search_name: "ABC",
            },
            responseStatus: 200,
            responseMessage: "Get Vendor Table Data",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.LW,
                [comapnyDbAlias?.LW]: {
                    models: {
                        Emission: {
                            findAll: jest.fn<any>().mockResolvedValue([{ count: 0 }]),
                        },
                        CarrierEmissions: {
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
                page: 1,
                page_size: 10,
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
                page: 1,
                page_size: 10,
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

// Execute the test cases
commonTestFile(payload);
