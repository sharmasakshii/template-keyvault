// Define a Type for Role and Permissions Data
export interface RoleData {
    id: number;
    name: string;
    // Add other fields as necessary
}

export interface PermissionsData {
    // Define the structure of permission data
}

export interface RoleDetailsResponse {
    roleData: RoleData;
    permissionsData: PermissionsData;
}

