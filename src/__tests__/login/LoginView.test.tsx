// Import necessary modules and components
import authService from "../../store/auth/authService";
import { ApiTest, TestFullFilledSlice, TestSliceMethod } from "../../commonCase/ReduxCases";

import {
  cleanup,
  fireEvent,
  render,
  screen,
  act,
} from "@testing-library/react";
import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import * as reactRedux from "react-redux";
import * as router from "react-router-dom";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import {
  authDataReducer, loginPost, resetAuth, initialState, resetStore,
  updateAuthStore,
  updateScopeType,
  applicationType,
  setRegionalId,
  setDivisionId,
  resendOtpPost,
  bucketLogin,
  otpPost
} from "store/auth/authDataSlice";
import LoginView from "pages/login/LoginView";
import { loginMockData } from "../../mockData/loginMockData.json";
import { nodeUrl } from "constant";
import userEvent from "@testing-library/user-event";
import store from "store";

jest.mock('lottie-react', () => () => <div data-testid="mock-lottie" />);

// Payload for fetching table data
const authLoginPostDataPayload = {
  "email": process.env.REACT_APP_DUMMY_EMAIL,
  "password": process.env.REACT_APP_DUMMY_PASSWORD
}
// Configuration for fetching table data using Redux
const authLoginPostDataObject = {
  service: authService,
  serviceName: "authLoginPost",
  sliceName: "loginPost",
  sliceImport: loginPost,
  data: authLoginPostDataPayload,
  reducerName: authDataReducer,
  loadingState: "isAuthLoginLoading",
  isSuccess: "isSuccess",
  actualState: "loginDetails",
};

// Configuration for API testing of fetching table data
const authLoginPostApiTestData = {
  serviceName: "authLoginPost",
  method: "post",
  data: authLoginPostDataPayload,
  serviceImport: authService,
  route: `${nodeUrl}login-user-access`,
};


// Configuration for fetching table data using Redux
const resendOtpPostDataObject = {
  service: authService,
  serviceName: "resendPostOtp",
  sliceName: "resendOtpPost",
  sliceImport: resendOtpPost,
  data: {},
  reducerName: authDataReducer,
  loadingState: "isOtpVerifyLoading",
  actualState: "resendOtpPostDto",
};

// Configuration for API testing of fetching table data
const resendOtpPostApiTestData = {
  serviceName: "resendPostOtp",
  method: "post",
  data: {},
  serviceImport: authService,
  route: `${nodeUrl}resendOtp`,
};


// Configuration for fetching table data using Redux
const bucketLoginDataObject = {
  service: authService,
  serviceName: "bucketLoginPost",
  sliceName: "bucketLogin",
  sliceImport: bucketLogin,
  data: {},
  reducerName: authDataReducer,
  loadingState: "bucketLoginLoading",
  actualState: "bucketLoginDetails",
};

// Configuration for API testing of fetching table data
const bucketLoginApiTestData = {
  serviceName: "bucketLoginPost",
  method: "post",
  data: {},
  serviceImport: authService,
  route: `${nodeUrl}blob-login`,
};

// Configuration for fetching table data using Redux
const otpPostDataObject = {
  service: authService,
  serviceName: "authPostOtp",
  sliceName: "otpPost",
  sliceImport: otpPost,
  data: {},
  reducerName: authDataReducer,
  loadingState: "isOtpVerifyLoading",
  actualState: "loginDetails",
};

// Configuration for API testing of fetching table data
const otpPostApiTestData = {
  serviceName: "authPostOtp",
  method: "post",
  data: {},
  serviceImport: authService,
  route: `${nodeUrl}verifyOTP`,
};



// Execute Redux slice tests for table data
TestFullFilledSlice({
  data: [authLoginPostDataObject, resendOtpPostDataObject,
    bucketLoginDataObject, otpPostDataObject]
});

// Execute API test for table data
ApiTest({ data: [authLoginPostApiTestData, resendOtpPostApiTestData, bucketLoginApiTestData, otpPostApiTestData] });

TestSliceMethod({
  data: [authLoginPostDataObject, resendOtpPostDataObject, bucketLoginDataObject,
    otpPostDataObject]
});

// Test case initialState
describe('initial reducer', () => {
  it('should reset state to initialState when resetScopeOneCommonData is called', () => {
    const modifiedState: any = {
      data: [{ id: 1, value: 'test' }],
      loading: true,
      error: 'Something went wrong',
    };

    const result = authDataReducer.reducer(modifiedState, resetAuth());

    expect(result).toEqual(initialState);


  });
});


describe("resetStore Thunk", () => {
  it("should return the correct status when dispatched", async () => {
    await store.dispatch(resetStore());
  });
});

describe("open sidebar Thunk", () => {
  it("should return the correct status when dispatched", async () => {
    const status = 1;
    // Dispatch the thunk action
    const result = await store.dispatch(setDivisionId(status));
    expect(result.payload).toBe(status);
  });
});

describe("open sidebar Thunk", () => {
  it("should return the correct status when dispatched", async () => {
    const status = 1;
    // Dispatch the thunk action
    const result = await store.dispatch(setRegionalId(status));
    expect(result.payload).toBe(status);
  });
});

