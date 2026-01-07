import { ModuleKey } from "../../../../constant/moduleConstant";
import DecarbController from "../../../../controller/scope3/act/decarb/decarbController";
import { createRoute } from "../../../../utils";


const decarbRouteConstant = [
    createRoute("post", "/get-region-problem-lanes", DecarbController, "getRegionProblemLane", ModuleKey.Segmentation),
    createRoute("post", "/get-recommended-levers", DecarbController, "getRecommendedLevers", ModuleKey.Segmentation),
    createRoute("post", "/search-origin-dest-problem-lanes", DecarbController, "searchOriginDestProblemLanes", ModuleKey.Segmentation)
];

export default decarbRouteConstant;





