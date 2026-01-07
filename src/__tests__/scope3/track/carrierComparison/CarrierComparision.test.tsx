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
import CarrierComparisionView from "pages/carrierComprision/CarrierComparisionView";
import { authMockData, regionMockdata, divisionMockdata, yearMockData } from "mockData/commonMockData.json";
import {
  comapareMockData,
} from "mockData/carrierComparisonMockData.json";
import userEvent from "@testing-library/user-event";
import { commonDataReducer } from "store/commonData/commonSlice";
import { isLoadingCarrierDashboard, resetCarrier, initialState, carrierDetailsReducer, getCarrierRegionComparisonTable, getLaneCarrierCompaire, getLaneCarrierList, vendorTableData, vendorTableDataForExport } from "store/scopeThree/track/carrier/vendorSlice";
import vendorService from "store/scopeThree/track/carrier/vendorService";
import { ApiTest, TestFullFilledSlice, TestSliceMethod } from "commonCase/ReduxCases";
import { nodeUrl } from "constant"
import store from "store"

import {
  carrierPageMockData,

} from "mockData/carrierMockData.json";
// Payload for getting vendor comparison data
const getVendorComparisonPayload = {
  region_id: "",
  year: 2023,
  quarter: 1,
  carrier1: "UYSN",
  carrier2: "NAFD",
};

// Payload for getting vendor table data
const getVendorTableDataPayload = {
  region_id: "",
  year: 2023,
  quarter: 1,
  page: 1,
  page_size: 2,
  order_by: "desc",
  col_name: "shipment_count",
  search_name: "",
  min_range: 60,
  max_range: 390,
};

// Configuration for fetching lane carrier data using Redux
const getLaneCarrierDataObject = {
  service: vendorService,
  serviceName: "getLaneCarrierList",
  sliceName: "getLaneCarrierList",
  sliceImport: getLaneCarrierList,
  reducerName: carrierDetailsReducer,
  loadingState: "isLoading",
  isSuccess: "isSuccess",
  actualState: "laneCarrierListName",
};

// Configuration for API testing of fetching lane carrier data
const getLaneCarrierApiTestData = {
  serviceName: "getLaneCarrierList",
  method: "post",
  serviceImport: vendorService,
  route: `${nodeUrl}get-lane-carrier`,
};

// Configuration for fetching vendor comparison data using Redux
const getVendorComparisonObject = {
  service: vendorService,
  serviceName: "getLaneCarrierCompaire",
  sliceName: "getLaneCarrierCompaire",
  sliceImport: getLaneCarrierCompaire,
  data: getVendorComparisonPayload,
  reducerName: carrierDetailsReducer,
  loadingState: "getLaneCarrierCompaireDtoLoading",
  isSuccess: "isSuccess",
  actualState: "getLaneCarrierCompaireDto",
};

// Configuration for API testing of fetching vendor comparison data
const getVendorComparisonApiTestData = {
  serviceName: "getLaneCarrierCompaire",
  method: "post",
  data: getVendorComparisonPayload,
  serviceImport: vendorService,
  route: `${nodeUrl}get-vendor-comparison`,
};

// Configuration for fetching vendor table data using Redux
const getVendorTableObject = {
  service: vendorService,
  serviceName: "vendorTableDataGet",
  sliceName: "vendorTableData",
  sliceImport: vendorTableData,
  data: getVendorTableDataPayload,
  reducerName: carrierDetailsReducer,
  loadingState: "isLoadingVendorTableDetails",
  isSuccess: "isSuccess",
  actualState: "vendorTableDetails",
};

// Configuration for fetching vendor table export data using Redux
const getVendorTableExportObject = {
  service: vendorService,
  serviceName: "vendorTableDataGet",
  sliceName: "vendorTableDataForExport",
  sliceImport: vendorTableDataForExport,
  data: getVendorTableDataPayload,
  reducerName: carrierDetailsReducer,
  loadingState: "isLoadingExportVendorTableDetails",
  isSuccess: "isSuccess",
  actualState: "vendorTableDetailsExport",
};

// Configuration for API testing of fetching vendor table data
const getVendorTableApiTestData = {
  serviceName: "vendorTableDataGet",
  method: "post",
  data: getVendorTableDataPayload,
  serviceImport: vendorService,
  route: `${nodeUrl}get-vendor-table-data`,
};

