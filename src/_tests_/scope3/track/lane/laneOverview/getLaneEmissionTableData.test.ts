import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../../constant";
import LaneController from "../../../../../controller/scope3/track/lane/laneController";
import HttpStatusMessage from "../../../../../constant/responseConstant";
import { commonTestFile } from "../../../commonTest";
// Mock the necessary functions and models
const mockConnection = {
    company: comapnyDbAlias?.LW,
    [comapnyDbAlias?.LW]: {
        models: {
            EmissionLanes: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: { intensity: 156.4999, emissions: 100.024999, count: 10 }
                    }]),
                findAndCountAll: jest.fn<any>().mockResolvedValue({
                    rows: [
                        { dataValues: { intensity: 15, average_emission: 0.024999, count: 10 } }],
                    count: [
                        { average: 156.4999, average_emission: 0.024999, count: 10 }]
                }
                ),
            },
            ConfigConstants: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: { intensity: 156.4999, emissions: 0.024999, count: 10 }
                    }]),
            }

        },
    },
};

// Define payload for testing
const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get Lane Carrier Table Data Tests",
    controller: LaneController,
    moduleName: "getLaneEmissionTableData",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 with processed lane carrier table data when data exists",
            body: {
                region_id: 1, year: 2022, quarter: 1, page: 1, page_size: 10, origin: "", dest: "", col_name: "", order_by: "", time_id: "", division_id: ""
            },
            responseStatus: 200,
            responseMessage: "Lane Emission Data",
        },


        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.LW,
                [comapnyDbAlias?.LW]: {
                    models: {
                        EmissionLanes: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: { intensity: 156.4999, emissions: 100, count: 10 }
                                }]),
                            findAndCountAll: jest.fn<any>().mockResolvedValue({
                                rows: [
                                    { dataValues: { intensity: 100, average_emission: 0.024999, count: 10 } }],
                                count: [
                                    { average: 156.4999, average_emission: 0.024999, count: 10 }]
                            }
                            ),
                        },
                        ConfigConstants: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: { intensity: 156.4999, emissions: 0.024999, count: 10 }
                                }]),
                        }

                    },
                },
            },
            testName: "should return 200 with processed lane emission table data  intensity match  compared ",
            body: {
                region_id: 1, year: 2022, quarter: 1, page: 1, page_size: 10, origin: "", dest: "", col_name: "", order_by: "", time_id: "", division_id: ""
            },
            responseStatus: 200,
            responseMessage: "Lane Emission Data",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.LW,
                [comapnyDbAlias?.LW]: {
                    models: {
                        EmissionLanes: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: { intensity: 156.4999, emissions: 100, count: 10 }
                                }]),
                            findAndCountAll: jest.fn<any>().mockResolvedValue({
                                rows: [
                                    { dataValues: { intensity: 1000, average_emission: 0.024999, count: 10 } }],
                                count: [
                                    { average: 156.4999, average_emission: 0.024999, count: 10 }]
                            }
                            ),
                        },
                        ConfigConstants: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: { intensity: 156.4999, emissions: 0.024999, count: 10 }
                                }]),
                        }

                    },
                },
            },
            testName: "should return 200 with processed lane emission table data  intensity greater from standard deviation value ",
            body: {
                region_id: 1, year: 2022, quarter: 1, page: 1, page_size: 10, origin: "", dest: "", col_name: "", order_by: "", time_id: "", division_id: ""
            },
            responseStatus: 200,
            responseMessage: "Lane Emission Data",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.LW,
                [comapnyDbAlias?.LW]: {
                    models: {
                        EmissionLanes: {
                            findAll: jest.fn<any>().mockResolvedValue([])
                        },
                    },
                },
            },
            testName: "should return 200 with not found message when no data exists",
            body: {
                region_id: 1, year: 2022, quarter: 1, page: 1, page_size: 10, origin: "", dest: "", col_name: "", order_by: "", time_id: "", division_id: ""
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return 500 when an error occurs in DB query",
            body: {
                region_id: 1, year: 2022, quarter: 1, page: 1, page_size: 10, origin: "", dest: "", col_name: "", order_by: "", time_id: "", division_id: ""
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

// Execute the test cases
commonTestFile(payload);