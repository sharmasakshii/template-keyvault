import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import {
  uploadFolder,
  getFileStatusList,
  getFileLogList,
  filedownloadContainer,
  checkFile,
  deleteFileFolder,
  getFolderList,
  moveToFile,
  changeFolderUploadStatus,
  resetMoveFile,
  getFileList,
} from "store/file/fileSlice";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import useExitPrompt from "hooks/useExitPrompt";
import { getFileStatusCode, getfolderPath } from "utils";
import { v4 as uuidv4 } from 'uuid';

const controllerObj: any = {};

/**
 * A custom hook that contains all the states and functions for the FileManagementController
 */
const FileManagementController = () => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<any>(null);
  const [folderId, setFolderId] = useState([""]);
  const [showFolderCreateModal, setShowFolderCreateModal] = useState(false);
  const [showFileListView, setShowFileListView] = useState(false);
  const [folderPath, setFolderPath] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [uploadingFiles, setUploadingFiles] = useState<any>([]);
  const [pageSize, setPageSize] = useState<any>({
    label: 10,
    value: 10,
  });
  const [fileStatus, setFileStatus] = useState<any>({ label: "All", value: "" });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showFileOption, setShowFileOption] = useState(null);
  const [fileDto, setFileDto] = useState<any>(null);
  const [showFileDownloadOptin, setShowFileDownloadOptin] = useState(false);
  const [showFileRename, setShowFileRename] = useState(false);
  const [breadCrumbFolder, setBreadCrumbFolder] = useState<any>([]);
  const [multiSelectFileForDelete, setMultiSelectFileForDelete] = useState<any>([])
  const [showActivityLogModal, setShowActivityLogModal] = useState<boolean>(false);
  const [showMoveToFileModal, setShowMoveToFileModal] = useState<boolean>(false);
  const [selectFileModal, setSelectFileModal] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showFileDeleteModal, setShowFileDeleteModal] = useState<boolean>(false);
  const [deleteType, setDeleteType] = useState<string>("")

  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);

  const {
    fileList,
    moveFile,
    isLoadingFileList,
    moveFileLoading,
    deletefileFolderLoading,
    isLoadingFileStatus,
    folderListLoading,
    isLoadingUploadFolder,
    folderUploadData,
    fileStatusList,
    fileLogList,
    isLoadingFileLogList,
    checkFileExist,
    folderList,
  } = useAppSelector((state: any) => state.file);

  const { loginDetails } = useAppSelector((state: any) => state.auth);

  useEffect(() => {
    setShowExitPrompt(false);
  }, [setShowExitPrompt]);

  const handleNewFolderInput = (e: any) => {
    setNewFolderName(e.target.value);
  };


  const fileListApiPayload = {
    folder_path: folderPath,
    page_size: pageSize?.value,
    page: currentPage,
    status: fileStatus?.value,
    file_management_id: folderId[folderId?.length - 1],
  }

  const handleClose = () => {
    setShowFolderCreateModal(false);
    setNewFolderName("");
  };

  const handleNewFolderModalShow = () => {
    setShowFolderCreateModal(true);
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFolderBack = () => {
    let backFolderPath = folderPath.split("/");
    backFolderPath?.pop();
    const resultString = backFolderPath?.join("/");
    setFolderPath(resultString);
    let newFolderId = [...folderId];
    newFolderId.pop();
    setFolderId(newFolderId);
  };

  const handleFolderNextClick = (base_path: string, name: string, id: any) => {
    setFolderPath((prev: string) => (prev ? `${base_path}/${name}` : name));
    setCurrentPage(1);
    setFolderId((prev: any) => [...prev, id]);
  };

  const handleCreateFolder = async () => {
    if (newFolderName) {
      const maxFolderNameLength = 150;
      if (!/[0-9a-zA-Z]/.test(newFolderName) || newFolderName === "") {
        return toast.error(
          `Invalid folder name. Special characters are not allowed.`
        );
      }
      if (newFolderName.length > maxFolderNameLength) {
        return toast.error(
          `Folder name must be at most ${maxFolderNameLength} characters long`
        );
      }

      let payload = {
        folderPath: folderPath || "/",
        folderName: newFolderName,
      };
      setShowFolderCreateModal(false);
      await dispatch(uploadFolder({ data: payload, fileListData: fileListApiPayload }));
      setNewFolderName("");
    }
  };

  useEffect(() => {
    if (folderUploadData) {
      setShowFileListView(true);
      dispatch(changeFolderUploadStatus(false));
    }
  }, [dispatch, folderUploadData]);

  useEffect(() => {
    if (moveFile?.status) {
      setShowSuccessModal(true);
      setFileDto(null);
    }
  }, [moveFile]);

  const onFilesSelected = useCallback(
    (acceptedFiles: any) => {
      if (acceptedFiles.length > 0) {
        setShowExitPrompt(true);
        let fileNo = 0;
        for (let i of acceptedFiles) {
          const randomId: any = uuidv4();

          controllerObj[randomId] = new AbortController();

          // Check file extension or MIME type
          const allowedFileTypes = [
            "csv",
            "excel",
            "spreadsheetml",
            "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "vnd.ms-excel",
            "vnd.ms-excel.sheet.macroEnabled.12",
            "vnd.ms-excel.sheet.binary.macroEnabled.12",
          ];

          const fileType = i?.type.split("/").pop(); // Get file extension
          if (allowedFileTypes.includes(fileType)) {
            fileNo++;
            const file_id = new Date().getTime().toString() + fileNo;
            // File type is allowed, you can proceed with handling the file
            const userData = {
              file: i,
              file_id: file_id,
              fileName: i?.name,
              folderName: getfolderPath(folderPath, false),
              file_path: getfolderPath(folderPath, true, i?.name),
              base_path: folderPath,
              controller: controllerObj[randomId],
              fileListData: {
                folder_path: folderPath,
                page_size: pageSize?.value,
                page: currentPage,
                status: fileStatus?.value,
                file_management_id: folderId[folderId?.length - 1],
              }
            };
            dispatch(checkFile(userData));
            setUploadingFiles((prev: any) => [
              ...prev,
              {
                id: randomId,
                name: i?.name,
                type: "file",
                fileStatus: {
                  status_name: "Uploading",
                  status_code: 6
                },
                user: loginDetails?.data?.profile || "N/A",
                updated_on: moment(),
                file_id: file_id,
                filepath: folderPath,
                file: i,
                isUploaded: false,
              },
            ]);
            setShowFileListView(true);
          } else {
            // File type is not allowed, you can display an error message
            toast.error(
              `Invalid file type of file ${i?.name}. Please select a CSV or Excel file.`
            );
          }
        }
        fileInputRef.current.value = null;
      }
    },
    [dispatch, setShowExitPrompt, folderPath, loginDetails, currentPage, folderId, pageSize, fileStatus]
  );

  const handleCancelRequest = (randomId: any) => {
    controllerObj[randomId]?.abort();
  };

  useEffect(() => {
    const headers = checkFileExist?.config?.headers;
    const hasHeaderId = Boolean(headers?.file_id && headers?.["file-name"]);
    const targetId = hasHeaderId
      ? headers.file_id?.toString()
      : checkFileExist?.data?.id?.toString();

    if (!targetId) return;

    const shouldRemove = uploadingFiles.some(
      (f: any) => f?.file_id === targetId && f?.isUploaded === false
    );
    if (!shouldRemove) return;

    setUploadingFiles((prev: any[]) =>
      prev.filter((obj: any) => obj?.file_id !== targetId)
    );
    setShowExitPrompt(false);
  }, [checkFileExist, setShowExitPrompt, dispatch, uploadingFiles, setUploadingFiles]);


  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    let updateCrumb = [{ label: "Home", link: "home", path_id: "" }];

    if (folderPath) {
      let folder_path: any = folderPath.split("/");
      folder_path.map((ele: string, index: number) => {
        updateCrumb[index + 1] = {
          label: ele,
          link: updateCrumb[updateCrumb?.length - 1].link + "/" + ele,
          path_id: folderId[index],
        };
        return true
      });
    }
    setBreadCrumbFolder(updateCrumb);
  }, [folderPath, folderId]);

  const handleClickCrumb = (data: any, index: any, e: any) => {
    e.preventDefault();
    if (breadCrumbFolder?.length - 1 !== index) {
      let folderPathData = folderPath
        ?.split("/")
        ?.filter((ele: any, index1: any) => {
          return index1 < index;
        });
      let folderIdData = folderId?.filter((id: any, index1: number) => {
        return index1 < index;
      });

      setFolderPath(folderPathData.join("/").toString());
      setFolderId(folderIdData);
    }
  };
  useEffect(() => {
    dispatch(
      getFileList({
        folder_path: folderPath,
        page_size: pageSize?.value,
        page: currentPage,
        status: fileStatus?.value,
        file_management_id: folderId[folderId?.length - 1],
      })
    );
    setMultiSelectFileForDelete([])
  }, [dispatch, folderPath, currentPage, pageSize, fileStatus, folderId]);

  useEffect(() => {
    dispatch(getFileStatusList());
    dispatch(getFolderList());
  }, [dispatch]);

  const downLoadFile = async () => {
    const dataPayload = {
      file_management_id: fileDto?.id,
      fileName: fileDto?.name,
      folderPath: folderPath,
      status: getFileStatusCode("Analyzed"),
      downloadPath: folderPath ? folderPath + "/" + fileDto?.name : fileDto?.name,
    }
    await dispatch(filedownloadContainer({
      data: dataPayload
    })
    )
    await dispatch(getFileList(fileListApiPayload))

    setShowFileDownloadOptin(false);
  };

  useEffect(() => {
    if (fileList?.data?.path && !showFileListView) {
      setShowFileListView(true);
    }
  }, [fileList]);

  const handlePageChange = (e: any) => {
    setPageSize(e);
    setCurrentPage(1);
  };

  const handelShowFileOption = (id: any) => {
    if (id !== showFileOption) {
      setShowFileOption(id);
    } else {
      setShowFileOption(null);
    }
  };

  const handelShowActivityLog = (id: any) => {
    dispatch(getFileLogList({
      payload: { file_management_id: id },
      fileListData: {
        folder_path: folderPath,
        page_size: pageSize?.value,
        page: 1,
        status: fileStatus?.value,
        file_management_id: folderId[folderId?.length - 1],
      },
      setShowActivityLogModal: setShowActivityLogModal,
      setCurrentPage: setCurrentPage
    }));
    setShowFileOption(null);
    setShowActivityLogModal(true);
  };

  const handelhideActivityLog = () => {
    setShowActivityLogModal(false);
  };

  const handleMoveToFile = () => {
    const payloadData = {
      file_id: fileDto?.id,
      fileName: fileDto?.name,
      folderPath: folderPath,
      move_to: selectFileModal,
      move_from: fileDto?.base_path,
    }
    dispatch(
      moveToFile({
        data: payloadData,
        fileListData: {
          folder_path: folderPath,
          page_size: pageSize?.value,
          page: 1,
          status: fileStatus?.value,
          file_management_id: folderId[folderId?.length - 1],
        }
      })
    );
    setCurrentPage(1)
    setShowFileDownloadOptin(false);
  };

  const deleteFile = () => {
    const payloadData = {
      type: "file",
      file_id: deleteType === "single" ? [{
        name: fileDto?.name,
        base_path: fileDto?.base_path,
        id: fileDto?.id,
        is_movable: fileDto?.fileStatus?.status_code !== getFileStatusCode("Cancelled") ? 1 : 0
      }] : multiSelectFileForDelete,
    }
    dispatch(
      deleteFileFolder({
        data: payloadData,
        fileListData: {
          folder_path: folderPath,
          page_size: pageSize?.value,
          page: 1,
          status: fileStatus?.value,
          file_management_id: folderId[folderId?.length - 1],
        }
      })
    );
    setCurrentPage(1)
    setMultiSelectFileForDelete([])
    setShowFileDeleteModal(false);
  };
  const handleHideMoveToFolderModal = () => {
    setFileDto(null);
    setShowMoveToFileModal(false);
    setShowSuccessModal(false)
    setNewFolderName("");
  };
  const handleHideMoveFileSuccessModal = () => {
    dispatch(resetMoveFile());
    setShowSuccessModal(false)
    setFileDto(null);
    setShowMoveToFileModal(false);
    setShowSuccessModal(false)
    setNewFolderName("");
  }

  const handleMultiSelectFile = (fileData: any, e: any) => {
    if (e.target.checked) {
      setMultiSelectFileForDelete([...multiSelectFileForDelete, { base_path: fileData?.base_path, name: fileData?.name, id: fileData?.id, is_movable: fileData?.fileStatus?.status_code !== getFileStatusCode("Cancelled") ? 1 : 0 }])
    }
    if (!e.target.checked) {
      let unselect = multiSelectFileForDelete?.filter((select: any) => {
        return select?.id !== fileData?.id
      })
      setMultiSelectFileForDelete(unselect)
    }
  }
  const handleMultiDelete = (e: any) => {
    setDeleteType("multi")
    setShowFileDeleteModal(true)
    setShowFileOption(null)
  }

  // Return all the states and functions
  return {
    handleFolderBack,
    newFolderName,
    showFolderCreateModal,
    isLoadingUploadFolder,
    handleNewFolderInput,
    getRootProps,
    isDragActive,
    getInputProps,
    onFilesSelected,
    handleCreateFolder,
    fileList,
    handleClose,
    handleNewFolderModalShow,
    showFileListView,
    isLoadingFileList,
    uploadingFiles,
    folderPath,
    handleUploadButtonClick,
    fileInputRef,
    pageSize,
    handlePageChange,
    currentPage,
    setCurrentPage,
    fileStatusList,
    fileStatus,
    setFileStatus,
    showFileOption,
    handelShowFileOption,
    showActivityLogModal,
    handelShowActivityLog,
    handelhideActivityLog,
    fileLogList,
    isLoadingFileLogList,
    downLoadFile,
    setFileDto,
    showFileDownloadOptin,
    setShowFileDownloadOptin,
    showFileRename,
    setShowFileRename,
    setNewFolderName,
    setShowFileOption,
    handleFolderNextClick,
    folderList,
    showMoveToFileModal,
    setShowMoveToFileModal,
    handleMoveToFile,
    selectFileModal,
    setSelectFileModal,
    fileDto,
    showSuccessModal,
    moveFileLoading,
    showFileDeleteModal,
    deletefileFolderLoading,
    isLoadingFileStatus,
    folderListLoading,
    setShowFileDeleteModal,
    deleteFile,
    handleHideMoveToFolderModal,
    handleHideMoveFileSuccessModal,
    handleCancelRequest,
    showExitPrompt,
    breadCrumbFolder,
    handleClickCrumb,
    handleMultiSelectFile,
    multiSelectFileForDelete,
    handleMultiDelete,
    setDeleteType,
    resetMoveFile,
    dispatch
  };
};

// Exporting the custom hook for use in other components
export default FileManagementController;
