import axios from 'axios';
import { toast } from "react-toastify";
import { nodeUrl } from "constant"


// Method for changing the user's password.
const changePasswordApi = async (data: any) => {
    try {
        // Send a POST request to the "profile-update-password" endpoint with the provided data and token.
        const response = await axios.post(`${nodeUrl}profile-update-password`, data);
        // Return the response data.
        return response?.data;
    } catch (error: any) {
        // Handle errors and reject the promise with the error.
        throw (error);
    }
}

// Method for updating the user's profile.
const updateProfileApi = async (data: any) => {
    try {
        // Send a POST request to the "profile-update" endpoint with the provided data and token.
        const response = await axios.post(`${nodeUrl}profile-update`, data);
        // Return the response data.
        return response?.data;
    } catch (error: any) {
        // Handle errors and reject the promise with the error.
        throw (error);
    }
}

// Method for updating the image user's profile.
const updateProfilePicApi = async (data: any) => {
    try {
        const response = await axios.post(
            `${nodeUrl}blob-sas-token`,
            {
                "isProfile": 1,
                "fileSize": data?.size || '',
                "fileMimeType": data?.type || ''
            }

        );
        if (response?.data?.status && response?.data?.data?.sasToken) {
            try {
                const file = data;
                const fileName = `${Date.now()}-${file.name}`;
                
                const uploadResult: any = await axios({
                    method: "put",
                    url: `${response?.data?.data?.url}/${response?.data?.data?.profilePath}${fileName}?${response?.data?.data?.sasToken}`,
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
                });
                await axios.post(`${nodeUrl}update-profile-image`,
                    {
                        "fileName": fileName,
                        "updateValues": response?.data?.data?.updateValues,
                    }
                );
                return uploadResult;
            } catch (error: any) {
                return error;
            }
        } else if (!response?.data?.status && !response?.data?.data?.sasToken) {
            toast.error(response?.data?.message);
            return response?.data;
        }
        return response?.data;
    } catch (error: any) {
        // Handle errors and reject the promise with the error.
        throw (error);
    }
}


// Method for updating the image user's profile.
const getUserListApi = async (data: any) => {
    try {
        // Send a POST request to the "profile-update" endpoint with the provided data and token.
        const response = await axios.post(`${nodeUrl}get-user-list`, data);
        // Return the response data.
        return response?.data;
    } catch (error: any) {
        // Handle errors and reject the promise with the error.
        throw (error);
    }
}

const updateUserStatusApi = async (data: any) => {
    try {
        // Send a POST request to the "profile-update" endpoint with the provided data and token.
        const response = await axios.post(`${nodeUrl}activate-deactivate-user`, data);
        // Return the response data.
        return response?.data;
    } catch (error: any) {
        // Handle errors and reject the promise with the error.
        throw (error);
    }
}


const getRoleApi = async () => {
    try {
        // Send a POST request to the "profile-update" endpoint with the provided data and token.
        const response = await axios.get(`${nodeUrl}get-all-roles`);
        // Return the response data.
        return response?.data;
    } catch (error: any) {
        // Handle errors and reject the promise with the error.
        throw (error);
    }
}

const addUserApi = async (data: any) => {
    try {
        // Send a POST request to the "profile-update" endpoint with the provided data and token.
        const response = await axios.post(`${nodeUrl}add-user`, data);
        // Return the response data.
        return response?.data;
    } catch (error: any) {
        // Handle errors and reject the promise with the error.
        throw (error);
    }
}

const getUserDetailById = async (data: any) => {
    try {
        // Send a POST request to the "get-single-user detail" endpoint with the provided data and token.
        const response = await axios.post(`${nodeUrl}get-user-detail-by-id`, data);
        // Return the response data.
        return response?.data;
    } catch (error: any) {
        // Handle errors and reject the promise with the error.
        throw (error);
    }
}
const updateUserDetail = async (data: any) => {
    try {
        // Send a POST request to the "get-single-user detail" endpoint with the provided data and token.
        const response = await axios.post(`${nodeUrl}update-user`, data);
        // Return the response data.
        return response?.data;
    } catch (error: any) {
        // Handle errors and reject the promise with the error.
        throw (error);
    }
}

const deleteUser = async (data: any) => {
    try {
        // Send a POST request to the "get-single-user detail" endpoint with the provided data and token.
        const response = await axios.post(`${nodeUrl}delete-user`, data);
        // Return the response data.
        return response?.data;
    } catch (error: any) {
        // Handle errors and reject the promise with the error.
        throw (error);
    }
}
const listFileOfUser = async (data: any) => {
    try {
        // Send a POST request to the "get-single-user detail" endpoint with the provided data and token.
        const response = await axios.post(`${nodeUrl}user-file-upload-detail`, data);
        // Return the response data.
        return response?.data;
    } catch (error: any) {
        // Handle errors and reject the promise with the error.
        throw (error);
    }
}
const userActivity = async (data: any) => {
    try {
        // Send a POST request to the "get-single-user detail" endpoint with the provided data and token.
        const response = await axios.post(`${nodeUrl}user-activity-logs`, data);
        // Return the response data.
        return response?.data;
    } catch (error: any) {
        // Handle errors and reject the promise with the error.
        throw (error);
    }
}

const loginActivityApi = async (data: any) => {
    try {
        // Send a POST request to the "get-single-user detail" endpoint with the provided data and token.
        const response = await axios.get(`${nodeUrl}get-login-activity?user_id=${data?.userId || ''}`);
        // Return the response data.
        return response?.data;
    } catch (error: any) {
        // Handle errors and reject the promise with the error.
        throw (error);
    }
}

const UserServices = {
    changePasswordApi,
    updateProfileApi,
    updateProfilePicApi,
    getUserListApi,
    updateUserStatusApi,
    getRoleApi,
    addUserApi,
    getUserDetailById,
    updateUserDetail,
    deleteUser,
    listFileOfUser,
    userActivity,
    loginActivityApi
}

// Export the UserServices class for use in other parts of the application.
export default UserServices;
