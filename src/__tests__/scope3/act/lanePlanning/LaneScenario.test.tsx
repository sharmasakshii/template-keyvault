import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as router from "react-router-dom";
import * as reactRedux from "react-redux";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import {
  getLaneScenarioDetail,
  getLaneSortestPath,
  laneDetailsReducer,
} from "store/scopeThree/track/lane/laneDetailsSlice";
import LaneSuggestionView from "pages/lanePlanning/LanePlanningView";

import userEvent from "@testing-library/user-event";
import { authMockData } from "mockData/commonMockData.json";
import { authDataReducer } from "store/auth/authDataSlice";
import {
  emailInviteMockData,
  emailMockData,
  laneMockDestinationData,
  laneMockOriginData,
  laninngCardMockData,
  lanningCardMockDataShortPath,
  recommendedData,
} from "../../../../mockData/laneMockData.json";

import {
  ApiTest,
  TestFullFilledSlice,
  TestSliceMethod,
} from "commonCase/ReduxCases";
import laneService from "store/scopeThree/track/lane/laneService";
import { nodeUrl } from "constant"

const laneShortestPath = {
  name: "COLTON, CA_CHEYENNE, WY",
};
const laneScenarioPathPayload = {
  name: "COLTON, CA_CHEYENNE, WY",
  fromDate: "2023-01-01",
  toDate: "2023-03-31",
};

// Configuration for API testing of fetching table data

const laneShortestPathDetail = {
  serviceName: "getLaneSortestPathApi",
  method: "post",
  data: laneShortestPath,
  serviceImport: laneService,
  route: `${nodeUrl}alternate-k-shortest-path`,
};
const laneScenarioDetail = {
  serviceName: "getLaneScenarioDetailApi",
  method: "post",
  data: laneScenarioPathPayload,
  serviceImport: laneService,
  route: `${nodeUrl}get-lane-scenario-detail`,
};

const laneShortestPathSlice = {
  service: laneService,
  serviceName: "getLaneSortestPathApi",
  sliceName: "getLaneSortestPath",
  sliceImport: getLaneSortestPath,
  data: laneShortestPath,
  reducerName: laneDetailsReducer,
  loadingState: "laneSortestPathLoading",
  isSuccess: "isSuccess",
  actualState: "laneSortestPathData",
};
const laneScenarioDetailSlice = {
  service: laneService,
  serviceName: "getLaneScenarioDetailApi",
  sliceName: "getLaneScenarioDetail",
  sliceImport: getLaneScenarioDetail,
  data: laneScenarioPathPayload,
  reducerName: laneDetailsReducer,
  loadingState: "isLaneScenarioDetailLoading",
  isSuccess: "isSuccess",
  actualState: "laneScenarioDetail",
};

// Configuration for rendering a specific page/component

// Execute Redux slice tests for table data

TestFullFilledSlice({ data: [laneShortestPathSlice, laneScenarioDetailSlice] });

// Execute API test for table data
ApiTest({
  data: [laneShortestPathDetail, laneScenarioDetail],
});

