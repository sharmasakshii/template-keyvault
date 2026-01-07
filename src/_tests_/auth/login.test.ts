import { jest } from "@jest/globals";
import setupSequelize from "../../connectionDb/sequilizeSetup";
import HttpStatusMessage from "../../constant/responseConstant";
import { commonTestFile } from "../scope3/commonTest";
import AuthController from "../../controller/auth/authController";

import bcrypt = require("bcrypt");
import moment = require("moment");

// Mock sequelize setup
jest.mock("../../connectionDb/sequilizeSetup", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../services/encryptResponseFunction", () => ({
  decryptDataFunction: jest.fn<any>().mockResolvedValue("ANUSFSNOSJFSJ"),
  encryptDataFunction: jest.fn<any>().mockReturnValue("slfklsjfslfk")
}));

jest.mock("bcrypt", () => ({
  compare: jest.fn<any>().mockResolvedValueOnce(true).mockResolvedValueOnce(true).mockResolvedValueOnce(false),
  hash: jest.fn<any>().mockResolvedValue("fsbkfh,sajk sfskfl")
}));

jest.mock("../../services/commonServices", () => ({
  getRolePermissions: jest.fn<any>().mockResolvedValue(["read", "write"]),
  decryptByPassPhraseColumn: jest.fn<any>().mockResolvedValue("decryptedValue"),
  generateUniqueAlphanumeric: jest.fn<any>().mockResolvedValue("uniqueToken"),
  otpAttempts: jest.fn<any>().mockResolvedValue({ isRequest: true })
}));

jest.mock("../../services/azureSms", () => ({
  azureSmsFunction: jest.fn<any>().mockResolvedValue(true),
}));

const mockedSetupSequelize = setupSequelize as jest.MockedFunction<
  typeof setupSequelize
>;

const userMock = {
  id: 1,
  email: "test@example.com",
  name: "Test User",
  password: bcrypt.hash("password123", 10),
  role: "admin",
  status: 1,
  login_count: 2,
  region_id: 1,
  is_blocked: false,
  blocked_time: null,
  blocked_on: null,
  is_deleted: false,
  updated_by: null,
  last_logged_in: new Date(),
  chatbot_access: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  profile: {
    first_name: "Test",
    last_name: "User",
    country_code: "+91",
    image: "mock.png",
    phone_number: "1234567890",
  },
  companies: [
    {
      name: "Mock Company",
      db_alias: "company_db",
      logo: "mock-logo.png",
      slug: "mock-company",
      is_onboarded: true,
    },
  ],
  update: jest.fn<any>().mockResolvedValue(true),
  dataValues: {
    id: 1,
    email: "test@example.com",
    name: "Test User",
    role: "admin",
    login_count: 2,
    region_id: 1,
    status: 1,
    is_blocked: false,
    blocked_time: null,
    blocked_on: null,
    is_deleted: false,
    updated_by: null,
    last_logged_in: new Date(),
    chatbot_access: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    profile: {
      first_name: "Test",
      last_name: "User",
      country_code: "+91",
      image: "mock.png",
      phone_number: "1234567890",
    },
    companies: [
      {
        name: "Mock Company",
        db_alias: "company_db",
        logo: "mock-logo.png",
        slug: "mock-company",
        is_onboarded: true,
      },
    ],
  },
};

