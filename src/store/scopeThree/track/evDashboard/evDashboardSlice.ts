import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { EvDashboardInterface } from "./evDashboardInterface";
import { dateToUTC, downloadCSV, getErrorMessage, isCancelRequest } from "../../../../utils";
import evDashboardService from "./evDashboardService";

// Define the shape of the state

// Initial state
export const initialState: EvDashboardInterface = {
  isError: false,
  isSuccess: false,
  isLoading: false,
  evDashboardLoading: false,
  isLoadingShipmentLane: false,
  shipmentLaneData: null,
  listOfCarriers: null,
  isLoadingListOfCarriers: false,
  masterCarrierData: null,
  isLoadingMasterCarrierData: false,
  isLoadingShipmentByDate: false,
  shipmentByDateData: null,
  isLoadingEvMatrics: false,
  evMatricsData: null,
  isLoadingEvFilterDate: false,
  evFilterData: null,
  isLoadingEvShipmentLaneList: false,
  evShipmentLaneListData: null,
  isLoadingDwonloadEvData: false,
  totalTonMileData: null,
  isLoadingTotalTonMileData: false,
  dwonloadEvData: null
};

// Async Thunks 


export const getEvShipmentMatrics = createAsyncThunk("get/ev/dashboard/matrics", async (data: any, thunkApi: any) => {
  try {
    return await evDashboardService.evDashboardMatricsApi(data);
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
});

export const getEvFilterDates = createAsyncThunk("get/ev/filter/dates", async (data: any, thunkApi: any) => {
  try {
    return await evDashboardService.evFilterDatesApi(data);
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
});

export const getShipmentLane = createAsyncThunk("get/ev/shipment/by/lane", async (data: any, thunkApi: any) => {
  try {
    return await evDashboardService.shipmentLaneDataApi(data);
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
});

export const getShipmentByDate = createAsyncThunk("get/ev/shipment/by/date", async (data: any, thunkApi: any) => {
  try {
    return await evDashboardService.shipmentByDateApi(data);
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
}
);

export const getShipmentLaneList = createAsyncThunk("get/ev/shipment/lane/list", async (data: any, thunkApi: any) => {
  try {
    return await evDashboardService.shipmentLaneListApi(data);
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
});


export const getlistOfCarriers = createAsyncThunk("get/carrier/list/master", async (userData:any, thunkApi: any) => {
  try {
    return await evDashboardService.getListOfCarriersApi(userData);
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
});

export const getCarriersMaterData = createAsyncThunk("get/carrier/master/data", async (data: any, thunkApi: any) => {
  try {
    return await evDashboardService.getCarriersMaterDataApi(data);
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
});

export const getTotalTonMileData = createAsyncThunk("get/total/ton/mile/master/dash", async (data: any, thunkApi: any) => {
  try {
    return await evDashboardService.getTotalTonMileApi(data);
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
});

export const getEvDataDownload = createAsyncThunk("get/ev/data/download", async (data: any, thunkApi: any) => {
  try {
    const res = await evDashboardService.getEvReportApi(data);
    downloadCSV(res,(`ev_report_${dateToUTC(new Date())}.xlsx`), 'application/octet-stream' )
    return res
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
});

export const isLoadingEvDashboard = createAsyncThunk("isLoadingEvDashboard", async (status: boolean) => {
  return status
})


// Define the dashboard region reducer
export const evDashboardReducer = createSlice({
  name: "ev-dashboard-Page",
  initialState,
  reducers: {
    resetEvDashboard: () => initialState,
    resetEvGraphsData: (state) => { state.shipmentLaneData = null;
      state.listOfCarriers = null;
      state.masterCarrierData = null;
      state.shipmentByDateData = null;
      state.evMatricsData = null;
      state.evFilterData = null;
      state.evShipmentLaneListData = null;
      state.totalTonMileData = null;
      state.dwonloadEvData = null}
  },
  extraReducers: (builder) => {
    // Handle fulfilled actions for changing region, lane, facility, and carrier
    builder
      .addCase(isLoadingEvDashboard.fulfilled, (state, action) => {
        // Handle successful fulfillment of facility table data
        state.evDashboardLoading = true;
      })
      .addCase(getShipmentLane.pending, (state) => {
        state.isSuccess = false;
        state.isLoadingShipmentLane = true;
        state.shipmentLaneData = null;
      })
      .addCase(getShipmentLane.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoadingShipmentLane = false;
        state.shipmentLaneData = action.payload;
      })
      .addCase(getShipmentLane.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.shipmentLaneData = null;
        state.isLoadingShipmentLane = isCancelRequest(action?.payload);
      })
      .addCase(getShipmentByDate.pending, (state) => {
        state.isSuccess = false;
        state.isLoadingShipmentByDate= true;
        state.shipmentByDateData = null;
      })
      .addCase(getShipmentByDate.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoadingShipmentByDate = false;
        state.shipmentByDateData = action.payload;
      })
      .addCase(getShipmentByDate.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.shipmentByDateData = null;
        state.isLoadingShipmentByDate = isCancelRequest(action?.payload);
      })
      .addCase(getEvShipmentMatrics.pending, (state) => {
        state.isSuccess = false;
        state.isLoadingEvMatrics= true;
        state.shipmentByDateData = null;
      })
      .addCase(getEvShipmentMatrics.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoadingEvMatrics = false;
        state.evMatricsData = action.payload;
      })
      .addCase(getEvShipmentMatrics.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.evMatricsData = null;
        state.isLoadingEvMatrics = isCancelRequest(action?.payload);
      })
      .addCase(getEvFilterDates.pending, (state) => {
        state.isSuccess = false;
        state.isLoadingEvFilterDate= true;
        state.evFilterData = null;
      })
      .addCase(getEvFilterDates.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoadingEvFilterDate = false;
        state.evFilterData = action.payload;
      })
      .addCase(getEvFilterDates.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.evFilterData = null;
        state.isLoadingEvFilterDate = isCancelRequest(action?.payload);
      })
      .addCase(getShipmentLaneList.pending, (state) => {
        state.isSuccess = false;
        state.isLoadingEvShipmentLaneList= true;
        state.evShipmentLaneListData = null;
      })
      .addCase(getShipmentLaneList.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoadingEvShipmentLaneList = false;
        state.evShipmentLaneListData = action.payload;
      })
      .addCase(getShipmentLaneList.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.evShipmentLaneListData = null;
        state.isLoadingEvShipmentLaneList = isCancelRequest(action?.payload);
      })

       .addCase(getlistOfCarriers.pending, (state) => {
        state.listOfCarriers = null;
        state.isLoadingListOfCarriers = true
      })
      .addCase(getlistOfCarriers.fulfilled, (state, action) => {
        state.listOfCarriers = action.payload;
        state.isLoadingListOfCarriers = false
      })
      .addCase(getlistOfCarriers.rejected, (state, action) => {
        state.listOfCarriers = null;
        state.isLoadingListOfCarriers = isCancelRequest(action?.payload);
      })
      .addCase(getTotalTonMileData.pending, (state) => {
        state.totalTonMileData = null;
        state.isLoadingTotalTonMileData = true
      })
      .addCase(getTotalTonMileData.fulfilled, (state, action) => {
        state.totalTonMileData = action.payload;
        state.isLoadingTotalTonMileData = false
      })
      .addCase(getTotalTonMileData.rejected, (state, action) => {
        state.totalTonMileData = null;
        state.isLoadingTotalTonMileData = isCancelRequest(action?.payload);
      })
      .addCase(getCarriersMaterData.pending, (state) => {
        state.masterCarrierData = null;
        state.isLoadingMasterCarrierData = true
      })
      .addCase(getCarriersMaterData.fulfilled, (state, action) => {
        state.masterCarrierData = action.payload;
        state.isLoadingMasterCarrierData = false
      })
      .addCase(getCarriersMaterData.rejected, (state, action) => {
        state.masterCarrierData = null;
        state.isLoadingMasterCarrierData = isCancelRequest(action?.payload);
      })
      .addCase(getEvDataDownload.pending, (state) => {
        state.isLoadingDwonloadEvData = true
        state.dwonloadEvData = null
      })
      .addCase(getEvDataDownload.fulfilled, (state, action) => {
        state.isLoadingDwonloadEvData = false
        state.dwonloadEvData = action.payload
      })
      .addCase(getEvDataDownload.rejected, (state, action) => {
        state.isLoadingDwonloadEvData = isCancelRequest(action?.payload);
        state.dwonloadEvData = null
      })
  },
});

// Export the action and reducer
export const { resetEvDashboard, resetEvGraphsData } = evDashboardReducer.actions;
export default evDashboardReducer.reducer;
