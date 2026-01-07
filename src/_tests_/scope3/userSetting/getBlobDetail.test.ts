import { jest } from "@jest/globals";
import { commonTestFile } from "../commonTest";
import HttpStatusMessage from "../../../constant/responseConstant";
import UserSettingController from "../../../controller/scope3/userSettingController";

jest.mock("@azure/storage-blob", () => ({
    BlobServiceClient: {
        fromConnectionString: jest.fn(() => ({
            getContainerClient: jest.fn(() => ({
               url:"blagssgdsjkf"
            }))
        }))
    },
    StorageSharedKeyCredential:jest.fn(),
    generateBlobSASQueryParameters:jest.fn(() => ({
        url:"blagssgdsjkf"
     })),
    ContainerSASPermissions:{
        parse: jest.fn(() => ({
           url:"blagssgdsjkf"
        }))
    }
}))

const payload = {
  res: {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  },
  describeName: "Get Blob Detail Controller Tests",
  controller: UserSettingController,
  moduleName: "getBlobDetail",
  testCases: [
    {
      status: true,
      testName: "should return 200 and blob details",
      mockConnection: {
        main: {
          models: {
            Profile: {
              findOne: jest.fn<any>().mockResolvedValue({
                dataValues: {
                  profile_image_count: 2,
                  updatedAt: new Date(),
                  oneHourAgo: new Date(Date.now() - 30 * 60 * 1000), 
                },
              }),
            },
          },
        },
        company: "pepsi",
        userData: { id: 101 },
      },
      body: {
        isProfile: true,
        fileSize: 1024 * 1024 * 2, // 2MB
        fileMimeType: "image/png",
      },
      responseStatus: 200,
      responseMessage: "Blob container details",
    },
    {
      status: false,
      testName: "should return 400 when file size exceeds limit",
      mockConnection: {
        main: {
          models: {
            Profile: {
              findOne: jest.fn(),
            },
          },
        },
        company: "pepsi",
        userData: { id: 101 },
      },
      body: {
        isProfile: false,
        fileSize: 6 * 1024 * 1024, // 6MB
        fileMimeType: "image/jpeg",
      },
      responseStatus: 400,
      responseMessage: "Profile picture size exceeds the limit of 5 MB.",
    },
    {
      status: false,
      testName: "should return 400 for invalid file type",
      mockConnection: {
        main: {
          models: {
            Profile: {
              findOne: jest.fn(),
            },
          },
        },
        company: "pepsi",
        userData: { id: 101 },
      },
      body: {
        isProfile: false,
        fileSize: 1024 * 1024 * 2,
        fileMimeType: "application/pdf",
      },
      responseStatus: 400,
      responseMessage: "Invalid file format. Only JPEG, JPG, and PNG formats are allowed.",
    },
    {
      status: false,
      testName: "should return 400 when too many upload attempts within an hour",
      mockConnection: {
        main: {
          models: {
            Profile: {
              findOne: jest.fn<any>().mockResolvedValue({
                dataValues: {
                  profile_image_count: 5,
                  updatedAt: new Date(),
                  oneHourAgo: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
                },
              }),
            },
          },
        },
        company: "pepsi",
        userData: { id: 101 },
      },
      body: {
        isProfile: true,
        fileSize: 1024 * 1024,
        fileMimeType: "image/png",
      },
      responseStatus: 400,
      responseMessage: "Exceeded maximum attempts in the last 60 minutes.",
    },
    {
      status: false,
      testName: "should return 500 on internal server error",
      mockConnection: {
        main: {
          models: {
            Profile: {
              findOne: jest.fn<any>().mockRejectedValue(new Error("Unexpected DB error")),
            },
          },
        },
        company: "pepsi",
        userData: { id: 101 },
      },
      body: {
        isProfile: true,
        fileSize: 1024 * 1024,
        fileMimeType: "image/png",
      },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
  ],
};

commonTestFile(payload);
