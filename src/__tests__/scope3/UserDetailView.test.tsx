import {
    act,
    cleanup,
    render,
    screen,
    within
} from "@testing-library/react";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as router from "react-router-dom";

import * as reactRedux from "react-redux";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import { authDataReducer } from "store/auth/authDataSlice";

import UserDetailView from "pages/userManagement/detail/UserDetailView";
import { authMockData, regionMockdata } from "mockData/commonMockData.json";
import { fileListMockData, userDetailMockData } from "mockData/usermanagementMockData.json"

import userEvent from "@testing-library/user-event";

import { useParams } from 'react-router-dom';

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

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn()
    },
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

    const renderUserDetailView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <UserDetailView />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for whole page `, async () => {
        await renderUserDetailView();
        expect(screen.getByTestId("user-detail")).toBeInTheDocument();
    });

    //section id.....
    it(`<section> test case for by fuel overview view page `, async () => {
        const mockedParams = { userId: '1' };

        // Mock the return value of useParams hook
        (useParams as jest.Mock).mockReturnValue(mockedParams);
        useSelectorMock.mockReturnValue({
            regions: {
                data: regionMockdata,
            },
            userFilListDetail: {
                data: fileListMockData
            }
        });
        await renderUserDetailView();
        expect(screen.getByTestId("user-detail")).toBeInTheDocument();
        fileListMockData?.forEach((ele: any) => {
            const downloadFile = screen.getByTestId(`download-file-${ele?.id}`);
            userEvent.click(downloadFile);

        });
    });

    //section id.....
    it(`<section> test case for delete user view page `, async () => {
        const mockedParams = { userId: '1' };

        // Mock the return value of useParams hook
        (useParams as jest.Mock).mockReturnValue(mockedParams);
        useSelectorMock.mockReturnValue({
            regions: {
                data: regionMockdata,
            },
        });
        await renderUserDetailView();
        expect(screen.getByTestId("user-detail")).toBeInTheDocument();
        const deleteUser = screen.getByTestId(`delete-btn`);
        userEvent.click(deleteUser);
        await act(async () => {
            userEvent.click(deleteUser);
        });

        const deleteUserCancelElement = screen.getByTestId("user-delete-cancel-btn");
        userEvent.click(deleteUserCancelElement);

        await act(async () => {
            userEvent.click(deleteUser);
        });

        const toggleCloseElement = screen.getByTestId("toggle-close");
        userEvent.click(toggleCloseElement);

        await act(async () => {
            userEvent.click(deleteUser);
        });
        const toggleHeaderCloseElement = screen.getByTestId("toggle-header-close");
        userEvent.click(toggleHeaderCloseElement);

        await act(async () => {
            userEvent.click(deleteUser);
        });
        const deleteUserConfirmElement = screen.getByTestId("user-delete-confirm-btn");
        userEvent.click(deleteUserConfirmElement);


    });

    it(`<section> test case for by user status view page `, async () => {
        const mockedParams = { userId: '1' };

        // Mock the return value of useParams hook
        (useParams as jest.Mock).mockReturnValue(mockedParams);
        useSelectorMock.mockReturnValue({
            regions: {
                data: regionMockdata,
            },
            singleUserDetail: {
                data: userDetailMockData
            }
        });
        await renderUserDetailView();
        expect(screen.getByTestId("user-detail")).toBeInTheDocument();

        const dropdownStatus = screen.getByLabelText("user-status-dropdown")
        expect(dropdownStatus).toBeInTheDocument();
        await act(async () => {
            userEvent.click(dropdownStatus);
        });

        const options = screen.getAllByText("Activate"); // Array of matching elements
        userEvent.click(options[options.length - 1]);
        expect(require('react-toastify').toast.error)

    });

    it(`<section> test case for by Deactivate user status view page `, async () => {
        const mockedParams = { userId: '1' };

        // Mock the return value of useParams hook
        (useParams as jest.Mock).mockReturnValue(mockedParams);
        useSelectorMock.mockReturnValue({
            regions: {
                data: regionMockdata,
            },
            singleUserDetail: {
                data: userDetailMockData
            }
        });
        await renderUserDetailView();
        expect(screen.getByTestId("user-detail")).toBeInTheDocument();

        const dropdownStatus = screen.getByLabelText("user-status-dropdown")
        expect(dropdownStatus).toBeInTheDocument();

        await act(async () => {
            userEvent.click(dropdownStatus);
        });
        const optionDeactivate = screen.getAllByText("Deactivate"); // Array of matching elements

        await act(async () => {
            userEvent.click(optionDeactivate[optionDeactivate.length - 1]);
        })
        const statusUserCancelElement = screen.getByTestId("user-status-cancel-btn");
        userEvent.click(statusUserCancelElement);

        userEvent.click(optionDeactivate[optionDeactivate.length - 1]);
        const statusUserConfirmElement = screen.getByTestId("user-status-confirm-btn");
        userEvent.click(statusUserConfirmElement);

    });
});