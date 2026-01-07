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
    userProfileMockData
} from "mockData/loginMockData.json";
import UserSettingView from "pages/usersetting/UserSettingView";


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

    const renderUserSettingView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <UserSettingView />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for whole page `, async () => {
        await renderUserSettingView();
        expect(screen.getByTestId("user-setting")).toBeInTheDocument();
    });

    it(`view user form`, async () => {
        useSelectorMock.mockReturnValue({
            userProfile: {
                data: userProfileMockData
            },
            loginDetails: {
                data: authMockData
            },
        });
        await renderUserSettingView();
        expect(screen.getByTestId("user-setting")).toBeInTheDocument();

        const firtName = screen.getByTestId('first-name');
        expect(firtName).toBeInTheDocument();
        fireEvent.keyDown(firtName, { target: { value: 'user' } });

        const addUserbtn = screen.getByTestId('update-profile');
        expect(addUserbtn).toBeInTheDocument();
        userEvent.click(addUserbtn);

        const lastName = screen.getByTestId('last-name');
        expect(lastName).toBeInTheDocument();
        fireEvent.keyDown(lastName, { target: { value: 'user' } });

        const titleName = screen.getByTestId('title-name');
        expect(titleName).toBeInTheDocument();
        fireEvent.keyDown(titleName, { target: { value: 'user' } });


        const phoneNumber = screen.getByTestId('phone-number');
        expect(phoneNumber).toBeInTheDocument();
        fireEvent.keyDown(phoneNumber, { target: { value: '89' } });


        fireEvent.change(firtName, { target: { value: 'firtName' } });
        fireEvent.change(lastName, { target: { value: 'lastName' } });
        fireEvent.change(titleName, { target: { value: 'title' } });
        fireEvent.change(phoneNumber, { target: { value: '8888888888' } });
        userEvent.click(addUserbtn);



    })


    it(`view password form`, async () => {
        useSelectorMock.mockReturnValue({
            userProfile: {
                data: userProfileMockData
            },
            loginDetails: {
                data: authMockData
            },
        });
        await renderUserSettingView();
        expect(screen.getByTestId("user-setting")).toBeInTheDocument();

        const oldPassword = screen.getByTestId('old-password');
        expect(oldPassword).toBeInTheDocument();
        fireEvent.keyDown(oldPassword, { target: { value: 'Mind' } });

        const updatePasswordbtn = screen.getByTestId('update-password');
        expect(updatePasswordbtn).toBeInTheDocument();
        userEvent.click(updatePasswordbtn);

        const newPassword = screen.getByTestId('new-password');
        expect(newPassword).toBeInTheDocument();
        fireEvent.keyDown(newPassword, { target: { value: 'user' } });

        const confirmPassword = screen.getByTestId('confirm-password');
        expect(confirmPassword).toBeInTheDocument();
        fireEvent.keyDown(confirmPassword, { target: { value: 'user' } });

        fireEvent.change(confirmPassword, { target: { value: 'MInd@123' } });
        fireEvent.change(oldPassword, { target: { value: 'Mind@123' } });
        fireEvent.change(newPassword, { target: { value: 'MInd@123' } });
        userEvent.click(updatePasswordbtn);

    })

    it(`view profile pic form`, async () => {
        useSelectorMock.mockReturnValue({
            userProfile: {
                data: userProfileMockData
            },
            loginDetails: {
                data: authMockData
            },
        });
        await renderUserSettingView();
        expect(screen.getByTestId("user-setting")).toBeInTheDocument();


        const profilePic = screen.getByTestId('profile_pic');
        expect(profilePic).toBeInTheDocument();
        userEvent.click(profilePic);

        const fileInput = screen.getByTestId("hidden-file-input");
        expect(fileInput).toBeInTheDocument();
        expect(fileInput).toHaveAttribute("type", "file");
        expect(fileInput).toHaveClass("d-none");

        const validFile = new File(["dummy content"], "image.png", {
            type: "image/png",
        });

        // Simulate a change event with a valid file
        fireEvent.change(fileInput as HTMLInputElement, { target: { files: [validFile] } });

    })

    it("shows an error if no file is selected", async () => {
        useSelectorMock.mockReturnValue({
            userProfile: {
                data: userProfileMockData
            },
            loginDetails: {
                data: authMockData
            },
        });
        await renderUserSettingView();
        expect(screen.getByTestId("user-setting")).toBeInTheDocument();
        // Simulate a change event with no file
        const fileInput = screen.getByTestId("hidden-file-input");
        expect(fileInput).toBeInTheDocument();
        fireEvent.change(fileInput as HTMLInputElement, { target: { files: [] } });
        expect((fileInput as HTMLInputElement).value).toBe("");
    });

    it("shows an error if the file size exceeds 5MB", async () => {
        useSelectorMock.mockReturnValue({
            userProfile: {
                data: userProfileMockData
            },
            loginDetails: {
                data: authMockData
            },
        });
        await renderUserSettingView();
        expect(screen.getByTestId("user-setting")).toBeInTheDocument();
        // Simulate a change event with no file
        const fileInput = screen.getByTestId("hidden-file-input");
        expect(fileInput).toBeInTheDocument();

        const largeFile = new File(["a".repeat(6 * 1024 * 1024)], "large.png", {
            type: "image/png",
        });

        // Simulate a change event with a large file
        fireEvent.change(fileInput as HTMLInputElement, { target: { files: [largeFile] } });
        expect((fileInput as HTMLInputElement).value).toBe("");
    });
});