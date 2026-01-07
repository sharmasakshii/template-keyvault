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
    describeName: "Get scac list",
    controller: CommonAltrEVController,
    moduleName: "getScacListCombineDash",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when scac list found",
            body: {
                country: "", year: 3333
            },
            responseStatus: 200,
            responseMessage: "filter scac list",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        SummarisedFuelBoard: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    },
                },
            },
            testName: "should return 200 when no scac found",
            body: {
                country: "", year: 3333
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
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
