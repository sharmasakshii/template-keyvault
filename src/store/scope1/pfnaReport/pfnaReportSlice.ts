import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import pfnaReportService from "./pfnaReportService";
import { getErrorMessage, isCancelRequest } from "utils";
import { PfnaReportInterface } from "./pfnaReportInterface";
import fuelReportService from "../fuelReport/fuelReportService";

// Define the shape of the state

export const initialState: PfnaReportInterface = {
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    fuelConsumptionReportLocationData: null,
    isLoadingfuelConsumptionReportLocation: false,
    fuelConsumptionReportEmissionLocationData: null,
    isLoadingfuelConsumptionReportEmissionLocation: false,
    searchLocationFilterData: null,
    isLoadingsearchLocationFilter: false,
    fuelConsumptionReportGraphData: null,
    isLoadingfuelConsumptionReportGraph: false,
    isLoadingPfnaTotalEmissionFuel: false,
    pfnaTotalEmissionFuelData: null,
    pfnaFuelConsumptionReportPeriodGraphData: null,
    isLoadingPfnaFuelConsumptionReportPeriodGraph: false,
    pfnaFuelEmissionsReportPeriodData: null,
    isLoadingPfnaFuelEmissionsReportPeriodGraph: false,
    pfnaFuelConsumptionPercentageData: null,
    isLoadingPfnaFuelConsumptionPercentage: false,
    pfnaFuelEmissionPercentageData: null,
    isLoadingPfnaFuelEmissionPercentage: false,
    isLoadingPfnaFuelList: false,
    pfnaFuelListData: null,
};

