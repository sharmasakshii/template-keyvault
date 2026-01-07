import { jest } from "@jest/globals";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import FuelVehicleTrailerController from "../../../../controller/scope3/track/commonFuelVehicleTrailer/commonControllerFuelVehicle";

const mockConnection = {
  company: comapnyDbAlias?.ADM,
  [comapnyDbAlias?.ADM]: {
    models: {
      SummerisedFuelType: {
        findAll: jest.fn<any>().mockResolvedValue([
          {
            intensity: 89.3,
            emission: 489510649.8613669,
            fuel_type_id: 1,
            "fuelType.name": "DIESEL",
          },
          {
            intensity: 16.3,
            emission: 164888.10539500002,
            fuel_type_id: 4,
            "fuelType.name": "CNG",
          },
          {
            intensity: 12.7,
            emission: 22422008.051173,
            fuel_type_id: 2,
            "fuelType.name": "B20",
          },
        ]),
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
      },
    },
  },
};

const payload = {
  res: {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  },
  describeName: "By fuel graph data",
  controller: FuelVehicleTrailerController,
  moduleName: "graphData",
  testCases: [
    {
      status: true,
      mockConnection: mockConnection,
      testName: "should return 200 status when query fulfilled",
      body: {
        year: 2024,
        quarter: 0,
        toggle_data: 0,
        tableName: "FuelType",
        regionId: "",
      },
      responseStatus: 200,
      responseMessage: "By FuelType graph data",
    },
    {
      status: false,
      mockConnection: {
        company: comapnyDbAlias?.ADM,
        [comapnyDbAlias?.ADM]: {
          models: {
            SummerisedFuelType: {
              findAll: jest.fn<any>().mockResolvedValue([]),
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
            },
          },
        },
      },
      body: {
        year: 2024,
        quarter: 0,
        toggle_data: 0,
        tableName: "FuelType",
        regionId: "",
      },
      testName: "should return a 200 status code and data if no data found",
      responseStatus: 200,
      responseMessage: HttpStatusMessage.NOT_FOUND,
    },
    {
      status: false,
      mockConnection: undefined,
      testName: "should return 500 error ",
      body: {
        year: 2024,
        quarter: 0,
        toggle_data: 0,
        tableName: "FuelType",
        regionId: "",
      },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
  ],
};

commonTestFile(payload);
