import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bidPlanningService from "./bidPlanningService";
import { getErrorMessage, getBidFileStatusCode, isCancelRequest } from "../../utils";
import { BidPlanningState } from "./bidPlanningInterface";
import { toast } from "react-toastify";

/**
 * Redux Slice for managing bid planning data
 */

// Define the shape of the state

// Initial state
export const initialState: BidPlanningState = {
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    isLoadingBidFileList: false,
    bidFileList: null,
    isLoadingStatusList: false,
    bidStatusList: null,
    isLoadingCheckFile: false,
    checkBidFileExist: null,
    isLoadingSaveFile: false,
    isLoadingDeleteFile: false,
    bidFileDataMatrics: null,
    isLoadingProcessFile: false,
    processFileData: null,
    fileUploadError: null,
    isLoadingAddBidFile: false,
    addBidFileData: null,
    isLoadingKeyMetricsDetail: false,
    keyMetricsDetail: null,
    isLoadinBidFileLanesTableGraph: false,
    bidFileLanesTableGraph: null,
    isLoadinFileInputError: false,
    fileInputErrorData: null,
    isLoadingProcessFileStatusData: false,
    processFileStatusData: null,
    isLoadingEmissionCostImpactBarChartBid: false,
    costImpactBarChartBid: null,
    isLoadingKeyMetricsSummaryOutput: false,
    keyMetricsSummaryOutput: null,
    isLoadingOutputDataOfBidPlanning: false,
    outputDataOfBidPlanning: null,
    isLoadingOriginBidOutput: false,
    originBidOutput: null,
    isLoadingDestinationBidOutput: false,
    destinationBidOutput: null,
    isLoadingScacBidOutput: false,
    scacBidOutput: null,
    isLoadingOutputOfBidPlanningExport: false,
    outputOfBidPlanningExportData: null,
    processFileStatusDataError: null,
    processNewLaneData: null,
    isLoadingProcessNewLaneData: false,
    isLoadingSingleFile: false,
    singleFileDetails: null,
    isLoadingErrorInputBidExport: false,
    errorInputBidExportData: null
}

