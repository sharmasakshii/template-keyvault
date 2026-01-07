import axios from "axios";
import { nodeUrl } from "constant";

const getFuelTransactionApi = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}get-fuel-transaction-list`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};


const getFuelReportFilterApi = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}pbna-pfna-fuels-report-filters`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

const getFuelReportMatricsApi = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}pbna-pfna-fuel-metrics-report`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

const getFuelConsumptionApi = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}pbna-pfna-fuel-consumption-graph`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

const getFuelEmissionsApi = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}pbna-pfna-fuel-emissions-graph`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

const getTransactionFilter = async (userData: any) => {
  try {
    let searchString = Object.entries(userData)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    const response = await axios.get(`${nodeUrl}pbna-pfna-get-search-filter?limit=1000000&${searchString}`)
    return response?.data;
  } catch (error: any) {
    throw error;
  }
}

const getFuelReportByDivisionApi = async (userData: any) => {
  try {
    const response = await axios.get(`${nodeUrl}get-pie-chart-data-by-division?year=${userData?.year || ''}&division=${userData?.divisionId || ''}&period=${userData?.period_id || ''}&transport=${userData?.transport_id || ''}&type=${userData?.type || ''}`);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

const getTransactionLocationApi = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}pbna-pfna-list-of-locations`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

const getPfnaTransactionDetailsApi = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}pfna-transaction-details`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

const getPbnaPfnaFuelConsumptionByPeriodApi = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}pbna-pfna-line-chart-by-fuel-data`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

const getPbnaPfnaFuelEmissionByPeriodApi = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}pbna-pfna-line-chart-by-emission-data`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

// Service object that exposes functions
const fuelReportService = {
  getTransactionFilter,
  getFuelTransactionApi,
  getFuelReportFilterApi,
  getFuelReportMatricsApi,
  getFuelConsumptionApi,
  getFuelEmissionsApi,
  getFuelReportByDivisionApi,
  getTransactionLocationApi,
  getPfnaTransactionDetailsApi,
  getPbnaPfnaFuelConsumptionByPeriodApi,
  getPbnaPfnaFuelEmissionByPeriodApi
};

// Export the service object
export default fuelReportService;
