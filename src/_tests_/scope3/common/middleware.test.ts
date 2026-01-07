import { NextFunction } from "express";
import { MyUserRequest } from "../../../interfaces/commonInterface";
import jwtMiddleware from "../../../middleware";
import { ModuleKey } from "../../../constant/moduleConstant";


jest.mock("jsonwebtoken", () => ({
    verify: jest.fn().mockReturnValue({
        data: {
            companies: [{
                "name": "Pepsi",
                "db_alias": "pepsi",
                "logo": "/images/company_logo/pepsico.png\r\n",
                "slug": "PEP",
                "is_onboarded": true,
                "UserCompany": {
                    "company_id": 3,
                    "user_id": 186,
                    "createdAt": "2024-04-29T05:49:08.415Z",
                    "updatedAt": "2024-04-29T05:49:08.415Z"
                }
            }],
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
            ]
        }
    }), // Mock the verify function
    TokenExpiredError: class TokenExpiredError extends Error {
        constructor(message: string, expiredAt: Date) {
            super(message);
            this.name = "TokenExpiredError";
        }
    },
}));


describe("middleware ", () => {


    it("if token is missing", async () => {
        // Setup input values
        const req = {
            cookies:"",
            headers: {
                authorization: "",
            },

        } as MyUserRequest;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        const next: NextFunction = jest.fn();
        // Call the middleware
        const roleType = ModuleKey.Segmentation;

        const middleware = await jwtMiddleware(roleType)(req, res, next);
        expect(middleware.status).toHaveBeenCalledWith(401);
        expect(middleware.json).toHaveBeenCalledWith({
            message: "Session expired, please login again!",
            data: expect.any(String),
            status: false,
        });

    })

});


