import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import DivisionController from "../../../../controller/scope3/track/division/divisionController";

// ─── Mock DB Connection ─────────────────────────────────────────────

const mockConnection = {
  company: comapnyDbAlias?.PEP,
  [comapnyDbAlias?.PEP]: {
    models: {
      SummerisedBusinessUnit: {
        findAll: jest.fn<any>().mockResolvedValue([
          {
            intensity: 100,
            emission: 1000000,
            "businessUnitDivision.id": 1,
            "businessUnitDivision.name": "Division A",
          },
          {
            intensity: 50,
            emission: 500000,
            "businessUnitDivision.id": 2,
            "businessUnitDivision.name": "Division B",
          },
        ]),
      },
      BusinessUnitDivision: {},
      ConfigConstants: {
        findAll: jest.fn<any>().mockResolvedValue([
          {
            dataValues: {
              config_key: "graph_contributor_color",
              config_value: "#1f77b4",
            },
          },
          {
            dataValues: {
              config_key: "graph_detractor_color",
              config_value: "#ff7f0e",
            },
          },
          {
            dataValues: {
              config_key: "graph_medium_color",
              config_value: "#2ca02c",
            },
          },
        ]),
      },
    },
  },
};

// ─── Payload for Test Cases ─────────────────────────────────────────

const payload = {
  res: {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  },
  describeName: "Get Division Emission Data",
  controller: DivisionController,
  moduleName: "getDivisionEmissionData",
  testCases: [
    {
      status: true,
      mockConnection: mockConnection,
      testName:
        "should return 200 with valid emission data when toggel_data = 0",
      body: {
        division_id: 1,
        year: 2024,
        quarter: 1,
        time_id: 4,
        region_id: 10,
        toggel_data: 0,
      },
      responseStatus: 200,
      responseMessage: "Division Emissions.",
    },
    {
      status: true,
      mockConnection: mockConnection,
      testName:
        "should return 200 with valid emission data when toggel_data = 1",
      body: {
        division_id: 2,
        year: 2024,
        quarter: 2,
        time_id: 5,
        region_id: 20,
        toggel_data: 1,
      },
      responseStatus: 200,
      responseMessage: "Division Emissions.",
    },
    {
      status: false,
      mockConnection: {
        company: comapnyDbAlias?.PEP,
        [comapnyDbAlias?.PEP]: {},
      },
      testName: "should return 500 when connection or models are missing",
      body: {
        division_id: 3,
        year: 2024,
        quarter: 3,
        time_id: 6,
        region_id: 30,
        toggel_data: 0,
      },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
  ],
};

// ─── Run Common Test ────────────────────────────────────────────────

commonTestFile(payload);
