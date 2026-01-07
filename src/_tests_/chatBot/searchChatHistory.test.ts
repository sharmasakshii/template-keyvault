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
                findAll: jest.fn<any>().mockResolvedValue([
                    { id: 1, question: "What is AI?" },
                    { id: 2, question: "How does machine learning work?" }
                ]),
            },
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Search Chat History",
    controller: ChatBotController,
    moduleName: "searchChatHistory",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when search results are retrieved successfully",
            body: { search: "AI", limit: 10 },
            responseStatus: 200,
            responseMessage: "Search results retrieved successfully.",
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: { search: "error" },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

jest.mock("axios");
commonTestFile(payload);
