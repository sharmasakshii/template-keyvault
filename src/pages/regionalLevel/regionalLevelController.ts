// Importing necessary React hooks and functions
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';
import { emissionRegionDetails, getConfigConstants, graphRegionEmission } from "store/sustain/sustainSlice";
import { getProjectCount, regionShow, graphEmissionIntensity } from 'store/commonData/commonSlice';
import { regionFacilityEmissions } from 'store/scopeThree/track/region/regionOverviewSlice';
import { regionGraphData } from 'store/scopeThree/track/region/regionSlice';
import { changeRegion, changeLane, changeCarrier, changeFacility, changeBusinessUnit, changeFuel, changeVehicle } from 'store/dashRegion/dashRegionSlice'
import { laneGraphData } from 'store/scopeThree/track/lane/laneDetailsSlice';
import { getCompanyName, getGraphData, getGraphDataHorizontal, getRegionOptions, getQuarterData, getDivisionOptions, getTimeCheck, getTimeIds, isCompanyEnable, executeScroll } from 'utils';
import { businessUnitGraphData } from 'store/businessUnit/businessUnitSlice';
import { fuelGraphData, vehicleGraphData } from 'store/fuel/fuelSlice';
import { companySlug } from 'constant';

/**
 * A custom hook that contains all the states and functions for the RegionalLevelController
 */

