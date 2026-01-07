import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import DivisionController from "../../../../controller/scope3/track/division/divisionController";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";

const mockConnection = {
  company: comapnyDbAlias?.PEP,
  [comapnyDbAlias?.PEP]: {
    models: {
      SummerisedBusinessUnit: {
        findAll: jest.fn<any>().mockResolvedValue([
          {
            dataValues: {
              intensity: 12.34,
              emissions: 1500000,
              cost: 500000,
              shipment_count: 20,
              region_id: 1,
              "region.id": 1,
              "region.name": "North America",
            },
          },
        ]),
      },
      Region:{
      },
      BusinessUnit:{},
      ConfigConstants: {
        findAll: jest.fn<any>().mockResolvedValue([
          { dataValues: { config_key: "contributor_color", config_value: "#019d52" } },
          { dataValues: { config_key: "detractor_color", config_value: "#d8856b" } },
          { dataValues: { config_key: "medium_color", config_value: "#ffcc00" } },
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
  describeName: "Get Division Region Comparison Table Data",
  controller: DivisionController,
  moduleName: "getDivisionRegionComparisonTable",
  testCases: [
    {
      status: true,
      mockConnection: mockConnection,
      testName: "should return 200 status with region comparison data when query is successful",
      body: {
        region_id: 1,
        year: 2023,
        quarter: 2,
        division_id: 5,
        time_id: 4,
        dataType: "region",
      },
      responseStatus: 200,
      responseMessage: "Get Carrier Region Table Data",
    },
    {
      status: true,
      mockConnection: mockConnection,
      testName: "should return 200 status with business comparison data when query is successful",
      body: {
        year: 2023,
        quarter: 3,
        division_id: 2,
        dataType: "business",
      },
      responseStatus: 200,
      responseMessage: "Get Carrier Region Table Data",
    },
    {
      status: false,
      mockConnection: {
        company: comapnyDbAlias?.PEP,
        [comapnyDbAlias?.PEP]: {},
      },
      testName: "should return 500 status when there is an internal server error",
      body: {
        region_id: 1,
        year: 2023,
        quarter: 1,
        division_id: 3,
        time_id: 4,
        dataType: "region",
      },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
  ],
};

commonTestFile(payload);
