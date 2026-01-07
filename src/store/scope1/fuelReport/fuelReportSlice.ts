import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fuelReportService from "./fuelReportService";
import { getErrorMessage, isCancelRequest } from "utils";
import { FuelReportInterface } from "./fuelReportInterface";

// Define the shape of the state

export const initialState: FuelReportInterface = {
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  isLoadingTransactionList: false,
  transactionListData: null,
  isLoadingFuelFilters: false,
  fuelReportFilterData: null,
  isLoadingFuelMatrics: false,
  fuelReportMatricsData: null,
  isLoadingFuelConsumption: false,
  fuelConsumptionData: null,
  isLoadingFuelEmission: false,
  fuelEmissionData: null,
  isLoadingConsumptionByDivision: false,
  consumptionByDivisionData: null,
  isLoadingEmissionsByDivision: false,
  emissionsByDivisionData: null,
  isLoadingTransactionLocation: false,
  transactionLocationData: null,
  isLoadingTransactionFilter: false,
  transactionFilterData: null,
  isLoadingPfnaTransactionDetail: false,
  pfnaTransactionDetailDto: null,
  isLoadingFuelConsumptionByPeriod: false,
  fuelConsumptionByPeriodData: null,
  isLoadingFuelEmissionByPeriod: false,
  fuelEmissionByPeriodData: null
};

