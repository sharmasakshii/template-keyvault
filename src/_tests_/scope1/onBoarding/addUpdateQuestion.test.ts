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
                create: jest.fn<any>().mockResolvedValue([]),
                findOne: jest.fn<any>().mockResolvedValue(null)
            },
            OnboardingSteps: {
                findAll: jest.fn<any>().mockResolvedValue([{ test: "222" }])
            },
            UserScopeStatus: {
                create: jest.fn<any>().mockResolvedValue([]),
                findAll: jest.fn<any>().mockResolvedValue([{ test: "222" }])
            },
            ScopeOnboardingAnswers: {
                bulkCreate: jest.fn<any>().mockResolvedValue([{ id: 1 }]),
                destroy: jest.fn<any>().mockResolvedValue([]),
                findAll: jest.fn<any>().mockResolvedValue([{ dataValues: { id: 1 } }])
            }
        },
        query: jest.fn<any>().mockResolvedValue([
            {
                "step_id": 1,
                "step_code": "step_1",
                "step_name": "1",
                "is_completed": null,
                "step_heading": null,
                "questions": "[{\"question\":\"What industry does your company operate in?\",\"is_required\":true,\"question_type_id\":1232,\"question_type\":\"Text\",\"question_id\":143221,\"options\":[{\"option_id\":3987654,\"value\":\" \"}]},{\"question\":\"Do you operate in multiple countries?\",\"is_required\":true,\"question_type_id\":1324,\"question_type\":\"Radio\",\"question_id\":213243,\"default_answers\":[{\"user_option_id\":9876433,\"answer_text\":\"Yes\"}],\"options\":[{\"option_id\":9876433,\"value\":\"Yes\"},{\"option_id\":2323312,\"value\":\"No\"}]},{\"question\":\"List any specific frameworks or regulatory requirements that you will need to comply with:\",\"is_required\":false,\"question_type_id\":1232,\"question_type\":\"Text\",\"question_id\":312324,\"options\":[{\"option_id\":3214432,\"value\":\"\"}]},{\"question\":\"Do you have an existing system or process for emissions reporting?\",\"is_required\":true,\"question_type_id\":1324,\"question_type\":\"Radio\",\"question_id\":512345,\"default_answers\":[{\"user_option_id\":4545342,\"answer_text\":\"No\"}],\"options\":[{\"option_id\":2343434,\"value\":\"Yes\"},{\"option_id\":4545342,\"value\":\"No\"}]},{\"question\":\"Do you have sample data that you can share from each scope 1 category?\",\"is_required\":true,\"question_type_id\":1324,\"question_type\":\"Radio\",\"question_id\":413246,\"default_answers\":[{\"user_option_id\":8190224,\"answer_text\":\"Yes\"}],\"options\":[{\"option_id\":8190224,\"value\":\"Yes\"},{\"option_id\":8112932,\"value\":\"No\"}]}]"
            },
        ])
    },
};
const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Scope 1 question add update",
    controller: OnBoardController,
    moduleName: 'addUpdateAnswer',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 status when  data found",
            body:{

                "scope_id": 1,

                "step_id": "step_1",

                "question": [

                    {

                        "question_id": 143221,

                        "option_id": [

                            {

                                "id": "3987654",

                                "text": "Test"

                            }

                        ]

                    },

                    {

                        "question_id": 213243,

                        "option_id": [

                            {

                                "id": 9876433,

                                "text": "Yes"

                            }

                        ]

                    },

                    {

                        "question_id": 312324,

                        "option_id": [

                            {

                                "id": "3214432",

                                "text": "Test"

                            }

                        ]

                    },

                    {

                        "question_id": 512345,

                        "option_id": [

                            {

                                "id": 4545342,

                                "text": "No"

                            }

                        ]

                    },

                    {

                        "question_id": 413246,

                        "option_id": [

                            {

                                "id": 8190224,

                                "text": "Yes"

                            }

                        ]

                    }

                ]

            },
            responseStatus: 200,
            responseMessage: "Completed step successfully",
        },
       
        {
            status: false,
            mockConnection: mockConnection,
            testName: "validation on exceed length of question",
            body:{

                "scope_id": 1,

                "step_id": "step_1",

                "question": [

                    {

                        "question_id": 143221,

                        "option_id": [

                            {

                                "id": "3987654",

                                "text": "Test"

                            }

                        ]

                    },

                    {

                        "question_id": 213243,

                        "option_id": [

                            {

                                "id": 9876433,

                                "text": "Yes"

                            }

                        ]

                    },

                    {

                        "question_id": 312324,

                        "option_id": [

                            {

                                "id": "3214432",

                                "text": "Test"

                            }

                        ]

                    },

                    {

                        "question_id": 512345,

                        "option_id": [

                            {

                                "id": 4545342,

                                "text": "No"

                            }

                        ]

                    },

                    {

                        "question_id": 413246,

                        "option_id": [

                            {

                                "id": 8190224,

                                "text": "Yes"

                            }

                        ]

                    },
                    {

                        "question_id": 413246,

                        "option_id": [

                            {

                                "id": 8190224,

                                "text": "Yes"

                            }

                        ]

                    }

                ]

            },
            responseStatus: 400,
            responseMessage: "You cannot answer more than 5 questions for this step.",
        },
        {
            status: false,
            mockConnection: mockConnection,
            testName: "validation when not give ans on required question",
            body:{

                "scope_id": 1,

                "step_id": "step_1",

                "question": [

                    {

                        "question_id": 143221,

                        "option_id": [

                            {

                                "id": "3987654",

                                "text": "Test"

                            }

                        ]

                    },

                    {

                        "question_id": 213243,

                        "option_id": [

                            {

                                "id": 9876433,

                                "text": "Yes"

                            }

                        ]

                    },

                    {

                        "question_id": 312324,

                        "option_id": [

                            {

                                "id": "3214432",

                                "text": "Test"

                            }

                        ]

                    },

                    {

                        "question_id": 512345,

                        "option_id": [

                            {

                                "id": 4545342,

                                "text": "No"

                            }

                        ]

                    },
                ]

            },
            responseStatus: 400,
            responseMessage: "Please provide inputs on required questions.",
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                userData: {
                    companies: [{ is_onboarded: 1 }],
                },
                ["main"]: {
                    models: {
                        CompanyOnboardingStatus: {
                            findOne: jest.fn<any>().mockResolvedValue({ test: "sds" })
                        }
                    },
                },
            },
            testName: "if already onboarded ",
            body: { scope_id: 12 },
            responseStatus: 400,
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
                        },
                    },
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
            responseMessage: "Scope onboarding is not yet complete. You’ll be able to access Scope dashboard once the admin finalizes the onboarding process.",
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return 500 error ",
            query: new Error("Database connection error"),
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ]
}

commonTestFile(payload)


