import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../constant";
import HttpStatusMessage from "../../../constant/responseConstant";
import { commonTestFile } from "../../scope3/commonTest";
import FuelsReportPfnaPagesController from "../../../controller/scope1/fuelsReportPfnaPagesController";

const mockConnection: any = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        QueryTypes: { Select: jest.fn() },
        query: jest.fn<any>().mockResolvedValue([{ test: "asdasd" }]),
        models: {
            FuelReport: {
                getTableName: jest.fn<any>().mockResolvedValue({ tableName: "test", schema: "adasd", }),
                findAll: jest.fn<any>().mockResolvedValue([{ test: "asdasd" }]),
            },
            Location: {
                getTableName: jest.fn<any>().mockResolvedValue({ tableName: "test", schema: "adasd", }),
                findAll: jest.fn<any>().mockResolvedValue([{ test: "asdasd" }]),
            },
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Search filter location company ",
    controller: FuelsReportPfnaPagesController,
    moduleName: "getSearchFilterTransaction",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            query: { year: 2022, period: 1, division: 1, transport_id: 1, searchType: "Location", limit: 10, slug: "pbna" },
            responseStatus: 200,
            responseMessage: "Get search  list",
        },

        {
            status: false,
            mockConnection: mockConnection,
            testName: "should return 400 validation error ",
            query: { year: 2022, period: 1, division: 1, transport_id: 1, searchType: "", limit: 10, slug: "pbna" },
            responseStatus: 400,
            responseMessage: "Invalid search type",
        },
        {
            status: false,
            mockConnection: mockConnection,
            testName: "should return 400 validation error ",
            query: { year: 2022, period: 1, division: 1, transport_id: 1, searchType: "asdsa", limit: 10, slug: "pbna" },
            responseStatus: 400,
            responseMessage: "Invalid search type",
        },
        {
            status: false,
            mockConnection: mockConnection,
            testName: "should return 400 validation error ",
            query: { year: 2022, period: 1, division: 1, transport_id: 1, searchType: "asdsa", limit: 10, slug: "" },
            responseStatus: 400,
            responseMessage: "Paylod missing",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias.PEP,

                [comapnyDbAlias?.PEP]: {
                    QueryTypes: { Select: jest.fn() },
                    query: jest.fn<any>().mockResolvedValue([]),
                    models: {
                        FuelReport: {
                            getTableName: jest.fn<any>().mockResolvedValue({ tableName: "test", schema: "adasd", }),
                            findAll: jest.fn<any>().mockResolvedValue([{ test: "asdasd" }]),
                        },
                        Company: {
                            getTableName: jest.fn<any>().mockResolvedValue({ tableName: "test", schema: "adasd", }),
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    },
                },
            },
            testName: "should return NOT_FOUND when no project found",
            query: { year: 2022, period: 1, division: 1, transport_id: 1, searchType: "Company", limit: 10, searchName: "sad", slug: "pbna" },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName:
                "should return INTERNAL_SERVER_ERROR when a database error occurs",
            query: { year: 2022, period: 1, division: 1, transport_id: 1, searchType: "Company", limit: 10, searchName: "sad", slug: "pbna" },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
