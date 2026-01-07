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
import { fuelReportFilterData, transactionListMockData, fuelReportMatricsMockData, transactionFilterMockData } from "mockData/scope1/fuelReportMockData.json"
import userEvent from "@testing-library/user-event";
import FuelReportView from "pages/scopeOne/fuelReport/FuelReportView";
import { nodeUrl } from "constant";

import fuelReportService from "store/scope1/fuelReport/fuelReportService";
import {
    ApiTest,
    TestFullFilledSlice,
    TestSliceMethod,
} from "commonCase/ReduxCases";
import store from "store"

import {
    scopeOneFuelReportReducer,
    getFuelTransactionData,
    getFuelReportFilters,
    getFuelReportMatrics,
    getFuelConsumptionReport,
    getFuelEmissionReport,
    getFuelConsumptionByDivision,
    getFuelTransactionFilter,
    getFuelEmissionByDivision,
    getTransactionLocation,
    resetScopeOneFuelReport,
    getPfnaTransactionDetails,
    getFuelConsumptionByPeriod,
    getFuelEmissionByPeriod,
    initialState
} from "store/scope1/fuelReport/fuelReportSlice";

const fuelPayload = {}
// Configuration for API testing of fetching region table data
const getFuelTransactionApiTestData = {
    serviceName: "getFuelTransactionApi",
    method: "post",
    data: fuelPayload,
    serviceImport: fuelReportService,
    route: `${nodeUrl}get-fuel-transaction-list`,
};

// Configuration for posting region graph data via Redux
const getFuelTransactionDataObject = {
    service: fuelReportService,
    serviceName: "getFuelTransactionApi",
    sliceName: "getFuelTransactionData",
    sliceImport: getFuelTransactionData,
    data: fuelPayload,
    reducerName: scopeOneFuelReportReducer,
    loadingState: "isLoadingTransactionList",
    actualState: "transactionListData",
};

// Configuration for API testing of fetching region table data
const getFuelReportFiltersApiTestData = {
    serviceName: "getFuelReportFilterApi",
    method: "post",
    data: fuelPayload,
    serviceImport: fuelReportService,
    route: `${nodeUrl}pbna-pfna-fuels-report-filters`,
};

// Configuration for posting region graph data via Redux
const getFuelReportFiltersDataObject = {
    service: fuelReportService,
    serviceName: "getFuelReportFilterApi",
    sliceName: "getFuelReportFilters",
    sliceImport: getFuelReportFilters,
    data: fuelPayload,
    reducerName: scopeOneFuelReportReducer,
    loadingState: "isLoadingFuelFilters",
    actualState: "fuelReportFilterData",
};

// Configuration for API testing of fetching region table data
const getFuelReportMatricsApiTestData = {
    serviceName: "getFuelReportMatricsApi",
    method: "post",
    data: fuelPayload,
    serviceImport: fuelReportService,
    route: `${nodeUrl}pbna-pfna-fuel-metrics-report`,
};

// Configuration for posting region graph data via Redux
const getFuelReportMatricsDataObject = {
    service: fuelReportService,
    serviceName: "getFuelReportMatricsApi",
    sliceName: "getFuelReportMatrics",
    sliceImport: getFuelReportMatrics,
    data: fuelPayload,
    reducerName: scopeOneFuelReportReducer,
    loadingState: "isLoadingFuelMatrics",
    actualState: "fuelReportMatricsData",
};

// Configuration for API testing of fetching region table data
const getFuelConsumptionReportApiTestData = {
    serviceName: "getFuelConsumptionApi",
    method: "post",
    data: fuelPayload,
    serviceImport: fuelReportService,
    route: `${nodeUrl}pbna-pfna-fuel-consumption-graph`,
};

// Configuration for posting region graph data via Redux
const getFuelConsumptionReportDataObject = {
    service: fuelReportService,
    serviceName: "getFuelConsumptionReportApi",
    sliceName: "getFuelConsumptionReport",
    sliceImport: getFuelConsumptionReport,
    data: fuelPayload,
    reducerName: scopeOneFuelReportReducer,
    loadingState: "isLoadingFuelConsumption",
    actualState: "fuelConsumptionData",
};

