import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../constant";
import FuelsReportPFNAController from "../../../controller/scope1/fuelsReportPFNAController";
import HttpStatusMessage from "../../../constant/responseConstant";
import { commonTestFile } from "../../scope3/commonTest";

const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            FuelReportPfna: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        name: "Q1",
                        actual_consumption: 50000,
                        forecast_consumption: 55000,
                    },
                    {
                        name: "Q2",
                        actual_consumption: 60000,
                        forecast_consumption: 62000,
                    },
                ]),
            },
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Fuel consumption report by periods",
    controller: FuelsReportPFNAController,
    moduleName: "getFuelConsumptionReportByPeriod",
    testCases: [
        {
            extraParameter: {},
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: { year: 2024, period_id: 1, fuel_type_id: 2 },
            responseStatus: 200,
            responseMessage: "Fuel consumption report by periods.",
        },
        {
            extraParameter: {},
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        FuelReportPfna: {
                            findAll: jest.fn<any>().mockRejectedValue(new Error("Database error")),
                        },
                    },
                },
            },
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: { year: 2024, period_id: 1, fuel_type_id: 2 },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
