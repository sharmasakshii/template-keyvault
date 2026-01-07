import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fuelService from "./fuelService";
import { getErrorMessage } from "../../utils";
import { FuelState } from "./fuelInterface";

/**
 * Redux Slice for managing regional data
 */

// Define the shape of the state

// Initial state
export const initialState: FuelState = {
    fuelTableDto: null,
    fuelTableDtoLoading: false,
    fuelGraphDto: null,
    fuelGraphDtoLoading: false,
    fuelCarrierEmissionTableDto: null,
    fuelCarrierEmissionTableDtoLoading: false,
    fuelOverviewDtoLoading: false,
    fuelOverviewDto: null,
    fuelLaneBreakdown: null,
    fuelLaneBreakdownLoading: false,
    vehicleGraphDto: null,
    vehicleGraphDtoLoading: false
}

// Async Thunk for fetching fuel table data
export const fuelTableData = createAsyncThunk(
    "get/fuel/table-Data",
    async (userData: any, thunkApi) => {
        try {
            return await fuelService.fuelTableApi(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

// Async Thunk for fetching fuel graph data
export const fuelGraphData = createAsyncThunk(
    "get/fuel/Graph",
    async (userData: any, thunkApi) => {
        try {
            return await fuelService.fuelGraphApi(userData);
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
            return await fuelService.fuelGraphApi(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

// Async Thunk for fetching fuel graph data
export const fuelCarrierEmissionGraph = createAsyncThunk(
    "get/fuel/emission/carrier/Graph",
    async (userData: any, thunkApi) => {
        try {
            return await fuelService.fuelCarrierEmissionGraphApi(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);


// Async Thunk for fetching fuel graph data
export const getFuelOverviewDto = createAsyncThunk(
    "get/fuel/overview/emission/carrier/Graph",
    async (userData: any, thunkApi) => {
        try {
            return await fuelService.getFuelOverviewDtoApi(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);


// Async Thunk for fetching fuel graph data
export const getFuelLaneBreakdownByEmissionsIntensity = createAsyncThunk(
    "get/fuel/lane/breakdown/emission/carrier/Graph",
    async (userData: any, thunkApi) => {
        try {
            return await fuelService.getFuelLaneBreakdownByEmissionsIntensityApi(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const isLoadingFuelDashboard = createAsyncThunk("isLoadingFuelDashboard", async (status: boolean) => {
    return status
})



// Define the regional data reducer
export const fuelDataReducer = createSlice({
    name: "region-data",
    initialState,
    reducers: {
        resetFuel: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(isLoadingFuelDashboard.pending, (state) => {
                state.fuelTableDtoLoading = true;
                state.fuelGraphDtoLoading = true
            })
            .addCase(fuelTableData.pending, (state) => {
                state.fuelTableDtoLoading = true;
                state.fuelTableDto = null
            })
            .addCase(fuelTableData.fulfilled, (state, action) => {
                state.fuelTableDtoLoading = false;
                state.fuelTableDto = action.payload;
            })
            .addCase(fuelTableData.rejected, (state, action) => {
                state.fuelTableDtoLoading = false;
                state.fuelTableDto = null
            })
            .addCase(fuelGraphData.pending, (state: any) => {
                state.fuelGraphDtoLoading = true;
                state.fuelGraphDto = null;
            })
            .addCase(fuelGraphData.fulfilled, (state, action) => {
                state.fuelGraphDto = action.payload;
                state.fuelGraphDtoLoading = false;
            })
            .addCase(fuelGraphData.rejected, (state, action) => {
                state.fuelGraphDto = null;
                state.fuelGraphDtoLoading = false;
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
            .addCase(fuelCarrierEmissionGraph.pending, (state: any) => {
                state.fuelCarrierEmissionTableDtoLoading = true;
                state.fuelCarrierEmissionTableDto = null;
            })
            .addCase(fuelCarrierEmissionGraph.fulfilled, (state, action) => {

                state.fuelCarrierEmissionTableDto = action.payload;
                state.fuelCarrierEmissionTableDtoLoading = false;
            })
            .addCase(fuelCarrierEmissionGraph.rejected, (state, action) => {
                state.fuelCarrierEmissionTableDto = null;
                state.fuelCarrierEmissionTableDtoLoading = false;
            })

            .addCase(getFuelOverviewDto.pending, (state: any) => {
                state.fuelOverviewDtoLoading = true;
                state.fuelOverviewDto = null;
            })
            .addCase(getFuelOverviewDto.fulfilled, (state, action) => {

                state.fuelOverviewDto = action.payload;
                state.fuelOverviewDtoLoading = false;
            })
            .addCase(getFuelOverviewDto.rejected, (state, action) => {
                state.fuelOverviewDto = null;
                state.fuelOverviewDtoLoading = false;
            })
            .addCase(getFuelLaneBreakdownByEmissionsIntensity.pending, (state: any) => {
                state.fuelLaneBreakdownLoading = true;
                state.fuelLaneBreakdown = null;
            })
            .addCase(getFuelLaneBreakdownByEmissionsIntensity.fulfilled, (state, action) => {

                state.fuelLaneBreakdown = action.payload;
                state.fuelLaneBreakdownLoading = false;
            })
            .addCase(getFuelLaneBreakdownByEmissionsIntensity.rejected, (state, action) => {
                state.fuelLaneBreakdown = null;
                state.fuelLaneBreakdownLoading = false;
            });


    }
});

// Export actions and reducer
export const { resetFuel } = fuelDataReducer.actions;
export default fuelDataReducer.reducer;
