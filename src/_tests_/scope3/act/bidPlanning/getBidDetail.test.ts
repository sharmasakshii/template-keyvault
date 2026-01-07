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
            BidManagement: {
                findOne: jest.fn<any>().mockResolvedValue({
                    id: 1,
                    name: "test-file.csv",
                    base_path: "/bids",
                    user_id: 1,
                    status: { status_name: "Uploaded", id: 1 },
                    user: { user_id: 1, user_name: "John Doe" },
                    bidError: { error_message: "No error", status_id: 1 },
                    processing: {}
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
    describeName: "Get Bid Detail",
    controller: BidPlanningController,
    moduleName: "getBidDetail",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when file detail is fetched successfully",
            body: { file_id: 1 },
            responseStatus: 200,
            responseMessage: "File detail fetched.",
        },
        {
            status: true,
            mockConnection: {
                ...mockConnection,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        BidManagement: {
                            findOne: jest.fn<any>().mockResolvedValue(null),
                        },
                    },
                },
            },
            testName: "should return NOT_FOUND when file detail is not found",
            body: { file_id: 2 },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: { file_id: 3 },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
