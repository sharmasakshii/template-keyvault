import { jest } from "@jest/globals";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import BidPlanningController from "../../../../controller/scope3/act/bidPlanningController";

const mockConnection:any = {
    company: comapnyDbAlias?.PEP,
    schema: "green_sight",
    userData: { id: 1 },
    [comapnyDbAlias?.PEP]: {
        QueryTypes: { Select: jest.fn() },
        query: jest.fn<any>().mockResolvedValue([]),
        models: {
            BidManagement: {
                findOne: jest.fn<any>().mockResolvedValue({ id: 123, file_name: "test_file" }),
            },
            BidImport: {
                count: jest.fn<any>().mockResolvedValue(2),
                findAll: jest.fn<any>().mockResolvedValue([
                    { id: 1, lane_name: "Lane 1", scac: "ABC", file_id: 123 },
                    { id: 2, lane_name: "Lane 2", scac: "XYZ", file_id: 123 },
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
    describeName: "Get Bid File Output Table",
    controller: BidPlanningController,
    moduleName: "getBidFileOutputTable",
    testCases: [
        {
            status: true,
            mockConnection,
            testName: "should return 200 when bid file lanes are fetched successfully",
            body: { file_id: 123, page: 1, page_size: 10 , origin:"sfsd", dest:"sfsdf" },
            responseStatus: 200,
            responseMessage: "List of Bid File lanes.",
        },
        {
            status: true,
            mockConnection: {
                ...mockConnection,
                [comapnyDbAlias?.PEP]: {
                    ...mockConnection[comapnyDbAlias?.PEP],
                    models: {
                        ...mockConnection[comapnyDbAlias?.PEP].models,
                        BidImport: {
                            count: jest.fn<any>().mockResolvedValue(0),
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    },
                },
            },
            testName: "should return NOT_FOUND when no bid file lanes are found",
            body: { file_id: 123, page_size: 10 ,dest:"sfsf" },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: true,
            mockConnection: {
                ...mockConnection,
                [comapnyDbAlias?.PEP]: {
                    ...mockConnection[comapnyDbAlias?.PEP],
                    models: {
                        ...mockConnection[comapnyDbAlias?.PEP].models,
                        BidImport: {
                            count: jest.fn<any>().mockResolvedValue(0),
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    },
                },
            },
            testName: "should return NOT_FOUND when no bid file lanes are found it have origin but don't have destination.",
            body: { file_id: 123, page_size: 10 ,origin:"sfsf" },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: { file_id: 123, page: 1, page_size: 10 },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
