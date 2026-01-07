import { jest } from "@jest/globals";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import AlternateFuelTypeController from "../../../../controller/scope3/track/alternateFuelType/alternateFuelController";


const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            AlternateFueltypeCarrier: {
                findAll: jest.fn<any>().mockResolvedValue([{ scac: "BIAP" }]),
            },

        }
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Alternate fuel list of carrier ",
    controller: AlternateFuelTypeController,
    moduleName: 'getCarrierList',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return a 200 status code and data if the query is successful",
            query: { country_code: "" },
            responseStatus: 200,
            responseMessage: "Alternative carrier by country.",
        },
        
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        AlternateFueltypeCarrier: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    }
                },
            },
            testName: "should return a 200 status code and data if no data found",
            query: { country_code: "" },

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
            query: { country_code: "" },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },

    ]
}

commonTestFile(payload)


