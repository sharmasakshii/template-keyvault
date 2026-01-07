import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../constant";
import HttpStatusMessage from "../../../constant/responseConstant";
import { commonTestFile } from "../../scope3/commonTest";
import OnBoardController from "../../../controller/scope1/onBoard";

const mockConnection = {
    company: comapnyDbAlias?.PEP,
    userData: {
        companies: [{ is_onboarded: 0 }],
        permissionsData: [
            {
                "id": 1,
                "title": "Administrator Access",
                "parent_id": 0,
                "slug": "ADA",
                "isChecked": true,
                "child": [
                    {
                        "id": 2,
                        "title": "User Management",
                        "parent_id": 1,
                        "slug": "USM",
                        "isChecked": true,
                        "child": []
                    },
                    {
                        "id": 3,
                        "title": "Data Management",
                        "parent_id": 1,
                        "slug": "DAM",
                        "isChecked": true,
                        "child": []
                    }
                ]
            },

        ],
    },

    ["main"]: {
        models: {
            CompanyOnboardingStatus: {
                findOne: jest.fn<any>().mockResolvedValue(null)
            }
        },
        query: jest.fn<any>().mockResolvedValue([{ test: "xacaca" }])
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Scope 1 fuel consumption",
    controller: OnBoardController,
    moduleName: 'onBoardingQuestionList',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 status when  data found",
            body: { scope_id: 12 },
            responseStatus: 200,
            responseMessage: "Onboarding question list",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                userData: {
                    companies: [{ is_onboarded: 0 }],
                    permissionsData: [
                        {
                            "id": 1,
                            "title": "Administrator Access",
                            "parent_id": 0,
                            "slug": "ADA",
                            "isChecked": true,
                            "child": [
                                {
                                    "id": 2,
                                    "title": "User Management",
                                    "parent_id": 1,
                                    "slug": "USM",
                                    "isChecked": true,
                                    "child": []
                                },
                                {
                                    "id": 3,
                                    "title": "Data Management",
                                    "parent_id": 1,
                                    "slug": "DAM",
                                    "isChecked": true,
                                    "child": []
                                }
                            ]
                        },

                    ],
                },
                ["main"]: {
                    models: {
                        CompanyOnboardingStatus: {
                            findOne: jest.fn<any>().mockResolvedValue(null)
                        }
                    },
                    query: jest.fn<any>().mockResolvedValue([])
                },
            },
            testName: "should return 200 status when  no data found",
            body: { scope_id: 12 },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                userData: {
                    companies: [{ is_onboarded: 1 }],
                },
                ["main"]: {
                    models: {
                        CompanyOnboardingStatus: {
                            findOne: jest.fn<any>().mockResolvedValue({test:"sds"})
                        }
                    },
                },
            },
            testName: "if already onboarded ",
            body: { scope_id: 12 },
            responseStatus: 200,
            responseMessage: "Onboarded process is already completed",
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                ["main"]: {
                    models: {
                        CompanyOnboardingStatus: {
                            findOne: jest.fn<any>().mockResolvedValue(null)
                        }
                    },
                    query: jest.fn<any>().mockResolvedValue([{ test: "xacaca" }])
                },
                userData: {
                    companies: [{ is_onboarded: 0 }],
                    permissionsData: [
                        {
                            "id": 1,
                            "title": "Administrator Access",
                            "parent_id": 0,
                            "slug": "ADA",
                            "isChecked": false,
                            "child": [
                                {
                                    "id": 2,
                                    "title": "User Management",
                                    "parent_id": 1,
                                    "slug": "USM",
                                    "isChecked": false,
                                    "child": []
                                },
                                {
                                    "id": 3,
                                    "title": "Data Management",
                                    "parent_id": 1,
                                    "slug": "DAM",
                                    "isChecked": false,
                                    "child": []
                                }
                            ]
                        },
                    ],
                },
            },
            testName: "if non admin access ",
            body: { scope_id: 12 },
            responseStatus: 400,
            responseMessage: "Onboarding question only shown for admin",
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return 500 error ",
            query: new Error("Database connection error"),
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        }
    ]
}

commonTestFile(payload)


