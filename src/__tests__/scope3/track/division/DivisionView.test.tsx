
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
import { authMockData, yearMockData } from "mockData/commonMockData.json";
import { authDataReducer } from "store/auth/authDataSlice";

import DivisionView from "pages/division/DivisionView";
import {
    divisionDataReducer,
    divisionGraphData,
    divisionTableData,
    isLoadingDivisionDashboard,
    resetBusinessUnit,
    initialState
} from "store/scopeThree/track/division/divisionSlice";
import {
    graphMockDataEmissionIntensity,
    graphMockDataTotalEmission,
    tableGraphMockData
} from "../../../../mockData/regionalViewMockData.json";
import userEvent from "@testing-library/user-event";
import divisionService from "store/scopeThree/track/division/divisionService";
import {
    ApiTest,
    TestFullFilledSlice,
    TestSliceMethod,
} from "commonCase/ReduxCases";
import store from "store"

import { nodeUrl } from "constant";

// Payload for posting region graph data
const divisionGraphPostPayload = {
    region_id: "",
    year: 2023,
    quarter: 1,
    toggel_data: 0,
};

// Payload for fetching region table data
const divisionTableDataGetPayload = {
    region_id: "",
    year: 2023,
    quarter: 1,
    toggel_data: 0,
    order_by: "desc",
    col_name: "emission",
};

// Configuration for fetching region table data via Redux
const divisionTableDataGetDataObject = {
    service: divisionService,
    serviceName: "divisionTableDataApi",
    sliceName: "divisionTableData",
    sliceImport: divisionTableData,
    data: divisionTableDataGetPayload,
    reducerName: divisionDataReducer,
    loadingState: "divisionTableDtoLoading",
    actualState: "divisionTableDto",
};

// Configuration for API testing of fetching region table data
const divisionTableDataGetApiTestData = {
    serviceName: "divisionTableDataApi",
    method: "post",
    data: divisionTableDataGetPayload,
    serviceImport: divisionService,
    route: `${nodeUrl}get-division-table-data`,
};

// Configuration for posting region graph data via Redux
const divisionGraphPostDataObject = {
    service: divisionService,
    serviceName: "divisionGraphDataApi",
    sliceName: "divisionGraphData",
    sliceImport: divisionGraphData,
    data: divisionGraphPostPayload,
    reducerName: divisionDataReducer,
    loadingState: "divisionGraphDtoLoading",
    actualState: "divisionGraphDto",
};

// Configuration for API testing of posting region graph data
const regionGraphPostApiTestData = {
    serviceName: "divisionGraphDataApi",
    method: "post",
    data: divisionGraphPostPayload,
    serviceImport: divisionService,
    route: `${nodeUrl}get-division-graph-data`,
};



// Execute Redux slice tests for various data
TestFullFilledSlice({
    data: [divisionGraphPostDataObject, divisionTableDataGetDataObject],
});

// Execute API tests for various data
ApiTest({
    data: [regionGraphPostApiTestData, divisionTableDataGetApiTestData],
});

TestSliceMethod({
    data: [divisionGraphPostDataObject, divisionTableDataGetDataObject],
});

