import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import laneService from "./laneService";
import { getErrorMessage, isCancelRequest } from "../../../../utils";
import { LaneState } from "./laneDetailsInterface";
import { toast } from "react-toastify";

// Define the shape of the lane state


// Initial state
export const initialState: LaneState = {
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    laneGraphDetails: null,
    laneGraphDetailsLoading: false,
    regionCarrierComparisonData: null,
    getRegionOverviewDetailData: null,
    regionCarrierComparisonLoading: false,
    getRegionOverviewDetailLoading: false,
    laneCarrierEmission: null,
    laneCarrierEmissionIsloading: false,
    laneReductionDetailGraphLoading: false,
    laneReductionDetailGraphData: null,
    getLaneOverDetailsEmissionData: null,
    getLaneOverDetailsEmissionLoading: false,
    laneSortestPathLoading: false,
    laneSortestPathData: null,
    isLaneScenarioDetailLoading: false,
    laneScenarioDetail: null,
    isLaneOriginLoading: false,
    laneOriginData: null,
    isLaneDestinationLoading: false,
    laneDestinationData: null,
    isLaneEmissionDataLoading: false,
    laneEmissionData: null,
    carrierEmissionData: null,
    isCarrierEmissionDataLoading: false,
    isLaneRangeLoading: false,
    laneRangeData: null,
    updateRangeSelections: null,
    isCheckLaneFuelLoading:false,
    checkLaneFuelData:null
}

