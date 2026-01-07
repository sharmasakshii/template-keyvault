import { jest } from "@jest/globals";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import FuelVehicleTrailerController from "../../../../controller/scope3/track/commonFuelVehicleTrailer/commonControllerFuelVehicle";

const mockConnection = {
  company: comapnyDbAlias?.ADM,
  [comapnyDbAlias?.ADM]: {
    models: {
        FuelType: {
            findOne: jest.fn<any>().mockResolvedValue([
           { dataValues: { name: 'DIESEL' }},    
            ]),
      },
      Emission: {
        findAll: jest.fn<any>().mockResolvedValue([
          {
            dataValues: {
                intensity: 210.79973024789916,
                emissions: 0.752555036985,
                shipment_count: 3,
                name: 'BELOIT, WI_CAMANCHE, IA',
                average_intensity: 88.50917869879457,
                average_emission: 0.30086702511454855
              },         
             },
             
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

    },
  },
};

const payload = {
  res: {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  },
  describeName: "By fuel vehicle overview ",
  controller: FuelVehicleTrailerController,
  moduleName: "getLaneBreakdown",
  testCases: [
    {
      status: true,
      mockConnection: mockConnection,
      testName: "should return 200 status when query fulfilled",
      body:{
        "region_id": "",
        "fetch_id": "1",
        "year": 2024,
        "quarter": 0,
        "tableName": "FuelType"
    },
      responseStatus: 200,
      responseMessage: "Vendor Emissions",
    },
    {
      status: false,
      mockConnection: undefined,
      testName: "should return 500 error ",
      body: {
        "region_id": "",
        "fetch_id": "1",
        "year": 2024,
        "quarter": 0,
        "tableName": "FuelType"
    },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
  ],
};

commonTestFile(payload);
