// Import necessary modules and components
import businessUnitService from "../../../../store/businessUnit/businessUnitService";
import { businessUnitDataReducer, businessUnitGraphData, businessUnitTableData, isLoadingBusinessUnitDashboard, initialState, resetBusinessUnit } from "../../../../store/businessUnit/businessUnitSlice";
import { ApiTest, TestFullFilledSlice, TestSliceMethod } from "../../../../commonCase/ReduxCases";
import BusinessUnitView from "../../../../pages/businessUnit/BusinessUnitView";
import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { authDataReducer } from "store/auth/authDataSlice";
import { commonDataReducer } from "store/commonData/commonSlice";
import {
  act,
  render,
  cleanup,
  screen,
  fireEvent,
} from "@testing-library/react";
import * as reactRedux from "react-redux";
import * as router from "react-router-dom";
import { authMockData, yearMockData, regionMockdata, divisionMockdata } from "mockData/commonMockData.json";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import userEvent from "@testing-library/user-event";
import { businessUnitEmissionMockData, businessUnitGraphTableMockData, businessUnitIntensityMockData } from "mockData/scope3/track/businessUnitMockData.json";
import { nodeUrl } from "constant"
import store from "store"
// Payload for posting region graph data
const businessUnitGraphPostPayload = {
  region_id: "",
  year: 2023,
  quarter: 1,
  toggel_data: 0,
};

// Payload for fetching region table data
const businessUnitTableDataGetPayload = { "region_id": "", "year": 2023, "quarter": 1, "toggel_data": 0, "order_by": "desc", "col_name": "emission" };

// Configuration for fetching region table data via Redux
const businessUnitTableDataGetDataObject = {
  service: businessUnitService,
  serviceName: "businessUnitTableDataGet",
  sliceName: "businessUnitTableData",
  sliceImport: businessUnitTableData,
  data: businessUnitTableDataGetPayload,
  reducerName: businessUnitDataReducer,
  loadingState: "isLoading",
  isSuccess: "isSuccess",
  actualState: "businessUnitTableDetails",
};

// Configuration for API testing of fetching region table data
const businessUnitTableDataGetApiTestData = {
  serviceName: "businessUnitTableDataGet",
  method: "post",
  data: businessUnitTableDataGetPayload,
  serviceImport: businessUnitService,
  route: `${nodeUrl}get-business-unit-table-data`,
};

// Configuration for posting region graph data via Redux
const businessUnitGraphPostDataObject = {
  service: businessUnitService,
  serviceName: "businessUnitGraphPost",
  sliceName: "businessUnitGraphData",
  sliceImport: businessUnitGraphData,
  data: businessUnitGraphPostPayload,
  reducerName: businessUnitDataReducer,
  loadingState: "businessUnitGraphDetailsLoading",
  isSuccess: "isSuccess",
  actualState: "businessUnitGraphDetails",
};

// Configuration for API testing of posting region graph data
const businessUnitGraphPostApiTestData = {
  serviceName: "businessUnitGraphPost",
  method: "post",
  data: businessUnitGraphPostPayload,
  serviceImport: businessUnitService,
  route: `${nodeUrl}get-business-emission-data`,
};

// Test case initialState
describe('initial reducer', () => {
  it('should reset state to initialState when resetScopeOneCommonData is called', () => {
    const modifiedState: any = {
      data: [{ id: 1, value: 'test' }],
      loading: true,
      error: 'Something went wrong',
    };

    const result = businessUnitDataReducer.reducer(modifiedState, resetBusinessUnit());

    expect(result).toEqual(initialState);
  });
});

describe("isLoadingBusinessUnitDashboard Thunk", () => {
  it("should return the correct status when dispatched", async () => {
    const status = true;
    // Dispatch the thunk action
    const result = await store.dispatch(isLoadingBusinessUnitDashboard(status));
    expect(result.payload).toBe(status);
  });
});


// Execute Redux slice tests for various data
TestFullFilledSlice({
  data: [businessUnitGraphPostDataObject, businessUnitTableDataGetDataObject],
});

// Execute API tests for various data
ApiTest({
  data: [businessUnitGraphPostApiTestData, businessUnitTableDataGetApiTestData],
});

