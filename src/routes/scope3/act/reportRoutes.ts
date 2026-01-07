import ReportController from "../../../controller/scope3/act/reportsController";
import { ModuleKey } from "../../../constant/moduleConstant";
import { createRoute } from "../../../utils";



const reportRouteConstant = [
  createRoute("post", "/report-lane-matrix", ReportController, "getLaneMatrixData"),
  createRoute("post", "/report-lane-data", ReportController, "getLaneReportTableData"),
  createRoute("post", "/optimus-fuel-stop-data", ReportController, "optimusFuelStopLanes", ModuleKey.Segmentation),
  createRoute("post", "/lane-search-report-management", ReportController, "laneSearch"),
];

export default reportRouteConstant;
