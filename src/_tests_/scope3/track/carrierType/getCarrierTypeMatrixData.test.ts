import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import CarrierTypeController from "../../../../controller/scope3/track/carrierType/carrierTypeController";

// Mock the necessary functions and models
const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            SummerisedCarrierType: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        carrier_type: { id: 1, name: "Carrier A" },
                        emission: 100,
                        cost: 200,
                        emissions_intensity: 50.3434,
                        total_shipments: 10,
                        total_emissions: 2
                    },
                    {
                        carrier_type: { id: 2, name: "Carrier B" },
                        emission: 300,
                        cost: 400,
                        total_ton_miles: 100,
                        shipments: 20,
                        intensity: 3
                    },
                ]),
            },
            CarrierType: {
                findAll: jest.fn<any>().mockResolvedValue([]),
            },
            ConfigConstants: {
                findAll: jest.fn<any>().mockResolvedValue([
                  {
                    dataValues: {
                      config_key: "contributor_color",
                      config_value: "#215254",
                    },
                  },
                  {
                    dataValues: {
                      config_key: "detractor_color",
                      config_value: "#d8856b",
                    },
                  },
                  {
                    dataValues: {
                      config_key: "medium_color",
                      config_value: "#929597",
                    },
                  },
                ]),
            },
            smartdataRanking: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        carrier: "fjds",
                        dataValues: {
                            "code": "fjds",
                            "ranking": 545,
                            "year": 7887
                        }
                    }
                ]),
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
    describeName: "Get Carrier Type matrix data ",
    controller: CarrierTypeController,
    moduleName: "getCarrierTypeMatrixData",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 with carrier type emission data",
            body: {
                region_id: 1,
                year: 2024,
                time_id: 2,
                carrier_type_id: 1,
            },
            responseStatus: 200,
            responseMessage: "Carrier Type Matrix Data",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        SummerisedCarrierType: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    },
                },
            },
            testName: "should return 200 with not found message when no carrier type data exists",
            body: {
                region_id: 2,
                year: 2023,
                time_id: 1,
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        SummerisedCarrierType: {
                            findAll: jest.fn<any>().mockRejectedValue(new Error("DB error")),
                        },
                    },
                },
            },
            testName: "should return 500 when an error occurs in DB query",
            body: {
                region_id: 3,
                year: 2025,
                time_id: 3,
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

// Execute the test cases
commonTestFile(payload);
