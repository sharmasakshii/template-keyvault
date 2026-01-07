import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import regionService from "./regionService";
import { getErrorMessage, isCancelRequest } from "../../../../utils";
import { RegionOverviewState } from "./regionInterface";

// Define the initial state for the region overview
const initialState: RegionOverviewState = {
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  regionFacilityEmissionDto: null,
  regionFacilityEmissionIsLoading: false,
};

// Create async thunk for fetching region facility emissions data
export const regionFacilityEmissions = createAsyncThunk(
  "get/region-facility/emissions",
  async (userData: any, thunkApi) => {
    try {
      return await regionService.regionFacilityEmissionApi(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

// Create the region overview reducer slice
export const regionOverviewReducer = createSlice({
  name: "region-Page",
  initialState,
  reducers: {
    // Reset the state to initial values
    resetRegionOverview: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(regionFacilityEmissions.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.regionFacilityEmissionDto = null;
        state.regionFacilityEmissionIsLoading = true;
      })
      .addCase(regionFacilityEmissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.regionFacilityEmissionDto = action.payload;
        state.regionFacilityEmissionIsLoading = false;
      })
      .addCase(regionFacilityEmissions.rejected, (state, action) => {
        state.isLoading = true;
        state.isError = action.payload;
        state.isSuccess = false;
        state.regionFacilityEmissionIsLoading = isCancelRequest(action?.payload);
      });
  },
});

// Export reducer actions and reducer function
export const { resetRegionOverview } = regionOverviewReducer.actions;
export default regionOverviewReducer.reducer;
