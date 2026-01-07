import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import localFreightService from "./localFreightService";
import { getErrorMessage, isCancelRequest } from "../../utils";
import { LocalFreightState } from "./localFreightInterface";

/**
 * Redux Slice for managing bid planning data
 */

// Define the shape of the state

// Initial state
export const initialState: LocalFreightState = {
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    isLoadingTruckFuelTypesPieChart: false,
    truckFuelTypesPieChart: null,
    isLoadingEmissionIntensityRNGBarChart: false,
    costEmissionIntensityRNGBarChart: null,
    isLoadingKeyMetricsSummaryLocalFreight: false,
    keyMetricsSummaryLocalFreight: null,
    isLoadingLaneNameLocalFreight: false,
    laneNameLocalFreight: null,
    rngFreightDate: null,
    keyMetricsAlternativeDto: null,
    keyMetricsAlternativeDtoLoading: false,
    listOfAllLanesByShipmentsDto: null,
    listOfAllLanesByShipmentsDtoLoading: false,
    lanesByFuelUsageAndMileageDto: null,
    lanesByFuelUsageAndMileageDtoLoading: false,
    lanesByFuelStackeByEmissionsDto: null,
    lanesByFuelStackeByEmissionsDtoLoading: false,
    lanesByFuelStackeByQuantityDto: null,
    lanesByFuelStackeByQuantityDtoLoading: false,
    lanesByFuelStackeByMileageDto: null,
    lanesByFuelStackeByMileageDtoLoading: false,
    totalEmissionGraphByLaneAndFuelType: null,
    totalEmissionGraphByLaneAndFuelTypeLoading: false,
    laneStatisticsDto: null,
    isLoadinglaneStatistics: false,
    alternativeCarrierList: null,
    isLoadingAlternativeCarriers: false,
    alternativeFuelFiltersLoading: false,
    alternativeFuelFiltersDto: null,
    alternativeFuelTotalShipmentsLoading: false,
    alternativeFuelTotalShipmentsDto: null,
    alternativeFuelListLoading: false,
    alternativeFuelListDto: null,
    isLoadingCountryList: false,
    countryListData: null,
    isLoadingTotalEmissionsbyCarrierList: false,
    totalEmissionsbyCarrierListData: null,
    isLoadingMileagebyCarrierList: false,
    mileagebyCarrierListData: null,
    isLoadingSchneider:false,
    schneiderData:null,
}

