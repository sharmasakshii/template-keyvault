import axios from "axios";
import { nodeUrl } from "constant"


/**
 * Fuel Services
 */

// Function to fetch fuel table data
const fuelTableApi = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}fuel-vehicle-emission-table-data`, userData);

        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

// Function to fetch fuel graph data
const fuelGraphApi = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}fuel-vehicle-emission-graph-data`, userData, { headers: { deniedCancle: true } });
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};


// Function to fetch fuel graph data
const fuelCarrierEmissionGraphApi = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}fuel-vehicle-carrier-emission-table-data`, userData);

        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

// Function to fetch fuel graph data
const getFuelOverviewDtoApi = async (userData: any) => {
    try {
        const response = await axios.post(
            `${nodeUrl}fuel-vehicle-overview-data`, userData);

        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};


// Function to fetch fuel graph data
const getFuelLaneBreakdownByEmissionsIntensityApi = async (userData: any) => {
    try {
        const response = await axios.post(
            `${nodeUrl}fuel-vehicle-lane-breakdown-data`, userData);

        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};



// Object containing all regional services
const fuelService = {
    fuelTableApi,
    fuelGraphApi,
    fuelCarrierEmissionGraphApi,
    getFuelOverviewDtoApi,
    getFuelLaneBreakdownByEmissionsIntensityApi
};

// Export the regional service object
export default fuelService;
