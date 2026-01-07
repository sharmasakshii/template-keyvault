import axios from "axios";
import { nodeUrl } from "constant"


/**
 * Retrieves vendor table data using a POST request.
 * @param userData - The user data for the request.
 * @param userToken - The user token for the request.
 * @returns The response data from the API call.
 */
const vendorTableDataGet = async (userData: any): Promise<ApiResponse> => {
    try {
        return (await axios.post(`${nodeUrl}get-vendor-table-data`, userData))?.data;
    } catch (error: any) {
        throw error;
    }
};

/**
 * Retrieves carrier overview data using a GET request.
 * @param userData - The user data for the request.
 * @param userToken - The user token for the request.
 * @returns The response data from the API call.
 */

const getCarrierOverview = async (userData: any): Promise<ApiResponse> => {
    try {
        return (await axios.post(`${nodeUrl}get-carrier-overview`, userData)).data;
    } catch (error: any) {

        throw error;
    }
};

/**
 * Retrieves lane breakdown data using a POST request.
 * @param userData - The user data for the request.
 * @param userToken - The user token for the request.
 * @returns The response data from the API call.
 */
const getLaneBreakdown = async (userData: any): Promise<ApiResponse> => {
    try {
        return (await axios.post(`${nodeUrl}get-lane-breakdown`, userData)).data;
    } catch (error: any) {
        throw error;
    }
};

/**
 * Retrieves lane carrier list data using a GET request.
 * @param userData - The user data for the request.
 * @param userToken - The user token for the request.
 * @returns The response data from the API call.
 */
const getLaneCarrierList = async (userData: any): Promise<ApiResponse> => {
    try {
        return (await axios.post(`${nodeUrl}get-lane-carrier`, userData)).data;
    } catch (error: any) {
        throw error;
    }
};

/**
 * Retrieves lane carrier comparison data using a POST request.
 * @param userData - The user data for the request.
 * @param userToken - The user token for the request.
 * @returns The response data from the API call.
 */
const getLaneCarrierCompaire = async (userData: any): Promise<ApiResponse> => {
    try {
        return (await axios.post(`${nodeUrl}get-vendor-comparison`, userData)).data;
    } catch (error: any) {
        throw error;
    }
};

/**
 * Retrieves lane carrier table data using a POST request.
 * @param userData - The user data for the request.
 * @param userToken - The user token for the request.
 * @returns The response data from the API call.
 */
const laneCarrierTableDataApi = async (userData: any): Promise<ApiResponse> => {
    try {
        return (await axios.post(`${nodeUrl}get-lane-carrier-table-data`, userData)).data;
    } catch (error: any) {
        throw error;
    }
};

const getRegionCarrierComparisonTable = async (userData: any): Promise<ApiResponse> => {
    try {
        return (await axios.post(`${nodeUrl}get-carrier-region-comparison-table-data`, userData)).data;
    } catch (error: any) {
        throw error;
    }
};

const getCarrierTypeTableDtoApi = async (payload: any): Promise<ApiResponse> => {
    try {
        return (await axios.post(`${nodeUrl}get-carrier-type-table-data`, payload)).data;
    } catch (error: any) {
        throw error;
    }
};

const getCarrierTypeEmissionDtoApi = async (payload: any): Promise<ApiResponse> => {
    try {
        return (await axios.post(`${nodeUrl}carrier-type-emission`, payload)).data;
    } catch (error: any) {
        throw error;
    }
};

const getCarrierTypeOverviewDetailApi = async (payload: any): Promise<ApiResponse> => {
    try {
        return (await axios.post(`${nodeUrl}/carrier-type-matrix`, payload)).data;    
    } catch (error: any) {
        throw error;
    }
}

const getCarrierTypeReductionGraphApi = async (payload: any): Promise<ApiResponse> => {
    try {
        return (await axios.post(`${nodeUrl}/carrier-type-reduction-graph`, payload)).data;    
    } catch (error: any) {
        throw error;
    }
}

const getCarrierTypeLaneEmissionGraphApi = async (payload: any): Promise<ApiResponse> => {
    try {
        return (await axios.post(`${nodeUrl}/carrier-type-lane-emission`, payload)).data;    
    } catch (error: any) {
        throw error;
    }
}

/**
 * A collection of functions related to vendor-related API calls.
 */
const vendorService = {
    vendorTableDataGet,
    getCarrierOverview,
    getLaneBreakdown,
    getLaneCarrierList,
    getLaneCarrierCompaire,
    laneCarrierTableDataApi,
    getRegionCarrierComparisonTable,
    getCarrierTypeTableDtoApi,
    getCarrierTypeEmissionDtoApi,
    getCarrierTypeOverviewDetailApi,
    getCarrierTypeReductionGraphApi,
    getCarrierTypeLaneEmissionGraphApi,
};

// Export the vendorService object for use in other parts of the application
export default vendorService;
