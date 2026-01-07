
import {
    act,
    cleanup,
    render,
    screen,
} from "@testing-library/react";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as router from "react-router-dom";
import userEvent from "@testing-library/user-event";

import * as reactRedux from "react-redux";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import { authMockData, regionMockdata, yearMockData } from "mockData/commonMockData.json";
import { authDataReducer } from "store/auth/authDataSlice";
import {
    trailerTableDtoMockData
    
} from "mockData/trailerMockData.json";

import TrailerView from "pages/trailer/TrailerView";

import {
    decarbReducer
} from "store/scopeThree/track/decarb/decarbSlice";

import trailerService from "store/trailer/trailerService";
import { nodeUrl } from "constant"
import {
    ApiTest,
    TestFullFilledSlice,
    TestSliceMethod,
} from "commonCase/ReduxCases";

import {
    trailerDataReducer,
    trailerGraphData,
    trailerTableData,
    vehicleGraphData,
    trailerCarrierEmissionGraph,
    getTrailerOverviewDto,
    getTrailerLaneBreakdownByEmissionsIntensity,
    isLoadingTrailerDashboard,
    initialState,
    resetTrailer
} from "store/trailer/trailerSlice";
import store from "store"
// Payload for fetching graph ev trailer table
const trailerTablePayload = {};

// Configuration for API testing of fetching graph ev trailer table data
const trailerTableApiTestData = {
    serviceName: "trailerTableApi",
    method: "post",
    data: trailerTablePayload,
    serviceImport: trailerService,
    route: `${nodeUrl}trailer-emission-table-data`,
};

// Configuration for fetching graph ev trailer table data via Redux
const trailerTableDataObject = {
    service: trailerService,
    serviceName: "trailerTableApi",
    sliceName: "trailerTableData",
    sliceImport: trailerTableData,
    data: trailerTablePayload,
    reducerName: trailerDataReducer,
    loadingState: "trailerTableDtoLoading",
    actualState: "trailerTableDto",
};


// Payload for fetching graph ev trailer table
const trailerGraphPayload = {};

// Configuration for API testing of fetching graph ev trailer table data
const trailerGraphApiTestData = {
    serviceName: "trailerGraphApi",
    method: "post",
    data: trailerGraphPayload,
    serviceImport: trailerService,
    route: `${nodeUrl}trailer-emission-graph-data`,
};

// Configuration for fetching graph ev trailer table data via Redux
const trailerGraphDataObject = {
    service: trailerService,
    serviceName: "trailerGraphApi",
    sliceName: "trailerGraphData",
    sliceImport: trailerGraphData,
    data: trailerGraphPayload,
    reducerName: trailerDataReducer,
    loadingState: "trailerGraphDtoLoading",
    actualState: "trailerGraphDto",
};




// Configuration for fetching graph ev trailer table data via Redux
const vehicleGraphDataObject = {
    service: trailerService,
    serviceName: "trailerGraphApi",
    sliceName: "vehicleGraphData",
    sliceImport: vehicleGraphData,
    data: trailerGraphPayload,
    reducerName: trailerDataReducer,
    loadingState: "vehicleGraphDtoLoading",
    actualState: "vehicleGraphDto",
};

// Payload for fetching graph ev trailer table
const trailerCarrierEmissionGraphPayload = {};

// Configuration for API testing of fetching graph ev trailer table data
const trailerCarrierEmissionGraphApiTestData = {
    serviceName: "trailerCarrierEmissionGraphApi",
    method: "post",
    data: trailerCarrierEmissionGraphPayload,
    serviceImport: trailerService,
    route: `${nodeUrl}trailer-emission-graph-data`,
};

