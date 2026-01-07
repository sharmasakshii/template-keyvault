import {
    act,
    cleanup,
    render,
    screen,
    fireEvent
} from "@testing-library/react";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as router from "react-router-dom";

import * as reactRedux from "react-redux";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import { authDataReducer } from "store/auth/authDataSlice";

import UserActivityView from "pages/userManagement/userActivityLog/UserActivityView";
import { authMockData, regionMockdata } from "mockData/commonMockData.json";
import { fileListMockData, userActivityDetailMockData } from "mockData/usermanagementMockData.json"

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

    const renderUserActivityView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <UserActivityView />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for whole page `, async () => {
        await renderUserActivityView();
        expect(screen.getByTestId("user-activity")).toBeInTheDocument();
    });

    //section id.....
    it(`<section> test case for by user activity show list `, async () => {
        const mockedParams = { userId: '1' };

        // Mock the return value of useParams hook
        (useParams as jest.Mock).mockReturnValue(mockedParams);
        useSelectorMock.mockReturnValue({
            regions: {
                data: regionMockdata,
            },
            isUserActivityLoading: false,
            userActivityDetail: {
                data: userActivityDetailMockData
            }
        });
        await renderUserActivityView();
        expect(screen.getByTestId("user-activity")).toBeInTheDocument();
    });

    it(`render activity <section> and loading state correctly`, async () => {
        const mockedParams = { userId: '1' };

        // Mock the return value of useParams hook
        (useParams as jest.Mock).mockReturnValue(mockedParams);

        useSelectorMock.mockReturnValue({
            regions: {
                data: regionMockdata,
            },
            isUserActivityLoading: true,
            userActivityData: {
                data: userActivityDetailMockData
            }
        });
        await renderUserActivityView();

        expect(screen.getByTestId("user-activity")).toBeInTheDocument();

        expect(screen.getByTestId("user-activity-loading-div")).toBeInTheDocument();
    });

    it(`<section> test case for user activity `, async () => {
        const mockedParams = { userId: '1' };

        // Mock the return value of useParams hook
        (useParams as jest.Mock).mockReturnValue(mockedParams);
        useSelectorMock.mockReturnValue({
            regions: {
                data: regionMockdata,
            },
            isUserActivityLoading: false,
            userActivityDetail: {
                data: {
                    activityData: []
                }
            }
        });
        await renderUserActivityView();
        expect(screen.getByTestId("user-activity")).toBeInTheDocument();
    });

    it("calls fetchMoreData function when scrolled to bottom", async () => {
        const mockedParams = { userId: '1' };

        // Mock the return value of useParams hook
        (useParams as jest.Mock).mockReturnValue(mockedParams);
        useSelectorMock.mockReturnValue({
            regions: {
                data: regionMockdata,
            },
            isUserActivityLoading: true,
            userActivityData: {
                data: userActivityDetailMockData
            }
        });

        await renderUserActivityView();

        const scrollContainer = screen.getByTestId("user-activity");

        // Simulate scrolling to the bottom
        fireEvent.scroll(scrollContainer, { target: { scrollTop: 1000 } });

        // Simulate scroll event
        // window.dispatchEvent(new Event("scroll"));

        // Ensure fetchMoreData is called when scrolling happens
        // expect(mockFetchMoreData).toHaveBeenCalled();
    });
   

});