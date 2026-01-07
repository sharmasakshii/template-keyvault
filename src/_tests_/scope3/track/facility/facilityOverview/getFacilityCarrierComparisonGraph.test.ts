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
                            average_intensity: 212323,
                            average_emission: 2131232,
                            carrier_name: "qweqwdasc_dcacsac",
                            quarter: "2",
                            year: 96.9,
                            emission: 1429396.31,
                            total_ton_miles: 14756.56,
                            shipment_count: 22132,
                            shipments: 5,
                            'facility.id': 14,
                            'facility.name': 'Pottsville, PA'
                        }
                    },
                ]),
            },
            ConfigConstants: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: {
                            config_key: "graph_contributor_color",
                            config_value: "dasdsa!#",
                        },
                    },
                    {
                        dataValues: {
                            config_key: "graph_detractor_color",
                            config_value: "321e1cas#",
                        },
                    },
                    {
                        dataValues: {
                            config_key: "graph_medium_color",
                            config_value: "#929597",
                        },
                    },
                ]),
            },
            Facility: {
                findOne: jest.fn<any>().mockResolvedValue(
                    {
                        dataValues: {
                            name: "Asdasfdsadasfa"
                        }
                    },
                ),
            },
            CarrierEmissions: {
                findAll: jest.fn<any>().mockResolvedValue([])
            }

        }
    },
};

// Define payload for testing
const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Fetch Facility comparision  data  ",
    controller: FacilityOverviewController,
    moduleName: 'getFacilityCarrierComparisonGraph',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 with facility emission outbound data when data exists",
            body: {
                facility_id: 1, region_id: 1, year: 2022, quarter: 1, toggel_data: 1
            },
            responseStatus: 200,
            responseMessage: "Carrier Emissions",
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
