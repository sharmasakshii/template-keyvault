import { jest } from "@jest/globals";
import { comapnyDbAlias } from "../../../../constant";
import ProjectController from "../../../../controller/scope3/manage/projectContoller";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { commonTestFile } from "../../commonTest";


const mockConnection = {
    company: comapnyDbAlias?.PEP,
    [comapnyDbAlias?.PEP]: {
        models: {
            Project: {
                update: jest.fn<any>().mockResolvedValue([1]), // Mock successful update
            },
        }
    },
};

const payload = {
    res: {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    },
    describeName: "Delete project functionality",
    controller: ProjectController,
    moduleName: 'deleteProject',
    testCases: [
        {
            status: true,
            mockConnection: mockConnection,
            testName: "should return a 200 status code and success message when project is deleted successfully",
            body: { project_id: 1 }, // Simulate the request body with project_id
            responseStatus: 200,
            responseMessage: "Project deleted successfully.",
        },
        {
            status: true,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        Project: {
                            update: jest.fn<any>().mockResolvedValue(null), // Simulate no rows affected
                        },
                    }
                },
            },
            testName: "should return a 200 status code and error message when no project is found",
            body: { project_id: 9999 }, // Simulate the request body with a non-existent project_id
            responseStatus: 200,
            responseMessage: "Project not found.",
        },
        {
            status: false,
            mockConnection: {
                company: comapnyDbAlias?.PEP,
                [comapnyDbAlias?.PEP]: {
                    models: {
                        Project: {
                            update: jest.fn<any>().mockRejectedValue(new Error("Database error")), // Simulate an error
                        },
                    }
                },
            },
            testName: "should return 500 status and error message when database fails",
            body: { project_id: 1 }, // Simulate the request body with a valid project_id
            responseStatus: 500,
            responseMessage: HttpStatusMessage.INTERNAL_SERVER_ERROR, // Assuming this is used for generic errors
        },
    ]
}

commonTestFile(payload);
