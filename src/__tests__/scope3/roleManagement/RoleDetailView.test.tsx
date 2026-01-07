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
import {
    userListMockData,
} from "mockData/usermanagementMockData.json";
import RoleDetailView from "pages/roleManagement/view/RoleDetailView";


import userEvent from "@testing-library/user-event";
import {
    ApiTest,
    TestFullFilledSlice,
    TestSliceMethod,
} from "commonCase/ReduxCases";

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

    const renderRoleDetailView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <RoleDetailView />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for whole page `, async () => {
        await renderRoleDetailView();
        expect(screen.getByTestId("role-detail-screen")).toBeInTheDocument();
    });

    //section id.....
    it(`<section> test case for whole page `, async () => {
        (useParams as jest.Mock).mockReturnValue({
            roleId: 1
        });

        // Mock useParams
        useSelectorMock.mockReturnValue({

            userList: {
                data: userListMockData
            },
        });

        await renderRoleDetailView();
        expect(screen.getByTestId("role-detail-screen")).toBeInTheDocument();

        const priorityOrderElement = screen.getByTestId(
            "change-order-name-user-btn"
        );
        userEvent.click(priorityOrderElement);

        const userDropdownCaretElement = screen.getByTestId(
            "user-dropdown-caret-0"
        );
        userEvent.click(userDropdownCaretElement);

        userListMockData?.list.forEach((ele, index) => {
            expect(screen.getByTestId(`dots-id ${index}`)).toBeInTheDocument();
            fireEvent.click(screen.getByTestId(`dots-id ${index}`));
            fireEvent.click(screen.getByTestId(`view-details ${index}`));
            fireEvent.click(screen.getByTestId(`edit-details ${index}`));
            ele.status === 1 &&
                expect(screen.getByTestId(`status-1 ${index}`)).toBeInTheDocument();

            ele.status === 2 &&
                expect(screen.getByTestId(`status-2 ${index}`)).toBeInTheDocument();
            fireEvent.click(screen.getByTestId(`status-3 ${index}`));
        });


    });

    //pagination
    it(`pagination dropdown`, async () => {
        useSelectorMock.mockReturnValue({
            userList: {
                data: userListMockData
            },
        });
        await renderRoleDetailView();
        expect(screen.getByTestId("role-detail-screen")).toBeInTheDocument();

        const anchorElement = screen.getByRole('button', { name: '2' });
        expect(anchorElement).toBeInTheDocument();
        userEvent.click(anchorElement);

        expect(screen.getByLabelText("pagination-dropdown")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("pagination-dropdown"));

        const paginationData = await screen.findByText("40");
        await act(async () => {
            userEvent.click(paginationData);
        });

        // 
    })

    it('calls handleSearchText after debounce timeout', async () => {
        useSelectorMock.mockReturnValue({
            userList: {
                data: userListMockData
            },
        });
        await renderRoleDetailView();
        expect(screen.getByTestId("role-detail-screen")).toBeInTheDocument();

        // renderDebounceInput({ searchText: '' });

        const wrapper = screen.getByTestId('search-user-filter');
        expect(wrapper).toBeInTheDocument();
        const input: any = wrapper.querySelector('input');
        // const input = screen.getByTestId('role-search-input');

        // Simulate user typing in the input field
        fireEvent.change(input, { target: { value: 'Admin' } });


    });

    //delete id of user list table data
    it(`user delete test case for user list view page`, async () => {
        useSelectorMock.mockReturnValue({
            isUserListLoading: false,

            userList: {
                data: userListMockData
            },
        });

        await renderRoleDetailView();

        const userDropdownCaretElement = screen.getByTestId(
            "user-dropdown-caret-0"
        );

        const deleteUserElement = screen.getByTestId(
            "status-3 0"
        );
        await act(async () => {
            userEvent.click(deleteUserElement);
        });
        const deleteUserConfirmElement = screen.getByTestId(
            "user-delete-confirm-btn"
        );
        userEvent.click(deleteUserConfirmElement);

        const deleteUserCancelElement = screen.getByTestId(
            "user-delete-cancel-btn"
        );

        userEvent.click(deleteUserCancelElement);

        userEvent.click(userDropdownCaretElement);


    });


});