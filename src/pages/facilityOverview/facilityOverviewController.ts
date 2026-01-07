import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import { useParams } from "react-router-dom";
import { getGraphData } from "../../utils"

import {
    facilityReductionGraph,
    facilityOverviewDetail,
    facilityComparisonGraph,
    facilityCarrierComparison,
    facilityGraphDetailsGraph,
    facilityOutBoundGraph,
    facilityInBoundGraph
} from "../../store/scopeThree/track/facilityOverview/facilityOverviewDataSlice";
import { regionShow } from "../../store/commonData/commonSlice";
import { getConfigConstants } from "store/sustain/sustainSlice";

/**
 * A custom hook that contains all the states and functions for the Facility Overview View Controller
 */
const FacilityOverviewController = () => {


    // Initialize some state variables
    const [checkedEmissionsReductionGlide, setCheckedEmissionsReductionGlide] = useState(true)
    const params = useParams();
    const dispatch = useAppDispatch()
    const [reloadData, setReloadData] = useState(true)
    const [checked, setChecked] = useState(true);
    const [checkedEmissions, setCheckedEmissions] = useState(true);
    const [checkedInBound, setCheckedInBound] = useState(true);
    const [checkedOutBound, setCheckedOutBound] = useState(true);
    const [showBounds, setShowBounds] = useState(false);
    const [showEmission, setShowEmission] = useState(false);
    const [firstBounds, setFirstBounds] = useState(false)
    const [firstEmission, setFirstEmission] = useState(false)
    const [yearlyData1, setYearlyData1] = useState(Number(params?.years))
    const [yearlyData, setYearlyData] = useState<string | number>(Number(params?.years));
    const [quarterDetails, setQuarterDetails] = useState<string | number>(Number(params?.quarters) || 0);
    const {regionalId, loginDetails} = useAppSelector((state)=>state.auth)

    // Select specific data from the Redux store using custom hooks
    const { regions, emissionDates } = useAppSelector((state) => state.commonData)
    const { facilityReductionGraphLoading, facilityReductionGraphDto, facilityOverviewDetailDto,
        facilityComparisonGraphDto, facilityComparisonGraphLoading, facilityCarrierComparisonloading,
        facilityCarrierComparisonData, facilityGraphDetailsLoading, facilityGraphDetailsDto,
        facilityInBoundDto, facilityInBoundLoading, facilityOutBoundLoading, facilityOutBoundDto, facilityOverviewDetailLoading
    } = useAppSelector(
        (state: any) => state.facilityOverview
    );
    const {
        configConstants,
    } = useAppSelector((state: any) => state.sustain);
    useEffect(() => {
        dispatch(regionShow({division_id:""}));;
      }, [dispatch]);

    // Function to toggle showing bounds data
    const handleBoundsOpen = () => {
        setShowBounds(!showBounds);
        setFirstBounds(true)
    };

  useEffect(() => {
    dispatch(getConfigConstants({ region_id: "" }));
  }, [dispatch]);

    // Function to toggle showing emissions data
    const handleEmissionOpen = () => {
        setShowEmission(!showEmission);
        setFirstEmission(true)
    };

    // Use useEffect to dispatch Redux actions when dependencies change

    // Dispatch action to fetch facility reduction graph data
    useEffect(() => {
        if (yearlyData1 && params) {
            dispatch(facilityReductionGraph({
                facility_id: params?.facilityId, region_id: regionalId,
                company_id: "", year: Number.parseInt(yearlyData1.toString()), quarter: quarterDetails, toggel_data: checkedEmissionsReductionGlide ? 0 : 1
            }))
        }
    }, [dispatch, yearlyData1, regionalId, params, quarterDetails, checkedEmissionsReductionGlide])

    // Dispatch action to fetch facility overview detail data and facility comparison graph data
    useEffect(() => {
        if (params) {
            dispatch(facilityOverviewDetail({ facility_id: params?.facilityId, region_id: regionalId, company_id: "", quarter: quarterDetails, year: yearlyData }))
            dispatch(facilityComparisonGraph({ facility_id: params?.facilityId, region_id: regionalId, company_id: "", quarter: quarterDetails, year: yearlyData }))
        }
    }, [dispatch, params, quarterDetails, regionalId, yearlyData])

    // useEffect to scroll to the top of the page when the component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Dispatch action to fetch facility carrier comparison data
    useEffect(() => {
        if (params && firstEmission) {
            dispatch(facilityCarrierComparison({
                facility_id: params?.facilityId, company_id: "", quarter: quarterDetails, region_id: regionalId, year: yearlyData, toggel_data: checkedEmissions ? 1 : 0,
            }))
        }
    }, [dispatch, params, checkedEmissions, firstEmission, quarterDetails, regionalId, yearlyData])

    // Dispatch action to fetch facility graph details data
    useEffect(() => {
        if (params && firstEmission) {
            dispatch(facilityGraphDetailsGraph({ facility_id: params?.facilityId, region_id: regionalId, company_id: "", quarter: quarterDetails, year: yearlyData, toggel_data: checked ? 1 : 0 }))
        }
    }, [dispatch, params, checked, firstEmission, quarterDetails, regionalId, yearlyData])

    // Dispatch action to fetch facility inbound graph data
    useEffect(() => {
        if (params && firstBounds) {
            dispatch(facilityInBoundGraph({ facility_id: params?.facilityId, region_id: regionalId, company_id: "", quarter: quarterDetails, year: yearlyData, toggel_data: checkedInBound ? 1 : 0 }))
        }
    }, [dispatch, params, checkedInBound, firstBounds, regionalId, quarterDetails, yearlyData])

    // Dispatch action to fetch facility outbound graph data
    useEffect(() => {
        if (params && firstBounds) {
            dispatch(facilityOutBoundGraph({ facility_id: params?.facilityId, region_id: regionalId, company_id: "", quarter: quarterDetails, year: yearlyData, toggel_data: checkedOutBound ? 1 : 0 }))
        }
    }, [dispatch, params, checkedOutBound, firstBounds, regionalId, quarterDetails, yearlyData])


    // Extract data from Redux store and prepare it for rendering
    let lanePageArr = getGraphData(facilityGraphDetailsDto);
    let laneCarrierArr = getGraphData(facilityCarrierComparisonData);
    let laneCarrierInBoundArr = getGraphData(facilityInBoundDto);
    let laneCarrierOutBoundArr = getGraphData(facilityOutBoundDto);

    // Return all the states and functions as an object
    return {
        setYearlyData1,
        setReloadData,
        setCheckedEmissionsReductionGlide,
        handleBoundsOpen,
        setCheckedInBound,
        setCheckedOutBound,
        handleEmissionOpen,
        setCheckedEmissions,
        setChecked,
        yearlyData1,
        emissionDates,
        facilityOverviewDetailDto,
        facilityReductionGraphDto,
        checkedEmissionsReductionGlide,
        facilityReductionGraphLoading,
        facilityComparisonGraphLoading,
        facilityComparisonGraphDto,
        showBounds,
        checkedInBound,
        checkedOutBound,
        facilityInBoundDto,
        facilityInBoundLoading,
        facilityOutBoundLoading,
        facilityOutBoundDto,
        laneCarrierInBoundArr,
        laneCarrierOutBoundArr,
        showEmission,
        checkedEmissions,
        facilityCarrierComparisonData,
        facilityCarrierComparisonloading,
        laneCarrierArr,
        checked,
        facilityGraphDetailsDto,
        facilityGraphDetailsLoading,
        lanePageArr,
        reloadData,
        yearlyData,
        setQuarterDetails,
        setYearlyData,
        quarterDetails,
        facilityOverviewDetailLoading,
        regionalId,
        regions,
        params,
        loginDetails,
        configConstants
    };
};

// Export the custom hook for use in other components
export default FacilityOverviewController;
