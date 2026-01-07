import { ModuleKey } from "../../../../constant/moduleConstant";
import EvDashboardController from "../../../../controller/scope3/track/evDashboard/evDashboardController";
import { createRoute } from "../../../../utils";

 const EvDashboardRouteConstant = [
    createRoute("post", "/ev-scac-excel",EvDashboardController, "downloadCarrierDataExcel",ModuleKey.EVDASHBOARD),
    createRoute("post", "/graph-carriers-data",EvDashboardController, "getAllCarriersGraphsData",ModuleKey.EVDASHBOARD),
    createRoute("get", "/ev-carriers-list", EvDashboardController,"getEvCarriersList",ModuleKey.EVDASHBOARD),
    createRoute("post", "/ev-matrix-data",EvDashboardController, "getDashboardMatrixData",ModuleKey.EVDASHBOARD),
    createRoute("post", "/ev-shipments-lane-list",EvDashboardController, "getEVShipmentLaneList",ModuleKey.EVDASHBOARD),
    createRoute("post", "/ev-shipments-by-date",EvDashboardController, "getEVShipmentByDateGraphData",ModuleKey.EVDASHBOARD),
    createRoute("post", "/ev-ttm-by-date",EvDashboardController, "getEVTTMGraphByDateMaster",ModuleKey.EVDASHBOARD),
    createRoute("post", "/ev-shpiment-by-lane-data",EvDashboardController, "getTruckShipmentsLaneData",ModuleKey.EVDASHBOARD),
    createRoute("get", "/get-ev-filter-emission-dates",EvDashboardController, "filterEmissionDatesEv",ModuleKey.EVDASHBOARD),
];

export default EvDashboardRouteConstant;





