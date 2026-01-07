import { jest } from "@jest/globals";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import DecarbController from "../../../../controller/scope3/act/decarb/decarbController";

const mockConnection: any = {
    company: comapnyDbAlias?.PEP,
    userData:{
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
                                "isChecked": false,
                                "child": []
                            },
                            {
                                "id": 15,
                                "title": "Alternative Fuel & Modal Shift",
                                "parent_id": 7,
                                "slug": "AMS",
                                "isChecked": false,
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
    [comapnyDbAlias?.PEP]: {
        query: jest.fn<any>().mockResolvedValue([{tesr:"fghj"}]),
        QueryTypes: { Select: jest.fn() },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "get region problem lane ",
    controller: DecarbController,
    moduleName: "getRegionProblemLane",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: {
                "region_id": "2",
                "page": 1,
                "page_size": 12,
                "col_name": "emission",
                "order_by": "desc",
                "carrier_shift": 1,
                "modal_shift": 1,
                "is_rd": 1,
                "is_ev": 1,
                "is_hvo": 1,
                "is_bio_1_20": 1,
                "is_bio_21_100": 1,
                "optimus": 1,
                "rng": 1,
                "hydrogen": 1,
                "rd_radius": "50",
                "hvo_radius": "10",
                "bio_1_20_radius": "50",
                "bio_21_100_radius": "10",
                "ev_radius": "10",
                "optimus_radius": "20",
                "rng_radius": "20",
                "hydrogen_radius": "50",
                "origin": null,
                "destination": null
            },
            responseStatus: 200,
            responseMessage: "Problem lane by regions.",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                userData:{
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
                                            "isChecked": false,
                                            "child": []
                                        },
                                        {
                                            "id": 15,
                                            "title": "Alternative Fuel & Modal Shift",
                                            "parent_id": 7,
                                            "slug": "AMS",
                                            "isChecked": false,
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
                [comapnyDbAlias?.PEP]: {
                    query: jest.fn<any>().mockResolvedValue([]),
                    QueryTypes: { Select: jest.fn() },
                },
            },
            testName: "should return NOT_FOUND when no data found",
            body: {
                "region_id": "2",
                "page": 1,
                "page_size": 12,
                "col_name": "emission",
                "order_by": "desc",
                "carrier_shift": 1,
                "modal_shift": 1,
                "is_rd": 1,
                "is_ev": 1,
                "is_hvo": 1,
                "is_bio_1_20": 1,
                "is_bio_21_100": 1,
                "optimus": 1,
                "rng": 1,
                "hydrogen": 1,
                "rd_radius": "50",
                "hvo_radius": "10",
                "bio_1_20_radius": "50",
                "bio_21_100_radius": "10",
                "ev_radius": "10",
                "optimus_radius": "20",
                "rng_radius": "20",
                "hydrogen_radius": "50",
                "origin": null,
                "destination": null
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName:
                "should return INTERNAL_SERVER_ERROR when a database error occurs",
                body: {
                    region_id:1, page_size:10, page:1, order_by:"", col_name:"", carrier_shift:"",
                    modal_shift:"", origin:"", destination:"", is_rd:"", is_ev:"", is_bio_1_20:"", is_bio_21_100:"",
                    rd_radius:"", bio_1_20_radius:"", bio_21_100_radius:"", ev_radius:"", optimus:"", rng:"", hydrogen:"",
                    optimus_radius:"", rng_radius:"", hydrogen_radius:"", hvo_radius:"", is_hvo:""
                },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);