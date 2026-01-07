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
                    { dataValues: { date: "2024-09-15", shipments: 10, year: "2022", week: 7, month: 1, scac: "test",total_ton_miles:23213123 } }
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
    describeName: "Ev dashboard shipment lane data list",
    controller: EvDashboardController,
    moduleName: 'getEVTTMGraphByDateMaster',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 status when query fulfilled",
            body: { start_date: "2024-09-15", end_date: "2024-09-19", scac: "test" },
            responseStatus: 200,
            responseMessage: "Total Ton Miles fetched.",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        EvEmissions: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { dataValues: { date: "2024-09-15", shipments: 10, year: "2022", week: 7, month: 1, scac: "test",total_ton_miles:23213123 } }
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
            body: { start_date: "2024-09-15", end_date: "2024-10-19", scac: "test" },
            responseStatus: 200,
            responseMessage: "Total Ton Miles fetched.",
        },

        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        EvEmissions: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { dataValues: { date: "2024-09-15", shipments: 10, year: "2022", week: 7, month: 1, scac: "test",total_ton_miles:23213123 } }
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
            body: { start_date: "2024-08-15", end_date: "2024-10-29", scac: "test" },
            responseStatus: 200,
            responseMessage: "Total Ton Miles fetched.",
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


