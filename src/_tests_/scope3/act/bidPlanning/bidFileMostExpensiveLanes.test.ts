import { jest } from "@jest/globals";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import BidPlanningController from "../../../../controller/scope3/act/bidPlanningController";

const mockConnection: any = {
    company: comapnyDbAlias?.PEP,
    schema:"green_sight",
    userData: { id: 1 },
    [comapnyDbAlias?.PEP]: {
        QueryTypes: { Select: jest.fn() },
        query: jest.fn<any>().mockResolvedValue([{ carrier_min: "C001" , carrier_max:"C002"}]),
        models: {
            CarrierLogo: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {dataValues: { carrier_code: "C001", carrier_name: "Carrier A", path: "/logos/carrierA.png" }},
                    {dataValues: {  carrier_code: "C002", carrier_name: "Carrier B", path: "/logos/carrierB.png"} }
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
    describeName: "Get Most Expensive and Cheapest Lanes",
    controller: BidPlanningController,
    moduleName: "bidFileMostExpensiveLanes",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when bid details are fetched successfully",
            body: { fileName: "test-file.csv" },
            responseStatus: 200,
            responseMessage: "Bid Details Data",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                schema:"green_sight",
                userData: { id: 1 },
                [comapnyDbAlias?.PEP]: {
                    QueryTypes: { Select: jest.fn() },
                    query: jest.fn<any>().mockResolvedValue([]),
                    models: {
                        CarrierLogo: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {dataValues: { carrier_code: "C001", carrier_name: "Carrier A", path: "/logos/carrierA.png" }},
                                {dataValues: {  carrier_code: "C002", carrier_name: "Carrier B", path: "/logos/carrierB.png"} }
                            ]),
                        },
                    },
                },
            },
            testName: "should return NOT_FOUND when no bid details are found",
            body: { fileName: "test-file.csv" },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                userData: { id: 1 },
                [comapnyDbAlias?.PEP]: {
                    models: {
                        CarrierLogo: {
                            findAll: jest.fn<any>().mockResolvedValue([
                                {dataValues: { carrier_code: "C001", carrier_name: "Carrier A", path: "/logos/carrierA.png" }},
                                {dataValues: {  carrier_code: "C002", carrier_name: "Carrier B", path: "/logos/carrierB.png"} }
                            ]),
                        },
                    },
                },
            },
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: { fileName: "test-file.csv" },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