// Async Thunks for lane data operations
export const laneGraphData = createAsyncThunk('get/lane/graph', async (userData: any, thunkApi) => {
    try {
        return await laneService.laneGraphData(userData)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
})

// Async Thunk to fetch region carrier comparison data
export const regionCarrierComparison = createAsyncThunk('get/region/carrier/comparison', async (userData: any, thunkApi) => {
    try {
        return await laneService.regionCarrierComparison(userData)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
})

// Async Thunk to fetch region overview detail data for carrier comparison
export const getRegionOverviewDetail = createAsyncThunk('get/region/carrier/comparison/detail', async (userData: any, thunkApi) => {
    try {
        return await laneService.getRegionOverviewDetail(userData)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
})

// Async Thunk to fetch lane carrier emission reduction glide data
export const laneCarrierEmissionReductionGlide = createAsyncThunk("post/emission/reduction/glide", async (userData: any, thunkApi) => {
    try {
        return await laneService.getLaneReductionDetailGraph(userData);
    }
    catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message)
    }
})

// Async Thunk to fetch lane reduction detail graph data for carrier comparison
export const laneReductionDetailGraph = createAsyncThunk('get/region/carrier/Reduction/comparison', async (userData: any, thunkApi) => {
    try {
        return await laneService.getLaneCarrierEmission(userData)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
})

// Async Thunk to fetch lane overview details emission data for carrier comparison
export const getLaneOverDetailsEmission = createAsyncThunk('get/region/carrier/overview/detail', async (userData: any, thunkApi) => {
    try {
        return await laneService.getLaneOverDetailsEmissionApi(userData)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
})

// Async Thunk to fetch shortest path for lane
export const getLaneSortestPath = createAsyncThunk(
    'get/lane/shortest/path',
    async (payload: any, thunkApi) => {
        try {
            const result = await laneService.getLaneSortestPathApi(payload);
            
            return result;
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

// Async Thunk to lane Scenario details
export const getLaneScenarioDetail = createAsyncThunk('get/lane/scenario/details', async (userData: any, thunkApi) => {
    try {
        return await laneService.getLaneScenarioDetailApi(userData)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
})

export const setLoadingLane = createAsyncThunk("HeaderName", async (status: boolean) => {
    return status
})

export const laneOriginSearch = createAsyncThunk('get/lane/origin/city', async (userData: any, thunkApi) => {
    try {
        return await laneService.searchCityApi(userData)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
})

export const laneDestinationSearch = createAsyncThunk('get/lane/destination/city', async (userData: any, thunkApi) => {
    try {
        return await laneService.searchCityApi(userData)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
})


export const getLaneEmissionData = createAsyncThunk('get/lane/emission/data', async (userData: any, thunkApi) => {
    try {
        return await laneService.getLaneEmissionDataApi(userData)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
})


export const getCarrierEmissionData = createAsyncThunk('get/carrier/emission/data', async (userData: any, thunkApi) => {
    try {
        return await laneService.getCarrierEmissionDataApi(userData)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
})

export const getLaneRangeOptions = createAsyncThunk('get/lane/range/options', async (_, thunkApi) => {
    try {
        return await laneService.getLaneRangeOptionApi()
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
})

export const getUpdateRangeSelections = createAsyncThunk('get/update/range/selection', async (userData: any, thunkApi) => {
    try {
       const res = await laneService.getUpdateRangeSelectionApi(userData)
        toast.success("Fuel stop radius updated successfully")
       return res
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
})

export const isLoadingLaneDashboard = createAsyncThunk("isLoadingLaneDashboard", async (status: boolean) => {
    return status
})

export const checkLaneFuelStop= createAsyncThunk('checkLane/fuelStop', async (userData: any, thunkApi) => {
    try {
       const res = await laneService.checkLaneFuelStopApi(userData)
       return res
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
})

export const laneDetailsReducer = createSlice({
    name: "lane-Page",
    initialState,
    reducers: {
        resetLanes: () => initialState,
        resetLanePlanning: (state) => {
            state.laneOriginData = null;
            state.laneDestinationData = null;
            state.laneSortestPathData = null;
            state.laneScenarioDetail = null;
        },
        resetLaneOdPair: (state) => {
            state.laneOriginData = null;
            state.laneDestinationData = null;
        },
        resetCheckLaneFuelData: (state) => {
            state.checkLaneFuelData = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(laneGraphData.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.laneGraphDetailsLoading = true
                state.laneGraphDetails = null
            })
            .addCase(isLoadingLaneDashboard.fulfilled, (state: any, action: any) => {
                state.isLaneEmissionDataLoading = action.payload;
            })
            .addCase(setLoadingLane.fulfilled, (state: any, action: any) => {
                state.laneGraphDetailsLoading = action.payload;
            })
            .addCase(laneGraphData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.laneGraphDetails = action.payload;
                state.laneGraphDetailsLoading = false
            })
            .addCase(laneGraphData.rejected, (state, action) => {
                state.isLoading = true;
                state.isError = action.payload;
                state.isSuccess = false;
                state.laneGraphDetailsLoading = isCancelRequest(action?.payload)

            })
            .addCase(regionCarrierComparison.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.regionCarrierComparisonLoading = true
                state.regionCarrierComparisonData = null
            })
            .addCase(regionCarrierComparison.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.regionCarrierComparisonData = action.payload;
                state.regionCarrierComparisonLoading = false
            })
            .addCase(regionCarrierComparison.rejected, (state, action) => {
                state.isLoading = true;
                state.isError = action.payload;
                state.isSuccess = false;
                state.regionCarrierComparisonLoading = isCancelRequest(action?.payload)

            }).addCase(getRegionOverviewDetail.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.getRegionOverviewDetailLoading = true
                state.getRegionOverviewDetailData = null
            })
            .addCase(getRegionOverviewDetail.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.getRegionOverviewDetailData = action.payload;
                state.getRegionOverviewDetailLoading = false
            })
            .addCase(getRegionOverviewDetail.rejected, (state, action) => {
                state.isLoading = true;
                state.isError = action.payload;
                state.isSuccess = false;
                state.getRegionOverviewDetailLoading = isCancelRequest(action?.payload)

            }).addCase(laneCarrierEmissionReductionGlide.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.laneCarrierEmission = null;
                state.laneCarrierEmissionIsloading = true
            })
            .addCase(laneCarrierEmissionReductionGlide.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.laneCarrierEmission = action.payload;
                state.laneCarrierEmissionIsloading = false

            })
            .addCase(laneCarrierEmissionReductionGlide.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = action.payload;
                state.isSuccess = false;
                state.laneCarrierEmission = null;
                state.laneCarrierEmissionIsloading = isCancelRequest(action?.payload)

            })
            .addCase(laneReductionDetailGraph.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.laneReductionDetailGraphLoading = true
                state.laneReductionDetailGraphData = null
            })
            .addCase(laneReductionDetailGraph.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.laneReductionDetailGraphData = action.payload;
                state.laneReductionDetailGraphLoading = false
            })
            .addCase(laneReductionDetailGraph.rejected, (state, action) => {
                state.isLoading = true;
                state.isError = action.payload;
                state.isSuccess = false;
                state.laneReductionDetailGraphLoading = isCancelRequest(action?.payload)

            })
            .addCase(getLaneOverDetailsEmission.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.getLaneOverDetailsEmissionLoading = true
                state.getLaneOverDetailsEmissionData = null
            })
            .addCase(getLaneOverDetailsEmission.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.getLaneOverDetailsEmissionData = action.payload;
                state.getLaneOverDetailsEmissionLoading = false
            })
            .addCase(getLaneOverDetailsEmission.rejected, (state, action) => {
                state.isLoading = true;
                state.isError = action.payload;
                state.isSuccess = false;
                state.getLaneOverDetailsEmissionLoading = isCancelRequest(action?.payload)

            }).addCase(getLaneSortestPath.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.laneSortestPathLoading = true
                state.laneSortestPathData = null
            }).addCase(getLaneSortestPath.fulfilled, (state, action) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.laneSortestPathLoading = false
                state.laneSortestPathData = action.payload
            }).addCase(getLaneSortestPath.rejected, (state, action) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.laneSortestPathLoading = isCancelRequest(action?.payload)
                state.laneSortestPathData = null
            }).addCase(getLaneScenarioDetail.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isLaneScenarioDetailLoading = true
                state.laneScenarioDetail = null
            }).addCase(getLaneScenarioDetail.fulfilled, (state, action) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isLaneScenarioDetailLoading = false
                state.laneScenarioDetail = action.payload
            }).addCase(getLaneScenarioDetail.rejected, (state, action) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isLaneScenarioDetailLoading = isCancelRequest(action?.payload)
                state.laneScenarioDetail = null
            })
            .addCase(laneOriginSearch.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isLaneOriginLoading = true
                state.laneOriginData = null
            }).addCase(laneOriginSearch.fulfilled, (state, action) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isLaneOriginLoading = false
                state.laneOriginData = action.payload
            }).addCase(laneOriginSearch.rejected, (state, action) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isLaneOriginLoading = isCancelRequest(action?.payload)
                state.laneOriginData = null
            })
            .addCase(laneDestinationSearch.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isLaneDestinationLoading = true
                state.laneDestinationData = null
            }).addCase(laneDestinationSearch.fulfilled, (state, action) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isLaneDestinationLoading = false
                state.laneDestinationData = action.payload
            }).addCase(laneDestinationSearch.rejected, (state, action) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isLaneDestinationLoading = isCancelRequest(action?.payload)
                state.laneDestinationData = null
            })
            .addCase(getLaneEmissionData.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isLaneEmissionDataLoading = true
                state.laneEmissionData = null
            }).addCase(getLaneEmissionData.fulfilled, (state, action) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isLaneEmissionDataLoading = false
                state.laneEmissionData = action.payload
            }).addCase(getLaneEmissionData.rejected, (state, action) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isLaneEmissionDataLoading = isCancelRequest(action?.payload)
                state.laneEmissionData = null
            })
            .addCase(getCarrierEmissionData.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isCarrierEmissionDataLoading = true
                state.carrierEmissionData = null
            }).addCase(getCarrierEmissionData.fulfilled, (state, action) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isCarrierEmissionDataLoading = false
                state.carrierEmissionData = action.payload
            }).addCase(getCarrierEmissionData.rejected, (state, action) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isCarrierEmissionDataLoading = isCancelRequest(action?.payload)
                state.carrierEmissionData = null
            })
            .addCase(getLaneRangeOptions.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isLaneRangeLoading = true
            }).addCase(getLaneRangeOptions.fulfilled, (state, action) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isLaneRangeLoading = false
                state.laneRangeData = action.payload
            }).addCase(getLaneRangeOptions.rejected, (state, action) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isLaneRangeLoading = false;
                state.laneRangeData = null
            })
            .addCase(getUpdateRangeSelections.pending, (state) => {
                state.isLaneRangeLoading = true
                state.updateRangeSelections = null
            }).addCase(getUpdateRangeSelections.fulfilled, (state, action) => {
                state.isLaneRangeLoading = false
                state.updateRangeSelections = action.payload
            }).addCase(getUpdateRangeSelections.rejected, (state, action) => {
                state.isLaneRangeLoading = false;
                state.updateRangeSelections = null
            })
             .addCase(checkLaneFuelStop.pending, (state) => {
                state.isCheckLaneFuelLoading = true
                state.checkLaneFuelData = null
            }).addCase(checkLaneFuelStop.fulfilled, (state, action) => {
                state.isCheckLaneFuelLoading = false
                state.checkLaneFuelData = action.payload
            }).addCase(checkLaneFuelStop.rejected, (state, action) => {
                state.isCheckLaneFuelLoading = isCancelRequest(action?.payload);
                state.checkLaneFuelData = null
            })
            
    }
})


export const { resetLanes, resetLanePlanning, resetLaneOdPair, resetCheckLaneFuelData } = laneDetailsReducer.actions;
export default laneDetailsReducer.reducer;