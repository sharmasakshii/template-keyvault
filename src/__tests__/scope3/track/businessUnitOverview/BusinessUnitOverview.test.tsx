import {
  act,
  render,
  cleanup,
  screen,
} from "@testing-library/react";
import * as reactRedux from "react-redux";
import * as router from "react-router-dom";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import { authMockData, yearMockData } from "mockData/commonMockData.json";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import { authDataReducer } from "store/auth/authDataSlice";
import { commonDataReducer } from "store/commonData/commonSlice";
import BusinessUnitOverview from "pages/businessUnitOverview/BusinessUnitOverviewView";
import userEvent from "@testing-library/user-event";
import { businessOverviewCardsMockData, carrierEmissionIntensityGraphMockData, carrierTotalEmsissionGraphMockData, laneEmissionIntensityGraphMockData, laneTotalEmissionGraphMockData, ReductionOverviewEmissionsGraphMockData, ReductionOverviewIntensityGraphMockData, regionEmissionGraphMockData, regionIntensityGraphMockData } from "mockData/businessUnitOverViewMockData.json";
import { ApiTest, TestFullFilledSlice, TestSliceMethod } from "../../../../commonCase/ReduxCases";

import businessUnitService from "store/businessUnit/businessUnitService";
import { businessUnitOverviewReducer, initialState, resetBusinessUnitOverview, businessLaneGraphData, businessUnitGlidePath, businessUnitOverviewDetail, businessCarrierComparison, businessRegionGraphData } from "store/businessUnit/businessUnitOverviewSlice";

import { nodeUrl } from "constant"
// Payload for posting region graph data
const businessUnitGraphPostPayload = {
  region_id: "",
  year: 2023,
  quarter: 1,
  toggel_data: 0,
};

// Payload for fetching region table data
const businessGetPayload = { "region_id": "", "year": 2023, "quarter": 1, "toggel_data": 0, "order_by": "desc", "col_name": "emission" };

// Configuration for fetching region table data via Redux
const businessUnitOverviewDetailDataObject = {
  service: businessUnitService,
  serviceName: "getBusinessUnitOverviewDetail",
  sliceName: "businessUnitOverviewDetail",
  sliceImport: businessUnitOverviewDetail,
  data: businessGetPayload,
  reducerName: businessUnitOverviewReducer,
  loadingState: "businessUnitOverviewDetailLoading",
  actualState: "businessUnitOverviewDetailData",
};

// Configuration for API testing of fetching region table data
const businessUnitOverviewDetailGetApiTestData = {
  serviceName: "getBusinessUnitOverviewDetail",
  method: "post",
  data: businessGetPayload,
  serviceImport: businessUnitService,
  route: `${nodeUrl}get-business-carrier-overview-detail`,
};

// Configuration for posting region graph data via Redux
const businessUnitGraphPostDataObject = {
  service: businessUnitService,
  serviceName: "businessUnitGlidePath",
  sliceName: "businessUnitGlidePath",
  sliceImport: businessUnitGlidePath,
  data: businessUnitGraphPostPayload,
  reducerName: businessUnitOverviewReducer,
  loadingState: "isLoadingBusinessUnitLevelGlidePath",
  actualState: "businessUnitLevelGlideData",
};

// Configuration for API testing of posting region graph data
const businessUnitGraphPostApiTestData = {
  serviceName: "businessUnitGlidePath",
  method: "post",
  data: businessUnitGraphPostPayload,
  serviceImport: businessUnitService,
  route: `${nodeUrl}get-business-reduction`,
};


// Configuration for posting region graph data via Redux
const businessLaneGraphDataDataObject = {
  service: businessUnitService,
  serviceName: "businessLaneGraphData",
  sliceName: "businessLaneGraphData",
  sliceImport: businessLaneGraphData,
  data: businessUnitGraphPostPayload,
  reducerName: businessUnitOverviewReducer,
  loadingState: "businessLaneGraphDetailsLoading",
  actualState: "businessLaneGraphDetails",
};

// Configuration for API testing of posting region graph data
const businessLaneGraphDataApiTestData = {
  serviceName: "businessLaneGraphData",
  method: "post",
  data: businessUnitGraphPostPayload,
  serviceImport: businessUnitService,
  route: `${nodeUrl}get-Business-unit-emission`,
};

// Configuration for posting region graph data via Redux
const businessCarrierComparisonDataObject = {
  service: businessUnitService,
  serviceName: "businessCarrierComparison",
  sliceName: "businessCarrierComparison",
  sliceImport: businessCarrierComparison,
  data: businessUnitGraphPostPayload,
  reducerName: businessUnitOverviewReducer,
  loadingState: "businessCarrierComparisonLoading",
  actualState: "businessCarrierComparisonData",
};

