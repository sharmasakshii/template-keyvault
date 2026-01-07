// Import necessary modules and components
import laneService from "../../../../store/scopeThree/track/lane/laneService";
import regionService from "../../../../store/scopeThree/track/region/regionService";
import {
  getRegionOverviewDetail,
  laneDetailsReducer,
  laneGraphData,
  regionCarrierComparison,
} from "../../../../store/scopeThree/track/lane/laneDetailsSlice";
import {
  regionFacilityEmissions,
  regionOverviewReducer,
} from "../../../../store/scopeThree/track/region/regionOverviewSlice";
import {
  ApiTest,
  TestFullFilledSlice,
  TestSliceMethod,
} from "../../../../commonCase/ReduxCases";
import RegionOverview from "../../../../pages/regionOverview/RegionOverview";
import { authMockData, pepAuthMockData, regionMockdata, yearMockData , authPMockData} from "mockData/commonMockData.json";

import { act, cleanup, render, screen } from "@testing-library/react";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as router from "react-router-dom";

import * as reactRedux from "react-redux";
import { authDataReducer } from "store/auth/authDataSlice";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";

import userEvent from "@testing-library/user-event";
import {
  EmissionIntensityRoverviewMockData,
  businessEmissionRegionGraphMockData,
  businessGraphMockData,
  cardsMockData,
  carrierEmissionIntensityMockData,
  carrierTotalEmissionMockData,
  laneEmissionIntensityMockData,
  laneTotalEmissionMockData,
  profileMockData,
  regionFacilityEmissionMockData,
  regionFacilityTotalEmissionMockData,
  totalEmissionRoverviewMockData,
} from "mockData/regionOverviewMockdata.json";
import { businessUnitDataReducer } from "store/businessUnit/businessUnitSlice";
import { emissionRegionDetails, sustainableReducer } from "store/sustain/sustainSlice";
import sustainService from "store/sustain/sustainService";
import {  nodeUrl } from "constant"

// Payload for posting region level glide path data
const postRegionLevelGlidePathPayload = {
  region_id: 5,
  company_id: "",
  year: 2022,
  toggel_data: 0,
};

// Payload for fetching lane graph data
const laneGraphPayload = {
  page: 1,
  page_size: 10,
  region_id: 5,
  facility_id: "",
  toggel_data: 1,
};

// Payload for fetching region overview details
const getRegionOverviewDetailPayload = {
  region_id: 5,
  year: "",
  quarter: "",
};

// Payload for fetching region carrier comparison data
const regionCarrierComparisonPayload = {
  page: 1,
  page_size: 10,
  region_id: 5,
  facility_id: "",
  toggel_data: 1,
};

// Payload for fetching region facility emission data
const regionFacilityEmissionApiPayload = {
  region_id: 5,
  facility_id: "",
  toggel_data: 1,
};

// Configuration for fetching region facility emission data via Redux
const regionFacilityEmissionApiDataObject = {
  service: regionService,
  serviceName: "regionFacilityEmissionApi",
  sliceName: "regionFacilityEmissions",
  sliceImport: regionFacilityEmissions,
  data: regionFacilityEmissionApiPayload,
  reducerName: regionOverviewReducer,
  loadingState: "regionFacilityEmissionIsLoading",
  isSuccess: "isSuccess",
  actualState: "regionFacilityEmissionDto",
};

// Configuration for API testing of fetching region facility emission data
const regionFacilityEmissionApiTestData = {
  serviceName: "regionFacilityEmissionApi",
  method: "post",
  data: regionFacilityEmissionApiPayload,
  serviceImport: regionService,
  route: `${nodeUrl}get-facilities-emission-data`,
};

// Configuration for fetching region carrier comparison data via Redux
const regionCarrierComparisonDataObject = {
  service: laneService,
  serviceName: "regionCarrierComparison",
  sliceName: "regionCarrierComparison",
  sliceImport: regionCarrierComparison,
  data: regionCarrierComparisonPayload,
  reducerName: laneDetailsReducer,
  loadingState: "regionCarrierComparisonLoading",
  isSuccess: "isSuccess",
  actualState: "regionCarrierComparisonData",
};

