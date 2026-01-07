import { ModuleKey } from "../../constant/moduleConstant";
import AuthController from "../../controller/auth/authController";
import { createRoute } from "../../utils";

export const authRouteConstant = [
    createRoute("post", "/login-user-access", AuthController, "login", ModuleKey.WithoutMiddleware),
    createRoute("get", "/logout", AuthController, "logout", ModuleKey.WithoutMiddleware),
    createRoute("post", "/verifyOTP", AuthController, "verifyOTP", ModuleKey.WithoutMiddleware),
    createRoute("post", "/resendOtp", AuthController, "resendOtp", ModuleKey.WithoutMiddleware)
];


export default authRouteConstant;


