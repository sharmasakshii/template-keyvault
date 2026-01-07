import { jest } from "@jest/globals";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import ProjectController from "../../../../controller/scope3/manage/projectContoller";

const mockConnection = {
  company: comapnyDbAlias?.LW,
  [comapnyDbAlias?.LW]: {
    models: {
      Project: {
        findAll: jest.fn<any>().mockResolvedValue([
          {
            dataValues: {
              project_name: "gsdgx",
              project_unique_id: "jPKc6OzUK2",
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
  describeName: "Get project search listing ",
  controller: ProjectController,
  moduleName: "getProjectSearchList",
  testCases: [
    {
      status: true,
      mockConnection: mockConnection,
      testName: "should return 200 status when query fulfilled",
      body: {
        region_id: "",
      },
      responseStatus: 200,
      responseMessage: "Project Search listing fetched Successfully",
    },
    {
      status: true,
      mockConnection: {
        company: comapnyDbAlias?.LW,
        [comapnyDbAlias?.LW]: {
            models: {
                Project: {
                  findAll: jest.fn<any>().mockResolvedValue([]),
                },
              },
        },
      },
      body: {
        region_id: 23,
      },
      testName: "should return a 200 status code and data if no data found",
      responseStatus: 200,
      responseMessage: HttpStatusMessage.NOT_FOUND,
    },
    {
      status: false,
      mockConnection: undefined,
      testName: "should return 500 error ",
      body: {
        region_id: "",
      },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
  ],
};

commonTestFile(payload);
