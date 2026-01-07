// Import necessary modules and functions from external files
import { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';
import {
    getIntermodalReportFilterData,
    getIntermodalReportMatirxData,
    getLaneByShipmentMiles,
    getTopLanesShipmentData,
    getIntermodalMaxDate
} from 'store/intermodalReport/IntermodalReportSlice';
import { getOrder, isCompanyEnable } from 'utils';
import { getConfigConstants } from 'store/sustain/sustainSlice';
import { companySlug } from "constant";
import moment from "moment";

const IntermodalReportController = () => {
    // Define dispatch and navigate functions
    const [year, setYear] = useState<any>("")
    const [carrier, setCarrier] = useState<any>("")
    const [tableYear, setTableYear] = useState<any>("");
    const [tableCarrier, setTableCarrier] = useState<any>("");
    const [order, setOrder] = useState<string>("desc");
    const [colName, setColName] = useState<string>("total_distance");
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState({ label: 10, value: 10 })
    const myRef = useRef<any>(null)
    const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);
    const [showFullScreen, setShowFullScreen] = useState(false)
    const [laneName, setLaneName] = useState<any>(null);
    const [startDate, setStartDate] = useState<any>()
    const [endDate, setEndDate] = useState<any>()
    const childRef = useRef<any>(null);
    const [originCity, setOriginCity] = useState<any>(null);
    const [destinationCity, setDestinationCity] = useState<any>(null);

    const dispatch = useAppDispatch();
    const {
        intermodalReportMatrixData,
        intermodalFilterData,
        isLoadingIntermodalReportMatrixData,
        topLanesByShipmentData,
        isLoadingTopLanesByShipmentData,
        isLoadingIntermodalFilterData,
        getViewLanesData,
        getLaneByShipmentMilesGraph,
        isLoadingLaneByShipmentMilesGraph,
        intermodalMaxDateGraph
    } = useAppSelector((state) => state.intermodalReport);
    const {
        configConstants,
    } = useAppSelector((state: any) => state.sustain);
    const { loginDetails } = useAppSelector((state: any) => state.auth);

    useEffect(() => {
        if (intermodalMaxDateGraph?.data) {
            setStartDate(moment.utc(intermodalMaxDateGraph.data[0].date).subtract(1, "month").format("YYYY-MM-DD"));
            setEndDate(moment.utc(intermodalMaxDateGraph.data[0].date).format("YYYY-MM-DD"))
        }
    }, [intermodalMaxDateGraph]);

    useEffect(() => {
        dispatch(getIntermodalReportFilterData({
            year: year,
            start_date: startDate,
            end_date: endDate
        }));

    }, [dispatch, year, startDate, endDate]);


    useEffect(() => {
        if (isCompanyEnable(loginDetails?.data, [companySlug?.bmb])) {
            dispatch(getIntermodalMaxDate({
                carrier_name: carrier,
            }));
        }
    }, [dispatch, carrier, loginDetails]);


    useEffect(() => {
        dispatch(getIntermodalReportMatirxData({
            year: year,
            carrier_name: carrier,
            start_date: startDate,
            end_date: endDate
        }));

    }, [dispatch, year, carrier, startDate, endDate]);

    useEffect(() => {
        dispatch(getTopLanesShipmentData({
            year: tableYear,
            carrier_name: tableCarrier,
            page: currentPage,
            page_size: pageSize?.value,
            column: colName,
            order_by: order,
            start_date: startDate,
            end_date: endDate,
            lane_name: originCity ? `${originCity}_${destinationCity ?? ''}` : ''
        }));

    }, [dispatch, tableYear, originCity, destinationCity, tableCarrier, currentPage, pageSize?.value, colName, order, startDate, endDate]);



    useEffect(() => {
        setTableCarrier(carrier);
    }, [carrier]);

    useEffect(() => {
        dispatch(getLaneByShipmentMiles((
            {
                year: year,
                carrier_name: carrier,
                start_date: startDate,
                end_date: endDate
            }
        )))
    }, [year, carrier, dispatch, startDate, endDate]);

    const handlePageChange = (e: any) => {
        setPageSize(e);
        setCurrentPage(1);
    };

    useEffect(() => {
        if (topLanesByShipmentData?.data?.list?.length > 0) {
            setSelectedRowKey("row-0");
            setLaneName(topLanesByShipmentData?.data?.list[0])
        }
    }, [topLanesByShipmentData]);

    const handleClickColumn = (column: string) => {
        setColName(column);
        setOrder(getOrder(order));
    }

    useEffect(() => {
        dispatch(getConfigConstants({ region_id: "" }));
    }, [dispatch,]);

    useEffect(() => {
        if (configConstants) {
            setYear(Number.parseInt(configConstants?.data?.default_intermodal_year));
            setTableYear(Number.parseInt(configConstants?.data?.default_intermodal_year));

        }
    }, [configConstants])

    const handleChangeLocation = (origin: string, destination: string) => {
        setOriginCity(origin);
        setDestinationCity(destination);
        setPageSize({ label: 10, value: 10 });
        setCurrentPage(1)
    };

    const resetLane = () => {
        setOriginCity(null);
        setDestinationCity(null);
        setCurrentPage(1);
        setPageSize({ label: 10, value: 10 });

    };

    return {
        order, setOrder,
        colName, setColName,
        currentPage, setCurrentPage,
        pageSize, setPageSize,
        handlePageChange,
        myRef,
        showFullScreen, setShowFullScreen,
        laneName, setLaneName,
        intermodalReportMatrixData,
        intermodalFilterData,
        isLoadingIntermodalReportMatrixData,
        topLanesByShipmentData,
        isLoadingTopLanesByShipmentData,
        isLoadingIntermodalFilterData,
        setYear,
        setCarrier,
        getViewLanesData,
        selectedRowKey, setSelectedRowKey,
        handleClickColumn,
        getLaneByShipmentMilesGraph,
        isLoadingLaneByShipmentMilesGraph,
        setTableYear,
        setTableCarrier,
        carrier,
        tableCarrier,
        tableYear,
        configConstants,
        year,
        loginDetails,
        startDate, setStartDate,
        endDate, setEndDate,
        handleChangeLocation,
        childRef,
        resetLane,
        intermodalMaxDateGraph
    };
};

export default IntermodalReportController;

