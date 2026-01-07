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
            BenchmarkDates: {
                findAll: jest.fn<any>().mockResolvedValue([{ dataValues: { average_intensity: 2321323 } }])
            },
            SummerisedFacilities: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        facility: {
                            name: "sfdf"
                        },
                        dataValues: {
                            intensity: 96.9,
                            average_intensity: 111,
                            emission: 1429396.31,
                            total_ton_miles: 14756.56,
                            shipments: 5,
                            'facility.id': 14,
                            'facility.name': 'Pottsville, PA'
                        }
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
    describeName: "Fetch Facility comparision ",
    controller: FacilityOverviewController,
    moduleName: 'getFacilityComparison',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 with facility emission data when data exists",
            body: {
                facility_id: 1, region_id: 1, year: 2022, quarter: 1
            },
            responseStatus: 200,
            responseMessage: "Vendor Emissions",
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
                facility_id: 1, region_id: "2", year: 2022, quarter: 1
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
