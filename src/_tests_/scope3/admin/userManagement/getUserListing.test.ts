import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import AdmiUserController from "../../../../controller/admin/userManagement/userController";

const mockConnection: any = {
    company: comapnyDbAlias?.PEP,
    userData: { id: 2 },
    [comapnyDbAlias?.PEP]: {
        models: {
            GetUserDetails: {
                findAndCountAll: jest.fn<any>().mockResolvedValue({
                    rows: [{ name: "asdasd", color: "qeqeq", data: 12123 }],
                    count: 1
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
    describeName: "Get user Listing",
    controller: AdmiUserController,
    moduleName: "getUserListing",
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
                role_id: 1,
                start_date: "",
                end_date: "",
                email: "",
                status: 1,
                name: "dfgh",
            },
            responseStatus: 200,
            responseMessage: "User listed",
        },
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success col name is role",
            body: {
                page_size: 10,
                page: 1,
                searchText: "",
                order_by: "asc",
                col_name: "role",
                role_id: 1,
                start_date: "",
                end_date: "",
                email: "",
                status: 1,
                name: "dfgh",
            },
            responseStatus: 200,
            responseMessage: "User listed",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                userData: { id: 2 },
                [comapnyDbAlias?.PEP]: {
                    models: {
                        GetUserDetails: {
                            findAndCountAll: jest.fn<any>().mockResolvedValue({
                                rows: [],
                              
                            }),
                        },
                    },
                },
            },
            testName: "should return 200 when no data found",
            body: {
                page_size: 10,
                page: 1,
                searchText: "",
                order_by: "asc",
                col_name: "test",
                role_id: 1,
                start_date: "",
                end_date: "",
                email: "",
                status: 1,
                name: "dfgh",
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
                start_date: "",
                end_date: "",
                email: "",
                status: 1,
                name: "dfgh",
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
