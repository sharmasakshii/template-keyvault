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
        }
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Ev  dashboard list of carrier ",
    controller: EvDashboardController,
    moduleName: 'getEvCarriersList',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "Carriers data fetched successfully.",
            body: "",
            responseStatus: 200,
            responseMessage: "Carriers data fetched successfully.",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        EvCarriers: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    }
                },
            },
            testName: "No carrier found",
            body: "",
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        EvCarriers: {
                            findAll: jest.fn<any>().mockRejectedValue(new Error("Database connection error")),
                        },
                    }
                },
            },
            testName: "should return 500 error ",
            body: "",
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },

    ]
}

commonTestFile(payload)


