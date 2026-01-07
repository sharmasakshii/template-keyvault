import { ModuleKey } from "../../../../constant/moduleConstant";
import IntermodalController from "../../../../controller/scope3/track/intermodalReport/intermodalReport";
import { createRoute } from "../../../../utils";

export const IntermodalRouteConstant = [
    createRoute("post", "/get-intermodal-metrics", IntermodalController, "fetchIntermodalMetrics", ModuleKey.Segmentation),
    createRoute("post", "/intermodal-filters", IntermodalController, "fetchIntermodalFilterOptions", ModuleKey.Segmentation),
    createRoute("post", "/get-list-shipment-miles", IntermodalController, "ListByShipmentandMiles", ModuleKey.Segmentation),
    createRoute("post", "/get-lane-details", IntermodalController, "fetchLaneDetails", ModuleKey.Segmentation),
    createRoute("post", "/get-lanes-by-shipments-miles", IntermodalController, "fetchTopLanesByCarrier", ModuleKey.Segmentation),
    createRoute("post", "/get-intermodal-max-date", IntermodalController, "fetchMaxDate", ModuleKey.Segmentation),
     createRoute("post", "/search-origin-dest", IntermodalController, "fetchOriginDestinationDetails", ModuleKey.Segmentation)

];

export default IntermodalRouteConstant;


