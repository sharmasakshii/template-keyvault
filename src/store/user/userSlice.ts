import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage, isCancelRequest } from "../../utils";
import userServices from "./userServices";
import { toast } from "react-toastify";
import { UserStateInterface } from "./userInterface";
import {
  getRoleList, updateRoleListStatus
} from "store/role/roleSlice";


export const initialState: UserStateInterface = {
  isSuccess: false,
  isError: false,
  isLoading: false,
  data: null,
  error: null,
  isLoadingUpdateProfile: false,
  updateProfile: null,
  changePassword: null,
  uploadProfilePic: null,
  userList: null,
  isUserListLoading: false,
  userRoleList: null,
  singleUserDetail: null,
  isUserListByIdLoading: false,
  userActivityDetail: null,
  isUserActivityLoading: false,
  userFilListDetail: null,
  userFileListLoading: false,
  isLoadingActivityLog: false,
  loginActivityData: null,
  updateUserStatusDto: null,
  deleteUserDto: null,
  updateUserDto: null,
  addUserDto: null,
  isAddUserLoading: false
};


export const changePasswordApi = createAsyncThunk(
  "update/changePasswordApi",
  async (userData: any, thunkApi) => {
    try {
      await userServices.changePasswordApi(userData);
      toast.success("Password updated successfully");
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const updateProfileApi = createAsyncThunk(
  "update/updateProfileApi",
  async (userData: any, thunkApi) => {
    try {
      await userServices.updateProfileApi(userData);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const uploadProfilePic = createAsyncThunk(
  "update/uploadProfilePic",
  async (userData: any, thunkApi) => {
    try {
      await userServices.updateProfilePicApi(userData);
      toast.success("Profile uploaded successfully");
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getUserList = createAsyncThunk(
  "get/user/list",
  async (userData: any, thunkApi: any) => {
    try {
      return await userServices.getUserListApi(userData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);


export const updateUserStatus = createAsyncThunk(
  "update/status/user",
  async ({ data, userPayLoad }: any, thunkApi: any) => {
    try {
      const res = await userServices.updateUserStatusApi(data);
      if (userPayLoad?.isDetail) {
        await thunkApi.dispatch(getUserDetailById({
          user_id: userPayLoad?.userId,
        }));
      } else {
        await thunkApi.dispatch(getUserList(userPayLoad));

      }
      toast.success(`User ${data?.status === 2 ? "deactivated" : "activated"} successfully`)
      return res
    } catch (error: any) {
      const message: any = getErrorMessage(error);

      return thunkApi.rejectWithValue(message);
    }
  }
);



export const deleteUser = createAsyncThunk(
  "delete/user",
  async ({ data, userPayLoad }: any, thunkApi: any) => {
    try {
      const res = await userServices.deleteUser(data);
      if (userPayLoad?.isDetail) {
        userPayLoad.navigate("/user-management")
        await thunkApi.dispatch(getUserDetailById({
          user_id: userPayLoad?.userId,
        }));
      } else {
        await thunkApi.dispatch(getUserList(userPayLoad));
      }
      toast.success("User deleted  successfully")
      return res
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);


export const getUserRole = createAsyncThunk(
  "get/user/role",
  async (_, thunkApi: any) => {
    try {
      return await userServices.getRoleApi();
    } catch (error: any) {
      const message: any = getErrorMessage(error);

      return thunkApi.rejectWithValue(message);
    }
  }
);

export const addUser = createAsyncThunk(
  "create/user",
  async ({ data, userPayLoad, isRole, isAddUser, navigate }: any, thunkApi: any) => {
    try {
      thunkApi.dispatch(updateRoleListStatus(true));
      const res = await userServices.addUserApi(data);
      if (isRole) {
        await thunkApi.dispatch(getRoleList(userPayLoad));
      } else {
        await thunkApi.dispatch(getUserList(userPayLoad));
      }
      if (isAddUser) {
        navigate("/role-management")
      }
      toast.success("User created successfully")
      return res
    } catch (error: any) {
      thunkApi.dispatch(updateRoleListStatus(false));

      const message: any = getErrorMessage(error);

      return thunkApi.rejectWithValue(message);
    }
  }
);
export const getUserDetailById = createAsyncThunk(
  "get/user/by-id",
  async (data: any, thunkApi: any) => {
    try {
      return await userServices.getUserDetailById(data);
    } catch (error: any) {
      const message: any = getErrorMessage(error);

      return thunkApi.rejectWithValue(message);
    }
  }
);
export const updateUser = createAsyncThunk(
  "update/user",
  async ({ data, navigate }: any, thunkApi: any) => {
    try {
      const res = await userServices.updateUserDetail(data);
      toast.success(res?.message)
      navigate("/user-management")
      return res
    } catch (error: any) {
      const message: any = getErrorMessage(error);

      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getFileUploadedDetail = createAsyncThunk(
  "user/file/uploaded/list",
  async (data: any, thunkApi: any) => {
    try {
      return await userServices.listFileOfUser(data);
    } catch (error: any) {
      const message: any = getErrorMessage(error);

      return thunkApi.rejectWithValue(message);
    }
  }
);
export const getUserActivity = createAsyncThunk(
  "user/activity/list",
  async (data: any, thunkApi: any) => {
    try {
      return await userServices.userActivity(data);
    } catch (error: any) {
      const message: any = getErrorMessage(error);

      return thunkApi.rejectWithValue(message);
    }
  }
);

// get user login activity slice
export const getLoginActivity = createAsyncThunk(
  "user/login/activity",
  async (data: any, thunkApi: any) => {
    try {
      return await userServices.loginActivityApi(data);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const userSettingReducer = createSlice({
  name: "user-details",
  initialState,
  reducers: {
    resetUserData: () => initialState,
    resetUserActivity: (state) => { state.userActivityDetail = null }
  },

  extraReducers: (builder) => {
    builder

      .addCase(uploadProfilePic.pending, (state) => {
        state.isSuccess = false;
        state.isLoadingUpdateProfile = true;
      })
      .addCase(uploadProfilePic.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoadingUpdateProfile = false;
        state.uploadProfilePic = action?.payload;
      })
      .addCase(uploadProfilePic.rejected, (state, _) => {
        state.isSuccess = false;
        state.isLoadingUpdateProfile = false;
      })
      .addCase(updateProfileApi.pending, (state) => {
        state.isSuccess = false;
        state.isLoading = true;
        state.updateProfile = null;
      })
      .addCase(updateProfileApi.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.updateProfile = action?.payload;
      })
      .addCase(updateProfileApi.rejected, (state, _) => {
        state.isSuccess = false;
        state.isLoading = false;
        state.updateProfile = null;
      })
      .addCase(changePasswordApi.pending, (state) => {
        state.isSuccess = false;
        state.isLoading = true;
      })
      .addCase(changePasswordApi.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.changePassword = action?.payload;
      })
      .addCase(changePasswordApi.rejected, (state, _) => {
        state.isSuccess = false;
        state.isLoading = false;
      })
      .addCase(getUserList.pending, (state) => {
        state.isSuccess = false;
        state.isLoading = true;
        state.isUserListLoading = true;
        state.userActivityDetail = null
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.userList = action?.payload;
        state.isUserListLoading = false
        state.singleUserDetail = null
      })
      .addCase(getUserList.rejected, (state, action) => {
        state.isSuccess = false;
        state.isLoading = false;
        state.userActivityDetail = null;
        state.isUserListLoading = isCancelRequest(action?.payload);
      })
      .addCase(updateUserStatus.pending, (state) => {
        state.isSuccess = false;
        state.isLoading = true;
        state.isUserListLoading = true;
        state.isUserListByIdLoading = true
        state.updateUserStatusDto = null
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.updateUserStatusDto = action?.payload
      })
      .addCase(updateUserStatus.rejected, (state, _) => {
        state.isSuccess = false;
        state.isLoading = false;
        state.isUserListLoading = false
        state.isUserListByIdLoading = false
        state.updateUserStatusDto = null


      })
      .addCase(getUserRole.pending, (state) => {
        state.isSuccess = false;
        state.isLoading = true;
      })
      .addCase(getUserRole.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.userRoleList = action?.payload;
      })
      .addCase(getUserRole.rejected, (state, _) => {
        state.isSuccess = false;
        state.isLoading = false;
      })
      .addCase(addUser.pending, (state) => {
        state.isSuccess = false;
        state.isLoading = true;
        state.isUserListLoading = true;
        state.isAddUserLoading = true
        state.addUserDto = null
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.isAddUserLoading = false
        state.addUserDto = action.payload

      })
      .addCase(addUser.rejected, (state, _) => {
        state.isSuccess = false;
        state.isLoading = false;
        state.isUserListLoading = false
        state.isAddUserLoading = false

      })
      .addCase(getUserDetailById.pending, (state) => {
        state.isSuccess = false;
        state.isLoading = true;
        state.isUserListByIdLoading = true;
        state.singleUserDetail = null
      })
      .addCase(getUserDetailById.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.isUserListByIdLoading = false;
        state.singleUserDetail = action?.payload;
      })
      .addCase(getUserDetailById.rejected, (state, action) => {
        state.isSuccess = false;
        state.isLoading = false;
        state.isUserListByIdLoading = false
      })
      .addCase(deleteUser.pending, (state) => {
        state.isSuccess = false;
        state.isLoading = true;
        state.isUserListByIdLoading = true;
        state.deleteUserDto = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.isUserListByIdLoading = false;
        state.deleteUserDto = action?.payload
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isSuccess = false;
        state.isLoading = false;
        state.isUserListByIdLoading = false
        state.deleteUserDto = null
      })
      .addCase(updateUser.pending, (state) => {
        state.isSuccess = false;
        state.isLoading = true;
        state.isUserListByIdLoading = true
        state.updateUserDto = null

      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.singleUserDetail = null;
        state.isUserListByIdLoading = false
        state.updateUserDto = action?.payload
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isSuccess = false;
        state.isLoading = false;
        state.isUserListByIdLoading = false
      })
      .addCase(getUserActivity.pending, (state) => {
        state.isSuccess = false;
        state.isLoading = true;
        state.isUserActivityLoading = true
        state.userActivityDetail = null
      })
      .addCase(getUserActivity.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.isUserActivityLoading = false
        state.userActivityDetail = action.payload
      })
      .addCase(getUserActivity.rejected, (state, action) => {
        state.isSuccess = false;
        state.isLoading = false;
        state.isUserActivityLoading = false
        state.userActivityDetail = null
      })
      .addCase(getFileUploadedDetail.pending, (state) => {
        state.isSuccess = false;
        state.isLoading = true;
        state.userFileListLoading = true
        state.userFilListDetail = null
      })
      .addCase(getFileUploadedDetail.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.userFileListLoading = false
        state.userFilListDetail = action.payload
      })
      .addCase(getFileUploadedDetail.rejected, (state, action) => {
        state.isSuccess = false;
        state.isLoading = false;
        state.userFileListLoading = false
        state.userFilListDetail = null
      })
      .addCase(getLoginActivity.pending, (state) => {
        state.isSuccess = false;
        state.isLoading = true;
        state.isLoadingActivityLog = true;
        state.loginActivityData = null
      })
      .addCase(getLoginActivity.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoadingActivityLog = false;
        state.loginActivityData = action.payload
      })
      .addCase(getLoginActivity.rejected, (state, _) => {
        state.isSuccess = false;
        state.isLoading = false;
        state.isLoadingActivityLog = false
      })
  },
});

export const { resetUserData, resetUserActivity } = userSettingReducer.actions;
export default userSettingReducer.reducer;
