import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FileInterface } from "./fileInterface";
import { getErrorMessage, getFileStatusCode } from "../../utils";
import fileService from "./fileService";
import { toast } from "react-toastify";

// Define the shape of the state

// Initial state
export const initialState: FileInterface = {
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  isLoadingFileList: false,
  fileList: null,
  isLoadingUploadFolder: false,
  folderUploadData: false,
  folderUploadDataDto: null,
  fileStatusList: null,
  isFileStatusLoading: false,
  isLoadingFileLogList: false,
  fileLogList: null,
  fileDownloadLoading: false,
  fileDownload: null,
  isLoadingCheckFile: false,
  checkFileExist: null,
  isLoadingFileStatus: false,
  fileStatusUpdateDto: null,
  deletefileFolder: null,
  deletefileFolderLoading: false,
  folderList: null,
  folderListLoading: false,
  moveFile: null,
  moveFileLoading: false,
};

// Async Thunks for changing region, lane, facility, and carrier

export const getFileList = createAsyncThunk("get/data-management/list", async (data: any, thunkApi: any) => {
  try {
    return await fileService.getFileListApi(data);
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
}
);

export const getFileStatusList = createAsyncThunk("get/data-management/file/status", async (_, thunkApi: any) => {
  try {
    return await fileService.getFileStatusListApi();
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
}
)

export const getFileLogList = createAsyncThunk("get/data-management/list/log", async (data: any, thunkApi: any) => {
  try {
    return await fileService.getFileLogListApi(data?.payload);
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    data?.setCurrentPage(1)
    data?.setShowActivityLogModal(false);
    await thunkApi.dispatch(getFileList(data?.fileListData));
    return thunkApi.rejectWithValue(message);
  }
}
);

export const uploadFolder = createAsyncThunk("post/data-management/folder-upload", async ({ data, fileListData }: any, thunkApi: any) => {
  try {
    const response = await fileService.createFolderApi(data);
    thunkApi.dispatch(getFileList(fileListData));
    thunkApi.dispatch(getFolderList());

    toast.success(response?.message)
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
}
);

export const checkFile = createAsyncThunk("post/data-management/file-check", async (data: any, thunkApi: any) => {
  try {
    const response: any = await fileService.checkFileApi(data);
    const payload = {
      fileName: response?.config?.headers?.["file-name"],
      status: getFileStatusCode(response?.code === "ERR_CANCELED" ? "Cancelled" : "Uploaded"),
      folderPath: response?.config?.headers?.["folder-path"],
    }
    if (response?.status === 201 && payload?.fileName) {
      await thunkApi.dispatch(updateFileStatus(payload));
      await thunkApi.dispatch(getFileList(data?.fileListData));
      toast.success("File uploaded successfully")
      return response
    } else {
      if (response?.code === "ERR_CANCELED") {
        await thunkApi.dispatch(updateFileStatus(payload));
        await thunkApi.dispatch(getFileList(data?.fileListData));

      }

      return response;
    }
  } catch (error: any) {

    const message: any = getErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
}
);

export const updateFileStatus = createAsyncThunk("post/data-management/status-update", async (data: any, thunkApi: any) => {
  try {
    return await fileService.updateStatusApi(data);
  } catch (error: any) {
    const message: any = getErrorMessage(error);
    thunkApi.dispatch(getFileList(data?.fileListData));
    return thunkApi.rejectWithValue(message);
  }
}
);

export const changeFolderUploadStatus = createAsyncThunk("put/data-management/file-upload-status", async (data: any, thunkApi: any) => {
  return data
}
);


export const filedownloadContainer = createAsyncThunk(
  "get/container/name/download/slice",
  async ({ data }: any, thunkApi: any) => {
    try {
      return await fileService.filedownloadApi(data);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const createFileDownloadContainer = createAsyncThunk(
  "create/container/name/download/slice",
  async ({ data }: any, thunkApi: any) => {
    try {
      return await fileService.createFileDownloadApi(data);
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      return thunkApi.rejectWithValue(message);
    }
  }
);


export const deleteFileFolder = createAsyncThunk(
  "delete/file/folder",
  async ({ data, fileListData }: any, thunkApi: any) => {
    try {
      const res = await fileService.deleteFileFolderApi(data);
      await thunkApi.dispatch(getFileList(fileListData));
      toast.success("File deleted successfully")
      return res
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      await thunkApi.dispatch(getFileList(fileListData));
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getFolderList = createAsyncThunk(
  "get/file/folder",
  async (_, thunkApi: any) => {
    try {
      return await fileService.getFolderListApi();
    } catch (error: any) {
      const message: any = getErrorMessage(error);

      return thunkApi.rejectWithValue(message);
    }
  }
);

export const moveToFile = createAsyncThunk(
  "move/file/folder",
  async ({ data, fileListData }: any, thunkApi: any) => {
    try {
      let response = await fileService.moveFileApi(data);
      thunkApi.dispatch(getFileList(fileListData));
      return response
    } catch (error: any) {
      const message: any = getErrorMessage(error);
      thunkApi.dispatch(getFileList(fileListData));
      return thunkApi.rejectWithValue(message);
    }
  }
);



// Define the data management reducer
export const fileReducer = createSlice({
  name: "file-management-Page",
  initialState,
  reducers: {
    resetFileData: () => initialState,
    resetMoveFile: (state) => {
      state.moveFile = null;
    }
  },
  extraReducers: (builder) => {
    // Handle fulfilled actions for changing region, lane, facility, and carrier
    builder
      .addCase(getFileList.pending, (state) => {
        state.isLoadingFileList = true
      })
      .addCase(getFileList.fulfilled, (state, action) => {
        state.isLoadingFileList = false
        state.fileList = action.payload
      })
      .addCase(getFileList.rejected, (state, action) => {
        state.isLoadingFileList = false
        state.fileList = null
      })
      .addCase(checkFile.pending, (state) => {
        state.isLoadingCheckFile = true
        state.checkFileExist = null
      })
      .addCase(checkFile.fulfilled, (state, action) => {
        state.isLoadingCheckFile = false
        state.checkFileExist = action.payload
      })
      .addCase(checkFile.rejected, (state, action) => {
        state.isLoadingCheckFile = false
        state.checkFileExist = null
      })
      .addCase(getFileLogList.pending, (state) => {
        state.isLoadingFileLogList = true
        state.fileLogList = null
      })
      .addCase(getFileLogList.fulfilled, (state, action) => {
        state.isLoadingFileLogList = false
        state.fileLogList = action.payload
      })
      .addCase(getFileLogList.rejected, (state, action) => {
        state.isLoadingFileLogList = false
        state.fileLogList = null
      })
      .addCase(getFileStatusList.pending, (state) => {
        state.isFileStatusLoading = true
        state.fileStatusList = null
      })
      .addCase(getFileStatusList.fulfilled, (state, action) => {
        state.isFileStatusLoading = false
        state.fileStatusList = action.payload
      })
      .addCase(getFileStatusList.rejected, (state, action) => {
        state.isFileStatusLoading = false
        state.fileStatusList = null
      })
      .addCase(uploadFolder.pending, (state) => {
        state.isLoadingUploadFolder = true
        state.folderUploadData = false
        state.folderUploadDataDto = null
      })
      .addCase(uploadFolder.fulfilled, (state, action) => {
        state.isLoadingUploadFolder = false
        state.folderUploadData = true
        state.folderUploadDataDto = action.payload
      })
      .addCase(uploadFolder.rejected, (state, action) => {
        state.isLoadingUploadFolder = false
        state.folderUploadData = false
        state.folderUploadDataDto = null
      })
      .addCase(updateFileStatus.pending, (state) => {
        state.isLoadingFileStatus = true
        state.fileStatusUpdateDto = null
      })
      .addCase(updateFileStatus.fulfilled, (state, action) => {
        state.isLoadingFileStatus = false
        state.fileStatusUpdateDto = action.payload
      })
      .addCase(updateFileStatus.rejected, (state, action) => {
        state.isLoadingFileStatus = false
        state.fileStatusUpdateDto = null
      })
      .addCase(changeFolderUploadStatus.fulfilled, (state) => {
        state.folderUploadData = false
      })
      .addCase(filedownloadContainer.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.fileDownloadLoading = true
        state.fileDownload = null;
      })
      .addCase(filedownloadContainer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.fileDownloadLoading = false
        state.fileDownload = action.payload;
      })
      .addCase(filedownloadContainer.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.fileDownloadLoading = false
      })
      .addCase(createFileDownloadContainer.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.fileDownloadLoading = true
        state.fileDownload = null;
      })
      .addCase(createFileDownloadContainer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.fileDownloadLoading = false
        state.fileDownload = action.payload;
      })
      .addCase(createFileDownloadContainer.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.fileDownloadLoading = false
        state.fileDownload = null;
      })



      .addCase(deleteFileFolder.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.deletefileFolderLoading = true
        state.deletefileFolder = null;
      })
      .addCase(deleteFileFolder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.deletefileFolderLoading = false
        state.deletefileFolder = action.payload;
      })
      .addCase(deleteFileFolder.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.deletefileFolderLoading = false
        state.deletefileFolder = null;
      })

      .addCase(getFolderList.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.folderListLoading = true
      })
      .addCase(getFolderList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.folderListLoading = false
        state.folderList = action.payload;
      })
      .addCase(getFolderList.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.folderListLoading = false
        state.folderList = null;
      })

      .addCase(moveToFile.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.moveFileLoading = true
        state.moveFile = null;
      })
      .addCase(moveToFile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.moveFileLoading = false
        state.moveFile = action.payload;
      })
      .addCase(moveToFile.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.moveFileLoading = false
        state.moveFile = null;
      })
  },
});

// Export the action and reducer
export const { resetFileData, resetMoveFile } = fileReducer.actions;
export default fileReducer.reducer;
