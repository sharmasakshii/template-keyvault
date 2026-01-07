import ProjectController from "../../../controller/scope3/manage/projectContoller";
import { ModuleKey } from "../../../constant/moduleConstant";
import { createRoute } from "../../../utils";



 const projectRouteConstant = [
  createRoute("post", "/delete-project", ProjectController, "deleteProject", ModuleKey.Segmentation),
  createRoute("post", "/get-project-list", ProjectController, "getProjectList", ModuleKey.Segmentation),
  createRoute("post", "/get-project-search-list", ProjectController, "getProjectSearchList", ModuleKey.Segmentation),
  createRoute("post", "/get-project-detail", ProjectController, "getProjectDetails", ModuleKey.Segmentation),
  createRoute("post", "/save-project-rating", ProjectController, "saveProjectRating", ModuleKey.Segmentation),
  createRoute("post", "/save-project", ProjectController, "saveProject", ModuleKey.Segmentation),
  createRoute("post", "/search-user-by-email", ProjectController, "searchUserByEmail", ModuleKey.Segmentation),
  createRoute("post", "/get-project-count", ProjectController, "getProjectCount")

];
export default projectRouteConstant;
