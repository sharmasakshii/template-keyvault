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
              {  dataValues: {
                    region_id: 1,
                    intensity: 83.80595109371161,
                    emission: 2516646.946541,
                    cost: 2516646.946541,
                    shipment_count: 56,
                    Region: []
                  },}
                 
            ]),
          },
      ConfigConstants: {
        findAll: jest.fn<any>().mockResolvedValue([
            {
                dataValues: {
                config_key: 'benchmark_freight_default_lane',
                config_value: '-22'
              },
            }
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
  describeName: "By fuel vehicle graph data ",
  controller: FuelVehicleTrailerController,
  moduleName: "RegionData",
  testCases: [
    {
      status: true,
      mockConnection: mockConnection,
      testName: "should return 200 status when query fulfilled",
      body: {
        fetch_id: "1",
        year: 2024,
        quarter: 0,
        order_by: "desc",
        col_name: "intensity",
        region_id: "",
        tableName: "FuelType"
    },
      responseStatus: 200,
      responseMessage: "Get Carrier Region Table Data",
    },
    {
      status: true,
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
                    config_key: 'benchmark_freight_default_lane',
                    config_value: '-22'
                  },
                }
              ]),
            },
          },
        },
      },
      body: {
        fetch_id: "1",
        year: 2024,
        quarter: 0,
        order_by: "desc",
        col_name: "intensity",
        region_id: "",
        tableName: "FuelType"
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
        fetch_id: "1",
        year: 2024,
        quarter: 0,
        order_by: "desc",
        col_name: "intensity",
        region_id: "",
        tableName: "FuelType"
    },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
  ],
};

commonTestFile(payload);
