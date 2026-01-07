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
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import { authDataReducer } from "store/auth/authDataSlice";
import { commonDataReducer } from "store/commonData/commonSlice";
import { fuelDataReducer } from "store/fuel/fuelSlice";
import FuelOverviewView from "pages/fuelOverview/FuelOverviewView";
import userEvent from "@testing-library/user-event";
import { authMockData, regionMockdata, yearMockData } from "mockData/commonMockData.json";
import {
    tableGraphMockData
} from "../../../../mockData/regionalViewMockData.json";
import { useParams } from 'react-router-dom';

import { laneBreakDownMockData } from "mockData/carrierOverViewMockData.json";


jest.mock("store/redux.hooks", () => ({
    ...jest.requireActual("store/redux.hooks"),
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
    useParams: jest.fn(),

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

    const renderFuelOverView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <FuelOverviewView overViewType="fuelType" dbName="FuelType" pageTitle="Fuel" tableLabel="Fuel" />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for by fuel overview view page `, async () => {
        await renderFuelOverView();
        expect(screen.getByTestId("fuelType-view")).toBeInTheDocument();
    });

    //section id.....
    it(`<section> test case for by fuel overview view page `, async () => {
        const mockedParams = { id: '1', years: '2024', quarters: '1' };

        // Mock the return value of useParams hook
        (useParams as jest.Mock).mockReturnValue(mockedParams);
        useSelectorMock.mockReturnValue({
            fuelLaneBreakdown: {
                data: laneBreakDownMockData
            },
            fuelOverviewDto: {
                data: {
                    responseData: {
                        intensity: 459.6,
                        max: 500
                    }
                }
            }
        });

        await renderFuelOverView();
        expect(screen.getByTestId("fuelType-view")).toBeInTheDocument();
    });

    //year selectable row
    it(`year dropdown `, async () => {
        useSelectorMock.mockReturnValue({
            emissionDates: yearMockData,
        });

        await renderFuelOverView();
        const dropdown = screen.getByLabelText("year-drop-down-carrierOverview");
        userEvent.click(dropdown);
        const option = await screen.findByText("2021");
        userEvent.click(option);
    });

    //quarterly selectable row
    it(`quarter dropdown `, async () => {
        await renderFuelOverView();
        expect(screen.getByLabelText("quarter-drop-down-carrierOverview")).toBeInTheDocument();
        await act(async () => {
            userEvent.click(screen.getByLabelText("quarter-drop-down-carrierOverview"));
        });
        const regionData = await screen.findByText("Q1");
        await act(async () => {
            userEvent.click(regionData);
        });
    });

    //navigate to other page region wise emission intensity
    it(`region wise emission intensity table graph data`, async () => {
        useSelectorMock.mockReturnValue({
            isLoading: false,
            fuelCarrierEmissionTableDto: {
                data: tableGraphMockData,
            },
        });
        await renderFuelOverView();
        expect(screen.getByTestId("table-graph-data")).toBeInTheDocument();
        expect(screen.getByTestId("change-order-intensity")).toBeInTheDocument();
        userEvent.click(screen.getByTestId("change-order-intensity"));


        tableGraphMockData?.forEach(async (ele, index) => {
            expect(screen.getByTestId(`table-row-data${index}`)).toBeInTheDocument();
            userEvent.click(screen.getByTestId(`table-row-data${index}`));
        });
    });

});
