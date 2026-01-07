
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as router from "react-router-dom";
import * as reactRedux from "react-redux";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import { authMockData, yearMockData, countryListMockData } from "mockData/commonMockData.json";
import { alternativeCarrierListData, listOfAllLanesByShipmentsDtoData, lanesByFuelUsageAndMileageDtoData, alternativeFuelFiltersDto } from "../../../../mockData/scope3/track/alternativeFuelMockData.json";
import { authDataReducer } from "store/auth/authDataSlice";
import {
    ApiTest,
    TestFullFilledSlice,
    TestSliceMethod,
} from "commonCase/ReduxCases";

import { nodeUrl } from "constant";
import AlternativeFuelView from "pages/alternativeFuel/AlternativeFuelView";
import localFreightService from "store/localFreight/localFreightService";
import {
    getAlternativeCarriers, getKeyMetricsAlternative, getLanesByFuelUsageAndMileage, getLaneStatistics, getListOfAllLanesByShipments, getStackedGraphByLaneAndFuelTypeEmission, getStackedGraphByLaneAndFuelTypeMileage, getStackedGraphByLaneAndFuelTypeQuantity, getTotalEmissionGraphByLaneAndFuelType, localFreightDataReducer, getAlternativeLaneFuelFilters, resetLocalFreight, initialState, isLoadingAlternativeDashboard,
    getAlternativeCountryList, getAlternativeFuelTotalShipments,
    getAlternativeFuelsType,
    getTotalEmissionsDataByCarrier,
    getMileageDataByCarrier
} from "store/localFreight/localFreightSlice";
import userEvent from "@testing-library/user-event";
import store from "store"
import { filterData, } from "mockData/emissionSavedReportMockData.json";

// Payload for fetching region table data
const keyMetricsDataPayload = {
    month: 8,
    year: 2024,
    carrier_scac: ["BIAP", "FOLW"]
};

const listOfAllLanesByShipmentsPayload = {
    "month": 8,
    "year": 2024,
    "carrier_scac": [
        "BIAP",
        "FOLW"
    ],
    "page_size": 7,
    "page": 1,
    "order_by": "desc"
}

const lanesByFuelUsageAndMileagePayload = {
    "page": 1,
    "page_size": 10,
    "month": 8,
    "year": 2024,
    "order_by": "desc",
    "column": "emission",
    "fuelType": [
        "RD",
        "Diesel",
        "CNG",
        "RNG",
        "Hydrogen"
    ],
    "carrier_scac": [
        "BIAP",
        "FOLW"
    ]
}

// Configuration for fetching region table data via Redux
const alternativeCarrierListObject = {
    service: localFreightService,
    serviceName: "alternativeCarriersApi",
    sliceName: "getAlternativeCarriers",
    sliceImport: getAlternativeCarriers,
    reducerName: localFreightDataReducer,
    loadingState: "isLoadingAlternativeCarriers",
    isSuccess: "isSuccess",
    actualState: "alternativeCarrierList",
};

const alternativeCarrierListApiTestData = {
    serviceName: "alternativeCarriersApi",
    method: "get",
    serviceImport: localFreightService,
    route: `${nodeUrl}alternative-carriers-list?country_code=`,
};

// Configuration for posting region graph data via Redux
const keyMetricsDataObject = {
    service: localFreightService,
    serviceName: "getKeyMetricsDateApi",
    sliceName: "getKeyMetricsAlternative",
    sliceImport: getKeyMetricsAlternative,
    data: keyMetricsDataPayload,
    reducerName: localFreightDataReducer,
    loadingState: "keyMetricsAlternativeDtoLoading",
    isSuccess: "isSuccess",
    actualState: "keyMetricsAlternativeDto",
};

// // Configuration for API testing of posting region graph data
const keyMetricsDataApiTestData = {
    serviceName: "getKeyMetricsDateApi",
    method: "post",
    data: keyMetricsDataPayload,
    serviceImport: localFreightService,
    route: `${nodeUrl}get-metrics`,
};

