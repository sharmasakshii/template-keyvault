import axios from "axios";
import { nodeUrl } from "constant";

const getFuelConsumptionReportApi = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}pfna-fuel-consumption-report`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

  const getPfnaTotaEmissionFuelApi = async (userData: any) => {
    try {
      const response = await axios.post(`${nodeUrl}pfna-total-emissions-by-fuels`, userData);
      return response?.data;
    } catch (error: any) {
      throw error;
    }
  };
  const getPfnaFuelConsumptionReportPeriodApi = async (userData: any) => {
    try {
      const response = await axios.post(`${nodeUrl}pfna-fuel-consumption-report-by-period`, userData,  { headers: { deniedCancle: true } });
      return response?.data;
    } catch (error: any) {
      throw error;
    }
  };

  const getPfnaFuelConsumptionByPercentageApi = async (userData: any) => {
    try {
      const response = await axios.post(`${nodeUrl}pfna-fuel-consumption-by-fuel-percentage`, userData, { headers: { deniedCancle: true } });
      return response?.data;
    } catch (error: any) {
      throw error;
    }
  };

  const getPfnaFuelListApi = async () => {
    try {
      const response = await axios.get(`${nodeUrl}pfna-fuel-list`);
      return response?.data;
    } catch (error: any) {
      throw error;
    }
  };



  // bulk new apis
  
  const getFuelConsumptionReportLocationApi = async (userData:any) => {
    try {
      const response = await axios.post(`${nodeUrl}pbna-pfna-pages-fuel-consumption-report`, userData, { headers: { deniedCancle: true } });
      return response?.data;
    } catch (error: any) {
      throw error;
    }
  };
  const getSearchLocationApi = async (userData:any) => {
    try {
      const response = await axios.post(`${nodeUrl}pbna-pfna-pages-search-location-filter`, userData, { headers: { deniedCancle: true } });
      return response?.data;
    } catch (error: any) {
      throw error;
    }
  };

  
// Service object that exposes functions
const pfnaReportService = {
    getFuelConsumptionReportLocationApi,
    getSearchLocationApi,
    getFuelConsumptionReportApi,
    getPfnaTotaEmissionFuelApi,
    getPfnaFuelConsumptionReportPeriodApi,
    getPfnaFuelConsumptionByPercentageApi,
    getPfnaFuelListApi,
};

// Export the service object
export default pfnaReportService;