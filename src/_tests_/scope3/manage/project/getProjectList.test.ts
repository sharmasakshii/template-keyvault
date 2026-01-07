import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import ProjectController from "../../../../controller/scope3/manage/projectContoller";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";

const mockConnection: any = {
  company: comapnyDbAlias?.PEP,
  [comapnyDbAlias?.PEP]: {
    QueryTypes: { Select: jest.fn() },
    models: {
      ProductType: {
        findOne: jest.fn(),
        findAll: jest.fn(),
      },
      HighwayLaneMetrix: {
        findOne: jest.fn(),
        findAll: jest.fn(),
      },
      IntermodalLanes: {
        findOne: jest.fn(),
      },
      IntermodalMetrix: {
        findAll: jest.fn(),
      },
      CostByIntermodal: {
        findAll: jest.fn(),
      },
      ConfigConstants: {
        findOne: jest.fn(),
      },
      EmissionLanes: {
        findAll: jest.fn(),
      },
    },
  },
  main: {
    models: {
      ProductType: {
        findOne: jest.fn(),
        findAll: jest.fn(),
      },
    },
  },
  schema: "testSchema",
  userData: {
    region_id: 1,
    permissionsData: [
      {
        "id": 1,
        "title": "Administrator Access",
        "parent_id": 0,
        "slug": "ADA",
        "isChecked": true,
        "child": [
          {
            "id": 2,
            "title": "User Management",
            "parent_id": 1,
            "slug": "USM",
            "isChecked": true,
            "child": []
          },
          {
            "id": 3,
            "title": "Data Management",
            "parent_id": 1,
            "slug": "DAM",
            "isChecked": true,
            "child": []
          }
        ]
      },
      {
        "id": 5,
        "title": "Application Access",
        "parent_id": 0,
        "slug": "APA",
        "isChecked": true,
        "child": [
          {
            "id": 6,
            "title": "Visibility",
            "parent_id": 5,
            "slug": "VIS",
            "isChecked": true,
            "child": [
              {
                "id": 9,
                "title": "Segmentation",
                "parent_id": 6,
                "slug": "SEG",
                "isChecked": true,
                "child": []
              },
              {
                "id": 10,
                "title": "Benchmarks",
                "parent_id": 6,
                "slug": "BEN",
                "isChecked": true,
                "child": []
              },
              {
                "id": 16,
                "title": "EV Dashboard",
                "parent_id": 6,
                "slug": "EVD",
                "isChecked": true,
                "child": []
              }
            ]
          },
          {
            "id": 7,
            "title": "Recommendations",
            "parent_id": 5,
            "slug": "REC",
            "isChecked": true,
            "child": [
              {
                "id": 13,
                "title": "Carrier Shift",
                "parent_id": 7,
                "slug": "CAS",
                "isChecked": true,
                "child": []
              },
              {
                "id": 15,
                "title": "Alternative Fuel & Modal Shift",
                "parent_id": 7,
                "slug": "AMS",
                "isChecked": true,
                "child": []
              },
              {
                "id": 17,
                "title": "Bid Planning",
                "parent_id": 7,
                "slug": "BIP",
                "isChecked": true,
                "child": []
              }
            ]
          },
          {
            "id": 8,
            "title": "Manage",
            "parent_id": 5,
            "slug": "MAN",
            "isChecked": true,
            "child": [
              {
                "id": 14,
                "title": "Project Management",
                "parent_id": 8,
                "slug": "PRM",
                "isChecked": true,
                "child": []
              }
            ]
          }
        ]
      }
    ],
  },
};

