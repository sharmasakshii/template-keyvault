import UserSettingController from "../../controller/scope3/userSettingController";
import { createRoute } from "../../utils";



 const userRouteConstant = [

  
  createRoute("get", "/user-profile", UserSettingController, "userDetail"),
  createRoute("post", "/profile-update", UserSettingController, "updateProfile"),
  createRoute("post", "/profile-update-password", UserSettingController, "updateUserPassword"),
  createRoute("post", "/blob-sas-token", UserSettingController, "getBlobDetail"),
  createRoute("post", "/update-profile-image", UserSettingController, "updateProfileImage"),

];

export default userRouteConstant;
