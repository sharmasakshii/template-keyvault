import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BenchmarkInterface } from "./benchmarkInterface";
import { getErrorMessage, isCancelRequest } from "../../utils";
import benchmarkService from "./benchmarkService";
// Define the shape of the state

// Initial state
const initialState: BenchmarkInterface = {
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  isLoadingGetBand: false,
  bandRange: null,
  benchmarkDistanceDto: null,
  benchmarkDistanceDtoLoading: false,
  benchmarkWeightDto: null,
  benchmarkWeightDtoLoading: false,
  benchmarkRegionDtoLoading: false,
  benchmarkRegionDto: null,
  isLoadingOrigin: false,
  benchmarkLaneOrigin: null,
  isLoadingDestination: false,
  benchmarkLaneDestination: null,
  freightLanesDtoLoading: false,
  freightLanesDto: null,
  benchmarkCompanyDetailLoading: false,
  benchmarkCompanyDetail: null,
  benchmarkRegionList: null,
  benchmarkCompanyCarrierEmissionsList: null,
  benchmarkCompanyCarrierEmissionsLoading: false,
  industryStandardEmissionsLoading: false,
  industryStandardEmissionsList: null,
  emissionIntensityTrendLoading: false,
  emissionIntensityTrendDto: null,
  benchmarkEmissionsTrendGraphLoading: false,
  benchmarkEmissionsTrendGraphDto: null,
  emissionByRegionLoading: false,
  emissionByRegionDto: null,
  intermodelTrendGraphLoading: false,
  intermodelTrendGraphDto: null,
  benchmarkLCompanyarrierEmissionsLoading: false,
};

// Async Thunks for changing region, lane, facility, and carrier

