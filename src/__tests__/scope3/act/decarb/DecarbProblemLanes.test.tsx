// Import necessary modules and components
import decarbService from "../../../../store/scopeThree/track/decarb/decarbService";
import { decarbProblemLanes, decarbReducer } from "../../../../store/scopeThree/track/decarb/decarbSlice";
import { ApiTest, TestFullFilledSlice, TestSliceMethod } from "../../../../commonCase/ReduxCases";
import DecarbProblemLanesView from "../../../../pages/decarbProblemLanes/DecarbProblemLanesView";
import { cleanup, act, render, screen, fireEvent } from "@testing-library/react";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as reactRedux from "react-redux";
import * as router from "react-router-dom";
import { authMockData, regionMockdata } from "mockData/commonMockData.json";
import { authDataReducer } from "store/auth/authDataSlice";
import { problemLaneMockData } from "mockData/decarbProblemLanesMockData.json";
import { DecarbSummary } from "store/scopeThree/track/decarb/decarbInterface";
import { useParams } from 'react-router-dom';
import userEvent from "@testing-library/user-event";
import { nodeUrl } from "constant"
jest.mock("store/redux.hooks", () => ({
  ...jest.requireActual("store/redux.hooks"),
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));


jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("auth/ProtectedRoute", () => ({
  useAuth: jest.fn(),
}));

// Payload for getting decarb detail data
const decarbProblemLanesDataGetPayload = {
  region_id: "12",
  page: 1,
  page_size: 10,
};

// Configuration for getting decarb detail data using Redux
const decarbProblemLanesDataGetDataObject = {
  service: decarbService,
  serviceName: "decarbProblemLanesDataGet",
  sliceName: "decarbProblemLanes",
  sliceImport: decarbProblemLanes,
  data: decarbProblemLanesDataGetPayload,
  reducerName: decarbReducer,
  loadingState: "decarbProblemLanesLoading",
  isSuccess: "isSuccess",
  actualState: "decarbProblemLanesData",
};

// Configuration for API testing of getting decarb detail data
const decarbProblemLanesDataGetApiTestData = {
  serviceName: "decarbProblemLanesDataGet",
  method: "post",
  data: decarbProblemLanesDataGetPayload,
  serviceImport: decarbService,
  route: `${nodeUrl}get-region-problem-lanes`,
};

// Configuration for rendering a specific page/component
const renderPageData = {
  navigate: true,
  dispatch: true,
  selector: ["decarbProblemLanesData"],
  component: DecarbProblemLanesView,
  testCaseName: "Decard Problem Lane Component",
  documentId: "decarb-problem-lanes",
  title: "Decarb Opportunity Lanes",
  reducerName: decarbReducer,
};

// Execute Redux slice tests
TestFullFilledSlice({
  data: [
    decarbProblemLanesDataGetDataObject,
  ],
});

// Execute API tests
ApiTest({
  data: [
    decarbProblemLanesDataGetApiTestData
  ],
});

TestSliceMethod({
  data: [
    decarbProblemLanesDataGetDataObject,
  ]
});

window.HTMLElement.prototype.scrollIntoView = jest.fn();

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

describe("test Division view ", () => {
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

  const renderDecarbView = async () => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <DecarbProblemLanesView />
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };

  //section id.....
  it(`<section> test case for whole page `, async () => {
    await renderDecarbView();
    expect(screen.getByTestId("decarb-problem-lanes")).toBeInTheDocument();
  });

 


   it(`<section> test case for pagination `, async () => {
    useSelectorMock.mockReturnValue({
      decarbProblemLanesData: {
        data: {
          getDecarbSummary: problemLaneMockData?.getDecarbSummary,
          pagination: { total_count: 2500, page: 1, page_size: 10 },
        },
      },
      configConstants: {
        data: {
          DEFAULT_YEAR: 2024,
          rd_radius: 20,
          ev_radius: 20
        }
      },
    });

    await renderDecarbView();

    const cardClick = screen.getAllByTestId(`card-view`);

    act(async () => {
      await userEvent.click(cardClick[0]);
    })

    const tableClick = screen.getAllByTestId(`table-view`);

    act(async () => {
      await userEvent.click(tableClick[0]);
    })

    const cardClick1 = screen.getAllByTestId(`card-view1`);

    act(async () => {
      await userEvent.click(cardClick1[0]);
    })

    const tableClick1 = screen.getAllByTestId(`table-view1`);

    act(async () => {
      await userEvent.click(tableClick1[0]);
    })


    act(async () => {
      await userEvent.click(cardClick[0]);
    })


    expect(screen.getByLabelText("pagination-dropdown")).toBeInTheDocument();
    userEvent.click(screen.getByLabelText("pagination-dropdown"));

    // const paginationData = await screen.findAllByText("50");
    // await act(async () => {
    //   userEvent.click(paginationData[0]);
    // });

    const anchorElement = screen.getByRole('button', { name: '2' });
    expect(anchorElement).toBeInTheDocument();
    userEvent.click(anchorElement);


    const viewMapButton = screen.getByTestId('click-lane-0');
    expect(viewMapButton).toBeInTheDocument();
    userEvent.click(viewMapButton);


  });


  //  it(`<section> test case for table `, async () => {
  //   useSelectorMock.mockReturnValue({
  //     decarbProblemLanesData: {
  //       data: {
  //         getDecarbSummary: problemLaneMockData?.getDecarbSummary,
  //         pagination: { total_count: 2500, page: 1, page_size: 10 },
  //       },
  //     },
  //     configConstants: {
  //       data: {
  //         DEFAULT_YEAR: 2024,
  //         rd_radius: 20,
  //         ev_radius: 20
  //       }
  //     },
  //   });

  //   await renderDecarbView();
  //   expect(screen.getByTestId("decarb-problem-lanes")).toBeInTheDocument();


  //   const tableClick = screen.getAllByTestId(`table-view`);

  //   act(async () => {
  //     await userEvent.click(tableClick[0]);
  //   })



  //   // expect(screen.getByLabelText("pagination-dropdown")).toBeInTheDocument();
  //   // userEvent.click(screen.getByLabelText("pagination-dropdown"));

  //   // // const paginationData = await screen.findAllByText("50");
  //   // // await act(async () => {
  //   // //   userEvent.click(paginationData[0]);
  //   // // });

  //   // const anchorElement = screen.getByRole('button', { name: '2' });
  //   // expect(anchorElement).toBeInTheDocument();
  //   // userEvent.click(anchorElement);


  //   // const viewMapButton = screen.getByTestId('click-lane-0');
  //   // expect(viewMapButton).toBeInTheDocument();
  //   // userEvent.click(viewMapButton);


  // });

  // it(`test case for apply button .`, async () => {
  //     useSelectorMock.mockReturnValue({
  //         laneOriginData: {
  //             data: laneMockOriginData,
  //         },

  //         laneDestinationData: {
  //             data: laneMockDestinationData,
  //         },
  //     });
  //     await renderDecarbView();
  //     const viewLaneBtn = screen.getByTestId("apply-button");
  //     expect(viewLaneBtn).toBeInTheDocument();
  //     userEvent.click(viewLaneBtn);
  // });


  // it(`test case for reset button .`, async () => {
  //     useSelectorMock.mockReturnValue({
  //         laneOriginData: {
  //             data: laneMockOriginData,
  //         },

  //         laneDestinationData: {
  //             data: laneMockDestinationData,
  //         },
  //     });
  //     await renderDecarbView();
  //     const resetBtn = screen.getByTestId("reset-button");
  //     expect(resetBtn).toBeInTheDocument();
  //     userEvent.click(resetBtn);
  // });


});

