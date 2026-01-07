
import {
    act,
    cleanup,
    render,
    screen,
} from "@testing-library/react";
import * as utils from "../../../../store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as router from "react-router-dom";
import userEvent from "@testing-library/user-event";

import * as reactRedux from "react-redux";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import { authMockData } from "mockData/commonMockData.json";
import { authDataReducer } from "store/auth/authDataSlice";
import {
    listOfCarriers, evShipmentLaneListMockData
} from "mockData/evMockData.json";
import EvDashboardView from "pages/ev/evDashboard/EvDashboardView";

import {
    decarbReducer
} from "store/scopeThree/track/decarb/decarbSlice";
import {
    sustainableReducer
} from "store/sustain/sustainSlice";
import { laneDetailsReducer } from "store/scopeThree/track/lane/laneDetailsSlice";
import evDashboardService from "store/scopeThree/track/evDashboard/evDashboardService";
import { nodeUrl } from "constant"
import {
    ApiTest,
    TestFullFilledSlice,
    TestSliceMethod,
} from "commonCase/ReduxCases";

import {
    evDashboardReducer,
    getEvShipmentMatrics,
    getEvFilterDates,
    getShipmentLane,
    getShipmentByDate,
    getShipmentLaneList,
    getlistOfCarriers,
    getCarriersMaterData,
    getTotalTonMileData,
    getEvDataDownload,
    resetEvDashboard,
    resetEvGraphsData,
    initialState,
    isLoadingEvDashboard
} from "store/scopeThree/track/evDashboard/evDashboardSlice";
import store from "store"
// Payload for fetching graph metrix
const evShipmentMatricsPayload = { "start_date": "2024-12-02", "end_date": "2024-12-08", "scac": "SCNN" };

// Configuration for API testing of fetching graph metrix data
const evShipmentMatricsApiTestData = {
    serviceName: "evDashboardMatricsApi",
    method: "post",
    data: evShipmentMatricsPayload,
    serviceImport: evDashboardService,
    route: `${nodeUrl}ev-matrix-data`,
};

// Configuration for fetching graph metrix data via Redux
const evShipmentMatricsDataObject = {
    service: evDashboardService,
    serviceName: "evDashboardMatricsApi",
    sliceName: "getEvShipmentMatrics",
    sliceImport: getEvShipmentMatrics,
    data: evShipmentMatricsPayload,
    reducerName: evDashboardReducer,
    loadingState: "isLoadingEvMatrics",
    isSuccess: "isSuccess",
    actualState: "evMatricsData",
};


// Payload for fetching graph ev filter dates
const evFilterDatesPayload = { country: "USA", code: "" };

// Configuration for API testing of fetching graph ev filter dates data
const evFilterDatesApiTestData = {
    serviceName: "evFilterDatesApi",
    method: "get",
    data: evFilterDatesPayload,
    serviceImport: evDashboardService,
    route: `${nodeUrl}get-ev-filter-emission-dates?country_code=${evFilterDatesPayload?.country}&scac=${evFilterDatesPayload?.code || ''}`,
};

// Configuration for fetching graph ev filter dates data via Redux
const evFilterDatesDataObject = {
    service: evDashboardService,
    serviceName: "evFilterDatesApi",
    sliceName: "getEvFilterDates",
    sliceImport: getEvFilterDates,
    data: evFilterDatesPayload,
    reducerName: evDashboardReducer,
    loadingState: "isLoadingEvFilterDate",
    isSuccess: "isSuccess",
    actualState: "evFilterData",
};


// Payload for fetching graph ev filter dates
const shipmentLanePayload = { code: "" };

// Configuration for API testing of fetching graph ev filter dates data
const shipmentLaneApiTestData = {
    serviceName: "shipmentLaneDataApi",
    method: "post",
    data: shipmentLanePayload,
    serviceImport: evDashboardService,
    route: `${nodeUrl}ev-shpiment-by-lane-data`,
};

// Configuration for fetching graph ev filter dates data via Redux
const shipmentLaneDataObject = {
    service: evDashboardService,
    serviceName: "shipmentLaneDataApi",
    sliceName: "getShipmentLane",
    sliceImport: getShipmentLane,
    data: shipmentLanePayload,
    reducerName: evDashboardReducer,
    loadingState: "isLoadingShipmentLane",
    isSuccess: "isSuccess",
    actualState: "shipmentLaneData",
};


// Payload for fetching graph ev filter dates
const shipmentLaneDatePayload = { code: "" };

// Configuration for API testing of fetching graph ev filter dates data
const shipmentLaneDateApiTestData = {
    serviceName: "shipmentByDateApi",
    method: "post",
    data: shipmentLaneDatePayload,
    serviceImport: evDashboardService,
    route: `${nodeUrl}ev-shpiment-by-lane-data`,
};

// Configuration for fetching graph ev filter dates data via Redux
const shipmentLaneDateDataObject = {
    service: evDashboardService,
    serviceName: "shipmentByDateApi",
    sliceName: "getShipmentByDate",
    sliceImport: getShipmentByDate,
    data: shipmentLaneDatePayload,
    reducerName: evDashboardReducer,
    loadingState: "isLoadingShipmentByDate",
    isSuccess: "isSuccess",
    actualState: "shipmentByDateData",
};



