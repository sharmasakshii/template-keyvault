import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import EvDashboardController from "../../../../controller/scope3/track/evDashboard/evDashboardController";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";


const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            EvEmissions: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { dataValues: { start_date: "2024-09-15", end_date: "2033-08-19" } }
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
    describeName: "Ev dashboard filter dates list",
    controller: EvDashboardController,
    moduleName: 'filterEmissionDatesEv',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 status when query fulfilled",
            query: { scac: "test" },
            responseStatus: 200,
            responseMessage: "User Filter Dates.",
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
            testName: "should return 200 status when query fulfilled",
            query: { scac: "test" },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return 500 error ",
            query: new Error("Database connection error"),
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ]
}

commonTestFile(payload)


