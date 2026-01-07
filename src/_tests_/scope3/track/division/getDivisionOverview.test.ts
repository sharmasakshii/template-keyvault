import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import DivisionController from "../../../../controller/scope3/track/division/divisionController";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";

const mockConnection = {
  company: comapnyDbAlias?.PEP,
  [comapnyDbAlias?.PEP]: {
    models: {
      SummerisedBusinessUnit: {
        findAll: jest.fn<any>().mockResolvedValue([
          {
            dataValues: {
              intensity: 10.5,
              emissions: 1000000,
              shipment_count: 500,
            },
          },
        ]),
      },
      BusinessUnitDivision: {
        findOne: jest.fn<any>().mockResolvedValue({
          id: 1,
          name: "Division 1",
        }),
      },
      BenchmarkDates:{
        findAll: jest.fn<any>().mockResolvedValue([{average_intensity:12.3, dataValues:{average_intensity:12.3}}])
    }
    },
  },
};

const payload = {
  res: {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  },
  describeName: "Get Division Overview",
  controller: DivisionController,
  moduleName: "getDivisionOverview",
  testCases: [
    {
      status: true,
      mockConnection: mockConnection,
      testName: "should return 200 status with division overview when query is successful",
      body: { division_id: 1, region_id: 2, year: 2023, quarter: 1, time_id: 4 },
      responseStatus: 200,
      responseMessage: "Division Emissions",
    },
    {
      status: true,
      mockConnection: {
        ...mockConnection,
        [comapnyDbAlias?.PEP]: {
          models: {
            SummerisedBusinessUnit: {
              findAll: jest.fn<any>().mockResolvedValue([]),
            },
            BusinessUnitDivision: {
              findOne: jest.fn<any>().mockResolvedValue(null),
            },
            BenchmarkDates:{
                findAll: jest.fn<any>().mockResolvedValue([{}])
            }
          },
        },
      },
      testName: "should return 200 status with no record found if no data is available",
      body: { division_id: 1, region_id: 2, year: 2023, quarter: 1, time_id: 4 },
      responseStatus: 200,
      responseMessage: "No Record Found",
    },
    {
      status: false,
      mockConnection: {
        company: comapnyDbAlias?.PEP,
        [comapnyDbAlias?.PEP]: {
          models: {
            SummerisedBusinessUnit: undefined,
          },
        },
      },
      testName: "should return 500 status when there is an internal server error",
      body: { division_id: 1, region_id: 2, year: 2023, quarter: 1, time_id: 4 },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
  ],
};

commonTestFile(payload);
