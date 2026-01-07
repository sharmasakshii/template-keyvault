import SidebarLayout from "component/layouts/sidebar";
import {
    act,
    cleanup,
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
import { fileListMockData } from "mockData/fileMockData.json"
import userEvent from "@testing-library/user-event";

// // Payload for fetching region emission data
// const getFileListPayload = {
//     "fileName": ""

// };


// // Configuration for fetching project count API data via Redux
// const getFileListApiDataObject = {
//     service: fileService,
//     serviceName: "getFileListApi",
//     sliceName: "getFileList",
//     sliceImport: getFileList,
//     data: getFileListPayload,
//     reducerName: fileReducer,
//     loadingState: "isLoadingFileList",
//     isSuccess: "isSuccess",
//     actualState: "fileList",
// };

// // Configuration for API testing of fetching project count API data
// const getFileListApiApiTestData = {
//     serviceName: "getFileListApi",
//     method: "post",
//     data: getFileListPayload,
//     serviceImport: fileService,
//     route: `${nodeUrl}get-file-management-list`,
// };



// // Execute Redux slice tests for various data
// TestFullFilledSlice({
//     data: [
//         getFileListApiDataObject,
//     ],
// });


// // Execute API tests for various data
// ApiTest({
//     data: [
//         getFileListApiApiTestData,
//     ],
// });

// TestSliceMethod({
//     data: [getFileListApiDataObject],
// });

const getActiveLiClass = (location: any, path: any) => location.pathname.includes(path) ? "active py-0" : " py-0"

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

describe("test file list", () => {
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

    const renderSidebarView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <SidebarLayout />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for whole page `, async () => {
        await renderSidebarView();
        expect(screen.getByTestId("sidebar-layout")).toBeInTheDocument();
    });

    it(`<section> Logout test case `, async () => {

        useSelectorMock.mockReturnValue({
            loginDetails: {
                data: authMockData?.userdata
            },
            scopeType: "scope3"
        });

        await renderSidebarView();
        expect(screen.getByTestId("sidebar-layout")).toBeInTheDocument();

        const userSettings = screen.getByTestId('userSettings');
        expect(userSettings).toBeInTheDocument();
        userEvent.click(userSettings);

        const knowledgeHub = screen.getByTestId('knowledgeHub');
        expect(knowledgeHub).toBeInTheDocument();
        userEvent.click(knowledgeHub);


        const applicationBtn = screen.getByTestId('application-btn');
        expect(applicationBtn).toBeInTheDocument();
        userEvent.click(applicationBtn);
    });

    it(`<section> Logout test case `, async () => {

        useSelectorMock.mockReturnValue({
            loginDetails: {
                data: authMockData?.userdata
            },
            scopeType: "scope3",
            applicationTypeStatus: "admin"
        });

        await renderSidebarView();
        expect(screen.getByTestId("sidebar-layout")).toBeInTheDocument();

        const applicationBtn = screen.getByTestId('application-btn');
        expect(applicationBtn).toBeInTheDocument();
        userEvent.click(applicationBtn);

        const dataManagement = screen.getByTestId('data-management');
        expect(dataManagement).toBeInTheDocument();
        userEvent.click(dataManagement);

        const laneSetting = screen.getByTestId('lane-setting');
        expect(laneSetting).toBeInTheDocument();
        userEvent.click(laneSetting);

    });

    it(`<section> Logout test case `, async () => {

        useSelectorMock.mockReturnValue({
            loginDetails: {
                data: authMockData?.userdata
            },
            scopeType: "scope3"
        });

        await renderSidebarView();
        expect(screen.getByTestId("sidebar-layout")).toBeInTheDocument();

        const closeSidebar = screen.getByTestId('close-sidebar');
        expect(closeSidebar).toBeInTheDocument();
        userEvent.click(closeSidebar);


        const logoutBtn = screen.getByTestId('logout-btn');
        expect(logoutBtn).toBeInTheDocument();
        userEvent.click(logoutBtn);

    });

    it("returns active class when location matches", async () => {
        const mockLocation = { pathname: "/lanes" };

        useSelectorMock.mockReturnValue({
            loginDetails: {
                data: authMockData?.userdata
            },
        });

        await renderSidebarView();
        expect(screen.getByTestId("sidebar-layout")).toBeInTheDocument();


        const result = getActiveLiClass(mockLocation, "/lanes");

        expect(result).toBe("active py-0"); // Adjust based on actual function behavior
    });

    test("returns 'active py-0' when location contains the path as a substring", () => {
        const mockLocation = { pathname: "/lanes/details" };

        const result = getActiveLiClass(mockLocation, "/lanes");

        expect(result).toBe("active py-0");
    });

    test("returns 'py-0' when location does not contain the path", () => {
        const mockLocation = { pathname: "/home" };

        const result = getActiveLiClass(mockLocation, "/lanes");

        expect(result).toBe(" py-0"); // Notice the leading space is preserved
    });
    // it(`<section> test case for whole page `, async () => {
    //     useSelectorMock.mockReturnValue({
    //         loginDetails: {
    // data: authMockData?.userdata
    // },

    //     });

    //     await renderSidebarView();
    //     expect(screen.getByTestId("data-mManagement")).toBeInTheDocument();

    //     const goToFolder = screen.getByTestId('go-to-folder-88');
    //     expect(goToFolder).toBeInTheDocument();
    //     userEvent.click(goToFolder);

    //     const backButton = screen.getByTestId('back-button');
    //     expect(backButton).toBeInTheDocument();
    //     userEvent.click(backButton);

    //     const backButtonCrumb = screen.getByTestId('back-button-crumb');
    //     expect(backButtonCrumb).toBeInTheDocument();
    //     userEvent.click(backButtonCrumb);


    // });


});