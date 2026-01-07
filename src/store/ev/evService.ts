// Import the axios library for making HTTP requests
import axios from "axios";
import { nodeUrl } from "constant"

const getEvLocations = async (): Promise<ApiResponse> => {
    try {
        return (await axios.get(`${nodeUrl}get-ev-locations`)).data;
    } catch (error: any) {
        throw error;
    }
};

const getMatrixDataEVApi = async (payload: any) => {
    try {
        // Send a POST request to the specified API endpoint with user data and token headers
        const response = await axios.post(`${nodeUrl}matrix-data-dashboard-ev`, payload);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const getEvNetworkLanesApi = async (data: any,): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${nodeUrl}ev-network-lane`, data);
        return response?.data;
    } catch (error: any) {
        throw error;
    }
};

const getTruckLaneDataApi = async (data: any,): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${nodeUrl}truck-lane-data`, data);
        return response?.data;
    } catch (error: any) {
        throw error;
    }
};


const getEVShipmentLanesApi = async (data: any,): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${nodeUrl}ev-shipment-lane-data`, data);
        return response?.data;
    } catch (error: any) {
        throw error;
    }
};



const getEVShipmentsByDateApi = async (data: any,): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${nodeUrl}ev-shipment-date`, data);
        return response?.data;
    } catch (error: any) {
        throw error;
    }
};


// Create an object that contains all the facility-related service functions
const evService = {
    getEvLocations,
    getMatrixDataEVApi,
    getEvNetworkLanesApi,
    getTruckLaneDataApi,
    getEVShipmentLanesApi,
    getEVShipmentsByDateApi
};

// Export the facilityService object as the default export
export default evService;
