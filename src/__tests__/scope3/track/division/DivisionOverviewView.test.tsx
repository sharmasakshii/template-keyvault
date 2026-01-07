
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
import { authMockData, yearMockData, userProfileMockData } from "mockData/commonMockData.json";
import { authDataReducer } from "store/auth/authDataSlice";
import { laneBreakDownMockData, businessUnitEmissionDivisionListMockData } from "mockData/carrierOverViewMockData.json";

import DivisionOverviewView from "pages/divisionOverview/DivisionOverviewView";
import {
    divisionOverviewReducer,
    divisionOverviewDetail,
    getDivisionRegionComparisonData,
    laneBreakdownDetailForDivision,
    businessUnitEmissionDivisionList,
    businessUnitEmissionDivision
} from "store/scopeThree/track/division/divisionOverviewSlice";

import userEvent from "@testing-library/user-event";
import divisionService from "store/scopeThree/track/division/divisionService";
import {
    ApiTest,
    TestFullFilledSlice,
    TestSliceMethod,
} from "commonCase/ReduxCases";

import {  nodeUrl } from "constant";
import { useParams } from 'react-router-dom';

const divisionOverviewDetailPayload = {}

// Configuration for API testing of fetching region table data
const divisionOverviewDetailApiTestData = {
    serviceName: "getDivisionOverviewDetailApi",
    method: "post",
    data: divisionOverviewDetailPayload,
    serviceImport: divisionService,
    route: `${nodeUrl}get-division-overview`,
};

// Configuration for posting region graph data via Redux
const divisionOverviewDetailDataObject = {
    service: divisionService,
    serviceName: "getDivisionOverviewDetailApi",
    sliceName: "divisionOverviewDetail",
    sliceImport: divisionOverviewDetail,
    data: divisionOverviewDetailPayload,
    reducerName: divisionOverviewReducer,
    loadingState: "divisionOverviewDetailDtoLoading",
    actualState: "divisionOverviewDetailDto",
};

const divisionRegionComparisonPayload = {}

// Configuration for API testing of fetching region table data
const getDivisionRegionComparisonDataApiTestData = {
    serviceName: "getDivisionRegionComparisonDataApi",
    method: "post",
    data: divisionRegionComparisonPayload,
    serviceImport: divisionService,
    route: `${nodeUrl}get-division-region-comparison-data`,
};

// Configuration for posting region graph data via Redux
const divisionRegionComparisonDataObject = {
    service: divisionService,
    serviceName: "getDivisionRegionComparisonDataApi",
    sliceName: "getDivisionRegionComparisonData",
    sliceImport: getDivisionRegionComparisonData,
    data: divisionRegionComparisonPayload,
    reducerName: divisionOverviewReducer,
    loadingState: "getDivisionRegionComparisonDataDtoLoading",
    actualState: "getDivisionRegionComparisonDataDto",
};

const laneBreakdownDetailForDivisionPayload = {}

// Configuration for API testing of fetching region table data
const laneBreakdownDetailForDivisionApiTestData = {
    serviceName: "laneBreakdownDetailForDivisionApi",
    method: "post",
    data: laneBreakdownDetailForDivisionPayload,
    serviceImport: divisionService,
    route: `${nodeUrl}get-by-division-lane-breakdown`,
};

// Configuration for posting region graph data via Redux
const laneBreakdownDetailForDivisionDataObject = {
    service: divisionService,
    serviceName: "laneBreakdownDetailForDivisionApi",
    sliceName: "laneBreakdownDetailForDivision",
    sliceImport: laneBreakdownDetailForDivision,
    data: laneBreakdownDetailForDivisionPayload,
    reducerName: divisionOverviewReducer,
    loadingState: "laneBreakdownDetailIsLoading",
    actualState: "laneBreakdownDetailForDivisionDto",
};

// 

const businessUnitEmissionDivisionListPayload = {}

// Configuration for API testing of fetching region table data
const businessUnitEmissionDivisionApiTestData = {
    serviceName: "businessUnitEmissionDivisionListApi",
    method: "post",
    data: businessUnitEmissionDivisionListPayload,
    serviceImport: divisionService,
    route: `${nodeUrl}get-business-unit-emission-division-list`,
};

// Configuration for posting region graph data via Redux
const businessUnitEmissionDivisionDataObject = {
    service: divisionService,
    serviceName: "businessUnitEmissionDivisionListApi",
    sliceName: "businessUnitEmissionDivisionList",
    sliceImport: businessUnitEmissionDivisionList,
    data: businessUnitEmissionDivisionListPayload,
    reducerName: divisionOverviewReducer,
    loadingState: "businessUnitEmissionDivisionListDtoLoading",
    actualState: "businessUnitEmissionDivisionListDto",
};

