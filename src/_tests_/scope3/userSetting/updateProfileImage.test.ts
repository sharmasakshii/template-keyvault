import { jest } from "@jest/globals";
import { commonTestFile } from "../commonTest";
import HttpStatusMessage from "../../../constant/responseConstant";
import UserSettingController from "../../../controller/scope3/userSettingController";

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Update Profile Image Controller Tests",
    controller: UserSettingController,
    moduleName: "updateProfileImage",
    testCases: [
        {
            status: true,
            mockConnection: {
                main: {
                    models: {
                        Profile: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                update: jest.fn<any>().mockResolvedValue({})
                            }),
                        },
                    },
                },
                userData: { id: 123 }
            },
            testName: "should return 200 and update profile image successfully",
            body: {
                fileName: "profile123.jpg",
                updateValues: {
                    image_count: 3,
                },
            },
            responseStatus: 200,
            responseMessage: "Profile Image Uploaded Successfully.",
        },
        {
            status: false,
            mockConnection: {
                main: {
                    models: {
                        Profile: {
                            findOne: jest.fn<any>().mockResolvedValue(null),
                        },
                    },
                },
                userData: { id: 123 }
            },
            testName: "should return 400 when profile not found",
            body: {
                fileName: "profile123.jpg",
                updateValues: {
                    image_count: 3,
                },
            },
            responseStatus: 400,
            responseMessage: "Error while Uploading Image!",
        },
        {
            status: false,
            mockConnection: {
                main: {
                    models: {
                        Profile: {
                            findOne: jest.fn<any>().mockRejectedValue(new Error("DB error")),
                        },
                    },
                },
                userData: { id: 123 }
            },
            testName: "should return 500 on internal server error",
            body: {
                fileName: "profile123.jpg",
                updateValues: {
                    image_count: 3,
                },
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