describe("open sidebar Thunk", () => {
  it("should return the correct status when dispatched", async () => {
    const status = "admin";
    // Dispatch the thunk action
    const result = await store.dispatch(applicationType("admin"));
    expect(result.payload).toBe(status);
  });
});

describe("open sidebar Thunk", () => {
  it("should return the correct status when dispatched", async () => {
    const status = true;
    // Dispatch the thunk action
    const result = await store.dispatch(updateScopeType(status));
    expect(result.payload).toBe(status);
  });
});

describe("open sidebar Thunk", () => {
  it("should return the correct status when dispatched", async () => {
    const status = true;
    // Dispatch the thunk action
    const result = await store.dispatch(updateAuthStore(status));
    expect(result.payload).toBe(status);
  });
});




jest.mock("formik", () => ({
  ...jest.requireActual("formik"),
  useFormikContext: jest.fn(),
}));

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

describe("testcases for login page", () => {
  let useDispatchMock: jest.Mock;
  let useSelectorMock: jest.Mock;
  let stores: EnhancedStore;
  // let useNavigateMock:jest.Mock;

  const navigate = jest.fn();

  const componentRender = async () => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <LoginView />
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };

  beforeEach(() => {
    stores = configureStore({
      reducer: {
        auth: authDataReducer.reducer,
      },
    });

    jest
      .spyOn(router, "useNavigate")
      .mockImplementation(() => navigate) as jest.Mock;
    useSelectorMock = jest.spyOn(utils, "useAppSelector") as jest.Mock;
    useDispatchMock = jest.spyOn(utils, "useAppDispatch") as jest.Mock;
    useSelectorMock.mockReturnValue({
      isAuthLoginLoading: false,
      isSuccess: false,
      isOtpVerifyLoading: "",
      isOtp: "",
    });

    let auth = jest.spyOn(tem, "useAuth") as jest.Mock;
    auth.mockReturnValue("");
    const mockDispatch = jest.fn();
    useDispatchMock.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    cleanup();
  });

  it(`<section> test case for whole page and expect to the map`, async () => {
    await componentRender();
    expect(screen.getByTestId("view-login")).toBeInTheDocument();

    expect(screen.getByTestId("left-map")).toBeInTheDocument();
  });

  it(`handles input email change correctly`, async () => {
    await componentRender();

    const loginEmail = screen.getByTestId("login-email");
    await act(async () => {
      fireEvent.change(loginEmail, { target: { value: "test@gmail.com" } });
    });
    expect(loginEmail.getAttribute("value")).toBe("test@gmail.com");
  });

  it(`handles input password change correctly`, async () => {
    await componentRender();

    const passwordInput = screen.getByTestId("login-password");
    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: "12345" } });
    });
    expect(passwordInput.getAttribute("value")).toBe("12345");
    expect(passwordInput.getAttribute("type")).toBe("password");

    const passwordIcon = screen.getByTestId("password-icon");
    await act(async () => {
      fireEvent.click(passwordIcon);
    });
    expect(passwordInput.getAttribute("type")).toBe("text");
  });

  it("click on login button and  showing error if email and password is not fill then show error ", async () => {
    await componentRender();

    const loginButton = screen.getByTestId("login_btn");
    await act(async () => {
      fireEvent.click(loginButton);
    });

    expect(screen.getByTestId("error-email")).toBeInTheDocument();
    expect(screen.getByTestId("error-password")).toBeInTheDocument();
  });


  it("click on login button and show popup ", async () => {

    await componentRender();

    const loginEmail = screen.getByTestId("login-email");
    await act(async () => {
      fireEvent.change(loginEmail, { target: { value: "chris.cassell@lowes.com" } });
    });

    const passwordInput = screen.getByTestId("login-password");
    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: "Mind@1234" } });
    });

    const loginButton = screen.getByTestId("login_btn");
    await act(async () => {
      fireEvent.click(loginButton);
    });
    useSelectorMock.mockReturnValue({
      isAuthLoginLoading: true,
    });

    await componentRender();

    expect(screen.getByTestId("login-spinner")).toBeInTheDocument()

    useSelectorMock.mockReturnValue({
      isAuthLoginLoading: false,
      isSuccess: true,
      loginDetails: loginMockData
    });
    await componentRender();

    // expect(screen.getByTestId("sustain-view")).toBeInTheDocument();


    //  expect(navigate).toHaveBeenCalledWith("/sustainable");

  })

  // expect(screen.getByTestId("authentication-modal")).toBeInTheDocument();

  // const otpInput= screen.getByTestId("otp-input")

  // await act(async()=>{
  //   fireEvent.change(otpInput, {target : {value: "123456"}})
  // })
  // expect(otpInput.getAttribute("value")).toBe("123456")


  it("close modal ", async () => {
    useSelectorMock.mockReturnValue({
      isSuccess: true,
      isOtp: true,
    });

    await componentRender();
    const closeButton = screen.getByRole("button", { name: /close/i });
    userEvent.click(closeButton);
  });

  it("close modal ", async () => {
    useSelectorMock.mockReturnValue({
      isSuccess: true,
      isOtp: true,
      isOtpVerifyLoading: true
    });

    await componentRender();

  });


});
