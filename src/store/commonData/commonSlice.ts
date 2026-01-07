import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import commonService from "./commonService";
import { getErrorMessage, isCancelRequest } from "../../utils";
import { CommonState, ProjectCountDataInterface } from "./commonDataInterface";
import { getUserDetails } from "../auth/authDataSlice";
/**
 * Redux Slice for common data and functionality
 */

// Define the shape of the state

// Initial state
export const initialState: CommonState = {
    isSuccess: false,
    isLoading: false,
    isLoadingProjectCount: false,
    isError: false,
    error: null,
    message: null,
    isLoadingFilterDates: false,
    emissionDates: null,
    regions: null,
    projectCountData: null,
    emissionIntensityDetails: null,
    emissionIntensityDetailsIsLoading: false,
    urlKey: '',
    cmsContent: null,
    isLoadingCmsContent: false,
    pageTitle: null,
    notificationDetail: null,
    isLoadingNotification: false,
    isSidebarOpen: true,
    timePeriodList: null,
    isLoadingDivisions: false,
    divisions: null,
    questionsDto: null,
    isLoadingQuestions: false,
    timePeriodLoading: false,
    questionListDto: null
}

// Async Thunk to toggle sidebar status
export const updatePageTitle = createAsyncThunk("page/title", async (name: string) => {
    return name;
})


// Async Thunk for fetching emission filter dates
export const getFiltersDate = createAsyncThunk("graph/filters/dates", async (_, thunkApi) => {
    try {
        // Create user token with authorization header
        return await commonService.getFiltersDate();
    }
    catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message)
    }
})

// Async Thunk for posting emission intensity data
export const graphEmissionIntensity = createAsyncThunk("post/emissionIntensity", async (userData: any, thunkApi) => {
    try {
        // Call common service to post emission intensity data
        return await commonService.postRegionIntensity(userData);
    }
    catch (error: any) {
        // Handle errors and reject with error message
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message)
    }
})

// Async Thunk for fetching regions
export const getDivisionList = createAsyncThunk("get/division", async (_, thunkApi) => {
    try {
        // Call common service to get regions
        return await commonService.getDivisions();
    }
    catch (error: any) {
        // Handle errors and reject with error message
        const message: any = getErrorMessage(error);

        return thunkApi.rejectWithValue(message)
    }
})

// Async Thunk for fetching regions
export const regionShow = createAsyncThunk("get/region", async (data: { division_id: number | string }, thunkApi) => {
    try {
        // Call common service to get regions
        return await commonService.getRegions(data);
    }
    catch (error: any) {
        // Handle errors and reject with error message
        const message: any = getErrorMessage(error);

        return thunkApi.rejectWithValue(message)
    }
})


// Async Thunk for fetching project count
export const getProjectCount = createAsyncThunk("get/project/count", async (userData: any, thunkApi) => {
    try {
        // Call common service to get project count
        return await commonService.getProjectCountApi(userData);
    }
    catch (error: any) {
        // Handle errors and reject with error message
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message)
    }
})

export const openSidebar = createAsyncThunk("sidebar/open/close", (isOpen: boolean) => {
    return isOpen
})


export const addUrl = createAsyncThunk("add/url", async (payload: any, thunkApi) => {
    try {
        // Call common service to save url
        return await commonService.saveUrlApi(payload);
    }
    catch (error: any) {
        // Handle errors and reject with error message
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message)
    }
    // return status
})


export const getCmsContentApi = createAsyncThunk("get/cms/contet", async (payload: any, thunkApi) => {
    try {
        // Call common service to save url
        return await commonService.getCmsContentApi(payload);
    }
    catch (error: any) {
        // Handle errors and reject with error message
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message)
    }
    // return status
})


export const getNotificationListing = createAsyncThunk("get/notification", async (_, thunkApi) => {
    try {
        // Call common service to save url
        return await commonService.getNotificationListing("");
    }
    catch (error: any) {
        // Handle errors and reject with error message
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message)
    }
    // return status
})


// 
export const getTimePeriod = createAsyncThunk("get/time/period", async (payload: any, thunkApi) => {
    try {
        // Call common service to save url
        return await commonService.getTimePeriodApi(payload);
    }
    catch (error: any) {
        // Handle errors and reject with error message
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message)
    }
    // return status
})



export const getOnboardQuestionList = createAsyncThunk("get/onboard/question/list", async (payload: any, thunkApi) => {
    try {
        // Call common service to save url
        return await commonService.getOnboardQuestionListApi(payload);
    }
    catch (error: any) {
        // Handle errors and reject with error message
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message)
    }
    // return status
})

export const addUpdateQuestionAnswere = createAsyncThunk("add/update/question/answer", async (payload: any, thunkApi) => {
    try {
        // Call common service to save url
        const res = await commonService.addUpdateQuestionAnswereApi(payload?.payload);
        if (payload.isFinalStep) {
            await thunkApi.dispatch(getUserDetails());
            payload.navigate()
        } else {
            payload.action(payload.step);
        }
        return res
    }
    catch (error: any) {
        // Handle errors and reject with error message
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message)
    }
    // return status
})
// 
export const isLoadingCommonDashboard = createAsyncThunk("isLoadingCommonDashboard", async (status: boolean) => {
    return status
})

