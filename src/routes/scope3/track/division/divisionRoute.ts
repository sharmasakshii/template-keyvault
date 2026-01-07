import { ModuleKey } from "../../../../constant/moduleConstant";
import DivisionController from "../../../../controller/scope3/track/division/divisionController";
import { createRoute } from "../../../../utils";

const DivisionRouteConstant = [
  createRoute("post", "/get-division-overview", DivisionController, "getDivisionOverview", ModuleKey.Segmentation),
  createRoute("post", "/division-buisness-unit-data", DivisionController, "divisionBuissnessUnitData", ModuleKey.Segmentation),
  createRoute("post", "/get-by-division-lane-breakdown", DivisionController, "getByDivisionLaneBreakdown", ModuleKey.Segmentation),
  createRoute("post", "/get-business-unit-emission-division-list", DivisionController, "getDivisionRegionComparisonTable", ModuleKey.Segmentation),
  createRoute("post", "/get-division-region-comparison-data", DivisionController, "getDivisionRegionComparisonTable", ModuleKey.Segmentation),
  createRoute("post", "/get-division-table-data", DivisionController, "getDivisionTableData", ModuleKey.Segmentation),
  createRoute("post", "/get-division-graph-data", DivisionController, "getDivisionEmissionData", ModuleKey.Segmentation),
  
];

export default DivisionRouteConstant;