const listOfAllLanesByShipmentsDataObject = {
    service: localFreightService,
    serviceName: "getListOfAllLanesByShipmentsApi",
    sliceName: "getListOfAllLanesByShipments",
    sliceImport: getListOfAllLanesByShipments,
    data: listOfAllLanesByShipmentsPayload,
    reducerName: localFreightDataReducer,
    loadingState: "listOfAllLanesByShipmentsDtoLoading",
    isSuccess: "isSuccess",
    actualState: "listOfAllLanesByShipmentsDto",
};

// // Configuration for API testing of posting region graph data
const listOfAllLanesByShipmentsTestData = {
    serviceName: "getListOfAllLanesByShipmentsApi",
    method: "post",
    data: listOfAllLanesByShipmentsPayload,
    serviceImport: localFreightService,
    route: `${nodeUrl}list-of-all-lanes-by-shipments`,
};

const lanesByFuelUsageAndMileageDataObject = {
    service: localFreightService,
    serviceName: "getLanesByFuelUsageAndMileageApi",
    sliceName: "getLanesByFuelUsageAndMileage",
    sliceImport: getLanesByFuelUsageAndMileage,
    data: lanesByFuelUsageAndMileagePayload,
    reducerName: localFreightDataReducer,
    loadingState: "lanesByFuelUsageAndMileageDtoLoading",
    isSuccess: "isSuccess",
    actualState: "lanesByFuelUsageAndMileageDto",
};

// // Configuration for API testing of posting region graph data
const lanesByFuelUsageAndMileageTestData = {
    serviceName: "getLanesByFuelUsageAndMileageApi",
    method: "post",
    data: lanesByFuelUsageAndMileagePayload,
    serviceImport: localFreightService,
    route: `${nodeUrl}get-lanes-by-fuel-usage-and-mileage`,
};


const stackedGraphByLaneAndFuelTypeEmissionDataObject = {
    service: localFreightService,
    serviceName: "getStackedGraphByLaneAndFuelTypeApi",
    sliceName: "getStackedGraphByLaneAndFuelTypeEmission",
    sliceImport: getStackedGraphByLaneAndFuelTypeEmission,
    data: lanesByFuelUsageAndMileagePayload,
    reducerName: localFreightDataReducer,
    loadingState: "lanesByFuelStackeByEmissionsDtoLoading",
    isSuccess: "isSuccess",
    actualState: "lanesByFuelStackeByEmissionsDto",
};

// // Configuration for API testing of posting region graph data
const stackedGraphByLaneAndFuelTypeEmissionTestData = {
    serviceName: "getStackedGraphByLaneAndFuelTypeApi",
    method: "post",
    data: lanesByFuelUsageAndMileagePayload,
    serviceImport: localFreightService,
    route: `${nodeUrl}get-total-data-by-lane-and-fuel-type`,
    headers: { headers: { deniedCancle: true } }
};

const stackedGraphByLaneAndFuelTypeQuantityPayload = {
    "month": 8,
    "year": 2024,
    "carrier_scac": [
        "BIAP",
        "FOLW"
    ],
    "column": "fuel_consumption"
}

const stackedGraphByLaneAndFuelTypeQuantityObject = {
    service: localFreightService,
    serviceName: "getStackedGraphByLaneAndFuelTypeApi",
    sliceName: "getStackedGraphByLaneAndFuelTypeEmission",
    sliceImport: getStackedGraphByLaneAndFuelTypeQuantity,
    data: stackedGraphByLaneAndFuelTypeQuantityPayload,
    reducerName: localFreightDataReducer,
    loadingState: "lanesByFuelStackeByQuantityDtoLoading",
    isSuccess: "isSuccess",
    actualState: "lanesByFuelStackeByQuantityDto",
};

