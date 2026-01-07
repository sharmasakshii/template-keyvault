import { jest } from "@jest/globals";
import { commonTestFile } from "../commonTest";
import HttpStatusMessage from "../../../constant/responseConstant";
import UserSettingController from "../../../controller/scope3/userSettingController";

const mockConnection = {
    main: {
        models: {
            User: {
                findOne: jest.fn<any>().mockResolvedValue({
                    dataValues: {
                        email: "test@example.com",
                        profile: {
                            first_name: "John",
                            last_name: "Doe",
                            country_code: "+1",
                            image: "profile.jpg",
                            phone_number: "1234567890",
                            title: "Manager",
                        },
                        companies: [
                            {
                                dataValues: {
                                    UserCompany: { dataValues: { company_id: 1 } },
                                    name: "Company A",
                                    db_alias: "company_a",
                                    logo: "logo.png",
                                    slug: "company-a",
                                    is_onboarded: true,
                                },
                            },
                        ],
                    },
                }),
            },
            CompanyOnboardingStatus: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        is_onboarded: true,
                        scope: { code: "ONBOARDING_STEP_1", name: "Step 1" },
                    },
                    {
                        is_onboarded: false,
                        scope: { code: "ONBOARDING_STEP_2", name: "Step 2" },
                    },
                ]),
            },
        },
    },
    userData: { id: 123 },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "User Detail Controller Tests",
    controller: UserSettingController,
    moduleName: "userDetail",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return a 200 status code and user details if query is successful",
            responseStatus: 200,
            responseMessage: "User Profile",
            expectedResponse: {
                email: "test@example.com",
                profile: {
                    first_name: "John",
                    last_name: "Doe",
                    country_code: "+1",
                    image: "profile.jpg",
                    phone_number: "1234567890",
                    title: "Manager",
                },
                Company: {
                    name: "Company A",
                    db_alias: "company_a",
                    logo: "logo.png",
                    slug: "company-a",
                    is_onboarded: true,
                },
                ONBOARDING_STEP_1: true,
                ONBOARDING_STEP_2: false,
            },
        },
        {
            status: true,
            mockConnection: {
                main: {
                    models: {
                        User: {
                            findOne: jest.fn<any>().mockResolvedValue(null),
                        },
                        CompanyOnboardingStatus: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    is_onboarded: true,
                                    scope: { code: "ONBOARDING_STEP_1", name: "Step 1" },
                                },
                                {
                                    is_onboarded: false,
                                    scope: { code: "ONBOARDING_STEP_2", name: "Step 2" },
                                },
                            ]),
                        },
                    },
                },
                userData: { id: 123 }
            },
            testName: "should return a 200 status code and NOT_FOUND message if user is not found",
            responseStatus: 200,
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
                userData: { id: 123 },
            },
            testName: "should return a 500 error if an exception is thrown",
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
