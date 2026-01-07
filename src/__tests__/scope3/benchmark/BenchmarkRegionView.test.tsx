// Import necessary modules and components
import {
  ApiTest,
  TestFullFilledSlice,
  TestSliceMethod,
} from "commonCase/ReduxCases";
import {
  benchmarkReducer,
  getBenchmarkRegion,
  getEmissionByRegion,
  getEmissionByLane,
  getBenchmarkCarrierEmissions,
  getBenchmarkEmissionsTrendGraph,
  getIntermodelTrendGraph,
  getEmissionIntensityTrend,
  getIntermodelTrendGraphLane,
  getBenchmarkEmissionsTrendGraphLane,
} from "store/benchmark/benchmarkSlice";
import benchmarkService from "store/benchmark/benchmarkService";
import BenchmarkRegion from "pages/benchmark/banchmarkRegion/BanchmarkRegionView";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as reactRedux from "react-redux";
import * as router from "react-router-dom";
import {
  act,
  cleanup,
  render,
  screen,
} from "@testing-library/react";
import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { authDataReducer } from "store/auth/authDataSlice";
import { authMockData, yearMockData } from "mockData/commonMockData.json";
import userEvent from "@testing-library/user-event";
import {
  regionCardsDetailMockData,
  regionCarrierEmissionMockData,
  regionEmissionTrendMockData,
  regionIntermodalMockData,
  regionOutboundCardsMockData,
  ttwRegionCardsMockData,
  ttwRegionCarrierMockData,
  ttwRegionEmissionTrendMockData,
} from "mockData/regionBenchmarkMockData.json";
import { benchmarkRegionMockData } from "mockData/companyBenchmarkMockData.json";
import { useParams } from "react-router-dom";
import { nodeUrl } from "constant"

// Payload for fetching table data
const getEmissionByRegionPayload = {
  toggle_data: 0,
  region_id: 2,
  bound_type: "outbound",
  year: 2023,
  quarter: "",
};

const getEmissionByLanePayload = {
  toggle_data: 0,
  year: 2022,
  quarter: "",
  origin: "LEXINGTON,NC",
  dest: "CHARLOTTE, NC",
};

const getBenchmarkCarrierEmissionsPayload = {
  bound_type: "inbound",
  dest: "CHARLOTTE, NC",
  low_emission: 1,
  origin: "LEXINGTON,NC",
  quarter: "",
  toggle_data: 0,
  type: "lane",
  year: 2022,
};

const getBenchmarkEmissionsTrendGraphPayload = {
  region_id: 2,
  bound_type: "outbound",
  quarter: "",
  toggle_data: 0,
  year: 2022,
};

const getIntermodelTrendGraphPayload = {
  toggle_data: 0,
  region_id: 2,
  bound_type: "outbound",
  year: 2022,
  quarter: "",
};

const getEmissionIntensityTrendPayload = {
  toggle_data: 0,
  band_no: 1,
  year: 2021,
  quarter: "",
  region: "",
  type: "mile",
};

const getIntermodelTrendGraphLanePayload = {
  dest: "CHARLOTTE, NC",
  origin: "LEXINGTON,NC",
  quarter: "",
  toggle_data: 0,
  year: 2022,
};

const getBenchmarkEmissionsTrendGraphLanePayload = {
  dest: "CHARLOTTE, NC",
  origin: "LEXINGTON,NC",
  quarter: "",
  toggle_data: 0,
  year: 2022,
};

// Configuration for fetching table data using Redux
const getBenchmarkRegionSlice = {
  service: benchmarkService,
  serviceName: "getBenchmarkRegion",
  sliceName: "getBenchmarkRegion",
  sliceImport: getBenchmarkRegion,
  data: "",
  reducerName: benchmarkReducer,
  loadingState: "isLoading",
  isSuccess: "isSuccess",
  actualState: "benchmarkRegionList",
};

const getEmissionByRegionSlice = {
  service: benchmarkService,
  serviceName: "getEmissionByRegion",
  sliceName: "getEmissionByRegion",
  sliceImport: getEmissionByRegion,
  data: getEmissionByRegionPayload,
  reducerName: benchmarkReducer,
  loadingState: "emissionByRegionLoading",
  isSuccess: "isSuccess",
  actualState: "emissionByRegionDto",
};

const getEmissionByLaneSlice = {
  service: benchmarkService,
  serviceName: "getEmissionByLane",
  sliceName: "getEmissionByLane",
  sliceImport: getEmissionByLane,
  data: getEmissionByLanePayload,
  reducerName: benchmarkReducer,
  loadingState: "emissionByRegionLoading",
  isSuccess: "isSuccess",
  actualState: "emissionByRegionDto",
};

