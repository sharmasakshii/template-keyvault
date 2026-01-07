import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setLoading } from "store/home/homeSlice";
import authService from "./authService";
import { AuthDataInterface } from "./authDataInterface";
import { getErrorMessage } from "utils";
import { resetCommonData } from "../commonData/commonSlice"
import { resetSustain, setShowPasswordExpire } from "../sustain/sustainSlice"
import { resetRegionOverview } from "../scopeThree/track/region/regionOverviewSlice"
import { resetRegion } from "../scopeThree/track/region/regionSlice"
import { resetFacility } from "../scopeThree/track/facility/facilityDataSlice"
import { resetRegionDash } from "store/dashRegion/dashRegionSlice";
import { resetLanes } from "store/scopeThree/track/lane/laneDetailsSlice";
import { resetCarrier } from "store/scopeThree/track/carrier/vendorSlice";
import { resetFacilityOverview } from "store/scopeThree/track/facilityOverview/facilityOverviewDataSlice";
import { resetUserData } from "store/user/userSlice";
import { resetProject } from "store/project/projectSlice";
import { resetDecarbData } from "store/scopeThree/track/decarb/decarbSlice";
import { resetBenchmarkData } from "store/benchmark/benchmarkSlice";
import { resetBusinessUnit } from "store/businessUnit/businessUnitSlice";
import { toast } from "react-toastify";


/**
 * Initial state for the authentication
 */
export const initialState: AuthDataInterface = {
    isError: false,
    isSuccess: false,
    isLoading: false,
    isAuthLoginLoading: false,
    isOtpVerifyLoading: false,
    message: null,
    loginDetails: null,
    isOtp: false,
    otpSuccess: false,
    otpError: false,
    bucketLoginDetails: null,
    bucketLoginLoading: false,
    bucketFileLoading: false,
    bucketFileUpload: null,
    regionalId: "",
    divisionId: "",
    scopeType: null,
    applicationTypeStatus: "",
    userProfile: null,
    resendOtpPostDto: null,
    fuelStopListDto: null,
}

// Async Thunks

// Login slice
export const loginPost = createAsyncThunk("post/login", async (userData: any, thunkApi: any) => {
    thunkApi.dispatch(setLoading(true));
    try {
        const response = await authService.authLoginPost(userData);
        if (response?.data?.token) {
            thunkApi.dispatch(setShowPasswordExpire(true));
            if (response?.data?.division_id === 0) {
                thunkApi.dispatch(setDivisionId( ""))
            } else {
                thunkApi.dispatch(setDivisionId(response?.data?.division_id ?? ""))
            }
            thunkApi.dispatch(setRegionalId(response?.data?.region_id ?? ""))
        }
        thunkApi.dispatch(setLoading(false));
        return response;
    } catch (error: any) {

        const message: any = getErrorMessage(error)

        thunkApi.dispatch(setLoading(false));
        return thunkApi.rejectWithValue(message);
    }
});

export const setRegionalId = createAsyncThunk("set/region", async (status: any) => {
    return status
})

export const setDivisionId = createAsyncThunk("set/division", async (status: any) => {
    return status
})

// Verify OTP slice
export const otpPost = createAsyncThunk("post/otp", async (useData: any, thunkApi: any) => {
    thunkApi.dispatch(setLoading(true));
    try {
        const response = await authService.authPostOtp(useData);
        if (response) {
            thunkApi.dispatch(setShowPasswordExpire(true));
              if (response?.data?.division_id === 0) {
                thunkApi.dispatch(setDivisionId( ""))
            } else {
                thunkApi.dispatch(setDivisionId(response?.data?.division_id ?? ""))
            }
            // thunkApi.dispatch(setDivisionId(response?.data?.division_id ?? ""))
            thunkApi.dispatch(setRegionalId(response?.data?.region_id ?? ""))
        }
        thunkApi.dispatch(setLoading(false));
        return response;
    } catch (error: any) {
        const message: any = getErrorMessage(error)
        thunkApi.dispatch(setLoading(false));
        return thunkApi.rejectWithValue(message);
    }
});

