import { jest } from "@jest/globals";
import DecarbController from "../../../../controller/scope3/act/decarb/decarbController";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";

const mockConnection: any = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        QueryTypes: { Select: jest.fn() },
        query: jest.fn<any>().mockResolvedValue([{ test: "asdasd" }]),
        models: {},
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Search Origin Destination Problem Lanes",
    controller: DecarbController,
    moduleName: "searchOriginDestProblemLanes",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when successful",
            query: { region_id: 1, source: "A", dest: "B", type: "road", keyword: "test" },
            responseStatus: 200,
            responseMessage: "Problem lane by regions origin destinations.",
        },
        {
            status: true,
            mockConnection: {
                company: "pepsi",
                [comapnyDbAlias?.PEP]: {
                    QueryTypes: { Select: jest.fn() },
                    query: jest.fn<any>().mockResolvedValue([{ test: "asdasd" }]),
                    models: {},
                },
            },
            testName: "should return 200 when successful for other company",
            query: { region_id: 1, source: "A", dest: "B", type: "road", keyword: "test" },
            responseStatus: 200,
            responseMessage: "Problem lane by regions origin destinations.",
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            query: { region_id: 1, source: "A", dest: "B", type: "road", keyword: "error" },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