// Configuration for API testing of fetching region carrier comparison data
const regionCarrierComparisonApiTestData = {
  serviceName: "regionCarrierComparison",
  method: "post",
  data: regionCarrierComparisonPayload,
  serviceImport: laneService,
  route: `${nodeUrl}get-region-carrier-comparison-data`,
};

// Configuration for fetching region overview details via Redux
const getRegionOverviewDetailDataObject = {
  service: laneService,
  serviceName: "getRegionOverviewDetail",
  sliceName: "getRegionOverviewDetail",
  sliceImport: getRegionOverviewDetail,
  data: getRegionOverviewDetailPayload,
  reducerName: laneDetailsReducer,
  loadingState: "getRegionOverviewDetailLoading",
  isSuccess: "isSuccess",
  actualState: "getRegionOverviewDetailData",
};

// Configuration for API testing of fetching region overview details
const getRegionOverviewDetailApiTestData = {
  serviceName: "getRegionOverviewDetail",
  method: "post",
  data: getRegionOverviewDetailPayload,
  serviceImport: laneService,
  route: `${nodeUrl}get-region-overview-detail`,
};

// Configuration for fetching lane graph data via Redux
const laneGraphDataObject = {
  service: laneService,
  serviceName: "laneGraphData",
  sliceName: "laneGraphData",
  sliceImport: laneGraphData,
  data: laneGraphPayload,
  reducerName: laneDetailsReducer,
  loadingState: "laneGraphDetailsLoading",
  isSuccess: "isSuccess",
  actualState: "laneGraphDetails",
};

// Configuration for API testing of fetching lane graph data
const laneGraphApiTestData = {
  serviceName: "laneGraphData",
  method: "post",
  data: laneGraphPayload,
  serviceImport: laneService,
  route: `${nodeUrl}get-lane-emission`,
};

// Configuration for posting region level glide path data via Redux
const postRegionLevelGlidePathDataObject = {
  service: sustainService,
  serviceName: "getRegionEmission",
  sliceName: "emissionRegionDetails",
  sliceImport: emissionRegionDetails,
  data: postRegionLevelGlidePathPayload,
  reducerName: sustainableReducer,
  loadingState: "regionEmissionIsLoading",
  isSuccess: "isSuccess",
  actualState: "regionEmission",
};

// Configuration for API testing of posting region-level glide path data
const postRegionLevelGlidePathApiTestData = {
  serviceName: "getRegionEmission",
  method: "post",
  data: postRegionLevelGlidePathPayload,
  serviceImport: sustainService,
  route: `${nodeUrl}get-region-emission-reduction`,
};

// Execute Redux slice tests for various data
TestFullFilledSlice({
  data: [
    postRegionLevelGlidePathDataObject,
    laneGraphDataObject,
    getRegionOverviewDetailDataObject,
    regionCarrierComparisonDataObject,
    regionFacilityEmissionApiDataObject,
  ],
});

// Execute API tests for various data
ApiTest({
  data: [
    postRegionLevelGlidePathApiTestData,
    laneGraphApiTestData,
    getRegionOverviewDetailApiTestData,
    regionCarrierComparisonApiTestData,
    regionFacilityEmissionApiTestData,
  ],
});

