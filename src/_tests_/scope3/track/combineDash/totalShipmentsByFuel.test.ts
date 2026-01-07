import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import CommonAltrEVController from "../../../../controller/scope3/combineDashboard/combineDashAltrEv";

const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            SummarisedFuelBoard: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { intensity: 10, carrier_scac: "Tets", month: 1, carrier_name: "cvbjkl;", shipments: 2323, color: "dasd2@#" },
                ]),
            },
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get total shipment graph  data",
    controller: CommonAltrEVController,
    moduleName: "totalShipmentsByFuel",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when data list found",
            body: {
                country: "", year: 3333
            },
            responseStatus: 200,
            responseMessage: "Graph data ",
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return 500 when an error occurs in DB query",
            body: {
                country: '',
                year: '',

            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
