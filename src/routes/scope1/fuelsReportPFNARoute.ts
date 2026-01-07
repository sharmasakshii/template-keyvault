import FuelsReportPFNAController from "../../controller/scope1/fuelsReportPFNAController";
import { createRoute } from "../../utils";

export const fuelsReportPFNARouteConstant = [
  createRoute("post", "/pfna-fuel-consumption-report", FuelsReportPFNAController, "getFuelConsumptionReport"),
  createRoute("get", "/pfna-fuel-list", FuelsReportPFNAController, "getPFNAFuelsList"),
  createRoute("post", "/pfna-total-emissions-by-fuels", FuelsReportPFNAController, "getTotalEmissionsByFuelTypePFNA"),
  createRoute("post", "/pfna-fuel-consumption-report-by-period", FuelsReportPFNAController, "getFuelConsumptionReportByPeriod"),
  createRoute("post", "/pfna-fuel-consumption-by-fuel-percentage", FuelsReportPFNAController, "getFuelConsumptionReportByFuelTypePer"),
];

export default fuelsReportPFNARouteConstant;