// Payload for fetching graph ev filter dates
const shipmentLaneListPayload = { code: "" };

// Configuration for API testing of fetching graph ev filter dates data
const shipmentLaneListApiTestData = {
    serviceName: "shipmentLaneListApi",
    method: "post",
    data: shipmentLaneListPayload,
    serviceImport: evDashboardService,
    route: `${nodeUrl}ev-shipments-lane-list`,
};

// Configuration for fetching graph ev filter dates data via Redux
const shipmentLaneListDataObject = {
    service: evDashboardService,
    serviceName: "shipmentLaneListApi",
    sliceName: "getShipmentLaneList",
    sliceImport: getShipmentLaneList,
    data: shipmentLaneListPayload,
    reducerName: evDashboardReducer,
    loadingState: "isLoadingEvShipmentLaneList",
    isSuccess: "isSuccess",
    actualState: "evShipmentLaneListData",
};

// Payload for fetching graph ev filter dates
const listOfCarriersPayload = { country: "USA" };

// Configuration for API testing of fetching graph ev filter dates data
const listOfCarriersApiTestData = {
    serviceName: "getListOfCarriersApi",
    method: "get",
    data: listOfCarriersPayload,
    serviceImport: evDashboardService,
    route: `${nodeUrl}ev-carriers-list?country_code=${listOfCarriersPayload?.country}`,
};

// Configuration for fetching graph ev filter dates data via Redux
const listOfCarriersDataObject = {
    service: evDashboardService,
    serviceName: "getListOfCarriersApi",
    sliceName: "getlistOfCarriers",
    sliceImport: getlistOfCarriers,
    data: listOfCarriersPayload,
    reducerName: evDashboardReducer,
    loadingState: "isLoadingListOfCarriers",
    actualState: "listOfCarriers",
};


// Payload for fetching graph ev filter dates
const carrierMaterPayload = {};

// Configuration for API testing of fetching graph ev filter dates data
const carrierMaterApiTestData = {
    serviceName: "getCarriersMaterDataApi",
    method: "post",
    data: carrierMaterPayload,
    serviceImport: evDashboardService,
    route: `${nodeUrl}graph-carriers-data`,
};

// Configuration for fetching graph ev filter dates data via Redux
const carrierMaterDataObject = {
    service: evDashboardService,
    serviceName: "getCarriersMaterDataApi",
    sliceName: "getCarriersMaterData",
    sliceImport: getCarriersMaterData,
    data: carrierMaterPayload,
    reducerName: evDashboardReducer,
    loadingState: "isLoadingMasterCarrierData",
    actualState: "masterCarrierData",
};


// Payload for fetching graph ev filter dates
const totalTonMileDataPayload = {};

// Configuration for API testing of fetching graph ev filter dates data
const totalTonMileDataApiTestData = {
    serviceName: "getTotalTonMileApi",
    method: "post",
    data: totalTonMileDataPayload,
    serviceImport: evDashboardService,
    route: `${nodeUrl}ev-ttm-by-date`,
};

// Configuration for fetching graph ev filter dates data via Redux
const totalTonMileDataDataObject = {
    service: evDashboardService,
    serviceName: "getTotalTonMileApi",
    sliceName: "getTotalTonMileData",
    sliceImport: getTotalTonMileData,
    data: totalTonMileDataPayload,
    reducerName: evDashboardReducer,
    loadingState: "isLoadingTotalTonMileData",
    actualState: "totalTonMileData",
};


// Payload for fetching graph ev filter dates
const evDataDownloadPayload = {};

// Configuration for API testing of fetching graph ev filter dates data
const evDataDownloadApiTestData = {
    serviceName: "getEvReportApi",
    method: "post",
    data: evDataDownloadPayload,
    serviceImport: evDashboardService,
    route: `${nodeUrl}ev-scac-excel`,
};

// Configuration for fetching graph ev filter dates data via Redux
const evDataDownloadDataObject = {
    service: evDashboardService,
    serviceName: "getEvReportApi",
    sliceName: "getEvDataDownload",
    sliceImport: getEvDataDownload,
    data: evDataDownloadPayload,
    reducerName: evDashboardReducer,
    loadingState: "isLoadingDwonloadEvData",
    actualState: "dwonloadEvData",
};
// Execute Redux slice tests for various data
TestFullFilledSlice({
    data: [
        evShipmentMatricsDataObject,
        evFilterDatesDataObject,
        shipmentLaneDataObject,
        shipmentLaneDateDataObject,
        shipmentLaneListDataObject,
        listOfCarriersDataObject,
        carrierMaterDataObject,
        totalTonMileDataDataObject,
        evDataDownloadDataObject
    ],
});


// Execute API tests for various data
ApiTest({
    data: [
        evShipmentMatricsApiTestData,
        evFilterDatesApiTestData,
        shipmentLaneApiTestData,
        shipmentLaneDateApiTestData,
        shipmentLaneListApiTestData,
        listOfCarriersApiTestData,
        carrierMaterApiTestData,
        totalTonMileDataApiTestData,
        evDataDownloadApiTestData

    ],
});


