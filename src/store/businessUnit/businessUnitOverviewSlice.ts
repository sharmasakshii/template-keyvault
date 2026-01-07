import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import businessUnitService from "./businessUnitService";
import { getErrorMessage, isCancelRequest } from "../../utils";
import { BusinessUnitOverviewState } from "./businessUnitInterface";

// Define the initial state for the business overview
export const initialState: BusinessUnitOverviewState = {
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  businessUnitLevelGlideData: null,
  isLoadingBusinessUnitLevelGlidePath: false,
  businessUnitOverviewDetailData: null,
  businessUnitOverviewDetailLoading: false,
  businessLaneGraphDetails: null,
  businessLaneGraphDetailsLoading: false,
  businessCarrierComparisonLoading: false,
  businessCarrierComparisonData: null,
  businessUnitRegionGraphDetails: null,
  businessUnitRegionGraphDetailsLoading: false
};

// Async Thunk for posting business level glide path details
export const businessUnitGlidePath = createAsyncThunk("post/glide/busness/unit/details", async (userData: any, thunkApi) => {
  try {
    // Call common service to post business level glide path details
    return await businessUnitService.businessUnitGlidePath(userData);
  }
  catch (error: any) {
    // Handle errors and reject with error message
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message)
  }
})


// Async Thunk to fetch business overview detail data for carrier comparison
export const businessUnitOverviewDetail = createAsyncThunk('get/busness/unit/detail', async (userData: any, thunkApi) => {
  try {
    return await businessUnitService.getBusinessUnitOverviewDetail(userData)
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
})


// Async Thunks for lane data operations
export const businessLaneGraphData = createAsyncThunk('get/busness/unit/graph', async (userData: any, thunkApi) => {
  try {
    return await businessUnitService.businessLaneGraphData(userData)
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
})


// Async Thunk to fetch business carrier comparison data
export const businessCarrierComparison = createAsyncThunk('get/business/carrier/comparison', async (userData: any, thunkApi) => {
  try {
    return await businessUnitService.businessCarrierComparison(userData)
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
})

// Async Thunk for fetching region graph data
export const businessRegionGraphData = createAsyncThunk(
  "get/business/unit/region/Graph",
  async (userData: any, thunkApi) => {
      try {
          return await businessUnitService.businessRegionGraphData(userData);
      } catch (error: any) {
          const message: any = getErrorMessage(error);
          return thunkApi.rejectWithValue(message);
      }
  }
);

// Create the business overview reducer slice
export const businessUnitOverviewReducer = createSlice({
  name: "business-unit-overview",
  initialState,
  reducers: {
    // Reset the state to initial values
    resetBusinessUnitOverview: () => initialState,
  },
  extraReducers: (builder) => {
    builder

      .addCase(businessUnitGlidePath.pending, (state) => {
        state.isLoadingBusinessUnitLevelGlidePath = true;
        state.isSuccess = false;
        state.businessUnitLevelGlideData = null;
      })
      .addCase(businessUnitGlidePath.fulfilled, (state, action) => {
        state.isLoadingBusinessUnitLevelGlidePath = false;
        state.isSuccess = true;
        state.businessUnitLevelGlideData = action.payload;
      })
      .addCase(businessUnitGlidePath.rejected, (state, action) => {
        state.isLoadingBusinessUnitLevelGlidePath = isCancelRequest(action?.payload);
        state.businessUnitLevelGlideData = null;
        state.isSuccess = false;
      }).addCase(businessUnitOverviewDetail.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.businessUnitOverviewDetailLoading = true
        state.businessUnitOverviewDetailData = null
      })
      .addCase(businessUnitOverviewDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.businessUnitOverviewDetailData = action.payload;
        state.businessUnitOverviewDetailLoading = false
      })
      .addCase(businessUnitOverviewDetail.rejected, (state, action) => {
        state.isLoading = true;
        state.isError = action.payload;
        state.isSuccess = false;
        state.businessUnitOverviewDetailLoading = isCancelRequest(action?.payload)

      }).addCase(businessLaneGraphData.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.businessLaneGraphDetailsLoading = true
        state.businessLaneGraphDetails = null
      }).addCase(businessLaneGraphData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.businessLaneGraphDetails = action.payload;
        state.businessLaneGraphDetailsLoading = false
      })
      .addCase(businessLaneGraphData.rejected, (state, action) => {
        state.isLoading = true;
        state.isError = action.payload;
        state.isSuccess = false;
        state.businessLaneGraphDetailsLoading = isCancelRequest(action?.payload)

      }).addCase(businessCarrierComparison.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.businessCarrierComparisonLoading = true
        state.businessCarrierComparisonData = null
      })
      .addCase(businessCarrierComparison.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.businessCarrierComparisonData = action.payload;
        state.businessCarrierComparisonLoading = false
      })
      .addCase(businessCarrierComparison.rejected, (state, action) => {
        state.isLoading = true;
        state.isError = action.payload;
        state.isSuccess = false;
        state.businessCarrierComparisonLoading = isCancelRequest(action?.payload)

      }).addCase(businessRegionGraphData.pending, (state) => {
        // Set loading state for graph data
        state.isSuccess = false;
        state.businessUnitRegionGraphDetailsLoading = true;
        state.businessUnitRegionGraphDetails = null;
    })
    .addCase(businessRegionGraphData.fulfilled, (state, action) => {
        // Set success state and update businessUnitRegionGraphDetails
        state.isSuccess = true;
        state.businessUnitRegionGraphDetails = action.payload;
        state.businessUnitRegionGraphDetailsLoading = false;
    })
    .addCase(businessRegionGraphData.rejected, (state, action) => {
        // Set error state on graph data rejection
        state.isError = action.payload;
        state.isSuccess = false;
        state.businessUnitRegionGraphDetailsLoading = false;
    });
  },
});

// Export reducer actions and reducer function
export const { resetBusinessUnitOverview } = businessUnitOverviewReducer.actions;
export default businessUnitOverviewReducer.reducer;
