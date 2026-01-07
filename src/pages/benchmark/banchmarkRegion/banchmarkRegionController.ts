import { useEffect, useState } from "react";

import {
  getEmissionByRegion,
  getEmissionByLane,
  getBenchmarkRegion,
  getBenchmarkCarrierEmissions,
  getBenchmarkEmissionsTrendGraph,
  getIntermodelTrendGraph,
  getEmissionIntensityTrend,
  getIntermodelTrendGraphLane,
  getBenchmarkEmissionsTrendGraphLane,
} from "../../../store/benchmark/benchmarkSlice";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import { useAuth } from "../../../auth/ProtectedRoute";
import { getYearOptions, typeCheck, getQuarterOptions, getCompanyName } from "utils";

const getQuarterDetails = (quarterDetails: any) => (quarterDetails !== "" && quarterDetails !== 0) ? quarterDetails : 5
/**
 * Controller component for the LanesView page.
 * Manages state and logic for the LanesView page.
 * @returns All controllers and state variables for the LanesView page.
 */
const BanchmarkRegionController = () => {
  const dataCheck = useAuth();

  const params = useParams();
  const dispatch = useAppDispatch();
  const currentYear = params?.yearId;
  const { emissionDates } = useAppSelector((state: any) => state.commonData);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false)
  const [yearlyData, setYearlyData] = useState(Number(currentYear));
  const [quarterDetails, setQuarterDetails] = useState<any>(params?.quarterId === "all" ? "" : params?.quarterId);
  const [lowCarrierEmission, setLowCarrierEmission] = useState(false);
  const [boundType, setBoundType] = useState(params?.boundType === "outbound");
  const [benchmarkDetailSwitch, setBenchmarkDetailSwitch] = useState(
    params?.wtwType === "1"
  );
  const [regionId, setRegionId] = useState(Number(params?.id));
  const { loginDetails } = useAppSelector((state: any) => state.auth)

  const {
    emissionByRegionDto,
    benchmarkRegionList,
    benchmarkCompanyCarrierEmissionsList,
    benchmarkEmissionsTrendGraphLoading,
    benchmarkEmissionsTrendGraphDto,
    intermodelTrendGraphLoading,
    intermodelTrendGraphDto,
    benchmarkLCompanyarrierEmissionsLoading,
    emissionByRegionLoading,
  } = useAppSelector((state: any) => state.benchmark);

  useEffect(() => {
    setIsPageLoading(benchmarkEmissionsTrendGraphLoading || intermodelTrendGraphLoading || benchmarkLCompanyarrierEmissionsLoading)
  }, [benchmarkEmissionsTrendGraphLoading, intermodelTrendGraphLoading, benchmarkLCompanyarrierEmissionsLoading])

  useEffect(() => {
    dispatch(
      getEmissionIntensityTrend({
        toggle_data: 0,
        band_no: 1,
        year: 2021,
        quarter: "",
        region: "",
        type: "mile",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (params.type === "region") {
      let payload = {
        toggle_data: typeCheck(benchmarkDetailSwitch, 1, 0),
        region_id: regionId,
        bound_type: typeCheck(boundType, "outbound", "inbound"),
        year: yearlyData,
        quarter: getQuarterDetails(quarterDetails)
      };

      dispatch(
        getEmissionByRegion(payload)
      );
      dispatch(
        getBenchmarkEmissionsTrendGraph({
          ...payload,
          quarter: quarterDetails,
        })
      );
    }
  }, [dispatch, regionId, yearlyData, quarterDetails, benchmarkDetailSwitch, boundType, params?.type]);

  useEffect(() => {
    if (params.type !== "region") {
      const payload = {
        toggle_data: typeCheck(benchmarkDetailSwitch, 1, 0),
        year: yearlyData,
        quarter: quarterDetails,
        origin: params?.id?.split("_")[0],
        dest: params?.id?.split("_")[1],
      }
      dispatch(getEmissionByLane(payload));

      dispatch(getBenchmarkEmissionsTrendGraphLane(payload));
    }
  }, [dispatch, regionId, yearlyData, quarterDetails, benchmarkDetailSwitch, boundType, params]);

  useEffect(() => {
    if (params.type === "region") {
      dispatch(
        getIntermodelTrendGraph({
          toggle_data: 0,
          region_id: regionId,
          bound_type: typeCheck(boundType, "outbound", "inbound"),
          year: yearlyData,
          quarter: quarterDetails,
        })
      );
    } else {
      dispatch(
        getIntermodelTrendGraphLane({
          toggle_data: 0,
          year: yearlyData,
          quarter: quarterDetails,
          origin: params?.id?.split("_")[0],
          dest: params?.id?.split("_")[1],
        })
      );
    }
  }, [dispatch, regionId, yearlyData, quarterDetails, boundType, params]);

  useEffect(() => {
    let payload: any = {
      toggle_data: typeCheck(benchmarkDetailSwitch, 1, 0),
      bound_type: typeCheck(boundType, "outbound", "inbound"),
      year: yearlyData,
      quarter: quarterDetails,
      type: params.type,
      low_emission: typeCheck(!lowCarrierEmission, 1, 0),
      page_size: 5
    }
    if (params.type === "region") {
      payload = { ...payload, region_id: regionId }
    } else {
      payload = {
        ...payload, origin: params?.id?.split("_")[0],
        dest: params?.id?.split("_")[1],
      }
    }
    dispatch(
      getBenchmarkCarrierEmissions(payload));
  }, [dispatch, regionId, yearlyData, quarterDetails, benchmarkDetailSwitch, boundType, params, lowCarrierEmission]);

  useEffect(() => {
    dispatch(getBenchmarkRegion(""));
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const yearOption: any = getYearOptions(emissionDates?.data?.benchmark_dates);
  let quarterOption = getQuarterOptions(yearlyData);
  const companyName = getCompanyName(dataCheck?.userdata, true)
  // Return the state variables and functions for use in the component
  return {
    dataCheck,
    companyName,
    isPageLoading,
    yearOption,
    params,
    yearlyData,
    setYearlyData,
    quarterDetails,
    setQuarterDetails,
    lowCarrierEmission,
    setLowCarrierEmission,
    boundType,
    setBoundType,
    benchmarkDetailSwitch,
    setBenchmarkDetailSwitch,
    regionId,
    setRegionId,
    emissionByRegionDto,
    benchmarkRegionList,
    emissionByRegionLoading,
    benchmarkCompanyCarrierEmissionsList,
    benchmarkEmissionsTrendGraphLoading,
    benchmarkEmissionsTrendGraphDto,
    intermodelTrendGraphLoading,
    intermodelTrendGraphDto,
    benchmarkLCompanyarrierEmissionsLoading,
    quarterOption,
    loginDetails
  };
};

export default BanchmarkRegionController;
