import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import CommonAltrEVController from "../../../../controller/scope3/combineDashboard/combineDashAltrEv";

const mockConnection = {
    schema: "ad",
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            SummarisedFuelBoard: {
                findAndCountAll: jest.fn<any>().mockResolvedValue({
                    rows: [{ diesel_emissions: 10, carrier_scac: "Tets", month: 1, carrier_name: "cvbjkl;", intermodal_emissions: 2323, ev_emissions: 233, alternate_emissions: 334, color: "dasd2@#" },
                    ], count: 1
                }),
                findAll: jest.fn<any>().mockResolvedValue([
                    { intensity: 10, carrier_scac: "Tets", month: 1, carrier_name: "cvbjkl;", shipments: 2323, color: "dasd2@#" },
                ]),
            },
        },
        query: jest.fn<any>().mockResolvedValue([{ test: "" }]),
        QueryTypes: { Select: jest.fn() },
    }
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get transaction list",
    controller: CommonAltrEVController,
    moduleName: "TransactionData",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when data list found",
            body: {
                country: "", year: 3333
            },
            responseStatus: 200,
            responseMessage: "Transaction list",
        },
        {
            status: true,
            mockConnection: {
                schema: "ad",
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        SummarisedFuelBoard: {
                            findAndCountAll: jest.fn<any>().mockResolvedValue({
                                rows: [{ diesel_emissions: 10, carrier_scac: "Tets", month: 1, carrier_name: "cvbjkl;", intermodal_emissions: 2323, ev_emissions: 233, alternate_emissions: 334, color: "dasd2@#" },
                                ], count: 1
                            }),
                            findAll: jest.fn<any>().mockResolvedValue([
                                { intensity: 10, carrier_scac: "Tets", month: 1, carrier_name: "cvbjkl;", shipments: 2323, color: "dasd2@#" },
                            ]),
                        },
                    },
                    query: jest.fn<any>().mockResolvedValue([]),
                    QueryTypes: { Select: jest.fn() },
                }
            },
            testName: "should return 200 when data list  not found",
            body: {
                country: "", year: 3333
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return 500 when an error occurs in DB query",
            body: {
                country: '',
                year: '',
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
