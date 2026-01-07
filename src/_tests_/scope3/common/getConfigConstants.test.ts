import { jest } from "@jest/globals";
import { commonTestFile } from "../commonTest";
import { comapnyDbAlias } from "../../../constant";
import HttpStatusMessage from "../../../constant/responseConstant";
import CommonController from "../../../controller/scope3/common/commonController";

const mockConnection = {
  company: comapnyDbAlias?.PEP,
  [comapnyDbAlias?.PEP]: {
    models: {
      ConfigConstants: {
        findAll: jest.fn<any>().mockResolvedValue([
          {
            dataValues: {
              config_key: "EMISSION_REDUCTION_TARGET_1",
              config_value: "-22",
            },
          },
        ]),
      },
      SummerisedEmission: {
        findOne: jest.fn<any>().mockResolvedValue([
          {
            dataValues: { year: "2023", quarter: "2" },
          },
        ]),
        findAll: jest.fn<any>().mockResolvedValue([
          
       { year: "2023", quarter: "2" },
          
        ]),
      },
      TimePeriod: {
        count: jest.fn<any>().mockResolvedValue(4),
        findOne: jest.fn<any>().mockResolvedValue(
          
       { current_period: "P4" },
          
        ),
      }
    },
  },
};

const payload = {
  res: {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  },
  describeName: "Get Config constant",
  controller: CommonController,
  moduleName: "getConfigConstants",
  testCases: [
    {
      status: true,
      mockConnection: mockConnection,
      testName: "should return 200 status when query fulfilled",
      responseStatus: 200,
      responseMessage: "Config Constants Data.",
    },
    {
      status: true,
      mockConnection: {
        company: comapnyDbAlias?.PEP,
        [comapnyDbAlias?.PEP]: {
          models: {
            ConfigConstants: {
              findAll: jest.fn<any>().mockResolvedValue([]),
            },
            SummerisedEmission: {
              findOne: jest.fn<any>().mockResolvedValue([]),
            },
          },
        },
      },
      testName: "should return a 200 status code and data if no data found",
      responseStatus: 200,
      responseMessage: HttpStatusMessage.NOT_FOUND,
    },
    {
      status: false,
      mockConnection: undefined,
      testName: "should return 500 error",
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
    {
      status: true,
      mockConnection: mockConnection,
      testName: "should calculate targetValues when targetValues is true",
      body: {
          region_id: 1,
          division_id: 1,
          targetValues: true
      },
      responseStatus: 200,
      responseMessage: "Config Constants Data.",
      responseValidation: (response:any) => {
        expect(response).toHaveProperty("data.EMISSION_REDUCTION_TARGET_2");
        expect(response).toHaveProperty("data.GAP_TO_TARGET");
      },
    },
  ],
};

commonTestFile(payload);
