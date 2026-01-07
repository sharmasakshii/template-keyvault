import { jest } from "@jest/globals";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import BidPlanningController from "../../../../controller/scope3/act/bidPlanningController";

jest.mock("../../../../utils", () => ({
    blobMove: jest.fn<any>().mockReturnValueOnce({ status: 200 }).mockReturnValueOnce({ status: 400 }),
}))

jest.mock("../../../../BlobService/helper", () => ({
    blobConnection: jest.fn<any>().mockResolvedValue({
        containerClient: {
            getBlobClient: jest.fn(() => ({
                delete: jest.fn<any>().mockResolvedValue(true),
            })),
        },
    })
   
}));

// Mock database connection
const mockConnection: any = {
    company: comapnyDbAlias?.PEP,
    userData: { id: 1, companies: [{ slug: "test-company" }] },
    [comapnyDbAlias?.PEP]: {
        models: {
            BidManagement: {
                update: jest.fn<any>().mockResolvedValue([1]),
            },
            BidImport: {
                destroy: jest.fn<any>().mockResolvedValue(1),
            },
            BidProcessing: {
                destroy: jest.fn<any>().mockResolvedValue(1),
            },
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Delete Multiple Bid Files",
    controller: BidPlanningController,
    moduleName: "deleteMiltipleBidFile",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when all files are deleted successfully",
            body: { file_id: [{ id: 1, name: "test.csv", is_movable: 1, base_path: "/" }, { id: 2, name: "test1.csv", is_movable: 0, base_path: "/any/" }, { id: 3, name: "test2.csv", is_movable: 1, base_path: "/any/" }] },
            responseStatus: 200,
            responseMessage: "Files deleted successfully.",
            headers: { authorization: "Bearer XXXXXX" },
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: { file_id: [{ id: 1, name: "test.csv", is_movable: 1 }] },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 400 when blobMove fails",
            body: { file_id: [{ id: 1, name: "test.csv", is_movable: 1, base_path: "/" }] },
            responseStatus: 200,
            responseMessage: "Files deleted successfully.",
        },
    ],
};

commonTestFile(payload);
