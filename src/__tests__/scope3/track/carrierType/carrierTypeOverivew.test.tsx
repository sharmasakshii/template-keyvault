
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
import { authMockData, yearMockData, divisionMockdata } from "mockData/commonMockData.json";
import { authDataReducer } from "store/auth/authDataSlice";

import CarrierTypeOverview from "pages/carrierTypeOverview/CarrierTypeOverview";
import {
    carrierDetailsReducer,
    getCarrierTypeReductionGraph,
    getCarrierTypeOverviewDetail,
    getCarrierTypeLaneEmissionGraph
} from "store/scopeThree/track/carrier/vendorSlice";
import userEvent from "@testing-library/user-event";
import vendorService from "store/scopeThree/track/carrier/vendorService";
import {
    ApiTest,
    TestFullFilledSlice,
    TestSliceMethod,
} from "commonCase/ReduxCases";
import store from "store"

import { nodeUrl } from "constant";

import {
  EmissionIntensityRoverviewMockData,
  businessEmissionRegionGraphMockData,
  businessGraphMockData,
  cardsMockData,
  carrierEmissionIntensityMockData,
  carrierTotalEmissionMockData,
  laneEmissionIntensityMockData,
  laneTotalEmissionMockData,
  profileMockData,
  regionFacilityEmissionMockData,
  regionFacilityTotalEmissionMockData,
  totalEmissionRoverviewMockData,
} from "mockData/regionOverviewMockdata.json";

// Payload for posting region graph data
const regionGraphPostPayload = {
    region_id: "",
    year: 2023,
    quarter: 1,
    toggel_data: 0,
};

// Configuration for posting region graph data via Redux
const getCarrierTypeReductionGraphSlice = {
    service: vendorService,
    serviceName: "getCarrierTypeReductionGraphApi",
    sliceName: "getCarrierTypeReductionGraph",
    sliceImport: getCarrierTypeReductionGraph,
    data: regionGraphPostPayload,
    reducerName: carrierDetailsReducer,
    loadingState: "isLoadingCarrierTypeReductionGraph",
    actualState: "carrierTypeReductionGraphDto",
};

// Configuration for API testing of posting region graph data
const getCarrierTypeReductionGraphApi = {
    serviceName: "getCarrierTypeReductionGraphApi",
    method: "post",
    data: regionGraphPostPayload,
    serviceImport: vendorService,
    route: `${nodeUrl}carrier-type-reduction-graph`,
};


// Configuration for posting region graph data via Redux
const getCarrierTypeOverviewDetailSlice = {
    service: vendorService,
    serviceName: "getCarrierTypeOverviewDetailApi",
    sliceName: "getCarrierTypeOverviewDetail",
    sliceImport: getCarrierTypeOverviewDetail,
    data: regionGraphPostPayload,
    reducerName: carrierDetailsReducer,
    loadingState: "isLoadingTypeOverviewDetail",
    actualState: "carrierTypeOverviewDetailDto",
};

// Configuration for API testing of posting region graph data
const getCarrierTypeOverviewDetailDtoApi = {
    serviceName: "getCarrierTypeOverviewDetailApi",
    method: "post",
    data: regionGraphPostPayload,
    serviceImport: vendorService,
    route: `${nodeUrl}carrier-type-matrix`,
};


// Configuration for posting region graph data via Redux
const getCarrierTypeLaneEmissionGraphSlice = {
    service: vendorService,
    serviceName: "getCarrierTypeLaneEmissionGraphApi",
    sliceName: "getCarrierTypeLaneEmissionGraph",
    sliceImport: getCarrierTypeLaneEmissionGraph,
    data: regionGraphPostPayload,
    reducerName: carrierDetailsReducer,
    loadingState: "carrierTypeLaneEmissionGraphDtoLoading",
    actualState: "carrierTypeLaneEmissionGraphDto",
};

