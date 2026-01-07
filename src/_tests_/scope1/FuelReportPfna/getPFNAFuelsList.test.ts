import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../constant";
import FuelsReportPFNAController from "../../../controller/scope1/fuelsReportPFNAController";
import HttpStatusMessage from "../../../constant/responseConstant";
import { commonTestFile } from "../../scope3/commonTest";

const mockCompanyModelsWithData = {
  FuelReportPfna: {
    findAll: jest.fn<any>().mockResolvedValue([
      {
        id: 1,
        fuel_name: "Diesel",
      },
      {
        id: 2,
        fuel_name: "Petrol",
      },
    ]),
  },
  FuelType: {}, // included via association, no need to mock separately since attributes are empty
};

const mockCompanyModelsWithNoData = {
  FuelReportPfna: {
    findAll: jest.fn<any>().mockResolvedValue([]),
  },
  FuelType: {},
};

const mockCompanyModelsWithError = {
  FuelReportPfna: {
    findAll: jest.fn<any>().mockRejectedValue(new Error("DB Error")),
  },
  FuelType: {},
};

const payload = {
  res: {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  },
  describeName: "PFNA Fuel Type List",
  controller: FuelsReportPFNAController,
  moduleName: "getPFNAFuelsList",
  testCases: [
    {
      testName: "should return 200 with fuel types when records are found",
      status: true,
      mockConnection: {
        company: comapnyDbAlias?.PEP,
        [comapnyDbAlias?.PEP]: {
          models: mockCompanyModelsWithData,
        },
      },
      responseStatus: 200,
      responseMessage: "List of all filters.",
    },
    {
      testName: "should return 200 with empty list when no data is found",
      status: true,
      mockConnection: {
        company: comapnyDbAlias?.PEP,
        [comapnyDbAlias?.PEP]: {
          models: mockCompanyModelsWithNoData,
        },
      },
      responseStatus: 200,
      responseMessage: "List of all filters.",
    },
    {
      testName: "should return 500 with internal server error when query fails",
      status: false,
      mockConnection: {
        company: comapnyDbAlias?.PEP,
        [comapnyDbAlias?.PEP]: {
          models: mockCompanyModelsWithError,
        },
      },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
  ],
};

commonTestFile(payload);
