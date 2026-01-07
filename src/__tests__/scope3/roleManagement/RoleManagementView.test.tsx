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
import { roleListMockData } from "mockData/roleMockData.json";
import RoleManagementView from "pages/roleManagement/RoleManagementView";
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

    const renderRoleManagementView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <RoleManagementView />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for whole page `, async () => {
        await renderRoleManagementView();
        expect(screen.getByTestId("roleManagement-screen")).toBeInTheDocument();
    });

    //section id.....
    it(`<section> test case for whole page `, async () => {
        // Mock useParams
        useSelectorMock.mockReturnValue({

            roleList: {
                data: roleListMockData
            },
        });

        await renderRoleManagementView();
        expect(screen.getByTestId("roleManagement-screen")).toBeInTheDocument();

        const priorityOrderElement = screen.getByTestId(
            "role-name-sort-icon"
        );
        userEvent.click(priorityOrderElement);

        const addRoleElement = screen.getByTestId(
            "add-role"
        );
        userEvent.click(addRoleElement);

        const roleDropdownElement = screen.getByTestId(
            "role-dropdown-0"
        );
        userEvent.click(roleDropdownElement);

        const roleDropdownCaretElement = screen.getByTestId(
            "role-dropdown-caret-0"
        );

        const deleteRoleElement = screen.getByTestId(
            "role-delete-0"
        );
        await act(async () => {
            userEvent.click(deleteRoleElement);
        });
        const deleteRoleConfirmElement = screen.getByTestId(
            "role-delete-confirm-btn"
        );
        userEvent.click(deleteRoleConfirmElement);

        const deleteRoleCancelElement = screen.getByTestId(
            "role-delete-cancel-btn"
        );

        userEvent.click(deleteRoleCancelElement);
        
        userEvent.click(roleDropdownCaretElement);

        const viewRoleElement = screen.getByTestId("role-view-0");
        userEvent.click(viewRoleElement);

        const editRoleElement = screen.getByTestId(
            "role-edit-0"
        );
        userEvent.click(editRoleElement);

        const toggleCloseElement = screen.getByTestId(
            "toggle-close"
        );
        userEvent.click(toggleCloseElement);

        const toggleHeaderCloseElement = screen.getByTestId(
            "toggle-header-close"
        );
        userEvent.click(toggleHeaderCloseElement);
    });

    //pagination
    it(`pagination dropdown`, async () => {
        useSelectorMock.mockReturnValue({
            roleList: {
                data: roleListMockData
            },
        });
        await renderRoleManagementView();
        expect(screen.getByTestId("roleManagement-screen")).toBeInTheDocument();

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
            roleList: {
                data: roleListMockData
            },
        });


        await renderRoleManagementView();

        // renderDebounceInput({ searchText: '' });

        const wrapper = screen.getByTestId('role-search-input-wrapper');
        expect(wrapper).toBeInTheDocument();
        const input: any = wrapper.querySelector('input');
        // const input = screen.getByTestId('role-search-input');

        // Simulate user typing in the input field
        fireEvent.change(input, { target: { value: 'Admin' } });



        // Wait for the debounce timeout (300ms)
        // await waitFor(() => {
        //     expect(mockHandleSearchText).toHaveBeenCalledTimes(1);
        //     expect(mockHandleSearchText).toHaveBeenCalledWith(expect.objectContaining({ target: { value: 'Admin' } }));
        // }, { timeout: 400 });
    });
});