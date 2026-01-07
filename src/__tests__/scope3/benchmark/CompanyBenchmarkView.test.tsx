// Import necessary modules and components
import {
  ApiTest,
  TestFullFilledSlice,
  TestSliceMethod,
} from "commonCase/ReduxCases";
import {
  benchmarkReducer,
  getBenchmark,
  getBandRange,
} from "store/benchmark/benchmarkSlice";
import benchmarkService from "store/benchmark/benchmarkService";
import CompanyBenchmarkView from "pages/benchmark/companyBenchmark/CompanyBenchmarkView";
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
// import { yearMockData } from "mockData/SustainableMockData";
import userEvent from "@testing-library/user-event";
import {
  benchmarkCarrierEmissionMockData,
  benchmarkEmissionTrendGraphData,
  benchmarkLaneTableMockData,
  benchmarkRegionMockData,
  benchmarkToogleHighCarrierEmissionMockData,
  CompanyBenchmarkDetailsMockData,
  toogleHighBenchmarkLaneTableMockData,
  ttwbenchmarkCarrierEmissionMockData,
  ttwbenchmarkEmissionTrendGraphData,
  ttwBenchmarkLaneTableMockData,
  ttwCompanyBenchmarkDetailsMockData,
  ttwHighBenchmarkLaneTableMockData,
} from "mockData/companyBenchmarkMockData.json";
import { nodeUrl } from "constant"
// Payload for fetching table data
const benchmarkMapCompanyPayload = {
  toggle_data: 0,
  band_no: 2,
  year: 2022,
  quarter: "",
  type: "mile",
};
const benchmarkCarrierPayload = {
  toggle_data: 0,
  band_no: 2,
  year: 2022,
  quarter: "",
  low_emission: 1,
  type: "mile",
};
const companyEmissionPayload = {
  toggle_data: 0,
  band_no: 2,
  year: 2022,
  quarter: "",
  low_emission: 1,
  type: "mile",
};

// Configuration for fetching table data using Redux
const getBandRangeSlice = {
  service: benchmarkService,
  serviceName: "getBands",
  sliceName: "getBandRange",
  sliceImport: getBandRange,
  data: { band_type: "weight" },
  reducerName: benchmarkReducer,
  loadingState: "isLoadingGetBand",
  isSuccess: "isSuccess",
  actualState: "bandRange",
};

// Configuration for API testing of fetching table data
const getBandRangeApiTest = {
  serviceName: "getBands",
  method: "post",
  data: { band_type: "weight" },
  serviceImport: benchmarkService,
  route: `${nodeUrl}company-band-name`,
};

// Configuration for fetching table data using Redux
const benchmarkCompanySlice = {
  service: benchmarkService,
  serviceName: "getBenchmark",
  sliceName: "getBenchmark",
  sliceImport: getBenchmark,
  data: benchmarkMapCompanyPayload,
  reducerName: benchmarkReducer,
  loadingState: "benchmarkCompanyDetailLoading",
  isSuccess: "isSuccess",
  actualState: "benchmarkCompanyDetail",
};

// Configuration for API testing of fetching table data
const benchmarkMapCompanyApiTest = {
  serviceName: "getBenchmark",
  method: "post",
  data: benchmarkMapCompanyPayload,
  serviceImport: benchmarkService,
  route: `${nodeUrl}map-benchmark-company`,
};

const benchmarkCarrierEmission = {
  serviceName: "getBenchmarkCarrierEmissions",
  method: "post",
  data: benchmarkCarrierPayload,
  serviceImport: benchmarkService,
  route: `${nodeUrl}carrier-emission-table`,
};

const graphWeightApiTest = {
  serviceName: "getIndustryStandardEmissions",
  method: "post",
  data: companyEmissionPayload,
  serviceImport: benchmarkService,
  route: `${nodeUrl}company-emission`,
};

// Execute Redux slice tests for table data
TestFullFilledSlice({ data: [benchmarkCompanySlice, getBandRangeSlice] });

// Execute API test for table data
ApiTest({
  data: [
    benchmarkMapCompanyApiTest,
    benchmarkCarrierEmission,
    graphWeightApiTest,
    getBandRangeApiTest,
  ],
});

