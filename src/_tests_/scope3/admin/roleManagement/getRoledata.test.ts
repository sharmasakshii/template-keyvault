import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import RoleController from "../../../../controller/admin/roleController/roleController";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";


const mockConnection: any = {
    schema: "testSchema",
    company: comapnyDbAlias?.PEP,
    userData: { id: 2 },
    [comapnyDbAlias?.PEP]: {
        query: jest.fn<any>().mockResolvedValue([{ test: "vghjk" }]),
        QueryTypes: { Select: jest.fn() },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get role data  Listing",
    controller: RoleController,
    moduleName: "getRoledata",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: {
                page_size: 10,
                page: 1,
                searchText: "",
                order_by: "asc",
                col_name: "test",
                role_id: 1
            },
            responseStatus: 200,
            responseMessage: "Roles data with user counts",
        },

        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                userData: { id: 2 },
                [comapnyDbAlias?.PEP]: {
                    query: jest.fn<any>().mockResolvedValue([]),
                    QueryTypes: { Select: jest.fn() },
                },
            },
            testName: "should return 200 when no data found",
            body: {
                page_size: 10,
                page: 1,
                searchText: "",
                order_by: "asc",
                col_name: "test",

            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },

        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: {
                page_size: 10,
                page: 1,
                searchText: "",
                order_by: "asc",
                col_name: "test",
                role_id: 1,

            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
