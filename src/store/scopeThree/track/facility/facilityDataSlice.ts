// Import necessary dependencies and modules
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "utils";
import facilityService from "./facilityService";
import { FacilityState } from "./facilityDataInterface";

// Define the initial state for the facility reducer

export const initialState: FacilityState = {
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  facilityTableDetails: null,
  facilityGraphDetails: null,
  facilityGraphDetailLoading: false,
  facilityTableDetailLoading: false,
  facilityReductionGraphDto: null,
  facilityReductionGraphLoading: false,
};

// Define an asynchronous thunk for fetching facility graph data
export const facilityGraphData = createAsyncThunk(
  "get/facility/Graph",
  async (userData: any, thunkApi) => {
    try {
      return await facilityService.facilityGraphPost(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

// Define an asynchronous thunk for fetching facility table data
export const facilityTableData = createAsyncThunk(
  "get/facility/table-Data",
  async (userData: any, thunkApi) => {
    try {
      return await facilityService.facilityTableDataGet(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const isLoadingFacilityDashboard = createAsyncThunk("isLoadingFacilityDashboard", async (status: boolean) => {
  return status
})

// Define the facilityDataReducer slice
export const facilityDataReducer = createSlice({
  name: "facility",
  initialState,
  reducers: {
    resetFacility: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(isLoadingFacilityDashboard.fulfilled, (state, action) => {
        // Handle successful fulfillment of facility table data
        state.facilityTableDetailLoading = true;
        state.facilityGraphDetailLoading = true;

      })
      .addCase(facilityTableData.pending, (state) => {
        // Handle pending action for facility table data
        state.isLoading = true;
        state.isSuccess = false;
        state.facilityTableDetails = null;
        state.facilityTableDetailLoading = true;
      })
      .addCase(facilityTableData.fulfilled, (state, action) => {
        // Handle successful fulfillment of facility table data
        state.isLoading = false;
        state.isSuccess = true;
        state.facilityTableDetails = action.payload;
        state.facilityTableDetailLoading = false;
      })
      .addCase(facilityTableData.rejected, (state, action) => {
        // Handle rejected facility table data request
        state.isLoading = true;
        state.isError = action.payload;
        state.isSuccess = false;
        state.facilityTableDetailLoading = false;
        state.facilityTableDetails = null;
      })
      .addCase(facilityGraphData.pending, (state) => {
        // Handle pending action for facility graph data
        state.isLoading = true;
        state.isSuccess = false;
        state.facilityGraphDetailLoading = true;
      })
      .addCase(facilityGraphData.fulfilled, (state, action) => {
        // Handle successful fulfillment of facility graph data
        state.isLoading = false;
        state.isSuccess = true;
        state.facilityGraphDetails = action.payload;
        state.facilityGraphDetailLoading = false;
      })
      .addCase(facilityGraphData.rejected, (state, action) => {
        // Handle rejected facility graph data request
        state.isLoading = true;
        state.isError = action.payload;
        state.isSuccess = false;
        state.facilityGraphDetailLoading = false;
      });
  },
});

// Export actions and the reducer from the facilityDataReducer slice
export const { resetFacility } = facilityDataReducer.actions;
export default facilityDataReducer.reducer;
