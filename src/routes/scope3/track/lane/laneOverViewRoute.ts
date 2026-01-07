import { ModuleKey } from "../../../../constant/moduleConstant";
import LaneOverviewController from "../../../../controller/scope3/track/lane/laneOverviewController";
import { createRoute } from "../../../../utils";



export const LaneOverViewRouteConstant = [
    createRoute("post", "/get-lane-carrier-table-data", LaneOverviewController, "getLaneCarrierTableData", ModuleKey.Segmentation),
    createRoute("post", "/get-lane-carrier-graph", LaneOverviewController, "getLaneCarrierComparisonGraph", ModuleKey.Segmentation),
    createRoute("post", "/get-lane-reduction-graph", LaneOverviewController, "getLaneReductionGraph", ModuleKey.Segmentation),

];

export default LaneOverViewRouteConstant;


