import { jest } from "@jest/globals";
import FacilityController from "../../../../controller/scope3/track/faciity/facilityController";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";

// Mock the necessary functions and models

const mockConnection = {
    company: comapnyDbAlias?.LW,
    [comapnyDbAlias?.LW]: {
        models: {
            SummerisedFacilities: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        intensity: 77.6,
                        emission: 8899854364.949953,
                        total_ton_miles: 114667085.87000047,
                        shipments: 18036,
                        'facility.id': 13,
                        'facility.name': 'Statesville, NC'
                      },
                      {
                        intensity: 76.9,
                        emission: 13990755047.299974,
                        total_ton_miles: 182006824.3999997,
                        shipments: 23610,
                        'facility.id': '',
                        'facility.name': ''
                      },
                      {
                        intensity: 76.6,
                        emission: 9732063993.939966,
                        total_ton_miles: 127110148.21999995,
                        shipments: 21559,
                        'facility.id': 8,
                        'facility.name': 'Adairsville, GA'
                      }
                ]),
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
    },
};

// Define payload for testing
const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Fetch Facility Table Data Tests",
    controller: FacilityController,
    moduleName: 'fetchFacilityTableData',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 with facility data when data exists",
            body: {
                region_id: 1,
                year: 2024,
                quarter: 1,
                col_name: "region_id",
                order_by: "ASC",
            },
            responseStatus: 200,
            responseMessage: "Get Facility Table Data.",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.LW,
                [comapnyDbAlias?.LW]: {
                    models: {
                        SummerisedFacilities: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    }
                },
            },
            testName: "should return 200 with not found message when no data exists",
            body: {
                region_id: 2,
                year: 2023,
                quarter: 2,
                col_name: "year",
                order_by: "DESC",
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.LW,
                [comapnyDbAlias?.LW]: {
                    models: {
                        SummerisedFacilities: {
                            findAll: jest.fn<any>().mockRejectedValue(new Error("Database error")),
                        },
                    }
                }
            },
            testName: "should return 500 when an error occurs in DB query",
            body: {
                region_id: 1,
                year: 2024,
                quarter: 3,
                col_name: "quarter",
                order_by: "ASC",
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

// Execute the test cases
commonTestFile(payload);
