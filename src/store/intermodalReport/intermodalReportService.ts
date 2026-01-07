// Import the Axios library for making HTTP requests
import axios from "axios";
import { nodeUrl } from "constant"

const getIntermodalReportMatrixDataApi = async (payload: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-intermodal-metrics`, payload);
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const getIntermodalReportFilterDataApi = async (payload: any) => {
    try {
        const response = await axios.post(`${nodeUrl}intermodal-filters`, payload);
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const getTopLanesShipmentDataApi = async (payload: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-list-shipment-miles`, payload);        
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const getViewLaneDetailApi = async (payload: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-lane-details`, payload);
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const getLaneByShipmentMilesApi = async (payload: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-lanes-by-shipments-miles`, payload);
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const getIntermodalMaxDateApi = async (payload: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-intermodal-max-date`, payload);
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

// get-intermodal-max-date-chep

// Create an object that contains the project-related service functions
const intermodalReportService = {
    getIntermodalReportMatrixDataApi,
    getTopLanesShipmentDataApi,
    getIntermodalReportFilterDataApi,
    getViewLaneDetailApi,
    getLaneByShipmentMilesApi,
    getIntermodalMaxDateApi
};

// Export the projectService object for use in other parts of the application
export default intermodalReportService;
