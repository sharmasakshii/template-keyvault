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
            BidFileStatus: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { status_name: "Uploaded", id: 1 },
                    { status_name: "Processing", id: 2 },
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
    describeName: "Get All Bid Status",
    controller: BidPlanningController,
    moduleName: "getAllBidStatus",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when bid statuses are fetched successfully",
            body: {},
            responseStatus: 200,
            responseMessage: "List of Bid Files.",
        },
        {
            status: true,
            mockConnection: {
                ...mockConnection,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        BidFileStatus: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    },
                },
            },
            testName: "should return NOT_FOUND when no bid statuses are found",
            body: {},
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: {},
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
