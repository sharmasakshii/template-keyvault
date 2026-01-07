import { ModuleKey } from "../../../../constant/moduleConstant";
import BusinessOverViewController from "../../../../controller/scope3/track/businessUnit/businessOverviewController";
import { createRoute } from "../../../../utils";

const BusinessOverviewRouteConstant = [
  createRoute("post", "/get-business-reduction", BusinessOverViewController, "getBusinessEmissionReduction", ModuleKey.Segmentation)
];

export default BusinessOverviewRouteConstant;