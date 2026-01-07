import userServices from "../../store/user/userServices";
import {
  updateProfileApi, userSettingReducer, changePasswordApi, uploadProfilePic,
  getUserList, updateUserStatus, deleteUser, getUserRole, getUserDetailById,
  updateUser, getUserActivity, getFileUploadedDetail, getLoginActivity, initialState,
  resetUserData, addUser
} from "../../store/user/userSlice";
import { getUserDetails, authDataReducer } from "../../store/auth/authDataSlice";
import { ApiTest, TestFullFilledSlice, TestSliceMethod } from "../../commonCase/ReduxCases";
import { RenderPage } from "../../commonCase/RenderPageCase";
import UserSettingView from "../../pages/usersetting/UserSettingView";
import { nodeUrl } from "constant"
import authService from "store/auth/authService";

const updateProfileApiPayload = {
  first_name: "Chris",
  last_name: "cassell",
  phone_number: "",
  email: "chris.cassell@lowes.com",
};

const changePasswordApiPayload = {
  old_password: "test",
  new_password: "test",
}

const uploadProfilePicPayload = {
  fileMimeType: "",
  fileSize: "",
  isProfile: 1
}


const updateProfileApiDataObject = {
  service: userServices,
  serviceName: "updateProfileApi",
  sliceName: "updateProfileApi",
  sliceImport: updateProfileApi,
  data: updateProfileApiPayload,
  reducerName: userSettingReducer,
  loadingState: "isLoading",
  isSuccess: "isSuccess",
  actualState: "updateProfile",
};



const changePasswordApiDataObject = {
  service: userServices,
  serviceName: "changePasswordApi",
  sliceName: "changePasswordApi",
  sliceImport: changePasswordApi,
  data: changePasswordApiPayload,
  reducerName: userSettingReducer,
  loadingState: "isLoading",
  isSuccess: "isSuccess",
  actualState: "changePassword",
};

const uploadProfilePicApiDataObject = {
  service: userServices,
  serviceName: "uploadProfilePic",
  sliceName: "uploadProfilePic",
  sliceImport: uploadProfilePic,
  data: uploadProfilePicPayload,
  reducerName: userSettingReducer,
  loadingState: "isLoadingUpdateProfile",
  isSuccess: "isSuccess",
  actualState: "uploadProfilePic",
};


const getUserDetailsApiDataObject = {
  service: authService,
  serviceMethod: getUserDetails,
  serviceName: "getUserDetails",
  sliceName: "getUserDetails",
  sliceImport: getUserDetails,
  reducerName: authDataReducer,
  loadingState: "isLoading",
  isSuccess: "isSuccess",
  actualState: "userProfile",
};



const updateProfileApiTestData = {
  serviceName: "updateProfileApi",
  method: "post",
  data: updateProfileApiPayload,
  serviceImport: userServices,
  route: `${nodeUrl}profile-update`,
};

const changePasswordApiTestData = {
  serviceName: "changePasswordApi",
  method: "post",
  data: changePasswordApiPayload,
  serviceImport: userServices,
  route: `${nodeUrl}profile-update-password`,
};

const uploadProfilePicApiTestData = {
  serviceName: "updateProfilePicApi",
  method: "post",
  data: uploadProfilePicPayload,
  serviceImport: userServices,
  route: `${nodeUrl}blob-sas-token`,
};

const getUserDetailsApiTestData = {
  serviceName: "getUserDetails",
  method: "get",
  serviceImport: authService,
  route: `${nodeUrl}user-profile`,
};

const renderPageData = {
  navigate: true,
  dispatch: true,
  selector: [
    "userProfile",
    "updateProfile",
    "changePassword",
    "uploadProfilePic",
  ],
  component: <UserSettingView/>,
  testCaseName: "User Setting Component",
  documentId: "user-setting",
  title: "User Setting",
  reducerName: userSettingReducer,
};

const getUserListDataObject = {
  service: authService,
  serviceName: "getUserListApi",
  sliceName: "getUserList",
  sliceImport: getUserList,
  reducerName: userSettingReducer,
  loadingState: "isUserListLoading",
  actualState: "userList",
};

const getUserListApiTestData = {
  serviceName: "getUserListApi",
  method: "post",
  data: {},
  serviceImport: userServices,
  route: `${nodeUrl}get-user-list`,
};


const updateUserStatusDataObject = {
  service: authService,
  serviceName: "updateUserStatusApi",
  sliceName: "updateUserStatus",
  sliceImport: updateUserStatus,
  reducerName: userSettingReducer,
  loadingState: "isUserListByIdLoading",
  actualState: "updateUserStatusDto",
};

const updateUserStatusApiTestData = {
  serviceName: "updateUserStatusApi",
  method: "post",
  data: {},
  serviceImport: userServices,
  route: `${nodeUrl}activate-deactivate-user`,
};

const deleteUserDataObject = {
  service: authService,
  serviceName: "deleteUser",
  sliceName: "deleteUser",
  sliceImport: deleteUser,
  reducerName: userSettingReducer,
  loadingState: "isUserListByIdLoading",
  actualState: "deleteUserDto",
};

const deleteUserApiTestData = {
  serviceName: "deleteUser",
  method: "post",
  data: {},
  serviceImport: userServices,
  route: `${nodeUrl}delete-user`,
};


