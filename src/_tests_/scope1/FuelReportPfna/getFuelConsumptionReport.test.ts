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
                        name: "Bulk",
                        actual_consumption: 9798669,
                        forecast_consumption: 10684497,
                    },
                    {
                        name: "Retail",
                        actual_consumption: 1442405,
                        forecast_consumption: 25888753,
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
    describeName: "Fuel consumption report",
    controller: FuelsReportPFNAController,
    moduleName: "getFuelConsumptionReport",
    testCases: [
        {
            extraParameter: {},
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: { year: 2024, period_id: 1 },
            responseStatus: 200,
            responseMessage: "Fuel consumption report.",
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
            body: { year: 2024, period_id: 1 },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);