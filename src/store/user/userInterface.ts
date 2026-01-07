// Define an interface named UserStateInterface to represent the state of a user.
export interface UserStateInterface {
  isSuccess: boolean; // Represents whether the operation related to the user was successful.
  isError: boolean; // Represents whether there was an error during the operation related to the user.
  isLoading: boolean; // Represents whether the application is currently loading data related to the user.
  data: any; // Holds the actual user data. It can be of any type.
  error: any; // Holds error information in case an error occurs during the operation.
  updateProfile: any;
  changePassword: any;
  isLoadingUpdateProfile: boolean;
  uploadProfilePic: any;
  isUserListLoading: boolean;
  userList: any
  userRoleList: any;
  singleUserDetail: any;
  isUserListByIdLoading: boolean
  userActivityDetail: any,
  isUserActivityLoading: boolean,
  userFilListDetail: any,
  userFileListLoading: boolean,
  isLoadingActivityLog: boolean,
  loginActivityData: any,
  updateUserStatusDto: any,
  deleteUserDto: any,
  updateUserDto: any,
  isAddUserLoading: boolean,
  addUserDto: any
}
