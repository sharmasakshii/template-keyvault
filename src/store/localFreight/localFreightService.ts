// Import the Axios library for making HTTP requests
import axios from "axios";
import { nodeUrl } from "constant"

const alternativeCountryList = async () => {
    try {
        const response = await axios.get(`${nodeUrl}get-country-list`);
        return response?.data;
    } catch (error: any) {
        throw error;
    }
};

const alternativeCarriersApi = async (payload: any) => {
    try {
        const response = await axios.get(`${nodeUrl}alternative-carriers-list?country_code=${payload || ''}`);
        return response?.data;
    } catch (error: any) {
        throw error;
    }
};

const getKeyMetricsDateApi = async (payload: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-metrics`, payload);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};


const getListOfAllLanesByShipmentsApi = async (payload: any) => {
    try {
        const response = await axios.post(`${nodeUrl}list-of-all-lanes-by-shipments`, payload);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const getLanesByFuelUsageAndMileageApi = async (payload: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-lanes-by-fuel-usage-and-mileage`, payload);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const getStackedGraphByLaneAndFuelTypeApi = async (payload: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-total-data-by-lane-and-fuel-type`, payload, { headers: { deniedCancle: true } });
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const getTotalEmissionGraphByLaneAndFuelTypeApi = async (payload: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-total-emission-by-fuel-type`, payload);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const getLaneStatisticsApi = async (payload: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-lane-statistics`, payload);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};
const getLaneFuelFilters = async (payload: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-lane-fuel-filters`, payload);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const getAlternativeFuelTotalShipmentsApi = async (payload: any) => {
    try {
        const response = await axios.post(`${nodeUrl}alternate-carrier-by-fuel-type`, payload);
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const getAlternativeFuelsApi = async (payload: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-carrier-fuel-list`, payload);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};
const getTotalDataByCarrierApi = async (payload: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-total-data-by-carrier`, payload, { headers: { deniedCancle: true } });
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};


const getSchneiderApi= async (payload: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-schider-report`, payload);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

// Create an object that contains the project-related service functions
const localFreightService = {
    alternativeCountryList,
    alternativeCarriersApi,
    getKeyMetricsDateApi,
    getListOfAllLanesByShipmentsApi,
    getLanesByFuelUsageAndMileageApi,
    getStackedGraphByLaneAndFuelTypeApi,
    getTotalEmissionGraphByLaneAndFuelTypeApi,
    getLaneStatisticsApi,
    getLaneFuelFilters,
    getAlternativeFuelTotalShipmentsApi,
    getAlternativeFuelsApi,
    getTotalDataByCarrierApi,
    getSchneiderApi
};

// Export the projectService object for use in other parts of the application
export default localFreightService;