export const benchmarkDistance = createAsyncThunk(
  "get/benchmark/distance",
  async (userData: any, thunkApi: any): Promise<ApiResponse> => {
    try {
      return await benchmarkService.benchmarkDistance(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const benchmarkWeight = createAsyncThunk(
  "get/benchmark/weight",
  async (userData: any, thunkApi: any): Promise<ApiResponse> => {
    try {
      return await benchmarkService.benchmarkWeight(userData)
    }
    catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const benchmarkRegion = createAsyncThunk(
  "get/map/benchmark/region",
  async (userData: any, thunkApi: any): Promise<ApiResponse> => {
    try {
      return await benchmarkService.benchmarkRegion(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

//

export const getOrigin = createAsyncThunk(
  "get/benchmark/origin",
  async (userData: any, thunkApi: any): Promise<ApiResponse> => {
    try {
      return await benchmarkService.getLocation(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getDestination = createAsyncThunk(
  "get/map/benchmark/destination",
  async (userData: any, thunkApi: any): Promise<ApiResponse> => {
    try {
      return await benchmarkService.getLocation(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getFreightLanes = createAsyncThunk(
  "get/map/benchmark/freight/lanes",
  async (userData: any, thunkApi: any): Promise<ApiResponse> => {
    try {
      return await benchmarkService.getFreightLanes(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getBenchmark = createAsyncThunk(
  "get/benchmark/detail",
  async (userData: any, thunkApi: any): Promise<ApiResponse> => {
    try {
      return await benchmarkService.getBenchmark(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getBenchmarkRegion = createAsyncThunk(
  "get/benchmark/region",
  async (userData: any, thunkApi: any): Promise<ApiResponse> => {
    try {
      return await benchmarkService.getBenchmarkRegion();
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getBenchmarkCarrierEmissions = createAsyncThunk(
  "get/benchmark/carrier/emissions",
  async (userData: any, thunkApi: any): Promise<ApiResponse> => {
    try {
      return await benchmarkService.getBenchmarkCarrierEmissions(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getIndustryStandardEmissions = createAsyncThunk(
  "get/benchmark/industry/standard/emissions",
  async (userData: any, thunkApi: any): Promise<ApiResponse> => {
    try {
      return await benchmarkService.getIndustryStandardEmissions(
        userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getEmissionIntensityTrend = createAsyncThunk(
  "get/benchmark/emissions/trend",
  async (userData: any, thunkApi: any): Promise<ApiResponse> => {
    try {
      return await benchmarkService.getEmissionIntensityTrend(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getBenchmarkEmissionsTrendGraph = createAsyncThunk(
  "get/benchmark/region/emissions/trend",
  async (userData: any, thunkApi: any): Promise<ApiResponse> => {
    try {
      return await benchmarkService.getBenchmarkEmissionsTrendGraph(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getIntermodelTrendGraph = createAsyncThunk(
  "get/benchmark/intermodel/trend",
  async (userData: any, thunkApi: any): Promise<ApiResponse> => {
    try {
      return await benchmarkService.getIntermodelTrendGraph(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getEmissionByRegion = createAsyncThunk(
  "get/benchmark/region/trend",
  async (userData: any, thunkApi: any): Promise<ApiResponse> => {
    try {
      return await benchmarkService.getEmissionByRegion(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getEmissionByLane = createAsyncThunk(
  "get/benchmark/lane/trend",
  async (userData: any, thunkApi: any): Promise<ApiResponse> => {
    try {
      return await benchmarkService.getEmissionByLane(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getIntermodelTrendGraphLane = createAsyncThunk(
  "get/benchmark/lane/trend/graph",
  async (userData: any, thunkApi: any): Promise<ApiResponse> => {
    try {
      return await benchmarkService.getIntermodelTrendGraphLane(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getBenchmarkEmissionsTrendGraphLane = createAsyncThunk(
  "get/benchmark/region/emissions/trend/lane",
  async (userData: any, thunkApi: any): Promise<ApiResponse> => {
    try {
      return await benchmarkService.getBenchmarkEmissionsTrendGraphLane(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

// Band range for weigth and distance range
export const getBandRange = createAsyncThunk(
  "get/benchmark/bandRange",
  async (userData: any, thunkApi: any): Promise<ApiResponse> => {
    try {
      return await benchmarkService.getBands(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const isLoadingBenchmarkDashboard = createAsyncThunk("isLoadingBenchmarkDashboard", async (status: boolean) => {
  return status
})


// Define the dashboard region reducer
export const benchmarkReducer = createSlice({
  name: "dashboard-Page",
  initialState,
  reducers: {
    resetBenchmarkData: () => initialState,
    // Reducer to clear data
    clearData: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(isLoadingBenchmarkDashboard.pending, (state) => {
        state.benchmarkDistanceDtoLoading = true;
        state.benchmarkWeightDtoLoading = true;
        state.benchmarkRegionDtoLoading = true;
      })
      .addCase(benchmarkDistance.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.benchmarkDistanceDtoLoading = true;
        state.benchmarkDistanceDto = null;
      })
      .addCase(benchmarkDistance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.benchmarkDistanceDto = action.payload;
        state.benchmarkDistanceDtoLoading = false;
      })
      .addCase(benchmarkDistance.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.benchmarkDistanceDto = null;
        state.benchmarkDistanceDtoLoading = isCancelRequest(action?.payload);
      })
      .addCase(benchmarkWeight.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.benchmarkWeightDto = null;
        state.benchmarkWeightDtoLoading = true;
      })
      .addCase(benchmarkWeight.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.benchmarkWeightDto = action.payload;
        state.benchmarkWeightDtoLoading = false;
      })
      .addCase(benchmarkWeight.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.benchmarkWeightDto = null;
        state.benchmarkWeightDtoLoading = isCancelRequest(action?.payload);
      })

      .addCase(benchmarkRegion.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.benchmarkRegionDtoLoading = true;
      })
      .addCase(benchmarkRegion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.benchmarkRegionDto = action.payload;
        state.benchmarkRegionDtoLoading = false;
      })
      .addCase(benchmarkRegion.rejected, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.benchmarkRegionDtoLoading = isCancelRequest(action?.payload);
      })

      .addCase(getOrigin.pending, (state) => {
        state.isLoadingOrigin = true;
        state.isSuccess = false;
        state.benchmarkLaneOrigin = null
      })
      .addCase(getOrigin.fulfilled, (state, action) => {
        state.isLoadingOrigin = false;
        state.isSuccess = true;
        state.benchmarkLaneOrigin = action.payload;
      })
      .addCase(getOrigin.rejected, (state, action) => {
        state.isLoadingOrigin = isCancelRequest(action?.payload);
        state.isSuccess = false;
        state.benchmarkLaneOrigin = null
      })

      .addCase(getDestination.pending, (state) => {
        state.isLoadingDestination = true;
        state.isSuccess = false;
        state.benchmarkLaneDestination = null;
      })
      .addCase(getDestination.fulfilled, (state, action) => {
        state.isLoadingDestination = false;
        state.isSuccess = true;
        state.benchmarkLaneDestination = action.payload;
      })
      .addCase(getDestination.rejected, (state, action) => {
        state.isLoadingDestination = isCancelRequest(action?.payload);
        state.isSuccess = false;
        state.benchmarkLaneDestination = null;
      })

      .addCase(getFreightLanes.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.freightLanesDto = null;
        state.freightLanesDtoLoading = true;
      })
      .addCase(getFreightLanes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.freightLanesDto = action.payload;
        state.freightLanesDtoLoading = false;
      })
      .addCase(getFreightLanes.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.freightLanesDto = null;
        state.freightLanesDtoLoading = isCancelRequest(action?.payload);
      })
      .addCase(getBenchmark.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.benchmarkCompanyDetail = null;
        state.benchmarkCompanyDetailLoading = true;
      })
      .addCase(getBenchmark.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.benchmarkCompanyDetail = action.payload;
        state.benchmarkCompanyDetailLoading = false;
      })
      .addCase(getBenchmark.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.benchmarkCompanyDetailLoading = isCancelRequest(action?.payload);
      })
      .addCase(getBenchmarkRegion.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.benchmarkRegionList = null;
        state.emissionIntensityTrendLoading = true;
      })
      .addCase(getBenchmarkRegion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.benchmarkRegionList = action.payload;
      })
      .addCase(getBenchmarkRegion.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.benchmarkRegionList = null;
      })
      .addCase(getBenchmarkCarrierEmissions.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.benchmarkLCompanyarrierEmissionsLoading = true;
        state.benchmarkCompanyCarrierEmissionsList = null;
      })
      .addCase(getBenchmarkCarrierEmissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.benchmarkCompanyCarrierEmissionsList = action.payload || null;
        state.benchmarkLCompanyarrierEmissionsLoading = false;
      })
      .addCase(getBenchmarkCarrierEmissions.rejected, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.benchmarkLCompanyarrierEmissionsLoading = isCancelRequest(action?.payload);
      })

      .addCase(getIndustryStandardEmissions.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.industryStandardEmissionsList = null;
        state.industryStandardEmissionsLoading = true;
      })
      .addCase(getIndustryStandardEmissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.industryStandardEmissionsList = action.payload || null;
        state.industryStandardEmissionsLoading = false;
      })
      .addCase(getIndustryStandardEmissions.rejected, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.industryStandardEmissionsLoading = isCancelRequest(action?.payload);
      })

      .addCase(getEmissionIntensityTrend.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.emissionIntensityTrendLoading = true;
      })
      .addCase(getEmissionIntensityTrend.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.emissionIntensityTrendDto = action.payload || null;
        state.emissionIntensityTrendLoading = false;
      })
      .addCase(getEmissionIntensityTrend.rejected, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.emissionIntensityTrendLoading = isCancelRequest(action?.payload);
      })

      .addCase(getBenchmarkEmissionsTrendGraph.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.benchmarkEmissionsTrendGraphLoading = true;
      })
      .addCase(getBenchmarkEmissionsTrendGraph.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.benchmarkEmissionsTrendGraphDto = action.payload || null;
        state.benchmarkEmissionsTrendGraphLoading = false;
      })
      .addCase(getBenchmarkEmissionsTrendGraph.rejected, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.benchmarkEmissionsTrendGraphLoading = isCancelRequest(action?.payload);
      })

      .addCase(getIntermodelTrendGraph.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.intermodelTrendGraphLoading = true;
      })
      .addCase(getIntermodelTrendGraph.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.intermodelTrendGraphDto = action.payload || null;
        state.intermodelTrendGraphLoading = false;
      })
      .addCase(getIntermodelTrendGraph.rejected, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.intermodelTrendGraphLoading = isCancelRequest(action?.payload);
      })

      .addCase(getEmissionByRegion.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.emissionByRegionDto = null;
        state.emissionByRegionLoading = true;
      })
      .addCase(getEmissionByRegion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.emissionByRegionDto = action.payload || null;
        state.emissionByRegionLoading = false;
      })
      .addCase(getEmissionByRegion.rejected, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.emissionByRegionLoading = isCancelRequest(action?.payload);
      })

      .addCase(getEmissionByLane.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.emissionByRegionLoading = true;
      })
      .addCase(getEmissionByLane.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.emissionByRegionDto = action.payload || null;
        state.emissionByRegionLoading = false;
      })
      .addCase(getEmissionByLane.rejected, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.emissionByRegionLoading = isCancelRequest(action?.payload);
      })

      .addCase(getIntermodelTrendGraphLane.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.intermodelTrendGraphLoading = true;
      })
      .addCase(getIntermodelTrendGraphLane.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.intermodelTrendGraphDto = action.payload || null;
        state.intermodelTrendGraphLoading = false;
      })
      .addCase(getIntermodelTrendGraphLane.rejected, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.intermodelTrendGraphLoading = isCancelRequest(action?.payload);
      })

      .addCase(getBenchmarkEmissionsTrendGraphLane.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.benchmarkEmissionsTrendGraphLoading = true;
      })
      .addCase(
        getBenchmarkEmissionsTrendGraphLane.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.benchmarkEmissionsTrendGraphDto = action.payload || null;
          state.benchmarkEmissionsTrendGraphLoading = false;
        }
      )
      .addCase(
        getBenchmarkEmissionsTrendGraphLane.rejected,
        (state, action) => {
          state.isLoading = true;
          state.isSuccess = false;
          state.benchmarkEmissionsTrendGraphLoading = isCancelRequest(action?.payload);
        }
      )
      .addCase(getBandRange.pending, (state) => {
        state.isLoading = true;
        state.isLoadingGetBand = true;
        state.isSuccess = false;
        state.bandRange = null;
      })
      .addCase(getBandRange.fulfilled, (state, action) => {
        state.isLoading = false
        state.isLoadingGetBand = false;
        state.isSuccess = true;
        state.bandRange = action.payload;
      })
      .addCase(getBandRange.rejected, (state, action) => {
        state.isLoading =
          state.isLoadingGetBand = isCancelRequest(action?.payload);
        state.isSuccess = false;
        state.bandRange = null;
      });

  },
});

// Export the action and reducer
export const { clearData, resetBenchmarkData } = benchmarkReducer.actions;
export default benchmarkReducer.reducer;
