import { useEffect, useState } from "react";
import {
  getBenchmark,
  getBenchmarkRegion,
  getBenchmarkCarrierEmissions,
  getIndustryStandardEmissions,
  getEmissionIntensityTrend,
  getBandRange
} from "../../../store/benchmark/benchmarkSlice";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import {
  getCompanyName,
  getQuarterOptions,
  getYearOptions,
  returnBinary,
  typeCheck,
} from "../../../utils";
import { useAuth } from "auth/ProtectedRoute";
/**
 * Controller component for the LanesView page.
 * Manages state and logic for the LanesView page.
 * @returns All controllers and state variables for the LanesView page.
 */
const CompanyBenchmarkController = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const dataCheck = useAuth();

  const currentYear = params?.yearId;
  const { emissionDates, isLoadingFilterDates } = useAppSelector((state: any) => state.commonData);
  const [yearlyData, setYearlyData] = useState(
    params?.yearId ? Number(params?.yearId) : Number(currentYear)
  );
  const [quarterDetails, setQuarterDetails] = useState<any>(
    params?.quarterId === "all" ? 0 : Number(params?.quarterId)
  );
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false)
  const [lowCarrierEmission, setLowCarrierEmission] = useState(false);
  const [lowIndustryStandardEmission, setLowIndustryStandardEmission] = useState(false);

  const [regionId, setRegionId] = useState(null);

  const [benchmarkDetailSwitch, setBenchmarkDetailSwitch] = useState(
    params?.wtwType === "1"
  );
  const [bandNumber, setBandNumber] = useState(Number(params?.id));
  const {
    isLoadingGetBand,
    bandRange,
    benchmarkCompanyDetail,
    benchmarkRegionList,
    benchmarkCompanyCarrierEmissionsList,
    industryStandardEmissionsLoading,
    industryStandardEmissionsList,
    emissionIntensityTrendDto,
    emissionIntensityTrendLoading,
    benchmarkLCompanyarrierEmissionsLoading,
    benchmarkCompanyDetailLoading,
  } = useAppSelector((state: any) => state.benchmark);

  const { loginDetails } = useAppSelector((state: any) => state.auth)
  useEffect(() => {
    dispatch(
      getBenchmark({
        toggle_data: returnBinary(benchmarkDetailSwitch),
        band_no: bandNumber,
        year: yearlyData,
        quarter: (quarterDetails !== "" && quarterDetails !== 0) ? quarterDetails : 5,
        type: params.type,
      })
    );
  }, [dispatch, bandNumber, yearlyData, quarterDetails, benchmarkDetailSwitch, params]);

  useEffect(() => {
    if (benchmarkRegionList?.data?.length > 0) {
      setRegionId(benchmarkRegionList?.data[0]?.id?.toString())
    }
  }, [benchmarkRegionList]);

  // setRegionId
  useEffect(() => {
    setIsPageLoading(isLoadingFilterDates || industryStandardEmissionsLoading || emissionIntensityTrendLoading || benchmarkLCompanyarrierEmissionsLoading || benchmarkCompanyDetailLoading)
  }, [isLoadingFilterDates, industryStandardEmissionsLoading, emissionIntensityTrendLoading, benchmarkLCompanyarrierEmissionsLoading, benchmarkCompanyDetailLoading])

  useEffect(() => {
    dispatch(
      getBenchmarkCarrierEmissions({
        toggle_data: returnBinary(benchmarkDetailSwitch),
        band_no: bandNumber,
        year: yearlyData,
        quarter: quarterDetails,
        low_emission: !lowCarrierEmission ? 1 : 0,
        type: params.type,
        page_size: 5
      })
    );
  }, [dispatch, bandNumber, yearlyData, quarterDetails, benchmarkDetailSwitch, lowCarrierEmission, params]);

  useEffect(() => {
    dispatch(
      getIndustryStandardEmissions({
        toggle_data: returnBinary(benchmarkDetailSwitch),
        band_no: bandNumber,
        year: yearlyData,
        quarter: quarterDetails,
        low_emission: !lowIndustryStandardEmission ? 1 : 0,
        type: params.type,
      })
    );
  }, [dispatch, bandNumber, yearlyData, quarterDetails, benchmarkDetailSwitch, lowIndustryStandardEmission, params?.type]);

  useEffect(() => {
    if (regionId) {
      dispatch(
        getEmissionIntensityTrend({
          toggle_data: returnBinary(benchmarkDetailSwitch),
          band_no: bandNumber,
          year: yearlyData,
          quarter: quarterDetails,
          region: regionId,
          type: params.type,
        })
      );

    }
  }, [dispatch, bandNumber, yearlyData, quarterDetails, benchmarkDetailSwitch, regionId, params?.type]);

  useEffect(() => {
    dispatch(getBenchmarkRegion(""));
  }, [dispatch]);


  useEffect(() => {
    dispatch(getBandRange({ band_type: typeCheck(params?.type === "weight", "weight", "mile") }))
  }, [dispatch, params?.type]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  let yearOption = getYearOptions(emissionDates?.data?.benchmark_dates);
  let quarterOption = getQuarterOptions(yearlyData);
  const companyName = getCompanyName(dataCheck?.userdata, true)

  // Return the state variables and functions for use in the component
  return {
    companyName,
    isPageLoading,
    quarterDetails,
    isLoadingGetBand,
    setQuarterDetails,
    bandRange,
    yearlyData,
    setYearlyData,
    lowCarrierEmission,
    setLowCarrierEmission,
    lowIndustryStandardEmission,
    setLowIndustryStandardEmission,
    regionId,
    dataCheck,
    setRegionId,
    benchmarkDetailSwitch,
    setBenchmarkDetailSwitch,
    bandNumber,
    setBandNumber,
    benchmarkCompanyDetail,
    benchmarkRegionList,
    benchmarkCompanyCarrierEmissionsList,
    industryStandardEmissionsLoading,
    industryStandardEmissionsList,
    emissionIntensityTrendDto,
    emissionIntensityTrendLoading,
    benchmarkLCompanyarrierEmissionsLoading,
    yearOption,
    quarterOption,
    params,
    benchmarkCompanyDetailLoading,
    loginDetails
  };
};

export default CompanyBenchmarkController;
