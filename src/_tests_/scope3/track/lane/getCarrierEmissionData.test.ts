import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import LaneController from "../../../../controller/scope3/track/lane/laneController";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";

// Mock the necessary functions and models
const mockConnection = {
    company: comapnyDbAlias?.LW,
    [comapnyDbAlias?.LW]: {
        models: {
            CarrierEmissions: {
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

// Define payload for testing
const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get carrier emission data",
    controller: LaneController,
    moduleName: "getCarrierEmissionData",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 with processed lane carrier table data when data exists",
            body: {
                region_id: 1, year: 2024, quarter: 1, lane_name: "", division_id: "", time_id: ""
            },
            responseStatus: 200,
            responseMessage: "Carrier Emission Data",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.LW,
                [comapnyDbAlias?.LW]: {
                    models: {
                        CarrierEmissions: {
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
                region_id: 1, year: 2024, quarter: 1, lane_name: "", division_id: "", time_id: ""
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return 500 when an error occurs in DB query",
            body: {
                region_id: 1, year: 2024, quarter: 1, lane_name: "", division_id: "", time_id: ""
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);