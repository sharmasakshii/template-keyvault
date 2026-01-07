import { jest } from "@jest/globals";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import BidPlanningController from "../../../../controller/scope3/act/bidPlanningController";


const mockLanes = new Array(1000).fill({
    lane_name: "Chicago,IL_New York,NY",
    scac: "SCAC1",
    rpm: 3.5,
    row_number: 1,
    distance: 120,
    intensity: 0.9,
    emissions: 10,
    cost_impact: 100,
    emission_impact: 5,
    tab_name: "sheet1",
    fuel_type: "diesel",
    error_message: "Invalid SCAC"
});


const mockLanes2 = new Array(40000).fill({
    lane_name: "Chicago,IL_New York,NY",
    scac: "SCAC1",
    rpm: 3.5,
    row_number: 1,
    distance: 120,
    intensity: 0.9,
    emissions: 10,
    cost_impact: 100,
    emission_impact: 5,
    tab_name: "sheet1",
    fuel_type: "diesel",
    error_message: "Invalid SCAC"
});

const mockConnection: any = {
    company: comapnyDbAlias.PEP,
    userData: { id: 1, companies: [{ slug: "test-company" }] },
    [comapnyDbAlias.PEP]: {
        query: jest.fn<any>().mockResolvedValue([]),
        QueryTypes: { Select: jest.fn() },
        models: {
            BidLanes: {
                count: jest.fn<any>().mockReturnValueOnce(3).mockReturnValueOnce(3).mockReturnValueOnce(6),
            },
            BidImport: {
                findAll: jest.fn<any>().mockResolvedValue(mockLanes)
            },
            BidProcessing: {
                create: jest.fn(),
                findOne: jest.fn<any>().mockResolvedValue({
                    update: jest.fn(),
                    test: ""
                })
            },
            BidManagement: {
                create: jest.fn(),
                findOne: jest.fn<any>().mockResolvedValue({
                    update: jest.fn(),
                    test: ""
                })
            },
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Check logic app ",
    controller: BidPlanningController,
    moduleName: "checkLogicApp",
    testCases: [
        {
            status: true,
            mockConnection,
            testName: "should return 200 and download error file successfully",
            body: {
                fileId: 1
            },
            responseStatus: 200,
            responseMessage: "File is processing.",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias.PEP,
                userData: { id: 1, companies: [{ slug: "test-company" }] },
                [comapnyDbAlias.PEP]: {
                    query: jest.fn<any>().mockResolvedValue([]),
                    QueryTypes: { Select: jest.fn() },
                    models: {
                        BidLanes: {
                            count: jest.fn<any>().mockReturnValueOnce(3).mockReturnValueOnce(3).mockReturnValueOnce(6),
                        },
                        BidImport: {
                            findAll: jest.fn<any>().mockResolvedValue(mockLanes2)
                        },
                        BidProcessing: {
                            create: jest.fn(),
                            findOne: jest.fn<any>().mockResolvedValue(null)
                        },
                        BidManagement: {
                            create: jest.fn(),
                            findOne: jest.fn<any>().mockResolvedValue({
                                update: jest.fn(),
                                test: ""
                            })
                        },
                    },
                },
            },
            testName: "should return 200 and download error file successfully",
            body: {
                fileId: 1
            },
            responseStatus: 200,
            responseMessage: "File is processing.",
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when connection is undefined",
            body: {
                fileId: 2
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },

    ]
};

commonTestFile(payload);
