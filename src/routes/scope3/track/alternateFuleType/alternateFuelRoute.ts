import { ModuleKey } from "../../../../constant/moduleConstant";
import AlternateFuelTypeController from "../../../../controller/scope3/track/alternateFuelType/alternateFuelController";
import { createRoute } from "../../../../utils";

const AlternateFuelRouteConstant = [
  createRoute("post", "/get-lanes-by-fuel-usage-and-mileage", AlternateFuelTypeController, "getLanesByFuelUsageAndMileage", ModuleKey.Segmentation),
  createRoute("post", "/get-lane-statistics", AlternateFuelTypeController, "getLaneStatistics", ModuleKey.Segmentation),
  createRoute("post", "/get-total-data-by-lane-and-fuel-type", AlternateFuelTypeController, "getTotalDataByLaneAndFuelType", ModuleKey.Segmentation),
  createRoute("post", "/get-total-emission-by-fuel-type", AlternateFuelTypeController, "getTotalEmissionsByFuelType", ModuleKey.Segmentation),
  createRoute("post", "/list-of-all-lanes-by-shipments", AlternateFuelTypeController, "listOfAllLanesByShipments", ModuleKey.Segmentation),
  createRoute("post", "/get-metrics", AlternateFuelTypeController, "getMetrics", ModuleKey.Segmentation),
  createRoute("get", "/alternative-carriers-list", AlternateFuelTypeController, "getCarrierList", ModuleKey.Segmentation),
  createRoute("post", "/get-lane-fuel-filters", AlternateFuelTypeController, "getFuelTypeList", ModuleKey.Segmentation),
  createRoute("post", "/alternate-carrier-by-fuel-type", AlternateFuelTypeController, "getFuelCarrierData", ModuleKey.Segmentation),
  createRoute("post", "/get-total-data-by-carrier", AlternateFuelTypeController, "getTotalDataByCarrier", ModuleKey.Segmentation),
  createRoute("get", "/get-country-list", AlternateFuelTypeController, "getCountryList", ModuleKey.Segmentation),
  createRoute("post", "/get-carrier-fuel-list", AlternateFuelTypeController, "getFuelTypeList", ModuleKey.Segmentation, { type: 'carrier' }),
  createRoute("post", "/get-schider-report", AlternateFuelTypeController, "getSchinderReport", ModuleKey.Segmentation)

];

export default AlternateFuelRouteConstant;
