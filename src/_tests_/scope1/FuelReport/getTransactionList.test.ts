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
                findAndCountAll: jest.fn<any>().mockResolvedValue({
                    rows: [{
                        dataValues: {
                            status: 0
                        }
                    },
                    {
                        dataValues: {
                            status: 1
                        }
                    }],
                    count: 10
                }),
            },
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get transaction  list ",
    controller: FuelsReportController,
    moduleName: "getTransactionList",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: { year: 2022, period: 1, division: 1, transport_id: 1 },
            responseStatus: 200,
            responseMessage: "Get transaction list",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        FuelReport: {
                            findAndCountAll: jest.fn<any>().mockResolvedValue({
                                rows: [],
                                count: 0
                            }),
                        },
                    },
                },
            },
            testName: "should return NOT_FOUND when no project found",
            body: { year: 2022, period: 1, division: 1, transport_id: 1 },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName:
                "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: { year: 2022, period: 1, division: 1, transport_id: 1 },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
