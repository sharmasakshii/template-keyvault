import { jest } from "@jest/globals";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import DecarbController from "../../../../controller/scope3/act/decarb/decarbController";

const mockConnection: any = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        QueryTypes: { Select: jest.fn() },
        query: jest.fn<any>().mockResolvedValue([
            {
                id: 598,
                name: 'CARLISLE, PA, 17013_CALGARY, AB, T2C2Y9',
                intensity: 73.524341,
                emission: 108.1604057951,
                type: 'MEDIUM PRIORITY',
                priority: 2,
                color: '#929597',
                carrier_shift: true,
                modal_shift: false,
                is_ev: 0,
                is_rd: 0,
                is_bio_1_20: 0,
                is_bio_21_100: 0,
                is_optimus: 0,
                is_rng: 0,
                is_hydrogen: 0,
                is_hvo: 0
              },
              {
                id: 603,
                name: 'CARLISLE, PA, 17013_MUNSTER, IN, 46321',
                intensity: 80.489956,
                emission: 99.3191615186,
                type: 'MEDIUM PRIORITY',
                priority: 2,
                color: '#929597',
                carrier_shift: true,
                modal_shift: false,
                is_ev: 0,
                is_rd: 0,
                is_bio_1_20: 1,
                is_bio_21_100: 0,
                is_optimus: 0,
                is_rng: 1,
                is_hydrogen: 0,
                is_hvo: 0
              }
        ]
        ),
        models: {
            DecarbSummery: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: {
                          intensity: 122,
                          emission: 401198925197.85394,
                          lane_count: 6951,
                          carrier_count: 222,
                          division_id: 2,
                          factor: 0,
                          operator: 'PLUS',
                          division: {id:11,name: 'BusinessUnitDivision'},
                        }
                    },
                    {
                        dataValues: {
                          intensity: 107.5,
                          emission: 133071096349.32959,
                          lane_count: 2521,
                          carrier_count: 133,
                          division: {id:10,name: 'BusinessUnitDivision'},
                          factor: 0,
                          operator: 'PLUS',
                        }
                    }
                ]),
            },
            ConfigConstants:{
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: {
                          config_key: "contributor_color",
                          config_value: "#215254",
                        },
                      },
                      {
                        dataValues: {
                          config_key: "detractor_color",
                          config_value: "#d8856b",
                        },
                      },
                      {
                        dataValues: {
                          config_key: "medium_color",
                          config_value: "#929597",
                        },
                      }
                ]),
            }
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "getRecommendedLevers",
    controller: DecarbController,
    moduleName: "getRecommendedLevers",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when successful",
            body: {
                region_id: 1,
            },
            responseStatus: 200,
            responseMessage: "Decarb recommendation for regions.",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        DecarbSummery: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    },
                },
            },
            testName: "should return 200 with empty array when no data found",
            body: {
                region_id: 2,
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                    },
                },
            },
            testName: "should return 500 when an error occurs",
            body: {
                region_id: null,
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

describe(payload.describeName, () => {
    commonTestFile(payload);
});
