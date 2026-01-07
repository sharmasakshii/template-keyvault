import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import LaneController from "../../../../controller/scope3/track/lane/laneController";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";

const mockConnection = {
    company: comapnyDbAlias?.LW,
    [comapnyDbAlias?.LW]: {
        models: {
            Emission: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: { carrier: "test", emissions: 100.024999, count: 10 }
                    }]),

            },
            smartdataRanking: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: { code: "test", emissions: 0.024999, count: 10 }
                    }]),
            }

        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get lane overview data",
    controller: LaneController,
    moduleName: "getLaneOverviewDetails",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 with processed lane carrier table data when data exists",
            body: {
                region_id: 1, year: 2222, quarter: 1, lane_name: "test", time_id: 2, division_id: 1
            },
            responseStatus: 200,
            responseMessage: "Lane Overview Data",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.LW,
                [comapnyDbAlias?.LW]: {
                    models: {
                        Emission: {
                            findAll: jest.fn<any>().mockResolvedValue([]),

                        },
                        smartdataRanking: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: { code: "test", emissions: 0.024999, count: 10 }
                                }]),
                        }

                    },
                },
            },
            testName: "should return 200 with not found message when no data exists",
            body: {
                region_id: 1, year: 2222, quarter: 1, lane_name: "test", time_id: 2, division_id: 1
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return 500 when an error occurs in DB query",
            body: {
                region_id: 1, year: 2222, quarter: 1, lane_name: "test", time_id: 2, division_id: 1
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);