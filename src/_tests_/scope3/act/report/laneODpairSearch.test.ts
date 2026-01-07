import { jest } from "@jest/globals";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import ReportController from "../../../../controller/scope3/act/reportsController";

const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            Reporting: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        dataValues: { origin: 'MERRIEL, OR' },
                        _previousDataValues: { origin: 'MERRIEL, OR' }
                    }
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
    describeName: "OD pair search in report screen",
    controller: ReportController,
    moduleName: 'laneSearch',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return a 200 status code and data if the query is successful",
            body: {
                "type": "origin",
                "keyword": "merri",
                "page": "laneReport",
                "fuel_type": "rd",
                "radius": "20"
            },
            responseStatus: 200,
            responseMessage: "Report OD data",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        Reporting: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    }
                },
            },
            testName: "should return a 200 status code and data if no data found",
            body: {
                "type": "origin",
                "keyword": "merri",
                "page": "laneReport",
                "fuel_type": "rd",
                "radius": "20"
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        ReportingError: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    }
                },
            },
            testName: "should return 500 error ",
            body: {
                "type": "origin",
                "keyword": "merri",
                "page": "laneReport",
                "fuel_type": "rd",
                "radius": "20"
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        }
    ]
}

commonTestFile(payload)