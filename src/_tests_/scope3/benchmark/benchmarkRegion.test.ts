import { jest } from "@jest/globals";
import { commonTestFile } from "../commonTest";
import { comapnyDbAlias } from "../../../constant";
import HttpStatusMessage from "../../../constant/responseConstant";
import BenchmarkController from "../../../controller/scope3/benchmark/benchmarlController";

const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            BenchmarkRegions: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        region_name: "Northwest",
                        slug: "northwest",
                        id: 1,
                    },
                    {
                        region_name: "Midwest",
                        slug: "midwest",
                        id: 2,
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
    describeName: "Benchmark Region",
    controller: BenchmarkController,
    moduleName: "benchmarkRegion",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 with benchmark region data when regions are available",
            responseStatus: 200,
            responseMessage: "Bemchmark region data.",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        BenchmarkRegions: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    },
                },
            },
            testName: "should return 200 with not found message when no regions are available",
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        BenchmarkRegions: undefined,
                    },
                },
            },
            testName: "should return 500 when internal server error occurs",
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
