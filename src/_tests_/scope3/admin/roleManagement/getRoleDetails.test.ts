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
        models: {
            Roles: {
                findOne: jest.fn<any>().mockResolvedValue({})
            },
            Module: {
                findAll: jest.fn<any>().mockResolvedValue([{ title: "fghj", id: 1, parent_id: 1, slug: "dadas" }])
            },
            RoleAccess: {
                findAll: jest.fn<any>().mockResolvedValue([{ module_id: 1 }])
            },
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get role details",
    controller: RoleController,
    moduleName: "getRoleDetails",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: {
                role_id: 1
            },
            responseStatus: 200,
            responseMessage: "Role Details.",
        },
        {
            status: false,
            mockConnection: mockConnection,
            testName: "if no role in payload",
            body: {
                role_id: ""
            },
            responseStatus: 400,
            responseMessage: "Payload missing",
        },

        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                userData: { id: 2 },
                [comapnyDbAlias?.PEP]: {
                    models: {
                        Roles: {
                            findOne: jest.fn<any>().mockResolvedValue(null)
                        },
                    },
                },
            },
            testName: "should return 200 when no data found",
            body: {
                role_id: 1
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
