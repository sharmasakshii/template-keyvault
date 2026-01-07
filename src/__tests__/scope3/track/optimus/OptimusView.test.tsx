
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
import { authMockData, yearMockData } from "mockData/commonMockData.json";
import { authDataReducer } from "store/auth/authDataSlice";
import {
    laneMockDestinationData,
    laneMockOriginData,
    optimusLanesMockData,
} from "mockData/laneMockData.json";
import OptimusView from "pages/optimus/OptimusView";

import {
    decarbReducer, getOptimusLanes
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

window.HTMLElement.prototype.scrollIntoView = jest.fn();


describe("test Optimus view ", () => {
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

    const renderOptimusView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <OptimusView />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };


    //section id.....
    it(`<section> test case for whole page `, async () => {
        // mockCommonData();
        useSelectorMock.mockReturnValue({
            configConstants: {
                data: { optimus_radius: 10 },
            },
            optimusLanesData: {
                data: {
                    data: [{
                        "origin": "OSHKOSH, WI, 54904",
                        "destination": "SMYRNA, TN, 37167",
                        "distance": 1063.07,
                        "id": 282196
                    }, {
                        "origin": "Os, WI, 54904",
                        "destination": "test, TN, 37167",
                        "distance": 1063.07,
                        "id": 282199
                    }],
                }
            },
            fuelStopListDto: {
                data: [{
                    "id": 1,
                    "name": "Conventional diesel",
                    "code": "PD"
                }]
            },
            checkLaneFuelData: {
                data: {
                    results: [{ isValid: 1 }]
                },
            }


        });
        await renderOptimusView();
        expect(screen.getByTestId("OptimusView")).toBeInTheDocument();

        // expect(screen.getByTestId("threshold-input-0")).toBeInTheDocument();
        // fireEvent.change(screen.getByTestId("threshold-input-0"), { target: { value: "50" } });
        // fireEvent.blur(screen.getByTestId("threshold-input-0"));


    });


    
    //section id.....
    it(`<section> test case for whole page `, async () => {
        // mockCommonData();
        useSelectorMock.mockReturnValue({
            configConstants: {
                data: { optimus_radius: 10 },
            },
            optimusLanesData: {
                data: {
                    data: [{
                        "origin": "OSHKOSH, WI, 54904",
                        "destination": "SMYRNA, TN, 37167",
                        "distance": 1063.07,
                        "id": 282196
                    }],
                }
            },
            fuelStopListDto: {
                data: [{
                    "id": 1,
                    "name": "Conventional diesel",
                    "code": "PD"
                }]
            },
            checkLaneFuelData: {
                data: {
                    results: [{ isValid: 1 }]
                },
            }


        });
        await renderOptimusView();
        expect(screen.getByTestId("OptimusView")).toBeInTheDocument();

        // expect(screen.getByTestId("threshold-input-0")).toBeInTheDocument();
        // fireEvent.change(screen.getByTestId("threshold-input-0"), { target: { value: "" } });
        // fireEvent.blur(screen.getByTestId("threshold-input-0"));


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
        await renderOptimusView()
        const viewLaneBtn = screen.getByTestId("apply-button");
        expect(viewLaneBtn).toBeInTheDocument();
        fireEvent.click(viewLaneBtn);
    });

    it(`test case for reset button .`, async () => {
        useSelectorMock.mockReturnValue({
            laneOriginData: {
                data: laneMockOriginData,
            },

            laneDestinationData: {
                data: laneMockDestinationData,
            },
        });
        await renderOptimusView()
        const viewLaneBtn = screen.getByTestId("reset-button");
        expect(viewLaneBtn).toBeInTheDocument();
        fireEvent.click(viewLaneBtn);
    });

    //pagination
    it(`pagination dropdown`, async () => {
        useSelectorMock.mockReturnValue({
            optimusLanesData: {
                data: optimusLanesMockData?.data,
            },
            configConstants: {
                data: { optimus_radius: 10 },
            }
        });
        await renderOptimusView();

        expect(screen.getByLabelText("pagination-dropdown")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("pagination-dropdown"));

        const paginationData = await screen.findByText("50");
        await act(async () => {
            userEvent.click(paginationData);
        });

        const viewLaneBtn = screen.getByTestId("view-map-0");
        expect(viewLaneBtn).toBeInTheDocument();
        fireEvent.click(viewLaneBtn);

        const anchorElement = screen.getByRole('button', { name: '2' });
        expect(anchorElement).toBeInTheDocument();
        fireEvent.click(anchorElement);

        // const paginationData = await screen.findByText("10");
        // await act(async () => {
        //     userEvent.click(paginationData);
        // });
    });


});
