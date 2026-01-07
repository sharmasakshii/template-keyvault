import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import CarrierController from "../../../../controller/scope3/track/carrier/carrierController";

const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            SummerisedCarrier: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: {
                            carrier: 'SCNN',
                            carrier_name: 'SCHNEIDER',
                            intensity: 76.504143,
                            emission: 11773.0938856962,
                            shipment_count: 41663,
                            average_intensity: 3132313123,
                            average_emission: 231231231.2112
                        }
                    },
                ])
            },

            ConfigConstants: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { dataValues: { config_key: "graph_contributor_color", name: "Diesel" } },
                    { dataValues: { config_key: "graph_detractor_color", name: "Diesel" } },
                    { dataValues: { config_key: "graph_medium_color", name: "Diesel" } },
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
    describeName: "Get carrier comparision graph  data ",
    controller: CarrierController,
    moduleName: "getRegionCarrierComparisonGraph",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 status with business unit data when query is successful",
            body: { carrier: 1, region_id: 1, year: 2022, quarter: 1, col_name: "", order_by: "asc", division_id: 1, toggel_data: 1 },
            responseStatus: 200,
            responseMessage: "Region carrier comparission data",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        SummerisedCarrier: {
                            findAll: jest.fn<any>().mockResolvedValue([])
                        },
                    },
                },
            },
            testName: "should return 200 status with no record found if no data is available",
            body: { carrier: 1, region_id: 1, year: 2022, quarter: 1, col_name: "", order_by: "asc", division_id: 1, toggel_data: 0 },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return 500 status when there is an internal server error",
            body: { carrier: 1, region_id: 1, year: 2022, quarter: 1, col_name: "", order_by: "asc", division_id: 1, time_id: 1 },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
