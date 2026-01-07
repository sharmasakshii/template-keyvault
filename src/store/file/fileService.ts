import axios from "axios";
import { toast } from "react-toastify";
import { downloadFile } from "utils";
import { nodeUrl } from "constant"

export const ingestionUrl = process.env.REACT_APP_INGETION_URL ?? ""

/**
 * Retrieves vendor table data using a POST request.
 * @param userData - The user data for the request.
 * @param userToken - The user token for the request.
 * @returns The response data from the API call.
 */

const getFileListApi = async (data: any): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${nodeUrl}get-file-management-list`, data);
        return response?.data;
    } catch (error: any) {
        throw error;
    }
};

const getFileStatusListApi = async (): Promise<ApiResponse> => {
    try {
        const response = await axios.get(`${nodeUrl}status-list`);
        return response?.data;
    } catch (error: any) {
        throw error;
    }
};

const createFolderApi = async (data: any): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${nodeUrl}blob-create-folder`, data);
        return response?.data;
    } catch (error: any) {
        throw error;
    }
};

const checkFileApi = async (userData: any): Promise<ApiResponse> => {
    try {
        const response = await axios.post(
            `${nodeUrl}file-exist-check`,
            {
                fileName: userData?.fileName,
                folderName: userData?.folderName,
                file_id: userData?.file_id,
            },
            { headers: { deniedCancle: true } }
        );
        if (response?.data?.status && response?.data?.data?.sasToken) {
            try {
                const file = userData?.file;

                const uploadResult: any = await axios({
                    method: "put",
                    url: `${response?.data?.data?.url}/${userData?.file_path}?${response?.data?.data?.sasToken}`,
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
                        file_id: userData?.file_id,
                        "folder-path": userData?.base_path,
                        "sec-ch-ua":
                            '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": '"Linux"',
                        "x-ms-blob-type": "BlockBlob",
                        "x-ms-date": new Date().toUTCString(),
                        "x-ms-version": "2023-08-03",
                    },

                    signal: userData?.controller?.signal,
                });
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
        throw error;
    }
};

const updateStatusApi = async (data: any): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${nodeUrl}status-update`, data, { headers: { deniedCancle: true } });
        return response?.data;
    } catch (error: any) {
        throw error;
    }
}

const filedownloadApi = async (data: any) => {
    try {
        const response = await axios.post(`${nodeUrl}download-blob-file`, data);
        const fileUrl = `${response?.data?.data?.url}/${data?.downloadPath}?${response?.data?.data?.sasToken}`
        await downloadFile(fileUrl, data?.fileName?.replace("/", "_"));
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

const createFileDownloadApi = async (data: any) => {
    try {
        const response = await axios.post(`${nodeUrl}create-blob-download`, data);
        await filedownloadApi({ fileName: response?.data?.data?.fileName, downloadPath: response?.data?.data?.folderPath })
        return response.data;
    } catch (error: any) {
        throw error;
    }
};


const getFileLogListApi = async (data: any): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${nodeUrl}get-activity-log`, data);
        return response?.data;
    } catch (error: any) {
        throw error;
    }
};


const deleteFileFolderApi = async (data: any): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${nodeUrl}delete-folder-file`, data);
        return response?.data;
    } catch (error: any) {
        throw error;
    }
};

const getFolderListApi = async (): Promise<ApiResponse> => {
    try {
        const response = await axios.get(`${nodeUrl}get-folder-list`);
        return response?.data;
    } catch (error: any) {
        throw error;
    }
};

const moveFileApi = async (data: any): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${nodeUrl}move-blob-file`, data);
        return response?.data;
    } catch (error: any) {
        throw error;
    }
};

const ingestFile = async (data: any): Promise<ApiResponse> => {
    try {
        const dataPayload = {
            tenant: data?.tenant,
            id: data?.id
        }
        const response = await axios.post(`${ingestionUrl}/adf-trigger`, dataPayload);
        return response?.data;
    } catch (error: any) {
        throw error;
    }
};




const fileService = {
    getFileListApi,
    createFolderApi,
    checkFileApi,
    updateStatusApi,
    getFileStatusListApi,
    getFileLogListApi,
    filedownloadApi,
    deleteFileFolderApi,
    getFolderListApi,
    moveFileApi,
    ingestFile,
    createFileDownloadApi,
};

export default fileService;