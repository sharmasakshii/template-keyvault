import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as router from "react-router-dom";

import * as reactRedux from "react-redux";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import { authMockData } from "mockData/commonMockData.json";
import { authDataReducer } from "store/auth/authDataSlice";
import OutPutScreenView from "pages/bidsPlanning/OutPutScreenView";

import {
  laneMockDestinationData,
  laneMockOriginData,
  laneMockSacaData,
  outputDataOfBidPlanningMockData
} from "../../../../mockData/laneMockData.json";

import userEvent from "@testing-library/user-event";
import {
  ApiTest,
  TestFullFilledSlice,
  TestSliceMethod,
} from "commonCase/ReduxCases";

import { useParams } from 'react-router-dom';
import {
  getBidFileDetail,
  bidPlanningDataReducer,
  getDestinationBidOutput,
  getEmissionCostImpactBarChartBidPlanning,
  getKeyMetricsSummaryOutput,
  getOriginBidOutput,
  getOutputOfBidPlanning,
  getOutputOfBidPlanningExport,
  getScacBidOutput,
  getKeyMetricsDetail,
  bidPlanningStatusList,
  fileMatricsInputError,
  exportErrorListBidInput,
  processBidNewLanesCounter


} from "store/bidPlanning/bidPlanningSlice";
import bidPlanningService from "store/bidPlanning/bidPlanningService";
// getBidFileDetail
import { nodeUrl } from "constant";

const outputPayload = {}
// Configuration for API testing of fetching graph filter dates data
const getBidFileDetailApiTestData = {
  serviceName: "getBidFileDetailApi",
  method: "post",
  data: outputPayload,
  serviceImport: bidPlanningService,
  route: `${nodeUrl}get-bid-file-detail`,
};

// Configuration for fetching graph filter dates data via Redux
const getBidFileDetailDataObject = {
  service: bidPlanningService,
  serviceName: "getBidFileDetailApi",
  sliceName: "getBidFileDetail",
  sliceImport: getBidFileDetail,
  data: outputPayload,
  reducerName: bidPlanningDataReducer,
  loadingState: "isLoadingSingleFile",
  actualState: "singleFileDetails",
};

// Configuration for API testing of fetching graph filter dates data
const getOriginDestinationBidOutputApiTestData = {
  serviceName: "getOriginDestinationBidOutputApi",
  method: "post",
  data: outputPayload,
  serviceImport: bidPlanningService,
  route: `${nodeUrl}search-bid-file-lane-origin-dest`,
};

// Configuration for fetching graph filter dates data via Redux
const getDestinationBidOutputDataObject = {
  service: bidPlanningService,
  serviceName: "getOriginDestinationBidOutputApi",
  sliceName: "getDestinationBidOutput",
  sliceImport: getDestinationBidOutput,
  data: outputPayload,
  reducerName: bidPlanningDataReducer,
  loadingState: "isLoadingDestinationBidOutput",
  actualState: "destinationBidOutput",
};

// Configuration for API testing of fetching graph filter dates data
const getEmissionCostImpactBarChartBidPlanningApiTestData = {
  serviceName: "getEmissionCostImpactBarChartBidPlanningApi",
  method: "post",
  data: outputPayload,
  serviceImport: bidPlanningService,
  route: `${nodeUrl}top-emission-cost-impact-lanes-bid-output`,
};

// Configuration for fetching graph filter dates data via Redux
const getEmissionCostImpactBarChartBidPlanningDataObject = {
  service: bidPlanningService,
  serviceName: "getEmissionCostImpactBarChartBidPlanningApi",
  sliceName: "getEmissionCostImpactBarChartBidPlanning",
  sliceImport: getEmissionCostImpactBarChartBidPlanning,
  data: outputPayload,
  reducerName: bidPlanningDataReducer,
  loadingState: "isLoadingEmissionCostImpactBarChartBid",
  actualState: "costImpactBarChartBid",
};


// Configuration for API testing of fetching graph filter dates data
const getKeyMetricsSummaryOutputApiTestData = {
  serviceName: "getKeyMetricsSummaryOutputApi",
  method: "post",
  data: outputPayload,
  serviceImport: bidPlanningService,
  route: `${nodeUrl}bid-output-detail`,
};

// Configuration for fetching graph filter dates data via Redux
const getKeyMetricsSummaryOutputDataObject = {
  service: bidPlanningService,
  serviceName: "getKeyMetricsSummaryOutputApi",
  sliceName: "getKeyMetricsSummaryOutput",
  sliceImport: getKeyMetricsSummaryOutput,
  data: outputPayload,
  reducerName: bidPlanningDataReducer,
  loadingState: "isLoadingKeyMetricsSummaryOutput",
  actualState: "keyMetricsSummaryOutput",
};

