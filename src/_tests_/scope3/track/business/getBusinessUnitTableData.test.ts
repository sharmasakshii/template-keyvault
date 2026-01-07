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
                        intensity: 12.3,
                        emission: 38346.407,
                        total_ton_miles: 364531.31623,
                        shipments: 434552,
                        bu_id: 23,
                        'businessUnit.name': 'ABCD',
                        'businessUnit.description': 'PepsiCo Foods North America'
                      },
                      {
                        intensity: 435.6,
                        emission: 36544682.575906,
                        total_ton_miles: 33454544.40434309,
                        shipments: 465432,
                        bu_id: 56,
                        'businessUnit.name': 'NA',
                        'businessUnit.description': 'NA'
                      }
                ])
            },
            ConfigConstants: {
                findAll: jest.fn<any>().mockResolvedValue([
                  {
                    dataValues: {
                      config_key: "contributor_color",
                      config_value: "#215254",
                    },
                  },
                  {
                    dataValues: {
                      config_key: "detractor_color",
                      config_value: "#d8856b",
                    },
                  },
                  {
                    dataValues: {
                      config_key: "medium_color",
                      config_value: "#929597",
                    },
                  },
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
    describeName: "Get Business Table Data",
    controller: BusinessController,
    moduleName: 'getBusinessUnitTableData',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 with emission data when data exists",
            body: {
              quarter:2, col_name:"intensity", order_by:"desc", time_id: 12, division_id: 3, year: 2024, region_id: "2"
            },
            responseStatus: 200,
            responseMessage: "Get Business Unit Table Data",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.LW,
                [comapnyDbAlias?.LW]: {
                    models: {
                        SummerisedBusinessUnit: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    }
                },
            },
            testName: "should return 200 with not found message when no data exists",
            body: {
               quarter:2, col_name:"intensity", order_by:"desc", time_id: 12, division_id: 3, year: 2024, region_id: "2"
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return 500 when an error occurs in DB query",
            body: {
               quarter:2, col_name:"intensity", order_by:"desc", time_id: 12, division_id: 3, year: 2024, region_id: "2"
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
}

commonTestFile(payload);
