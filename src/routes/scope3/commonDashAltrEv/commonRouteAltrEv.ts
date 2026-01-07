import CommonAltrEVController from "../../../controller/scope3/combineDashboard/combineDashAltrEv";
import { createRoute } from "../../../utils";



const commonAltrEvRouteConstant = [
  createRoute("post", "/combine-dash-filters-data", CommonAltrEVController, "filterCombineDash"),
  createRoute("get", "/combine-dash-scac-list", CommonAltrEVController, "getScacListCombineDash"),
  createRoute("post", "/combine-dash-metrics-data", CommonAltrEVController, "metricsData"),
  createRoute("post", "/combine-dash-total-shipment-graph", CommonAltrEVController, "totalShipmentsByFuel"),
  createRoute("post", "/combine-dash-total-emission-graph", CommonAltrEVController, "totalEmissionByFuel"),
  createRoute("post", "/combine-dash-transaction-table", CommonAltrEVController, "TransactionData"),
  createRoute("post", "/combine-dash-fuel-list", CommonAltrEVController, "fuelTypeList"),

];


export default commonAltrEvRouteConstant;


