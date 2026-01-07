// Import necessary modules and components

import {
  decarbLineData,
  decarbReducer,
  getOptimusLanes,
  getOptimusCordinates,
  isLoadingDecarbDashboard
} from "../../../../store/scopeThree/track/decarb/decarbSlice";
import {
  ApiTest,
  TestFullFilledSlice,
  TestSliceMethod,
} from "../../../../commonCase/ReduxCases";
import DecarbView from "../../../../pages/decarb/DecarbView";
import store from "store"
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as reactRedux from "react-redux";
import * as router from "react-router-dom";
import { authDataReducer } from "store/auth/authDataSlice";
import { decarbDataGetPayload, decarbResponseData } from "../../../../mockData/decarbMockData.json";
import { authMockData } from "mockData/commonMockData.json";
import { getPriorityColor, sortList } from "utils";
import { DecarbLane } from "store/scopeThree/track/decarb/decarbInterface";
import decarbService from "store/scopeThree/track/decarb/decarbService";
import { nodeUrl } from "constant";

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

const decarbDataGetDataObject = {
  service: decarbService,
  serviceName: "decarbDataGet",
  sliceName: "decarbLineData",
  sliceImport: decarbLineData,
  data: decarbDataGetPayload,
  reducerName: decarbReducer,
  loadingState: "decarbLaneListLoading",
  isSuccess: "isSuccess",
  actualState: "decarbLaneList"
}

const decarbDataGetApiTestData = {
  serviceName: "decarbDataGet",
  method: "post",
  data: decarbDataGetPayload,
  serviceImport: decarbService,
  route: `${nodeUrl}get-recommended-levers`,
}

const getOptimusLanesDataObject = {
  service: decarbService,
  serviceName: "optimusLanesApi",
  sliceName: "getOptimusLanes",
  sliceImport: getOptimusLanes,
  data: decarbDataGetPayload,
  reducerName: decarbReducer,
  loadingState: "optimusLanesLoading",
  actualState: "optimusLanesData"
}

const optimusLanesApiTestData = {
  serviceName: "optimusLanesApi",
  method: "post",
  data: decarbDataGetPayload,
  serviceImport: decarbService,
  route: `${nodeUrl}optimus-fuel-lane`,
}

const getOptimusCordinatesDataObject = {
  service: decarbService,
  serviceName: "optimusRouteCordinates",
  sliceName: "getOptimusCordinates",
  sliceImport: getOptimusCordinates,
  data: decarbDataGetPayload,
  reducerName: decarbReducer,
  loadingState: "optimusCordinatesLoading",
  actualState: "optimusCordinatesData"
}

const optimusRouteCordinatesApiTestData = {
  serviceName: "optimusRouteCordinates",
  method: "post",
  data: decarbDataGetPayload,
  serviceImport: decarbService,
  route: `${nodeUrl}optimus-fuel-stop-data`,
}

// Execute Redux slice tests for decarb data
TestFullFilledSlice({ data: [decarbDataGetDataObject, getOptimusLanesDataObject, getOptimusCordinatesDataObject] });

// Execute API test for decarb data
ApiTest({ data: [decarbDataGetApiTestData, optimusLanesApiTestData, optimusRouteCordinatesApiTestData] });

TestSliceMethod({
  data: [decarbDataGetDataObject, getOptimusLanesDataObject, getOptimusCordinatesDataObject],
});


describe("isLoadingDecarbDashboard Thunk", () => {
  it("should return the correct status when dispatched", async () => {
    const status = true;
    // Dispatch the thunk action
    const result = await store.dispatch(isLoadingDecarbDashboard(status));
    expect(result.payload).toBe(status);
  });
});


