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
import { authMockData } from "mockData/commonMockData.json";
import { authDataReducer } from "store/auth/authDataSlice";
import OnBoardView from "pages/scopeOne/onBoard/OnBoardView";
import { questionsDtoMockData } from "mockData/onBoardingMockData.json"
import userEvent from "@testing-library/user-event";


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

describe("test create role  ", () => {
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

    const renderOnBoardView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <OnBoardView />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for whole page `, async () => {
        await renderOnBoardView();
        expect(screen.getByTestId("scope-one-screen-onboarding")).toBeInTheDocument();
    });

    it(`<section> test case for file dropdown download file `, async () => {
        useSelectorMock.mockReturnValue({
            questionsDto: {
                data: questionsDtoMockData,
            },

        });

        await renderOnBoardView();
        const scopeOneOnboardingNext = screen.getByTestId(
            "scope-one-screen-onboarding-next"
        );
        expect(scopeOneOnboardingNext).toBeInTheDocument();



        // text type
        const onBoardingInput = screen.getByTestId('scope-one-143221');
        expect(onBoardingInput).toBeInTheDocument();

        fireEvent.change(onBoardingInput, { target: { value: 'test' } });


        const onBoardingRadio = screen.getByTestId('scope-one-713244-5666123');
        expect(onBoardingRadio).toBeInTheDocument();
        userEvent.click(onBoardingRadio);


        const onBoardingCheckBox = screen.getByTestId('scope-one-102342-1099823');
        expect(onBoardingCheckBox).toBeInTheDocument();
        await act(async () => {
            userEvent.click(onBoardingCheckBox);
        })
        userEvent.click(onBoardingCheckBox);

        expect(screen.getByLabelText("scope-one-10234233")).toBeInTheDocument();
        await act(async () => {
            userEvent.click(screen.getByLabelText("scope-one-10234233"));
        })

        const options = screen.getAllByText("Mobile_Fuel_Combustion"); // Array of matching elements
        userEvent.click(options[options.length - 1]);

        // await act(async () => {
        userEvent.click(scopeOneOnboardingNext);

        const scopeOneOnboardingBack = screen.getByTestId(
            "scope-one-screen-onboarding-back"
        );
        expect(scopeOneOnboardingBack).toBeInTheDocument();

        // await act(async () => {
        userEvent.click(scopeOneOnboardingBack);


        // 
    })

});