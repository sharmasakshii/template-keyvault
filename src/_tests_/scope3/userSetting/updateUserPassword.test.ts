import { jest } from "@jest/globals";
import { commonTestFile } from "../commonTest";
import UserSettingController from "../../../controller/scope3/userSettingController";
import HttpStatusMessage from "../../../constant/responseConstant";

const mockConnection = {
    main: {
        models: {
            User: {
                findOne: jest.fn<any>(),
            },
            UserPasswordLog: {
                findAll: jest.fn<any>(),
                create: jest.fn<any>(),
            },
        },
    },
    userData: { id: 123 }
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Update User Password Controller Tests",
    controller: UserSettingController,
    moduleName: "updateUserPassword",
    testCases: [
        {
            status: true,
            mockConnection: {
                main: {
                    models: {
                        User: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 123,
                                password: "$2b$12$8fsMHx3qQFv2IS/L5aV1VumpsAO9BlXDZDGdF6OoBRcmi1AJlD9Ia",
                                update: jest.fn<any>().mockResolvedValue({}),
                            }),
                        },
                        UserPasswordLog: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { old_password: "hashedPassword1" },
                                { old_password: "hashedPassword2" },
                            ]),
                            create: jest.fn<any>().mockResolvedValue({}),
                        },
                    },
                },
                userData: { id: 123 }
            },
            testName: "should return 200 and update the password successfully",
            body: {
                new_password: "U2FsdGVkX198O8Gu1F/d3w7zdluG6crDeb2mU+RMZrw=",
                old_password: "U2FsdGVkX1/dx79bxfOcRINoe6iyVRmGTKRmcoIsB1Q=",
            },
            responseStatus: 200,
            responseMessage: "Password Updated Successfully.",
        },
        {
            status: false,
            mockConnection: { ...mockConnection },
            testName: "should return 400 for validation errors",
            body: {},
            responseStatus: 400,
            responseMessage: "Validation Errors!",
        },
        {
            status: false,
            mockConnection: {
                ...mockConnection,
                main: {
                    ...mockConnection.main,
                    models: {
                        User: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 123,
                                password: "hashedOldPassword",
                            }),
                        },
                    },
                },
            },
            testName: "should return 400 for invalid new password format (too short)",
            body: {
                old_password: "U2FsdGVkX1/dx79bxfOcRINoe6iyVRmGTKRmcoIsB1Q=",
                new_password: "U2FsdGVkX1+7otXaG5ZPPH28RtAXVmeYmQREwd+DgHo=",
            },
            responseStatus: 400,
            responseMessage: "Invalid password format",
        },
      
        {
            status: false,
            mockConnection: {
                ...mockConnection,
                main: {
                    ...mockConnection.main,
                    models: {
                        User: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 123,
                                password: "hashedOldPassword",
                            }),
                        },
                    },
                },
            },
            testName: "should return 400 for invalid new password format (no uppercase)",
            body: {
                old_password: "U2FsdGVkX1/dx79bxfOcRINoe6iyVRmGTKRmcoIsB1Q=",
                new_password: "U2FsdGVkX185f6WnUeVag8bSdWAq9CXZ+i26rCwx3eo=",
            },
            responseStatus: 400,
            responseMessage: "Invalid password format",
        },
        {
            status: false,
            mockConnection: {
                ...mockConnection,
                main: {
                    ...mockConnection.main,
                    models: {
                        User: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 123,
                                password: "$2b$12$8fsMHx3qQFv2IS/L5aV1VumpsAO9BlXDZDGdF6OoBRcmi1AJlD9Ia",
                            }),
                        },
                        UserPasswordLog: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { old_password: "$2b$12$v.X03XOSREWdS8WxmDFjxOIjSymsAQG3/3.Dxd2t4cARelOddDN6a" },
                                { old_password: "$2b$12$v.X03XOSREWdS8WxmDFjxOIjSymsAQG3/3.Dxd2t4cARelOddDN6a" },
                            ]),
                        },
                    },
                },
            },
            testName: "should return 400 if the new password matches any of the last 5 passwords",
            body: {
                old_password: "U2FsdGVkX1/dx79bxfOcRINoe6iyVRmGTKRmcoIsB1Q=",
                new_password: "U2FsdGVkX180gItuAjdYKwrNeHN+BCuvGr/EgWvr1NM=",
            },
            responseStatus: 400,
            responseMessage: "Your new password must be different from your previous password.",
        },
        {
            status: false,
            mockConnection: {
                ...mockConnection,
                main: {
                    ...mockConnection.main,
                    models: {
                        User: {
                            findOne: jest.fn<any>().mockRejectedValue(new Error("Database error")),
                        },
                    },
                },
            },
            testName: "should return 500 if there is an error during processing",
            body: {
                new_password: "U2FsdGVkX198O8Gu1F/d3w7zdluG6crDeb2mU+RMZrw=",
                old_password: "U2FsdGVkX1/dx79bxfOcRINoe6iyVRmGTKRmcoIsB1Q=",
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
        {
            status: false,
            mockConnection: {
                ...mockConnection,
                main: {
                    ...mockConnection.main,
                    models: {
                        User: {
                            findOne: jest.fn<any>().mockResolvedValue(null),
                        },
                    },
                },
            },
            testName: "should return 200 if user is not found",
            body: {
                new_password: "U2FsdGVkX198O8Gu1F/d3w7zdluG6crDeb2mU+RMZrw=",
                old_password: "U2FsdGVkX1/dx79bxfOcRINoe6iyVRmGTKRmcoIsB1Q=",
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        }
    ]
};

commonTestFile(payload);
