
import { initialState, dashRegionReducer, changeRegion, changeLane, changeFacility, changeCarrier, changeFuel, changeVehicle, changeBusinessUnit, resetRegionDash } from "store/dashRegion/dashRegionSlice";
import store from "store"

// Test case initialState
describe('initial reducer', () => {
    it('should reset state to initialState when resetScopeOneCommonData is called', () => {
        const modifiedState: any = {
            data: [{ id: 1, value: 'test' }],
            loading: true,
            error: 'Something went wrong',
        };

        const result = dashRegionReducer.reducer(modifiedState, resetRegionDash());
        expect(result).toEqual(initialState);


    });
});

describe("changeRegion Thunk", () => {
    it("should return the correct status when dispatched", async () => {
        const status = true;
        // Dispatch the thunk action
        const result = await store.dispatch(changeRegion(status));
        expect(result.payload).toBe(status);
    });
});

describe("changeLane Thunk", () => {
    it("should return the correct status when dispatched", async () => {
        const status = true;
        // Dispatch the thunk action
        const result = await store.dispatch(changeLane(status));
        expect(result.payload).toBe(status);
    });
});

describe("changeFacility Thunk", () => {
    it("should return the correct status when dispatched", async () => {
        const status = true;
        // Dispatch the thunk action
        const result = await store.dispatch(changeFacility(status));
        expect(result.payload).toBe(status);
    });
});

describe("changeBusinessUnit Thunk", () => {
    it("should return the correct status when dispatched", async () => {
        const status = true;
        // Dispatch the thunk action
        const result = await store.dispatch(changeBusinessUnit(status));
        expect(result.payload).toBe(status);
    });
});


describe("changeCarrier Thunk", () => {
    it("should return the correct status when dispatched", async () => {
        const status = true;
        // Dispatch the thunk action
        const result = await store.dispatch(changeCarrier(status));
        expect(result.payload).toBe(status);
    });
});

describe("changeFuel Thunk", () => {
    it("should return the correct status when dispatched", async () => {
        const status = true;
        // Dispatch the thunk action
        const result = await store.dispatch(changeFuel(status));
        expect(result.payload).toBe(status);
    });
});

describe("changeVehicle Thunk", () => {
    it("should return the correct status when dispatched", async () => {
        const status = true;
        // Dispatch the thunk action
        const result = await store.dispatch(changeVehicle(status));
        expect(result.payload).toBe(status);
    });
});
