import axios from "axios";
import { nodeUrl } from "constant"

/**
 * Retrieves vendor table data using a POST request.
 * @param userData - The user data for the request.
 * @param userToken - The user token for the request.
 * @returns The response data from the API call.
 */

const decarbDataGet = async (data: any): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${nodeUrl}get-recommended-levers`, data);
        return response?.data;
    } catch (error:any) {
        throw error;
    }
};

const decarbProblemLanesDataGet = async (data: any): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${nodeUrl}get-region-problem-lanes`, data);
        return response?.data;
    } catch (error:any) {
        throw error;
    }
};

const optimusLanesApi = async (data: any): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${nodeUrl}optimus-fuel-lane`, data);
        return response?.data;
    } catch (error:any) {
        throw error;
    }
};

const optimusRouteCordinates = async (data: any): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${nodeUrl}optimus-fuel-stop-data`, data);
        return response?.data;
    } catch (error:any) {
        throw error;
    }
};


const decarbService = {
    decarbDataGet,
    decarbProblemLanesDataGet,
    optimusLanesApi,
    optimusRouteCordinates
};

export default decarbService;