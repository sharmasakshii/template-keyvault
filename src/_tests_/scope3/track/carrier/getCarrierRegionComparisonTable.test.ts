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
                        carrier_name: "ghjkl",
                        region_id: 1,
                        carrier: "23",
                        intensity: 10.5,
                        emission: 13232,
                        total_ton_miles: 12321,
                        shipments: 1000,
                        'regions.id': 12,
                        'regions.name': 'CENTRAL'
                    },
                ]),
            },
            ConfigConstants: {
                findAll: jest.fn<any>().mockResolvedValue([{
                    dataValues: {
                        config_value: 10.5,
                        config_key: "contributor_color",
                    }
                },
                {
                    dataValues: {
                        config_value: 10.5,
                        config_key: "detractor_color",
                    }
                },
                {
                    dataValues: {
                        config_value: 10.5,
                        config_key: "medium_color",
                    }
                }
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
    describeName: "Get carrier comparision table data ",
    controller: CarrierController,
    moduleName: "getCarrierRegionComparisonTable",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 status with business unit data when query is successful",
            body: { carrier: 1, region_id: 1, year: 2022, quarter: 1, col_name: "", order_by: "asc", division_id: 1, time_id: 1 },
            responseStatus: 200,
            responseMessage: "Get Carrier Region Table Data",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        SummerisedCarrier: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    },
                }
            },
            testName: "should return 200 status with no record found if no data is available",
            body: { carrier: 1, region_id: 1, year: 2022, quarter: 1, col_name: "", order_by: "asc", division_id: 1, time_id: 1 },
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
