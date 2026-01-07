// Import necessary dependencies and modules
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage, isCancelRequest } from "../../../../utils";
import facilityOverviewService from "./facilityOverviewService";

// Initial state for the facility reducer
 interface FacilityOverviewState {
  isError: any;
  isSuccess: boolean;
  isLoading: boolean;
  message: string,
  facilityReductionGraphDto: any,
  facilityReductionGraphLoading: boolean,
  facilityOverviewDetailLoading: boolean,
  facilityOverviewDetailDto: any,
  facilityComparisonGraphDto: any,
  facilityComparisonGraphLoading: boolean,
  facilityGraphDetailsDto: any,
  facilityGraphDetailsLoading: boolean,
  facilityCarrierComparisonloading: boolean,
  facilityCarrierComparisonData: any,
  facilityInBoundLoading: boolean,
  facilityInBoundDto: any,
  facilityOutBoundLoading: boolean,
  facilityOutBoundDto: any
}

// Define the initial state values for the facility overview reducer
export const initialState: FacilityOverviewState = {
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  facilityReductionGraphDto: null,
  facilityReductionGraphLoading: false,
  facilityOverviewDetailLoading: false,
  facilityOverviewDetailDto: null,
  facilityComparisonGraphDto: null,
  facilityComparisonGraphLoading: false,
  facilityGraphDetailsDto: null,
  facilityGraphDetailsLoading: false,
  facilityCarrierComparisonloading: false,
  facilityCarrierComparisonData: null,
  facilityInBoundLoading: false,
  facilityInBoundDto: null,
  facilityOutBoundLoading: false,
  facilityOutBoundDto: null
}

