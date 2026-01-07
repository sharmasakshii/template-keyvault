import axios from "axios";
import { nodeUrl } from "constant"

/**
 * Common Services
 */

// Function to fetch emission filter dates

const getChatHistoryApi = async (userData: any, header:any={}): Promise<ApiResponse> => {
  try {
    return (await axios.post(`${nodeUrl}get-chat-history`, userData, { headers: header })).data;
  } catch (error: any) {
    throw error;
  }
};

const getSearchChatHistoryApi = async (payload: any): Promise<ApiResponse> => {
  try {
    return (await axios.get(`${nodeUrl}search-chat-history?search=${payload?.search || ''}&limit=${payload?.limit || 5}`)).data;
  } catch (error: any) {
    throw error;
  }
};

const removeSearchChatHistoryApi = async (payload: any): Promise<ApiResponse> => {
  try {
    return (await axios.post(`${nodeUrl}remove-chat-history`, payload)).data;
  } catch (error: any) {
    throw error;
  }
};

const getChatListApi = async (payload: any): Promise<ApiResponse> => {
  try {
    return (await axios.get(`${nodeUrl}get-chat-list?page=${payload.page}&page_size=${payload.page_size}`)).data;
  } catch (error: any) {
    throw error;
  }
};

// Object containing all common services
const chatbotService = {
  getChatHistoryApi,
  getSearchChatHistoryApi,
  removeSearchChatHistoryApi,
  getChatListApi
};

// Export the common service object
export default chatbotService;
