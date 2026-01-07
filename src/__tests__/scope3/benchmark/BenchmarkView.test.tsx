// Import necessary modules and components
import {
  ApiTest,
  TestFullFilledSlice,
  TestSliceMethod,
} from "commonCase/ReduxCases";
import BenchmarksView from "pages/benchmark/BenchmarksView";
import {
  benchmarkDistance,
  benchmarkReducer,
  benchmarkRegion,
  benchmarkWeight,
  getDestination,
  getFreightLanes,
  getOrigin,
} from "store/benchmark/benchmarkSlice";
import benchmarkService from "store/benchmark/benchmarkService";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as reactRedux from "react-redux";
import * as router from "react-router-dom";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { authDataReducer } from "store/auth/authDataSlice";
import { authMockData, yearMockData } from "mockData/commonMockData.json";
import userEvent from "@testing-library/user-event";
import {
  benchmarkLaneMockData,
  benchmarkRegionMockData,
  distanceBandMockData,
  outboundRegionMockData,
  ttwBenchmarkLaneMockData,
  ttwBenchmarkRegionMockData,
  ttwdistanceBandMockData,
  ttwweightBandMockData,
  weightBandMockData,
} from "mockData/benchmarkViewMockData.json";
import { nodeUrl } from "constant";
// Payload for fetching table data
const frieghtDataPayload = {
  origin: "LEXINGTON,NC",
  dest: "CHARLOTTE, NC",
  toggle_data: 0,
  year: 2022,
  quarter: "",
};
const graphDistancePayload = {
  toggle_data: 0,
  year: 2022,
  quarter: "",
};
const graphWeightPayload = {
  toggle_data: 1,
  year: 2022,
  quarter: "",
};
const benchmarkRegionPayload = {
  bound_type: "inbound",
  toggle_data: 0,
  year: 2022,
  quarter: "",
};

const getOriginPayload = {
  keyword: "Salt",
  page_limit: 10,
  type: "origin",
};

const getDestinationPayload = {
  keyword: "Perris",
  page_limit: 10,
  source: "LEXINGTON,NC",
  type: "DEST",
};

// Configuration for fetching table data using Redux
const frieghtSlicetest = {
  service: benchmarkService,
  serviceName: "getFreightLanes",
  sliceName: "getFreightLanes",
  sliceImport: getFreightLanes,
  data: frieghtDataPayload,
  reducerName: benchmarkReducer,
  loadingState: "freightLanesDtoLoading",
  isSuccess: "isSuccess",
  actualState: "freightLanesDto",
};
const graphDistanceSlicetest = {
  service: benchmarkService,
  serviceName: "benchmarkDistance",
  sliceName: "benchmarkDistance",
  sliceImport: benchmarkDistance,
  data: graphDistancePayload,
  reducerName: benchmarkReducer,
  loadingState: "benchmarkDistanceDtoLoading",
  isSuccess: "isSuccess",
  actualState: "benchmarkDistanceDto",
};

const benchmarkWeightSlicetest = {
  service: benchmarkService,
  serviceName: "benchmarkWeight",
  sliceName: "benchmarkWeight",
  sliceImport: benchmarkWeight,
  data: graphWeightPayload,
  reducerName: benchmarkReducer,
  loadingState: "benchmarkWeightDtoLoading",
  isSuccess: "isSuccess",
  actualState: "benchmarkWeightDto",
};

const benchmarkRegionSlicetest = {
  service: benchmarkService,
  serviceName: "benchmarkRegion",
  sliceName: "benchmarkRegion",
  sliceImport: benchmarkRegion,
  data: benchmarkRegionPayload,
  reducerName: benchmarkReducer,
  loadingState: "benchmarkRegionDtoLoading",
  isSuccess: "isSuccess",
  actualState: "benchmarkRegionDto",
};

const getOriginSlicetest = {
  service: benchmarkService,
  serviceName: "getLocation",
  sliceName: "getOrigin",
  sliceImport: getOrigin,
  data: getOriginPayload,
  reducerName: benchmarkReducer,
  loadingState: "isLoadingOrigin",
  isSuccess: "isSuccess",
  actualState: "benchmarkLaneOrigin",
};

