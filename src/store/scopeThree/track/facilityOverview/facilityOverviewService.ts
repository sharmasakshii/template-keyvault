// Import the axios library for making HTTP requests
import axios from "axios";
import { nodeUrl } from "constant"

// Function to fetch details of the overview page
const facilityOverviewDetailPost = async (userData: any) => {
    try {
        // Send a POST request to fetch facility overview details
        const response = await axios.post(`${nodeUrl}get-facilities-overview-detail`, userData);

        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

// Function to fetch facility reduction graph data
const facilityReductionGraphPost = async (userData: any) => {
    try {
        // Send a POST request to fetch facility reduction graph data
        const response = await axios.post(`${nodeUrl}get-facilities-reduction-graph`, userData);

        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

// Function to fetch facility comparison graph data
const facilityComparisonGraphGet = async (userData: any) => {
    try {
        // Send a GET request to fetch facility comparison graph data
        const response = await axios.post(`${nodeUrl}get-facilities-comparison`, userData);

        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

// Function to fetch facility in-bound graph data
const facilityInBoundPost = async (userData: any) => {
    try {
        // Send a POST request to fetch facility in-bound graph data
        const response = await axios.post(`${nodeUrl}get-facilities-inbound-lane-graph`, userData);

        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

// Function to fetch facility out-bound graph data
const facilityOutBoundPost = async (userData: any) => {
    try {
        // Send a POST request to fetch facility out-bound graph data
        const response = await axios.post(`${nodeUrl}get-facilities-outbound-lane-graph`, userData);

        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

// Function to fetch carrier comparison graph data
const facilityCarrierComparisonPost = async (userData: any) => {
    try {
        // Send a POST request to fetch carrier comparison graph data
        const response = await axios.post(`${nodeUrl}get-facilities-carrier-graph`, userData);

        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

// Function to fetch facility graph details data
const facilityGraphDetailsGraphPost = async (userData: any) => {
    try {
        // Send a POST request to fetch facility graph details data
        const response = await axios.post(`${nodeUrl}get-facilities-lane-graph`, userData);

        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

// Create an object that contains all the facility-related service functions
const facilityOverviewService = {
    facilityOverviewDetailPost,
    facilityReductionGraphPost,
    facilityComparisonGraphGet,
    facilityInBoundPost,
    facilityOutBoundPost,
    facilityCarrierComparisonPost,
    facilityGraphDetailsGraphPost,
};

// Export the facilityService object as the default export
export default facilityOverviewService;
