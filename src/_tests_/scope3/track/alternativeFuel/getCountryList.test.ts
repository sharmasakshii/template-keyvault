import { jest } from "@jest/globals";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import AlternateFuelTypeController from "../../../../controller/scope3/track/alternateFuelType/alternateFuelController";

const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            CountryAlternate: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { scac: "XYZ", total_emission: 100 },
                ]),
            },


        }
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get country list",
    controller: AlternateFuelTypeController,
    moduleName: 'getCountryList',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return a 200 status code and data if the query is successful",
            body: {
            },
            responseStatus: 200,
            responseMessage: "Country list.",
        },

        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        CountryAlternate: {
                            findAll: jest.fn<any>().mockResolvedValue([

                            ]),
                        },


                    }
                },
            },
            testName: "should return a 200 status code and data if the query is successful",
            body: {
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return 500 error ",
            body: {},
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ]
};

commonTestFile(payload);
