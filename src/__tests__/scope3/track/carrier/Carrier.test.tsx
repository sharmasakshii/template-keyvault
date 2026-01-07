// Import necessary modules and components
import vendorService from "../../../../store/scopeThree/track/carrier/vendorService";
import {
  carrierDetailsReducer,
  vendorTableData,
} from "../../../../store/scopeThree/track/carrier/vendorSlice";
import {
  ApiTest,
  TestFullFilledSlice,
  TestSliceMethod,
} from "../../../../commonCase/ReduxCases";
import VendorView from "../../../../pages/carrier/VendorView";

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen
} from "@testing-library/react";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as router from "react-router-dom";

import * as reactRedux from "react-redux";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import { authMockData, authMockDataL, regionMockdata, yearMockData, divisionMockdata } from "mockData/commonMockData.json";
import { authDataReducer } from "store/auth/authDataSlice";
import {
  carrierMockData,
} from "mockData/regionalMockData.json";
import userEvent from "@testing-library/user-event";
import {
  carrierPageMockData,
  downloadMockData,
  searchMockData,
} from "mockData/carrierMockData.json";
import { commonDataReducer } from "store/commonData/commonSlice";
import { sustainCardMockData } from "mockData/sustainableMockData.json";
import { nodeUrl } from "constant"

// Payload for fetching table data
const tableDataPayload = {
  region_id: "",
  year: 2023,
  quarter: 1,
  page: 1,
  page_size: 20,
  order_by: "desc",
  col_name: "intensity",
  search_name: "",
  min_range: 60,
  max_range: 390,
};

// Configuration for fetching table data using Redux
const tableDataObject = {
  service: vendorService,
  serviceName: "vendorTableDataGet",
  sliceName: "vendorTableData",
  sliceImport: vendorTableData,
  data: tableDataPayload,
  reducerName: carrierDetailsReducer,
  loadingState: "isLoadingVendorTableDetails",
  isSuccess: "isSuccess",
  actualState: "vendorTableDetails",
};

// Configuration for API testing of fetching table data
const tableApiTestData = {
  serviceName: "vendorTableDataGet",
  method: "post",
  data: tableDataPayload,
  serviceImport: vendorService,
  route: `${nodeUrl}get-vendor-table-data`,
};

// Execute Redux slice tests for table data
TestFullFilledSlice({ data: [tableDataObject] });

// Execute API test for table data
ApiTest({ data: [tableApiTestData] });

