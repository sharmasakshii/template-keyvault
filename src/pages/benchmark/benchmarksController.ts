import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import {
  benchmarkDistance,
  benchmarkRegion,
  benchmarkWeight,
  getDestination,
  getFreightLanes,
  getOrigin,
} from "store/benchmark/benchmarkSlice";
import { useNavigate } from "react-router-dom";
import { getCompanyName, typeCheck, getQuarterData } from "utils";
import { useAuth } from "auth/ProtectedRoute";
import { getConfigConstants } from "store/sustain/sustainSlice";

export const BenchmarkController = () => {
  const dataCheck = useAuth()
  const dispatch = useAppDispatch();
  const focusPoint = useRef<any>(null);
  const focusPoint2 = useRef<any>(null);
  const [lane1, setLane1] = useState<any>(null);
  const [lane2, setLane2] = useState<any>(null);
  const [lane1Options, setLane1Options] = useState<any>([])
  const [lane2Options, setLane2Options] = useState<any>([])
  const [menuIsOpen1, setMenuIsOpen1] = useState(false);
  const [menuIsOpen2, setMenuIsOpen2] = useState(false);
  const [benchmarkDistanceSwitch, setBenchmarkDistanceSwitch] = useState(false);
  const [boundType, setBoundType] = useState(false);
  const [yearlyData, setYearlyData] = useState<any>(null);
  const [quarterDetails, setQuarterDetails] = useState<any>(null);
  const [reloadData, setReloadData] = useState(true);
  const navigate = useNavigate();

  const {
    benchmarkDistanceDto,
    benchmarkDistanceDtoLoading,
    benchmarkWeightDto,
    benchmarkWeightDtoLoading,
    benchmarkRegionDto,
    benchmarkRegionDtoLoading,
    benchmarkLaneOrigin,
    isLoadingOrigin,
    isLoadingDestination,
    benchmarkLaneDestination,
    freightLanesDtoLoading,
    freightLanesDto,
  } = useAppSelector((state: any) => state.benchmark);

  const {
    configConstants,
  } = useAppSelector((state: any) => state.sustain);


  useEffect(() => {
    if (benchmarkLaneOrigin?.data) {
      setLane1Options(benchmarkLaneOrigin?.data?.map((x: any) => ({
        value: x?.origin,
        label: x?.origin,
      })
      ))
    }
  }, [benchmarkLaneOrigin])

  useEffect(() => {
    if (benchmarkLaneDestination?.data) {
      setLane2Options(benchmarkLaneDestination?.data?.map((x: any) => ({
        value: x?.dest,
        label: x?.dest
      })
      ))
    }
  }, [benchmarkLaneDestination,])

  useEffect(() => {
    if (yearlyData) {
      dispatch(
        benchmarkDistance({
          toggle_data: typeCheck(!benchmarkDistanceSwitch, 0, 1),
          year: yearlyData,
          quarter: quarterDetails,
        })
      );

      dispatch(
        benchmarkWeight({
          toggle_data: typeCheck(!benchmarkDistanceSwitch, 0, 1),
          year: yearlyData,
          quarter: quarterDetails,
        })
      );
    }
  }, [dispatch, yearlyData, quarterDetails, benchmarkDistanceSwitch]);

  useEffect(() => {
    if (yearlyData) {
      dispatch(
        benchmarkRegion({
          bound_type: typeCheck(boundType, "outbound", "inbound"),
          toggle_data: typeCheck(!benchmarkDistanceSwitch, 0, 1),
          year: yearlyData,
          quarter: quarterDetails,
        })
      );
    }
  }, [
    dispatch,
    boundType,
    yearlyData,
    quarterDetails,
    benchmarkDistanceSwitch,
  ]);

  useEffect(() => {
    dispatch(getConfigConstants({ region_id: "" }));
  }, [dispatch,]);


  useEffect(() => {
    if (configConstants?.data) {
      setLane1({ value: configConstants?.data?.benchmark_freight_default_lane?.split("_")[0], label: configConstants?.data?.benchmark_freight_default_lane?.split("_")[0] })
      setLane2({ value: configConstants?.data?.benchmark_freight_default_lane?.split("_")[1], label: configConstants?.data?.benchmark_freight_default_lane?.split("_")[1] })
      setLane1Options([{ value: configConstants?.data?.benchmark_freight_default_lane?.split("_")[0], label: configConstants?.data?.benchmark_freight_default_lane?.split("_")[0] }])
      setLane2Options([{ value: configConstants?.data?.benchmark_freight_default_lane?.split("_")[1], label: configConstants?.data?.benchmark_freight_default_lane?.split("_")[1] }])
      setYearlyData(Number.parseInt(configConstants?.data?.benchmark_default_year));
      setQuarterDetails(getQuarterData(configConstants?.data?.benchmark_default_quarter))
    }
  }, [configConstants])

  useEffect(() => {
    if (lane1?.value && lane2?.value) {
      dispatch(
        getFreightLanes({
          origin: lane1?.value,
          dest: lane2?.value,
          toggle_data: typeCheck(!benchmarkDistanceSwitch, 0, 1),
          year: yearlyData,
          quarter: quarterDetails,
        })
      );
    }
  }, [dispatch, lane1, lane2, yearlyData, quarterDetails, benchmarkDistanceSwitch]);



  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const handleChangeYear = (e: any) => {
    setYearlyData(e.value);
    setReloadData(false);
  };
  const handleChangeQuarter = (e: any) => {
    setQuarterDetails(e.value);
    setReloadData(false);
  };
  const handleBenchMarkChange = (e: any) => {
    setBenchmarkDistanceSwitch(!benchmarkDistanceSwitch);
  };
  const handlClickOrigin = (event: any) => {
    event.stopPropagation();
    focusPoint.current.focus();
    setMenuIsOpen1(!menuIsOpen1);
    setMenuIsOpen2(false)
  };
  const handleOnKeyDown = (event: any) => {
    event.stopPropagation();
    focusPoint.current.focus();
    setMenuIsOpen1(true);
    setMenuIsOpen2(false)
  };
  const handleDestinationClick = (event: any) => {
    if (lane1?.value !== "") {
      event.stopPropagation();
      focusPoint2.current.focus();
      setMenuIsOpen2(!menuIsOpen2);
      setMenuIsOpen1(false)
    }
  };
  const handleOnkeyDownDestination = (event: any) => {
    event.stopPropagation();
    focusPoint2.current.focus();
    setMenuIsOpen2(true);
    setMenuIsOpen1(false)
  };

  const handleChangeBoundType = () => {
    setBoundType(!boundType);
  };

  const handleSelectOrigin = (e: any) => {
    dispatch(
      getOrigin({
        keyword: e,
        page_limit: 10,
        type: "origin",
      })
    );
  };

  const handleSelectDestination = (e: any) => {
    dispatch(
      getDestination({
        keyword: e,
        page_limit: 10,
        type: "DEST",
        source: lane1?.value,
      })
    );
  }

  const companyName = getCompanyName(dataCheck?.userdata, true)

  return {
    lane1Options,
    lane2Options,
    companyName,
    yearlyData,
    handleChangeYear,
    quarterDetails,
    handleChangeQuarter,
    benchmarkDistanceSwitch,
    handleBenchMarkChange,
    handlClickOrigin,
    handleOnKeyDown,
    menuIsOpen1,
    focusPoint,
    lane1,
    handleDestinationClick,
    handleOnkeyDownDestination,
    menuIsOpen2,
    focusPoint2,
    lane2,
    setLane1,
    setLane2,
    boundType,
    handleChangeBoundType,
    benchmarkDistanceDto,
    benchmarkDistanceDtoLoading,
    benchmarkWeightDto,
    benchmarkWeightDtoLoading,
    benchmarkRegionDto,
    benchmarkRegionDtoLoading,
    isLoadingOrigin,
    isLoadingDestination,
    freightLanesDtoLoading,
    freightLanesDto,
    reloadData,
    handleSelectOrigin,
    handleSelectDestination,
    navigate
  };
};
