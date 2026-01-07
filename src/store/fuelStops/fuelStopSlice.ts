import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage, isCancelRequest } from "../../utils";
import { FuelStopState } from "./fuelStopInterface";
import fuelStopService from "./fuelStopService";

/**
 * Redux Slice for managing fuel stop data
 */

// Initial state
export const initialState: FuelStopState = {
    isLoadingFuelStopProvider: false,
    fuelProviderListData: null,
    isLoadingFuelStopData: false,
    fuelListData: null
}

// Async Thunk for fetching fuel stop provider data
export const getFuelStopProviderList = createAsyncThunk(
    "get/fuel/stop/provider/list",
    async (_, thunkApi) => {
        try {
            return await fuelStopService.fuelStopProviderListApi();
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const getFuelStopsList = createAsyncThunk(
    "get/fuel/stop/list",
    async (userData:any, thunkApi) => {
        try {
            return await fuelStopService.fuelStopListApi(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

// Define the fuel stop data reducer
export const fuelStopDataReducer = createSlice({
    name: "fuel-stops",
    initialState,
    reducers: {
        resetFuelStopsData: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFuelStopProviderList.pending, (state) => {
                state.isLoadingFuelStopProvider = true;
                state.fuelProviderListData = null
            })
            .addCase(getFuelStopProviderList.fulfilled, (state, action) => {
                state.isLoadingFuelStopProvider = false;
                state.fuelProviderListData = action.payload;
            })
            .addCase(getFuelStopProviderList.rejected, (state, action) => {
                state.isLoadingFuelStopProvider = false;
                state.fuelProviderListData = null
            })
            .addCase(getFuelStopsList.pending, (state) => {
                state.isLoadingFuelStopData = true;
            })
            .addCase(getFuelStopsList.fulfilled, (state, action) => {
                state.isLoadingFuelStopData = false;
                state.fuelListData = action.payload;
            })
            .addCase(getFuelStopsList.rejected, (state, action) => {
                state.isLoadingFuelStopData = isCancelRequest(action?.payload);
                state.fuelListData = null
            })

    }
});

// Export actions and reducer
export const { resetFuelStopsData } = fuelStopDataReducer.actions;
export default fuelStopDataReducer.reducer;
