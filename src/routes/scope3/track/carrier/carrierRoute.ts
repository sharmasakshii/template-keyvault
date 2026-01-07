import { ModuleKey } from "../../../../constant/moduleConstant";
import CarrierController from "../../../../controller/scope3/track/carrier/carrierController";
import { createRoute } from "../../../../utils";

const CarrierRouteConstant = [
  createRoute("post", "/get-vendor-table-data", CarrierController, "getVendorTableData", ModuleKey.Segmentation),
  createRoute("post", "/get-carrier-overview", CarrierController, "getVendorCarrierOverview", ModuleKey.Segmentation),
  createRoute("post", "/get-lane-breakdown", CarrierController, "getLaneBreakdown", ModuleKey.Segmentation),
  createRoute("post", "/get-carrier-region-comparison-table-data", CarrierController, "getCarrierRegionComparisonTable", ModuleKey.Segmentation),
  createRoute("post", "/get-region-carrier-comparison-data", CarrierController, "getRegionCarrierComparisonGraph", ModuleKey.Segmentation),
  createRoute("post", "/get-vendor-comparison", CarrierController, "getVendorEmissionComparison", ModuleKey.Segmentation),
  createRoute("post", "/get-lane-carrier", CarrierController, "getLaneCarrierName", ModuleKey.Segmentation)

];

export default CarrierRouteConstant;