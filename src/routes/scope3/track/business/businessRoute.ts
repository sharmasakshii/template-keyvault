import { ModuleKey } from "../../../../constant/moduleConstant";
import BusinessController from "../../../../controller/scope3/track/businessUnit/businessController";
import { createRoute } from "../../../../utils";

const BusinessRouteConstant = [
  createRoute("post", "/get-business-unit-emission", BusinessController, "getBusinessEmissionV1", ModuleKey.Segmentation),
  createRoute("post", "/get-business-carrier-overview-detail", BusinessController, "getBusinessCarrierOverviewDetail", ModuleKey.Segmentation),
  createRoute("post", "/get-business-carrier-comparison-graph", BusinessController, "getBusinessCarrierComparisonGraph", ModuleKey.Segmentation),
  createRoute("post", "/get-business-unit-table-data", BusinessController, "getBusinessUnitTableData", ModuleKey.Segmentation),
  createRoute("post", "/get-business-unit-emission-by-region", BusinessController, "getBusinessEmissionDataBYRegion", ModuleKey.Segmentation),
  createRoute("post", "/get-business-emission-data", BusinessController, "getBusinessEmissionData", ModuleKey.Segmentation),

];

export default BusinessRouteConstant;