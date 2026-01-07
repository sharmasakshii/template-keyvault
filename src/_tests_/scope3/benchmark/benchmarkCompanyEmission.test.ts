import { jest } from "@jest/globals";
import { commonTestFile } from "../commonTest";
import { comapnyDbAlias } from "../../../constant";
import HttpStatusMessage from "../../../constant/responseConstant";
import BenchmarkController from "../../../controller/scope3/benchmark/benchmarlController";

const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            EmissionIntensityLanes: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        industrial_average: 0.4,
                    },
                ]),
                findAndCountAll: jest.fn<any>().mockResolvedValue({
                    count: [{ name: "Lane A" }, { name: "Lane B" }],
                    rows: [
                        {
                            industrial_intensity: 0.6,
                            company_intensity: 0.5,
                            name: "Lane A",
                        },
                    ],
                }),
            },
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Benchmark Company Emission",
    controller: BenchmarkController,
    moduleName: "benchmarkCompanyEmission",
    testCases: [
        {
            testName: "should return 200 status with lane benchmark data when query is successful",
            status: true,
            body: {
                low_emission: 1,
                band_no: 1,
                toggle_data: 1,
                year: 2024,
                quarter: 1,
                type: "some_type",
                page: 1,
                page_size: 5,
            },
            mockConnection,
            responseStatus: 200,
            responseMessage: "Lane Benchmarks data",
        },
        {
            testName: "should return 200 status with not found message when no lane data exists",
            status: true,
            body: {
                low_emission: 1,
                band_no: 1,
                toggle_data: 1,
                year: 2024,
                quarter: 1,
                type: "some_type",
                page: 1,
                page_size: 5,
            },
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        EmissionIntensityLanes: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    industrial_average: 0.4,
                                },
                            ]),
                            findAndCountAll: jest.fn<any>().mockResolvedValue({
                                count: [],
                                rows: [],
                            }),
                        },
                    },
                },
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            testName: "should return 500 status when there is an internal server error",
            status: false,
            body: {
                low_emission: 1,
                band_no: 1,
                toggle_data: 1,
                year: 2024,
                quarter: 1,
                type: "some_type",
                page: 1,
                page_size: 5,
            },
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        EmissionIntensityLanes: undefined,
                    },
                },
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
