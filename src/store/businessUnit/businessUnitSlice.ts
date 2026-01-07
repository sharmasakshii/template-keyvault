import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import businessUnitService from "./businessUnitService";
import { getErrorMessage, isCancelRequest } from "../../utils";
import { BusinessUnitState } from "./businessUnitInterface";

/**
 * Redux Slice for managing regional data
 */

// Define the shape of the state

// Initial state
export const initialState: BusinessUnitState = {
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: null,
    businessUnitTableDetails: null,
    businessUnitGraphDetails: null,
    businessUnitGraphDetailsLoading: false
}

// Async Thunk for fetching region table data
export const businessUnitTableData = createAsyncThunk(
    "get/business/unit/table-Data",
    async (userData: any, thunkApi) => {
        try {
            return await businessUnitService.businessUnitTableDataGet(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

// Async Thunk for fetching region graph data
export const businessUnitGraphData = createAsyncThunk(
    "get/business/unit/Graph",
    async (userData: any, thunkApi) => {
        try {
            return await businessUnitService.businessUnitGraphPost(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const isLoadingBusinessUnitDashboard = createAsyncThunk("isLoadingBusinessUnitDashboard", async (status: boolean) => {
    return status
})

// Define the regional data reducer
export const businessUnitDataReducer = createSlice({
    name: "business-unit",
    initialState,
    reducers: {
        resetBusinessUnit: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(isLoadingBusinessUnitDashboard.pending, (state) => {
                // Set loading state
                state.isLoading = true;
                state.businessUnitGraphDetailsLoading = true
            })
            .addCase(businessUnitTableData.pending, (state) => {
                // Set loading state
                state.isLoading = true;
                state.isSuccess = false;
                state.businessUnitTableDetails = null
            })
            .addCase(businessUnitTableData.fulfilled, (state, action) => {
                // Set success state and update businessUnitTableDetails
                state.isLoading = false;
                state.isSuccess = true;
                state.businessUnitTableDetails = action.payload;
            })
            .addCase(businessUnitTableData.rejected, (state, action) => {
                // Set error state on rejection
                state.isLoading = false;
                state.isError = action.payload;
                state.isSuccess = false;
                state.businessUnitTableDetails = null
            })
            .addCase(businessUnitGraphData.pending, (state) => {
                // Set loading state for graph data
                state.isSuccess = false;
                state.businessUnitGraphDetailsLoading = true;
                state.businessUnitGraphDetails = null;
            })
            .addCase(businessUnitGraphData.fulfilled, (state, action) => {
                // Set success state and update businessUnitGraphDetails
                state.isSuccess = true;
                state.businessUnitGraphDetails = action.payload;
                state.businessUnitGraphDetailsLoading = false;
            })
            .addCase(businessUnitGraphData.rejected, (state, action) => {
                // Set error state on graph data rejection
                state.isError = action.payload;
                state.isSuccess = false;
                state.businessUnitGraphDetailsLoading = isCancelRequest(action?.payload);;
            })




    }
});

// Export actions and reducer
export const { resetBusinessUnit } = businessUnitDataReducer.actions;
export default businessUnitDataReducer.reducer;