TestSliceMethod({
  data: [laneShortestPathSlice, laneScenarioDetailSlice],
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

  const renderLaneSuggestionView = async() => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <LaneSuggestionView />
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };

  beforeEach(() => {
    stores = configureStore({
      reducer: {
        lane: laneDetailsReducer?.reducer,
        auth: authDataReducer.reducer,
      },
    });

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

  //section id.....
  it(`<section> test case for whole page `, async() => {
    await renderLaneSuggestionView();
    expect(screen.getByTestId("lane-planning")).toBeInTheDocument();
  });

  // selectable dropdown test cases
  it(`destination and origin select dropdown to enable/disable view lane calculation button`, async() => {
    useSelectorMock.mockReturnValue({
      laneOriginData: {
        data: laneMockOriginData,
      },

      laneDestinationData: {
        data: laneMockDestinationData,
      },
      laneSortestPathData: {},
    });
    await renderLaneSuggestionView();
    const viewLaneBtn = screen.getByTestId("view-lane-calculation-button");
    expect(viewLaneBtn).toBeInTheDocument();

    const originDropDown = screen.getByLabelText("origin-dropdown");
    expect(originDropDown).toBeInTheDocument();
    fireEvent.click(originDropDown);
    expect(screen.getByText("VALDOSTA, GA")).toBeInTheDocument();
    fireEvent.click(screen.getByText("VALDOSTA, GA"));
    expect(screen.getByText("VALDOSTA, GA")).toBeInTheDocument();
    
    const desDropDown = screen.getByLabelText("destination-dropdown");
    expect(desDropDown).toBeInTheDocument();
    fireEvent.click(desDropDown);
    expect(screen.getByText("HOUMA, LA")).toBeInTheDocument();
    fireEvent.click(screen.getByText("HOUMA, LA"));
    expect(screen.getByText("VALDOSTA, GA")).toBeInTheDocument();

    expect(viewLaneBtn).toBeEnabled();
    fireEvent.click(viewLaneBtn);
  });

  //click on arrow buttons
  it(`click on up-down arrow so destination and origin select dropdown are interchange`, async() => {
    useSelectorMock.mockReturnValue({
      laneOriginData: {
        data: laneMockOriginData,
      },

      laneDestinationData: {
        data: laneMockDestinationData,
      },
      laneSortestPathData: {},
    });
    await renderLaneSuggestionView();

    const originDropDown = screen.getByLabelText("origin-dropdown");
    expect(originDropDown).toBeInTheDocument();
    fireEvent.click(originDropDown);
    expect(screen.getByText("VALDOSTA, GA")).toBeInTheDocument();
    fireEvent.click(screen.getByText("VALDOSTA, GA"));
    expect(screen.getByText("VALDOSTA, GA")).toBeInTheDocument();

    const desDropDown = screen.getByLabelText("destination-dropdown");
    expect(desDropDown).toBeInTheDocument();
    fireEvent.click(desDropDown);
    expect(screen.getByText("HOUMA, LA")).toBeInTheDocument();
    fireEvent.click(screen.getByText("HOUMA, LA"));
    expect(screen.getByText("VALDOSTA, GA")).toBeInTheDocument();

    const upDownArrows = screen.getByTestId("upDown-arrows");
    expect(upDownArrows).toBeInTheDocument();
    userEvent.click(upDownArrows);
  });

  //Prioritize Results By Checkboxes test cases
  it(`priority filter checkboxes case for enable/disable view lane calculatin button`, async() => {
    await renderLaneSuggestionView();

    const viewLaneBtn = screen.getByTestId("view-lane-calculation-button");
    const emissionCheckBox = screen.getByTestId("emission-id") as HTMLInputElement;
    const timeCheckBox = screen.getByTestId("time-id") as HTMLInputElement;
    const costCheckBox = screen.getByTestId("cost-id") as HTMLInputElement;
    const distanceCheckBox = screen.getByTestId("distance-id") as HTMLInputElement;
    const prioritFilterError = screen.getByTestId("priority-errors");
    expect(screen.getByTestId("priority-filter-id")).toBeInTheDocument();
    expect(emissionCheckBox).toBeInTheDocument();
    expect(costCheckBox).toBeInTheDocument();
    expect(timeCheckBox).toBeInTheDocument();
    expect(distanceCheckBox).toBeInTheDocument();

    expect(emissionCheckBox.checked).toBe(true);
    userEvent.click(emissionCheckBox);
    expect(emissionCheckBox.checked).toBe(false);

    expect(costCheckBox.checked).toBe(true);
    userEvent.click(costCheckBox);
    expect(costCheckBox.checked).toBe(false);

    expect(timeCheckBox.checked).toBe(true);
    userEvent.click(timeCheckBox);
    expect(timeCheckBox.checked).toBe(false);

    expect(distanceCheckBox.checked).toBe(true);
    userEvent.click(distanceCheckBox);
    expect(distanceCheckBox.checked).toBe(false);
    expect(prioritFilterError).toBeInTheDocument();
    
  });

  //Filters checkbox test cases
  it(`Filter checkboxes case for enable/disable view lane calculatin button`, async() => {
    await renderLaneSuggestionView()

    const viewLaneBtn = screen.getByTestId("view-lane-calculation-button");
    const highwayCheckBox = screen.getByTestId("highway-id") as HTMLInputElement;
    const railCheckBox = screen.getByTestId("rail-id") as HTMLInputElement;
    const filterError = screen.getByTestId("filter-errors");

    expect(screen.getByTestId("priority-filter-id")).toBeInTheDocument();
    expect(highwayCheckBox).toBeInTheDocument();
    expect(railCheckBox).toBeInTheDocument();

    expect(highwayCheckBox.checked).toBe(true);
    userEvent.click(highwayCheckBox);
    expect(highwayCheckBox.checked).toBe(false);

    expect(railCheckBox.checked).toBe(true);
    userEvent.click(railCheckBox);
    expect(railCheckBox.checked).toBe(false);

    expect(filterError).toBeInTheDocument();
    
  });

  //recommendation card test cases
  it(`recomenadtion card div test case for whole page `, async() => {
    useSelectorMock.mockReturnValue({
      laneOriginData: {
        data: laneMockOriginData,
      },

      laneDestinationData: {
        data: laneMockDestinationData,
      },
      laneSortestPathData: {
        data: lanningCardMockDataShortPath,
      },
      laneScenarioDetail: {
        data: laninngCardMockData,
      },
    });
    await renderLaneSuggestionView();
    const viewLaneBtn = screen.getByTestId("view-lane-calculation-button");
    const originDropDown = screen.getByLabelText("origin-dropdown");
    expect(originDropDown).toBeInTheDocument();
    fireEvent.click(originDropDown);
    expect(screen.getByText("VALDOSTA, GA")).toBeInTheDocument();
    fireEvent.click(screen.getByText("VALDOSTA, GA"));
    expect(screen.getByText("VALDOSTA, GA")).toBeInTheDocument();
   

    const desDropDown = screen.getByLabelText("destination-dropdown");
    expect(desDropDown).toBeInTheDocument();
    fireEvent.click(desDropDown);
    expect(screen.getByText("HOUMA, LA")).toBeInTheDocument();
    fireEvent.click(screen.getByText("HOUMA, LA"));
    expect(screen.getByText("VALDOSTA, GA")).toBeInTheDocument();

    expect(viewLaneBtn).toBeEnabled();
    const highwayCheckBox = screen.getByTestId("highway-id") as HTMLInputElement;
    const railCheckBox = screen.getByTestId("rail-id") as HTMLInputElement;
    const filterError = screen.getByTestId("filter-errors");

    expect(screen.getByTestId("priority-filter-id")).toBeInTheDocument();
    expect(highwayCheckBox).toBeInTheDocument();
    expect(railCheckBox).toBeInTheDocument();

    expect(highwayCheckBox.checked).toBe(true);
    userEvent.click(highwayCheckBox);
    expect(highwayCheckBox.checked).toBe(false);

    expect(railCheckBox.checked).toBe(true);
    userEvent.click(railCheckBox);
    expect(railCheckBox.checked).toBe(false);

    expect(filterError).toBeInTheDocument();
    

    userEvent.click(railCheckBox);
    expect(railCheckBox.checked).toBe(true);
    expect(viewLaneBtn).toBeEnabled();
    fireEvent.click(viewLaneBtn);

    expect(screen.getByTestId("recommendation-card")).toBeInTheDocument();
    expect(screen.getByTestId("back-to-input")).toBeInTheDocument();
    recommendedData.forEach((ele, index) => {
      expect(
        screen.getByTestId(`recommendation-card-accordion-${index}`)
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`create-project-btn ${index}`)
      ).toBeInTheDocument();
      userEvent.click(screen.getByTestId(`create-project-btn ${index}`));
    });
  });

  //test cases for create page
  it(`create new project modal page `, async() => {
    useSelectorMock.mockReturnValue({
      laneOriginData: {
        data: laneMockOriginData,
      },

      laneDestinationData: {
        data: laneMockDestinationData,
      },
      laneSortestPathData: {
        data: lanningCardMockDataShortPath,
      },
      laneScenarioDetail: {
        data: laninngCardMockData,
      },
      searchedUsers: {
        data: emailMockData,
      },
      checkLaneFuelData: {
        data: {
          results: [{isValid: 1}]
        },
      }
    });
    await renderLaneSuggestionView();
    const viewLaneBtn = screen.getByTestId("view-lane-calculation-button");
    const originDropDown = screen.getByLabelText("origin-dropdown");
    expect(originDropDown).toBeInTheDocument();
    fireEvent.click(originDropDown);
    expect(screen.getByText("VALDOSTA, GA")).toBeInTheDocument();
    fireEvent.click(screen.getByText("VALDOSTA, GA"));
    expect(screen.getByText("VALDOSTA, GA")).toBeInTheDocument();

    const desDropDown = screen.getByLabelText("destination-dropdown");
    expect(desDropDown).toBeInTheDocument();
    fireEvent.click(desDropDown);
    expect(screen.getByText("HOUMA, LA")).toBeInTheDocument();
    fireEvent.click(screen.getByText("HOUMA, LA"));
    expect(screen.getByText("VALDOSTA, GA")).toBeInTheDocument();

    expect(viewLaneBtn).toBeEnabled();
    const highwayCheckBox = screen.getByTestId("highway-id") as HTMLInputElement;
    const railCheckBox = screen.getByTestId("rail-id") as HTMLInputElement;
    const filterError = screen.getByTestId("filter-errors");

    expect(screen.getByTestId("priority-filter-id")).toBeInTheDocument();
    expect(highwayCheckBox).toBeInTheDocument();
    expect(railCheckBox).toBeInTheDocument();

    expect(highwayCheckBox.checked).toBe(true);
    userEvent.click(highwayCheckBox);
    expect(highwayCheckBox.checked).toBe(false);

    expect(railCheckBox.checked).toBe(true);
    userEvent.click(railCheckBox);
    expect(railCheckBox.checked).toBe(false);

    expect(filterError).toBeInTheDocument();


    userEvent.click(railCheckBox);
    expect(railCheckBox.checked).toBe(true);
    expect(viewLaneBtn).toBeEnabled();
    fireEvent.click(viewLaneBtn);

    expect(screen.getByTestId("recommendation-card")).toBeInTheDocument();
    expect(screen.getByTestId("back-to-input")).toBeInTheDocument();

    recommendedData.forEach(async (ele, index) => {
      expect(
        screen.getByTestId(`recommendation-card-accordion-${index}`)
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`create-project-btn ${index}`)
      ).toBeInTheDocument();
      act(() => {
        userEvent.click(screen.getByTestId(`create-project-btn ${index}`));
      });
      expect(screen.getByTestId("create-modal-project")).toBeInTheDocument();
      expect(
        screen.getByLabelText("project-manager-dropdown")
      ).toBeInTheDocument();
      userEvent.click(screen.getByLabelText("project-manager-dropdown"));
      const projectManagerData = await screen.findByText(
        "vermaganesh@greensight.ai"
      );
      userEvent.click(projectManagerData);
      expect(screen.getByText("vermaganesh@greensight.ai")).toBeInTheDocument();

      expect(
        screen.getByLabelText("email-address-dropdown")
      ).toBeInTheDocument();
      userEvent.click(screen.getByLabelText("email-address-dropdown"));

      useSelectorMock.mockReturnValue({
        invitedUser: {
          data: emailInviteMockData,
        },
      });
      const emailData = await screen.findByText("testabdevec12@yopmail.com");

     act(async()=>{
      userEvent.click(emailData);
      await expect(screen.getByTestId("delete-email-id")).toBeInTheDocument();
      userEvent.click(screen.getByTestId("delete-email-id"))
      expect(screen.findByText("testabdevec12@yopmail.com")).not.toBeInTheDocument()
     }) 

      expect(screen.getByTestId("start-date")).toBeInTheDocument();
      expect(screen.getByTestId("end-date")).toBeInTheDocument();
      expect(screen.getByTestId("project-desc")).toBeInTheDocument();
      expect(screen.getByTestId("save-and-create-btn")).toBeInTheDocument()

      act(()=>{
        userEvent.click(screen.getByTestId("save-and-create-btn"));
      })
    });
    
  });

});
