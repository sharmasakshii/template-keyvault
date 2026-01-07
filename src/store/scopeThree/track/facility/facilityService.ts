// Import the Axios library for making HTTP requests
import axios from "axios";
import { nodeUrl } from "constant"

// Function to fetch facility graph data using a POST request
const facilityGraphPost = async (userData: any) => {
    try {
        // Send a POST request to the specified API endpoint with user data and token headers
        const response = await axios.post(`${nodeUrl}get-facilities-emission-data`, userData);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        // If an error occurs, throw the error for handling elsewhere
        throw (error);
    }
};

// Function to fetch facility table data using a POST request
const facilityTableDataGet = async (userData: any) => {
    try {
        // Send a POST request to the specified API endpoint with user data and token headers
        const response = await axios.post(`${nodeUrl}get-facilities-table-data`, userData);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

// Create an object that contains the facility-related service functions
const facilityService = {
    facilityGraphPost,
    facilityTableDataGet
}

// Export the facilityService object for use in other parts of the application
export default facilityService;
