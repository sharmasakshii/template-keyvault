import OnBoardController from "../../controller/scope1/onBoard";
import { createRoute } from "../../utils";

export const onboardRouteConstant = [
  createRoute("post", "/get-onboard-question-list", OnBoardController, "onBoardingQuestionList"),
  createRoute("post", "/add-update-question-answere", OnBoardController, "addUpdateAnswer"),
  createRoute("post", "/reset-onboarding", OnBoardController, "resetOnboarding"),
];


export default onboardRouteConstant;
