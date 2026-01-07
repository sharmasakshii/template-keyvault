import {
    initialState,
    resetHome,
    setLoading,
    homeReducer
} from "store/home/homeSlice";
import store from "store"


// Test case initialState
describe('initial reducer', () => {
    it('should reset state to initialState when resetScopeOneCommonData is called', () => {
        const modifiedState: any = {
            isLoading: false,
        };

        const result = homeReducer.reducer(modifiedState, resetHome());

        expect(result).toEqual(initialState);


    });
});


describe("setLoading Thunk", () => {
    it("should return the correct status when dispatched", async () => {
        const status = true;
        // Dispatch the thunk action
        const result = await store.dispatch(setLoading(status));
        expect(result.payload).toBe(status);
    });
});

