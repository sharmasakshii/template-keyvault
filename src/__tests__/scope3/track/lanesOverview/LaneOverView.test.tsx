import laneService from "../../../../store/scopeThree/track/lane/laneService";
import vendorService from "../../../../store/scopeThree/track/carrier/vendorService";
import {
  getLaneOverDetailsEmission,
  laneCarrierEmissionReductionGlide,
  laneDetailsReducer,
  laneReductionDetailGraph,
} from "../../../../store/scopeThree/track/lane/laneDetailsSlice";
import {
  carrierDetailsReducer,
  laneCarrierTableData,
} from "../../../../store/scopeThree/track/carrier/vendorSlice";
import {
  ApiTest,
  TestFullFilledSlice,
  TestSliceMethod,
} from "../../../../commonCase/ReduxCases";
import LaneOverview from "pages/lanesOverview/LaneOverview";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as router from "react-router-dom";

import * as reactRedux from "react-redux";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";

import { authDataReducer } from "store/auth/authDataSlice";
import { authMockData, yearMockData } from "mockData/commonMockData.json";
import { commonDataReducer } from "store/commonData/commonSlice";
import userEvent from "@testing-library/user-event";
import {
  emisionIntensityCarriertoggleMockData,
  laneOverviewEmissionRegionData,
  laneOverviewMockData,
  laneOverviewTotalEmissionData,
  mapMockData,
  mockNoData,
  totalemissionCarriertoggleMockData,
} from "mockData/lanesOverViewMockData.json";
import { nodeUrl } from "constant"

const getLaneReductionDetailGraphPayload = {
  lane_name: "GARYSBURG, NC_FINDLAY, OH",
  year: 2022,
  toggel_data: 0,
};

const getLaneOverDetailsEmissionPayload = {
  lane_name: "GARYSBURG, NC_FINDLAY, OH",
};

const laneCarrierTableDataApiPayload = {
  region_id: "",
  page: 1,
  lane_name: "GARYSBURG, NC_FINDLAY, OH",
  page_size: 20,
  order_by: "desc",
  col_name: "intensity",
  search_name: "",
};

const getLaneCarrierEmissionPayload = {
  page: 1,
  page_size: 20,
  facility_id: "",
  toggel_data: 1,
  lane_name: "GARYSBURG, NC_FINDLAY, OH",
};

const getLaneCarrierEmissionDataObject = {
  service: laneService,
  serviceName: "getLaneCarrierEmission",
  sliceName: "laneReductionDetailGraph",
  sliceImport: laneReductionDetailGraph,
  data: getLaneCarrierEmissionPayload,
  reducerName: laneDetailsReducer,
  loadingState: "laneReductionDetailGraphLoading",
  isSuccess: "isSuccess",
  actualState: "laneReductionDetailGraphData",
};

const getLaneCarrierEmissionApiTestData = {
  serviceName: "getLaneCarrierEmission",
  method: "post",
  data: getLaneCarrierEmissionPayload,
  serviceImport: laneService,
  route: `${nodeUrl}get-lane-carrier-graph`,
};

const laneCarrierTableDataApiDataObject = {
  service: vendorService,
  serviceName: "laneCarrierTableDataApi",
  sliceName: "laneCarrierTableData",
  sliceImport: laneCarrierTableData,
  data: laneCarrierTableDataApiPayload,
  reducerName: carrierDetailsReducer,
  loadingState: "laneCarrierTableDtoLoading",
  isSuccess: "isSuccess",
  actualState: "laneCarrierTableDto",
};

const laneCarrierTableDataApiTestData = {
  serviceName: "laneCarrierTableDataApi",
  method: "post",
  data: laneCarrierTableDataApiPayload,
  serviceImport: vendorService,
  route: `${nodeUrl}get-lane-carrier-table-data`,
};

const getLaneOverDetailsEmissionDataObject = {
  service: laneService,
  serviceName: "getLaneOverDetailsEmissionApi",
  sliceName: "getLaneOverDetailsEmission",
  sliceImport: getLaneOverDetailsEmission,
  data: getLaneOverDetailsEmissionPayload,
  reducerName: laneDetailsReducer,
  loadingState: "getLaneOverDetailsEmissionLoading",
  isSuccess: "isSuccess",
  actualState: "getLaneOverDetailsEmissionData",
};

const getLaneOverDetailsEmissionApiTestData = {
  serviceName: "getLaneOverDetailsEmissionApi",
  method: "post",
  data: getLaneOverDetailsEmissionPayload,
  serviceImport: laneService,
  route: `${nodeUrl}get-lane-overview-details`,
};

