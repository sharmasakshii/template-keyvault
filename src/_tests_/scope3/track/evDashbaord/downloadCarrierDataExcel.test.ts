import { jest } from "@jest/globals";
import EvDashboardController from "../../../../controller/scope3/track/evDashboard/evDashboardController";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";




const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Ev dashboard download excel carrier data ",
    controller: EvDashboardController,
    moduleName: 'downloadCarrierDataExcel',
    testCases: [
        {
            status: false,
            mockConnection: undefined,
            testName: "should return 500 error ",
            body: {
                "start_date": "2024-10-08",
                "end_date": "2024-10-11", scac_data: [{ scac: "test" }]
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },

    ]
}

commonTestFile(payload)


