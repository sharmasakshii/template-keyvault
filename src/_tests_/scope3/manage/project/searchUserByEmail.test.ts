import { jest } from "@jest/globals";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import ProjectController from "../../../../controller/scope3/manage/projectContoller";

const mockConnection: any = {
  userData:{companies: [{ db_alias: "company_db" }]},
  main: {
    models: {
      User: {
        findAll: jest.fn(),
      },
      Company: {
        findAll: jest.fn(),
      },
    },
  },
};

const payload = {
  res: {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  },
  describeName: "Search User by Email functionality",
  controller: ProjectController,
  moduleName: "searchUserByEmail",
  testCases: [
    {
      status: true,
      mockConnection: {
        ...mockConnection,
        main: {
          ...mockConnection.main,
          models: {
            ...mockConnection.main.models,
            User: {
              findAll: jest.fn<any>().mockResolvedValue([
                { id: 1, name: "John Doe", email: "test@example.com" },
              ]),
            },
          },
        },
      },
      testName: "should return a list of users when email matches",
      body: { email: "test@example.com" },
      responseStatus: 200,
      responseMessage: "List of Users.",
      responseData: [
        { id: 1, name: "John Doe", email: "test@example.com" },
      ],
    },
    {
      status: true,
      mockConnection: {
        ...mockConnection,
        main: {
          ...mockConnection.main,
          models: {
            ...mockConnection.main.models,
            User: {
              findAll: jest.fn<any>().mockResolvedValue([]),
            },
          },
        },
      },
      testName: "should return NOT_FOUND when no users match the email",
      body: { email: "nonexistent@example.com" },
      responseStatus: 200,
      responseMessage: HttpStatusMessage.NOT_FOUND,
    },
    {
      status: false,
      mockConnection: {
        ...mockConnection,
        main: {
          ...mockConnection.main,
          models: {
            User: {
              findAll: jest.fn<any>().mockRejectedValue(
                new Error("Database error")
              ),
            },
          },
        },
      },
      testName:
        "should return INTERNAL_SERVER_ERROR when a database error occurs",
      body: { email: "error@example.com" },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
  ],
};

commonTestFile(payload);
