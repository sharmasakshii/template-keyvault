// Import necessary modules and components
import vendorService from "../../../../store/scopeThree/track/carrier/vendorService";
import {
  carrierDetailsReducer,
  getCarrierOverviewData,
  getLaneBreakdown,
} from "../../../../store/scopeThree/track/carrier/vendorSlice";
import { ApiTest, TestFullFilledSlice, TestSliceMethod } from "../../../../commonCase/ReduxCases";
import VendorOverviewView from "../../../../pages/carrier/carrierOverview/VendorOverviewView";
import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { authDataReducer } from "store/auth/authDataSlice";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as reactRedux from "react-redux";
import * as router from "react-router-dom";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { authMockData, yearMockData } from "mockData/commonMockData.json";
import userEvent from "@testing-library/user-event";
import { carrierEmissionIntensityOverViewGraphMockData, carrierOverViewCardsMockData, carrierOverviewTableGraphMockData, laneBreakDownMockData } from "mockData/carrierOverViewMockData.json";
// Payload for getting carrier overview data
import { nodeUrl } from "constant"
const carrierOverviewPayload = {
  id: "CTII",
};

const getLaneBreakdownPayload = {
    id: "FDEG"
}

// Configuration for fetching carrier overview data using Redux
const CarrierOverviewDataObject = {
  service: vendorService,
  serviceName: "getCarrierOverview",
  sliceName: "getCarrierOverviewData",
  sliceImport: getCarrierOverviewData,
  data: carrierOverviewPayload,
  reducerName: carrierDetailsReducer,
  loadingState: "carrierOverviewDetailLoading",
  isSuccess: "isSuccess",
  actualState: "carrierOverviewDetail",
};

// Configuration for API testing of fetching carrier overview data
const getCarrierOverviewApiTestData = {
  serviceName: "getCarrierOverview",
  method: "post",
  data: carrierOverviewPayload,
  serviceImport: vendorService,
  route: `${nodeUrl}get-carrier-overview`,
};

// Configuration for fetching Lane Breakdown using Redux
const getLaneBreakdownObject = {
  service: vendorService,
  serviceName: "getLaneBreakdown",
  sliceName: "getLaneBreakdown",
  sliceImport:getLaneBreakdown,
  data: getLaneBreakdownPayload,
  reducerName: carrierDetailsReducer,
  loadingState: "laneBreakdownDetailLoading",
  isSuccess: "isSuccess",
  actualState: "laneBreakdownDetail",
};

// Configuration for API testing of fetching Lane Breakdown data
const getLaneBreakdownApiTestData = {
  serviceName: "getLaneBreakdown",
  method: "post",
  data: getLaneBreakdownPayload,
  serviceImport: vendorService,
  route: `${nodeUrl}get-lane-breakdown`,
};


// Execute Redux slice tests for carrier overview data
TestFullFilledSlice({ data: [CarrierOverviewDataObject,getLaneBreakdownObject] });

// Execute API test for carrier overview data
ApiTest({ data: [getCarrierOverviewApiTestData,getLaneBreakdownApiTestData] });

