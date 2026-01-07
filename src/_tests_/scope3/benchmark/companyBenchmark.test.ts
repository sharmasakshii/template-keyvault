import { jest } from "@jest/globals";
import { commonTestFile } from "../commonTest";
import HttpStatusMessage from "../../../constant/responseConstant";
import BenchmarkController from "../../../controller/scope3/benchmark/benchmarlController";
import { comapnyDbAlias } from "../../../constant";

const mockMileBandsResult = [{
  dataValues: {
    industry_intensity: 1.2,
    company_intensity: 0.9,
    industry_shipments: 10000,
    company_shipment: 8000,
    industry_lane_count: 120,
    company_lane_count: 95,
  }
}];

const mockInterModelResult = [{
  dataValues: {
    company_intermodal_index: 0.75,
    intermodal_index: 0.65,
  }
}];

const payload = {
  res: {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  },
  describeName: "Company Benchmark",
  controller: BenchmarkController,
  moduleName: "companyBenchmark",
  testCases: [
    {
      testName: "should return 200 with lane benchmark data",
      status: true,
      body: {
        band_no: 1,
        toggle_data: 1,
        year: 2024,
        quarter: "Q1",
        type: "mile",
      },
      extraParameter: {},
      mockConnection: {
        company: comapnyDbAlias.PEP,
        [comapnyDbAlias.PEP]: {
          models: {
            EmissionBands: {
              findAll:  jest.fn<any>().mockResolvedValueOnce(mockMileBandsResult)
                .mockResolvedValueOnce(mockInterModelResult),
            }
          }
        }
      },
      responseStatus: 200,
      responseMessage: "Lane Benchmarks data",
    },
    {
      testName: "should return 200 with NOT_FOUND when no mileBands",
      status: true,
      body: {
        band_no: 1,
        toggle_data: 1,
        year: 2024,
        quarter: "Q1",
        type: "mile",
      },
      extraParameter: {},
      mockConnection: {
        company: comapnyDbAlias.PEP,
        [comapnyDbAlias.PEP]: {
          models: {
            EmissionBands: {
              findAll: jest.fn<any>().mockResolvedValueOnce(null), // No mileBands data
            }
          }
        }
      },
      responseStatus: 200,
      responseMessage: HttpStatusMessage.NOT_FOUND,
    },
    {
      testName: "should return 200 with NOT_FOUND when no interModelIndex",
      status: true,
      body: {
        band_no: 1,
        toggle_data: 1,
        year: 2024,
        quarter: "Q1",
        type: "mile",
      },
      extraParameter: {},
      mockConnection: {
        company: comapnyDbAlias.PEP,
        [comapnyDbAlias.PEP]: {
          models: {
            EmissionBands: {
              findAll: jest.fn<any>().mockResolvedValueOnce(mockMileBandsResult)
                .mockResolvedValueOnce(null), // No interModelIndex data
            }
          }
        }
      },
      responseStatus: 200,
      responseMessage: HttpStatusMessage.NOT_FOUND,
    },
    {
      testName: "should return 500 when exception is thrown",
      status: false,
      body: {
        band_no: 1,
        toggle_data: 1,
        year: 2024,
        quarter: "Q1",
        type: "mile",
      },
      extraParameter: {},
      mockConnection: {
        company: comapnyDbAlias.PEP,
        [comapnyDbAlias.PEP]: {
          models: {
            EmissionBands: {
              findAll: jest.fn<any>().mockRejectedValue(new Error("DB error")),
            }
          }
        }
      },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
  ],
};

commonTestFile(payload);
