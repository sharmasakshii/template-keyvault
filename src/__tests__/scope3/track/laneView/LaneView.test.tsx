import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as reactRedux from "react-redux";
import * as router from "react-router-dom";
import LaneView from "pages/lanes/LaneView";
import { authMockData, regionMockdata, yearMockData, divisionMockdata } from "mockData/commonMockData.json";
import { commonDataReducer } from "store/commonData/commonSlice";
import {
  accordianLaneMockData,
  laneEmissionMockData,
} from "mockData/laneViewMockData.json";
import userEvent from "@testing-library/user-event";
import {
  getCarrierEmissionData, getLaneEmissionData, laneDetailsReducer,
  resetLanes,
  isLoadingLaneDashboard,
  setLoadingLane,
  initialState,
  laneGraphData
} from "store/scopeThree/track/lane/laneDetailsSlice";
import { ApiTest, TestFullFilledSlice, TestSliceMethod } from "commonCase/ReduxCases";
import laneService from "store/scopeThree/track/lane/laneService";
import { nodeUrl } from "constant"
import store from "store"

import {
  laneMockDestinationData,
  laneMockOriginData,
} from "mockData/laneMockData.json";

// Payload for fetching lane graph data
const laneGraphPayload = {
  page: 1,
  page_size: 10,
  region_id: "",
  facility_id: "",
  year: 2023,
  quarter: 1,
  toggel_data: 1,
};

// Payload for fetching lane graph data
const laneEmissionDataPayload = {
  page: 1,
  page_size: 10,
  region_id: "",
  facility_id: "",
  year: 2023,
  quarter: 1,
  search_name: '',
  col_name: "intensity",
  order_by: "desc"

};

// Payload for fetching lane graph data
const carrierEmissionDataPayload = { "region_id": "", "year": 2023, "quarter": 1, "lane_name": "MARTINSBURG, WV_TROUTMAN, NC" };
// Configuration for fetching lane graph data using Redux
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

// Configuration for rendering a specific page/component
const renderPageData = {
  navigate: true,
  dispatch: true,
  selector: ["laneGraphDetails"],
  component: LaneView,
  testCaseName: "Lanes Component",
  documentId: "lanes",
  title: "Lanes",
  reducerName: laneDetailsReducer,
};

const laneEmissionDataSlice = {
  service: laneService,
  serviceName: "getLaneEmissionDataApi",
  sliceName: "getLaneEmissionData",
  sliceImport: getLaneEmissionData,
  data: laneEmissionDataPayload,
  reducerName: laneDetailsReducer,
  loadingState: "isLaneEmissionDataLoading",
  isSuccess: "isSuccess",
  actualState: "laneEmissionData",
};

const carrierEmissionData = {
  serviceName: "getCarrierEmissionDataApi",
  method: "post",
  data: carrierEmissionDataPayload,
  serviceImport: laneService,
  route: `${nodeUrl}get-carrier-emission-table-data`,
};

const carrierEmissionDataSlice = {
  service: laneService,
  serviceName: "getCarrierEmissionDataApi",
  sliceName: "getCarrierEmissionData",
  sliceImport: getCarrierEmissionData,
  data: carrierEmissionDataPayload,
  reducerName: laneDetailsReducer,
  loadingState: "isCarrierEmissionDataLoading",
  isSuccess: "isSuccess",
  actualState: "carrierEmissionData",
};

// Execute Redux slice tests for lane data
TestFullFilledSlice({
  data: [laneGraphDataObject, laneEmissionDataSlice, carrierEmissionDataSlice],
});

// Execute API tests for lane data
ApiTest({
  data: [laneGraphApiTestData, carrierEmissionData],
});

TestSliceMethod({
  data: [laneGraphDataObject, laneEmissionDataSlice, carrierEmissionDataSlice],
});

// Test case initialState
describe('initial reducer', () => {
  it('should reset state to initialState when resetScopeOneCommonData is called', () => {
    const modifiedState: any = {
      data: [{ id: 1, value: 'test' }],
      loading: true,
      error: 'Something went wrong',
    };

    const result = laneDetailsReducer.reducer(modifiedState, resetLanes());

    expect(result).toEqual(initialState);
  });
});

