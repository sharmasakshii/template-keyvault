import { jest } from "@jest/globals";
import { commonTestFile } from "../commonTest";
import { comapnyDbAlias } from "../../../constant";
import HttpStatusMessage from "../../../constant/responseConstant";
import BenchmarkController from "../../../controller/scope3/benchmark/benchmarlController";

const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            RegionBenchmarks: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: {
                            intermodal_index: 0.75,
                            emission_index: 0.65,
                            month: "03",
                        },
                    },
                ]),
            },
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get Emission Trend Graph",
    controller: BenchmarkController,
    moduleName: "emissionTrendGraph",
    testCases: [
        {
            extraParameter: { type: "region" },
            status: true,
            mockConnection: mockConnection,
            body: { region_id: 1, bound_type: "inbound", toggle_data: 1, year: 2024, quarter: 1 },
            testName: "should return 200 status with emission trend data when query is successful",
            responseStatus: 200,
            responseMessage: "Weight Band data.",
        },
        {
            extraParameter: { type: "lane" },
            status: true,
            body: { origin: "NY", dest: "CA", toggle_data: 1, year: 2024, quarter: 1 },
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        LaneBenchmarks: {
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
                        RegionBenchmarks: undefined,
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