describe("testcases for decarbView page for table and grid view", () => {
  let useDispatchMock: jest.Mock;
  let useSelectorMock: jest.Mock;
  let stores: EnhancedStore;

  const navigate = jest.fn();


  const componentRender = () => {
    return (
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <DecarbView />
          </router.MemoryRouter>
        </reactRedux.Provider>
      )
    )
  }

  const mockCommonData = () => {
    return (
      useSelectorMock.mockReturnValue({
        decarbLaneListLoading: false,
        decarbLaneList: { data: decarbResponseData },
      })
    )
  }


  beforeEach(() => {
    stores = configureStore({
      reducer: {
        decarb: decarbReducer.reducer,
        auth: authDataReducer.reducer,
      },
    });



    jest.spyOn(router, "useNavigate").mockImplementation(() => navigate) as jest.Mock
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

  it(`render decarb <section> and loading state correctly`, () => {
    useSelectorMock.mockReturnValue({
      decarbLaneListLoading: true,
    });
    componentRender();

    expect(screen.getByTestId("decarb-levers")).toBeInTheDocument();

    expect(screen.getByTestId("decarb-loading-div")).toBeInTheDocument();
  });

  it(`render deacrb page no data found`, () => {
    useSelectorMock.mockReturnValue({
      decarbLaneListLoading: false,
      decarbLaneList: { data: [] },
    });

    componentRender();

    expect(screen.getByTestId("no-data-found")).toBeInTheDocument();
  });



  it(`click on card button and navigate to card view .`, () => {
    mockCommonData();
    componentRender();
    const cardButton = screen.getByTestId("decarb-grid-card");
    const cardViewElement = screen.getByTestId("decarb-cardView");


    decarbResponseData.forEach((ele, index: number) => {
      const cardClickButton = screen.getByTestId(`click-regionid-${index}`);
      fireEvent.click(cardClickButton);
      expect(navigate).toHaveBeenCalledWith(`/scope3/decarb-problem-lanes/${ele?.region_id}`);

    });
    fireEvent.click(cardButton);
    expect(cardViewElement).toBeInTheDocument();

  });


  it(`click on grid button and showing table .`, () => {

    mockCommonData()
    componentRender()
    const gridButton = screen.getByTestId("decarb-grid-table");

    fireEvent.click(gridButton);

    expect(screen.getByTestId("decarb-table")).toBeInTheDocument();


    const priorityOrderElement = screen.getByTestId(
      "decrab-change-order-priority"
    );
    fireEvent.click(priorityOrderElement);

    sortList(decarbResponseData, "priority", "asc").forEach((ele: DecarbLane, index: number) => {
      const rowTableClickButton = screen.getByTestId(`click-row-regionid-${index}`);
      fireEvent.click(rowTableClickButton);
      expect(navigate).toHaveBeenCalledWith(`/scope3/decarb-problem-lanes/${ele?.region_id}`);
    });

    fireEvent.click(gridButton);
    fireEvent.click(priorityOrderElement);

    sortList(decarbResponseData, "priority", "desc").forEach((ele: DecarbLane, index: number) => {
      const rowTableClickButton = screen.getByTestId(`click-row-regionid-${index}`);
      fireEvent.click(rowTableClickButton);
      expect(navigate).toHaveBeenCalledWith(`/scope3/decarb-problem-lanes/${ele?.region_id}`);
    });



  });


  it(`click on intensity button for asc and desc`, () => {

    mockCommonData()
    componentRender()
    const gridButton = screen.getByTestId("decarb-grid-table");

    fireEvent.click(gridButton);

    expect(screen.getByTestId("decarb-table")).toBeInTheDocument();


    const intensityOrderElement = screen.getByTestId(
      "decrab-change-order-intensity"
    );
    fireEvent.click(intensityOrderElement);

    sortList(decarbResponseData, "intensity", "asc").forEach((ele: DecarbLane, index: number) => {
      const rowTableClickButton = screen.getByTestId(`click-row-regionid-${index}`);
      fireEvent.click(rowTableClickButton);
      expect(navigate).toHaveBeenCalledWith(`/scope3/decarb-problem-lanes/${ele?.region_id}`);
    });

    fireEvent.click(intensityOrderElement);

    sortList(decarbResponseData, "intensity", "desc").forEach((ele: DecarbLane, index: number) => {
      const rowTableClickButton = screen.getByTestId(`click-row-regionid-${index}`);
      fireEvent.click(rowTableClickButton);
      expect(navigate).toHaveBeenCalledWith(`/scope3/decarb-problem-lanes/${ele?.region_id}`);
    });

  })


  it(`click on problem lanes for asc and desc`, () => {

    mockCommonData()
    componentRender()
    const gridButton = screen.getByTestId("decarb-grid-table");

    fireEvent.click(gridButton);

    expect(screen.getByTestId("decarb-table")).toBeInTheDocument();

    const problemOrderElement = screen.getByTestId(
      "decrab-change-order-problem_lenes"
    );
    fireEvent.click(problemOrderElement);


    sortList(decarbResponseData, "problem_lanes", "asc").forEach((ele: DecarbLane, index: number) => {
      const rowTableClickButton = screen.getByTestId(`click-row-regionid-${index}`);
      fireEvent.click(rowTableClickButton);
      expect(navigate).toHaveBeenCalledWith(`/scope3/decarb-problem-lanes/${ele?.region_id}`);
    });

    fireEvent.click(problemOrderElement);

    sortList(decarbResponseData, "problem_lanes", "desc").forEach((ele: DecarbLane, index: number) => {
      const rowTableClickButton = screen.getByTestId(`click-row-regionid-${index}`);
      fireEvent.click(rowTableClickButton);
      expect(navigate).toHaveBeenCalledWith(`/scope3/decarb-problem-lanes/${ele?.region_id}`);
    });

  })


  it(`click on lane count for asc and desc order`, () => {

    mockCommonData()
    componentRender()
    const gridButton = screen.getByTestId("decarb-grid-table");

    fireEvent.click(gridButton);

    expect(screen.getByTestId("decarb-table")).toBeInTheDocument();

    const lanecountOrderElement = screen.getByTestId(
      "decrab-change-order-lane_count"
    );
    fireEvent.click(lanecountOrderElement);


    sortList(decarbResponseData, "lane_count", "asc").forEach((ele: DecarbLane, index: number) => {
      const rowTableClickButton = screen.getByTestId(`click-row-regionid-${index}`);
      fireEvent.click(rowTableClickButton);
      expect(navigate).toHaveBeenCalledWith(`/scope3/decarb-problem-lanes/${ele?.region_id}`);
    });


    fireEvent.click(lanecountOrderElement);

    sortList(decarbResponseData, "lane_count", "desc").forEach((ele: DecarbLane, index: number) => {
      const rowTableClickButton = screen.getByTestId(`click-row-regionid-${index}`);
      fireEvent.click(rowTableClickButton);
      expect(navigate).toHaveBeenCalledWith(`/scope3/decarb-problem-lanes/${ele?.region_id}`);
    });

  })


  it(`click on carriers for asc and desc order`, () => {

    mockCommonData()
    componentRender()
    const gridButton = screen.getByTestId("decarb-grid-table");

    fireEvent.click(gridButton);

    expect(screen.getByTestId("decarb-table")).toBeInTheDocument();

    const carrierOrderElement = screen.getByTestId(
      "decrab-change-order-carrier_count"
    );

    fireEvent.click(carrierOrderElement);

    sortList(decarbResponseData, "carrier_count", "asc").forEach((ele: DecarbLane, index: number) => {
      const rowTableClickButton = screen.getByTestId(`click-row-regionid-${index}`);
      fireEvent.click(rowTableClickButton);
      expect(navigate).toHaveBeenCalledWith(`/scope3/decarb-problem-lanes/${ele?.region_id}`);
    });

    fireEvent.click(carrierOrderElement);

    sortList(decarbResponseData, "carrier_count", "desc").forEach((ele: DecarbLane, index: number) => {
      const rowTableClickButton = screen.getByTestId(`click-row-regionid-${index}`);
      fireEvent.click(rowTableClickButton);
      expect(navigate).toHaveBeenCalledWith(`/scope3/decarb-problem-lanes/${ele?.region_id}`);
    });
  })



  it("card heading showing priority bases", () => {
    mockCommonData();
    componentRender();

    decarbResponseData.forEach((ele, index: number) => {
      const headingpriority = screen.getByTestId(
        `showing-heading-prority-base-${index}`
      );
      expect(headingpriority).toBeInTheDocument();
      expect(headingpriority.className).toContain(getPriorityColor(ele?.type));
    });

  });
});
