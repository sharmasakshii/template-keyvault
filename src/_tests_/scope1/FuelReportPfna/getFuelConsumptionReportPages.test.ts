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
                    { location: "Location A", value: 100 },
                ]),
            },
            Location: {}
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Fuel Consumption Report API",
    controller: FuelsReportPfnaPagesController,
    moduleName: "getFuelConsumptionReport",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when data is fetched successfully",
            body: { year: 2023, period_id: 1, location_ids: [1], reportSlug: "pbna",
                 type: "emissions", supplier: "Supplier A", fuel_type_id: 1, transport_id: 1},
            responseStatus: 200,
            responseMessage: "Fuel consumption report generated.",
        },
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when data is fetched successfully, consumption",
            body: { year: 2023, period_id: 1, location_ids: [1], reportSlug: "pbna", type: "consumption", supplier: "Supplier A", fuel_type_id: 1, transport_id: 1 },
            responseStatus: 200,
            responseMessage: "Fuel consumption report generated.",
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: { year: 2023, period_id: 1, location_ids: [1], reportSlug: "pbna", type: "emissions", supplier: "Supplier A", fuel_type_id: 1, transport_id: 1 },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
