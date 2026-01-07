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
  otp: "123456",
  updatedAt: moment.utc().subtract(30, "seconds").toISOString()
};

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
    where: jest.fn((...args) => args),
  } as any)
  .mockResolvedValueOnce({ // Company DB mock
    models: {}
  } as any)
  .mockResolvedValueOnce({
    models: {
      User: {
        findOne: jest.fn<any>().mockResolvedValue(userMock)
      },
      UserOtp: {
        findOne: jest.fn<any>().mockResolvedValue({
          otp: "654321",
          updatedAt: moment.utc().subtract(30, "seconds").toISOString()
        })
      }
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
          updatedAt: moment.utc().subtract(2, "minutes").toISOString()
        })
      }
    },
    where: jest.fn((...args) => args),
  } as any)
  .mockResolvedValueOnce({ // Company DB mock
    models: {}
  } as any);

const payload = {
  res: {
    cookie: jest.fn(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  },
  describeName: "Verify OTP API",
  controller: AuthController,
  moduleName: "verifyOTP",
  testCases: [
    {
      status: true,
      testName: "should return 200 when OTP is verified successfully",
      body: {
        email: "test@example.com",
        otp: "123456",
      },
      requestHeaders:"a",
      responseStatus: 200,
      responseMessage: "User Logged In Successfully.",
    },
    {
      status: false,
      testName: "should return 400 when email or OTP is missing",
      body: {
        email: "",
        otp: "",
      },
      responseStatus: 400,
      responseMessage: "Email and OTP both are required",
    },
    {
      status: false,
      testName: "should return 400 for invalid OTP",
      body: {
        email: "test@example.com",
        otp: "wrong-otp",
      },
      responseStatus: 400,
      responseMessage: "Verification code is not valid!",
    },
    {
      status: false,
      testName: "should return 200 if OTP is expired",
      body: {
        email: "test@example.com",
        otp: "123456",
      },
      responseStatus: 400,
      responseMessage: "OTP has expired. Please request a new OTP.",
    },
    {
      status: false,
      testName: "should return 500 when an internal error occurs",
      body: {
        email: "test@example.com",
        otp: "123456",
      },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
  ],
};

commonTestFile(payload);
