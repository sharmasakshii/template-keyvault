
import { MyUserRequest } from "../../interfaces/commonInterface";

jest.mock("../../redisServices", () => ({
    getHKey: jest.fn(),
    setHKey: jest.fn(),
}));

jest.mock("../../connectionDb/sequilizeSetup", () => ({
    setupSequelize: jest.fn(),
}));


export const commonTestFile = (prop: any) => {

    describe(prop?.describeName, () => {
        beforeEach(() => {
            jest.clearAllMocks();
            jest.resetModules();
        });
        afterEach(() => {
            jest.clearAllMocks();
        });
        prop?.testCases?.forEach((ele: any) => {
            it(`should test for ${ele?.testName}`, async () => {
                ele?.mockFn && ele.mockFn()
                const req = {
                    extraParameter: ele.extraParameter,
                    get: jest.fn((header) => ele.requestHeaders[header] || null),
                    body: { ...ele?.body },
                    query: { ...ele?.query },
                    cookie: { ...ele?.cookie },
                    cookies: { ...ele?.cookie },
                    headers: { ...ele?.headers }
                } as MyUserRequest;

                const controller = new prop.controller(ele.mockConnection);

                const response = await controller[prop?.moduleName](req, prop.res);

                expect(response.status).toHaveBeenCalledWith(ele?.responseStatus);
                expect(response.json).toHaveBeenCalledWith({
                    message: ele?.responseMessage,
                    data: expect.any(String),
                    status: ele?.status,
                });
            }, 30000);
        });
    });
};