export const bidPlanningFileList = createAsyncThunk(
    "get/bid-planning/file/list",
    async (userData: any, thunkApi) => {
        try {
            const response = await bidPlanningService.getBidFileList(userData);
            thunkApi.dispatch(resetMatrics())
            return response
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const bidPlanningStatusList = createAsyncThunk(
    "get/bid-planning/status/list",
    async (_, thunkApi) => {
        try {
            return await bidPlanningService.getBidStatusList();
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const bidPlanningSaveFileData = createAsyncThunk(
    "post/bid-planning/save/file/Data",
    async (userData: any, thunkApi) => {
        try {
            return await bidPlanningService.saveBidFileDataApi(userData);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const deleteMultiBidFiles = createAsyncThunk(
    "post/bid-planning/delete/file",
    async (userData: any, thunkApi) => {
        try {
            return await bidPlanningService.deleteMultiBidFileApi(userData?.deleteData);

        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const addBidFile = createAsyncThunk("post/bid-planning/addBidFile/update", async (userData: any, thunkApi) => {
    try {
        return await bidPlanningService.addBidFileApi(userData)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
}
);

export const getKeyMetricsDetail = createAsyncThunk("get/key/metrics", async (userData: any, thunkApi) => {
    try {
        return await bidPlanningService.getKeyMetricsDetailApi(userData)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
}
);

export const getBidFileLanesTableGraph = createAsyncThunk("get/lanes/table/graph/metrics", async (userData: any, thunkApi) => {
    try {
        return await bidPlanningService.getBidFileLanesTableGraphApi(userData)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
}
);


export const getBidFileDetail = createAsyncThunk("get/bid/file/details", async (userData: any, thunkApi) => {
    try {
        return await bidPlanningService.getBidFileDetailApi(userData)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
}
);

export const checkUploadFile = createAsyncThunk("post/bid-planning/file-check", async (data: any, thunkApi: any) => {
    try {
        const response: any = await bidPlanningService.checkFileApi(data);
        const payload = {
            name: response?.config?.headers?.["file-name"],
            statusId: getBidFileStatusCode("Uploaded"),
            base_path: response?.config?.headers?.["folder-path"],
        }
        if (response?.status === 201 && payload?.name) {
            const res = await thunkApi.dispatch(bidPlanningSaveFileData(payload));
            return res
        } else {
            await thunkApi.dispatch(bidPlanningFileList(data?.fileListPayload));
        }
        return response;

    } catch (error: any) {
        const payload = {
            name: data?.fileName,
            statusId: getBidFileStatusCode(error?.code === "ERR_CANCELED" ? "Cancelled" : "Failed"),
            base_path: data?.base_path,
            type: "error",
            error_message: error
        }
        if (error?.code === "ERR_CANCELED") {
            toast.error("File uploading is cancelled")
        } else {
            await thunkApi.dispatch(bidPlanningSaveFileData(payload))
            await thunkApi.dispatch(bidPlanningFileList(data?.fileListPayload));
        }
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
}
);

export const processBidFileData = createAsyncThunk(
    "post/bid-planning/process/file/Data",
    async (userData: any, thunkApi) => {
        try {
            const response = await bidPlanningService.processBidFileApi({ file_id: userData?.file_id });
            const bidListPayload = {
                name: "",
                page_size: 10,
                page: 1,
                search: "",
                status_id: ""
            }
            if (!userData?.isDataMatrix) {
                await thunkApi.dispatch(bidPlanningFileList(bidListPayload))
            }
            await thunkApi.dispatch(getBidFileDetail({ file_id: userData?.file_id }))

            return response
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const fileMatricsInputError = createAsyncThunk("get/metrics/error", async (userData: any, thunkApi) => {
    try {
        return await bidPlanningService.fileMatricsErrorApi(userData)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
}
);

export const processBidNewLanes = createAsyncThunk(
    "post/bid-planning/new/lane/process/Data",
    async (userData: any, thunkApi) => {
        try {
            const response = await bidPlanningService.processStatusBidFileApi({ fileId: userData?.file_id })
            if (response?.data?.total > response?.data?.is_processed) {
                await bidPlanningService.processBidFileApiV1(userData);
                await thunkApi.dispatch(getBidFileDetail({ file_id: userData?.file_id }))
            }
            if (response?.data?.total === response?.data?.is_processed && userData?.file_id) {
                thunkApi.dispatch(processBidFileData(userData));
            }
            return response
        } catch (error: any) {
            const bidListPayload = {
                name: "",
                page_size: 10,
                page: 1,
                search: "",
                status_id: ""
            }
            await thunkApi.dispatch(bidPlanningFileList(bidListPayload))
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const processStatusBidFile = createAsyncThunk(
    "post/bid-planning/process/status/file/Data",
    async (userData: any, thunkApi) => {
        try {
            const response = await bidPlanningService.processStatusBidFileApi(userData);
            if (response?.data?.total === 0 && userData?.fileId) {
                thunkApi.dispatch(processBidFileData({ file_id: userData?.fileId }));
            }
            return response
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const getEmissionCostImpactBarChartBidPlanning = createAsyncThunk("get/emission/cost/impact/bar/chart/bid/planning", async (userData: any, thunkApi) => {
    try {
        return await bidPlanningService.getEmissionCostImpactBarChartBidPlanningApi(userData)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});

export const getKeyMetricsSummaryOutput = createAsyncThunk("get/key/metrics/summary/output", async (userData: any, thunkApi) => {
    try {
        return await bidPlanningService.getKeyMetricsSummaryOutputApi(userData)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});


export const getOutputOfBidPlanning = createAsyncThunk("get/bid/planning/output", async (userData: any, thunkApi) => {
    try {
        return await bidPlanningService.getOutPutOfBidPlanningApi(userData)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});

export const getOutputOfBidPlanningExport = createAsyncThunk("get/bid/planning/output/export", async (userData: any, thunkApi) => {
    try {
        return await bidPlanningService.exportOutPutOfBidPlanningApi(userData)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});

export const exportErrorListBidInput = createAsyncThunk("get/bid/input/error/export", async (userData: any, thunkApi) => {
    try {
        return await bidPlanningService.exportErrorListBidInputApi(userData)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});

export const getOriginBidOutput = createAsyncThunk("get/bid/planning/origin", async (userData: any, thunkApi) => {
    try {
        return await bidPlanningService.getOriginDestinationBidOutputApi(userData)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});

export const getDestinationBidOutput = createAsyncThunk("get/bid/planning/destination", async (userData: any, thunkApi) => {
    try {
        return await bidPlanningService.getOriginDestinationBidOutputApi(userData)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});

export const getScacBidOutput = createAsyncThunk("get/bid/planning/scac", async (userData: any, thunkApi) => {
    try {
        return await bidPlanningService.getScacBidOutputApi(userData)
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});

export const processBidNewLanesCounter = createAsyncThunk(
    "post/bid-planning/new/lane/process/counter/Data",
    async (userData: any, thunkApi) => {
        try {
            const response = await bidPlanningService.processBidFileApiV1(userData);
            thunkApi.dispatch(processStatusBidFile({ fileId: userData?.file_id, fileName: userData?.fileName }));
            return response

        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);


export const bidPlanningDataReducer = createSlice({
    name: "bid-planning",
    initialState,
    reducers: {
        resetBidPlanning: () => initialState,
        resetMatrics: (state) => {
            state.bidFileDataMatrics = null;
            state.processFileData = null;
            state.addBidFileData = null;
            state.fileInputErrorData = null;
            state.bidFileDataMatrics = null;
        },
        resetBidOutput: (state) => {
            state.outputOfBidPlanningExportData = null;
        },
        resetkeyMetricsSummaryOutput: (state) => {
            state.keyMetricsSummaryOutput = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(bidPlanningFileList.pending, (state) => {
                // Set loading state
                state.isLoading = true;
                state.isSuccess = false;
                state.isLoadingBidFileList = true;
                state.bidFileList = null
                state.processFileStatusData = null
            })
            .addCase(bidPlanningFileList.fulfilled, (state, action) => {
                // Set success state and update businessUnitTableDetails
                state.isLoading = false;
                state.isSuccess = true;
                state.isLoadingBidFileList = false;
                state.bidFileList = action.payload;
            })
            .addCase(bidPlanningFileList.rejected, (state, action) => {
                // Set error state on rejection
                state.isLoading = false;
                state.isError = action.payload;
                state.isSuccess = false;
                state.isLoadingBidFileList = false;
                state.bidFileList = null
            })
            .addCase(bidPlanningStatusList.pending, (state) => {
                state.isLoadingStatusList = true
                state.bidStatusList = null
            })
            .addCase(bidPlanningStatusList.fulfilled, (state, action) => {
                state.isLoadingStatusList = false
                state.bidStatusList = action?.payload
            })
            .addCase(bidPlanningStatusList.rejected, (state, action) => {
                state.isLoadingStatusList = false
                state.bidStatusList = null
            })
            .addCase(checkUploadFile.pending, (state) => {
                state.isLoadingCheckFile = true
                state.checkBidFileExist = null
                state.fileUploadError = null
                state.processFileData = null
            })
            .addCase(checkUploadFile.fulfilled, (state, action) => {
                state.isLoadingCheckFile = false
                state.checkBidFileExist = { success: "uploaded", data: action.payload }
                state.fileUploadError = null
            })
            .addCase(checkUploadFile.rejected, (state, action) => {
                state.isLoadingCheckFile = false
                state.checkBidFileExist = { success: "failed", data: action.payload }
                state.fileUploadError = action.payload
            })
            .addCase(bidPlanningSaveFileData.pending, (state) => {
                state.isLoadingSaveFile = true
                state.bidFileDataMatrics = null
            })
            .addCase(bidPlanningSaveFileData.fulfilled, (state, action) => {
                state.isLoadingSaveFile = false
                state.bidFileDataMatrics = action.payload
            })
            .addCase(bidPlanningSaveFileData.rejected, (state, action) => {
                state.isLoadingSaveFile = false
                state.bidFileDataMatrics = null
            })
            .addCase(deleteMultiBidFiles.pending, (state) => {
                state.isLoadingDeleteFile = true
            })
            .addCase(deleteMultiBidFiles.fulfilled, (state, action) => {
                state.isLoadingDeleteFile = false
            })
            .addCase(deleteMultiBidFiles.rejected, (state, action) => {
                state.isLoadingDeleteFile = false
            })
            .addCase(processBidFileData.pending, (state) => {
                state.isLoadingProcessFile = true
                state.processFileData = null
            })
            .addCase(processBidFileData.fulfilled, (state, action) => {
                state.isLoadingProcessFile = false
                state.processFileData = action.payload
            })
            .addCase(processBidFileData.rejected, (state, action) => {
                state.isLoadingProcessFile = false
                state.processFileData = null
            })
            .addCase(addBidFile.pending, (state) => {
                state.isLoadingAddBidFile = true
                state.addBidFileData = null
            })
            .addCase(addBidFile.fulfilled, (state, action) => {
                state.isLoadingAddBidFile = false
                state.addBidFileData = action.payload
            })
            .addCase(addBidFile.rejected, (state, action) => {
                state.isLoadingAddBidFile = false
                state.addBidFileData = null
            })
            .addCase(getKeyMetricsDetail.pending, (state) => {
                state.isLoadingKeyMetricsDetail = true
                state.keyMetricsDetail = null
            })
            .addCase(getKeyMetricsDetail.fulfilled, (state, action) => {
                state.isLoadingKeyMetricsDetail = false
                state.keyMetricsDetail = action.payload
            })
            .addCase(getKeyMetricsDetail.rejected, (state, action) => {
                state.isLoadingKeyMetricsDetail = false
                state.keyMetricsDetail = null
            })
            .addCase(getBidFileLanesTableGraph.pending, (state) => {
                state.isLoadinBidFileLanesTableGraph = true
                state.bidFileLanesTableGraph = null
            })
            .addCase(getBidFileLanesTableGraph.fulfilled, (state, action) => {
                state.isLoadinBidFileLanesTableGraph = false
                state.bidFileLanesTableGraph = action.payload
            })
            .addCase(getBidFileLanesTableGraph.rejected, (state, action) => {
                state.isLoadinBidFileLanesTableGraph = false
                state.bidFileLanesTableGraph = null
            })
            .addCase(fileMatricsInputError.pending, (state) => {
                state.isLoadinFileInputError = true
                state.fileInputErrorData = null
            })
            .addCase(fileMatricsInputError.fulfilled, (state, action) => {
                state.isLoadinFileInputError = false
                state.fileInputErrorData = action.payload
            })
            .addCase(fileMatricsInputError.rejected, (state, action) => {
                state.isLoadinFileInputError = false
                state.fileInputErrorData = null
            })
            .addCase(processStatusBidFile.pending, (state, action) => {
                // state.processFileStatusData = action.payload
                state.processFileStatusDataError = null
            })
            .addCase(processStatusBidFile.fulfilled, (state, action) => {
                state.processFileStatusData = action.payload
                state.processFileStatusDataError = null
            })
            .addCase(processStatusBidFile.rejected, (state, action) => {
                state.processFileStatusDataError = action.payload;
            })
            .addCase(processBidNewLanes.pending, (state, action) => {
                state.isLoadingProcessFileStatusData = true
            })
            .addCase(processBidNewLanes.fulfilled, (state, action) => {
                state.isLoadingProcessFileStatusData = false
                state.processFileStatusData = action.payload
            })
            .addCase(processBidNewLanes.rejected, (state, action) => {
                state.isLoadingProcessFileStatusData = false
            })
            .addCase(getEmissionCostImpactBarChartBidPlanning.pending, (state) => {
                state.isLoadingEmissionCostImpactBarChartBid = true
                state.costImpactBarChartBid = null
            })
            .addCase(getEmissionCostImpactBarChartBidPlanning.fulfilled, (state, action) => {
                state.isLoadingEmissionCostImpactBarChartBid = false
                state.costImpactBarChartBid = action.payload
            })
            .addCase(getEmissionCostImpactBarChartBidPlanning.rejected, (state, action) => {
                state.isLoadingEmissionCostImpactBarChartBid = false
                state.costImpactBarChartBid = null
            })
            .addCase(getKeyMetricsSummaryOutput.pending, (state) => {
                state.isLoadingKeyMetricsSummaryOutput = true
                state.keyMetricsSummaryOutput = null
            })
            .addCase(getKeyMetricsSummaryOutput.fulfilled, (state, action) => {
                state.isLoadingKeyMetricsSummaryOutput = false
                state.keyMetricsSummaryOutput = action.payload
            })
            .addCase(getKeyMetricsSummaryOutput.rejected, (state, action) => {
                state.isLoadingKeyMetricsSummaryOutput = false
                state.keyMetricsSummaryOutput = null
            })
            .addCase(getOutputOfBidPlanning.pending, (state) => {
                state.isLoadingOutputDataOfBidPlanning = true
                state.outputDataOfBidPlanning = null
            })
            .addCase(getOutputOfBidPlanning.fulfilled, (state, action) => {
                state.isLoadingOutputDataOfBidPlanning = false
                state.outputDataOfBidPlanning = action.payload
            })
            .addCase(getOutputOfBidPlanning.rejected, (state, action) => {
                state.isLoadingOutputDataOfBidPlanning = false
                state.outputDataOfBidPlanning = null
            })
            .addCase(getOriginBidOutput.pending, (state) => {
                state.isLoadingOriginBidOutput = true
                state.originBidOutput = null
            })
            .addCase(getOriginBidOutput.fulfilled, (state, action) => {
                state.isLoadingOriginBidOutput = false
                state.originBidOutput = action.payload
            })
            .addCase(getOriginBidOutput.rejected, (state, action) => {
                state.isLoadingOriginBidOutput = isCancelRequest(action?.payload)
                state.originBidOutput = null
            })
            .addCase(getDestinationBidOutput.pending, (state) => {
                state.isLoadingDestinationBidOutput = true
                state.destinationBidOutput = null
            })
            .addCase(getDestinationBidOutput.fulfilled, (state, action) => {
                state.isLoadingDestinationBidOutput = false
                state.destinationBidOutput = action.payload
            })
            .addCase(getDestinationBidOutput.rejected, (state, action) => {
                state.isLoadingDestinationBidOutput = isCancelRequest(action?.payload)
                state.destinationBidOutput = null
            })
            .addCase(getScacBidOutput.pending, (state) => {
                state.isLoadingScacBidOutput = true
                state.scacBidOutput = null
            })
            .addCase(getScacBidOutput.fulfilled, (state, action) => {
                state.isLoadingScacBidOutput = false
                state.scacBidOutput = action.payload
            })
            .addCase(getScacBidOutput.rejected, (state, action) => {
                state.isLoadingScacBidOutput = isCancelRequest(action?.payload)
                state.scacBidOutput = null
            })
            .addCase(getOutputOfBidPlanningExport.pending, (state) => {
                state.isLoadingOutputOfBidPlanningExport = true
                state.outputOfBidPlanningExportData = null
            })
            .addCase(getOutputOfBidPlanningExport.fulfilled, (state, action) => {
                state.isLoadingOutputOfBidPlanningExport = false
                state.outputOfBidPlanningExportData = action.payload
            })
            .addCase(getOutputOfBidPlanningExport.rejected, (state, action) => {
                state.isLoadingOutputOfBidPlanningExport = isCancelRequest(action?.payload)
                state.outputOfBidPlanningExportData = null
            })
            .addCase(exportErrorListBidInput.pending, (state) => {
                state.isLoadingErrorInputBidExport = true
                state.errorInputBidExportData = null
            })
            .addCase(exportErrorListBidInput.fulfilled, (state, action) => {
                state.isLoadingErrorInputBidExport = false
                state.errorInputBidExportData = action.payload
            })
            .addCase(exportErrorListBidInput.rejected, (state, action) => {
                state.isLoadingErrorInputBidExport = isCancelRequest(action?.payload)
                state.errorInputBidExportData = null
            })
            .addCase(processBidNewLanesCounter.pending, (state) => {
                state.processNewLaneData = null
                state.isLoadingProcessNewLaneData = true
            })
            .addCase(processBidNewLanesCounter.fulfilled, (state, action) => {
                state.processNewLaneData = action.payload
                state.isLoadingProcessNewLaneData = false

            })
            .addCase(processBidNewLanesCounter.rejected, (state, action) => {
                state.processNewLaneData = null
                state.isLoadingProcessNewLaneData = false

            })
            .addCase(getBidFileDetail.pending, (state) => {
                state.isLoadingSingleFile = true
                state.singleFileDetails = null
            })
            .addCase(getBidFileDetail.fulfilled, (state, action) => {
                state.isLoadingSingleFile = false
                state.singleFileDetails = action.payload
            })
            .addCase(getBidFileDetail.rejected, (state, action) => {
                state.isLoadingSingleFile = false
                state.singleFileDetails = null
            })
    }
});

// Export actions and reducer
export const { resetBidPlanning, resetMatrics, resetkeyMetricsSummaryOutput } = bidPlanningDataReducer.actions;
export default bidPlanningDataReducer.reducer;