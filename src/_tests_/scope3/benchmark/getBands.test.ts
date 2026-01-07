import { jest } from "@jest/globals";
import { commonTestFile } from "../commonTest";
import { comapnyDbAlias } from "../../../constant";
import HttpStatusMessage from "../../../constant/responseConstant";
import BenchmarkController from "../../../controller/scope3/benchmark/benchmarlController";

// Mock band data
jest.unstable_mockModule("../../../utils", () => ({
    bandData: {
        weight: ["< 1000 lbs", "1000 - 5000 lbs", "> 5000 lbs"],
        mile: ["< 100 miles", "100 - 500 miles", "> 500 miles"],
    }
}));

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get Bands Name",
    controller: BenchmarkController,
    moduleName: "getBandsName",
    testCases: [
        {
            testName: "should return 200 with band name data for weight",
            status: true,
            body: {
                band_type: "weight",
            },
            mockConnection: {
                company: comapnyDbAlias.PEP,
            },
            responseStatus: 200,
            responseMessage: "Band name data",
        },
        {
            testName: "should return 200 with band name data for mile",
            status: true,
            body: {
                band_type: "mile",
            },
            mockConnection: {
                company: comapnyDbAlias.PEP,
            },
            responseStatus: 200,
            responseMessage: "Band name data",
        },
        {
            testName: "should return 200 with NOT_FOUND when band_type is invalid",
            status: true,
            body: {
                band_type: "invalid_band_type", // TypeScript will warn, but runtime can still hit this
            },
            mockConnection: {
                company: comapnyDbAlias.PEP,
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        }
    ],
};

commonTestFile(payload);
