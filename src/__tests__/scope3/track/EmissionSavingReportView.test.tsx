// Import necessary modules and components
import {
    act,
    render,
    cleanup,
    screen,
} from "@testing-library/react";
import * as reactRedux from "react-redux";
import * as router from "react-router-dom";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import { filterData, carrierScacs, carrierScacsShowAll, fuelList } from "mockData/emissionSavedReportMockData.json";
import * as utils from "store/redux.hooks";
import { authDataReducer } from "store/auth/authDataSlice";
import { commonDataReducer } from "store/commonData/commonSlice";
import EmissionSavingReportView from "pages/emissionSavingReport/EmissionSavingReportView";
import userEvent from "@testing-library/user-event";
import emissionSavedService from "store/scopeThree/track/emissionSaveReport/emissionSavedService";
import {
    ApiTest,
    TestFullFilledSlice,
    TestSliceMethod,
} from "commonCase/ReduxCases";
import store from "store"
import { nodeUrl } from "constant";
import {
    emissionSavedReducer,
    emissionReportFilters,
    emissionReportScacs,
    emissionSavedMatrics,
    emissionSavedShipmentGraph,
    emissionSavedEmissionTransactionTable,
    emissionSavedEmissionGraph,
    emissionSavedFuelList,
    resetEmissionSaved,
    initialState
} from "store/scopeThree/track/emissionSaveReport/emissionSavedSlice";
// Configuration for posting region graph data via Redux
const getEmissionReportFiltersSlice = {
    service: emissionSavedService,
    serviceName: "getEmissionFilters",
    sliceName: "getCarrierTypeReductionGraph",
    sliceImport: emissionReportFilters,
    data: {},
    reducerName: emissionSavedReducer,
    loadingState: "isLoadingFilters",
    actualState: "emissionSavedFilters",
};

// Configuration for API testing of posting region graph data
const getEmissionFiltersApi = {
    serviceName: "getEmissionFilters",
    method: "post",
    data: {},
    serviceImport: emissionSavedService,
    route: `${nodeUrl}combine-dash-filters-data`,
};

const getEmissionScacsSlice = {
    service: emissionSavedService,
    serviceName: "getEmissionScacs",
    sliceName: "emissionReportScacs",
    sliceImport: emissionReportScacs,
    data: {},
    reducerName: emissionSavedReducer,
    loadingState: "isLoadingScacList",
    actualState: "emissionSavedScacs",
};

// Configuration for API testing of posting region graph data
const getEmissionScacsApi = {
    serviceName: "getEmissionScacs",
    method: "get",
    data: {},
    serviceImport: emissionSavedService,
    route: `${nodeUrl}combine-dash-scac-list?`,
};

const getEmissionSavedMatricsSlice = {
    service: emissionSavedService,
    serviceName: "getEmissionSavedMatrics",
    sliceName: "emissionSavedMatrics",
    sliceImport: emissionSavedMatrics,
    data: {},
    reducerName: emissionSavedReducer,
    loadingState: "isLoadingEmissionMatricsData",
    actualState: "emissionSavedMatricsData",
};

// Configuration for API testing of posting region graph data
// const getEmissionSavedMatricsApi = {
//     serviceName: "getEmissionSavedMatrics",
//     method: "get",
//     data: {},
//     serviceImport: emissionSavedService,
//     route: `${nodeUrl}combine-dash-metrics-data`,
// };


const getEmissionSavedShipmentGraphSlice = {
    service: emissionSavedService,
    serviceName: "getEmissionSavedMatrics",
    sliceName: "emissionSavedShipmentGraph",
    sliceImport: emissionSavedShipmentGraph,
    data: {},
    reducerName: emissionSavedReducer,
    loadingState: "isLoadingEmissionSavedShipmentGraph",
    actualState: "emissionSavedShipmentGraphData",
};

