import { jest } from "@jest/globals";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import ReportController from "../../../../controller/scope3/act/reportsController";


const mockConnection = {
    company: comapnyDbAlias?.PEP,
    "main": {
        QueryTypes: { Select: jest.fn() },
        query: jest.fn<any>().mockResolvedValue([{
            id: 247185,
            fuel_stop_id: '2689',
            product_code: 'RD',
            name: '76',
            description: null,
            city: 'Stockton',
            latitude: 37.9327888489,
            longitude: -121.3116073608,
            provider_image: '/images/renewable-diesel.svg',
            product_name: 'Renewable Diesel'
        },
        ]),
        models: {
            RecommendedKLaneCoordinate: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: {
                            id: 66982170,
                            lane_id: '247185',
                            k_count: '1',
                            latitude: 38.81594848533154,
                            longitude: -121.54433947518422,
                            created_on: 'Jul 22 2024  9:07AM',
                            modified_by: '1',
                            created_by: '1',
                            modified_on: 'Jul 22 2024  9:07AM',
                            is_deleted: '0'
                        }
                    }
                ]),
            },

        },
    },
    [comapnyDbAlias?.PEP]: {
        models:
        {
            ProductTypeExternal: {
                findAll: jest.fn<any>().mockResolvedValue([{ test: 'test' }]),
            },
        }
    }
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Fuel Stops data",
    controller: ReportController,
    moduleName: 'optimusFuelStopLanes',
    testCases: [
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.LW
            },
            testName: "should return a 400 status code if not authorized to access this end point",
            body: {
                "lane_name": "YUBA CITY, CA_YUMA, AZ",
                "lane_id": 257528,
                "fuel_type": "ev",
                "radius": "20"
            },
            responseStatus: 400,
            responseMessage: HttpStatusMessage.NOT_ACCESS,
        },
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return a 200 status code and data if the query is successful",
            body: {
                "lane_name": "YUBA CITY, CA_YUMA, AZ",
                "lane_id": 257528,
                "fuel_type": "ev",
                "radius": "20"
            },
            responseStatus: 200,
            responseMessage: "OPTIMUS fuel stop lanes data",
        },

        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models:
                    {
                        ProductTypeExternal: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    }
                }
            },
            testName: "should return a 400 status code if invalid fuel type is provided",
            body: {
                "lane_name": "YUBA CITY, CA_YUMA, AZ",
                "lane_id": 257528,
                "fuel_type": "ev",
                "radius": "20"
            },
            responseStatus: 400,
            responseMessage: "Invalid fuel type",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                "main": {
                    QueryTypes: { Select: jest.fn() },
                    query: jest.fn<any>().mockResolvedValue([]),
                    models: {
                        RecommendedKLaneCoordinate: {
                            findAll: jest.fn<any>().mockResolvedValue(null),
                        },
                    },
                },
                [comapnyDbAlias?.PEP]: {
                    models:
                    {
                        ProductTypeExternal: {
                            findAll: jest.fn<any>().mockResolvedValue([{ test: 'test' }]),
                        },
                    }
                }
            },
            testName: "should return a 200 status code and data if no data found",
            body: {
                "lane_name": "YUBA CITY, CA_YUMA, AZ",
                "lane_id": 257528,
                "fuel_type": "ev",
                "radius": "20"
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return 500 error ",
            body: {
                "lane_name": "YUBA CITY, CA_YUMA, AZ",
                "lane_id": 257528,
                "fuel_type": "ev",
                "radius": "20"
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        }
    ]
}

commonTestFile(payload)


