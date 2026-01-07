import { jest } from "@jest/globals";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import AlternateFuelTypeController from "../../../../controller/scope3/track/alternateFuelType/alternateFuelController";

// let res: Response

const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            LaneAlternateFuelType: {
                findAll: jest.fn<any>().mockResolvedValue([{
                    dataValues: {
                        lane_name: 'XPO Logistics',
                        fuel_type: "hydrogen",
                        fuel_consumption: "testt",
                        fuel_mileage: "adada"
                    }
                }]),
            },
            AlternateFueltypeCarrier: {
                findAll: jest.fn<any>().mockResolvedValue([{
                    dataValues: {
                        scac: 'XPO Logistics',
                    }
                }]),
            },

        }
    },
};
const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Alternate fuel total data and fuel type",
    controller: AlternateFuelTypeController,
    moduleName: 'getTotalDataByLaneAndFuelType',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return a 200 status code and data if the query is successful",
            body: { year: "2022", month: "", column: "emission", carrier_scac: "" },
            responseStatus: 200,
            responseMessage: "Emissions data fetched successfully.",
        },
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return a 200 status code and data if the column name is fuel_mileage",
            body: { year: "2022", month: "", column: "fuel_mileage", carrier_scac: "" },
            responseStatus: 200,
            responseMessage: "Emissions data fetched successfully.",
        },
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return a 200 status code and data if the column name is fuel_consumption",
            body: { year: "2022", month: "", column: "fuel_consumption", carrier_scac: "" },
            responseStatus: 200,
            responseMessage: "Emissions data fetched successfully.",
        },
        {
            status: false,
            mockConnection: mockConnection,
            testName: "validation test if column name is not sent in req",
            body: { year: "2022", month: "", column: "", carrier_scac: "" },
            responseStatus: 400,
            responseMessage: "Column required.",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        AlternateFueltypeCarrier: {
                            findAll: jest.fn<any>().mockResolvedValue([{
                                scac: 'dasdasd',
                                fuel_type: "testt",
                                fuel_consumption: "testt",
                                fuel_mileage: "adada"
                            }
                            ]),
                        },
                    }
                },

            },
            testName: "when no carrier found",
            body: {
                "page": 1,
                "page_size": 10,
                "month": 0,
                "year": 2024,
                "order_by": "desc",
                "column": "emission",
                "fuelType": [
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    1
                ],
                "carrier_scac": [
                    "BIAP",
                    "FOLW",
                    "FVAN",
                    "WATW"
                ]
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    modelsdd: {
                        LaneAlternateFuelType: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                        AlternateFueltypeCarrier: {
                            findAll: jest.fn<any>().mockResolvedValue([{
                                dataValues: {
                                    scac: 'XPO Logistics',
                                }
                            }]),
                        },
                    }
                },
            },
            testName: "should return 500 error ",
            body: { year: "2022", month: "", column: "emission", carrier_scac: "" },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },

    ]
}

commonTestFile(payload)


