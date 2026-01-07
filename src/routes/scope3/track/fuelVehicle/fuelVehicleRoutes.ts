import FuelVehicleTrailerController from "../../../../controller/scope3/track/commonFuelVehicleTrailer/commonControllerFuelVehicle";
import { createRoute } from "../../../../utils";





const fuelVehicleRouteConstant = [
  createRoute("post", "/fuel-vehicle-emission-graph-data", FuelVehicleTrailerController, "graphData"),
  createRoute("post", "/fuel-vehicle-emission-table-data", FuelVehicleTrailerController, "tableData"),
  createRoute("post", "/fuel-vehicle-overview-data", FuelVehicleTrailerController, "overviewData"),
  createRoute("post", "/fuel-vehicle-lane-breakdown-data", FuelVehicleTrailerController, "getLaneBreakdown"),
  createRoute("post", "/fuel-vehicle-carrier-emission-table-data", FuelVehicleTrailerController, "RegionData"),
];

export default fuelVehicleRouteConstant;
