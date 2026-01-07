import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import chatbotService from "./chatBotService";
import { getErrorMessage, isCancelRequest } from "../../../utils";
import { ChatBotState } from "./chatbotInterface";
/**
 * Redux Slice for common data and functionality
 */

// Define the shape of the state

// Initial state
export const initialState: ChatBotState = {
    isLoadingChatHistory: false,
    chatHistoryData: null,
    searchChatHistory: null,
    searchChatHistoryLoading: false,
    isSuccess: false,
    isLoadingChatList: false,
    chatListData: null,
    removeSearchChatHistory: null,
    isNewChat: {
        message: "",
        isNew: false
    }
}

// Async Thunk for posting emission intensity data
export const getChatHistory = createAsyncThunk("get/chat/history", async (userData: any, thunkApi) => {
    try {
        // Call common service to post emission intensity data
        return await chatbotService.getChatHistoryApi(userData, { cancelKey: true });
    }
    catch (error: any) {
        // Handle errors and reject with error message
        const message: any = getErrorMessage(error);

        if (error?.response?.status === 500) {
            return thunkApi.rejectWithValue(error.response.data);
        }
        return thunkApi.rejectWithValue(message)
    }
});

export const resetChatHistory = createAsyncThunk("clear/chat/history", async (userData: any, thunkApi) => {
    try {
        return await chatbotService.getChatHistoryApi(userData);
    }
    catch (error: any) {
        // Handle errors and reject with error message
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message)
    }
});

// Async Thunk for posting emission intensity data
export const getSearchChatHistory = createAsyncThunk("get/search/chat/history", async (userData: any, thunkApi) => {
    try {
        // Call common service to post emission intensity data
        return await chatbotService.getSearchChatHistoryApi(userData);
    }
    catch (error: any) {
        // Handle errors and reject with error message
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message)
    }
})

// Async Thunk for posting emission intensity data
export const removeSearchChatHistory = createAsyncThunk("remove/search/chat/history", async (userData: any, thunkApi) => {
    try {
        return await chatbotService.removeSearchChatHistoryApi(userData);
    }
    catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message)
    }
})

export const getChatListApi = createAsyncThunk("get/chat/list", async (userData: any, thunkApi) => {
    try {
        return await chatbotService.getChatListApi(userData);
    }
    catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message)
    }
})

export const addNewMessage = createAsyncThunk("add/new/message", async (status: any) => {
    return status
})

// Define the chatbot data reducer
export const chatbotDataReducer = createSlice({
    name: "chatbot-data",
    initialState,
    reducers: {
        resetChatbotData: () => initialState,
        resetHistory: (state) => {
            state.chatHistoryData = null;
        },
        resetChatList: (state) => {
            state.chatListData = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getChatHistory.pending, (state) => {
                state.isLoadingChatHistory = true;
                state.chatHistoryData = null;
                state.isSuccess = false;
            })
            .addCase(getChatHistory.fulfilled, (state, action) => {
                state.isLoadingChatHistory = false;
                state.isSuccess = true;
                state.chatHistoryData = action.payload;
            })
            .addCase(getChatHistory.rejected, (state, action) => {
                state.isLoadingChatHistory = false;
                state.chatHistoryData = null;
                state.isSuccess = false;
            })
            .addCase(getSearchChatHistory.pending, (state) => {
                state.searchChatHistoryLoading = true;
                state.searchChatHistory = null;
            })
            .addCase(getSearchChatHistory.fulfilled, (state, action) => {
                state.searchChatHistoryLoading = false;
                state.searchChatHistory = action.payload;
            })
            .addCase(getSearchChatHistory.rejected, (state, action) => {
                state.searchChatHistoryLoading = isCancelRequest(action?.payload);
            })
            .addCase(removeSearchChatHistory.pending, (state) => {
                state.searchChatHistoryLoading = true;
                state.removeSearchChatHistory = null;
            })
            .addCase(removeSearchChatHistory.fulfilled, (state, action) => {
                state.searchChatHistoryLoading = false;
                state.removeSearchChatHistory = action.payload;
            })
            .addCase(removeSearchChatHistory.rejected, (state, action) => {
                state.searchChatHistoryLoading = isCancelRequest(action?.payload);
                state.removeSearchChatHistory = null;
            })
            .addCase(getChatListApi.pending, (state) => {
                state.isLoadingChatList = true;
                state.chatListData = null;
            })
            .addCase(getChatListApi.fulfilled, (state, action) => {
                state.isLoadingChatList = false;
                state.isSuccess = true;
                state.chatListData = action.payload;
            })
            .addCase(getChatListApi.rejected, (state, action) => {
                state.isLoadingChatList = isCancelRequest(action?.payload);
                state.chatListData = null;
            })
            .addCase(addNewMessage.fulfilled, (state, action) => {
                state.isNewChat = action.payload;
            })
    }
});

// Export actions and reducer
export const { resetChatbotData, resetHistory, resetChatList } = chatbotDataReducer.actions;
export default chatbotDataReducer.reducer;
