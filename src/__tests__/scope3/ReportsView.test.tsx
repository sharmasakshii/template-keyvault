import {
    act,
    cleanup,
    render,
    screen,
    fireEvent,
} from "@testing-library/react";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as router from "react-router-dom";

import * as reactRedux from "react-redux";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import { authDataReducer } from "store/auth/authDataSlice";
import {
    laneReportMockData, carrierEmissionMockData
} from "mockData/reportMockData.json";
import { authMockData, authMockDataL, yearMockData, regionMockdata, divisionMockdata } from "mockData/commonMockData.json";

import ReportsView from "pages/reports/ReportsView";

import {
    laneMockDestinationData,
    laneMockOriginData,

} from "../../mockData/laneMockData.json";

import userEvent from "@testing-library/user-event";
import {
    ApiTest,
    TestFullFilledSlice,
    TestSliceMethod,
} from "commonCase/ReduxCases";
import {
    reportDataReducer,
    getReportLanesData,
    reportKeyMatrix,
    isLoadingReportDashboard,
    initialState,
    resetReportUnit
} from "store/report/reportSlice";
import { nodeUrl } from "constant"
import reportService from "store/report/reportService";
import store from "store"
const reportPayload = {}
// Configuration for API testing of fetching graph filter dates data
const getReportLanesDataApiTestData = {
    serviceName: "getReportLanesApi",
    method: "post",
    data: reportPayload,
    serviceImport: reportService,
    route: `${nodeUrl}report-lane-data`,
};

// Configuration for fetching graph filter dates data via Redux
const getReportLanesDataDataObject = {
    service: reportService,
    serviceName: "getReportLanesApi",
    sliceName: "getReportLanesData",
    sliceImport: getReportLanesData,
    data: reportPayload,
    reducerName: reportDataReducer,
    loadingState: "isLoadingReportLaneData",
    actualState: "reportLaneData",
};

// Configuration for API testing of fetching graph filter dates data
const reportKeyMatrixApiTestData = {
    serviceName: "getReportKeyMatrixApi",
    method: "post",
    data: reportPayload,
    serviceImport: reportService,
    route: `${nodeUrl}report-lane-matrix`,
};

// Configuration for fetching graph filter dates data via Redux
const reportKeyMatrixDataObject = {
    service: reportService,
    serviceName: "getReportKeyMatrixApi",
    sliceName: "reportKeyMatrix",
    sliceImport: reportKeyMatrix,
    data: reportPayload,
    reducerName: reportDataReducer,
    loadingState: "isLoadingKeyMatrix",
    actualState: "reportKeyMatrixData",
};

// Execute Redux slice tests for various data
TestFullFilledSlice({
    data: [
        getReportLanesDataDataObject,
        reportKeyMatrixDataObject,
    ],
});


// Execute API tests for various data
ApiTest({
    data: [
        getReportLanesDataApiTestData,
        reportKeyMatrixApiTestData,
    ],
});


TestSliceMethod({
    data: [
        getReportLanesDataDataObject,
        reportKeyMatrixDataObject,
    ],
});


// Test case initialState
describe('initial reducer', () => {
    it('should reset state to initialState when resetCarrier is called', () => {
        const modifiedState: any = {
            data: [{ id: 1, value: 'test' }],
            loading: true,
            error: 'Something went wrong',
        };

        const result = reportDataReducer.reducer(modifiedState, resetReportUnit());

        expect(result).toEqual(initialState);


    });
});


