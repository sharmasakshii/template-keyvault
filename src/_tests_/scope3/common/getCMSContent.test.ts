import { jest } from "@jest/globals";
import { commonTestFile } from "../commonTest";
import { comapnyDbAlias } from "../../../constant";
import HttpStatusMessage from "../../../constant/responseConstant";
import CommonController from "../../../controller/scope3/common/commonController";

const mockConnection = {
  company: comapnyDbAlias?.PEP,
  [comapnyDbAlias?.PEP]: {
    models: {
      CmsPages: {
        findOne: jest.fn<any>().mockResolvedValue([
          {
            dataValues: {
              id: 1,
              page_slug: "/knowledge-hub",
              content: "html",
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
  describeName: "Get Config constant",
  controller: CommonController,
  moduleName: "getCMSContent",
  testCases: [
    {
      status: true,
      mockConnection: mockConnection,
      testName: "should return 200 status when query fulfilled",
      responseStatus: 200,
      body: {
        page_slug: "/knowledge-hub",
      },
      responseMessage: "page detail.",
    },
    {
      status: true,
      mockConnection: {
        company: comapnyDbAlias?.PEP,
        [comapnyDbAlias?.PEP]: {
          models: {
            CmsPages: {
              findOne: jest.fn<any>().mockResolvedValue(null),
            },
          },
        },
      },
      body: {        
        page_slug: "/knowledge-hub",
      },
      testName: "should return a 200 status code and data if no data found",
      responseStatus: 200,
      responseMessage: HttpStatusMessage.NOT_FOUND,
    },
    {
      status: false,
      mockConnection: undefined,
      body: {
        page_slug: "/knowledge-hub",
      },
      testName: "should return 500 error ",
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
  ],
};

commonTestFile(payload);