TestSliceMethod({
    data: [
        evShipmentMatricsDataObject,
        evFilterDatesDataObject,
        shipmentLaneDataObject,
        shipmentLaneDateDataObject,
        shipmentLaneListDataObject,
        listOfCarriersDataObject,
        carrierMaterDataObject,
        totalTonMileDataDataObject,
        evDataDownloadDataObject
    ],
});


// Test case initialState
describe('initial reducer', () => {
    it('should reset state to initialState when resetEvDashboard is called', () => {
        const modifiedState: any = {
            data: [{ id: 1, value: 'test' }],
            loading: true,
            error: 'Something went wrong',
        };

        const result = evDashboardReducer.reducer(modifiedState, resetEvDashboard());

        expect(result).toEqual(initialState);


    });
});

// Test case initialState
describe('initial reducer', () => {
    it('should reset state to initialState when resetEvGraphsData is called', () => {
        const modifiedState: any = {
            "evDashboardLoading": false,
            "evFilterData": null,
            "evMatricsData": null,
            "evShipmentLaneListData": null,
            "isError": false,
            "isLoading": false,
            "isLoadingDwonloadEvData": false,
            "isLoadingEvFilterDate": false,
            "isLoadingEvMatrics": false,
            "isLoadingEvShipmentLaneList": false,
            "isLoadingListOfCarriers": false,
            "isLoadingMasterCarrierData": false,
            "isLoadingShipmentByDate": false,
            "isLoadingShipmentLane": false,
            "isLoadingTotalTonMileData": false,
            "isSuccess": false,

        };

        const result = evDashboardReducer.reducer(modifiedState, resetEvGraphsData());

        expect(result).toEqual(initialState);


    });
});

describe("isLoadingEvDashboard", () => {
    it("should return the correct status when dispatched", async () => {
        const status = true;
        // Dispatch the thunk action
        const result = await store.dispatch(isLoadingEvDashboard(status));
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


describe("test Ev Master View ", () => {
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
                sustain: sustainableReducer?.reducer,
                lane: laneDetailsReducer?.reducer,
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

        useDispatchMock.mockReturnValue(mockDispatch);
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        cleanup();
    });

    const renderEvDashboardView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <EvDashboardView />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };


    //section id.....
    it(`<section> test case for whole page `, async () => {
        useSelectorMock.mockReturnValue({
            configConstants: {
                data: { optimus_radius: 10 },
            },
            evFilterData: {
                data: {
                    "start_date": "2022-12-26",
                    "end_date": "2024-12-16",
                    "scac": ""
                }
            }


        });
        await renderEvDashboardView();
        expect(screen.getByTestId("EvDashboardView")).toBeInTheDocument();
    });




    it(`test case for start date .`, async () => {
        useSelectorMock.mockReturnValue({
            listOfCarriers: {
                data: listOfCarriers,
            },
        });
        await renderEvDashboardView()
        const datePickerInput = screen.getByTestId("start-date");
        expect(datePickerInput).toBeInTheDocument();

        // Open the calendar by clicking the input
        userEvent.click(datePickerInput);


    });


    it(`test case for view detail .`, async () => {
        useSelectorMock.mockReturnValue({
            listOfCarriers: {
                data: listOfCarriers,
            },
        });
        await renderEvDashboardView()

        listOfCarriers.forEach(
            (ele: any, index: number) => {
                const viewLaneBtn = screen.getByTestId(`set-carrier-dropdown-${index}`);
                expect(viewLaneBtn).toBeInTheDocument();
                userEvent.click(viewLaneBtn);
            }
        );


    });

    it(`test case for render lane table.`, async () => {
        useSelectorMock.mockReturnValue({
            evShipmentLaneListData: {
                data: evShipmentLaneListMockData,
            },
        });
        await renderEvDashboardView()

        evShipmentLaneListMockData?.responseData.forEach(
            (ele: any, index: number) => {
                const viewLaneBtn = screen.getByTestId(`view-map-btn-${index}`);
                expect(viewLaneBtn).toBeInTheDocument();
                userEvent.click(viewLaneBtn);
            }
        );
        const shipmentBtn = screen.getByTestId(`shipment`);
        expect(shipmentBtn).toBeInTheDocument();
        userEvent.click(shipmentBtn);


    });

    //pagination
    it(`pagination dropdown`, async () => {
        useSelectorMock.mockReturnValue({
            evShipmentLaneListData: {
                data: evShipmentLaneListMockData,
            },
        });
        await renderEvDashboardView()

        expect(screen.getByLabelText("pagination-dropdown")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("pagination-dropdown"));

        const paginationData = await screen.findByText("50");
        await act(async () => {
            userEvent.click(paginationData);
        });


        const anchorElement = screen.getByRole('button', { name: '2' });
        expect(anchorElement).toBeInTheDocument();
        userEvent.click(anchorElement);

        // const paginationData = await screen.findByText("10");
        // await act(async () => {
        //     userEvent.click(paginationData);
        // });
    });
});
