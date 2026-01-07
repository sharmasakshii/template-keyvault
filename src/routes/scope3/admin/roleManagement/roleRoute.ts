import { ModuleKey } from "../../../../constant/moduleConstant";
import RoleController from "../../../../controller/admin/roleController/roleController";
import { createRoute } from "../../../../utils";


const adminRoleRouteConstant = [
    createRoute("post", "/get-role-data", RoleController, "getRoledata", ModuleKey.RoleManagement),
    createRoute("post", "/delete-role", RoleController, "deleteRole", ModuleKey.RoleManagement),
    createRoute("post", "/create-role", RoleController, "createRole", ModuleKey.RoleManagement),
    createRoute("post", "/get-role-details", RoleController, "getRoleDetails", ModuleKey.RoleManagement),
    createRoute("post", "/edit-role", RoleController, "editRole", ModuleKey.RoleManagement),
    createRoute("get", "/get-all-modules", RoleController, "getAllModules", ModuleKey.RoleManagement),

];

export default adminRoleRouteConstant;
