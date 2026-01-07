import {
    act,
    cleanup,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as router from "react-router-dom";

import * as reactRedux from "react-redux";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import { authMockData } from "mockData/commonMockData.json";
import { authDataReducer } from "store/auth/authDataSlice";
import {
    fuelProviderListMockData,
} from "mockData/fuelProviderListMockData.json";
import FuelStopsView from "pages/fuelStops/FuelStopsView";


import userEvent from "@testing-library/user-event";
import {
    ApiTest,
    TestFullFilledSlice,
    TestSliceMethod,
} from "commonCase/ReduxCases";
import {
    fuelStopDataReducer,
    getFuelStopProviderList,
    getFuelStopsList,
    resetFuelStopsData,
    initialState
} from "store/fuelStops/fuelStopSlice";
import { nodeUrl } from "constant"
import fuelStopService from "store/fuelStops/fuelStopService";

const fuelStopProviderPayload = {}
// Configuration for API testing of fetching graph filter dates data
const getFuelStopProviderListApiTestData = {
    serviceName: "fuelStopProviderListApi",
    method: "get",
    data: fuelStopProviderPayload,
    serviceImport: fuelStopService,
    route: `${nodeUrl}get-fuel-stops-provoiders`,
};

// Configuration for fetching graph filter dates data via Redux
const getFuelStopProviderListDataObject = {
    service: fuelStopService,
    serviceName: "fuelStopProviderListApi",
    sliceName: "getFuelStopProviderList",
    sliceImport: getFuelStopProviderList,
    data: fuelStopProviderPayload,
    reducerName: fuelStopDataReducer,
    loadingState: "isLoadingFuelStopProvider",
    actualState: "fuelProviderListData",
};

// Configuration for API testing of fetching graph filter dates data
const getFuelStopsListApiTestData = {
    serviceName: "fuelStopListApi",
    method: "post",
    data: fuelStopProviderPayload,
    serviceImport: fuelStopService,
    route: `${nodeUrl}get-fuel-stops-provoiders-list`,
};

// Configuration for fetching graph filter dates data via Redux
const getFuelStopsListDataObject = {
    service: fuelStopService,
    serviceName: "fuelStopListApi",
    sliceName: "getFuelStopsList",
    sliceImport: getFuelStopsList,
    data: fuelStopProviderPayload,
    reducerName: fuelStopDataReducer,
    loadingState: "isLoadingFuelStopData",
    actualState: "fuelListData",
};

// Execute Redux slice tests for various data
TestFullFilledSlice({
    data: [
        getFuelStopProviderListDataObject,
        getFuelStopsListDataObject,
    ],
});


// Execute API tests for various data
ApiTest({
    data: [
        getFuelStopProviderListApiTestData,
        getFuelStopsListApiTestData,
    ],
});


TestSliceMethod({
    data: [
        getFuelStopProviderListDataObject,
        getFuelStopsListDataObject,
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

        const result = fuelStopDataReducer.reducer(modifiedState, resetFuelStopsData());

        expect(result).toEqual(initialState);
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

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}));

describe("test Role view ", () => {
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

    const renderFuelStopsView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <FuelStopsView />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for whole page `, async () => {
        await renderFuelStopsView();
        expect(screen.getByTestId("fuel-stops")).toBeInTheDocument();
    });

    //section id.....
    it(`<section> test case for whole page `, async () => {

        // Mock useParams
        useSelectorMock.mockReturnValue({
            fuelProviderListData: {
                data: fuelProviderListMockData
            },
        });

        await renderFuelStopsView();

        // const carrierDropDown = screen.getByTestId("multi-carrier-dropdown");
        // expect(carrierDropDown).toBeInTheDocument();
        // userEvent.click(carrierDropDown);

        // await waitFor(() => {
        //     expect(screen.getByText('OPTIMUS')).toBeInTheDocument();
        // });
        // userEvent.click( screen.getByText('OPTIMUS'));

    });

});