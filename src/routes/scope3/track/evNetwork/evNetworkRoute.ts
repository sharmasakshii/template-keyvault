import { ModuleKey } from "../../../../constant/moduleConstant";
import EvNetworkController from "../../../../controller/scope3/track/evNetwork/evNetworkController";
import { createRoute } from "../../../../utils";




 const EvNetworkRouteConstant = [
    createRoute("post", "/ev-network-lane", EvNetworkController,"evNetworkFuelStopLanes",ModuleKey.Segmentation),
    createRoute("get", "/get-ev-locations", EvNetworkController,"getEvLocations",ModuleKey.Segmentation),
];

export default EvNetworkRouteConstant;
