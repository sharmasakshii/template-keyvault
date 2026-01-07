import CommonController from "../../../controller/scope3/common/commonController";
import { createRoute } from "../../../utils";



const commonRouteConstant = [
  createRoute("post", "/save-url", CommonController, "saveUrl"),
  createRoute("post", "/get-cms-content", CommonController, "getCMSContent"),
  createRoute("get", "/get-user-notifications", CommonController, "getUserNotifications"),
  createRoute("post", "/get-config-constants", CommonController, "getConfigConstants"),
  createRoute("post", "/update-fuel-radius-key", CommonController, "updateKeyFuelRadius"),
  createRoute("get", "/all-fuel-radius-list", CommonController, "getAllConfigFuelRadius"),
  createRoute("get", "/get-division-list", CommonController, "getDivisionList"),
  createRoute("get", "/region-emission-dates", CommonController, "getFilterDates"),
  createRoute("post", "/scope3/time-mapping-list", CommonController, "timeMappingList"),
  createRoute("post", "/get-fuel-list", CommonController, "fuelList"),
];


export default commonRouteConstant;


