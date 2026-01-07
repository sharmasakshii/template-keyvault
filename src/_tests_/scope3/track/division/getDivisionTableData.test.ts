import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import DivisionController from "../../../../controller/scope3/track/division/divisionController";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";

const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            SummerisedBusinessUnit: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        intensity: 10.5,
                        emission: 13232,
                        total_ton_miles: 12321,
                        shipments: 1000,
                        'businessUnitDivision.id': 12,
                        'businessUnitDivision.name': 'CENTRAL'
                    },
                ]),
            },
            ConfigConstants: {
                findAll: jest.fn<any>().mockResolvedValue([{
                    dataValues: {
                        config_value: 10.5,
                        config_key: "contributor_color",
                    }
                },
                {
                    dataValues: {
                        config_value: 10.5,
                        config_key: "detractor_color",
                    }
                },
                {
                    dataValues: {
                        config_value: 10.5,
                        config_key: "medium_color",
                    }
                }
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
    describeName: "Get Division table data ",
    controller: DivisionController,
    moduleName: "getDivisionTableData",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 status with business unit data when query is successful",
            body: { region_id: 1, year: 2023, quarter: 1, col_name: "", order_by: "asc", time_id: 1, division_id: 1 },
            responseStatus: 200,
            responseMessage: "Get Division Unit Table Data",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        SummerisedBusinessUnit: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    },
                }
            },
            testName: "should return 200 status with no record found if no data is available",
            body: { region_id: 1, year: 2023, quarter: 1, col_name: "", order_by: "asc", time_id: 1, division_id: 1 },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return 500 status when there is an internal server error",
            body: { region_id: 1, year: 2023, quarter: 1, col_name: "", order_by: "asc", time_id: 1, division_id: 1 },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
