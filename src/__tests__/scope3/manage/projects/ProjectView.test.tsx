// Import necessary modules and components
import projectService from "../../../../store/project/projectService";
import {
  projectData,
  projectReducer,
  projectDelete,
  searchProjectData,
  saveProjectDetailData,
  saveProjectRatingData,
  searchByEmail,
  getProjectDetails
} from "../../../../store/project/projectSlice";
import {
  ApiTest,
  TestFullFilledSlice,
  TestSliceMethod,
} from "../../../../commonCase/ReduxCases";
import ProjectView from "../../../../pages/project/ProjectView";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as router from "react-router-dom";

import * as reactRedux from "react-redux";
import {
  act,
  cleanup,
  render,
  screen,
} from "@testing-library/react";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import { commonDataReducer } from "store/commonData/commonSlice";
import { authDataReducer } from "store/auth/authDataSlice";
import { carrierDetailsReducer } from "store/scopeThree/track/carrier/vendorSlice";
import { laneDetailsReducer } from "store/scopeThree/track/lane/laneDetailsSlice";
import { authMockData, yearMockData, authPMockData } from "mockData/commonMockData.json";
import { projectViewMockData, searchableMockData } from "mockData/projectViewMockData.json";
import userEvent from "@testing-library/user-event";
import { nodeUrl } from "constant"
import { use } from "i18next";

// Payload for fetching project list
const getProjectListPayload = {
  year: 2023,
  region_id: "4",
  project_unique_id: "",
  lever: "",
};

// Payload for searching project list
const searchProjectListPayload = {};

const removeProjectListPayload = {
  project_id: 46,
};

// Configuration for fetching delete project using Redux
const removeProjectListDataObject = {
  service: projectService,
  serviceName: "removeProjectList",
  sliceName: "projectDelete",
  sliceImport: projectDelete,
  data: removeProjectListPayload,
  reducerName: projectReducer,
  loadingState: "isLoading",
  isSuccess: "isSuccess",
  actualState: "removeProject",
};

// Configuration for API testing of fetching delete project by id
const removeProjectListApiTestData = {
  serviceName: "removeProjectList",
  method: "post",
  data: removeProjectListPayload,
  serviceImport: projectService,
  route: `${nodeUrl}delete-project`,
};

// Configuration for fetching project list using Redux
const getProjectListDataObject = {
  service: projectService,
  serviceName: "getProjectList",
  sliceName: "projectData",
  sliceImport: projectData,
  data: getProjectListPayload,
  reducerName: projectReducer,
  loadingState: "isLoading",
  isSuccess: "isSuccess",
  actualState: "projectList",
};

// Configuration for API testing of fetching project list
const getProjectListApiTestData = {
  serviceName: "getProjectList",
  method: "post",
  data: getProjectListPayload,
  serviceImport: projectService,
  route: `${nodeUrl}get-project-list`,
};

// Configuration for searching project list using Redux
const searchProjectListDataObject = {
  service: projectService,
  serviceName: "searchProjectList",
  sliceName: "searchProjectData",
  sliceImport: searchProjectData,
  data: searchProjectListPayload,
  reducerName: projectReducer,
  loadingState: "isLoading",
  isSuccess: "isSuccess",
  actualState: "searchProjectList",
};

// Configuration for API testing of searching project list
const searchProjectListApiTestData = {
  serviceName: "searchProjectList",
  method: "post",
  data: searchProjectListPayload,
  serviceImport: projectService,
  route: `${nodeUrl}get-project-search-list`,
};

// 

// Configuration for searching project list using Redux
const saveProjectDetailDataObject = {
  service: projectService,
  serviceName: "saveProjectDetailsApi",
  sliceName: "saveProjectDetailData",
  sliceImport: saveProjectDetailData,
  data: searchProjectListPayload,
  reducerName: projectReducer,
  loadingState: "isLoadingSaveProject",
  isSuccess: "isSuccess",
  actualState: "saveProject",
};

