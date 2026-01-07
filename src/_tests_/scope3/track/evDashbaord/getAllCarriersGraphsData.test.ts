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
                findAll: jest.fn<any>().mockResolvedValue([{ total_emissions: "asjdasd" }]),
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
    describeName: "Alternate fuel list of carrier ",
    controller: EvDashboardController,
    moduleName: 'getAllCarriersGraphsData',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return a 200 status code and data if the query is successful",
            body: {
                "start_date": "2024-10-08", "end_date": "2024-10-11", platform_mode: "test", selected_scacs: ["test"]
            },
            responseStatus: 200,
            responseMessage: "Ev Master dashboard all graphs data.",
        },
        {
            status: false,
            mockConnection: mockConnection,
            testName: "validation error if start date is not sent in payload",
            body: {
                "start_date": "", "end_date": "2024-10-11", platform_mode: "test", selected_scacs: ["test"]
            },
            responseStatus: 400,
            responseMessage: "Start date is required",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        EvEmissions: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                        EvCarriers: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { scac: "test", image: "2033-08-19", name: 'nhasdhsa' }
                            ]),
                        },
                    }
                },
            },
            testName: "should return a 200 status code and data if no data found",
            body: {
                "start_date": "2024-10-08", "end_date": "2024-10-11", platform_mode: "test", selected_scacs: ["test"]
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        EvEmissions: {
                            findAll: jest.fn<any>().mockRejectedValue(new Error("Database connection error")),
                          },
                          
                    }
                },
            },
            testName: "should return 500 error ",
            body: {
                "start_date": "2024-10-08", "end_date": "2024-10-11", platform_mode: "test", selected_scacs: ["test"]
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },

    ]
}

commonTestFile(payload)


