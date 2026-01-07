import { ModuleKey } from "../../../../constant/moduleConstant";
import LaneSettingController from "../../../../controller/admin/laneSetting/laneSettingController";
import { createRoute } from "../../../../utils";


const laneSettingRouteConstant = [
    createRoute("post", "/optimus-fuel-lane", LaneSettingController, "B100FuelStopLanes", ModuleKey?.Segmentation),
    createRoute("post", "/optimus-origin-destination", LaneSettingController, "getOriginDestination", ModuleKey?.Segmentation),
];

export default laneSettingRouteConstant;
