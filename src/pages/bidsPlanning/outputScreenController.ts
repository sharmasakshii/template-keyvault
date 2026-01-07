import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBidFileDetail, getDestinationBidOutput, getEmissionCostImpactBarChartBidPlanning, getKeyMetricsSummaryOutput, getOriginBidOutput, getOutputOfBidPlanning, getOutputOfBidPlanningExport, getScacBidOutput, resetkeyMetricsSummaryOutput } from "store/bidPlanning/bidPlanningSlice";
import { createFileDownloadContainer, filedownloadContainer } from "store/file/fileSlice";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import bidPlanningService from "../../store/bidPlanning/bidPlanningService";
import { toast } from "react-toastify";


const getListDto = (data: any, key: string) => {
    return (Array.isArray(data) && data?.map((ele: any) => { return { label: ele?.[key], value: ele?.[key] } })) || []
}

/**
 * A custom hook that contains all the states and functions for the OutputScreenController
 */
const OutputScreenController = () => {

    const { file_id, file_name } = useParams()
    const [outputPageSize, setOutputPageSize] = useState({ label: 10, value: 10 })
    const [outputPageNumber, setOutputPageNumber] = useState(1)
    const [selectedScac, setSelectedScac] = useState<any>("")
    const [selectedOrigin, setSelectedOrigin] = useState<any>("")
    const [selectedDestination, setSelectedDestination] = useState<any>("")
    const [ifApplied, setIfApplied] = useState(false)
    const [menuIsOpen1, setMenuIsOpen1] = useState(false)
    const [menuIsOpen2, setMenuIsOpen2] = useState(false)
    const [menuIsOpen3, setMenuIsOpen3] = useState(false)
    const [isLoadFuel, setIsLoadFuel] = useState<any>(true);
    const [resFuel, setResFuel] = useState<any>(null);
    const [isLoadingFuelStop, setIsLoadingFuelStop] = useState<any>(false);

    const navigate = useNavigate()
    const dispatch = useAppDispatch();
    // Define and initialize various states
    const {
        isLoadingEmissionCostImpactBarChartBid,
        costImpactBarChartBid,
        isLoadingKeyMetricsSummaryOutput,
        keyMetricsSummaryOutput,
        isLoadingOutputDataOfBidPlanning,
        outputDataOfBidPlanning,
        isLoadingOriginBidOutput,
        originBidOutput,
        isLoadingDestinationBidOutput,
        destinationBidOutput,
        isLoadingScacBidOutput,
        scacBidOutput,
        isLoadingOutputOfBidPlanningExport,
        isLoadingSingleFile,
        singleFileDetails,
    } = useAppSelector((state: any) => state.bidPlanning);

    const { loginDetails } = useAppSelector((state: any) => state.auth);

    useEffect(() => {
        if (outputDataOfBidPlanning?.data && ifApplied) {
            dispatch(getOutputOfBidPlanning({
                file_name: file_name,
                file_id: file_id,
                page_size: outputPageSize?.value,
                page: outputPageNumber,
                origin: selectedOrigin?.value,
                dest: selectedDestination?.value,
                scac: selectedScac?.value
            }))
            setIfApplied(false)
        }
    }, [ifApplied, file_name, file_id, outputDataOfBidPlanning, dispatch, outputPageNumber, outputPageSize, selectedDestination, selectedOrigin, selectedScac])

    const handleSearchOrigin = (data: any) => {
        dispatch(getOriginBidOutput({ type: "origin", keyword: data, file_id: file_id }))
    }

    const searchDestination = (e: any) => {
        dispatch(getDestinationBidOutput({ type: "dest", source: e?.value, keyword: "", file_id: file_id }))
    }

    const handleSearchDestination = (data: any) => {
        if (!selectedOrigin?.value) {
            dispatch(getDestinationBidOutput({ type: "dest", source: selectedOrigin?.value || "", keyword: data, file_id: file_id }))
        }
    }

    const handleResetOutput = () => {
        setSelectedScac("");
        setSelectedOrigin("");
        setSelectedDestination("");
        setOutputPageSize({ label: 10, value: 10 })
        setOutputPageNumber(1)
        dispatch(getOutputOfBidPlanning({
            file_name: file_name,
            file_id: file_id,
            page_size: 10,
            page: 1,
        }))
    }

    useEffect(() => {
        dispatch(getEmissionCostImpactBarChartBidPlanning({ file_name: file_name, file_id: file_id }))
        dispatch(getKeyMetricsSummaryOutput({ file_id: file_id, file_name: file_name }))
        dispatch(getOutputOfBidPlanning({ file_id: file_id, file_name: file_name, page_size: 10, page: 1 }))
        dispatch(getBidFileDetail({ file_id: file_id }))
    }, [dispatch, file_id, file_name])

    const reverseLocation = () => {
        const origin = selectedOrigin;
        setSelectedOrigin(selectedDestination)
        setSelectedDestination(origin)
    }

    const handleSectionClick = () => {
        setMenuIsOpen1(false);
        setMenuIsOpen2(false);
        setMenuIsOpen3(false)
    };

    const downloadFile = (dataPayload: any) => {
        dispatch(
            filedownloadContainer({
                data: dataPayload
            })
        );
    };

    const handleDownLoadFile = () => {
        if (singleFileDetails?.data?.file_detail?.processing?.download_path) {
            const dataPayload = {
                downloadPath: singleFileDetails?.data?.file_detail?.processing?.download_path,
                fileName: singleFileDetails?.data?.file_detail?.name,
            }
            downloadFile(dataPayload)
        } else {
            dispatch(
                createFileDownloadContainer({
                    data: {
                        name: singleFileDetails?.data?.file_detail?.name,
                        file_id: singleFileDetails?.data?.file_detail?.id
                    },
                })
            );
        }
    };

    const handleOriginMenuChange = (event: any) => {
        event.stopPropagation();
        setMenuIsOpen1(!menuIsOpen1);
        setMenuIsOpen2(false)
        setMenuIsOpen3(false)
    }
    const handleDestinationMenuChange = (event: any) => {
        event.stopPropagation();
        setMenuIsOpen1(false);
        setMenuIsOpen2(!menuIsOpen2)
        setMenuIsOpen3(false)
    }

    const handleScacMenuChange = (event: any) => {
        event.stopPropagation();
        setMenuIsOpen1(false);
        setMenuIsOpen2(false)
        setMenuIsOpen3(!menuIsOpen3)
    }

    const handleSearchScac = (data: any) => {
        dispatch(getScacBidOutput({ page_limit: 20, keyword: data, file_id: file_id }))
    }

    const useViewAllFilesHandler = () => {
        const navigate = useNavigate();

        return () => {
            dispatch(resetkeyMetricsSummaryOutput());
            navigate("/scope3/bid-planning");
        };
    };

    const handleDownloadReport = () => {
        if (!selectedScac && !selectedOrigin && !selectedDestination) {
            handleDownLoadFile()
        } else {
            dispatch(getOutputOfBidPlanningExport({
                file_name: file_name,
                file_id: file_id,
                origin: selectedOrigin?.value,
                dest: selectedDestination?.value,
                scac: selectedScac?.value
            }))
        }
    }

    const originOptions = getListDto(originBidOutput?.data, "origin")

    const destinationOptions = getListDto(destinationBidOutput?.data, "dest")

    const scacOptions = getListDto(scacBidOutput?.data, "scac")

    if (isLoadFuel && keyMetricsSummaryOutput?.data?.bid_lanes?.length > 0) {
        const laneDto: any = {}
        setIsLoadFuel(false)
        setIsLoadingFuelStop(true)

        keyMetricsSummaryOutput?.data?.bid_lanes?.forEach((ele: any) => {
            laneDto[ele?.lane_name] = { origin: ele?.lane_name?.split("_")[0], destination: ele?.lane_name?.split("_")[1] }
        })
        bidPlanningService.getBioFuelStopApi({
            "company_id": loginDetails?.data?.Company?.UserCompany?.company_id,
            "lanes": laneDto
        }).then((res: any) => {
            setIsLoadFuel(false)
            setIsLoadingFuelStop(false)
            setResFuel(res)
        }).catch(() => {
            toast.error("Something went wrong")
            setIsLoadFuel(true)

        })
    }

    // Return Values
    return {
        isLoadingEmissionCostImpactBarChartBid,
        costImpactBarChartBid,
        isLoadingKeyMetricsSummaryOutput,
        keyMetricsSummaryOutput,
        isLoadingOutputDataOfBidPlanning,
        outputDataOfBidPlanning,
        outputPageSize,
        setOutputPageSize,
        outputPageNumber,
        setOutputPageNumber,
        setIfApplied,
        isLoadingOriginBidOutput,
        isLoadingDestinationBidOutput,
        selectedOrigin,
        setSelectedOrigin,
        selectedDestination,
        setSelectedDestination,
        selectedScac,
        setSelectedScac,
        searchDestination,
        menuIsOpen1,
        setMenuIsOpen1,
        menuIsOpen2,
        setMenuIsOpen2,
        menuIsOpen3,
        setMenuIsOpen3,
        originOptions,
        destinationOptions,
        handleSearchOrigin,
        handleSearchDestination,
        handleOriginMenuChange,
        handleDestinationMenuChange,
        handleSectionClick,
        reverseLocation,
        isLoadingScacBidOutput,
        handleSearchScac,
        scacOptions,
        handleScacMenuChange,
        handleDownloadReport,
        isLoadingOutputOfBidPlanningExport,
        handleResetOutput,
        navigate,
        isLoadingFuelStop,
        resFuel,
        handleDownLoadFile,
        isLoadingSingleFile,
        useViewAllFilesHandler
    };
};

// Exporting the custom hook for use in other components
export default OutputScreenController;