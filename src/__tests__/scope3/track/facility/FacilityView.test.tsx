// Import necessary modules and components
import facilityService from "../../../../store/scopeThree/track/facility/facilityService";
import {
  facilityDataReducer,
  facilityGraphData,
  facilityTableData,
  resetFacility,
  initialState,
  isLoadingFacilityDashboard
} from "../../../../store/scopeThree/track/facility/facilityDataSlice";
import {
  ApiTest,
  TestFullFilledSlice,
  TestSliceMethod,
} from "../../../../commonCase/ReduxCases";
import FacilityView from "../../../../pages/facility/FacilityView";
import {
  act,
  render,
  cleanup,
  screen,
  fireEvent,
} from "@testing-library/react";
import * as reactRedux from "react-redux";
import * as router from "react-router-dom";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import { authMockData, regionMockdata, yearMockData } from "mockData/commonMockData.json";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import { authDataReducer } from "store/auth/authDataSlice";
import userEvent from "@testing-library/user-event";
import {
  facilityGraphEmissionMockdata,
  facilityGraphIntensityMockdata,
  facilityTableMockdata,
} from "mockData/facilityMockData.json";
import { commonDataReducer } from "store/commonData/commonSlice";
import { nodeUrl } from "constant";
import store from "store"
// Payload for getting facility graph data
const facilityGraphPayload = {
  region_id: "",
  ffacility_id: "",
  year: 2023,
  quarter: 1,
  toggel_data: 1,
};

// Payload for getting facility table data
const facilityTableDataPayload = {
  region_id: "",
  ffacility_id: "",
  year: 2023,
  quarter: 1,
  order_by: "desc",
  col_name: "emission",
};

// Configuration for fetching facility graph data using Redux
const facilityGraphDataObject = {
  service: facilityService,
  serviceName: "facilityGraphPost",
  sliceName: "facilityGraphData",
  sliceImport: facilityGraphData,
  data: facilityGraphPayload,
  reducerName: facilityDataReducer,
  loadingState: "facilityGraphDetailLoading",
  isSuccess: "isSuccess",
  actualState: "facilityGraphDetails",
};

// Configuration for fetching facility table data using Redux
const facilityTableDataObject = {
  service: facilityService,
  serviceName: "facilityTableDataGet",
  sliceName: "facilityTableData",
  sliceImport: facilityTableData,
  data: facilityTableDataPayload,
  reducerName: facilityDataReducer,
  loadingState: "facilityTableDetailLoading",
  isSuccess: "isSuccess",
  actualState: "facilityTableDetails",
};

// Configuration for API testing of fetching facility graph data
const facilityGraphApiTestData = {
  serviceName: "facilityGraphPost",
  method: "post",
  data: facilityGraphPayload,
  serviceImport: facilityService,
  route: `${nodeUrl}get-facilities-emission-data`,
};

// Configuration for API testing of fetching facility table data
const facilityTableDataApiTestData = {
  serviceName: "facilityTableDataGet",
  method: "post",
  data: facilityTableDataPayload,
  serviceImport: facilityService,
  route: `${nodeUrl}get-facilities-table-data`,
};


// Execute Redux slice tests for facility data
TestFullFilledSlice({
  data: [facilityTableDataObject, facilityGraphDataObject],
});

// Execute API tests for facility data
ApiTest({
  data: [facilityGraphApiTestData, facilityTableDataApiTestData],
});

TestSliceMethod({
  data: [facilityTableDataObject, facilityGraphDataObject],
});

// Test case initialState
describe('initial reducer', () => {
  it('should reset state to initialState when resetScopeOneCommonData is called', () => {
    const modifiedState: any = {
      data: [{ id: 1, value: 'test' }],
      loading: true,
      error: 'Something went wrong',
    };

    const result = facilityDataReducer.reducer(modifiedState, resetFacility());
    expect(result).toEqual(initialState);


  });
});