export const getFuelConsumptionReport = createAsyncThunk("get/scope1/pfna/fuel/consumption/report",
    async (userData: any, thunkApi) => {
        try {
            return await pfnaReportService.getFuelConsumptionReportApi(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const getPfnaTotaEmissionFuel = createAsyncThunk("get/scope1/pfna/total/emission/fuel",
    async (userData: any, thunkApi) => {
        try {
            return await pfnaReportService.getPfnaTotaEmissionFuelApi(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);
export const getPfnaFuelConsumptionReportPeriod = createAsyncThunk("get/scope1/pfna/fuel/consumption/report/by/period",
    async (userData: any, thunkApi) => {
        try {
            return await pfnaReportService.getPfnaFuelConsumptionReportPeriodApi(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);
export const getPfnaFuelEmissionsReportPeriod = createAsyncThunk("get/scope1/pfna/fuel/emissions/report/by/period",
    async (userData: any, thunkApi) => {
        try {
            return await pfnaReportService.getPfnaFuelConsumptionReportPeriodApi(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);
export const getPfnaFuelConsumptionByPercentage = createAsyncThunk("get/scope1/pfna/fuel/consumption/by/percentage",
    async (userData: any, thunkApi) => {
        try {
            return await pfnaReportService.getPfnaFuelConsumptionByPercentageApi(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);
export const getPfnaFuelEmissionByPercentage = createAsyncThunk("get/scope1/pfna/fuel/emission/by/percentage",
    async (userData: any, thunkApi) => {
        try {
            return await pfnaReportService.getPfnaFuelConsumptionByPercentageApi(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const getPfnaFuelList = createAsyncThunk("get/scope1/pfna/fuel/list",
    async (_, thunkApi) => {
        try {
            return await pfnaReportService.getPfnaFuelListApi();
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);


export const getFuelConsumptionReportLocation = createAsyncThunk("get/scope1/pfna/fuel/consumption/report/location",
    async (userData: any, thunkApi) => {
        try {
            return await pfnaReportService.getFuelConsumptionReportLocationApi(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const getFuelConsumptionReportEmissionLocation = createAsyncThunk("get/scope1/pfna/fuel/consumption/report/emission/location",
    async (userData: any, thunkApi) => {
        try {
            return await pfnaReportService.getFuelConsumptionReportLocationApi(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);
export const getSearchLocationFilter = createAsyncThunk("get/scope1/pfna/search/location/filter",
    async (userData: any, thunkApi) => {
        try {
            return await fuelReportService.getTransactionFilter(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const scopeOnePfnaReportReducer = createSlice({
    name: "scope-one-pfna-report",
    initialState,
    reducers: {
        resetScopeOnePfnaReport: () => initialState,
    },

    extraReducers: (builder) => {
        builder
            .addCase(getFuelConsumptionReport.pending, (state) => {
                state.isLoadingfuelConsumptionReportGraph = true;
                state.fuelConsumptionReportGraphData = null
            })
            .addCase(getFuelConsumptionReport.fulfilled, (state, action) => {
                state.fuelConsumptionReportGraphData = action.payload;
                state.isLoadingfuelConsumptionReportGraph = false;
            })
            .addCase(getFuelConsumptionReport.rejected, (state, action) => {
                state.isLoadingfuelConsumptionReportGraph = isCancelRequest(action?.payload);
                state.fuelConsumptionReportGraphData = null
            })
          
            .addCase(getPfnaTotaEmissionFuel.pending, (state) => {
                state.isLoadingPfnaTotalEmissionFuel = true;
                state.pfnaTotalEmissionFuelData = null
            })
            .addCase(getPfnaTotaEmissionFuel.fulfilled, (state, action) => {
                state.pfnaTotalEmissionFuelData = action.payload;
                state.isLoadingPfnaTotalEmissionFuel = false;
            })
            .addCase(getPfnaTotaEmissionFuel.rejected, (state, action) => {
                state.isLoadingPfnaTotalEmissionFuel = isCancelRequest(action?.payload);
                state.pfnaTotalEmissionFuelData = null
            })
            .addCase(getPfnaFuelConsumptionReportPeriod.pending, (state) => {
                state.isLoadingPfnaFuelConsumptionReportPeriodGraph = true;
                state.pfnaFuelConsumptionReportPeriodGraphData = null
            })
            .addCase(getPfnaFuelConsumptionReportPeriod.fulfilled, (state, action) => {
                state.pfnaFuelConsumptionReportPeriodGraphData = action.payload;
                state.isLoadingPfnaFuelConsumptionReportPeriodGraph = false;
            })
            .addCase(getPfnaFuelConsumptionReportPeriod.rejected, (state, action) => {
                state.isLoadingPfnaFuelConsumptionReportPeriodGraph = isCancelRequest(action?.payload);
                state.pfnaFuelConsumptionReportPeriodGraphData = null
            })
            .addCase(getPfnaFuelEmissionsReportPeriod.pending, (state) => {
                state.isLoadingPfnaFuelEmissionsReportPeriodGraph = true;
                state.pfnaFuelEmissionsReportPeriodData = null
            })
            .addCase(getPfnaFuelEmissionsReportPeriod.fulfilled, (state, action) => {
                state.pfnaFuelEmissionsReportPeriodData = action.payload;
                state.isLoadingPfnaFuelEmissionsReportPeriodGraph = false;
            })
            .addCase(getPfnaFuelEmissionsReportPeriod.rejected, (state, action) => {
                state.isLoadingPfnaFuelEmissionsReportPeriodGraph = isCancelRequest(action?.payload);
                state.pfnaFuelEmissionsReportPeriodData = null
            })
            .addCase(getPfnaFuelConsumptionByPercentage.pending, (state) => {
                state.isLoadingPfnaFuelConsumptionPercentage = true;
                state.pfnaFuelConsumptionPercentageData = null
            })
            .addCase(getPfnaFuelConsumptionByPercentage.fulfilled, (state, action) => {
                state.pfnaFuelConsumptionPercentageData = action.payload;
                state.isLoadingPfnaFuelConsumptionPercentage = false;
            })
            .addCase(getPfnaFuelConsumptionByPercentage.rejected, (state, action) => {
                state.isLoadingPfnaFuelConsumptionPercentage = false
                state.pfnaFuelConsumptionPercentageData = null
            })
            .addCase(getPfnaFuelEmissionByPercentage.pending, (state) => {
                state.isLoadingPfnaFuelEmissionPercentage = true;
                state.pfnaFuelEmissionPercentageData = null
            })
            .addCase(getPfnaFuelEmissionByPercentage.fulfilled, (state, action) => {
                state.pfnaFuelEmissionPercentageData = action.payload;
                state.isLoadingPfnaFuelEmissionPercentage = false;
            })
            .addCase(getPfnaFuelEmissionByPercentage.rejected, (state, action) => {
                state.isLoadingPfnaFuelEmissionPercentage = false;
                state.pfnaFuelEmissionPercentageData = null
            })
            .addCase(getPfnaFuelList.pending, (state) => {
                state.isLoadingPfnaFuelList = true;
                state.pfnaFuelListData = null
            })
            .addCase(getPfnaFuelList.fulfilled, (state, action) => {
                state.pfnaFuelListData = action.payload;
                state.isLoadingPfnaFuelList = false;
            })
            .addCase(getPfnaFuelList.rejected, (state, action) => {
                state.isLoadingPfnaFuelList = false;
                state.pfnaFuelListData = null
            })
            .addCase(getFuelConsumptionReportLocation.pending, (state) => {
                state.isLoadingfuelConsumptionReportLocation = true;
                state.fuelConsumptionReportLocationData = null
            })
            .addCase(getFuelConsumptionReportLocation.fulfilled, (state, action) => {
                state.fuelConsumptionReportLocationData = action.payload;
                state.isLoadingfuelConsumptionReportLocation = false;
            })
            .addCase(getFuelConsumptionReportLocation.rejected, (state, action) => {
                state.isLoadingfuelConsumptionReportLocation = false;
                state.fuelConsumptionReportLocationData = null
            })
            .addCase(getFuelConsumptionReportEmissionLocation.pending, (state) => {
                state.isLoadingfuelConsumptionReportEmissionLocation = true;
                state.fuelConsumptionReportEmissionLocationData = null
            })
            .addCase(getFuelConsumptionReportEmissionLocation.fulfilled, (state, action) => {
                state.fuelConsumptionReportEmissionLocationData = action.payload;
                state.isLoadingfuelConsumptionReportEmissionLocation = false;
            })
            .addCase(getFuelConsumptionReportEmissionLocation.rejected, (state, action) => {
                state.isLoadingfuelConsumptionReportEmissionLocation = false;
                state.fuelConsumptionReportEmissionLocationData = null
            })
            .addCase(getSearchLocationFilter.pending, (state) => {
                state.isLoadingsearchLocationFilter = true;
                state.searchLocationFilterData = null
            })
            .addCase(getSearchLocationFilter.fulfilled, (state, action) => {
                state.searchLocationFilterData = action.payload;
                state.isLoadingsearchLocationFilter = false;
            })
            .addCase(getSearchLocationFilter.rejected, (state, action) => {
                state.isLoadingsearchLocationFilter = isCancelRequest(action?.payload);
                state.searchLocationFilterData = null
            })
    },
});

export const { resetScopeOnePfnaReport } = scopeOnePfnaReportReducer.actions;
export default scopeOnePfnaReportReducer.reducer;