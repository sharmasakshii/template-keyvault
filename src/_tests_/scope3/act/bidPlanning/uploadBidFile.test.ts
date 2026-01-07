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
                create: jest.fn<any>().mockResolvedValue({
                    id: 1,
                    name: "test-file.csv",
                    base_path: "/bids",
                    user_id: 1,
                    type: "bid",
                    is_deleted: 0,
                    status_id: 1
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
    describeName: "Upload Bid File",
    controller: BidPlanningController,
    moduleName: "uploadBidFile",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when file is uploaded successfully",
            body: { name: "test-file.csv", base_path: "/bids", statusId: 1 },
            responseStatus: 200,
            responseMessage: "File uploaded sucessfully.",
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: { name: "test-file.csv", base_path: "/bids", statusId: 1 },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        }
    ],
};

commonTestFile(payload);