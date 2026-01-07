// Import necessary modules and components
import UserManagementView from "../../../pages/userManagement/UserManagementView";
import { authDataReducer } from "store/auth/authDataSlice";
import { commonDataReducer } from "store/commonData/commonSlice";
import {
  act,
  render,
  cleanup,
  screen,
  fireEvent,
} from "@testing-library/react";
import * as reactRedux from "react-redux";
import * as router from "react-router-dom";
import {
  authMockData,
  regionMockdata,
  roleMockData,
} from "mockData/commonMockData.json";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import userEvent from "@testing-library/user-event";
import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { userSettingReducer } from "store/user/userSlice";
import EditUserView from "pages/userManagement/editUser/EditUserView";
import { editUserMockData } from "mockData/usermanagementMockData.json";


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

describe("test lane view for user management ", () => {
  let useDispatchMock: jest.Mock;
  let useSelectorMock: jest.Mock;
  let stores: EnhancedStore;
  const navigate = jest.fn();

  beforeEach(() => {
    stores = configureStore({
      reducer: {
        user: userSettingReducer?.reducer,
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

  const renderEditUserView = async () => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <EditUserView />
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };

  //section id for user management view page
  it(`<section> test case for edit user view page `, async () => {
    useSelectorMock.mockReturnValue({
      singleUserDetail: {
        data: editUserMockData,
      },
    }),
      await renderEditUserView();
    expect(screen.getByTestId("user-management-list-view")).toBeInTheDocument();
  });

  //regin selectable dropdown for edit user page
  it(`region dropdown for edit user view page`, async () => {
    useSelectorMock.mockReturnValue({
      regions: {
        data: regionMockdata,
      },
    });
    await renderEditUserView();
    expect(screen.getByLabelText("regions-data-dropdown-edit-user")).toBeInTheDocument();
    await act(async () => {
      userEvent.click(screen.getByLabelText("regions-data-dropdown-edit-user"));
    });
    const regionData = await screen.findByText("R1");
    userEvent.click(regionData);
  });

  //role selectable dropdown for edit user page
  it(`region dropdown for edit user view page`, async () => {
    useSelectorMock.mockReturnValue({
      userRoleList: {
        data: roleMockData,
      },
    });
    await renderEditUserView();
    expect(screen.getByLabelText("role-user")).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByLabelText("role-user"));
    });
    const roleData = await screen.findByText("Sustainable");
    await userEvent.click(roleData);
  });

  //status dropdown
  it(`status selectable dropdown for edit user`, async () => {
    useSelectorMock.mockReturnValue({
      singleUserDetail: {
        data: editUserMockData,
      },
      regions: {
        data: regionMockdata,
      },
    });

    await renderEditUserView();
    expect(screen.getByLabelText("status-dropdown-edit-user")).toBeInTheDocument();
    await act(async () => {
      userEvent.click(screen.getByLabelText("status-dropdown-edit-user"));
    });
    await act(async () => {

      userEvent.click(screen.getAllByText("Activate")[0]);
    })

    const userPasswordCancelElement = screen.getByTestId(
      "user-password-cancel-btn"
    );
    userEvent.click(userPasswordCancelElement);

    await act(async () => {
      userEvent.click(screen.getByLabelText("status-dropdown-edit-user"));
    });

    await act(async () => {
      userEvent.click(screen.getAllByText("Activate")[0]);
    });


    const userPasswordConfirmElement = screen.getByTestId(
      "user-password-confirm-btn"
    );
    userEvent.click(userPasswordConfirmElement);


  });

  //delete user of edit user page
  it(`user delete test case for user list view page`, async () => {
    useSelectorMock.mockReturnValue({
      isUserListLoading: false,
      singleUserDetail: {
        data: editUserMockData,
      },
    });
    await renderEditUserView();
    expect(screen.getByTestId("btn-delete-id")).toBeInTheDocument();
    await act(async () => {
      userEvent.click(screen.getByTestId("btn-delete-id"));
    })

    const userPasswordConfirmElement = screen.getByTestId(
      "user-password-confirm-btn"
    );
    userEvent.click(userPasswordConfirmElement);

  });

  //input fileds in edit user page
  it(`input fileds of edit user page`, async () => {
    useSelectorMock.mockReturnValue({
      singleUserDetail: {
        data: editUserMockData,
      },
      regions: {
        data: regionMockdata,
      },
    });
    await renderEditUserView();
    expect(screen.getByTestId("edit-user-fields")).toBeInTheDocument();

    const firstName = screen.getByTestId('first_name');
    expect(firstName).toBeInTheDocument();
    // Simulate user typing in the input field
    fireEvent.keyDown(firstName, { target: { value: 'Admin' } })
    fireEvent.change(firstName, { target: { value: 'Admin' } });


    const lastName = screen.getByTestId('last_name');
    expect(lastName).toBeInTheDocument();
    // Simulate user typing in the input field
    fireEvent.keyDown(lastName, { target: { value: 'Admin' } })
    fireEvent.change(lastName, { target: { value: 'Admin' } });

    const phone = screen.getByTestId('phone');
    expect(phone).toBeInTheDocument();
    // Simulate user typing in the input field
    fireEvent.keyDown(phone, { target: { value: '9999999999' } })
    fireEvent.change(phone, { target: { value: '9999999999' } });

    await act(async () => {
      await userEvent.click(screen.getByTestId("update-btn"));
    });
    await act(async () => {
      await userEvent.click(screen.getByTestId("cancel-btn"));
    });
  })

  it(`input fileds of edit user page`, async () => {
    useSelectorMock.mockReturnValue({
      singleUserDetail: {
        data: editUserMockData,
      },
      regions: {
        data: regionMockdata,
      },
    });
    await renderEditUserView();
    expect(screen.getByTestId("edit-user-fields")).toBeInTheDocument();

    const password = screen.getByTestId('password');
    expect(password).toBeInTheDocument();
    // Simulate user typing in the input field
    await act(async () => {

      fireEvent.change(password, { target: { value: 'Mind@1234' } })
    });

    await act(async () => {
      userEvent.click(screen.getByTestId("update-btn"));
    });
  })
});


