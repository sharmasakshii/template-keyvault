import { jest } from "@jest/globals";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import RegionController from "../../../../controller/scope3/track/region/regionController";

const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            EmissionLanes: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues:
                            { lane_name: "test", name: "Diesel", intensity: 2323123, emission: 13123123 }
                    },
                ]),
            },
            Emission: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { datValues: { average_intensity: 3132313123, average_emission: 231231231.2112 } },
                ]),
            },
            ConfigConstants: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { dataValues: { config_key: "graph_contributor_color", name: "Diesel" } },
                    { dataValues: { config_key: "graph_detractor_color", name: "Diesel" } },
                    { dataValues: { config_key: "graph_medium_color", name: "Diesel" } },
                ]),
            }
        }
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get lane  emission",
    controller: RegionController,
    moduleName: 'getLaneEmission',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return a 200 status code and data if the query is successful",
            body: { bu_id: 1, region_id: 1, year: 2025, quarter: 1, toggel_data: 1, page: 1, page_size: 10, time_id: 1, division_id: 1 },
            responseStatus: 200,
            responseMessage: "Lane Emissions",
        },

        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        EmissionLanes: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                        Emission: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                        ConfigConstants: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        }
                    }
                },
            },
            testName: "should return a 200 status code and data if the query is successful and no data found",
            body: { bu_id: 1, region_id: 1, year: 2025, quarter: 1, toggel_data: 1, page: 1, page_size: 10, time_id: 1, division_id: 1 },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },

        {
            status: false,
            mockConnection: undefined,
            testName: "should return 500 error on database failure",
            body: { bu_id: 1, region_id: 1, year: 2025, quarter: 1, toggel_data: 1, page: 1, page_size: 10, time_id: 1, division_id: 1 },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },

    ]
}

commonTestFile(payload);
