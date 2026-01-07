import { jest } from "@jest/globals";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import BidPlanningController from "../../../../controller/scope3/act/bidPlanningController";



const mockConnection: any = {
    company: comapnyDbAlias.PEP,
    userData: { id: 1, companies: [{ slug: "test-company" }] },
    [comapnyDbAlias.PEP]: {
        query: jest.fn<any>().mockResolvedValue([]),
        QueryTypes: { Select: jest.fn() },
        models: {
            BidLanes: {
                update: jest.fn<any>().mockResolvedValue({})
            },
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Update bid lanes ",
    controller: BidPlanningController,
    moduleName: "updateBidImportLane",
    testCases: [
        {
            status: true,
            mockConnection,
            testName: "should return 200 and download error file successfully",
            body: {
                record_id: 1, distance: 1111, fuel_stop_type: "", error: ""
            },
            responseStatus: 200,
            responseMessage: "Distance updated Successfully.",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias.PEP,
                userData: { id: 1, companies: [{ slug: "test-company" }] },
                [comapnyDbAlias.PEP]: {
                    query: jest.fn<any>().mockResolvedValue([]),
                    QueryTypes: { Select: jest.fn() },
                    models: {
                        BidLanes: {
                            update: jest.fn()
                        },
                    },
                },
            },
            testName: "should return 200 when no file found",
            body: {
                record_id: 1, distance: 1111, fuel_stop_type: "", error: ""
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when connection is undefined",
            body: {
                record_id: 1, distance: 1111, fuel_stop_type: "", error: ""
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ]
};

commonTestFile(payload);
