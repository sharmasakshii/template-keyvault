import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import { regionShow } from "store/commonData/commonSlice";
import {
  getLaneCarrierCompaire,
  getLaneCarrierList,
  resetCarrier,
  vendorTableData,
} from "store/scopeThree/track/carrier/vendorSlice";
import {
  getRegionOptions,
  getQuarterData,
  getDivisionOptions,
  getTimeIds,
  getTimeCheck,
} from "utils";
import { getConfigConstants } from "store/sustain/sustainSlice";
import { setRegionalId } from "store/auth/authDataSlice";

const CarrierComparisionController = () => {
  // Refs for managing focus
  const focusPoint = useRef<any>(null);
  const focusPoint2 = useRef<any>(null);
  const [showPopup, setShowPopup] = useState(false);
  // Initialize variables
  const { loginDetails, regionalId, divisionId } = useAppSelector((state: any) => state.auth);

  // State variables
  const [divisionLevel, setDivisionLevel] = useState(divisionId)
  const [initLoading, setInitLoading] = useState(false);
  const [regionalLevel, setRegionalLevel] = useState(regionalId);
  const [yearlyData, setYearlyData] = useState<any>(null);
  const [quarterDetails, setQuarterDetails] = useState<any>(null);
  const [lane1, setLane1] = useState({ label: "", value: "" });
  const [lane2, setLane2] = useState({ label: "", value: "" });
  const [menuIsOpen1, setMenuIsOpen1] = useState(false);
  const [menuIsOpen2, setMenuIsOpen2] = useState(false);
  const [isDisableReset, setIsDisableReset] = useState(true);
  const [pId, setPId] = useState<any>(0);
  const [weekId, setWeekId] = useState<any>(0);
  const [timeId, setTimeId] = useState<any>(0);

  // Redux store selectors
  const {
    laneCarrierListName,
    getLaneCarrierCompaireDto,
    getLaneCarrierCompaireDtoLoading,
    vendorTableDetails,
    isLoadingVendorTableDetails
  } = useAppSelector((state: any) => state.carrier);

  const { regions, divisions, timePeriodList, isLoading, isLoadingDivisions } = useAppSelector((state: any) => state.commonData);

  // Redux dispatch function
  const dispatch = useAppDispatch();

  const { configConstants } = useAppSelector((state: any) => state.sustain);

  useEffect(() => {
    setTimeId(getTimeIds(pId, weekId, timePeriodList))
    setInitLoading(true)
  }, [pId, weekId, timePeriodList])

  useEffect(() => {
    dispatch(getConfigConstants({ region_id: "", division_id: "" }));
    dispatch(resetCarrier())
    setInitLoading(true)
  }, [dispatch]);

  useEffect(() => {
    if (configConstants?.data) {
      setYearlyData(Number.parseInt(configConstants?.data?.DEFAULT_YEAR));
      setQuarterDetails(getQuarterData(configConstants?.data?.DEFAULT_QUARTER))
      setPId(Number.parseInt(configConstants?.data?.DEFAULT_PERIOD ?? 0));
      setWeekId(0)
    }
  }, [configConstants])

  // Fetch region data when the component mounts
  useEffect(() => {
    dispatch(regionShow({ division_id: divisionLevel }));;
  }, [dispatch, divisionLevel]);

  // useEffect to scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch lane carrier list when the component mounts
  useEffect(() => {
    dispatch(getLaneCarrierList({
      region_id: regionalLevel,
      division_id: divisionLevel,
      ...getTimeCheck(yearlyData, quarterDetails, timeId,)
    }));
  }, [dispatch, regionalLevel, yearlyData, quarterDetails, timeId, divisionLevel]);

  // Handle search button click
  const handleSearch = () => {
    if (lane1?.value !== "" && lane2?.value !== "" && yearlyData) {
      dispatch(
        getLaneCarrierCompaire({
          region_id: regionalLevel,
          division_id: divisionLevel,
          carrier1: lane1?.value ?? "",
          carrier2: lane2?.value ?? "",
          ...getTimeCheck(yearlyData, quarterDetails, timeId)
        })
      );
    }
  };

  // Fetch vendor table data and set initial loading
  useEffect(() => {
    if (initLoading && yearlyData) {
      dispatch(
        vendorTableData({
          region_id: regionalLevel,
          division_id: divisionLevel,
          page: 1,
          page_size: 2,
          order_by: "desc",
          col_name: "shipment_count",
          search_name: "",
          min_range: 60,
          max_range: 390,
          ...getTimeCheck(yearlyData, quarterDetails, timeId)
        })
      );
    }
  }, [dispatch, initLoading, quarterDetails, timeId, regionalLevel, yearlyData, divisionLevel]);

  // Fetch lane carrier compare data and set lane values
  useEffect(() => {

    if (initLoading && vendorTableDetails?.data?.responseData && yearlyData) {
      let carrier1 = {
        label: vendorTableDetails?.data?.responseData?.[0]?.carrier_name,
        value: vendorTableDetails?.data?.responseData?.[0]?.carrier ?? "",
      }
      let carrier2 = {
        label: vendorTableDetails?.data?.responseData?.[1]?.carrier_name,
        value: vendorTableDetails?.data?.responseData?.[1]?.carrier ?? ''
      }
      if ((carrier1.value && !carrier2.value) || (!carrier1.value && carrier2.value)) {
        setShowPopup(true);
      }


      setLane1(carrier1);
      setLane2(carrier2);

      dispatch(
        getLaneCarrierCompaire({
          region_id: regionalLevel,
          division_id: divisionLevel,
          carrier1: carrier1.value,
          carrier2: carrier2.value,
          ...getTimeCheck(yearlyData, quarterDetails, timeId)
        })
      );
      setInitLoading(false);
    }
  }, [dispatch, regionalLevel, yearlyData, quarterDetails, timeId, vendorTableDetails, initLoading, divisionLevel]);




  // Handle reset button click
  const handleReset = () => {
    setIsDisableReset(true)
    setInitLoading(true)
  };

  // Handle click event on section
  const handleSectionClick = () => {
    setMenuIsOpen1(false);
    setMenuIsOpen2(false);
  };

  // Check if the search button should be disabled
  const isDisable = () => {
    return !lane1?.value || !lane2?.value;
  };

  // Handle change in regional level dropdown
  const handleRegionLevel = (e: any) => {
    setRegionalLevel(e);
    dispatch(setRegionalId(e))
    dispatch(resetCarrier())
    setInitLoading(true)
  };

  // Handle change in year dropdown
  const handleYearChange = (e: any) => {
    setYearlyData(e.value);
  };

  // Handle change in quarter dropdown
  const handleChangeQuarter = (value: any) => {
    setQuarterDetails(value);
  };

  // Handle menu 1 click and keydown events
  const handleMenuChange = (event: any) => {
    setMenuIsOpen2(false);

    event.stopPropagation();
    if (focusPoint.current) {
      focusPoint.current.focus();
    }
    setMenuIsOpen1(!menuIsOpen1);
  };

  const handleOnMenuKeyDown = (event: any) => {
    event.stopPropagation();
    if (focusPoint.current) {
      focusPoint.current.focus();
    }
    setMenuIsOpen1(true);
  };

  // Handle menu 2 click and keydown events
  const handleMenu2Click = (event: any) => {
    setMenuIsOpen1(false);
    event.stopPropagation();
    if (focusPoint2.current) {
      focusPoint2.current.focus();
    }
    setMenuIsOpen2(!menuIsOpen2);
  };

  const handleMenu2KeyDown = (event: any) => {
    event.stopPropagation();
    if (focusPoint2.current) {
      focusPoint2.current.focus();
    }
    setMenuIsOpen2(true);
  };

  // Options for selectors
  let regionOption = getRegionOptions(regions?.data?.regions);

  let divisionOptions = getDivisionOptions(divisions?.data);

  const getActiveClass = (indexValue: number) => indexValue === 0 ? "lightgreen-div" : "primary-div"

  return {
    setInitLoading,
    handleSearch,
    handleSectionClick,
    handleRegionLevel,
    handleYearChange,
    handleChangeQuarter,
    handleMenuChange,
    handleOnMenuKeyDown,
    focusPoint,
    menuIsOpen1,
    lane1,
    laneCarrierListName,
    setLane1,
    lane2,
    setLane2,
    handleMenu2Click,
    handleMenu2KeyDown,
    focusPoint2,
    menuIsOpen2,
    regionOption,
    regionalLevel,
    regions,
    yearlyData,
    quarterDetails,
    isDisable,
    handleReset,
    getLaneCarrierCompaireDtoLoading,
    getLaneCarrierCompaireDto,
    getActiveClass,
    isDisableReset,
    setIsDisableReset,
    isLoadingVendorTableDetails,
    divisionLevel,
    setDivisionLevel,
    divisionOptions,
    pId,
    setPId,
    weekId,
    setWeekId,
    timePeriodList,
    loginDetails,
    divisions,
    dispatch,
    resetCarrier,
    isLoading, isLoadingDivisions,
    showPopup, setShowPopup,
    configConstants
  };
};

export default CarrierComparisionController;
