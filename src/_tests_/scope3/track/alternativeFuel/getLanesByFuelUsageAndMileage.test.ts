import { jest } from "@jest/globals";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import AlternateFuelTypeController from "../../../../controller/scope3/track/alternateFuelType/alternateFuelController";
import HttpStatusMessage from "../../../../constant/responseConstant";

// Mocking callStoredProcedure function
const mockCallStoredProcedure = jest.fn<any>().mockResolvedValue([]);

// Mocked connection for testing
const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            AlternateFueltypeCarrier: {
                findAll: jest.fn<any>().mockResolvedValue([{
                    scac: 'BIAP',
                    fuel_type: "testt",
                    fuel_consumption: "testt",
                    fuel_mileage: "adada"
                }
                ]),
            },
        },
        query: mockCallStoredProcedure,
        QueryTypes: { Select: jest.fn() },
    },

};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Alternate fuel detail test",
    controller: AlternateFuelTypeController,
    moduleName: 'getLanesByFuelUsageAndMileage',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return a 200 status code and data if the query is successful",
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
            responseMessage: "Lanes fetched successfully.",
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
                    },
                    query: mockCallStoredProcedure,
                    QueryTypes: { Select: jest.fn() },
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
            mockConnection: mockConnection,
            testName: "should return 500 error if stored procedure fails",
            body: "",
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
            mockCallStoredProcedureReturnValue: [],
            mockCallStoredProcedureTotalCount: 0
        },
    ]
}

// Modify the commonTestFile function to accept mockCallStoredProcedure
commonTestFile({
    ...payload,
    mockCallStoredProcedure
});

