import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../../constant";
import FacilityOverviewController from "../../../../../controller/scope3/track/faciity/facilityOverviewController";
import { commonTestFile } from "../../../commonTest";
import HttpStatusMessage from "../../../../../constant/responseConstant";


// Mock the necessary functions and models

const mockConnection = {
    company: comapnyDbAlias?.LW,
    schema: "greensight_lowes",
    [comapnyDbAlias?.LW]: {
        models: {
            SummerisedFacilities: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: {
                            intensity: 96.9,
                            emission: 1429396.31,
                            total_ton_miles: 14756.56,
                            shipments: 5,
                            'facility.id': 14,
                            'facility.name': 'Pottsville, PA'
                        }
                    },
                ]),
                findOne: jest.fn<any>().mockResolvedValue(
                    {
                        dataValues: {
                            quarter:"2",
                            year: 96.9,
                            emission: 1429396.31,
                            total_ton_miles: 14756.56,
                            shipments: 5,
                            'facility.id': 14,
                            'facility.name': 'Pottsville, PA'
                        }
                    },
                ),
            },
            ConfigConstants: {
                findAll: jest.fn<any>().mockResolvedValue([
                  {
                    dataValues: {
                      config_key: "EMISSION_REDUCTION_TARGET_1_YEAR",
                      config_value: "10000",
                    },
                  },
                  {
                    dataValues: {
                      config_key: "EMISSION_REDUCTION_TARGET_1_YEAR",
                      config_value: "10000",
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
    describeName: "Fetch Facility emission reduction",
    controller: FacilityOverviewController,
    moduleName: 'getFacilityEmissionReductionGraph',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 with facility emission data when data exists",
            body: {
                facility_id: 1, year: 2024, toggel_data: 0, region_id: "2"
            },
            responseStatus: 200,
            responseMessage: "Emissions Reduction",
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
                facility_id: 1, year: 2024, toggel_data: 0, region_id: "2"
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
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
