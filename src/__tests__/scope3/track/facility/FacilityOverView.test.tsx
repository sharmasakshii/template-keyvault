// Import necessary modules and components
import facilityOverviewService from "../../../../store/scopeThree/track/facilityOverview/facilityOverviewService";
import { facilityCarrierComparison, resetFacilityOverview, initialState, facilityComparisonGraph, facilityGraphDetailsGraph, facilityInBoundGraph, facilityOutBoundGraph, facilityOverviewDataReducer, facilityOverviewDetail, facilityReductionGraph } from "../../../../store/scopeThree/track/facilityOverview/facilityOverviewDataSlice";
import { ApiTest, TestFullFilledSlice, TestSliceMethod } from "../../../../commonCase/ReduxCases";
import FacilityOverviewView from "../../../../pages/facilityOverview/FacilityOverviewView";
import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { authDataReducer } from "store/auth/authDataSlice";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as reactRedux from "react-redux";
import * as router from "react-router-dom";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { authMockData, yearMockData } from "mockData/commonMockData.json";
import userEvent from "@testing-library/user-event";
import { cardsFacilityOverviewMockData, facilityCarrierEmissionMockData, facilityCarrierIntensityMockData, facilityLaneEmissionIntensityMockdata, facilityLaneEmissionMockdata, facilityOverviewIntensityMockData, facilityOverviewTotalEmissionMockData, fcailityOverviewInboundfreightEmissionIntensity, fcailityOverviewInboundfreightTotalEmission, fcailityOverviewOutBoundboundfreightEmissionIntensity, fcailityOverviewOutBoundboundfreightTotalEmission, overviewFacilityEmissionIntensityChart } from "mockData/facilityOverviewMockData.json";
// Payload for getting facility reduction graph data
import {  nodeUrl } from "constant"
const facilityReductionGraphPayload = {
  facility_id: "3",
  company_id: "",
  year: 2022,
  toggel_data: 0,
};

// Configuration for fetching facility reduction graph data using Redux
const facilityReductionGraphDataObject = {
  service: facilityOverviewService,
  serviceName: "facilityReductionGraphPost",
  sliceName: "facilityReductionGraph",
  sliceImport: facilityReductionGraph,
  data: facilityReductionGraphPayload,
  reducerName: facilityOverviewDataReducer,
  loadingState: "facilityReductionGraphLoading",
  isSuccess: "isSuccess",
  actualState: "facilityReductionGraphDto",
};

// Configuration for API testing of fetching facility reduction graph data
const facilityReductionGraphApiTestData = {
  serviceName: "facilityReductionGraphPost",
  method: "post",
  data: facilityReductionGraphPayload,
  serviceImport: facilityOverviewService,
  route: `${nodeUrl}get-facilities-reduction-graph`,
};

// Payload for getting facility overview detail data
const facilityOverviewDetailPayload = {
  facility_id: "3",
  company_id: "",
};

// Configuration for fetching facility overview detail data using Redux
const facilityOverviewDetailDataObject = {
  service: facilityOverviewService,
  serviceName: "facilityOverviewDetailPost",
  sliceName: "facilityOverviewDetail",
  sliceImport: facilityOverviewDetail,
  data: facilityOverviewDetailPayload,
  reducerName: facilityOverviewDataReducer,
  loadingState: "facilityOverviewDetailLoading",
  isSuccess: "isSuccess",
  actualState: "facilityOverviewDetailDto",
};

// Configuration for API testing of fetching facility overview detail data
const facilityOverviewDetailApiTestData = {
  serviceName: "facilityOverviewDetailPost",
  method: "post",
  data: facilityOverviewDetailPayload,
  serviceImport: facilityOverviewService,
  route: `${nodeUrl}get-facilities-overview-detail`,
};

// Payload for getting facility comparison graph data
const facilityComparisonGraphPayload = {
  facility_id: "3",
  company_id: "",
};

