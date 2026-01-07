import axios from "axios";
import { nodeUrl } from "constant"

/**
 * Retrieves vendor table data using a POST request.
 * @param userData - The user data for the request.
 * @param userToken - The user token for the request.
 * @returns The response data from the API call.
 */

const benchmarkDistance = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}graph-benchmark-distance`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};
const benchmarkWeight = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}graph-benchmark-weight`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

const benchmarkRegion = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}map-benchmark-region`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

const getLocation = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}lane-search`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

const getFreightLanes = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}emission-in-lane`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

const getBenchmark = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}map-benchmark-company`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

const getBenchmarkRegion = async () => {
  try {
    const response = await axios.get(`${nodeUrl}graph-benchmark-region`);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

const getBenchmarkCarrierEmissions = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}carrier-emission-table`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

const getIndustryStandardEmissions = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}company-emission`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

const getEmissionIntensityTrend = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}company-emission-graph`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

const getBenchmarkEmissionsTrendGraph = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}emission-trend-graph`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

const getIntermodelTrendGraph = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}intermodel-trend-graph`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

const getEmissionByRegion = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}emission-by-region`, userData);

    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

const getBenchmarkEmissionsTrendGraphLane = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}emission-trend-graph-lane`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

const getIntermodelTrendGraphLane = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}intermodel-trend-graph-lane`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

const getEmissionByLane = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}emission-by-lane`, userData);

    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

// Function to fetch band of weight and distance
const getBands = async (userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}company-band-name`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

const benchmarkService = {
  benchmarkDistance,
  benchmarkWeight,
  benchmarkRegion,
  getLocation,
  getFreightLanes,
  getBenchmark,
  getBenchmarkRegion,
  getBenchmarkCarrierEmissions,
  getIndustryStandardEmissions,
  getEmissionIntensityTrend,
  getBenchmarkEmissionsTrendGraph,
  getIntermodelTrendGraph,
  getEmissionByRegion,
  getEmissionByLane,
  getIntermodelTrendGraphLane,
  getBenchmarkEmissionsTrendGraphLane,
  getBands
};

export default benchmarkService;
