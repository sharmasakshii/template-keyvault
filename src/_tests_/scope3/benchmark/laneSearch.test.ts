import { jest } from "@jest/globals";
import { commonTestFile } from "../commonTest";
import { comapnyDbAlias } from "../../../constant";
import HttpStatusMessage from "../../../constant/responseConstant";
import BenchmarkController from "../../../controller/scope3/benchmark/benchmarlController";

// Mock LaneBenchmarks model
const mockLaneBenchmarksWithOrigin = {
    findAll: jest.fn<any>().mockResolvedValue([
        { origin: "NY" },
        { origin: "LA" }
    ])
};

const mockLaneBenchmarksWithDest = {
    findAll: jest.fn<any>().mockResolvedValue([
        { dest: "CHI" },
        { dest: "DAL" }
    ])
};

const mockLaneBenchmarksError = {
    findAll: jest.fn<any>().mockRejectedValue(new Error("DB Error")),
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Lane Search",
    controller: BenchmarkController,
    moduleName: "laneSearch",
    testCases: [
        {
            testName: "should return 200 with origin list",
            status: true,
            body: {
                keyword: "NY",
                page_limit: 5,
                type: "origin",
                source: "",
            },
            mockConnection: {
                company: comapnyDbAlias.PEP,
                [comapnyDbAlias.PEP]: {
                    models: {
                        LaneBenchmarks: mockLaneBenchmarksWithOrigin,
                    },
                },
            },
            responseStatus: 200,
            responseMessage: "Lane list data",
        },
        {
            testName: "should return 200 with destination list",
            status: true,
            body: {
                keyword: "CHI",
                page_limit: 3,
                type: "dest",
                source: "NY",
            },
            mockConnection: {
                company: comapnyDbAlias.PEP,
                [comapnyDbAlias.PEP]: {
                    models: {
                        LaneBenchmarks: mockLaneBenchmarksWithDest,
                    },
                },
            },
            responseStatus: 200,
            responseMessage: "Lane list data",
        },
        {
            testName: "should return 200 with NOT_FOUND when no results",
            status: true,
            body: {
                keyword: "UNKNOWN",
                page_limit: 10,
                type: "origin",
                source: "",
            },
            mockConnection: {
                company: comapnyDbAlias.PEP,
                [comapnyDbAlias.PEP]: {
                    models: {
                        LaneBenchmarks: { findAll: jest.fn<any>().mockResolvedValue([])},
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
                keyword: "ERR",
                page_limit: 10,
                type: "origin",
                source: "",
            },
            mockConnection: {
                company: comapnyDbAlias.PEP,
                [comapnyDbAlias.PEP]: {
                    models: {
                        LaneBenchmarks: mockLaneBenchmarksError,
                    },
                },
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
