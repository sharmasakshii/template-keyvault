import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DashRegionInterface } from "./dashRegionInterface";

// Define the shape of the state

// Initial state
export const initialState: DashRegionInterface = {
    isRegion: false,
    isLane: false,
    isFacility: false,
    isCarrier: false,
    isBusinessUnit: false,
    isFuel: false,
    isVehicle: false
};

// Async Thunks for changing region, lane, facility, and carrier
export const changeRegion = createAsyncThunk("get/dash/region", (data: boolean) => {
        return data;
    }
);

export const changeLane = createAsyncThunk("get/dash/lane",(data: boolean) => {
        return data;
    }
);

export const changeFacility = createAsyncThunk("get/dash/facility",(data: boolean) => {
        return data;
    }
);
export const changeBusinessUnit = createAsyncThunk("get/dash/businessUnit",(data: boolean) => {
    return data;
}
);

export const changeCarrier = createAsyncThunk("get/dash/carrier",(data: boolean) => {
        return data;
    }
);

export const changeFuel = createAsyncThunk("get/dash/fuel",(data: boolean) => {
    return data;
}
);

export const changeVehicle = createAsyncThunk("get/dash/vehicle",(data: boolean) => {
    return data;
}
);

// Define the dashboard region reducer
export const dashRegionReducer = createSlice({
    name: "dashboard-Page",
    initialState,
    reducers: {
        // Reducer to clear data
        resetRegionDash: () => initialState,
    },
    extraReducers: (builder) => {
        // Handle fulfilled actions for changing region, lane, facility, and carrier
        builder
            .addCase(changeRegion.fulfilled, (state, action) => {
                state.isRegion = action.payload;
            })
            .addCase(changeLane.fulfilled, (state, action) => {
                state.isLane = action.payload;
            })
            .addCase(changeFacility.fulfilled, (state, action) => {
                state.isFacility = action.payload;
            })
            .addCase(changeCarrier.fulfilled, (state, action) => {
                state.isCarrier = action.payload;
            })
            .addCase(changeBusinessUnit.fulfilled, (state, action) => {
                state.isBusinessUnit = action.payload;
            })
            .addCase(changeFuel.fulfilled, (state, action) => {
                state.isFuel = action.payload;
            })  
            .addCase(changeVehicle.fulfilled, (state, action) => {
                state.isVehicle = action.payload;
            });
    },
});

// Export the action and reducer
export const { resetRegionDash } = dashRegionReducer.actions;
export default dashRegionReducer.reducer;
