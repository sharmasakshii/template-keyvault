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
                    status_id: 1,
                    processing: {},
                    dataValues: {
                        id: 1,
                        status_id: 1,
                        processing: {},
                        
                    }
                }),
            },
            BidLanes:  {
                count: jest.fn<any>().mockImplementation(({ where }:any) => {
                    // Mock counts based on the condition
                    if (where.is_processed === 1) return Promise.resolve(5);
                    if (where.is_error === 1) return Promise.resolve(2);
                    if (where.file_id) return Promise.resolve(10);
                    return Promise.resolve(0);
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
    describeName: "Check Process Status",
    controller: BidPlanningController,
    moduleName: "checkProcessStatus",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when bid process status is fetched successfully",
            body: { fileId: 1 },
            responseStatus: 200,
            responseMessage: "Bid Lanes Data",
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: { fileId: 3 },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
