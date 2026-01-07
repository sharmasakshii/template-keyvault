import { ModuleKey } from "../../../../constant/moduleConstant";
import AdmiUserController from "../../../../controller/admin/userManagement/userController";
import { createRoute } from "../../../../utils";


const adminUserRouteConstant = [
    createRoute("post", "/add-user", AdmiUserController, "addUser", ModuleKey.UserManagement),
    createRoute("post", "/update-user", AdmiUserController, "updateUser", ModuleKey.UserManagement),
    createRoute("post", "/get-user-detail-by-id", AdmiUserController, "getUserDetailById", ModuleKey.UserManagement),
    createRoute("post", "/get-user-list", AdmiUserController, "getUserListing", ModuleKey.UserManagement),
    createRoute("post", "/delete-user", AdmiUserController, "deleteUser", ModuleKey.UserManagement),
    createRoute("post", "/user-activity-logs", AdmiUserController, "getUserActivityDetail", ModuleKey.UserManagement),
    createRoute("post", "/user-file-upload-detail", AdmiUserController, "getUserFileListDetail", ModuleKey.UserManagement),
    createRoute("post", "/activate-deactivate-user", AdmiUserController, "userStatusUpdate", ModuleKey.UserManagement),
    createRoute("get", "/get-all-roles", AdmiUserController, "getAllRoles", ModuleKey.UserManagement),
    createRoute("get", "/get-login-activity", AdmiUserController, "getUserLoginActivity", ModuleKey.UserManagement),

];

export default adminUserRouteConstant;
