import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import LaneController from "../../../../controller/scope3/track/lane/laneController";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";

// Mock the necessary functions and models
const mockConnection = {
    schema: "pep",
    company: comapnyDbAlias?.LW,
    [comapnyDbAlias?.LW]: {
        query: jest.fn<any>().mockResolvedValue([]),
        QueryTypes: { Select: jest.fn() },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get lane emission OD pair",
    controller: LaneController,
    moduleName: "getLaneEmissionLanesOriginDest",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 with processed lane search when destination search with keybord",
            body: {
                keyword: "Test", page_limit: 10, type: "dest", source: "", dest: "", region_id: 1, year: 2024, quarter: 1
            },
            responseStatus: 200,
            responseMessage: "Lane Planing data",
        },
        {
            status: true,
            mockConnection: {
                schema: "pep",
                company: comapnyDbAlias?.LW,
                [comapnyDbAlias?.LW]: {
                    models: {
                        EmissionLanes: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: { carrier: "test", emissions: 100.024999, count: 10 }
                                }]),
                        }
                    }
                },
            },
            testName: "should return 200 with processed lane carrier table data when data exists",
            body: {
                keyword: "test", page_limit: 10, type: "origin", source: "", dest: "", region_id: 1, year: 2024, quarter: 1
            },
            responseStatus: 200,
            responseMessage: "Lane Emission Data",
        },
        {
            status: true,
            mockConnection: {
                schema: "pep",
                company: comapnyDbAlias?.LW,
                [comapnyDbAlias?.LW]: {
                    models: {
                        EmissionLanes: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        }
                    }
                },
            },
            testName: "should return 200 with processed lane carrier table data when data exists",
            body: {
                keyword: "test", page_limit: 10, type: "dest", source: "test", dest: "", region_id: 1, year: 2024, quarter: 1
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },

        {
            status: false,
            mockConnection: {
                schema: "pep",
                company: comapnyDbAlias?.LW,
                [comapnyDbAlias?.LW]: {
                    models: {
                        EmissionLanesss: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: { carrier: "test", emissions: 100.024999, count: 10 }
                                }]),
                        }
                    }
                },
            },
            testName: "should return 500 when an error occurs in DB query",
            body: {
                keyword: "", page_limit: 10, type: "dest", source: "test", dest: "", region_id: 1, year: 2024, quarter: 1
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
