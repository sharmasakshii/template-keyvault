import { jest } from "@jest/globals";
import { commonTestFile } from "../commonTest";
import { comapnyDbAlias } from "../../../constant";
import HttpStatusMessage from "../../../constant/responseConstant";
import FuelLocationsController from "../../../controller/scope3/fuelLocationsController";

const mockConnection = {
    company: comapnyDbAlias?.PEP,
    ['main']: {
        QueryTypes: { SELECT: jest.fn() },
        query: jest.fn<any>().mockResolvedValue([
            {
                fuel_stop: "FuelStop1",
                provider_name: "Provider 1",
                provider_code: "P1",
            },
            {
                fuel_stop: "FuelStop2",
                provider_name: "Provider 2",
                provider_code: "P2",
            },
        ])
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get Fuel Stop Providers List",
    controller: FuelLocationsController,
    moduleName: 'getFuelStopProvidersList',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 status when fuel stop providers are found",
            body: { productTypeIds: [1, 2] },
            responseStatus: 200,
            responseMessage: "All providers.",
            expectedData: [
                {
                    fuel_stop: "FuelStop1",
                    provider_name: "Provider 1",
                    provider_code: "P1",
                },
                {
                    fuel_stop: "FuelStop2",
                    provider_name: "Provider 2",
                    provider_code: "P2",
                },
            ],
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    QueryTypes: { SELECT: jest.fn() },
                    query: jest.fn<any>().mockRejectedValue(
                        new Error("Database error")
                    ),
                },
            },
            testName: "should return 500 status when there is a database error",
            body: { productTypeIds: [1, 2] },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ]
}

commonTestFile(payload);
