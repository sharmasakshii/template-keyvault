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
                findOne: jest.fn<any>().mockResolvedValue({ dataValues: { id: 1 } }),
                update: jest.fn<any>().mockResolvedValue([])
            },
            GetUserDetails: {
                findOne: jest.fn<any>().mockResolvedValue(null)
            }
        }
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Delete Role",
    controller: RoleController,
    moduleName: "deleteRole",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when successfully delete role",
            body: {
                role_id: 1
            },
            responseStatus: 200,
            responseMessage: "Role deleted successfully",
        },
        {
            status: false,
            mockConnection: {
                schema: "testSchema",
                company: comapnyDbAlias?.PEP,
                userData: { id: 2 },
                [comapnyDbAlias?.PEP]: {
                    models: {
                        Roles: {
                            findOne: jest.fn<any>().mockResolvedValue({ dataValues: { id: 1 } }),
                        },
                        GetUserDetails: {
                            findOne: jest.fn<any>().mockResolvedValue([])
                        }
                    }
                },
            },
            testName: "if user already exist on this role ",
            body: {
                role_id: 1
            },
            responseStatus: 400,
            responseMessage: "This role cannot be deleted as it is currently assigned to one or more users",
        },
        {
            status: false,
            mockConnection: {
                schema: "testSchema",
                company: comapnyDbAlias?.PEP,
                userData: { id: 2 },
                [comapnyDbAlias?.PEP]: {
                    models: {
                        Roles: {
                            findOne: jest.fn<any>().mockResolvedValue(null),
                        },
                    }
                },
            },
            testName: "if role not found with role_id",
            body: {
                role_id: 1
            },
            responseStatus: 400,
            responseMessage: "Role not found",
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: {
                role_id: 1,
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
