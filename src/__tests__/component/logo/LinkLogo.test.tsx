import { act, cleanup, render, screen } from "@testing-library/react";
import * as utils from "../../../store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as router from "react-router-dom";
import * as reactRedux from "react-redux";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import { authMockData } from "mockData/commonMockData.json";
import { authDataReducer } from "store/auth/authDataSlice";
import LinkLogo from "component/logo/LinkLogo";
import { decarbReducer } from "store/scopeThree/track/decarb/decarbSlice";
import { sustainableReducer } from "store/sustain/sustainSlice";
import { laneDetailsReducer } from "store/scopeThree/track/lane/laneDetailsSlice";
jest.mock("../../../store/redux.hooks", () => ({
    ...jest.requireActual("../../../store/redux.hooks"),
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

window.HTMLElement.prototype.scrollIntoView = jest.fn();


describe("test LinkLogo view ", () => {
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

    const renderLinkLogo = async () => {
        return await act(async () => {
            const url = 'https://example.com';
            const data = 'logo.png';
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <LinkLogo url={url} data={data} />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };


    //section id.....
    it(`<section> test case for whole page `, async () => {
        // mockCommonData();
        useSelectorMock.mockReturnValue({
            loginDetails: { data: authMockData },
        });
        await renderLinkLogo();
        expect(screen.getByTestId("linkView")).toBeInTheDocument();
    });



});
