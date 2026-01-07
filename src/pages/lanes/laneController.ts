import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';
import { isCompanyEnable, getQuarterData, getOrder, getRegionOptions, getDivisionOptions, getTimeCheck, getTimeIds } from 'utils';
import { regionShow } from 'store/commonData/commonSlice';
import { getCarrierEmissionData, getLaneEmissionData, resetLaneOdPair } from 'store/scopeThree/track/lane/laneDetailsSlice';
import { companySlug } from "constant";
import { getConfigConstants } from "store/sustain/sustainSlice";

/**
 * Controller component for the LanesView page.
 * Manages state and logic for the LanesView page.
 * @returns All controllers and state variables for the LanesView page.
 */
const LaneController = () => {
    // Define initial state variables
    const { loginDetails, regionalId, divisionId } = useAppSelector((state: any) => state.auth)
    const [pId, setPId] = useState<any>(0);
    const [weekId, setWeekId] = useState<any>(0);
    const [timeId, setTimeId] = useState<any>(0);
    const [divisionLevel, setDivisionLevel] = useState(divisionId)
    const [yearlyData, setYearlyData] = useState<any>(null);
    const [pageSize, setPageSize] = useState({ label: 10, value: 10 })
    const [regionalLevel, setRegionalLevel] = useState(regionalId);
    const [quarterDetails, setQuarterDetails] = useState<any>(null);
    const [regionName, setRegionName] = useState('');
    const [order, setOrder] = useState('desc');
    const [colName, setColName] = useState('intensity');
    const [orderLane, setOrderLane] = useState<string>("desc");
    const [colNameLane, setColNameLane] = useState<string>("intensity");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [currentPage, setCurrentPage] = useState(1)
    const childRef = useRef<any>(null);
    const [originCity, setOriginCity] = useState<any>(null);
    const [destinationCity, setDestinationCity] = useState<any>(null);

    // Select data from the Redux store using custom hooks
    const { laneEmissionData, isLaneEmissionDataLoading, carrierEmissionData, isCarrierEmissionDataLoading } = useAppSelector((state) => state.lane);
    const { regions, divisions, timePeriodList } = useAppSelector((state: any) => state.commonData);

    const { configConstants } = useAppSelector((state: any) => state.sustain);

    useEffect(() => {
        setTimeId(getTimeIds(pId, weekId, timePeriodList))
    }, [pId, weekId, timePeriodList])

    useEffect(() => {
        dispatch(getConfigConstants({ region_id: "", division_id: "" }));
    }, [dispatch]);

    useEffect(() => {
        if (configConstants) {
            setYearlyData(Number.parseInt(configConstants?.data?.DEFAULT_YEAR));
            setQuarterDetails(getQuarterData(configConstants?.data?.DEFAULT_QUARTER))
            setPId(Number.parseInt(configConstants?.data?.DEFAULT_PERIOD || 0));
        }
    }, [configConstants])


    // Function to handle changing the sorting order
    const handleChangeOrder = (chooseColName: string) => {
        setOrder(getOrder(order));
        setColName(chooseColName);
    };

    const handleLaneSort = (chooseColName: string) => {
        setOrderLane(getOrder(orderLane));
        setColNameLane(chooseColName);
    };

    const handleSortBy = (sortBy: string) => {
        setOrderLane(sortBy);
        setColNameLane("intensity");
    };

    // Fetch regions data when the component mounts
    useEffect(() => {
        dispatch(regionShow({ division_id: divisionLevel }));;
    }, [dispatch, divisionLevel]);

    // Fetch lane graph data when relevant dependencies change

    useEffect(() => {
        if (yearlyData) {
            const origin = originCity ? `${originCity}` : ''
            const destination = destinationCity ? `${destinationCity}` : ''
            dispatch(
                getLaneEmissionData({
                    page: currentPage,
                    page_size: pageSize?.value,
                    region_id: regionalLevel,
                    division_id: divisionLevel,
                    origin: origin,
                    dest: destination,
                    col_name: colNameLane === "intensityAvg" ? "intensity" : colNameLane,
                    order_by: orderLane,
                    ...getTimeCheck(yearlyData, quarterDetails, timeId)

                })
            );
        }
    }, [dispatch, yearlyData, quarterDetails, timeId, regionalLevel, colNameLane, orderLane, currentPage, pageSize, divisionLevel, originCity, destinationCity]);

    // Update regionName when regionalLevel or regions data changes
    useEffect(() => {
        setRegionName(
            regions?.data?.regions?.find((i: any) => Number.parseInt(i.id) === Number.parseInt(regionalLevel))?.name || ''
        );
    }, [regionalLevel, regions]);

    // Options for selectors
    let regionOption = getRegionOptions(regions?.data?.regions)

    let divisionOptions = getDivisionOptions(divisions?.data)
    const getCarrier = (name: string) => {
        if (!isCompanyEnable(loginDetails?.data, [companySlug.adm, companySlug?.tql])) {
            dispatch(getCarrierEmissionData({
                region_id: regionalLevel,
                division_id: divisionLevel,
                ...getTimeCheck(yearlyData, quarterDetails, timeId),
                lane_name: name
            }))

        }
    }

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
        setYearlyData(Number.parseInt(configConstants?.data?.DEFAULT_YEAR));
        setRegionalLevel(regionalId)
        dispatch(resetLaneOdPair());
        setColNameLane("intensity")
        setOrderLane("desc")
        setQuarterDetails(getQuarterData(configConstants?.data?.DEFAULT_QUARTER))
        setPId(0)
        dispatch(
            getLaneEmissionData({
                page: 1,
                page_size: 10,
                region_id: regionalId,
                division_id: divisionLevel,
                year: Number.parseInt(configConstants?.data?.DEFAULT_YEAR),
                quarter: Number.parseInt(configConstants?.data?.DEFAULT_QUARTER),
                time_id: 0,
                search_name: "",
                col_name: "intensity",
                order_by: "desc",
                origin: "",
                dest: "",
            })

        );

    };

    // Return the state variables and functions for use in the component
    return {
        quarterDetails,
        yearlyData,
        regionalLevel,
        regionName,
        laneEmissionData,
        isLaneEmissionDataLoading,
        pageSize,
        setPageSize,
        setRegionalLevel,
        setYearlyData,
        setQuarterDetails,
        regionOption,
        colName,
        order,
        navigate,
        handleChangeOrder,
        getCarrier,
        carrierEmissionData,
        isCarrierEmissionDataLoading,
        handleLaneSort,
        orderLane,
        colNameLane,
        handleSortBy,
        setCurrentPage,
        currentPage,
        childRef,
        handleChangeLocation,
        resetLane,
        pId,
        setPId,
        divisionOptions,
        divisionLevel,
        setDivisionLevel,
        regions,
        divisions,
        timePeriodList,
        loginDetails,
        weekId,
        setWeekId,
        dispatch,
        configConstants
    };
};

export default LaneController;
