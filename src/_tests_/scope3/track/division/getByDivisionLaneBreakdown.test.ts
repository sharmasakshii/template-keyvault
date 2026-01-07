import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import DivisionController from "../../../../controller/scope3/track/division/divisionController";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";

const mockConnection = {
  company: comapnyDbAlias?.PEP,
  [comapnyDbAlias?.PEP]: {
    models: {
        EmissionLanes: {
            findAll:jest.fn<any>().mockResolvedValue([
                {
                    dataValues: {
                      intensity: 9.99999999999982,
                      emissions: 0.1686803973333327,
                      shipment_count: 15,
                      name: 'CAMBRIDGE, ON, N3H4V8_MONCTON, NB, E1E3Y8',
                      average_intensity: 98.97204537173059,
                      average_emission: 3.9039187765299888
                    }
                },
                {
                    dataValues: {
                      intensity: 10,
                      emissions: 0.6277480559999999,
                      shipment_count: 4,
                      name: 'CALGARY, AB, T2B3L8_MILTON, ON, L9E1X4',
                      average_intensity: 98.97204537173059,
                      average_emission: 3.9039187765299888
                    }
                }
              ])
        },
        ConfigConstants:{
            findAll:jest.fn<any>().mockResolvedValue([
                {dataValues: { config_key: 'contributor_color', config_value: '#019d52' }},
                {dataValues: { config_key: 'detractor_color', config_value: '#d8856b' }}
            ])
        }
    },
  },
};

const payload = {
  res: {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  },
  describeName: "Get By Division Lane Breakdown Data",
  controller: DivisionController,
  moduleName: "getByDivisionLaneBreakdown",
  testCases: [
    {
      status: true,
      mockConnection: mockConnection,
      testName: "should return 200 status with emission data when query is successful",
      body: {
        division_id: 1,
        year: 2023,
        quarter: 1,
        time_id: 4,
        toggel_data: 0,
      },
      responseStatus: 200,
      responseMessage: "By division lane breakdown Emissions",
    },
    {
        status: true,
        mockConnection: mockConnection,
        testName: "should return 200 status with emission data when query is successful",
        body: {
          division_id: 1,
          year: 2023,
          quarter: 1,
          time_id: 4,
          toggel_data: 1,
          page_size:10
        },
        responseStatus: 200,
        responseMessage: "By division lane breakdown Emissions",
      },
    {
      status: false,
      mockConnection: {
        company: comapnyDbAlias?.PEP,
        [comapnyDbAlias?.PEP]: {},
      },
      testName: "should return 500 status when there is an internal server error",
      body: {
        division_id: 1,
        year: 2023,
        quarter: 1,
        time_id: 4,
        toggel_data: 0,
      },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
  ],
};

commonTestFile(payload);