TestSliceMethod({
  data: [
    postRegionLevelGlidePathDataObject,
    laneGraphDataObject,
    getRegionOverviewDetailDataObject,
    regionCarrierComparisonDataObject,
    regionFacilityEmissionApiDataObject,
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
        regionOverview: regionOverviewReducer?.reducer,
        auth: authDataReducer.reducer,
        lane: laneDetailsReducer?.reducer,
        businessUnit: businessUnitDataReducer?.reducer,
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
    useSelectorMock.mockReturnValue({
      regions: {
        data: regionMockdata,
      },
    });
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

  const renderRegionalOverview = async () => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <RegionOverview />
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };

  //section id.....
  it(`<section> test case for whole page `, async () => {
    await renderRegionalOverview();
    expect(screen.getByTestId("region-overview")).toBeInTheDocument();
  });

  //back button
  it(`Back button to go back on region page`, async () => {
    await renderRegionalOverview();
    expect(screen.getByTestId("back-button")).toBeInTheDocument();
    userEvent.click(screen.getByTestId("back-button"));

   
  });

  //selectable row for year
  it(`selectable dropdown test case for year`, async () => {
    useSelectorMock.mockReturnValue({
      emissionDates: yearMockData,
    });
    await renderRegionalOverview();
    expect(screen.getByLabelText("year-drop-down")).toBeInTheDocument();
    userEvent.click(screen.getByLabelText("year-drop-down"));
    const regionData = await screen.findByText("2021");
    userEvent.click(regionData);
    expect(screen.getByText("2021")).toBeInTheDocument();
  });

  //selectable row for quarter data
  it(`selectable dropdown test case for quarter`, async () => {
    await renderRegionalOverview();
    expect(screen.getByLabelText("quarter-drop-down")).toBeInTheDocument();
    userEvent.click(screen.getByLabelText("quarter-drop-down"));
    const regionData = await screen.findByText("Q1");
    userEvent.click(regionData);
  });

  //Sustainable cards
  it(`sustainable cards test cases`, async () => {
    useSelectorMock.mockReturnValue({
      userProfile: {
        data: {
          profileMockData,
        },
      },
      getRegionOverviewDetailData: cardsMockData,
    });
    await renderRegionalOverview();
    expect(screen.getByTestId("card-1")).toBeInTheDocument();
    expect(screen.getByTestId("card-2")).toBeInTheDocument();
    expect(screen.getByTestId("card-3")).toBeInTheDocument();
  });

  //RPG graph toggle radio buttons
  it(`RPG graph toggle radio buttons`, async () => {
    useSelectorMock.mockReturnValue({
      regionEmission: totalEmissionRoverviewMockData,
    });
    await renderRegionalOverview();
    const totalEmissionRadioToggle: HTMLInputElement = screen.getByTestId("total-emission-toggle");
    expect(totalEmissionRadioToggle).toBeInTheDocument();
    userEvent.click(totalEmissionRadioToggle);
    expect(totalEmissionRadioToggle.checked).toBe(true);
  });

  //RPG graph toggle radio buttons
  it(`RPG graph toggle radio buttons`, async () => {
    useSelectorMock.mockReturnValue({
      regionEmission: EmissionIntensityRoverviewMockData,
    });
    await renderRegionalOverview();
    const emissionRadioToggle: HTMLInputElement = screen.getByTestId(
      "emission-intensity-toggle"
    );
    expect(emissionRadioToggle).toBeInTheDocument();
    userEvent.click(emissionRadioToggle);
    expect(emissionRadioToggle.checked).toBe(true);
  });

  //chart carrier emissions
  it(`Carrier emissions charts and radio button for total emission`, async () => {
    useSelectorMock.mockReturnValue({
      regionCarrierComparisonData: carrierTotalEmissionMockData,
    });
    await renderRegionalOverview();
    const totalEmissionToggle: HTMLInputElement = screen.getByTestId(
      "region-overview-total-emission"
    );
    expect(totalEmissionToggle).toBeInTheDocument();
    userEvent.click(totalEmissionToggle);
    expect(totalEmissionToggle.checked).toBe(true);
  });

  //chart carrier emissions
  it(`Carrier emissions charts and radio button for emission intensity`, async () => {
    useSelectorMock.mockReturnValue({
      regionCarrierComparisonData: carrierEmissionIntensityMockData,
    });
    await renderRegionalOverview();
    const IntensityEmissionToggle: HTMLInputElement = screen.getByTestId(
      "region-overview-region-emission"
    );
    expect(IntensityEmissionToggle).toBeInTheDocument();
    userEvent.click(IntensityEmissionToggle);
    expect(IntensityEmissionToggle.checked).toBe(true);
  });

  //chart Lane emissions
  it(`Lane emissions charts and radio button for total emission `, async () => {
    useSelectorMock.mockReturnValue({
      laneGraphDetails: laneTotalEmissionMockData,
    });
    await renderRegionalOverview();
    const totalLaneEmissionToggle: HTMLInputElement = screen.getByTestId(
      "region-overview-total-emission-lane"
    );
    expect(totalLaneEmissionToggle).toBeInTheDocument();
    userEvent.click(totalLaneEmissionToggle);
    expect(totalLaneEmissionToggle.checked).toBe(true);
  });

  //chart Lane emissions
  it(`Lane emissions charts and radio button for  emission intensity `, async () => {
    useSelectorMock.mockReturnValue({
      laneGraphDetails: laneEmissionIntensityMockData,
    });
    await renderRegionalOverview();
    const intensityLaneEmissionToggle: HTMLInputElement = screen.getByTestId(
      "region-overview-intensity-emission-lane"
    );
    expect(intensityLaneEmissionToggle).toBeInTheDocument();
    userEvent.click(intensityLaneEmissionToggle);
    expect(intensityLaneEmissionToggle.checked).toBe(true);
  });

  //chart business graph in pepsico
  it(`Business Unit emission charts and radio button for  total emission `, async () => {
    useSelectorMock.mockReturnValue({
      businessUnitGraphDetails: businessGraphMockData,
      loginDetails:{data:pepAuthMockData?.userdata}
    });
    await renderRegionalOverview();
    const businessTotalEmissionToggle: HTMLInputElement = screen.getByTestId("region-overview-total-emission-business");
    
    expect(businessTotalEmissionToggle).toBeInTheDocument();
    userEvent.click(businessTotalEmissionToggle);
    expect(businessTotalEmissionToggle.checked).toBe(true);
  });

  //chart business graph in pepsico
  it(`Business Unit emission charts and radio button for emission intensity`, async () => {

    useSelectorMock.mockReturnValue({
      businessUnitGraphDetails: businessEmissionRegionGraphMockData,
      loginDetails:{data:pepAuthMockData?.userdata}
    });
    await renderRegionalOverview();
    const businessIntensityEmissionToggle: HTMLInputElement = screen.getByTestId(
      "region-overview-intensity-emission-business"
    );
    expect(businessIntensityEmissionToggle).toBeInTheDocument();
    userEvent.click(businessIntensityEmissionToggle);
    expect(businessIntensityEmissionToggle.checked).toBe(true);
  });

  //chart facility graph
  it(`Facility Emission charts and radio button for emission intensity`, async () => {
    useSelectorMock.mockReturnValue({
      regionFacilityEmissionDto: regionFacilityEmissionMockData,
      loginDetails:{data:authPMockData?.userdata}
    });
    await renderRegionalOverview();
    const faclityIntensityEmissionToggle: HTMLInputElement = screen.getByTestId(
      "region-overview-intensity-emission-facility"
    );
    expect(faclityIntensityEmissionToggle).toBeInTheDocument();
    userEvent.click(faclityIntensityEmissionToggle);
    expect(faclityIntensityEmissionToggle.checked).toBe(true);
  });

  //chart facility graph
  it(`Facility Emission charts and radio button for total emission `, async () => {
    useSelectorMock.mockReturnValue({
      regionFacilityEmissionDto: regionFacilityTotalEmissionMockData,
      loginDetails:{data:authPMockData?.userdata}
    });
    await renderRegionalOverview();
    const faclityTotalEmissionToggle: HTMLInputElement= screen.getByTestId(
      "region-overview-total-emission-facility"
    );
    expect(faclityTotalEmissionToggle).toBeInTheDocument();
    userEvent.click(faclityTotalEmissionToggle);
    expect(faclityTotalEmissionToggle.checked).toBe(true);
  });
});