const getBenchmarkCarrierEmissionsSlice = {
  service: benchmarkService,
  serviceName: "getBenchmarkCarrierEmissions",
  sliceName: "getBenchmarkCarrierEmissions",
  sliceImport: getBenchmarkCarrierEmissions,
  data: getBenchmarkCarrierEmissionsPayload,
  reducerName: benchmarkReducer,
  loadingState: "benchmarkLCompanyarrierEmissionsLoading",
  isSuccess: "isSuccess",
  actualState: "benchmarkCompanyCarrierEmissionsList",
};

const getBenchmarkEmissionsTrendGraphSlice = {
  service: benchmarkService,
  serviceName: "getBenchmarkEmissionsTrendGraph",
  sliceName: "getBenchmarkEmissionsTrendGraph",
  sliceImport: getBenchmarkEmissionsTrendGraph,
  data: getBenchmarkEmissionsTrendGraphPayload,
  reducerName: benchmarkReducer,
  loadingState: "benchmarkEmissionsTrendGraphLoading",
  isSuccess: "isSuccess",
  actualState: "benchmarkEmissionsTrendGraphDto",
};

const getIntermodelTrendGraphSlice = {
  service: benchmarkService,
  serviceName: "getIntermodelTrendGraph",
  sliceName: "getIntermodelTrendGraph",
  sliceImport: getIntermodelTrendGraph,
  data: getIntermodelTrendGraphPayload,
  reducerName: benchmarkReducer,
  loadingState: "intermodelTrendGraphLoading",
  isSuccess: "isSuccess",
  actualState: "intermodelTrendGraphDto",
};

const getEmissionIntensityTrendSlice = {
  service: benchmarkService,
  serviceName: "getEmissionIntensityTrend",
  sliceName: "getEmissionIntensityTrend",
  sliceImport: getEmissionIntensityTrend,
  data: getEmissionIntensityTrendPayload,
  reducerName: benchmarkReducer,
  loadingState: "emissionIntensityTrendLoading",
  isSuccess: "isSuccess",
  actualState: "emissionIntensityTrendDto",
};

const getIntermodelTrendGraphLaneSlice = {
  service: benchmarkService,
  serviceName: "getIntermodelTrendGraphLane",
  sliceName: "getIntermodelTrendGraphLane",
  sliceImport: getIntermodelTrendGraphLane,
  data: getIntermodelTrendGraphLanePayload,
  reducerName: benchmarkReducer,
  loadingState: "intermodelTrendGraphLoading",
  isSuccess: "isSuccess",
  actualState: "intermodelTrendGraphDto",
};

const getBenchmarkEmissionsTrendGraphLaneSlice = {
  service: benchmarkService,
  serviceName: "getBenchmarkEmissionsTrendGraphLane",
  sliceName: "getBenchmarkEmissionsTrendGraphLane",
  sliceImport: getBenchmarkEmissionsTrendGraphLane,
  data: getBenchmarkEmissionsTrendGraphLanePayload,
  reducerName: benchmarkReducer,
  loadingState: "benchmarkEmissionsTrendGraphLoading",
  isSuccess: "isSuccess",
  actualState: "benchmarkEmissionsTrendGraphDto",
};

// Configuration for API testing of fetching table data
const getBenchmarkRegionSliceApiTest = {
  serviceName: "getBenchmarkRegion",
  method: "get",
  data: "",
  serviceImport: benchmarkService,
  route: `${nodeUrl}graph-benchmark-region`,
};

const getEmissionByRegionApiTest = {
  serviceName: "getEmissionByRegion",
  method: "post",
  data: getEmissionByRegionPayload,
  serviceImport: benchmarkService,
  route: `${nodeUrl}emission-by-region`,
};

const getEmissionByLaneApiTest = {
  serviceName: "getEmissionByLane",
  method: "post",
  data: getEmissionByLanePayload,
  serviceImport: benchmarkService,
  route: `${nodeUrl}emission-by-lane`,
};

const getBenchmarkCarrierEmissionsApiTest = {
  serviceName: "getBenchmarkCarrierEmissions",
  method: "post",
  data: getBenchmarkCarrierEmissionsPayload,
  serviceImport: benchmarkService,
  route: `${nodeUrl}carrier-emission-table`,
};

const getBenchmarkEmissionsTrendGraphApiTest = {
  serviceName: "getBenchmarkEmissionsTrendGraph",
  method: "post",
  data: getBenchmarkEmissionsTrendGraphPayload,
  serviceImport: benchmarkService,
  route: `${nodeUrl}emission-trend-graph`,
};

