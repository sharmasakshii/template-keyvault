import FileManagementView from "../pages/fileManagement/FileManagementView";
import { ApiTest, TestFullFilledSlice, TestSliceMethod } from "../commonCase/ReduxCases";
import fileService from "../store/file/fileService";
import { nodeUrl } from "constant"


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
import { authMockData } from "mockData/commonMockData.json";
import { authDataReducer } from "store/auth/authDataSlice";
import { fileListMockData, fileLogListMockData, fileStatusListMockData, folderListMockData } from "mockData/fileMockData.json"
import userEvent from "@testing-library/user-event";
export const ingestionUrl = process.env.REACT_APP_INGETION_URL || ""
import store from "store"
import {
    fileReducer,
    getFileList,
    getFileStatusList,
    getFileLogList,
    updateFileStatus,
    filedownloadContainer,
    createFileDownloadContainer,
    deleteFileFolder,
    getFolderList,
    moveToFile,
    uploadFolder,
    checkFile,
    resetFileData,
    initialState,
    changeFolderUploadStatus
} from "../store/file/fileSlice";

// Payload for fetching region emission data
const getFileListPayload = {
    "fileName": ""
};


// Configuration for fetching project count API data via Redux
const getFileListApiDataObject = {
    service: fileService,
    serviceName: "getFileListApi",
    sliceName: "getFileList",
    sliceImport: getFileList,
    data: getFileListPayload,
    reducerName: fileReducer,
    loadingState: "isLoadingFileList",
    isSuccess: "isSuccess",
    actualState: "fileList",
};

// Configuration for API testing of fetching project count API data
const getFileListApiApiTestData = {
    serviceName: "getFileListApi",
    method: "post",
    data: getFileListPayload,
    serviceImport: fileService,
    route: `${nodeUrl}get-file-management-list`,
};

const filePayload = {}
// Configuration for fetching project count API data via Redux
const getFileStatusListDataObject = {
    service: fileService,
    serviceName: "getFileStatusListApi",
    sliceName: "getFileStatusList",
    sliceImport: getFileStatusList,
    data: filePayload,
    reducerName: fileReducer,
    loadingState: "isFileStatusLoading",
    actualState: "fileStatusList",
};

// Configuration for API testing of fetching project count API data
const getFileStatusListApiApiTestData = {
    serviceName: "getFileStatusListApi",
    method: "get",
    data: filePayload,
    serviceImport: fileService,
    route: `${nodeUrl}status-list`,
};

// Configuration for fetching project count API data via Redux
const getFileLogListDataObject = {
    service: fileService,
    serviceName: "getFileLogListApi",
    sliceName: "getFileLogList",
    sliceImport: getFileLogList,
    data: filePayload,
    reducerName: fileReducer,
    loadingState: "isLoadingFileLogList",
    actualState: "fileLogList",
};

// Configuration for API testing of fetching project count API data
const getFileLogListApiTestData = {
    serviceName: "getFileLogListApi",
    method: "post",
    data: filePayload,
    serviceImport: fileService,
    route: `${nodeUrl}get-activity-log`,
};


// Configuration for fetching project count API data via Redux
const updateFileStatusDataObject = {
    service: fileService,
    serviceName: "updateStatusApi",
    sliceName: "updateFileStatus",
    sliceImport: updateFileStatus,
    data: filePayload,
    reducerName: fileReducer,
    loadingState: "isLoadingFileStatus",
    actualState: "fileStatusUpdateDto",
};

// Configuration for API testing of fetching project count API data
const updateFileStatusApiTestData = {
    serviceName: "updateStatusApi",
    method: "post",
    data: filePayload,
    serviceImport: fileService,
    route: `${nodeUrl}status-update`,
};


// Configuration for fetching project count API data via Redux
const filedownloadContainerDataObject = {
    service: fileService,
    serviceName: "filedownloadApi",
    sliceName: "filedownloadContainer",
    sliceImport: filedownloadContainer,
    data: filePayload,
    reducerName: fileReducer,
    loadingState: "fileDownloadLoading",
    actualState: "fileDownload",
};

// Configuration for API testing of fetching project count API data
const filedownloadContainerApiTestData = {
    serviceName: "filedownloadApi",
    method: "post",
    data: filePayload,
    serviceImport: fileService,
    route: `${nodeUrl}download-blob-file`,
};

