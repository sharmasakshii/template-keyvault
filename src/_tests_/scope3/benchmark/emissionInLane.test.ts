import { jest } from "@jest/globals";
import { commonTestFile } from "../commonTest";
import { comapnyDbAlias } from "../../../constant";
import HttpStatusMessage from "../../../constant/responseConstant";
import BenchmarkController from "../../../controller/scope3/benchmark/benchmarlController";

// Mock models
const mockLaneBenchmarksWithData = {
    findOne: jest.fn<any>().mockResolvedValue({
        dataValues: {
            name: "NY_LA_LANE",
            ORIGIN: "NY",
            DEST: "LA",
        },
    }),
    findAll: jest.fn<any>().mockResolvedValue([
        {
            alternative_fuel_index: 1,
            company_intermodal_index: 0.75,
            intermodal_index: 0.8,
            company_emission_index: 0.9,
        },
    ]),
};

const mockDatByLane = {
    findOne: jest.fn<any>().mockResolvedValue({
        lane_name: "NY_LA_LANE",
        dollar_per_mile: 3.5,
    }),
};

const mockLaneBenchmarksWithoutData = {
    findOne: jest.fn<any>().mockResolvedValue(null),
    findAll: jest.fn<any>().mockResolvedValue([]),
};

const mockModelsWithError = {
    findOne: jest.fn<any>().mockRejectedValue(new Error("DB Error")),
    findAll: jest.fn<any>().mockRejectedValue(new Error("DB Error")),
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Emission In Lane",
    controller: BenchmarkController,
    moduleName: "emissionInLane",
    testCases: [
        {
            testName: "should return 200 with lane benchmark and emission data",
            status: true,
            body: {
                origin: "NY",
                dest: "LA",
                toggle_data: 1,
                year: 2024,
                quarter: 2,
            },
            mockConnection: {
                company: comapnyDbAlias.PEP,
                [comapnyDbAlias.PEP]: {
                    models: {
                        LaneBenchmarks: mockLaneBenchmarksWithData,
                    }
                },
                main: {
                    models: {
                        DatByLane: mockDatByLane,
                    },
                },
            },
            responseStatus: 200,
            responseMessage: "Lane Benchmarks data.",
        },
        {
            testName: "should return 200 with NOT_FOUND message when laneBenchmarks not found",
            status: true,
            body: {
                origin: "XYZ",
                dest: "ABC",
                toggle_data: 0,
                year: 2023,
                quarter: 4,
            },
            mockConnection: {
                company: comapnyDbAlias.PEP,
                [comapnyDbAlias.PEP]: {
                    models: {
                        LaneBenchmarks: mockLaneBenchmarksWithoutData,
                    },
                },
                main: {
                    models: {
                        DatByLane: mockDatByLane,
                    },
                },
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            testName: "should return 200 with NOT_FOUND message when intermodal data not found",
            status: true,
            body: {
                origin: "CHI",
                dest: "DAL",
                toggle_data: 1,
                year: 2022,
                quarter: 3,
            },
            mockConnection: {
                company: comapnyDbAlias.PEP,
                [comapnyDbAlias.PEP]: {
                    models: {
                        LaneBenchmarks: {
                            ...mockLaneBenchmarksWithData,
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    },
                },
                main: {
                    models: {
                        DatByLane: mockDatByLane,
                    },
                },
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            testName: "should return 500 when DB throws error",
            status: false,
            body: {
                origin: "ERROR",
                dest: "LANE",
                toggle_data: 1,
                year: 2025,
                quarter: 1,
            },
            mockConnection: {
                company: comapnyDbAlias.PEP,
                [comapnyDbAlias.PEP]: {
                    models: {
                        LaneBenchmarks: mockModelsWithError,
                    },
                },
                main: {
                    models: {
                        DatByLane: mockModelsWithError,
                    },
                },
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
