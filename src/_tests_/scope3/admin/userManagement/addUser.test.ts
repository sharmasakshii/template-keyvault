import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import AdmiUserController from "../../../../controller/admin/userManagement/userController";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";


const mockConnection: any = {
    company: comapnyDbAlias?.PEP,
    userData: { companies: [{ slug: "rfghjk" }] },
    ['main']: {
        Sequelize: {
            transaction: jest.fn<any>(() => ({
                commit: jest.fn(),
                rollback: jest.fn()
            }))
        },
        models: {
            Company: {
                findOne: jest.fn<any>().mockResolvedValue({ name: "asdasd", color: "qeqeq", data: 12123 }),
            },
            User: {
                findOne: jest.fn<any>().mockResolvedValue(null),
                create: jest.fn<any>().mockResolvedValue({ id: 1 })
            },
            Profile: {
                create: jest.fn<any>().mockResolvedValue({ id: 1 })
            },
            UserCompany: {
                create: jest.fn<any>().mockResolvedValue({ id: 1 })
            },
            UserPasswordLog: {
                create: jest.fn<any>().mockResolvedValue({ id: 1 })
            }
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Create user",
    controller: AdmiUserController,
    moduleName: "addUser",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: { firstName: "test", lastName: "check", phone: "3123213123", email: "test@yopmail.com", roleId: 1, regionId: 1, password: "U2FsdGVkX198O8Gu1F/d3w7zdluG6crDeb2mU+RMZrw=" },
            responseStatus: 200,
            responseMessage: "User created successfully",
        },

        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                userData: { companies: [{ slug: "rfghjk" }] },
                ['main']: {
                    Sequelize: {
                        transaction: jest.fn<any>(() => ({
                            commit: jest.fn(),
                            rollback: jest.fn()
                        }))
                    },
                    models: {
                        Company: {
                            findOne: jest.fn<any>().mockResolvedValue({ name: "asdasd", color: "qeqeq", data: 12123 }),
                        },
                        User: {
                            findOne: jest.fn<any>().mockResolvedValue({}),
                            create: jest.fn<any>().mockResolvedValue({ id: 1 })
                        }
                    },
                },
            },
            testName: "if user already exist",
            body: { firstName: "test", lastName: "check", phone: "3123213123", email: "test@yopmail.com", roleId: 1, regionId: 1, password: "U2FsdGVkX1+0nOLCfo6CNFgsl5P3K7g4nbRrmArOUkY=" },
            responseStatus: 400,
            responseMessage: "User already exists with this email address",
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                userData: { companies: [{ slug: "rfghjk" }] },
                ['main']: {
                    Sequelize: {
                        transaction: jest.fn<any>(() => ({
                            commit: jest.fn(),
                            rollback: jest.fn()
                        }))
                    },
                    models: {
                        Company: {
                            findOne: jest.fn<any>().mockResolvedValue({ name: "asdasd", color: "qeqeq", data: 12123 }),
                        },
                        User: {
                            findOne: jest.fn<any>().mockResolvedValue(null),
                            create: jest.fn<any>().mockResolvedValue({ id: 1 })
                        }
                    },
                },
            },
            testName: "if password format is incorrect",
            body: { firstName: "test", lastName: "check", phone: "3123213123", email: "test@yopmail.com", roleId: 1, regionId: 1, password: "U2FsdGVkX18JDOWpPugbQZM8Qb4sh2f0i+rnpIEmYgg=" },
            responseStatus: 400,
            responseMessage: "Invalid password format",
        },

        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                userData: { companies: [{ slug: "rfghjk" }] },
                ['main']: {
                    Sequelize: {
                        transaction: jest.fn<any>(() => ({
                            commit: jest.fn(),
                            rollback: jest.fn()
                        }))
                    },

                },
            },
            testName: "if validation error",
            body: { firstName: "test", lastName: "check", phone: "3123213123", email: "test.com", roleId: 1, regionId: 1, password: "U2FsdGVkX198O8Gu1F/d3w7zdluG6crDeb2mU+RMZrw=" },
            responseStatus: 400,
            responseMessage: "Validation Errors!",
        },

        {
            extraParameter: { graph: "emissions" },
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                userData: { companies: [{ slug: "rfghjk" }] },
                ['main']: {
                    Sequelize: {
                        transaction: jest.fn<any>(() => ({
                            commit: jest.fn(),
                            rollback: jest.fn()
                        }))
                    },

                },
            },
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: { firstName: "test", lastName: "check", phone: "3123213123", email: "test@yopmail.com", roleId: 1, regionId: 1, password: "U2FsdGVkX1+KPA7hF0tL9gn8+LCk6sU+Ninhsrr5iNY=" },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
