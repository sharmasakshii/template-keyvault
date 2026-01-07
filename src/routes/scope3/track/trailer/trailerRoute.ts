import { ModuleKey } from "../../../../constant/moduleConstant";
import FuelVehicleTrailerController from "../../../../controller/scope3/track/commonFuelVehicleTrailer/commonControllerFuelVehicle";
import { createRoute } from "../../../../utils";



export const TrailerRouteConstant = [
    createRoute("post", "/trailer-emission-graph-data", FuelVehicleTrailerController, "graphData", ModuleKey.Segmentation),
    createRoute("post", "/trailer-emission-table-data", FuelVehicleTrailerController, "tableData", ModuleKey.Segmentation),
    createRoute("post", "/trailer-overview-data", FuelVehicleTrailerController, "overviewData", ModuleKey.Segmentation),
    createRoute("post", "/trailer-lane-breakdown-data", FuelVehicleTrailerController, "getLaneBreakdown", ModuleKey.Segmentation),
    createRoute("post", "/trailer-carrier-emission-table-data", FuelVehicleTrailerController, "RegionData", ModuleKey.Segmentation),
];

export default TrailerRouteConstant;
