import { jest } from "@jest/globals";
import { commonTestFile } from "../commonTest";
import { comapnyDbAlias } from "../../../constant";
import HttpStatusMessage from "../../../constant/responseConstant";
import FuelLocationsController from "../../../controller/scope3/fuelLocationsController";

const mockConnection = {
  company: comapnyDbAlias?.PEP,
  ["main"]: {
    models: {
      ProductType: {
        findAll: jest.fn<any>().mockResolvedValue([
          {
              id: 1,
              name: "Fuel Provider 1",
              code: "FP1",
            }
        ]),
      },
    }
},
};

const payload = {
  res: {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  },
  describeName: "Get Fuel Stop Providers",
  controller: FuelLocationsController,
  moduleName: "getFuelStopProviders",
  testCases: [
    {
      status: true,
      mockConnection: mockConnection,
      testName: "should return 200 status with list of fuel stop providers when query is successful",
      responseStatus: 200,
      responseMessage: "All providers."
    },
    {
      status: true,
      mockConnection: {
        company: comapnyDbAlias?.PEP,
        ["main"]: {
          models: {
            ProductType: {
              findAll: jest.fn<any>().mockResolvedValue([]),
            },
          },
      },
      },
      testName: "should return 200 status with no providers found message if no data is found",
      responseStatus: 200,
      responseMessage: "No fuel stop providers found.",
    },
    {
      status: false,
      mockConnection: {
        company: comapnyDbAlias?.PEP,
        ["main"]: {
          models: {
            ProductType: undefined
          },
      },
      },
      testName: "should return 500 status when there is an internal server error",
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
  ],
};

commonTestFile(payload);
