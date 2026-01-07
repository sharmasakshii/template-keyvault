import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../constant";
import ChatBotController from "../../controller/chatbot/chatbotController";
import HttpStatusMessage from "../../constant/responseConstant";
import { commonTestFile } from "../scope3/commonTest";


const mockConnection: any = {

    userData: {
        id: 1,
        companies: [{ db_alias: "asdasda" }]
    },
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            AIAgentChatHistory: {
                count: jest.fn<any>().mockResolvedValue(1),
                findAll: jest.fn<any>().mockResolvedValue(

                    [{ name: "asdasd", color: "qeqeq", data: 12123 }],

                ),
            },
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get Chat bot chat list ",
    controller: ChatBotController,
    moduleName: "getChatHistory",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: { title_slug: "dfghjk", page: 1, page_size: 10, question: "", question_id: "" },
            responseStatus: 200,
            responseMessage: "List of all chat history",
        },
        {
            status: true,
            mockConnection: {
                userData: { id: 1 },
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        AIAgentChatHistory: {
                            count: jest.fn<any>().mockResolvedValue(null),
                            findAll: jest.fn<any>().mockResolvedValue([],),
                        },
                    },
                },
            },
            testName: "should return 500 when no data found ",
            body: { title_slug: 1 },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: { title_slug: 1 },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
