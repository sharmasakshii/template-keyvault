import { getAllRoutes } from "../../../routes";

jest.mock("jsonwebtoken", () => ({
    sign: jest.fn().mockReturnValue("mockedToken"),
}));
  
describe("App and Routes Test", () => {
    describe("getAllRoutes", () => {
        it("should return all routes with their methods and paths", () => {
            const routes = getAllRoutes();
            expect(routes).toBeInstanceOf(Array);
            expect(routes.length).toBeGreaterThan(0);
            routes.forEach((route) => {
                expect(route).toHaveProperty("method");
                expect(route).toHaveProperty("path");
            });
        });
    });

  
});