describe("isLoadingReportDashboard", () => {
    it("should return the correct status when dispatched", async () => {
        const status = true;
        // Dispatch the thunk action
        const result = await store.dispatch(isLoadingReportDashboard(status));
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

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}));

window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe("test Role view ", () => {
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

    const renderReportsView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <ReportsView />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for whole page `, async () => {
        await renderReportsView();
        expect(screen.getByTestId("reports-screen")).toBeInTheDocument();
    });

    //section id.....
    it(`<section> test case for whole page `, async () => {

        // Mock useParams
        useSelectorMock.mockReturnValue({
            configConstants: {
                data: {
                    DEFAULT_YEAR: 2024,
                    rd_radius: 20
                }
            },
            emissionDates: yearMockData,
            loginDetails: {
                data: authMockData?.userdata
            },
            reportLaneData: {
                data: laneReportMockData
            },
            carrierEmissionData: {
                data: carrierEmissionMockData
            },
            regions: {
                data: regionMockdata,
            },
            divisions: {
                data: divisionMockdata
            }
        });

        await renderReportsView();
        expect(screen.getByTestId("reports-screen")).toBeInTheDocument();

        expect(screen.getByLabelText("region-dropdown")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("region-dropdown"));
        const regionData = await screen.findByText("R1");
        userEvent.click(regionData);

        const dropdown = screen.getByLabelText("year-dropdown");
        userEvent.click(dropdown);
        const option = await screen.findByText("2023");
        userEvent.click(option);

    });


    //section id.....
    it(`<section> test case for whole page `, async () => {

        // Mock useParams
        useSelectorMock.mockReturnValue({
            configConstants: {
                data: {
                    DEFAULT_YEAR: 2024,
                    rd_radius: 20
                }
            },
            emissionDates: yearMockData,
            loginDetails: {
                data: authMockDataL?.userdata
            },
            reportLaneData: {
                data: laneReportMockData
            },
            carrierEmissionData: {
                data: carrierEmissionMockData
            },
            regions: {
                data: regionMockdata,
            },
            divisions: {
                data: divisionMockdata
            }
        });

        await renderReportsView();
        expect(screen.getByTestId("reports-screen")).toBeInTheDocument();



        expect(screen.getByLabelText("quarter-dropdown")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("quarter-dropdown"));
        const optionQuarter = await screen.findByText("Q1");
        userEvent.click(optionQuarter);

    });

    //section id.....
    it(`<section> test case for divsion page `, async () => {

        // Mock useParams
        useSelectorMock.mockReturnValue({
            configConstants: {
                data: {
                    DEFAULT_YEAR: 2024
                }
            },
            emissionDates: yearMockData,
            loginDetails: {
                data: authMockData?.userdata
            },
            reportLaneData: {
                data: laneReportMockData
            },
            carrierEmissionData: {
                data: carrierEmissionMockData
            },
            regions: {
                data: regionMockdata,
            },
            divisions: {
                data: divisionMockdata
            }
        });

        await renderReportsView();
        expect(screen.getByTestId("reports-screen")).toBeInTheDocument();

        expect(screen.getByLabelText("divison-dropdown")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("divison-dropdown"));
        const optionDivision = await screen.findByText("OUTBOUND-Test");
        userEvent.click(optionDivision);


        // const carrierDropDown = screen.getByTestId("multi-carrier-dropdown");
        // expect(carrierDropDown).toBeInTheDocument();
        // userEvent.click(carrierDropDown);

        // const carrier1Option = screen.getByText('OPTIMUS');
        // userEvent.click(carrier1Option);

    });

    it(`<section> test case for table sorting `, async () => {

        // Mock useParams
        useSelectorMock.mockReturnValue({
            configConstants: {
                data: {
                    DEFAULT_YEAR: 2024,
                    rd_radius: 50
                }
            },
            emissionDates: yearMockData,
            loginDetails: {
                data: authMockData?.userdata
            },
            reportLaneData: {
                data: laneReportMockData
            },
            carrierEmissionData: {
                data: carrierEmissionMockData
            },
            regions: {
                data: regionMockdata,
            },
            divisions: {
                data: divisionMockdata
            }
        });

        await renderReportsView();
        const fuelStopRd = screen.getByTestId("fuel-RNG");
        expect(fuelStopRd).toBeInTheDocument();
        userEvent.click(fuelStopRd);

        const carrierDropDown = screen.getByTestId("intensity-sort-distance");
        expect(carrierDropDown).toBeInTheDocument();
        userEvent.click(carrierDropDown);

        const emissionSort = screen.getByTestId("emission-sort-dt");
        expect(emissionSort).toBeInTheDocument();
        userEvent.click(emissionSort);

        const carrierAccordionDropDown = screen.getByText("MERRIEL, OR, 97633 to BAKERSFIELD, CA, 93314");
        expect(carrierAccordionDropDown).toBeInTheDocument();
        userEvent.click(carrierAccordionDropDown);

        const viewMapDetail = screen.getByTestId('view-map-detail-267530');
        expect(viewMapDetail).toBeInTheDocument();
        userEvent.click(viewMapDetail);

        const carrierEmissionSort = screen.getByTestId("carrier-emission-sort-dt-267530");
        expect(carrierEmissionSort).toBeInTheDocument();
        userEvent.click(carrierEmissionSort);

        const carrierEmissionSaveSort = screen.getByTestId("carrier-emission-save-sort-dt-267530");
        expect(carrierEmissionSaveSort).toBeInTheDocument();
        userEvent.click(carrierEmissionSaveSort);

        const fuelStopRadius = screen.getByTestId("fuel-stop-radius");
        expect(fuelStopRadius).toBeInTheDocument();
        userEvent.click(fuelStopRadius);

        const fuelOptionRD = screen.getByTestId("fuel-option-rd");
        expect(fuelOptionRD).toBeInTheDocument();
        userEvent.click(fuelOptionRD);
    })


    it(`pagination dropdown`, async () => {
        useSelectorMock.mockReturnValue({
            configConstants: {
                data: {
                    DEFAULT_YEAR: 2024
                }
            },
            emissionDates: yearMockData,
            loginDetails: {
                data: authMockData?.userdata
            },
            reportLaneData: {
                data: laneReportMockData
            },
            carrierEmissionData: {
                data: carrierEmissionMockData
            },
            regions: {
                data: regionMockdata,
            },
            divisions: {
                data: divisionMockdata
            },
            checkLaneFuelData: {
                data: {
                    results: [{ isValid: 1 }]
                },
            },
            fuelStopListDto: {
                data: [{
                    "id": 1,
                    "name": "Conventional diesel",
                    "code": "PD"
                }]
            },

        });
        await renderReportsView();

        expect(screen.getByLabelText("pagination-dropdown")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("pagination-dropdown"));

        const paginationData = await screen.findByText("50");
        await act(async () => {
            userEvent.click(paginationData);
        });

        const anchorElement = screen.getByRole('button', { name: '2' });
        expect(anchorElement).toBeInTheDocument();
        userEvent.click(anchorElement);

        expect(screen.getByTestId("threshold-input-280471")).toBeInTheDocument();
        fireEvent.change(screen.getByTestId("threshold-input-280471"), { target: { value: "50" } });
        fireEvent.blur(screen.getByTestId("threshold-input-280471"));



    });

    it(`<section> test case for pagination `, async () => {
        useSelectorMock.mockReturnValue({
            configConstants: {
                data: {
                    DEFAULT_YEAR: 2024
                }
            },
            emissionDates: yearMockData,
            loginDetails: {
                data: authMockData?.userdata
            },
            reportLaneData: {
                data: laneReportMockData
            },
            carrierEmissionData: {
                data: carrierEmissionMockData
            },
            regions: {
                data: regionMockdata,
            },
            divisions: {
                data: divisionMockdata
            }

        });
        await renderReportsView();

        expect(screen.getByTestId("threshold-input-280471")).toBeInTheDocument();
        fireEvent.change(screen.getByTestId("threshold-input-280471"), { target: { value: "" } });
        fireEvent.blur(screen.getByTestId("threshold-input-280471"));


        const parent = screen.getByTestId("threshold-section-280471");
        const input = screen.getByTestId("threshold-input-280471");

        const focusEvent = new FocusEvent("focus", {
            bubbles: true,
            cancelable: true,
        });
        input.dispatchEvent(focusEvent);

        const keyEvent = new KeyboardEvent("keydown", {
            key: "Enter",
            bubbles: true,
            cancelable: true,
        });

        const preventDefaultSpy = jest.spyOn(keyEvent, "preventDefault");

        input.dispatchEvent(keyEvent);


        const parentClick = jest.fn();
        parent.onclick = parentClick;

        fireEvent.click(input);


    });

    it(`test case for apply button .`, async () => {
        useSelectorMock.mockReturnValue({
            configConstants: {
                data: {
                    optimus_radius: 10,
                    default_distance_unit: "miles"
                },
            },
            laneOriginData: {
                data: laneMockOriginData,
            },

            laneDestinationData: {
                data: laneMockDestinationData,
            },

        });
        await renderReportsView()
        const viewLaneBtn = screen.getByTestId("apply-button");
        expect(viewLaneBtn).toBeInTheDocument();
        fireEvent.click(viewLaneBtn);
    });
});