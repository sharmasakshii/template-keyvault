import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import regionService from "./regionService";
import { getErrorMessage } from "../../../../utils";
import { RegionState } from "./regionInterface";

/**
 * Redux Slice for managing regional data
 */

// Define the shape of the state

// Initial state
export const initialState: RegionState = {
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: null,
    regionTableDetails: null,
    regionGraphDetails: null,
    regionGraphDetailsLoading: false
}

// Async Thunk for fetching region table data
export const regionTableData = createAsyncThunk(
    "get/region/table-Data",
    async (userData: any, thunkApi) => {
        try {
            return await regionService.regionTableDataGet(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

// Async Thunk for fetching region graph data
export const regionGraphData = createAsyncThunk(
    "get/region/Graph",
    async (userData: any, thunkApi) => {
        try {
            return await regionService.regionGraphPost(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const isLoadingRegionDashboard = createAsyncThunk("isLoadingRegionDashboard", async (status: boolean) => {
    return status
})

// Define the regional data reducer
export const regionDataReducer = createSlice({
    name: "region-data",
    initialState,
    reducers: {
        resetRegion: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(isLoadingRegionDashboard.pending, (state) => {
                // Set loading state
                // state.regionGraphDetailsLoading = true;
                state.isLoading = true;
            })

            .addCase(regionTableData.pending, (state) => {
                // Set loading state
                state.isLoading = true;
                state.isSuccess = false;
                state.regionTableDetails = null
            })
            .addCase(regionTableData.fulfilled, (state, action) => {
                // Set success state and update regionTableDetails
                state.isLoading = false;
                state.isSuccess = true;
                state.regionTableDetails = action.payload;
            })
            .addCase(regionTableData.rejected, (state, action) => {
                // Set error state on rejection
                state.isLoading = false;
                state.isError = action.payload;
                state.isSuccess = false;
                state.regionTableDetails = null
            })
            .addCase(regionGraphData.pending, (state: any) => {
                // Set loading state for graph data
                state.isSuccess = false;
                state.regionGraphDetailsLoading = true;
                state.regionGraphDetails = "";
            })
            .addCase(regionGraphData.fulfilled, (state, action) => {
                // Set success state and update regionGraphDetails
                state.isSuccess = true;
                state.regionGraphDetails = action.payload;
                state.regionGraphDetailsLoading = false;
            })
            .addCase(regionGraphData.rejected, (state, action) => {
                // Set error state on graph data rejection
                state.isError = action.payload;
                state.isSuccess = false;
                state.regionGraphDetailsLoading = false;
            });
    }
});

// Export actions and reducer
export const { resetRegion } = regionDataReducer.actions;
export default regionDataReducer.reducer;
