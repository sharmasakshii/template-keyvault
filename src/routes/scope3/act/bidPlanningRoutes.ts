import { ModuleKey } from "../../../constant/moduleConstant";
import { createRoute } from "../../../utils";
import BidPlanningController from "../../../controller/scope3/act/bidPlanningController";



const bidPlanningouteConstant = [
  createRoute("post", "/get-scac-list", BidPlanningController, "getScacList",ModuleKey.BIDPLANNING),
  createRoute("post", "/search-bid-file-lane-origin-dest", BidPlanningController, "searchBidFileLaneOriginDest", ModuleKey.BIDPLANNING),
  createRoute("post", "/upload-bid-file", BidPlanningController, "uploadBidFile", ModuleKey.BIDPLANNING),
  createRoute("post", "/get-bid-file-detail", BidPlanningController, "getBidDetail", ModuleKey.BIDPLANNING),
  createRoute("post", "/get-process-status", BidPlanningController, "checkProcessStatus", ModuleKey.BIDPLANNING),
  createRoute("post", "/get-bid-details", BidPlanningController, "fetchBidDetail", ModuleKey.BIDPLANNING),
  createRoute("post", "/delete-miltiple-bid-file", BidPlanningController, "deleteMiltipleBidFile", ModuleKey.BIDPLANNING),
  createRoute("post", "/process-logic-app", BidPlanningController, "processLogicApp", ModuleKey.BIDPLANNING),
  createRoute("post", "/get-all-bid-file-error-rows", BidPlanningController, "getAllBidFileErrorRows", ModuleKey.BIDPLANNING),
  createRoute("post", "/bid-output-detail", BidPlanningController, "bidOutputDetail", ModuleKey.BIDPLANNING),
  createRoute("post", "/get-bid-file-output-table", BidPlanningController, "getBidFileOutputTable", ModuleKey.BIDPLANNING),
  createRoute("post", "/download-bid-filter-data", BidPlanningController, "downloadBidFilterData", ModuleKey.BIDPLANNING),
  createRoute("post", "/get-all-bid-files", BidPlanningController, "getAllBidFiles", ModuleKey.BIDPLANNING),
  createRoute("get", "/get-all-bid-status", BidPlanningController, "getAllBidStatus", ModuleKey.BIDPLANNING),
  createRoute("post", "/save-bid-file-data", BidPlanningController, "saveBidFileData", ModuleKey.BIDPLANNING),
  createRoute("post", "/process-bid-files", BidPlanningController, "processBidFiles", ModuleKey.BIDPLANNING),
  createRoute("post", "/bid-file-lanes-table-graph", BidPlanningController, "bidFileMostExpensiveLanes", ModuleKey.BIDPLANNING),
  createRoute("post", "/top-emission-cost-impact-lanes-bid-output", BidPlanningController, "emissionImpactGraphView", ModuleKey.BIDPLANNING),
  createRoute("post", "/download-bid-error-data", BidPlanningController, "downloadBidErrorData", ModuleKey.BIDPLANNING),
  createRoute("post", "/check-logic-app", BidPlanningController, "checkLogicApp", ModuleKey.BIDPLANNING),
  createRoute("post", "/update-bid-import-lane", BidPlanningController, "updateBidImportLane", ModuleKey.BIDPLANNING),
  createRoute("post", "/create-blob-download", BidPlanningController, "createBlobForDownload", ModuleKey.BIDPLANNING),
];

export default bidPlanningouteConstant;
