import { ModuleKey } from "../../constant/moduleConstant";
import FuelLocationsController from "../../controller/scope3/fuelLocationsController";
import { createRoute } from "../../utils";


 const fuelLocationsRouteConstant = [
  createRoute("get", "/get-fuel-stops-provoiders",FuelLocationsController, "getFuelStopProviders",ModuleKey.Segmentation),
  createRoute("post", "/get-fuel-stops-provoiders-list",FuelLocationsController, "getFuelStopProvidersList",ModuleKey.Segmentation),
];

export default fuelLocationsRouteConstant;