describe("isLoadingLaneDashboard Thunk", () => {
  it("should return the correct status when dispatched", async () => {
    const status = true;
    // Dispatch the thunk action
    const result = await store.dispatch(isLoadingLaneDashboard(status));
    expect(result.payload).toBe(status);
  });
});


describe("setLoadingLane Thunk", () => {
  it("should return the correct status when dispatched", async () => {
    const status = true;
    // Dispatch the thunk action
    const result = await store.dispatch(setLoadingLane(status));
    expect(result.payload).toBe(status);
  });
});

jest.mock('react-i18next', () => ({
  // Keep the actual types and behavior for testing components
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({
    t: (key: string) => key,  // simple key passthrough
    i18n: { changeLanguage: jest.fn() },
  }),
}));

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

describe("testcases for decarbView page for table and grid view", () => {
  let useDispatchMock: jest.Mock;
  let useSelectorMock: jest.Mock;
  let stores: EnhancedStore;

  const navigate = jest.fn();

  const LaneComponentRender = () => {
    return render(
      <reactRedux.Provider store={stores}>
        <router.MemoryRouter>
          <LaneView />
        </router.MemoryRouter>
      </reactRedux.Provider>
    );
  };

  beforeEach(() => {
    stores = configureStore({
      reducer: {
        commonData: commonDataReducer?.reducer,
        lane: laneDetailsReducer?.reducer,
      },
    });

    jest
      .spyOn(router, "useNavigate")
      .mockImplementation(() => navigate) as jest.Mock;
    useSelectorMock = jest.spyOn(utils, "useAppSelector") as jest.Mock;
    useDispatchMock = jest.spyOn(utils, "useAppDispatch") as jest.Mock;
    useSelectorMock.mockReturnValue({
      decarbLaneListLoading: true,
    });

    let auth = jest.spyOn(tem, "useAuth") as jest.Mock;
    auth.mockReturnValue(authMockData);
    const mockDispatch = jest.fn();
    useDispatchMock.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    cleanup();
  });

  const tableCommonData = () => {
    return useSelectorMock.mockReturnValue({
      isLaneEmissionDataLoading: false,
      laneEmissionData: laneEmissionMockData,
    });
  };

  it(`<section> test case for whole page `, async () => {
    await LaneComponentRender();
    expect(screen.getByTestId("lanes")).toBeInTheDocument();
  });

  //regin selectable row
  it(`carrier region dropdown `, async () => {
    useSelectorMock.mockReturnValue({
      regions: {
        data: regionMockdata,
      },
    });
    await LaneComponentRender();

    expect(screen.getByLabelText("region-dropdown")).toBeInTheDocument();

    userEvent.click(screen.getByLabelText("region-dropdown"));

    const regionData = await screen.findByText("R1");
    userEvent.click(regionData);
  });

  //year selectable row
  it(`year dropdown `, async () => {
    useSelectorMock.mockReturnValue({
      emissionDates: yearMockData,
    });

    await LaneComponentRender();
    const dropdown = screen.getByLabelText("year-dropdown");
    userEvent.click(dropdown);
    const option = await screen.findByText("2021");
    userEvent.click(option);
  });

  //quarterly selectable row
  it(`quarter dropdown `, async () => {
    await LaneComponentRender();
    expect(screen.getByLabelText("quarter-dropdown")).toBeInTheDocument();
    await act(async () => {
      userEvent.click(screen.getByLabelText("quarter-dropdown"));
    });
    const regionData = await screen.findByText("Q1");
    await act(async () => {
      userEvent.click(regionData);
    });
  });

  //lane table search lane name
  it(`Lane table filters for search lane name`, async () => {
    tableCommonData();
    await LaneComponentRender();
    // expect(screen.getByTestId("search-lane-filter")).toBeInTheDocument();
    // userEvent.type(screen.getByTestId("search-lane-filter"), "sanford");
    // useSelectorMock.mockReturnValue({
    //   isLaneEmissionDataLoading: false,
    //   searchCarrier: {
    //     data: searchLandData,
    //   },
    // });
    expect(screen.getByTestId("lane-table-data")).toBeInTheDocument();
  });

  it(`Lane table show and click on lane data show asc and desc`, async () => {
    tableCommonData();
    await LaneComponentRender();

    expect(screen.getByTestId("lane-table-data")).toBeInTheDocument();

    const laneNameAsc = screen.getByTestId("lane-change-name");
    fireEvent.click(laneNameAsc);

    const laneNameDesc = screen.getByTestId("lane-change-name");
    fireEvent.click(laneNameDesc);

    useSelectorMock.mockReturnValue({
      isCarrierEmissionDataLoading: false,
      carrierEmissionData: accordianLaneMockData,
    });
    let index = [0]
    LaneComponentRender();
    index.map((index: number) => {
      const rowTableClickButton = screen.getByTestId(`click-row-lane-${index}`);
      fireEvent.click(rowTableClickButton);
      expect(screen.getByTestId(`accordion-table-data-${index}`)).toBeInTheDocument();

      const emissionIntensity = screen.getByTestId(`emission-intensity-${index}`);
      expect(emissionIntensity).toBeInTheDocument();
      fireEvent.click(emissionIntensity);
    })

    // laneEmissionMockData.data.responseData.forEach(
    //   (ele: any, index: number) => {
    //     // expect(navigate).toHaveBeenCalledWith(`/lanes-overview/${ele?.name}/${`2023`}/${`1` || 0}`)
    //     // const totalShipments= screen.getByTestId(`total-shipments-${index}`)
    //     // fireEvent.click(totalShipments)
    //     // const totalEmissions= screen.getByTestId(`total-emission-${index}`)
    //     // fireEvent.click(totalEmissions)
    //     // const shipmentCount= screen.getByTestId(`shipment-count-${index}`)
    //     // fireEvent.click(shipmentCount)
    //   }
    // );
  });

  it(`click on emission intensity button for asc and desc`, async () => {
    tableCommonData();
    await LaneComponentRender();

    expect(screen.getByTestId("lane-table-data")).toBeInTheDocument();

    const emissionName = screen.getByTestId("emission-intensity-name");
    fireEvent.click(emissionName);
  });

  it(`click on total shipments button for asc and desc`, async () => {
    tableCommonData();
    await LaneComponentRender();

    expect(screen.getByTestId("lane-table-data")).toBeInTheDocument();

    const totalShipmentsName = screen.getByTestId("total-shipment-name");
    fireEvent.click(totalShipmentsName);
  });

  it(`click on total emisiion button for asc and desc`, async () => {
    tableCommonData();
    await LaneComponentRender();

    expect(screen.getByTestId("lane-table-data")).toBeInTheDocument();

    const totalEmissionName = screen.getByTestId("total-emissions-name");
    fireEvent.click(totalEmissionName);
  });

  it(`click on total emisiion button for asc and desc`, async () => {
    tableCommonData();
    await LaneComponentRender();

    expect(screen.getByTestId("lane-table-data")).toBeInTheDocument();

    const totalEmissionName = screen.getByTestId("above-below-average");
    fireEvent.click(totalEmissionName);
  });

  it(`click on total emisiion button for asc and desc`, async () => {
    tableCommonData();
    await LaneComponentRender();

    expect(screen.getByTestId("lane-table-data")).toBeInTheDocument();

    const totalEmissionName = screen.getByTestId("sort-by");
    fireEvent.click(totalEmissionName);

    const highPerformance = screen.getByTestId("sort-desc");
    fireEvent.click(highPerformance);
    expect(highPerformance).toBeInTheDocument();

    const lowPerformance = screen.getByTestId("sort-asc");
    fireEvent.click(lowPerformance);
    expect(lowPerformance).toBeInTheDocument();
  });

  it(`click on toggle button`, async () => {
    useSelectorMock.mockReturnValue({
      isLaneEmissionDataLoading: false,
      laneEmissionData: laneEmissionMockData,
      configConstants: {
        date: {
          DEFAULT_YEAR: 2023,
          DEFAULT_QUARTER: 1,
          DEFAULT_PERIOD: "Q1",
        }
      }
    });
    await LaneComponentRender();

    expect(screen.getByTestId("click-row-lane-0")).toBeInTheDocument();
    const header = screen.getByTestId("click-row-lane-0").querySelector("button");
    fireEvent.click(header!);
    // fireEvent.click(screen.getByTestId("click-row-lane-0"));
  });

  it(`click on toggle button`, async () => {
    useSelectorMock.mockReturnValue({
      isLaneEmissionDataLoading: false,
      laneEmissionData: laneEmissionMockData,
      configConstants: {
        date: {
          DEFAULT_YEAR: 2023,
          DEFAULT_QUARTER: 1,
          DEFAULT_PERIOD: "Q1",
        }
      },
      loginDetails: {
        data: authMockData?.userdata
      },
      regions: {
        data: regionMockdata,
      },
      divisions: {
        data: divisionMockdata
      },
      laneOriginData: {
        data: laneMockOriginData,
      },

      laneDestinationData: {
        data: laneMockDestinationData,
      },
    });
    await LaneComponentRender();

    expect(screen.getByLabelText("divison-dropdown")).toBeInTheDocument();
    userEvent.click(screen.getByLabelText("divison-dropdown"));
    const optionDivision = await screen.findByText("OUTBOUND-Test");
    userEvent.click(optionDivision);

    userEvent.click(screen.getByLabelText("origin-dropdown"));
    const optionOrigin = await screen.findByText("VALDOSTA, GA");
    userEvent.click(optionOrigin);

    userEvent.click(screen.getByLabelText("destination-dropdown"));
    const optionDestinationDropdown = await screen.findAllByText("HOUMA, LA");
    userEvent.click(optionDestinationDropdown[0]);

    expect(screen.getByTestId("apply-button")).toBeInTheDocument();
    userEvent.click(screen.getByTestId("apply-button"));

    expect(screen.getByTestId("reset-button")).toBeInTheDocument();
    userEvent.click(screen.getByTestId("reset-button"));

    // fireEvent.click(screen.getByTestId("click-row-lane-0"));
  });

  it(`click on toggle button`, async () => {
    useSelectorMock.mockReturnValue({
      isCarrierEmissionDataLoading: true,
    });
    await LaneComponentRender();
  });
  it(`click on toggle button`, async () => {
    useSelectorMock.mockReturnValue({

      isLaneEmissionDataLoading: false,
      laneEmissionData: laneEmissionMockData,
      isCarrierEmissionDataLoading: false,
      loginDetails: {
        data: authMockData?.userdata
      },
      carrierEmissionData: {
        data: [
          {
            "intensity": 171.752963,
            "emissions": 2.4113829882,
            "shipment_count": 3,
            "carrier": "NTGO",
            "carrier_name": "NOLAN TRANSPORTATION GROUP",
            "carrier_logo": "/images/company_logo/ntgo.png",
            "SmartwayData": [
              {
                "code": "NTGO",
                "ranking": 9,
                "year": 2023
              }
            ]
          }
        ]
      },

    });
    await LaneComponentRender();
    expect(screen.getByTestId("click-row-lane-0")).toBeInTheDocument();
    const header = screen.getByTestId("click-row-lane-0").querySelector("button");
    fireEvent.click(header!);

    userEvent.click(screen.getAllByTestId(`carrier-row-nav-NOLAN TRANSPORTATION GROUP`)[0]);
  });


  it(`click on sorting`, async () => {
    useSelectorMock.mockReturnValue({

      isLaneEmissionDataLoading: false,
      laneEmissionData: laneEmissionMockData,
      isCarrierEmissionDataLoading: false,
      loginDetails: {
        data: authMockData?.userdata
      },
    });
    await LaneComponentRender();
    const emissionSortIntensity = screen.getByTestId("emission-intensity-0");
    expect(emissionSortIntensity).toBeInTheDocument();
    userEvent.click(emissionSortIntensity);

    const totalShipmentSort = screen.getByTestId("total-shipments-0");
    expect(totalShipmentSort).toBeInTheDocument();
    userEvent.click(totalShipmentSort);

    const totalEmission = screen.getByTestId("total-emission-0");
    expect(totalEmission).toBeInTheDocument();
    userEvent.click(totalEmission);


    const emissionSort = screen.getByTestId("shipment-count-0");
    expect(emissionSort).toBeInTheDocument();
    userEvent.click(emissionSort);

  });


});
