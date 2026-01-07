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
import { fuelReportFilterData, transactionListMockData, fuelReportMatricsMockData, transactionFilterMockData, pfnaTransactionDetailDtoMockData } from "mockData/scope1/fuelReportMockData.json"
import userEvent from "@testing-library/user-event";
import BulkCngView from "pages/scopeOne/bulkCng/BulkCngView";
import { nodeUrl } from "constant";

import pfnaReportService from "store/scope1/pfnaReport/pfnaReportService";
import fuelReportService from "store/scope1/fuelReport/fuelReportService"
import {
    ApiTest,
    TestFullFilledSlice,
    TestSliceMethod,
} from "commonCase/ReduxCases";
import { useParams } from 'react-router-dom';

import {
    scopeOnePfnaReportReducer,
    getFuelConsumptionReportLocation,
    getSearchLocationFilter,
    getFuelConsumptionReportEmissionLocation,
    resetScopeOnePfnaReport,
    initialState
} from "store/scope1/pfnaReport/pfnaReportSlice";

const fuelPayload = {}
// Configuration for API testing of fetching region table data
const getFuelConsumptionReportLocationApiTestData = {
    serviceName: "getFuelConsumptionReportLocationApi",
    method: "post",
    data: fuelPayload,
    serviceImport: pfnaReportService,
    route: `${nodeUrl}pbna-pfna-pages-fuel-consumption-report`,
};

// Configuration for posting region graph data via Redux
const getFuelConsumptionReportLocationObject = {
    service: pfnaReportService,
    serviceName: "getFuelConsumptionReportLocationApi",
    sliceName: "getFuelConsumptionReportLocation",
    sliceImport: getFuelConsumptionReportLocation,
    data: fuelPayload,
    reducerName: scopeOnePfnaReportReducer,
    loadingState: "isLoadingfuelConsumptionReportLocation",
    actualState: "fuelConsumptionReportLocationData",
};

// Configuration for API testing of fetching region table data
const getTransactionFilterApiTestData = {
    serviceName: "getTransactionFilter",
    method: "get",
    data: fuelPayload,
    serviceImport: fuelReportService,
    route: `${nodeUrl}pbna-pfna-get-search-filter?limit=1000000&`,
};

// Configuration for posting region graph data via Redux
const getSearchLocationFilterDataObject = {
    service: fuelReportService,
    serviceName: "getTransactionFilter",
    sliceName: "getSearchLocationFilter ",
    sliceImport: getSearchLocationFilter,
    data: fuelPayload,
    reducerName: scopeOnePfnaReportReducer,
    loadingState: "isLoadingsearchLocationFilter",
    actualState: "searchLocationFilterData",
};

// Configuration for posting region graph data via Redux
const getFuelConsumptionReportEmissionLocationDataObject = {
    service: pfnaReportService,
    serviceName: "getFuelConsumptionReportLocationApi",
    sliceName: "getFuelConsumptionReportEmissionLocation ",
    sliceImport: getFuelConsumptionReportEmissionLocation,
    data: fuelPayload,
    reducerName: scopeOnePfnaReportReducer,
    loadingState: "isLoadingfuelConsumptionReportEmissionLocation",
    actualState: "fuelConsumptionReportEmissionLocationData",
};

// Configuration for API testing of fetching region table data
const getFuelConsumptionReportApiTestData = {
    serviceName: "getSearchLocationApi",
    method: "post",
    data: fuelPayload,
    serviceImport: pfnaReportService,
    route: `${nodeUrl}pbna-pfna-pages-search-location-filter`,
};


// getTransactionLocation,

// Execute Redux slice tests for various data
TestFullFilledSlice({
    data: [
        getFuelConsumptionReportLocationObject,
        getSearchLocationFilterDataObject,
        getFuelConsumptionReportEmissionLocationDataObject,

    ],
});

// Execute API tests for various data
ApiTest({
    data: [
        getFuelConsumptionReportLocationApiTestData,
        getTransactionFilterApiTestData,
        getFuelConsumptionReportApiTestData,

    ],
});

TestSliceMethod({
    data: [
        getFuelConsumptionReportLocationObject,
        getSearchLocationFilterDataObject,
        getFuelConsumptionReportEmissionLocationDataObject,

    ]
});

