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
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import { authDataReducer } from "store/auth/authDataSlice";
import { commonDataReducer } from "store/commonData/commonSlice";
import FuelWrapperView from "pages/fuel/FuelWrapperView";
import userEvent from "@testing-library/user-event";
import { authMockData, regionMockdata, yearMockData } from "mockData/commonMockData.json";

import {
    ApiTest,
    TestFullFilledSlice,
    TestSliceMethod,
} from "commonCase/ReduxCases";
import {
    fuelDataReducer,
    fuelTableData,
    fuelGraphData,
    vehicleGraphData,
    resetFuel,
    initialState,
    fuelCarrierEmissionGraph,
    getFuelOverviewDto,
    getFuelLaneBreakdownByEmissionsIntensity,
    isLoadingFuelDashboard
} from "store/fuel/fuelSlice";
import { nodeUrl } from "constant"
import fuelService from "store/fuel/fuelService";
import {
    tableGraphMockData
} from "../../../../mockData/regionalViewMockData.json";
import store from "store"
const fuelPayload = {}

// Configuration for API testing of fetching graph filter dates data
const getFuelTableApiTestData = {
    serviceName: "fuelTableApi",
    method: "post",
    data: fuelPayload,
    serviceImport: fuelService,
    route: `${nodeUrl}fuel-vehicle-emission-table-data`,
};

// Configuration for fetching graph filter dates data via Redux
const getFuelTableDataObject = {
    service: fuelService,
    serviceName: "fuelTableApi",
    sliceName: "fuelTableData",
    sliceImport: fuelTableData,
    data: fuelPayload,
    reducerName: fuelDataReducer,
    loadingState: "fuelTableDtoLoading",
    actualState: "fuelTableDto",
};

// Configuration for API testing of fetching graph filter dates data
const getFuelGraphApiTestData = {
    serviceName: "fuelGraphApi",
    method: "post",
    data: fuelPayload,
    serviceImport: fuelService,
    route: `${nodeUrl}fuel-vehicle-emission-graph-data`,
};

// Configuration for fetching graph filter dates data via Redux
const getFuelGraphDataObject = {
    service: fuelService,
    serviceName: "fuelGraphApi",
    sliceName: "fuelGraphData",
    sliceImport: fuelGraphData,
    data: fuelPayload,
    reducerName: fuelDataReducer,
    loadingState: "fuelGraphDtoLoading",
    actualState: "fuelGraphDto",
};

// Configuration for fetching graph filter dates data via Redux
const getVehicleGraphDataObject = {
    service: fuelService,
    serviceName: "fuelGraphApi",
    sliceName: "vehicleGraphData",
    sliceImport: vehicleGraphData,
    data: fuelPayload,
    reducerName: fuelDataReducer,
    loadingState: "vehicleGraphDtoLoading",
    actualState: "vehicleGraphDto",
};

// Configuration for API testing of fetching graph filter dates data
const getFuelCarrierEmissionGraphApiTestData = {
    serviceName: "fuelCarrierEmissionGraphApi",
    method: "post",
    data: fuelPayload,
    serviceImport: fuelService,
    route: `${nodeUrl}fuel-vehicle-carrier-emission-table-data`,
};

// Configuration for fetching graph filter dates data via Redux
const getfuelCarrierEmissionGraphDataObject = {
    service: fuelService,
    serviceName: "fuelCarrierEmissionGraphApi",
    sliceName: "fuelCarrierEmissionGraph",
    sliceImport: fuelCarrierEmissionGraph,
    data: fuelPayload,
    reducerName: fuelDataReducer,
    loadingState: "fuelCarrierEmissionTableDtoLoading",
    actualState: "fuelCarrierEmissionTableDto",
};

// Configuration for API testing of fetching graph filter dates data
const getFuelOverviewDtoApiTestData = {
    serviceName: "getFuelOverviewDtoApi",
    method: "post",
    data: fuelPayload,
    serviceImport: fuelService,
    route: `${nodeUrl}fuel-vehicle-overview-data`,
};

// Configuration for fetching graph filter dates data via Redux
const getFuelOverviewDtoDataObject = {
    service: fuelService,
    serviceName: "fuelCarrierEmissionGraphApi",
    sliceName: "getFuelOverviewDto",
    sliceImport: getFuelOverviewDto,
    data: fuelPayload,
    reducerName: fuelDataReducer,
    loadingState: "fuelOverviewDtoLoading",
    actualState: "fuelOverviewDto",
};

// 
// Configuration for API testing of fetching graph filter dates data
const getFuelLaneBreakdownByEmissionsIntensityApiTestData = {
    serviceName: "getFuelLaneBreakdownByEmissionsIntensityApi",
    method: "post",
    data: fuelPayload,
    serviceImport: fuelService,
    route: `${nodeUrl}fuel-vehicle-lane-breakdown-data`,
};