// Configuration for fetching graph filter dates data via Redux
const getOriginBidOutputDataObject = {
  service: bidPlanningService,
  serviceName: "getOriginDestinationBidOutputApi",
  sliceName: "getOriginBidOutput",
  sliceImport: getOriginBidOutput,
  data: outputPayload,
  reducerName: bidPlanningDataReducer,
  loadingState: "isLoadingOriginBidOutput",
  actualState: "originBidOutput",
};

// Configuration for API testing of fetching graph filter dates data
const getOutPutOfBidPlanningApiTestData = {
  serviceName: "getOutPutOfBidPlanningApi",
  method: "post",
  data: outputPayload,
  serviceImport: bidPlanningService,
  route: `${nodeUrl}get-bid-file-output-table`,
};

// Configuration for fetching graph filter dates data via Redux
const getOutputOfBidPlanningDataObject = {
  service: bidPlanningService,
  serviceName: "getOutPutOfBidPlanningApi",
  sliceName: "getOutputOfBidPlanning",
  sliceImport: getOutputOfBidPlanning,
  data: outputPayload,
  reducerName: bidPlanningDataReducer,
  loadingState: "isLoadingOutputDataOfBidPlanning",
  actualState: "outputDataOfBidPlanning",
};

// Configuration for API testing of fetching graph filter dates data
const exportOutPutOfBidPlanningApiTestData = {
  serviceName: "exportOutPutOfBidPlanningApi",
  method: "post",
  data: outputPayload,
  serviceImport: bidPlanningService,
  route: `${nodeUrl}download-bid-filter-data`,
};

// Configuration for fetching graph filter dates data via Redux
const getOutputOfBidPlanningExportDataObject = {
  service: bidPlanningService,
  serviceName: "exportOutPutOfBidPlanningApi",
  sliceName: "getOutputOfBidPlanningExport",
  sliceImport: getOutputOfBidPlanningExport,
  data: outputPayload,
  reducerName: bidPlanningDataReducer,
  loadingState: "isLoadingOutputOfBidPlanningExport",
  actualState: "outputOfBidPlanningExportData",
};

// Configuration for API testing of fetching graph filter dates data
const getScacBidOutputApiTestData = {
  serviceName: "getScacBidOutputApi",
  method: "post",
  data: outputPayload,
  serviceImport: bidPlanningService,
  route: `${nodeUrl}get-scac-list`,
};

// Configuration for fetching graph filter dates data via Redux
const getScacBidOutputDataObject = {
  service: bidPlanningService,
  serviceName: "getScacBidOutputApi",
  sliceName: "getScacBidOutput",
  sliceImport: getScacBidOutput,
  data: outputPayload,
  reducerName: bidPlanningDataReducer,
  loadingState: "isLoadingScacBidOutput",
  actualState: "scacBidOutput",
};


// Configuration for API testing of fetching graph filter dates data
const getKeyMetricsDetailApiTestData = {
  serviceName: "getKeyMetricsDetailApi",
  method: "post",
  data: outputPayload,
  serviceImport: bidPlanningService,
  route: `${nodeUrl}get-bid-details`,
};

// Configuration for fetching graph filter dates data via Redux
const getKeyMetricsDetailDataObject = {
  service: bidPlanningService,
  serviceName: "getKeyMetricsDetailApi",
  sliceName: "getKeyMetricsDetail",
  sliceImport: getKeyMetricsDetail,
  data: outputPayload,
  reducerName: bidPlanningDataReducer,
  loadingState: "isLoadingKeyMetricsDetail",
  actualState: "keyMetricsDetail",
};

// Configuration for API testing of fetching graph filter dates data
const bidPlanningStatusListApiTestData = {
  serviceName: "getBidStatusList",
  method: "get",
  data: outputPayload,
  serviceImport: bidPlanningService,
  route: `${nodeUrl}get-all-bid-status`,
};

// Configuration for fetching graph filter dates data via Redux
const bidPlanningStatusListDataObject = {
  service: bidPlanningService,
  serviceName: "getBidStatusList",
  sliceName: "bidPlanningStatusList",
  sliceImport: bidPlanningStatusList,
  data: outputPayload,
  reducerName: bidPlanningDataReducer,
  loadingState: "isLoadingStatusList",
  actualState: "bidStatusList",
};

// Configuration for API testing of fetching graph filter dates data
const fileMatricsInputErrorApiTestData = {
  serviceName: "fileMatricsErrorApi",
  method: "post",
  data: outputPayload,
  serviceImport: bidPlanningService,
  route: `${nodeUrl}get-all-bid-file-error-rows`,
};