TestSliceMethod({
  data: [CarrierOverviewDataObject,getLaneBreakdownObject],
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
        facilityOverview: carrierDetailsReducer?.reducer,
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

  const renderCarrierOverview = async () => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <VendorOverviewView/>
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };

   //section id.....
   it(`<section> test case for carrier overview page `, async () => {
    await renderCarrierOverview();
    expect(screen.getByTestId("carrier-overview-view")).toBeInTheDocument();
  });


   //back button
   it(`Back button to go back on carrier page`, async () => {
    await renderCarrierOverview();
    expect(screen.getByTestId("back-button-carrier")).toBeInTheDocument();
    userEvent.click(screen.getByTestId("back-button-carrier"));
  });

   //selectable carrier overview row for year
   it(`selectable dropdown test case for year`, async () => {
    useSelectorMock.mockReturnValue({
      emissionDates: yearMockData,
    });
    await renderCarrierOverview();
    expect(screen.getByLabelText("year-drop-down-carrierOverview")).toBeInTheDocument();
    userEvent.click(screen.getByLabelText("year-drop-down-carrierOverview"));
    const regionData = await screen.findByText("2021");
    userEvent.click(regionData);
  });

     //selectabl carrier overview row for quarter data
     it(`selectable dropdown test case for quarter`, async () => {
      await renderCarrierOverview();
      expect(screen.getByLabelText("quarter-drop-down-carrierOverview")).toBeInTheDocument();
      userEvent.click(screen.getByLabelText("quarter-drop-down-carrierOverview"));
      const regionData = await screen.findByText("Q1");
      userEvent.click(regionData);
    });

    //Sustainable cards for carrier Overview
  it(`sustainable cards test cases for carrierOverview`, async () => {
    useSelectorMock.mockReturnValue({
      carrierOverviewDetail: carrierOverViewCardsMockData,
    });
    await renderCarrierOverview();
    expect(screen.getByTestId("card-1")).toBeInTheDocument();
    expect(screen.getByTestId("card-2")).toBeInTheDocument();
    expect(screen.getByTestId("card-3")).toBeInTheDocument();
  });

    //highchart emission facility test cases
    it(`high chart emission intensity carrier overview data test case `, async () => {
      useSelectorMock.mockReturnValue({
        carrierOverviewDetail: {
          data: carrierEmissionIntensityOverViewGraphMockData,
        },
      });
  
      await renderCarrierOverview();
      // expect(
      //   screen.getByTestId("high-chart-carrier-overview-emission-intensity")
      // ).toBeInTheDocument();
    });

     //performance data headings
  it(`performance heading data for carrier overview`, async () => {
    await renderCarrierOverview();
    expect(screen.getByTestId("performance-data-heading")).toBeInTheDocument();
  });

  //loading
  it(`loading spinner for carrier overview`, async () => {
    useSelectorMock.mockReturnValue({
      isLoadingRegionCarrierTable: true,
    });
    await renderCarrierOverview();
    expect(screen.getByTestId("table-data-loading-carrier-overview")).toBeInTheDocument();
  });

  //navigate to other page carrier wise emission intensity
  it(`region wise emission intensity table graph data for facility`, async () => {
    useSelectorMock.mockReturnValue({
      isLoadingRegionCarrierTable: false,
      regionCarrierComparisonDataTable: {
        data: carrierOverviewTableGraphMockData,
      },
    });
    await renderCarrierOverview();
    expect(screen.getByTestId("table-graph-data-carrier-overview")).toBeInTheDocument();
    carrierOverviewTableGraphMockData?.forEach(async (ele: any, index:any) => {
      expect(screen.getByTestId(`table-row-data-carrier-overview${index}`)).toBeInTheDocument();
      fireEvent.click(screen.getByTestId(`table-row-data-carrier-overview${index}`));
      // expect(navigate).toHaveBeenCalledWith(
      //   `/region-overview/${ele?.regions?.name}/2023/${0}`
      // );
    });
  });

  // change order by clicking on table headings
  it(`arrow buttons in table heading for sorting for carrier overview`, async () => {
    useSelectorMock.mockReturnValue({
      isLoadingRegionCarrierTable: false,
      regionCarrierComparisonDataTable: {
        data: carrierOverviewTableGraphMockData,
      },
    });
    await renderCarrierOverview();
    expect(screen.getByTestId("change-order-intensity-carrier-overview")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("change-order-intensity-carrier-overview"));
    expect(screen.getByTestId("change-order-shipments-carrier-overview")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("change-order-shipments-carrier-overview"));
    expect(screen.getByTestId("change-order-emission-carrier-overview")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("change-order-emission-carrier-overview"));
  });

  //No Data found
  // it(`no data found for facility overview`, async () => {
  //   useSelectorMock.mockReturnValue({
  //     laneBreakdownDetail: {
  //       data: {
  //         responseData: {
  //           detractor: [],
  //         },
  //       },
  //     },
  //   });
  //   await renderCarrierOverview();
  //   expect(screen.getByTestId("no-data-found-carrier-overview")).toBeInTheDocument();
  // });

  //lane breakdown High/low Emissions Intensity Lanes table
  it(`High Emissions Intensity Lanes table tab`, async () => {
    useSelectorMock.mockReturnValue({
      laneBreakdownDetailLoading: false,
      laneBreakdownDetail: {
        data: laneBreakDownMockData
      },
    });
    await renderCarrierOverview();
    expect(screen.getByTestId("high-emission-table-data")).toBeInTheDocument();
    expect(screen.getByTestId("low-emission-tab-table")).toBeInTheDocument();
  })



});




