import axios from "axios";
import { nodeUrl } from "constant"

// Function to fetch fuel stop provider list
const fuelStopProviderListApi = async () => {
    try {
        const response = await axios.get(`${nodeUrl}get-fuel-stops-provoiders`);
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

const fuelStopListApi = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-fuel-stops-provoiders-list`, userData);
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
};

// Object containing all fuel stop service
const fuelStopService = {
    fuelStopProviderListApi,
    fuelStopListApi
};

// Export the fuel stop service object
export default fuelStopService;
