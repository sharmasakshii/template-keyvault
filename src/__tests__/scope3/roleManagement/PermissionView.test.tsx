
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
import { moduleListMockData } from "mockData/roleMockData.json";
import PermissionView from "pages/roleManagement/Permission";
import { routeKey } from "constant"

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

    const renderPermissionView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <PermissionView moduleListDto={moduleListMockData} handleChangePremission={jest.fn()} showErrorMessage={jest.fn()} />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for whole page `, async () => {
        await renderPermissionView();
        expect(screen.getByTestId("role-permission-screen")).toBeInTheDocument();
        moduleListMockData.forEach((iteam: any) => {
            const priorityOrderElement = screen.getByTestId(`role-permission-checkbox-${iteam?.slug}`);
            userEvent.click(priorityOrderElement);
            if (iteam?.slug === routeKey.AdministratorAccess) {
                iteam?.child?.forEach((res: any) => {
                    const priorityOrderChildElement = screen.getByTestId(`role-permission-administrator-checkbox-${res?.slug}`);
                    userEvent.click(priorityOrderChildElement);

                })
            } else {
                iteam?.child?.forEach((res: any) => {
                    const priorityOrderChildElement = screen.getByTestId(`role-permission-administrator-checkbox-${res?.slug}`);
                    userEvent.click(priorityOrderChildElement);
                    res?.child?.forEach((dto: any) => {
                        const priorityOrderChildDElement = screen.getByTestId(`role-permission-child-1-checkbox-${dto?.slug}`);
                        userEvent.click(priorityOrderChildDElement);

                    })
                })


            }


        });

    });


});
