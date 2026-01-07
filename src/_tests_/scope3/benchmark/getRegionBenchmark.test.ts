import { jest } from "@jest/globals";
import { commonTestFile } from "../commonTest";
import { comapnyDbAlias } from "../../../constant";
import HttpStatusMessage from "../../../constant/responseConstant";
import BenchmarkController from "../../../controller/scope3/benchmark/benchmarlController";

// Mocked region benchmark data
const regionBenchmarksMock = [
    {
        dataValues: {
            intermodal_index: 0.95,
            emission_index: 0.87,
            alternative_fuel_index: 1,
            region: "south",
            BenchmarkRegions: {
                region_name: "South Region",
                slug: "south-region"
            }
        }
    },
    {
        dataValues: {
            intermodal_index: 1.02,
            emission_index: 0.91,
            alternative_fuel_index: 1,
            region: "north",
            BenchmarkRegions: {
                region_name: "North Region",
                slug: "north-region"
            }
        }
    }
];

// Test data mocks
const mockRegionBenchmarks = {
    findAll: jest.fn<any>().mockResolvedValue(regionBenchmarksMock),
};

const mockRegionBenchmarksEmpty = {
    findAll: jest.fn<any>().mockResolvedValue([]),
};

const mockRegionBenchmarksError = {
    findAll: jest.fn<any>().mockRejectedValue(new Error("DB Error")),
};

// Controller test config
const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Region Benchmarks",
    controller: BenchmarkController,
    moduleName: "getRegionBenchmarks",
    testCases: [
        {
            testName: "should return 200 with region benchmark data",
            status: true,
            extraParameter: {},
            body: {
                toggle_data: 1,
                bound_type: "outbound",
                year: 2024,
                quarter: "Q1",
            },
            mockConnection: {
                company: comapnyDbAlias.PEP,
                [comapnyDbAlias.PEP]: {
                    models: {
                        RegionBenchmarks: mockRegionBenchmarks,
                        BenchmarkRegions: {}, // No need to mock further because it's included already
                    },
                },
            },
            responseStatus: 200,
            responseMessage: "Region Benchmark  data.",
        },
        {
            testName: "should return 200 with NOT_FOUND when region benchmark is empty",
            status: true,
            extraParameter: {},
            body: {
                toggle_data: 2,
                bound_type: "inbound",
                year: 2023,
                quarter: "Q4",
            },
            mockConnection: {
                company: comapnyDbAlias.PEP,
                [comapnyDbAlias.PEP]: {
                    models: {
                        RegionBenchmarks: mockRegionBenchmarksEmpty,
                        BenchmarkRegions: {},
                    },
                },
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            testName: "should return 500 when DB throws error",
            status: false,
            extraParameter: {},
            body: {
                toggle_data: 1,
                bound_type: "outbound",
                year: 2024,
                quarter: "Q1",
            },
            mockConnection: {
                company: comapnyDbAlias.PEP,
                [comapnyDbAlias.PEP]: {
                    models: {
                        RegionBenchmarks: mockRegionBenchmarksError,
                        BenchmarkRegions: {},
                    },
                },
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);