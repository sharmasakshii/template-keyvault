
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
import { authMockData, yearMockData, divisionMockdata } from "mockData/commonMockData.json";
import { authDataReducer } from "store/auth/authDataSlice";

import CarrierTypeView from "pages/carrierType/CarrierTypeView";
import {
    carrierDetailsReducer,
    getCarrierTypeTableDto,
    getCarrierTypeEmissionDto

} from "store/scopeThree/track/carrier/vendorSlice";
import {
    graphMockDataEmissionIntensity,
    graphMockDataTotalEmission,
    tableGraphMockData
} from "../../../../mockData/regionalViewMockData.json";
import userEvent from "@testing-library/user-event";
import vendorService from "store/scopeThree/track/carrier/vendorService";
import {
    ApiTest,
    TestFullFilledSlice,
    TestSliceMethod,
} from "commonCase/ReduxCases";
import store from "store"

import { nodeUrl } from "constant";

// Payload for posting region graph data
const regionGraphPostPayload = {
    region_id: "",
    year: 2023,
    quarter: 1,
    toggel_data: 0,
};

// Payload for fetching region table data
const regionTableDataGetPayload = {
    region_id: "",
    year: 2023,
    quarter: 1,
    toggel_data: 0,
    order_by: "desc",
    col_name: "emission",
};


// Configuration for posting region graph data via Redux
const getCarrierTypeTableDtoSlice = {
    service: vendorService,
    serviceName: "getCarrierTypeTableDtoApi",
    sliceName: "getCarrierTypeTableDto",
    sliceImport: getCarrierTypeTableDto,
    data: regionGraphPostPayload,
    reducerName: carrierDetailsReducer,
    loadingState: "isLoadingCarrierTable",
    actualState: "carrierTypeTableDto",
};

// Configuration for API testing of posting region graph data
const getCarrierTypeTableApi = {
    serviceName: "getCarrierTypeTableDtoApi",
    method: "post",
    data: regionGraphPostPayload,
    serviceImport: vendorService,
    route: `${nodeUrl}get-carrier-type-table-data`,
};


// Configuration for posting region graph data via Redux
const getCarrierTypeEmissionDtoSlice = {
    service: vendorService,
    serviceName: "getCarrierTypeEmissionDtoApi",
    sliceName: "getCarrierTypeEmissionDto",
    sliceImport: getCarrierTypeEmissionDto,
    data: regionGraphPostPayload,
    reducerName: carrierDetailsReducer,
    loadingState: "isLoadingCarrierEmission",
    actualState: "carrierTypeEmissionDto",
};

// Configuration for API testing of posting region graph data
const getCarrierTypeTableDtoApi = {
    serviceName: "getCarrierTypeEmissionDtoApi",
    method: "post",
    data: regionGraphPostPayload,
    serviceImport: vendorService,
    route: `${nodeUrl}carrier-type-emission`,
};



// Execute Redux slice tests for various data
TestFullFilledSlice({
    data: [getCarrierTypeTableDtoSlice, getCarrierTypeEmissionDtoSlice],
});

// Execute API tests for various data
ApiTest({
    data: [getCarrierTypeTableApi, getCarrierTypeTableDtoApi],
});

TestSliceMethod({
    data: [getCarrierTypeTableDtoSlice, getCarrierTypeEmissionDtoSlice],
});



// // Test case initialState
// describe('initial reducer', () => {
//   it('should reset state to initialState when resetScopeOneCommonData is called', () => {
//     const modifiedState: any = {
//       data: [{ id: 1, value: 'test' }],
//       loading: true,
//       error: 'Something went wrong',
//     };

//     const result = carrierDetailsReducer.reducer(modifiedState, resetRegion());
//     expect(result).toEqual(initialState);


//   });
// });

// describe("open sidebar Thunk", () => {
//   it("should return the correct status when dispatched", async () => {
//     const status = true;
//     // Dispatch the thunk action
//     const result = await store.dispatch(isLoadingRegionDashboard(status));
//     expect(result.payload).toBe(status);
//   });
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