// Configuration for API testing of searching project list
const saveProjectDetailsApiTestData = {
  serviceName: "saveProjectDetailsApi",
  method: "post",
  data: searchProjectListPayload,
  serviceImport: projectService,
  route: `${nodeUrl}save-project`,
};


// Configuration for searching project list using Redux
const saveProjectRatingDataObject = {
  service: projectService,
  serviceName: "saveProjectDetailsApi",
  sliceName: "saveProjectRatingData",
  sliceImport: saveProjectRatingData,
  data: searchProjectListPayload,
  reducerName: projectReducer,
  loadingState: "isLoading",
  isSuccess: "isSuccess",
  actualState: "saveProjectRating",
};

// Configuration for API testing of searching project list
const saveProjectRatingDataGetTestData = {
  serviceName: "saveProjectRatingDataGet",
  method: "post",
  data: searchProjectListPayload,
  serviceImport: projectService,
  route: `${nodeUrl}save-project-rating`,
};

// Configuration for searching project list using Redux
const searchByEmailObject = {
  service: projectService,
  serviceName: "searchByEmailApi",
  sliceName: "searchByEmail",
  sliceImport: searchByEmail,
  data: searchProjectListPayload,
  reducerName: projectReducer,
  loadingState: "isLoadingEmailSearch",
  isSuccess: "isSuccess",
  actualState: "searchedUsers",
};

// Configuration for API testing of searching project list
const searchByEmailApiTestData = {
  serviceName: "searchByEmailApi",
  method: "post",
  data: searchProjectListPayload,
  serviceImport: projectService,
  route: `${nodeUrl}search-user-by-email`,
};


// getProjectDetails

// Configuration for searching project list using Redux
const getProjectDetailsObject = {
  service: projectService,
  serviceName: "getProjectDetailsApi",
  sliceName: "getProjectDetails",
  sliceImport: getProjectDetails,
  data: searchProjectListPayload,
  reducerName: projectReducer,
  loadingState: "isLoadingProjectDetails",
  isSuccess: "isSuccess",
  actualState: "projectDetails",
};

// // Configuration for API testing of searching project list
// const getProjectDetailsApiTestData = {
//   serviceName: "getProjectDetails",
//   method: "post",
//   data: searchProjectListPayload,
//   serviceImport: projectService,
//   route: `${nodeUrl}search-user-by-email`,
// };

// Execute Redux slice tests for fetching project list and search results
TestFullFilledSlice({
  data: [
    getProjectListDataObject,
    searchProjectListDataObject,
    removeProjectListDataObject,
    saveProjectDetailDataObject,
    saveProjectRatingDataObject,
    searchByEmailObject,
    getProjectDetailsObject
  ],
});

// Execute API tests for fetching project list and search results
ApiTest({
  data: [
    getProjectListApiTestData,
    searchProjectListApiTestData,
    removeProjectListApiTestData,
    saveProjectDetailsApiTestData,
    saveProjectRatingDataGetTestData,
    searchByEmailApiTestData,
    // getProjectDetailsApiTestData

  ],
});

TestSliceMethod({
  data: [getProjectListDataObject, searchProjectListDataObject,
    saveProjectDetailDataObject,
    saveProjectRatingDataObject,
    searchByEmailObject,
    getProjectDetailsObject,
    removeProjectListDataObject
  ],
});

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

