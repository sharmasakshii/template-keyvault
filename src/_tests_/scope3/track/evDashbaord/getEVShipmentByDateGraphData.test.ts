import { jest } from "@jest/globals";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import EvDashboardController from "../../../../controller/scope3/track/evDashboard/evDashboardController";


const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            EvEmissions: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { get: jest.fn().mockReturnValue({ date: "2024-09-15", shipments: 10 }) }
                ]),
            },
            EvCarriers: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { scac: "test", image: "2033-08-19", name: 'nhasdhsa' }
                ]),
            },
        }
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Ev  dashboard shipment graph data ",
    controller: EvDashboardController,
    moduleName: 'getEVShipmentByDateGraphData',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 status when query fulfilled",
            body: { start_date: "2024-09-15", end_date: "2024-09-18", platform_mode: "test", scac: "test" },
            responseStatus: 200,
            responseMessage: "Shipments data fetched.",
        },

        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        EvEmissions: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { get: jest.fn().mockReturnValue({ date: "2024-09-15", shipments: 10, year: "2022", week: 7 }) }
                            ]),
                        },
                        EvCarriers: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { scac: "test", image: "2033-08-19", name: 'nhasdhsa' }
                            ]),
                        },
                    }
                },
            },
            testName: "should return 200 status when date diffrence greater than 7 and less than 62 ",
            body: { start_date: "2024-09-15", end_date: "2024-10-18", platform_mode: "test", scac: "test" },
            responseStatus: 200,
            responseMessage: "Shipments data fetched.",
        },

        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        EvEmissions: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { get: jest.fn().mockReturnValue({ date: "2024-09-15", shipments: 10, year: "2024", week: 7 }) }
                            ]),
                        },
                        EvCarriers: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { scac: "test", image: "2033-08-19", name: 'nhasdhsa' }
                            ]),
                        },
                    }
                },
            },
            testName: "should return 200 status when date diffrence greater than 61 and less than 365 ",
            body: { start_date: "2024-08-15", end_date: "2024-11-18", platform_mode: "test", scac: "test" },
            responseStatus: 200,
            responseMessage: "Shipments data fetched.",
        },

        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        EvEmissions: {
                            findAll: jest.fn<any>().mockResolvedValue([
                            ]),
                        },
                        EvCarriers: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { scac: "test", image: "2033-08-19", name: 'nhasdhsa' }
                            ]),
                        },
                    }
                },
            },
            testName: "No data  found",
            body: { start_date: "2024-09-15", end_date: "2024-10-18", platform_mode: "test", scac: "test" },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return 500 error ",
            body: new Error("Database connection error"),
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ]
}

commonTestFile(payload)


