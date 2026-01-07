
import {
    act,
    cleanup,
    render,
    screen,
    fireEvent
} from "@testing-library/react";
import * as utils from "../../store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as router from "react-router-dom";

import * as reactRedux from "react-redux";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import { authMockData } from "mockData/commonMockData.json";
import { authDataReducer } from "store/auth/authDataSlice";
import { evNetworkListMockData } from "mockData/evMockData.json";
import EvView from "pages/evMap/EvView";
import {
    evDataReducer,
    evLocation,
    getEVNetworkLanes,
    getMatrixDataEV,
    getTruckLaneData,
    getEVShipmentLanes,
    getEVShipmentsByDate,
    isLoadingEVNetworkDashboard
} from "store/ev/evSlice";

import userEvent from "@testing-library/user-event";
import evService from "store/ev/evService";
import {
    ApiTest,
    TestFullFilledSlice,
    TestSliceMethod,
} from "commonCase/ReduxCases";

import { nodeUrl } from "constant";

import {
    laneMockDestinationData,
    laneMockOriginData,
} from "mockData/laneMockData.json";

import store from "store"

// Payload for posting region graph data
const evLocationPostPayload = {
    region_id: "",
    year: 2023,
    quarter: 1,
    toggel_data: 0,
};

// Payload for fetching region table data
const getEVNetworkLanesGetPayload = {
    region_id: "",
    year: 2023,
    quarter: 1,
    toggel_data: 0,
    order_by: "desc",
    col_name: "emission",
};

// Configuration for fetching region table data via Redux
const getEVNetworkLanesObject = {
    service: evService,
    serviceName: "getEvNetworkLanesApi",
    sliceName: "getEVNetworkLanes",
    sliceImport: getEVNetworkLanes,
    data: getEVNetworkLanesGetPayload,
    reducerName: evDataReducer,
    loadingState: "evNetworkLanesLoading",
    actualState: "evNetworkLanesData",
};

// Configuration for API testing of fetching region table data
const getEVNetworkLanesApiTestData = {
    serviceName: "getEvNetworkLanesApi",
    method: "post",
    data: getEVNetworkLanesGetPayload,
    serviceImport: evService,
    route: `${nodeUrl}ev-network-lane`,
};

// Configuration for posting region graph data via Redux
const getEvLocationsDataObject = {
    service: evService,
    serviceName: "getEvLocations",
    sliceName: "evLocation",
    sliceImport: evLocation,
    data: evLocationPostPayload,
    reducerName: evDataReducer,
    loadingState: "evLocationLoading",
    actualState: "evLocationDto",
};

// Configuration for API testing of posting region graph data
const getEvLocationsApiTestData = {
    serviceName: "getEvLocations",
    method: "get",
    serviceImport: evService,
    route: `${nodeUrl}get-ev-locations`,
};


// Payload for fetching graph ev filter dates
const matrixDataEVPayload = {};

// Configuration for API testing of fetching graph ev filter dates data
const matrixDataEVApiTestData = {
    serviceName: "getMatrixDataEVApi",
    method: "post",
    data: matrixDataEVPayload,
    serviceImport: evService,
    route: `${nodeUrl}matrix-data-dashboard-ev`,
};

// Configuration for fetching graph ev filter dates data via Redux
const matrixDataEVDataObject = {
    service: evService,
    serviceName: "getMatrixDataEVApi",
    sliceName: "getMatrixDataEV",
    sliceImport: getMatrixDataEV,
    data: matrixDataEVPayload,
    reducerName: evDataReducer,
    loadingState: "matrixDataEVLoading",
    actualState: "matrixDataEV",
};

// Payload for fetching graph ev filter dates
const truckLaneDataPayload = {};

// Configuration for API testing of fetching graph ev filter dates data
const truckLaneDataApiTestData = {
    serviceName: "getTruckLaneDataApi",
    method: "post",
    data: truckLaneDataPayload,
    serviceImport: evService,
    route: `${nodeUrl}truck-lane-data`,
};

// Configuration for fetching graph ev filter dates data via Redux
const truckLaneDataDataObject = {
    service: evService,
    serviceName: "getTruckLaneDataApi",
    sliceName: "getTruckLaneData",
    sliceImport: getTruckLaneData,
    data: truckLaneDataPayload,
    reducerName: evDataReducer,
    loadingState: "truckLaneDataLoading",
    actualState: "truckLaneData",
};


// Payload for fetching graph ev filter dates
const eVShipmentLanesPayload = {};

// Configuration for API testing of fetching graph ev filter dates data
const eVShipmentLanesApiTestData = {
    serviceName: "getEVShipmentLanesApi",
    method: "post",
    data: eVShipmentLanesPayload,
    serviceImport: evService,
    route: `${nodeUrl}truck-lane-data`,
};

// Configuration for fetching graph ev filter dates data via Redux
const eVShipmentLanesDataObject = {
    service: evService,
    serviceName: "getEVShipmentLanesApi",
    sliceName: "getEVShipmentLanes",
    sliceImport: getEVShipmentLanes,
    data: eVShipmentLanesPayload,
    reducerName: evDataReducer,
    loadingState: "evShipmentLaneLoading",
    actualState: "evShipmentLane",
};

// Payload for fetching graph ev filter dates
const eVShipmentsByDatePayload = {};

