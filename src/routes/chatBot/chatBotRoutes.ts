import ChatBotController from "../../controller/chatbot/chatbotController";
import { createRoute } from "../../utils";

export const chatBotRouteConstant = [
    createRoute("post", "/get-chat-history", ChatBotController, "getChatHistory"),
    createRoute("post", "/get-chat-response", ChatBotController, "getChatResponse"),
    createRoute("get", "/get-chat-list", ChatBotController, "getChatList"),
    createRoute("get", "/search-chat-history", ChatBotController, "searchChatHistory"),
    createRoute("post", "/remove-chat-history", ChatBotController, "removeChatHistory")
];


export default chatBotRouteConstant;