export const getFuelTransactionData = createAsyncThunk("get/scope1/fuel/transaction/list",
  async (userData: any, thunkApi) => {
    try {
      return await fuelReportService.getFuelTransactionApi(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getFuelReportFilters = createAsyncThunk("get/scope1/fuel/report/filters",
  async (userData: any, thunkApi) => {
    try {
      return await fuelReportService.getFuelReportFilterApi(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getFuelReportMatrics = createAsyncThunk("get/scope1/fuel/report/matrics",
  async (userData: any, thunkApi) => {
    try {
      return await fuelReportService.getFuelReportMatricsApi(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);


export const getFuelConsumptionReport = createAsyncThunk("get/scope1/fuel/report/fuel/consumption",
  async (userData: any, thunkApi) => {
    try {
      return await fuelReportService.getFuelConsumptionApi(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getFuelEmissionReport = createAsyncThunk("get/scope1/fuel/report/fuel/emission",
  async (userData: any, thunkApi) => {
    try {
      return await fuelReportService.getFuelEmissionsApi(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getFuelConsumptionByDivision = createAsyncThunk("get/scope1/fuel/consumption/by/division",
  async (userData: any, thunkApi) => {
    try {
      return await fuelReportService.getFuelReportByDivisionApi(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getFuelTransactionFilter = createAsyncThunk("get/scope1/fuel/transaction/filters",
  async (userData: any, thunkApi) => {
    try {
      return await fuelReportService.getTransactionFilter(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getFuelEmissionByDivision = createAsyncThunk("get/scope1/fuel/emission/by/division",
  async (userData: any, thunkApi) => {
    try {
      return await fuelReportService.getFuelReportByDivisionApi(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getTransactionLocation = createAsyncThunk("get/scope1/transaction/location",
  async (userData: any, thunkApi) => {
    try {
      return await fuelReportService.getTransactionLocationApi(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getPfnaTransactionDetails = createAsyncThunk("get/bulk/cng/transaction/location",
  async (userData: any, thunkApi) => {
    try {
      return await fuelReportService.getPfnaTransactionDetailsApi(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getFuelConsumptionByPeriod = createAsyncThunk("get/fuel/consumption/by/period",
  async (userData: any, thunkApi) => {
    try {
      return await fuelReportService.getPbnaPfnaFuelConsumptionByPeriodApi(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getFuelEmissionByPeriod = createAsyncThunk("get/fuel/emission/by/period",
  async (userData: any, thunkApi) => {
    try {
      return await fuelReportService.getPbnaPfnaFuelEmissionByPeriodApi(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const scopeOneFuelReportReducer = createSlice({
  name: "scope-one-fuel-report",
  initialState,
  reducers: {
    resetScopeOneFuelReport: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(getFuelTransactionFilter.pending, (state) => {
        state.isLoadingTransactionFilter = true;
      })
      .addCase(getFuelTransactionFilter.fulfilled, (state, action:any) => {
        const type =  action?.meta?.arg?.searchType;
        state.transactionFilterData = {...state.transactionFilterData, [type]:action.payload?.data};
        state.isLoadingTransactionFilter = false;
      })
      .addCase(getFuelTransactionFilter.rejected, (state, action) => {
        state.isLoadingTransactionFilter = isCancelRequest(action?.payload);
      })
      .addCase(getFuelTransactionData.pending, (state) => {
        state.isLoadingTransactionList = true;
        state.transactionListData = null
      })
      .addCase(getFuelTransactionData.fulfilled, (state, action) => {
        state.transactionListData = action.payload;
        state.isLoadingTransactionList = false;
      })
      .addCase(getFuelTransactionData.rejected, (state, action) => {
        state.isLoadingTransactionList = isCancelRequest(action?.payload);
        state.transactionListData = null
      })
      .addCase(getFuelReportFilters.pending, (state) => {
        state.isLoadingFuelFilters = true;
        state.fuelReportFilterData = null
      })
      .addCase(getFuelReportFilters.fulfilled, (state, action) => {
        state.fuelReportFilterData = action.payload;
        state.isLoadingFuelFilters = false;
      })
      .addCase(getFuelReportFilters.rejected, (state, action) => {
        state.isLoadingFuelFilters = isCancelRequest(action?.payload);
        state.fuelReportFilterData = null
      })
      .addCase(getFuelReportMatrics.pending, (state) => {
        state.isLoadingFuelMatrics = true;
        state.fuelReportMatricsData = null
      })
      .addCase(getFuelReportMatrics.fulfilled, (state, action) => {
        state.fuelReportMatricsData = action.payload;
        state.isLoadingFuelMatrics = false;
      })
      .addCase(getFuelReportMatrics.rejected, (state, action) => {
        state.isLoadingFuelMatrics = isCancelRequest(action?.payload);
        state.fuelReportMatricsData = null
      })
      .addCase(getFuelConsumptionReport.pending, (state) => {
        state.isLoadingFuelConsumption = true;
        state.fuelConsumptionData = null
      })
      .addCase(getFuelConsumptionReport.fulfilled, (state, action) => {
        state.fuelConsumptionData = action.payload;
        state.isLoadingFuelConsumption = false;
      })
      .addCase(getFuelConsumptionReport.rejected, (state, action) => {
        state.isLoadingFuelConsumption = isCancelRequest(action?.payload);
        state.fuelConsumptionData = null
      })
      .addCase(getFuelEmissionReport.pending, (state) => {
        state.isLoadingFuelEmission = true;
        state.fuelEmissionData = null
      })
      .addCase(getFuelEmissionReport.fulfilled, (state, action) => {
        state.fuelEmissionData = action.payload;
        state.isLoadingFuelEmission = false;
      })
      .addCase(getFuelEmissionReport.rejected, (state, action) => {
        state.isLoadingFuelEmission = isCancelRequest(action?.payload);
        state.fuelEmissionData = null
      })
      .addCase(getFuelConsumptionByDivision.pending, (state) => {
        state.isLoadingConsumptionByDivision = true;
        state.consumptionByDivisionData = null
      })
      .addCase(getFuelConsumptionByDivision.fulfilled, (state, action) => {
        state.consumptionByDivisionData = action.payload;
        state.isLoadingConsumptionByDivision = false;
      })
      .addCase(getFuelConsumptionByDivision.rejected, (state, action) => {
        state.isLoadingConsumptionByDivision = isCancelRequest(action?.payload);
        state.consumptionByDivisionData = null
      })
      .addCase(getFuelEmissionByDivision.pending, (state) => {
        state.isLoadingEmissionsByDivision = true;
        state.emissionsByDivisionData = null
      })
      .addCase(getFuelEmissionByDivision.fulfilled, (state, action) => {
        state.emissionsByDivisionData = action.payload;
        state.isLoadingEmissionsByDivision = false;
      })
      .addCase(getFuelEmissionByDivision.rejected, (state, action) => {
        state.isLoadingEmissionsByDivision = isCancelRequest(action?.payload);
        state.emissionsByDivisionData = null
      })
      .addCase(getTransactionLocation.pending, (state) => {
        state.isLoadingTransactionLocation = true;
        state.transactionLocationData = null
      })
      .addCase(getTransactionLocation.fulfilled, (state, action) => {
        state.transactionLocationData = action.payload;
        state.isLoadingTransactionLocation = false;
      })
      .addCase(getTransactionLocation.rejected, (state, action) => {
        state.isLoadingTransactionLocation = isCancelRequest(action?.payload);
        state.transactionLocationData = null
      })

      .addCase(getPfnaTransactionDetails.pending, (state) => {
        state.isLoadingPfnaTransactionDetail = true;
        state.pfnaTransactionDetailDto = null
      })
      .addCase(getPfnaTransactionDetails.fulfilled, (state, action) => {
        state.pfnaTransactionDetailDto = action.payload;
        state.isLoadingPfnaTransactionDetail = false;
      })
      .addCase(getPfnaTransactionDetails.rejected, (state, action) => {
        state.isLoadingPfnaTransactionDetail = isCancelRequest(action?.payload);
        state.pfnaTransactionDetailDto = null
      })
      .addCase(getFuelConsumptionByPeriod.pending, (state) => {
        state.isLoadingFuelConsumptionByPeriod = true;
        state.fuelConsumptionByPeriodData = null
      })
      .addCase(getFuelConsumptionByPeriod.fulfilled, (state, action) => {
        state.fuelConsumptionByPeriodData = action.payload;
        state.isLoadingFuelConsumptionByPeriod = false;
      })
      .addCase(getFuelConsumptionByPeriod.rejected, (state, action) => {
        state.isLoadingFuelConsumptionByPeriod = isCancelRequest(action?.payload);
        state.fuelConsumptionByPeriodData = null
      })
      .addCase(getFuelEmissionByPeriod.pending, (state) => {
        state.isLoadingFuelEmissionByPeriod = true;
        state.fuelEmissionByPeriodData = null
      })
      .addCase(getFuelEmissionByPeriod.fulfilled, (state, action) => {
        state.fuelEmissionByPeriodData = action.payload;
        state.isLoadingFuelEmissionByPeriod = false;
      })
      .addCase(getFuelEmissionByPeriod.rejected, (state, action) => {
        state.isLoadingFuelEmissionByPeriod = isCancelRequest(action?.payload);
        state.fuelEmissionByPeriodData = null
      })
  },
});

export const { resetScopeOneFuelReport } = scopeOneFuelReportReducer.actions;
export default scopeOneFuelReportReducer.reducer;