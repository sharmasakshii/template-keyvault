import { jest } from "@jest/globals";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import BusinessController from "../../../../controller/scope3/track/businessUnit/businessController";

const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            SummerisedBusinessUnit: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {

                        name: 'SCNN',
                        carrier_name: 'SCHNEIDER',
                        intensity: 76.504143,
                        emission: 11773.0938856962,
                        shipment_count: 41663

                    },
                    {

                        carrier: 'SCNN',
                        carrier_name: 'SCHNEIDER',
                        intensity: 76.504143,
                        emission: 11773.0938856962,
                        shipment_count: 41663

                    }
                ])
            },
            ConfigConstants: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { dataValues: { config_key: "graph_contributor_color", name: "Diesel" } },
                    { dataValues: { config_key: "graph_detractor_color", name: "Diesel" } },
                    { dataValues: { config_key: "graph_medium_color", name: "Diesel" } },
                ]),
            },

        }
    }
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get Business Emission Data by region ",
    controller: BusinessController,
    moduleName: 'getBusinessEmissionDataBYRegion',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return a 200 status code and data if the query is successful",
            body: { bu_id: 1, region_id: 1, year: 2022, quarter: 2, toggel_data: 1, time_id: 1, division_id: 1 },
            responseStatus: 200,
            responseMessage: "Business Unit Emissions by region.",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        SummerisedBusinessUnit: {
                            findAll: jest.fn<any>().mockResolvedValue([])
                        },

                    }
                }
            },
            testName: "should return 200 with NOT_FOUND if no emissions data is found",
            body: { bu_id: 1, region_id: 1, year: 2022, quarter: 2, toggel_data: 0, time_id: 1, division_id: 1 },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return 500 error on database failure",
            body: { bu_id: 1, region_id: 1, year: 2025, quarter: 1, time_id: 1, division_id: 1, toggel_data: 1 },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        }
    ]
}

commonTestFile(payload);