const getIntermodelTrendGraphApiTest = {
  serviceName: "getIntermodelTrendGraph",
  method: "post",
  data: getIntermodelTrendGraphPayload,
  serviceImport: benchmarkService,
  route: `${nodeUrl}intermodel-trend-graph`,
};

const getEmissionIntensityTrendApiTest = {
  serviceName: "getEmissionIntensityTrend",
  method: "post",
  data: getEmissionIntensityTrendPayload,
  serviceImport: benchmarkService,
  route: `${nodeUrl}company-emission-graph`,
};

const getIntermodelTrendGraphLaneApiTest = {
  serviceName: "getIntermodelTrendGraphLane",
  method: "post",
  data: getEmissionIntensityTrendPayload,
  serviceImport: benchmarkService,
  route: `${nodeUrl}intermodel-trend-graph-lane`,
};

const getBenchmarkEmissionsTrendGraphLaneApiTest = {
  serviceName: "getBenchmarkEmissionsTrendGraphLane",
  method: "post",
  data: getBenchmarkEmissionsTrendGraphLanePayload,
  serviceImport: benchmarkService,
  route: `${nodeUrl}emission-trend-graph-lane`,
};

// Execute Redux slice tests for table data
TestFullFilledSlice({
  data: [
    getBenchmarkRegionSlice,
    getEmissionByRegionSlice,
    getEmissionByLaneSlice,
    getBenchmarkCarrierEmissionsSlice,
    getBenchmarkEmissionsTrendGraphSlice,
    getIntermodelTrendGraphSlice,
    getEmissionIntensityTrendSlice,
    getIntermodelTrendGraphLaneSlice,
    getBenchmarkEmissionsTrendGraphLaneSlice,
  ],
});

// Execute API test for table data
ApiTest({
  data: [
    getEmissionByLaneApiTest,
    getBenchmarkRegionSliceApiTest,
    getEmissionByRegionApiTest,
    getBenchmarkCarrierEmissionsApiTest,
    getBenchmarkEmissionsTrendGraphApiTest,
    getIntermodelTrendGraphApiTest,
    getEmissionIntensityTrendApiTest,
    getIntermodelTrendGraphLaneApiTest,
    getBenchmarkEmissionsTrendGraphLaneApiTest,
  ],
});

