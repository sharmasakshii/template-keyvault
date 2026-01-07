import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import LaneSettingController from "../../../../controller/admin/laneSetting/laneSettingController";

const mockConnection: any = {
    schema: "test",
    company: comapnyDbAlias?.PEP,
    userData: { id: 2 },
    ["main"]: {
        query: jest.fn<any>().mockResolvedValue([{ name: "dds_adasd", origin: "sdasdasd", destination: "dasdZXz", distance: "asdasd", id: 1 }]),
        QueryTypes: { Select: jest.fn() },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get B100 fuel list ",
    controller: LaneSettingController,
    moduleName: "B100FuelStopLanes",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: {
                page_number: 10, page_size: 10, origin: "", destination: "", optimus_radius: 10
            },
            responseStatus: 200,
            responseMessage: "optimus fuel stop lanes data",
        },
        {
            status: false,
            mockConnection: {
                schema: "test",
                company: comapnyDbAlias?.LW,
                userData: { id: 2 },
                ["main"]: {
                    query: jest.fn<any>().mockResolvedValue([{ tes: "" }]),
                    QueryTypes: { Select: jest.fn() },
                },
            },
            testName: "validation error ",
            body: {
                page_number: 10, page_size: 10, origin: "", destination: "", optimus_radius: 10
            },
            responseStatus: 400,
            responseMessage: "You are not authorized to access this end point",
        },
        {
            status: true,
            mockConnection: {
                schema: "test",
                company: comapnyDbAlias?.PEP,
                userData: { id: 2 },
                ["main"]: {
                    query: jest.fn<any>().mockResolvedValue([]),
                    QueryTypes: { Select: jest.fn() },
                },
            },
            testName: "should return 200 when success not found",
            body: {
                folder_path: "/", page_size: 10, page: 1, status: 1, file_management_id: 1
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: {
                user_id: 1
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
