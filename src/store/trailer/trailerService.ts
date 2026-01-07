import axios from "axios";
import { nodeUrl } from "constant"


/**
 * trailer Services
 */

// Function to fetch trailer table data
const trailerTableApi = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}trailer-emission-table-data`, userData);

        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

// Function to fetch trailer graph data
const trailerGraphApi = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}trailer-emission-graph-data`, userData);
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};


// Function to fetch trailer graph data
const trailerCarrierEmissionGraphApi = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}trailer-carrier-emission-table-data`, userData);

        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

// Function to fetch trailer graph data
const getTrailerOverviewDtoApi = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}trailer-overview-data`, userData);

        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};


// Function to fetch trailer graph data
const getTrailerLaneBreakdownByEmissionsIntensityApi = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}trailer-lane-breakdown-data`, userData);

        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};



// Object containing all regional services
const trailerService = {
    trailerTableApi,
    trailerGraphApi,
    trailerCarrierEmissionGraphApi,
    getTrailerOverviewDtoApi,
    getTrailerLaneBreakdownByEmissionsIntensityApi
};

// Export the regional service object
export default trailerService;