// Configuration for fetching graph ev trailer table data via Redux
const trailerCarrierEmissionGraphDataObject = {
    service: trailerService,
    serviceName: "trailerCarrierEmissionGraphApi",
    sliceName: "trailerCarrierEmissionGraph",
    sliceImport: trailerCarrierEmissionGraph,
    data: trailerCarrierEmissionGraphPayload,
    reducerName: trailerDataReducer,
    loadingState: "trailerCarrierEmissionTableDtoLoading",
    actualState: "trailerCarrierEmissionTableDto",
};

// Payload for fetching graph ev trailer table
const trailerOverviewPayload = {};

// Configuration for API testing of fetching graph ev trailer table data
const getTrailerOverviewApiTestData = {
    serviceName: "getTrailerOverviewDtoApi",
    method: "post",
    data: trailerOverviewPayload,
    serviceImport: trailerService,
    route: `${nodeUrl}trailer-overview-data`,
};

// Configuration for fetching graph ev trailer table data via Redux
const getTrailerOverviewDataObject = {
    service: trailerService,
    serviceName: "getTrailerOverviewDtoApi",
    sliceName: "getTrailerOverviewDto",
    sliceImport: getTrailerOverviewDto,
    data: trailerOverviewPayload,
    reducerName: trailerDataReducer,
    loadingState: "trailerOverviewDtoLoading",
    actualState: "trailerOverviewDto",
};


// Payload for fetching graph ev trailer table
const trailerLaneBreakdownByEmissionsIntensityApiTestDataPayload = {};

// Configuration for API testing of fetching graph ev trailer table data
const getTrailerLaneBreakdownByEmissionsIntensityApiTestData = {
    serviceName: "getTrailerLaneBreakdownByEmissionsIntensityApi",
    method: "post",
    data: trailerLaneBreakdownByEmissionsIntensityApiTestDataPayload,
    serviceImport: trailerService,
    route: `${nodeUrl}trailer-lane-breakdown-data`,
};

// Configuration for fetching graph ev trailer table data via Redux
const getTrailerLaneBreakdownByEmissionsIntensityDataObject = {
    service: trailerService,
    serviceName: "getTrailerLaneBreakdownByEmissionsIntensityApi",
    sliceName: "getTrailerLaneBreakdownByEmissionsIntensity",
    sliceImport: getTrailerLaneBreakdownByEmissionsIntensity,
    data: trailerLaneBreakdownByEmissionsIntensityApiTestDataPayload,
    reducerName: trailerDataReducer,
    loadingState: "trailerLaneBreakdownLoading",
    actualState: "trailerLaneBreakdown",
};

// Execute Redux slice tests for various data
TestFullFilledSlice({
    data: [
     
        trailerTableDataObject,
        trailerGraphDataObject,
        vehicleGraphDataObject,
        trailerCarrierEmissionGraphDataObject,
        getTrailerOverviewDataObject,
        getTrailerLaneBreakdownByEmissionsIntensityDataObject
    ],
});


// Execute API tests for various data
ApiTest({
    data: [
      
        trailerTableApiTestData,
        trailerGraphApiTestData,
        trailerCarrierEmissionGraphApiTestData,
        getTrailerOverviewApiTestData,
        getTrailerLaneBreakdownByEmissionsIntensityApiTestData
    ],
});


TestSliceMethod({
    data: [
      
        trailerTableDataObject,
        trailerGraphDataObject,
        vehicleGraphDataObject,
        trailerCarrierEmissionGraphDataObject,
        getTrailerOverviewDataObject,
        getTrailerLaneBreakdownByEmissionsIntensityDataObject
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
  
      const result = trailerDataReducer.reducer(modifiedState, resetTrailer());
  
      expect(result).toEqual(initialState);
    });
  });
  
  describe("isLoadingBusinessUnitDashboard Thunk", () => {
    it("should return the correct status when dispatched", async () => {
      const status = true;
      // Dispatch the thunk action
      const result = await store.dispatch(isLoadingTrailerDashboard(status));
      expect(result.payload).toBe(status);
    });
  });
  

jest.mock("../../../../store/redux.hooks", () => ({
    ...jest.requireActual("../../../../store/redux.hooks"),
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

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn()
    },
}));