// Define the common data reducer
export const commonDataReducer = createSlice({
    name: "common-data",
    initialState,
    reducers: {
        resetCommonData: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(isLoadingCommonDashboard.pending, (state) => {
                state.emissionIntensityDetailsIsLoading = true
                state.isLoadingProjectCount = true;
            })
            .addCase(getFiltersDate.pending, (state) => {
                state.isLoading = true
                state.isLoadingFilterDates = true;
                state.isSuccess = false;
                state.emissionDates = null;
            })
            .addCase(getFiltersDate.fulfilled, (state, action) => {
                state.isLoadingFilterDates = false;
                state.isSuccess = true;
                state.emissionDates = action.payload;
            })
            .addCase(getFiltersDate.rejected, (state, action) => {
                state.isLoadingFilterDates = isCancelRequest(action?.payload);
                state.isSuccess = false;
                state.emissionDates = null;
            })
            .addCase(getTimePeriod.pending, (state) => {
                state.timePeriodList = null;
                state.timePeriodLoading = true;

            })
            .addCase(getTimePeriod.fulfilled, (state, action) => {
                state.timePeriodList = action.payload;
                state.timePeriodLoading = false;
            })
            .addCase(getTimePeriod.rejected, (state, _) => {
                state.timePeriodLoading = false;
                state.timePeriodList = null;
            })
            .addCase(getDivisionList.pending, (state) => {
                state.isLoadingDivisions = true;
                state.isSuccess = false;
                state.divisions = null;
            })
            .addCase(getDivisionList.fulfilled, (state, action) => {
                state.isLoadingDivisions = false;
                state.isSuccess = true;
                state.divisions = action.payload;
            })
            .addCase(getDivisionList.rejected, (state, _) => {
                state.isLoadingDivisions = false;
                state.regions = null;
                state.divisions = null;
            })
            .addCase(regionShow.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.regions = null;
            })
            .addCase(regionShow.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.regions = action.payload;
            })
            .addCase(regionShow.rejected, (state, _) => {
                state.isLoading = false;
                state.regions = null;
                state.isSuccess = false;
            })
            .addCase(graphEmissionIntensity.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.emissionIntensityDetails = null;
                state.emissionIntensityDetailsIsLoading = true
            })
            .addCase(graphEmissionIntensity.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.emissionIntensityDetails = action.payload;
                state.emissionIntensityDetailsIsLoading = false
            })
            .addCase(graphEmissionIntensity.rejected, (state, action) => {
                state.isLoading = false;
                state.emissionIntensityDetails = null;
                state.isSuccess = false;
                state.emissionIntensityDetailsIsLoading = isCancelRequest(action?.payload)
            })
          
            .addCase(getProjectCount.pending, (state) => {
                state.isLoadingProjectCount = true;
                state.isSuccess = false;
                state.projectCountData = null
            })
            .addCase(getProjectCount.fulfilled, (state, action: { payload: { data: ProjectCountDataInterface } }) => {
                state.isLoadingProjectCount = false;
                state.isSuccess = true;
                state.projectCountData = action.payload;
            })
            .addCase(getProjectCount.rejected, (state, action) => {
                state.isLoadingProjectCount = isCancelRequest(action?.payload);
                state.isError = true;
                state.error = action.payload;
                state.isSuccess = false;
            })
            .addCase(updatePageTitle.fulfilled, (state, action) => {
                state.pageTitle = action.payload;
            })
            .addCase(openSidebar.fulfilled, (state, action) => {
                state.isSidebarOpen = action.payload;
            })

            .addCase(addUrl.pending, (state, _) => {
                state.isLoading = true
                state.isSuccess = false;
                state.urlKey = null;
            })
            .addCase(addUrl.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true;
                state.urlKey = action.payload;
            })
            .addCase(addUrl.rejected, (state, _) => {
                state.isLoading = false
                state.isSuccess = false;
                state.urlKey = null;
            })
            .addCase(getCmsContentApi.pending, (state) => {
                state.isLoadingCmsContent = true;
                state.isSuccess = false;
                state.cmsContent = null
            })
            .addCase(getCmsContentApi.fulfilled, (state, action) => {
                state.isLoadingCmsContent = false;
                state.isSuccess = true;
                state.cmsContent = action.payload;
            })
            .addCase(getCmsContentApi.rejected, (state, action) => {
                state.isLoadingCmsContent = isCancelRequest(action?.payload);
                state.isError = true;
                state.error = action.payload;
                state.isSuccess = false;
            })

            .addCase(getNotificationListing.pending, (state) => {
                state.isLoadingNotification = true;
                state.isSuccess = false;
                state.notificationDetail = null
            })
            .addCase(getNotificationListing.fulfilled, (state, action) => {
                state.isLoadingNotification = false;
                state.isSuccess = true;
                state.notificationDetail = action.payload;
            })
            .addCase(getNotificationListing.rejected, (state, action) => {
                state.isLoadingNotification = isCancelRequest(action?.payload);
                state.isError = true;
                state.error = action.payload;
                state.isSuccess = false;
            })
            .addCase(getOnboardQuestionList.pending, (state) => {
                state.isLoadingQuestions = true;
                state.questionsDto = null
            })
            .addCase(getOnboardQuestionList.fulfilled, (state, action) => {
                state.isLoadingQuestions = false;
                state.questionsDto = action.payload;
            })
            .addCase(getOnboardQuestionList.rejected, (state, action) => {
                state.isLoadingQuestions = isCancelRequest(action?.payload);
                state.questionsDto = null;

            })

            .addCase(addUpdateQuestionAnswere.pending, (state) => {
                state.isLoadingQuestions = true;
                state.questionListDto = null
            })
            .addCase(addUpdateQuestionAnswere.fulfilled, (state, action) => {
                state.isLoadingQuestions = false;
                state.questionListDto = action.payload
            })
            .addCase(addUpdateQuestionAnswere.rejected, (state, action) => {
                state.isLoadingQuestions = isCancelRequest(action?.payload);
                state.questionListDto = null

            })


    }
})

// Export actions and reducer
export const { resetCommonData } = commonDataReducer.actions;
export default commonDataReducer.reducer;
