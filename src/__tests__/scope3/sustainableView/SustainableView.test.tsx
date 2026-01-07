import { act, cleanup, render, screen } from "@testing-library/react";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as router from "react-router-dom";
import * as reactRedux from "react-redux";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import { authMockData, authDataWithPasswordExpiry, regionMockdata, yearMockData } from "mockData/commonMockData.json";
import { authDataReducer } from "store/auth/authDataSlice";
import SustainView from "pages/sustainable/SustainView";
import {
  emissionRegionDetails,
  graphRegionEmission,
  sustainableReducer,
  resetSustain,
  initialState,
  setShowPasswordExpire,
  isLoadingDashboard,
  getConfigConstants
} from "store/sustain/sustainSlice";
import {
  HighChartEmissionIntesnsityByRegionMockData,
} from "mockData/regionalMockData.json";
import {
  HighChartEmissionIntesnsityMockData,
  RPGgraphMockDataEmissionRegion,
  RPGgraphMockDataTotalEmission,
  projectCountMockData,
  sustainCardMockData,
} from "mockData/sustainableMockData.json";
import userEvent from "@testing-library/user-event";
import {
  ApiTest,
  TestFullFilledSlice,
  TestSliceMethod,
} from "commonCase/ReduxCases";
import commonService from "store/commonData/commonService";
import {
  commonDataReducer,
  getProjectCount,
  graphEmissionIntensity,
} from "store/commonData/commonSlice";
import sustainService from "store/sustain/sustainService";
import { nodeUrl } from "constant"
import store from "store"

const graphEmissionIntensityPayload = {
  year: 2022,
  toggel: 0,
};

// Payload for posting graph region emission data
const graphRegionEmissionPayload = {
  region_id: "",
  company_id: "",
  year: "",
  toggel_data: 0,
};

// Payload for fetching region emission data
const getRegionEmissionPayload = {
  year: 2022,
  region_id: "",
  toggel_data: 0,
};

// Payload for fetching project count API
const getProjectCountApiPayload = {
  region_id: "",
  year: 2023,
};

// Configuration for fetching graph emission intensity data via Redux
const graphEmissionIntensityDataObject = {
  service: commonService,
  serviceName: "postRegionIntensity",
  sliceName: "graphEmissionIntensity",
  sliceImport: graphEmissionIntensity,
  data: graphEmissionIntensityPayload,
  reducerName: commonDataReducer,
  loadingState: "emissionIntensityDetailsIsLoading",
  isSuccess: "isSuccess",
  actualState: "emissionIntensityDetails",
};

// Configuration for API testing of fetching graph emission intensity data
const graphEmissionIntensityApiTestData = {
  serviceName: "postRegionIntensity",
  method: "post",
  data: graphEmissionIntensityPayload,
  serviceImport: commonService,
  route: `${nodeUrl}get-region-intensity-yearly`,
};

// Configuration for fetching graph region emission data via Redux
const graphRegionEmissionDataObject = {
  service: sustainService,
  serviceName: "getGraphRegionEmission",
  sliceName: "graphRegionEmission",
  sliceImport: graphRegionEmission,
  data: graphRegionEmissionPayload,
  reducerName: sustainableReducer,
  loadingState: "isLoadingGraphRegionEmission",
  isSuccess: "isSuccess",
  actualState: "graphRegionChart",
};

// Configuration for API testing of fetching graph region emission data
const graphRegionEmissionApiTestData = {
  serviceName: "getGraphRegionEmission",
  method: "post",
  data: graphRegionEmissionPayload,
  serviceImport: sustainService,
  route: `${nodeUrl}get-region-emission-monthly`,
};

// Configuration for fetching region emission data via Redux
const getRegionEmissionDataObject = {
  service: sustainService,
  serviceName: "getRegionEmission",
  sliceName: "emissionRegionDetails",
  sliceImport: emissionRegionDetails,
  data: getRegionEmissionPayload,
  reducerName: sustainableReducer,
  loadingState: "regionEmissionIsLoading",
  isSuccess: "isSuccess",
  actualState: "regionEmission",
};

// Configuration for API testing of fetching region emission data
const getRegionEmissionApiTestData = {
  serviceName: "getRegionEmission",
  method: "post",
  data: getRegionEmissionPayload,
  serviceImport: sustainService,
  route: `${nodeUrl}get-region-emission-reduction`,
};

// Configuration for fetching project count API data via Redux
const getProjectCountApiDataObject = {
  service: commonService,
  serviceName: "getProjectCountApi",
  sliceName: "getProjectCount",
  sliceImport: getProjectCount,
  data: getProjectCountApiPayload,
  reducerName: commonDataReducer,
  loadingState: "isLoadingProjectCount",
  isSuccess: "isSuccess",
  actualState: "projectCountData",
};

