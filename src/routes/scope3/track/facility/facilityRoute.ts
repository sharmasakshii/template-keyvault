import { ModuleKey } from "../../../../constant/moduleConstant";
import FacilityController from "../../../../controller/scope3/track/faciity/facilityController";
import FacilityOverviewController from "../../../../controller/scope3/track/faciity/facilityOverviewController";
import { createRoute } from "../../../../utils";



 const FacilityRouteConstant = [
    createRoute("post", "/get-facilities-table-data", FacilityController, "fetchFacilityTableData", ModuleKey.Segmentation),
    createRoute("post", "/get-facilities-emission-data", FacilityController, "getFacilityEmissionData", ModuleKey.Segmentation),
    createRoute("post", "/get-facilities-reduction-graph", FacilityOverviewController, "getFacilityEmissionReductionGraph", ModuleKey.Segmentation),
    createRoute("post", "/get-facilities-overview-detail", FacilityOverviewController, "getFacilityOverviewDetails", ModuleKey.Segmentation),
    createRoute("post", "/get-facilities-comparison", FacilityOverviewController, "getFacilityComparison", ModuleKey.Segmentation),
    createRoute("post", "/get-facilities-inbound-lane-graph", FacilityOverviewController, "getFacilityInboundData", ModuleKey.Segmentation),
    createRoute("post", "/get-facilities-outbound-lane-graph", FacilityOverviewController, "getFacilityOutBoundData", ModuleKey.Segmentation),
    createRoute("post", "/get-facilities-carrier-graph", FacilityOverviewController, "getFacilityCarrierComparisonGraph", ModuleKey.Segmentation),
    createRoute("post", "/get-facilities-lane-graph", FacilityOverviewController, "getFacilityLaneEmissionData", ModuleKey.Segmentation),
];

export default FacilityRouteConstant;
