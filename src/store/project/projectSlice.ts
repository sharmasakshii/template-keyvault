// Import necessary dependencies and modules
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage, isCancelRequest } from "../../utils";
import projectService from "./projectService";
import { ProjectState } from "./projectDataInterface";

// Define the initial state for the facility reducer
const initialState: ProjectState = {
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    projectList: null,
    projectListLoading: false,
    removeProject: null,
    searchProjectList: null,
    isLoadingProjectDetails: false,
    projectDetails: null,
    isLoadingSaveProject: false,
    saveProject: null,
    saveProjectRating: null,
    searchedUsers: null,
    isLoadingEmailSearch: false
};

// Define an asynchronous thunk for fetching project data
export const projectData = createAsyncThunk(
    "get/project/project-Data",
    async (userData: any, thunkApi) => {
        try {
            // Call the projectService to fetch project data with user data and token header
            return await projectService.getProjectList(userData);
        } catch (error: any) {
            // Handle errors and return an error message
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

// Define an asynchronous thunk for deleting a project
export const projectDelete = createAsyncThunk(
    "get/project/project-Delete",
    async (userData: any, thunkApi) => {
        try {
            // Call the projectService to delete a project with user data and token header
            await projectService.removeProjectList({ project_id: userData?.id });

            return thunkApi.dispatch(projectData(userData?.data))
        } catch (error: any) {
            // Handle errors and return an error message
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

// Define an asynchronous thunk for searching for project data
export const searchProjectData = createAsyncThunk(
    "get/project/project-search",
    async (data: any, thunkApi) => {
        try {
            // Call the projectService to search for project data with token header
            return await projectService.searchProjectList(data);
        } catch (error: any) {
            // Handle errors and return an error message
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

// Define an asynchronous thunk for fetching project details
export const getProjectDetails = createAsyncThunk(
    "get/project/detail",
    async (userData: any, thunkApi) => {
        try {
            // Call the projectService to fetch project details with user data and token header
            return await projectService.getProjectDetails(userData);
        } catch (error: any) {
            // Handle errors and return an error message
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const saveProjectDetailData = createAsyncThunk(
    "save/project-detail",
    async (data: any, thunkApi: any) => {
        try {
            return await projectService.saveProjectDetailsApi(data);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const saveProjectRatingData = createAsyncThunk(
    "save/save-project-rating",
    async (data: any, thunkApi: any) => {
        try {
            return await projectService.saveProjectRatingDataGet(data);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const searchByEmail = createAsyncThunk(
    "search/user/by/email",
    async (data: any, thunkApi: any) => {
        try {
            return await projectService.searchByEmailApi(data);
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);

export const cleanupAction = createAsyncThunk(
    "cleanup/project/detail",
    async (_, thunkApi) => {
        return null
    })

// Define the facilityDataReducer slice
export const projectReducer = createSlice({
    name: "project",
    initialState,
    reducers: {
        resetProject: () => initialState,
        resetProjectDetails: (state) => {
            state.projectDetails = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(projectData.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.projectList = null;
                state.projectListLoading = true;
            })
            .addCase(projectData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.projectList = action.payload;
                state.projectListLoading = false;

            })
            .addCase(projectData.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = action.payload;
                state.isSuccess = false;
                state.projectListLoading = isCancelRequest(action?.payload);
            })
            .addCase(searchProjectData.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.searchProjectList = null;
            })
            .addCase(searchProjectData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.searchProjectList = action.payload;
            })
            .addCase(searchProjectData.rejected, (state, _) => {
                state.isLoading = false;
                state.searchProjectList = null;
                state.isSuccess = false;
            })
            .addCase(projectDelete.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
            })
            .addCase(projectDelete.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.removeProject = action.payload;
            })
            .addCase(projectDelete.rejected, (state, _) => {
                state.isLoading = false;
                state.removeProject = null;
                state.isSuccess = false;
            })
            .addCase(getProjectDetails.pending, (state) => {
                state.isLoadingProjectDetails = true;
                state.isSuccess = false;
                state.projectDetails = null;
            })
            .addCase(getProjectDetails.fulfilled, (state, action) => {
                state.isLoadingProjectDetails = false;
                state.isSuccess = true;
                state.projectDetails = action.payload;
            })
            .addCase(getProjectDetails.rejected, (state, action) => {
                state.isLoadingProjectDetails = isCancelRequest(action?.payload);
                state.projectDetails = null;
                state.isSuccess = false;
            })
            .addCase(saveProjectDetailData.pending, (state) => {
                state.isLoadingSaveProject = true;
                state.isSuccess = false;
                state.saveProject = null;
                state.message = "";
            })
            .addCase(saveProjectDetailData.fulfilled, (state, action) => {
                state.isLoadingSaveProject = false;
                state.isSuccess = true;
                state.saveProject = action.payload;
                state.message = "";
            })
            .addCase(saveProjectDetailData.rejected, (state, action) => {
                state.isLoadingSaveProject = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.payload;
            })
            .addCase(saveProjectRatingData.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.saveProjectRating = null;
            })
            .addCase(saveProjectRatingData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.saveProjectRating = action.payload;
            })
            .addCase(saveProjectRatingData.rejected, (state, _) => {
                state.isLoading = false;
                state.saveProjectRating = null;
                state.isSuccess = false;
            })
            .addCase(searchByEmail.pending, (state) => {
                state.isLoadingEmailSearch = true;
                state.isSuccess = false;
                state.searchedUsers = null;
            })
            .addCase(searchByEmail.fulfilled, (state, action) => {
                state.isLoadingEmailSearch = false;
                state.isSuccess = true;
                state.searchedUsers = action.payload;
            })
            .addCase(searchByEmail.rejected, (state, _) => {
                state.isLoadingEmailSearch = false;
                state.searchedUsers = null;
                state.isSuccess = false;
            })
    }
});

// Export actions and the reducer from the facilityDataReducer slice
export const { resetProject, resetProjectDetails } = projectReducer.actions;
export default projectReducer.reducer;