// Configuration for fetching graph filter dates data via Redux
const fileMatricsInputErrorDataObject = {
  service: bidPlanningService,
  serviceName: "fileMatricsErrorApi",
  sliceName: "fileMatricsInputError",
  sliceImport: fileMatricsInputError,
  data: outputPayload,
  reducerName: bidPlanningDataReducer,
  loadingState: "isLoadinFileInputError",
  actualState: "fileInputErrorData",
};

// Configuration for API testing of fetching graph filter dates data
const exportErrorListBidInputApiTestData = {
  serviceName: "exportErrorListBidInputApi",
  method: "post",
  data: outputPayload,
  serviceImport: bidPlanningService,
  route: `${nodeUrl}download-bid-error-data`,
};

// Configuration for fetching graph filter dates data via Redux
const exportErrorListBidInputDataObject = {
  service: bidPlanningService,
  serviceName: "exportErrorListBidInputApi",
  sliceName: "exportErrorListBidInput",
  sliceImport: exportErrorListBidInput,
  data: outputPayload,
  reducerName: bidPlanningDataReducer,
  loadingState: "isLoadingErrorInputBidExport",
  actualState: "errorInputBidExportData",
};

// Configuration for API testing of fetching graph filter dates data
const processBidFileApiV1TestData = {
  serviceName: "processBidFileApiV1",
  method: "post",
  data: outputPayload,
  serviceImport: bidPlanningService,
  route: `${nodeUrl}process-logic-app`,
};

// Configuration for fetching graph filter dates data via Redux
const processBidNewLanesCounterDataObject = {
  service: bidPlanningService,
  serviceName: "processBidFileApiV1",
  sliceName: "processBidNewLanesCounter",
  sliceImport: processBidNewLanesCounter,
  data: outputPayload,
  reducerName: bidPlanningDataReducer,
  loadingState: "isLoadingProcessNewLaneData",
  actualState: "processNewLaneData",
};

// 

// Execute Redux slice tests for various data
TestFullFilledSlice({
  data: [
    getBidFileDetailDataObject,
    getDestinationBidOutputDataObject,
    getEmissionCostImpactBarChartBidPlanningDataObject,
    getOriginBidOutputDataObject,
    getKeyMetricsSummaryOutputDataObject,
    getOutputOfBidPlanningDataObject,
    getOutputOfBidPlanningExportDataObject,
    getScacBidOutputDataObject,
    getKeyMetricsDetailDataObject,
    bidPlanningStatusListDataObject,
    fileMatricsInputErrorDataObject,
    exportErrorListBidInputDataObject,
    processBidNewLanesCounterDataObject
  ],
});

// Execute API tests for various data
ApiTest({
  data: [
    getBidFileDetailApiTestData,
    getOriginDestinationBidOutputApiTestData,
    getEmissionCostImpactBarChartBidPlanningApiTestData,
    getKeyMetricsSummaryOutputApiTestData,
    getOutPutOfBidPlanningApiTestData,
    exportOutPutOfBidPlanningApiTestData,
    getScacBidOutputApiTestData,
    getKeyMetricsDetailApiTestData,
    bidPlanningStatusListApiTestData,
    fileMatricsInputErrorApiTestData,
    exportErrorListBidInputApiTestData,
    processBidFileApiV1TestData
  ]
});