// Resend OTP slice
export const resendOtpPost = createAsyncThunk("resendPost/otp", async (useData: any, thunkApi: any) => {
    thunkApi.dispatch(setLoading(true));
    try {
        const res = await authService.resendPostOtp(useData);
        thunkApi.dispatch(setLoading(false));
        return res;
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        thunkApi.dispatch(setLoading(false));
        return thunkApi.rejectWithValue(message);
    }
});

export const bucketLogin = createAsyncThunk("bucket/login", async (useData: any, thunkApi: any) => {
    try {
        const response = await authService.bucketLoginPost(useData);
        thunkApi.dispatch(setLoading(false));
        useData.navigate("/bucket-add")
        return response;
    }
    catch (error: any) {
        const message: any = getErrorMessage(error)
        thunkApi.dispatch(setLoading(false));
        return thunkApi.rejectWithValue(message);
    }
});

export const uploadBucketFile = createAsyncThunk("bucket/upload/file", async (useData: any, thunkApi: any) => {
    try {
        const response = await authService.bucketUploadFile(useData);
        return response;
    } catch (error: any) {
        const message: any = getErrorMessage(error)
        thunkApi.dispatch(setLoading(false));
        return thunkApi.rejectWithValue(message);
    }
});


export const getUserDetails = createAsyncThunk("get/getUserDetails", async (_, thunkApi) => {
    try {
        return await authService.getUserDetails();
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});

export const getFuelStops = createAsyncThunk("get/fuel/stops", async (_, thunkApi) => {
    try {
        return await authService.getFuelStopApi();
    } catch (error: any) {
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});


export const resetOnboarding = createAsyncThunk(
    "reset/Onboarding",
    async (userData: any, thunkApi) => {
        try {
            const res = await authService.resetOnboardingApi(userData);
            if (res) {
                toast.success("Onboarding Reset Successfully")
                thunkApi.dispatch(getUserDetails());
            }
            return res
        } catch (error: any) {
            const message: any = getErrorMessage(error);
            return thunkApi.rejectWithValue(message);
        }
    }
);


export const updateAuthStore = createAsyncThunk("auth/login/detail", async (useData: any, thunkApi: any) => {
    return useData
});

export const updateScopeType = createAsyncThunk("auth/scope/type", async (payload: any, thunkApi: any) => {
    return payload
});


export const applicationType = createAsyncThunk("application/type", (status: string) => {
    return status
})


// Logout slice
export const resetStore = createAsyncThunk("post/reset/store", async (_, thunkApi) => {
    thunkApi.dispatch(resetAuth())
    thunkApi.dispatch(resetRegionOverview());
    thunkApi.dispatch(resetRegion())
    thunkApi.dispatch(resetFacility())
    thunkApi.dispatch(resetSustain())
    thunkApi.dispatch(resetCommonData())
    thunkApi.dispatch(resetRegionDash())
    thunkApi.dispatch(resetBusinessUnit())
    thunkApi.dispatch(resetLanes())
    thunkApi.dispatch(resetCarrier())
    thunkApi.dispatch(resetFacilityOverview())
    thunkApi.dispatch(resetUserData())
    thunkApi.dispatch(resetProject())
    thunkApi.dispatch(resetDecarbData())
    thunkApi.dispatch(resetBenchmarkData())
    return localStorage.clear();
})

export const logoutPost = createAsyncThunk("post/logout", async (_, thunkApi) => {
    try {
        authService.logOutApi()
        console.error("Error during logout:");

        thunkApi.dispatch(resetStore());
        return localStorage.clear();

    } catch (error: any) {
        console.error("Error during logout:", error);
        thunkApi.dispatch(resetStore())
        const message: any = getErrorMessage(error);
        return thunkApi.rejectWithValue(message);
    }
});

// Authentication Reducer
export const authDataReducer = createSlice({
    name: "auth-login",
    initialState,
    reducers: {
        resetAuth: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginPost.pending, (state: any, _: any) => {
                state.isAuthLoginLoading = true;
                state.isSuccess = false;
            })
            .addCase(loginPost.fulfilled, (state: any, action: any) => {
                state.isAuthLoginLoading = false;
                state.isSuccess = true;
                state.isOtp = action?.payload?.data?.otp || false;
                state.loginDetails = action.payload;
            })
            .addCase(loginPost.rejected, (state: any) => {
                state.isAuthLoginLoading = false;
                state.isSuccess = false;
            })
            .addCase(logoutPost.fulfilled, (state: any) => {
                state.loginDetails = null;
                state.isSuccess = false;
            })
            .addCase(getUserDetails.pending, (state) => {
                state.isSuccess = false;
                state.isLoading = true;
            })
            .addCase(getUserDetails.fulfilled, (state, action) => {
                state.isSuccess = true;
                state.isLoading = false;
                state.userProfile = action.payload;
            })
            .addCase(getUserDetails.rejected, (state, _) => {
                state.isSuccess = false;
                state.isLoading = false;
            })

            .addCase(getFuelStops.pending, (state) => {
                state.isSuccess = false;
                state.isLoading = true;
            })
            .addCase(getFuelStops.fulfilled, (state, action) => {
                state.isSuccess = true;
                state.isLoading = false;
                state.fuelStopListDto = action.payload;
            })
            .addCase(getFuelStops.rejected, (state, _) => {
                state.isSuccess = false;
                state.isLoading = false;
            })

            // 
            .addCase(otpPost.pending, (state) => {
                state.isOtpVerifyLoading = true;
                state.otpSuccess = false;
            })
            .addCase(otpPost.fulfilled, (state: any, action: any) => {
                state.isOtpVerifyLoading = false;
                state.otpSuccess = true;
                state.isOtp = false;
                state.loginDetails = action.payload;
            })
            .addCase(otpPost.rejected, (state: any) => {
                state.isOtpVerifyLoading = false;
                state.otpSuccess = false;
            })
            .addCase(resendOtpPost.pending, (state) => {
                state.isOtpVerifyLoading = true;
                state.resendOtpPostDto = null;

                state.otpSuccess = false;
            })
            .addCase(resendOtpPost.fulfilled, (state: any, action: any) => {
                state.isOtpVerifyLoading = false;
                state.resendOtpPostDto = action.payload;

            })
            .addCase(resendOtpPost.rejected, (state: any) => {
                state.isOtpVerifyLoading = false;
                state.resendOtpPostDto = null;

            })
            .addCase(bucketLogin.fulfilled, (state: any, action: any) => {
                state.bucketLoginDetails = action.payload;
                state.bucketLoginLoading = false;
            })
            .addCase(bucketLogin.rejected, (state: any) => {
                state.bucketLoginLoading = false;
            })
            .addCase(bucketLogin.pending, (state: any) => {
                state.bucketLoginLoading = true;
            })
            .addCase(uploadBucketFile.fulfilled, (state: any, action: any) => {
                state.bucketFileUpload = action.payload;
                state.isSuccess = true;
                state.bucketFileLoading = false;
            })
            .addCase(uploadBucketFile.rejected, (state: any) => {
                state.bucketFileLoading = false;
                state.bucketFileUpload = null
            })
            .addCase(uploadBucketFile.pending, (state: any) => {
                state.bucketFileLoading = true;
                state.bucketFileUpload = null;
            })
            .addCase(updateAuthStore.fulfilled, (state: any, action: any) => {
                state.loginDetails = action.payload;
            })

            .addCase(updateScopeType.fulfilled, (state: any, action: any) => {
                state.scopeType = action.payload;
            })

            .addCase(setRegionalId.fulfilled, (state: any, action: any) => {
                state.regionalId = action.payload
            })
            .addCase(setDivisionId.fulfilled, (state: any, action: any) => {
                state.divisionId = action.payload
            })
            .addCase(applicationType.fulfilled, (state, action) => {
                state.applicationTypeStatus = action.payload;
            })
    }

});

export const { resetAuth } = authDataReducer.actions;
export default authDataReducer.reducer;
