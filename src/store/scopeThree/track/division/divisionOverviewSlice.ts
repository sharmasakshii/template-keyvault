import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import divisionService from "./divisionService";
import { getErrorMessage, isCancelRequest } from "../../../../utils";
import { DivisionOverviewState } from "./divisionInterface";

// Define the initial state for the business overview
const initialState: DivisionOverviewState = {
  divisionOverviewDetailDto: null,
  divisionOverviewDetailDtoLoading: false,
  laneBreakdownDetailIsLoading: false,
  getDivisionRegionComparisonDataDto: null,
  getDivisionRegionComparisonDataDtoLoading: false,
  laneBreakdownDetailForDivisionDto: null,
  laneBreakdownDetailForDivisionDtoLoading: false,
  businessUnitEmissionDivisionDto: null,
  businessUnitEmissionDivisionDtoLoading: false,
  businessUnitEmissionDivisionListDto: null,
  businessUnitEmissionDivisionListDtoLoading: false,
};


// Async Thunk to fetch business overview detail data for carrier comparison
export const divisionOverviewDetail = createAsyncThunk('get/division/detail', async (userData: any, thunkApi) => {
  try {
    return await divisionService.getDivisionOverviewDetailApi(userData)
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
})

export const getDivisionRegionComparisonData = createAsyncThunk('get/division/region/comparison/detail', async (userData: any, thunkApi) => {
  try {
    return await divisionService.getDivisionRegionComparisonDataApi(userData)
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
})


export const laneBreakdownDetailForDivision = createAsyncThunk('get/lane/breakdown/division', async (userData: any, thunkApi) => {
  try {
    return await divisionService.laneBreakdownDetailForDivisionApi(userData)
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
})


export const businessUnitEmissionDivisionList = createAsyncThunk('get/business/unit/division/list', async (userData: any, thunkApi) => {
  try {
    return await divisionService.businessUnitEmissionDivisionListApi(userData)
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
})


export const businessUnitEmissionDivision = createAsyncThunk('get/business/unit/division/graph', async (userData: any, thunkApi) => {
  try {
    return await divisionService.businessUnitEmissionDivisionApi(userData)
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
})

// Create the business overview reducer slice
export const divisionOverviewReducer = createSlice({
  name: "division-overview-overview",
  initialState,
  reducers: {
    // Reset the state to initial values
    resetDivisionUnitOverview: () => initialState,
  },
  extraReducers: (builder) => {
    builder

      .addCase(divisionOverviewDetail.pending, (state) => {
        state.divisionOverviewDetailDto = null
        state.divisionOverviewDetailDtoLoading = true
      })
      .addCase(divisionOverviewDetail.fulfilled, (state, action) => {
        state.divisionOverviewDetailDto = action.payload;
        state.divisionOverviewDetailDtoLoading = false
      })
      .addCase(divisionOverviewDetail.rejected, (state, action) => {
        state.divisionOverviewDetailDto = null;
        state.divisionOverviewDetailDtoLoading = isCancelRequest(action?.payload);;

      })

      .addCase(getDivisionRegionComparisonData.pending, (state) => {
        state.getDivisionRegionComparisonDataDto = null
        state.getDivisionRegionComparisonDataDtoLoading = true
      })
      .addCase(getDivisionRegionComparisonData.fulfilled, (state, action) => {
        state.getDivisionRegionComparisonDataDto = action.payload;
        state.getDivisionRegionComparisonDataDtoLoading = false
      })
      .addCase(getDivisionRegionComparisonData.rejected, (state, action) => {
        state.getDivisionRegionComparisonDataDto = null;
        state.getDivisionRegionComparisonDataDtoLoading = isCancelRequest(action?.payload);;

      })

      .addCase(laneBreakdownDetailForDivision.pending, (state) => {
        state.laneBreakdownDetailForDivisionDto = null
        state.laneBreakdownDetailIsLoading = true
      })
      .addCase(laneBreakdownDetailForDivision.fulfilled, (state, action) => {
        state.laneBreakdownDetailForDivisionDto = action.payload;
        state.laneBreakdownDetailIsLoading = false
      })
      .addCase(laneBreakdownDetailForDivision.rejected, (state, action) => {
        state.laneBreakdownDetailForDivisionDto = null;
        state.laneBreakdownDetailIsLoading = isCancelRequest(action?.payload);;

      })

      .addCase(businessUnitEmissionDivision.pending, (state) => {
        state.businessUnitEmissionDivisionDto = null
        state.businessUnitEmissionDivisionDtoLoading = true
      })
      .addCase(businessUnitEmissionDivision.fulfilled, (state, action) => {
        state.businessUnitEmissionDivisionDto = action.payload;
        state.businessUnitEmissionDivisionDtoLoading = false
      })
      .addCase(businessUnitEmissionDivision.rejected, (state, action) => {
        state.businessUnitEmissionDivisionDto = null;
        state.businessUnitEmissionDivisionDtoLoading = isCancelRequest(action?.payload);;

      })

      .addCase(businessUnitEmissionDivisionList.pending, (state) => {
        state.businessUnitEmissionDivisionListDto = null
        state.businessUnitEmissionDivisionListDtoLoading = true
      })
      .addCase(businessUnitEmissionDivisionList.fulfilled, (state, action) => {
        state.businessUnitEmissionDivisionListDto = action.payload;
        state.businessUnitEmissionDivisionListDtoLoading = false
      })
      .addCase(businessUnitEmissionDivisionList.rejected, (state, action) => {
        state.businessUnitEmissionDivisionListDto = null;
        state.businessUnitEmissionDivisionListDtoLoading = isCancelRequest(action?.payload);;
      })
  },
});

// Export reducer actions and reducer function
export const { resetDivisionUnitOverview } = divisionOverviewReducer.actions;
export default divisionOverviewReducer.reducer;
