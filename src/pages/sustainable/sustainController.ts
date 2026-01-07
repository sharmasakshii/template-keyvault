// Importing necessary React hooks and functions
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';
import { useNavigate } from "react-router-dom";
import { emissionRegionDetails, graphRegionEmission, getConfigConstants, setShowPasswordExpire } from "../../store/sustain/sustainSlice";
import { regionShow, getProjectCount, graphEmissionIntensity } from 'store/commonData/commonSlice';
import { getDivisionOptions, getRegionOptions, getYearOptions, isCompanyEnable } from '../../utils';
import { companySlug } from 'constant';
import { setRegionalId } from 'store/auth/authDataSlice';

/**
 * Custom hook for managing state and actions related to the DashboardView.
 * @returns All the states and functions for DashboardView
 */
const SustainController = () => {
    // State variables using React useState hook
    const { loginDetails, divisionId } = useAppSelector((state: any) => state.auth);
    const [regionsLevel, setRegionsLevel] = useState<string>("");
    const [divisionLevel, setDivisionLevel] = useState(divisionId)
    const [revenueType, setRevenueType] = useState<string | number>(0);
    const [yearlyData, setYearlyData] = useState<any>(null);
    const [yearlyData1, setYearlyData1] = useState<any>(null);
    const [reloadData, setReloadData] = useState(true);
    const [checkedEmissionsReductionGlide, setCheckedEmissionsReductionGlide] = useState(true);
    // Selecting data from the Redux store using custom hooks
    const { emissionDates, regions, projectCountData, isLoadingProjectCount, emissionIntensityDetailsIsLoading, emissionIntensityDetails, divisions } = useAppSelector((state: any) => state.commonData);
    const {
        graphRegionChart,
        regionEmission,
        isLoadingGraphRegionEmission,
        regionEmissionIsLoading,
        configConstants,
        configConstantsIsLoading,
        isShowPasswordExpire
    } = useAppSelector((state: any) => state.sustain);
   
    // Dispatch and navigation functions from Redux and React Router
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isBrambleEnable = isCompanyEnable(loginDetails?.data, [companySlug?.bmb]);
    // Effect to fetch graph data based on yearlyData and revenueType
    useEffect(() => {
        dispatch(getConfigConstants({ region_id: regionsLevel, division_id: "", targetValues:true }));
    }, [dispatch, regionsLevel]);

    useEffect(() => {
        if (configConstants) {
            setYearlyData(Number.parseInt(configConstants?.data?.DEFAULT_YEAR || null));
            setYearlyData1(Number.parseInt(configConstants?.data?.DEFAULT_REDUCTION_YEAR))
        }
    }, [configConstants])

    const closeIsPasswordExpirePopup = () => {
        dispatch(setShowPasswordExpire(false))
    }

    const handleResetPassword = () => {
        navigate("/scope3/settings")
    }

    useEffect(() => {
        dispatch(setRegionalId(""))
        dispatch(regionShow({ division_id: divisionLevel }));
    }, [dispatch, divisionLevel])

    // Effect to set reload data flag when emissionIntensityDetails changes
    useEffect(() => {
        setReloadData(true);
    }, [emissionIntensityDetails]);

    // Effect to fetch graph data based on yearlyData and revenueType
    useEffect(() => {
        if (yearlyData && loginDetails?.data) {
            dispatch(graphEmissionIntensity({ year: Number(yearlyData), toggel: revenueType, division_id: divisionLevel }));
        }
    }, [dispatch, yearlyData, revenueType, divisionLevel, loginDetails]);



    // Effect to fetch region emission data based on various parameters
    useEffect(() => {
        dispatch(graphRegionEmission({
            region_id: "",
            division_id: divisionLevel,
            company_id: "",
            year: "",
            toggel_data: 1
        }));
    }, [dispatch, divisionLevel]);

    // Effect to fetch emission region details based on yearlyData1 and toggle flag
    useEffect(() => {
        if (yearlyData1) {
            let payload:any = { 
                year: Number(yearlyData1), 
                region_id: "", toggel_data: 
                checkedEmissionsReductionGlide ? 0 : 1
            }
            if(isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo])){
                payload = {...payload, "division_id": divisionLevel }
            }
            dispatch(emissionRegionDetails(payload))
        }
    }, [dispatch, yearlyData1, checkedEmissionsReductionGlide, divisionLevel, loginDetails]);

    // Effect to fetch project count data based on regionsLevel and yearlyDataProject
    useEffect(() => {
        if (yearlyData && loginDetails?.data) {
            dispatch(getProjectCount({ division_id: divisionLevel, region_id: regionsLevel, year: yearlyData }));
        }
    }, [dispatch, regionsLevel, yearlyData, divisionLevel, loginDetails]);

    // Effect to navigate to a different route when regionsLevel changes
    useEffect(() => {
        if (regionsLevel) {
            dispatch(setRegionalId(regionsLevel));
            navigate("/scope3/regional-level");
        }
    }, [regionsLevel, dispatch, navigate]);

    // Options for selectors
    let regionOption = getRegionOptions(regions?.data?.regions)

    let divisionOptions = getDivisionOptions(divisions?.data)

    let yearOption = getYearOptions(emissionDates?.data?.emission_dates, isBrambleEnable)

    // Returning all states and functions to be used in DashboardView
    return {
        reloadData,
        regionsLevel,
        setRegionsLevel,
        divisionLevel,
        setDivisionLevel,
        revenueType,
        setRevenueType,
        yearlyData,
        setYearlyData,
        yearlyData1,
        setYearlyData1,
        setReloadData,
        graphRegionChart,
        yearOption,
        emissionIntensityDetails,
        regionEmission,
        isLoadingProjectCount,
        projectCountData,
        regionOption,
        divisionOptions,
        isLoadingGraphRegionEmission,
        regionEmissionIsLoading,
        emissionIntensityDetailsIsLoading,
        checkedEmissionsReductionGlide,
        setCheckedEmissionsReductionGlide,
        emissionDates,
        configConstants,
        configConstantsIsLoading,
        isShowPasswordExpire,
        closeIsPasswordExpirePopup,
        handleResetPassword,
        loginDetails,
        regions,
        divisions,
        dispatch,
        isBrambleEnable
    };
};

// Exporting the custom hook for use in other components
export default SustainController;