mockedSetupSequelize
  .mockResolvedValueOnce({
    models: {
      User: {
        findOne: jest.fn<any>().mockResolvedValue(userMock),
        update: jest.fn<any>().mockResolvedValue([1]),
      },
      FailedLoginAttempt: {
        count: jest.fn<any>().mockResolvedValue(0),
        create: jest.fn<any>().mockResolvedValue(true),
        destroy: jest.fn<any>().mockResolvedValue(true),
      },
      UserToken: {
        create: jest.fn<any>().mockResolvedValue(true),
      },
      UserActivity: {
        create: jest.fn<any>().mockResolvedValue(true),
      },
      UserOtp: {
        findOne: jest.fn<any>().mockResolvedValue({
          otp: "654321",
          updatedAt: moment.utc().subtract(30, "seconds").toISOString(),
          update: jest.fn<any>().mockResolvedValue(true),
        })
      }
    },
    where: jest.fn((...args) => args),
  } as any)
  .mockResolvedValueOnce({
    models: {},
  } as any)
  .mockResolvedValueOnce({
    models: {
      User: {
        findOne: jest.fn<any>().mockResolvedValue({
          id: 1,
          email: "test@example.com",
          name: "Test User",
          password: bcrypt.hash("password123", 10),
          role: "admin",
          status: 1,
          login_count: 2,
          region_id: 1,
          is_blocked: false,
          blocked_time: null,
          blocked_on: null,
          is_deleted: false,
          updated_by: null,
          last_logged_in: new Date(),
          chatbot_access: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          profile: {
            first_name: "Test",
            last_name: "User",
            country_code: "+91",
            image: "mock.png",
          },
          companies: [
            {
              name: "Mock Company",
              db_alias: "company_db",
              logo: "mock-logo.png",
              slug: "mock-company",
              is_onboarded: true,
            },
          ],
          update: jest.fn<any>().mockResolvedValue(true),
          dataValues: {
            id: 1,
            email: "test@example.com",
            name: "Test User",
            role: "admin",
            login_count: 2,
            region_id: 1,
            status: 1,
            is_blocked: false,
            blocked_time: null,
            blocked_on: null,
            is_deleted: false,
            updated_by: null,
            last_logged_in: new Date(),
            chatbot_access: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            profile: {
              first_name: "Test",
              last_name: "User",
              country_code: "+91",
              image: "mock.png",
              phone_number: "1234567890",
            },
            companies: [
              {
                name: "Mock Company",
                db_alias: "company_db",
                logo: "mock-logo.png",
                slug: "mock-company",
                is_onboarded: true,
              },
            ],
          },
        }),
        update: jest.fn<any>().mockResolvedValue([1]),
      },
      FailedLoginAttempt: {
        count: jest.fn<any>().mockResolvedValue(0),
        create: jest.fn<any>().mockResolvedValue(true),
        destroy: jest.fn<any>().mockResolvedValue(true),
      },
      UserToken: {
        create: jest.fn<any>().mockResolvedValue(true),
      },
      UserActivity: {
        create: jest.fn<any>().mockResolvedValue(true),
      },
      UserOtp: {
        findOne: jest.fn<any>().mockResolvedValue({
          otp: "654321",
          updatedAt: moment.utc().subtract(30, "seconds").toISOString(),
          update: jest.fn<any>().mockResolvedValue(true),
        })
      }
    },
    where: jest.fn((...args) => args),
  } as any)
  .mockResolvedValueOnce({
    models: {},
  } as any)
  .mockResolvedValueOnce({
    models: {
      User: {
        findOne: jest.fn<any>().mockResolvedValue(null),
        update: jest.fn<any>().mockResolvedValue([1]),
      }
    },
    where: jest.fn((...args) => args),
  } as any)
  //for deactivated account
  .mockResolvedValueOnce({
    models: {
      User: {
        findOne: jest.fn<any>().mockResolvedValue({
          id: 1,
          email: "test@example.com",
          name: "Test User",
          password: bcrypt.hash("password123", 10),
          role: "admin",
          status: 2
        }),
        update: jest.fn<any>().mockResolvedValue([1]),
      }
    },
    where: jest.fn((...args) => args),
  } as any)
  //   for deleted account
  .mockResolvedValueOnce({
    models: {
      User: {
        findOne: jest.fn<any>().mockResolvedValue({
          id: 1,
          email: "test@example.com",
          name: "Test User",
          password: bcrypt.hash("password123", 10),
          role: "admin",
          status: 1,
          is_deleted: true
        }),
        update: jest.fn<any>().mockResolvedValue([1]),
      }
    },
    where: jest.fn((...args) => args),
  } as any)
  //   for deleted account
  .mockResolvedValueOnce({
    models: {
      User: {
        findOne: jest.fn<any>().mockResolvedValue(userMock),
        update: jest.fn<any>().mockResolvedValue([1]),
      },
      FailedLoginAttempt: {
        count: jest.fn<any>().mockResolvedValue(0),
        create: jest.fn<any>().mockResolvedValue(true),
        destroy: jest.fn<any>().mockResolvedValue(true),
      },
      UserToken: {
        create: jest.fn<any>().mockResolvedValue(true),
      },
      UserActivity: {
        create: jest.fn<any>().mockResolvedValue(true),
      },
      UserOtp: {
        findOne: jest.fn<any>().mockResolvedValue({
          otp: "654321",
          updatedAt: moment.utc().subtract(30, "seconds").toISOString(),
          update: jest.fn<any>().mockResolvedValue(true),
        })
      }
    },
    where: jest.fn((...args) => args),
  } as any)
  .mockResolvedValueOnce({
    models: {},
  } as any)
  //   for block
  .mockResolvedValueOnce({
    models: {
      User: {
        findOne: jest.fn<any>().mockResolvedValue({
          id: 1,
          email: "test@example.com",
          name: "Test User",
          password: bcrypt.hash("password123", 10),
          role: "admin",
          status: 1,
          login_count: 2,
          region_id: 1,
          is_blocked: true,
          blocked_on: '2050-04-10T12:00:00Z',
          blocked_time: 30,
          is_deleted: false,
          updated_by: null,
          last_logged_in: new Date(),
          chatbot_access: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          profile: {
            first_name: "Test",
            last_name: "User",
            country_code: "+91",
            image: "mock.png",
            phone_number: "1234567890",
          },
          companies: [
            {
              name: "Mock Company",
              db_alias: "company_db",
              logo: "mock-logo.png",
              slug: "mock-company",
              is_onboarded: true,
            },
          ],
          update: jest.fn<any>().mockResolvedValue(true),
          dataValues: {
            id: 1,
            email: "test@example.com",
            name: "Test User",
            role: "admin",
            login_count: 2,
            region_id: 1,
            status: 1,
            is_blocked: false,
            blocked_time: null,
            blocked_on: null,
            is_deleted: false,
            updated_by: null,
            last_logged_in: new Date(),
            chatbot_access: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            profile: {
              first_name: "Test",
              last_name: "User",
              country_code: "+91",
              image: "mock.png",
              phone_number: "1234567890",
            },
            companies: [
              {
                name: "Mock Company",
                db_alias: "company_db",
                logo: "mock-logo.png",
                slug: "mock-company",
                is_onboarded: true,
              },
            ],
          },
        }),
        update: jest.fn<any>().mockResolvedValue([1]),
      },
      FailedLoginAttempt: {
        count: jest.fn<any>().mockResolvedValue(0),
        create: jest.fn<any>().mockResolvedValue(true),
        destroy: jest.fn<any>().mockResolvedValue(true),
      },
    },
    where: jest.fn((...args) => args),
  } as any)

