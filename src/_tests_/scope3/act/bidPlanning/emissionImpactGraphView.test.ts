import { jest } from "@jest/globals";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import BidPlanningController from "../../../../controller/scope3/act/bidPlanningController";

const mockConnection: any = {
    company: comapnyDbAlias?.PEP,
    schema: "green_sight",
    userData: { id: 1 },
    [comapnyDbAlias?.PEP]: {
        QueryTypes: { Select: jest.fn() },
        query: jest.fn<any>().mockResolvedValue([
            { SCAC: "C001", max_emission: -20 },
            { SCAC: "C002", max_emission: 30 }
        ]),
        models: {
            CarrierLogo: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { dataValues: { carrier_code: "C001", path: "/logos/carrierA.png" } },
                    { dataValues: { carrier_code: "C002", path: "/logos/carrierB.png" } }
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
    describeName: "Emission Impact Graph View",
    controller: BidPlanningController,
    moduleName: "emissionImpactGraphView",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when emission impact data is fetched successfully",
            body: { file_id: 123 },
            responseStatus: 200,
            responseMessage: "Emission impact  graph data",
        },
        {
            status: false,
            mockConnection: {
                ...mockConnection,
                [comapnyDbAlias?.PEP]: {
                    ...mockConnection[comapnyDbAlias?.PEP],
                    query: jest.fn<any>().mockResolvedValue([]),
                },
            },
            testName: "should return NOT_FOUND when no emission impact data is found",
            body: { file_id: 123 },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: { file_id: 123 },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
