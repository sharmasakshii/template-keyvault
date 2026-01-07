import axios from "axios";
import { nodeUrl } from "constant"

/**
 * Common Services
 */

// Function to fetch emission filter dates

const getFiltersDate = async (): Promise<ApiResponse> => {
  try {
    return (await axios.get(`${nodeUrl}region-emission-dates`)).data;
  } catch (error: any) {
    throw error;
  }
};

// Function to post region intensity data
const postRegionIntensity = async (
  userData: any
): Promise<ApiResponse> => {
  try {
    return (await axios.post(`${nodeUrl}get-region-intensity-yearly`, userData)).data;
  } catch (error: any) {
    throw error;
  }
};

const getDivisions = async (): Promise<ApiResponse> => {
  try {
    return (await axios.get(`${nodeUrl}get-division-list`)).data;
  } catch (error: any) {
    throw error;
  }
};

// Function to fetch regions
const getRegions = async (data: { division_id: number | string }): Promise<ApiResponse> => {
  try {
    let url = `${nodeUrl}get-regions`
    if (data?.division_id) {
      url = `${nodeUrl}get-regions?division_id=${data?.division_id || ''}`
    }
    return (await axios.get(url)).data;
  } catch (error: any) {
    throw error;
  }
};



// Function to fetch project count using API
const getProjectCountApi = async (
  userData: any
): Promise<ApiResponse> => {
  try {
    return (await axios.post(`${nodeUrl}get-project-count`, userData)).data;
  } catch (error: any) {
    throw error;
  }
};

// Function to save site url using API
const saveUrlApi = async (
  payload: any
): Promise<ApiResponse> => {
  try {
    return (await axios.post(`${nodeUrl}save-url`, payload)).data;
  } catch (error: any) {
    throw error;
  }
};

// Function to fetch content using API
const getCmsContentApi = async (
  payload: any
): Promise<ApiResponse> => {
  try {
    return (await axios.post(`${nodeUrl}get-cms-content`, payload)).data;
  } catch (error: any) {
    throw error;
  }
};

const getNotificationListing = async (
  payload: any
): Promise<ApiResponse> => {
  try {
    return (await axios.get(`${nodeUrl}get-user-notifications`)).data;
  } catch (error: any) {
    throw error;
  }
};

// Function to save site url using API
const sendMessageBotApi = async (payload: any) => {
  try {
    const { query, randomId, questionType, title, token } = payload;
    let url: any = process.env.REACT_APP_BASE_URL_CHATBOT;
    const response =  await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        "question": query,
        "question_id": randomId,
        "type": questionType,
        "title_slug": title
      }),
    });
     if (!response.ok) {
      // Handle other error statuses
      throw new Error(`Something went wrong.`);
    }
    return response;
  }
  catch (error: any) {
    throw (error);
  }
};

// Function to fetch content using API
const getTimePeriodApi = async (
  payload: any
): Promise<ApiResponse> => {
  try {
    return (await axios.post(`${nodeUrl}scope3/time-mapping-list`, payload)).data;
  } catch (error: any) {
    throw error;
  }
};

// Function to fetch content using API
const getOnboardQuestionListApi = async (
  payload: any
): Promise<ApiResponse> => {
  try {
    return (await axios.post(`${nodeUrl}get-onboard-question-list`, payload)).data;
  } catch (error: any) {
    throw error;
  }
};

// Function to fetch content using API
const addUpdateQuestionAnswereApi = async (
  payload: any
): Promise<ApiResponse> => {
  try {
    return (await axios.post(`${nodeUrl}add-update-question-answere`, payload)).data;
  } catch (error: any) {
    throw error;
  }
};

// 

// Object containing all common services
const commonService = {
  getFiltersDate,
  getProjectCountApi,
  postRegionIntensity,
  getDivisions,
  getRegions,
  saveUrlApi,
  getCmsContentApi,
  getNotificationListing,
  sendMessageBotApi,
  getTimePeriodApi,
  getOnboardQuestionListApi,
  addUpdateQuestionAnswereApi
};

// Export the common service object
export default commonService;
