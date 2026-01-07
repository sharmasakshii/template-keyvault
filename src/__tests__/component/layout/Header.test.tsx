
import {
  act,
  cleanup,
  render,
  screen,
} from "@testing-library/react";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import * as router from "react-router-dom";

import * as reactRedux from "react-redux";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import { authMockData, authPMockData } from "mockData/commonMockData.json";
import { authDataReducer } from "store/auth/authDataSlice";
import { evNetworkListMockData } from "mockData/evMockData.json";
import Header from 'component/layouts/header';
import userEvent from "@testing-library/user-event";
import {
  laneMockDestinationData,
  laneMockOriginData,
} from "mockData/laneMockData.json";

window.HTMLElement.prototype.scrollIntoView = jest.fn();

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

describe("test Division view ", () => {
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

  const renderHeader = async () => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <Header />
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };

  //section id.....
  it(`<section> test case for whole page `, async () => {
    await renderHeader();
    expect(screen.getByTestId("header-layout")).toBeInTheDocument();

    const openSidebar = screen.getByTestId('open-sidebar');
    expect(openSidebar).toBeInTheDocument();
    userEvent.click(openSidebar);


  });

  it(`test case for apply button .`, async () => {
    useSelectorMock.mockReturnValue({
      isLoadingNotification: true,
      loginDetails: {
        data: authMockData?.userdata
      },
    });
    await renderHeader();
    const notificationIcon = screen.getByTestId("notification-icon");
    expect(notificationIcon).toBeInTheDocument();
    userEvent.click(notificationIcon);

    const scope1 = screen.getByTestId("scope-1");
    expect(scope1).toBeInTheDocument();
    userEvent.click(scope1);

    const scope2 = screen.getByTestId("scope-2");
    expect(scope2).toBeInTheDocument();
    userEvent.click(scope2);

    const notificationDropdown = screen.getByTestId("notification-dropdown");
    expect(notificationDropdown).toBeInTheDocument();
    userEvent.click(notificationDropdown);
    userEvent.click(notificationDropdown);

    const notificationCaret = screen.getByTestId("notification-caret");
    expect(notificationCaret).toBeInTheDocument();
    userEvent.click(notificationCaret);


  });


  it(`test case for notification Detail .`, async () => {
    useSelectorMock.mockReturnValue({
      isLoadingNotification: false,
      notificationDetail: {
        data: [{
          id: 1,
          description: "description",
          created_on: "2023-01-01",
        }],
      },
    });
    await renderHeader();
  });

  it(`test case for notification Detail .`, async () => {
    useSelectorMock.mockReturnValue({
      loginDetails: {
        data: authPMockData?.userdata
      },
    });
    await renderHeader();

    const scope1 = screen.getByTestId("scope-1");
    expect(scope1).toBeInTheDocument();
    userEvent.click(scope1);

  });

});
