import { jest } from "@jest/globals";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";
import ProjectController from "../../../../controller/scope3/manage/projectContoller";
import { comapnyDbAlias } from "../../../../constant";

const mockConnection: any = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            Project: {
                findAll: jest.fn<any>().mockResolvedValue([{
                    dataValues: {
                        status: 0
                    }
                },
                {
                    dataValues: {
                        status: 1
                    }
                }]),
            },
        },
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Search User by Email functionality",
    controller: ProjectController,
    moduleName: "getProjectCount",
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return 200 when success",
            body: { region_id: 1, year: 2024, division_id: 1 },
            responseStatus: 200,
            responseMessage: "Active/Inactive count",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        Project: {
                            findAll: jest.fn<any>().mockResolvedValue([]),
                        },
                    },
                },
            },
            testName: "should return NOT_FOUND when no project found",
            body: { region_id: 1, year: 2024, division_id: 1 },
            responseStatus: 200,
            responseMessage: HttpStatusMessage.NOT_FOUND,
        },
        {
            status: false,
            mockConnection: undefined,
            testName:
                "should return INTERNAL_SERVER_ERROR when a database error occurs",
                body: { region_id: 1, year: 2024, division_id: 1 },
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR,
        },
    ],
};

commonTestFile(payload);
