import { jest } from "@jest/globals";
import { commonTestFile } from "../commonTest";
import { comapnyDbAlias } from "../../../constant";
import HttpStatusMessage from "../../../constant/responseConstant";
import BenchmarkController from "../../../controller/scope3/benchmark/benchmarlController";


type TrendData = {
    dataValues: {
      company_intermodal_index: number;
      intermodal_index: number;
      month: string;
    };
  };
  
const baseMockConnection = {
    company: comapnyDbAlias?.PEP,
};

const regionMockData: TrendData[] = [
    {
        dataValues: {
            company_intermodal_index: 0.6,
            intermodal_index: 0.4,
            month: '01'
        }
    }
];

const laneMockData: TrendData[] = [
    {
        dataValues: {
            company_intermodal_index: 0.8,
            intermodal_index: 0.5,
            month: '02'
        }
    }
] as any

const mockConnection = {
    company: comapnyDbAlias.PEP,
    [comapnyDbAlias.PEP]: {
      models: {
        RegionBenchmarks: {
          findAll: jest.fn<() => Promise<TrendData[]>>().mockResolvedValue(regionMockData)
        },
        LaneBenchmarks: {
          findAll: jest.fn<() => Promise<TrendData[]>>().mockResolvedValue(laneMockData)
        }
      }
    }
  };

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Intermodal Trend Graph",
    controller: BenchmarkController,
    moduleName: "intermodelTrendGraph",
    testCases: [
        {
            extraParameter: { type: "region" },
            status: true,
            mockConnection: mockConnection,
            body: {
                region_id: 1,
                bound_type: "Inbound",
                year: 2024,
                quarter: 1,
                origin: null,
                dest: null
            },
            testName: "should return 200 with region intermodal trend data",
            responseStatus: 200,
            responseMessage: "Weight Band data.",
        },
        {
            extraParameter: { type: "lane" },
            status: true,
            mockConnection: mockConnection,
            body: {
                region_id: null,
                bound_type: null,
                year: 2024,
                quarter: 1,
                origin: "NY",
                dest: "CA"
            },
            testName: "should return 200 with lane intermodal trend data",
            responseStatus: 200,
            responseMessage: "Weight Band data.",
        },
        {
            extraParameter: { type: "region" },
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        RegionBenchmarks: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    },
                },
            },
            body: {
                region_id: 99,
                bound_type: "Inbound",
                year: 2024,
                quarter: 1,
                origin: null,
                dest: null
            },
            testName: "should return 200 with NOT_FOUND message if no data",
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            extraParameter: { type: "lane" },
            status: false,
            mockConnection: {
                ...baseMockConnection,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        LaneBenchmarks: undefined
                    }
                }
            },
            body: {
                region_id: null,
                bound_type: null,
                year: 2024,
                quarter: 1,
                origin: "TX",
                dest: "FL"
            },
            testName: "should return 500 when LaneBenchmarks model is undefined",
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        }
    ]
};

commonTestFile(payload);