// Configuration for rendering a specific page/component
const renderPageData = {
  navigate: true,
  dispatch: true,
  selector: ["getLaneCarrierCompaireDto"],
  component: CarrierComparisionView,
  testCaseName: "Carrier Comparision Component",
  documentId: "carrier-comparision",
  title: "Carrier Comparision",
  reducerName: carrierDetailsReducer,
};


// Configuration for fetching lane carrier data using Redux
const getRegionCarrierComparisonTableDataObject = {
  service: vendorService,
  serviceName: "getRegionCarrierComparisonTable",
  sliceName: "getCarrierRegionComparisonTable",
  sliceImport: getCarrierRegionComparisonTable,
  reducerName: carrierDetailsReducer,
  loadingState: "isLoadingRegionCarrierTable",
  actualState: "regionCarrierComparisonDataTable",
};

// Configuration for API testing of fetching lane carrier data
const getRegionCarrierComparisonTableApiTestData = {
  serviceName: "getRegionCarrierComparisonTable",
  method: "post",
  data: getVendorComparisonPayload,
  serviceImport: vendorService,
  route: `${nodeUrl}get-carrier-region-comparison-table-data`,
};


// Execute Redux slice tests for lane carrier data and vendor table data
TestFullFilledSlice({
  data: [
    getLaneCarrierDataObject,
    getVendorTableObject,
    getVendorComparisonObject,
    getVendorTableExportObject,
    getRegionCarrierComparisonTableDataObject
  ],
});

// Execute API tests for vendor comparison, vendor table, and lane carrier data
ApiTest({
  data: [
    getVendorComparisonApiTestData,
    getVendorTableApiTestData,
    getLaneCarrierApiTestData,
    getRegionCarrierComparisonTableApiTestData
  ],
});

TestSliceMethod({
  data: [
    getLaneCarrierDataObject,
    getVendorTableObject,
    getVendorComparisonObject,
    getVendorTableExportObject,
    getRegionCarrierComparisonTableDataObject
  ],
});


// Test case initialState
describe('initial reducer', () => {
  it('should reset state to initialState when resetCarrier is called', () => {
    const modifiedState: any = {
      data: [{ id: 1, value: 'test' }],
      loading: true,
      error: 'Something went wrong',
    };

    const result = carrierDetailsReducer.reducer(modifiedState, resetCarrier());

    expect(result).toEqual(initialState);


  });
});