// Configuration for fetching facility comparison graph data using Redux
const facilityComparisonGraphDataObject = {
  service: facilityOverviewService,
  serviceName: "facilityComparisonGraphGet",
  sliceName: "facilityComparisonGraph",
  sliceImport: facilityComparisonGraph,
  data: facilityComparisonGraphPayload,
  reducerName: facilityOverviewDataReducer,
  loadingState: "facilityComparisonGraphLoading",
  isSuccess: "isSuccess",
  actualState: "facilityComparisonGraphDto",
};

// Configuration for API testing of fetching facility comparison graph data
const facilityComparisonGraphApiTestData = {
  serviceName: "facilityComparisonGraphGet",
  method: "post",
  data: facilityComparisonGraphPayload,
  serviceImport: facilityOverviewService,
  route: `${nodeUrl}get-facilities-comparison`,
};

// Payload for posting facility inbound data
const facilityInBoundPostPayload = {
  facility_id: "3",
  company_id: "",
  toggel_data: 1,
};

// Configuration for posting facility inbound data using Redux
const facilityInBoundDataObject = {
  service: facilityOverviewService,
  serviceName: "facilityInBoundPost",
  sliceName: "facilityInBoundGraph",
  sliceImport: facilityInBoundGraph,
  data: facilityInBoundPostPayload,
  reducerName: facilityOverviewDataReducer,
  loadingState: "facilityInBoundLoading",
  isSuccess: "isSuccess",
  actualState: "facilityInBoundDto",
};

// Configuration for API testing of posting facility inbound data
const facilityInBoundApiTestData = {
  serviceName: "facilityInBoundPost",
  method: "post",
  data: facilityInBoundPostPayload,
  serviceImport: facilityOverviewService,
  route: `${nodeUrl}get-facilities-inbound-lane-graph`,
};

// Payload for posting facility outbound data
const facilityOutBoundPostPayload = {
  facility_id: "3",
  company_id: "",
  toggel_data: 1,
};

// Configuration for posting facility outbound data using Redux
const facilityOutBoundDataObject = {
  service: facilityOverviewService,
  serviceName: "facilityOutBoundPost",
  sliceName: "facilityOutBoundGraph",
  sliceImport: facilityOutBoundGraph,
  data: facilityOutBoundPostPayload,
  reducerName: facilityOverviewDataReducer,
  loadingState: "facilityOutBoundLoading",
  isSuccess: "isSuccess",
  actualState: "facilityOutBoundDto",
};

// Configuration for API testing of posting facility outbound data
const facilityOutBoundApiTestData = {
  serviceName: "facilityOutBoundPost",
  method: "post",
  data: facilityOutBoundPostPayload,
  serviceImport: facilityOverviewService,
  route: `${nodeUrl}get-facilities-outbound-lane-graph`,
};


// Payload for getting facility reduction graph data
const facilityCarrierComparisonPayload = {
  company_id: "",
  facility_id: "13",
  toggel_data: 0,
  year: 2022
};

// Configuration for fetching facility reduction graph data using Redux
const facilityCarrierComparisonObject = {
  service: facilityOverviewService,
  serviceName: "facilityCarrierComparisonPost",
  sliceName: "facilityCarrierComparison",
  sliceImport: facilityCarrierComparison,
  data: facilityCarrierComparisonPayload,
  reducerName: facilityOverviewDataReducer,
  loadingState: "facilityCarrierComparisonloading",
  isSuccess: "isSuccess",
  actualState: "facilityCarrierComparisonData",
};

// Configuration for API testing of fetching facility reduction graph data
const facilityCarrierComparisonApiTest = {
  serviceName: "facilityCarrierComparisonPost",
  method: "post",
  data: facilityCarrierComparisonPayload,
  serviceImport: facilityOverviewService,
  route: `${nodeUrl}get-facilities-carrier-graph`,
};