const stackedGraphByLaneAndFuelTypeMileageObject = {
    service: localFreightService,
    serviceName: "getStackedGraphByLaneAndFuelTypeApi",
    sliceName: "getStackedGraphByLaneAndFuelTypeMileage",
    sliceImport: getStackedGraphByLaneAndFuelTypeMileage,
    data: stackedGraphByLaneAndFuelTypeQuantityPayload,
    reducerName: localFreightDataReducer,
    loadingState: "lanesByFuelStackeByMileageDtoLoading",
    isSuccess: "isSuccess",
    actualState: "lanesByFuelStackeByMileageDto",
};

const totalEmissionGraphByLaneAndFuelTypeObject = {
    service: localFreightService,
    serviceName: "getTotalEmissionGraphByLaneAndFuelTypeApi",
    sliceName: "getTotalEmissionGraphByLaneAndFuelType",
    sliceImport: getTotalEmissionGraphByLaneAndFuelType,
    data: keyMetricsDataPayload,
    reducerName: localFreightDataReducer,
    loadingState: "totalEmissionGraphByLaneAndFuelTypeLoading",
    isSuccess: "isSuccess",
    actualState: "totalEmissionGraphByLaneAndFuelType",
};

// // Configuration for API testing of posting region graph data
const totalEmissionGraphByLaneAndFuelTypeTestData = {
    serviceName: "getTotalEmissionGraphByLaneAndFuelTypeApi",
    method: "post",
    data: keyMetricsDataPayload,
    serviceImport: localFreightService,
    route: `${nodeUrl}get-total-emission-by-fuel-type`
};

const laneStatisticsObject = {
    service: localFreightService,
    serviceName: "getLaneStatisticsApi",
    sliceName: "getLaneStatistics",
    sliceImport: getLaneStatistics,
    data: keyMetricsDataPayload,
    reducerName: localFreightDataReducer,
    loadingState: "isLoadinglaneStatistics",
    isSuccess: "isSuccess",
    actualState: "laneStatisticsDto",
};

// // Configuration for API testing of posting region graph data
const laneStatisticsTestData = {
    serviceName: "getLaneStatisticsApi",
    method: "post",
    data: keyMetricsDataPayload,
    serviceImport: localFreightService,
    route: `${nodeUrl}get-lane-statistics`
};

const getAlternativeLaneFuelFiltersObject = {
    service: localFreightService,
    serviceName: "getLaneFuelFilters",
    sliceName: "getAlternativeLaneFuelFilters",
    sliceImport: getAlternativeLaneFuelFilters,
    data: keyMetricsDataPayload,
    reducerName: localFreightDataReducer,
    loadingState: "alternativeFuelFiltersLoading",
    isSuccess: "isSuccess",
    actualState: "alternativeFuelFiltersDto",
};

// // Configuration for API testing of posting region graph data
const getAlternativeLaneFuelFiltersTestData = {
    serviceName: "getLaneFuelFilters",
    method: "post",
    data: keyMetricsDataPayload,
    serviceImport: localFreightService,
    route: `${nodeUrl}get-lane-fuel-filters`
};

const getAlternativeCountryListObject = {
    service: localFreightService,
    serviceName: "alternativeCountryList",
    sliceName: "getAlternativeCountryList",
    sliceImport: getAlternativeCountryList,
    data: keyMetricsDataPayload,
    reducerName: localFreightDataReducer,
    loadingState: "isLoadingCountryList",
    actualState: "countryListData",
};

// Configuration for API testing of posting region graph data
const getAlternativeCountryListTestData = {
    serviceName: "alternativeCountryList",
    method: "get",
    data: keyMetricsDataPayload,
    serviceImport: localFreightService,
    route: `${nodeUrl}get-country-list`
};