// Define an asynchronous thunk for fetching facility overview detail data
export const facilityOverviewDetail = createAsyncThunk(
  "get/facility/Overview-Data",
  async (userData: any, thunkApi) => {
    try {
      // Send a POST request to fetch facility overview detail data
      return await facilityOverviewService.facilityOverviewDetailPost(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      // Reject the request with an error message
      return thunkApi.rejectWithValue(message);
    }
  }
);

// Define an asynchronous thunk for fetching facility reduction graph data
export const facilityReductionGraph = createAsyncThunk(
  "get/facility/Reduction-Data",
  async (userData: any, thunkApi) => {
    try {
      // Send a POST request to fetch facility reduction graph data
      return await facilityOverviewService.facilityReductionGraphPost(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      // Reject the request with an error message
      return thunkApi.rejectWithValue(message);
    }
  }
);

// Define an asynchronous thunk for fetching facility comparison graph data
export const facilityComparisonGraph = createAsyncThunk(
  "get/facility/Comparison-Data",
  async (userData: any, thunkApi) => {
    try {
      // Send a GET request to fetch facility comparison graph data
      return await facilityOverviewService.facilityComparisonGraphGet(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      // Reject the request with an error message
      return thunkApi.rejectWithValue(message);
    }
  }
);

// Define an asynchronous thunk for fetching facility in-bound graph data
export const facilityInBoundGraph = createAsyncThunk(
  "get/facility/in/bound",
  async (userData: any, thunkApi) => {
    try {
      // Send a POST request to fetch facility in-bound graph data
      return await facilityOverviewService.facilityInBoundPost(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      // Reject the request with an error message
      return thunkApi.rejectWithValue(message);
    }
  }
);

// Define an asynchronous thunk for fetching facility out-bound graph data
export const facilityOutBoundGraph = createAsyncThunk(
  "get/facility/out/bound",
  async (userData: any, thunkApi) => {
    try {
      // Send a POST request to fetch facility out-bound graph data
      return await facilityOverviewService.facilityOutBoundPost(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      // Reject the request with an error message
      return thunkApi.rejectWithValue(message);
    }
  }
);

// Define an asynchronous thunk for fetching facility carrier comparison data
export const facilityCarrierComparison = createAsyncThunk(
  "get/facility/Carrier-Data",
  async (userData: any, thunkApi) => {
    try {
      // Send a POST request to fetch facility carrier comparison data
      return await facilityOverviewService.facilityCarrierComparisonPost(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      // Reject the request with an error message
      return thunkApi.rejectWithValue(message);
    }
  }
);

// Define an asynchronous thunk for fetching facility graph details data
export const facilityGraphDetailsGraph = createAsyncThunk(
  "get/facility/facility-emmision-Data",
  async (userData: any, thunkApi) => {
    try {
      // Send a POST request to fetch facility graph details data
      return await facilityOverviewService.facilityGraphDetailsGraphPost(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      // Reject the request with an error message
      return thunkApi.rejectWithValue(message);
    }
  }
);

// Define the facility overview data reducer
export const facilityOverviewDataReducer = createSlice({
  name: "facilityOverview",
  initialState,
  reducers: {
    // Reset the facility overview state
    resetFacilityOverview: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(facilityOverviewDetail.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.facilityOverviewDetailDto = null
        state.facilityOverviewDetailLoading = true
      })
      .addCase(facilityOverviewDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.facilityOverviewDetailDto = action.payload;
        state.facilityOverviewDetailLoading = false
      })
      .addCase(facilityOverviewDetail.rejected, (state, action) => {
        state.isError = action.payload;
        state.isLoading = true;
        state.isSuccess = false;
        state.facilityOverviewDetailLoading = isCancelRequest(action?.payload)
      })
      .addCase(facilityReductionGraph.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.facilityReductionGraphDto = null;
        state.facilityReductionGraphLoading = true
      })
      .addCase(facilityReductionGraph.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.facilityReductionGraphDto = action.payload;
        state.facilityReductionGraphLoading = false
      })
      .addCase(facilityReductionGraph.rejected, (state, action) => {
        state.isLoading = true;
        state.isError = action.payload;
        state.isSuccess = false;
        state.facilityReductionGraphLoading = isCancelRequest(action?.payload)
      })
      .addCase(facilityComparisonGraph.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.facilityComparisonGraphLoading = true
        state.facilityComparisonGraphDto = null;
      })
      .addCase(facilityComparisonGraph.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.facilityComparisonGraphDto = action.payload;
        state.facilityComparisonGraphLoading = false
      })
      .addCase(facilityComparisonGraph.rejected, (state, action) => {
        state.isLoading = true;
        state.isError = action.payload;
        state.isSuccess = false;
        state.facilityComparisonGraphLoading = isCancelRequest(action?.payload)
      })
      .addCase(facilityInBoundGraph.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.facilityInBoundLoading = true
        state.facilityInBoundDto = null;
      })
      .addCase(facilityInBoundGraph.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.facilityInBoundDto = action.payload;
        state.facilityInBoundLoading = false
      })
      .addCase(facilityInBoundGraph.rejected, (state, action) => {
        state.isLoading = true;
        state.isError = action.payload;
        state.isSuccess = false;
        state.facilityInBoundLoading = isCancelRequest(action?.payload)
      })
      .addCase(facilityOutBoundGraph.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.facilityOutBoundLoading = true
        state.facilityOutBoundDto = null;
      })
      .addCase(facilityOutBoundGraph.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.facilityOutBoundDto = action.payload;
        state.facilityOutBoundLoading = false
      })
      .addCase(facilityOutBoundGraph.rejected, (state, action) => {
        state.isLoading = true;
        state.isError = action.payload;
        state.isSuccess = false;
        state.facilityOutBoundLoading = isCancelRequest(action?.payload)
      })
      .addCase(facilityCarrierComparison.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.facilityCarrierComparisonloading = true
        state.facilityCarrierComparisonData = null;
      })
      .addCase(facilityCarrierComparison.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.facilityCarrierComparisonData = action.payload;
        state.facilityCarrierComparisonloading = false
      })
      .addCase(facilityCarrierComparison.rejected, (state, action) => {
        state.isLoading = true;
        state.isError = action.payload;
        state.isSuccess = false;
        state.facilityCarrierComparisonloading = isCancelRequest(action?.payload)
      })
      .addCase(facilityGraphDetailsGraph.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.facilityGraphDetailsLoading = true
        state.facilityGraphDetailsDto = null;
      })
      .addCase(facilityGraphDetailsGraph.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.facilityGraphDetailsDto = action.payload;
        state.facilityGraphDetailsLoading = false
      })
      .addCase(facilityGraphDetailsGraph.rejected, (state, action) => {
        state.isLoading = true;
        state.isError = action.payload;
        state.isSuccess = false;
        state.facilityGraphDetailsLoading = isCancelRequest(action?.payload)
      });
  }
})

// Define the action for resetting the facility overview state
export const { resetFacilityOverview } = facilityOverviewDataReducer.actions;

// Export the facility overview reducer
export default facilityOverviewDataReducer.reducer;
