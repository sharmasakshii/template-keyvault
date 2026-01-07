import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import CarrierController from "../../../../controller/scope3/track/carrier/carrierController";

// Mock the necessary functions and models
const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            SummerisedCarrier: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { dataValues: { intensity: 5 }, count: 4},
                    { dataValues: { intensity: 10 } },
                ]),
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
    describeName: "Get Vendor Table Data Tests",
    controller: CarrierController,
    moduleName: "getVendorTableData",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 with vendor emission data",
            body: {
                region_id: 1,
                year: 2024,
                quarter: 2,
                page: 1,
                page_size: 10,
                search_name: "test",
                col_name: "carrier_name",
                order_by: "asc",
            },
            responseStatus: 200,
            responseMessage: "vendor Data",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        SummerisedCarrier: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    },
                },
            },
            testName: "should return 200 with not found message when no vendor data exists",
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
                        SummerisedCarrier: {
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