const getUserRoleDataObject = {
  service: authService,
  serviceName: "getRoleApi",
  sliceName: "getUserRole",
  sliceImport: getUserRole,
  reducerName: userSettingReducer,
  loadingState: "isLoading",
  actualState: "userRoleList",
};

const getUserRoleApiTestData = {
  serviceName: "getRoleApi",
  method: "get",
  data: {},
  serviceImport: userServices,
  route: `${nodeUrl}get-all-roles`,
};

const getUserDetailByIdDataObject = {
  service: authService,
  serviceName: "getUserDetailById",
  sliceName: "getUserDetailById",
  sliceImport: getUserDetailById,
  reducerName: userSettingReducer,
  loadingState: "isUserListByIdLoading",
  actualState: "singleUserDetail",
};

const getUserDetailByIdApiTestData = {
  serviceName: "getUserDetailById",
  method: "post",
  data: {},
  serviceImport: userServices,
  route: `${nodeUrl}get-user-detail-by-id`,
};

const updateUserDataObject = {
  service: authService,
  serviceName: "updateUserDetail",
  sliceName: "updateUser",
  sliceImport: updateUser,
  reducerName: userSettingReducer,
  loadingState: "isUserListByIdLoading",
  actualState: "updateUserDto",
};

const updateUserApiTestData = {
  serviceName: "updateUserDetail",
  method: "post",
  data: {},
  serviceImport: userServices,
  route: `${nodeUrl}update-user`,
};

const getUserActivityDataObject = {
  service: authService,
  serviceName: "userActivity",
  sliceName: "getUserActivity",
  sliceImport: getUserActivity,
  reducerName: userSettingReducer,
  loadingState: "isUserActivityLoading",
  actualState: "userActivityDetail",
};

const getUserActivityApiTestData = {
  serviceName: "userActivity",
  method: "post",
  data: {},
  serviceImport: userServices,
  route: `${nodeUrl}user-activity-logs`,
};

const getFileUploadedDetailDataObject = {
  service: authService,
  serviceName: "listFileOfUser",
  sliceName: "getFileUploadedDetail",
  sliceImport: getFileUploadedDetail,
  reducerName: userSettingReducer,
  loadingState: "userFileListLoading",
  actualState: "userFilListDetail",
};

const getFileUploadedDetailApiTestData = {
  serviceName: "listFileOfUser",
  method: "post",
  data: {},
  serviceImport: userServices,
  route: `${nodeUrl}user-file-upload-detail`,
};

const getLoginActivityDataObject = {
  service: authService,
  serviceName: "loginActivityApi",
  sliceName: "getLoginActivity",
  sliceImport: getLoginActivity,
  reducerName: userSettingReducer,
  loadingState: "isLoadingActivityLog",
  actualState: "loginActivityData",
};

const getLoginActivityApiTestData = {
  serviceName: "loginActivityApi",
  method: "get",
  data: {},
  serviceImport: userServices,
  route: `${nodeUrl}get-login-activity?user_id=`,
};



const addUserDataObject = {
  service: authService,
  serviceName: "addUserApi",
  sliceName: "addUser",
  sliceImport: addUser,
  reducerName: userSettingReducer,
  loadingState: "isAddUserLoading",
  actualState: "addUserDto",
};

const addUserApiTestData = {
  serviceName: "addUserApi",
  method: "post",
  data: {},
  serviceImport: userServices,
  route: `${nodeUrl}add-user`,
};


TestFullFilledSlice({
  data: [updateProfileApiDataObject,
    changePasswordApiDataObject, uploadProfilePicApiDataObject, getUserDetailsApiDataObject,
    getUserListDataObject,
    updateUserStatusDataObject,
    deleteUserDataObject,
    getUserRoleDataObject,
    getUserDetailByIdDataObject,
    updateUserDataObject,
    getUserActivityDataObject,
    getFileUploadedDetailDataObject,
    getLoginActivityDataObject,
    addUserDataObject
  ],
});

ApiTest({
  data: [updateProfileApiTestData, changePasswordApiTestData, uploadProfilePicApiTestData,
    getUserDetailsApiTestData,
    getUserListApiTestData,
    updateUserStatusApiTestData,
    deleteUserApiTestData,
    getUserRoleApiTestData,
    getUserDetailByIdApiTestData,
    updateUserApiTestData,
    getUserActivityApiTestData,
    getFileUploadedDetailApiTestData,
    getLoginActivityApiTestData,
    addUserApiTestData
  ],
});

TestSliceMethod({
  data: [updateProfileApiDataObject, changePasswordApiDataObject, getUserDetailsApiDataObject,
    uploadProfilePicApiDataObject,
    getUserListDataObject,
    updateUserStatusDataObject,
    deleteUserDataObject,
    getUserRoleDataObject,
    getUserDetailByIdDataObject,
    updateUserDataObject,
    getUserActivityDataObject,
    getFileUploadedDetailDataObject,
    getLoginActivityDataObject,
    addUserDataObject
  ],
});

// Test case initialState
describe('initial reducer', () => {
  it('should reset state to initialState when resetScopeOneCommonData is called', () => {
      const modifiedState: any = {
          data: [{ id: 1, value: 'test' }],
          loading: true,
          error: 'Something went wrong',
      };

      const result = userSettingReducer.reducer(modifiedState, resetUserData());

      expect(result).toEqual(initialState);


  });
});



RenderPage(renderPageData);
