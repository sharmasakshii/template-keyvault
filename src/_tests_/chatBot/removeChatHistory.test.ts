import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../constant";
import ChatBotController from "../../controller/chatbot/chatbotController";
import HttpStatusMessage from "../../constant/responseConstant";
import { commonTestFile } from "../scope3/commonTest";

const mockConnection: any = {
    userData: { id: 1 },
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            AIAgentChatHistory: {
                update: jest.fn<any>().mockResolvedValue([1]), // Simulating 1 row updated
            },
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Remove Chat History",
    controller: ChatBotController,
    moduleName: "removeChatHistory",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when chat history is removed successfully",
            body: { chatId: 1 },
            responseStatus: 200,
            responseMessage: "Chat history removed successfully.",
        },
        {
            status: false,
            mockConnection: {
                userData: { id: 1 },
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        AIAgentChatHistory: {
                            update: jest.fn<any>().mockResolvedValue([0]), // Simulating 1 row updated
                        },
                    },
                },
            },
            testName: "should return 200 when no matching chat history is found",
            body: { chatId: 99 },
            responseStatus: 200,
            responseMessage: "No matching chat history found or already removed.",
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: { chatId: 1 },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
        {
            status: false,
            mockConnection: mockConnection,
            testName: "should return 400 when chatId is missing",
            body: {},
            responseStatus: 400,
            responseMessage: "Chat ID(s) are required.",
        },
    ],
};

jest.mock("axios");
commonTestFile(payload);
