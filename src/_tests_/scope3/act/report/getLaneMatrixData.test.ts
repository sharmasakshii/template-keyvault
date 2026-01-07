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
                findAll: jest.fn<any>().mockResolvedValue([{
                    lane_count: 4561,
                    emission_reduction_percentage: -18.0000000695
                  }]),
            },
        }
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Matrix data of report screen",
    controller: ReportController,
    moduleName: 'getLaneMatrixData',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return a 200 status code and data if the query is successful",
            body: {region_id: "", division_id: "", quarter: 2, year: 2024, fuelType: "rd", radius: "20"},
            responseStatus: 200,
            responseMessage: "Lane matrix data",
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
            body: {region_id: "", division_id: "", quarter: 2, year: 2024, fuelType: "rd", radius: "20"},
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
            body: {region_id: "", division_id: "", quarter: 2, year: 2024, fuelType: "rd", radius: "20"},
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        }
    ]
}

commonTestFile(payload)