TestSliceMethod({
  data: [
    getBidFileDetailDataObject,
    getDestinationBidOutputDataObject,
    getEmissionCostImpactBarChartBidPlanningDataObject,
    getOriginBidOutputDataObject,
    getKeyMetricsSummaryOutputDataObject,
    getOutputOfBidPlanningDataObject,
    getOutputOfBidPlanningExportDataObject,
    getScacBidOutputDataObject,
    getKeyMetricsDetailDataObject,
    bidPlanningStatusListDataObject,
    fileMatricsInputErrorDataObject,
    exportErrorListBidInputDataObject,
    processBidNewLanesCounterDataObject
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

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

describe("test create role  ", () => {
  jest.setTimeout(20000);
  let useDispatchMock: jest.Mock;
  let useSelectorMock: jest.Mock;
  let stores: EnhancedStore;
  const navigate = jest.fn();
  beforeEach(() => {
    stores = configureStore({
      reducer: {
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

  const renderOutPutScreenView = async () => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <OutPutScreenView />
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };

  //section id.....
  it(`<section> test case for whole page `, async () => {
    const mockedParams = { file_id: 1, file_name: 'demo' };

    // Mock the return value of useParams hook
    (useParams as jest.Mock).mockReturnValue(mockedParams);

    await renderOutPutScreenView();
    expect(screen.getByTestId("bid-output")).toBeInTheDocument();

    expect(screen.getByTestId('bid-output-section')).toBeInTheDocument();
    userEvent.click(screen.getByTestId('bid-output-section'));

  });

  it(`carrier selectable options `, async () => {
    const mockedParams = { file_id: 1, file_name: 'demo' };

    useSelectorMock.mockReturnValue({
      configConstants: {
        data: {
          alternative_fuel_default_year: 2024
        }
      },
      costImpactBarChartBid: {
        data: [
          {
            "lane_name": "BAKERSFIELD, CA_TINLEY PARK, IL",
            "max_emission": 20,
            "rpm": 4.11,
            "SCAC": "BIOS",
            "max_cost": 84,
            "path": "/images/company_logo/bison-transport.png"
          },
          {
            "lane_name": "CHARLOTTE, NC_ABERDEEN, MD",
            "max_emission": 16,
            "rpm": 2.74,
            "SCAC": "BOTI",
            "max_cost": 92,
            "path": null
          },
          {
            "lane_name": "ARLINGTON, TX_SUGARLAND, TX",
            "max_emission": 12,
            "rpm": 2.74,
            "SCAC": "HVRL",
            "max_cost": 92,
            "path": "/images/company_logo/halvor.png"
          }
        ]
      },
      singleFileDetails: {
        data: {
          "file_detail": {
            "id": 81,
            "name": "bid_sample_file.xlsx",
          },
          "user": {
            "user_id": 11,
            "user_name": "Blob Pepsicos"
          },
          "processing": {
            "id": 37,
            "processed_by": 11,
            "file_id": 81
          },
          "bidError": []
        }

      }
    });
    (useParams as jest.Mock).mockReturnValue(mockedParams);

    await renderOutPutScreenView();
    expect(screen.getByTestId("bid-output")).toBeInTheDocument();

    expect(screen.getByTestId('download-button')).toBeInTheDocument();
    userEvent.click(screen.getByTestId('download-button'));

  })

  it(`carrier selectable options `, async () => {
    const mockedParams = { file_id: 1, file_name: 'demo' };

    useSelectorMock.mockReturnValue({
      configConstants: {
        data: {
          alternative_fuel_default_year: 2024
        }
      },
      singleFileDetails: {
        data: {
          "file_detail": {
            "id": 81,
            "name": "bid_sample_file.xlsx",
            "user_id": 11,
            "type": "bid",
            "status_id": 5,
            "is_deleted": 0,
            "base_path": "bid_planning",
            "created_on": "2024-09-25T05:56:16.850Z",
            "updated_on": "2024-09-25T05:57:53.857Z",
            "status": {
              "status_name": "Processed",
              "id": 5
            },
            "user": {
              "user_id": 11,
              "user_name": "Blob Pepsicos"
            },
            "processing": {
              "id": 37,
              "file_name": null,
              "start_time": "2024-09-25T05:57:02.233Z",
              "expected_time": "2024-09-25T05:59:53.183Z",
              "end_time": "2024-09-25T05:57:53.860Z",
              "processed_by": 11,
              "download_path": "Downloads/1727426874807_bid_sample_file.xlsx",
              "file_id": 81
            },
            "bidError": []
          }
        }
      }
    });
    (useParams as jest.Mock).mockReturnValue(mockedParams);

    await renderOutPutScreenView();
    expect(screen.getByTestId("bid-output")).toBeInTheDocument();

    expect(screen.getByTestId('download-button')).toBeInTheDocument();
    userEvent.click(screen.getByTestId('download-button'));

    expect(screen.getByTestId('view-all-button')).toBeInTheDocument();
    userEvent.click(screen.getByTestId('view-all-button'));
  })

  it(`lane table data `, async () => {
    const mockedParams = { file_id: 1, file_name: 'demo' };

    useSelectorMock.mockReturnValue({
      configConstants: {
        data: {
          alternative_fuel_default_year: 2024
        }
      },
      originBidOutput: {
        data: laneMockOriginData,
      },

      destinationBidOutput: {
        data: laneMockDestinationData,
      },
      scacBidOutput: {
        data: laneMockSacaData
      }


    });
    (useParams as jest.Mock).mockReturnValue(mockedParams);

    await renderOutPutScreenView();
    expect(screen.getByTestId("bid-output")).toBeInTheDocument();

    expect(screen.getByTestId('change-origin')).toBeInTheDocument();
    const originDropDown = screen.getByLabelText("origin-dropdown");
    expect(originDropDown).toBeInTheDocument();
    fireEvent.click(originDropDown);
    expect(screen.getByText("VALDOSTA, GA")).toBeInTheDocument();
    fireEvent.change(originDropDown, { target: { value: "VALDOSTA" } });
    fireEvent.click(screen.getByText("VALDOSTA, GA"));
    act(() => {
      userEvent.click(screen.getByTestId('change-origin'));
    })

    expect(screen.getByTestId('change-destination')).toBeInTheDocument();
    const desDropDown = screen.getByLabelText("destination-dropdown");
    expect(desDropDown).toBeInTheDocument();
    fireEvent.click(desDropDown);
    act(() => {
      fireEvent.change(desDropDown, { target: { value: "HOUMA" } });
    })
    expect(screen.getByText("HOUMA, LA")).toBeInTheDocument();
    fireEvent.click(screen.getByText("HOUMA, LA"));
    act(() => {
      userEvent.click(screen.getByTestId('change-destination'));
    })

    expect(screen.getByTestId("upDown-arrows")).toBeInTheDocument();
    userEvent.click(screen.getByTestId('upDown-arrows'));


    expect(screen.getByTestId('change-scac')).toBeInTheDocument();
    const scacDropdown = screen.getByLabelText("scac-dropdown");
    expect(scacDropdown).toBeInTheDocument();
    fireEvent.click(scacDropdown);
    act(() => {
      fireEvent.change(scacDropdown, { target: { value: "scac" } });
    })
    expect(screen.getByText("scac, LA")).toBeInTheDocument();
    fireEvent.click(screen.getByText("scac, LA"));
    act(() => {
      userEvent.click(screen.getByTestId('change-scac'));
    })

    expect(screen.getByTestId('apply-button')).toBeInTheDocument();
    userEvent.click(screen.getByTestId('apply-button'));

    expect(screen.getByTestId('reset-button')).toBeInTheDocument();
    userEvent.click(screen.getByTestId('reset-button'));

  })

  it(`lane table data download `, async () => {
    const mockedParams = { file_id: 1, file_name: 'demo' };

    useSelectorMock.mockReturnValue({
      configConstants: {
        data: {
          alternative_fuel_default_year: 2024
        }
      },
      outputDataOfBidPlanning: {
        data: outputDataOfBidPlanningMockData,
      },
      keyMetricsSummaryOutput: {
        "status": true,
        "message": "Bid details fetched.",
        "data": {
          "bid_details": {
            "emissions": {
              "value": 0,
              "sign": "up"
            },
            "rpm": {
              "value": null,
              "sign": "up"
            },
            "cost_impact": {
              "value": 0,
              "sign": "up"
            },
            "unit": "tco2e"
          },
          "bid_lanes": [{
            lane_name: "test_abc"
          }],
          "file_name": "bid_sample_file.xlsx"
        }
      }

    });
    (useParams as jest.Mock).mockReturnValue(mockedParams);

    await renderOutPutScreenView();
    expect(screen.getByTestId("bid-output")).toBeInTheDocument();

    expect(screen.getByTestId('download-button-report')).toBeInTheDocument();
    userEvent.click(screen.getByTestId('download-button-report'));


  })
  it(`lane pagination `, async () => {
    const mockedParams = { file_id: 1, file_name: 'demo' };

    useSelectorMock.mockReturnValue({
      configConstants: {
        data: {
          alternative_fuel_default_year: 2024
        }
      },
      outputDataOfBidPlanning: {
        data: outputDataOfBidPlanningMockData,
      },
      keyMetricsSummaryOutput: {
        "status": true,
        "message": "Bid details fetched.",
        "data": {
          "bid_details": {
            "emissions": {
              "value": 0,
              "sign": "up"
            },
            "rpm": {
              "value": null,
              "sign": "up"
            },
            "cost_impact": {
              "value": 0,
              "sign": "up"
            },
            "unit": "tco2e"
          },
          "bid_lanes": [{
            lane_name: "test_abc"
          }],
          "file_name": "bid_sample_file.xlsx"
        }
      }

    });
    (useParams as jest.Mock).mockReturnValue(mockedParams);

    await renderOutPutScreenView();
    expect(screen.getByTestId("bid-output")).toBeInTheDocument();


    expect(screen.getByLabelText("pagination-dropdown")).toBeInTheDocument();
    userEvent.click(screen.getByLabelText("pagination-dropdown"));

    const paginationData = await screen.findByText("50");
    await act(async () => {
      userEvent.click(paginationData);
    });

    const anchorElement = screen.getByRole('button', { name: '2' });
    expect(anchorElement).toBeInTheDocument();
    userEvent.click(anchorElement);

  })
});