// Configuration for API testing of posting region graph data
const businessCarrierComparisonApiTestData = {
  serviceName: "businessCarrierComparison",
  method: "post",
  data: businessUnitGraphPostPayload,
  serviceImport: businessUnitService,
  route: `${nodeUrl}get-business-carrier-comparison-graph`,
};


// Configuration for posting region graph data via Redux
const businessRegionGraphDataObject = {
  service: businessUnitService,
  serviceName: "businessRegionGraphData",
  sliceName: "businessRegionGraphData",
  sliceImport: businessRegionGraphData,
  data: businessUnitGraphPostPayload,
  reducerName: businessUnitOverviewReducer,
  loadingState: "businessUnitRegionGraphDetailsLoading",
  actualState: "businessUnitRegionGraphDetails",
};

// Configuration for API testing of posting region graph data
const businessRegionGraphDataApiTestData = {
  serviceName: "businessRegionGraphData",
  method: "post",
  data: businessUnitGraphPostPayload,
  serviceImport: businessUnitService,
  route: `${nodeUrl}get-business-unit-emission-by-region`,
};


// Test case initialState
describe('initial reducer', () => {
  it('should reset state to initialState when resetScopeOneCommonData is called', () => {
      const modifiedState: any = {
          data: [{ id: 1, value: 'test' }],
          loading: true,
          error: 'Something went wrong',
      };

      const result = businessUnitOverviewReducer.reducer(modifiedState, resetBusinessUnitOverview());

      expect(result).toEqual(initialState);
  });
});


// Execute Redux slice tests for various data
TestFullFilledSlice({
  data: [
    businessUnitGraphPostDataObject,
    businessUnitOverviewDetailDataObject,
    businessLaneGraphDataDataObject,
    businessCarrierComparisonDataObject,
    businessRegionGraphDataObject
  ],
});

// Execute API tests for various data
ApiTest({
  data: [
    businessUnitGraphPostApiTestData,
    businessUnitOverviewDetailGetApiTestData,
    businessLaneGraphDataApiTestData,
    businessCarrierComparisonApiTestData,
    businessRegionGraphDataApiTestData
  ],
});