describe("test lane view ", () => {
    let useDispatchMock: jest.Mock;
    let useSelectorMock: jest.Mock;
    let stores: EnhancedStore;
    const navigate = jest.fn();
    beforeEach(() => {
        stores = configureStore({
            reducer: {
                region: carrierDetailsReducer?.reducer,
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

    const renderCarrierTypeView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <CarrierTypeView />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for whole page `, async () => {
        await renderCarrierTypeView();
        expect(screen.getByTestId("regional")).toBeInTheDocument();
    });

    //year dropdown
    it(`year selectable dropdown `, async () => {
        useSelectorMock.mockReturnValue({
            emissionDates: yearMockData,
            regionGraphDetailsLoading: false,
        });
        await renderCarrierTypeView();
        const dropdown = screen.getByLabelText("year-dropdown");
        userEvent.click(dropdown);
        const option = await screen.findByText("2021");
        userEvent.click(option);
    });

    // //quarter dropdown
    // it(`quarter selectable dropdown `, async () => {
    //   await renderCarrierTypeView();
    //   expect(screen.getByLabelText("quarter-dropdown")).toBeInTheDocument();
    //   userEvent.click(screen.getByLabelText("quarter-dropdown"));
    //   userEvent.click(await screen.findByText("Q4"));
    // });

    //division dropdown
    it(`division selectable dropdown `, async () => {
        // Mock useParams
        useSelectorMock.mockReturnValue({
            configConstants: {
                data: {
                    DEFAULT_YEAR: 2024,
                    rd_radius: 20
                }
            },
            loginDetails: {
                data: authMockData?.userdata
            },

            divisions: {
                data: divisionMockdata
            }
        });

        await renderCarrierTypeView();
        // expect(screen.getByLabelText("quarter-dropdown")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("divison-dropdown"));
        const optionDivision = await screen.findByText("OUTBOUND-Test");
        userEvent.click(optionDivision);

    });

    //export download button
    it(`export download button `, async () => {
        global.URL.createObjectURL = jest.fn(() => 'mocked-url');
        global.URL.revokeObjectURL = jest.fn();

        useSelectorMock.mockReturnValue({
            carrierTypeTableDto: {
                data: tableGraphMockData,
            },
        });
        await renderCarrierTypeView();
        expect(screen.getByTestId("export-btn")).toBeInTheDocument();
        userEvent.click(screen.getByTestId("export-btn"));
    });

    //emission intensity graph data 1
    it(` graph data test case for Emission intensity for region`, async () => {
        useSelectorMock.mockReturnValue({
            regionGraphDetails: {
                data: graphMockDataEmissionIntensity,
            },
        });

        await renderCarrierTypeView();
        expect(screen.getByTestId("graph-data")).toBeInTheDocument();
        const emissionRadioToggle = screen.getByTestId(
            "emission-intensity-toggle-region"
        ) as HTMLInputElement;
        expect(emissionRadioToggle).toBeInTheDocument();
        fireEvent.click(emissionRadioToggle);
        expect(emissionRadioToggle.checked).toBe(true);
    });

    //total emission graph data 2
    it(` graph data test case for Total Emission  for region`, async () => {
        useSelectorMock.mockReturnValue({
            regionGraphDetails: {
                data: graphMockDataTotalEmission,
            },
        });

        await renderCarrierTypeView();
        expect(screen.getByTestId("graph-data")).toBeInTheDocument();
        const TotalemissionRadioToggle = screen.getByTestId(
            "total-emission-toggle-region"
        ) as HTMLInputElement;
        expect(TotalemissionRadioToggle).toBeInTheDocument();
        fireEvent.click(TotalemissionRadioToggle);
        expect(TotalemissionRadioToggle.checked).toBe(true);
    });

    //performance data headings
    it(`performance heading data`, async () => {
        await renderCarrierTypeView();
        expect(screen.getByTestId("performance-data-heading")).toBeInTheDocument();
    });

    //graph 2 region wise emission intensity
    it(`region wise emission intensity table graph data`, async () => {
        global.URL.createObjectURL = jest.fn(() => 'mocked-url');
        global.URL.revokeObjectURL = jest.fn();

        useSelectorMock.mockReturnValue({
            carrierTypeTableDto: {
                data: tableGraphMockData,
            },
        });
        await renderCarrierTypeView();
        expect(screen.getByTestId("table-graph-data")).toBeInTheDocument();
        expect(screen.getByTestId("export-btn")).toBeEnabled();
        userEvent.click(screen.getByTestId("export-btn"))
    });

    //loading
    it(`loading spinner`, async () => {
        useSelectorMock.mockReturnValue({
            isLoading: true,
        });
        await renderCarrierTypeView();
    });

    //navigate to other page region wise emission intensity
    it(`region wise emission intensity table graph data`, async () => {
        useSelectorMock.mockReturnValue({
            isLoading: false,
            carrierTypeTableDto: {
                data: tableGraphMockData,
            },
        });
        await renderCarrierTypeView();
        expect(screen.getByTestId("table-graph-data")).toBeInTheDocument();
        tableGraphMockData?.forEach(async (ele, index) => {
            expect(screen.getByTestId(`table-row-data${index}`)).toBeInTheDocument();
            fireEvent.click(screen.getByTestId(`table-row-data${index}`));
            // expect(navigate).toHaveBeenCalledWith(`/region-overview/${ele?.name}/2023/0`);
        });
    });

    // change order by clicking on table headings
    it(`arrow buttons in table heading for sorting`, async () => {
        useSelectorMock.mockReturnValue({
            isLoading: false,
            carrierTypeTableDto: {
                data: tableGraphMockData,
            },
        });
        await renderCarrierTypeView();
        expect(screen.getByTestId("change-order-intensity")).toBeInTheDocument();
        fireEvent.click(screen.getByTestId("change-order-intensity"));
        expect(screen.getByTestId("change-order-emission")).toBeInTheDocument();
        fireEvent.click(screen.getByTestId("change-order-emission"));
        expect(screen.getByTestId("change-order-shipments")).toBeInTheDocument();
        fireEvent.click(screen.getByTestId("change-order-shipments"));
    });
});
