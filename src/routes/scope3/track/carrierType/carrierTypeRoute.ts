import { ModuleKey } from "../../../../constant/moduleConstant";
import CarrierTypeController from "../../../../controller/scope3/track/carrierType/carrierTypeController";
import { createRoute } from "../../../../utils";

const CarrierTypeRouteConstant = [
  createRoute("post", "/get-carrier-type-table-data", CarrierTypeController, "getCarrierTypeTableData", ModuleKey.Segmentation),
  createRoute("post", "/carrier-type-emission", CarrierTypeController, "getCarrierTypeEmissionData", ModuleKey.Segmentation),
  createRoute("post", "/carrier-type-matrix", CarrierTypeController, "getCarrierTypeMatrixData", ModuleKey.Segmentation),
  createRoute("post", "/carrier-type-comparison-graph", CarrierTypeController, "getCarrierTypeComparisonGraph", ModuleKey.Segmentation),
  createRoute("post", "/carrier-type-lane-emission", CarrierTypeController, "getCarrierTypeLaneEmission", ModuleKey.Segmentation),
  createRoute("post", "/carrier-type-reduction-graph", CarrierTypeController, "getCarrierTypeEmissionReduction", ModuleKey.Segmentation)
];

export default CarrierTypeRouteConstant;