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
                findAll: jest.fn<any>().mockResolvedValue([
                    { scac: "XYZ", total_emission: 100 },
                ]),
            },
            AlternateFueltypeCarrier:{
                findAll: jest.fn<any>().mockResolvedValue([
                    { 'name':"blabla", 'scac':"BIAP", 'image': "any" , "scac_priority": "high"},
                ]),
            }
            ,
            CarrierCountry:{
            }
        }
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get Total Data by Carrier",
    controller: AlternateFuelTypeController,
    moduleName: 'getTotalDataByCarrier',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return a 200 status code and data if the query is successful",
            body: {
                "month": 0,
                "year": 2024,
                "carrier_scac": [
                    "BIAP",
                ],
                "column": "emission"
            },
            responseStatus: 200,
            responseMessage: "Data by carrier fetched successfully.",
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        LaneAlternateFuelType: {
                            findAll: jest.fn<any>().mockRejectedValue(new Error("Database Error")),
                        },
                    }
                },
            },
            testName: "should return 500 error on database failure",
            body: { year: 2024, month: 8, column: "total_emission", carrier_scac: ["XYZ"] },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
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
            mockConnection: mockConnection,
            testName: "should return 400 error when column is missing",
            body: { year: 2024, month: 8, carrier_scac: ["XYZ"] },
            responseStatus: 400,
            responseMessage: "Column required.",
        },
    ]
};

commonTestFile(payload);
