import { jest } from "@jest/globals";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import EvDashboardController from "../../../../controller/scope3/track/evDashboard/evDashboardController";


const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            EvCarriers: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { scac: "test", image: "2033-08-19", name: 'nhasdhsa' }
                ]),
            },
        },
        QueryTypes: { Select: jest.fn() },
        query: jest.fn<any>().mockResolvedValue([{
            shipment: 20
        }])
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Ev dashboard truck shipment lane data list",
    controller: EvDashboardController,
    moduleName: 'getTruckShipmentsLaneData',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 status when query fulfilled",
            body: { start_date: "2024-09-15", end_date: "2024-09-19", scac: "test" },
            responseStatus: 200,
            responseMessage: "Ev shipment lane data.",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        EvCarriers: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { scac: "test", image: "2033-08-19", name: 'nhasdhsa' }
                            ]),
                        },
                    },
                    QueryTypes: { Select: jest.fn() },
                    query: jest.fn<any>().mockResolvedValue([])
                },
            },
            testName: "should return 200 status when query fulfilled",
            body: { start_date: "2024-09-15", end_date: "2024-09-19", scac: "test" },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            // mockConnection: undefined,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    QueryTypes: { Select: jest.fn() },
                    query: jest.fn<any>().mockRejectedValue(
                        new Error("Database error")
                    ),
                },
            },
            testName: "should return 500 error ",
            body: { start_date: "2024-09-15", end_date: "2024-09-19", scac: "test" },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ]
}

commonTestFile(payload)


