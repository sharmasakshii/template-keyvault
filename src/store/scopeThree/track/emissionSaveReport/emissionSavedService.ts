import axios from "axios";
import { nodeUrl } from "constant"


// Fetch graph region emission data
const getEmissionFilters = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}combine-dash-filters-data`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

const getEmissionScacs = async (userData: any) => {
  try {
    const queryString = new URLSearchParams(userData).toString();
    const response = await axios.get(`${nodeUrl}combine-dash-scac-list?${queryString}`);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

// Service object that exposes functions
const EmissionSavedService = {
  getEmissionFilters,
  getEmissionScacs
};

// Export the service object
export default EmissionSavedService;
