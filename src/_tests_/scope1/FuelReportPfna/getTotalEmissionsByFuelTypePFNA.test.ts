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
                    { total_emissions: 500, name: "Diesel" },
                    { total_emissions: 300, name: "Petrol" },
                ]),
            },
            FuelType: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { id: 1, name: "Diesel" },
                    { id: 2, name: "Petrol" },
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
    describeName: "Total Emissions by Fuel Type PFNA",
    controller: FuelsReportPFNAController,
    moduleName: "getTotalEmissionsByFuelTypePFNA",
    testCases: [
        {
            extraParameter: {},
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: { year: 2024, period_id: 1 },
            responseStatus: 200,
            responseMessage: "Total Emissiosns by fuel type.",
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