// Configuration for API testing of fetching project count API data
const getProjectCountApiTestData = {
  serviceName: "getProjectCountApi",
  method: "post",
  data: getProjectCountApiPayload,
  serviceImport: commonService,
  route: `${nodeUrl}get-project-count`,
};

// Configuration for fetching project count API data via Redux
const getConfigConstantsApiDataObject = {
  service: commonService,
  serviceName: "getConfigConstants",
  sliceName: "getConfigConstants",
  sliceImport: getConfigConstants,
  data: {},
  reducerName: sustainableReducer,
  loadingState: "configConstantsIsLoading",
  actualState: "configConstants",
};

// Configuration for API testing of fetching project count API data
const getConfigConstantsApiTestData = {
  serviceName: "getConfigConstants",
  method: "post",
  data: {},
  serviceImport: sustainService,
  route: `${nodeUrl}get-config-constants`,
};


// Execute Redux slice tests for various data
TestFullFilledSlice({
  data: [
    graphEmissionIntensityDataObject,
    graphRegionEmissionDataObject,
    getRegionEmissionDataObject,
    getProjectCountApiDataObject,
    getConfigConstantsApiDataObject
  ],
});

// Execute API tests for various data
ApiTest({
  data: [
    graphEmissionIntensityApiTestData,
    graphRegionEmissionApiTestData,
    getRegionEmissionApiTestData,
    getProjectCountApiTestData,
    getConfigConstantsApiTestData
  ],
});

TestSliceMethod({
  data: [
    graphEmissionIntensityDataObject,
    graphRegionEmissionDataObject,
    getRegionEmissionDataObject,
    getProjectCountApiDataObject,
    getConfigConstantsApiDataObject
  ],
});


// Test case initialState
describe('initial reducer', () => {
  it('should reset state to initialState when resetScopeOneCommonData is called', () => {
    const modifiedState: any = {
      data: [{ id: 1, value: 'test' }],
      loading: true,
      error: 'Something went wrong',
    };

    const result = sustainableReducer.reducer(modifiedState, resetSustain());

    expect(result).toEqual(initialState);


  });
});


describe("setShowPasswordExpire Thunk", () => {
  it("should return the correct status when dispatched", async () => {
    const status = true;
    // Dispatch the thunk action
    const result = await store.dispatch(setShowPasswordExpire(status));
    expect(result.payload).toBe(status);
  });
});

