// Impo
import { authDataReducer } from "store/auth/authDataSlice";
import { BucketFileUpload } from "pages/bucket/fileUpload/BucketFileUpload";
import {
  act,
  render,
  cleanup,
  screen,
  fireEvent,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import * as reactRedux from "react-redux";
import * as router from "react-router-dom";
import * as utils from "store/redux.hooks";
import * as tem from "auth/ProtectedRoute";
import { authMockData } from "mockData/commonMockData.json";


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

describe("test lane view for business overview ", () => {
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

  const renderBucketFileUploadView = async () => {
    return await act(async () => {
      render(
        <reactRedux.Provider store={stores}>
          <router.MemoryRouter>
            <BucketFileUpload />
          </router.MemoryRouter>
        </reactRedux.Provider>
      );
    });
  };

  //section id.....
  it(`<section> test case for Bucket File Upload view page `, async () => {
    await renderBucketFileUploadView();
    expect(screen.getByTestId("bucket-upload")).toBeInTheDocument();
  });

  it(`<section> test case for Bucket File Upload view page `, async () => {

    await renderBucketFileUploadView();
    expect(screen.getByTestId("bucket-upload")).toBeInTheDocument();

    const fileInput = screen.getByTestId("file-input-list");
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute("type", "file");


    const file = new File(["dummy content"], "test.txt", { type: "text/plain" });
    Object.defineProperty(fileInput, "files", { value: [file] });

    fireEvent.change(fileInput);

    const uploadButton = screen.getByTestId('file-explorer');
    expect(uploadButton).toBeInTheDocument();
    userEvent.click(uploadButton);

  });

  it(`<section> test case for Bucket File Upload view page `, async () => {

    useSelectorMock.mockReturnValue({
      bucketFileUpload: {
        status: 201,
        data: {
          message: "File uploaded successfully",
        }
      },
    });
    await renderBucketFileUploadView();
    expect(screen.getByTestId("bucket-upload")).toBeInTheDocument();

  });
  it(`<section> test case for Bucket File Upload view page `, async () => {

    useSelectorMock.mockReturnValue({
      bucketFileUpload: {
        status: 400,
        data: {
          message: "File uploaded fail",
        }
      },
    });
    await renderBucketFileUploadView();
    expect(screen.getByTestId("bucket-upload")).toBeInTheDocument();

    const fileInput = screen.getByTestId("file-input-list");
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute("type", "file");

    const validFile = new File(["dummy content"], "image.csv", {
      type: "csv",
    });

    // Simulate a change event with a valid file
    fireEvent.change(fileInput as HTMLInputElement, { target: { files: [validFile] } });

  });
  it(`<section> test case for Bucket File Upload Logout`, async () => {
    await renderBucketFileUploadView();
    expect(screen.getByTestId("bucket-upload")).toBeInTheDocument();

    const logoutButton = screen.getByTestId('logout');
    expect(logoutButton).toBeInTheDocument();
    userEvent.click(logoutButton);

  });

})