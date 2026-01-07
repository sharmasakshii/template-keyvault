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
                        emission: 'XPO Logistics',
                        fuel_type: "testt",
                        fuel_consumption: "testt",
                        fuel_mileage: "adada",
                        shipments: 'XPO Logistics',

                    }
                }]),
            },
            AlternateFueltypeCarrier: {
                findAll: jest.fn<any>().mockResolvedValue([{
                    scac: 'BIAP',
                    fuel_type: "testt",
                    fuel_consumption: "testt",
                    fuel_mileage: "adada"
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
    describeName: "Alternate fuel lane statics",
    controller: AlternateFuelTypeController,
    moduleName: 'getLaneStatistics',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return a 200 status code and data if the query is successful",
            body: { year: "2022", month: "", lane_name: "test", carrier_scac: "" },
            responseStatus: 200,
            responseMessage: "Route statistics fetched successfully.",
        },
        {
            status: false,
            mockConnection: mockConnection,
            testName: "validation test if lane name is not sent in req",
            body: { year: "2022", month: "", lane_name: "", carrier_scac: "" },
            responseStatus: 400,
            responseMessage: "Route is required.",
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
                lane_name: "aasd",
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
                    }
                },
            },
            testName: "should return 500 error ",
            body: { year: "2022", month: "", lane_name: "test", carrier_scac: "" },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },

    ]
}

commonTestFile(payload)