const payload = {
  res: {
    cookie: jest.fn(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  },
  describeName: "Login API",
  controller: AuthController,
  moduleName: "login",
  testCases: [
    {
      requestHeaders:"a",
      status: true,
      testName: "should return 200 when login is send code to registered phone number.",
      body: {
        email: "test@example.com",
        password: "password123",
      },
      responseStatus: 200,
      responseMessage: "Verification code send to registered phone number.",
    },
    {
      requestHeaders:"a",
      status: true,
      testName: "should return 200 when login is successful",
      body: {
        email: "test@example.com",
        password: "password123",
      },
      responseStatus: 200,
      responseMessage: "User Logged In Successfully.",
    },
    {
      status: false,
      testName: "should return 400 when email or password is missing",
      body: {
        email: "",
        password: "",
      },
      responseStatus: 400,
      responseMessage: "Email and Password both are required",
    },
    {
      status: false,
      testName: "should return 404 when user is not found",
      body: {
        email: "nonexistent@example.com",
        password: "password123",
      },
      responseStatus: 404,
      responseMessage: "User not found",
    },
    {
      status: false,
      testName: "should return 400 when account is deactivated",
      body: {
        email: "deactivated@example.com",
        password: "password123",
      },
      responseStatus: 400,
      responseMessage:
        "Your account has been deactivated, please contact administrator for assistance",
    },
    {
      status: false,
      testName: "should return 400 when account is deleted",
      body: {
        email: "deleted@example.com",
        password: "password123",
      },
      responseStatus: 400,
      responseMessage:
        "Your account has been deleted, please contact administrator for assistance",
    },
    {
      requestHeaders:"a",
      status: false,
      testName: "should return 400 when password is incorrect",
      body: {
        email: "test@example.com",
        password: "wrongpassword",
      },
      responseStatus: 400,
      responseMessage:
        "Invalid credentials. Please check your username and password and try again.",
    },
    {
      status: false,
      testName: "should return 400 when account is blocked",
      body: {
        email: "blocked@example.com",
        password: "password123",
      },
      responseStatus: 400,
      responseMessage: expect.stringContaining(
        "Your account is blocked for next"
      ),
    },
    {
      status: false,
      testName: "should return 500 when an internal error occurs",
      body: {
        email: "error@example.com",
        password: "password123",
      },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    }
  ],
};

commonTestFile(payload);
