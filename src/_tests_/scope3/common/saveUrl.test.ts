import { jest } from "@jest/globals";
import { commonTestFile } from "../commonTest";
import HttpStatusMessage from "../../../constant/responseConstant";
import CommonController from "../../../controller/scope3/common/commonController";

const mockConnection = {
  userData: {
    id: 1, // Simulated user ID
  },
  main: {
    models: {
      UserAnalytics: {
        create: jest.fn<any>().mockResolvedValue({}),
      },
    },
  },
};

const payload = {
  res: {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  },
  describeName: "Save URL Analytics",
  controller: CommonController,
  moduleName: "saveUrl",
  testCases: [
    {
      status: true,
      mockConnection: mockConnection,
      testName: "should return 200 status when URL is saved successfully",
      requestHeaders: {
        "x-forwarded-for": "192.168.0.1",
      },
      body: {
        url: "/some/path",
      },
      responseStatus: 200,
      responseMessage: "URL saved successfully.",
    },
    {
      status: false,
      mockConnection: mockConnection,
      testName: "should return 400 status when validation fails",
      requestHeaders: {},
      body: {}, // Empty body to simulate validation failure
      responseStatus: 400,
      responseMessage: "URL not provided",
    },
    {
      status: false,
      mockConnection: undefined, // Simulate missing connection
      testName: "should return 500 status when there is an internal server error",
      requestHeaders: {},
      body: {
        url: "/some/path",
      },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
    {
      status: false,
      mockConnection: {
        ...mockConnection,
        main: {
          models: {
            UserAnalytics: {
              create: jest.fn<any>().mockRejectedValue(new Error("Database error")),
            },
          },
        },
      },
      testName: "should return 500 status when database operation fails",
      requestHeaders: {
        "x-forwarded-for": "192.168.0.1",
      },
      body: {
        url: "/some/path",
      },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
  ],
};

commonTestFile(payload);
