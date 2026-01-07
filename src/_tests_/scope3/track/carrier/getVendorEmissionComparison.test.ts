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
                    {
                        dataValues: {
                            carrier: "ABC",
                            carrier_name: "Carrier A",
                            carrier_logo: "logoA.png",
                            intensity: 50,
                            emission: 1000,
                            shipments: 10,
                        },
                    },
                    {
                        dataValues: {
                            carrier: "XYZ",
                            carrier_name: "Carrier B",
                            carrier_logo: "logoB.png",
                            intensity: 60,
                            emission: 2000,
                            shipments: 20,
                        },
                    },
                ]),
            },
            Emission: {
                findOne: jest.fn<any>().mockResolvedValue(null),
            },
            smartdataRanking: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { dataValues: { code: "ABC", ranking: 1, year: 2024 } },
                    { dataValues: { code: "XYZ", ranking: 2, year: 2024 } },
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
    describeName: "Get Vendor Emission Comparison Tests",
    controller: CarrierController,
    moduleName: "getVendorEmissionComparison",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 with vendor emission data",
            body: { toggel_data: 0, carrier1: "ABC", carrier2: "XYZ" },
            responseStatus: 200,
            responseMessage: "Vendor Emissions Comparison Data",
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
                        Emission: {
                            findOne: jest.fn<any>().mockResolvedValue(null),
                        },
                        smartdataRanking: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    },
                },
            },
            testName: "should return 200 with empty vendor emission list",
            body: { toggel_data: 1, carrier1: "ABC", carrier2: "XYZ" },
            responseStatus: 200,
            responseMessage: "Vendor Emissions Comparison Data",
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
            body: { toggel_data: 1, carrier1: "ABC", carrier2: "XYZ" },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

// Execute the test cases
commonTestFile(payload);