// Configuration for API testing of fetching graph ev filter dates data
const eVShipmentsByDateApiTestData = {
    serviceName: "getEVShipmentsByDateApi",
    method: "post",
    data: eVShipmentsByDatePayload,
    serviceImport: evService,
    route: `${nodeUrl}ev-shipment-date`,
};

// Configuration for fetching graph ev filter dates data via Redux
const eVShipmentsByDateDataObject = {
    service: evService,
    serviceName: "getEVShipmentsByDateApi",
    sliceName: "getEVShipmentsByDate",
    sliceImport: getEVShipmentsByDate,
    data: eVShipmentsByDatePayload,
    reducerName: evDataReducer,
    loadingState: "evShipmentLaneByDateLoading",
    actualState: "evShipmentLaneByDate",
};

// Execute Redux slice tests for various data
TestFullFilledSlice({
    data: [
        getEvLocationsDataObject,
        getEVNetworkLanesObject,
        matrixDataEVDataObject,
        truckLaneDataDataObject,
        eVShipmentLanesDataObject,
        eVShipmentsByDateDataObject
    ],
});

// Execute API tests for various data
ApiTest({
    data: [
        getEvLocationsApiTestData,
        getEVNetworkLanesApiTestData,
        matrixDataEVApiTestData,
        truckLaneDataApiTestData,
        eVShipmentLanesApiTestData,
        eVShipmentsByDateApiTestData
    ],
});

TestSliceMethod({
    data: [
        getEvLocationsDataObject,
        getEVNetworkLanesObject,
        matrixDataEVDataObject,
        truckLaneDataDataObject,
        eVShipmentLanesDataObject,
        eVShipmentsByDateDataObject
    ],
});

describe("isLoadingBusinessUnitDashboard Thunk", () => {
    it("should return the correct status when dispatched", async () => {
        const status = true;
        // Dispatch the thunk action
        const result = await store.dispatch(isLoadingEVNetworkDashboard(status));
        expect(result.payload).toBe(status);
    });
});


window.HTMLElement.prototype.scrollIntoView = jest.fn();

jest.mock("../../store/redux.hooks", () => ({
    ...jest.requireActual("../../store/redux.hooks"),
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
                division: evDataReducer?.reducer,
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

    const renderEvView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <EvView />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for whole page `, async () => {
        await renderEvView();
        expect(screen.getByTestId("evView")).toBeInTheDocument();
    });

    it(`<section> test case for pagination `, async () => {
        useSelectorMock.mockReturnValue({
            evNetworkLanesData: {
                data: evNetworkListMockData,
            },
            configConstants: {
                data: {
                    DEFAULT_YEAR: 2024,
                    rd_radius: 20,
                    ev_radius: 20
                }
            },

            fuelStopListDto: {
                data: [{
                    "id": 1,
                    "name": "Conventional diesel",
                    "code": "PD"
                }]
            },
            checkLaneFuelData: {
                data: {
                    results: [{ isValid: 1 }]
                },
            }
        });

        await renderEvView();
        expect(screen.getByLabelText("pagination-dropdown")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("pagination-dropdown"));

        const paginationData = await screen.findByText("50");
        await act(async () => {
            userEvent.click(paginationData);
        });

        const anchorElement = screen.getByRole('button', { name: '2' });
        expect(anchorElement).toBeInTheDocument();
        userEvent.click(anchorElement);

        // expect(screen.getByTestId("threshold-input-0")).toBeInTheDocument();
        // fireEvent.change(screen.getByTestId("threshold-input-0"), { target: { value: "50" } });
        // fireEvent.blur(screen.getByTestId("threshold-input-0"));


        const viewMapButton = screen.getByTestId('map-table-row-0');
        expect(viewMapButton).toBeInTheDocument();
        userEvent.click(viewMapButton);


    });

    
    it(`<section> test case for pagination `, async () => {
        useSelectorMock.mockReturnValue({
            evNetworkLanesData: {
                data: evNetworkListMockData,
            },
            configConstants: {
                data: {
                    DEFAULT_YEAR: 2024,
                    rd_radius: 20,
                    ev_radius: 20
                }
            },

            fuelStopListDto: {
                data: [{
                    "id": 1,
                    "name": "Conventional diesel",
                    "code": "PD"
                }]
            },
            checkLaneFuelData: {
                data: {
                    results: [{ isValid: 1 }]
                },
            }
        });

        await renderEvView();
    
        // expect(screen.getByTestId("threshold-input-0")).toBeInTheDocument();
        // fireEvent.change(screen.getByTestId("threshold-input-0"), { target: { value: "" } });
        // fireEvent.blur(screen.getByTestId("threshold-input-0"));



    });

    it(`test case for apply button .`, async () => {
        useSelectorMock.mockReturnValue({
            laneOriginData: {
                data: laneMockOriginData,
            },

            laneDestinationData: {
                data: laneMockDestinationData,
            },
        });
        await renderEvView();
        const viewLaneBtn = screen.getByTestId("apply-button");
        expect(viewLaneBtn).toBeInTheDocument();
        userEvent.click(viewLaneBtn);
    });


    it(`test case for reset button .`, async () => {
        useSelectorMock.mockReturnValue({
            laneOriginData: {
                data: laneMockOriginData,
            },

            laneDestinationData: {
                data: laneMockDestinationData,
            },
        });
        await renderEvView();
        const resetBtn = screen.getByTestId("reset-button");
        expect(resetBtn).toBeInTheDocument();
        userEvent.click(resetBtn);
    });


});
