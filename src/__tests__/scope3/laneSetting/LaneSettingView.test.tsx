
import { act, cleanup, render, screen } from "@testing-library/react";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as router from "react-router-dom";
import * as reactRedux from "react-redux";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import { authMockData, yearMockData, userProfileMockData } from "mockData/commonMockData.json";
import { authDataReducer } from "store/auth/authDataSlice";
import { laneRangeMockData } from "mockData/laneMockData.json";

import LaneSettingView from "pages/laneSetting/LaneSettingView";
import {
    laneDetailsReducer,
    getLaneRangeOptions,
    getUpdateRangeSelections,
    laneOriginSearch,
    laneDestinationSearch
} from "store/scopeThree/track/lane/laneDetailsSlice";

import userEvent from "@testing-library/user-event";
import laneService from "store/scopeThree/track/lane/laneService";
import {
    ApiTest,
    TestFullFilledSlice,
    TestSliceMethod,
} from "commonCase/ReduxCases";

import { nodeUrl} from "constant";
import { useParams } from 'react-router-dom';

const laneRangeOptionsPayload = {}

// Configuration for API testing of fetching region table data
const getLaneRangeOptionsApiTestData = {
    serviceName: "getLaneRangeOptionApi",
    method: "get",
    data: laneRangeOptionsPayload,
    serviceImport: laneService,
    route: `${nodeUrl}all-fuel-radius-list`,
};

// Configuration for posting region graph data via Redux
const getLaneRangeOptionsDataObject = {
    service: laneService,
    serviceName: "getLaneRangeOptionApi",
    sliceName: "getLaneRangeOptions",
    sliceImport: getLaneRangeOptions,
    data: laneRangeOptionsPayload,
    reducerName: laneDetailsReducer,
    loadingState: "isLaneRangeLoading",
    actualState: "laneRangeData",
};


const updateRangeSelectionsPayload = {}

// Configuration for API testing of fetching region table data
const getUpdateRangeSelectionsApiTestData = {
    serviceName: "getUpdateRangeSelectionApi",
    method: "post",
    data: updateRangeSelectionsPayload,
    serviceImport: laneService,
    route: `${nodeUrl}update-fuel-radius-key`,
};

// Configuration for posting region graph data via Redux
const getUpdateRangeSelectionsDataObject = {
    service: laneService,
    serviceName: "getUpdateRangeSelectionApi",
    sliceName: "getUpdateRangeSelections",
    sliceImport: getUpdateRangeSelections,
    data: updateRangeSelectionsPayload,
    reducerName: laneDetailsReducer,
    loadingState: "isLaneRangeLoading",
    actualState: "updateRangeSelections",
};

const laneSearchPayload = {}

// Configuration for API testing of fetching region table data
const searchCityApiApiTestData = {
    serviceName: "searchCityApi",
    method: "post",
    data: laneSearchPayload,
    serviceImport: laneService,
    route: `${nodeUrl}carrier-search-lane-planing`,
};

// Configuration for posting region graph data via Redux
const getLaneOriginSearchDataObject = {
    service: laneService,
    serviceName: "searchCityApi",
    sliceName: "laneOriginSearch",
    sliceImport: laneOriginSearch,
    data: laneSearchPayload,
    reducerName: laneDetailsReducer,
    loadingState: "isLaneOriginLoading",
    actualState: "laneOriginData",
};

// Configuration for posting region graph data via Redux
const getLaneDestinationSearchDataObject = {
    service: laneService,
    serviceName: "searchCityApi",
    sliceName: "laneDestinationSearch",
    sliceImport: laneDestinationSearch,
    data: laneSearchPayload,
    reducerName: laneDetailsReducer,
    loadingState: "isLaneDestinationLoading",
    actualState: "laneDestinationData",
};

// Execute Redux slice tests for various data
TestFullFilledSlice({
    data: [
        getLaneRangeOptionsDataObject, getLaneOriginSearchDataObject, getUpdateRangeSelectionsDataObject, getLaneDestinationSearchDataObject
    ],
});

// Execute API tests for various data
ApiTest({
    data: [
        getLaneRangeOptionsApiTestData, getUpdateRangeSelectionsApiTestData, searchCityApiApiTestData
    ],
});

TestSliceMethod({
    data: [
        getLaneRangeOptionsDataObject, getLaneOriginSearchDataObject, getUpdateRangeSelectionsDataObject, getLaneDestinationSearchDataObject
    ]
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

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
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

    const renderLaneSettingView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <LaneSettingView />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for whole page `, async () => {
        await renderLaneSettingView();
        expect(screen.getByTestId("lane-settings")).toBeInTheDocument();
    });

    //section id.....
    it(`<section> test case for whole page `, async () => {
        // Mock useParams

        (useParams as jest.Mock).mockReturnValue({ divisionId: '123' });

        useSelectorMock.mockReturnValue({

            configConstants: {
                data: {
                    DEFAULT_YEAR: 2024
                }
            },

            emissionDates: yearMockData,
            loginDetails: {
                data: authMockData?.userdata
            },
            userProfile: {
                data: userProfileMockData
            },
            laneRangeData: {
                data: laneRangeMockData
            },
        });

        await renderLaneSettingView();
        expect(screen.getByTestId("lane-settings")).toBeInTheDocument();

        laneRangeMockData?.bio_1_20?.forEach(async (ele: any, index) => {
            expect(screen.getByTestId(`bio_1_20_${ele?.id}`)).toBeInTheDocument();
            userEvent.click(screen.getByTestId(`bio_1_20_${ele?.id}`));
        });

        expect(screen.getByTestId("form-submit")).toBeInTheDocument();
        userEvent.click(screen.getByTestId("form-submit"));

    });



});
