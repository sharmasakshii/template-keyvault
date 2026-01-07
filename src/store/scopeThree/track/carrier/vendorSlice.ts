// Import necessary modules
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import vendorService from "./vendorService";
import { getErrorMessage, isCancelRequest } from "../../../../utils";
import { VendorDataInterface } from "./vendorDataInterface";



export const initialState: VendorDataInterface = {
    isError: false,
    isSuccess: false,
    isLoading: false,
    isLoadingVendorTableDetails: false,
    isLoadingExportVendorTableDetails: false,
    vendorTableDetailsExport: null,
    error: null,
    message: null,
    vendorTableDetails: null,
    carrierOverviewDetail: [],
    carrierOverviewDetailLoading: false,
    laneBreakdownDetail: null,
    laneBreakdownDetailLoading: false,
    laneCarrierListName: null,
    laneCarrierListNameLoading: false,
    getLaneCarrierCompaireDto: null,
    getLaneCarrierCompaireDtoLoading: false,
    laneCarrierTableDtoLoading: false,
    laneCarrierTableDto: null,
    isLoadingRegionCarrierTable: false,
    regionCarrierComparisonDataTable: null,
    carrierTypeEmissionDto: null,
    carrierTypeTableDto: null,
    isLoadingCarrierEmission: false,
    isLoadingCarrierTable: false,
    isLoadingTypeOverviewDetail: false,
    carrierTypeOverviewDetailDto: null,
    isLoadingCarrierTypeReductionGraph: false,
    carrierTypeReductionGraphDto: null,
    carrierTypeLaneEmissionGraphDto: null,
    carrierTypeLaneEmissionGraphDtoLoading: false,

};