describe("isLoadingDashboard Thunk", () => {
  it("should return the correct status when dispatched", async () => {
    const status = true;
    // Dispatch the thunk action
    const result = await store.dispatch(isLoadingDashboard(status));
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
describe("test lane view ", () => {
  let useDispatchMock: jest.Mock;
  let useSelectorMock: jest.Mock;
  let stores: EnhancedStore;
  const navigate = jest.fn();
  beforeEach(() => {
    stores = configureStore({
      reducer: {
        sustain: sustainableReducer?.reducer,
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

  const renderSustainView = async () => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <SustainView />
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };

  //section id.....
  it(`<section> test case for whole page `, async () => {
    await renderSustainView();
    expect(screen.getByTestId("sustain-view")).toBeInTheDocument();
  });

  //title
  it(`Emission Reduction Title `, async () => {
    await renderSustainView();
    expect(screen.getByTestId("emission-reduction-title")).toBeInTheDocument();
  });

  //regin selectable row
  it(`region dropdown `, async () => {
    useSelectorMock.mockReturnValue({
      emissionIntensityDetailsIsLoading: false,
      regions: {
        data: regionMockdata,
      },
    });
    await renderSustainView();
    expect(screen.getByLabelText("regions-data-dropdown")).toBeInTheDocument();
    userEvent.click(screen.getByLabelText("regions-data-dropdown"));
    const regionData = await screen.findByText("R1");
    userEvent.click(regionData);
    // expect(navigate).toHaveBeenCalledWith("/regional-level");
  });

  //year selectable row
  it(`year dropdown `, async () => {
    useSelectorMock.mockReturnValue({
      emissionDates: yearMockData,
    });

    await renderSustainView();
    const dropdown = screen.getByLabelText("year-dropdown");
    userEvent.click(dropdown);
    const option = await screen.findByText("2021");
    userEvent.click(option);
  });

  //sustainable card test cases
  it(`sustainable Cards data `, async () => {
    useSelectorMock.mockReturnValue({
      configConstants: {
        data: sustainCardMockData,
      },
    });

    await renderSustainView();

    expect(screen.getByTestId("card-1")).toBeInTheDocument();
    expect(screen.getByTestId("card-2")).toBeInTheDocument();
    expect(screen.getByTestId("card-3")).toBeInTheDocument();
  });

  //total emission rpg graph
  it(`RPG graph data test case for total emission Region`, async () => {
    useSelectorMock.mockReturnValue({
      // checkedEmissionsReductionGlide: false,
      // toggleBtn:true,
      regionEmission: {
        data: RPGgraphMockDataTotalEmission,
      },
    });

    await renderSustainView();
    expect(screen.getByTestId("RPG-graph-data")).toBeInTheDocument();
    const totalEmissionRadioToggle = screen.getByTestId("total-emission-toggle") as HTMLInputElement;
    expect(totalEmissionRadioToggle).toBeInTheDocument();
    expect(totalEmissionRadioToggle.checked).toBe(true);
    // userEvent.click(totalEmissionRadioToggle);
  });


  //RPG graph emission region test cases
  it(`RPG graph data test case for Emission Region`, async () => {
    useSelectorMock.mockReturnValue({
      checkedEmissionsReductionGlide: false,
      regionEmission: {
        data: RPGgraphMockDataEmissionRegion,
      },
    });

    await renderSustainView();
    expect(screen.getByTestId("RPG-graph-data")).toBeInTheDocument();
    const emissionRadioToggle = screen.getByTestId(
      "emission-intensity-toggle"
    ) as HTMLInputElement;
    expect(emissionRadioToggle).toBeInTheDocument();
    userEvent.click(emissionRadioToggle);
    expect(emissionRadioToggle.checked).toBe(true);
  });



  //highchart emission region test cases
  it(`high chart emission intensity data test case `, async () => {
    useSelectorMock.mockReturnValue({
      emissionIntensityDetails: {
        data: HighChartEmissionIntesnsityMockData,
      },
    });

    await renderSustainView();
    expect(
      screen.getByTestId("high-chart-emission-intensity")
    ).toBeInTheDocument();
  });

  //emission intensity by region
  it(`high chart emission intensity by region data test case `, async () => {
    useSelectorMock.mockReturnValue({
      graphRegionChart: {
        data: HighChartEmissionIntesnsityByRegionMockData,
      },
    });

    await renderSustainView();
    expect(
      screen.getByTestId("high-chart-emission-intensity-by-region")
    ).toBeInTheDocument();
  });

  //project count chart
  it(`high chart emission intensity by region data test case `, async () => {
    useSelectorMock.mockReturnValue({
      projectCountData: {
        data: projectCountMockData,
      },
    });

    await renderSustainView();
    expect(screen.getByTestId("project-count-data")).toBeInTheDocument();
  });

  //loading states for full page
  it(`all charts and cards loading states test cases`, async () => {
    useSelectorMock.mockReturnValue({
      configConstantsIsLoading: true,
      regionEmissionIsLoading: true,
      emissionIntensityDetailsIsLoading: true,
      isLoadingGraphRegionEmission: true,
      isLoadingProjectCount: true,
    });

    await renderSustainView();
    //cards loader
    expect(screen.getByTestId("card-1-loader")).toBeInTheDocument();
    expect(screen.getByTestId("card-2-loader")).toBeInTheDocument();
    expect(screen.getByTestId("card-3-loader")).toBeInTheDocument();
    expect(screen.getByTestId("RPG-graph-data-loading")).toBeInTheDocument();
    expect(
      screen.getByTestId("high-chart-emission-intensity-loader")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("emission-intensity-by-region-loader")
    ).toBeInTheDocument();
    expect(screen.getByTestId("project-count-data-loader")).toBeInTheDocument();
  });

  //Modal Test cases
  it(`Custom modal testcases for password expiry update button`, async () => {
    useSelectorMock.mockReturnValue({
      isShowPasswordExpire: true,
      loginDetails: { data: authDataWithPasswordExpiry?.userdata }
    });
    await renderSustainView();
    expect(screen.getByTestId("custom-modal-password")).toBeInTheDocument();
    expect(screen.getByTestId("update-button")).toBeInTheDocument();
    userEvent.click(screen.getByTestId("update-button"));
    expect(navigate).toHaveBeenCalledWith("/scope3/settings");
    // expect(screen.getByTestId("close-button")).toBeInTheDocument();
  });

  it(`Custom modal testcases for password expiry close button`, async () => {
    useSelectorMock.mockReturnValue({
      isShowPasswordExpire: true,
      loginDetails: { data: authDataWithPasswordExpiry?.userdata }
    });
    await renderSustainView();
    expect(screen.getByTestId("custom-modal-password")).toBeInTheDocument();
    expect(screen.getByTestId("close-button")).toBeInTheDocument();
    userEvent.click(screen.getByTestId("close-button"));

  });
});
