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
import { fuelReportFilterData } from "mockData/scope1/fuelReportMockData.json"
import userEvent from "@testing-library/user-event";
import PfnaFuelReportView from "pages/scopeOne/pfnaFuelReport/PfnaFuelReportView";
import { nodeUrl } from "constant";

import pfnaReportService from "store/scope1/pfnaReport/pfnaReportService";
import {
    ApiTest,
    TestFullFilledSlice,
    TestSliceMethod,
} from "commonCase/ReduxCases";
import store from "store"

import {
    scopeOnePfnaReportReducer,
    getFuelConsumptionReport,
    resetScopeOnePfnaReport,
    getPfnaTotaEmissionFuel,
    getPfnaFuelConsumptionReportPeriod,
    getPfnaFuelEmissionsReportPeriod,
    getPfnaFuelConsumptionByPercentage,
    getPfnaFuelEmissionByPercentage,
    initialState
} from "store/scope1/pfnaReport/pfnaReportSlice";

const fuelPayload = {}


// Configuration for posting region graph data via Redux
const getFuelConsumptionReportDataObject = {
    service: pfnaReportService,
    serviceName: "getFuelConsumptionReportApi",
    sliceName: "getFuelConsumptionReport",
    sliceImport: getFuelConsumptionReport,
    data: fuelPayload,
    reducerName: scopeOnePfnaReportReducer,
    loadingState: "isLoadingfuelConsumptionReportGraph",
    actualState: "fuelConsumptionReportGraphData",
};

// Configuration for API testing of fetching region table data
const getFuelConsumptionReportApiTestData = {
    serviceName: "getFuelConsumptionReportApi",
    method: "post",
    data: fuelPayload,
    serviceImport: pfnaReportService,
    route: `${nodeUrl}pfna-fuel-consumption-report`,
};

// Configuration for posting region graph data via Redux
const getPfnaTotaEmissionFuelDataObject = {
    service: pfnaReportService,
    serviceName: "getPfnaTotaEmissionFuelApi",
    sliceName: "getPfnaTotaEmissionFuel",
    sliceImport: getPfnaTotaEmissionFuel,
    data: fuelPayload,
    reducerName: scopeOnePfnaReportReducer,
    loadingState: "isLoadingPfnaTotalEmissionFuel",
    actualState: "pfnaTotalEmissionFuelData",
};

// Configuration for API testing of fetching region table data
const getPfnaTotaEmissionFuelApiTestData = {
    serviceName: "getPfnaTotaEmissionFuelApi",
    method: "post",
    data: fuelPayload,
    serviceImport: pfnaReportService,
    route: `${nodeUrl}pfna-fuel-report-filters`,
};

// Configuration for posting region graph data via Redux
const getPfnaFuelConsumptionReportPeriodDataObject = {
    service: pfnaReportService,
    serviceName: "getPfnaFuelConsumptionReportPeriodApi",
    sliceName: "getPfnaFuelConsumptionReportPeriod",
    sliceImport: getPfnaFuelConsumptionReportPeriod,
    data: fuelPayload,
    reducerName: scopeOnePfnaReportReducer,
    loadingState: "isLoadingPfnaFuelConsumptionReportPeriodGraph",
    actualState: "pfnaFuelConsumptionReportPeriodGraphData",
};

// Configuration for API testing of fetching region table data
const getPfnaFuelConsumptionReportPeriodApiTestData = {
    serviceName: "getPfnaFuelConsumptionReportPeriodApi",
    method: "post",
    data: fuelPayload,
    serviceImport: pfnaReportService,
    route: `${nodeUrl}pfna-fuel-consumption-report-by-period`,
};

// Configuration for posting region graph data via Redux
const getPfnaFuelEmissionsReportPeriodDataObject = {
    service: pfnaReportService,
    serviceName: "getPfnaFuelConsumptionReportPeriodApi",
    sliceName: "getPfnaFuelEmissionsReportPeriod",
    sliceImport: getPfnaFuelEmissionsReportPeriod,
    data: fuelPayload,
    reducerName: scopeOnePfnaReportReducer,
    loadingState: "isLoadingPfnaFuelEmissionsReportPeriodGraph",
    actualState: "pfnaFuelEmissionsReportPeriodData",
};


// Configuration for posting region graph data via Redux
const getPfnaFuelConsumptionByPercentageDataObject = {
    service: pfnaReportService,
    serviceName: "getPfnaFuelConsumptionByPercentageApi",
    sliceName: "getPfnaFuelConsumptionByPercentage",
    sliceImport: getPfnaFuelConsumptionByPercentage,
    data: fuelPayload,
    reducerName: scopeOnePfnaReportReducer,
    loadingState: "isLoadingPfnaFuelConsumptionPercentage",
    actualState: "pfnaFuelConsumptionPercentageData",
};

