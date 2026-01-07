// Import necessary modules and components
import {
  ApiTest,
  TestFullFilledSlice,
  TestSliceMethod,
} from "../../../commonCase/ReduxCases";
import BenchmarkCarrierTableView from "pages/benchmarkCarrierTable/BenchmarkCarrierTableView";
import {
  benchmarkReducer,
  getBenchmarkCarrierEmissions,
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
import { authMockData } from "mockData/commonMockData.json";
import { useParams } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import {
  regionCarrierEmissionMockData,
  ttwRegionCarrierMockData,
} from "mockData/regionBenchmarkMockData.json";
import { nodeUrl } from "constant"

// Payload for fetching table data
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
// Configuration for fetching table data using Redux
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

// Configuration for API testing of fetching table data
const getBenchmarkCarrierEmissionsApiTest = {
  serviceName: "getBenchmarkCarrierEmissions",
  method: "post",
  data: getBenchmarkCarrierEmissionsPayload,
  serviceImport: benchmarkService,
  route: `${nodeUrl}carrier-emission-table`,
};

// Execute Redux slice tests for table data
TestFullFilledSlice({ data: [getBenchmarkCarrierEmissionsSlice] });

// Execute API test for table data
ApiTest({
  data: [getBenchmarkCarrierEmissionsApiTest],
});

TestSliceMethod({
  data: [getBenchmarkCarrierEmissionsSlice],
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
        benchmarkCarrierTable: benchmarkReducer?.reducer,
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
      boundType: 0 ? "inbound" : "outbound",
    };
    // Mock the return value of useParams hook
    (useParams as jest.Mock).mockReturnValue(mockedParams);
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    cleanup();
  });

  const renderbenchmarkCarrierTable = async () => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <BenchmarkCarrierTableView />
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };

  //section id.....
  it(`<section> test case for whole page `, async () => {
    await renderbenchmarkCarrierTable();
    expect(screen.getByTestId("benchmark-carrier-table")).toBeInTheDocument();
  });

  //back button
  it(`back button for benchmark-carrier`, async () => {
    await renderbenchmarkCarrierTable();
    expect(
      screen.getByTestId("back-btn-benchmark-carrier")
    ).toBeInTheDocument();
    act(() => {
      userEvent.click(screen.getByTestId("back-btn-benchmark-carrier"));
    });
  });

  //loading for select dropdown
  it(`loading spinner for benchmark`, async () => {
    useSelectorMock.mockReturnValue({
      benchmarkLCompanyarrierEmissionsLoading: true,
    });
    await renderbenchmarkCarrierTable();
    expect(
      screen.getByTestId("spinner-loader")
    ).toBeInTheDocument();
  });

  // table data 1
  it(`Lowe's Carriers table data`, async () => {
    useSelectorMock.mockReturnValue({
      benchmarkCompanyCarrierEmissionsList: {
        data: regionCarrierEmissionMockData,
      },
    });
    await renderbenchmarkCarrierTable();
    expect(
      screen.getByTestId("table-graph-data-carrier-table")
    ).toBeInTheDocument();
  });

  // table data 2
  it(`Industry Carriers table data`, async () => {
    useSelectorMock.mockReturnValue({
      benchmarkCompanyCarrierEmissionsList: {
        data: ttwRegionCarrierMockData,
      },
    });
    await renderbenchmarkCarrierTable();

    expect(
      screen.getByTestId("table-graph-data-carrier-table2")
    ).toBeInTheDocument();
  });
  //pagination
  it(`pagination carrier-table`, async () => {
    useSelectorMock.mockReturnValue({
      benchmarkCompanyCarrierEmissionsList: {
        data: regionCarrierEmissionMockData?.pagination,
      },
    });
    await renderbenchmarkCarrierTable();
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("pagination"));
    // expect(
    //   screen.getByLabelText("pagination-carrier-table")
    // ).toBeInTheDocument();
    // await act(async () => {
    //   userEvent.click(screen.getByLabelText("pagination-carrier-table"));
    // });
    // const paginationData = await screen.findByText("20");
    // await act(async () => {
    //   userEvent.click(paginationData);
    // });
  });
});