TestSliceMethod({
  data: [
    getBenchmarkRegionSlice,
    getEmissionByRegionSlice,
    getEmissionByLaneSlice,
    getBenchmarkCarrierEmissionsSlice,
    getBenchmarkEmissionsTrendGraphSlice,
    getIntermodelTrendGraphSlice,
    getEmissionIntensityTrendSlice,
    getIntermodelTrendGraphLaneSlice,
    getBenchmarkEmissionsTrendGraphLaneSlice,
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
  useParams: jest.fn(),
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
        benchmarkRegion: benchmarkReducer?.reducer,
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

    const mockedParams = {
      type: "region",
      yearId: "2022",
      quarterId: "all",
      wtwType: "1",
      boundType: "outbound",
    };

    // Mock the return value of useParams hook
    (useParams as jest.Mock).mockReturnValue(mockedParams);
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    cleanup();
  });

  const renderbenchmarkRegion = async () => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <BenchmarkRegion />
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };

  //section id.....
  it(`<section> test case for whole page `, async () => {
    await renderbenchmarkRegion();
    expect(screen.getByTestId("region-benchmark")).toBeInTheDocument();
  });

  //back button
  it(`back button for region-benchmark`, async () => {
    await renderbenchmarkRegion();
    expect(screen.getByTestId("back-btn-region-benchmark")).toBeInTheDocument();
    act(() => {
      userEvent.click(screen.getByTestId("back-btn-region-benchmark"));
    });
  });

  //toggle
  it(`toogle  switch data test case `, async () => {
    useSelectorMock.mockReturnValue({
      emissionByRegionDto: {
        data: regionCardsDetailMockData,
      },
    });
    await renderbenchmarkRegion();
    const toggle: HTMLInputElement = screen.getByTestId("toggle");
    expect(toggle).toBeInTheDocument();
    userEvent.click(toggle);
    useSelectorMock.mockReturnValue({
      boundType: true,
    });
    useSelectorMock.mockReturnValue({
      emissionByRegionDto: {
        data: regionOutboundCardsMockData,
      },
    });
    expect(toggle.checked);
  });

  //toggle ttw
  it(`toogle ttw switch data test case `, async () => {
    useSelectorMock.mockReturnValue({
      emissionByRegionDto: {
        data: regionCardsDetailMockData,
      },
      benchmarkEmissionsTrendGraphDto: {
        data: regionEmissionTrendMockData,
      },
      benchmarkCompanyCarrierEmissionsList: {
        data: regionCarrierEmissionMockData,
      },
    });
    await renderbenchmarkRegion();
    const toggleBenchmark: HTMLInputElement = screen.getByTestId("toggle-region-ttw");
    expect(toggleBenchmark).toBeInTheDocument();
    userEvent.click(toggleBenchmark);
    useSelectorMock.mockReturnValue({
      benchmarkDetailSwitch: true,
    });
    useSelectorMock.mockReturnValue({
      emissionByRegionDto: {
        data: ttwRegionCardsMockData,
      },
      benchmarkEmissionsTrendGraphDto: {
        data: ttwRegionEmissionTrendMockData,
      },
      benchmarkCompanyCarrierEmissionsList: {
        data: ttwRegionCarrierMockData,
      },
    });
    expect(toggleBenchmark.checked);
  },10000);

  //region selectable row for becnchmarkCompany
  it(`region dropdown benchmark region`, async () => {
    useSelectorMock.mockReturnValue({
      isPageLoading: false,
      benchmarkRegionList: {
        data: benchmarkRegionMockData,
      },
    });
    await renderbenchmarkRegion();
    expect(
      screen.getByLabelText("regions-data-dropdown-Bechmark-regions")
    ).toBeInTheDocument();
    userEvent.click(
      screen.getByLabelText("regions-data-dropdown-Bechmark-regions")
    );
  });

  //selectable row for year
  it(`selectable dropdown test case for year benchmark region`, async () => {
    useSelectorMock.mockReturnValue({
      emissionDates: yearMockData,
    });
    await renderbenchmarkRegion();
    expect(
      screen.getByLabelText("year-drop-down-regionBenchmarkView")
    ).toBeInTheDocument();
    userEvent.click(
      screen.getByLabelText("year-drop-down-regionBenchmarkView")
    );
    const yearData = await screen.findByText("2021");
    userEvent.click(yearData);
  });

  //selectable row for quarter data
  it(`selectable dropdown test case for quarter benchmark quarter`, async () => {
    await renderbenchmarkRegion();
    expect(
      screen.getByLabelText("quarter-drop-down-regionBenchmarkView")
    ).toBeInTheDocument();
    userEvent.click(
      screen.getByLabelText("quarter-drop-down-regionBenchmarkView")
    );
    const quarterData = await screen.findByText("Q1");
    userEvent.click(quarterData);
  });

  // loading
  it(`loading spinner for benchmark region`, async () => {
    useSelectorMock.mockReturnValue({
      emissionByRegionLoading: true,
    });
    await renderbenchmarkRegion();
    expect(
      screen.getByTestId("region-Benchmark-loading-benchmark")
    ).toBeInTheDocument();
  });

  //highchart emission benchmark region test cases
  it(` lane table emission intensity data test case `, async () => {
    useSelectorMock.mockReturnValue({
      benchmarkEmissionsTrendGraphDto: {
        data: regionEmissionTrendMockData,
      },
      intermodelTrendGraphDto: {
        data: regionIntermodalMockData,
      },
    });

    await renderbenchmarkRegion();
    expect(
      screen.getByTestId("high-chart-emission-intensity")
    ).toBeInTheDocument();
    expect(screen.getByTestId("high-chart-intermodal")).toBeInTheDocument();
  });

  //lane breakdown High/low Emissions Intensity Lanes table
  it(`High Emissions Intensity Lanes table tab`, async () => {
    useSelectorMock.mockReturnValue({
      industryStandardEmissionsLoading: true,
      benchmarkCompanyCarrierEmissionsList: {
        data: regionCarrierEmissionMockData,
      },
      emissionByRegionDto: {
        data: ttwRegionCarrierMockData,
      },
    });
    await renderbenchmarkRegion();
    expect(screen.getByTestId("lowes-standard-table-data")).toBeInTheDocument();
    expect(screen.getByTestId("indus-standard-tab-table")).toBeInTheDocument();
  });

  //toggle emission
  it(`toogle emission switch data test case `, async () => {
    useSelectorMock.mockReturnValue({
      benchmarkCompanyCarrierEmissionsList: {
        data: regionCarrierEmissionMockData,
      },
    });
    await renderbenchmarkRegion();
    const toggleEmission: HTMLInputElement = screen.getByTestId("toggle-region-emission");
    expect(toggleEmission).toBeInTheDocument();
    userEvent.click(toggleEmission);
    useSelectorMock.mockReturnValue({
      lowCarrierEmission: true,
    });
    useSelectorMock.mockReturnValue({
      benchmarkCompanyCarrierEmissionsList: {
        data: ttwRegionCarrierMockData,
      },
    });
    expect(toggleEmission.checked);
  });
});