const RegionalLevelController = () => {
    // Define and initialize all the necessary states
    const { loginDetails, regionalId, divisionId } = useAppSelector((state: any) => state.auth);

    const [divisionLevel, setDivisionLevel] = useState(divisionId)
    const [modal, setModal] = useState(false);
    const [checkedRegion, setCheckedRegion] = useState(true);
    const [checked, setChecked] = useState(true);
    const [checkedEmissionsReductionGlide, setCheckedEmissionsReductionGlide] = useState(true);
    const [checkedFacilityEmissions, setCheckedFacilityEmissions] = useState(true);
    const [checkedBusinessUnitEmissions, setCheckedBusinessUnitEmissions] = useState(true);
    const [quarterDetails, setQuarterDetails] = useState<any>(null);
    const [checkedFuel, setCheckedFuel] = useState(true);
    const [checkedVehicle, setCheckedVehicle] = useState(true);
    const [yearlyData, setYearlyData] = useState<any>(null);
    const [yearlyData1, setYearlyData1] = useState<any>(null);
    const [regionName, setRegionName] = useState("");
    const [regionsLevel, setRegionsLevel] = useState<any>(regionalId);
    const [reloadData, setReloadData] = useState(true);
    const [pieChartCount, setPieChartCount] = useState(null);
    const [isRegionState, setIsRegionState] = useState(false);
    const [isLaneState, setIsLaneState] = useState(false);
    const [isCarrierState, setIsCarrierState] = useState(false);
    const [isFacilityState, setIsFacilityState] = useState(false);
    const [isBusinessUnitState, setIsBusinessUnitState] = useState(false);
    const [isFuelState, setIsFuelState] = useState(false);
    const [isVehicleState, setIsVehicleState] = useState(false);
    const [pId, setPId] = useState<any>(0);
    const [weekId, setWeekId] = useState<any>(0);
    const [timeId, setTimeId] = useState<any>(0);
    const [emissionsValue, setEmissionsValue] = useState<any>(null);
const showLatestYear = isCompanyEnable(loginDetails?.data, [companySlug?.bmb]);
    const additionalRef = useRef(null)

    // Define dispatch function from Redux store
    const dispatch = useAppDispatch();

    // Function to toggle modal
    const toggle = (isApplied = false) => {
        setModal(!modal)
        if (isApplied) {
            setTimeout(() => {
                executeScroll(additionalRef)
            }, 800)
        }
    };

    // Get navigation function from React Router
    const navigate = useNavigate();
   
    // Define constants for pagination
    const currentPage = 1;
    const pageSize = 10;

    // Select data from Redux store using selector hooks
    const { emissionDates, regions, isLoadingProjectCount, projectCountData, emissionIntensityDetailsIsLoading, emissionIntensityDetails, divisions, timePeriodList } = useAppSelector((state: any) => state.commonData);
    const { regionFacilityEmissionDto, regionFacilityEmissionIsLoading, isLoading } = useAppSelector((state: any) => state.regionOverview);
    const { isRegion, isLane, isFacility, isCarrier, isBusinessUnit, isFuel, isVehicle } = useAppSelector((state: any) => state.regionDash);
    const { regionGraphDetails, regionGraphDetailsLoading } = useAppSelector((state: any) => state.region);
    const { laneGraphDetails, laneGraphDetailsLoading } = useAppSelector((state: any) => state.lane);
    const {
        isLoadingGraphRegionEmission,
        graphRegionChart,
        configConstants,
        configConstantsIsLoading,
        regionEmission, regionEmissionIsLoading
    } = useAppSelector((state: any) => state.sustain);
    const { fuelGraphDto, fuelGraphDtoLoading, vehicleGraphDtoLoading, vehicleGraphDto } = useAppSelector((state: any) => state.fuel);
    // Fetch data when necessary states change using useEffect
    const isBrambleEnable = isCompanyEnable(loginDetails?.data, [companySlug?.bmb]);
    // Effect to fetch graph data based on yearlyData and revenueType
    useEffect(() => {
        dispatch(getConfigConstants({ region_id: regionsLevel, division_id: "", targetValues: true }));
    }, [dispatch, regionsLevel]);

    // Fetch regions when the component mounts
    useEffect(() => {
        dispatch(regionShow({ division_id: divisionLevel }));
    }, [dispatch, divisionLevel])

    useEffect(() => {
        if (configConstants?.data) {
            setEmissionsValue([Math.trunc(configConstants?.data?.MIN_CARRIER_INTENSITY), Math.trunc(configConstants?.data?.MAX_CARRIER_INTENSITY) + 1])
            setYearlyData(Number.parseInt(configConstants?.data?.DEFAULT_YEAR));
            setYearlyData1(Number.parseInt(configConstants?.data?.DEFAULT_REDUCTION_YEAR))
            setQuarterDetails(getQuarterData(configConstants?.data?.DEFAULT_QUARTER))
            setPId(Number.parseInt(configConstants?.data?.DEFAULT_PERIOD || 0))
            setWeekId(0)
        }

    }, [configConstants]);

    // Set region name when regions data and regionsLevel change
    useEffect(() => {
        if (regionsLevel) {
            regions?.data?.regions?.map((x: any) => {
                x.id === Number.parseInt(regionsLevel) && setRegionName(x.name)
                return true
            });
        }
    }, [regionsLevel, regions])

    // Set pie chart count when projectCountData changes
    useEffect(() => {
        if (projectCountData?.data) {
            setPieChartCount(projectCountData?.data?.Total || 0)
        }
    }, [projectCountData])

    // Navigate to "/sustainable" if regionsLevel is empty
    useEffect(() => {
        if (regionsLevel === "") {
            navigate("/scope3/sustainable");
        }
    }, [regionsLevel, navigate]);

    // Fetch project count data based on regionsLevel and yearlyData
    useEffect(() => {
        if (regionsLevel && yearlyData) {
            dispatch(getProjectCount({
                division_id: divisionLevel,
                region_id: regionsLevel,
                year: yearlyData
            }))
        }
    }, [dispatch, regionsLevel, yearlyData, divisionLevel]);
    const defaultUnit = configConstants?.data?.default_distance_unit
    // Fetch region emission intensity overall data
    useEffect(() => {
        if (regionsLevel && yearlyData) {
            dispatch(
                graphEmissionIntensity({
                    quarter: quarterDetails,
                    toggel: 1,
                    year: yearlyData,
                    region_id: regionsLevel,
                    division_id: divisionLevel
                })
            );
        }
    }, [dispatch, regionsLevel, yearlyData, quarterDetails, divisionLevel]);

    useEffect(() => {
        setTimeId(getTimeIds(pId, weekId, timePeriodList))
    }, [pId, weekId, timePeriodList])

    useEffect(() => {
        dispatch(graphRegionEmission({
            region_id: regionsLevel,
            division_id: divisionLevel,
            company_id: "",
            quarter: quarterDetails,
            year: "",
            toggel_data: 0
        }));
    }, [dispatch, quarterDetails, regionsLevel, divisionLevel]);

    // Fetch region level glide path data
    useEffect(() => {
        if (yearlyData1 && regionsLevel) {
            let payload: any = {
                year: Number(yearlyData1),
                region_id: regionsLevel,
                toggel_data: checkedEmissionsReductionGlide ? 0 : 1
            }
            if (isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo])) {
                payload = { ...payload, "division_id": divisionLevel }
            }
            dispatch(emissionRegionDetails(payload))
        }
    }, [dispatch, yearlyData1, regionsLevel, checkedEmissionsReductionGlide, divisionLevel, loginDetails]);

    // Get formatted arrays for various graph data
    let regionPageArr = getGraphDataHorizontal(regionGraphDetails);
    let lanePageArr = getGraphData(laneGraphDetails);
    let laneFacilityEmessionArr = getGraphDataHorizontal(regionFacilityEmissionDto);
    let divisionOptions = getDivisionOptions(divisions?.data)
    // Fetch region graph data when isRegion state changes

    useEffect(() => {
        if (isRegion) {
            dispatch(
                regionGraphData({
                    region_id: "",
                    division_id: divisionLevel,
                    toggel_data: checkedRegion ? 1 : 0,
                    ...getTimeCheck(yearlyData, quarterDetails, timeId)
                })
            );
        }
    }, [dispatch, isRegion, quarterDetails, timeId, checkedRegion, yearlyData, divisionLevel]);

    // Fetch region facility emissions data when isFacility state changes
    useEffect(() => {
        if (isFacility && regionsLevel) {
            dispatch(
                regionFacilityEmissions({
                    region_id: regionsLevel,
                    division_id: divisionLevel,
                    facility_id: "",
                    toggel_data: checkedFacilityEmissions ? 1 : 0,
                    ...getTimeCheck(yearlyData, quarterDetails, timeId)
                })
            );
        }
    }, [dispatch, regionsLevel, isFacility, timeId, quarterDetails, checkedFacilityEmissions, yearlyData, divisionLevel]);
    // Fetch region business unit emissions data when isBusinessUnit state changes
    useEffect(() => {
        if (isBusinessUnit && regionsLevel) {
            dispatch(
                businessUnitGraphData({
                    region_id: regionsLevel,
                    division_id: divisionLevel,
                    toggel_data: checkedBusinessUnitEmissions ? 1 : 0,
                    ...getTimeCheck(yearlyData, quarterDetails, timeId)

                })
            );
        }
    }, [dispatch, regionsLevel, isBusinessUnit, timeId, quarterDetails, checkedBusinessUnitEmissions, yearlyData, divisionLevel]);

    // Fetch fuel data when isFuel state changes
    useEffect(() => {
        if (isFuel && regionsLevel) {
            dispatch(
                fuelGraphData({
                    regionId: regionsLevel,
                    division_id: divisionLevel,
                    toggle_data: checkedFuel ? 1 : 0,
                    tableName: "FuelType",
                    ...getTimeCheck(yearlyData, quarterDetails, timeId)

                })
            );
        }
    }, [dispatch, regionsLevel, checkedFuel, timeId, isFuel, quarterDetails, yearlyData, divisionLevel]);

    // Fetch vehicle data when isVehicle state changes
    useEffect(() => {
        if (isVehicle && regionsLevel) {
            dispatch(
                vehicleGraphData({
                    regionId: regionsLevel,
                    division_id: divisionLevel,
                    toggle_data: checkedVehicle ? 1 : 0,
                    tableName: "VehicleModel",
                    ...getTimeCheck(yearlyData, quarterDetails, timeId)

                })
            );
        }
    }, [dispatch, regionsLevel, isVehicle, timeId, quarterDetails, yearlyData, checkedVehicle, divisionLevel]);


    // Fetch lane graph data when isLane state changes
    useEffect(() => {
        if (isLane && regionsLevel) {
            dispatch(
                laneGraphData({
                    page: currentPage,
                    page_size: pageSize,
                    region_id: regionsLevel,
                    division_id: divisionLevel,
                    facility_id: "",
                    toggel_data: checked ? 1 : 0,
                    ...getTimeCheck(yearlyData, quarterDetails, timeId)
                })
            );
        }
    }, [dispatch, regionsLevel, isLane, timeId, quarterDetails, checked, yearlyData, divisionLevel]);

    // Options for selectors
    let regionOption = getRegionOptions(regions?.data?.regions)

    const companyName = getCompanyName(loginDetails?.data, true)

    // Get relevant data from Redux store using selector hooks
    const { businessUnitGraphDetails, businessUnitGraphDetailsLoading } = useAppSelector((state: any) => state.businessUnit);
    // Process graph data using getGraphDataHorizontal function
    let businessUnitList = getGraphDataHorizontal(businessUnitGraphDetails, "OTHER");

    let fuelArrayList = getGraphDataHorizontal(fuelGraphDto);

    let vehicleArrayList = getGraphDataHorizontal(vehicleGraphDto);

    // Return all the states and functions
    return {
        companyName,
        reloadData,
        isLoadingProjectCount,
        regionName,
        quarterDetails,
        emissionDates,
        yearlyData,
        yearlyData1,
        lanePageArr,
        laneFacilityEmessionArr,
        regionPageArr,
        projectCountData,
        checkedFacilityEmissions,
        regionFacilityEmissionIsLoading,
        checkedEmissionsReductionGlide,
        regionEmission,
        regionEmissionIsLoading,
        regionFacilityEmissionDto,
        pieChartCount,
        isFacilityState,
        isCarrierState,
        isLaneState,
        isRegionState,
        isBusinessUnitState,
        laneGraphDetails,
        laneGraphDetailsLoading,
        emissionIntensityDetails,
        emissionIntensityDetailsIsLoading,
        setCheckedFacilityEmissions,
        changeRegion,
        changeLane,
        changeCarrier,
        changeBusinessUnit,
        changeFacility,
        changeFuel,
        changeVehicle,
        isFuelState,
        setIsFuelState,
        isVehicleState,
        setIsVehicleState,
        checkedRegion,
        setCheckedRegion,
        regionsLevel,
        regionGraphDetails,
        regionGraphDetailsLoading,
        isRegion,
        isLane,
        isCarrier,
        isFacility,
        isFuel,
        isVehicle,
        businessUnitList,
        businessUnitGraphDetails,
        businessUnitGraphDetailsLoading,
        isBusinessUnit,
        setIsBusinessUnitState,
        modal,
        setCheckedEmissionsReductionGlide,
        checkedBusinessUnitEmissions,
        setCheckedBusinessUnitEmissions,
        setYearlyData,
        setYearlyData1,
        setQuarterDetails,
        dispatch,
        toggle,
        setIsRegionState,
        setIsLaneState,
        setIsCarrierState,
        setIsFacilityState,
        setRegionsLevel,
        setReloadData,
        setChecked,
        regionOption,
        checked,
        configConstants,
        isLoadingGraphRegionEmission,
        graphRegionChart,
        configConstantsIsLoading,
        emissionsValue,
        checkedFuel,
        setCheckedFuel,
        checkedVehicle,
        setCheckedVehicle,
        fuelArrayList,
        vehicleArrayList,
        fuelGraphDto,
        fuelGraphDtoLoading,
        vehicleGraphDtoLoading,
        vehicleGraphDto,
        pId,
        setPId,
        divisionLevel,
        setDivisionLevel,
        divisionOptions,
        regions,
        timePeriodList,
        divisions,
        loginDetails,
        isLoading,
        weekId,
        setWeekId,
        timeId,
        additionalRef,
        defaultUnit,
        isBrambleEnable,
        showLatestYear
    };
}

// Exporting the custom hook for use in other components
export default RegionalLevelController;
