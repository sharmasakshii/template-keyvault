// Importing necessary React hooks and functions
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';
import { useParams } from 'react-router-dom';
import { getRegionOverviewDetail, laneGraphData, regionCarrierComparison } from 'store/scopeThree/track/lane/laneDetailsSlice';
import { regionFacilityEmissions } from 'store/scopeThree/track/region/regionOverviewSlice';
import { getCompanyName, getGraphData, getGraphDataHorizontal, isCompanyEnable, getTimeIds, getTimeCheck } from 'utils';
import { getDivisionList, regionShow } from 'store/commonData/commonSlice';
import { businessUnitGraphData } from 'store/businessUnit/businessUnitSlice';
import { companySlug } from "constant"
import { emissionRegionDetails, getConfigConstants } from 'store/sustain/sustainSlice';


/**
 * A custom hook that contains all the states and functions for the RegionalController
 */
const RegionOverviewController = () => {

    // Get the route parameters
    const params :any = useParams();
    const { regionId = "1" } = params;
    const currentPage = 1
    const pageSize = 10

    // Define dispatch function from Redux store
    const dispatch = useAppDispatch();

    const [pId, setPId] = useState<any>(params?.pId);
    const [weekId, setWeekId] = useState<any>(params?.weekId);
    const [timeId, setTimeId] = useState<any>(0);

    // Define and initialize all the necessary states
    const [checkedEmissionsReductionGlide, setCheckedEmissionsReductionGlide] = useState(true)
    const [regionName, setRegionName] = useState<number | null>(null)
    const [reloadData, setReloadData] = useState<any>(true)
    const [checked, setChecked] = useState(true);
    const [checkedEmissions, setCheckedEmissions] = useState(true);
    const [yearlyData1, setYearlyData1] = useState<any>(Number(params?.years))
    const [checkedFacilityEmissions, setCheckedFacilityEmissions] = useState(true);
    const [checkedBusinessUnit, setCheckedBusinessUnit] = useState(true);
    const [yearlyData, setYearlyData] = useState<any>(Number(params?.years));
    const [quarterDetails, setQuarterDetails] = useState<string | number>(Number(params?.quarters) || 0);

    // Get relevant data from Redux store using selector hooks
    const { regions, emissionDates, divisions, timePeriodList } = useAppSelector((state: any) => state.commonData);
    const { regionEmission, regionEmissionIsLoading } = useAppSelector((state: any) => state.sustain);
    const { regionFacilityEmissionDto, regionFacilityEmissionIsLoading } = useAppSelector((state: any) => state.regionOverview);
    const { laneGraphDetails, laneGraphDetailsLoading, regionCarrierComparisonData, regionCarrierComparisonLoading, getRegionOverviewDetailData, getRegionOverviewDetailLoading } = useAppSelector((state) => state.lane);
    const { businessUnitGraphDetails, businessUnitGraphDetailsLoading } = useAppSelector((state: any) => state.businessUnit);
    const { loginDetails, userProfile, divisionId } = useAppSelector((state: any) => state.auth);
    const {
        configConstants,
    } = useAppSelector((state: any) => state.sustain);
    // Fetch data when necessary states change using useEffect

    // useEffect to scroll to the top of the page when the component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(()=>{
        setTimeId(getTimeIds(pId, weekId, timePeriodList))
    },[pId, weekId, timePeriodList])

    // Fetch regions when the component mounts
    useEffect(() => {
        dispatch(regionShow({ division_id: divisionId }));
    }, [dispatch, divisionId])

    useEffect(() => {
        if (isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo])) {
            dispatch(getDivisionList())
        }
    }, [dispatch, loginDetails])

    // Set regionName when regions data and route parameters change
    useEffect(() => {
        if (regions?.data) {
            setRegionName(regions?.data?.regions?.filter((i: any) => i?.name === regionId)[0]?.id)
        }
    }, [regions, regionId, params])

      useEffect(() => {
        dispatch(getConfigConstants({ region_id: "", division_id: "" }));
    
      }, [dispatch]);
    

    // Fetch region level glide path data
    useEffect(() => {
        if (yearlyData1 && regionName) {
            let payload:any = { 
                year: Number(yearlyData1), 
                region_id: regionName, 
                toggel_data: checkedEmissionsReductionGlide ? 0 : 1
            }
            if(isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo])){
                payload = {...payload, "division_id": divisionId }
            }
            dispatch(emissionRegionDetails(payload))
        }
    }, [dispatch, yearlyData1, regionName, checkedEmissionsReductionGlide, divisionId, loginDetails])


    useEffect(() => {
        if (regionName) {
            dispatch(
                laneGraphData({
                    page: currentPage,
                    page_size: pageSize,
                    region_id: regionName,
                    ...getTimeCheck(yearlyData, quarterDetails, timeId ),
                    facility_id: "",
                    toggel_data: checked ? 1 : 0,
                    division_id: divisionId
                })
            );
        }
    }, [dispatch, regionName, checked, quarterDetails, timeId, yearlyData, divisionId])

    // Fetch region overview detail data
    useEffect(() => {
        if (regionName) {
            dispatch(
                getRegionOverviewDetail({
                    region_id: regionName,
                    division_id: divisionId,
                    ...getTimeCheck(yearlyData, quarterDetails, timeId )
                })
            );
        }
    }, [dispatch, regionName, yearlyData, timeId, quarterDetails, divisionId])

    // Fetch region carrier comparison data
    useEffect(() => {
        if (regionName) {
            dispatch(
                regionCarrierComparison({
                    page: currentPage,
                    page_size: pageSize,
                    region_id: regionName,
                    facility_id: "",
                    toggel_data: checkedEmissions ? 1 : 0,
                    division_id: divisionId,
                    ...getTimeCheck(yearlyData, quarterDetails, timeId )
                })
            );
        }
    }, [dispatch, regionName, checkedEmissions, yearlyData, timeId, quarterDetails, divisionId])

    // Fetch region facility emissions data
    useEffect(() => {
        if (isCompanyEnable(loginDetails?.data, [companySlug?.lw])) {
            dispatch(
                regionFacilityEmissions({
                    year: yearlyData,
                    quarter: quarterDetails,
                    region_id: regionName,
                    facility_id: "",
                    toggel_data: checkedFacilityEmissions ? 1 : 0,
                })
            );
        }
    }, [dispatch, loginDetails, regionName, yearlyData, quarterDetails, checkedFacilityEmissions])


    // Fetch data when necessary states change using useEffect
    useEffect(() => {
        if (regionName && isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo])) {
            dispatch(
                businessUnitGraphData({
                    region_id: regionName,
                    toggel_data: checkedBusinessUnit ? 1 : 0,
                    division_id: divisionId,
                    ...getTimeCheck(yearlyData, quarterDetails, timeId )
                })
            );
        }

    }, [dispatch, loginDetails, checkedBusinessUnit, regionName, yearlyData, timeId, quarterDetails, divisionId]);

    // Get formatted arrays for various graph data
    let lanePageArr = getGraphData(laneGraphDetails);
    let laneCarrierArr = getGraphData(regionCarrierComparisonData);
    let laneFacilityEmessionArr = getGraphDataHorizontal(regionFacilityEmissionDto);
    const companyName = getCompanyName((loginDetails?.data, true))
    let businessUnitList = getGraphDataHorizontal(businessUnitGraphDetails, "OTHER");
    // Return all the states and functions
    return {
        companyName,
        userProfile,
        params,
        checked,
        emissionDates,
        yearlyData1,
        checkedFacilityEmissions,
        checkedEmissions,
        reloadData,
        lanePageArr,
        checkedEmissionsReductionGlide,
        getRegionOverviewDetailData,
        regionEmission,
        regionEmissionIsLoading,
        regionCarrierComparisonData,
        regionFacilityEmissionIsLoading,
        regionFacilityEmissionDto,
        laneGraphDetailsLoading,
        laneGraphDetails,
        laneCarrierArr,
        regionCarrierComparisonLoading,
        laneFacilityEmessionArr,
        setCheckedEmissionsReductionGlide,
        setCheckedEmissions,
        setChecked,
        setCheckedFacilityEmissions,
        setReloadData,
        setYearlyData1,
        businessUnitList,
        businessUnitGraphDetails,
        businessUnitGraphDetailsLoading,
        checkedBusinessUnit,
        setCheckedBusinessUnit,
        getRegionOverviewDetailLoading,
        yearlyData,
        setYearlyData,
        setQuarterDetails,
        quarterDetails,
        pId,
        setPId,
        regions,
        divisions,
        timePeriodList,
        loginDetails,
        divisionId,
        regionName,
        weekId, 
        setWeekId,
        configConstants
    };
};

// Exporting the custom hook for use in other components
export default RegionOverviewController;