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
    describeName: "Get Chat bot response list ",
    controller: ChatBotController,
    moduleName: "getChatResponse",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "Single chat data",
            body: { title_slug: "dfghjk", question: "U2FsdGVkX1+TDHzrXIheCnmlc1X7qAek1RHmarHZ3Ek=", question_id: "" },
            responseStatus: 200,
            responseMessage: "Single chat data",
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
jest.mock('axios')

commonTestFile(payload);
