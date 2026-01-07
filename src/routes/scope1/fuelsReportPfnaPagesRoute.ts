import FuelsReportPfnaPagesController from "../../controller/scope1/fuelsReportPfnaPagesController";
import { createRoute } from "../../utils";

export const fuelsReportPfnaPagesRouteConstant = [
  createRoute("post", "/pbna-pfna-pages-fuel-consumption-report", FuelsReportPfnaPagesController, "getFuelConsumptionReport"),
  createRoute("post", "/pbna-pfna-fuel-metrics-report", FuelsReportPfnaPagesController, "getFuelsReportMetrics"),
  createRoute("post", "/pbna-pfna-fuel-consumption-graph", FuelsReportPfnaPagesController, "getFuelConsumptionAndEmissionsGraph", "", { graph: 'consumption' }),
  createRoute("post", "/pbna-pfna-fuel-emissions-graph", FuelsReportPfnaPagesController, "getFuelConsumptionAndEmissionsGraph", "", { graph: 'emissions' }),
  createRoute("post", "/pfna-transaction-details", FuelsReportPfnaPagesController, "getTransactionDetails"),
  createRoute("post", "/pbna-pfna-fuels-report-filters", FuelsReportPfnaPagesController, "getFuelsReportFilters"),
  createRoute("post", "/pbna-pfna-list-of-locations", FuelsReportPfnaPagesController, "listOfLocation"),
  createRoute("post", "/pbna-pfna-line-chart-by-fuel-data", FuelsReportPfnaPagesController, "getFuelLineChartData", "",{ graph: 'consumption' }),
  createRoute("post", "/pbna-pfna-line-chart-by-emission-data", FuelsReportPfnaPagesController, "getFuelLineChartData", "", { graph: 'emissions' }),
  createRoute("get", "/pbna-pfna-get-search-filter", FuelsReportPfnaPagesController, "getSearchFilterTransaction"),
];

export default fuelsReportPfnaPagesRouteConstant;


