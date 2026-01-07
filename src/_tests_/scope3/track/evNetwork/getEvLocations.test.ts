import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import EvNetworkController from "../../../../controller/scope3/track/evNetwork/evNetworkController";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";


const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            EvLocations: {
                findAll: jest.fn<any>().mockResolvedValue([{ test: "asdsad" }])
            }
        }
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Ev Network  Fuel stop lanes ",
    controller: EvNetworkController,
    moduleName: 'getEvLocations',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 status when query fulfilled",
            responseStatus: 200,
            responseMessage: "Ev Locations Data.",
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.ADM,
               
            },
            testName: "should return validation error when non pepsi user acces this api",
         
            responseStatus: 400,
            responseMessage: "You are not authorized to access this end point",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        EvLocations: {
                            findAll: jest.fn<any>().mockResolvedValue([])
                        }
                    }
                },
            },
            testName: "should return 200 status when query fulfilled no data found",
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return 500 error ",
            body: new Error("Database connection error"),
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ]
}

commonTestFile(payload)


