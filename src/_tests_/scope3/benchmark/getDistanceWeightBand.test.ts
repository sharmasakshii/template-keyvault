import { jest } from "@jest/globals";
import { commonTestFile } from "../commonTest";
import { comapnyDbAlias } from "../../../constant";
import HttpStatusMessage from "../../../constant/responseConstant";
import BenchmarkController from "../../../controller/scope3/benchmark/benchmarlController";

const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            EmissionBands: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: {
                            industrial_intensity: 0.5,
                            company_intensity: 0.3,
                            band_no: "1",
                            label: "0-50",
                        },
                    },
                ]),
            },
        },
    }
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get Distance Weight Band",
    controller: BenchmarkController,
    moduleName: "getDistanceWeightBand",
    testCases: [
        {
            extraParameter: { type: "mile" },
            status: true,
            mockConnection: mockConnection,
            body: { toggle_data: 1, year: 2024, quarter: 1 }, // Simulate the request body with project_id
            testName: "should return 200 status with distance band data when query is successful",
            responseStatus: 200,
            responseMessage: "Distance Band data.",
        },
        {
            extraParameter: { type: "weight" },
            status: true,
            body: { toggle_data: 1, year: 2024, quarter: 1 }, // Simulate the request body with project_id
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        EmissionBands: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    },
                },
            },
            testName: "should return 200 status with not found message if no data is found",
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        EmissionBands: undefined,
                    },
                },
            },
            testName: "should return 500 status when there is an internal server error",
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