const getAlternativeFuelTotalShipmentsObject = {
    service: localFreightService,
    serviceName: "getAlternativeFuelTotalShipmentsApi",
    sliceName: "getAlternativeFuelTotalShipments",
    sliceImport: getAlternativeFuelTotalShipments,
    data: keyMetricsDataPayload,
    reducerName: localFreightDataReducer,
    loadingState: "alternativeFuelTotalShipmentsLoading",
    actualState: "alternativeFuelTotalShipmentsDto",
};

// Configuration for API testing of posting region graph data
const getAlternativeFuelTotalShipmentsTestData = {
    serviceName: "getAlternativeFuelTotalShipmentsApi",
    method: "post",
    data: keyMetricsDataPayload,
    serviceImport: localFreightService,
    route: `${nodeUrl}alternate-carrier-by-fuel-type`
};

const getAlternativeFuelsObject = {
    service: localFreightService,
    serviceName: "getAlternativeFuelsApi",
    sliceName: "getAlternativeFuelsType",
    sliceImport: getAlternativeFuelsType,
    data: keyMetricsDataPayload,
    reducerName: localFreightDataReducer,
    loadingState: "alternativeFuelListLoading",
    actualState: "alternativeFuelListDto",
};

// Configuration for API testing of posting region graph data
const getAlternativeFuelsTestData = {
    serviceName: "getAlternativeFuelsApi",
    method: "post",
    data: keyMetricsDataPayload,
    serviceImport: localFreightService,
    route: `${nodeUrl}get-carrier-fuel-list`
};

const getTotalEmissionsDataByCarrierObject = {
    service: localFreightService,
    serviceName: "getTotalDataByCarrierApi",
    sliceName: "getTotalEmissionsDataByCarrier",
    sliceImport: getTotalEmissionsDataByCarrier,
    data: keyMetricsDataPayload,
    reducerName: localFreightDataReducer,
    loadingState: "isLoadingTotalEmissionsbyCarrierList",
    actualState: "totalEmissionsbyCarrierListData",
};

// Configuration for API testing of posting region graph data
const getTotalEmissionsDataByCarrierTestData = {
    serviceName: "getTotalDataByCarrierApi",
    method: "post",
    data: keyMetricsDataPayload,
    serviceImport: localFreightService,
    route: `${nodeUrl}get-total-data-by-carrier`
};


const getMileageDataByCarrierObject = {
    service: localFreightService,
    serviceName: "getTotalDataByCarrierApi",
    sliceName: "getMileageDataByCarrier",
    sliceImport: getMileageDataByCarrier,
    data: keyMetricsDataPayload,
    reducerName: localFreightDataReducer,
    loadingState: "isLoadingMileagebyCarrierList",
    actualState: "mileagebyCarrierListData",
};
// Execute Redux slice tests for various data
TestFullFilledSlice({
    data: [alternativeCarrierListObject, keyMetricsDataObject, listOfAllLanesByShipmentsDataObject, lanesByFuelUsageAndMileageDataObject, stackedGraphByLaneAndFuelTypeEmissionDataObject, stackedGraphByLaneAndFuelTypeQuantityObject, stackedGraphByLaneAndFuelTypeMileageObject, totalEmissionGraphByLaneAndFuelTypeObject, laneStatisticsObject, getAlternativeLaneFuelFiltersObject,
        getAlternativeCountryListObject,
        getAlternativeFuelTotalShipmentsObject,
        getAlternativeFuelsObject,
        getTotalEmissionsDataByCarrierObject,
        getMileageDataByCarrierObject
    ],
});

// Execute API tests for various data
ApiTest({
    data: [alternativeCarrierListApiTestData, keyMetricsDataApiTestData, listOfAllLanesByShipmentsTestData, lanesByFuelUsageAndMileageTestData, stackedGraphByLaneAndFuelTypeEmissionTestData, totalEmissionGraphByLaneAndFuelTypeTestData, laneStatisticsTestData, getAlternativeLaneFuelFiltersTestData,
        getAlternativeCountryListTestData,
        getAlternativeFuelTotalShipmentsTestData,
        getAlternativeFuelsTestData,
        getTotalEmissionsDataByCarrierTestData
    ]
});

