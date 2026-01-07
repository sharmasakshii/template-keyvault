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
                findAndCountAll: jest.fn<any>().mockResolvedValue({
                    rows: [
                        {
                            supplier: "Supplier A",
                            fuel_name: "Diesel",
                            date: "2023-09-01",
                            location_name: "Location A",
                            fuel_type_id: 1,
                            gallons: 100,
                            emissions: 200,
                        },
                    ],
                    count: 1,
                }),
            },
            Location: {},
            FuelType: {},
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Transaction Details API",
    controller: FuelsReportPfnaPagesController,
    moduleName: "getTransactionDetails",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when transaction details are fetched successfully",
            body: {
                year: 2023,
                period_id: 1,
                startDate: "2023-01-01",
                endDate: "2023-12-31",
                supplier: "Supplier A",
                location_id: 1,
                page: 1,
                page_size: 10,
                order_by: "date",
                sortOrder: "ASC",
                reportSlug: "pbna",
                fuel_type_id: 1,
                transport_id: 1,
            },
            responseStatus: 200,
            responseMessage: "Transaction details fetched successfully.",
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: {
                year: 2023,
                period_id: 1,
                startDate: "2023-01-01",
                endDate: "2023-12-31",
                supplier: "Supplier A",
                location_id: 1,
                page: 1,
                page_size: 10,
                order_by: "date",
                sortOrder: "ASC",
                reportSlug: "pbna",
                fuel_type_id: 1,
                transport_id: 1,
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