const businessUnitEmissionDivisionPayload = {}

// Configuration for API testing of fetching region table data
const getbusinessUnitEmissionDivisionApiTestData = {
    serviceName: "businessUnitEmissionDivisionApi",
    method: "post",
    data: businessUnitEmissionDivisionPayload,
    serviceImport: divisionService,
    route: `${nodeUrl}division-buisness-unit-data`,
};

// Configuration for posting region graph data via Redux
const getbusinessUnitEmissionDivisionDataObject = {
    service: divisionService,
    serviceName: "businessUnitEmissionDivisionApi",
    sliceName: "businessUnitEmissionDivision",
    sliceImport: businessUnitEmissionDivision,
    data: businessUnitEmissionDivisionPayload,
    reducerName: divisionOverviewReducer,
    loadingState: "businessUnitEmissionDivisionDtoLoading",
    actualState: "businessUnitEmissionDivisionDto",
};
// Execute Redux slice tests for various data
TestFullFilledSlice({
    data: [
        divisionOverviewDetailDataObject,
        divisionRegionComparisonDataObject,
        laneBreakdownDetailForDivisionDataObject,
        businessUnitEmissionDivisionDataObject,
        getbusinessUnitEmissionDivisionDataObject
    ],
});

// Execute API tests for various data
ApiTest({
    data: [
        divisionOverviewDetailApiTestData,
        getDivisionRegionComparisonDataApiTestData,
        laneBreakdownDetailForDivisionApiTestData,
        businessUnitEmissionDivisionApiTestData,
        getbusinessUnitEmissionDivisionApiTestData
    ],
});

TestSliceMethod({
    data: [
        divisionOverviewDetailDataObject,
        divisionRegionComparisonDataObject,
        laneBreakdownDetailForDivisionDataObject,
        businessUnitEmissionDivisionDataObject,
        getbusinessUnitEmissionDivisionDataObject
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

    const renderDivisionOverviewView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <DivisionOverviewView />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for whole page `, async () => {
        await renderDivisionOverviewView();
        expect(screen.getByTestId("division-overview")).toBeInTheDocument();
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
            laneBreakdownDetailForDivisionDto: {
                data: laneBreakDownMockData
            },
        });

        await renderDivisionOverviewView();
        expect(screen.getByTestId("division-overview")).toBeInTheDocument();


        expect(screen.getByTestId("back-button-division")).toBeInTheDocument();
        userEvent.click(screen.getByTestId("back-button-division"));

        expect(screen.getByLabelText("year-drop-down-division")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("year-drop-down-division"));
        const yearOption = await screen.findByText("2021");
        userEvent.click(yearOption);

        // expect(screen.getByLabelText("quarter-drop-down-division")).toBeInTheDocument();
        // userEvent.click(screen.getByLabelText("quarter-drop-down-division"));
        // const quarterOption = await screen.findByText("Q4");
        // userEvent.click(quarterOption);

    });

    //section id.....
    it(`<section> test case for region table `, async () => {
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

            businessUnitEmissionDivisionListDto: {
                data: businessUnitEmissionDivisionListMockData
            }

        });
        await renderDivisionOverviewView();
        expect(screen.getByTestId("division-overview")).toBeInTheDocument();

        expect(screen.getByTestId("change-order-intensity-region")).toBeInTheDocument();
        fireEvent.click(screen.getByTestId("change-order-intensity-region"));
        expect(screen.getByTestId("change-order-emission-region")).toBeInTheDocument();
        fireEvent.click(screen.getByTestId("change-order-emission-region"));
        expect(screen.getByTestId("change-order-shipments-region")).toBeInTheDocument();
        fireEvent.click(screen.getByTestId("change-order-shipments-region"));

    });

    it(`<section> test case for business table `, async () => {
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

            businessUnitEmissionDivisionListDto: {
                data: businessUnitEmissionDivisionListMockData
            }

        });
        await renderDivisionOverviewView();
        expect(screen.getByTestId("division-overview")).toBeInTheDocument();

        expect(screen.getByTestId("change-order-intensity-business")).toBeInTheDocument();
        fireEvent.click(screen.getByTestId("change-order-intensity-business"));
        expect(screen.getByTestId("change-order-emission-business")).toBeInTheDocument();
        fireEvent.click(screen.getByTestId("change-order-emission-business"));
        expect(screen.getByTestId("change-order-shipments-business")).toBeInTheDocument();
        fireEvent.click(screen.getByTestId("change-order-shipments-business"));

    });


});
