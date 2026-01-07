import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import CarrierController from "../../../../controller/scope3/track/carrier/carrierController";

const mockConnection = {
  company: comapnyDbAlias.PEP,
  [comapnyDbAlias.PEP]: {
    models: {
      Emission: {
        findAll: jest.fn<any>().mockResolvedValue([
          {
            dataValues: {
              average_intensity: 0.123,
              average_emission: 1.456,
            },
          },
        ]),
      },
      ConfigConstants: {
        findAll: jest.fn<any>().mockResolvedValue([
          {
            dataValues: {
              config_key: "contributor_color",
              config_value: "#00FF00",
            },
          },
          {
            dataValues: {
              config_key: "detractor_color",
              config_value: "#FF0000",
            },
          },
          {
            dataValues: {
              config_key: "medium_color",
              config_value: "#AAAAAA",
            },
          },
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
  describeName: "Get lane breakdown data",
  controller: CarrierController,
  moduleName: "getLaneBreakdown",
  testCases: [
    {
      status: true,
      mockConnection: mockConnection,
      testName: "should return 200 with lane breakdown data",
      body: {
        id: "carrier123",
        region_id: 1,
        year: 2023,
        quarter: 1,
        toggel_data: 0,
        division_id: 1,
        time_id: 1,
      },
      responseStatus: 200,
      responseMessage: "Lane break down data",
    },
    {
        status: true,
        mockConnection: mockConnection,
        testName: "should return 200 with lane breakdown data",
        body: {
          id: "carrier123",
          region_id: 1,
          year: 2023,
          quarter: 1,
          toggel_data: 1,
          division_id: 1,
          time_id: 1,
        },
        responseStatus: 200,
        responseMessage: "Lane break down data",
      },
    {
      status: false,
      mockConnection: undefined,
      testName: "should return 500 when there is an internal server error",
      body: {
        id: "carrier123",
        region_id: 1,
        year: 2023,
        quarter: 1,
        toggel_data: 0,
        division_id: 1,
        time_id: 1,
      },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
  ],
};

commonTestFile(payload);
