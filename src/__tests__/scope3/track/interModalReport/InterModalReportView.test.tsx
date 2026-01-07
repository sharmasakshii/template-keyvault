import {
    act,
    cleanup,
    fireEvent,
    render,
    screen,
} from "@testing-library/react";
import * as utils from "store/redux.hooks";
import * as router from "react-router-dom";
import { authMockData } from "mockData/commonMockData.json";

import * as reactRedux from "react-redux";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import IntermodalReportView from "pages/intermodalReport/IntermodalReportView";
import {
    intermodalReportDataReducer,
    getIntermodalReportFilterData,
    getIntermodalReportMatirxData,
    getLaneByShipmentMiles,
    getTopLanesShipmentData,
    getViewLanesTableData
} from "store/intermodalReport/IntermodalReportSlice";
import {
    sustainableReducer,
    getConfigConstants
} from "store/sustain/sustainSlice";
import userEvent from "@testing-library/user-event";
import intermodalReportService from "store/intermodalReport/intermodalReportService";
import {
    ApiTest,
    TestFullFilledSlice,
    TestSliceMethod,
} from "commonCase/ReduxCases";
import { nodeUrl } from "constant";


// Payload for intermodal report filter data
const intermodalFilterPayload = {
    year: 2023,
};

// Configuration for posting intermodal report filter data via Redux
const getIntermodalReportFilterDataSlice = {
    service: intermodalReportService,
    serviceName: "getIntermodalReportFilterDataApi",
    sliceName: "getIntermodalReportFilterData",
    sliceImport: getIntermodalReportFilterData,
    data: intermodalFilterPayload,
    reducerName: intermodalReportDataReducer,
    loadingState: "isLoadingIntermodalFilterData",
    actualState: "intermodalFilterData",
};

// Configuration for API testing of posting intermodal report filter data
const getIntermodalReportFilterDataApi = {
    serviceName: "getIntermodalReportFilterDataApi",
    method: "post",
    data: intermodalFilterPayload,
    serviceImport: intermodalReportService,
    route: `${nodeUrl}intermodal-report-filter`,
};

// Payload for intermodal report matrix data
const intermodalMatrixPayload = {
    year: 2023,
    carrier_name: "",
};

const interModalLanePayload = {
    year: 2023,
    carrier_name: '',
    page: '',
    page_size: '',
    column: '',
    order_by: ''
}

const getViewLaneDetailPayload = {
    lane_name: ''
}


// Configuration for posting intermodal report matrix data via Redux
const getIntermodalReportMatirxDataSlice = {
    service: intermodalReportService,
    serviceName: "getIntermodalReportMatrixDataApi",
    sliceName: "getIntermodalReportMatirxData",
    sliceImport: getIntermodalReportMatirxData,
    data: intermodalMatrixPayload,
    reducerName: intermodalReportDataReducer,
    loadingState: "isLoadingIntermodalReportMatrixData",
    actualState: "intermodalReportMatrixData",
};

// Configuration for API testing of posting intermodal report matrix data
const getIntermodalReportMatrixDataApi = {
    serviceName: "getIntermodalReportMatrixDataApi",
    method: "post",
    data: intermodalMatrixPayload,
    serviceImport: intermodalReportService,
    route: `${nodeUrl}intermodal-report-matrix`,
};

// Configuration for posting intermodal report matrix data via Redux
const getTopLanesShipmentDataSlice = {
    service: intermodalReportService,
    serviceName: "getTopLanesShipmentDataApi",
    sliceName: "getTopLanesShipmentData",
    sliceImport: getTopLanesShipmentData,
    data: interModalLanePayload,
    reducerName: intermodalReportDataReducer,
    loadingState: "isLoadingTopLanesByShipmentData",
    actualState: "topLanesByShipmentData",
};

// Configuration for API testing of posting intermodal report matrix data
const getTopLanesShipmentDataApi = {
    serviceName: "getTopLanesShipmentDataApi",
    method: "post",
    data: interModalLanePayload,
    serviceImport: intermodalReportService,
    route: `${nodeUrl}get-list-shipment-miles`,
};


// Configuration for posting intermodal report matrix data via Redux
const getViewLaneDetailSlice = {
    service: intermodalReportService,
    serviceName: "getViewLaneDetailApi",
    sliceName: "getViewLanesTableData",
    sliceImport: getViewLanesTableData,
    data: getViewLaneDetailPayload,
    reducerName: intermodalReportDataReducer,
    loadingState: "isLoadingViewLanesData",
    actualState: "getViewLanesData",
};

// Configuration for API testing of posting intermodal report matrix data
const getViewLaneDetailApi = {
    serviceName: "getViewLaneDetailApi",
    method: "post",
    data: getViewLaneDetailPayload,
    serviceImport: intermodalReportService,
    route: `${nodeUrl}get-lane-details`,
};


const getLaneByShipmentMilesSlice = {
    service: intermodalReportService,
    serviceName: "getLaneByShipmentMilesApi",
    sliceName: "getLaneByShipmentMiles",
    sliceImport: getLaneByShipmentMiles,
    data: getViewLaneDetailPayload,
    reducerName: intermodalReportDataReducer,
    loadingState: "isLoadingLaneByShipmentMilesGraph",
    actualState: "getLaneByShipmentMilesGraph",
};

