import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage, isCancelRequest } from "../../utils";
import roleServices from "./roleServices";
import { toast } from "react-toastify";
import { RoleStateInterface } from "./roleInterface";


export const initialState: RoleStateInterface = {
  isSuccess: false,
  isError: false,
  isLoading: false,
  error: null,
  roleList: null,
  isRoleListLoading: false,
  roleDetail: null,
  isRoleDetailByIdLoading: false,
  moduleList: null,
  createRoleDto: null,
  isCreateRoleDtoLoading: false,
  isModuleList: false

};

export const getRoleList = createAsyncThunk(
  "get/role/list",
  async (roleData: any, thunkApi) => {
    try {
      return await roleServices.getRoleListApi(roleData);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const updateRoleListStatus = createAsyncThunk(
  "get/role/list/status",
  async (status: boolean) => {
    return status
  }
);

export const deleteRole = createAsyncThunk(
  "delete/role",
  async ({ data, rolePayLoad }: any, thunkApi: any) => {
    try {
      let res = await roleServices.deleteRoleApi(data);
      await thunkApi.dispatch(getRoleList(rolePayLoad));
      toast.success(`Role deleted successfully`)
      return res
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);


export const addRole = createAsyncThunk(
  "create/role",
  async ({ userPaylod, isNavigate, navigate }: any, thunkApi: any) => {
    try {
      const res = await roleServices.addRoleApi(userPaylod);
      toast.success(`Role created successfully`)
      if (isNavigate) {
        navigate("/role-management")
      }
      return res
    } catch (error: any) {
      const message: any = getErrorMessage(error);

      return thunkApi.rejectWithValue(message);
    }
  }
);
export const getRoleDetailById = createAsyncThunk(
  "get/role/by-id",
  async (data: any, thunkApi: any) => {
    try {
      return await roleServices.getRoleDetailByIdApi(data);
    } catch (error: any) {
      const message: any = getErrorMessage(error);

      return thunkApi.rejectWithValue(message);
    }
  }
);
export const updateRole = createAsyncThunk(
  "update/role",
  async ({ userPaylod, navigate }: any, thunkApi: any) => {
    try {
      const res = await roleServices.updateRoleDetail(userPaylod);
      toast.success("Role updated successfully")
      navigate("/role-management")
      return res
    } catch (error: any) {
      const message: any = getErrorMessage(error);

      return thunkApi.rejectWithValue(message);
    }
  }
);


export const getAllModules = createAsyncThunk(
  "get/modules",
  async (_, thunkApi: any) => {
    try {
      return await roleServices.getAllModulesApi();
    } catch (error: any) {
      const message: any = getErrorMessage(error);

      return thunkApi.rejectWithValue(message);
    }
  }
);



export const roleReducer = createSlice({
  name: "role-details",
  initialState,
  reducers: {
    resetRoleData: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(updateRoleListStatus.fulfilled, (state, action) => {
        state.isRoleListLoading = action?.payload ?? false;
      })
      .addCase(getRoleList.pending, (state) => {
        state.isSuccess = false;
        state.isLoading = true;
        state.isRoleListLoading = true;
        state.createRoleDto = null
        state.roleDetail = null;
      })
      .addCase(addRole.pending, (state) => {
        state.isSuccess = false;
        state.isLoading = true;
        state.isCreateRoleDtoLoading = true;
        state.createRoleDto = null
      })
      .addCase(addRole.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.createRoleDto = action?.payload;
        state.isCreateRoleDtoLoading = false
      })
      .addCase(addRole.rejected, (state, _) => {
        state.isSuccess = false;
        state.isLoading = false;
        state.isCreateRoleDtoLoading = false
      })
      .addCase(getRoleList.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.roleList = action?.payload;
        state.isRoleListLoading = false
      })
      .addCase(getRoleList.rejected, (state, action) => {
        state.isSuccess = false;
        state.isLoading = false;
        state.isRoleListLoading = isCancelRequest(action?.payload);
      })
      .addCase(deleteRole.pending, (state) => {
        state.isSuccess = false;
        state.isLoading = true;
        state.isRoleListLoading = true;
        state.isRoleDetailByIdLoading = true
      })
      .addCase(deleteRole.fulfilled, (state, _) => {
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(deleteRole.rejected, (state, _) => {
        state.isSuccess = false;
        state.isLoading = false;
        state.isRoleListLoading = false
        state.isRoleDetailByIdLoading = false

      })
  
      .addCase(getRoleDetailById.pending, (state) => {
        state.isSuccess = false;
        state.isLoading = true;
        state.isRoleDetailByIdLoading = true;
        state.roleDetail = null;

      })
      .addCase(getRoleDetailById.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.isRoleDetailByIdLoading = false;
        state.roleDetail = action?.payload;
      })
      .addCase(getRoleDetailById.rejected, (state, action) => {
        state.isSuccess = false;
        state.isLoading = false;
        state.isRoleDetailByIdLoading = false

      })
      .addCase(getAllModules.pending, (state) => {
        state.isSuccess = false;
        state.isLoading = true;
        state.moduleList = null;
        state.isModuleList = true
      })
      .addCase(getAllModules.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.moduleList = action?.payload;
        state.isModuleList = false

      })
      .addCase(getAllModules.rejected, (state, action) => {
        state.isSuccess = false;
        state.isLoading = false;
        state.moduleList = null
        state.isModuleList = false

      })
      .addCase(updateRole.pending, (state) => {
        state.isSuccess = false;
        state.isLoading = true;
        state.isRoleListLoading = true;
      })
      .addCase(updateRole.fulfilled, (state, _) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.isRoleListLoading = false
      })
      .addCase(updateRole.rejected, (state, _) => {
        state.isSuccess = false;
        state.isLoading = false;
        state.isRoleListLoading = false
      })

  },
});

export const { resetRoleData } = roleReducer.actions;
export default roleReducer.reducer;
