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
                findAll: jest.fn<any>().mockResolvedValue([{ dataValues: { region_id: 1, phone_number: "", role_id: 1 } }]),
                update: jest.fn<any>().mockResolvedValue({ id: 1 })
            },
            Profile: {
                findOne: jest.fn<any>().mockResolvedValue({ update: jest.fn() }),
                update: jest.fn<any>().mockResolvedValue({ id: 1 })
            },
            UserToken: {
                update: jest.fn<any>().mockResolvedValue({ id: 1 }),
            }
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Update user",
    controller: AdmiUserController,
    moduleName: "updateUser",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when successfully updated",
            body: { user_id: 1, first_name: "test", last_name: "check", phone: "3123213123", email: "test@yopmail.com", roleId: 1, regionId: 1, password: "" },
            responseStatus: 200,
            responseMessage: "User Profile Updated.",
        },
        {
            status: true,
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
                            findAll: jest.fn<any>().mockResolvedValue([{ dataValues: { region_id: 1, phone_number: "", role_id: 2 } }]),
                            update: jest.fn<any>().mockResolvedValue({ id: 1 })
                        },
                        Profile: {
                            findOne: jest.fn<any>().mockResolvedValue({ update: jest.fn() }),
                            update: jest.fn<any>().mockResolvedValue({ id: 1 })
                        },
                        UserToken: {
                            update: jest.fn<any>().mockResolvedValue({ id: 1 })

                        }
                    },
                },
            },
            testName: "should return 200 when successfully updated when role change ",
            body: { user_id: 1, first_name: "test", last_name: "check", phone: "3123213123", email: "test@yopmail.com", roleId: 1, regionId: 1, password: "" },
            responseStatus: 200,
            responseMessage: "User Profile Updated.",
        },

        {
            status: true,
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
                            findAll: jest.fn<any>().mockResolvedValue([{ dataValues: { region_id: 1, phone_number: "", role_id: 1, password: "$2b$12$8fsMHx3qQFv2IS/L5aV1VumpsAO9BlXDZDGdF6OoBRcmi1AJlD9Ia" } }]),
                            update: jest.fn<any>().mockResolvedValue({ id: 1 })
                        },
                        Profile: {
                            findOne: jest.fn<any>().mockResolvedValue({ update: jest.fn() }),
                            update: jest.fn<any>().mockResolvedValue({ id: 1 })
                        },
                        UserPasswordLog: {
                            create: jest.fn<any>().mockResolvedValue({ id: 1 }),
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                        UserToken: {
                            update: jest.fn<any>().mockResolvedValue({ id: 1 }),
                        }
                    },
                },
            },
            testName: "should return 200 when password update",
            body: { user_id: 1, first_name: "test", last_name: "check", phone: "3123213123", email: "test@yopmail.com", roleId: 1, regionId: 1, password: "U2FsdGVkX1+0nOLCfo6CNFgsl5P3K7g4nbRrmArOUkY=" },
            responseStatus: 200,
            responseMessage: "User profile updated successfully.",
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
                            findAll: jest.fn<any>().mockResolvedValue([{ dataValues: { region_id: 1, phone_number: "", role_id: 1, password: "$2b$12$8fsMHx3qQFv2IS/L5aV1VumpsAO9BlXDZDGdF6OoBRcmi1AJlD9Ia" } }]),
                            update: jest.fn<any>().mockResolvedValue({ id: 1 })
                        },
                        Profile: {
                            findOne: jest.fn<any>().mockResolvedValue({ update: jest.fn() }),
                            update: jest.fn<any>().mockResolvedValue({ id: 1 })
                        },
                        UserPasswordLog: {
                            create: jest.fn<any>().mockResolvedValue({ id: 1 }),
                            findAll: jest.fn<any>().mockResolvedValue([{ old_password: "$2b$12$8fsMHx3qQFv2IS/L5aV1VumpsAO9BlXDZDGdF6OoBRcmi1AJlD9Ia" }]),
                        },
                        UserToken: {
                            update: jest.fn<any>().mockResolvedValue({ id: 1 }),
                        }
                    },
                },
            },
            testName: "new password must be different from your previous password",
            body: { user_id: 1, first_name: "test", last_name: "check", phone: "3123213123", email: "test@yopmail.com", roleId: 1, regionId: 1, password: "U2FsdGVkX1+0nOLCfo6CNFgsl5P3K7g4nbRrmArOUkY=" },
            responseStatus: 400,
            responseMessage: "Your new password must be different from your previous password.",
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
                            findAll: jest.fn<any>().mockResolvedValue([{ dataValues: { region_id: 1, phone_number: "", role_id: 1, password: "$2b$12$8fsMHx3qQFv2IS/L5aV1VumpsAO9BlXDZDGdF6OoBRcmi1AJlD9Ia" } }]),
                            update: jest.fn<any>().mockResolvedValue({ id: 1 })
                        },
                        Profile: {
                            findOne: jest.fn<any>().mockResolvedValue({ update: jest.fn() }),
                            update: jest.fn<any>().mockResolvedValue({ id: 1 })
                        },
                        UserPasswordLog: {
                            create: jest.fn<any>().mockResolvedValue({ id: 1 }),
                            findAll: jest.fn<any>().mockResolvedValue([{ old_password: "$2b$12$8fsMHx3qQFv2IS/L5aV1VumpsAO9BlXDZDGdF6OoBRcmi1AJlD9Ia" }]),
                        },
                        UserToken: {
                            update: jest.fn<any>().mockResolvedValue({ id: 1 }),
                        }

                    },
                },
            },
            testName: "Invalid password format",
            body: { user_id: 1, first_name: "test", last_name: "check", phone: "3123213123", email: "test@yopmail.com", roleId: 1, regionId: 1, password: "U2FsdGVkX18JDOWpPugbQZM8Qb4sh2f0i+rnpIEmYgg=" },
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
                    models: {
                        Company: {
                            findOne: jest.fn<any>().mockResolvedValue({ name: "asdasd", color: "qeqeq", data: 12123 }),
                        },
                        User: {
                            findOne: jest.fn<any>().mockResolvedValue(null),
                            findAll: jest.fn<any>().mockResolvedValue([{ dataValues: { region_id: 1, phone_number: "", role_id: 1, password: "" } }]),
                            update: jest.fn<any>().mockResolvedValue({ id: 1 })
                        },
                        Profile: {
                            findOne: jest.fn<any>().mockResolvedValue({ update: jest.fn() }),
                            update: jest.fn<any>().mockResolvedValue({ id: 1 })
                        },
                        UserPasswordLog: {
                            create: jest.fn<any>().mockResolvedValue({ id: 1 }),
                            findAll: jest.fn<any>().mockResolvedValue([{ old_password: "$2b$12$8fsMHx3qQFv2IS/L5aV1VumpsAO9BlXDZDGdF6OoBRcmi1AJlD9Ia" }]),
                        },
                        UserToken: {
                            update: jest.fn<any>().mockResolvedValue({ id: 1 }),
                        }
                    },
                },
            },
            testName: "Validation Errors!",
            body: { user_id: 1, first_name: "test", last_name: "check", phone: "3123213123", email: "test@yopmail.com", roleId: 1, regionId: 1, password: "U2FsdGVkX18JDOWpPugbQZM8Qb4sh2f0i+rnpIEmYgg=" },
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
                    models: {
                        Company: {
                            findOne: jest.fn<any>().mockResolvedValue({ name: "asdasd", color: "qeqeq", data: 12123 }),
                        },
                        Userss: {
                            findOne: jest.fn<any>().mockResolvedValue(null),
                            findAll: jest.fn<any>().mockResolvedValue([{ dataValues: { region_id: 1, phone_number: "", role_id: 1, password: "" } }]),
                            update: jest.fn<any>().mockResolvedValue({ id: 1 })
                        },

                    },
                },
            },
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: { user_id: 1, first_name: "test", last_name: "check", phone: "3123213123", email: "test@yopmail.com", roleId: 1, regionId: 1, password: "U2FsdGVkX18JDOWpPugbQZM8Qb4sh2f0i+rnpIEmYgg=" },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
