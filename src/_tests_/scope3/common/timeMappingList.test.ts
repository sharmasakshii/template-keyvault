import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../constant";

import { commonTestFile } from "../commonTest";
import HttpStatusMessage from "../../../constant/responseConstant";
import CommonController from "../../../controller/scope3/common/commonController";


const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            TimePeriod: {
                findAll: jest.fn<any>().mockResolvedValue([{
                    dataValues: { region_id: 1, name: "demo", id: 1 }
                }])
            }
        }
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "time mapping list",
    controller: CommonController,
    moduleName: 'timeMappingList',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 status when query fulfilled",
            responseStatus: 200,
            body: {
                quarter: 1, year: 2024, month: 1
            },

            responseMessage: "Time mapping list",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        TimePeriod: {
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
            responseMessage: "You don't have access for this route",
        },
      
    ]
}

commonTestFile(payload)


