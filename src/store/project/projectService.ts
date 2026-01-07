// Import the Axios library for making HTTP requests
import axios from "axios";
import { nodeUrl } from "constant"

// Function to fetch project list data using a POST request
const getProjectList = async (userData: any) => {
    try {
        // Send a POST request to the specified API endpoint with user data and token headers
        const response = await axios.post(`${nodeUrl}get-project-list`, userData);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        // If an error occurs, throw the error for handling elsewhere
        throw (error);
    }
};

// Function to remove a project using a POST request
const removeProjectList = async (userData: any) => {
    try {
        // Send a POST request to the specified API endpoint with user data and token headers
        const response = await axios.post(`${nodeUrl}delete-project`, userData);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        // If an error occurs, throw the error for handling elsewhere
        throw (error);
    }
};

// Function to search for project data using a POST request
const searchProjectList = async (userData: any) => {
    try {
        // Send a POST request to the specified API endpoint with user data and token headers
        const response = await axios.post(`${nodeUrl}get-project-search-list`, userData);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        // If an error occurs, throw the error for handling elsewhere
        throw (error);
    }
};

// Function to fetch project details using a GET request
const getProjectDetails = async (userData: any) => {
    try {
        // Send a Post request to the specified API endpoint with user data and token headers
        const response = await axios.post(`${nodeUrl}get-project-detail`, userData);
        // Return the data from the response
        return response?.data;
    }
    catch (error: any) {
        // If an error occurs, throw the error for handling elsewhere
        throw (error);
    }
};

const saveProjectDetailsApi = async (data: any): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${nodeUrl}save-project`, data);
        return response.data;
    } catch (error: any) {
        throw error;
    }

};

const saveProjectRatingDataGet = async (data: any): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${nodeUrl}save-project-rating`, data);
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

const searchByEmailApi = async (data: any): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${nodeUrl}search-user-by-email`, data);
        return response.data;
    } catch (error: any) {
        throw error;
    }
};


// Create an object that contains the project-related service functions
const projectService = {
    getProjectList,        // Function for fetching project list data
    removeProjectList,     // Function for removing a project
    searchProjectList,     // Function for searching for project data
    getProjectDetails,      // Function for fetching project details
    saveProjectDetailsApi,
    saveProjectRatingDataGet,
    searchByEmailApi
};

// Export the projectService object for use in other parts of the application
export default projectService;