TestSliceMethod({
  data: [tableDataObject],
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

  const renderCarrierView = async () => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <VendorView />
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };

  //section id.....
  it(`<section> test case for whole page `, async () => {
    await renderCarrierView();
    expect(screen.getByTestId("carrier-view")).toBeInTheDocument();
  });

  //export button
  it(`Export download button`, async () => {
    useSelectorMock.mockReturnValue({
      vendorTableDetailsExport: {
        data: downloadMockData,
      },
      regions: {
        data: regionMockdata,
      },
      emissionDates: yearMockData,
      // isCarrier: true,
      searchCarrier: {
        data: searchMockData,
      },
    });
    await renderCarrierView();
    expect(screen.getByTestId("export-download-btn")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("export-download-btn"));

    expect(screen.getByTestId("export-download-btn")).toBeInTheDocument();
  });

  //vendor table filters region drop down
  it(`Vendor table filters for region dropdown`, async () => {
    let auth = jest.spyOn(tem, "useAuth");
    auth.mockReturnValue(authMockData);
    useSelectorMock.mockReturnValue({
      regions: {
        data: regionMockdata,
      },
    });
    await renderCarrierView();
    expect(screen.getByLabelText("regions-data-dropdown")).toBeInTheDocument();
    userEvent.click(screen.getByLabelText("regions-data-dropdown"));

    const regionData = await screen.findByText("R2");
    userEvent.click(regionData);
  });

  //vendor table filters year drop down
  it(`Vendor table filters for year dropdown`, async () => {
    let auth = jest.spyOn(tem, "useAuth");
    auth.mockReturnValue(authMockData);
    useSelectorMock.mockReturnValue({
      emissionDates: yearMockData,
    });
    await renderCarrierView();

    const dropdown = screen.getByLabelText("year-dropdown");
    userEvent.click(dropdown);
    const option = await screen.findByText("2021");
    userEvent.click(option);
  });

  //vendor table filters quarter drop down
  it(`Vendor table filters for quarter dropdown`, async () => {
    let auth = jest.spyOn(tem, "useAuth");
    auth.mockReturnValue(authMockData);
    await renderCarrierView();
    expect(screen.getByTestId("vendor-table-filter")).toBeInTheDocument();
    expect(screen.getByLabelText("quarter-dropdown")).toBeInTheDocument();
    await act(async () => {
      userEvent.click(screen.getByLabelText("quarter-dropdown"));
    });
    const regionData = await screen.findByText("Q1");
    await act(async () => {
      userEvent.click(regionData);
    });
  });

  //vendor table filters range selector
  it(`Vendor table filters for range selector`, async () => {
    let auth = jest.spyOn(tem, "useAuth");
    auth.mockReturnValue(authMockData);
    await renderCarrierView();
    const data = useSelectorMock.mockReturnValue({
      isCarrier: true,
      vendorTableDetails: {
        data: carrierPageMockData,
      },
      configConstants: {
        data: sustainCardMockData
      }
    });
    expect(screen.getByTestId("vendor-table-filter")).toBeInTheDocument();
    expect(screen.getByTestId("range-selector")).toBeInTheDocument();
  });

  //vendor table search carrier name
  it(`Vendor table filters for search carrier name`, async () => {
    useSelectorMock.mockReturnValue({
      isCarrier: true,
      vendorTableDetails: {
        data: carrierPageMockData,
      },
    });
    let auth = jest.spyOn(tem, "useAuth");
    auth.mockReturnValue(authMockData);
    await renderCarrierView();
    expect(
      screen.getByTestId("vendor-table-search-filter")
    ).toBeInTheDocument();
    userEvent.type(screen.getByTestId("vendor-table-search-filter"), "Fedex");
    useSelectorMock.mockReturnValue({
      isCarrier: true,
      searchCarrier: {
        data: searchMockData,
      },
    });
    expect(screen.getByTestId("vendor-table-data")).toBeInTheDocument();
  });

  //vendor table performance headings
  it(`Vendor table performance heading`, async () => {
    await renderCarrierView();
    expect(screen.getByTestId("performance-heading")).toBeInTheDocument();
  });

  //vendor table data
  it(`Vendor table data for carrier`, async () => {
    useSelectorMock.mockReturnValue({
      isCarrier: true,
      vendorTableDetails: {
        data: carrierMockData,
      },
    });
    await renderCarrierView();
    expect(screen.getByTestId("vendor-table-data")).toBeInTheDocument();
    expect(screen.getByTestId("table-heading-data")).toBeInTheDocument();
    expect(screen.getByTestId("emission-intensity")).toBeInTheDocument();
    expect(screen.getByTestId("total-shipments")).toBeInTheDocument();
    expect(screen.getByTestId("total-emission")).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByTestId("table-heading-data"));
      fireEvent.click(screen.getByTestId("emission-intensity"));
      fireEvent.click(screen.getByTestId("total-shipments"));
      fireEvent.click(screen.getByTestId("total-emission"));
    });
    carrierMockData?.responseData.forEach((ele: any, index: number) => {
      const rowTableClickButton = screen.getByTestId(
        `click-row-carrier-${index}`
      );
      act(() => {
        fireEvent.click(rowTableClickButton);
      });

      // expect(navigate).toHaveBeenCalledWith(
      //   `/carrier-overview/${ele?.["carrier"]}/2023/0`
      // );
    });
  });

  //loadings
  it(`loading state`, async () => {
    useSelectorMock.mockReturnValue({
      isLoadingVendorTableDetails: true,
    });
    await renderCarrierView();
    expect(screen.getByTestId("spinner-loader")).toBeInTheDocument();
  });

  //pagination
  it(`pagination dropdown`, async () => {
    useSelectorMock.mockReturnValue({
      vendorTableDetails: {
        data: carrierPageMockData?.pagination,
      },
    });
    await renderCarrierView();
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("pagination"));
    // expect(screen.getByLabelText("pagination-dropdown")).toBeInTheDocument();
    // await act(async () => {
    //   userEvent.click(screen.getByLabelText("pagination-dropdown"));
    // });
    // const paginationData = await screen.findByText("10");
    // await act(async () => {
    //   userEvent.click(paginationData);
    // });
  });

 

  it(`download csv`, async () => {
    global.URL.createObjectURL = jest.fn(() => 'mocked-url');
    global.URL.revokeObjectURL = jest.fn();

    useSelectorMock.mockReturnValue({
      vendorTableDetails: {
        data: carrierPageMockData,
      },
      configConstants: {
        data: sustainCardMockData[0]
      },
      loginDetails: {
        data: authMockData?.userdata
      },
      vendorTableDetailsExport: {
        data: downloadMockData,
      },
    });
    await renderCarrierView();

    const exportDownloadBtn = screen.getByTestId("export-download-btn");
    expect(exportDownloadBtn).toBeInTheDocument();
    userEvent.click(exportDownloadBtn);
  });

  it(`divison filter`, async () => {
    global.URL.createObjectURL = jest.fn(() => 'mocked-url');
    global.URL.revokeObjectURL = jest.fn();

    useSelectorMock.mockReturnValue({
      vendorTableDetails: {
        data: carrierPageMockData,
      },
      configConstants: {
        data: sustainCardMockData[0]
      },
      loginDetails: {
        data: authMockData?.userdata
      },

      divisions: {
        data: divisionMockdata
      }
    });
    await renderCarrierView();

    expect(screen.getByLabelText("divison-dropdown")).toBeInTheDocument();
    userEvent.click(screen.getByLabelText("divison-dropdown"));
    const optionDivision = await screen.findByText("OUTBOUND-Test");
    userEvent.click(optionDivision);
  });


  it(`download csv`, async () => {
    global.URL.createObjectURL = jest.fn(() => 'mocked-url');
    global.URL.revokeObjectURL = jest.fn();

    useSelectorMock.mockReturnValue({
      vendorTableDetails: {
        data: carrierPageMockData,
      },
      configConstants: {
        data: sustainCardMockData[0]
      },
      loginDetails: {
        data: authMockDataL?.userdata
      },
      vendorTableDetailsExport: {
        data: downloadMockData,
      },
    });
    await renderCarrierView();

    const exportDownloadBtn = screen.getByTestId("export-download-btn");
    expect(exportDownloadBtn).toBeInTheDocument();
    userEvent.click(exportDownloadBtn);
  });


   //pagination
  it(`pagination dropdown`, async () => {
    useSelectorMock.mockReturnValue({
      vendorTableDetails: {
        data: carrierPageMockData,
      },
      configConstants: {
        data: sustainCardMockData[0]
      },
      loginDetails: {
        data: authMockData?.userdata
      },
    });
    await renderCarrierView();
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("pagination"));

    userEvent.click(screen.getByLabelText("pagination-dropdown"));

    const paginationData = await screen.findByText("50");
    await act(async () => {
      userEvent.click(paginationData);
    });

    const anchorElement = screen.getByRole('button', { name: '2' });
    expect(anchorElement).toBeInTheDocument();
    userEvent.click(anchorElement);


  });

});
