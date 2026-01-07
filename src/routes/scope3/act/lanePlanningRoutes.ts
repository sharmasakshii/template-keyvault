
import { ModuleKey } from "../../../constant/moduleConstant";
import LanePlanningController from "../../../controller/scope3/act/lanePlanning/lanePlanningController";
import { createRoute } from "../../../utils";

const lanePlanningouteConstant = [
  createRoute("post", "/get-lane-scenario-detail", LanePlanningController, "getLaneScenarioDetail", ModuleKey.Recommendations),
  createRoute("post", "/alternate-k-shortest-path", LanePlanningController, "alternateKShortestPath", ModuleKey.Recommendations)
];

export default lanePlanningouteConstant;