// Configuration for API testing of fetching region table data
const getFuelEmissionReportApiTestData = {
    serviceName: "getFuelEmissionsApi",
    method: "post",
    data: fuelPayload,
    serviceImport: fuelReportService,
    route: `${nodeUrl}pbna-pfna-fuel-emissions-graph`,
};

// Configuration for posting region graph data via Redux
const getFuelEmissionReportDataObject = {
    service: fuelReportService,
    serviceName: "getFuelEmissionsApi",
    sliceName: "getFuelEmissionReport",
    sliceImport: getFuelEmissionReport,
    data: fuelPayload,
    reducerName: scopeOneFuelReportReducer,
    loadingState: "isLoadingFuelEmission",
    actualState: "fuelEmissionData",
};

// Configuration for API testing of fetching region table data
const getFuelConsumptionByDivisionApiTestData = {
    serviceName: "getFuelReportByDivisionApi",
    method: "get",
    data: fuelPayload,
    serviceImport: fuelReportService,
    route: `${nodeUrl}get-pie-chart-data-by-division?year=&division=&period=&transport=&type=`,
};

// Configuration for posting region graph data via Redux
const getFuelConsumptionByDivisionDataObject = {
    service: fuelReportService,
    serviceName: "getFuelEmissionsApi",
    sliceName: "getFuelConsumptionByDivision",
    sliceImport: getFuelConsumptionByDivision,
    data: fuelPayload,
    reducerName: scopeOneFuelReportReducer,
    loadingState: "isLoadingConsumptionByDivision",
    actualState: "consumptionByDivisionData",
};

// Configuration for API testing of fetching region table data
const getFuelTransactionFilterApiTestData = {
    serviceName: "getTransactionFilter",
    method: "get",
    data: {
        searchName: "",
        year: 2025,
    },
    serviceImport: fuelReportService,
    route: `${nodeUrl}pbna-pfna-get-search-filter?limit=1000000&searchName=&year=2025`,
};

// Configuration for posting region graph data via Redux
const getFuelTransactionFilterDataObject = {
    service: fuelReportService,
    serviceName: "getTransactionFilter",
    sliceName: "getFuelTransactionFilter",
    sliceImport: getFuelTransactionFilter,
    data: fuelPayload,
    reducerName: scopeOneFuelReportReducer,
    loadingState: "isLoadingTransactionFilter",
    actualState: "transactionFilterData",
};


// Configuration for posting region graph data via Redux
const getFuelEmissionByDivisionDataObject = {
    service: fuelReportService,
    serviceName: "getFuelReportByDivisionApi",
    sliceName: "getFuelEmissionByDivision",
    sliceImport: getFuelEmissionByDivision,
    data: fuelPayload,
    reducerName: scopeOneFuelReportReducer,
    loadingState: "isLoadingEmissionsByDivision",
    actualState: "emissionsByDivisionData",
};

// Configuration for posting region graph data via Redux
const getTransactionLocationDataObject = {
    service: fuelReportService,
    serviceName: "getTransactionLocationApi",
    sliceName: "getTransactionLocation",
    sliceImport: getTransactionLocation,
    data: fuelPayload,
    reducerName: scopeOneFuelReportReducer,
    loadingState: "isLoadingTransactionLocation",
    actualState: "transactionLocationData",
};

// Configuration for API testing of fetching region table data
const getTransactionLocationApiTestData = {
    serviceName: "getTransactionLocationApi",
    method: "post",
    data: fuelPayload,
    serviceImport: fuelReportService,
    route: `${nodeUrl}pbna-pfna-list-of-locations`,
};