window.HTMLElement.prototype.scrollIntoView = jest.fn();

beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => "mocked-url");
    global.URL.revokeObjectURL = jest.fn();
    HTMLAnchorElement.prototype.click = jest.fn();
});

describe("trailer view ", () => {
    let useDispatchMock: jest.Mock;
    let useSelectorMock: jest.Mock;
    let stores: EnhancedStore;
    const navigate = jest.fn();
    const mockDispatch = jest.fn();

    beforeEach(() => {
        stores = configureStore({
            reducer: {
                decarb: decarbReducer?.reducer,
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
        jest.mock("react-i18next", () => ({
            useTranslation: () => ({
                t: (key: string) => key,
            }),
        }));
        useSelectorMock = jest
            .spyOn(utils, "useAppSelector")
            .mockReturnValue({}) as jest.Mock;
        useDispatchMock = jest.spyOn(utils, "useAppDispatch") as jest.Mock;

        let auth = jest.spyOn(tem, "useAuth");
        auth.mockReturnValue(authMockData);

        useDispatchMock.mockReturnValue(mockDispatch);
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        cleanup();
    });

    const renderTrailerView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <TrailerView pageTitle="trailer" />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };


    //section id.....
    it(`<section> test case for whole page `, async () => {
        useSelectorMock.mockReturnValue({

            configConstants: {
                data: {
                    DEFAULT_YEAR: 2024
                }
            },

        });
        await renderTrailerView();
        expect(screen.getByTestId("trailer-screen")).toBeInTheDocument();
    });


    it(`<section> test case for reder year dropdown `, async () => {
        useSelectorMock.mockReturnValue({

            configConstants: {
                data: {
                    DEFAULT_YEAR: 2024
                }
            },
            regions: {
                data: regionMockdata,
            },
            emissionDates: yearMockData,
            // trailerTableDto: {
                
            // }


        });
        await renderTrailerView();
        expect(screen.getByTestId("trailer-screen")).toBeInTheDocument();

        expect(screen.getByLabelText("region-dropdown")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("region-dropdown"));

        const regionData = await screen.findByText("R1");
        userEvent.click(regionData);

        const dropdown = screen.getByLabelText("year-dropdown");
        userEvent.click(dropdown);
        const option = await screen.findByText("2021");
        userEvent.click(option);

        const quarterDropdown = screen.getByLabelText("quarter-dropdown");
        userEvent.click(quarterDropdown);
        const quarterOption = await screen.findByText("Q1");
        userEvent.click(quarterOption);

    });

    // it(`<section> test case for whole page `, async () => {
    //     // Mock URL
    //     global.URL.createObjectURL = jest.fn(() => 'mocked-url');
    //     global.URL.revokeObjectURL = jest.fn();


    //     useSelectorMock.mockReturnValue({

    //         configConstants: {
    //             data: {
    //                 DEFAULT_YEAR: 2024
    //             }
    //         },
    //         trailerTableDto: {
    //             data: trailerTableDtoMockData
    //         },
    //         emissionDates: yearMockData,

    //     });
    //     await renderTrailerView();
    //     expect(screen.getByTestId("trailer-screen")).toBeInTheDocument();

    //     expect(screen.getByTestId("change-order-intensity")).toBeInTheDocument();
    //     userEvent.click(screen.getByTestId("change-order-intensity"));

    //     expect(screen.getByTestId("change-order-intensity")).toBeInTheDocument();
    //     userEvent.click(screen.getByTestId("change-order-intensity"));

    //     expect(screen.getByTestId("table-row-data0")).toBeInTheDocument();
    //     userEvent.click(screen.getByTestId("table-row-data0"));

    //     expect(screen.getByTestId("export-btn")).toBeInTheDocument();
    //     userEvent.click(screen.getByTestId("export-btn"));
        
    //     // navigateLink

    // });


});