TestSliceMethod({
  data: [businessUnitGraphPostDataObject, businessUnitTableDataGetDataObject]
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

describe("test lane view for business overview ", () => {
  let useDispatchMock: jest.Mock;
  let useSelectorMock: jest.Mock;
  let stores: EnhancedStore;
  const navigate = jest.fn();

  beforeEach(() => {
    stores = configureStore({
      reducer: {
        businessUnit: businessUnitDataReducer?.reducer,
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

  const renderBusinessUnitView = async () => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <BusinessUnitView />
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };

  //section id.....
  it(`<section> test case for business unit view page `, async () => {
    await renderBusinessUnitView();
    expect(screen.getByTestId("business-unit")).toBeInTheDocument();
  });

  //regin selectable row for business unit
  it(`region dropdown business unit`, async () => {
    useSelectorMock.mockReturnValue({
      businessUnitGraphDetailsLoading: false,
      regions: {
        data: regionMockdata,
      },
    });
    await renderBusinessUnitView();
    expect(screen.getByLabelText("regions-data-dropdown-business-unit")).toBeInTheDocument();
    userEvent.click(screen.getByLabelText("regions-data-dropdown-business-unit"));
    const regionData = await screen.findByText("R1");
    userEvent.click(regionData);
  });

  //divison selectable row for business unit
  it(`divison dropdown business unit`, async () => {
    useSelectorMock.mockReturnValue({
      businessUnitGraphDetailsLoading: false,
      loginDetails: {
        data: authMockData?.userdata
      },
      configConstants: {
        data: {
          DEFAULT_YEAR: 2024,
          rd_radius: 20
        }
      },
      regions: {
        data: regionMockdata,
      },
      divisions: {
        data: divisionMockdata
      }
    });
    await renderBusinessUnitView();
    expect(screen.getByLabelText("divison-dropdown")).toBeInTheDocument();
    userEvent.click(screen.getByLabelText("divison-dropdown"));
    const optionDivision = await screen.findByText("OUTBOUND-Test");
    userEvent.click(optionDivision);
  });

  // divison-dropdown

  //year dropdown
  it(`year selectable dropdown for business unit`, async () => {
    useSelectorMock.mockReturnValue({
      emissionDates: yearMockData,
      businessUnitGraphDetailsLoading: false,
    });
    await renderBusinessUnitView();
    const dropdown = screen.getByLabelText("year-dropdown-business-unit");
    userEvent.click(dropdown);
    const option = await screen.findByText("2021");
    userEvent.click(option);
  });

  //quarter dropdown
  it(`quarter selectable dropdown for business unit`, async () => {
    await renderBusinessUnitView();
    expect(screen.getByLabelText("quarter-dropdown-business-unit")).toBeInTheDocument();
    userEvent.click(screen.getByLabelText("quarter-dropdown-business-unit"));
    await act(async () => {
      userEvent.click(await screen.findByText("Q4"));
    })

  });

  //export download button
  // it(`Jess unit`, async () => {
  //   global.URL.createObjectURL = jest.fn(() => 'mocked-url');
  //   global.URL.revokeObjectURL = jest.fn();

  //   useSelectorMock.mockReturnValue({
  //     businessUnitTableDetails: {
  //       data: businessUnitGraphTableMockData,
  //     },
  //   });

  //   await renderBusinessUnitView();
  //   expect(screen.getByTestId("export-btn-business-unit")).toBeInTheDocument();
  //   act(() => {
  //     userEvent.click(screen.getByTestId("export-btn-business-unit"));
  //   })
  // });

  //emission intensity graph data 1
  it(` graph data test case for Emission intensity for region for business unit`, async () => {
    useSelectorMock.mockReturnValue({
      businessUnitList: {
        data: businessUnitIntensityMockData,
      },
    });

    await renderBusinessUnitView();
    expect(screen.getByTestId("graph-data-business-unit")).toBeInTheDocument();
    const emissionRadioToggle = screen.getByTestId(
      "emission-intensity-toggle-region"
    ) as HTMLInputElement;
    expect(emissionRadioToggle).toBeInTheDocument();
    fireEvent.click(emissionRadioToggle);
    expect(emissionRadioToggle.checked).toBe(true);
  });

  //emission intensity graph data 1
  it(` graph data test case for Emission intensity for region for business unit`, async () => {
    useSelectorMock.mockReturnValue({
      businessUnitList: {
        data: businessUnitEmissionMockData,
      },
    });

    await renderBusinessUnitView();
    expect(screen.getByTestId("graph-data-business-unit")).toBeInTheDocument();
    const emissionRadioToggle = screen.getByTestId(
      "emission-intensity-toggle-region"
    ) as HTMLInputElement;
    expect(emissionRadioToggle).toBeInTheDocument();
    fireEvent.click(emissionRadioToggle);
    expect(emissionRadioToggle.checked).toBe(true);
  });

  //loading
  it(`loading spinner for business unit`, async () => {
    useSelectorMock.mockReturnValue({
      isLoading: true,

    });
    await renderBusinessUnitView();
    // expect(screen.getByTestId("table-data-loading")).toBeInTheDocument();
  });

  //navigate to other page region wise emission intensity
  it(`region wise emission intensity table graph data for business unit`, async () => {
    useSelectorMock.mockReturnValue({
      businessUnitGraphDetailsLoading: false,
      businessUnitTableDetails: {
        data: businessUnitGraphTableMockData,
      },
    });
    await renderBusinessUnitView();
    expect(screen.getByTestId("table-graph-data")).toBeInTheDocument();
    businessUnitGraphTableMockData?.forEach(async (ele: any, index) => {
      expect(screen.getByTestId(`table-row-data${index}`)).toBeInTheDocument();
      fireEvent.click(screen.getByTestId(`table-row-data${index}`));
      // expect(navigate).toHaveBeenCalledWith(
      //   `/business-unit-overview/${ele?.["bu_id"]}/2023/0`
      // );
    });
  });

  // change order by clicking on table headings
  it(`arrow buttons in table heading for sorting for business unit`, async () => {
    useSelectorMock.mockReturnValue({
      isLoading: false,
      businessUnitTableDetails: {
        data: businessUnitGraphTableMockData,
      },
    });
    await renderBusinessUnitView();
    expect(screen.getByTestId("change-order-intensity")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("change-order-intensity"));
    expect(screen.getByTestId("change-order-shipments")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("change-order-shipments"));
    expect(screen.getByTestId("change-order-emission")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("change-order-emission"));
  });


})