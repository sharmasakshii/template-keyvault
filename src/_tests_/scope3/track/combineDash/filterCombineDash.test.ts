import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import CommonAltrEVController from "../../../../controller/scope3/combineDashboard/combineDashAltrEv";

const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            SummarisedFuelBoard: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { intensity: 10, carrier: "ewrdgf" },
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
    describeName: "Get filter list",
    controller: CommonAltrEVController,
    moduleName: "filterCombineDash",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 with vendor emission data",
            body: {
                country: "", year: 3333
            },
            responseStatus: 200,
            responseMessage: "filter list",
        },

        {
            status: false,
            mockConnection: undefined,
            testName: "should return 500 when an error occurs in DB query",
            body: {
                country: '',
                year: '',

            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
