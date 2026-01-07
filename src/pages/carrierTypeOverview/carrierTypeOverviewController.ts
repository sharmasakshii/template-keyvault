// Importing necessary React hooks and functions
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';
import { useParams } from 'react-router-dom';
import {
    getCarrierTypeOverviewDetail, getCarrierTypeReductionGraph, getCarrierTypeLaneEmissionGraph

} from 'store/scopeThree/track/carrier/vendorSlice';
import { getCompanyName, getGraphData, getGraphDataHorizontal, getTimeIds, getTimeCheck } from 'utils';
import { regionShow } from 'store/commonData/commonSlice';
import { getConfigConstants } from 'store/sustain/sustainSlice';


/**
 * A custom hook that contains all the states and functions for the RegionalController
 */
const CarrierTypeOverviewController = () => {

    // Get the route parameters
    const params: any = useParams();
    const currentPage = 1
    const pageSize = 10

    // Define dispatch function from Redux store
    const dispatch = useAppDispatch();

    const [pId, setPId] = useState<any>(params?.pId);
    const [weekId, setWeekId] = useState<any>(params?.weekId);
    const [timeId, setTimeId] = useState<any>(0);

    // Define and initialize all the necessary states
    const [checkedEmissionsReductionGlide, setCheckedEmissionsReductionGlide] = useState(true)
    const [reloadData, setReloadData] = useState<any>(true)
    const [checked, setChecked] = useState(true);
    const [checkedEmissions, setCheckedEmissions] = useState(true);
    const [yearlyData1, setYearlyData1] = useState<any>(Number(params?.years))
    const [checkedFacilityEmissions, setCheckedFacilityEmissions] = useState(true);
    const [checkedBusinessUnit, setCheckedBusinessUnit] = useState(true);
    const [yearlyData, setYearlyData] = useState<any>(Number(params?.years));
    const [quarterDetails, setQuarterDetails] = useState<string | number>(Number(params?.quarters) || 0);

    // Get relevant data from Redux store using selector hooks
    const { regions, emissionDates, timePeriodList } = useAppSelector((state: any) => state.commonData);
    const { regionEmission, regionEmissionIsLoading, configConstants } = useAppSelector((state: any) => state.sustain);
    const { carrierTypeOverviewDetailDto, isLoadingTypeOverviewDetail,
        carrierTypeReductionGraphDto, isLoadingCarrierTypeReductionGraph,
        carrierTypeLaneEmissionGraphDto,
        carrierTypeLaneEmissionGraphDtoLoading

    } = useAppSelector((state: any) => state.carrier);

    const { laneGraphDetails, laneGraphDetailsLoading, regionCarrierComparisonData, regionCarrierComparisonLoading, getRegionOverviewDetailLoading } = useAppSelector((state) => state.lane);
    const { businessUnitGraphDetails, businessUnitGraphDetailsLoading } = useAppSelector((state: any) => state.businessUnit);
    const { loginDetails, userProfile, divisionId } = useAppSelector((state: any) => state.auth);
    // Fetch data when necessary states change using useEffect

    // useEffect to scroll to the top of the page when the component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        setTimeId(getTimeIds(pId, weekId, timePeriodList))
    }, [pId, weekId, timePeriodList])

    // Fetch regions when the component mounts
    useEffect(() => {
        dispatch(regionShow({ division_id: divisionId }));
    }, [dispatch, divisionId])


    useEffect(() => {
        dispatch(getConfigConstants({ region_id: "", division_id: "" }));

    }, [dispatch]);


    // Fetch region level glide path data
    useEffect(() => {
        if (yearlyData1) {
            let payload: any = {
                year: Number(yearlyData1),
                region_id: "",
                carrier_type_id: params?.carrierTypeId,
                toggel_data: checkedEmissionsReductionGlide ? 0 : 1
            }
            dispatch(getCarrierTypeReductionGraph(payload))
        }
    }, [dispatch, yearlyData1, params, checkedEmissionsReductionGlide])


    useEffect(() => {
        dispatch(
            getCarrierTypeLaneEmissionGraph({
                carrier_type_id: params?.carrierTypeId,

                page: currentPage,
                page_size: pageSize,
                region_id: "",
                ...getTimeCheck(yearlyData, quarterDetails, timeId),
                facility_id: "",
                toggel_data: checked ? 1 : 0,
                division_id: ''
            })
        );
    }, [dispatch, checked, quarterDetails, timeId, yearlyData, params])

    // Fetch region overview detail data
    useEffect(() => {
        if (yearlyData) {
            dispatch(
                getCarrierTypeOverviewDetail({
                    carrier_type_id: params?.carrierTypeId,
                    region_id: "",
                    division_id: '',
                    ...getTimeCheck(yearlyData, quarterDetails, timeId)
                })
            );

        }
    }, [dispatch, params, yearlyData, timeId, quarterDetails])


    // Get formatted arrays for various graph data
    let carrierTypeLaneEmissionList = getGraphData(carrierTypeLaneEmissionGraphDto);
    let laneCarrierArr = getGraphData(regionCarrierComparisonData);
    let laneFacilityEmessionArr = getGraphDataHorizontal(businessUnitGraphDetails);
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
        carrierTypeLaneEmissionList,
        checkedEmissionsReductionGlide,
        carrierTypeOverviewDetailDto,
        regionEmission,
        regionEmissionIsLoading,
        regionCarrierComparisonData,
        // regionFacilityEmissionIsLoading,
        // regionFacilityEmissionDto,
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
        timePeriodList,
        loginDetails,
        divisionId,
        weekId,
        setWeekId,
        configConstants,
        isLoadingTypeOverviewDetail,
        carrierTypeReductionGraphDto, isLoadingCarrierTypeReductionGraph,
        carrierTypeLaneEmissionGraphDto,
        carrierTypeLaneEmissionGraphDtoLoading

    };
};

// Exporting the custom hook for use in other components
export default CarrierTypeOverviewController;