import { jest } from "@jest/globals";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import LanePlanningController from "../../../../controller/scope3/act/lanePlanning/lanePlanningController";

const mockConnection: any = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        QueryTypes: { Select: jest.fn() },
        models: {
            Lane: {
                findOne: jest.fn<any>().mockResolvedValue({
                    dataValues: { id: 1, name: "Test Lane" },
                }),
            },
            CostByLane: {
                findOne: jest.fn<any>().mockResolvedValue({}),
            },
            HighwayLaneMetrix: {
                findAll: jest.fn<any>().mockResolvedValue([]),
            },
            ProductType: {
                findOne: jest.fn<any>().mockResolvedValue({}),
                findAll: jest.fn<any>().mockResolvedValue([]),
            },
            DatByLane: {
                findOne: jest.fn<any>().mockResolvedValue({}),
            },
            EmissionLanes: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        division_id: 9
                    }
                ]),
                findOne: jest.fn<any>().mockResolvedValue({})
            },
            ConfigConstants: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        config_key: "bio_21_100_radius",
                        config_value: 45
                    }
                ]),
                findOne: jest.fn<any>().mockResolvedValue({ dataValues: { config_key: 'min_carrier_emission_reduction', config_value: 34 } }),
            },
            CarrierEmissions: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        carrier: "fjds",
                        dataValues: {
                            "carrier": "fjds",
                            "emissions": 545,
                            "shipment_count": 3,
                            "total_ton_miles": 434,
                            "intensity": 8989
                        }
                    }
                ]),
            },
            smartdataRanking: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        carrier: "fjds",
                        dataValues: {
                            "code": "fjds",
                            "ranking": 545,
                            "year": 7887
                        }
                    }
                ]),
            }
        },
        query: jest.fn<any>().mockResolvedValue([{ lane_id: '273694', k_count: 1, distance: 979.51, fuel_count: 49 }]),
    },
    'main': {
        models: {
            Lane: {
                findOne: jest.fn<any>().mockResolvedValue({
                    dataValues: { id: 1, name: "Test Lane" },
                })
            },
            LaneFuelstopThreshold: {
                findOne: jest.fn<any>().mockResolvedValue({
                    dataValues: { id: 1, k_count: 1, is_available: true },
                })
            },
            RecommendedKLaneCoordinate: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { lane_id: 1, latitude: 41, longitude: 4646 },
                ])
            },
            HighwayLaneMetrix: {
                findOne: jest.fn<any>().mockResolvedValue(
                    { distance: 12, time: 31, cost: 34 }
                )
            },
            CostByLane: {
                findOne: jest.fn<any>().mockResolvedValue(
                    { lane_id: 12, dollar_per_mile: 31 }
                )
            },
            ProductType: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: {
                            "id": 198
                        }
                    }
                ]),
                findOne: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: {
                            "id": 198,
                            "name": "XXX"
                        }
                    }
                ])
            },
            DatByLane: {
                findOne: jest.fn<any>().mockResolvedValue(
                    { lane_name: "xxx", dollar_per_mile: 31 }
                )
            },
            IntermodalLanes: {
                findOne: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: {
                            "id": 1,
                            "name": "bla bla",
                            "route_number": 3,
                            "rail_provider": "PD",
                            "provider_image": "xxxxx",
                            "carrier_image": "hksfh",
                            "carrier_code": "dddd"
                        }
                    }
                ])
            },
            RecommendedIntermodalCoordinates: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: {
                            "intermodal_lane_id": 1,
                            "latitude": "bla bla",
                            "longitude": 3,
                        }
                    }
                ])
            },
            IntermodalMetrix: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: {
                            "distance": 144,
                            "road_distance": "bla bla",
                            "road_time": 3,
                            "time": 3
                        }
                    }
                ])
            },
            CostByIntermodal: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: {
                            "rail_time_const": 144,
                            "cost_per_mile": "454",
                        }
                    }
                ])
            }
        },
        QueryTypes: { Select: jest.fn() },
        query: jest.fn<any>().mockResolvedValue([{ lane_id: '273694', k_count: 1, distance: 979.51, fuel_count: 49 },
        { lane_id: '273694', k_count: 2, distance: 989.51, fuel_count: 50 }
        ]),

    },
    userData: {
        region_id: 1,
        permissionsData: [
            {
                "id": 5,
                "title": "Application Access",
                "parent_id": 0,
                "slug": "APA",
                "isChecked": true,
                "child": [
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
                    }
                ]
            }
        ],
    },
};