const payload = {
  res: {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  },
  describeName: "Get Project List functionality",
  controller: ProjectController,
  moduleName: "getProjectList",
  testCases: [
    {
      status: true,
      mockConnection: {
        ...mockConnection,
        [comapnyDbAlias?.PEP]: {
          ...mockConnection[comapnyDbAlias?.PEP],
          models: {
            ...mockConnection[comapnyDbAlias?.PEP].models,
            ProductType: {
              findAll: jest.fn<any>().mockResolvedValue([]), // Simulate no fuel stops found
            },
            ConfigConstants:{
              findOne: jest.fn<any>().mockResolvedValue(
                  {
                      dataValues: {
                          "config_key": 'rail_intensity',
                          "config_value":545
                      }
                  }
              ),
          },
          EmissionLanes:{
            findAll: jest.fn<any>().mockResolvedValue([
                {
                    dataValues: {
                        "intensity": 198,
                        "emissions":545,
                        "shipment_count":3,
                        "total_ton_miles":434
                    }
                }
            ]),
        },
          },
          QueryTypes: { Select: jest.fn() },
          query: jest.fn<any>().mockResolvedValue([
            {
              "id": 47,
              "project_unique_id": "JvOV4Hdq0J",
              "project_name": "RNG Test",
              "start_date": "2024-11-28T00:00:00.000Z",
              "manager_id": 24,
              "end_date": "2024-12-01T00:00:00.000Z",
              "desc": "Test",
              "type": "alternative_fuel",
              "lane_id": 225704,
              "recommendation_id": 1,
              "is_alternative": true,
              "is_ev": false,
              "is_rd": false,
              "fuel_type": "RNG",
              "quarter": 4,
              "year": 2024,
              "productTypeId": 301,
              "productTypeCode": "RNG",
              "productTypeImpactFraction": 0.1,
              "productTypeCostPremiumConst": 1.2,
              "costByLaneId": 104973,
              "costByLaneDollarPerMile": 4.77,
              "lane_name": "WYTHEVILLE, VA_INDIANAPOLIS, IN",
              "carrier": null,
              "emission_reduction": null,
              "cost": null,
              "dollar_per_reduction": null,
              "region_id": 2,
              "distance": 636.84,
              "avgDistance": 636.84
            },
            {
              "id": 36,
              "project_unique_id": "78KBoRscog",
              "project_name": "Carrier shift test",
              "start_date": "2024-11-04T00:00:00.000Z",
              "manager_id": 24,
              "end_date": "2024-11-08T00:00:00.000Z",
              "desc": "Test",
              "type": "carrier_shift",
              "lane_id": 150321,
              "recommendation_id": 1,
              "is_alternative": true,
              "is_ev": false,
              "is_rd": false,
              "fuel_type": null,
              "quarter": 4,
              "year": 2024,
              "productTypeId": null,
              "productTypeCode": null,
              "productTypeImpactFraction": null,
              "productTypeCostPremiumConst": null,
              "costByLaneId": 84777,
              "costByLaneDollarPerMile": 3.91,
              "lane_name": "DENVER, CO_ALBUQUERQUE, NM",
              "carrier": "CRCR",
              "emission_reduction": 21.97966827180311,
              "cost": 0.48780487804879175,
              "dollar_per_reduction": 2.06,
              "region_id": 7
            }
          ]
          )
        },
        'main': {
          models: {
            HighwayLaneMetrix: {
              findAll: jest.fn<any>().mockResolvedValue([
                {
                  dataValues: {
                    "distance": 22, "time": 23, "cost": 232
                  }
                }
              ]),
              findOne: jest.fn<any>().mockResolvedValue({
                dataValues: {
                  "distance": 22, "time": 23, "cost": 232
                }
              }),
            },
            ProductType: {
              findOne: jest.fn<any>().mockResolvedValue({
                dataValues: {
                  "distance": 22, "time": 23, "cost": 232
                }
              }),
              findAll: jest.fn<any>().mockResolvedValue([])
            },
            IntermodalLanes:{
              findOne: jest.fn<any>().mockResolvedValue(
                  {
                      dataValues: {
                          "id":1,
                          "name":"bla bla",
                          "route_number": 3,
                          "rail_provider":"PD",
                          "provider_image": "xxxxx",
                          "carrier_image": "hksfh",
                          "carrier_code": "dddd"
                      }
                  }
              )
          },
          RecommendedIntermodalCoordinates:{
              findAll: jest.fn<any>().mockResolvedValue([
                  {
                      dataValues: {
                          "intermodal_lane_id":1,
                          "latitude":"bla bla",
                          "longitude": 3,
                      }
                  }
              ])
          },
          IntermodalMetrix:{
              findAll: jest.fn<any>().mockResolvedValue([
                  {
                      dataValues: {
                          "distance":144,
                          "road_distance":"bla bla",
                          "road_time": 3,
                          "time":3
                      }
                  }
              ])
          },
          CostByIntermodal:{
              findAll: jest.fn<any>().mockResolvedValue([
                  {
                      dataValues: {
                          "rail_time_const":144,
                          "cost_per_mile":"454",
                      }
                  }
              ])
          },
          }
        }
      },
      testName:
        "should return a 200 status code and success message with project data",
      body: {
        project_name: "Test Project",
        year: 2024,
        lever: "Test Lever",
        search: "Sample",
        region_id:33
      },
      responseStatus: 200,
      responseMessage: "Project listing fetched successfully",
    },
    {
      status: true,
      mockConnection: {
        ...mockConnection,
        [comapnyDbAlias?.PEP]: {
          ...mockConnection[comapnyDbAlias?.PEP],
          models: {
            ...mockConnection[comapnyDbAlias?.PEP].models,
            ProductType: {
              findAll: jest.fn<any>().mockResolvedValue([]), // Simulate no fuel stops found
            },
          },
          query: jest.fn<any>().mockResolvedValue([])
        },
      },
      testName:
        "should return a 200 status code and success message when no projects are found",
      body: {
        project_name: "Non-existent Project",
        year: 2023,
        lever: "Non-existent Lever",
        search: "Nothing",
      },
      callStoredProcedure: [],
      query: [],
      responseStatus: 200,
      responseMessage: HttpStatusMessage.NOT_FOUND,
    },
    {
      status: false,
      mockConnection: {
        ...mockConnection,
        [comapnyDbAlias?.PEP]: {
          ...mockConnection[comapnyDbAlias?.PEP],
          models: {
            ProductType: {
              findAll: jest.fn<any>().mockRejectedValue(
                new Error("Database error")
              ), // Simulate database failure
            },
          },
        },
      },
      testName:
        "should return 500 status code and error message when a database error occurs",
      body: {
        project_name: "Test Project",
        year: 2024,
        lever: "Test Lever",
        search: "Sample",
      },
      responseStatus: 500,
      responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    },
  ],
};

commonTestFile(payload);