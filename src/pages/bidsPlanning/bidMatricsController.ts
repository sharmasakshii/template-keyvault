import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { exportErrorListBidInput, fileMatricsInputError, getBidFileDetail, getBidFileLanesTableGraph, getKeyMetricsDetail, processBidFileData, processBidNewLanes, processBidNewLanesCounter, processStatusBidFile, resetMatrics } from "store/bidPlanning/bidPlanningSlice";
import { filedownloadContainer } from "store/file/fileSlice";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import { getPercentageData, getfolderPath } from "utils";

/**
 * A custom hook that contains all the states and functions for the BidMatrics Controller
 */
const BidMatricsController = () => {
    const { file_id, file_name } = useParams()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState({ label: 10, value: 10 })
    const [processFilePercent, setProcessFilePercent] = useState<number>(0)
    const [selectFile, setSelectFile] = useState<any>(null)

    // Define and initialize various states
    const {
        isLoadinFileInputError,
        isLoadingProcessFile,
        fileInputErrorData,
        bidFileLanesTableGraph,
        isLoadingProcessFileStatusData,
        processFileStatusData,
        keyMetricsDetail,
        isLoadingSingleFile,
        singleFileDetails,
        isLoadinBidFileLanesTableGraph,
        isLoadingErrorInputBidExport
    } = useAppSelector((state: any) => state.bidPlanning);

    const {
    fileDownloadLoading
    } = useAppSelector((state: any) => state.file);
    
    useEffect(() => {
        const payloadDetail = {
            fileName: file_name,
            file_id: file_id
        }
        dispatch(getKeyMetricsDetail(payloadDetail));
        dispatch(getBidFileLanesTableGraph(payloadDetail));
        dispatch(getBidFileDetail({ file_id: file_id }))
    }, [dispatch, file_id, file_name])


    useEffect(() => {
        dispatch(fileMatricsInputError({
            "fileName": file_name,
            "page_size": pageSize?.value,
            "page": pageNumber,
            "search": "",
            "status_id": 1
        }));
    }, [file_name, pageSize, pageNumber, dispatch])

    const handleProcessFile = () => {
        setSelectFile({ fileId: file_id, fileName: file_name })
        dispatch(processBidNewLanes({ file_id: Number(file_id), isDataMatrix:true  }))
        setProcessFilePercent(0)
    }

    const handleClickDownloadErrorReport = () => {
        dispatch(exportErrorListBidInput({
            file_name: file_name,
            file_id: file_id
        }))
    }

    const downloadFile = () => {
        dispatch(
            filedownloadContainer({
                data: {
                    downloadPath: getfolderPath("bid_planning", true, singleFileDetails?.data?.file_detail?.name),
                    fileName: singleFileDetails?.data?.file_detail?.name
                }
            })
        );
    }

    useEffect(() => {
        let intervalCall: any
        const checkTime = process.env.REACT_APP_PROGRESS_TIME ? +process.env.REACT_APP_PROGRESS_TIME : 5000
        if (selectFile) {
            intervalCall = setInterval(() => {
                if (processFileStatusData?.data?.total >= 0) {
                    if (processFileStatusData?.data?.is_processed < processFileStatusData?.data?.total) {
                        dispatch(processStatusBidFile({ fileId: selectFile?.fileId }))
                    } else {
                        dispatch(processBidFileData({ file_id: selectFile?.fileId, isDataMatrix:true }))
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
        if (processFileStatusData?.data?.total > 0) {
            setProcessFilePercent(getPercentageData(processFileStatusData?.data?.total, processFileStatusData?.data?.is_processed))
        }
    }, [processFileStatusData]);

    useEffect(() => {
        if (selectFile) {
            if (processFileStatusData?.data?.is_error > 0) {
                if (processFileStatusData?.data?.total === (processFileStatusData?.data?.is_error + processFileStatusData?.data?.is_processed)) {
                    dispatch(processBidNewLanesCounter({ fileName: selectFile?.fileName, file_id: selectFile?.fileId,isDataMatrix:true  }))
                }
            }
        }
    }, [processFileStatusData, dispatch, selectFile]);


    useEffect(() => {
        if (singleFileDetails?.data?.file_detail?.status_id === 7) {
            setSelectFile({ fileId: file_id, fileName: file_name })
            dispatch(processStatusBidFile({ fileId: file_id,  isDataMatrix:true  }))
        }
    }, [dispatch, singleFileDetails, file_id, file_name])

    const handleBidFileList = () => {
        dispatch(resetMatrics())
        navigate("/scope3/bid-planning")
    }

    // Return all the states and functions
    return {
        processFilePercent,
        handleProcessFile,
        file_name,
        handleBidFileList,
        pageSize,
        setPageSize,
        pageNumber,
        setPageNumber,
        isLoadinFileInputError,
        isLoadingProcessFile,
        fileInputErrorData,
        bidFileLanesTableGraph,
        isLoadingProcessFileStatusData,
        processFileStatusData,
        keyMetricsDetail,
        isLoadingSingleFile,
        singleFileDetails,
        isLoadinBidFileLanesTableGraph,
        handleClickDownloadErrorReport,
        isLoadingErrorInputBidExport,
        downloadFile,
        fileDownloadLoading
    };
};

// Exporting the custom hook for use in other components
export default BidMatricsController;