// Configuration for posting region graph data via Redux
const getPfnaTransactionDetailsDataObject = {
    service: fuelReportService,
    serviceName: "getPfnaTransactionDetailsApi",
    sliceName: "getPfnaTransactionDetails",
    sliceImport: getPfnaTransactionDetails,
    data: fuelPayload,
    reducerName: scopeOneFuelReportReducer,
    loadingState: "isLoadingPfnaTransactionDetail",
    actualState: "pfnaTransactionDetailDto",
};

// Configuration for API testing of fetching region table data
const getPfnaTransactionDetailsApiTestData = {
    serviceName: "getPfnaTransactionDetailsApi",
    method: "post",
    data: fuelPayload,
    serviceImport: fuelReportService,
    route: `${nodeUrl}pfna-transaction-details`,
};

// Configuration for posting region graph data via Redux
const getFuelConsumptionByPeriodDataObject = {
    service: fuelReportService,
    serviceName: "getPbnaPfnaFuelConsumptionByPeriodApi",
    sliceName: "getFuelConsumptionByPeriod",
    sliceImport: getFuelConsumptionByPeriod,
    data: fuelPayload,
    reducerName: scopeOneFuelReportReducer,
    loadingState: "isLoadingFuelConsumptionByPeriod",
    actualState: "fuelConsumptionByPeriodData",
};

// Configuration for API testing of fetching region table data
const getFuelConsumptionByPeriodApiTestData = {
    serviceName: "getPbnaPfnaFuelConsumptionByPeriodApi",
    method: "post",
    data: fuelPayload,
    serviceImport: fuelReportService,
    route: `${nodeUrl}pbna-pfna-line-chart-by-fuel-data`,
};


// Configuration for posting region graph data via Redux
const getFuelEmissionByPeriodDataObject = {
    service: fuelReportService,
    serviceName: "getPbnaPfnaFuelEmissionByPeriodApi",
    sliceName: "getFuelEmissionByPeriod",
    sliceImport: getFuelEmissionByPeriod,
    data: fuelPayload,
    reducerName: scopeOneFuelReportReducer,
    loadingState: "isLoadingFuelEmissionByPeriod",
    actualState: "fuelEmissionByPeriodData",
};

// Configuration for API testing of fetching region table data
const getFuelEmissionByPeriodApiTestData = {
    serviceName: "getPbnaPfnaFuelEmissionByPeriodApi",
    method: "post",
    data: fuelPayload,
    serviceImport: fuelReportService,
    route: `${nodeUrl}pbna-pfna-line-chart-by-emission-data`,
};
// getPfnaTransactionDetails,

// Execute Redux slice tests for various data
TestFullFilledSlice({
    data: [
        getFuelTransactionDataObject,
        getFuelReportFiltersDataObject,
        getFuelReportMatricsDataObject,
        getFuelConsumptionReportDataObject,
        getFuelEmissionReportDataObject,
        getFuelConsumptionByDivisionDataObject,
        getFuelEmissionByDivisionDataObject,
        // getFuelTransactionFilterDataObject,
        getTransactionLocationDataObject,
        getPfnaTransactionDetailsDataObject,
        getFuelConsumptionByPeriodDataObject,
        getFuelEmissionByPeriodDataObject
    ],
});

// Execute API tests for various data
ApiTest({
    data: [
        getFuelTransactionApiTestData,
        getFuelReportFiltersApiTestData,
        getFuelReportMatricsApiTestData,
        getFuelConsumptionReportApiTestData,
        getFuelEmissionReportApiTestData,
        getFuelConsumptionByDivisionApiTestData,
        getFuelTransactionFilterApiTestData,
        getTransactionLocationApiTestData,
        getPfnaTransactionDetailsApiTestData,
        getFuelConsumptionByPeriodApiTestData,
        getFuelEmissionByPeriodApiTestData
    ],
});

