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
            AIAgentTitle: {
                findAndCountAll: jest.fn<any>().mockResolvedValue({
                    count: 2,
                    rows: [
                        { title_id: 1, title: "Chat 1", user_id: 1, date: "2024-02-19" },
                        { title_id: 2, title: "Chat 2", user_id: 1, date: "2024-02-18" }
                    ]
                }),
            },
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get Chat List",
    controller: ChatBotController,
    moduleName: "getChatList",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when chat list is retrieved successfully",
            body: { page: 1, page_size: 10 },
            responseStatus: 200,
            responseMessage: "Chat list retrieved successfully.",
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: { page: 1, page_size: 10 },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

jest.mock("axios");
commonTestFile(payload);