describe("open sidebar Thunk", () => {
  it("should return the correct status when dispatched", async () => {
    const status = true;
    // Dispatch the thunk action
    const result = await store.dispatch(isLoadingFacilityDashboard(status));
    expect(result.payload).toBe(status);
  });
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
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));
describe("test lane view for facility ", () => {
  let useDispatchMock: jest.Mock;
  let useSelectorMock: jest.Mock;
  let stores: EnhancedStore;
  const navigate = jest.fn();

  beforeEach(() => {
    stores = configureStore({
      reducer: {
        facility: facilityDataReducer?.reducer,
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

  const renderFacilityView = async () => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <FacilityView />
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };

  //section id.....
  it(`<section> test case for facility view page `, async () => {
    await renderFacilityView();
    expect(screen.getByTestId("facility")).toBeInTheDocument();
  });

  //regin selectable row for facility
  it(`region dropdown facility`, async () => {
    useSelectorMock.mockReturnValue({
      facilityGraphDetailLoading: false,
      regions: {
        data: regionMockdata,
      },
    });
    await renderFacilityView();
    expect(screen.getByLabelText("regions-data-dropdown-facility")).toBeInTheDocument();
    userEvent.click(screen.getByLabelText("regions-data-dropdown-facility"));
    const regionData = await screen.findByText("R1");
    userEvent.click(regionData);
  });

  //year dropdown
  it(`year selectable dropdown for facility`, async () => {
    useSelectorMock.mockReturnValue({
      emissionDates: yearMockData,
      facilityGraphDetailLoading: false,
    });
    await renderFacilityView();
    const dropdown = screen.getByLabelText("year-dropdown-facility");
    userEvent.click(dropdown);
    const option = await screen.findByText("2021");
    userEvent.click(option);
  });

  //quarter dropdown
  it(`quarter selectable dropdown for facility`, async () => {
    await renderFacilityView();
    expect(screen.getByLabelText("quarter-dropdown-facility")).toBeInTheDocument();
    userEvent.click(screen.getByLabelText("quarter-dropdown-facility"));
    // userEvent.click(await screen.findByText("Q4"));
  });

  it(`export download button for facility`, async () => {
    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/fake-blob');
    global.URL.revokeObjectURL = jest.fn();

    await renderFacilityView();

    // Assert that the button is rendered
    expect(screen.getByTestId("export-btn-facility")).toBeInTheDocument();

    // Simulate click
    await act(async () => {
      userEvent.click(screen.getByTestId("export-btn-facility"));
    });
  });

  //emission intensity graph data 1
  it(` graph data test case for Emission intensity for region for facility`, async () => {
    useSelectorMock.mockReturnValue({
      facilityGraphDetails: {
        data: facilityGraphIntensityMockdata,
      },
    });

    await renderFacilityView();
    expect(screen.getByTestId("graph-data-facility")).toBeInTheDocument();
    const emissionRadioToggle = screen.getByTestId(
      "emission-intensity-toggle-region"
    ) as HTMLInputElement;
    expect(emissionRadioToggle).toBeInTheDocument();
    fireEvent.click(emissionRadioToggle);
    expect(emissionRadioToggle.checked).toBe(true);
  });

  //total emission graph data 2
  it(` graph data test case for Total Emission  for region for facility`, async () => {
    useSelectorMock.mockReturnValue({
      regionGraphDetails: {
        data: facilityGraphEmissionMockdata,
      },
    });

    await renderFacilityView();
    expect(screen.getByTestId("graph-data-facility")).toBeInTheDocument();
    const TotalemissionRadioToggle = screen.getByTestId(
      "total-emission-toggle-region"
    ) as HTMLInputElement;
    expect(TotalemissionRadioToggle).toBeInTheDocument();
    fireEvent.click(TotalemissionRadioToggle);
    expect(TotalemissionRadioToggle.checked).toBe(true);
  });


  //performance data headings
  it(`performance heading data for facility`, async () => {
    await renderFacilityView();
    expect(screen.getByTestId("performance-data-heading")).toBeInTheDocument();
  });

  //loading
  it(`loading spinner for facility`, async () => {
    useSelectorMock.mockReturnValue({
      facilityTableDetailLoading: true,
      facilityGraphDetailLoading: true,

    });
    await renderFacilityView();
    expect(screen.getByTestId("table-data-loading-facility")).toBeInTheDocument();
  });


  //navigate to other page region wise emission intensity
  it(`region wise emission intensity table graph data for facility`, async () => {
    useSelectorMock.mockReturnValue({
      facilityTableDetailLoading: false,
      facilityTableDetails: {
        data: facilityTableMockdata,
      },
    });
    await renderFacilityView();
    expect(screen.getByTestId("table-graph-data-facility")).toBeInTheDocument();
    facilityTableMockdata?.forEach(async (ele: any, index) => {
      expect(screen.getByTestId(`table-row-data-facility${index}`)).toBeInTheDocument();
      fireEvent.click(screen.getByTestId(`table-row-data-facility${index}`));
      // expect(navigate).toHaveBeenCalledWith(
      //   `/facility-overview/${ele?.["Facility.id"]}/2023/0`
      // );
    });
  });

  // change order by clicking on table headings
  it(`arrow buttons in table heading for sorting for facility`, async () => {
    useSelectorMock.mockReturnValue({
      facilityTableDetailLoading: false,
      facilityTableDetails: {
        data: facilityTableMockdata,
      },
    });
    await renderFacilityView();
    expect(screen.getByTestId("change-order-intensity-facility")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("change-order-intensity-facility"));
    expect(screen.getByTestId("change-order-shipments-facility")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("change-order-shipments-facility"));
    expect(screen.getByTestId("change-order-emission-facility")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("change-order-emission-facility"));
  });
});