TestSliceMethod({
    data: [
        getFuelTransactionDataObject,
        getFuelReportFiltersDataObject,
        getFuelReportMatricsDataObject,
        getFuelConsumptionReportDataObject,
        getFuelEmissionReportDataObject,
        getFuelConsumptionByDivisionDataObject,
        getFuelTransactionFilterDataObject,
        getFuelEmissionByDivisionDataObject,
        getTransactionLocationDataObject,
        getPfnaTransactionDetailsDataObject,
        getFuelConsumptionByPeriodDataObject,
        getFuelEmissionByPeriodDataObject
    ]
});

describe('initial reducer', () => {
    it('should reset state to initialState when resetScopeOneFuelReport is called', () => {
        const modifiedState: any = {
            data: [{ id: 1, value: 'test' }],
            loading: true,
            error: 'Something went wrong',
        };

        const result = scopeOneFuelReportReducer.reducer(modifiedState, resetScopeOneFuelReport());
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

    const renderFuelReportView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <FuelReportView />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for whole page `, async () => {
        useSelectorMock.mockReturnValue({
            loginDetails: { data: authMockData?.userdata },
        });
        await renderFuelReportView();
        expect(screen.getByTestId("fuel-report-view")).toBeInTheDocument();
    });

    it(`selectable dropdowns`, async () => {
        useSelectorMock.mockReturnValue({
            fuelReportFilterData: fuelReportFilterData
        });
        await renderFuelReportView();

        const applyBtn = screen.getByTestId("apply-filter-btn")

        userEvent.click(applyBtn)
        const yearDropdown = screen.getByLabelText("year-dropdown");
        userEvent.click(yearDropdown);
        const yearOption = await screen.findByText("2025");
        userEvent.click(yearOption);

        userEvent.click(applyBtn)
        const periodDropdown = screen.getByLabelText("period-dropdown");
        userEvent.click(periodDropdown);
        const periodOption = await screen.findByText("P100");
        userEvent.click(periodOption);

        userEvent.click(applyBtn)
        const divisionDropdown = screen.getByLabelText("divison-dropdown");
        userEvent.click(divisionDropdown);
        const divisionOption = await screen.findByText("South");
        userEvent.click(divisionOption);

        userEvent.click(applyBtn)
        const transportDropdown = screen.getByLabelText("transport-dropdown");
        userEvent.click(transportDropdown);
        const transportOption = await screen.findByText("Fleet");
        userEvent.click(transportOption);
    });


    it(`selectable dropdowns`, async () => {
        useSelectorMock.mockReturnValue({
            fuelReportFilterData: fuelReportFilterData,
            fuelReportMatricsData: {
                data: fuelReportMatricsMockData
            },
            transactionFilterData: transactionFilterMockData
        });
        await renderFuelReportView();

        const locationDropdown = screen.getByLabelText("location-dropdown");
        userEvent.click(locationDropdown);
        fireEvent.change(locationDropdown, { target: { value: '11801' } });

        const transportOption = await screen.findByText("11801 W Silver Spring Dr");
        userEvent.click(transportOption);

        const exportBtn = await screen.findAllByTestId("export-btn-fuel");
        userEvent.click(exportBtn[0]);

        const exportLineChart = await screen.findByTestId("exportLineChart");
        userEvent.click(exportLineChart);

        const exportLineChart1 = await screen.findByTestId("exportLineChart1");
        userEvent.click(exportLineChart1);

        const exportDonutChart = await screen.findByTestId("exportDonutChart");
        userEvent.click(exportDonutChart);

        const exportDonutChart1 = await screen.findByTestId("exportDonutChart1");
        userEvent.click(exportDonutChart1);

        const sortIcon = await screen.findByTestId("sort_total_fuel_consumption");
        userEvent.click(sortIcon);

    });

    it(`selectable dropdowns`, async () => {
        useSelectorMock.mockReturnValue({
            fuelReportFilterData: fuelReportFilterData,
            fuelReportMatricsData: {
                data: fuelReportMatricsMockData
            },
            transactionListData: {
                data: transactionListMockData
            },
            transactionFilterData: transactionFilterMockData
        });
        await renderFuelReportView();


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
});