export const getAlternativeCountryList = createAsyncThunk("get/alternative/country/list", async (_, thunkApi: any) => {
    try {
        return await localFreightService.alternativeCountryList();
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});

export const getAlternativeCarriers = createAsyncThunk("get/alternative/carrier/list", async (payload: any, thunkApi: any) => {
    try {
        return await localFreightService.alternativeCarriersApi(payload);
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});

export const getKeyMetricsAlternative = createAsyncThunk("get/key/metrics/alternative", async (payload: any, thunkApi) => {
    try {
        return await localFreightService.getKeyMetricsDateApi(payload)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});

export const getListOfAllLanesByShipments = createAsyncThunk("get/all/list/lane/alternative", async (payload: any, thunkApi) => {
    try {
        return await localFreightService.getListOfAllLanesByShipmentsApi(payload)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});

export const getLanesByFuelUsageAndMileage = createAsyncThunk("get/lane/fuel/usage/and/mileage/alternative", async (payload: any, thunkApi) => {
    try {
        return await localFreightService.getLanesByFuelUsageAndMileageApi(payload)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});

export const getStackedGraphByLaneAndFuelTypeEmission = createAsyncThunk("get/stack/chart/emission", async (payload: any, thunkApi) => {
    try {
        return await localFreightService.getStackedGraphByLaneAndFuelTypeApi(payload)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});

export const getStackedGraphByLaneAndFuelTypeQuantity = createAsyncThunk("get/stack/chart/quantity", async (payload: any, thunkApi) => {
    try {
        return await localFreightService.getStackedGraphByLaneAndFuelTypeApi(payload)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});

export const getStackedGraphByLaneAndFuelTypeMileage = createAsyncThunk("get/stack/chart/mileage", async (payload: any, thunkApi) => {
    try {
        const res = await localFreightService.getStackedGraphByLaneAndFuelTypeApi(payload)
        return res
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});

export const getTotalEmissionGraphByLaneAndFuelType = createAsyncThunk("get/emission/chart/mileage", async (payload: any, thunkApi) => {
    try {
        return await localFreightService.getTotalEmissionGraphByLaneAndFuelTypeApi(payload)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});


export const getLaneStatistics = createAsyncThunk("get/lane/Statistics/mileage", async (payload: any, thunkApi) => {
    try {
        return await localFreightService.getLaneStatisticsApi(payload)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});
export const getAlternativeLaneFuelFilters = createAsyncThunk("get/lane/Fuel/Filters", async (payload: any, thunkApi) => {
    try {
        return await localFreightService.getLaneFuelFilters(payload)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});

export const getAlternativeFuelTotalShipments = createAsyncThunk("get/alternative/total/shipment", async (payload: any, thunkApi) => {
    try {
        return await localFreightService.getAlternativeFuelTotalShipmentsApi(payload)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});

export const getAlternativeFuelsType = createAsyncThunk("get/alternative/fuel/type", async (payload: any, thunkApi) => {
    try {
        return await localFreightService.getAlternativeFuelsApi(payload)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});
export const getTotalEmissionsDataByCarrier = createAsyncThunk("get/alternative/total/emissions/carrier", async (payload: any, thunkApi) => {
    try {
        return await localFreightService.getTotalDataByCarrierApi(payload)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});
export const getMileageDataByCarrier = createAsyncThunk("get/alternative/total/mileage/carrier", async (payload: any, thunkApi) => {
    try {
        return await localFreightService.getTotalDataByCarrierApi(payload)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});

export const getSchneider = createAsyncThunk("get/Schneider", async (payload: any, thunkApi) => {
    try {
        return await localFreightService.getSchneiderApi(payload)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});

export const isLoadingAlternativeDashboard = createAsyncThunk("isLoadingAlternativeDashboard", async (status: boolean) => {
    return status
})


export const localFreightDataReducer = createSlice({
    name: "local-freight",
    initialState,
    reducers: {
        resetLocalFreight: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(isLoadingAlternativeDashboard.fulfilled, (state, action) => {
                // Set loading state
                state.keyMetricsAlternativeDtoLoading = action?.payload;
                state.isLoadinglaneStatistics = action?.payload;
                state.isLoadingTruckFuelTypesPieChart = action?.payload
                state.isLoadingEmissionIntensityRNGBarChart = action?.payload
                state.isLoadingKeyMetricsSummaryLocalFreight = action?.payload
                state.isLoadingLaneNameLocalFreight = action?.payload
                state.listOfAllLanesByShipmentsDtoLoading = action?.payload
                state.lanesByFuelUsageAndMileageDtoLoading = action?.payload
                state.lanesByFuelStackeByEmissionsDtoLoading = action?.payload
                state.lanesByFuelStackeByQuantityDtoLoading = action?.payload
                state.lanesByFuelStackeByMileageDtoLoading = action?.payload
                state.totalEmissionGraphByLaneAndFuelTypeLoading = action?.payload
            })
            .addCase(getAlternativeCountryList.pending, (state) => {
                state.isLoadingCountryList = true
                state.countryListData = null

            })
            .addCase(getAlternativeCountryList.fulfilled, (state, action) => {
                state.isLoadingCountryList = false
                state.countryListData = action.payload
            })
            .addCase(getAlternativeCountryList.rejected, (state, action) => {
                state.isLoadingCountryList = false
                state.countryListData = null
            })
            .addCase(getAlternativeCarriers.pending, (state) => {
                state.isLoadingAlternativeCarriers = true
                state.alternativeCarrierList = null
                state.keyMetricsAlternativeDto = null
                state.listOfAllLanesByShipmentsDto = null
                state.totalEmissionGraphByLaneAndFuelType = null
                state.laneStatisticsDto = null
                state.alternativeFuelTotalShipmentsDto = null
                state.lanesByFuelStackeByEmissionsDto = null
                state.lanesByFuelStackeByQuantityDto = null
                state.lanesByFuelStackeByMileageDto = null
                state.lanesByFuelUsageAndMileageDto = null
                state.mileagebyCarrierListData = null
                state.totalEmissionsbyCarrierListData = null
            })
            .addCase(getAlternativeCarriers.fulfilled, (state, action) => {
                state.isLoadingAlternativeCarriers = false
                state.alternativeCarrierList = action.payload
            })
            .addCase(getAlternativeCarriers.rejected, (state, action) => {
                state.isLoadingAlternativeCarriers = isCancelRequest(action?.payload)
                state.alternativeCarrierList = null
            })
            .addCase(getKeyMetricsAlternative.pending, (state) => {
                state.keyMetricsAlternativeDtoLoading = true
                state.keyMetricsAlternativeDto = null
            })
            .addCase(getKeyMetricsAlternative.fulfilled, (state, action) => {
                state.keyMetricsAlternativeDtoLoading = false
                state.keyMetricsAlternativeDto = action.payload
            })
            .addCase(getKeyMetricsAlternative.rejected, (state, action) => {
                state.keyMetricsAlternativeDtoLoading = isCancelRequest(action?.payload)
                state.keyMetricsAlternativeDto = null
            })
            .addCase(getLaneStatistics.pending, (state) => {
                state.isLoadinglaneStatistics = true
                state.laneStatisticsDto = null
            })
            .addCase(getLaneStatistics.fulfilled, (state, action) => {
                state.isLoadinglaneStatistics = false
                state.laneStatisticsDto = action.payload
            })
            .addCase(getLaneStatistics.rejected, (state, action) => {
                state.isLoadinglaneStatistics = false
                state.laneStatisticsDto = null
            })
            .addCase(getTotalEmissionGraphByLaneAndFuelType.pending, (state) => {
                state.totalEmissionGraphByLaneAndFuelTypeLoading = true
                state.totalEmissionGraphByLaneAndFuelType = null
            })
            .addCase(getTotalEmissionGraphByLaneAndFuelType.fulfilled, (state, action) => {
                state.totalEmissionGraphByLaneAndFuelTypeLoading = false
                state.totalEmissionGraphByLaneAndFuelType = action.payload
            })
            .addCase(getTotalEmissionGraphByLaneAndFuelType.rejected, (state, action) => {
                state.totalEmissionGraphByLaneAndFuelTypeLoading = isCancelRequest(action?.payload)
                state.totalEmissionGraphByLaneAndFuelType = null
            })
            .addCase(getStackedGraphByLaneAndFuelTypeEmission.pending, (state) => {
                state.lanesByFuelStackeByEmissionsDtoLoading = true
                state.lanesByFuelStackeByEmissionsDto = null
            })
            .addCase(getStackedGraphByLaneAndFuelTypeEmission.fulfilled, (state, action) => {
                state.lanesByFuelStackeByEmissionsDtoLoading = false
                state.lanesByFuelStackeByEmissionsDto = action.payload
            })
            .addCase(getStackedGraphByLaneAndFuelTypeEmission.rejected, (state, action) => {
                state.lanesByFuelStackeByEmissionsDtoLoading = isCancelRequest(action?.payload)
                state.lanesByFuelStackeByEmissionsDto = null
            })
            .addCase(getStackedGraphByLaneAndFuelTypeQuantity.pending, (state) => {
                state.lanesByFuelStackeByQuantityDtoLoading = true
                state.lanesByFuelStackeByQuantityDto = null
            })
            .addCase(getStackedGraphByLaneAndFuelTypeQuantity.fulfilled, (state, action) => {
                state.lanesByFuelStackeByQuantityDtoLoading = false
                state.lanesByFuelStackeByQuantityDto = action.payload
            })
            .addCase(getStackedGraphByLaneAndFuelTypeQuantity.rejected, (state, action) => {
                state.lanesByFuelStackeByQuantityDtoLoading = isCancelRequest(action?.payload)
                state.lanesByFuelStackeByQuantityDto = null
            })

            .addCase(getStackedGraphByLaneAndFuelTypeMileage.pending, (state) => {
                state.lanesByFuelStackeByMileageDtoLoading = true
                state.lanesByFuelStackeByMileageDto = null
            })
            .addCase(getStackedGraphByLaneAndFuelTypeMileage.fulfilled, (state, action) => {
                state.lanesByFuelStackeByMileageDtoLoading = false
                state.lanesByFuelStackeByMileageDto = action.payload
            })
            .addCase(getStackedGraphByLaneAndFuelTypeMileage.rejected, (state, action) => {
                state.lanesByFuelStackeByMileageDtoLoading = isCancelRequest(action?.payload)
                state.lanesByFuelStackeByMileageDto = null
            })
            .addCase(getLanesByFuelUsageAndMileage.pending, (state) => {
                state.lanesByFuelUsageAndMileageDtoLoading = true
                state.lanesByFuelUsageAndMileageDto = null
            })
            .addCase(getLanesByFuelUsageAndMileage.fulfilled, (state, action) => {
                state.lanesByFuelUsageAndMileageDtoLoading = false
                state.lanesByFuelUsageAndMileageDto = action.payload
            })
            .addCase(getLanesByFuelUsageAndMileage.rejected, (state, action) => {
                state.lanesByFuelUsageAndMileageDtoLoading = isCancelRequest(action?.payload)
                state.lanesByFuelUsageAndMileageDto = null
            })
            .addCase(getListOfAllLanesByShipments.pending, (state) => {
                state.listOfAllLanesByShipmentsDtoLoading = true
                state.listOfAllLanesByShipmentsDto = null
            })
            .addCase(getListOfAllLanesByShipments.fulfilled, (state, action) => {
                state.listOfAllLanesByShipmentsDtoLoading = false
                state.listOfAllLanesByShipmentsDto = action.payload
            })
            .addCase(getListOfAllLanesByShipments.rejected, (state, action) => {
                state.listOfAllLanesByShipmentsDtoLoading = isCancelRequest(action?.payload)
                state.listOfAllLanesByShipmentsDto = null
            })
            .addCase(getAlternativeLaneFuelFilters.pending, (state) => {
                state.alternativeFuelFiltersLoading = true
                state.alternativeFuelFiltersDto = null
            })
            .addCase(getAlternativeLaneFuelFilters.fulfilled, (state, action) => {
                state.alternativeFuelFiltersLoading = false
                state.alternativeFuelFiltersDto = action.payload
            })
            .addCase(getAlternativeLaneFuelFilters.rejected, (state, action) => {
                state.alternativeFuelFiltersLoading = isCancelRequest(action?.payload)
                state.alternativeFuelFiltersDto = null
            })
            .addCase(getAlternativeFuelTotalShipments.pending, (state) => {
                state.alternativeFuelTotalShipmentsLoading = true
                state.alternativeFuelTotalShipmentsDto = null
            })
            .addCase(getAlternativeFuelTotalShipments.fulfilled, (state, action) => {
                state.alternativeFuelTotalShipmentsLoading = false
                state.alternativeFuelTotalShipmentsDto = action.payload
            })
            .addCase(getAlternativeFuelTotalShipments.rejected, (state, action) => {
                state.alternativeFuelTotalShipmentsLoading = isCancelRequest(action?.payload)
                state.alternativeFuelTotalShipmentsDto = null
            })
            .addCase(getAlternativeFuelsType.pending, (state) => {
                state.alternativeFuelListLoading = true
                state.alternativeFuelListDto = null
            })
            .addCase(getAlternativeFuelsType.fulfilled, (state, action) => {
                state.alternativeFuelListLoading = false
                state.alternativeFuelListDto = action.payload
            })
            .addCase(getAlternativeFuelsType.rejected, (state, action) => {
                state.alternativeFuelListLoading = isCancelRequest(action?.payload)
                state.alternativeFuelListDto = null
            })
            .addCase(getTotalEmissionsDataByCarrier.pending, (state) => {
                state.isLoadingTotalEmissionsbyCarrierList = true
                state.totalEmissionsbyCarrierListData = null
            })
            .addCase(getTotalEmissionsDataByCarrier.fulfilled, (state, action) => {
                state.isLoadingTotalEmissionsbyCarrierList = false
                state.totalEmissionsbyCarrierListData = action.payload
            })
            .addCase(getTotalEmissionsDataByCarrier.rejected, (state, action) => {
                state.isLoadingTotalEmissionsbyCarrierList = isCancelRequest(action?.payload)
                state.totalEmissionsbyCarrierListData = null
            })
            .addCase(getMileageDataByCarrier.pending, (state) => {
                state.isLoadingMileagebyCarrierList = true
                state.mileagebyCarrierListData = null
            })
            .addCase(getMileageDataByCarrier.fulfilled, (state, action) => {
                state.isLoadingMileagebyCarrierList = false
                state.mileagebyCarrierListData = action.payload
            })
            .addCase(getMileageDataByCarrier.rejected, (state, action) => {
                state.isLoadingMileagebyCarrierList = isCancelRequest(action?.payload)
                state.mileagebyCarrierListData = null
            })
              .addCase(getSchneider.pending, (state) => {
                state.isLoadingSchneider = true
                state.schneiderData = null
            })
            .addCase(getSchneider.fulfilled, (state, action) => {
                state.isLoadingSchneider = false
                state.schneiderData = action.payload
            })
            .addCase(getSchneider.rejected, (state, action) => {
                state.isLoadingSchneider = isCancelRequest(action?.payload)
                state.schneiderData = null
            })

            
    }
});

// Export actions and reducer
export const { resetLocalFreight } = localFreightDataReducer.actions;
export default localFreightDataReducer.reducer;
