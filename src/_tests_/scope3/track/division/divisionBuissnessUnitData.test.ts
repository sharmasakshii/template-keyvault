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
            data: 10.5,
            name: "Business Unit 1",
          },
        ]),
      },
      BusinessUnit: {
        findOne: jest.fn<any>().mockResolvedValue({
          id: 1,
          name: "Business Unit 1",
        }),
      },
    },
  },
};

const payload = {
  res: {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  },
  describeName: "Get Division Business Unit Data",
  controller: DivisionController,
  moduleName: "divisionBuissnessUnitData",
  testCases: [
    {
      status: true,
      mockConnection: mockConnection,
      testName: "should return 200 status with business unit data when query is successful",
      body: { division_id: 1, year: 2023, quarter: 1, time_id: 4 },
      responseStatus: 200,
      responseMessage: "By Division graph data",
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
          },
        },
      },
      testName: "should return 200 status with no record found if no data is available",
      body: { division_id: 1, year: 2023, quarter: 1, time_id: 4 },
      responseStatus: 200,
      responseMessage: HttpStatusMessage.NOT_FOUND,
    },
    {
      status: false,
      mockConnection: {
        company: comapnyDbAlias?.PEP,
        [comapnyDbAlias?.PEP]: {
        },
      },
      testName: "should return 500 status when there is an internal server error",
      body: { division_id: 1, year: 2023, quarter: 1, time_id: 4 },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
  ],
};

commonTestFile(payload);
