import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import ProjectController from "../../../../controller/scope3/manage/projectContoller";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";

const mockConnection: any = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        QueryTypes: { Select: jest.fn() },
        query: jest.fn<any>().mockResolvedValue([
            {
                "is_access": 1
            }
        ]
        ),
        models: {
            ProjectDetails: {
                findOne: jest.fn(),
            },
            User: {
                findAll: jest.fn(),
                findOne: jest.fn(),
            },
            Lane: {
                findOne: jest.fn(),
            },
            Emissions: {
                findAll: jest.fn(),
            },
            Recommendations: {
                findAll: jest.fn(),
            },
            FuelStops: {
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
    describeName: "Get Project Details functionality",
    controller: ProjectController,
    moduleName: "getProjectDetails",
    testCases: [
        {
            status: true,
            mockConnection: {
                ...mockConnection,
                [comapnyDbAlias?.PEP]: {
                    ...mockConnection[comapnyDbAlias?.PEP],
                    models: {
                        ...mockConnection[comapnyDbAlias?.PEP].models,
                        Project: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 1,
                                manager_id: 24,
                                lane_id: 5,
                                dataValues: {
                                    "id": 43,
                                    "project_name": "Test 25 nov ",
                                    "start_date": "2024-11-01T00:00:00.000Z",
                                    "end_date": "2024-12-01T00:00:00.000Z",
                                    "desc": "TEst",
                                    "type": "alternative_fuel",
                                    "project_unique_id": "sjjVboyEFu",
                                    "recommendation_id": 2,
                                    "lane_id": 248742,
                                    "manager_id": 24,
                                    "is_ev": false,
                                    "is_rd": false,
                                    "fuel_type": "RNG",
                                    "fuel_type_name": "RNG",
                                    "is_alternative": true,
                                    "bio_1_20_radius": 20,
                                    "bio_21_100_radius": 20,
                                    "ev_radius": 20,
                                    "rd_radius": 20,
                                    "optimus_radius": 20,
                                    "rng_radius": 20,
                                    "hydrogen_radius": 50,
                                    "hvo_radius": 3.5
                                }
                            }),
                        },
                        User: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { id: 101, name: "User A" },
                                { id: 102, name: "User B" },
                            ]),
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 24,
                                name: "Manager A",
                            }),
                        },
                        Lane: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 5,
                                name: "Lane A",
                            }),
                        },
                        Emissions: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { type: "CO2", value: 100 },
                            ]),
                        },
                        Recommendations: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { recommendation: "Switch to EV" },
                            ]),
                        },
                        FuelStops: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { type: "EV", location: "Stop A" },
                                { type: "RD", location: "Stop B" },
                            ]),
                        },
                        ProjectInvite: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "user_id": 198
                                    }
                                }
                            ]),
                        },
                        EmissionLanes: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "intensity": 198,
                                        "emissions": 545,
                                        "shipment_count": 3,
                                        "total_ton_miles": 434
                                    }
                                }
                            ]),
                        },
                    },
                },
                'main': {
                    models: {
                        User: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "id": 198
                                    }
                                }
                            ]),
                            findOne: jest.fn(),
                        },
                        Lane: {
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
                        CostByLane: {
                            findOne: jest.fn<any>().mockResolvedValue(
                                {
                                    dataValues: {
                                        "dollar_per_mile": 198,
                                        "lane_id": 34
                                    }
                                }
                            ),
                        },
                        HighwayLaneMetrix: {
                            findOne: jest.fn<any>().mockResolvedValue(
                                {
                                    dataValues: {
                                        "dollar_per_mile": 198,
                                        "lane_id": 34,
                                        "distance": 567,
                                        "time": 44,
                                        "cost": 5
                                    }
                                }
                            ),
                        },
                        RecommendedKLaneCoordinate: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "lane_id": 198,
                                        'longitude': 823472.34,
                                        'latitude': 43232.54
                                    }
                                }
                            ])
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
                    },
                    QueryTypes: { Select: jest.fn() },
                    query: jest.fn<any>().mockResolvedValue([
                        {
                            "lane_id": 228367,
                            "k_count": 1,
                            "distance": 1379.26,
                            "fuel_count": 29
                        },
                        {
                            "lane_id": 228367,
                            "k_count": 2,
                            "distance": 1379.35,
                            "fuel_count": 12
                        },
                        {
                            "lane_id": 228367,
                            "k_count": 3,
                            "distance": 1379.68,
                            "fuel_count": 12
                        },
                        {
                            "lane_id": 228367,
                            "k_count": 4,
                            "distance": 1379.69,
                            "fuel_count": 12
                        },
                        {
                            "lane_id": 228367,
                            "k_count": 5,
                            "distance": 1379.78,
                            "fuel_count": 29
                        }
                    ]
                    )
                }
            },
            testName:
                "should return a 200 status code and success message with all project details",
            body: { id: 1 },
            responseStatus: 200,
            responseMessage: "Project Details Fetched!",
        },
        {
            status: true,
            mockConnection: {
                ...mockConnection,
                company: 'any',
                ["any"]: {
                    ...mockConnection[comapnyDbAlias?.PEP],
                    models: {
                        ...mockConnection[comapnyDbAlias?.PEP].models,
                        Project: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 1,
                                manager_id: 24,
                                lane_id: 5,
                                dataValues: {
                                    "id": 43,
                                    "project_name": "Test 25 nov ",
                                    "start_date": "2024-11-01T00:00:00.000Z",
                                    "end_date": "2024-12-01T00:00:00.000Z",
                                    "desc": "TEst",
                                    "type": "alternative_fuel",
                                    "project_unique_id": "sjjVboyEFu",
                                    "recommendation_id": 2,
                                    "lane_id": 248742,
                                    "manager_id": 24,
                                    "is_ev": false,
                                    "is_rd": false,
                                    "fuel_type": "RNG",
                                    "fuel_type_name": "RNG",
                                    "is_alternative": true,
                                    "bio_1_20_radius": 20,
                                    "bio_21_100_radius": 20,
                                    "ev_radius": 20,
                                    "rd_radius": 20,
                                    "optimus_radius": 20,
                                    "rng_radius": 20,
                                    "hydrogen_radius": 50,
                                    "hvo_radius": 3.5
                                }
                            }),
                        },
                        User: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { id: 101, name: "User A" },
                                { id: 102, name: "User B" },
                            ]),
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 24,
                                name: "Manager A",
                            }),
                        },
                        Lane: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 5,
                                name: "Lane A",
                            }),
                        },
                        Emissions: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { type: "CO2", value: 100 },
                            ]),
                        },
                        Recommendations: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { recommendation: "Switch to EV" },
                            ]),
                        },
                        FuelStops: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { type: "EV", location: "Stop A" },
                                { type: "RD", location: "Stop B" },
                            ]),
                        },
                        ProjectInvite: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "user_id": 198
                                    }
                                }
                            ]),
                        },
                        EmissionLanes: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "intensity": 198,
                                        "emissions": 545,
                                        "shipment_count": 3,
                                        "total_ton_miles": 434
                                    }
                                }
                            ]),
                        },
                    },
                },
                'main': {
                    models: {
                        User: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "id": 198
                                    }
                                }
                            ]),
                            findOne: jest.fn(),
                        },
                        Lane: {
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
                        CostByLane: {
                            findOne: jest.fn<any>().mockResolvedValue(
                                {
                                    dataValues: {
                                        "dollar_per_mile": 198,
                                        "lane_id": 34
                                    }
                                }
                            ),
                        },
                        HighwayLaneMetrix: {
                            findOne: jest.fn<any>().mockResolvedValue(
                                {
                                    dataValues: {
                                        "dollar_per_mile": 198,
                                        "lane_id": 34,
                                        "distance": 567,
                                        "time": 44,
                                        "cost": 5
                                    }
                                }
                            ),
                        },
                        RecommendedKLaneCoordinate: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "lane_id": 198,
                                        'longitude': 823472.34,
                                        'latitude': 43232.54
                                    }
                                }
                            ])
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
                    },
                    QueryTypes: { Select: jest.fn() },
                    query: jest.fn<any>().mockResolvedValue([
                        {
                            "lane_id": 228367,
                            "k_count": 1,
                            "distance": 1379.26,
                            "fuel_count": 29
                        },
                        {
                            "lane_id": 228367,
                            "k_count": 2,
                            "distance": 1379.35,
                            "fuel_count": 12
                        },
                        {
                            "lane_id": 228367,
                            "k_count": 3,
                            "distance": 1379.68,
                            "fuel_count": 12
                        },
                        {
                            "lane_id": 228367,
                            "k_count": 4,
                            "distance": 1379.69,
                            "fuel_count": 12
                        },
                        {
                            "lane_id": 228367,
                            "k_count": 5,
                            "distance": 1379.78,
                            "fuel_count": 29
                        }
                    ]
                    )
                }
            },
            testName:
                "should return a 200 status code and success message with all project details for diffrent companies.",
            body: { id: 1 },
            responseStatus: 200,
            responseMessage: "Project Details Fetched!",
        },
        {
            status: true,
            mockConnection: {
                ...mockConnection,
                [comapnyDbAlias?.PEP]: {
                    ...mockConnection[comapnyDbAlias?.PEP],
                    models: {
                        ...mockConnection[comapnyDbAlias?.PEP].models,
                        Project: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 1,
                                manager_id: 24,
                                lane_id: 5,
                                dataValues: {
                                    "id": 43,
                                    "project_name": "Test 25 nov ",
                                    "start_date": "2024-11-01T00:00:00.000Z",
                                    "end_date": "2024-12-01T00:00:00.000Z",
                                    "desc": "TEst",
                                    "type": "alternative_fuel",
                                    "project_unique_id": "sjjVboyEFu",
                                    "recommendation_id": 2,
                                    "lane_id": 248742,
                                    "manager_id": 24,
                                    "is_ev": false,
                                    "is_rd": false,
                                    "fuel_type": "RNG",
                                    "fuel_type_name": "RNG",
                                    "is_alternative": true,
                                    "bio_1_20_radius": 20,
                                    "bio_21_100_radius": 20,
                                    "ev_radius": 20,
                                    "rd_radius": 20,
                                    "optimus_radius": 20,
                                    "rng_radius": 20,
                                    "hydrogen_radius": 50,
                                    "hvo_radius": 3.5
                                }
                            }),
                        },
                        User: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { id: 101, name: "User A" },
                                { id: 102, name: "User B" },
                            ]),
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 24,
                                name: "Manager A",
                            }),
                        },
                        Lane: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 5,
                                name: "Lane A",
                            }),
                        },
                        Emissions: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { type: "CO2", value: 100 },
                            ]),
                        },
                        Recommendations: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { recommendation: "Switch to EV" },
                            ]),
                        },
                        FuelStops: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { type: "EV", location: "Stop A" },
                                { type: "RD", location: "Stop B" },
                            ]),
                        },
                        ProjectInvite: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "user_id": 198
                                    }
                                }
                            ]),
                        },
                        EmissionLanes: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "intensity": 198,
                                        "emissions": 545,
                                        "shipment_count": 3,
                                        "total_ton_miles": 434
                                    }
                                }
                            ]),
                        },
                    },
                },
                'main': {
                    models: {
                        User: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "id": 198
                                    }
                                }
                            ]),
                            findOne: jest.fn(),
                        },
                        Lane: {
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
                        CostByLane: {
                            findOne: jest.fn<any>().mockResolvedValue(
                                {
                                    dataValues: {
                                        "dollar_per_mile": 198,
                                        "lane_id": 34
                                    }
                                }
                            ),
                        },
                        HighwayLaneMetrix: {
                            findOne: jest.fn<any>().mockResolvedValue(
                                {
                                    dataValues: {
                                        "dollar_per_mile": 198,
                                        "lane_id": 34,
                                        "distance": 567,
                                        "time": 44,
                                        "cost": 5
                                    }
                                }
                            ),
                            findAll: jest.fn<any>().mockResolvedValue([{
                                dataValues: {
                                    distance: 23,
                                    time: 233,
                                    cost: 33
                                }
                            }])
                        },
                        RecommendedKLaneCoordinate: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "lane_id": 198,
                                        'longitude': 823472.34,
                                        'latitude': 43232.54
                                    }
                                }
                            ])
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
                    },
                    QueryTypes: { Select: jest.fn() },
                    query: jest.fn<any>().mockResolvedValue([
                    ]
                    )
                }
            },
            testName:
                "should return a 200 status code and success message with all project details, But it don't have any recomendations.",
            body: { id: 1 },
            responseStatus: 200,
            responseMessage: "Project Details Fetched!",
        },
        {
            status: true,
            mockConnection: {
                ...mockConnection,
                [comapnyDbAlias?.PEP]: {
                    ...mockConnection[comapnyDbAlias?.PEP],
                    models: {
                        ...mockConnection[comapnyDbAlias?.PEP].models,
                        Project: {
                            findOne: jest.fn<any>().mockResolvedValue(null), // Simulate no project found
                        },
                    },
                },
            },
            testName:
                "should return a 200 status code and not found message when no project details are available",
            body: { id: 99 },
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
                        ProjectDetails: {
                            findOne: jest.fn<any>().mockRejectedValue(
                                new Error("Database error")
                            ), // Simulate database error
                        },
                    },
                },
            },
            testName:
                "should return a 500 status code and error message when a database error occurs",
            body: { id: 1 },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
        {
            status: true,
            mockConnection: {
                ...mockConnection,
                [comapnyDbAlias?.PEP]: {
                    ...mockConnection[comapnyDbAlias?.PEP],
                    models: {
                        ...mockConnection[comapnyDbAlias?.PEP].models,
                        Project: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 2,
                                manager_id: 12,
                                lane_id: 10,
                                dataValues: {
                                    id: 2,
                                    project_name: "Modal Shift Project",
                                    start_date: "2024-10-01T00:00:00.000Z",
                                    end_date: "2024-12-31T00:00:00.000Z",
                                    desc: "A test modal shift project",
                                    type: "modal_shift",
                                    project_unique_id: "modal123",
                                    recommendation_id: 5,
                                    lane_id: 10,
                                    manager_id: 12,
                                    is_ev: false,
                                    is_rd: false,
                                    is_modal_shift: true,
                                    bio_1_20_radius: 10,
                                    bio_21_100_radius: 20,
                                    ev_radius: 0,
                                    rd_radius: 0,
                                    modal_shift_distance: 300,
                                    modal_shift_savings: 150,
                                },
                            }),
                        },
                        User: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { id: 101, name: "User A" },
                                { id: 102, name: "User B" },
                            ]),
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 12,
                                name: "Manager Modal",
                            }),
                        },
                        Lane: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 10,
                                name: "Lane Modal",
                            }),
                        },
                        Emissions: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { type: "CO2", value: 200 },
                            ]),
                        },
                        Recommendations: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { recommendation: "Switch to rail transport" },
                            ]),
                        },
                        ProjectInvite: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "user_id": 198
                                    }
                                }
                            ]),
                        },
                        EmissionLanes: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "intensity": 198,
                                        "emissions": 545,
                                        "shipment_count": 3,
                                        "total_ton_miles": 434
                                    }
                                }
                            ]),
                        },
                        ConfigConstants: {
                            findOne: jest.fn<any>().mockResolvedValue(
                                {
                                    dataValues: {
                                        "config_key": 198,
                                        "config_value": 545
                                    }
                                }
                            ),
                        },
                    },
                },
                'main': {
                    models: {
                        User: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "id": 198
                                    }
                                }
                            ]),
                            findOne: jest.fn(),
                        },
                        Lane: {
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
                        CostByLane: {
                            findOne: jest.fn<any>().mockResolvedValue(
                                {
                                    dataValues: {
                                        "dollar_per_mile": 198,
                                        "lane_id": 34
                                    }
                                }
                            ),
                        },
                        HighwayLaneMetrix: {
                            findOne: jest.fn<any>().mockResolvedValue(
                                {
                                    dataValues: {
                                        "dollar_per_mile": 198,
                                        "lane_id": 34,
                                        "distance": 567,
                                        "time": 44,
                                        "cost": 5
                                    }
                                }
                            ),
                        },
                        RecommendedKLaneCoordinate: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "lane_id": 198,
                                        'longitude': 823472.34,
                                        'latitude': 43232.54
                                    }
                                }
                            ])
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
                        },
                    },
                    QueryTypes: { Select: jest.fn() },
                    query: jest.fn<any>().mockResolvedValue([
                        {
                            "terminal_company": "88,88",
                            "lane_id": 228367,
                            "k_count": 1,
                            "distance": 1379.26,
                            "fuel_count": 29
                        },
                        {
                            "lane_id": 228367,
                            "k_count": 2,
                            "distance": 1379.35,
                            "fuel_count": 12
                        },
                        {
                            "lane_id": 228367,
                            "k_count": 3,
                            "distance": 1379.68,
                            "fuel_count": 12
                        },
                        {
                            "lane_id": 228367,
                            "k_count": 4,
                            "distance": 1379.69,
                            "fuel_count": 12
                        },
                        {
                            "lane_id": 228367,
                            "k_count": 5,
                            "distance": 1379.78,
                            "fuel_count": 29
                        }
                    ]
                    )
                }
            },
            testName:
                "should return a 200 status code and success message for a modal_shift project",
            body: { id: 2 },
            responseStatus: 200,
            responseMessage: "Project Details Fetched!",
        },
        {
            status: true,
            mockConnection: {
                ...mockConnection,
                [comapnyDbAlias?.PEP]: {
                    ...mockConnection[comapnyDbAlias?.PEP],
                    models: {
                        ...mockConnection[comapnyDbAlias?.PEP].models,
                        Project: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 2,
                                manager_id: 12,
                                lane_id: 10,
                                dataValues: {
                                    id: 2,
                                    project_name: "Modal Shift Project",
                                    start_date: "2024-10-01T00:00:00.000Z",
                                    end_date: "2024-12-31T00:00:00.000Z",
                                    desc: "A test modal shift project",
                                    type: "modal_shift",
                                    project_unique_id: "modal123",
                                    recommendation_id: 5,
                                    lane_id: 10,
                                    manager_id: 12,
                                    is_ev: false,
                                    is_rd: false,
                                    is_modal_shift: true,
                                    bio_1_20_radius: 10,
                                    bio_21_100_radius: 20,
                                    ev_radius: 0,
                                    rd_radius: 0,
                                    modal_shift_distance: 300,
                                    modal_shift_savings: 150,
                                },
                            }),
                        },
                        User: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { id: 101, name: "User A" },
                                { id: 102, name: "User B" },
                            ]),
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 12,
                                name: "Manager Modal",
                            }),
                        },
                        Lane: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 10,
                                name: "Lane Modal",
                            }),
                        },
                        Emissions: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { type: "CO2", value: 200 },
                            ]),
                        },
                        Recommendations: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { recommendation: "Switch to rail transport" },
                            ]),
                        },
                        ProjectInvite: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "user_id": 198
                                    }
                                }
                            ]),
                        },
                        EmissionLanes: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "intensity": 198,
                                        "emissions": 545,
                                        "shipment_count": 3,
                                        "total_ton_miles": 434
                                    }
                                }
                            ]),
                        },
                        ConfigConstants: {
                            findOne: jest.fn<any>().mockResolvedValue(
                                {
                                    dataValues: {
                                        "config_key": 198,
                                        "config_value": 545
                                    }
                                }
                            ),
                        },
                    },
                },
                'main': {
                    models: {
                        User: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "id": 198
                                    }
                                }
                            ]),
                            findOne: jest.fn(),
                        },
                        Lane: {
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
                        CostByLane: {
                            findOne: jest.fn<any>().mockResolvedValue(
                                {
                                    dataValues: {
                                        "dollar_per_mile": 198,
                                        "lane_id": 34
                                    }
                                }
                            ),
                        },
                        HighwayLaneMetrix: {
                            findOne: jest.fn<any>().mockResolvedValue(
                                {
                                    dataValues: {
                                        "dollar_per_mile": 198,
                                        "lane_id": 34,
                                        "distance": 567,
                                        "time": 44,
                                        "cost": 5
                                    }
                                }
                            ),
                        },
                        RecommendedKLaneCoordinate: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "lane_id": 198,
                                        'longitude': 823472.34,
                                        'latitude': 43232.54
                                    }
                                }
                            ])
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
                        IntermodalLanes: {
                            findOne: jest.fn<any>().mockResolvedValue(null)
                        },
                    },
                    QueryTypes: { Select: jest.fn() },
                    query: jest.fn<any>().mockResolvedValue([
                        {
                            "lane_id": 228367,
                            "k_count": 1,
                            "distance": 1379.26,
                            "fuel_count": 29
                        },
                        {
                            "lane_id": 228367,
                            "k_count": 2,
                            "distance": 1379.35,
                            "fuel_count": 12
                        },
                        {
                            "lane_id": 228367,
                            "k_count": 3,
                            "distance": 1379.68,
                            "fuel_count": 12
                        },
                        {
                            "lane_id": 228367,
                            "k_count": 4,
                            "distance": 1379.69,
                            "fuel_count": 12
                        },
                        {
                            "lane_id": 228367,
                            "k_count": 5,
                            "distance": 1379.78,
                            "fuel_count": 29
                        }
                    ]
                    )
                }
            },
            testName:
                "should return a 200 status code and success message for a modal_shift project when it have not intermodal lane.",
            body: { id: 2 },
            responseStatus: 200,
            responseMessage: "Project Details Fetched!",
        },
        {
            status: true,
            mockConnection: {
                ...mockConnection,
                [comapnyDbAlias?.PEP]: {
                    ...mockConnection[comapnyDbAlias?.PEP],
                    models: {
                        ...mockConnection[comapnyDbAlias?.PEP].models,
                        Project: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 2,
                                manager_id: 12,
                                lane_id: 10,
                                dataValues: {
                                    id: 2,
                                    project_name: "Modal Shift Project",
                                    start_date: "2024-10-01T00:00:00.000Z",
                                    end_date: "2024-12-31T00:00:00.000Z",
                                    desc: "A test modal shift project",
                                    type: "modal_shift",
                                    project_unique_id: "modal123",
                                    recommendation_id: 5,
                                    lane_id: 10,
                                    manager_id: 12,
                                    is_ev: false,
                                    is_rd: false,
                                    is_modal_shift: true,
                                    bio_1_20_radius: 10,
                                    bio_21_100_radius: 20,
                                    ev_radius: 0,
                                    rd_radius: 0,
                                    modal_shift_distance: 300,
                                    modal_shift_savings: 150,
                                },
                            }),
                        },
                        User: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { id: 101, name: "User A" },
                                { id: 102, name: "User B" },
                            ]),
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 12,
                                name: "Manager Modal",
                            }),
                        },
                        Lane: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 10,
                                name: "Lane Modal",
                            }),
                        },
                        Emissions: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { type: "CO2", value: 200 },
                            ]),
                        },
                        Recommendations: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { recommendation: "Switch to rail transport" },
                            ]),
                        },
                        ProjectInvite: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "user_id": 198
                                    }
                                }
                            ]),
                        },
                        EmissionLanes: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "intensity": 198,
                                        "emissions": 545,
                                        "shipment_count": 3,
                                        "total_ton_miles": 434
                                    }
                                }
                            ]),
                        },
                        ConfigConstants: {
                            findOne: jest.fn<any>().mockResolvedValue(
                                {
                                    dataValues: {
                                        "config_key": 198,
                                        "config_value": 545
                                    }
                                }
                            ),
                        },
                    },
                },
                'main': {
                    models: {
                        User: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "id": 198
                                    }
                                }
                            ]),
                            findOne: jest.fn(),
                        },
                        Lane: {
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
                        CostByLane: {
                            findOne: jest.fn<any>().mockResolvedValue(
                                {
                                    dataValues: {
                                        "dollar_per_mile": 198,
                                        "lane_id": 34
                                    }
                                }
                            ),
                        },
                        HighwayLaneMetrix: {
                            findOne: jest.fn<any>().mockResolvedValue(
                                {
                                    dataValues: {
                                        "dollar_per_mile": 198,
                                        "lane_id": 34,
                                        "distance": 567,
                                        "time": 44,
                                        "cost": 5
                                    }
                                }
                            ),
                        },
                        RecommendedKLaneCoordinate: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "lane_id": 198,
                                        'longitude': 823472.34,
                                        'latitude': 43232.54
                                    }
                                }
                            ])
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
                            findAll: jest.fn<any>().mockResolvedValue(null)
                        },
                    },
                    QueryTypes: { Select: jest.fn() },
                    query: jest.fn<any>().mockResolvedValue([
                        {
                            "lane_id": 228367,
                            "k_count": 1,
                            "distance": 1379.26,
                            "fuel_count": 29
                        },
                        {
                            "lane_id": 228367,
                            "k_count": 2,
                            "distance": 1379.35,
                            "fuel_count": 12
                        }
                    ]
                    )
                }
            },
            testName:
                "should return a 200 status code and success message for a modal_shift project ,But it will give null intermodal data because it don't have intermodal lane cordinates.",
            body: { id: 2 },
            responseStatus: 200,
            responseMessage: "Project Details Fetched!",
        },
        {
            status: true,
            mockConnection: {
                ...mockConnection,
                [comapnyDbAlias?.PEP]: {
                    ...mockConnection[comapnyDbAlias?.PEP],
                    models: {
                        ...mockConnection[comapnyDbAlias?.PEP].models,
                        Project: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 1,
                                manager_id: 24,
                                lane_id: 5,
                                dataValues: {
                                    "id": 43,
                                    "project_name": "Test 25 nov ",
                                    "start_date": "2024-11-01T00:00:00.000Z",
                                    "end_date": "2024-12-01T00:00:00.000Z",
                                    "desc": "TEst",
                                    "type": "carrier_shift",
                                    "project_unique_id": "sjjVboyEFu",
                                    "recommendation_id": 2,
                                    "lane_id": 248742,
                                    "manager_id": 24,
                                    "is_ev": false,
                                    "is_rd": false,
                                    "fuel_type": "RNG",
                                    "fuel_type_name": "RNG",
                                    "is_alternative": true,
                                    "bio_1_20_radius": 20,
                                    "bio_21_100_radius": 20,
                                    "ev_radius": 20,
                                    "rd_radius": 20,
                                    "optimus_radius": 20,
                                    "rng_radius": 20,
                                    "hydrogen_radius": 50,
                                    "hvo_radius": 3.5
                                }
                            }),
                        },
                        User: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { id: 101, name: "User A" },
                                { id: 102, name: "User B" },
                            ]),
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 24,
                                name: "Manager A",
                            }),
                        },
                        Lane: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 5,
                                name: "Lane A",
                            }),
                        },
                        Emissions: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { type: "CO2", value: 100 },
                            ]),
                        },
                        Recommendations: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { recommendation: "Switch to EV" },
                            ]),
                        },
                        FuelStops: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { type: "EV", location: "Stop A" },
                                { type: "RD", location: "Stop B" },
                            ]),
                        },
                        ProjectInvite: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "user_id": 198
                                    }
                                }
                            ]),
                        },
                        EmissionLanes: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "intensity": 198,
                                        "emissions": 545,
                                        "shipment_count": 3,
                                        "total_ton_miles": 434
                                    }
                                }
                            ]),
                        },
                        ConfigConstants: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                dataValues: {
                                    "config_key": "min_carrier_emission_reduction",
                                    "config_value": "Lane A",
                                }
                            })
                        },
                        min_carrier_emission_reduction: {},
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
                },
                'main': {
                    models: {
                        User: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "id": 198
                                    }
                                }
                            ]),
                            findOne: jest.fn(),
                        },
                        Lane: {
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
                        CostByLane: {
                            findOne: jest.fn<any>().mockResolvedValue(
                                {
                                    dataValues: {
                                        "dollar_per_mile": 198,
                                        "lane_id": 34
                                    }
                                }
                            ),
                        },
                        HighwayLaneMetrix: {
                            findOne: jest.fn<any>().mockResolvedValue(
                                {
                                    dataValues: {
                                        "dollar_per_mile": 198,
                                        "lane_id": 34,
                                        "distance": 567,
                                        "time": 44,
                                        "cost": 5
                                    }
                                }
                            ),
                        },
                        RecommendedKLaneCoordinate: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "lane_id": 198,
                                        'longitude': 823472.34,
                                        'latitude': 43232.54
                                    }
                                }
                            ])
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
                    },
                    QueryTypes: { Select: jest.fn() },
                    query: jest.fn<any>().mockResolvedValue([
                        {
                            "lane_id": 228367,
                            "k_count": 1,
                            "distance": 1379.26,
                            "fuel_count": 29
                        },
                        {
                            "lane_id": 228367,
                            "k_count": 2,
                            "distance": 1379.35,
                            "fuel_count": 12
                        }
                    ]
                    )
                }
            },
            testName:
                "should return a 200 status code and success message with all project details but its carrier shift type project.",
            body: { id: 1 },
            responseStatus: 200,
            responseMessage: "Project Details Fetched!",
        },
        {
            status: true,
            mockConnection: {
                ...mockConnection,
                [comapnyDbAlias?.PEP]: {
                    ...mockConnection[comapnyDbAlias?.PEP],
                    models: {
                        ...mockConnection[comapnyDbAlias?.PEP].models,
                        Project: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 1,
                                manager_id: 24,
                                lane_id: 5,
                                dataValues: {
                                    "id": 43,
                                    "project_name": "Test 25 nov ",
                                    "start_date": "2024-11-01T00:00:00.000Z",
                                    "end_date": "2024-12-01T00:00:00.000Z",
                                    "desc": "TEst",
                                    "type": "carrier_shift",
                                    "project_unique_id": "sjjVboyEFu",
                                    "recommendation_id": 2,
                                    "lane_id": 248742,
                                    "manager_id": 24,
                                    "is_ev": false,
                                    "is_rd": false,
                                    "fuel_type": "RNG",
                                    "fuel_type_name": "RNG",
                                    "is_alternative": true,
                                    "bio_1_20_radius": 20,
                                    "bio_21_100_radius": 20,
                                    "ev_radius": 20,
                                    "rd_radius": 20,
                                    "optimus_radius": 20,
                                    "rng_radius": 20,
                                    "hydrogen_radius": 50,
                                    "hvo_radius": 3.5
                                }
                            }),
                        },
                        User: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { id: 101, name: "User A" },
                                { id: 102, name: "User B" },
                            ]),
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 24,
                                name: "Manager A",
                            }),
                        },
                        Lane: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 5,
                                name: "Lane A",
                            }),
                        },
                        Emissions: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { type: "CO2", value: 100 },
                            ]),
                        },
                        Recommendations: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { recommendation: "Switch to EV" },
                            ]),
                        },
                        FuelStops: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                { type: "EV", location: "Stop A" },
                                { type: "RD", location: "Stop B" },
                            ]),
                        },
                        ProjectInvite: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "user_id": 198
                                    }
                                }
                            ]),
                        },
                        EmissionLanes: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "intensity": 198,
                                        "emissions": 545,
                                        "shipment_count": 3,
                                        "total_ton_miles": 434
                                    }
                                }
                            ]),
                        },
                        ConfigConstants: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                dataValues: {
                                    "config_key": "min_carrier_emission_reduction",
                                    "config_value": "Lane A",
                                }
                            })
                        },
                        min_carrier_emission_reduction: {},
                        CarrierEmissions: {
                            findAll: jest.fn<any>().mockResolvedValue([
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
                },
                'main': {
                    models: {
                        User: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "id": 198
                                    }
                                }
                            ]),
                            findOne: jest.fn(),
                        },
                        Lane: {
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
                        CostByLane: {
                            findOne: jest.fn<any>().mockResolvedValue(
                                {
                                    dataValues: {
                                        "dollar_per_mile": 198,
                                        "lane_id": 34
                                    }
                                }
                            ),
                        },
                        HighwayLaneMetrix: {
                            findOne: jest.fn<any>().mockResolvedValue(
                                {
                                    dataValues: {
                                        "dollar_per_mile": 198,
                                        "lane_id": 34,
                                        "distance": 567,
                                        "time": 44,
                                        "cost": 5
                                    }
                                }
                            ),
                        },
                        RecommendedKLaneCoordinate: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {
                                    dataValues: {
                                        "lane_id": 198,
                                        'longitude': 823472.34,
                                        'latitude': 43232.54
                                    }
                                }
                            ])
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
                    },
                    QueryTypes: { Select: jest.fn() },
                    query: jest.fn<any>().mockResolvedValue([
                        {
                            "lane_id": 228367,
                            "k_count": 1,
                            "distance": 1379.26,
                            "fuel_count": 29
                        },
                    ]
                    )
                }
            },
            testName:
                "The API should return a 200 status code along with a success message containing all project details. However, for carrier shift-type projects, the carrier object will be null as no carrier data is associated with these projects.",
            body: { id: 1 },
            responseStatus: 200,
            responseMessage: "Project Details Fetched!",
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    QueryTypes: { Select: jest.fn() },
                    query: jest.fn<any>().mockResolvedValue([]
                    ),
                },
                schema: "testSchema",
                userData: {
                    region_id: 1,
                },
            },
            testName:
                "The API should return a 403 status code along with a message You are not authorized to access this project for regional access.",
            body: { id: 1 },
            responseStatus: 403,
            responseMessage: "You are not authorized to access this project.",
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    QueryTypes: { Select: jest.fn() },
                    query: jest.fn<any>().mockResolvedValue([{
                        "is_access": 1
                    }]
                    ),
                    models:{
                        Project: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 1,
                                manager_id: 24,
                                lane_id: 5,
                                "type": "alternative_fuel"
                            }),
                        }
                    }
                },
                schema: "testSchema",
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
                                            "isChecked": false,
                                            "child": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                },
            },
            testName:
                "The API should return a 403 status code along with a message You are not authorized to access this project for 'Alternative fuel'.",
            body: { id: 1 },
            responseStatus: 403,
            responseMessage: "You are not authorized to access this project.",
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    QueryTypes: { Select: jest.fn() },
                    query: jest.fn<any>().mockResolvedValue([{
                        "is_access": 1
                    }]
                    ),
                    models:{
                        Project: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 1,
                                manager_id: 24,
                                lane_id: 5,
                                "type": "modal_shift"
                            }),
                        }
                    }
                },
                schema: "testSchema",
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
                                            "id": 15,
                                            "title": "Alternative Fuel & Modal Shift",
                                            "parent_id": 7,
                                            "slug": "AMS",
                                            "isChecked": false,
                                            "child": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                },
            },
            testName:
                "The API should return a 403 status code along with a message You are not authorized to access this project for 'modal shift'.",
            body: { id: 1 },
            responseStatus: 403,
            responseMessage: "You are not authorized to access this project.",
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    QueryTypes: { Select: jest.fn() },
                    query: jest.fn<any>().mockResolvedValue([{
                        "is_access": 1
                    }]
                    ),
                    models:{
                        Project: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                id: 1,
                                manager_id: 24,
                                lane_id: 5,
                                "type": "carrier_shift"
                            }),
                        }
                    }
                },
                schema: "testSchema",
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
                                            "isChecked": false,
                                            "child": []
                                        },
                                    ]
                                }
                            ]
                        }
                    ],
                },
            },
            testName:
                "The API should return a 403 status code along with a message You are not authorized to access this project for 'carrier_shift'.",
            body: { id: 1 },
            responseStatus: 403,
            responseMessage: "You are not authorized to access this project.",
        }
    ],
};

commonTestFile(payload);
