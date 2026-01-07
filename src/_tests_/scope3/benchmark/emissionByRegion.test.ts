import { jest } from "@jest/globals";
import { commonTestFile } from "../commonTest";
import { comapnyDbAlias } from "../../../constant";
import HttpStatusMessage from "../../../constant/responseConstant";
import BenchmarkController from "../../../controller/scope3/benchmark/benchmarlController";

// Mock intermodal index data
const interModelIndexMock = {
    company_intermodal_index: 0.6,
    intermodal_index: 0.4,
};

// Mock region benchmark data
const regionBenchmarksMock = [{
    industry_intensity: 0.5,
    company_intensity: 0.3,
    industry_shipments: 1000,
    company_shipment: 500,
    industry_lane_count: 20,
    company_lane_count: 10,
}];

const mockConnection = {
    company: comapnyDbAlias.PEP,
    [comapnyDbAlias.PEP]: {
        models: {
            RegionBenchmarks: {
                findAll: jest.fn<any>().mockResolvedValue(regionBenchmarksMock),
                findOne: jest.fn<any>().mockResolvedValue(interModelIndexMock),
            },
            LaneBenchmarks: {
                findAll: jest.fn<any>().mockResolvedValue(regionBenchmarksMock),
                findOne: jest.fn<any>().mockResolvedValue(interModelIndexMock),
            },
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Emission by Region or Lane",
    controller: BenchmarkController,
    moduleName: "emissionByRegion",
    testCases: [
        {
            extraParameter: { type: "region" },
            status: true,
            mockConnection: mockConnection,
            body: {
                toggle_data: 1,
                year: 2024,
                quarter: 1,
                bound_type: "Inbound",
                region_id: "west",
            },
            testName: "should return 200 with region benchmark data",
            responseStatus: 200,
            responseMessage: "Emission Benchmarks data.",
        },
        {
            extraParameter: { type: "lane" },
            status: true,
            mockConnection: mockConnection,
            body: {
                toggle_data: 0,
                year: 2024,
                quarter: 1,
                origin: "NY",
                dest: "CA",
            },
            testName: "should return 200 with lane benchmark data",
            responseStatus: 200,
            responseMessage: "Emission Benchmarks data.",
        },
        {
            extraParameter: { type: "region" },
            status: true,
            mockConnection: {
                company: comapnyDbAlias.PEP,
                [comapnyDbAlias.PEP]: {
                    models: {
                        RegionBenchmarks: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                            findOne: jest.fn<any>().mockResolvedValue(null),
                        },
                    },
                },
            },
            body: {
                toggle_data: 1,
                year: 2024,
                quarter: 1,
                bound_type: "Inbound",
                region_id: "south",
            },
            testName: "should return 200 with NOT_FOUND if no benchmark data found",
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias.PEP,
                [comapnyDbAlias.PEP]: {
                    models: {
                        RegionBenchmarks: undefined,
                    },
                },
            },
            body: {
                toggle_data: 1,
                year: 2024,
                quarter: 1,
                bound_type: "Inbound",
                region_id: "north",
            },
            testName: "should return 500 on internal server error",
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
