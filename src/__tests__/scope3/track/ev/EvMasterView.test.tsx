
import {
    act,
    cleanup,
    fireEvent,
    render,
    screen,
} from "@testing-library/react";
import * as utils from "../../../../store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as router from "react-router-dom";
import userEvent from "@testing-library/user-event";

import * as reactRedux from "react-redux";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import { authMockData } from "mockData/commonMockData.json";
import { authDataReducer } from "store/auth/authDataSlice";
import {
    masterCarrierMockData,
    listOfCarriers,
} from "mockData/evMockData.json";
import EvMasterView from "pages/ev/ev-master/EvMasterView";
import {
    decarbReducer
} from "store/scopeThree/track/decarb/decarbSlice";
import {
    sustainableReducer
} from "store/sustain/sustainSlice";
import { laneDetailsReducer } from "store/scopeThree/track/lane/laneDetailsSlice";
jest.mock("../../../../store/redux.hooks", () => ({
    ...jest.requireActual("../../../../store/redux.hooks"),
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


describe("test Ev Master View ", () => {
    let useDispatchMock: jest.Mock;
    let useSelectorMock: jest.Mock;
    let stores: EnhancedStore;
    const navigate = jest.fn();
    const mockDispatch = jest.fn();

    beforeEach(() => {
        stores = configureStore({
            reducer: {
                decarb: decarbReducer?.reducer,
                auth: authDataReducer.reducer,
                sustain: sustainableReducer?.reducer,
                lane: laneDetailsReducer?.reducer,
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

    const renderEvMasterView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <EvMasterView />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };


    //section id.....
    it(`<section> test case for whole page `, async () => {
        useSelectorMock.mockReturnValue({
            configConstants: {
                data: { optimus_radius: 10 },
            },
            evFilterData: {
                data: {
                    "start_date": "2022-12-26",
                    "end_date": "2024-12-16",
                    "scac": ""
                }
            },
            masterCarrierData: {
                data: masterCarrierMockData
            }

        });
        await renderEvMasterView();
        expect(screen.getByTestId("EvMasterView")).toBeInTheDocument();
    });
    it(`test case for carrier dropdown.`, async () => {
        useSelectorMock.mockReturnValue({
            listOfCarriers: {
                data: listOfCarriers,
            },
        });
        await renderEvMasterView()

        const carrierDropDown = screen.getByLabelText("carrier-dropdown");
        expect(carrierDropDown).toBeInTheDocument();
        fireEvent.click(carrierDropDown);


    });
    it(`test case for view detail .`, async () => {
        useSelectorMock.mockReturnValue({
            countryListData: {data:[{
                country_name:"All",
                country_code: "all"
            }]},
            listOfCarriers: {
                data: listOfCarriers,
            },
            configConstants: {data: {ev_dashboard_default_country: "all" }}
        });
        await renderEvMasterView()
        const carrierDropDown = screen.getByLabelText("carrier-dropdown");
        expect(carrierDropDown).toBeInTheDocument();
        await userEvent.click(carrierDropDown);

        const carrierOption = await screen.findByText("Schneider");
        await userEvent.click(carrierOption);

        const viewLaneBtn = screen.getByTestId("view-details");
        expect(viewLaneBtn).toBeInTheDocument();
        await fireEvent.click(viewLaneBtn);
        expect(navigate).toHaveBeenCalledWith(`/scope3/ev-dashboard/SCNN/all`);
    });

    it(`test case for change carrier detail .`, async () => {
        useSelectorMock.mockReturnValue({
            listOfCarriers: {
                data: listOfCarriers,
            },
        });
        await renderEvMasterView()
        const carrierDropDown = screen.getByLabelText("multi-carrier-dropdown");
        expect(carrierDropDown).toBeInTheDocument();
        userEvent.click(carrierDropDown);

        const viewLaneBtn = screen.getByTestId("change-carrier-detail-0");
        expect(viewLaneBtn).toBeInTheDocument();

        const carrierOption = await screen.findAllByText("Schneider");
        userEvent.click(carrierOption[0]);
        fireEvent.click(viewLaneBtn);

        act(() => {
            userEvent.click(carrierDropDown);
        })
        // const carrierOption2 = await screen.findAllByText("CH Robinson");
        // userEvent.click(carrierOption2[0]);
        // fireEvent.click(viewLaneBtn);

    });

});
