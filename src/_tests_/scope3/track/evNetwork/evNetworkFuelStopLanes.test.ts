import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import EvNetworkController from "../../../../controller/scope3/track/evNetwork/evNetworkController";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";


const mockConnection = {
    company: comapnyDbAlias?.PEP,
    ["main"]: {
        query: jest.fn<any>().mockResolvedValue([{ name: "zasdas_test", distance: 22323, destination: "adasdas_fdsfasfd", id: 2342 }])
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Ev Network  Fuel stop lanes ",
    controller: EvNetworkController,
    moduleName: 'evNetworkFuelStopLanes',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 status when query fulfilled",
            body: { page_number: 1, page_size: 10, origin: "testt", destination: "21323", ev_radius: "asdasd" },
            responseStatus: 200,
            responseMessage: "optimus fuel stop lanes data",
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.ADM,
                ["main"]: {
                    query: jest.fn<any>().mockResolvedValue([{ name: "zasdas_test", distance: 22323, destination: "adasdas_fdsfasfd", id: 2342 }])
                },
            },
            testName: "should return validation error when non pepsi user acces this api",
            body: { page_number: 1, page_size: 10, origin: "testt", destination: "21323", ev_radius: "asdasd" },
            responseStatus: 400,
            responseMessage: "You are not authorized to access this end point",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                ["main"]: {
                    query: jest.fn<any>().mockResolvedValue([])
                },
            },
            testName: "should return 200 status when query fulfilled",
            body: { page_number: 1, page_size: 10, origin: "testt", destination: "21323", ev_radius: "asdasd" },
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