// Configuration for API testing of posting region graph data
const getCarrierTypeLaneEmissionGraphDtoApi = {
    serviceName: "getCarrierTypeLaneEmissionGraphApi",
    method: "post",
    data: regionGraphPostPayload,
    serviceImport: vendorService,
    route: `${nodeUrl}carrier-type-lane-emission`,
};



// Execute Redux slice tests for various data
TestFullFilledSlice({
    data: [getCarrierTypeReductionGraphSlice, getCarrierTypeOverviewDetailSlice, getCarrierTypeLaneEmissionGraphSlice],
});

// Execute API tests for various data
ApiTest({
    data: [getCarrierTypeReductionGraphApi, getCarrierTypeOverviewDetailDtoApi, getCarrierTypeLaneEmissionGraphDtoApi],
});

TestSliceMethod({
    data: [getCarrierTypeReductionGraphSlice, getCarrierTypeOverviewDetailSlice, getCarrierTypeLaneEmissionGraphSlice],
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
    const navigate = jest.fn();
    beforeEach(() => {
        stores = configureStore({
            reducer: {
                region: carrierDetailsReducer?.reducer,
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

    const renderCarrierTypeOverview = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <CarrierTypeOverview />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for whole page `, async () => {
        await renderCarrierTypeOverview();
        expect(screen.getByTestId("carrier-type-overview")).toBeInTheDocument();
    });


    //back button
    it(`Back button to go back on region page`, async () => {
        await renderCarrierTypeOverview();
        expect(screen.getByTestId("back-button")).toBeInTheDocument();
        userEvent.click(screen.getByTestId("back-button"));


    });

    //selectable row for year
    it(`selectable dropdown test case for year`, async () => {
        useSelectorMock.mockReturnValue({
            emissionDates: yearMockData,
        });
        await renderCarrierTypeOverview();
        expect(screen.getByLabelText("year-drop-down")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("year-drop-down"));
        const regionData = await screen.findByText("2021");
        userEvent.click(regionData);
        expect(screen.getByText("2021")).toBeInTheDocument();
    });

    //selectable row for quarter data
    it(`selectable dropdown test case for quarter`, async () => {
        await renderCarrierTypeOverview();
        expect(screen.getByLabelText("quarter-drop-down")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("quarter-drop-down"));
        const regionData = await screen.findByText("Q1");
        userEvent.click(regionData);
    });

    //Sustainable cards
    it(`sustainable cards test cases`, async () => {
        useSelectorMock.mockReturnValue({
            userProfile: {
                data: {
                    profileMockData,
                },
            },
            getRegionOverviewDetailData: cardsMockData,
        });
        await renderCarrierTypeOverview();
        expect(screen.getByTestId("card-1")).toBeInTheDocument();
        expect(screen.getByTestId("card-2")).toBeInTheDocument();
        expect(screen.getByTestId("card-3")).toBeInTheDocument();
    });

    //RPG graph toggle radio buttons
    it(`RPG graph toggle radio buttons`, async () => {
        useSelectorMock.mockReturnValue({
            regionEmission: totalEmissionRoverviewMockData,
        });
        await renderCarrierTypeOverview();
        const totalEmissionRadioToggle: HTMLInputElement = screen.getByTestId("total-emission-toggle");
        expect(totalEmissionRadioToggle).toBeInTheDocument();
        userEvent.click(totalEmissionRadioToggle);
        expect(totalEmissionRadioToggle.checked).toBe(true);
    });

    //RPG graph toggle radio buttons
    it(`RPG graph toggle radio buttons`, async () => {
        useSelectorMock.mockReturnValue({
            regionEmission: EmissionIntensityRoverviewMockData,
        });
        await renderCarrierTypeOverview();
        const emissionRadioToggle: HTMLInputElement = screen.getByTestId(
            "emission-intensity-toggle"
        );
        expect(emissionRadioToggle).toBeInTheDocument();
        userEvent.click(emissionRadioToggle);
        expect(emissionRadioToggle.checked).toBe(true);
    });


});