// Configuration for posting region graph data via Redux
const getPfnaFuelEmissionByPercentageDataObject = {
    service: pfnaReportService,
    serviceName: "getPfnaFuelConsumptionByPercentageApi",
    sliceName: "getPfnaFuelEmissionByPercentage",
    sliceImport: getPfnaFuelEmissionByPercentage,
    data: fuelPayload,
    reducerName: scopeOnePfnaReportReducer,
    loadingState: "isLoadingPfnaFuelEmissionPercentage",
    actualState: "pfnaFuelEmissionPercentageData",
};



// // Configuration for API testing of fetching region table data
const getPfnaFuelEmissionsReportPeriodApiTestData = {
    serviceName: "getPfnaFuelConsumptionByPercentageApi",
    method: "post",
    data: fuelPayload,
    serviceImport: pfnaReportService,
    route: `${nodeUrl}pfna-fuel-consumption-by-fuel-percentage`,
};

// Execute Redux slice tests for various data
TestFullFilledSlice({
    data: [
        getFuelConsumptionReportDataObject,
        getPfnaTotaEmissionFuelDataObject,
        getPfnaFuelConsumptionReportPeriodDataObject,
        getPfnaFuelEmissionsReportPeriodDataObject,
        getPfnaFuelEmissionByPercentageDataObject,
        getPfnaFuelConsumptionByPercentageDataObject
    ],
});

// Execute API tests for various data
ApiTest({
    data: [
        getFuelConsumptionReportApiTestData,
        getPfnaTotaEmissionFuelApiTestData,
        getPfnaFuelConsumptionReportPeriodApiTestData,
        getPfnaFuelEmissionsReportPeriodApiTestData,
    ],
});

TestSliceMethod({
    data: [
        getFuelConsumptionReportDataObject,
        getPfnaTotaEmissionFuelDataObject,
        getPfnaFuelConsumptionReportPeriodDataObject,
        getPfnaFuelEmissionsReportPeriodDataObject,
        getPfnaFuelEmissionByPercentageDataObject,
        getPfnaFuelConsumptionByPercentageDataObject
    ]
});

describe('initial reducer', () => {
    it('should reset state to initialState when resetScopeOnePfnaReport is called', () => {
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

    const renderPfnaFuelReportView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <PfnaFuelReportView />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for whole page `, async () => {
        await renderPfnaFuelReportView();
        expect(screen.getByTestId("pfna-report")).toBeInTheDocument();
    });

    it(`selectable dropdowns`, async () => {
        useSelectorMock.mockReturnValue({
            fuelReportFilterData: fuelReportFilterData,
            pfnaFuelListData : fuelReportFilterData
        });
        await renderPfnaFuelReportView();

        const yearDropdown = screen.getByLabelText("year-dropdown");
        await act(async () => {
            userEvent.click(yearDropdown);
        })
        const yearOption = await screen.findByText("20233");
        userEvent.click(yearOption);
        const periodDropdown = screen.getByLabelText("period-dropdown");
        userEvent.click(periodDropdown);
        const periodOption = await screen.findByText("P100");
        userEvent.click(periodOption);

        const fuelTypeDropdown = screen.getByLabelText("fuel-type-dropdown");
        userEvent.click(fuelTypeDropdown);
        const fuelTypeOption = await screen.findByText("Miscellaneous");
        userEvent.click(fuelTypeOption);

    });


    it(`selectable dropdowns`, async () => {
        useSelectorMock.mockReturnValue({
            fuelReportFilterData: fuelReportFilterData,
            pfnaFuelListData : fuelReportFilterData
        });
        await renderPfnaFuelReportView();

        const exportBtn = await screen.findByTestId("export-btn");
        userEvent.click(exportBtn);

        const expotEmissionBtn = await screen.findByTestId("expotEmissionBtn");
        userEvent.click(expotEmissionBtn);

        const exportLineChart = await screen.findByTestId("exportLineChart");
        userEvent.click(exportLineChart);

        const exportLineChartEmission = await screen.findByTestId("exportLineChartEmission");
        userEvent.click(exportLineChartEmission);

        const exportDonutChart = await screen.findByTestId("exportDonutChart");
        userEvent.click(exportDonutChart);

        const exportDonutChartEmission = await screen.findByTestId("exportDonutChartEmission");
        userEvent.click(exportDonutChartEmission);


    });

});