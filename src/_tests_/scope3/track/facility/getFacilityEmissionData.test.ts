import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import FacilityController from "../../../../controller/scope3/track/faciity/facilityController";
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
                        intensity: 96.9,
                        emission: 1429396.31,
                        'facility.name': 'Pottsville, PA'
                    }
                ])
            },
            ConfigConstants: {
                findAll: jest.fn<any>().mockResolvedValue([
                  {
                    dataValues: {
                      config_key: "graph_contributor_color",
                      config_value: "#215254",
                    },
                  },
                  {
                    dataValues: {
                      config_key: "graph_detractor_color",
                      config_value: "#d8856b",
                    },
                  },
                  {
                    dataValues: {
                      config_key: "graph_medium_color",
                      config_value: "#929597",
                    },
                  },
                ]),
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
  describeName: "Get Facility Emission Data Tests",
  controller: FacilityController,
  moduleName: "getFacilityEmissionData",
  testCases: [
    {
      status: true,
      mockConnection: mockConnection,
      testName: "should return 200 with processed facility emission data when data exists",
      body: {
        region_id: 1,
        year: 2024,
        quarter: 1,
        toggel_data: 1,
      },
      responseStatus: 200,
      responseMessage: "Facility Emissions Data.",
    },
    {
      status: true,
      mockConnection: {
        company: comapnyDbAlias?.LW,
    [comapnyDbAlias?.LW]: {
        models: {
            SummerisedFacilities: {
                findAll: jest.fn<any>().mockResolvedValue([])
            },
            ConfigConstants: {
                findAll: jest.fn<any>().mockResolvedValue([]),
              }
            }
    },
      },
      testName: "should return 200 with not found message when no data exists",
      body: {
        region_id: 2,
        year: 2023,
        quarter: 2,
        toggel_data: 0,
      },
      responseStatus: 200,
      responseMessage: HttpStatusMessage.NOT_FOUND,
    },
    {
      status: false,
      mockConnection: {
        company: comapnyDbAlias?.PEP,
        main: {
          models: {
            SummerisedFacilities: {
              findAll: jest.fn<any>().mockRejectedValue(new Error("DB error")), // Simulate DB error
            },
          },
        },
      },
      testName: "should return 500 when an error occurs in DB query",
      body: {
        region_id: 3,
        year: 2025,
        quarter: 3,
        toggel_data: 1,
      },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
  ],
};

// Execute the test cases
commonTestFile(payload);
