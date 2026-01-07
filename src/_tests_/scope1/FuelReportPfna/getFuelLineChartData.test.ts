import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../constant";
import HttpStatusMessage from "../../../constant/responseConstant";
import FuelsReportPfnaPagesController from "../../../controller/scope1/fuelsReportPfnaPagesController";
import { commonTestFile } from "../../scope3/commonTest";

const mockCompanyModelsWithData = {
    PfnaTransactions: {
    findAll: jest.fn<any>().mockResolvedValue([
      {
        fuel_name: "Diesel",
        fuel_color: "#000000",
        total_gallons: 1200,
        period_id: 1,
        period_name: "Q1",
      },
      {
        fuel_name: "Diesel",
        fuel_color: "#000000",
        total_gallons: 900,
        period_id: 2,
        period_name: "Q2",
      },
    ]),
  }
};

const mockCompanyModelsWithNoData = {
    PfnaTransactions: {
    findAll: jest.fn<any>().mockResolvedValue([]),
  }
};

const mockCompanyModelsWithError = {
    PfnaTransactions: {
    findAll: jest.fn<any>().mockRejectedValue(new Error("DB Error")),
  }
};

const payload = {
  res: {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  },
  describeName: "Fuel Emissions Line Chart",
  controller: FuelsReportPfnaPagesController,
  moduleName: "getFuelLineChartData",
  testCases: [
    {
      testName: "should return 200 with line chart data",
      status: true,
      extraParameter: { graph: "consumption" },
      body: {
        year: 2024,
        period_id: 1,
        supplier: "ABC Corp",
        transport_id: 101,
        slug: "bulk",
      },
      mockConnection: {
        company: comapnyDbAlias.PEP,
        [comapnyDbAlias.PEP]: {
          models: mockCompanyModelsWithData,
        },
      },
      responseStatus: 200,
      responseMessage: "Fuel emissions report metrics data.",
    },
    {
      testName: "should return 200 with empty data and periods when no records found",
      status: true,
      extraParameter: { graph: "consumption" },
      body: {
        year: 2024,
        period_id: 2,
        supplier: "XYZ Corp",
        transport_id: 102,
        slug: "bulk",
      },
      mockConnection: {
        company: comapnyDbAlias.PEP,
        [comapnyDbAlias.PEP]: {
          models: mockCompanyModelsWithNoData,
        },
      },
      responseStatus: 200,
      responseMessage: "Fuel emissions report metrics data.",
    },
    {
      testName: "should return 500 if DB throws error",
      status: false,
      extraParameter: { graph: "emissions" },
      body: {
        year: 2024,
        period_id: 3,
        supplier: "Error Corp",
        transport_id: 103,
        slug: "bulk",
      },
      mockConnection: {
        company: comapnyDbAlias.PEP,
        [comapnyDbAlias.PEP]: {
          models: mockCompanyModelsWithError,
        },
      },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
    {
      testName: "should return 400 if constant data not found",
      status: false,
      extraParameter: { graph: "consumption" },
      body: {
        year: 2024,
        period_id: 3,
        supplier: "ABC Corp",
        transport_id: 104,
        slug: "invalid-slug",
      },
      mockConnection: {
        company: comapnyDbAlias.PEP,
        [comapnyDbAlias.PEP]: {
          models: mockCompanyModelsWithData,
        },
      },
      responseStatus: 400,
      responseMessage: "Paylod missing",
    },
  ],
};

commonTestFile(payload);
