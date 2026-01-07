import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import sustainService from "./sustainService";
import { getErrorMessage, isCancelRequest } from "../../utils";
import { SustainState } from "./sustainInterface";
import { isLoadingCommonDashboard } from "../commonData/commonSlice";
import { isLoadingRegionDashboard } from "../scopeThree/track/region/regionSlice"
import { isLoadingBusinessUnitDashboard } from "../businessUnit/businessUnitSlice"
import { isLoadingCarrierDashboard } from "../scopeThree/track/carrier/vendorSlice"
import { isLoadingLaneDashboard } from "../scopeThree/track/lane/laneDetailsSlice"
import { isLoadingFacilityDashboard } from "../scopeThree/track/facility/facilityDataSlice"
import { isLoadingTrailerDashboard } from "../trailer/trailerSlice"
import { isLoadingFuelDashboard } from "../fuel/fuelSlice"
import { isLoadingDivisionDashboard } from "../scopeThree/track/division/divisionSlice"
import { isLoadingAlternativeDashboard } from "../localFreight/localFreightSlice"
import { isLoadingEVNetworkDashboard } from "../ev/evSlice"
import { isLoadingBenchmarkDashboard } from "../benchmark/benchmarkSlice"
// Define the shape of the state

export const initialState: SustainState = {
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  graphRegionChart: null,
  regionEmission: null,
  isLoadingGraphRegionEmission: false,
  regionEmissionIsLoading: false,
  configConstants: null,
  configConstantsIsLoading: false,
  isShowPasswordExpire: false
};

// Async Thunks for fetching sustain service data
export const graphRegionEmission = createAsyncThunk(
  "get/region-emission-graph",
  async (userData: any, thunkApi) => {
    try {
      return await sustainService.getGraphRegionEmission(
        userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

// Define async thunk to fetch emission region details
export const emissionRegionDetails = createAsyncThunk(
  "post/emissionRegion/Details",
  async (userData: any, thunkApi) => {
    try {
      // Fetch emission region details using sustainService and the token header
      return await sustainService.getRegionEmission(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getConfigConstants = createAsyncThunk(
  "post/config/Details",
  async (data: any, thunkApi) => {
    try {
      thunkApi.dispatch(isLoadingDashboard(true))
      thunkApi.dispatch(isLoadingCommonDashboard(true))
      thunkApi.dispatch(isLoadingRegionDashboard(true))
      thunkApi.dispatch(isLoadingBusinessUnitDashboard(true))
      thunkApi.dispatch(isLoadingCarrierDashboard(true))
      thunkApi.dispatch(isLoadingLaneDashboard(true))
      thunkApi.dispatch(isLoadingFacilityDashboard(true))
      thunkApi.dispatch(isLoadingTrailerDashboard(true))
      thunkApi.dispatch(isLoadingFuelDashboard(true))
      thunkApi.dispatch(isLoadingDivisionDashboard(true))
      thunkApi.dispatch(isLoadingAlternativeDashboard(true))
      thunkApi.dispatch(isLoadingEVNetworkDashboard(true))
      thunkApi.dispatch(isLoadingBenchmarkDashboard(true))

      // Fetch emission region details using sustainService and the token header
      return await sustainService.getConfigConstants(data);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const setShowPasswordExpire = createAsyncThunk("passwordResetPopup", async (status: boolean) => {
  return status
})

export const isLoadingDashboard = createAsyncThunk("isLoadingDashboard", async (status: boolean) => {
  return status
})

export const resetConifigConstants = createAsyncThunk(
  "reset/config/Details",
  async () => {
    return null;
  }
);
export const sustainableReducer = createSlice({
  name: "chart-details",
  initialState,
  reducers: {
    resetSustain: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(resetConifigConstants.fulfilled, (state) => {
        state.configConstants = null;
      })
      .addCase(graphRegionEmission.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isLoadingGraphRegionEmission = true;
      })
      .addCase(graphRegionEmission.fulfilled, (state, action) => {
        state.isLoading = true;
        state.isSuccess = true;
        state.graphRegionChart = action.payload;
        state.isLoadingGraphRegionEmission = false;
      })

      .addCase(isLoadingDashboard.pending, (state) => {
        state.regionEmissionIsLoading = true;
      })
      .addCase(graphRegionEmission.rejected, (state, action) => {
        state.isLoading = true;
        state.isError = action.payload;
        state.isSuccess = false;
        state.isLoadingGraphRegionEmission = isCancelRequest(action?.payload);
      })
      .addCase(emissionRegionDetails.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.regionEmissionIsLoading = true;
      })
      .addCase(emissionRegionDetails.fulfilled, (state, action) => {
        state.isLoading = true;
        state.isSuccess = true;
        state.regionEmission = action.payload;
        state.regionEmissionIsLoading = false;
      })
      .addCase(emissionRegionDetails.rejected, (state, action) => {
        state.isLoading = true;
        state.isError = action.payload;
        state.isSuccess = false;
        state.regionEmissionIsLoading = isCancelRequest(action?.payload);
      })

      .addCase(getConfigConstants.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.configConstants = null;
        state.configConstantsIsLoading = true;
      })
      .addCase(getConfigConstants.fulfilled, (state, action) => {
        state.isLoading = true;
        state.isSuccess = true;
        state.configConstants = action.payload;
        state.configConstantsIsLoading = false;
      })
      .addCase(getConfigConstants.rejected, (state, action) => {
        state.isLoading = true;
        state.isError = action.payload;
        state.isSuccess = false;
        state.configConstantsIsLoading = isCancelRequest(action?.payload);
      })
      .addCase(setShowPasswordExpire.fulfilled, (state: any, action: any) => {
        state.isShowPasswordExpire = action.payload;
      })
  },
});

export const { resetSustain } = sustainableReducer.actions;
export default sustainableReducer.reducer;
