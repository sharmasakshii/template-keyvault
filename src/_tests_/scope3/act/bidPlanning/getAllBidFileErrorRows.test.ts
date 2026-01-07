import { jest } from "@jest/globals";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import BidPlanningController from "../../../../controller/scope3/act/bidPlanningController";

const mockConnection: any = {
    company: comapnyDbAlias?.PEP,
    userData: { id: 1 },
    [comapnyDbAlias?.PEP]: {
        models: {
            BidImport: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { id: 1, file_name: "test_file.xlsx", is_error: 1 },
                    { id: 2, file_name: "error_file.xlsx", is_error: 1 }
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
    describeName: "Get All Bid File Error Rows",
    controller: BidPlanningController,
    moduleName: "getAllBidFileErrorRows",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when error rows are fetched successfully",
            body: {
                page: 1,
                page_size: 10,
                fileName: "sdfsf",
                search: "sfs"
            },
            responseStatus: 200,
            responseMessage: "List of Bid Files.",
        },
        {
            status: true,
            mockConnection: {
                ...mockConnection,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        BidImport: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    },
                },
            },
            testName: "should return NOT_FOUND when no error rows are found",
            body: {
                page_size: 10,
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: {
                page: 1,
                page_size: 10,
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
