import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import RegionController from "../../../../controller/scope3/track/region/regionController";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";


const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            SummerisedEmission: {
                findAll: jest.fn<any>().mockResolvedValue([{
                    dataValues: { region_id: 1, name: "demo", id: 1 }
                }])
            },
            ConfigConstants: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: {
                            config_key: "EMISSION_REDUCTION_TARGET_1_YEAR",
                            config_value: "10000",
                        },
                    },
                    {
                        dataValues: {
                            config_key: "EMISSION_REDUCTION_TARGET_1_YEAR",
                            config_value: "10000",
                        },
                    },
                    {
                        dataValues: {
                            config_key: "medium_color",
                            config_value: "#929597",
                        },
                    },
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
    describeName: "Region list",
    controller: RegionController,
    moduleName: 'getRegionTableData',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 status when query fulfilled",
            responseStatus: 200,
            responseMessage: "Region Emissions",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        SummerisedEmission: {
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


