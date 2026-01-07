import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import RegionController from "../../../../controller/scope3/track/region/regionController";

// Mock database connection and models
const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            SummerisedEmission: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        "region_summerisedEmission.name": "Region A",
                        region_id: 1,
                        intensity: 0.75,
                        emission: 1500000,
                    },
                    {
                        "region_summerisedEmission.name": "Region B",
                        region_id: 2,
                        intensity: 0.85,
                        emission: 1800000,
                    },
                ]),
            },
            ConfigConstants: {
                findAll: jest.fn<any>().mockResolvedValue([]),
            },
            Region: {
                findOne: jest.fn<any>().mockResolvedValue({ name: "Region A" }),
            },
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get Region Emission Data Tests",
    controller: RegionController,
    moduleName: "getRegionEmissionData",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 with region emissions data",
            body: {
                region_id: 1,
                year: 2024,
                quarter: 2,
                toggel_data: 1,
                time_id: 3,
                division_id: 5,
            },
            responseStatus: 200,
            responseMessage: "Region Emissions",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        SummerisedEmission: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    },
                },
            },
            testName: "should return 200 with not found message when no data exists",
            body: {
                region_id: 2,
                year: 2023,
                quarter: 2,
                toggel_data: 1,
                time_id: 4,
                division_id: 6,
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                main: {
                    models: {
                        SummerisedEmission: {
                            findAll: jest.fn<any>().mockRejectedValue(new Error("DB error")),
                        },
                    },
                },
            },
            testName: "should return 500 when an error occurs in DB query",
            body: {
                region_id: 3,
                year: 2025,
                quarter: 3,
                toggel_data: 1,
                time_id: 5,
                division_id: 7,
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

// Execute the test cases
commonTestFile(payload);