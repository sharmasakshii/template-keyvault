import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import divisionService from "./divisionService";
import { getErrorMessage, isCancelRequest } from "../../../../utils";
import { DivisionState } from "./divisionInterface";

/**
 * Redux Slice for managing regional data
 */

// Define the shape of the state

// Initial state
export const initialState: DivisionState = {
    divisionGraphDto: null,
    divisionTableDto: null,
    divisionGraphDtoLoading: false,
    divisionTableDtoLoading: false,
}

// Async Thunk for fetching region table data
export const divisionTableData = createAsyncThunk(
    "get/division/table",
    async (userData: any, thunkApi) => {
        try {
            return await divisionService.divisionTableDataApi(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

// Async Thunk for fetching region graph data
export const divisionGraphData = createAsyncThunk(
    "get/division/Graph",
    async (userData: any, thunkApi) => {
        try {
            return await divisionService.divisionGraphDataApi(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);


export const isLoadingDivisionDashboard = createAsyncThunk("isLoadingDivisionDashboard", async (status: boolean) => {
    return status
})

// Define the regional data reducer
export const divisionDataReducer = createSlice({
    name: "division-unit",
    initialState,
    reducers: {
        resetBusinessUnit: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(isLoadingDivisionDashboard.pending, (state) => {
                // Set loading state
                state.divisionGraphDtoLoading = true;
                state.divisionTableDtoLoading = true
            })
            .addCase(divisionTableData.pending, (state) => {
                // Set loading state

                state.divisionTableDto = null
                state.divisionTableDtoLoading = true
            })
            .addCase(divisionTableData.fulfilled, (state, action) => {
                // Set success state and update divisionTableDto
                state.divisionTableDto = action.payload;
                state.divisionTableDtoLoading = false
            })
            .addCase(divisionTableData.rejected, (state, action) => {
                state.divisionTableDto = null;
                state.divisionTableDtoLoading = isCancelRequest(action?.payload);;

            })
            .addCase(divisionGraphData.pending, (state) => {
                // Set loading state for graph data
                state.divisionGraphDtoLoading = true;
                state.divisionGraphDto = null;
            })
            .addCase(divisionGraphData.fulfilled, (state, action) => {
                // Set success state and update businessUnitGraphDetails
                state.divisionGraphDto = action.payload;
                state.divisionGraphDtoLoading = false;
            })
            .addCase(divisionGraphData.rejected, (state, action) => {
                // Set error state on graph data rejection
                state.divisionGraphDto = null;
                state.divisionGraphDtoLoading = isCancelRequest(action?.payload);;
            })
    }
});

// Export actions and reducer
export const { resetBusinessUnit } = divisionDataReducer.actions;
export default divisionDataReducer.reducer;
