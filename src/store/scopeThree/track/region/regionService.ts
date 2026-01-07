import axios from "axios";
import { nodeUrl } from "constant"


/**
 * Regional Services
 */

// Function to fetch region table data
const regionTableDataGet = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-region-table-data`, userData);

        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

// Function to fetch region graph data
const regionGraphPost = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-region-emission-data`, userData);

        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

// Function to fetch facility emission data
const regionFacilityEmissionApi = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-facilities-emission-data`, userData);

        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

// Object containing all regional services
const regionService = {
    regionTableDataGet,
    regionGraphPost,
    regionFacilityEmissionApi
};

// Export the regional service object
export default regionService;