TestSliceMethod({
  data: [
    businessUnitGraphPostDataObject,
    businessUnitOverviewDetailDataObject,
    businessLaneGraphDataDataObject,
    businessCarrierComparisonDataObject,
    businessRegionGraphDataObject
  ]
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

describe("test lane view for facility ", () => {
  let useDispatchMock: jest.Mock;
  let useSelectorMock: jest.Mock;
  let stores: EnhancedStore;
  const navigate = jest.fn();

  beforeEach(() => {
    stores = configureStore({
      reducer: {
        BusinessUnitOverview: businessUnitOverviewReducer?.reducer,
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

  const renderBusinessOverViewView = async () => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <BusinessUnitOverview />
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };

  //section id.....
  it(`<section> test case for business overview view page `, async () => {
    await renderBusinessOverViewView();
    expect(screen.getByTestId("business-overview")).toBeInTheDocument();
  });

  //export download button
  it(`export download button for business-overview`, async () => {
    await renderBusinessOverViewView();
    expect(screen.getByTestId("export-btn-business-overview")).toBeInTheDocument();
    act(() => {
      userEvent.click(screen.getByTestId("export-btn-business-overview"));
    })
  });

  //year dropdown
  it(`year selectable dropdown for business overview`, async () => {
    useSelectorMock.mockReturnValue({
      emissionDates: yearMockData,
      businessUnitOverviewDetailLoading: false,
    });
    await renderBusinessOverViewView();
    const dropdown = screen.getByLabelText("year-dropdown-business-overview");
    userEvent.click(dropdown);
    const option = await screen.findByText("2021");
    userEvent.click(option);
  });

  //quarter dropdown
  it(`quarter selectable dropdown for business-overview`, async () => {
    await renderBusinessOverViewView();
    expect(screen.getByLabelText("quarter-dropdown-business-overview")).toBeInTheDocument();
    userEvent.click(screen.getByLabelText("quarter-dropdown-business-overview"));
    userEvent.click(await screen.findByText("Q4"));
  });

  //Sustainable cards
  it(`sustainable cards test cases for business-Overview`, async () => {
    useSelectorMock.mockReturnValue({
      businessUnitOverviewDetailData: businessOverviewCardsMockData,
    });
    await renderBusinessOverViewView();
    expect(screen.getByTestId("card-1")).toBeInTheDocument();
    expect(screen.getByTestId("card-2")).toBeInTheDocument();
    expect(screen.getByTestId("card-3")).toBeInTheDocument();
  });

  //RPG graph toggle radio buttons
  it(`RPG graph toggle radio buttons for business Overview`, async () => {
    useSelectorMock.mockReturnValue({
      checkedEmissionsReductionGlide: ReductionOverviewEmissionsGraphMockData,
    });
    await renderBusinessOverViewView();
    const totalEmissionRadioToggle = screen.getByTestId(
      "total-emission-toggle"
    ) as HTMLInputElement;
    expect(totalEmissionRadioToggle).toBeInTheDocument();
    userEvent.click(totalEmissionRadioToggle);
    expect(totalEmissionRadioToggle.checked).toBe(true);
  });

  //RPG graph toggle radio buttons
  it(`RPG graph toggle radio buttons for business Overview`, async () => {
    useSelectorMock.mockReturnValue({
      checkedEmissionsReductionGlide: ReductionOverviewIntensityGraphMockData,
    });
    await renderBusinessOverViewView();
    const emissionRadioToggle = screen.getByTestId(
      "emission-intensity-toggle"
    ) as HTMLInputElement;
    expect(emissionRadioToggle).toBeInTheDocument();
    userEvent.click(emissionRadioToggle);
    expect(emissionRadioToggle.checked).toBe(true);
  });

  //Chart graph toggle radio buttons for carrier
  it(`Chart graph toggle radio buttons for carrier business Overview`, async () => {
    useSelectorMock.mockReturnValue({
      businessUnitOverviewDetailData: carrierTotalEmsissionGraphMockData,
    });
    await renderBusinessOverViewView();
    const totalCarrierEmissionRadioToggle = screen.getByTestId(
      "total-emission-carrier-toggle"
    ) as HTMLInputElement;
    expect(totalCarrierEmissionRadioToggle).toBeInTheDocument();
    userEvent.click(totalCarrierEmissionRadioToggle);
    expect(totalCarrierEmissionRadioToggle.checked).toBe(true);
  });

  //Chart graph toggle radio buttons for carrier
  it(`Chart graph toggle radio buttons for carrier business Overview`, async () => {
    useSelectorMock.mockReturnValue({
      businessUnitOverviewDetailData: carrierEmissionIntensityGraphMockData,
    });
    await renderBusinessOverViewView();
    const intensityRadioToggle = screen.getByTestId(
      "emission-intensity-carrier-toggle"
    ) as HTMLInputElement;
    expect(intensityRadioToggle).toBeInTheDocument();
    userEvent.click(intensityRadioToggle);
    expect(intensityRadioToggle.checked).toBe(true);
  });

  //Chart graph toggle radio buttons for lane
  it(`Chart graph toggle radio buttons for lane business Overview`, async () => {
    useSelectorMock.mockReturnValue({
      businessUnitOverviewDetailData: laneTotalEmissionGraphMockData,
    });
    await renderBusinessOverViewView();
    const totalLaneEmissionRadioToggle = screen.getByTestId(
      "total-emission-lane-toggle"
    ) as HTMLInputElement;
    expect(totalLaneEmissionRadioToggle).toBeInTheDocument();
    userEvent.click(totalLaneEmissionRadioToggle);
    expect(totalLaneEmissionRadioToggle.checked).toBe(true);
  });

  //Chart graph toggle radio buttons for lane
  it(`Chart graph toggle radio buttons for lanee business Overview`, async () => {

    await renderBusinessOverViewView();
    const intensityLaneRadioToggle = screen.getByTestId(
      "emission-intensity-lane-toggle"
    ) as HTMLInputElement;
    expect(intensityLaneRadioToggle).toBeInTheDocument();
    userEvent.click(intensityLaneRadioToggle);
    expect(intensityLaneRadioToggle.checked).toBe(true);
    useSelectorMock.mockReturnValue({
      businessUnitOverviewDetailData: laneEmissionIntensityGraphMockData,
    });
  });

  //Chart graph toggle radio buttons for carrier
  it(`Chart graph toggle radio buttons for region business Overview`, async () => {
    useSelectorMock.mockReturnValue({
      businessUnitOverviewDetailData: regionEmissionGraphMockData,
    });
    await renderBusinessOverViewView();
    const totalRegionEmissionRadioToggle = screen.getByTestId(
      "total-emission-region-toggle"
    ) as HTMLInputElement;
    expect(totalRegionEmissionRadioToggle).toBeInTheDocument();
    userEvent.click(totalRegionEmissionRadioToggle);
    expect(totalRegionEmissionRadioToggle.checked).toBe(true);
  });

  //Chart graph toggle radio buttons for carrier
  it(`Chart graph toggle radio buttons for region business Overview`, async () => {
    useSelectorMock.mockReturnValue({
      businessUnitOverviewDetailData: regionIntensityGraphMockData,
    });
    await renderBusinessOverViewView();
    const intensityRegionRadioToggle = screen.getByTestId(
      "emission-intensity-region-toggle"
    ) as HTMLInputElement;
    expect(intensityRegionRadioToggle).toBeInTheDocument();
    userEvent.click(intensityRegionRadioToggle);
    expect(intensityRegionRadioToggle.checked).toBe(true);
  });



})  