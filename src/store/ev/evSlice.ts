// Import necessary dependencies and modules
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage, isCancelRequest } from "../../utils";
import evService from "./evService";
import { isLoadingDecarbDashboard } from "../scopeThree/track/decarb/decarbSlice";
// Initial state for the facility reducer
interface EVState {
    isError: any;
    isSuccess: boolean;
    isLoading: boolean;
    message: string,
    evLocationDto: any,
    evLocationLoading: boolean,
    matrixDataEV: any,
    matrixDataEVLoading: boolean,
    evNetworkLanesData: any,
    evNetworkLanesLoading: boolean,
    truckLaneData: any,
    truckLaneDataLoading: boolean,
    evShipmentLaneByDate: any,
    evShipmentLaneByDateLoading: boolean,
    evShipmentLane: any,
    evShipmentLaneLoading: boolean
}

// Define the initial state values for the facility overview reducer
const initialState: EVState = {
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    evLocationDto: null,
    evLocationLoading: false,
    matrixDataEV: null,
    matrixDataEVLoading: false,
    evNetworkLanesData: null,
    evNetworkLanesLoading: false,
    truckLaneData: null,
    truckLaneDataLoading: false,
    evShipmentLaneByDate: null,
    evShipmentLaneByDateLoading: false,
    evShipmentLane: null,
    evShipmentLaneLoading: false
}

// Define an asynchronous thunk for fetching facility overview detail data
export const evLocation = createAsyncThunk(
    "get/ev/location",
    async (_, thunkApi) => {
        try {
            // Send a POST request to fetch facility overview detail data
            return await evService.getEvLocations();
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            // Reject the request with an error message
            return thunkApi.rejectWithValue(message);
        }
    }
);

// Define an asynchronous thunk for fetching facility table data
export const getMatrixDataEV = createAsyncThunk(
    "get/bev/data",
    async (userData: any, thunkApi) => {
        try {
            return await evService.getMatrixDataEVApi(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const getEVNetworkLanes = createAsyncThunk(
    "get/ev/lanes",
    async (data: any, thunkApi: any) => {
        try {
            thunkApi.dispatch(isLoadingDecarbDashboard(true))
            return await evService.getEvNetworkLanesApi(data);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const getTruckLaneData = createAsyncThunk(
    "get/ev/truck/lanes",
    async (data: any, thunkApi: any) => {
        try {
            return await evService.getTruckLaneDataApi(data);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);


export const getEVShipmentLanes = createAsyncThunk(
    "get/ev/shipment/lanes",
    async (data: any, thunkApi: any) => {
        try {
            return await evService.getEVShipmentLanesApi(data);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);


export const getEVShipmentsByDate = createAsyncThunk(
    "get/ev/shipment/by/date",
    async (data: any, thunkApi: any) => {
        try {
            return await evService.getEVShipmentsByDateApi(data);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const isLoadingEVNetworkDashboard = createAsyncThunk("isLoadingEVNetworkDashboard", async (status: boolean) => {
    return status
})


// Define the facility overview data reducer
export const evDataReducer = createSlice({
    name: "ev",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(evLocation.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.evLocationDto = null;
                state.evLocationLoading = true;
            })
            .addCase(isLoadingEVNetworkDashboard.pending, (state) => {
                // Set loading state
                state.evNetworkLanesLoading = true;
            })
            .addCase(evLocation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.evLocationDto = action.payload;
                state.evLocationLoading = false;
            })
            .addCase(evLocation.rejected, (state, action) => {
                state.isError = action.payload;
                state.isLoading = true;
                state.isSuccess = false;
                state.evLocationLoading = isCancelRequest(action?.payload);
            })
            .addCase(getMatrixDataEV.pending, (state) => {
                state.matrixDataEV = null
                state.matrixDataEVLoading = true
            })
            .addCase(getMatrixDataEV.fulfilled, (state, action) => {
                state.matrixDataEV = action.payload;
                state.matrixDataEVLoading = false
            })
            .addCase(getMatrixDataEV.rejected, (state, action) => {
                state.matrixDataEV = null
                state.matrixDataEVLoading = isCancelRequest(action?.payload)
            })

            .addCase(getTruckLaneData.pending, (state) => {
                state.truckLaneData = null
                state.truckLaneDataLoading = true
            })
            .addCase(getTruckLaneData.fulfilled, (state, action) => {
                state.truckLaneData = action.payload;
                state.truckLaneDataLoading = false
            })
            .addCase(getTruckLaneData.rejected, (state, action) => {
                state.truckLaneData = null
                state.truckLaneDataLoading = isCancelRequest(action?.payload)
            })

            .addCase(getEVShipmentLanes.pending, (state) => {
                state.evShipmentLane = null
                state.evShipmentLaneLoading = true
            })
            .addCase(getEVShipmentLanes.fulfilled, (state, action) => {
                state.evShipmentLane = action.payload;
                state.evShipmentLaneLoading = false
            })
            .addCase(getEVShipmentLanes.rejected, (state, action) => {
                state.evShipmentLane = null
                state.evShipmentLaneLoading = isCancelRequest(action?.payload)
            })

            .addCase(getEVShipmentsByDate.pending, (state) => {
                state.evShipmentLaneByDate = null
                state.evShipmentLaneByDateLoading = true
            })
            .addCase(getEVShipmentsByDate.fulfilled, (state, action) => {
                state.evShipmentLaneByDate = action.payload;
                state.evShipmentLaneByDateLoading = false
            })
            .addCase(getEVShipmentsByDate.rejected, (state, action) => {
                state.evShipmentLaneByDate = null
                state.evShipmentLaneByDateLoading = isCancelRequest(action?.payload)
            })
            .addCase(getEVNetworkLanes.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.evNetworkLanesData = null;
                state.evNetworkLanesLoading = true;
            })
            .addCase(getEVNetworkLanes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.evNetworkLanesData = action?.payload;
                state.evNetworkLanesLoading = false;
            })
            .addCase(getEVNetworkLanes.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.evNetworkLanesData = null;
                state.evNetworkLanesLoading = isCancelRequest(action?.payload);
            });
    }
});


// Export the facility overview reducer
export default evDataReducer.reducer;
