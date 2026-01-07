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
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        id: 1,
                        name: "test-file.csv",
                        base_path: "/bids",
                        user_id: 1,
                        status: { status_name: "Uploaded", id: 1 },
                        user: { user_id: 1, user_name: "John Doe" },
                        bidError: { error_message: "No error", status_id: 1 },
                        processing: {}
                    }
                ]),
                count: jest.fn<any>().mockResolvedValue(1),
            },
            BidFileStatus: {
                findAll: jest.fn<any>().mockResolvedValue([{ status_name: "Uploaded", id: 1 }])
            },
            GetUserDetails: {
                findAll: jest.fn<any>().mockResolvedValue([{ user_id: 1, user_name: "John Doe" }])
            },
            BidErrorLog: {
                findAll: jest.fn<any>().mockResolvedValue([{ error_message: "No error", status_id: 1 }])
            },
            BidProcessing: {
                findAll: jest.fn<any>().mockResolvedValue([{}])
            }
        }
    }
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get All Bid Files",
    controller: BidPlanningController,
    moduleName: "getAllBidFiles",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when bid files are fetched successfully",
            body: { page: 1, page_size: 10 },
            responseStatus: 200,
            responseMessage: "List of Bid Files.",
        },
        {
            status: true,
            mockConnection: {
                ...mockConnection,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        BidManagement: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                            count: jest.fn<any>().mockResolvedValue(0),
                        },
                    },
                },
            },
            testName: "should return NOT_FOUND when no bid files are found",
            body: { page: 1, page_size: 10 },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: { page: 1, page_size: 10 },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