// Configuration for fetching project count API data via Redux
const createFileDownloadContainerDataObject = {
    service: fileService,
    serviceName: "createFileDownloadApi",
    sliceName: "createFileDownloadContainer",
    sliceImport: createFileDownloadContainer,
    data: filePayload,
    reducerName: fileReducer,
    loadingState: "fileDownloadLoading",
    actualState: "fileDownload",
};

// Configuration for API testing of fetching project count API data
const createFileDownloadContainerApiTestData = {
    serviceName: "createFileDownloadApi",
    method: "post",
    data: filePayload,
    serviceImport: fileService,
    route: `${nodeUrl}create-blob-download`,
};

// Configuration for API testing of fetching project count API data
const ingestionFileApiTestData = {
    serviceName: "ingestFile",
    method: "post",
    data: filePayload,
    serviceImport: fileService,
    route: `${ingestionUrl}adf-trigger`,
};


// Configuration for fetching project count API data via Redux
const getFolderListDataObject = {
    service: fileService,
    serviceName: "getFolderListApi",
    sliceName: "getFolderList",
    sliceImport: getFolderList,
    data: filePayload,
    reducerName: fileReducer,
    loadingState: "folderListLoading",
    actualState: "folderList",
};

// Configuration for API testing of fetching project count API data
const getFolderListApiTestData = {
    serviceName: "getFolderListApi",
    method: "get",
    data: filePayload,
    serviceImport: fileService,
    route: `${nodeUrl}get-folder-list`,
};

const deleteFileFolderDataObject = {
    service: fileService,
    serviceName: "deleteFileFolderApi",
    sliceName: "deleteFileFolder",
    sliceImport: deleteFileFolder,
    data: filePayload,
    reducerName: fileReducer,
    loadingState: "deletefileFolderLoading",
    actualState: "deletefileFolder",
};

// Configuration for API testing of fetching project count API data
const deleteFileFolderApiTestData = {
    serviceName: "deleteFileFolderApi",
    method: "post",
    data: filePayload,
    serviceImport: fileService,
    route: `${nodeUrl}delete-folder-file`,
};

const moveToFileDataObject = {
    service: fileService,
    serviceName: "moveToFileApi",
    sliceName: "moveToFile",
    sliceImport: moveToFile,
    data: filePayload,
    reducerName: fileReducer,
    loadingState: "moveFileLoading",
    actualState: "moveFile",
};

// Configuration for API testing of fetching project count API data
const moveToFileApiTestData = {
    serviceName: "moveFileApi",
    method: "post",
    data: filePayload,
    serviceImport: fileService,
    route: `${nodeUrl}move-blob-file`,
};

const uploadFolderDataObject = {
    service: fileService,
    serviceName: "createFolderApi",
    sliceName: "uploadFolder",
    sliceImport: uploadFolder,
    data: filePayload,
    reducerName: fileReducer,
    loadingState: "isLoadingUploadFolder",
    actualState: "folderUploadDataDto",
};

// Configuration for API testing of fetching project count API data
const uploadFolderApiTestData = {
    serviceName: "createFolderApi",
    method: "post",
    data: filePayload,
    serviceImport: fileService,
    route: `${nodeUrl}blob-create-folder`,
};

const checkFileDataObject = {
    service: fileService,
    serviceName: "checkFileApi",
    sliceName: "checkFile",
    sliceImport: checkFile,
    data: filePayload,
    reducerName: fileReducer,
    loadingState: "isLoadingCheckFile",
    actualState: "checkFileExist",
};

// Configuration for API testing of fetching project count API data
const checkFileApiTestData = {
    serviceName: "createFolderApi",
    method: "post",
    data: filePayload,
    serviceImport: fileService,
    route: `${nodeUrl}file-exist-check`,
};
// 

// Execute Redux slice tests for various data
TestFullFilledSlice({
    data: [
        getFileListApiDataObject,
        getFileStatusListDataObject,
        getFileLogListDataObject,
        updateFileStatusDataObject,
        filedownloadContainerDataObject,
        createFileDownloadContainerDataObject,
        getFolderListDataObject,
        deleteFileFolderDataObject,
        moveToFileDataObject,
        uploadFolderDataObject,
        checkFileDataObject
    ],
});


// Execute API tests for various data
ApiTest({
    data: [
        getFileListApiApiTestData,
        getFileStatusListApiApiTestData,
        getFileLogListApiTestData,
        updateFileStatusApiTestData,
        filedownloadContainerApiTestData,
        createFileDownloadContainerApiTestData,
        ingestionFileApiTestData,
        getFolderListApiTestData,
        deleteFileFolderApiTestData,
        moveToFileApiTestData,
        uploadFolderApiTestData,
        checkFileApiTestData
    ],
});

