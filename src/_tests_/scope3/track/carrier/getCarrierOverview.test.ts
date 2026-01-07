import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import CarrierController from "../../../../controller/scope3/track/carrier/carrierController";

const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            SummerisedCarrier: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { dataValues: { intensity: 5, carrier: "5tyui" }, count: 4 },
                    { dataValues: { intensity: 10, carrier: "ewrdgf" } },
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
            BenchmarkDates: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { dataValues: { average_intensity: 23 } }
                ])
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

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get Vendor Carrier overview",
    controller: CarrierController,
    moduleName: "getVendorCarrierOverview",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 with vendor emission data",
            body: {
                id: "fghj", region_id: 1, year: 2022, quarter: 1, division_id: 1, time_id: 1
            },
            responseStatus: 200,
            responseMessage: "Vendor Emissions",
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
                id: "fghj", region_id: 1, year: 2022, quarter: 1, division_id: 1, time_id: 1
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
                page: 1,
                page_size: 10,
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
