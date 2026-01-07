import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import intermodalReportService from "./intermodalReportService";
import { getErrorMessage, isCancelRequest } from "../../utils";
import { IntermodalReportState } from "./intermodalReportInterface";

/**
 * Redux Slice for managing bid planning data
 */

// Define the shape of the state

// Initial state
export const initialState: IntermodalReportState = {
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    intermodalReportMatrixData: null,
    isLoadingIntermodalReportMatrixData: false,
    topLanesByShipmentData: null,
    isLoadingTopLanesByShipmentData: false,
    intermodalFilterData: null,
    isLoadingIntermodalFilterData: false,
    getViewLanesData: null,
    isLoadingViewLanesData: false,
    getLaneByShipmentMilesGraph: null,
    isLoadingLaneByShipmentMilesGraph: false,
    isLoadingIntermodalMaxDate: false,
    intermodalMaxDateGraph: null,
}

// matrix data
export const getIntermodalReportMatirxData = createAsyncThunk("get/intermodal/report/matrix/data", async (payload: any, thunkApi) => {
    try {
        return await intermodalReportService.getIntermodalReportMatrixDataApi(payload)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});

// filter data
export const getIntermodalReportFilterData = createAsyncThunk("get/intermodal/report/filter/data", async (payload: any, thunkApi) => {
    try {
        return await intermodalReportService.getIntermodalReportFilterDataApi(payload)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});

// top lanes by shipment
export const getTopLanesShipmentData = createAsyncThunk("get/top/lanes/shipment/data", async (payload: any, thunkApi) => {
    try {
        return await intermodalReportService.getTopLanesShipmentDataApi(payload)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});

// View lanes
export const getViewLanesTableData = createAsyncThunk("get/view/lanes/table/data", async (payload: any, thunkApi) => {
    try {
        return await intermodalReportService.getViewLaneDetailApi(payload)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});

// Shipment Miles Graph
export const getLaneByShipmentMiles = createAsyncThunk("get/lane/by/shipment/miles", async (payload: any, thunkApi) => {
    try {
        return await intermodalReportService.getLaneByShipmentMilesApi(payload)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});

export const getIntermodalMaxDate = createAsyncThunk("get/intermodal/max/date", async (payload: any, thunkApi) => {
    try {
        return await intermodalReportService.getIntermodalMaxDateApi(payload)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});
// 
export const intermodalReportDataReducer = createSlice({
    name: "intermodal-report",
    initialState,
    reducers: {
        resetIntermodalReport: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getIntermodalReportMatirxData.pending, (state) => {
                state.isLoadingIntermodalReportMatrixData = true
                state.intermodalReportMatrixData = null
            })
            .addCase(getIntermodalReportMatirxData.fulfilled, (state, action) => {
                state.isLoadingIntermodalReportMatrixData = false
                state.intermodalReportMatrixData = action.payload
            })
            .addCase(getIntermodalReportMatirxData.rejected, (state, action) => {
                state.isLoadingIntermodalReportMatrixData = isCancelRequest(action?.payload)
                state.intermodalReportMatrixData = null
            })
            // Filter data
            .addCase(getIntermodalReportFilterData.pending, (state) => {
                state.isLoadingIntermodalFilterData = true
                state.intermodalFilterData = null
            })
            .addCase(getIntermodalReportFilterData.fulfilled, (state, action) => {
                state.isLoadingIntermodalFilterData = false
                state.intermodalFilterData = action.payload
            })
            .addCase(getIntermodalReportFilterData.rejected, (state, action) => {
                state.isLoadingIntermodalFilterData = isCancelRequest(action?.payload)
                state.intermodalFilterData = null
            })

            // Lanes by shipment data
            .addCase(getTopLanesShipmentData.pending, (state) => {
                state.isLoadingTopLanesByShipmentData = true
                state.topLanesByShipmentData = null
            })
            .addCase(getTopLanesShipmentData.fulfilled, (state, action) => {
                state.isLoadingTopLanesByShipmentData = false
                state.topLanesByShipmentData = action.payload
            })
            .addCase(getTopLanesShipmentData.rejected, (state, action) => {
                state.isLoadingTopLanesByShipmentData = isCancelRequest(action?.payload)
                state.topLanesByShipmentData = null
            })
            // View lanes data
            .addCase(getViewLanesTableData.pending, (state) => {
                state.isLoadingViewLanesData = true
                state.getViewLanesData = null
            })
            .addCase(getViewLanesTableData.fulfilled, (state, action) => {
                state.isLoadingViewLanesData = false
                state.getViewLanesData = action.payload
            })
            .addCase(getViewLanesTableData.rejected, (state, action) => {
                state.isLoadingViewLanesData = isCancelRequest(action?.payload)
                state.getViewLanesData = null
            })
            // Graph Api Data
            .addCase(getLaneByShipmentMiles.pending, (state) => {
                state.isLoadingLaneByShipmentMilesGraph = true
                state.getLaneByShipmentMilesGraph = null
            })
            .addCase(getLaneByShipmentMiles.fulfilled, (state, action) => {
                state.isLoadingLaneByShipmentMilesGraph = false
                state.getLaneByShipmentMilesGraph = action.payload
            })
            .addCase(getLaneByShipmentMiles.rejected, (state, action) => {
                state.isLoadingLaneByShipmentMilesGraph = isCancelRequest(action?.payload)
                state.getLaneByShipmentMilesGraph = null
            })

            .addCase(getIntermodalMaxDate.pending, (state) => {
                state.isLoadingIntermodalMaxDate = true
                state.isLoadingIntermodalReportMatrixData = true
                state.isLoadingLaneByShipmentMilesGraph = true

                state.intermodalMaxDateGraph = null
            })
            .addCase(getIntermodalMaxDate.fulfilled, (state, action) => {
                state.isLoadingIntermodalMaxDate = false
                state.isLoadingIntermodalReportMatrixData = true
                state.isLoadingLaneByShipmentMilesGraph = true
                state.intermodalMaxDateGraph = action.payload
            })
            .addCase(getIntermodalMaxDate.rejected, (state, action) => {
                state.isLoadingIntermodalMaxDate = isCancelRequest(action?.payload)
                state.isLoadingIntermodalReportMatrixData = isCancelRequest(action?.payload)
                state.isLoadingLaneByShipmentMilesGraph = isCancelRequest(action?.payload)

                state.intermodalMaxDateGraph = null
            })
    }
});

// Export actions and reducer
export const { resetIntermodalReport } = intermodalReportDataReducer.actions;
export default intermodalReportDataReducer.reducer;
