import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import {
  resetLaneOdPair,
  getCarrierEmissionData,
  checkLaneFuelStop,
} from "store/scopeThree/track/lane/laneDetailsSlice";
import { getConfigConstants } from "store/sustain/sustainSlice";
import {
  getReportLanesData,
  reportKeyMatrix,
  resetReportUnit,
} from "store/report/reportSlice";
import {
  getDivisionOptions,
  getOrder,
  getQuarterData,
  getRegionOptions,
  getTimeCheck,
  getTimeIds,
  isCompanyEnable,
} from "utils";
import { getOptimusCordinates } from "store/scopeThree/track/decarb/decarbSlice";
import {
  companySlug,
  radiusOptions,
  fuelTypeKeyValue,
  fuelSlug,
} from "constant";
import { regionShow } from "store/commonData/commonSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ReportsController = () => {
  const { loginDetails, regionalId, divisionId, fuelStopListDto } =
    useAppSelector((state: any) => state.auth);
  const dispatch = useAppDispatch();
  const childRef = useRef<any>(null);
  const myRef = useRef<HTMLDivElement>(null);
  const [pId, setPId] = useState<any>(0);
  const [weekId, setWeekId] = useState<any>(0);
  const [timeId, setTimeId] = useState<any>(0);
  const [divisionLevel, setDivisionLevel] = useState(divisionId);
  const [yearlyData, setYearlyData] = useState<any>(null);
  const [regionalLevel, setRegionalLevel] = useState(regionalId);
  const [quarterDetails, setQuarterDetails] = useState<any>(null);
  const [selectedFuelOption, setSelectedFuelOption] = useState({
    key: fuelSlug?.rd,
    value: "rd",
    slug: fuelTypeKeyValue?.is_rd,
    image: "/images/rd-icon.svg",
    id: "299",
    label: "RD",
  });
  const [selectedLane, setSelectedLane] = useState<any>(null);
  const [originCity, setOriginCity] = useState<any>("");
  const [originCityIntermodal, setOriginCityIntermodal] = useState<any>("");
  const [showFuelStopRadius, setShowFuelStopRadius] = useState<boolean>(false);
  const [destinationCity, setDestinationCity] = useState<any>("");
  const [destinationCityIntermodal, setDestinationCityIntermodal] =
    useState<any>("");
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [pageSize, setPageSize] = useState({ label: 10, value: 10 });
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortColumn, setSortColumn] = useState("emissions");
  const [isLaneFuelStopChng, setIsLaneFuelStopChng] = useState<boolean>(false);
  const { regions, divisions, timePeriodList } = useAppSelector(
    (state: any) => state.commonData
  );
  const { configConstants, configConstantsIsLoading } = useAppSelector(
    (state: any) => state.sustain
  );
  const { optimusCordinatesData, optimusCordinatesLoading } = useAppSelector(
    (state: any) => state.decarb
  );

  const [reportListDto, setReportListDto] = useState<any>([]);

  const {
    reportKeyMatrixData,
    isLoadingKeyMatrix,
    reportLaneData,
    isLoadingReportLaneData,
  } = useAppSelector((state: any) => state.laneReport);
  const {
    carrierEmissionData,
    isCarrierEmissionDataLoading,
    checkLaneFuelData,
    isCheckLaneFuelLoading,
  } = useAppSelector((state) => state.lane);
  const [carrierOrder, setCarrierOrder] = useState("desc");
  const [carrierColName, setCarrierColName] = useState("carrierEmissions");
  const tableRef = useRef<HTMLDivElement>(null);
  const isPEPCompany = isCompanyEnable(loginDetails?.data, [companySlug?.pep]);
  const isRBCompany = isCompanyEnable(loginDetails?.data, [companySlug?.rb]);
  const navigate = useNavigate();
  const [radius, setRadius] = useState(50);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [activeLane, setActiveLane] = useState<number | null>(null);
  const handleToggle = (index: number, laneName: string) => {
    const key = index.toString();

    if (activeKey !== key) {
      // Only call getCarrier if we're opening the accordion item
      getCarrier(laneName);
    }
    setActiveKey(activeKey === key ? null : key);
  };

  useEffect(() => {
    return () => {
      dispatch(resetReportUnit());
    };
  }, [dispatch]);

  useEffect(() => {
    setActiveKey(null);
  }, [reportLaneData]);

  const handleRadiusChange = (e: any) => {
    setRadius(e.value);
  };

  const handleThresholdChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    laneId: string
  ) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      if (value === "0") {
        toast.error("Threshold distance can't be 0");
      }
      setReportListDto((prevList: any) =>
        prevList.map((item: any) =>
          item.lane_id === laneId
            ? { ...item, thresholdDistance: value, isChecked: "" }
            : item
        )
      );
    }
  };

  const handleBlur = (lane: any) => {
    setActiveLane(lane?.lane_id);
    if (
      lane?.thresholdDistance === "" ||
      Number(lane?.thresholdDistance) === 0
    ) {
      return;
    }

    const data = {
      thresholdDistance: Number(lane?.thresholdDistance),
      lane_name: lane?.lane_name,
      lane_id: lane?.lane_id,
      k_count: 1,
      product_type_id: fuelStopListDto?.data
        ?.find((x: any) => x?.code === selectedFuelOption?.key)
        ?.id?.toString(),
      radius: radius,
    };
    dispatch(checkLaneFuelStop(data));
    setIsLaneFuelStopChng(true);
  };

  const handleFuelChange = (fuelType: any) => {
    if (selectedFuelOption?.value !== fuelType?.value) {
      if (childRef?.current) {
        childRef?.current?.resetCityNames();
      }
      handleResetODpair();
      setCurrentPage(1);
      setSelectedFuelOption(fuelType);
    }
    dispatch(
      getReportLanesData({
        page: 1,
        page_size: 10,
        region_id: "",
        division_id: "",
        ...getTimeCheck(yearlyData, quarterDetails, timeId),
        fuelType: fuelType?.value,
        radius: radius,
        destination: "",
        origin: "",
        sortColumn: sortColumn,
        order_by: sortOrder,
      })
    );
  };

  const handleChangeLocation = (origin: string, destination: string) => {
    setSelectedLane(null);
    setCurrentPage(1);
    setPageSize({ label: 10, value: 10 });
    setOriginCity(origin);
    setDestinationCity(destination);
  };

  const handleResetODpair = () => {
    setOriginCity(null);
    setDestinationCity(null);
    setCurrentPage(1);
    dispatch(resetLaneOdPair());
  };

  const handleClose = () => {
    setShowFuelStopRadius((prev: boolean) => !prev);
  };

  const splitPlace = (place: string) => {
    const [city = "", state = "", zip = ""] = place
      .split(",")
      .map((x) => x.trim());
    return { city, state, zip, label: place };
  };

  const handleViewLane = (lane: any, constants: any, fuelOption: any) => {
    setSelectedLane(lane);
    const [origin, destination] = lane?.lane_name?.split("_") ?? ["", ""];
    setOriginCityIntermodal(splitPlace(origin));
    setDestinationCityIntermodal(splitPlace(destination));
    dispatch(
      getOptimusCordinates({
        lane_name: lane?.lane_name,
        lane_id: lane?.lane_id,
        radius: radius,
        fuel_type:
          selectedFuelOption?.value === "is_intermodal"
            ? "is_intermodal"
            : lane?.fuel_code,
      })
    );
  };

  useEffect(() => {
    if (checkLaneFuelData && isLaneFuelStopChng) {
      const isValidFuel = checkLaneFuelData?.data?.results?.find(
        (res: any) =>
          res.fuel ===
          fuelStopListDto?.data
            ?.find((x: any) => x?.code === selectedFuelOption?.key)
            ?.id?.toString()
      )?.isValid;
      setReportListDto((prevList: any) =>
        prevList.map((item: any) =>
          item.lane_id === activeLane
            ? { ...item, isChecked: isValidFuel }
            : item
        )
      );
      setIsLaneFuelStopChng(false);
    }
  }, [checkLaneFuelData, selectedFuelOption, activeLane]);

  useEffect(() => {
    setTimeId(getTimeIds(pId, weekId, timePeriodList));
  }, [pId, weekId, timePeriodList]);

  // Fetch regions data when the component mounts
  useEffect(() => {
    dispatch(regionShow({ division_id: divisionLevel }));
  }, [dispatch, divisionLevel]);

  useEffect(() => {
    dispatch(getConfigConstants({ region_id: "", division_id: "" }));
    dispatch(resetLaneOdPair());
  }, [dispatch]);

  useEffect(() => {
    if (configConstants) {
      setYearlyData(Number.parseInt(configConstants?.data?.DEFAULT_YEAR));
      setQuarterDetails(getQuarterData(configConstants?.data?.DEFAULT_QUARTER));
      setPId(Number.parseInt(configConstants?.data?.DEFAULT_PERIOD || 0));
    }
  }, [configConstants]);

  useEffect(() => {
   
    if (
      reportLaneData?.data?.laneData?.length > 0 &&
      selectedFuelOption?.value
    ) {
      
      let lane = reportLaneData?.data?.laneData?.[0];
      setReportListDto(
        reportLaneData?.data?.laneData?.map((item: any) => ({
          ...item,
          thresholdDistance: "",
          isChecked: "",
        }))
      );

      setSelectedLane(lane);
      const [origin, destination] = lane?.lane_name?.split("_") ?? ["", ""];
      setOriginCityIntermodal(splitPlace(origin));
      setDestinationCityIntermodal(splitPlace(destination));
      dispatch(
        getOptimusCordinates({
          lane_name: lane?.lane_name,
          lane_id: lane?.lane_id,
          radius: radius,
          fuel_type:
            selectedFuelOption?.value === "is_intermodal"
              ? "is_intermodal"
              : lane?.fuel_code,
        })
      );
    }
  }, [dispatch, reportLaneData, radius, selectedFuelOption]);

  const handleLaneSort = (chooseColName: string) => {
    setSortOrder(getOrder(sortOrder));
    setSortColumn(chooseColName);
  };

  const handleCarrierLaneSort = (chooseColName: string) => {
    setCarrierOrder(getOrder(carrierOrder));
    setCarrierColName(chooseColName);
  };

  useEffect(() => {
    dispatch(
      reportKeyMatrix({
        region_id: regionalLevel,
        division_id: divisionLevel,
        ...getTimeCheck(yearlyData, quarterDetails, timeId),
        fuelType: selectedFuelOption?.value,
        radius: radius,
      })
    );
  }, [
    dispatch,
    selectedFuelOption,
    radius,
    regionalLevel,
    divisionLevel,
    yearlyData,
    quarterDetails,
    timeId,
  ]);

  const handleGetLanesData = useCallback(() => {
  
    setSelectedLane(null);
    dispatch(
      getReportLanesData({
        page: currentPage,
        page_size: pageSize?.value,
        region_id: regionalLevel,
        division_id: divisionLevel,
        ...getTimeCheck(yearlyData, quarterDetails, timeId),
        fuelType: selectedFuelOption?.value,
        radius: radius,
        destination: destinationCity,
        origin: originCity,
        sortColumn: sortColumn,
        order_by: sortOrder,
      })
    );
  }, [
    dispatch,
    currentPage,
    pageSize,
    selectedFuelOption,
    radius,
    destinationCity,
    originCity,
    sortColumn,
    sortOrder,
    regionalLevel,
    divisionLevel,
    yearlyData,
    quarterDetails,
    timeId,
  ]);

  useEffect(() => {
    handleGetLanesData();
  }, [handleGetLanesData]);

  const getCarrier = (name: string) => {
    if (
      !isCompanyEnable(loginDetails?.data, [companySlug.adm, companySlug?.tql])
    ) {
      setCarrierOrder("desc");
      setCarrierColName("carrierEmissions");
      dispatch(
        getCarrierEmissionData({
          region_id: regionalLevel,
          division_id: divisionLevel,
          ...getTimeCheck(yearlyData, quarterDetails, timeId),
          lane_name: name,
        })
      );
    }
  };

  let regionOption = getRegionOptions(regions?.data?.regions);
  let divisionOptions = getDivisionOptions(divisions?.data);

  // Return all the states and functions as an object
  return {
    childRef,
    tableRef,
    handleChangeLocation,
    handleResetODpair,
    pageSize,
    setCurrentPage,
    currentPage,
    showFuelStopRadius,
    handleClose,
    configConstants,
    showFullScreen,
    setShowFullScreen,
    handleFuelChange,
    selectedFuelOption,
    configConstantsIsLoading,
    reportKeyMatrixData,
    isLoadingKeyMatrix,
    reportLaneData,
    isLoadingReportLaneData,
    setPageSize,
    handleViewLane,
    myRef,
    sortColumn,
    sortOrder,
    handleLaneSort,
    selectedLane,
    optimusCordinatesData,
    optimusCordinatesLoading,
    handleGetLanesData,
    loginDetails,
    getCarrier,
    carrierEmissionData,
    isCarrierEmissionDataLoading,
    pId,
    setPId,
    divisionOptions,
    divisionLevel,
    setDivisionLevel,
    weekId,
    setWeekId,
    yearlyData,
    setYearlyData,
    regionalLevel,
    setRegionalLevel,
    quarterDetails,
    setQuarterDetails,
    regionOption,
    regions,
    divisions,
    timePeriodList,
    carrierOrder,
    carrierColName,
    handleCarrierLaneSort,
    dispatch,
    timeId,
    isPEPCompany,
    isRBCompany,
    navigate,
    originCityIntermodal,
    destinationCityIntermodal,
    handleToggle,
    radiusOptions,
    radius,
    handleRadiusChange,
    handleThresholdChange,
    handleBlur,
    checkLaneFuelData,
    isCheckLaneFuelLoading,
    reportListDto,
    activeLane,
  };
};

export default ReportsController;
