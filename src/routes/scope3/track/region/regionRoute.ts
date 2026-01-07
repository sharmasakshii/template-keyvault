import { ModuleKey } from "../../../../constant/moduleConstant";
import RegionController from "../../../../controller/scope3/track/region/regionController";
import { createRoute } from "../../../../utils";



export const RegionRouteConstant = [
    createRoute("post", "/get-region-emission-reduction", RegionController, "getRegionEmissionReduction", ModuleKey?.Segmentation),
    createRoute("post", "/get-region-emission-monthly", RegionController, "getRegionEmissionsMonthly", ModuleKey?.Segmentation),
    createRoute("get", "/get-regions", RegionController, "getRegion", ModuleKey?.Segmentation),
    createRoute("post", "/get-region-intensity-yearly", RegionController, "getRegionIntensityByYear", ModuleKey?.Segmentation),
    createRoute("post", "/get-region-emission-data", RegionController, "getRegionEmissionData", ModuleKey?.Segmentation),
    createRoute("post", "/get-lane-emission", RegionController, "getLaneEmission", ModuleKey?.Segmentation),
    createRoute("post", "/get-region-table-data", RegionController, "getRegionTableData", ModuleKey?.Segmentation),
    createRoute("post", "/get-region-overview-detail", RegionController, "getLaneCarrierOverviewDetail", ModuleKey?.Segmentation),
];

export default RegionRouteConstant;


