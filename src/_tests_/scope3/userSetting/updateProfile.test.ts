import { jest } from "@jest/globals";
import { commonTestFile } from "../commonTest";
import HttpStatusMessage from "../../../constant/responseConstant";
import UserSettingController from "../../../controller/scope3/userSettingController";


const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Update Profile Controller Tests",
    controller: UserSettingController,
    moduleName: "updateProfile",
    testCases: [
        {
            status: true,
            mockConnection: {
                main: {
                    models: {
                        User: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 123,
                                dataValues: {
                                    profile: {
                                        first_name: "John",
                                        last_name: "Doe",
                                        phone_number: "1234567890",
                                        title: "Manager",
                                    },
                                },
                                update: jest.fn<any>().mockResolvedValue({}),
                            }),
                        },
                        Profile: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                update: jest.fn<any>().mockResolvedValue({}),
                            }),
                        },
                    },
                },
            userData: { id: 123 }
            },
            testName: "should return 200 and update user profile successfully",
            body: {
                first_name: "John",
                last_name: "Smith",
                phone_number: "9876543210",
                title: "Senior Manager",
            },
            responseStatus: 200,
            responseMessage: "User Profile Updated.",
        },
        {
            status: false,
            mockConnection: {
                main: {
                    models: {
                        User: {
                            findOne: jest.fn<any>().mockResolvedValue(null),
                        },
                    },
                },
                userData: { id: 123 }
            },
            testName: "should return 404 if user is not found",
            body: {
                first_name: "John",
                last_name: "Smith",
                phone_number: "9876543210",
                title: "Senior Manager",
            },
            responseStatus: 404,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: {
                main: {
                    models: {
                        User: {
                            findOne: jest.fn<any>().mockRejectedValue(new Error("Database error")),
                        },
                    },
                },
                userData: { id: 123 }
            },
            testName: "should return 500 if there is an error during processing",
            body: {
                first_name: "John",
                last_name: "Smith",
                phone_number: "9876543210",
                title: "Senior Manager",
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
        {
            status: false,
            mockConnection: { 
                main: {
                    models: {
                        User: {
                            findOne: jest.fn<any>(),
                        },
                        Profile: {
                            findOne: jest.fn<any>(),
                        },
                    },
                },
                userData: { id: 123 }
            },
            testName: "should return 400 for validation errors",
            body: {
                first_name: "",
                last_name: "",
                phone_number: "abcd",
                title: "",
            },
            responseStatus: 400,
            responseMessage: "Validation Errors!",
        },
    ],
};

commonTestFile(payload);
