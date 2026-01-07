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
                    { name: "Diesel", color: "#000000", value: 500 },
                    { name: "Petrol", color: "#FF0000", value: 300 },
                ]),
            },
            FuelType: {},
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Fuel Consumption Report by Fuel Type",
    controller: FuelsReportPFNAController,
    moduleName: "getFuelConsumptionReportByFuelTypePer",
    testCases: [
        {
            extraParameter: {},
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when data is successfully fetched",
            body: { year: 2024, period_id: 1, type: "emissions" },
            responseStatus: 200,
            responseMessage: "Fuel consumption report by fuel type.",
        },
        {
            extraParameter: {},
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when data is successfully fetched consumed.",
            body: { year: 2024, period_id: 1, type: "consumption" },
            responseStatus: 200,
            responseMessage: "Fuel consumption report by fuel type.",
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
            body: { year: 2024, period_id: 1, type: "emissions" },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