// Configuration for fetching facility graph details data using Redux
const facilityGraphDetailsGraphObject = {
  service: facilityOverviewService,
  serviceName: "facilityGraphDetailsGraphPost",
  sliceName: "facilityGraphDetailsGraph",
  sliceImport: facilityGraphDetailsGraph,
  data: facilityInBoundPostPayload,
  reducerName: facilityOverviewDataReducer,
  loadingState: "facilityGraphDetailsLoading",
  isSuccess: "isSuccess",
  actualState: "facilityGraphDetailsDto",
};

// Configuration for API testing of fetching facility reduction graph data
const facilityGraphDetailsGraphApiTest = {
  serviceName: "facilityGraphDetailsGraphPost",
  method: "post",
  data: facilityInBoundPostPayload,
  serviceImport: facilityOverviewService,
  route: `${nodeUrl}get-facilities-lane-graph`,
};



// Execute Redux slice tests for facility data
TestFullFilledSlice({
  data: [
    facilityReductionGraphDataObject,
    facilityOverviewDetailDataObject,
    facilityComparisonGraphDataObject,
    facilityInBoundDataObject,
    facilityOutBoundDataObject,
    facilityCarrierComparisonObject,
    facilityGraphDetailsGraphObject
  ],
});

// Execute API tests for facility data
ApiTest({
  data: [
    facilityReductionGraphApiTestData,
    facilityOverviewDetailApiTestData,
    facilityInBoundApiTestData,
    facilityComparisonGraphApiTestData,
    facilityOutBoundApiTestData,
    facilityCarrierComparisonApiTest,
    facilityGraphDetailsGraphApiTest
  ],
});

TestSliceMethod({
  data: [
    facilityReductionGraphDataObject,
    facilityOverviewDetailDataObject,
    facilityComparisonGraphDataObject,
    facilityInBoundDataObject,
    facilityOutBoundDataObject,
    facilityCarrierComparisonObject,
    facilityGraphDetailsGraphObject],
});

