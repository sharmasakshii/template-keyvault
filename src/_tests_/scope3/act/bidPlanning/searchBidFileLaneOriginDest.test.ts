import { jest } from "@jest/globals";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import BidPlanningController from "../../../../controller/scope3/act/bidPlanningController";

const mockConnection: any = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            BidImport: {
                findAll: jest.fn<any>().mockResolvedValue([{
                    dataValues: {
                        status: 0
                    }
                },
                {
                    dataValues: {
                        status: 1
                    }
                }]),
            },
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Search bid file lane origin dest",
    controller: BidPlanningController,
    moduleName: "searchBidFileLaneOriginDest",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: { keyword: "Test", page_limit: 10, type: "dest", source: "", dest: "", file_id: 1 },
            responseStatus: 200,
            responseMessage: "Bid file cities.",
        },

        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when type not dest success",
            body: { keyword: "Test", page_limit: 10, type: "", source: "", dest: "", file_id: 1 },
            responseStatus: 200,
            responseMessage: "Bid file cities.",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        BidImport: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    },
                },
            },
            testName: "should return NOT_FOUND when no project found",
            body: { keyword: "Test", page_limit: 10, type: "", source: "", dest: "", file_id: 1 },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName:
                "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: { region_id: 1, year: 2024, division_id: 1 },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
