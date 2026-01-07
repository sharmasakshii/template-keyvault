import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../constant";
import HttpStatusMessage from "../../../constant/responseConstant";
import { commonTestFile } from "../../scope3/commonTest";
import FuelsReportPfnaPagesController from "../../../controller/scope1/fuelsReportPfnaPagesController";

const mockConnection: any = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            FuelReport: {
                findAll: jest.fn<any>().mockResolvedValue([{ total_ghg_emissions: "asdasd" }]),
            },
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Filter period year and transport",
    controller: FuelsReportPfnaPagesController,
    moduleName: "getFuelsReportMetrics",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: { year: 2022, period: 1, division: 1, transport_id: 1,slug:"pbna" },
            responseStatus: 200,
            responseMessage: "Fuel emissions report metrics data.",
        },
        {
            status: false,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: { year: 2022, period: 1, division: 1, transport_id: 1,slug:"" },
            responseStatus: 400,
            responseMessage: "Paylod missing",
        },
        {
            status: false,
            mockConnection: undefined,
            testName:
                "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: { year: 2022, period: 1, division: 1, transport_id: 1, slug:"bulk" },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
