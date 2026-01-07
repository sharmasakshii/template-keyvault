import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../constant";
import HttpStatusMessage from "../../../constant/responseConstant";
import { commonTestFile } from "../../scope3/commonTest";
import FuelsReportPfnaPagesController from "../../../controller/scope1/fuelsReportPfnaPagesController";

const mockConnection: any = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            PfnaTransactions: {
                findAll: jest.fn<any>().mockResolvedValue([
                    {
                        location_id: 1,
                        name: "Location A",
                        latitude: 12.34,
                        longitude: 56.78,
                        total_transactions: 10,
                        total_fuel_consumption: 500,
                        emissions: 100,
                    },
                ]),
            },
            Location: {},
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "List of Location API",
    controller: FuelsReportPfnaPagesController,
    moduleName: "listOfLocation",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when location data is fetched successfully",
            body: {
                year: 2023,
                period_id: 1,
                bu_id: 1,
                mu_id: 1,
                company_id: 1,
                fuel_type_id: 1,
                location_id: 1,
                slug: "bulk",
                supplier: "Supplier A",
                startDate: "2023-01-01",
                endDate: "2023-12-31",
            },
            responseStatus: 200,
            responseMessage: "Location-wise fuel consumption data.",
        },
        {
            status: false,
            mockConnection: mockConnection,
            testName: "should return 400 when payload is missing",
            body: {
                slug: "unknown",
            },
            responseStatus: 400,
            responseMessage: "Paylod missing",
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: {
                year: 2023,
                period_id: 1,
                bu_id: 1,
                mu_id: 1,
                company_id: 1,
                fuel_type_id: 1,
                location_id: 1,
                slug: "pbna",
                supplier: "Supplier A",
                startDate: "2023-01-01",
                endDate: "2023-12-31",
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
