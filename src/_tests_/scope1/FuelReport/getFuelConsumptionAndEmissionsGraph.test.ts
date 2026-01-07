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
                findAll: jest.fn<any>().mockResolvedValue([{ name: "asdasd", color: "qeqeq", data: 12123 }]),
            },
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Fuel consumption and emission",
    controller: FuelsReportPfnaPagesController,
    moduleName: "getFuelConsumptionAndEmissionsGraph",
    testCases: [
        {
            extraParameter: { graph: "emission" },
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: { year: 2022, period: 1, division: 1, transport_id: 1, slug: 'pbna' },
            responseStatus: 200,
            responseMessage: "Fuel emissions report data.",
        },
        {
            extraParameter: { graph: "emission" },
            status: false,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: { year: 2022, period: 1, division: 1, transport_id: 1, slug: "" },
            responseStatus: 400,
            responseMessage: "Paylod missing",
        },
        {
            extraParameter: { graph: "consumption" },
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        FuelReportss: {
                            findAll: jest.fn<any>().mockResolvedValue([{ test: "asdasd" }]),
                        },
                    },
                },
            },
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: { year: 2022, period: 1, division: 1, transport_id: 1, slug: 'pbna' },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
