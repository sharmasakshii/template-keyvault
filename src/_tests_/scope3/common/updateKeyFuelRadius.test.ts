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
            },
          },
          {
            dataValues: {
              fuel_type: "Diesel",
            },
          },
        ]),
      },
      ConfigConstants: {
        update: jest.fn<any>().mockResolvedValue([]), // Mock update function
      },
    },
  },
};

const payload = {
  res: {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  },
  describeName: "Update Fuel Radius Key",
  controller: CommonController,
  moduleName: "updateKeyFuelRadius",
  testCases: [
    {
      status: true,
      mockConnection: mockConnection,
      testName: "should return 200 status when fuel radius keys are updated successfully",
      requestBody: {
        Petrol_radius: 15,
        Diesel_radius: 20,
      },
      responseStatus: 200,
      responseMessage: "Fuel radius key updated succesfully",
    },
    {
      status: true,
      mockConnection: {
        company: comapnyDbAlias?.PEP,
        [comapnyDbAlias?.PEP]: {
          models: {
            LaneRadiusConfig: {
              findAll: jest.fn<any>().mockResolvedValue([]), // Simulate no fuel type found
            },
            ConfigConstants: {
              update: jest.fn<any>().mockResolvedValue([]), // No rows updated
            },
          },
        },
      },
      testName: "should return 200 status even when no fuel type is matched",
      requestBody: {
        Petrol_radius: 15, // Assume no Petrol type in DB
      },
      responseStatus: 200,
      responseMessage: "Fuel radius key updated succesfully",
    },
    {
      status: false,
      mockConnection: undefined, // Simulate authentication failure
      testName: "should return 500 status when there is an internal server error",
      requestBody: {
        Petrol_radius: 15,
      },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
    {
      status: false,
      mockConnection: {
        company: comapnyDbAlias?.PEP,
        [comapnyDbAlias?.PEP]: {
          models: {
            LaneRadiusConfig: {
              findAll: jest.fn<any>().mockRejectedValue(new Error("Database error")), // Simulate DB error
            },
            ConfigConstants: {
              update: jest.fn(),
            },
          },
        },
      },
      testName: "should return 500 status when there's a database error",
      requestBody: {
        Petrol_radius: 15,
      },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
  ],
};

commonTestFile(payload);
