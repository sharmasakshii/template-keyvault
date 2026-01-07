import { jest } from "@jest/globals";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import ReportController from "../../../../controller/scope3/act/reportsController";


const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        QueryTypes:{Select:jest.fn()},
        query: jest.fn<any>().mockResolvedValue([{
            lane_count:10,
            lane_id: '789085',
            lane_name: 'MERRIEL, OR_MODESTO, CA',
            distance: 5466.56,
            emissions: 5956034.42566698,
            impact_emissions: 478959563389.60874206,
            emission_reduction: -20,
            fuel_code: 'RD',
            fuel_type: 'RD',
            bu_names: 'PFNA',
            division_names: 'OUTBOUND'
          },
          ])
    }
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Report Lane table data",
    controller: ReportController,
    moduleName: 'getLaneReportTableData',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return a 200 status code and data if the query is successful",
            body:{
                "page": 1,
                "page_size": 10,
                "region_id": "",
                "division_id": "",
                "quarter": 2,
                "year": 2024,
                "fuelType": "rd",
                "radius": "20",
                "destination": "",
                "origin": "",
                "sortColumn": "emissions",
                "order_by": "desc"
            },
            responseStatus: 200,
            responseMessage: "Lane detail",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    QueryTypes:{Select:jest.fn()},
                    query: jest.fn<any>().mockResolvedValue([])
                },
            },
            testName: "should return a 200 status code and data if no data found",
            body:{
                "page": 1,
                "page_size": 10,
                "region_id": "",
                "division_id": "",
                "quarter": 2,
                "year": 2024,
                "fuelType": "rd",
                "radius": "20",
                "destination": "",
                "origin": "",
                "sortColumn": "emissions",
                "order_by": "desc"
            },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return 500 error ",
            body:{
                "page": 1,
                "page_size": 10,
                "region_id": "",
                "division_id": "",
                "quarter": 2,
                "year": 2024,
                "fuelType": "rd",
                "radius": "20",
                "destination": "",
                "origin": "",
                "sortColumn": "emissions",
                "order_by": "desc"
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        }
    ]
}

commonTestFile(payload)


