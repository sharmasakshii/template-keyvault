import axios from 'axios'
import { decryptDataFunction, getLocalStorage } from 'utils';
import { nodeUrl } from "constant"

// Login API Call
const authLoginPost = async (userData: any): Promise<ApiResponse> => {
  try {
    const response: ApiResponse = (await axios.post(`${nodeUrl}login-user-access`, userData)).data;
    return response;

  } catch (error: any) {
    throw error;
  }
};

// OTP verify API call
const authPostOtp = async (userData: any): Promise<ApiResponse> => {
  try {
    const response: ApiResponse = (await axios.post(`${nodeUrl}verifyOTP`, userData)).data;
    return response;
  } catch (error: any) {
    throw error;
  }
};

const bucketLoginPost = async (userData: any): Promise<ApiResponse> => {
  try {
    const response: ApiResponse = (await axios.post(`${nodeUrl}blob-login`, userData)).data;
    return response;
  } catch (error: any) {
    throw error;
  }
};

// Resend OTP API call
const resendPostOtp = async (userData: any): Promise<ApiResponse> => {
  try {
    return (await axios.post(`${nodeUrl}resendOtp`, userData)).data;
  } catch (error: any) {
    throw error;
  }
};


// Logout API call
const logOutApi = async (): Promise<ApiResponse> => {
  try {
    return (await axios.get(`${nodeUrl}logout`)).data;
  } catch (error: any) {
    throw error;
  }
};

const bucketUploadFile = async (userData: any) => {
  try {
    const userdata: any = getLocalStorage("persist:root");
    const updatedState = userdata && decryptDataFunction(JSON.parse(userdata?.bucketLoginDetails))?.data;

    const file = userData?.ref;
    return await axios({
      method: 'put',
      url: `${updatedState?.blobToken?.url}/${userData?.ref?.name}?${updatedState?.blobToken?.sasToken}`,
      data: file,
      headers: {
        "Content-Type": "application/octet-stream",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        isOpenedKey: "true",

        Origin: "https://appdev.greensight.ai",
        Pragma: "no-cache",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        deniedCancle: "true",
        "file-name": file?.name,
        "file-type": file?.type,
        "sec-ch-ua":
          '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "x-ms-blob-type": "BlockBlob",
        "x-ms-date": new Date().toUTCString(),
        "x-ms-version": "2023-08-03",
      },
      onUploadProgress: userData?.progressFn
    })
  }
  catch (err) {
  }
}

// Method for fetching user details.
const getUserDetails = async (): Promise<any> => {
  try {
    // Send a GET request to the "/user-profile" endpoint with the provided token.
    return (await axios.get(`${nodeUrl}user-profile`)).data;
  } catch (error: any) {
    // Handle errors and reject the promise with the error.
    throw (error);

  }
};


const getFuelStopApi = async (): Promise<any> => {
  try {
    // Send a GET request to the "/user-profile" endpoint with the provided token.
    return (await axios.post(`${nodeUrl}get-fuel-list`)).data;
  } catch (error: any) {
    // Handle errors and reject the promise with the error.
    throw (error);

  }
};

const resetOnboardingApi = async (userData: any): Promise<any> => {
  try {
    return (await axios.post(`${nodeUrl}reset-onboarding`, userData)).data;
  } catch (error: any) {
    // Handle errors and reject the promise with the error.
    throw (error);

  }
};


const authService = {
  authLoginPost,
  authPostOtp,
  resendPostOtp,
  logOutApi,
  bucketLoginPost,
  bucketUploadFile,
  getUserDetails,
  resetOnboardingApi,
  getFuelStopApi
};

export default authService;