const getLaneReductionDetailGraphDataObject = {
  service: laneService,
  serviceName: "getLaneReductionDetailGraph",
  sliceName: "laneCarrierEmissionReductionGlide",
  sliceImport: laneCarrierEmissionReductionGlide,
  data: getLaneReductionDetailGraphPayload,
  reducerName: laneDetailsReducer,
  loadingState: "laneCarrierEmissionIsloading",
  isSuccess: "isSuccess",
  actualState: "laneCarrierEmission",
};

const getLaneReductionDetailGraphApiTestData = {
  serviceName: "getLaneReductionDetailGraph",
  method: "post",
  data: getLaneReductionDetailGraphPayload,
  serviceImport: laneService,
  route: `${nodeUrl}get-lane-reduction-graph`,
};

TestFullFilledSlice({
  data: [
    getLaneReductionDetailGraphDataObject,
    getLaneOverDetailsEmissionDataObject,
    laneCarrierTableDataApiDataObject,
    getLaneCarrierEmissionDataObject,
  ],
});

ApiTest({
  data: [
    getLaneReductionDetailGraphApiTestData,
    getLaneOverDetailsEmissionApiTestData,
    laneCarrierTableDataApiTestData,
    getLaneCarrierEmissionApiTestData,
  ],
});

TestSliceMethod({
  data: [
    getLaneReductionDetailGraphDataObject,
    getLaneOverDetailsEmissionDataObject,
    laneCarrierTableDataApiDataObject,
    getLaneCarrierEmissionDataObject,
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
        region: carrierDetailsReducer?.reducer,
        auth: authDataReducer.reducer,
        lane: laneDetailsReducer?.reducer,
        common: commonDataReducer.reducer,
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

  const renderLaneOverView = async () => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <LaneOverview />
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };

  //section id.....
  it(`<section> test case for whole page `, async () => {
    await renderLaneOverView();
    expect(screen.getByTestId("lanes-overview")).toBeInTheDocument();
  });

  //back button
  it(`back button to go back lane page`, async () => {
    await renderLaneOverView();
    expect(screen.getByTestId("back-btn")).toBeInTheDocument();
     act(() => {
    
       userEvent.click(screen.getByTestId("back-btn"));
    });
  });

  // selectable dropdown for year
  it(`year dropdown`, async () => {
    let auth = jest.spyOn(tem, "useAuth");
    auth.mockReturnValue(authMockData);
    useSelectorMock.mockReturnValue({
      emissionDates: yearMockData,
    });
    await renderLaneOverView();

    const dropdown = screen.getByLabelText("year-dropdown");
    userEvent.click(dropdown);
    const option = await screen.findByText("2021");
    userEvent.click(option);
  });

  // quarter drop down
  it(`Vendor table filters for quarter dropdown`, async () => {
    let auth = jest.spyOn(tem, "useAuth");
    auth.mockReturnValue(authMockData);
    await renderLaneOverView();
    expect(screen.getByLabelText("quarter-dropdown")).toBeInTheDocument();
    await act(async () => {
      userEvent.click(screen.getByLabelText("quarter-dropdown"));
    });
    const regionData = await screen.findByText("Q1");
    await act(async () => {
      userEvent.click(regionData);
    });
  });

  //Cards Test cases
  it(`manager overview details cards`, async () => {
    await renderLaneOverView();
    expect(screen.getByTestId("card-1")).toBeInTheDocument();
    expect(screen.getByTestId("card-2")).toBeInTheDocument();
    expect(screen.getByTestId("card-3")).toBeInTheDocument();
  });

  //total emission rpg graph
  it(`RPG graph data test case for total emission Region`, async () => {
    await renderLaneOverView();
    expect(screen.getByTestId("rpg-graph-lane-overview")).toBeInTheDocument();
    const totalEmissionRadioToggle = screen.getByTestId(
      "lane-overview-toggle-total-emission"
    ) as HTMLInputElement;
    expect(totalEmissionRadioToggle).toBeInTheDocument();
    expect(totalEmissionRadioToggle.checked).toBe(true);
    useSelectorMock.mockReturnValue({
      regionEmission: {
        data: laneOverviewTotalEmissionData,
      },
    });
  });

  //emission intensity rpg graph
  it(`RPG graph data test case for emission intensity Region`, async () => {
    await renderLaneOverView();

    expect(screen.getByTestId("rpg-graph-lane-overview")).toBeInTheDocument();
    const EmissionIntensityRadioToggle = screen.getByTestId(
      "lane-overview-toggle-intensity-emission"
    ) as HTMLInputElement;
    expect(EmissionIntensityRadioToggle).toBeInTheDocument();
    fireEvent.click(EmissionIntensityRadioToggle);
    expect(EmissionIntensityRadioToggle.checked).toBe(true);
    useSelectorMock.mockReturnValue({
      regionEmission: {
        data: laneOverviewEmissionRegionData,
      },
    });
  });

  //chart 2 carrier emissions total emission radio button
  it(`Carrier Emission graph data for total emission radio toggle`, async () => {
    await renderLaneOverView();

    expect(screen.getByTestId("lane-overview-data")).toBeInTheDocument();
    const EmissionTotalRadioToggle = screen.getByTestId(
      "lane-overview-carrier-toggle-total-emission"
    ) as HTMLInputElement;
    expect(EmissionTotalRadioToggle).toBeInTheDocument();
    fireEvent.click(EmissionTotalRadioToggle);
    expect(EmissionTotalRadioToggle.checked).toBe(true);
    useSelectorMock.mockReturnValue({
      laneReductionDetailGraphData: {
        data: totalemissionCarriertoggleMockData,
      },
    });
  });

  //chart 2 carrier emissions intensity radio button
  it(`Carrier Emission graph data for emission intensity radio toggle`, async () => {
    await renderLaneOverView();

    expect(screen.getByTestId("lane-overview-data")).toBeInTheDocument();
    const EmissionIntensityRadioToggle = screen.getByTestId(
      "lane-overview-carrier-toggle-emission-intensity"
    ) as HTMLInputElement;
    expect(EmissionIntensityRadioToggle).toBeInTheDocument();
    fireEvent.click(EmissionIntensityRadioToggle);
    expect(EmissionIntensityRadioToggle.checked).toBe(true);
    useSelectorMock.mockReturnValue({
      laneReductionDetailGraphData: {
        data: emisionIntensityCarriertoggleMockData,
      },
    });
  });

  //loading
  it(`loader for spinner`, async () => {
    useSelectorMock.mockReturnValue({
      laneCarrierTableDtoLoading: true,
    });
    await renderLaneOverView();
    expect(screen.getByTestId("loader spinner")).toBeInTheDocument();
  });

  //no data found
  it(`if no data available then it shows no data found`, async () => {
    useSelectorMock.mockReturnValue({
      laneCarrierTableDto: mockNoData,
    });
    await renderLaneOverView();
    expect(screen.getByTestId("no-data-found")).toBeInTheDocument();
  });

  //data found
  it(`Emission Table`, async () => {
    useSelectorMock.mockReturnValue({
      laneCarrierTableDto: laneOverviewMockData,
    });
    await renderLaneOverView();
    expect(screen.getByTestId("table-data-lane-overview")).toBeInTheDocument();
    expect(screen.getByTestId("table-data")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("table-data"));
    // expect(navigate).toHaveBeenCalledWith("/carrier-overview/FDEG");
  });

  //change sort order
  it(`change sort order`, async () => {
    useSelectorMock.mockReturnValue({
      laneCarrierTableDto: laneOverviewMockData,
    });
    await renderLaneOverView();
    expect(
      screen.getByTestId("carrier-name-change-sort-order")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("carrier-name-change-sort-order"));
    expect(
      screen.getByTestId("emission-intensity-change-sort-order")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("emission-intensity-change-sort-order"));
    expect(
      screen.getByTestId("total-shipments-change-sort-order")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("total-shipments-change-sort-order"));
    expect(
      screen.getByTestId("total-emission-change-sort-order")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("total-emission-change-sort-order"));
  });

  //pagination
  it(`pagination dropdown`, async () => {
    useSelectorMock.mockReturnValue({
      laneCarrierTableDto: laneOverviewMockData,
    });
    await renderLaneOverView();

    expect(screen.getByTestId("pagination")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("pagination"));
    expect(screen.getByLabelText("pagination-dropdown")).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByLabelText("pagination-dropdown"));
    });
  });

  //google maps
  it(`Google Maps`, async () => {
    useSelectorMock.mockReturnValue({
      getLaneOverDetailsEmissionData: mapMockData,
    });
    await renderLaneOverView();
    expect(screen.getByTestId("google-map-data")).toBeInTheDocument();
  });
});
