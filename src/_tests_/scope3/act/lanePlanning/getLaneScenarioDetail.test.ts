import { jest } from "@jest/globals";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import LanePlanningController from "../../../../controller/scope3/act/lanePlanning/lanePlanningController";

const mockConnection: any = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            Emission: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { emission_intensity: 75.5 }
                ]),
            },
            EmissionLanes: { findOne: jest.fn<any>().mockResolvedValue({ name: "asdsadasdas" }) }
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "getLaneScenarioDetail",
    controller: LanePlanningController,
    moduleName: "getLaneScenarioDetail",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when successful",
            body: {
                name: "Test Lane",
            },
            responseStatus: 200,
            responseMessage: "Lane Scenario Data.",
        },

        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        Emission: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                        EmissionLanes: { findOne: jest.fn<any>().mockResolvedValue(null) }
                    },
                },
            },
            testName: "when no lane found",
            body: {
                name: "Test Lane",
            },
            responseStatus: 200,
            responseMessage: "No data found for this lane",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        Emission: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                        EmissionLanes: { findOne: jest.fn<any>().mockResolvedValue({ name: "asdsadasdas" }) }
                    },
                },
            },
            testName: "should return 200 with empty object when no data found",
            body: {
                name: "Unknown Lane",
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {},
                },
            },
            testName: "should return 500 when an error occurs",
            body: {
                name: null,
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

describe(payload.describeName, () => {
    commonTestFile(payload);
});