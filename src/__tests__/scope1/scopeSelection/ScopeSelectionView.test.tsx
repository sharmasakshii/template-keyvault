
import {
    act,
    cleanup,
    render,
    screen,
} from "@testing-library/react";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as router from "react-router-dom";
import userEvent from "@testing-library/user-event";

import * as reactRedux from "react-redux";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import { authMockData, userProfileMockData } from "mockData/commonMockData.json";
import { authDataReducer } from "store/auth/authDataSlice";


import ScopeSelectionView from "pages/scopeSelection/ScopeSelectionView";
jest.mock('lottie-react', () => () => <div data-testid="mock-lottie" />);

// import dashboardService from "store/scope1/dashboard/dashboardService";
import { nodeUrl } from "constant"
import {
    ApiTest,
    TestFullFilledSlice,
    TestSliceMethod,
} from "commonCase/ReduxCases";

// import {
//     scopeOneDashboardReducer,
//     getDashboardMatricsData,

// } from "store/scope1/dashboard/dashboardSlice";

// // Payload for fetching graph ev trailer table
// const dashboardMatricsDataPayload = {};

// // Configuration for API testing of fetching graph ev trailer table data
// const trailerTableApiTestData = {
//     serviceName: "getDashboardMatrics",
//     method: "get",
//     data: dashboardMatricsDataPayload,
//     serviceImport: dashboardService,
//     route: `${nodeUrl}matrix-data?year=&period_id=`,
// };

// // Configuration for fetching graph ev trailer table data via Redux
// const getDashboardMatricsDataObject = {
//     service: dashboardService,
//     serviceName: "getDashboardMatrics",
//     sliceName: "getDashboardMatricsData",
//     sliceImport: getDashboardMatricsData,
//     data: dashboardMatricsDataPayload,
//     reducerName: scopeOneDashboardReducer,
//     loadingState: "isLoadingDashboardMatrics",
//     actualState: "dashboardMatricsData",
// };



// // Execute Redux slice tests for various data
// TestFullFilledSlice({
//     data: [
//         getDashboardMatricsDataObject,

//     ],
// });

// // Execute API tests for various data
// ApiTest({
//     data: [
//         trailerTableApiTestData,

//     ],
// });


// TestSliceMethod({
//     data: [
//         getDashboardMatricsDataObject,

//     ],
// });

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

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn()
    },
}));

window.HTMLElement.prototype.scrollIntoView = jest.fn();


describe("Socpe One Dashboard view ", () => {
    let useDispatchMock: jest.Mock;
    let useSelectorMock: jest.Mock;
    let stores: EnhancedStore;
    const navigate = jest.fn();
    const mockDispatch = jest.fn();

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

        useDispatchMock.mockReturnValue(mockDispatch);
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        cleanup();
    });

    const renderScopeSelectionView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <ScopeSelectionView />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };


    //section id.....
    it(`<section> test case for whole page `, async () => {

        const mockData = [{
            scopeName: 'Scope 1',
            isSelected: true,
            description: 'Direct emissions from vehicles that are physically controlled or owned, such as company fleets.',
            isDisabled: "",
            imagePath: '/images/scope/scope-1.svg',
            onClick: () => jest.fn(),
        },{
            scopeName: 'Scope 2',
            isSelected: true,
            description: 'Direct emissions from vehicles that are physically controlled or owned, such as company fleets.',
            isDisabled: "",
            imagePath: '/images/scope/scope-1.svg',
            onClick: () => jest.fn(),
        },{
            scopeName: 'Scope 3',
            isSelected: true,
            description: 'Direct emissions from vehicles that are physically controlled or owned, such as company fleets.',
            isDisabled: "",
            imagePath: '/images/scope/scope-1.svg',
            onClick: () => jest.fn(),
        }]
        useSelectorMock.mockReturnValue({

            configConstants: {
                data: {
                    DEFAULT_YEAR: 2024
                }
            },
            loginDetails: {
                data: authMockData?.userdata
            },
            userProfile: {
                data: userProfileMockData
            }

        });
        await renderScopeSelectionView();
        expect(screen.getByTestId("scope-selection-view")).toBeInTheDocument();

        expect(screen.getByTestId("continue-button")).toBeInTheDocument();
        userEvent.click(screen.getByTestId("continue-button"));

        mockData.forEach((ele, index) => {
            expect(
                screen.getByTestId(`scope-button-${index}`)
            ).toBeInTheDocument();

            userEvent.click(screen.getByTestId(`scope-button-${index}`));
        });
    });
});


    // it(`<section> test case for reder year dropdown `, async () => {
    //     useSelectorMock.mockReturnValue({

    //         configConstants: {
    //             data: {
    //                 DEFAULT_YEAR: 2024
    //             }
    //         },
    //         timeMappingList: {
    //             data: timeMappingListMockData,
    //         },
    //         loginDetails: {
    //             data: authMockData?.userdata
    //         },
    //         emissionDates: yearMockData,

    //         // trailerTableDto: {

    //         // }


    //     });
    //     await renderScopeSelectionView();
    //     expect(screen.getByTestId("scopeone-dashboard-view")).toBeInTheDocument();

    //     const dropdown = screen.getByLabelText("year-dropdown");
    //     userEvent.click(dropdown);
    //     const option = await screen.findByText("2021");
    //     userEvent.click(option);

    //     const quarterDropdown = screen.getByLabelText("period-dropdown");
    //     userEvent.click(quarterDropdown);
    //     const quarterOption = await screen.findByText("P11");
    //     userEvent.click(quarterOption);

    // });

// });
