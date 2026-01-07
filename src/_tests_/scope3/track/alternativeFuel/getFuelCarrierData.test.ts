import { jest } from "@jest/globals";import AlternateFuelTypeController from "../../../../controller/scope3/track/alternateFuelType/alternateFuelController";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
;

const mockModelsWithData = {
  LaneAlternateFuelType: {
    findAll: jest.fn<any>().mockResolvedValue([
      {
        name: "Carrier A",
        total_shipments: 150,
      },
    ]),
  },
  AlternateFueltypeCarrier: {
    findAll: jest.fn<any>().mockResolvedValue([
      {
        scac: "ABC1",
        name: "Carrier A",
        scac_priority: 1,
      },
    ]),
  },
  CarrierCountry: {},
};

const mockModelsWithNoData = {
  LaneAlternateFuelType: {
    findAll: jest.fn<any>().mockResolvedValue([]),
  },
  AlternateFueltypeCarrier: {
    findAll: jest.fn<any>().mockResolvedValue([]),
  },
  CarrierCountry: {},
};

const mockModelsWithError = {
  LaneAlternateFuelType: {
    findAll: jest.fn<any>().mockRejectedValue(new Error("DB error")),
  },
  AlternateFueltypeCarrier: {
    findAll: jest.fn<any>().mockResolvedValue([
      {
        scac: "ABC1",
        name: "Carrier A",
        scac_priority: 1,
      },
    ]),
  },
  CarrierCountry: {},
};

const payload = {
  res: {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  },
  describeName: "Get Fuel Carrier Data",
  controller: AlternateFuelTypeController,
  moduleName: "getFuelCarrierData",
  testCases: [
    {
      testName: "should return 200 with fuel carrier data",
      status: true,
      body: {
        fuel_id: 1,
        scac: ["ABC1"],
        year: 2024,
        month: 1,
        country_code: "US",
      },
      mockConnection: {
        company: comapnyDbAlias.PEP,
        [comapnyDbAlias.PEP]: {
          models: mockModelsWithData,
        },
      },
      responseStatus: 200,
      responseMessage: "Alternative carrier by fuel.",
    },
    {
      testName: "should return 200 with empty array if SCAC mapping is empty",
      status: true,
      body: {
        fuel_id: 1,
        scac: [],
        year: 2024,
        month: 2,
        country_code: "US",
      },
      mockConnection: {
        company: comapnyDbAlias.PEP,
        [comapnyDbAlias.PEP]: {
          models: mockModelsWithNoData,
        },
      },
      responseStatus: 200,
      responseMessage: HttpStatusMessage.NOT_FOUND,
    },
    {
      testName: "should return 200 with NOT_FOUND if no result found",
      status: true,
      body: {
        fuel_id: 1,
        scac: ["ABC1"],
        year: 2024,
        month: 3,
        country_code: "US",
      },
      mockConnection: {
        company: comapnyDbAlias.PEP,
        [comapnyDbAlias.PEP]: {
          models: {
            ...mockModelsWithData,
            LaneAlternateFuelType: {
              findAll: jest.fn<any>().mockResolvedValue([]),
            },
          },
        },
      },
      responseStatus: 200,
      responseMessage: HttpStatusMessage.NOT_FOUND,
    },
    {
      testName: "should return 500 on DB error",
      status: false,
      body: {
        fuel_id: 1,
        scac: ["ABC1"],
        year: 2024,
        month: 4,
        country_code: "US",
      },
      mockConnection: {
        company: comapnyDbAlias.PEP,
        [comapnyDbAlias.PEP]: {
          models: mockModelsWithError,
        },
      },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
  ],
};

commonTestFile(payload);
