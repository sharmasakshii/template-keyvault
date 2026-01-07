import { jest } from "@jest/globals";
import { commonTestFile } from "../commonTest";
import { comapnyDbAlias } from "../../../constant";
import HttpStatusMessage from "../../../constant/responseConstant";
import BenchmarkController from "../../../controller/scope3/benchmark/benchmarlController";

const mockCompanyModelsWithData = {
    EmissionMileTrend: {
        findAll: jest.fn<any>().mockResolvedValue([
            {
                industry_intensity: 0.4,
                company_intensity: 0.3,
                month: "01",
            },
        ]),
    },
};

const mockCompanyModelsWithNoData = {
    EmissionMileTrend: {
        findAll: jest.fn<any>().mockResolvedValue([]),
    },
};

const mockCompanyModelsWithError = {
    EmissionMileTrend: {
        findAll: jest.fn<any>().mockRejectedValue(new Error("DB Error")),
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Company Emission Graph",
    controller: BenchmarkController,
    moduleName: "companyEmissionGraph",
    testCases: [
        {
            testName: "should return 200 with graph data when records are found",
            status: true,
            extraParameter: {},
            body: {
                region: "east",
                band_no: 1,
                toggle_data: 1,
                year: 2024,
                quarter: 1,
                type: "mile",
            },
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: mockCompanyModelsWithData,
                },
            },
            responseStatus: 200,
            responseMessage: "Company emission graph  data.",
        },
        {
            testName: "should return 200 with not found message when no data is available",
            status: true,
            extraParameter: {},
            body: {
                region: "west",
                band_no: 2,
                toggle_data: 0,
                year: 2024,
                quarter: 2,
                type: "weight",
            },
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: mockCompanyModelsWithNoData,
                },
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            testName: "should return 500 with internal server error when query fails",
            status: false,
            extraParameter: {},
            body: {
                region: "south",
                band_no: 3,
                toggle_data: 1,
                year: 2024,
                quarter: 3,
                type: "mile",
            },
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: mockCompanyModelsWithError,
                },
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
