import { jest } from "@jest/globals";
import { commonTestFile } from "../../../commonTest";
import { comapnyDbAlias } from "../../../../../constant";
import HttpStatusMessage from "../../../../../constant/responseConstant";
import BusinessOverViewController from "../../../../../controller/scope3/track/businessUnit/businessOverviewController";

const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            SummerisedBusinessUnit: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: {
                            intensity: 76.504143,
                            emissions: 121.952,
                            year: 2024,
                            quarter: 1
                        }
                    },
                    {
                        dataValues: {
                            intensity: 76.504143,
                            emissions: 12,
                            year: 2022,
                            quarter: 1
                        }
                    }
                ]),
                findOne: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues:{ year: 2024, quarter: 1 }
                    }
                ])
            },
            ConfigConstants: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: {
                            config_key: "EMISSION_REDUCTION_TARGET_1_YEAR",
                            config_value: "10000",
                        },
                    },
                    {
                        dataValues: {
                            config_key: "EMISSION_REDUCTION_TARGET_1_YEAR",
                            config_value: "10000",
                        },
                    },
                ]),
            }
        }
    }
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get Business Emission Reduction Graph",
    controller: BusinessOverViewController,
    moduleName: 'getBusinessEmissionReduction',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 with emission data when data exists",
            body: {
                bu_id: 4, time_id: 12, division_id: 3, year: 2024, toggel_data: 0, region_id: "2"
            },
            responseStatus: 200,
            responseMessage: "Emissions Reduction",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.LW,
                [comapnyDbAlias?.LW]: {
                    models: {
                        SummerisedBusinessUnit: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    }
                },
            },
            testName: "should return 200 with not found message when no data exists",
            body: {
                bu_id: 4, time_id: 12, division_id: 3, year: 2024, toggel_data: 0, region_id: "2"
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return 500 when an error occurs in DB query",
            body: {
                bu_id: 4, time_id: 12, division_id: 3, year: 2024, toggel_data: 0, region_id: "2"
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
}

commonTestFile(payload);
