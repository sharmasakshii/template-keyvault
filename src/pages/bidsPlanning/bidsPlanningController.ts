import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import useExitPrompt from "hooks/useExitPrompt";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import { getPercentageData, getfolderPath } from "utils";
import moment from "moment";
import ExcelJS from 'exceljs';
import { toast } from "react-toastify";
import {
  bidPlanningFileList, bidPlanningStatusList,
  checkUploadFile, deleteMultiBidFiles, processBidNewLanes,
  processBidFileData, processStatusBidFile, processBidNewLanesCounter,
  resetBidPlanning,
  resetkeyMetricsSummaryOutput
} from "store/bidPlanning/bidPlanningSlice";
import { createFileDownloadContainer, filedownloadContainer } from "store/file/fileSlice";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';


/**
 * A custom hook that contains all the states and functions for the BidsPlanningController
 */
const BidsPlanningController = () => {

  // Define and initialize various states
  const [showFileListView, setShowFileListView] = useState(false);
  const [showDropBoxView, setShowDropBoxView] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<any>({});
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);
  const [showFileUploadProgress, setShowFileUploadProgress] = useState(false);
  const { loginDetails } = useAppSelector((state: any) => state.auth);
  const fileInputRef = useRef<any>(null);
  const [progressValue, setProgressValue] = useState(0);
  const [showUploadError, setShowUploadError] = useState(false)
  const [pageSize, setPageSize] = useState<any>({ label: 10, value: 10 });
  const [fileStatus, setFileStatus] = useState<any>({ label: "All", value: "" });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [multiSelectFileForDelete, setMultiSelectFileForDelete] = useState<any>([])
  const [showFileDeleteModal, setShowFileDeleteModal] = useState<boolean>(false);
  const [selectFile, setSelectFile] = useState<any>(null);
  const [order, setOrder] = useState<string>("desc");
  const [showBidmatrixProgress, setShowBidmatrixProgress] = useState(false)
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now())
  const [isAnalysingFile, setIsAnalysingFile] = useState(false)
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const {
    processFileStatusData,
    bidFileList,
    isLoadingBidFileList,
    isLoadingSaveFile,
    isLoadingDeleteFile,
    bidFileDataMatrics,
    isLoadingCheckFile,
    isLoadingProcessFile,
    checkBidFileExist,
    fileUploadError,
    bidStatusList,
    isLoadingKeyMetricsDetail,
    isLoadinBidFileLanesTableGraph,
    isLoadingProcessFileStatusData } = useAppSelector((state: any) => state.bidPlanning);
  const { fileDownloadLoading } = useAppSelector((state: any) => state.file);
  const [processFilePercent, setProcessFilePercent] = useState<number>(0)
  const [reloadFileList, setReloadFileList] = useState<boolean>(false)

  useEffect(() => {
    setShowExitPrompt(false);
  }, [setShowExitPrompt]);

  useEffect(() => {
    if (processFileStatusData?.data?.total > 0) {
      setShowBidmatrixProgress(true)
      setProcessFilePercent(getPercentageData(processFileStatusData?.data?.total, processFileStatusData?.data?.is_processed))
    }
  }, [processFileStatusData]);

  useEffect(() => {
    let intervalCall: any
    const checkTime = process.env.REACT_APP_PROGRESS_TIME ? +process.env.REACT_APP_PROGRESS_TIME : 5000
    if (selectFile) {
      intervalCall = setInterval(() => {
        if (processFileStatusData?.data?.total >= 0) {
          if (processFileStatusData?.data?.is_processed < processFileStatusData?.data?.total) {
            dispatch(processStatusBidFile({ fileId: selectFile?.fileId }))
          } else {
            dispatch(processBidFileData({ file_id: selectFile?.fileId }))
            setSelectFile(null)
            clearInterval(intervalCall); // Stop the interval when data reaches 100
          }
        } else {
          setSelectFile(null)
          clearInterval(intervalCall);
        }
      }, checkTime);
      return () => {
        clearInterval(intervalCall); // Clean up on unmount
      };
    }
  }, [processFileStatusData, dispatch, selectFile]);


  useEffect(() => {
    if (selectFile) {
      if (processFileStatusData?.data?.is_error > 0) {
        if (processFileStatusData?.data?.total === (processFileStatusData?.data?.is_error + processFileStatusData?.data?.is_processed)) {
          dispatch(processBidNewLanesCounter({ fileName: selectFile?.fileName, file_id: selectFile?.fileId, }))
        }
      } 
    }
  }, [processFileStatusData, dispatch, selectFile]);

  useEffect(() => {
    dispatch(bidPlanningFileList({
      name: "",
      page_size: pageSize?.value,
      page: currentPage,
      search: "",
      status_id: fileStatus?.value,
      order_by: order
    }
    ))
    setMultiSelectFileForDelete([])
  }, [dispatch, currentPage, pageSize, fileStatus, order, reloadFileList]);

  const deleteFile = async () => {
    setShowFileDeleteModal(false);
    await dispatch(
      deleteMultiBidFiles({
        deleteData: {
          file_id: multiSelectFileForDelete.map((file: any) => {
            return ({ id: file.id, name: file?.name, base_path: "bid_planning" })
          })
        }
      })
    );
    setCurrentPage(1)
    setReloadFileList(!reloadFileList)

    setMultiSelectFileForDelete([])
  };

  const handleMultiSelectFile = (fileData: any, e: any) => {
    if (e.target.checked) {
      if (fileData === "all") {
        setMultiSelectFileForDelete(bidFileList?.data?.data?.map((file: any) => { return ({ base_path: "bid_planning/", name: file?.name, id: file?.id }) }) || [])
      } else {
        setMultiSelectFileForDelete([...multiSelectFileForDelete, { base_path: "bid_planning/", name: fileData?.name, id: fileData?.id }])
      }
    }
    if (!e.target.checked) {
      if (fileData === "all") {
        setMultiSelectFileForDelete([])
      } else {
        let unselect = multiSelectFileForDelete?.filter((select: any) => {
          return select?.id !== fileData?.id
        })
        setMultiSelectFileForDelete(unselect)
      }
    }
  }

  const getFileCount = (id: number) => {
    return bidFileList?.data?.data?.reduce((accumulator: number, file: any) => {
      if (file?.status?.id === id) accumulator++
      return accumulator
    }, 0)
  }

  useEffect(() => {
    if (checkBidFileExist?.success === "failed" && checkBidFileExist?.data?.code !== "ERR_CANCELED") {
      setShowUploadError(true)
      setShowFileUploadProgress(true);
    } else if (checkBidFileExist) {
      setShowFileUploadProgress(false);
      setProgressValue(0)
    }
  }, [checkBidFileExist])

  const handleShowInputFile = (detail: any) => {
    if (detail) {
      navigate(`/scope3/bid-matrics/${detail?.id}/${detail?.name}`)
    }
  }

  useEffect(() => {
    if (bidFileDataMatrics?.data?.uploadedBidFile && !isLoadingCheckFile) {
      const { id, name } = bidFileDataMatrics.data.uploadedBidFile
      dispatch(resetBidPlanning())
      navigate(`/scope3/bid-matrics/${id}/${name}`)
    }
  }, [dispatch, bidFileDataMatrics, navigate, isLoadingCheckFile])

  const checkMissingHeaders = (headers: Set<string>, specificHeaders: string[], noHeader: Set<string>) => {
    specificHeaders.forEach(header => {
      if (!headers.has(header)) {
        noHeader.add(header);
      }
    });
  };

  const checkDuplicateHeaders = (headerCounts: Map<string, number>, duplicateHeaders: Set<string>) => {
    headerCounts.forEach((count, header) => {
      if (count > 1) {
        duplicateHeaders.add(header);
      }
    });
  };

  const handleHeaderIssues = async (duplicateHeaders: Set<string>, noHeader: Set<string>, uploadingFile: any) => {
    if (duplicateHeaders.size === 0 && noHeader.size === 0) {
      await uploadSelectedFile(uploadingFile);
    } else {
      if (duplicateHeaders.size > 0) {
        toast.error(`Duplicate headers found: ${[...duplicateHeaders].join(', ')}`);
      }
      if (noHeader.size > 0) {
        toast.error(`Missing required headers: ${[...noHeader].join(', ')}`);
      }
    }
  };

  const processFirstRow = (
    worksheet: ExcelJS.Worksheet,
    headers: Set<string>,
    headerCounts: Map<string, number>
  ) => {
    const firstRow = worksheet.getRow(1);
    firstRow.eachCell((cell) => {
      const cellValue: any = cell.value || "";
      const formattedHeader = formatColumnName(cellValue);
      if (formattedHeader) {
        headers.add(formattedHeader);
        headerCounts.set(formattedHeader, (headerCounts.get(formattedHeader) ?? 0) + 1);
      }
    });
  };

  const processWorksheet = (
    worksheet: ExcelJS.Worksheet,
    noHeader: Set<string>,
    duplicateHeaders: Set<string>
  ) => {
    const headers: Set<string> = new Set();
    const headerCounts = new Map<string, number>();

    processFirstRow(worksheet, headers, headerCounts);

    const specificHeaders = [
      "origin_city",
      "origin_state",
      "destination_city",
      "destination_state",
      "scac",
      "rpm",
    ];

    checkMissingHeaders(headers, specificHeaders, noHeader);
    checkDuplicateHeaders(headerCounts, duplicateHeaders);
  };

  const loadWorkbook = async (
    buffer: ArrayBuffer,
    noHeader: Set<string>,
    duplicateHeaders: Set<string>
  ) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer).catch((error) => {
      // Log error in development only
      if (process.env.REACT_APP_IS_DEV === "true") {
        console.log(error);
      }
    });

    workbook.eachSheet((worksheet) => {
      processWorksheet(worksheet, noHeader, duplicateHeaders);
    });
  };

  const checkFileHeader = async (uploadingFile: any) => {
    const reader = new FileReader();
    let duplicateHeaders: Set<string> = new Set();
    let noHeader: Set<string> = new Set();

    reader.onload = async (e: any) => {
      const buffer = e.target.result;
      await loadWorkbook(buffer, noHeader, duplicateHeaders);

      handleHeaderIssues(duplicateHeaders, noHeader, uploadingFile);
      setIsAnalysingFile(false);
      clearSelectedFile();
    };

    reader.readAsArrayBuffer(uploadingFile);
    return { duplicateHeaders, noHeader };
  };


  const clearSelectedFile = () => {
    setShowExitPrompt(false);
    if (fileInputRef?.current) {
      fileInputRef.current.value = null;
    }
  }

  function formatColumnName(name: string) {
    if (!name) { return name; }
    name = name.replace(/\s+|\/|\(|\)|_+/g, "_");
    return name.toLowerCase();
  }

  const uploadSelectedFile = async (uploadingFile: any) => {
    const file_id = uuidv4();
    setLastUpdateTime(Date.now())
    // File type is allowed, you can proceed with handling the file
    let controllerObj: any = new AbortController();
    const userData = {
      file: uploadingFile,
      file_id: file_id,
      fileName: uploadingFile?.name,
      folderName: getfolderPath("bid_planning", false),
      file_path: getfolderPath("bid_planning", true, uploadingFile?.name),
      base_path: "bid_planning",
      progressFn: ProgressHandler,
      controller: controllerObj,
      fileListPayload: {
        name: "",
        page_size: 10,
        page: 1,
        search: "",
        status_id: ""
      }
    };

    setUploadingFiles(
      {
        id: file_id,
        name: uploadingFile?.name,
        user: loginDetails?.data?.profile || "N/A",
        updated_on: moment(),
        file_id: file_id,
        file: uploadingFile,
        isUploaded: false,
        controllerObj: controllerObj
      });
    setShowFileUploadProgress(true);
    await dispatch(checkUploadFile(userData));
  }

  const onFilesSelected = useCallback(
    async (acceptedFiles: any) => {
      try {
        if (acceptedFiles.length === 1) {
          setIsAnalysingFile(true)
          setShowExitPrompt(true);
  
          // Check file extension or MIME type
          const allowedFileTypes = [
            "excel",
            "spreadsheetml",
            "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "vnd.ms-excel",
            "vnd.ms-excel.sheet.macroEnabled.12",
            "vnd.ms-excel.sheet.binary.macroEnabled.12",
            "xls",
            "xltx",
            "xltm",
            "xlam",
          ];
          const uploadingFile = acceptedFiles?.[0]
  
          const fileType = uploadingFile?.type.split("/").pop(); // Get file extension
          if (!allowedFileTypes.includes(fileType)) {
            // File type is not allowed, you can display an error message
            toast.error("Invalid file format. Please upload a file in excel format.");
            clearSelectedFile()
            return true;
          }
          if (uploadingFile?.size / (1024 * 1024) > 100) {
            toast.error("File size exceeds the limit. Please upload a file smaller than [file size 100 MB].");
            clearSelectedFile()
            return true;
          }
  
          await checkFileHeader(uploadingFile)
  
        } else {
          toast.error("Please select only one file in excel format.");
        }
      } catch (error) {
        setIsAnalysingFile(false)
      }
    },
    [dispatch, setShowExitPrompt, loginDetails]
  );

  const ProgressHandler = (e: any) => {
    const now = Date.now();
    if (now - lastUpdateTime >= 1000) {
      let percent = (e.loaded / e.total) * 100;
      setProgressValue(Math.round(percent));
      setLastUpdateTime(now)
    }
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUploadAgain = () => {
    onFilesSelected([uploadingFiles?.file])
    setShowFileUploadProgress(true);
    setProgressValue(0)
    setShowUploadError(false)
  }

  const downloadFile = (dataPayload: any) => {
    dispatch(
      filedownloadContainer({
        data: dataPayload
      })
    );
  }

  const handleDownLoadFile = (file: any) => {
    if (file?.processing?.download_path) {
      const dataPayload = {
        downloadPath: file?.processing?.download_path,
        fileName: file?.name,
      }
      downloadFile(dataPayload)
    } else {
      dispatch(
        createFileDownloadContainer({
          data: {
            name: file?.name,
            file_id: file?.id
          },
        })
      );
    }
  };

  const handleCancelRequest = () => {
    uploadingFiles?.controllerObj.abort();
  };

  const handleShowOutputSummary = (detail: any) => {
    if (detail) {
      navigate(`/scope3/bid-output/${detail?.id}/${detail?.name}`)
      setShowFileListView(false)
      dispatch(resetkeyMetricsSummaryOutput());
    } else {
      setShowFileListView(true)
      setProcessFilePercent(0)
    }
  }

  const handleCloseProgressModal = () => {
    setShowFileUploadProgress(false);
    setProgressValue(0)
    setShowUploadError(false)
  }

  const handleProcessFile = (file_name: string, file_id: string | number) => {
    setSelectFile({ fileId: file_id, fileName: file_name })
    dispatch(processBidNewLanes({ file_id: file_id }))
    setProcessFilePercent(0)
  }

  useEffect(() => {
    dispatch(bidPlanningStatusList());
  }, [dispatch]);

  useEffect(() => {
    const hasData = bidFileList?.data?.total > 0;

    if (fileStatus?.value === "") {
      if (hasData) {
        setShowFileListView(true);
        setShowDropBoxView(false);

        const fileWithStatus7 = bidFileList?.data?.data?.find((res: any) => res?.status_id === 7);
        if (fileWithStatus7) {
          setSelectFile({ fileId: Number(fileWithStatus7.id), fileName: fileWithStatus7.name });
          dispatch(processStatusBidFile({ fileId: fileWithStatus7.id }));
        }
      } else {
        setShowFileListView(false);
        setShowDropBoxView(true);
      }
    } else {
      setShowFileListView(true);
      setShowDropBoxView(false);
    }
  }, [dispatch, bidFileList, fileStatus]);

 

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected]
  );

  const handleSampleFileDownload = () => {
    downloadFile({
      downloadPath: "bid_sample_file.xlsx",
      fileName: "bid_sample_file.xlsx",
      folderPath: "/"
    })
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, disabled: isLoadingCheckFile });

  // Return all the states and functions
  return {
    getRootProps,
    getInputProps,
    isDragActive,
    handleUploadButtonClick,
    fileInputRef,
    onFilesSelected,
    showFileUploadProgress,
    progressValue,
    isLoadingBidFileList,
    showFileListView,
    uploadingFiles,
    isLoadingSaveFile,
    isLoadingDeleteFile,
    handleProcessFile,
    isLoadingCheckFile,
    isLoadingProcessFile,
    handleCancelRequest,
    showUploadError,
    fileUploadError,
    handleUploadAgain,
    handleDownLoadFile,
    handleSampleFileDownload,
    fileDownloadLoading,
    showDropBoxView,
    handleCloseProgressModal,
    fileStatus,
    getFileCount,
    setFileStatus,
    bidFileList,
    handleMultiSelectFile,
    multiSelectFileForDelete,
    showFileDeleteModal,
    setShowFileDeleteModal,
    deleteFile,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    bidStatusList,
    isLoadingKeyMetricsDetail,
    isLoadinBidFileLanesTableGraph,
    selectFile,
    setSelectFile,
    processFileStatusData,
    order,
    setOrder,
    handleShowOutputSummary,
    showBidmatrixProgress,
    processFilePercent,
    showExitPrompt,
    handleShowInputFile,
    isLoadingProcessFileStatusData,
    isAnalysingFile,

  };
};

// Exporting the custom hook for use in other components
export default BidsPlanningController;