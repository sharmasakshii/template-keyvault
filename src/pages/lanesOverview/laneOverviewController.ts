// Import necessary modules and functions from external files
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { companySlug } from "constant"
import {
    getGraphData,
    sortIcon,
    getOrder,
    isCompanyEnable,
    getTimeCheck,
    getTimeIds
} from 'utils'; // Importing from a constant file
import { getLaneOverDetailsEmission, laneCarrierEmissionReductionGlide, laneReductionDetailGraph } from 'store/scopeThree/track/lane/laneDetailsSlice';
import { laneCarrierTableData } from 'store/scopeThree/track/carrier/vendorSlice';
import { getDivisionList, regionShow } from 'store/commonData/commonSlice';
import { getConfigConstants } from 'store/sustain/sustainSlice';

/**
 * A custom hook that contains all the states and functions for the LaneOverviewController
 */
const LaneOverviewController = () => {
    // Define dispatch and navigate functions
    const params = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { laneName } = params;


    // Define and initialize all the necessary states
    const [checkedEmissions, setCheckedEmissions] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [reloadData, setReloadData] = useState(true);
    const [searchCarrier, setSearchCarrier] = useState("");
    const [order, setOrder] = useState("desc");
    const [col_name, setCol_name] = useState("intensity");
    const [pageSize, setPageSize] = useState({ label: 20, value: 20 });
    const [checkedEmissionsReductionGlide, setCheckedEmissionsReductionGlide] = useState(true);
    const [yearlyData1, setYearlyData1] = useState<any>(Number(params?.years));
    const [yearlyData, setYearlyData] = useState<any>(Number(params?.years));
    const [quarterDetails, setQuarterDetails] = useState<string | number>(Number(params?.quarters) || 0);
    const [showFullScreen, setShowFullScreen] = useState(false)
    const [pId, setPId] = useState<any>(params?.pId);
    const [weekId, setWeekId] = useState<any>(params?.weekId);
    const [timeId, setTimeId] = useState<any>(0);

    // Get relevant data from Redux store using selector hooks
    const { laneCarrierTableDto, laneCarrierTableDtoLoading } = useAppSelector((state) => state.carrier);
    const { laneCarrierEmissionIsloading, laneReductionDetailGraphLoading, laneCarrierEmission, laneReductionDetailGraphData, getLaneOverDetailsEmissionData, getLaneOverDetailsEmissionLoading } = useAppSelector((state) => state.lane);
    const { emissionDates, regions, divisions, timePeriodList } = useAppSelector((state) => state.commonData);
    const { configConstants } = useAppSelector((state: any) => state.sustain);
    let laneCarrierArr = getGraphData(laneReductionDetailGraphData);
    const { loginDetails, regionalId, divisionId } = useAppSelector((state: any) => state.auth);

    // Fetch data when necessary states change using useEffect
    useEffect(() => {
        setTimeId(getTimeIds(pId, weekId, timePeriodList))
    }, [pId, weekId, timePeriodList])

    useEffect(() => {
        dispatch(regionShow({ division_id: divisionId }));;
    }, [dispatch, divisionId]);

     useEffect(() => {
        dispatch(getConfigConstants({ region_id: "", division_id: "" }));
      }, [dispatch]);

    useEffect(() => {
        if (isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo])) {
            dispatch(getDivisionList())
        }
    }, [dispatch, loginDetails])

    // Effect to fetch lane carrier emissions reduction and glide data
    useEffect(() => {
        dispatch(
            laneCarrierEmissionReductionGlide({
                lane_name: laneName,
                year: yearlyData1,
                toggel_data: checkedEmissionsReductionGlide ? 0 : 1,
                region_id: regionalId,
                division_id: divisionId
            })
        );
    }, [dispatch, regionalId, laneName, yearlyData1, checkedEmissionsReductionGlide, divisionId]);

    // Effect to fetch lane overview details emissions data
    useEffect(() => {
        dispatch(getLaneOverDetailsEmission({
            lane_name: laneName,
            ...getTimeCheck(yearlyData, quarterDetails, timeId),
            division_id: divisionId
        }));
    }, [dispatch, laneName, yearlyData, timeId, quarterDetails, divisionId]);

    // Effect to fetch table data based on search and filters
    useEffect(() => {
        if ((searchCarrier?.length === 0 || searchCarrier?.length >= 3) && !isCompanyEnable(loginDetails?.data, [companySlug.adm, companySlug.tql])) {
            dispatch(
                laneCarrierTableData({
                    region_id: regionalId,
                    page: currentPage,
                    lane_name: laneName,
                    page_size: pageSize?.value,
                    order_by: order,
                    col_name: col_name,
                    search_name: searchCarrier,
                    ...getTimeCheck(yearlyData, quarterDetails, timeId),
                    division_id: divisionId
                })
            );
        }
    }, [dispatch, regionalId, currentPage, timeId, loginDetails, order, col_name, pageSize, searchCarrier, laneName, yearlyData, quarterDetails, divisionId]);

    // Effect to scroll to the top of the page when the component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Effect to fetch lane reduction detail graph data
    useEffect(() => {
        dispatch(
            laneReductionDetailGraph({
                page: currentPage,
                page_size: pageSize?.value,
                facility_id: "",
                toggel_data: checkedEmissions ? 1 : 0,
                lane_name: laneName,
                region_id: regionalId,
                ...getTimeCheck(yearlyData, quarterDetails, timeId),
                division_id: divisionId
            })
        );
    }, [dispatch, regionalId, checkedEmissions, currentPage, timeId, laneName, pageSize, yearlyData, quarterDetails, divisionId]);

    // Function to handle carrier search input change
    const handleSearchCarrier = (e: any) => {
        setSearchCarrier(e.target.value);
    };

    // Function to handle column sorting
    const handleChangeOrder = (choose_Col_name: string) => {
        setOrder(getOrder(order));
        setCol_name(choose_Col_name);
    };

    // let paginationOption = getPaginationOptions(pageSizeList)
    // paginationOption = [...paginationOption, { value: laneCarrierTableDto?.data?.pagination?.total_count ? laneCarrierTableDto?.data?.pagination?.total_count : 10, label: 'All' }]
    // Return all the states and functions
    return {
        reloadData,
        laneCarrierArr,
        checkedEmissionsReductionGlide,
        laneCarrierEmissionIsloading,
        laneReductionDetailGraphLoading,
        laneCarrierEmission,
        laneReductionDetailGraphData,
        getLaneOverDetailsEmissionData,
        checkedEmissions,
        yearlyData1,
        setCheckedEmissions,
        setYearlyData1,
        setCheckedEmissionsReductionGlide,
        laneCarrierTableDto,
        col_name,
        order,
        currentPage,
        laneName,
        pageSize,
        searchCarrier,
        emissionDates,
        setPageSize,
        navigate,
        handleSearchCarrier,
        setCurrentPage,
        setReloadData,
        handleChangeOrder,
        sortIcon,
        yearlyData,
        setYearlyData,
        quarterDetails,
        setQuarterDetails,
        getLaneOverDetailsEmissionLoading,
        showFullScreen,
        setShowFullScreen,
        pId,
        setPId,
        weekId,
        setWeekId,
        loginDetails,
        timePeriodList,
        regionalId, divisionId,
        regions, divisions,
        laneCarrierTableDtoLoading,
        configConstants
    };
};

export default LaneOverviewController;
