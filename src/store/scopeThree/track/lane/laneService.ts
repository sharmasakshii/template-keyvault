import axios from "axios";
import { getSearchodpairUrl } from "utils";
import { nodeUrl } from "constant"

// Function to fetch lane graph data
const laneGraphData = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-lane-emission`, userData);
        return response?.data;
    } catch (error: any) {
        throw (error);
    }
}

// Function to fetch region-carrier comparison data
const regionCarrierComparison = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-region-carrier-comparison-data`, userData);
        return response?.data;
    } catch (error: any) {
        throw (error);
    }
}

// Function to fetch region overview detail
const getRegionOverviewDetail = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-region-overview-detail`, userData);
        return response?.data;
    } catch (error: any) {
        throw (error);
    }
}

// Function to fetch lane reduction detail graph
const getLaneReductionDetailGraph = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-lane-reduction-graph`, userData);
        return response?.data;
    } catch (error: any) {
        throw (error);
    }
}


// Function to fetch lane carrier emission data
const getLaneCarrierEmission = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-lane-carrier-graph`, userData);
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
}

// Function to fetch lane overview details emission data
const getLaneOverDetailsEmissionApi = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-lane-overview-details`, userData);
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
}

// Function to fetch shortest lane path 
const getLaneSortestPathApi = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}alternate-k-shortest-path`, userData);
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
}

// Function to fetch lane scenario detail
const getLaneScenarioDetailApi = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-lane-scenario-detail`, userData);
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
}

// Function to fetch City
const searchCityApi = async (userData: any) => {
    try {
        const response = await axios.post(getSearchodpairUrl(userData?.page), userData);
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
}

// Function to fetch City
const getLaneEmissionDataApi = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-lane-emission-table-data`, userData);
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
}


// Function to fetch City
const getCarrierEmissionDataApi = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}get-carrier-emission-table-data`, userData);
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
}

const getLaneRangeOptionApi = async () => {
    try {
        const response = await axios.get(`${nodeUrl}all-fuel-radius-list`);
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
}

const getUpdateRangeSelectionApi = async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}update-fuel-radius-key`, userData);
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
}

const checkLaneFuelStopApi= async (userData: any) => {
    try {
        const response = await axios.post(`${nodeUrl}check-lane-fuel-stops`, userData);
        return response?.data;
    }
    catch (error: any) {
        throw (error);
    }
}

// Object containing all lane-related services
const laneService = {
    laneGraphData,
    regionCarrierComparison,
    getRegionOverviewDetail,
    getLaneCarrierEmission,
    getLaneReductionDetailGraph,
    getLaneOverDetailsEmissionApi,
    getLaneSortestPathApi,
    getLaneScenarioDetailApi,
    searchCityApi,
    getCarrierEmissionDataApi,
    getLaneEmissionDataApi,
    getLaneRangeOptionApi,
    getUpdateRangeSelectionApi,
    checkLaneFuelStopApi
};

// Export the lane service object
export default laneService;
