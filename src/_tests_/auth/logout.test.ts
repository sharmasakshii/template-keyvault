import { jest } from "@jest/globals";

jest.mock("../../connectionDb/sequilizeSetup", () => ({
    __esModule: true,
    default: jest.fn()
}));
import { Model } from "sequelize-typescript";
import setupSequelize from "../../connectionDb/sequilizeSetup";
import HttpStatusMessage from "../../constant/responseConstant";
import { commonTestFile } from "../scope3/commonTest";
import AuthController from "../../controller/auth/authController";

const mockedSetupSequelize = setupSequelize as jest.MockedFunction<typeof setupSequelize>;
mockedSetupSequelize.mockResolvedValueOnce({
    models: {
        UserToken: Object.assign(class extends Model { }, {
            destroy: jest.fn<any>().mockResolvedValue(1),
        }),
    },
} as any).mockResolvedValueOnce({
    models: {
    },
} as any);

const payload = {
    res: {
        clearCookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Logout API",
    controller: AuthController,
    moduleName: "logout",
    testCases: [
        {
            status: true,
            testName: "should return 200 when user logs out successfully",
            cookie: {
                token: "Bearer dummy-token-123",
            },
            body: {},
            responseStatus: 200,
            responseMessage: "User Logout Successfully.",
        },
        {
            status: false,
            testName: "should return 400 if token is not provided",
            cookie: {
                token: "",
            },
            body: {},
            responseStatus: 400,
            responseMessage: "Token not provided",
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return 500 when an internal error occurs",
            cookie: {
                token: "Bearer dummy-token-123",
            },
            body: {},
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