describe("isLoadingCarrierDashboard", () => {
  it("should return the correct status when dispatched", async () => {
    const status = true;
    // Dispatch the thunk action
    const result = await store.dispatch(isLoadingCarrierDashboard(status));
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

describe("testcases for carrier comparision page ", () => {
  jest.setTimeout(20000);

  let useDispatchMock: jest.Mock;
  let useSelectorMock: jest.Mock;
  let stores: EnhancedStore;

  const navigate = jest.fn();
  beforeEach(() => {
    stores = configureStore({
      reducer: {
        commonData: commonDataReducer?.reducer,
        carrier: carrierDetailsReducer?.reducer,
      },
    });
    jest
      .spyOn(router, "useNavigate")
      .mockImplementation(() => navigate) as jest.Mock;

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

  const carrierComparisonRender = async () => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <CarrierComparisionView />
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };

  it(`<section> test case for whole page `, async () => {
    await carrierComparisonRender();
    expect(screen.getByTestId("carrier-comparision")).toBeInTheDocument();
  });

  it(`compare button click`, async () => {
    await carrierComparisonRender();
    const compareButton = screen.getByTestId("compare-button");
    act(() => {
      fireEvent.click(compareButton)
    })
    useSelectorMock.mockRejectedValue({
      getLaneCarrierCompaireDto: {
        data: comapareMockData,
      },
    });


  })


  //regin selectable row
  it(`carrier region dropdown `, async () => {
    useSelectorMock.mockReturnValue({
      regions: {
        data: regionMockdata,
      },
    });
    await carrierComparisonRender();

    expect(screen.getByLabelText("carrier-region-dropdown")).toBeInTheDocument();

    userEvent.click(screen.getByLabelText("carrier-region-dropdown"));

    const regionData = await screen.findByText("R1");
    userEvent.click(regionData);

    const compareButton = screen.getByTestId("compare-button");
    expect(compareButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(compareButton);
    })

    useSelectorMock.mockRejectedValue({
      getLaneCarrierCompaireDtoLoading: false,
      isLoadingVendorTableDetails: false,
      getLaneCarrierCompaireDto: {
        data: comapareMockData,
      },

    });
  });

  // //year selectable row
  it(`yearly dropdown data`, async () => {
    useSelectorMock.mockReturnValue({
      emissionDates: yearMockData,
    });

    await carrierComparisonRender();
    const dropdown = screen.getByLabelText("carrier-yearly-dropdown");
    userEvent.click(dropdown);
    const option = await screen.findByText("2021");
    userEvent.click(option);

    const compareButton = screen.getByTestId("compare-button");
    expect(compareButton).toBeInTheDocument();


    fireEvent.click(compareButton);


    useSelectorMock.mockRejectedValue({
      getLaneCarrierCompaireDto: {
        data: comapareMockData,
      },
    });

  });


  //quarterly selectable row
  it(`quarterly  dropdown `, async () => {
    await carrierComparisonRender();
    expect(screen.getByLabelText("quarter-dropdown")).toBeInTheDocument();
    await act(async () => {
      userEvent.click(screen.getByLabelText("quarter-dropdown"));
    })
    const regionData = await screen.findByText("Q1");
    await act(async () => {
      userEvent.click(regionData);
    })


    const compareButton = screen.getByTestId("compare-button");
    expect(compareButton).toBeInTheDocument();
    fireEvent.click(compareButton);
    useSelectorMock.mockRejectedValue({
      getLaneCarrierCompaireDto: {
        data: comapareMockData,
      },
      regions: {
        data: regionMockdata,
      },
      divisions: {
        data: divisionMockdata
      }
    });

  });

  //quarterly selectable row
  it(`carrier region  dropdown `, async () => {
    useSelectorMock.mockReturnValue({
      getLaneCarrierCompaireDto: {
        data: comapareMockData,
      },
      configConstants: {
        data: {
          DEFAULT_YEAR: "2021",
          DEFAULT_QUARTER: 1,
          DEFAULT_PERIOD: 1
        }
      },
      getLaneCarrierCompaireDtoLoading: false,
      regions: {
        data: regionMockdata,
      },
      divisions: {
        data: divisionMockdata
      },
      loginDetails: {
        data: authMockData?.userdata
      },
      vendorTableDetails: {
        data: carrierPageMockData,
      },
      laneCarrierListName: {
        data: {
          carrierList: [{
            "carrier_code": "STDL",
            "carrier_name": "2026482 ONTARIO INC",
            "SmartwayData": []
          }, {
            "carrier_code": "TLLS",
            "carrier_name": "3 LIONS LOGISTICS INC",
            "SmartwayData": [
              {
                "code": "TLLS",
                "ranking": 2,
                "year": 2021
              },
              {
                "code": "TLLS",
                "ranking": 3,
                "year": 2022
              }
            ]
          }]
        }
      }
    });
    await carrierComparisonRender();
    await act(async () => {
      userEvent.click(screen.getByLabelText("divison-dropdown"));
    })
    const optionDivision = await screen.findByText("OUTBOUND-Test");
    await act(async () => {
      userEvent.click(optionDivision);
    })




    const carrier1Button = screen.getByTestId("carrier1-dropdown-button");
    await act(async () => {
      userEvent.click(carrier1Button);
      await userEvent.keyboard("{Enter}");
    })

    const carrier1Option = await screen.findByText("2026482 ONTARIO INC");
    await act(async () => {
      userEvent.click(carrier1Option);
    })

    const carrier2Button = screen.getByTestId("carrier2-dropdown-button");
    await act(async () => {
      userEvent.click(carrier2Button);
      await userEvent.keyboard("{Enter}");
    })

    const carrier2Option = await screen.findByText("3 LIONS LOGISTICS INC");
    await act(async () => {
      userEvent.click(carrier2Option);
    })



    const compareButton = screen.getByTestId("compare-button");
    await act(async () => {
      userEvent.click(compareButton);
    })

    const resetButton = screen.getByTestId("reset-button");
    expect(resetButton).toBeInTheDocument();
    fireEvent.click(resetButton);


  });

});
