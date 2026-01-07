import { jest } from "@jest/globals";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import { comapnyDbAlias } from "../../../../constant";
import BidPlanningController from "../../../../controller/scope3/act/bidPlanningController";

jest.mock("../../../../utils", () => ({
    sendLogicAppRequest: jest.fn(),
    chunkToSize: jest.fn<any>().mockReturnValue([{"any":"blabl"}])
}));

const mockConnection: any = {
    company: comapnyDbAlias?.PEP,
    userData: { id: 1, companies: [{ slug: 'test-company' }] },
    [comapnyDbAlias?.PEP]: {
        models: {
            BidManagement: {
                findOne: jest.fn<any>()
                .mockResolvedValueOnce(null).mockResolvedValueOnce({
                    id: 1,
                    update: jest.fn<any>().mockResolvedValue(true),
                    dataValues: {
                        name: "first",
                    },
                }),
            },
            BidLanes: {
                update: jest.fn<any>().mockResolvedValue([1]),
                findAll: jest.fn<any>().mockResolvedValue([
                    { id: 1, lane_name: "NY_LA" },
                    { id: 2, lane_name: "SF_LV" }
                ]),
            },
            ConfigConstants: {
                findAll: jest.fn<any>().mockResolvedValue([
                    { dataValues: { config_key: "BID_LANE_CHUNK_SIZE", config_value: 2 } },
                ])
            }
        },
    },
    main: {
        models: {
            Company: {
                findOne: jest.fn<any>().mockResolvedValue({ dataValues: { id: 1, slug: 'test-company' } })
            }
        }
    }
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Process Logic App",
    controller: BidPlanningController,
    moduleName: "processLogicApp",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when the file is processed successfully",
            body: { file_id: 1 },
            responseStatus: 200,
            responseMessage: "File is processing.",
            cookie:{"token":"a XXXXXX"}
        },
        {
            status: false,
            mockConnection: undefined,
            testName: "should return INTERNAL_SERVER_ERROR when a database error occurs",
            body: { file_id: 1 },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                userData: { id: 1, companies: [{ slug: 'test-company' }] },
                [comapnyDbAlias?.PEP]: {
                    models: {
                        BidManagement: {
                            findOne: jest.fn<any>()
                            .mockResolvedValueOnce({
                                id: 1,
                                update: jest.fn<any>().mockResolvedValue(true),
                                dataValues: {
                                    name: "first",
                                },
                            })
                        }
                    },
                },
                main: {
                    models: {
                        Company: {
                            findOne: jest.fn<any>().mockResolvedValue({ dataValues: { id: 1, slug: 'test-company' } })
                        }
                    }
                }
            },
            testName: "should return 400 if a file is already under processing",
            body: { file_id: 1 },
            responseStatus: 400,
            responseMessage: "File first is under proccessing.",
        },
    ],
};

commonTestFile(payload);
