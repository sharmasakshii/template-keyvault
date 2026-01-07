import { jest } from "@jest/globals";
import { commonTestFile } from "../commonTest";
import { comapnyDbAlias } from "../../../constant";
import HttpStatusMessage from "../../../constant/responseConstant";
import BenchmarkController from "../../../controller/scope3/benchmark/benchmarlController";

// Reusable mocks
const benchmarkCarrierMock = [
  {
    dataValues: {
      carrier: "C01",
      carrier_name: "CarrierA",
      carrier_logo: "logo",
    },
  },
];

const smartwayRankingMock = [
  {
    dataValues: {
      code: "C01",
      ranking: 1,
      year: 2023,
    },
  },
];

const emissionBandMock = [
  {
    dataValues: {
      industry_intensity: 0.3,
      company_intensity: 0.2,
    },
  },
];

const mockConnection:any = {
  company: comapnyDbAlias?.PEP,
  [comapnyDbAlias?.PEP]: {
    models: {
      BenchmarkCarriers: {
        findAll: jest
          .fn<any>()
          .mockImplementation(() => Promise.resolve(benchmarkCarrierMock)) // total_count
          .mockImplementation(() => Promise.resolve(benchmarkCarrierMock)), // paginated carriers
      },
      smartdataRanking: {
        findAll: jest.fn<any>().mockResolvedValue(smartwayRankingMock),
      },
      EmissionBands: {
        findAll: jest.fn<any>().mockResolvedValue(emissionBandMock),
      },
      LaneBenchmarks: {
        findAll: jest.fn<any>().mockResolvedValue(emissionBandMock),
      },
      RegionBenchmarks: {
        findAll: jest.fn<any>().mockResolvedValue(emissionBandMock),
      },
    },
  },
};

const payload = {
  res: {
    status: jest.fn<any>().mockReturnThis(),
    json: jest.fn<any>().mockReturnThis(),
  },
  describeName: "Carrier Emission Table",
  controller: BenchmarkController,
  moduleName: "carrierEmissionTable",
  testCases: [
    {
      extraParameter: { type: "mile" },
      status: true,
      testName: "should return 200 with emission table data for type 'mile'",
      mockConnection,
      body: {
        band_no: 1,
        toggle_data: 0,
        year: 2023,
        quarter: 1,
        type: "mile",
        low_emission: 1,
        page: 1,
        page_size: 10,
      },
      responseStatus: 200,
      responseMessage: "Lane Benchmarks data",
    },
    {
      extraParameter: { type: "lane" },
      status: true,
      testName: "should return 200 with emission table data for type 'lane'",
      mockConnection,
      body: {
        band_no: 1,
        toggle_data: 0,
        year: 2023,
        quarter: 1,
        type: "lane",
        origin: "NY",
        dest: "CA",
        low_emission: 1,
        page: 1,
        page_size: 10,
      },
      responseStatus: 200,
      responseMessage: "Lane Benchmarks data",
    },
    {
      extraParameter: { type: "region" },
      status: true,
      testName: "should return 200 with emission table data for type 'region'",
      mockConnection,
      body: {
        band_no: 1,
        toggle_data: 0,
        year: 2023,
        quarter: 1,
        type: "region",
        region_id: 5,
        bound_type: "inbound",
        low_emission: 0,
        page: 1,
        page_size: 10,
      },
      responseStatus: 200,
      responseMessage: "Lane Benchmarks data",
    },
    {
      extraParameter: { type: "weight" },
      status: true,
      testName: "should return 200 with not found when intensity is not available",
      mockConnection: {
        ...mockConnection,
        [comapnyDbAlias?.PEP]: {
          models: {
            ...mockConnection[comapnyDbAlias?.PEP].models,
            EmissionBands: {
              findAll: jest.fn<any>().mockResolvedValue(null), // no intensity data
            },
          },
        },
      },
      body: {
        band_no: 1,
        toggle_data: 0,
        year: 2023,
        quarter: 1,
        type: "weight",
        low_emission: 1,
        page: 1,
        page_size: 10,
      },
      responseStatus: 200,
      responseMessage: HttpStatusMessage.NOT_FOUND,
    },
    {
      status: false,
      testName: "should return 500 when there is an error",
      mockConnection: {
        company: comapnyDbAlias?.PEP,
        [comapnyDbAlias?.PEP]: {
          models: {
            BenchmarkCarriers: {
              findAll: jest.fn<any>().mockRejectedValue(new Error("DB Error")),
            },
          },
        },
      },
      body: {
        band_no: 1,
        toggle_data: 0,
        year: 2023,
        quarter: 1,
        type: "mile",
        low_emission: 1,
        page: 1,
        page_size: 10,
      },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
  ],
};

commonTestFile(payload);