const getDestinationSlicetest = {
  service: benchmarkService,
  serviceName: "getLocation",
  sliceName: "getDestination",
  sliceImport: getDestination,
  data: getDestinationPayload,
  reducerName: benchmarkReducer,
  loadingState: "isLoadingDestination",
  isSuccess: "isSuccess",
  actualState: "benchmarkLaneDestination",
};

// Configuration for API testing of fetching table data
const frieghtApitest = {
  serviceName: "getFreightLanes",
  method: "post",
  data: frieghtDataPayload,
  serviceImport: benchmarkService,
  route: `${nodeUrl}emission-in-lane`,
};

const graphDistanceApiTest = {
  serviceName: "benchmarkDistance",
  method: "post",
  data: graphDistancePayload,
  serviceImport: benchmarkService,
  route: `${nodeUrl}graph-benchmark-distance`,
};

const graphWeightApiTest = {
  serviceName: "benchmarkWeight",
  method: "post",
  data: graphWeightPayload,
  serviceImport: benchmarkService,
  route: `${nodeUrl}graph-benchmark-weight`,
};
const benchmarkRegionApiTest = {
  serviceName: "benchmarkRegion",
  method: "post",
  data: benchmarkRegionPayload,
  serviceImport: benchmarkService,
  route: `${nodeUrl}map-benchmark-region`,
};

const getDestinationApitest = {
  serviceName: "getLocation",
  method: "post",
  data: getDestinationPayload,
  serviceImport: benchmarkService,
  route: `${nodeUrl}lane-search`,
};

// Execute Redux slice tests for table data
TestFullFilledSlice({
  data: [
    frieghtSlicetest,
    graphDistanceSlicetest,
    benchmarkWeightSlicetest,
    benchmarkRegionSlicetest,
    getOriginSlicetest,
    getDestinationSlicetest,
  ],
});

// Execute API test for table data
ApiTest({
  data: [
    frieghtApitest,
    graphDistanceApiTest,
    graphWeightApiTest,
    benchmarkRegionApiTest,
    getDestinationApitest,
  ],
});