// Define async thunks for various API calls
export const vendorTableData = createAsyncThunk(
    "get/vendor/table-Data",
    async (userData: Object, thunkApi) => {
        try {
            return await vendorService.vendorTableDataGet(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

// Define async thunks for export vender table data
export const vendorTableDataForExport = createAsyncThunk(
    "get/vendor/table-Data-export",
    async (userData: Object, thunkApi) => {
        try {
            return await vendorService.vendorTableDataGet(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);



// Define an async thunk to fetch carrier overview data for the graph
export const getCarrierOverviewData = createAsyncThunk(
    "get/vendor/Graph/Overview",
    async (userData: any, thunkApi) => {
        try {
            // Call the getCarrierOverview function from vendorService
            return await vendorService.getCarrierOverview(userData);
        } catch (error: any) {
            // Handle errors and return a rejected action with an error message
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

// Define an async thunk to fetch lane breakdown detail for the graph
export const getLaneBreakdown = createAsyncThunk(
    "get/vendor/Graph/detail",
    async (userData: any, thunkApi) => {
        try {
            // Call the getLaneBreakdown function from vendorService with the provided user data
            return await vendorService.getLaneBreakdown(userData);
        } catch (error: any) {
            // Handle errors and return a rejected action with an error message
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

// Define an async thunk to fetch lane carrier list names
export const getLaneCarrierList = createAsyncThunk(
    "get/carrier/name/detail",
    async (userData: any, thunkApi) => {
        try {
            // Call the getLaneCarrierList function from vendorService
            return await vendorService.getLaneCarrierList(userData);
        } catch (error: any) {
            // Handle errors and return a rejected action with an error message
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

// Define an async thunk to fetch lane carrier comparison data
export const getLaneCarrierCompaire = createAsyncThunk(
    "get/carrier/compaire/detail",
    async (userData: any, thunkApi) => {
        try {
            // Call the getLaneCarrierCompaire function from vendorService
            return await vendorService.getLaneCarrierCompaire(userData);
        } catch (error: any) {
            // Handle errors and return a rejected action with an error message
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

// Define an async thunk to fetch lane carrier table data
export const laneCarrierTableData = createAsyncThunk(
    "get/lane/carrier/table-Data",
    async (userData: any, thunkApi) => {
        try {
            // Call the laneCarrierTableDataApi function from vendorService
            return await vendorService.laneCarrierTableDataApi(userData);
        } catch (error: any) {
            // Handle errors and return a rejected action with an error message
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const getCarrierRegionComparisonTable = createAsyncThunk(
    "get/carrier/region-comparision-table",
    async (userData: any, thunkApi) => {
        try {
            // Call the laneCarrierTableDataApi function from vendorService
            return await vendorService.getRegionCarrierComparisonTable(userData);
        } catch (error: any) {
            // Handle errors and return a rejected action with an error message
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);


// Async Thunk for fetching region graph data
export const getCarrierTypeTableDto = createAsyncThunk(
    "get/carrier/type/Graph",
    async (payload: any, thunkApi) => {
        try {
            return await vendorService.getCarrierTypeTableDtoApi(payload);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const getCarrierTypeEmissionDto = createAsyncThunk(
    "get/carrier/type/emission/Graph",
    async (payload: any, thunkApi) => {
        try {
            return await vendorService.getCarrierTypeEmissionDtoApi(payload);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);


export const getCarrierTypeOverviewDetail = createAsyncThunk(
    "get/carrier/type/overview",
    async (payload: any, thunkApi) => {
        try {
            return await vendorService.getCarrierTypeOverviewDetailApi(payload);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const getCarrierTypeReductionGraph = createAsyncThunk(
    "get/carrier/type/reduction/graph",
    async (payload: any, thunkApi) => {
        try {
            return await vendorService.getCarrierTypeReductionGraphApi(payload);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const getCarrierTypeLaneEmissionGraph = createAsyncThunk(
    "get/carrier/type/lane/emission/graph",
    async (payload: any, thunkApi) => {
        try {
            return await vendorService.getCarrierTypeLaneEmissionGraphApi(payload);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);
// 

export const isLoadingCarrierDashboard = createAsyncThunk("isLoadingCarrierDashboard", async (status: boolean) => {
    return status
})


export const carrierDetailsReducer = createSlice({
    name: "vendor-Page",
    initialState,
    reducers: {
        resetCarrier: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(isLoadingCarrierDashboard.pending, (state) => {
                state.isLoadingVendorTableDetails = true;
                state.getLaneCarrierCompaireDtoLoading = true
                state.vendorTableDetailsExport = null
            })
            .addCase(vendorTableData.pending, (state) => {
                state.isLoadingVendorTableDetails = true;
                state.isSuccess = false;
                state.vendorTableDetails = null;
                state.vendorTableDetailsExport = null
                state.isError = false;
                state.error = null;
                state.getLaneCarrierCompaireDtoLoading = true


            })
            .addCase(vendorTableData.fulfilled, (state, action) => {
                state.isLoadingVendorTableDetails = false;
                state.isSuccess = true;
                state.vendorTableDetails = action.payload;
                state.isError = false;
                state.getLaneCarrierCompaireDtoLoading = false
                state.error = null;

            })
            .addCase(vendorTableData.rejected, (state, action) => {
                state.isLoadingVendorTableDetails = isCancelRequest(action?.payload);
                state.isError = true
                state.error = action.payload;
                state.vendorTableDetails = null;
                state.isSuccess = false;
                state.getLaneCarrierCompaireDtoLoading = false
            })
            .addCase(getCarrierOverviewData.pending, (state) => {
                state.carrierOverviewDetailLoading = true;
                state.isSuccess = false;
                state.carrierOverviewDetail = null;
            })
            .addCase(getCarrierOverviewData.fulfilled, (state, action) => {
                state.carrierOverviewDetailLoading = false;
                state.carrierOverviewDetail = action.payload;
                state.isError = false;
                state.error = null;
                state.isSuccess = false;
            })
            .addCase(getCarrierOverviewData.rejected, (state, action) => {
                state.carrierOverviewDetailLoading = isCancelRequest(action?.payload);
                state.isError = true;
                state.error = action.payload;
                state.isSuccess = false;
                state.carrierOverviewDetail = null
            })
            .addCase(getLaneBreakdown.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.laneBreakdownDetail = null;
                state.isError = false;
                state.error = null;
                state.laneBreakdownDetailLoading = true
            })
            .addCase(getLaneBreakdown.fulfilled, (state, action) => {
                state.isLoading = false;
                state.laneBreakdownDetail = action.payload;
                state.isSuccess = false;
                state.isError = false;
                state.error = null;
                state.laneBreakdownDetailLoading = false
            })
            .addCase(getLaneBreakdown.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.payload;
                state.isSuccess = false;
                state.laneBreakdownDetailLoading = isCancelRequest(action?.payload)
            })
            .addCase(getLaneCarrierList.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.error = null;
                state.laneCarrierListName = null
                state.getLaneCarrierCompaireDto = null
                state.laneCarrierListNameLoading = true
                state.getLaneCarrierCompaireDtoLoading = true

            })
            .addCase(getLaneCarrierList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.laneCarrierListName = action.payload;
                state.isSuccess = false;
                state.isError = false;
                state.error = null;
                state.laneCarrierListNameLoading = false
                state.getLaneCarrierCompaireDtoLoading = false
            })
            .addCase(getLaneCarrierList.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.payload;
                state.isSuccess = false;
                state.laneCarrierListNameLoading = isCancelRequest(action?.payload)
                state.getLaneCarrierCompaireDtoLoading = isCancelRequest(action?.payload)

            })
            .addCase(getLaneCarrierCompaire.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.getLaneCarrierCompaireDto = null;
                state.isError = false;
                state.error = null;
                state.getLaneCarrierCompaireDtoLoading = true
            })
            .addCase(getLaneCarrierCompaire.fulfilled, (state, action) => {
                state.isLoading = false;
                state.getLaneCarrierCompaireDto = action.payload;
                state.isSuccess = false;
                state.isError = false;
                state.error = null;
                state.getLaneCarrierCompaireDtoLoading = false
            })
            .addCase(getLaneCarrierCompaire.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.isError = true;
                state.isSuccess = false;
                state.getLaneCarrierCompaireDtoLoading = isCancelRequest(action?.payload)
            })
            .addCase(laneCarrierTableData.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.error = null;
                state.laneCarrierTableDtoLoading = true
                state.getLaneCarrierCompaireDtoLoading = true
            })
            .addCase(laneCarrierTableData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.error = null;
                state.laneCarrierTableDto = action.payload;
                state.laneCarrierTableDtoLoading = false
                state.getLaneCarrierCompaireDtoLoading = false
            })
            .addCase(laneCarrierTableData.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.payload;
                state.isSuccess = false;
                state.laneCarrierTableDtoLoading = isCancelRequest(action?.payload)
            })
            .addCase(vendorTableDataForExport.pending, (state) => {
                state.isLoadingExportVendorTableDetails = true;
                state.isSuccess = false;
                state.vendorTableDetailsExport = null
                state.isError = false;
                state.error = null;
            })
            .addCase(vendorTableDataForExport.fulfilled, (state, action) => {
                state.isLoadingExportVendorTableDetails = false;
                state.isSuccess = true;
                state.vendorTableDetailsExport = action.payload;
                state.isError = false;
                state.error = null;
            })
            .addCase(vendorTableDataForExport.rejected, (state, action) => {
                state.isLoadingExportVendorTableDetails = isCancelRequest(action?.payload);
                state.isError = true
                state.error = action.payload;
                state.vendorTableDetailsExport = null;
                state.isSuccess = false;
            })
            .addCase(getCarrierRegionComparisonTable.pending, (state) => {
                state.isSuccess = false;
                state.isLoadingRegionCarrierTable = true;
                state.regionCarrierComparisonDataTable = null
            })
            .addCase(getCarrierRegionComparisonTable.fulfilled, (state, action) => {
                state.isSuccess = true;
                state.isLoadingRegionCarrierTable = false;
                state.regionCarrierComparisonDataTable = action.payload;
            })
            .addCase(getCarrierRegionComparisonTable.rejected, (state, action) => {
                state.isSuccess = true;
                state.regionCarrierComparisonDataTable = null;
                state.isLoadingRegionCarrierTable = isCancelRequest(action?.payload);
            })


            .addCase(getCarrierTypeTableDto.pending, (state) => {
                state.isLoadingCarrierTable = true;
                state.carrierTypeTableDto = null
            })
            .addCase(getCarrierTypeTableDto.fulfilled, (state, action) => {
                state.isLoadingCarrierTable = false;
                state.carrierTypeTableDto = action.payload;
            })
            .addCase(getCarrierTypeTableDto.rejected, (state, action) => {
                state.carrierTypeTableDto = null;
                state.isLoadingCarrierTable = isCancelRequest(action?.payload);
            })


            .addCase(getCarrierTypeEmissionDto.pending, (state) => {
                state.isLoadingCarrierEmission = true;
                state.carrierTypeEmissionDto = null
            })
            .addCase(getCarrierTypeEmissionDto.fulfilled, (state, action) => {
                state.isLoadingCarrierEmission = false;
                state.carrierTypeEmissionDto = action.payload;
            })
            .addCase(getCarrierTypeEmissionDto.rejected, (state, action) => {
                state.carrierTypeEmissionDto = null;
                state.isLoadingCarrierEmission = isCancelRequest(action?.payload);
            })

            .addCase(getCarrierTypeOverviewDetail.pending, (state) => {
                state.isLoadingTypeOverviewDetail = true;
                state.carrierTypeOverviewDetailDto = null
            })
            .addCase(getCarrierTypeOverviewDetail.fulfilled, (state, action) => {
                state.isLoadingTypeOverviewDetail = false;
                state.carrierTypeOverviewDetailDto = action.payload;
            })
            .addCase(getCarrierTypeOverviewDetail.rejected, (state, action) => {
                state.carrierTypeOverviewDetailDto = null;
                state.isLoadingTypeOverviewDetail = isCancelRequest(action?.payload);
            })

            .addCase(getCarrierTypeReductionGraph.pending, (state) => {
                state.isLoadingCarrierTypeReductionGraph = true;
                state.carrierTypeReductionGraphDto = null
            })
            .addCase(getCarrierTypeReductionGraph.fulfilled, (state, action) => {
                state.isLoadingCarrierTypeReductionGraph = false;
                state.carrierTypeReductionGraphDto = action.payload;
            })
            .addCase(getCarrierTypeReductionGraph.rejected, (state, action) => {
                state.carrierTypeReductionGraphDto = null;
                state.isLoadingCarrierTypeReductionGraph = isCancelRequest(action?.payload);
            })

            .addCase(getCarrierTypeLaneEmissionGraph.pending, (state) => {
                state.carrierTypeLaneEmissionGraphDtoLoading = true;
                state.carrierTypeLaneEmissionGraphDto = null
            })
            .addCase(getCarrierTypeLaneEmissionGraph.fulfilled, (state, action) => {
                state.carrierTypeLaneEmissionGraphDtoLoading = false;
                state.carrierTypeLaneEmissionGraphDto = action.payload;
            })
            .addCase(getCarrierTypeLaneEmissionGraph.rejected, (state, action) => {
                state.carrierTypeLaneEmissionGraphDto = null;
                state.carrierTypeLaneEmissionGraphDtoLoading = isCancelRequest(action?.payload);
            })



    }
})


export const { resetCarrier } = carrierDetailsReducer.actions;
export default carrierDetailsReducer.reducer;