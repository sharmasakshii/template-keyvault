import { jest } from "@jest/globals";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import BidPlanningController from "../../../../controller/scope3/act/bidPlanningController";

// Mock external dependencies
jest.mock("axios", () => ({
    request: jest.fn<any>().mockResolvedValue({
        data: [{ distance: 120, fuel_stop_type: "diesel" }]
    }),
    get:jest.fn<any>().mockResolvedValue({
        "data": {
          "results": [
            {
              "geometry": {
                "location": {
                  "lat": 40.712776,
                  "lng": -74.005974
                }
              }
            }
          ]
        }
      }
      )
}));

const mockBidData = [
   { dataValues :{ lane_name: "ORIGIN_DEST" } }
];

const mockConnection: any = {
    company: comapnyDbAlias.PEP,
    schema: "dbo",
    userData: { id: 101, companies: [{ slug: "test-company" }] },
    [comapnyDbAlias.PEP]: {
        QueryTypes: { Select: jest.fn() },
        query: jest.fn<any>().mockResolvedValue([]),
        models: {
            BidImport: {
                findAll: jest.fn<any>().mockResolvedValue(mockBidData)
            },
            BidProcessing: {
                findOne: jest.fn<any>().mockResolvedValue({
                    update: jest.fn<any>().mockResolvedValue(true)
                }),
                create: jest.fn<any>().mockResolvedValue(true)
            },
            BidManagement: {
                findOne: jest.fn<any>().mockResolvedValue({
                    update: jest.fn<any>().mockResolvedValue(true)
                })
            },
            BidLanes: {
                create: jest.fn<any>().mockResolvedValue(true)
            }
        }
    }
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    },
    describeName: "Process Bid Files",
    controller: BidPlanningController,
    moduleName: "processBidFiles",
    testCases: [
        {
            status: true,
            mockConnection,
            testName: "should process bid files and return 200",
            body: {
                file_id: 3
            },
            responseStatus: 200,
            responseMessage: "File is processing.",
            headers: { authorization: "Bearer XXXXXX" }
        },
        {
            status: true,
            mockConnection:{
                company: comapnyDbAlias.PEP,
                schema: "dbo",
                userData: { id: 101, companies: [{ slug: "test-company" }] },
                [comapnyDbAlias.PEP]: {
                    QueryTypes: { Select: jest.fn() },
                    query: jest.fn<any>().mockResolvedValue([]),
                    models: {
                        BidImport: {
                            findAll: jest.fn<any>().mockResolvedValue([])
                        },
                        BidProcessing: {
                            findOne: jest.fn<any>().mockResolvedValue(null),
                            create: jest.fn<any>().mockResolvedValue(true)
                        },
                        BidManagement: {
                            findOne: jest.fn<any>().mockResolvedValue({
                                update: jest.fn<any>().mockResolvedValue(true)
                            })
                        },
                        BidLanes: {
                            create: jest.fn<any>().mockResolvedValue(true)
                        }
                    }
                }
            },
            testName: "should process bid files and return 200 without new lanes.",
            body: {
                file_id: 3
            },
            responseStatus: 200,
            responseMessage: "File is processing.",
            headers: { authorization: "Bearer XXXXXX" }
        },
        {
            status: false,
            mockConnection: {company: comapnyDbAlias.PEP,  [comapnyDbAlias.PEP]: {models:{BidManagement:{findOne: jest.fn<any>().mockResolvedValue(null)}}}},
            testName: "should return INTERNAL_SERVER_ERROR when connection is undefined",
            body: {
                file_id: 3
            },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR
        },
    ]
};

commonTestFile(payload);
