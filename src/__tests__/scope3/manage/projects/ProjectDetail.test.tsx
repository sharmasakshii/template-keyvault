// Import necessary modules and components
import projectService from "../../../../store/project/projectService";
import laneService from "../../../../store/scopeThree/track/lane/laneService";
import { laneCarrierEmissionReductionGlide, laneDetailsReducer } from "../../../../store/scopeThree/track/lane/laneDetailsSlice";
import { getProjectDetails, projectReducer } from "../../../../store/project/projectSlice";
import { ApiTest, TestFullFilledSlice, TestSliceMethod } from "../../../../commonCase/ReduxCases";
import { RenderPage } from "../../../../commonCase/RenderPageCase";
import ProjectDetailView from "../../../../pages/projectDetail/ProjectDetailView";
import {  nodeUrl } from "constant"
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import * as router from "react-router-dom";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as reactRedux from "react-redux";
import { authMockData } from "mockData/commonMockData.json";
import { useParams } from 'react-router-dom';
 
// Payload for fetching project details
const getProjectDetailsPayload = {
  id: "46",
};
 
// Payload for fetching lane reduction detail graph data
const getLaneReductionDetailGraphPayload = {
  lane_name: "PORT WENTWORTH, GA_ROCKFORD, IL",
  year: 2022,
};
 
// Configuration for fetching lane reduction detail graph data using Redux
const getLaneReductionDetailGraphDataObject = {
  service: laneService,
  serviceName: "getLaneReductionDetailGraph",
  sliceName: "laneCarrierEmissionReductionGlide",
  sliceImport:laneCarrierEmissionReductionGlide,
  data: getLaneReductionDetailGraphPayload,
  reducerName: laneDetailsReducer,
  loadingState: "laneCarrierEmissionIsloading",
  isSuccess: "isSuccess",
  actualState: "laneCarrierEmission",
};
 
// Configuration for API testing of fetching lane reduction detail graph data
const getLaneReductionDetailGraphApiTestData = {
  serviceName: "getLaneReductionDetailGraph",
  method: "post",
  data: getLaneReductionDetailGraphPayload,
  serviceImport: laneService,
  route: `${nodeUrl}get-lane-reduction-graph`,
};
 
// Configuration for fetching project details using Redux
const getProjectDetailsDataObject = {
  service: projectService,
  serviceName: "getProjectDetails",
  sliceName: "getProjectDetails",
  sliceImport:getProjectDetails,
  data: getProjectDetailsPayload,
  reducerName: projectReducer,
  loadingState: "isLoadingProjectDetails",
  isSuccess: "isSuccess",
  actualState: "projectDetails",
};
 
// Configuration for API testing of fetching project details
const getProjectDetailsApiTestData = {
  serviceName: "getProjectDetails",
  method: "post",
  data: getProjectDetailsPayload,
  serviceImport: projectService,
  route: `${nodeUrl}get-project-detail`,
};
 
 
 
// Execute Redux slice tests for project and lane data
TestFullFilledSlice({
  data: [getProjectDetailsDataObject, getLaneReductionDetailGraphDataObject],
});
 
// Execute API tests for project and lane data
ApiTest({
  data: [getProjectDetailsApiTestData, getLaneReductionDetailGraphApiTestData],
});
 
TestSliceMethod({
  data: [getProjectDetailsDataObject, getLaneReductionDetailGraphDataObject],
});
 
// Render a specific page/component for testing
// RenderPage(renderPageData);
 
 
jest.mock("store/redux.hooks", () => ({
  ...jest.requireActual("store/redux.hooks"),
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
jest.mock("auth/ProtectedRoute", () => ({
  useAuth: jest.fn(),
}));
 
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
 
 
describe("chat bot view ", () => {
  let useDispatchMock: jest.Mock;
  let useSelectorMock: jest.Mock;
  let stores: EnhancedStore;
  const navigate = jest.fn();
  beforeEach(() => {
    stores = configureStore({
      reducer: {
        project: projectReducer?.reducer,
      },
    });
    jest
      .spyOn(router, "useNavigate")
      .mockImplementation(() => navigate) as jest.Mock;
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: jest.fn(),
    }));
 
    useSelectorMock = jest
      .spyOn(utils, "useAppSelector")
      .mockReturnValue({}) as jest.Mock;
    useDispatchMock = jest.spyOn(utils, "useAppDispatch") as jest.Mock;
 
    let auth = jest.spyOn(tem, "useAuth");
    auth.mockReturnValue(authMockData);
    const mockDispatch = jest.fn();
    useDispatchMock.mockReturnValue(mockDispatch);
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    cleanup();
  });
 
  const renderChatBoatView = async () => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <ProjectDetailView />
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };
 
  //section id.....
  it(`<section> test case for whole page `, async () => {
    const mockedParams = { titleSlug: '' };
 
    useSelectorMock.mockReturnValue({
      chatHistoryData: [{
        id: 1, question: "test question",
        answer: "test answer",
      }]
    });
 
    // Mock the return value of useParams hook
    (useParams as jest.Mock).mockReturnValue(mockedParams);
 
    await renderChatBoatView();
    expect(screen.getByTestId("project-detail")).toBeInTheDocument();
 
  });
 
});