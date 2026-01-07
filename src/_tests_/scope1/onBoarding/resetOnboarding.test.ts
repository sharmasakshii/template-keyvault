import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../constant";
import HttpStatusMessage from "../../../constant/responseConstant";
import { commonTestFile } from "../../scope3/commonTest";
import OnBoardController from "../../../controller/scope1/onBoard";

const mockConnection = {
    company: comapnyDbAlias?.PEP,
    userData: {
        companies: [{ is_onboarded: 0, UserCompany: { company_id: 1 } }],
    },

    ["main"]: {
        models: {
            CompanyOnboardingStatus: {
                destroy: jest.fn()
            },
            ScopeOnboardingAnswers: {
                destroy: jest.fn()
            },
            UserScopeStatus: {
                destroy: jest.fn()
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
    describeName: "Scope 1 reset onboarding",
    controller: OnBoardController,
    moduleName: 'resetOnboarding',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 status when  data found",
            body: { scope_id: 12 },
            responseStatus: 200,
            responseMessage: "Reset onboarding ",
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


