import axios from "axios";
import {  nodeUrl } from "constant"


/**
 * Regional Services
 */

// Function to fetch region table data
const businessUnitTableDataGet = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-business-unit-table-data`, userData);
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

// Function to fetch region graph data
const businessUnitGraphPost = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-business-emission-data`, userData);

        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};


const businessUnitGlidePath = async (userData: any): Promise<ApiResponse> => {
    try {
        return (await axios.post(`${nodeUrl}get-business-reduction`, userData)).data;
    } catch (error: any) {
        throw error;
    }
};

// Function to fetch region overview detail
const getBusinessUnitOverviewDetail = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-business-carrier-overview-detail`, userData);
        return response?.data;
    } catch (error: any) {
        throw (error);
    }
}

const businessCarrierComparison = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-business-carrier-comparison-graph`, userData);
        return response?.data;
    } catch (error: any) {
        throw (error);
    }
}

const businessLaneGraphData = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-Business-unit-emission`, userData);
        return response?.data;
    } catch (error: any) {
        throw (error);
    }
}


const businessRegionGraphData = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-business-unit-emission-by-region`, userData);
        return response?.data;
    } catch (error: any) {
        throw (error);
    }
}


// Object containing all regional services
const businessUnitService = {
    businessUnitTableDataGet,
    businessUnitGraphPost,
    businessUnitGlidePath,
    getBusinessUnitOverviewDetail,
    businessLaneGraphData,
    businessCarrierComparison,
    businessRegionGraphData
    
};

// Export the regional service object
export default businessUnitService;
