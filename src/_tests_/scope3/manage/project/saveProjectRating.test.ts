import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import ProjectController from "../../../../controller/scope3/manage/projectContoller";

const mockConnection: any = {
  company: comapnyDbAlias?.PEP,
  [comapnyDbAlias?.PEP]: {
    models: {
      ProjectFeedback: {
        create: jest.fn(),
      },
    },
  },
  userData: {
    id: 1,
  },
};

const payload = {
  res: {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  },
  describeName: "Save Project Rating functionality",
  controller: ProjectController,
  moduleName: "saveProjectRating",
  testCases: [
    {
      status: true,
      mockConnection: {
        ...mockConnection,
        [comapnyDbAlias?.PEP]: {
          ...mockConnection[comapnyDbAlias?.PEP],
          models: {
            ...mockConnection[comapnyDbAlias?.PEP].models,
            ProjectFeedback: {
              create: jest.fn<any>().mockResolvedValue({
                dataValues: {
                  id: 1,
                  project_id: 10,
                  user_id: 1,
                  rating: 5,
                  description: "Great project",
                },
              }),
            },
          },
        },
      },
      testName: "should return a 200 status code and success message when rating is successfully submitted",
      body: {
        project_id: 10,
        description: "Great project",
        rating: 5,
      },
      responseStatus: 200,
      responseMessage: "Project Rating Submited Successfully.",
    },
    {
      status: true,
      mockConnection: {
        ...mockConnection,
        [comapnyDbAlias?.PEP]: {
          ...mockConnection[comapnyDbAlias?.PEP],
          models: {
            ...mockConnection[comapnyDbAlias?.PEP].models,
            ProjectFeedback: {
              create: jest.fn<any>().mockResolvedValue(null), // Simulate no data returned
            },
          },
        },
      },
      testName:
        "should return a 200 status code and not found message when no rating data is returned",
      body: {
        project_id: 10,
        description: "Great project",
        rating: 5,
      },
      responseStatus: 200,
      responseMessage: HttpStatusMessage.NOT_FOUND,
    },
    {
      status: false,
      mockConnection: {
        ...mockConnection,
        [comapnyDbAlias?.PEP]: {
          ...mockConnection[comapnyDbAlias?.PEP],
          models: {
            ProjectFeedback: {
              create: jest.fn<any>().mockRejectedValue(
                new Error("Database error")
              ), // Simulate database error
            },
          },
        },
      },
      testName:
        "should return a 500 status code and error message when a database error occurs",
      body: {
        project_id: 10,
        description: "Great project",
        rating: 5,
      },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
  ],
};

commonTestFile(payload);
