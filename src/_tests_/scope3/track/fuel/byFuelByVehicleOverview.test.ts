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
          {dataValues: { intensity: 89.3 }}
        ]),
      },
      BenchmarkDates: {
        findAll: jest.fn<any>().mockResolvedValue([
          {
            dataValues: { average_intensity: 93.352018 },
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
  moduleName: "overviewData",
  testCases: [
    {
      status: true,
      mockConnection: mockConnection,
      testName: "should return 200 status when query fulfilled",
      body: {
        region_id: "",
        fetch_id: "1",
        year: 2024,
        quarter: 0,
        tableName: "FuelType",
      },
      responseStatus: 200,
      responseMessage: "Vendor Emissions",
    },
    {
      status: false,
      mockConnection: undefined,
      testName: "should return 500 error ",
      body: {
        region_id: "",
        fetch_id: "1",
        year: 2024,
        quarter: 0,
        tableName: "FuelType",
      },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
  ],
};

commonTestFile(payload);