TestSliceMethod({
    data: [alternativeCarrierListObject, keyMetricsDataObject, listOfAllLanesByShipmentsDataObject, lanesByFuelUsageAndMileageDataObject, stackedGraphByLaneAndFuelTypeEmissionDataObject, stackedGraphByLaneAndFuelTypeQuantityObject, stackedGraphByLaneAndFuelTypeMileageObject, totalEmissionGraphByLaneAndFuelTypeObject, laneStatisticsObject, getAlternativeLaneFuelFiltersObject,
        getAlternativeCountryListObject,
        getAlternativeFuelTotalShipmentsObject,
        getAlternativeFuelsObject,
        getTotalEmissionsDataByCarrierObject,
        getMileageDataByCarrierObject
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

        const result = localFreightDataReducer.reducer(modifiedState, resetLocalFreight());

        expect(result).toEqual(initialState);


    });
});

describe("isLoadingAlternativeDashboard Thunk", () => {
    it("should return the correct status when dispatched", async () => {
        const status = true;

        // Dispatch the thunk action
        const result = await store.dispatch(isLoadingAlternativeDashboard(status));

        // Check if the result is fulfilled and returns the expected value
        expect(result.type).toBe("isLoadingAlternativeDashboard/fulfilled");
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

describe("test alternative fuel view ", () => {
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

        jest.mock('react-toastify', () => ({
            toast: {
                success: jest.fn(),
                error: jest.fn()
            },
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

    const renderAlternativeFuelView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <AlternativeFuelView />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for whole page `, async () => {
        await renderAlternativeFuelView();
        expect(screen.getByTestId("alternative-fuel-view")).toBeInTheDocument();
    });

    //year dropdown
    it(`year selectable dropdown `, async () => {
        useSelectorMock.mockReturnValue({
            emissionDates: yearMockData,
            emissionSavedFilters: { data: filterData }
        });
        await renderAlternativeFuelView();

        const countryDropdown = screen.getByLabelText("country-dropdown");
        userEvent.click(countryDropdown);
        const countryOption = await screen.findByText("USA");
        userEvent.click(countryOption);

        const dropdown = screen.getByLabelText("year-dropdown");
        userEvent.click(dropdown);
        const option = await screen.findByText("2024");
        userEvent.click(option);
    });

    //month dropdown
    it(`month selectable dropdown `, async () => {
        useSelectorMock.mockReturnValue({
            configConstants: {
                data: {
                    alternative_fuel_default_year: 2024
                }
            },
            emissionSavedFilters: { data: filterData }

        });
        await renderAlternativeFuelView();
        expect(screen.getByLabelText("month-dropdown")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("month-dropdown"));
        userEvent.click(await screen.findByText("March"));
    });

    //Carrier options
    it(`carrier selectable options `, async () => {
        useSelectorMock.mockReturnValue({
            configConstants: {
                data: {
                    alternative_fuel_default_year: 2024
                }
            },
            alternativeCarrierList: alternativeCarrierListData,
            lanesByFuelUsageAndMileageDto: lanesByFuelUsageAndMileageDtoData,
            alternativeFuelFiltersDto: alternativeFuelFiltersDto

        });
        await renderAlternativeFuelView();

        useSelectorMock.mockReturnValue({
            alternativeCarrierList: {
                data: [
                    {
                        "name": "Biagi Bros inc",
                        "scac": "BIAP",
                        "image": "/images/company_logo/biagi.png",
                        "scac_priority": true
                    },
                    {
                        "name": "Biagi Bros inc",
                        "scac": "BIAE",
                        "image": "/images/company_logo/biagi.png",
                        "scac_priority": true
                    },
                ],
            },
        });
        await renderAlternativeFuelView();
        const carrierDropDown = screen.getAllByLabelText("multi-carrier-dropdown");
        expect(carrierDropDown[0]).toBeInTheDocument();
        userEvent.click(carrierDropDown[0]);

        const carrierOption = await screen.findAllByText("Biagi Bros inc");
        userEvent.click(carrierOption[0]);
        userEvent.click(screen.getAllByTestId('carrier-BIAP')[0]);
        userEvent.click(screen.getAllByTestId('carrier-BIAE')[0]);


        // check atleast one is checked
        // userEvent.click(screen.getByTestId('carrier-FOLW'));
        // await waitFor(() => {
        //     expect(screen.getByTestId("input-FOLW")).toBeChecked();
        // });


    });

    //Carrier options
    it(`cards loading state`, async () => {
        useSelectorMock.mockReturnValue({
            configConstants: {
                data: {
                    alternative_fuel_default_year: 2024
                }
            },
            keyMetricsAlternativeDtoLoading: true
        });
        await renderAlternativeFuelView();
        expect(screen.getByTestId('total-lanes-card')).toBeInTheDocument();
        expect(screen.getByTestId('total-shipment-card')).toBeInTheDocument();
        expect(screen.getByTestId('total-emission-card')).toBeInTheDocument();
    });

    //Carrier options
    it(`detect list of lanes`, async () => {
        useSelectorMock.mockReturnValue({
            configConstants: {
                data: {
                    alternative_fuel_default_year: 2024
                }
            },
            listOfAllLanesByShipmentsDtoLoading: false,
            listOfAllLanesByShipmentsDto: listOfAllLanesByShipmentsDtoData
        });
        await renderAlternativeFuelView();
        expect(screen.getByTestId('lanes-by-shipment')).toBeInTheDocument();
        userEvent.click(screen.getByTestId("change-order-shipment"))

        // expect(screen.getByLabelText("pagination-dropdown")).toBeInTheDocument();
        // userEvent.click(screen.getByLabelText("pagination-dropdown"));

        // const paginationData = await screen.findByText("50");
        // await act(async () => {
        //     userEvent.click(paginationData);
        // });

        // const anchorElement = screen.getByRole('button', { name: '2' });
        // expect(anchorElement).toBeInTheDocument();
        // userEvent.click(anchorElement);
    });

    it(`check-unckeck fuel type in list of lanes`, async () => {
        useSelectorMock.mockReturnValue({
            configConstants: {
                data: {
                    alternative_fuel_default_year: 2024
                }
            },
            lanesByFuelUsageAndMileageDto: lanesByFuelUsageAndMileageDtoData,
            alternativeFuelFiltersDto: alternativeFuelFiltersDto
        });
        await renderAlternativeFuelView();
        expect(screen.getByTestId('HVO-fuel-type')).toBeInTheDocument();
        // check unchecking 
        userEvent.click(screen.getByTestId('RD-fuel-type'));
        await waitFor(() => {
            expect(screen.getByTestId('RD-fuel-type')).not.toBeChecked();
        });
        // check checking
        userEvent.click(screen.getByTestId('RD-fuel-type'));
        await waitFor(() => {
            expect(screen.getByTestId('RD-fuel-type')).toBeChecked();
        });

        expect(screen.getByTestId('Mira Loma, CA_Riverside, CA_Diesel')).toBeInTheDocument();
        userEvent.click(screen.getByTestId('Mira Loma, CA_Riverside, CA_Diesel'));

        userEvent.click(screen.getByTestId("change-order-fuel_consumption"))
        userEvent.click(screen.getByTestId("change-order-fuel_mileage"))
        userEvent.click(screen.getByTestId("change-order-emission"))

        expect(screen.getByLabelText("pagination-dropdown")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("pagination-dropdown"));

        const paginationData = await screen.findAllByText("50");
        await act(async () => {
            userEvent.click(paginationData[0]);
        });
    });
});
