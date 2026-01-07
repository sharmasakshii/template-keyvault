// Define an interface named UserStateInterface to represent the state of a user.
export interface RoleStateInterface {
  isSuccess: boolean; // Represents whether the operation related to the user was successful.
  isError: boolean; // Represents whether there was an error during the operation related to the user.
  isLoading: boolean; // Represents whether the application is currently loading data related to the user.
  error: any; // Holds error information in case an error occurs during the operation.
  isRoleListLoading: boolean;
  roleList: any;
  roleDetail: any;
  isRoleDetailByIdLoading: boolean
  moduleList: any
  createRoleDto: any
  isCreateRoleDtoLoading: boolean
  isModuleList: boolean
}
