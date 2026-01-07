import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../constant";
import FuelsReportController from "../../../controller/scope1/fuelsReportController";
import HttpStatusMessage from "../../../constant/responseConstant";
import { commonTestFile } from "../../scope3/commonTest";

const mockConnection: any = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            FuelReport: {
                findAll: jest.fn<any>().mockResolvedValue([{ dataValues: { fuel_consumption: 1232132312, division: "central", color: "12321" } }]),
            },
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Pie chart data ",
    controller: FuelsReportController,
    moduleName: "getPieChartData",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            query: { year: 2022, period: 1, division: 1, transport_id: 1, type: "fuel", limit: 10 },
            responseStatus: 200,
            responseMessage: "Get pie chart data  list",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        FuelReport: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    },
                },
            },
            testName: "should return NOT_FOUND when no project found",
            query: { year: 2022, period: 1, division: 1, transport_id: 1, type: "", limit: 10 },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName:
                "should return INTERNAL_SERVER_ERROR when a database error occurs",
                query: { year: 2022, period: 1, division: 1, transport_id: 1, type: "fuel", limit: 10 },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
