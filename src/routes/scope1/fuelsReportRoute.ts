import { createRoute } from "../../utils";
import FuelsReportController from "../../controller/scope1/fuelsReportController";

export const fuelsReportRouteConstant = [

  createRoute("post", "/get-fuel-transaction-list", FuelsReportController, "getTransactionList"),
  createRoute("get", "/get-pie-chart-data-by-division", FuelsReportController, "getPieChartData")
];

export default fuelsReportRouteConstant;


