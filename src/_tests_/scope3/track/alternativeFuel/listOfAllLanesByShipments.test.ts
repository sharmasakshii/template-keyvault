import { jest } from "@jest/globals";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import AlternateFuelTypeController from "../../../../controller/scope3/track/alternateFuelType/alternateFuelController";


const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            LaneAlternateFuelType: {
                findAll: jest.fn<any>().mockResolvedValue([{ test: "asjdasd" }])
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
    describeName: "Alternate fuel list of all shipments ",
    controller: AlternateFuelTypeController,
    moduleName: 'listOfAllLanesByShipments',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return a 200 status code and data if the query is successful",
            body: { year: 2022, month: "", page_size: 10, page: 1, order_by: "desc", carrier_scac: "" },
            responseStatus: 200,
            responseMessage: "List of all lanes by shipments",
        },
        {
            status: false,
            mockConnection: mockConnection,
            testName: "validation error",
            body: { year: 2022, month: "", page_size: "", page: 1, order_by: "desc", carrier_scac: "" },
            responseStatus: 400,
            responseMessage: "Validation Errors!",
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
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        LaneAlternateFuelType: {
                            findAll: jest.fn<any>().mockResolvedValue([])
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
            testName: "should return a 200 status code and data if no data found",
            body: { year: 2022, month: "", page_size: 10, page: 1, order_by: "desc", carrier_scac: "" },
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
                    }
                },
            },
            testName: "should return 500 error ",
            body: { year: 2022, month: "", page_size: 10, page: 1, order_by: "desc", carrier_scac: "" },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },

    ]
}

commonTestFile(payload)



