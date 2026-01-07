// Importing necessary React hooks and functions
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';
import { useParams } from 'react-router-dom';
import { getGraphData, getTimeCheck, getTimeIds } from '../../utils';
import { businessUnitOverviewDetail, businessUnitGlidePath, businessLaneGraphData, businessCarrierComparison, businessRegionGraphData } from '../../store/businessUnit/businessUnitOverviewSlice';
import { getDivisionList } from 'store/commonData/commonSlice';
import { getConfigConstants } from 'store/sustain/sustainSlice';
/**
 * A custom hook that contains all the states and functions for the RegionalController
 */
const BusinessUnitOverviewController = () => {

    const params = useParams();

    // Define and initialize all the necessary states
    const [checkedEmissionsReductionGlide, setCheckedEmissionsReductionGlide] = useState(true)
    const [reloadData, setReloadData] = useState(true)
    const [checked, setChecked] = useState(true);
    const [checkedRegion, setCheckedRegion] = useState(true);
    const [checkedEmissions, setCheckedEmissions] = useState(true);
    const [yearlyData1, setYearlyData1] = useState<any>(Number(params?.years));
    const [yearlyData, setYearlyData] = useState<any>(Number(params?.years));
    const [quarterDetails, setQuarterDetails] = useState<string | number>(Number(params?.quarters));
    const [pId, setPId] = useState<any>(params?.pId);
    const [weekId, setWeekId] = useState<any>(params?.weekId);
    const [timeId, setTimeId] = useState<any>(0);

    // Get relevant data from Redux store using selector hooks
    const { emissionDates, regions, divisions, timePeriodList } = useAppSelector((state: any) => state.commonData);
    const { loginDetails, regionalId, divisionId } = useAppSelector((state: any) => state.auth);
    const { businessUnitOverviewDetailData,
        businessUnitLevelGlideData,
        isLoadingBusinessUnitLevelGlidePath,
        businessLaneGraphDetails,
        businessLaneGraphDetailsLoading,
        businessCarrierComparisonLoading,
        businessCarrierComparisonData,
        businessUnitRegionGraphDetailsLoading,
        businessUnitRegionGraphDetails,
        businessUnitOverviewDetailLoading
    } = useAppSelector((state) => state.businessUnitOverview);
    const {
        configConstants,
    } = useAppSelector((state: any) => state.sustain);
    // Get the route parameters
    const currentPage = 1
    const pageSize = 10
    const defaultUnit = configConstants?.data?.default_distance_unit
    // Define dispatch function from Redux store
    const dispatch = useAppDispatch();

    // Fetch data when necessary states change using useEffect

    // useEffect to scroll to the top of the page when the component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(()=>{
        setTimeId(getTimeIds(pId, weekId, timePeriodList))
    },[pId, weekId, timePeriodList]);    
    
    useEffect(() => {
        dispatch(getDivisionList())
    }, [dispatch, loginDetails])

      useEffect(() => {
        dispatch(getConfigConstants({ region_id: "", division_id: "" }));
      }, [dispatch]);

    // Fetch region level glide path data
    useEffect(() => {
        if (yearlyData1 && params) {
            dispatch(businessUnitGlidePath({
                bu_id: params?.businessUnitId,
                company_id: "",
                year: yearlyData1,
                toggel_data: checkedEmissionsReductionGlide ? 0 : 1,
                region_id: regionalId,
                division_id: divisionId
            }))
        }
    }, [dispatch, yearlyData1, regionalId, params, checkedEmissionsReductionGlide, divisionId])

    // Fetch lane graph data
    useEffect(() => {
        if (params) {
            dispatch(
                businessLaneGraphData({
                    page: currentPage,
                    page_size: pageSize,
                    bu_id: params?.businessUnitId,
                    toggel_data: checked ? 1 : 0,
                    region_id: regionalId,
                    ...getTimeCheck(yearlyData, quarterDetails, timeId ),
                    division_id: divisionId

                })
            );
        }
    }, [dispatch, params, regionalId, checked, yearlyData, timeId, quarterDetails, divisionId])


    // Fetch lane graph data
    useEffect(() => {
        if (params) {
            dispatch(
                businessRegionGraphData({
                    page: currentPage,
                    page_size: pageSize,
                    bu_id: params?.businessUnitId,
                    toggel_data: checkedRegion ? 1 : 0,
                    region_id: regionalId,
                    ...getTimeCheck(yearlyData, quarterDetails, timeId ),
                    division_id: divisionId

                })
            );
        }
    }, [dispatch, params, regionalId, checkedRegion, yearlyData, timeId, quarterDetails, divisionId])

    // Fetch region overview detail data
    useEffect(() => {
        if (params) {
            dispatch(
                businessUnitOverviewDetail({
                    bu_id: params?.businessUnitId,
                    region_id: regionalId,
                    ...getTimeCheck(yearlyData, quarterDetails, timeId ),
                    division_id: divisionId

                })
            );
        }
    }, [dispatch, params, regionalId, yearlyData, timeId, quarterDetails, divisionId])

    // Fetch region carrier comparison data
    useEffect(() => {
        if (params) {
            dispatch(businessCarrierComparison({
                page: currentPage,
                page_size: pageSize,
                bu_id: params?.businessUnitId,
                facility_id: "",
                toggel_data: checkedEmissions ? 1 : 0,
                region_id: regionalId,
                ...getTimeCheck(yearlyData, quarterDetails, timeId ),
                division_id: divisionId
            }))
        }
    }, [dispatch, regionalId, params, checkedEmissions, yearlyData, timeId, quarterDetails, divisionId])

    // Get formatted arrays for various graph data
    let lanePageArr = getGraphData(businessLaneGraphDetails);
    let laneCarrierArr = getGraphData(businessCarrierComparisonData);
    let regionCarrierArr = getGraphData(businessUnitRegionGraphDetails);

    // Return all the states and functions
    return {
        checked,
        reloadData,
        emissionDates,
        yearlyData1,
        checkedEmissions,
        lanePageArr,
        checkedEmissionsReductionGlide,
        businessCarrierComparisonData,
        businessLaneGraphDetailsLoading,
        businessLaneGraphDetails,
        laneCarrierArr,
        businessCarrierComparisonLoading,
        setCheckedEmissionsReductionGlide,
        setCheckedEmissions,
        setChecked,
        setReloadData,
        setYearlyData1,
        businessUnitOverviewDetailData,
        businessUnitLevelGlideData,
        isLoadingBusinessUnitLevelGlidePath,
        setCheckedRegion,
        checkedRegion,
        businessUnitRegionGraphDetailsLoading,
        businessUnitRegionGraphDetails,
        regionCarrierArr,
        yearlyData,
        setYearlyData,
        quarterDetails,
        setQuarterDetails,
        businessUnitOverviewDetailLoading,
        pId,
        setPId,
        loginDetails,
        regions, divisions, timePeriodList, regionalId, divisionId,
        weekId, 
        setWeekId,
        configConstants,
        defaultUnit
    };
};

// Exporting the custom hook for use in other components
export default BusinessUnitOverviewController;
