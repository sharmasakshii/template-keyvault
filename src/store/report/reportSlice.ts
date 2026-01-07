import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reportViewService from "./reportService";
import { getErrorMessage, isCancelRequest } from "../../utils";
import { ReportViewState } from "./reportInterface";

/**
 * Redux Slice for managing report data
 */

// Define the shape of the state

// Initial state
export const initialState: ReportViewState = {
    reportKeyMatrixData: null,
    isLoadingKeyMatrix: false,
    reportLaneData: null,
    isLoadingReportLaneData: false
}

// Async Thunk for fetching report data
export const reportKeyMatrix = createAsyncThunk(
    "get/report/key/matrix",
    async (userData: any, thunkApi) => {
        try {
            return await reportViewService.getReportKeyMatrixApi(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const getReportLanesData = createAsyncThunk(
    "get/report/lanes/data",
    async (userData: any, thunkApi) => {
        try {
            return await reportViewService.getReportLanesApi(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const isLoadingReportDashboard = createAsyncThunk("isLoadingReportDashboard", async (status: boolean) => {
    return status
})

// Define the report data reducer
export const reportDataReducer = createSlice({
    name: "report-unit",
    initialState,
    reducers: {
        resetReportUnit: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(reportKeyMatrix.pending, (state) => {
                state.reportKeyMatrixData = null
                state.isLoadingKeyMatrix = true
            })
            .addCase(reportKeyMatrix.fulfilled, (state, action) => {
                state.reportKeyMatrixData = action.payload;
                state.isLoadingKeyMatrix = false
            })
            .addCase(reportKeyMatrix.rejected, (state, action) => {
                state.reportKeyMatrixData = null;
                state.isLoadingKeyMatrix = isCancelRequest(action?.payload);;
            })
            .addCase(getReportLanesData.pending, (state) => {
                state.reportLaneData = null
                state.isLoadingReportLaneData = true
            })
            .addCase(getReportLanesData.fulfilled, (state, action) => {
                state.reportLaneData = action.payload;
                state.isLoadingReportLaneData = false
            })
            .addCase(getReportLanesData.rejected, (state, action) => {
                state.reportLaneData = null;
                state.isLoadingReportLaneData = isCancelRequest(action?.payload);;
            })
    }
});

// Export actions and reducer
export const { resetReportUnit } = reportDataReducer.actions;
export default reportDataReducer.reducer;