// Configuration for API testing of posting intermodal report matrix data
const getLaneByShipmentMilesApi = {
    serviceName: "getLaneByShipmentMilesApi",
    method: "post",
    data: intermodalMatrixPayload,
    serviceImport: intermodalReportService,
    route: `${nodeUrl}get-lanes-by-shipments-miles`,
};

// Execute Redux slice tests for various data
TestFullFilledSlice({
    data: [getIntermodalReportFilterDataSlice, getIntermodalReportMatirxDataSlice, getTopLanesShipmentDataSlice, getViewLaneDetailSlice, getLaneByShipmentMilesSlice],
});

// Execute API tests for various data
ApiTest({
    data: [getIntermodalReportFilterDataApi, getIntermodalReportMatrixDataApi, getTopLanesShipmentDataApi, getViewLaneDetailApi, getLaneByShipmentMilesApi],
});

TestSliceMethod({
    data: [getIntermodalReportFilterDataSlice, getIntermodalReportMatirxDataSlice, getTopLanesShipmentDataSlice, getViewLaneDetailSlice, getLaneByShipmentMilesSlice],
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

describe("test lane view", () => {
    let useDispatchMock: jest.Mock;
    let useSelectorMock: jest.Mock;
    let stores: EnhancedStore;
    const navigate = jest.fn();
    beforeEach(() => {
        stores = configureStore({
            reducer: {
                intermodalReport: intermodalReportDataReducer.reducer,
                sustain: sustainableReducer.reducer,
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

        const mockDispatch = jest.fn();
        useDispatchMock.mockReturnValue(mockDispatch);
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        cleanup();
    });

    const renderIntermodalReportView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <IntermodalReportView />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for whole page `, async () => {
        await renderIntermodalReportView();
        expect(screen.getByTestId("intermodal-report-view")).toBeInTheDocument();
    });

    // year dropdown
    it(`selectable dropdown test case for year and carrier`, async () => {
        useSelectorMock.mockReturnValue({
            loginDetails: {
                data: authMockData?.userdata
            },

            intermodalFilterData: {
                data: {
                    years: [20256],

                    carriers: [
                        "Carrier1",
                        "Carrier2",
                    ],
                },
            },
        });

        await renderIntermodalReportView();

        const options = screen.getByLabelText("year-dropdown"); // Array of matching elements
        act(() => {
            userEvent.click(options);
        });
        const yearOption = await screen.findAllByText("20256");
        userEvent.click(yearOption[0]);

        const carrierOptions = screen.getByLabelText("carrier-dropdown"); // Array of matching elements
        act(() => {
            userEvent.click(carrierOptions);
        });
        const carrierOption = await screen.findAllByText("Carrier1");
        userEvent.click(carrierOption[0]);

    });


    it(` Lanes by Shipments and Mile  dropdown test case for year and carrier`, async () => {
        useSelectorMock.mockReturnValue({
            loginDetails: {
                data: authMockData?.userdata
            },

            intermodalFilterData: {
                data: {
                    years: [20256],

                    carriers: [
                        "Carrier1",
                        "Carrier2",
                    ],
                    tranTableCarrier: [
                        "Carrier1",
                        "Carrier2",
                    ]
                },
            },
        });

        await renderIntermodalReportView();


        const options1 = screen.getByLabelText("year-dropdown2"); // Array of matching elements
        act(() => {
            userEvent.click(options1);
        });
        const yearOption1 = await screen.findAllByText("20256");
        userEvent.click(yearOption1[0]);

        const carrierOptions = screen.getByLabelText("carrier-dropdown2"); // Array of matching elements
        act(() => {
            userEvent.click(carrierOptions);
        });
        const carrierOption = await screen.findAllByText("Carrier1");
        userEvent.click(carrierOption[0]);

    });


    //table
    // it(`table test case`, async () => {
    //     await renderIntermodalReportView();

    // });


    it(`<section> test case for pagination `, async () => {
        useSelectorMock.mockReturnValue({
            loginDetails: {
                data: authMockData?.userdata
            },

            topLanesByShipmentData: {
                data: {

                    "list": [
                        {
                            "origin": "Cedar Rapids, IA",
                            "destination": "San Bernardino, CA",
                            "carrier_name": "J.B. HUNT INTERMODAL",
                            "lane_name": "Cedar Rapids, IA_San Bernardino, CA",
                            "total_shipments": 3405,
                            "total_distance": 6014510
                        },
                    ],
                    "pagination": {
                        "page": 1,
                        "page_size": 10,
                        "total_count": 868
                    }
                }
            },
            configConstants: {
                data: {
                    DEFAULT_YEAR: 2024,
                    rd_radius: 20,
                    ev_radius: 20
                }
            },
        });

        await renderIntermodalReportView();
        expect(screen.getByLabelText("pagination-dropdown")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("pagination-dropdown"));

        const paginationData = await screen.findByText("50");
        await act(async () => {
            userEvent.click(paginationData);
        });

        const anchorElement = screen.getByRole('button', { name: '2' });
        expect(anchorElement).toBeInTheDocument();
        userEvent.click(anchorElement);


        const viewMapButton = screen.getByTestId('view-lane-0');
        expect(viewMapButton).toBeInTheDocument();
        userEvent.click(viewMapButton);

        const sortIcon = await screen.findByTestId("sort_total_shipments");
        userEvent.click(sortIcon);

    });
});
