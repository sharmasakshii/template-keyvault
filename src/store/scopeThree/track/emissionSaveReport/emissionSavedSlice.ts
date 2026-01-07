import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage, isCancelRequest, postRequest } from "../../../../utils";
import { EmissionSavedState } from "./emissionSavedInterface";
import EmissionSavedService from "./emissionSavedService";

// Define the shape of the state

export const initialState: EmissionSavedState = {
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  isLoadingFilters: false,
  emissionSavedFilters: null,
  emissionSavedScacs: null,
  isLoadingScacList: false,
  emissionSavedMatricsData: null,
  isLoadingEmissionMatricsData: false,
  isLoadingEmissionSavedShipmentGraph: false,
  emissionSavedShipmentGraphData: null,
  emissionSavedEmissionGraphData: null,
  isLoadingEmissionSavedEmissionGraph: false,
  emissionSavedTransactionTableData: null,
  isLoadingEmissionSavedTransactionTable: false,
  emissionSavedFuelType: null,
  isLoadingEmissionSavedFuelType: false
};

export const emissionReportFilters = createAsyncThunk("post/emission/report/filters", async (userData: any, thunkApi) => {
    try {
      return await EmissionSavedService.getEmissionFilters(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const emissionReportScacs = createAsyncThunk("post/emission/report/scacs", async (userData: any, thunkApi) => {
  try {
    return await EmissionSavedService.getEmissionScacs(userData);
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
});

export const emissionSavedMatrics = createAsyncThunk("post/emission/matrics/data", async (userData: any, thunkApi) => {
  try {
    return await postRequest("combine-dash-metrics-data",userData);
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
});

export const emissionSavedShipmentGraph = createAsyncThunk("post/emission/shipment/graph", async (userData: any, thunkApi) => {
  try {
    return await postRequest("combine-dash-total-shipment-graph", userData);
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
});

export const emissionSavedEmissionGraph = createAsyncThunk("post/emission/saved/emission/graph", async (userData: any, thunkApi) => {
  try {
    return await postRequest("combine-dash-total-emission-graph", userData);
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
});

export const emissionSavedEmissionTransactionTable = createAsyncThunk("post/emission/saved/transaction/table", async (userData: any, thunkApi) => {
  try {
    return await postRequest("combine-dash-transaction-table", userData);
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
});

export const emissionSavedFuelList = createAsyncThunk("post/emission/saved/fuel/list", async (userData: any, thunkApi) => {
  try {
    return await postRequest("combine-dash-fuel-list", userData);
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
});


export const emissionSavedReducer = createSlice({
  name: "emission-saved",
  initialState,
  reducers: {
    resetEmissionSaved: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(emissionReportFilters.pending, (state) => {
        state.isSuccess = false;
        state.isLoadingFilters = true;
      })
      .addCase(emissionReportFilters.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.emissionSavedFilters = action.payload;
        state.isLoadingFilters = false;
      })
      .addCase(emissionReportFilters.rejected, (state, action) => {
        state.isError = action.payload;
        state.isSuccess = false;
        state.isLoadingFilters = isCancelRequest(action?.payload);
      })
      .addCase(emissionReportScacs.pending, (state) => {
        state.isSuccess = false;
        state.isLoadingScacList = true;
      })
      .addCase(emissionReportScacs.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.emissionSavedScacs = action.payload;
        state.isLoadingScacList = false;
      })
      .addCase(emissionReportScacs.rejected, (state, action) => {
        state.isError = action.payload;
        state.isSuccess = false;
        state.isLoadingScacList = isCancelRequest(action?.payload);
      })
      .addCase(emissionSavedMatrics.pending, (state) => {
        state.isSuccess = false;
        state.isLoadingEmissionMatricsData = true;
      })
      .addCase(emissionSavedMatrics.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.emissionSavedMatricsData = action.payload;
        state.isLoadingEmissionMatricsData = false;
      })
      .addCase(emissionSavedMatrics.rejected, (state, action) => {
        state.isError = action.payload;
        state.isSuccess = false;
        state.isLoadingEmissionMatricsData = isCancelRequest(action?.payload);
      })
      .addCase(emissionSavedShipmentGraph.pending, (state) => {
        state.isSuccess = false;
        state.isLoadingEmissionSavedShipmentGraph = true;
      })
      .addCase(emissionSavedShipmentGraph.fulfilled, (state, action) => { 
        state.isSuccess = true;
        state.emissionSavedShipmentGraphData = action.payload;
        state.isLoadingEmissionSavedShipmentGraph = false;
      })
      .addCase(emissionSavedShipmentGraph.rejected, (state, action) => {  
        state.isError = action.payload;
        state.isSuccess = false;
        state.isLoadingEmissionSavedShipmentGraph = isCancelRequest(action?.payload);
      })
      .addCase(emissionSavedEmissionGraph.pending, (state) => {
        state.isSuccess = false;
        state.isLoadingEmissionSavedEmissionGraph = true;
      })
      .addCase(emissionSavedEmissionGraph.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.emissionSavedEmissionGraphData = action.payload;
        state.isLoadingEmissionSavedEmissionGraph = false;
      })
      .addCase(emissionSavedEmissionGraph.rejected, (state, action) => {
        state.isError = action.payload;
        state.isSuccess = false;
        state.isLoadingEmissionSavedEmissionGraph = isCancelRequest(action?.payload);
      })
      .addCase(emissionSavedEmissionTransactionTable.pending, (state) => {
        state.isSuccess = false;
        state.isLoadingEmissionSavedTransactionTable = true;
      })
      .addCase(emissionSavedEmissionTransactionTable.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.emissionSavedTransactionTableData = action.payload;
        state.isLoadingEmissionSavedTransactionTable = false;
      })
      .addCase(emissionSavedEmissionTransactionTable.rejected, (state, action) => {
        state.isError = action.payload;
        state.isSuccess = false;
        state.isLoadingEmissionSavedTransactionTable = isCancelRequest(action?.payload);
      })
      .addCase(emissionSavedFuelList.pending, (state) => {  
        state.isSuccess = false;
        state.isLoadingEmissionSavedFuelType = true;
      })
      .addCase(emissionSavedFuelList.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.emissionSavedFuelType = action.payload;
        state.isLoadingEmissionSavedFuelType = false;
      })
      .addCase(emissionSavedFuelList.rejected, (state, action) => {
        state.isError = action.payload;
        state.isSuccess = false;
        state.isLoadingEmissionSavedFuelType = isCancelRequest(action?.payload);
      })
  },
});

export const { resetEmissionSaved } = emissionSavedReducer.actions;
export default emissionSavedReducer.reducer;
