import axios from "axios";
import { nodeUrl } from "constant"

/**
 * Regional Services
 */

// Function to fetch region table data
const divisionTableDataApi = async (userData: any,) => {
    try {
        const response = await axios.post(`${nodeUrl}get-division-table-data`, userData);
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

// Function to fetch region graph data
const divisionGraphDataApi = async (userData: any,) => {
    try {
        const response = await axios.post(`${nodeUrl}get-division-graph-data`, userData);
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

// Function to fetch region overview detail
const getDivisionOverviewDetailApi = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-division-overview`, userData);
        return response?.data;
    } catch (error: any) {
        throw (error);
    }
}

const getDivisionRegionComparisonDataApi = async (userData: any): Promise<ApiResponse> => {
    try {
        return (await axios.post(`${nodeUrl}get-division-region-comparison-data`, userData)).data;
    } catch (error: any) {
        throw error;
    }
};

const laneBreakdownDetailForDivisionApi = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-by-division-lane-breakdown`, userData);
        return response?.data;
    } catch (error: any) {
        throw (error);
    }
}

const businessUnitEmissionDivisionApi = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}division-buisness-unit-data`, userData);
        return response?.data;
    } catch (error: any) {
        throw (error);
    }
}


const businessUnitEmissionDivisionListApi = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-business-unit-emission-division-list`, userData);
        return response?.data;
    } catch (error: any) {
        throw (error);
    }
}

// Object containing all regional services
const divisionService = {
    divisionTableDataApi,
    divisionGraphDataApi,
    getDivisionOverviewDetailApi,
    getDivisionRegionComparisonDataApi,
    laneBreakdownDetailForDivisionApi,
    businessUnitEmissionDivisionListApi,
    businessUnitEmissionDivisionApi
};

// Export the regional service object
export default divisionService;
