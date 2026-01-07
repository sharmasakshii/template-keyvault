// Import necessary modules and components
import {
  ApiTest,
  TestFullFilledSlice,
  TestSliceMethod,
} from "commonCase/ReduxCases";
import {
  benchmarkReducer,
  getIndustryStandardEmissions,
} from "store/benchmark/benchmarkSlice";
import benchmarkService from "store/benchmark/benchmarkService";
import BenchmarkLaneTableView from "pages/benchmarkLaneTable/BenchmarkLaneTableView";
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
import { authMockData } from "mockData/commonMockData.json";
import { benchmarkLaneTableMockData } from "mockData/companyBenchmarkMockData.json";
import userEvent from "@testing-library/user-event";
import { useParams } from "react-router-dom";
import { nodeUrl } from "constant"
// Payload for fetching table data
const getIndustryStandardEmissionsPayload = {
  toggle_data: 0,
  band_no: 2,
  year: 2022,
  quarter: "",
  low_emission: 1,
  type: "mile",
};

// Configuration for fetching table data using Redux
const getIndustryStandardEmissionsSlice = {
  service: benchmarkService,
  serviceName: "getIndustryStandardEmissions",
  sliceName: "getIndustryStandardEmissions",
  sliceImport: getIndustryStandardEmissions,
  data: getIndustryStandardEmissionsPayload,
  reducerName: benchmarkReducer,
  loadingState: "industryStandardEmissionsLoading",
  isSuccess: "isSuccess",
  actualState: "industryStandardEmissionsList",
};

// Configuration for API testing of fetching table data
const getIndustryStandardEmissionsApitest = {
  serviceName: "getIndustryStandardEmissions",
  method: "post",
  data: getIndustryStandardEmissionsPayload,
  serviceImport: benchmarkService,
  route: `${nodeUrl}company-emission`,
};

// Execute Redux slice tests for table data
TestFullFilledSlice({ data: [getIndustryStandardEmissionsSlice] });

// Execute API test for table data
ApiTest({
  data: [getIndustryStandardEmissionsApitest],
});

TestSliceMethod({
  data: [getIndustryStandardEmissionsSlice],
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
        benchmarkLaneTable: benchmarkReducer?.reducer,
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

  const renderbenchmarkLaneTable = async () => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <BenchmarkLaneTableView />
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };

  //section id.....
  it(`<section> test case for whole page `, async () => {
    await renderbenchmarkLaneTable();
    expect(screen.getByTestId("benchmark-lane-table")).toBeInTheDocument();
  });

  //back button
  it(`back button for benchmark-lane`, async () => {
    await renderbenchmarkLaneTable();
    expect(screen.getByTestId("back-btn-benchmark-lane")).toBeInTheDocument();
    act(() => {
      userEvent.click(screen.getByTestId("back-btn-benchmark-lane"));
    });
  });

  //loading for select dropdown
  it(`loading spinner for benchmark lane`, async () => {
    useSelectorMock.mockReturnValue({
      industryStandardEmissionsLoading: true,
    });
    await renderbenchmarkLaneTable();
    expect(
      screen.getByTestId("spinner-loader")
    ).toBeInTheDocument();
  });

  // table data
  it(`Lowe's Emissions Intensity table graph data for benchmark-lane`, async () => {
    useSelectorMock.mockReturnValue({
      industryStandardEmissionsList: {
        data: benchmarkLaneTableMockData,
      },
    });
    await renderbenchmarkLaneTable();
    expect(
      screen.getByTestId("table-graph-data-lane-table")
    ).toBeInTheDocument();
  });

  //pagination
  it(`pagination lane-table`, async () => {
    useSelectorMock.mockReturnValue({
      industryStandardEmissionsList: {
        data: benchmarkLaneTableMockData?.pagination,
      },
    });
    await renderbenchmarkLaneTable();
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("pagination"));
    // expect(screen.getByLabelText("pagination-dropdown")).toBeInTheDocument();
    // await act(async () => {
    //   userEvent.click(screen.getByLabelText("pagination-dropdown"));
    // });
    // const paginationData = await screen.findByText("10");
    // await act(async () => {
    //   userEvent.click(paginationData);
    // });
  });
});
