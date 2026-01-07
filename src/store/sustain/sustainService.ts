import axios from "axios";
import { nodeUrl } from "constant"


// Fetch graph region emission data
const getGraphRegionEmission = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}get-region-emission-monthly`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

// Get region emission data
const getRegionEmission = async (
  userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}get-region-emission-reduction`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

const getConfigConstants = async (userdata:{region_id:string | number}) => {
  try {
    const response = await axios.post(`${nodeUrl}get-config-constants`, userdata);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};


// Service object that exposes functions
const sustainService = {
  getGraphRegionEmission,
  getRegionEmission,
  getConfigConstants
};

// Export the service object
export default sustainService;
