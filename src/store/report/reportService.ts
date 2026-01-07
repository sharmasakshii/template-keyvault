import axios from "axios";
import { nodeUrl } from "constant"


/**
 * Report view Services
*/

const getReportKeyMatrixApi = async (userData: any): Promise<ApiResponse> => {
    try {
        return (await axios.post(`${nodeUrl}report-lane-matrix`, userData)).data;
    } catch (error: any) {
        throw error;
    }
};

const getReportLanesApi = async (userData: any): Promise<ApiResponse> => {
    try {
        return (await axios.post(`${nodeUrl}report-lane-data`, userData)).data;
    } catch (error: any) {
        throw error;
    }
};


// Object containing all report services
const reportViewService = {
    getReportKeyMatrixApi,
    getReportLanesApi
};

// Export the regional service object
export default reportViewService;