// Test case initialState
describe('initial reducer', () => {
  it('should reset state to initialState when resetScopeOneCommonData is called', () => {
    const modifiedState: any = {
      data: [{ id: 1, value: 'test' }],
      loading: true,
      error: 'Something went wrong',
    };

    const result = facilityOverviewDataReducer.reducer(modifiedState, resetFacilityOverview());

    expect(result).toEqual(initialState);
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

describe("test lane view ", () => {
  let useDispatchMock: jest.Mock;
  let useSelectorMock: jest.Mock;
  let stores: EnhancedStore;
  const navigate = jest.fn();
  beforeEach(() => {
    stores = configureStore({
      reducer: {
        facilityOverview: facilityOverviewDataReducer?.reducer,
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

  const renderFacilityOverview = async () => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <FacilityOverviewView />
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };

  //section id.....
  it(`<section> test case for whole page `, async () => {
    await renderFacilityOverview();
    expect(screen.getByTestId("facility-overview")).toBeInTheDocument();
  });

  //back button
  it(`Back button to go back on facility page`, async () => {
    await renderFacilityOverview();
    expect(screen.getByTestId("back-button-facility")).toBeInTheDocument();
    userEvent.click(screen.getByTestId("back-button-facility"));
  });

  //selectable row for year
  it(`selectable dropdown test case for year`, async () => {
    useSelectorMock.mockReturnValue({
      emissionDates: yearMockData,
    });
    await renderFacilityOverview();
    expect(screen.getByLabelText("year-drop-down-facilityOverview")).toBeInTheDocument();
    userEvent.click(screen.getByLabelText("year-drop-down-facilityOverview"));
    const regionData = await screen.findByText("2021");
    userEvent.click(regionData);
  });

  //selectable row for quarter data
  it(`selectable dropdown test case for quarter`, async () => {
    await renderFacilityOverview();
    expect(screen.getByLabelText("quarter-drop-down-facilityOverview")).toBeInTheDocument();
    userEvent.click(screen.getByLabelText("quarter-drop-down-facilityOverview"));
    const regionData = await screen.findByText("Q1");
    userEvent.click(regionData);
  });

  //Sustainable cards
  it(`sustainable cards test cases for facilityOverview`, async () => {
    useSelectorMock.mockReturnValue({
      facilityOverviewDetailDto: cardsFacilityOverviewMockData,
    });
    await renderFacilityOverview();
    expect(screen.getByTestId("card-1")).toBeInTheDocument();
    expect(screen.getByTestId("card-2")).toBeInTheDocument();
    expect(screen.getByTestId("card-3")).toBeInTheDocument();
  });

  //RPG graph toggle radio buttons
  it(`RPG graph toggle radio buttons for facilityOverview`, async () => {
    useSelectorMock.mockReturnValue({
      facilityReductionGraphDto: facilityOverviewTotalEmissionMockData,
    });
    await renderFacilityOverview();
    const totalEmissionRadioToggle = screen.getByTestId(
      "total-emission-toggle"
    ) as HTMLInputElement;
    expect(totalEmissionRadioToggle).toBeInTheDocument();
    userEvent.click(totalEmissionRadioToggle);
    expect(totalEmissionRadioToggle.checked).toBe(true);
  });

  //RPG graph toggle radio buttons
  it(`RPG graph toggle radio buttons for facilityOverview`, async () => {
    useSelectorMock.mockReturnValue({
      facilityReductionGraphDto: facilityOverviewIntensityMockData,
    });
    await renderFacilityOverview();
    const emissionRadioToggle = screen.getByTestId(
      "emission-intensity-toggle"
    ) as HTMLInputElement;
    expect(emissionRadioToggle).toBeInTheDocument();
    userEvent.click(emissionRadioToggle);
    expect(emissionRadioToggle.checked).toBe(true);
  });

  //highchart emission facility test cases
  it(`high chart emission intensity data test case `, async () => {
    useSelectorMock.mockReturnValue({
      facilityComparisonGraphDto: {
        data: overviewFacilityEmissionIntensityChart,
      },
    });

    await renderFacilityOverview();
    expect(
      screen.getByTestId("high-chart-emission-intensity")
    ).toBeInTheDocument();
  });


  //chart InBound Freight Emissions
  it(`InBound Freight Emissions charts and radio button for total emission`, async () => {
    await renderFacilityOverview();
    fireEvent.click(screen.getByTestId('Show InBound and OutBound Graphs'));

    useSelectorMock.mockReturnValue({
      facilityOverviewDetailDto: {
        data: fcailityOverviewInboundfreightTotalEmission
      }
    });
    await renderFacilityOverview();
    const totalEmissionToggle = screen.getByTestId(
      "facility-overview-total-emission"
    ) as HTMLInputElement;
    expect(totalEmissionToggle).toBeInTheDocument();
    userEvent.click(totalEmissionToggle);
    expect(totalEmissionToggle.checked).toBe(true);
  });

  //chart InBound Freight Emissions
  it(`InBound Freight Emissions charts and radio button for emission intensity`, async () => {
    await renderFacilityOverview();
    fireEvent.click(screen.getByTestId('Show InBound and OutBound Graphs'));
    useSelectorMock.mockReturnValue({
      facilityOverviewDetailDto: fcailityOverviewInboundfreightEmissionIntensity,
    });
    await renderFacilityOverview();
    const IntensityEmissionToggle = screen.getByTestId(
      "facility-overview-region-emission"
    ) as HTMLInputElement;
    expect(IntensityEmissionToggle).toBeInTheDocument();
    userEvent.click(IntensityEmissionToggle);
    expect(IntensityEmissionToggle.checked).toBe(true);
  });

  //chart OutBound Freight Emissions
  it(`OutBound Freight Emissions charts and radio button for total emission`, async () => {
    await renderFacilityOverview();
    fireEvent.click(screen.getByTestId('Show InBound and OutBound Graphs'));

    useSelectorMock.mockReturnValue({
      facilityOverviewDetailDto: {
        data: fcailityOverviewOutBoundboundfreightTotalEmission
      }
    });
    await renderFacilityOverview();
    const totalEmissionInboundToggle = screen.getByTestId(
      "facility-overview-OutBound-total-emission"
    ) as HTMLInputElement;
    expect(totalEmissionInboundToggle).toBeInTheDocument();
    userEvent.click(totalEmissionInboundToggle);
    expect(totalEmissionInboundToggle.checked).toBe(true);
  });

  //chart OutBound Freight Emissions
  it(`OutBound Freight Emissions charts and radio button for emission intensity`, async () => {
    await renderFacilityOverview();
    fireEvent.click(screen.getByTestId('Show InBound and OutBound Graphs'));
    useSelectorMock.mockReturnValue({
      facilityOverviewDetailDto: fcailityOverviewOutBoundboundfreightEmissionIntensity,
    });
    await renderFacilityOverview();
    const IntensityEmissionOutBoundToggle = screen.getByTestId(
      "facility-overview-OutBound-region-emission"
    ) as HTMLInputElement;
    expect(IntensityEmissionOutBoundToggle).toBeInTheDocument();
    userEvent.click(IntensityEmissionOutBoundToggle);
    expect(IntensityEmissionOutBoundToggle.checked).toBe(true);
  });


  //show emission graphs for carrier emission
  it(`/show emission graphs for carrier emission`, async () => {
    await renderFacilityOverview();
    fireEvent.click(screen.getByTestId('Show-Emission-Graph'));

    useSelectorMock.mockReturnValue({
      facilityOverviewDetailDto: {
        data: facilityCarrierEmissionMockData
      }
    });
    await renderFacilityOverview();
    const totalEmissionCarrierToggle = screen.getByTestId(
      "facility-carrier-total-emission"
    ) as HTMLInputElement;
    expect(totalEmissionCarrierToggle).toBeInTheDocument();
    userEvent.click(totalEmissionCarrierToggle);
    expect(totalEmissionCarrierToggle.checked).toBe(true);
  });

  //show emission intensity graphs for carrier emission
  it(`show emission intensity graphs for carrier emission`, async () => {
    await renderFacilityOverview();
    fireEvent.click(screen.getByTestId('Show-Emission-Graph'));

    useSelectorMock.mockReturnValue({
      facilityOverviewDetailDto: {
        data: facilityCarrierIntensityMockData
      }
    });
    await renderFacilityOverview();
    const totalEmissionCarrierToggle = screen.getByTestId(
      "facility-carrier-emission-intensity"
    ) as HTMLInputElement;
    expect(totalEmissionCarrierToggle).toBeInTheDocument();
    userEvent.click(totalEmissionCarrierToggle);
    expect(totalEmissionCarrierToggle.checked).toBe(true);
  });

  //show emission graphs for lane emission
  it(`/show emission graphs for lane emission`, async () => {
    await renderFacilityOverview();
    fireEvent.click(screen.getByTestId('Show-Emission-Graph'));

    useSelectorMock.mockReturnValue({
      facilityOverviewDetailDto: {
        data: facilityLaneEmissionMockdata
      }
    });
    await renderFacilityOverview();
    const totalEmissionLaneToggle = screen.getByTestId(
      "facility-lane-total-emission"
    ) as HTMLInputElement;
    expect(totalEmissionLaneToggle).toBeInTheDocument();
    userEvent.click(totalEmissionLaneToggle);
    expect(totalEmissionLaneToggle.checked).toBe(true);
  });

  //show emission graphs for lane emission
  it(`/show emission graphs for lane emission`, async () => {
    await renderFacilityOverview();
    fireEvent.click(screen.getByTestId('Show-Emission-Graph'));

    useSelectorMock.mockReturnValue({
      facilityOverviewDetailDto: {
        data: facilityLaneEmissionIntensityMockdata
      }
    });
    await renderFacilityOverview();
    const totalEmissionIntensityLaneToggle = screen.getByTestId(
      "facility-lane-total-emission-intensity"
    ) as HTMLInputElement;
    expect(totalEmissionIntensityLaneToggle).toBeInTheDocument();
    userEvent.click(totalEmissionIntensityLaneToggle);
    expect(totalEmissionIntensityLaneToggle.checked).toBe(true);
  });




});