describe("test lane view ", () => {
  let useDispatchMock: jest.Mock;
  let useSelectorMock: jest.Mock;
  let stores: EnhancedStore;

  const navigate = jest.fn();
  beforeEach(() => {
    stores = configureStore({
      reducer: {
        project: projectReducer?.reducer,
        region: carrierDetailsReducer?.reducer,
        auth: authDataReducer.reducer,
        lane: laneDetailsReducer?.reducer,
        common: commonDataReducer.reducer,
      },
    });
    jest
      .spyOn(router, "useNavigate")
      .mockImplementation(() => navigate) as jest.Mock;

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

  const renderProjectView = async () => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <ProjectView />
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };

  //section id.....
  it(`<section> test case for whole page `, async () => {
    useSelectorMock.mockReturnValue({
      projectList: projectViewMockData,
    });
    await renderProjectView();
    expect(screen.getByTestId("projects")).toBeInTheDocument();
  });

  //searchable drop down.....
  it(`Searchable Drop Down Menu`, async () => {
    useSelectorMock.mockReturnValue({
      searchProjectList: searchableMockData,
    });
    await renderProjectView();
    const dropdown = screen.getByLabelText("searchable-drop-down");
    userEvent.click(dropdown);
    const option = await screen.findByText("Test 1");
    userEvent.click(option);
    useSelectorMock.mockReturnValue({
      projectList: [],
    });
  });


  //lever options dropdown
  it(`lever options dropdown`, async () => {
    let auth = jest.spyOn(tem, "useAuth");
    auth.mockReturnValue(authMockData);
    useSelectorMock.mockReturnValue({
      emissionDates: yearMockData,
      projectListLoading: false,
      loginDetails: {
        data: authPMockData?.userdata
      },
      projectList: projectViewMockData,
    });
    await renderProjectView();

    const dropdown = await screen.getByLabelText("lever-options-dropdown");
    await userEvent.click(dropdown);
    const option = await screen.findAllByText("Alternative Fuel");
    userEvent.click(option[0]);
  });

  it(`year dropdown`, async () => {
    let auth = jest.spyOn(tem, "useAuth");
    auth.mockReturnValue(authMockData);
    useSelectorMock.mockReturnValue({
      emissionDates: yearMockData,
    });
    await renderProjectView();

    const dropdown = screen.getByLabelText("year-dropdown");
    userEvent.click(dropdown);
    const option = await screen.findByText("2021");
    userEvent.click(option);
  });


  //cards loading
  it(`loader`, async () => {
    let auth = jest.spyOn(tem, "useAuth");
    auth.mockReturnValue(authMockData);
    useSelectorMock.mockReturnValue({
      projectListLoading: true,
    });
    await renderProjectView();
    expect(screen.getByTestId("spinner-loader"));
  });


  //remove project
  it(`lever options dropdown`, async () => {
    let auth = jest.spyOn(tem, "useAuth");
    auth.mockReturnValue(authMockData);
    useSelectorMock.mockReturnValue({
      emissionDates: yearMockData,
      projectListLoading: false,
      loginDetails: {
        data: authPMockData?.userdata
      },
      projectList: projectViewMockData[0],
    });
    await renderProjectView();

    userEvent.click(screen.getByTestId("show-all"));
    act(() => {
      userEvent.click(screen.getByTestId("remove-project-121"));
    })
    userEvent.click(screen.getByTestId("cancel-project-btn"));

    act(() => {
      userEvent.click(screen.getByTestId("remove-project-121"));
    })
    const closeButton = screen.getByRole("button", { name: /close/i });
    userEvent.click(closeButton);
    act(() => {
      userEvent.click(screen.getByTestId("remove-project-121"));
    })
    userEvent.click(screen.getByTestId("delete-project-confirm-btn"));
    // const removeBtn = await screen.findAllByTestId("remove-project");
    // userEvent.click(removeBtn[0]);
  });

  //remove project
  it(`lever options dropdown`, async () => {
    let auth = jest.spyOn(tem, "useAuth");
    auth.mockReturnValue(authMockData);
    useSelectorMock.mockReturnValue({
      emissionDates: yearMockData,
      projectListLoading: false,
      loginDetails: {
        data: authPMockData?.userdata
      },
      projectList: projectViewMockData[0],
    });
    await renderProjectView();

    userEvent.click(screen.getByTestId("project-card-link-121"));

    // const removeBtn = await screen.findAllByTestId("remove-project");
    // userEvent.click(removeBtn[0]);
  });

});
