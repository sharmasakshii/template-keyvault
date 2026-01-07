import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DecarbInterface } from "./decarbInterface";
import { getErrorMessage, isCancelRequest } from "../../../../utils";
import decarbService from "./decarbService";

// Define the shape of the state

// Initial state
const initialState: DecarbInterface = {
  isError: false,
  isSuccess: false,
  isLoading: false,
  decarbLaneList: null,
  decarbLaneListLoading: false,
  decarbProblemLanesData: null,
  decarbProblemLanesLoading: false,
  message: "",
  optimusLanesData: null,
  optimusLanesLoading: false,
  optimusCordinatesData: null,
  optimusCordinatesLoading: false
};

// Async Thunks for changing region, lane, facility, and carrier

export const decarbLineData = createAsyncThunk("get/decarb/line-Data", async (data: any, thunkApi: any) => {
  try {
    return await decarbService.decarbDataGet(data);
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
}
);

export const decarbProblemLanes = createAsyncThunk(
  "get/decarb/problem-lanes-Data",
  async (data: any, thunkApi: any) => {
    try {
      return await decarbService.decarbProblemLanesDataGet(data);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getOptimusLanes = createAsyncThunk(
  "get/optimus/lanes",
  async (data: any, thunkApi: any) => {
    try {
      return await decarbService.optimusLanesApi(data);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getOptimusCordinates = createAsyncThunk(
  "get/optimus/lanes/cordinate",
  async (data: any, thunkApi: any) => {
    try {
      return await decarbService.optimusRouteCordinates(data);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const isLoadingDecarbDashboard = createAsyncThunk("isLoadingDecarbDashboard", async (status: boolean) => {
  return status
})


// Define the dashboard region reducer
export const decarbReducer = createSlice({
  name: "dashboard-Page",
  initialState,
  reducers: {
    resetDecarbData: () => initialState,
  },
  extraReducers: (builder) => {
    // Handle fulfilled actions for changing region, lane, facility, and carrier
    builder
      .addCase(isLoadingDecarbDashboard.fulfilled, (state, action) => {
        state.optimusLanesLoading = true;
        state.optimusCordinatesLoading = true;
      })
      .addCase(decarbLineData.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.decarbLaneListLoading = true;
        state.decarbLaneList = null;
      })
      .addCase(decarbLineData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.decarbLaneListLoading = false;
        state.decarbLaneList = action.payload;
      })
      .addCase(decarbLineData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.decarbLaneList = null;
        state.decarbLaneListLoading = isCancelRequest(action?.payload);
      })
      .addCase(decarbProblemLanes.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.decarbProblemLanesData = null;
        state.decarbProblemLanesLoading = true;
      })
      .addCase(decarbProblemLanes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.decarbProblemLanesData = action?.payload;
        state.decarbProblemLanesLoading = false;
      })
      .addCase(decarbProblemLanes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.decarbProblemLanesData = null;
        state.decarbProblemLanesLoading = isCancelRequest(action?.payload);
      })
      .addCase(getOptimusLanes.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.optimusLanesData = null;
        state.optimusLanesLoading = true;
        state.optimusCordinatesLoading = true;
      })
      .addCase(getOptimusLanes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.optimusLanesData = action?.payload;
        state.optimusLanesLoading = false;
      })
      .addCase(getOptimusLanes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.optimusLanesData = null;
        state.optimusLanesLoading = isCancelRequest(action?.payload);
      })
      .addCase(getOptimusCordinates.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.optimusCordinatesData = null;
        state.optimusCordinatesLoading = true;
      })
      .addCase(getOptimusCordinates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.optimusCordinatesData = action?.payload;
        state.optimusCordinatesLoading = false;
      })
      .addCase(getOptimusCordinates.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.optimusCordinatesData = null;
        state.optimusCordinatesLoading = isCancelRequest(action?.payload);
      })
  },
});

// Export the action and reducer
export const { resetDecarbData } = decarbReducer.actions;
export default decarbReducer.reducer;
