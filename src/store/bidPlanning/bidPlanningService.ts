// Import the Axios library for making HTTP requests
import axios from "axios";
import { toast } from "react-toastify";
import fileService from "store/file/fileService";
import {  nodeUrl } from "constant"

const getBidFileList = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-all-bid-files`, userData);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const getBidStatusList = async () => {
    try {
        const response = await axios.get(`${nodeUrl}get-all-bid-status`);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const addBidFileApi = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}upload-bid-file`, userData);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};


const saveBidFileDataApi = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}save-bid-file-data`, userData);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const deleteMultiBidFileApi = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}delete-miltiple-bid-file`, userData);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const processBidFileApi = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}process-bid-files`, userData);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const getBidFileDetailApi = async (payload: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-bid-file-detail`, payload);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const processBidFileApiV1 = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}process-logic-app`, userData);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const processStatusBidFileApi = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-process-status`, userData);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const getKeyMetricsDetailApi = async (payload: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-bid-details`, payload);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const getBidFileLanesTableGraphApi = async (payload: any) => {
    try {
        const response = await axios.post(`${nodeUrl}bid-file-lanes-table-graph`, payload);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
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
                    onUploadProgress: userData?.progressFn,
                    signal: userData?.controller?.signal,
                });
                return uploadResult;
            } catch (error: any) {
                throw error;
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

// Function to fetch region table data
const fileMatricsErrorApi = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}/get-all-bid-file-error-rows`, userData);
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const getBioFuelStopApi = async (payload: any) => {
    try {
        const response = await axios({
            method: "post",
            url: process.env.REACT_APP_FUNCTIONAL_URL,
            data: payload,
            headers: {
                'Content-Type': 'application/json'
            },
        });
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};


const getEmissionCostImpactBarChartBidPlanningApi = async (payload: any) => {
    try {
        const response = await axios.post(`${nodeUrl}top-emission-cost-impact-lanes-bid-output`, payload);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const getKeyMetricsSummaryOutputApi = async (payload: any) => {
    try {
        const response = await axios.post(`${nodeUrl}bid-output-detail`, payload);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const getOutPutOfBidPlanningApi = async (payload: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-bid-file-output-table`, payload);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const exportOutPutOfBidPlanningApi = async (payload: any) => {
    try {
        const response = await axios.post(`${nodeUrl}download-bid-filter-data`, payload);
        await fileService?.filedownloadApi({ fileName: response?.data?.data?.fileName, downloadPath: response?.data?.data?.folderPath })
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const exportErrorListBidInputApi = async (payload: any) => {
    try {
        const response = await axios.post(`${nodeUrl}download-bid-error-data`, payload);
        await fileService?.filedownloadApi({ fileName: response?.data?.data?.fileName, downloadPath: response?.data?.data?.folderPath })
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const getOriginDestinationBidOutputApi = async (payload: any) => {
    try {
        const response = await axios.post(`${nodeUrl}search-bid-file-lane-origin-dest`, payload);
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const getScacBidOutputApi = async (payload: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-scac-list`, payload);
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

// Create an object that contains the project-related service functions
const bidPlanningService = {
    getBidFileList,
    addBidFileApi,
    saveBidFileDataApi,
    deleteMultiBidFileApi,
    processBidFileApi,
    getBidStatusList,
    getKeyMetricsDetailApi,
    getBidFileLanesTableGraphApi,
    fileMatricsErrorApi,
    processStatusBidFileApi,
    processBidFileApiV1,
    checkFileApi,
    getEmissionCostImpactBarChartBidPlanningApi,
    getBioFuelStopApi,
    getKeyMetricsSummaryOutputApi,
    getOutPutOfBidPlanningApi,
    getOriginDestinationBidOutputApi,
    getScacBidOutputApi,
    exportOutPutOfBidPlanningApi,
    getBidFileDetailApi,
    exportErrorListBidInputApi
};

// Export the projectService object for use in other parts of the application
export default bidPlanningService;