const mockConnectionOther: any = {
    company: 'any',
    'any': {
        QueryTypes: { Select: jest.fn() },
        models: {
            Lane: {
                findOne: jest.fn<any>().mockResolvedValue({
                    dataValues: { id: 1, name: "Test Lane" },
                }),
            },
            CostByLane: {
                findOne: jest.fn<any>().mockResolvedValue({}),
            },
            HighwayLaneMetrix: {
                findAll: jest.fn<any>().mockResolvedValue([]),
            },
            ProductType: {
                findOne: jest.fn<any>().mockResolvedValue({}),
                findAll: jest.fn<any>().mockResolvedValue([]),
            },
            DatByLane: {
                findOne: jest.fn<any>().mockResolvedValue({}),
            },
            EmissionLanes: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        division_id: 9
                    }
                ]),
                findOne: jest.fn<any>().mockResolvedValue({})
            },
            ConfigConstants: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        config_key: "bio_21_100_radius",
                        config_value: 45
                    }
                ]),
                findOne: jest.fn<any>().mockResolvedValue({ dataValues: { config_key: 'min_carrier_emission_reduction', config_value: 34 } }),
            },
            CarrierEmissions: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        carrier: "fjds",
                        dataValues: {
                            "carrier": "fjds",
                            "emissions": 545,
                            "shipment_count": 3,
                            "total_ton_miles": 434,
                            "intensity": 8989
                        }
                    }
                ]),
            },
            smartdataRanking: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        carrier: "fjds",
                        dataValues: {
                            "code": "fjds",
                            "ranking": 545,
                            "year": 7887
                        }
                    }
                ]),
            }
        },
        query: jest.fn<any>().mockResolvedValue([{ lane_id: '273694', k_count: 1, distance: 979.51, fuel_count: 49 }]),
    },
    'main': {
        models: {
            Lane: {
                findOne: jest.fn<any>().mockResolvedValue({
                    dataValues: { id: 1, name: "Test Lane" },
                })
            },
            LaneFuelstopThreshold: {
                findOne: jest.fn<any>().mockResolvedValue({
                    dataValues: { id: 1, k_count: 1, is_available: true },
                })
            },
            RecommendedKLaneCoordinate: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { lane_id: 1, latitude: 41, longitude: 4646 },
                ])
            },
            HighwayLaneMetrix: {
                findOne: jest.fn<any>().mockResolvedValue(
                    { distance: 12, time: 31, cost: 34 }
                )
            },
            CostByLane: {
                findOne: jest.fn<any>().mockResolvedValue(
                    { lane_id: 12, dollar_per_mile: 31 }
                )
            },
            ProductType: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: {
                            "id": 198
                        }
                    }
                ]),
                findOne: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: {
                            "id": 198,
                            "name": "XXX"
                        }
                    }
                ])
            },
            DatByLane: {
                findOne: jest.fn<any>().mockResolvedValue(
                    { lane_name: "xxx", dollar_per_mile: 31 }
                )
            },
            IntermodalLanes: {
                findOne: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: {
                            "id": 1,
                            "name": "bla bla",
                            "route_number": 3,
                            "rail_provider": "PD",
                            "provider_image": "xxxxx",
                            "carrier_image": "hksfh",
                            "carrier_code": "dddd"
                        }
                    }
                ])
            },
            RecommendedIntermodalCoordinates: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: {
                            "intermodal_lane_id": 1,
                            "latitude": "bla bla",
                            "longitude": 3,
                        }
                    }
                ])
            },
            IntermodalMetrix: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: {
                            "distance": 144,
                            "road_distance": "bla bla",
                            "road_time": 3,
                            "time": 3
                        }
                    }
                ])
            },
            CostByIntermodal: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: {
                            "rail_time_const": 144,
                            "cost_per_mile": "454",
                        }
                    }
                ])
            }
        },
        QueryTypes: { Select: jest.fn() },
        query: jest.fn<any>().mockResolvedValue([{ lane_id: '273694', k_count: 1, distance: 979.51, fuel_count: 49 },
        { lane_id: '273694', k_count: 2, distance: 989.51, fuel_count: 50 }
        ]),

    },
    userData: {
        region_id: 1,
        permissionsData: [
            {
                "id": 5,
                "title": "Application Access",
                "parent_id": 0,
                "slug": "APA",
                "isChecked": true,
                "child": [
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
    describeName: "alternateKShortestPath",
    controller: LanePlanningController,
    moduleName: "alternateKShortestPath",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when successful",
            body: {
                name: 1,
            },
            responseStatus: 200,
            responseMessage: "Lane top 5 shortest path.",
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        Emission: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                        EmissionLanes: { findOne: jest.fn<any>().mockResolvedValue(null) }
                    },
                },
            },
            testName: "when no lane found",
            body: {
                name: "Test Lane",
            },
            responseStatus: 200,
            responseMessage: "No data found for this lane",
        },
        {
            status: true,
            mockConnection: mockConnectionOther,
            testName: "should return 200 when successful with other companies",
            body: {
                name: 1,
            },
            responseStatus: 200,
            responseMessage: "Lane top 5 shortest path.",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        Lane: {
                            findOne: jest.fn<any>().mockResolvedValue(null),
                        },
                        EmissionLanes: { findOne: jest.fn<any>().mockResolvedValue({}) }
                    },
                },
                'main': {
                    models: {
                        Lane: {
                            findOne: jest.fn<any>().mockResolvedValue(null),
                        },
                    },
                },
                userData: {
                    region_id: 1,
                    permissionsData: [
                        {
                            "id": 5,
                            "title": "Application Access",
                            "parent_id": 0,
                            "slug": "APA",
                            "isChecked": true,
                            "child": [
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
                                }
                            ]
                        }
                    ],
                },
            },
            testName: "should return 200 with NOT_FOUND when no lane data found",
            body: {
                name: 'sfdsa',
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: {},
            testName: "should return 500 when an error occurs",
            body: {
                lane_id: null,
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

describe(payload.describeName, () => {
    commonTestFile(payload);
});
