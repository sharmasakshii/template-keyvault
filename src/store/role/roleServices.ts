import axios from 'axios';
import {  nodeUrl } from "constant"

// Method for updating the image user's profile.
const getRoleListApi = async (data: any) => {
    try {
        // Send a POST request to the "profile-update" endpoint with the provided data and token.
        const response = await axios.post(`${nodeUrl}get-role-data`, data);
        // Return the response data.
        return response?.data;
    } catch (error: any) {
        // Handle errors and reject the promise with the error.
        throw error
    }
}

const deleteRoleApi = async (data: any) => {
    try {
        // Send a POST request to the "profile-update" endpoint with the provided data and token.
        const response = await axios.post(`${nodeUrl}delete-role`, data);
        // Return the response data.
        return response?.data;
    } catch (error: any) {
        // Handle errors and reject the promise with the error.
        throw error
    }
}

const addRoleApi = async (data: any) => {
    try {
        // Send a POST request to the "profile-update" endpoint with the provided data and token.
        const response = await axios.post(`${nodeUrl}create-role`, data);
        // Return the response data.
        return response?.data;
    } catch (error: any) {
        // Handle errors and reject the promise with the error.
        throw error
    }
}

const getRoleDetailByIdApi = async (data: any) => {
    try {
        // Send a POST request to the "get-single-user detail" endpoint with the provided data and token.
        const response = await axios.post(`${nodeUrl}get-role-details`, data);
        // Return the response data.
        return response?.data;
    } catch (error: any) {
        // Handle errors and reject the promise with the error.
        throw error
    }
}
const updateRoleDetail = async (data: any) => {
    try {
        // Send a POST request to the "get-single-user detail" endpoint with the provided data and token.
        const response = await axios.post(`${nodeUrl}edit-role`, data);
        // Return the response data.
        return response?.data;
    } catch (error: any) {
        // Handle errors and reject the promise with the error.
        throw error
    }
}

const getAllModulesApi = async () => {
    try {
        // Send a POST request to the "get-single-user detail" endpoint with the provided data and token.
        const response = await axios.get(`${nodeUrl}get-all-modules`);
        // Return the response data.
        return response?.data;
    } catch (error: any) {
        // Handle errors and reject the promise with the error.
        throw error
    }
}

const RoleServices = {
    getRoleListApi,
    deleteRoleApi,
    addRoleApi,
    getRoleDetailByIdApi,
    updateRoleDetail,
    getAllModulesApi
}

// Export the RoleServices class for use in other parts of the application.
export default RoleServices;
