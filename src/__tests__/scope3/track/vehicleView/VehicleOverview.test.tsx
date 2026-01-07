// Import necessary modules and components
import {
    act,
    render,
    cleanup,
    screen,
} from "@testing-library/react";
import * as reactRedux from "react-redux";
import * as router from "react-router-dom";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import { authMockData } from "mockData/commonMockData.json";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import { authDataReducer } from "store/auth/authDataSlice";
import { commonDataReducer } from "store/commonData/commonSlice";
import { fuelDataReducer } from "store/fuel/fuelSlice";
import FuelOverviewView from "pages/fuelOverview/FuelOverviewView";

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

describe("test lane view for facility ", () => {
    let useDispatchMock: jest.Mock;
    let useSelectorMock: jest.Mock;
    let stores: EnhancedStore;
    const navigate = jest.fn();

    beforeEach(() => {
        stores = configureStore({
            reducer: {
                fuel: fuelDataReducer?.reducer,
                auth: authDataReducer.reducer,
                commonData: commonDataReducer.reducer,
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

    const renderVehicleOverView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <FuelOverviewView overViewType="vehicleModel" dbName="VehicleModel" pageTitle="Vehicle" tableLabel="Vehicle Model" />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for by fuel overview view page `, async () => {
        await renderVehicleOverView();
        expect(screen.getByTestId("vehicleModel-view")).toBeInTheDocument();
    });
});
