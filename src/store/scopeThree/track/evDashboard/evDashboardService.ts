import axios from "axios";
import { nodeUrl } from "constant"

/**
 * Retrieves vendor table data using a POST request.
 * @param userData - The user data for the request.
 * @param userToken - The user token for the request.
 * @returns The response data from the API call.
 */

const evDashboardMatricsApi = async (data: any): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${nodeUrl}ev-matrix-data`, data);
        return response?.data;
    } catch (error: any) {
        throw error;
    }
};

const evFilterDatesApi = async (data: any): Promise<ApiResponse> => {
    try {
        const response = await axios.get(`${nodeUrl}get-ev-filter-emission-dates?country_code=${data.country}&scac=${data?.code || ''}`);
        return response?.data;
    } catch (error: any) {
        throw error;
    }
};

const shipmentLaneDataApi = async (data: any): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${nodeUrl}ev-shpiment-by-lane-data`, data);
        return response?.data;
    } catch (error: any) {
        throw error;
    }
};

const shipmentByDateApi = async (data: any): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${nodeUrl}ev-shipments-by-date`, data);
        return response?.data;
    } catch (error: any) {
        throw error;
    }
};

const shipmentLaneListApi = async (data: any): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${nodeUrl}ev-shipments-lane-list`, data);
        return response?.data;
    } catch (error: any) {
        throw error;
    }
};


const getListOfCarriersApi = async (userData:any) => {
    try {
        const response = await axios.get(`${nodeUrl}ev-carriers-list?country_code=${userData?.country}`);
        return response?.data;
    } catch (error: any) {
        throw error;
    }
};

const getCarriersMaterDataApi = async (data: any) => {
    try {
        const response = await axios.post(`${nodeUrl}graph-carriers-data`, data);
        return response?.data;
    } catch (error: any) {
        throw error;
    }
};

const getTotalTonMileApi = async (data: any) => {
    try {
        const response = await axios.post(`${nodeUrl}ev-ttm-by-date`, data);
        return response?.data;
    } catch (error: any) {
        throw error;
    }
};

const getEvReportApi = async (data: any) => {
    try {
        const response = await axios.post(`${nodeUrl}ev-scac-excel`, data, { responseType: 'arraybuffer' });
        return response?.data;
    } catch (error: any) {
        throw error;
    }
};


const evDashboardService = {
    evDashboardMatricsApi,
    evFilterDatesApi,
    shipmentLaneDataApi,
    shipmentByDateApi,
    shipmentLaneListApi,
    getListOfCarriersApi,
    getCarriersMaterDataApi,
    getTotalTonMileApi,
    getEvReportApi
};

export default evDashboardService;