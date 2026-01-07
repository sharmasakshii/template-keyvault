import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import trailerService from "./trailerService";
import { getErrorMessage } from "../../utils";
import { TrailerState } from "./trailerInterface";

/**
 * Redux Slice for managing regional data
 */

// Define the shape of the state

// Initial state
export const initialState: TrailerState = {
    trailerTableDto: null,
    trailerTableDtoLoading: false,
    trailerGraphDto: null,
    trailerGraphDtoLoading: false,
    trailerCarrierEmissionTableDto: null,
    trailerCarrierEmissionTableDtoLoading: false,
    trailerOverviewDtoLoading: false,
    trailerOverviewDto: null,
    trailerLaneBreakdown: null,
    trailerLaneBreakdownLoading: false,
    vehicleGraphDto: null,
    vehicleGraphDtoLoading: false
}

// Async Thunk for fetching trailer table data
export const trailerTableData = createAsyncThunk(
    "get/trailer/table-Data",
    async (userData: any, thunkApi) => {
        try {
            return await trailerService.trailerTableApi(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

// Async Thunk for fetching trailer graph data
export const trailerGraphData = createAsyncThunk(
    "get/trailer/Graph",
    async (userData: any, thunkApi) => {
        try {
            return await trailerService.trailerGraphApi(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const vehicleGraphData = createAsyncThunk(
    "get/vehicle/Graph",
    async (userData: any, thunkApi) => {
        try {
            return await trailerService.trailerGraphApi(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

// Async Thunk for fetching trailer graph data
export const trailerCarrierEmissionGraph = createAsyncThunk(
    "get/trailer/emission/carrier/Graph",
    async (userData: any, thunkApi) => {
        try {
            return await trailerService.trailerCarrierEmissionGraphApi(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);


// Async Thunk for fetching trailer graph data
export const getTrailerOverviewDto = createAsyncThunk(
    "get/trailer/overview/emission/carrier/Graph",
    async (userData: any, thunkApi) => {
        try {
            return await trailerService.getTrailerOverviewDtoApi(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);


// Async Thunk for fetching trailer graph data
export const getTrailerLaneBreakdownByEmissionsIntensity = createAsyncThunk(
    "get/trailer/lane/breakdown/emission/carrier/Graph",
    async (userData: any, thunkApi) => {
        try {
            return await trailerService.getTrailerLaneBreakdownByEmissionsIntensityApi(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const isLoadingTrailerDashboard = createAsyncThunk("isLoadingTrailerDashboard", async (status: boolean) => {
    return status
})

// Define the regional data reducer
export const trailerDataReducer = createSlice({
    name: "region-data",
    initialState,
    reducers: {
        resetTrailer: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(isLoadingTrailerDashboard.pending, (state) => {
                state.trailerTableDtoLoading = true;
                state.trailerGraphDtoLoading = true
            })
            .addCase(trailerTableData.pending, (state) => {
                state.trailerTableDtoLoading = true;
                state.trailerTableDto = null
            })
            .addCase(trailerTableData.fulfilled, (state, action) => {
                state.trailerTableDtoLoading = false;
                state.trailerTableDto = action.payload;
            })
            .addCase(trailerTableData.rejected, (state, action) => {
                state.trailerTableDtoLoading = false;
                state.trailerTableDto = null
            })
            .addCase(trailerGraphData.pending, (state: any) => {
                state.trailerGraphDtoLoading = true;
                state.trailerGraphDto = null;
            })
            .addCase(trailerGraphData.fulfilled, (state, action) => {
                state.trailerGraphDto = action.payload;
                state.trailerGraphDtoLoading = false;
            })
            .addCase(trailerGraphData.rejected, (state, action) => {
                state.trailerGraphDto = null;
                state.trailerGraphDtoLoading = false;
            })
            .addCase(vehicleGraphData.pending, (state: any) => {
                state.vehicleGraphDtoLoading = true;
                state.vehicleGraphDto = null;
            })
            .addCase(vehicleGraphData.fulfilled, (state, action) => {
                state.vehicleGraphDto = action.payload;
                state.vehicleGraphDtoLoading = false;
            })
            .addCase(vehicleGraphData.rejected, (state, action) => {
                state.vehicleGraphDto = null;
                state.vehicleGraphDtoLoading = false;
            })
            .addCase(trailerCarrierEmissionGraph.pending, (state: any) => {
                state.trailerCarrierEmissionTableDtoLoading = true;
                state.trailerCarrierEmissionTableDto = null;
            })
            .addCase(trailerCarrierEmissionGraph.fulfilled, (state, action) => {

                state.trailerCarrierEmissionTableDto = action.payload;
                state.trailerCarrierEmissionTableDtoLoading = false;
            })
            .addCase(trailerCarrierEmissionGraph.rejected, (state, action) => {
                state.trailerCarrierEmissionTableDto = null;
                state.trailerCarrierEmissionTableDtoLoading = false;
            })

            .addCase(getTrailerOverviewDto.pending, (state: any) => {
                state.trailerOverviewDtoLoading = true;
                state.trailerOverviewDto = null;
            })
            .addCase(getTrailerOverviewDto.fulfilled, (state, action) => {

                state.trailerOverviewDto = action.payload;
                state.trailerOverviewDtoLoading = false;
            })
            .addCase(getTrailerOverviewDto.rejected, (state, action) => {
                state.trailerOverviewDto = null;
                state.trailerOverviewDtoLoading = false;
            })
            .addCase(getTrailerLaneBreakdownByEmissionsIntensity.pending, (state: any) => {
                state.trailerLaneBreakdownLoading = true;
                state.trailerLaneBreakdown = null;
            })
            .addCase(getTrailerLaneBreakdownByEmissionsIntensity.fulfilled, (state, action) => {

                state.trailerLaneBreakdown = action.payload;
                state.trailerLaneBreakdownLoading = false;
            })
            .addCase(getTrailerLaneBreakdownByEmissionsIntensity.rejected, (state, action) => {
                state.trailerLaneBreakdown = null;
                state.trailerLaneBreakdownLoading = false;
            });


    }
});

// Export actions and reducer
export const { resetTrailer } = trailerDataReducer.actions;
export default trailerDataReducer.reducer;
