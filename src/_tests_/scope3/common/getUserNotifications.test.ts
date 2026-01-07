import { jest } from "@jest/globals";
import { commonTestFile } from "../commonTest";
import { comapnyDbAlias } from "../../../constant";
import HttpStatusMessage from "../../../constant/responseConstant";
import CommonController from "../../../controller/scope3/common/commonController";

const mockConnection = {
  company: comapnyDbAlias?.LW,
  userData: { id: 1 },
  [comapnyDbAlias?.LW]: {
    models: {
      Notification: {
        findAll: jest.fn<any>().mockResolvedValue([
          {
            dataValues: {
              id: 3,
              sender_id: 1,
              receiver_id: null,
              description: "New Update Available! Refresh Application Now.",
              type: "APPUPDATE",
              is_read: false,
              is_deleted: false,
              created_on: "2024-01-29T08:40:36.630Z",
              updated_on: "2024-01-29T08:40:36.630Z",
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
  describeName: "Get User Notifications",
  controller: CommonController,
  moduleName: "getUserNotifications",
  testCases: [
    {
      status: true,
      mockConnection: mockConnection,
      testName: "should return 200 status when query fulfilled",
      responseStatus: 200,
      responseMessage: "notification list.",
    },
    {
      status: true,
      mockConnection: {
        company: comapnyDbAlias?.LW,
        userData: { id: 1 },
        [comapnyDbAlias?.LW]: {
          models: {
            Notification: {
              findAll: jest.fn<any>().mockResolvedValue([]),
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
      testName: "should return 500 error ",
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
  ],
};

commonTestFile(payload);