const getemissionSavedEmissionTransactionTableSlice = {
    service: emissionSavedService,
    serviceName: "getEmissionSavedMatrics",
    sliceName: "emissionSavedEmissionTransactionTable",
    sliceImport: emissionSavedEmissionTransactionTable,
    data: {},
    reducerName: emissionSavedReducer,
    loadingState: "isLoadingEmissionSavedTransactionTable",
    actualState: "emissionSavedTransactionTableData",
};


const getEmissionSavedEmissionGraphSlice = {
    service: emissionSavedService,
    serviceName: "getEmissionSavedMatrics",
    sliceName: "emissionSavedEmissionGraph",
    sliceImport: emissionSavedEmissionGraph,
    data: {},
    reducerName: emissionSavedReducer,
    loadingState: "isLoadingEmissionSavedEmissionGraph",
    actualState: "emissionSavedEmissionGraphData",
};


const getEmissionSavedFuelListSlice = {
    service: emissionSavedService,
    serviceName: "getEmissionSavedMatrics",
    sliceName: "emissionSavedFuelList",
    sliceImport: emissionSavedFuelList,
    data: {},
    reducerName: emissionSavedReducer,
    loadingState: "isLoadingEmissionSavedFuelType",
    actualState: "emissionSavedFuelType",
};



// Execute Redux slice tests for various data
TestFullFilledSlice({
    data: [getEmissionReportFiltersSlice, getEmissionScacsSlice, getEmissionSavedMatricsSlice, getEmissionSavedShipmentGraphSlice, getemissionSavedEmissionTransactionTableSlice,
        getEmissionSavedEmissionGraphSlice, getEmissionSavedFuelListSlice
    ],
});

// Execute API tests for various data
ApiTest({
    data: [getEmissionFiltersApi, getEmissionScacsApi],
});

TestSliceMethod({
    data: [getEmissionReportFiltersSlice, getEmissionScacsSlice, getEmissionSavedMatricsSlice, getEmissionSavedShipmentGraphSlice, getemissionSavedEmissionTransactionTableSlice,
        getEmissionSavedEmissionGraphSlice, getEmissionSavedFuelListSlice
    ],
});

