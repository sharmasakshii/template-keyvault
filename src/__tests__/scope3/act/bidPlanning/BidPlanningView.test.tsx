// Import necessary modules and components
import bidPlanningService from "../../../../store/bidPlanning/bidPlanningService";
import { addBidFile, bidPlanningDataReducer, bidPlanningFileList, bidPlanningSaveFileData, bidPlanningStatusList, deleteMultiBidFiles } from "../../../../store/bidPlanning/bidPlanningSlice";
import { ApiTest, TestFullFilledSlice, TestSliceMethod } from "../../../../commonCase/ReduxCases";
import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { authDataReducer } from "store/auth/authDataSlice";
import { commonDataReducer } from "store/commonData/commonSlice";
import { act, render, cleanup, screen } from "@testing-library/react";
import * as reactRedux from "react-redux";
import * as router from "react-router-dom";
import { authMockData } from "mockData/commonMockData.json";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import BidsPlanningView from "pages/bidsPlanning/BidsPlanningView";
import { nodeUrl } from "constant";

// Payload for bidPlanning File List
const fileListPayload = {
  name: "",
  page_size: 10,
  page: 1,
  search: "",
  status_id: "",
  order_by: "desc"
};

// Configuration for fetching File List via Redux
const bidPlanningFileListObject = {
  service: bidPlanningService,
  serviceName: "getBidFileList",
  sliceName: "bidPlanningFileList",
  sliceImport: bidPlanningFileList,
  data: fileListPayload,
  reducerName: bidPlanningDataReducer,
  loadingState: "isLoadingBidFileList",
  isSuccess: "isSuccess",
  actualState: "bidFileList",
};

// Configuration for API testing of fetching File List data
const bidPlanningFileListApiTestData = {
  serviceName: "getBidFileList",
  method: "post",
  data: fileListPayload,
  serviceImport: bidPlanningService,
  route: `${nodeUrl}get-all-bid-files`,
};


const bidPlanningStatusListSlice = {
  service: bidPlanningService,
  serviceName: "getBidStatusList",
  sliceName: "bidPlanningStatusList",
  sliceImport: bidPlanningStatusList,
  data: '',
  reducerName: bidPlanningDataReducer,
  loadingState: "isLoadingStatusList",
  actualState: "bidStatusList",
};

// Configuration for API testing of posting intermodal report matrix data
const bidPlanningStatusListDataApi = {
  serviceName: "getBidStatusList",
  method: "get",
  data: '',
  serviceImport: bidPlanningService,
  route: `${nodeUrl}get-all-bid-status`,
};

const payload = {
  name: '',
  statusId: '',
  base_path: '',
}


const bidPlanningSaveFileSlice = {
  service: bidPlanningService,
  serviceName: "saveBidFileDataApi",
  sliceName: "bidPlanningSaveFileData",
  sliceImport: bidPlanningSaveFileData,
  data: payload,
  reducerName: bidPlanningDataReducer,
  loadingState: "isLoadingSaveFile",
  actualState: "bidFileDataMatrics",
};

// Configuration for API testing of posting intermodal report matrix data
const bidPlanningSaveFileDataApi = {
  serviceName: "saveBidFileDataApi",
  method: "post",
  data: payload,
  serviceImport: bidPlanningService,
  route: `${nodeUrl}save-bid-file-data`,
};


const deleteMultiBidFilesPayload = {
  deleteData: {
    file_id: ''
  }
}

// const deleteMultiBidFilesSlice = {
//     service: bidPlanningService,
//     serviceName: "deleteMultiBidFileApi",
//     sliceName: "deleteMultiBidFiles",
//     sliceImport: deleteMultiBidFiles,
//     data: deleteMultiBidFilesPayload,
//     reducerName: bidPlanningDataReducer,
//     loadingState: "isLoadingDeleteFile",
//     actualState: "",
// };

// // Configuration for API testing of posting intermodal report matrix data
// const deleteMultiBidFilesDataApi = {
//     serviceName: "deleteMultiBidFileApi",
//     method: "post",
//     data: deleteMultiBidFilesPayload,
//     serviceImport: bidPlanningService,
//     route: `${nodeUrl}delete-miltiple-bid-file`,
// };


const addBidFileSlice = {
  service: bidPlanningService,
  serviceName: "addBidFileApi",
  sliceName: "addBidFile",
  sliceImport: addBidFile,
  data: deleteMultiBidFilesPayload,
  reducerName: bidPlanningDataReducer,
  loadingState: "isLoadingAddBidFile",
  actualState: "addBidFileData",
};

// Configuration for API testing of posting intermodal report matrix data
const addBidFileDataApi = {
  serviceName: "addBidFileApi",
  method: "post",
  data: deleteMultiBidFilesPayload,
  serviceImport: bidPlanningService,
  route: `${nodeUrl}upload-bid-file`,
};

// Execute Redux slice tests for various data
TestFullFilledSlice({
  data: [bidPlanningFileListObject, bidPlanningStatusListSlice, bidPlanningSaveFileSlice, addBidFileSlice],
});

// Execute API tests for various data
ApiTest({
  data: [bidPlanningFileListApiTestData, bidPlanningStatusListDataApi, bidPlanningSaveFileDataApi, addBidFileDataApi],
});

TestSliceMethod({
  data: [bidPlanningFileListObject, bidPlanningStatusListSlice, bidPlanningSaveFileSlice, addBidFileSlice],
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

describe("test cases for Bid planning view ", () => {
  let useDispatchMock: jest.Mock;
  let useSelectorMock: jest.Mock;
  let stores: EnhancedStore;
  const navigate = jest.fn();

  beforeEach(() => {
    stores = configureStore({
      reducer: {
        bidPlanning: bidPlanningDataReducer?.reducer,
        auth: authDataReducer.reducer,
        commonData: commonDataReducer.reducer,
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

  const renderBidPlanningView = async () => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <BidsPlanningView />
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };

  //section id.....
  it(`<section> test case for bid planning view page `, async () => {
    await renderBidPlanningView();
    expect(screen.getByTestId("bid-planning")).toBeInTheDocument();
  });
})