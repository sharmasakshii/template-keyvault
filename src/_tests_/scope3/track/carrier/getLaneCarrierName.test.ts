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
                    { dataValues: { carrier: "ABC", carrier_name: "Carrier A" } },
                    { dataValues: { carrier: "XYZ", carrier_name: "Carrier B" } },
                ]),
            },
            smartdataRanking: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { dataValues: { code: "ABC", ranking: 1 , year:2024 } },
                    { dataValues: { carrier: "XYZ", ranking: 2 , year:2024 } },
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
    describeName: "Get Lane Carrier Name Tests",
    controller: CarrierController,
    moduleName: "getLaneCarrierName",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 with lane carrier data",
            body: {},
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
                        smartdataRanking: {
                            findAll: jest.fn<any>().mockResolvedValue([
                            ]),
                        },

                    },
                },
            },
            testName: "should return 200 with empty carrier list",
            body: {},
            responseStatus: 200,
            responseMessage: "Vendor Emissions",
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
            body: {},
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

// Execute the test cases
commonTestFile(payload);