// Configuration for fetching graph filter dates data via Redux
const getFuelLaneBreakdownByEmissionsIntensityDataObject = {
    service: fuelService,
    serviceName: "fuelCarrierEmissionGraphApi",
    sliceName: "getFuelLaneBreakdownByEmissionsIntensity",
    sliceImport: getFuelLaneBreakdownByEmissionsIntensity,
    data: fuelPayload,
    reducerName: fuelDataReducer,
    loadingState: "fuelLaneBreakdownLoading",
    actualState: "fuelLaneBreakdown",
};

// Execute Redux slice tests for various data
TestFullFilledSlice({
    data: [
        getFuelTableDataObject,
        getFuelGraphDataObject,
        getVehicleGraphDataObject,
        getfuelCarrierEmissionGraphDataObject,
        getFuelOverviewDtoDataObject,
        getFuelLaneBreakdownByEmissionsIntensityDataObject
    ],
});


// Execute API tests for various data
ApiTest({
    data: [
        getFuelTableApiTestData,
        getFuelGraphApiTestData,
        getFuelCarrierEmissionGraphApiTestData,
        getFuelOverviewDtoApiTestData,
        getFuelLaneBreakdownByEmissionsIntensityApiTestData
    ],
});


TestSliceMethod({
    data: [
        getFuelTableDataObject,
        getFuelGraphDataObject,
        getVehicleGraphDataObject,
        getfuelCarrierEmissionGraphDataObject,
        getFuelOverviewDtoDataObject,
        getFuelLaneBreakdownByEmissionsIntensityDataObject
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

        const result = fuelDataReducer.reducer(modifiedState, resetFuel());

        expect(result).toEqual(initialState);
    });
});

describe("isLoadingBusinessUnitDashboard Thunk", () => {
    it("should return the correct status when dispatched", async () => {
      const status = true;
      // Dispatch the thunk action
      const result = await store.dispatch(isLoadingFuelDashboard(status));
      expect(result.payload).toBe(status);
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

describe("test lane view for facility ", () => {
    let useDispatchMock: jest.Mock;
    let useSelectorMock: jest.Mock;
    let stores: EnhancedStore;
    const navigate = jest.fn();

    beforeEach(() => {
        stores = configureStore({
            reducer: {
                fuel: fuelDataReducer?.reducer,
                auth: authDataReducer.reducer,
                commonData: commonDataReducer.reducer,
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

    const renderFuelView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <FuelWrapperView />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for by fuel view page `, async () => {
        await renderFuelView();
        expect(screen.getByTestId("Fuel-view")).toBeInTheDocument();
    });

    //regin selectable row
    it(`carrier region dropdown `, async () => {
        useSelectorMock.mockReturnValue({
            regions: {
                data: regionMockdata,
            },
            configConstants: {
                data: {
                    DEFAULT_YEAR: 2024,
                    DEFAULT_QUARTER: 1
                }
            }
        });
        await renderFuelView();

        expect(screen.getByLabelText("region-dropdown")).toBeInTheDocument();

        userEvent.click(screen.getByLabelText("region-dropdown"));

        const regionData = await screen.findByText("R1");
        userEvent.click(regionData);
    });

    //year selectable row
    it(`year dropdown `, async () => {
        useSelectorMock.mockReturnValue({
            emissionDates: yearMockData,
        });

        await renderFuelView();
        const dropdown = screen.getByLabelText("year-dropdown");
        userEvent.click(dropdown);
        const option = await screen.findByText("2021");
        userEvent.click(option);
    });

    //quarterly selectable row
    it(`quarter dropdown `, async () => {
        await renderFuelView();
        expect(screen.getByLabelText("quarter-dropdown")).toBeInTheDocument();
        await act(async () => {
            userEvent.click(screen.getByLabelText("quarter-dropdown"));
        });
        const regionData = await screen.findByText("Q1");
        await act(async () => {
            userEvent.click(regionData);
        });
    });

    //navigate to other page region wise emission intensity
    it(`region wise emission intensity table graph data`, async () => {
        useSelectorMock.mockReturnValue({
            isLoading: false,
            fuelTableDto: {
                data: tableGraphMockData,
            },
        });
        await renderFuelView();
        expect(screen.getByTestId("table-graph-data")).toBeInTheDocument();
        expect(screen.getByTestId("change-order-intensity")).toBeInTheDocument();
        userEvent.click(screen.getByTestId("change-order-intensity"));


        tableGraphMockData?.forEach(async (ele, index) => {
            expect(screen.getByTestId(`table-row-data${index}`)).toBeInTheDocument();
            userEvent.click(screen.getByTestId(`table-row-data${index}`));
        });
    });

    //navigate to other page region wise emission intensity
    // it(`Export data`, async () => {
    //     // Mock URL
    //     global.URL.createObjectURL = jest.fn(() => 'mocked-url');
    //     global.URL.revokeObjectURL = jest.fn();

    //     useSelectorMock.mockReturnValue({
    //         isLoading: false,
    //         fuelTableDto: {
    //             data: tableGraphMockData,
    //         },
    //     });
    //     await renderFuelView();
    //     expect(screen.getByTestId("export-btn")).toBeInTheDocument();
    //     userEvent.click(screen.getByTestId("export-btn"));


    // });
    // export-btn
});