TestSliceMethod({
  data: [
    frieghtSlicetest,
    graphDistanceSlicetest,
    benchmarkWeightSlicetest,
    benchmarkRegionSlicetest,
    getOriginSlicetest,
    getDestinationSlicetest,
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
        benchmarkView: benchmarkReducer?.reducer,
        auth: authDataReducer.reducer,
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

  const renderbenchmarkView = async () => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <BenchmarksView />
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };

  //section id.....
  it(`<section> test case for whole page `, async () => {
    await renderbenchmarkView();
    expect(screen.getByTestId("benchmark-view")).toBeInTheDocument();
  });

  //selectable row for year
  it(`selectable dropdown test case for year benchmark`, async () => {
    useSelectorMock.mockReturnValue({
      emissionDates: yearMockData,
    });
    await renderbenchmarkView();
    expect(
      screen.getByLabelText("year-drop-down-benchmarkView")
    ).toBeInTheDocument();
    userEvent.click(screen.getByLabelText("year-drop-down-benchmarkView"));
    const regionData = await screen.findByText("2021");
    userEvent.click(regionData);
  });

  //selectable row for quarter data
  it(`selectable dropdown test case for quarter benchmark`, async () => {
    await renderbenchmarkView();
    expect(
      screen.getByLabelText("quarter-drop-down-benchmarkView")
    ).toBeInTheDocument();
    userEvent.click(screen.getByLabelText("quarter-drop-down-benchmarkView"));
    const regionData = await screen.findByText("Q1");
    userEvent.click(regionData);
  });

  //toggle
  it(`high chart emission intensity data test case `, async () => {
    useSelectorMock.mockReturnValue({
      benchmarkDistanceDto: {
        data: distanceBandMockData,
      },
      benchmarkWeightDto: {
        data: weightBandMockData,
      },
      benchmarkRegionDto: {
        data: benchmarkRegionMockData,
      },
      freightLanesDto: {
        data: benchmarkLaneMockData,
      },
    });
    await renderbenchmarkView();
    const toggle = screen.getByTestId("toggle") as HTMLInputElement;
    expect(toggle).toBeInTheDocument();
    userEvent.click(toggle);
    useSelectorMock.mockReturnValue({
      benchmarkDistanceSwitch: true,
    });
    useSelectorMock.mockReturnValue({
      benchmarkDistanceDto: {
        data: ttwdistanceBandMockData,
      },
      benchmarkWeightDto: {
        data: ttwweightBandMockData,
      },
      benchmarkRegionMockData: {
        data: ttwBenchmarkRegionMockData,
      },
      freightLanesDto: {
        ttwBenchmarkLaneMockData,
      },
    });
    expect(toggle.checked);
  },10000);

  //toggle for region inbound or outbound
  it(`high chart emission intensity data test case `, async () => {
    useSelectorMock.mockReturnValue({
      benchmarkCompanyDetail: {
        data: benchmarkRegionMockData,
      },
    });
    await renderbenchmarkView();
    const toggle: HTMLInputElement = screen.getByTestId("toggle-benchmark-region");
    expect(toggle).toBeInTheDocument();
    userEvent.click(toggle);
    useSelectorMock.mockReturnValue({
      benchmarkDistanceSwitch: true,
    });
    useSelectorMock.mockReturnValue({
      benchmarkDistanceDto: {
        data: outboundRegionMockData,
      },
    });
    expect(toggle.checked);
  });

  //loading for select dropdown
  it(`loading spinner for benchmark`, async () => {
    useSelectorMock.mockReturnValue({
      isLoadingOrigin: true,
    });
    await renderbenchmarkView();
    expect(
      screen.getByTestId("dropdownSpinner-loading-benchmark")
    ).toBeInTheDocument();
  });

  //selectable row for origin data
  it(`selectable dropdown test case for destination`, async () => {
    await renderbenchmarkView();
    expect(
      screen.getByLabelText("origin-drop-down-benchmarkView")
    ).toBeInTheDocument();
    userEvent.click(screen.getByLabelText("origin-drop-down-benchmarkView"));
    // const destination = await screen.findByText("LEXINGTON,NC");
    // userEvent.click(destination);
  });

  //selectable row for destination data
  it(`selectable dropdown test case for destination`, async () => {
    await renderbenchmarkView();
    expect(
      screen.getByLabelText("destination-drop-down-benchmarkView")
    ).toBeInTheDocument();
    userEvent.click(
      screen.getByLabelText("destination-drop-down-benchmarkView")
    );
    // const destination = await screen.findByText("CHARLOTTE, NC");
    // userEvent.click(destination);
  });

  it(`/show emission graphs for lane emission`, async () => {
    await renderbenchmarkView();
    useSelectorMock.mockReturnValue({
      freightLanesDtoLoading: true,
      isLoadingDestination: true,
    });
    fireEvent.click(screen.getByTestId("destination-click"));
    act(() => {
      fireEvent.keyDown(screen.getByTestId("destination-click"));
    });
    // const destination = await screen.findByText("CHARLOTTE, NC");
    // userEvent.click(destination);
  });

  it(`/show emission graphs for lane emission`, async () => {
    await renderbenchmarkView();
    useSelectorMock.mockReturnValue({
      isLoadingOrigin: true,
    });
    fireEvent.click(screen.getByTestId("origin-handle"));
    act(() => {
      fireEvent.keyDown(screen.getByTestId("origin-handle"));
    });
    // const origin = await screen.findByText("LEXINGTON,NC");
    // userEvent.click(origin);
  });

  // loading
  it(`loading spinner for benchmark`, async () => {
    useSelectorMock.mockReturnValue({
      freightLanesDtoLoading: true,
    });
    await renderbenchmarkView();
    // expect(
    //   screen.getByTestId("benchmarkMap-loading-benchmark")
    // ).toBeInTheDocument();
  });
});
