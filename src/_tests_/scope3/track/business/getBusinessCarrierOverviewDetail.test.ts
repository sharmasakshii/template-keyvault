import { jest } from "@jest/globals";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import HttpStatusMessage from "../../../../constant/responseConstant";
import BusinessController from "../../../../controller/scope3/track/businessUnit/businessController";

const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            BusinessUnit: {
                findOne: jest.fn<any>().mockResolvedValue({
                    name: "Test BU",
                    description: "Test Business Unit"
                })
            },
            SummerisedBusinessUnit: {
                findOne: jest.fn<any>().mockResolvedValue({'businessUnit.name':"dfsdfsf",'businessUnit.description':"dff"}),
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        intensity: 10.5,
                        emissions: 100.2,
                        shipment_count: 200
                    }
                ])
            }
        }
    }
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Get Business Carrier Overview Detail",
    controller: BusinessController,
    moduleName: 'getBusinessCarrierOverviewDetail',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return a 200 status code and data if the query is successful",
            body: { bu_id: 1, region_id: 1, year: 2025, quarter: 1, time_id: 1, division_id: 1 },
            responseStatus: 200,
            responseMessage: "Vendor Emissions",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        BusinessUnit: {
                            findOne: jest.fn<any>().mockResolvedValue(null)
                        },
                        SummerisedBusinessUnit: {
                            findOne: jest.fn<any>().mockResolvedValue(null),
                            findAll: jest.fn<any>().mockResolvedValue([])
                        }
                    }
                },
            },
            testName: "should return 200 with NOT_FOUND if BusinessUnit is not found",
            body: { bu_id: 1, region_id: 1, year: 2025, quarter: 1, time_id: 1, division_id: 1 },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return 500 error on database failure",
            body: { bu_id: 1, region_id: 1, year: 2025, quarter: 1, time_id: 1, division_id: 1 },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        }
    ]
}

commonTestFile(payload);
