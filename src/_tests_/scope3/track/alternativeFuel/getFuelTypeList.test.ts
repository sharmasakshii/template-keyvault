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
                    { fuel_type: "Diesel", name: "Diesel" },
                ]),
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
    describeName: "Alternate fuel type list",
    controller: AlternateFuelTypeController,
    moduleName: 'getFuelTypeList',
    testCases: [
        {

            status: true,
            mockConnection: mockConnection,
            testName: "should return a 200 status code and data if the query is successful",
            body: { year: 2024, month: 8, carrier_scac: ["XYZ"] },
            responseStatus: 200,
            responseMessage: "Fuel type data fetched successfully.",
        },
        
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        LaneAlternateFuelType: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                        AlternateFueltypeCarrier: {
                            findAll: jest.fn<any>().mockResolvedValue([{
                                dataValues: {
                                    scac: 'XPO Logistics',
                                    fuel_type: "testt",
                                    fuel_consumption: "testt",
                                    fuel_mileage: "adada"
                                }
                            }]),
                        },
                    }
                },
            },
            testName: "should return a 200 status code and message if no data found",
            body: { year: 2024, month: 8, carrier_scac: ["XYZ"] },
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
                            findAll: jest.fn<any>().mockRejectedValue(new Error("Database Error")),
                        },
                    }
                },
            },
            testName: "should return 500 error on database failure",
            body: { year: 2024, month: 8, carrier_scac: ["XYZ"] },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
        {
            extraParameter: { type: "" },

            status: false,
            mockConnection: mockConnection,
            testName: "should return 400 error when year is missing",
            body: { month: 8, carrier_scac: ["XYZ"] },
            responseStatus: 400,
            responseMessage: "Year and atleast one carrier required.",
        },
        {
            extraParameter: { type: "" },

            status: false,
            mockConnection: mockConnection,
            testName: "should return 400 error when carrier_scac is empty",
            body: { year: 2024, month: 8, carrier_scac: [] },
            responseStatus: 400,
            responseMessage: "Year and atleast one carrier required.",
        },
    ]
}

commonTestFile(payload);
