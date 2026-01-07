// Import necessary modules and components
import sustainService from "../../../../store/sustain/sustainService";
import commonService from "../../../../store/commonData/commonService";
import {
  ApiTest,
  TestFullFilledSlice,
  TestSliceMethod,
} from "../../../../commonCase/ReduxCases";

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
import RegionalLevelView from "pages/regionalLevel/RegionalLevelView";
import {
  sustainableReducer,
  graphRegionEmission,
  emissionRegionDetails,
} from "store/sustain/sustainSlice";
import {
  commonDataReducer,
  getProjectCount,
  graphEmissionIntensity,
} from "store/commonData/commonSlice";
import { regionOverviewReducer } from "store/scopeThree/track/region/regionOverviewSlice";
import { regionDataReducer } from "store/scopeThree/track/region/regionSlice";
import { laneDetailsReducer } from "store/scopeThree/track/lane/laneDetailsSlice";
import { dashRegionReducer } from "store/dashRegion/dashRegionSlice";
import { authMockData, pepAuthMockData, authPMockData, regionMockdata, yearMockData, divisionMockdata } from "mockData/commonMockData.json";
import {
  HighChartEmissionIntesnsityByRegionMockData,
  HighChartEmissionIntesnsityMockData,
  RPGgraphMockDataEmissionRegion,
  RPGgraphMockDataTotalEmission,
  businessMockData,
  carrierMockData,
  facilityMockData,
  laneEmissionMocakData,
  projectCountMockData,
  regionEmissionMockData,
  regionalCardMockData,
  totalBusinssMockData,
  totalFacilityMockData,
  totalLaneEmissionMocakData,
  totalRegionEmissionMockData
} from "../../../../mockData/regionalMockData.json";
import userEvent from "@testing-library/user-event";
import { nodeUrl } from "constant"

// Payload for fetching graph emission intensity
const graphEmissionIntensityPayload = {
  quarter: 1,
  toggel: 1,
  year: 2023,
  region_id: "4",
};

// Payload for posting graph region emission data
const graphRegionEmissionPayload = {
  region_id: "4",
  company_id: "",
  year: "",
  toggel_data: 0,
  quarter: 1,
};

// Payload for fetching region quarterly data
const regionQuartelyGetPayload = {
  year: 2023,
  toggel: 0,
  quarter: 1,
  region_id: "4",
};

// Payload for fetching project count data via API
const getProjectCountApiPayload = {
  region_id: 4,
  year: 2023,
};

// Payload for posting region-level glide path
const postRegionLevelGlidePathPayload = {
  region_id: 4,
  company_id: "",
  year: 2022,
  toggel_data: 0,
};

// Configuration for posting region-level glide path data via Redux
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

// Configuration for fetching project count data via Redux
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

