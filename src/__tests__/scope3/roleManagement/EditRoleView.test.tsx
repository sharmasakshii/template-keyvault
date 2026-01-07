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
    moduleListMockData, createRoleMockData, roleDetailMockData
} from "mockData/roleMockData.json";
import EditRoleView from "pages/roleManagement/update/EditRoleView";
import { routeKey } from "constant"


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

    const renderEditRoleView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <EditRoleView />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for whole page `, async () => {
        await renderEditRoleView();
        expect(screen.getByTestId("edit-role-form")).toBeInTheDocument();
    });

    it(`view role form`, async () => {
        useSelectorMock.mockReturnValue({
            moduleList: {
                data: moduleListMockData
            },
            createRoleDto: {
                data: createRoleMockData
            },
            roleDetail: {
                data: roleDetailMockData
            }
        });
        await renderEditRoleView();
        expect(screen.getByTestId("edit-role-form")).toBeInTheDocument();

        const roleName = screen.getByTestId('role-name');
        expect(roleName).toBeInTheDocument();
        fireEvent.keyDown(roleName, { target: { value: 'Admin' } });


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
        const cancelbtn = screen.getByTestId('cancel-update-role');
        expect(cancelbtn).toBeInTheDocument();
        userEvent.click(cancelbtn);

    })

    it(`Edit role`, async () => {
        useSelectorMock.mockReturnValue({
            moduleList: {
                data: moduleListMockData
            },
            createRoleDto: {
                data: createRoleMockData
            },
            roleDetail: {
                data: roleDetailMockData
            }
        });
        await renderEditRoleView();
        expect(screen.getByTestId("edit-role-form")).toBeInTheDocument();

        const roleName = screen.getByTestId('role-name');
        expect(roleName).toBeInTheDocument();
        // Simulate user typing in the input field
        fireEvent.change(roleName, { target: { value: 'Admin' } });

        const addRolebtn = screen.getByTestId('submit-update-role');
        expect(addRolebtn).toBeInTheDocument();
        userEvent.click(addRolebtn);

        const roleDesc = screen.getByTestId('role-desc');
        expect(roleDesc).toBeInTheDocument();
        // Simulate user typing in the input field
        fireEvent.change(roleDesc, { target: { value: 'Admin' } });
        userEvent.click(addRolebtn);

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
        userEvent.click(addRolebtn);
    })
});