import { jest } from "@jest/globals";
import moment from "moment";

import setupSequelize from "../../connectionDb/sequilizeSetup";
import HttpStatusMessage from "../../constant/responseConstant";
import { commonTestFile } from "../scope3/commonTest";
import AuthController from "../../controller/auth/authController";

// Mock sequelize setup
jest.mock("../../connectionDb/sequilizeSetup", () => ({
    __esModule: true,
    default: jest.fn()
  }));
  
  jest.mock("../../services/commonServices", () => ({
    getRolePermissions: jest.fn<any>().mockResolvedValue(["read", "write"]),
    decryptByPassPhraseColumn:jest.fn<any>().mockResolvedValue("sfs abhsfjks"),
    generateUniqueAlphanumeric:jest.fn<any>().mockResolvedValue("blablabla")
  }));

  jest.mock("../../services/azureSms", () => ({
    azureSmsFunction: jest.fn<any>().mockResolvedValueOnce(true).mockResolvedValueOnce(false),
  }));
  
  const mockedSetupSequelize = setupSequelize as jest.MockedFunction<typeof setupSequelize>;
  
  const userMock = {
    id: 1,
    email: "test@example.com",
    name: "Test User",
    role: "admin",
    login_count: 2,
    region_id: 1,
    status: 0,
    update: jest.fn<any>().mockResolvedValue(true),
    dataValues: {
      id: 1,
      email: "test@example.com",
      name: "Test User",
      role: "admin",
      login_count: 2,
      region_id: 1,
      status: 0,
      companies: [
        {
          db_alias: "company_db",
          name: "Mock Company",
          logo: "mock-logo.png",
          slug: "mock-company",
        }
      ]
    },
    profile: {
      phone_number: "1234567890",
      first_name: "Test",
      last_name: "User",
      country_code: "+91",
      image: "mock.png"
    },
    companies: [
      {
        db_alias: "company_db",
        name: "Mock Company",
        logo: "mock-logo.png",
        slug: "mock-company",
      }
    ]
  };
  
  const otpDataMock = {
    id: 1,
    user_id: 1,
    otp: "123456",
    status: 0,
    attempts: 3,
    update: jest.fn<any>().mockResolvedValue(true),
    create: jest.fn<any>().mockResolvedValue(true),
    createdAt: moment.utc().subtract(10, "minutes").toISOString(),
    updatedAt: moment.utc().subtract(5, "minutes").toISOString(),
    dataValues: {
      id: 1,
      user_id: 1,
      otp: "123456",
      status: 0,
      attempts: 3,
      createdAt: moment.utc().subtract(10, "minutes").toISOString(),
      updatedAt: moment.utc().subtract(5, "minutes").toISOString(),
      thirtyMinutesAgo: moment.utc().subtract(30, "minutes").toISOString()
    }
  };;
  
  mockedSetupSequelize
    .mockResolvedValueOnce({
      models: {
        User: {
          findOne: jest.fn<any>().mockResolvedValue(userMock)
        },
        UserOtp: {
          findOne: jest.fn<any>().mockResolvedValue(otpDataMock)
        },
        UserToken: {
          create: jest.fn<any>().mockResolvedValue(true)
        },
        UserActivity: {
          create: jest.fn<any>().mockResolvedValue(true)
        }
      },
      Sequelize:{
        literal:jest.fn<any>().mockResolvedValue("any")
      },
      where: jest.fn((...args) => args),
    } as any)
    .mockResolvedValueOnce({
        models: {
          User: {
            findOne: jest.fn<any>().mockResolvedValue({
                profile: null,
              })
          },
        },
        where: jest.fn((...args) => args),
      } as any)
    .mockResolvedValueOnce({
      models: {
        User: {
            findOne: jest.fn<any>().mockResolvedValue(userMock)
          },
        UserOtp: {
          findOne: jest.fn<any>().mockResolvedValue({
            otp: "123456",
            updatedAt: moment.utc().subtract(10, "minutes").toISOString(), // recent update
            attempts: 5,
            update: jest.fn<any>().mockResolvedValue(false),
            create: jest.fn<any>().mockResolvedValue(true),
            dataValues: {
                updatedAt: moment.utc().subtract(10, "minutes").toISOString(), // recent update
              attempts: 5,
              thirtyMinutesAgo: moment.utc().subtract(30, "minutes").toISOString()
            }
          }),
        },
      },
      Sequelize:{
        literal:jest.fn<any>().mockResolvedValue("any")
      },
      where: jest.fn((...args) => args),
    } as any)
  

const resendOtpPayload = {
    res: {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    },
    describeName: "Resend OTP API",
    controller: AuthController,
    moduleName: "resendOtp",
    testCases: [
      {
        status: true,
        testName: "should return 200 when OTP is successfully resent",
        body: {
          email: "test@example.com",
        },
        responseStatus: 200,
        responseMessage: "Verification code send to registered phone number.",
      },
      {
        status: false,
        testName: "should return 400 when email is missing",
        body: {
          email: "",
        },
        responseStatus: 400,
        responseMessage: "Email is required.",
      },
      {
        status: false,
        testName: "should return 400 if user has no registered phone number",
        body: {
          email: "test@example.com",
        },
        responseStatus: 400,
        responseMessage: "User does not have a registered phone number.",
      },
      {
        status: false,
        testName: "should return 400 if SMS service fails",
        body: {
          email: "test@example.com",
        },
        responseStatus: 400,
        responseMessage: "Error while sending verification code to registered phone number.",
      },
      {
        status: false,
        testName: "should return 500 on internal server error",
        body: {
          email: "test@example.com",
        },
        responseStatus: 500,
        responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
      },
    ],
  };
  
  commonTestFile(resendOtpPayload);
  