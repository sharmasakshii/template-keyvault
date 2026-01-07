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
                findOne: jest.fn<any>().mockResolvedValue(null),
                create: jest.fn<any>().mockResolvedValue([])
            },
            RoleAccess: {
                bulkCreate: jest.fn<any>().mockResolvedValue([])
            }
        }
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Create Role",
    controller: RoleController,
    moduleName: "createRole",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when successfully delete role",
            body: {
                name: "", description: "", moduleIds: [1, 2]
            },
            responseStatus: 200,
            responseMessage: "Role Created Successfully.",
        },
        {
            status: false,
            mockConnection: {
                schema: "testSchema",
                company: comapnyDbAlias?.PEP,
                userData: { id: 2 },
                [comapnyDbAlias?.PEP]: {
                    models: {

                    }
                },
            },
            testName: "validation check",
            body: {
                name: "xZXZXZXCCXs gsdhgasdhjsd jas jhasdvasd asc jasca sc ascjasvckasjhasdjasdkjasn asaskjdasbjdaskjdas  kasdbkasda smdaskbjdbasjkdbjaksdbkjadbjkasdbkjasdbkjasbdjkabjksdbkj", description: "", moduleIds: [1, 2]
            },
            responseStatus: 422,
            responseMessage: "Name exceeds the character limit (50 characters).",
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
                            findOne: jest.fn<any>().mockResolvedValue({ test: "fghj" }),
                        },
                    }
                },
            },
            testName: "If role already exist",
            body: {
                name: "", description: "", moduleIds: [1, 2]
            },
            responseStatus: 409,
            responseMessage: "Sorry, the role name is already in use. Please enter a different role name.",
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