// Test case initialState
describe('initial reducer', () => {
    it('should reset state to initialState when resetScopeOneCommonData is called', () => {
      const modifiedState: any = {
        data: [{ id: 1, value: 'test' }],
        loading: true,
        error: 'Something went wrong',
      };
  
      const result = divisionDataReducer.reducer(modifiedState, resetBusinessUnit());
  
      expect(result).toEqual(initialState);
    });
  });
  
  describe("isLoadingBusinessUnitDashboard Thunk", () => {
    it("should return the correct status when dispatched", async () => {
      const status = true;
      // Dispatch the thunk action
      const result = await store.dispatch(isLoadingDivisionDashboard(status));
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

describe("test Division view ", () => {
    let useDispatchMock: jest.Mock;
    let useSelectorMock: jest.Mock;
    let stores: EnhancedStore;
    const navigate = jest.fn();
    beforeEach(() => {
        stores = configureStore({
            reducer: {
                division: divisionDataReducer?.reducer,
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

    const renderDivisionView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <DivisionView />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for whole page `, async () => {
        await renderDivisionView();
        expect(screen.getByTestId("division")).toBeInTheDocument();
    });

    //year dropdown
    it(`year selectable dropdown `, async () => {
        useSelectorMock.mockReturnValue({
            emissionDates: yearMockData,
            regionGraphDetailsLoading: false,
            configConstants: {
                data: {
                    DEFAULT_YEAR: 2024,
                    rd_radius: 20,
                    ev_radius: 20
                }
            },
        });
        await renderDivisionView();
        const dropdown = screen.getByLabelText("year-dropdown");
        userEvent.click(dropdown);
        const option = await screen.findByText("2021");
        userEvent.click(option);
    });

    //quarter dropdown
    it(`quarter selectable dropdown `, async () => {
        await renderDivisionView();
        expect(screen.getByLabelText("quarter-dropdown")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("quarter-dropdown"));
        userEvent.click(await screen.findByText("Q4"));
    });

    //export download button
    it(`export download button `, async () => {
        global.URL.createObjectURL = jest.fn(() => 'mocked-url');
        global.URL.revokeObjectURL = jest.fn();
    
    
        await renderDivisionView();
        expect(screen.getByTestId("export-btn")).toBeInTheDocument();
        fireEvent.click(screen.getByTestId("export-btn"));
    });

    //emission intensity graph data 1
    it(` graph data test case for Emission intensity for region`, async () => {
        useSelectorMock.mockReturnValue({
            regionGraphDetails: {
                data: graphMockDataEmissionIntensity,
            },
        });

        await renderDivisionView();
        expect(screen.getByTestId("graph-data")).toBeInTheDocument();
        const emissionRadioToggle = screen.getByTestId(
            "emission-intensity-toggle-region"
        ) as HTMLInputElement;
        expect(emissionRadioToggle).toBeInTheDocument();
        fireEvent.click(emissionRadioToggle);
        expect(emissionRadioToggle.checked).toBe(true);
    });

    //total emission graph data 2
    it(` graph data test case for Total Emission  for region`, async () => {
        useSelectorMock.mockReturnValue({
            regionGraphDetails: {
                data: graphMockDataTotalEmission,
            },
        });

        await renderDivisionView();
        expect(screen.getByTestId("graph-data")).toBeInTheDocument();
        const TotalemissionRadioToggle = screen.getByTestId(
            "total-emission-toggle-region"
        ) as HTMLInputElement;
        expect(TotalemissionRadioToggle).toBeInTheDocument();
        fireEvent.click(TotalemissionRadioToggle);
        expect(TotalemissionRadioToggle.checked).toBe(true);
    });

    //performance data headings
    it(`performance heading data`, async () => {
        await renderDivisionView();
        expect(screen.getByTestId("performance-data-heading")).toBeInTheDocument();
    });

    //graph 2 region wise emission intensity
    it(`region wise emission intensity table graph data`, async () => {
        useSelectorMock.mockReturnValue({
            regionTableDetails: {
                data: tableGraphMockData,
            },
        });
        await renderDivisionView();
        expect(screen.getByTestId("table-graph-data")).toBeInTheDocument();
        // fireEvent.click(screen.getByTestId("export-btn"))
    });

    //loading
    it(`loading spinner`, async () => {
        useSelectorMock.mockReturnValue({
            isLoading: true,
        });
        await renderDivisionView();
    });

    //navigate to other page region wise emission intensity
    it(`region wise emission intensity table graph data`, async () => {
        useSelectorMock.mockReturnValue({
            isLoading: false,
            regionTableDetails: {
                data: tableGraphMockData,
            },
        });
        await renderDivisionView();
        expect(screen.getByTestId("table-graph-data")).toBeInTheDocument();

    });

    // change order by clicking on table headings
    it(`arrow buttons in table heading for sorting`, async () => {
        useSelectorMock.mockReturnValue({
            isLoading: false,
            regionTableDetails: {
                data: tableGraphMockData,
            },
        });
        await renderDivisionView();
        expect(screen.getByTestId("change-order-intensity")).toBeInTheDocument();
        fireEvent.click(screen.getByTestId("change-order-intensity"));
        expect(screen.getByTestId("change-order-emission")).toBeInTheDocument();
        fireEvent.click(screen.getByTestId("change-order-emission"));
        expect(screen.getByTestId("change-order-shipments")).toBeInTheDocument();
        fireEvent.click(screen.getByTestId("change-order-shipments"));
    });

    // change order by clicking on table headings
    // it(`arrow buttons in table heading for sorting`, async () => {
    //     useSelectorMock.mockReturnValue({
    //         divisionTableDto: {
    //             data: tableGraphMockData,
    //         },
    //     });
    //     await renderDivisionView();
    //     expect(screen.getByTestId("table-row-data0")).toBeInTheDocument();
    //     fireEvent.click(screen.getByTestId("table-row-data0"));

    //     expect(screen.getByTestId("export-btn")).toBeInTheDocument();
    //     fireEvent.click(screen.getByTestId("export-btn"));

    // });


});
