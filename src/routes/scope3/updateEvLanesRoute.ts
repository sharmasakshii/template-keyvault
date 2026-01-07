import UpdateEVlanesController from "../../controller/scope3/updateEVLanes";
import { createRoute } from "../../utils";




 const updateEvLanesRouteConstant = [
  createRoute("post", "/update-ev-lanes", UpdateEVlanesController, "updateEVLanes"),
  createRoute("post", "/check-lane-fuel-stops", UpdateEVlanesController, "checklaneIsvalid")

];

export default updateEvLanesRouteConstant;
