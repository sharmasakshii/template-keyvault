import { jest } from "@jest/globals";
import { commonTestFile } from "../commonTest";
import { comapnyDbAlias } from "../../../constant";
import HttpStatusMessage from "../../../constant/responseConstant";
import CommonController from "../../../controller/scope3/common/commonController";

const mockConnection = {
  company: comapnyDbAlias?.PEP,
  [comapnyDbAlias?.PEP]: {
    models: {
      LaneRadiusConfig: {
        findAll: jest.fn<any>().mockResolvedValue([
          {
            dataValues: {
              fuel_type: "Petrol",
              radius: 10,
            },
          },
          {
            dataValues: {
              fuel_type: "Diesel",
              radius: 20,
            },
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
  describeName: "Get Config Fuel Radius",
  controller: CommonController,
  moduleName: "getAllConfigFuelRadius",
  testCases: [
    {
      status: true,
      mockConnection: mockConnection,
      testName: "should return 200 status with transformed data when query is successful",
      responseStatus: 200,
      responseMessage: "Fuel radius list",
    },
    {
      status: true,
      mockConnection: {
        company: comapnyDbAlias?.PEP,
        [comapnyDbAlias?.PEP]: {
          models: {
            LaneRadiusConfig: {
              findAll: jest.fn<any>().mockResolvedValue([]), // No data scenario
            },
          },
        },
      },
      testName: "should return 200 status with not found message if no data is found",
      responseStatus: 200,
      responseMessage: HttpStatusMessage.NOT_FOUND
    },
    {
      status: false,
      mockConnection: {
        company: comapnyDbAlias?.LW,
      }, // Simulating authentication failure
      testName: "should return 400 status when user does not have access",
      responseStatus: 400,
      responseMessage: "You don't have access for this route"
    },
    {
      status: false,
      mockConnection: {
        company: comapnyDbAlias?.PEP,
        [comapnyDbAlias?.PEP]: {
            models: {
              LaneRadiusConfig: undefined
            },
          }, // Simulate failure in the company model
      },
      testName: "should return 500 status when there is an internal server error",
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR
    },
  ],
};

commonTestFile(payload);
