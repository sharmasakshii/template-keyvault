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
                findAll: jest.fn<any>().mockImplementation(({ where }: any) => {
                    if (where.file_id === 1) {
                        return Promise.resolve([
                            {
                                dataValues: {
                                    lane_count: 3,
                                    carrier_count: 2,
                                    total_count: 5,
                                },
                            },
                        ]);
                    }
                    return Promise.resolve([]);
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
    describeName: "Fetch Bid Details",
    controller: BidPlanningController,
    moduleName: "fetchBidDetail",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when bid details are fetched successfully",
            body: { file_id: 1 },
            responseStatus: 200,
            responseMessage: "Bid Details Data",
        },
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 with NOT_FOUND when no bid details are found",
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