describe('initial reducer', () => {
    it('should reset state to initialState when resetScopeOneFuelReport is called', () => {
        const modifiedState: any = {
            data: [{ id: 1, value: 'test' }],
            loading: true,
            error: 'Something went wrong',
        };

        const result = scopeOnePfnaReportReducer.reducer(modifiedState, resetScopeOnePfnaReport());
        expect(result).toEqual(initialState);
    });
});



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

    const renderRDView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <BulkCngView fuelSlug="rd" />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for whole page `, async () => {
        await renderRDView();
        expect(screen.getByTestId("bulk-cng-report-view")).toBeInTheDocument();
    });

    const renderCNGView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <BulkCngView fuelSlug="cng" />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for whole page `, async () => {
        await renderCNGView();
        expect(screen.getByTestId("bulk-cng-report-view")).toBeInTheDocument();
    });

    const renderBulkCngView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <BulkCngView fuelSlug="bulk" />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for whole page `, async () => {
        await renderBulkCngView();
        expect(screen.getByTestId("bulk-cng-report-view")).toBeInTheDocument();
    });

    it(`selectable dropdowns`, async () => {
        const mockedParams = { fuelSlug: 'bulk' };
        // Mock the return value of useParams hook
        (useParams as jest.Mock).mockReturnValue(mockedParams);


        useSelectorMock.mockReturnValue({
            fuelReportFilterData: fuelReportFilterData,
            searchLocationFilterData: {
                data: [
                    { id: 1, name: 'supplier1' },
                    { id: 2, name: 'supplier2' },
                    { id: 3, name: 'supplier3' }
                ]
            },
            transactionFilterData: transactionFilterMockData
        });
        await renderBulkCngView();

        const yearDropdown = screen.getByLabelText("year-dropdown");
        userEvent.click(yearDropdown);
        const yearOption = await screen.findByText("20233");
        userEvent.click(yearOption);

        const periodDropdown = screen.getByLabelText("period-dropdown");
        userEvent.click(periodDropdown);
        const periodOption = await screen.findByText("P100");
        userEvent.click(periodOption);

        const divisionDropdown = screen.getByLabelText("supplier-dropdown");
        userEvent.click(divisionDropdown);
        const divisionOption = await screen.findAllByText("supplier1");
        userEvent.click(divisionOption[0]);

        const transportDropdown = screen.getByLabelText("transport-dropdown");
        userEvent.click(transportDropdown);
        const transportOption = await screen.findByText("Fleet");
        userEvent.click(transportOption);

        const fuelTypeDropdown = screen.getByLabelText("fuel-type-dropdown");
        userEvent.click(fuelTypeDropdown);
        const fuelTypeOption = await screen.findByText("Bulk Diesel");
        userEvent.click(fuelTypeOption);

        const multiCarrierDropdown = screen.getByLabelText("multi-carrier-dropdown");
        userEvent.click(multiCarrierDropdown);
        const multiCarrierOption = await screen.findByText("supplier3");
        userEvent.click(multiCarrierOption);



    });

    it(`selectable dropdowns`, async () => {
        useSelectorMock.mockReturnValue({
            pfnaTransactionDetailDto: pfnaTransactionDetailDtoMockData,
            fuelReportMatricsData: {
                data: fuelReportMatricsMockData
            },
            transactionListData: {
                data: transactionListMockData
            },
            transactionFilterData: transactionFilterMockData
        });
        await renderBulkCngView();


        expect(screen.getByLabelText("pagination-dropdown")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("pagination-dropdown"));

        const paginationData = await screen.findByText("50");
        await act(async () => {
            userEvent.click(paginationData);
        });

        const anchorElement = screen.getByRole('button', { name: '2' });
        expect(anchorElement).toBeInTheDocument();
        userEvent.click(anchorElement);


    });


    it(`selectable dropdowns`, async () => {
        const mockedParams = { fuelSlug: 'bulk' };
        // Mock the return value of useParams hook
        (useParams as jest.Mock).mockReturnValue(mockedParams);


        useSelectorMock.mockReturnValue({
            fuelReportFilterData: fuelReportFilterData,
            searchLocationFilterData: {
                data: [
                    { id: 1, name: 'supplier1' },
                    { id: 2, name: 'supplier2' },
                    { id: 3, name: 'supplier3' }
                ]
            },
            transactionFilterData: transactionFilterMockData,
            pfnaTransactionDetailDto: pfnaTransactionDetailDtoMockData,

        });
        await renderBulkCngView();


        userEvent.click(await screen.getByTestId("selected-location-2"));
        userEvent.click(await screen.getByTestId("selected-location-1"));


        const sortIcon = await screen.findByTestId("sort_location_name");
        userEvent.click(sortIcon);

        userEvent.click(await screen.findByTestId("apply-button"));
        userEvent.click(await screen.findByTestId("reset-button"));
        userEvent.click(await screen.findByTestId("export-btn-fuel-graph"));
        userEvent.click(await screen.findByTestId("export-btn-fuel-graph1"));


    });
});