TestSliceMethod({
  data: [benchmarkCompanySlice, getBandRangeSlice],
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
        CompanyBenchmarkView: benchmarkReducer?.reducer,
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

  const renderCompanyBenchmarkView = async () => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <CompanyBenchmarkView />
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };

  //section id.....
  it(`<section> test case for whole page `, async () => {
    await renderCompanyBenchmarkView();
    expect(screen.getByTestId("company-benchmark")).toBeInTheDocument();
  });

  //back button
  it(`back button for company-overview`, async () => {
    await renderCompanyBenchmarkView();
    expect(screen.getByTestId("back-btn-company-overview")).toBeInTheDocument();
    act(() => {
      userEvent.click(screen.getByTestId("back-btn-company-overview"));
    });
  });

  //range band selectable row for becnchmarkCompany
  it(`range dropdown companyBechmark`, async () => {
    useSelectorMock.mockReturnValue({
      benchmarkCompanyDetailLoading: false,
      data: benchmarkRegionMockData,
    });
    await renderCompanyBenchmarkView();
    expect(
      screen.getByLabelText("ranges-data-dropdown-companyBechmark")
    ).toBeInTheDocument();
    userEvent.click(
      screen.getByLabelText("ranges-data-dropdown-companyBechmark")
    );
  });

  //selectable row for year
  it(`selectable dropdown test case for year`, async () => {
    useSelectorMock.mockReturnValue({
      emissionDates: yearMockData,
    });
    await renderCompanyBenchmarkView();
    expect(
      screen.getByLabelText("year-drop-down-companyBenchmarkView")
    ).toBeInTheDocument();
    userEvent.click(
      screen.getByLabelText("year-drop-down-companyBenchmarkView")
    );
    const yearData = await screen.findByText("2021");
    userEvent.click(yearData);
  });

  //selectable row for quarter data
  it(`selectable dropdown test case for quarter`, async () => {
    await renderCompanyBenchmarkView();
    expect(
      screen.getByLabelText("quarter-drop-down-companyBenchmarkView")
    ).toBeInTheDocument();
    userEvent.click(
      screen.getByLabelText("quarter-drop-down-companyBenchmarkView")
    );
    const quarterData = await screen.findByText("Q1");
    userEvent.click(quarterData);
  });

  //toggle
  it(`toogle switch data test case `, async () => {
    useSelectorMock.mockReturnValue({
      benchmarkCompanyDetail: {
        data: CompanyBenchmarkDetailsMockData,
      },
      emissionIntensityTrendDto: {
        data: benchmarkEmissionTrendGraphData,
      },
      industryStandardEmissionsList: {
        data: benchmarkLaneTableMockData,
      },
      benchmarkCompanyCarrierEmissionsList: {
        data: benchmarkCarrierEmissionMockData,
      },
    });
    await renderCompanyBenchmarkView();
    const toggleDetail = screen.getByTestId(
      "toggle-Detail"
    ) as HTMLInputElement;
    expect(toggleDetail).toBeInTheDocument();
    userEvent.click(toggleDetail);
    useSelectorMock.mockReturnValue({
      benchmarkDetailSwitch: true,
    });
    useSelectorMock.mockReturnValue({
      benchmarkCompanyDetail: {
        data: ttwCompanyBenchmarkDetailsMockData,
      },
      emissionIntensityTrendDto: {
        data: ttwbenchmarkEmissionTrendGraphData,
      },
      industryStandardEmissionsList: {
        data: ttwBenchmarkLaneTableMockData,
      },
      benchmarkCompanyCarrierEmissionsList: {
        data: ttwbenchmarkCarrierEmissionMockData,
      },
    });
    expect(toggleDetail.checked);
  },10000);

  // loading
  it(`loading spinner for benchmark`, async () => {
    useSelectorMock.mockReturnValue({
      benchmarkCompanyDetailLoading: true,
      industryStandardEmissionsLoading: true,
      benchmarkLCompanyarrierEmissionsLoading: true,
    });
    await renderCompanyBenchmarkView();
    expect(
      screen.getByTestId("CompanyBenchmark-loading-benchmark")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("CompanyBenchmark-loading-industryStandard")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("benchmark-CompanyBenchmark-loading-industryStandard")
    ).toBeInTheDocument();
  });

  //comapny Benchmark Details
  it(`cards details test cases for companyBenchmark`, async () => {
    useSelectorMock.mockReturnValue({
      benchmarkCompanyDetail: CompanyBenchmarkDetailsMockData,
    });
    await renderCompanyBenchmarkView();
    expect(screen.getByTestId("card-1")).toBeInTheDocument();
    expect(screen.getByTestId("card-2")).toBeInTheDocument();
    expect(screen.getByTestId("card-3")).toBeInTheDocument();
  });

  //region selectable row for becnchmarkCompany
  it(`region dropdown companyBechmark`, async () => {
    useSelectorMock.mockReturnValue({
      emissionIntensityTrendLoading: false,
      benchmarkRegionList: {
        data: benchmarkRegionMockData,
      },
    });
    await renderCompanyBenchmarkView();
    expect(
      screen.getByLabelText("regions-data-dropdown-companyBechmark")
    ).toBeInTheDocument();
    userEvent.click(
      screen.getByLabelText("regions-data-dropdown-companyBechmark")
    );
  });

  //highchart emission benchmark Company test cases
  it(`lane table emission intensity data test case `, async () => {
    useSelectorMock.mockReturnValue({
      emissionIntensityTrendDto: {
        data: benchmarkEmissionTrendGraphData,
      },
    });

    await renderCompanyBenchmarkView();
    expect(
      screen.getByTestId("high-chart-emission-intensity")
    ).toBeInTheDocument();
  });

  //toggle for companyBenchmark lane Table
  it(`lane emission intensity data test case `, async () => {
    useSelectorMock.mockReturnValue({
      benchmarkCompanyDetail: {
        data: benchmarkLaneTableMockData,
      },
    });
    await renderCompanyBenchmarkView();
    const toggleLane = screen.getByTestId(
      "toggle-lane-benchmark-company"
    ) as HTMLInputElement;
    expect(toggleLane).toBeInTheDocument();
    userEvent.click(toggleLane);
    useSelectorMock.mockReturnValue({
      lowIndustryStandardEmission: true,
    });
    useSelectorMock.mockReturnValue({
      benchmarkCompanyDetail: {
        data: ttwHighBenchmarkLaneTableMockData,
      },
    });
    expect(toggleLane.checked);
  });

  //toggle for companyBenchmark carrier Table
  it(`high chart emission intensity data test case `, async () => {
    useSelectorMock.mockReturnValue({
      benchmarkCompanyDetail: {
        data: benchmarkCarrierEmissionMockData,
      },
    });
    await renderCompanyBenchmarkView();
    const toggleCarrier = screen.getByTestId(
      "toggle-carrier-benchmark-company"
    ) as HTMLInputElement;
    expect(toggleCarrier).toBeInTheDocument();
    userEvent.click(toggleCarrier);
    useSelectorMock.mockReturnValue({
      lowCarrierEmission: true,
    });
    useSelectorMock.mockReturnValue({
      benchmarkCompanyDetail: {
        data: benchmarkToogleHighCarrierEmissionMockData,
      },
    });
    expect(toggleCarrier.checked);
  });

  //lane breakdown High/low Emissions Intensity Lanes table
  it(`High Emissions Intensity Lanes table tab`, async () => {
    useSelectorMock.mockReturnValue({
      benchmarkLCompanyarrierEmissionsLoading: true,
      benchmarkCompanyCarrierEmissionsList: {
        data: benchmarkCarrierEmissionMockData,
      },
      industryStandardEmissionsList: {
        data: benchmarkLaneTableMockData,
      },
    });
    await renderCompanyBenchmarkView();
    expect(screen.getByTestId("high-emission-table-data")).toBeInTheDocument();
    expect(screen.getByTestId("low-emission-tab-table")).toBeInTheDocument();
    expect(screen.getByTestId("lane-emission-table-data")).toBeInTheDocument();
  });

  //No Data found
  it(`no data found for facility overview`, async () => {
    useSelectorMock.mockReturnValue({
      benchmarkCompanyDetail: {
        data: {},
      },
    });
    await renderCompanyBenchmarkView();
    expect(
      screen.getByTestId("no-data-found-company-benchmark")
    ).toBeInTheDocument();
  });
});
