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
                    {test:"gel;lkjbvbjklk"}
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
    moduleName: 'getEVShipmentLaneList',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 status when query fulfilled",
            body: { page: 1, page_size: 10, start_date: "2024-09-15", end_date: "2024-09-19", platform_mode: "test", col_name: "check", order_by: "asc", scac: "test" },
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
            body: { page: 1, page_size: 10, start_date: "2024-09-15", end_date: "2024-09-19", platform_mode: "test", col_name: "check", order_by: "asc", scac: "test" },
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