// Configuration for API testing of fetching project count data
const getProjectCountApiTestData = {
  serviceName: "getProjectCountApi",
  method: "post",
  data: getProjectCountApiPayload,
  serviceImport: commonService,
  route: `${nodeUrl}get-project-count`,
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

// Execute Redux slice tests for various data
TestFullFilledSlice({
  data: [
    graphEmissionIntensityDataObject,
    postRegionLevelGlidePathDataObject,
    getProjectCountApiDataObject,
    graphRegionEmissionDataObject,
  ],
});

// Execute API tests for various data
ApiTest({
  data: [
    graphEmissionIntensityApiTestData,
    postRegionLevelGlidePathApiTestData,
    getProjectCountApiTestData,
    graphRegionEmissionApiTestData,
  ],
});

TestSliceMethod({
  data: [
    graphEmissionIntensityDataObject,
    postRegionLevelGlidePathDataObject,
    getProjectCountApiDataObject,
    graphRegionEmissionDataObject,
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

window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe("testcases for regional level page ", () => {
  let useDispatchMock: jest.Mock;
  let useSelectorMock: jest.Mock;
  let stores: EnhancedStore;
  let auth: any;

  const navigate = jest.fn();
  beforeEach(() => {
    stores = configureStore({
      reducer: {
        commonData: commonDataReducer?.reducer,
        regionOverview: regionOverviewReducer?.reducer,
        region: regionDataReducer?.reducer,
        regionDash: dashRegionReducer?.reducer,
        lane: laneDetailsReducer?.reducer,
        sustain: sustainableReducer?.reducer,
      },
    });
    jest
      .spyOn(router, "useNavigate")
      .mockImplementation(() => navigate) as jest.Mock;

    useSelectorMock = jest
      .spyOn(utils, "useAppSelector")
      .mockReturnValue({}) as jest.Mock;
    useDispatchMock = jest.spyOn(utils, "useAppDispatch") as jest.Mock;

    useSelectorMock.mockReturnValue({
      isRegion: false,
      isLane: false,
      isCarrier: false,
      isFacility: false,
      isBusinessUnit: false,
    });

    auth = jest.spyOn(tem, "useAuth");
    const mockDispatch = jest.fn();
    useDispatchMock.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    cleanup();
  });
  const regionLevelRender = async () => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <RegionalLevelView />
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };

  const handelModal = () => {
    expect(screen.getByTestId("modal-open")).toBeInTheDocument();
    expect(screen.getByTestId("modal-header")).toBeInTheDocument();
    expect(screen.getByTestId("modal-body")).toBeInTheDocument();
  };

  it(`<section> test case for whole page `, async () => {
    auth.mockReturnValue(authMockData);
    await regionLevelRender();
    expect(screen.getByTestId("region-level")).toBeInTheDocument();
  });

  //regin selectable row
  it(`region dropdown `, async () => {
    auth.mockReturnValue(authMockData);
    useSelectorMock.mockReturnValue({
      loginDetails: {
        data: authMockData?.userdata
      },
      regionalId: "1",
      configConstants: {
        data: {
          DEFAULT_YEAR: 2024,
          rd_radius: 20,
          DEFAULT_REDUCTION_YEAR: 2024
        }
      },
      isFacility: true,
      isBusinessUnit: true,
      isFuel: true,
      isVehicle: true,
      isLane: true,
      regions: {
        data: regionMockdata,
      },
      divisions: {
        data: divisionMockdata
      }
    });
    await regionLevelRender();

    expect(screen.getByLabelText("regions-data-dropdown")).toBeInTheDocument();

    userEvent.click(screen.getByLabelText("regions-data-dropdown"));

    const regionData = await screen.findByText("R2");
    userEvent.click(regionData);

    expect(screen.getByLabelText("divison-dropdown")).toBeInTheDocument();
    userEvent.click(screen.getByLabelText("divison-dropdown"));
    const optionDivision = await screen.findByText("OUTBOUND-Test");
    userEvent.click(optionDivision);

  });

  //year selectable row
  it(`year dropdown `, async () => {
    auth.mockReturnValue(authMockData);
    useSelectorMock.mockReturnValue({
      emissionDates: yearMockData,
    });

    await regionLevelRender();
    const dropdown = screen.getByLabelText("year-dropdown");
    userEvent.click(dropdown);
    const option = await screen.findByText("2021");
    userEvent.click(option);
  });

  //quarterly selectable row
  it(`quarter dropdown `, async () => {
    auth.mockReturnValue(authMockData);
    await regionLevelRender();
    expect(screen.getByLabelText("quarter-dropdown")).toBeInTheDocument();
    await act(async () => {
      userEvent.click(screen.getByLabelText("quarter-dropdown"));
    });
    const regionData = await screen.findByText("Q1");
    await act(async () => {
      userEvent.click(regionData);
    });
  });

  it(`close modal `, async () => {
    auth.mockReturnValue(authMockData);
    await regionLevelRender();
    const additionalDataBtn = screen.getByTestId("add-additional-btn");

    await act(async () => {
      fireEvent.click(additionalDataBtn);
    });
    const closeButton = screen.getByRole("button", { name: /close/i });
    userEvent.click(closeButton);

    await act(async () => {
      fireEvent.click(additionalDataBtn);
    });
    const closeModalDataBtn = screen.getByTestId("modal-open");
    userEvent.click(closeModalDataBtn);


  });


  it(`Add additional data button to show modal select checkbox regional overview and show chart`, async () => {
    auth.mockReturnValue(authMockData);
    await regionLevelRender();
    const additionalDataBtn = screen.getByTestId("add-additional-btn");

    await act(async () => {
      fireEvent.click(additionalDataBtn);
    });
    expect(additionalDataBtn).toBeInTheDocument();

    handelModal();

    const applyButton = screen.getByTestId("apply-btn");
    const regionCheckbox: HTMLInputElement = screen.getByTestId(
      "regional-checkbox"
    );
    expect(regionCheckbox).toBeInTheDocument();
    expect(regionCheckbox.checked).toBe(false);
    await act(async () => {
      fireEvent.click(regionCheckbox);
    });
    expect(regionCheckbox.checked).toBe(true);
    expect(applyButton).toBeEnabled();
    await act(async () => {
      fireEvent.click(applyButton);
    });
    useSelectorMock.mockReturnValue({
      isRegion: true,
      regionGraphDetails: {
        data: totalRegionEmissionMockData,
      },
    });
    await regionLevelRender();

    expect(screen.getByTestId("regional-emission")).toBeInTheDocument();

    const totalEmissionToggle: HTMLInputElement = screen.getByTestId(
      "total-region-emission-toggle"
    );
    expect(totalEmissionToggle).toBeInTheDocument();
    expect(totalEmissionToggle.checked).toBe(true);

    const emissionToggle: HTMLInputElement = screen.getByTestId(
      "region-emission-toggle"
    );
    expect(emissionToggle).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(emissionToggle);
    });

    useSelectorMock.mockReturnValue({
      isRegion: true,
      regionGraphDetails: {
        data: regionEmissionMockData,
      },
    });
    expect(totalEmissionToggle.checked).toBe(false);
    expect(emissionToggle.checked).toBe(true);
  }, 10000);

  it(`Add additional data button to show modal select checkbox by lane and show chart`, async () => {
    auth.mockReturnValue(authMockData);
    await regionLevelRender();
    const additionalDataBtn = screen.getByTestId("add-additional-btn");

    await act(async () => {
      fireEvent.click(additionalDataBtn);
    });
    expect(additionalDataBtn).toBeInTheDocument();

    handelModal();

    const applyButton = screen.getByTestId("apply-btn");

    const laneCheckbox: HTMLInputElement = screen.getByTestId("lane-checkbox");
    expect(laneCheckbox).toBeInTheDocument();
    expect(laneCheckbox.checked).toBe(false);
    await act(async () => {
      fireEvent.click(laneCheckbox);
    });
    expect(laneCheckbox.checked).toBe(true);
    expect(applyButton).toBeEnabled();
    await act(async () => {
      fireEvent.click(applyButton);
    });
    useSelectorMock.mockReturnValue({
      isLane: true,
      laneGraphDetails: {
        data: totalLaneEmissionMocakData,
      },
    });
    await regionLevelRender();

    expect(screen.getByTestId("lane-by")).toBeInTheDocument();

    const totalEmissionToggle: HTMLInputElement = screen.getByTestId(
      "total-lane-emission-toggle"
    );
    expect(totalEmissionToggle).toBeInTheDocument();
    expect(totalEmissionToggle.checked).toBe(true);

    const emissionToggle: HTMLInputElement = screen.getByTestId(
      "lane-emission-toggle"
    );
    expect(emissionToggle).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(emissionToggle);
    });

    useSelectorMock.mockReturnValue({
      isLane: true,
      laneGraphDetails: {
        data: laneEmissionMocakData,
      },
    });
    expect(totalEmissionToggle.checked).toBe(false);
    expect(emissionToggle.checked).toBe(true);
  }, 10000);

  it(`Add additional data button to show modal select checkbox by carrier and show table`, async () => {
    auth.mockReturnValue(authMockData);
    await regionLevelRender();
    const additionalDataBtn = screen.getByTestId("add-additional-btn");

    await act(async () => {
      fireEvent.click(additionalDataBtn);
    });
    expect(additionalDataBtn).toBeInTheDocument();

    handelModal();

    const applyButton = screen.getByTestId("apply-btn");

    const carrierCheckbox: HTMLInputElement = screen.getByTestId(
      "carrier-checkbox"
    );
    expect(carrierCheckbox).toBeInTheDocument();
    expect(carrierCheckbox.checked).toBe(false);
    await act(async () => {
      fireEvent.click(carrierCheckbox);
    });
    expect(carrierCheckbox.checked).toBe(true);
    expect(applyButton).toBeEnabled();
    await act(async () => {
      fireEvent.click(applyButton);
    });
    useSelectorMock.mockReturnValue({
      isCarrier: true,
      vendorTableDetails: {
        data: carrierMockData,
      },
    });
    await regionLevelRender();

    expect(screen.getByTestId("performance-heading")).toBeInTheDocument();
    expect(screen.getByTestId("get-table")).toBeInTheDocument();



    const carrrierName = screen.getByTestId("carrier-name");
    await act(async () => {
      fireEvent.click(carrrierName);
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

  it(`Add additional data button to show modal select checkbox by facility and show chart`, async () => {
    useSelectorMock.mockReturnValue({
      loginDetails:{data:authPMockData?.userdata}
    });
    await regionLevelRender();
    const additionalDataBtn = screen.getByTestId("add-additional-btn");

    await act(async () => {
      fireEvent.click(additionalDataBtn);
    });
    expect(additionalDataBtn).toBeInTheDocument();

    handelModal();

    const applyButton = screen.getByTestId("apply-btn");
    const facilityCheckbox: HTMLInputElement = screen.getByTestId("facility-checkbox");
    expect(facilityCheckbox).toBeInTheDocument();
    expect(facilityCheckbox.checked).toBe(false);
    await act(async () => {
      fireEvent.click(facilityCheckbox);
    });
    expect(facilityCheckbox.checked).toBe(true);
    expect(applyButton).toBeEnabled();
    await act(async () => {
      fireEvent.click(applyButton);
    });
    useSelectorMock.mockReturnValue({
      isFacility: true,
      regionFacilityEmissionDto: {
        data: totalFacilityMockData,
      },
    });
    await regionLevelRender();

    expect(screen.getByTestId("facility-by")).toBeInTheDocument();

    const totalEmissionToggle: HTMLInputElement = screen.getByTestId(
      "total-facility-emission-toggle"
    );
    expect(totalEmissionToggle).toBeInTheDocument();
    expect(totalEmissionToggle.checked).toBe(true);

    const emissionToggle: HTMLInputElement = screen.getByTestId(
      "facility-emission-toggle"
    );
    expect(emissionToggle).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(emissionToggle);
    });

    useSelectorMock.mockReturnValue({
      isFacility: true,
      regionFacilityEmissionDto: {
        data: facilityMockData,
      },
    });
    expect(totalEmissionToggle.checked).toBe(false);
    expect(emissionToggle.checked).toBe(true);
  });

  it(`this input checkbox type showing for pepsi company`, async () => {
    useSelectorMock.mockReturnValue({
      loginDetails: { data: pepAuthMockData?.userdata }
    });
    await regionLevelRender();
    const additionalDataBtn = screen.getByTestId("add-additional-btn");
    await act(async () => {
      fireEvent.click(additionalDataBtn);
    });
    expect(additionalDataBtn).toBeInTheDocument();

    handelModal()

    const applyButton = screen.getByTestId("apply-btn")

    const businessCheckbox: HTMLInputElement = screen.getByTestId("business-checkbox");
    expect(businessCheckbox).toBeInTheDocument();
    expect(businessCheckbox.checked).toBe(false);
    await act(async () => {
      fireEvent.click(businessCheckbox);
    })
    expect(businessCheckbox.checked).toBe(true);
    expect(applyButton).toBeEnabled();
    await act(async () => {
      fireEvent.click(applyButton)
    })
    useSelectorMock.mockReturnValue({
      isBusinessUnit: true,
      businessUnitGraphDetails: {
        data: totalBusinssMockData,
      },
    });

    await regionLevelRender();

    expect(screen.getByTestId("business-by")).toBeInTheDocument();

    const totalEmissionToggle: HTMLInputElement = screen.getByTestId(
      "total-business-emission-toggle"
    );
    expect(totalEmissionToggle).toBeInTheDocument();
    expect(totalEmissionToggle.checked).toBe(true);

    const emissionToggle: HTMLInputElement = screen.getByTestId(
      "business-emission-toggle"
    );
    expect(emissionToggle).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(emissionToggle);
    });

    useSelectorMock.mockReturnValue({
      isBusinessUnit: true,
      businessUnitGraphDetails: {
        data: businessMockData,
      },
    });
    expect(totalEmissionToggle.checked).toBe(false);
    expect(emissionToggle.checked).toBe(true);
  });

  it(`Emission Reduction Title `, async () => {
    auth.mockReturnValue(authMockData);
    await regionLevelRender();
    expect(screen.getByTestId("emission-reduction-title")).toBeInTheDocument();
  });

  //regionalLevel card test cases
  it(`regionalLevel Cards data `, async () => {
    auth.mockReturnValue(authMockData);
    useSelectorMock.mockReturnValue({
      configConstants: {
        data: regionalCardMockData,
      },
    });

    await regionLevelRender();
    expect(screen.getByTestId("card-1")).toBeInTheDocument();
    expect(screen.getByTestId("card-2")).toBeInTheDocument();
    expect(screen.getByTestId("card-3")).toBeInTheDocument();
  });

  //total emission rpg graph
  it(`RPG graph data test case for total emission Region`, async () => {
    auth.mockReturnValue(authMockData);
    useSelectorMock.mockReturnValue({
      checkedEmissionsReductionGlide: true,
      regionEmission: {
        data: RPGgraphMockDataTotalEmission,
      },
    });

    await regionLevelRender();
    expect(screen.getByTestId("RPG-graph-data")).toBeInTheDocument();
    const totalEmissionRadioToggle: HTMLInputElement = screen.getByTestId(
      "total-emission-toggle"
    );
    expect(totalEmissionRadioToggle).toBeInTheDocument();
    expect(totalEmissionRadioToggle.checked).toBe(true);
  });

  //RPG graph emission region test cases
  it(`RPG graph data test case for Emission Region`, async () => {
    auth.mockReturnValue(authMockData);
    useSelectorMock.mockReturnValue({
      checkedEmissionsReductionGlide: false,
      regionEmission: {
        data: RPGgraphMockDataEmissionRegion,
      },
    });

    await regionLevelRender();
    expect(screen.getByTestId("RPG-graph-data")).toBeInTheDocument();
    const emissionRadioToggle: HTMLInputElement = screen.getByTestId(
      "emission-intensity-toggle"
    );
    expect(emissionRadioToggle).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(emissionRadioToggle);
    });
    expect(emissionRadioToggle.checked).toBe(true);
  });

  //highchart emission region test cases
  it(`high chart emission intensity data test case `, async () => {
    auth.mockReturnValue(authMockData);
    useSelectorMock.mockReturnValue({
      emissionIntensityDetails: {
        data: HighChartEmissionIntesnsityMockData,
      },
    });

    await regionLevelRender();
    expect(
      screen.getByTestId("high-chart-emission-intensity")
    ).toBeInTheDocument();
  });

  //emission intensity by region
  it(`high chart emission intensity by region data test case `, async () => {
    auth.mockReturnValue(authMockData);
    useSelectorMock.mockReturnValue({
      graphRegionChart: {
        data: HighChartEmissionIntesnsityByRegionMockData,
      },
    });

    await regionLevelRender();
    expect(
      screen.getByTestId("high-chart-emission-intensity-by-region")
    ).toBeInTheDocument();
  });

  //project count chart
  it(`high chart emission intensity by region data test case `, async () => {
    auth.mockReturnValue(authMockData);
    useSelectorMock.mockReturnValue({
      projectCountData: {
        data: projectCountMockData,
      },
    });

    await regionLevelRender();
    expect(screen.getByTestId("project-count-data")).toBeInTheDocument();
  });

  //loading states for full page
  it(`all charts and cards loading states test cases`, async () => {
    auth.mockReturnValue(authMockData);
    useSelectorMock.mockReturnValue({
      configConstantsIsLoading: true,
      emissionIntensityDetailsIsLoading: true,
      isLoadingGraphRegionEmission: true,
      isLoadingProjectCount: true,
    });

    await regionLevelRender();
    //cards loader
    expect(screen.getByTestId("card-1-loader")).toBeInTheDocument();
    expect(screen.getByTestId("card-2-loader")).toBeInTheDocument();
    expect(screen.getByTestId("card-3-loader")).toBeInTheDocument();
    // expect(screen.getByTestId("RPG-graph-data-loading")).toBeInTheDocument();
    expect(
      screen.getByTestId("high-chart-emission-intensity-loader")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("emission-intensity-by-region-loader")
    ).toBeInTheDocument();
    expect(screen.getByTestId("project-count-data-loader")).toBeInTheDocument();
  });
});
