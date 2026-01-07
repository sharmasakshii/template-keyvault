import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getEvFilterDates, getEvShipmentMatrics, getlistOfCarriers, getShipmentByDate, getShipmentLane, getShipmentLaneList } from "store/scopeThree/track/evDashboard/evDashboardSlice";
import { useAppDispatch, useAppSelector } from "store/redux.hooks"
import { getOrder } from "utils";
import { getConfigConstants } from "store/sustain/sustainSlice";

const EvDashboardController = () => {
    const [showAll, setShowAll] = useState(false);
    const { countryCode, carrierScac } = useParams()
    const [startDate, setStartDate] = useState<any>()
    const [endDate, setEndDate] = useState<any>()
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState({ label: 10, value: 10 })
    const [carrierCode, setCarrierCode] = useState(carrierScac);
    const [selectedLane, setSelectedLane] = useState<any>(null)
    const [showFullScreen, setShowFullScreen] = useState(false)
    const [order, setOrder] = useState("desc");
    const [colName, setColName] = useState("shipment");
    const mapRef = useRef<any>(null)
    const dispatch = useAppDispatch()


    const { isLoadingEvMatrics, evMatricsData, isLoadingEvFilterDate,
        evFilterData, isLoadingShipmentLane, shipmentLaneData,
        isLoadingShipmentByDate, shipmentByDateData,
        isLoadingEvShipmentLaneList, evShipmentLaneListData, listOfCarriers, isLoadingListOfCarriers } = useAppSelector((state: any) => state.evDashboard)
    const {
        configConstants,
    } = useAppSelector((state: any) => state.sustain);
    const handleChangeOrder = (chooseColName: string) => {
        setOrder(getOrder(order));
        setColName(chooseColName);
    };

    useEffect(() => {
        if (countryCode) {
            dispatch(
                getlistOfCarriers({
                    country: countryCode === "all" ? "" : countryCode
                })
            );
        }
    }, [dispatch, countryCode]);

    useEffect(() => {
        dispatch(getConfigConstants({ region_id: "", division_id: "" }));
    }, [dispatch]);

    useEffect(() => {
        if (evFilterData?.data?.end_date) {
            setStartDate(moment.utc(evFilterData.data.end_date).subtract(6, "days").format("YYYY-MM-DD"));
            setEndDate(moment.utc(evFilterData.data.end_date).format("YYYY-MM-DD"))
        }
    }, [evFilterData]);

    useEffect(() => {
        if (countryCode && carrierCode) {
            dispatch(getEvFilterDates({ country: countryCode === "all" ? "" : countryCode, code: carrierCode }))
            setCurrentPage(1)
        }
    }, [dispatch, countryCode, carrierCode])

    useEffect(() => {
        if (evShipmentLaneListData?.data?.responseData?.length > 0 && carrierCode !== "HJBT") {
            setSelectedLane(evShipmentLaneListData?.data?.responseData[0])
        }
    }, [evShipmentLaneListData, carrierCode]);

    useEffect(() => {
        if (countryCode && evFilterData?.data?.scac?.[0] === carrierCode) {
            const payload = {
                start_date: moment(startDate).format("YYYY-MM-DD"),
                end_date: moment(endDate).format("YYYY-MM-DD"),
                scac: carrierCode,
                country_code: countryCode === "all" ? "" : countryCode
            }
            dispatch(getShipmentLane(payload))
            dispatch(getEvShipmentMatrics(payload))
            dispatch(getShipmentByDate(payload))
        }
    }, [dispatch, countryCode, carrierCode, startDate, endDate, evFilterData])

    useEffect(() => {
        if (countryCode && evFilterData?.data?.scac?.[0] === carrierCode) {
            dispatch(
                getShipmentLaneList({
                    start_date: moment(startDate).format("YYYY-MM-DD"),
                    end_date: moment(endDate).format("YYYY-MM-DD"),
                    page: currentPage,
                    page_size: pageSize?.value,
                    order_by: order,
                    col_name: colName,
                    scac: carrierCode,
                    country_code: countryCode === "all" ? "" : countryCode
                })
            )
            setSelectedLane(null)
        }
    }, [dispatch, evFilterData, countryCode, carrierCode, pageSize, currentPage, startDate, endDate, order, colName])

    const MAX_VISIBLE_CARRIERS = 7;
    const visibleCarriers = showAll ? listOfCarriers?.data : listOfCarriers?.data?.slice(0, MAX_VISIBLE_CARRIERS);
    const hiddenCount = listOfCarriers?.data?.length - MAX_VISIBLE_CARRIERS;

    return {
        evFilterData,
        startDate, setStartDate,
        endDate, setEndDate,
        carrierCode, setCarrierCode,
        currentPage, setCurrentPage,
        pageSize, setPageSize,
        isLoadingShipmentLane,
        shipmentLaneData,
        isLoadingShipmentByDate,
        shipmentByDateData,
        isLoadingEvMatrics,
        evMatricsData,
        isLoadingEvFilterDate,
        isLoadingEvShipmentLaneList,
        evShipmentLaneListData,
        order,
        colName,
        selectedLane,
        setSelectedLane,
        mapRef,
        handleChangeOrder,
        showFullScreen, setShowFullScreen,
        listOfCarriers, isLoadingListOfCarriers,
        visibleCarriers,
        hiddenCount, showAll, setShowAll, configConstants
    }
}

export default EvDashboardController