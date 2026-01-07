import { ModuleKey } from "../../../../constant/moduleConstant";
import LaneController from "../../../../controller/scope3/track/lane/laneController";
import { createRoute } from "../../../../utils";



export const LaneRouteConstant = [
    createRoute("post", "/get-lane-emission-table-data", LaneController, "getLaneEmissionTableData", ModuleKey.Segmentation),
    createRoute("post", "/get-carrier-emission-table-data", LaneController, "getCarrierEmissionData", ModuleKey.Segmentation),
    createRoute("post", "/carrier-search-lane-planing", LaneController, "locationSearchLanePlaning", ModuleKey.Recommendations),
    createRoute("post", "/get-lane-emission-lanes-origin-dest", LaneController, "getLaneEmissionLanesOriginDest", ModuleKey.Segmentation),
    createRoute("post", "/get-lane-overview-details", LaneController, "getLaneOverviewDetails", ModuleKey.Segmentation)
];

export default LaneRouteConstant;


