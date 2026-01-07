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
import {
  userListMockData,
} from "mockData/usermanagementMockData.json";

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

  const renderUserManagementView = async () => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <UserManagementView />
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };

  //section id for user management view page
  it(`<section> test case for user-management view page `, async () => {
    await renderUserManagementView();
    expect(screen.getByTestId("user-management-view")).toBeInTheDocument();
  });

  //section id for user list view page
  it(`<section> test case for user list view page`, async () => {
    useSelectorMock.mockReturnValue({
      isUserListLoading: false,
      userList: {
        data: userListMockData,
      },
    });
    await renderUserManagementView();
    expect(screen.getByTestId("user-list-id")).toBeInTheDocument();
  });


  //test case for empty list
  it(`empty list test case for user user management page`, async () => {
    useSelectorMock.mockReturnValue({
      userList: {
        data: { pagination: { total_count: 0 } },
      },
    });
    await renderUserManagementView();
    expect(screen.getByTestId("user-list-empty")).toBeInTheDocument();
    expect(screen.getByTestId("role-management-btn")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId(`role-management-btn`));
    expect(navigate).toHaveBeenCalledWith("/role-management");
  });

  //test case for add new user button/add user modal
  it(`add new user button for add user modal`, async () => {
    useSelectorMock.mockReturnValue({
      userList: {
        data: { pagination: { total_count: 0 } },
      },
      regions: {
        data: regionMockdata,
      },
      userRoleList: {
        data: roleMockData,
      },
      selectedRoleDto: {
        id: 1,
        name: "Sustainable"
      }
    });
    await renderUserManagementView();
    await fireEvent.click(screen.getByTestId(`add-new-user-btn`));
    expect(screen.getByTestId("add-user-modal")).toBeInTheDocument();

    await act(async () => {
      userEvent.click(screen.getByTestId("cancel-btn"));
    });
    await act(async () => {
      userEvent.click(screen.getByTestId("add-new-user-btn"));
    });

    const phone = screen.getByTestId('phone_number');
    expect(phone).toBeInTheDocument();
    // Simulate user typing in the input field
    fireEvent.change(phone, { target: { value: '999' } });


    await act(async () => {
      await userEvent.click(screen.getByTestId("submit-btn"));
    });

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

    // Simulate user typing in the input field
    fireEvent.keyDown(phone, { target: { value: '9999999999' } })
    fireEvent.change(phone, { target: { value: '9999999999' } });

    const emailAddress = screen.getByTestId('email_address');
    expect(emailAddress).toBeInTheDocument();
    // Simulate user typing in the input field
    fireEvent.keyDown(emailAddress, { target: { value: 'demo@yopmail.com' } })
    fireEvent.change(emailAddress, { target: { value: 'demo@yopmail.com' } });


    const passwordField = screen.getByTestId('password_field');
    expect(passwordField).toBeInTheDocument();
    // Simulate user typing in the input field
    fireEvent.keyDown(passwordField, { target: { value: 'Mind@123' } })
    fireEvent.change(passwordField, { target: { value: 'Mind@123' } });


    await act(async () => {
      await userEvent.click(screen.getByTestId("submit-btn"));
    });

    expect(screen.getByLabelText("regions-data-dropdown-add-user")).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText("regions-data-dropdown-add-user"));
    const regionData = await screen.findByText("R1");
    await userEvent.click(regionData);
    expect(screen.getByLabelText("role-user")).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText("role-user"));
    const roleData = await screen.findByText("Sustainable");
    userEvent.click(roleData);

    await act(async () => {
      await userEvent.click(screen.getByTestId("submit-btn"));
    });


  });

  //test case for add new user button/add user modal
  it(`add new user button for add user modal`, async () => {
    useSelectorMock.mockReturnValue({
      userList: {
        data: { pagination: { total_count: 0 } },
      },

    });
    await renderUserManagementView();
    await fireEvent.click(screen.getByTestId(`add-new-user-btn`));
    expect(screen.getByTestId("add-user-modal")).toBeInTheDocument();
    expect(screen.getByTestId("first_name")).toBeInTheDocument();
    act(() => {
      fireEvent.keyDown(screen.getByTestId("first_name"));
    });
    expect(screen.getByTestId("email_address")).toBeInTheDocument();
    expect(screen.getByTestId("last_name")).toBeInTheDocument();
    act(() => {
      fireEvent.keyDown(screen.getByTestId("last_name"));
    });
    expect(screen.getByTestId("phone_number")).toBeInTheDocument();
    expect(screen.getByTestId("password_field")).toBeInTheDocument();


  });


  //delete id of user list table data
  it(`user delete test case for user list view page`, async () => {
    useSelectorMock.mockReturnValue({
      isUserListLoading: false,
      userList: {
        data: userListMockData,
      },
    });
    await renderUserManagementView();
    expect(screen.getByTestId("table-select-id")).toBeInTheDocument();
    const costCheckBox = screen.getByTestId(
      "table-select-id"
    ) as HTMLInputElement;
    fireEvent.click(costCheckBox);
    expect(costCheckBox.checked).toBe(true);
    expect(screen.getByTestId("btn-delete-id")).toBeInTheDocument();
    await act(async () => {
      userEvent.click(screen.getByTestId("btn-delete-id"));
    })
  });

  //user table search user name
  it(`user table filters for search user table data`, async () => {
    useSelectorMock.mockReturnValue({
      isUserListLoading: false,
      userList: {
        data: userListMockData,
      },

    });
    await renderUserManagementView();
    expect(screen.getByTestId("search-user-filter")).toBeInTheDocument();
  });

  //    advance search fields  for user table
  it(`advance search fields  for user table`, async () => {
    useSelectorMock.mockReturnValue({
      userList: {
        data: userListMockData,
      },
      userRoleList: {
        data: roleMockData
      },
    });
    await renderUserManagementView();
    expect(screen.getByTestId("Advanced-Search")).toBeInTheDocument();
    expect(screen.getByTestId("Advanced-Search-fields")).toBeInTheDocument();
    expect(screen.getByLabelText("role-user")).toBeInTheDocument();
    await act(async () => {
      userEvent.click(screen.getByLabelText("role-user"));
    })
    const roleData = await screen.findByText("Sustainable");
    userEvent.click(roleData);
    expect(screen.getByTestId("search-fliter-name")).toBeInTheDocument();
    expect(screen.getByTestId("search-start-date")).toBeInTheDocument();
    await act(async () => {
      await fireEvent.change(screen.getByTestId('search-start-date'), { target: { value: '2024-02-29' } });
    });
    expect(screen.getByTestId("search-end-date")).toBeInTheDocument();
    await act(async () => {
      await fireEvent.change(screen.getByTestId('search-end-date'), { target: { value: '2024-02-29' } });
    });
    expect(screen.getByTestId("search-email-address")).toBeInTheDocument();
    expect(screen.getByLabelText("search-status")).toBeInTheDocument();
    await act(async () => {
      const searchName = screen.getByTestId('search-fliter-name');
      await userEvent.type(searchName, '10');
    });
    await act(async () => {
      const searchName = screen.getByTestId('search-start-date');
      await userEvent.type(searchName, '10');
    });
    await act(async () => {
      const searchName = screen.getByTestId('search-end-date');
      await userEvent.type(searchName, '10');
    });
    await act(async () => {
      const searchName = screen.getByTestId('search-email-address');
      await userEvent.type(searchName, '10');
    });
    await act(async () => {
      await userEvent.click(screen.getByTestId("submit-search-fields"));
    });
    await act(async () => {
      await userEvent.click(screen.getByTestId("reset-form"));
    });
  }, 10000);

  // button of  add user and create role
  it(`add user and create role button of table`, async () => {
    useSelectorMock.mockReturnValue({
      userList: {
        data: userListMockData
      },
    });
    await renderUserManagementView();
    expect(screen.getByTestId("add-user-id")).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByTestId("add-user-id"));
    });
    expect(screen.getByTestId("create-role-user")).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByTestId("create-role-user"));
    });
    expect(navigate).toHaveBeenCalledWith("/role-management/create-role");
  })


  // change order by clicking on table headings
  it(`arrow buttons in table heading for sorting for user management`, async () => {
    useSelectorMock.mockReturnValue({
      userList: {
        data: userListMockData,
      },
    });
    await renderUserManagementView();
    expect(screen.getByTestId("change-order-name-user")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("change-order-name-user"));
    expect(
      screen.getByTestId("change-order-createdAt-user")
    ).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByTestId("change-order-createdAt-user"));
    });
    expect(screen.getByTestId("change-order-role-user")).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByTestId("change-order-role-user"));
    });
    expect(screen.getByTestId("change-order-email-user")).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByTestId("change-order-email-user"));
    });
    expect(screen.getByTestId("change-order-status-user")).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByTestId("change-order-status-user"));
    });
  }, 2000);

  //multi select user delete for table ids
  it(`multi select delete checkbox for table`, async () => {
    useSelectorMock.mockReturnValue({
      userList: { data: userListMockData },
    });
    await renderUserManagementView();
    userListMockData?.list.forEach((ele, index) => {
      expect(screen.getByTestId(`multi-select-checkbox ${index}`)).toBeInTheDocument();
      expect(screen.getByTestId(`multi-select-field ${index}`)).toBeInTheDocument();
      fireEvent.change(screen.getByTestId(`multi-select-field ${index}`), {
        target: { checked: true } // You can adjust the checked state as needed
      });
    });
  })

  //user table buttons
  it(` action dots buttons of user table`, async () => {
    useSelectorMock.mockReturnValue({
      setShowUserDeleteModal: true,
      userList: { data: userListMockData },
    });

    await renderUserManagementView();
    userListMockData?.list.forEach((ele, index) => {
      expect(screen.getByTestId(`dots-id ${index}`)).toBeInTheDocument();
      fireEvent.click(screen.getByTestId(`dots-id ${index}`));
      fireEvent.click(screen.getByTestId(`view-details ${index}`));
      fireEvent.click(screen.getByTestId(`edit-details ${index}`));
      ele.status === 1 &&
        expect(screen.getByTestId(`status-1 ${index}`)).toBeInTheDocument();

      ele.status === 2 &&
        expect(screen.getByTestId(`status-2 ${index}`)).toBeInTheDocument();
      fireEvent.click(screen.getByTestId(`status-3 ${index}`));
    });

  });

  it(`<section> test case for pagination `, async () => {
    useSelectorMock.mockReturnValue({
      userList: { data: userListMockData },
      loginDetails: {
        data: authMockData?.userdata
      },
    });

    await renderUserManagementView();

    userEvent.click(screen.getByTestId(`handleUserGuideDownload`));

    expect(screen.getByLabelText("pagination-dropdown")).toBeInTheDocument();
    userEvent.click(screen.getByLabelText("pagination-dropdown"));

    const paginationData = await screen.findByText("50");
    await act(async () => {
      userEvent.click(paginationData);
    });

    const anchorElement = screen.getByRole('button', { name: '2' });
    expect(anchorElement).toBeInTheDocument();
    userEvent.click(anchorElement);

    const wrapper = screen.getByTestId('search-user-filter');
    expect(wrapper).toBeInTheDocument();
    const input: any = wrapper.querySelector('input');
    // const input = screen.getByTestId('role-search-input');

    expect(screen.getByTestId(`dots-id 0`)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId(`dots-id 0`));
    act(() => {
      userEvent.click(screen.getByTestId(`login_activity_0`));
    })

    const closeButton = screen.getByRole("button", { name: /close/i });
    userEvent.click(closeButton);


    // Simulate user typing in the input field
    fireEvent.change(input, { target: { value: 'AAAA' } });


  });


  it(`<section> test case for delete user `, async () => {
    useSelectorMock.mockReturnValue({
      isUserListLoading: false,
      userList: { data: userListMockData },
      loginDetails: {
        data: authMockData?.userdata
      },
    });

    await renderUserManagementView();


    expect(screen.getByTestId(`multi-select-field 0`)).toBeInTheDocument();
    userEvent.click(screen.getByTestId(`multi-select-field 0`));
    fireEvent.change(screen.getByTestId(`multi-select-field 0`), {
      target: { checked: true } // You can adjust the checked state as needed
    })
    const btnDeleteId = screen.getByTestId(`btn-delete-id`)
    expect(btnDeleteId).toBeInTheDocument();
    act(() => {
      userEvent.click(btnDeleteId);
    });

    const closeButtonDelete = screen.getByRole("button", { name: /close/i });
    userEvent.click(closeButtonDelete);

    act(() => {
      userEvent.click(btnDeleteId);
    });

    const userDeleteCancelBtn = screen.getByTestId(`user-delete-cancel-btn`)
    expect(userDeleteCancelBtn).toBeInTheDocument();
    userEvent.click(userDeleteCancelBtn);

    act(() => {
      userEvent.click(btnDeleteId);
    });

    const userDeleteConfirmBtn = screen.getByTestId(`user-delete-confirm-btn`)
    expect(userDeleteConfirmBtn).toBeInTheDocument();
    userEvent.click(userDeleteConfirmBtn);




  });

  it(`<section> test case for active user `, async () => {
    useSelectorMock.mockReturnValue({
      isUserListLoading: false,
      userList: { data: userListMockData },
      loginDetails: {
        data: authMockData?.userdata
      },
    });

    await renderUserManagementView();

    expect(screen.getByTestId(`dots-id 0`)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId(`dots-id 0`));

    expect(screen.getByTestId(`status-1 0`)).toBeInTheDocument();
    act(() => {
      userEvent.click(screen.getByTestId(`status-1 0`));
    });
    const closeButtonDelete = screen.getByRole("button", { name: /close/i });
    userEvent.click(closeButtonDelete);

    act(() => {
      userEvent.click(screen.getByTestId(`status-1 0`));
    });

    const userDeleteCancelBtn = screen.getByTestId(`user-delete-cancel-btn`)
    expect(userDeleteCancelBtn).toBeInTheDocument();
    userEvent.click(userDeleteCancelBtn);

    act(() => {
      userEvent.click(screen.getByTestId(`status-1 0`));
    });

    const userDeleteConfirmBtn = screen.getByTestId(`user-delete-confirm-btn`)
    expect(userDeleteConfirmBtn).toBeInTheDocument();
    userEvent.click(userDeleteConfirmBtn);
  });


  it(`<section> test case for deactive user `, async () => {
    useSelectorMock.mockReturnValue({
      isUserListLoading: false,
      userList: { data: userListMockData },
      loginDetails: {
        data: authMockData?.userdata
      },
    });

    await renderUserManagementView();

    expect(screen.getByTestId(`dots-id 0`)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId(`dots-id 0`));

    expect(screen.getByTestId(`status-2 1`)).toBeInTheDocument();
    act(() => {
      userEvent.click(screen.getByTestId(`status-2 1`));
    });
    const closeButtonDelete = screen.getByRole("button", { name: /close/i });
    userEvent.click(closeButtonDelete);

    act(() => {
      userEvent.click(screen.getByTestId(`status-2 1`));
    });

    const userDeleteCancelBtn = screen.getByTestId(`user-delete-cancel-btn`)
    expect(userDeleteCancelBtn).toBeInTheDocument();
    userEvent.click(userDeleteCancelBtn);

    act(() => {
      userEvent.click(screen.getByTestId(`status-2 1`));
    });

    const userDeleteConfirmBtn = screen.getByTestId(`user-delete-confirm-btn`)
    expect(userDeleteConfirmBtn).toBeInTheDocument();
    userEvent.click(userDeleteConfirmBtn);
  });

});
