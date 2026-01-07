import { TestSliceMethod } from "commonCase/ReduxCases";
import chatbotService from "store/scopeThree/chatbot/chatBotService";
import { chatbotDataReducer, getChatListApi, resetChatList } from "store/scopeThree/chatbot/chatBotSlice";



const resetChatListSlice = {
    service: chatbotService,
    serviceName: "getChatListApi",
    sliceName: "getChatListApi",
    sliceImport: getChatListApi,
    data: {},
    reducerName: chatbotDataReducer,
    loadingState: "isLoadingChatHistory",
    isSuccess: "isSuccess",
    actualState: "chatHistoryData",
};
const addNewMessageSlice = {
    service: chatbotService,
    serviceName: "addNewMessage",
    sliceName: "addNewMessage",
    sliceImport: getChatListApi,
    data: { title_slug: "test-slug", message: "Hello" },
    reducerName: chatbotDataReducer,
    loadingState: "isLoadingChatHistory",
    isSuccess: "isSuccess",
    actualState: "chatHistoryData",
};
TestSliceMethod({
    data: [
        resetChatListSlice,addNewMessageSlice
    ],
});