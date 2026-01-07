
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
import { authMockData, yearMockData } from "mockData/commonMockData.json";
import { authDataReducer } from "store/auth/authDataSlice";
import {
    trailerLaneBreakdownMockData,
    trailerOverviewDtoMockData,
    trailerCarrierEmissionTableDtoMockData
} from "mockData/trailerMockData.json";
import TrailerOverviewView from "pages/trailerOverview/TrailerOverviewView";

import {
    decarbReducer
} from "store/scopeThree/track/decarb/decarbSlice";



import { useParams } from 'react-router-dom';
import { trailerDataReducer } from "store/trailer/trailerSlice";


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


jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}));

window.HTMLElement.prototype.scrollIntoView = jest.fn();


describe("trailer overview view ", () => {
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
                trailer: trailerDataReducer?.reducer
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

    const renderTrailerOverviewView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <TrailerOverviewView />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };


    //section id.....
    it(`<section> test case for whole page `, async () => {
        // Mock useParams

        (useParams as jest.Mock).mockReturnValue({ id: '123' });

        useSelectorMock.mockReturnValue({

            configConstants: {
                data: {
                    DEFAULT_YEAR: 2024
                }
            },
            trailerLaneBreakdown: {
                data: trailerLaneBreakdownMockData
            },
            trailerOverviewDto: {
                data: trailerOverviewDtoMockData
            },
            trailerCarrierEmissionTableDto: {
                data: trailerCarrierEmissionTableDtoMockData
            },
            emissionDates: yearMockData,

        });
        await renderTrailerOverviewView();
        expect(screen.getByTestId("trailer-overiew-screen-view")).toBeInTheDocument();


        expect(screen.getByTestId("back-button-trailer")).toBeInTheDocument();
        userEvent.click(screen.getByTestId("back-button-trailer"));

        expect(screen.getByLabelText("year-drop-down-trailer")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("year-drop-down-trailer"));
        const yearOption = await screen.findByText("2021");
        userEvent.click(yearOption);

        expect(screen.getByLabelText("quarter-drop-down-trailer")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("quarter-drop-down-trailer"));
        const quarterOption = await screen.findByText("Q4");
        userEvent.click(quarterOption);

    });

      //section id.....
      it(`<section> test case for whole page `, async () => {
        // Mock useParams

        (useParams as jest.Mock).mockReturnValue({ id: '123' });

        useSelectorMock.mockReturnValue({

            configConstants: {
                data: {
                    DEFAULT_YEAR: 2024
                }
            },
            trailerLaneBreakdown: {
                data: trailerLaneBreakdownMockData
            },
            trailerOverviewDto: {
                data: trailerOverviewDtoMockData
            },
            trailerCarrierEmissionTableDto: {
                data: trailerCarrierEmissionTableDtoMockData
            },
            emissionDates: yearMockData,

        });
        await renderTrailerOverviewView();
        expect(screen.getByTestId("trailer-overiew-screen-view")).toBeInTheDocument();

        expect(screen.getByTestId("change-order-intensity")).toBeInTheDocument();
        userEvent.click(screen.getByTestId("change-order-intensity"));

        expect(screen.getByTestId("change-order-intensity")).toBeInTheDocument();
        userEvent.click(screen.getByTestId("change-order-intensity"));

        expect(screen.getByTestId("table-row-data0")).toBeInTheDocument();
        userEvent.click(screen.getByTestId("table-row-data0"));

        
        // navigateLink

    });
   


});