// Test case initialState
describe('initial reducer', () => {
  it('should reset state to initialState when resetScopeOneCommonData is called', () => {
    const modifiedState: any = {
      data: [{ id: 1, value: 'test' }],
      loading: true,
      error: 'Something went wrong',
    };

    const result = emissionSavedReducer.reducer(modifiedState, resetEmissionSaved());
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

describe("test emission saving report view", () => {
    let useDispatchMock: jest.Mock;
    let useSelectorMock: jest.Mock;
    let stores: EnhancedStore;
    const navigate = jest.fn();

    beforeEach(() => {
        stores = configureStore({
            reducer: {
                auth: authDataReducer.reducer,
                commonData: commonDataReducer.reducer,
            },
        });

        jest
            .spyOn(router, "useNavigate")
            .mockImplementation(() => navigate) as jest.Mock;

        useSelectorMock = jest
            .spyOn(utils, "useAppSelector")
            .mockReturnValue({}) as jest.Mock;

        useDispatchMock = jest.spyOn(utils, "useAppDispatch") as jest.Mock;

        const mockDispatch = jest.fn();
        useDispatchMock.mockReturnValue(mockDispatch);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        cleanup();
    });

    const renderEmissionSavingReportView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <EmissionSavingReportView />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    it("should render the multi select dropdown and allow selecting multi values from the options, show all", async () => {
        //when No carrier 
        useSelectorMock.mockReturnValue({
            emissionSavedScacs: { data: [] },
        });

        await renderEmissionSavingReportView();

        expect(screen.getByLabelText("multi-carrier-dropdown")).toBeInTheDocument();


    });

    it("should render <section> element with test id for emission saving report view", async () => {
        await renderEmissionSavingReportView();
        expect(screen.getByTestId("emissionSavingReport-view")).toBeInTheDocument();
    });

    it("should render the all dropdown and allow selecting values from the options", async () => {

        useSelectorMock.mockReturnValue({
            emissionSavedFilters: { data: filterData },
        });

        await renderEmissionSavingReportView();

        //For country filter
        expect(screen.getByLabelText("country-dropdown")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("country-dropdown"));
        const optionCountry = await screen.findByText("CANADA");
        userEvent.click(optionCountry);

        //For year filter
        expect(screen.getByLabelText("year-dropdown")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("year-dropdown"));
        const optionYear = await screen.findByText("2024");
        userEvent.click(optionYear);

        //For year filter
        expect(screen.getByLabelText("month-dropdown")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("month-dropdown"));
        const optionMonth = await screen.findByText("January");
        userEvent.click(optionMonth);
    });

    it("should render the multi select dropdown and allow selecting multi values from the options", async () => {
        useSelectorMock.mockReturnValue({
            emissionSavedScacs: { data: carrierScacs },
        });
        await renderEmissionSavingReportView();

        expect(screen.getByLabelText("multi-carrier-dropdown")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("multi-carrier-dropdown"));
        const optionCarrier = await screen.findByText("FreightVana, LLC");
        userEvent.click(optionCarrier);
    });

    it("should render the multi select dropdown and allow selecting multi values from the options", async () => {
        useSelectorMock.mockReturnValue({
            emissionSavedScacs: { data: carrierScacs },
        });

        await renderEmissionSavingReportView();

        expect(screen.getByLabelText("multi-carrier-dropdown")).toBeInTheDocument();

        await userEvent.click(screen.getByLabelText("multi-carrier-dropdown"));

        const option1Carrier = await screen.findByText("Biagi Bros inc");
        await userEvent.click(option1Carrier);

        // Re-open the dropdown to select another
        await userEvent.click(screen.getByLabelText("multi-carrier-dropdown"));

        const option2Carrier = await screen.findByText("FreightVana, LLC");
        await userEvent.click(option2Carrier);

        // Assert it was added and then remove it
        expect(screen.getByTestId("carrier-FVAN")).toBeInTheDocument();
        await userEvent.click(screen.getByTestId("carrier-FVAN"));
        expect(screen.queryByTestId("carrier-FVAN")).not.toBeInTheDocument();

        // Final check for another carrier
        expect(screen.getByTestId("carrier-ARMS")).toBeInTheDocument();
        await userEvent.click(screen.getByTestId("carrier-ARMS"));
    });

    it("should render the button and show more or view less.", async () => {
        useSelectorMock.mockReturnValue({
            emissionSavedScacs: { data: carrierScacsShowAll },
        });
        await renderEmissionSavingReportView();
        expect(screen.getByTestId("show-more")).toBeInTheDocument();
        await userEvent.click(screen.getByTestId("show-more"));
        await userEvent.click(screen.getByTestId("view-less"));
    });

    it("should render the all dropdown and allow selecting values from the options of table filters", async () => {
        useSelectorMock.mockReturnValue({
            emissionSavedScacs: { data: carrierScacsShowAll },
            emissionSavedFuelType: { data: fuelList }
        });
        await renderEmissionSavingReportView();

        //For carrir filter
        expect(screen.getByLabelText("carrier-dropdown")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("carrier-dropdown"));
        const optionCarrier = await screen.findByText("FreightVana, LLC");
        userEvent.click(optionCarrier);

        // //For shipment type filter
        // expect(screen.getByLabelText("intermodal-dropdown")).toBeInTheDocument();
        // userEvent.click(screen.getByLabelText("intermodal-dropdown"));
        // const optionShipmentType = await screen.findByText("OTR");
        // userEvent.click(optionShipmentType);

        //For carrier type filter
        expect(screen.getByLabelText("fuel-type-dropdown")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("fuel-type-dropdown"));
        const optionFuelType = await screen.findByText("Hydrogen");
        userEvent.click(optionFuelType);

        //apply filters
        expect(screen.getByTestId("apply-filter-btn")).toBeInTheDocument();
        await userEvent.click(screen.getByTestId("apply-filter-btn"));
    });
});


