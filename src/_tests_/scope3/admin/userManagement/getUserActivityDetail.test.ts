import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import AdmiUserController from "../../../../controller/admin/userManagement/userController";

const mockConnection: any = {
    schema: "test",
    company: comapnyDbAlias?.PEP,
    userData: { id: 2, companies: [{ UserCompany: { company_id: 1 } }] },
    [comapnyDbAlias?.PEP]: {
        query: jest.fn<any>().mockResolvedValue([{ test: "" }]),
        QueryTypes: { Select: jest.fn() },
    },
    main: {
        models: {
            User: { findAll: jest.fn<any>().mockResolvedValue([{ id: 1, name: "test" }]) }
        }
    }
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get user activity detail",
    controller: AdmiUserController,
    moduleName: "getUserActivityDetail",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: {
                user_id: 1, page_size: 10, page_number: 1
            },
            responseStatus: 200,
            responseMessage: "Audit user activity",
        },
        {
            status: true,
            mockConnection: {
                schema: "test",
                company: comapnyDbAlias?.PEP,
                userData: { id: 2, companies: [{ UserCompany: { company_id: 1 } }] },
                [comapnyDbAlias?.PEP]: {
                    query: jest.fn<any>().mockResolvedValue([]),
                    QueryTypes: { Select: jest.fn() },
                },
                main: {
                    models: {
                        User: { findAll: jest.fn<any>().mockResolvedValue([{ id: 1, name: "test" }]) }
                    }
                }
            },
            testName: "should return 200 when no data found of user",
            body: {
                user_id: 1, page_size: 10, page_number: 1
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