TestSliceMethod({
    data: [
        getFileListApiDataObject,
        getFileStatusListDataObject,
        getFileLogListDataObject,
        updateFileStatusDataObject,
        filedownloadContainerDataObject,
        createFileDownloadContainerDataObject,
        getFolderListDataObject,
        deleteFileFolderDataObject,
        moveToFileDataObject,
        uploadFolderDataObject,
        checkFileDataObject
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

        const result = fileReducer.reducer(modifiedState, resetFileData());

        expect(result).toEqual(initialState);


    });
});


describe("changeFolderUploadStatus Thunk", () => {
    it("should return the correct status when dispatched", async () => {
      const status = true;
      // Dispatch the thunk action
      const result = await store.dispatch(changeFolderUploadStatus(status));
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

describe("test file list", () => {
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

    const renderFileManagemantListView = async () => {
        return await act(async () => {
            render(
                <reactRedux.Provider store={stores}>
                    <router.MemoryRouter>
                        <FileManagementView />
                    </router.MemoryRouter>
                </reactRedux.Provider>
            );
        });
    };

    //section id.....
    it(`<section> test case for whole page `, async () => {
        await renderFileManagemantListView();
        expect(screen.getByTestId("data-mManagement")).toBeInTheDocument();
    });

    it(`<section> test case for whole page `, async () => {
        useSelectorMock.mockReturnValue({
            fileList: {
                data: fileListMockData,
            },
            moveFile: {
                status: true
            }
        });

        await renderFileManagemantListView();
        expect(screen.getByTestId("data-mManagement")).toBeInTheDocument();

        const goToFolder = screen.getByTestId('go-to-folder-88');
        expect(goToFolder).toBeInTheDocument();
        await act(async () => {
            userEvent.click(goToFolder);
        });

        const backButton = screen.getByTestId('back-button');
        expect(backButton).toBeInTheDocument();
        userEvent.click(backButton);

        await act(async () => {
            userEvent.click(goToFolder);
        });

        const backButtonCrumb = screen.getByTestId('back-button-crumb-0');
        expect(backButtonCrumb).toBeInTheDocument();
        userEvent.click(backButtonCrumb);

    });

    it(`<section> test case for whole page `, async () => {
        useSelectorMock.mockReturnValue({
            fileList: {
                data: fileListMockData,
            },
            folderUploadData: {
                data: { status: "success" }
            }
        });

        await renderFileManagemantListView();
        expect(screen.getByTestId("data-mManagement")).toBeInTheDocument();

        const createFolderButton = screen.getByTestId('create-folder-button');
        expect(createFolderButton).toBeInTheDocument();
        await act(async () => {
            userEvent.click(createFolderButton);
        });

        const closeButton = screen.getByRole("button", { name: /close/i });
        userEvent.click(closeButton);

        await act(async () => {
            userEvent.click(createFolderButton);
        });
        const createNewFolderButton = screen.getByTestId('create-folder-btn');
        expect(createNewFolderButton).toBeInTheDocument();

        // create-folder-input-modal
        const createFolderInput = screen.getByTestId('create-folder-input-modal');
        expect(createFolderInput).toBeInTheDocument();

        fireEvent.change(createFolderInput, { target: { value: '' } });
        userEvent.click(createNewFolderButton);

        fireEvent.change(createFolderInput, { target: { value: 'new_folder_new_folder_new_folder_new_folder_new_folder_new_folder_new_folder_new_folder_new_folder_new_folder_new_folder_new_folder_new_folder_new_folder_new' } });
        userEvent.click(createNewFolderButton);

        fireEvent.change(createFolderInput, { target: { value: 'folder' } });
        userEvent.click(createNewFolderButton);

    });

    it(`<section> test case for whole page `, async () => {
        useSelectorMock.mockReturnValue({

        });

        await renderFileManagemantListView();
        expect(screen.getByTestId("data-mManagement")).toBeInTheDocument();
        expect(screen.getByTestId("show-file-upload")).toBeInTheDocument();

        const profilePic = screen.getByTestId('upload-file-btn');
        expect(profilePic).toBeInTheDocument();
        userEvent.click(profilePic);

        const fileInput = screen.getByTestId("hidden-file-input");
        expect(fileInput).toBeInTheDocument();
        expect(fileInput).toHaveAttribute("type", "file");
        expect(fileInput).toHaveClass("d-none");

        const validFile = new File(["dummy content"], "image.csv", {
            type: "csv",
        });

        // Simulate a change event with a valid file
        fireEvent.change(fileInput as HTMLInputElement, { target: { files: [validFile] } });


    });



    it(`<section> test case for file list component `, async () => {
        useSelectorMock.mockReturnValue({
            fileList: {
                data: fileListMockData,
            },
            fileStatusList: {
                data: fileStatusListMockData
            }
        });

        await renderFileManagemantListView();

        expect(screen.getByLabelText("status-dropdown")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("status-dropdown"));
        const statusData = await screen.findByText("Cancelled");
        userEvent.click(statusData);

        const deleteInput = screen.getByTestId("file-checkbox-90");
        expect(deleteInput).toBeInTheDocument();
        userEvent.click(deleteInput);
        await act(async () => {
            userEvent.click(deleteInput);
        });

        await act(async () => {
            userEvent.click(deleteInput);
        });

        const uploadButton = screen.getByTestId('upload-file-list-compnent-button');
        expect(uploadButton).toBeInTheDocument();
        userEvent.click(uploadButton);

        const fileInput = screen.getByTestId("hidden-file-input-list");
        expect(fileInput).toBeInTheDocument();
        expect(fileInput).toHaveAttribute("type", "file");
        expect(fileInput).toHaveClass("d-none");



        const validFile = new File(["dummy content"], "image.csv", {
            type: "csv",
        });

        // Simulate a change event with a valid file
        fireEvent.change(fileInput as HTMLInputElement, { target: { files: [validFile] } });


    });

    it(`<section> test case for delete file component `, async () => {
        useSelectorMock.mockReturnValue({
            fileList: {
                data: fileListMockData,
            },
            fileStatusList: {
                data: fileStatusListMockData
            }
        });

        await renderFileManagemantListView();

        const deleteInput = screen.getByTestId("file-checkbox-90");
        expect(deleteInput).toBeInTheDocument();
        userEvent.click(deleteInput);

        const multiDeleteButton = screen.getByTestId('multi-delete-button');
        expect(multiDeleteButton).toBeInTheDocument();
        await act(async () => {
            userEvent.click(multiDeleteButton);
        })

        const cancelDeleteFileConfirmElement = screen.getByTestId(
            "cancel-delete"
        );

        userEvent.click(cancelDeleteFileConfirmElement);

        await act(async () => {
            userEvent.click(multiDeleteButton);
        })

        const closeButton = screen.getByRole("button", { name: /close/i });
        userEvent.click(closeButton);


        userEvent.click(cancelDeleteFileConfirmElement);

        await act(async () => {
            userEvent.click(multiDeleteButton);
        })

        const deleteFile = screen.getByTestId('delete-file');
        expect(deleteFile).toBeInTheDocument();
        userEvent.click(deleteFile);

    });

    it(`<section> test case for pagination `, async () => {
        useSelectorMock.mockReturnValue({
            fileList: {
                data: fileListMockData,
            },
        });

        await renderFileManagemantListView();
        expect(screen.getByLabelText("pagination-dropdown")).toBeInTheDocument();
        userEvent.click(screen.getByLabelText("pagination-dropdown"));

        const paginationData = await screen.findByText("50");
        await act(async () => {
            userEvent.click(paginationData);
        });

        const anchorElement = screen.getByRole('button', { name: '2' });
        expect(anchorElement).toBeInTheDocument();
        userEvent.click(anchorElement);

    });

    it(`<section> test case for cancel file `, async () => {
        useSelectorMock.mockReturnValue({
            fileList: {
                data: fileListMockData,
            },
            fileStatusList: {
                data: fileStatusListMockData
            }
        });

        await renderFileManagemantListView();

        const uploadButton = screen.getByTestId('upload-file-list-compnent-button');
        expect(uploadButton).toBeInTheDocument();
        userEvent.click(uploadButton);

        const fileInput = screen.getByTestId("hidden-file-input-list");
        expect(fileInput).toBeInTheDocument();
        expect(fileInput).toHaveAttribute("type", "file");
        expect(fileInput).toHaveClass("d-none");


        const validFile = new File(["dummy content"], "image.csv", {
            type: "csv",
        });

        // Simulate a change event with a valid file
        fireEvent.change(fileInput as HTMLInputElement, { target: { files: [validFile] } });

        const cancelButton = screen.getByTestId('cancel-request-34');
        expect(cancelButton).toBeInTheDocument();
        userEvent.click(cancelButton);

    });

    it(`<section> test case for file dropdown download file `, async () => {
        useSelectorMock.mockReturnValue({
            fileList: {
                data: fileListMockData,
            },
            folderList: {
                data: folderListMockData
            }
        });

        await renderFileManagemantListView();

        const fileDropdownElement = screen.getByTestId(
            "file-dropdown-90"
        );
        userEvent.click(fileDropdownElement);

        const fileDropdownCaretElement = screen.getByTestId(
            "file-dropdown-caret-90"
        );

        const downloadFileElement = screen.getByTestId(
            "file-dropdown-download-90"
        );
        await act(async () => {
            userEvent.click(downloadFileElement);
        });
        const cancelDownloadFileConfirmElement = screen.getByTestId(
            "cancel-download"
        );
        userEvent.click(cancelDownloadFileConfirmElement);

        await act(async () => {
            userEvent.click(fileDropdownElement);
        });
        await act(async () => {
            userEvent.click(downloadFileElement);
        });

        const closeButton = screen.getByRole("button", { name: /close/i });
        userEvent.click(closeButton);

        await act(async () => {
            userEvent.click(fileDropdownElement);
        });
        await act(async () => {
            userEvent.click(downloadFileElement);
        });

        // const downloadFileConfirmElement = screen.getByTestId(
        //     "download-file"
        // );
        // expect(downloadFileConfirmElement).toBeInTheDocument();

        // // await act(async () => {
        // userEvent.click(downloadFileConfirmElement);
        // // });

        userEvent.click(fileDropdownCaretElement);

    });


    it(`<section> test case for file dropdown move file `, async () => {
        useSelectorMock.mockReturnValue({
            fileList: {
                data: fileListMockData,
            },
            folderList: {
                data: folderListMockData
            }
        });

        await renderFileManagemantListView();

        const fileDropdownElement = screen.getByTestId(
            "file-dropdown-90"
        );
        userEvent.click(fileDropdownElement);

        const fileDropdownCaretElement = screen.getByTestId(
            "file-dropdown-caret-90"
        );

        const moveFileElement = screen.getByTestId(
            "file-dropdown-move-90"
        );
        await act(async () => {
            userEvent.click(moveFileElement);
        });
        const cancelMoveFileConfirmElement = screen.getByTestId(
            "move-file-modal-cancel"
        );
        userEvent.click(cancelMoveFileConfirmElement);

        await act(async () => {
            userEvent.click(fileDropdownElement);
        });
        await act(async () => {
            userEvent.click(moveFileElement);
        });

        const moveSelectedFileConfirmElement = screen.getByTestId(
            "move-selected-file-modal-test/"
        );
        userEvent.click(moveSelectedFileConfirmElement);

        const moveFileConfirmElement = screen.getByTestId(
            "move-file-modal-move"
        );
        await act(async () => {
            userEvent.click(moveFileConfirmElement);
        });

        // const successMoveFileConfirmElement = screen.getByTestId(
        //     "move-file-success-modal-continue"
        // );
        // userEvent.click(successMoveFileConfirmElement);


        userEvent.click(fileDropdownCaretElement);

    });

    it(`<section> test case for file dropdown delete file `, async () => {
        useSelectorMock.mockReturnValue({
            fileList: {
                data: fileListMockData,
            },
            folderList: {
                data: folderListMockData
            }
        });

        await renderFileManagemantListView();

        const fileDropdownElement = screen.getByTestId(
            "file-dropdown-90"
        );
        userEvent.click(fileDropdownElement);

        const fileDropdownCaretElement = screen.getByTestId(
            "file-dropdown-caret-90"
        );

        const deleteFileElement = screen.getByTestId(
            "file-dropdown-delete-90"
        );
        await act(async () => {
            userEvent.click(deleteFileElement);
        });

        userEvent.click(fileDropdownCaretElement);

    });

    it(`<section> test case for file dropdown log file `, async () => {
        useSelectorMock.mockReturnValue({
            fileList: {
                data: fileListMockData,
            },
            fileLogList: {
                data: fileLogListMockData
            }
        });

        await renderFileManagemantListView();

        const fileDropdownElement = screen.getByTestId(
            "file-dropdown-90"
        );
        userEvent.click(fileDropdownElement);

        const fileDropdownCaretElement = screen.getByTestId(
            "file-dropdown-caret-90"
        );

        const viewLogFileElement = screen.getByTestId(
            "file-dropdown-view-log-90"
        );
        await act(async () => {
            userEvent.click(viewLogFileElement);
        });

        userEvent.click(fileDropdownCaretElement);

        const closeButton = screen.getByRole("button", { name: /close/i });
        userEvent.click(closeButton);

    });

});