// Import necessary libraries and components
import { useEffect, useRef, useState } from "react";
import { getOptimusCordinates, getOptimusLanes } from "store/scopeThree/track/decarb/decarbSlice";
import { resetLaneOdPair, checkLaneFuelStop, resetCheckLaneFuelData } from "store/scopeThree/track/lane/laneDetailsSlice";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import { executeScroll } from "utils";
import { getConfigConstants } from "store/sustain/sustainSlice";
import { fuelSlug } from "constant";
import { toast } from "react-toastify";
// Define the ProjectController functional component
const OptimusController = () => {

  const [selectedLane, setSelectedLane] = useState<any>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState({ label: 10, value: 10 });
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [originCity, setOriginCity] = useState<any>(null);
  const [destinationCity, setDestinationCity] = useState<any>(null);
  const { optimusLanesData, optimusLanesLoading, optimusCordinatesData, optimusCordinatesLoading } = useAppSelector((state) => state.decarb);
  const dispatch = useAppDispatch();
  const myRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<any>(null);
  const [activeLane, setActiveLane] = useState<number | null>(null);
  const [optimusLaneListDto, setOptimusLaneListDto] = useState<any>([]);
  const [selectedFuelOption, setSelectedFuelOption] = useState(null);
  const { fuelStopListDto } = useAppSelector(
    (state: any) => state.auth
  );

  const {
    checkLaneFuelData,
    isCheckLaneFuelLoading,
  } = useAppSelector((state) => state.lane);
  const {
    configConstants,
  } = useAppSelector((state: any) => state.sustain);

  useEffect(() => {
    setSelectedFuelOption(fuelStopListDto?.data?.find((x: any) => x?.code === fuelSlug?.optimus)?.id?.toString());
  }, [fuelStopListDto]);

  useEffect(() => {
    dispatch(getConfigConstants({ region_id: "" }));
  }, [dispatch,]);

  useEffect(() => {
    if (configConstants?.data) {
      dispatch(getOptimusLanes({
        page_size: pageSize?.value,
        page_number: pageNumber,
        optimus_radius: configConstants?.data?.optimus_radius,
        origin: originCity || null,
        destination: destinationCity || null,
      }));
    }

  }, [dispatch, pageSize, pageNumber, configConstants, originCity, destinationCity]);

  const handleGetOptimusLanes = (page: number, size: number) => {
    setSelectedLane(null);
    dispatch(getOptimusLanes({
      page_size: size,
      page_number: page,
      optimus_radius: configConstants?.data?.optimus_radius,
      origin: originCity?.value || null,
      destination: destinationCity?.value || null
    }));
  };


  useEffect(() => {

    if (optimusLanesData?.data?.data?.length > 0 && configConstants?.data?.optimus_radius) {
      setSelectedLane(optimusLanesData?.data?.data?.[0]);
      setOptimusLaneListDto(optimusLanesData?.data?.data?.map((item: any) => ({
        ...item,
        thresholdDistance: "",
        isChecked: '',
      })));
      dispatch(getOptimusCordinates({
        lane_name: optimusLanesData?.data?.data?.[0]?.origin + "_" + optimusLanesData?.data?.data?.[0].destination,
        lane_id: optimusLanesData?.data?.data?.[0]?.id,
        fuel_type: "OPTIMUS",
        radius: configConstants?.data?.optimus_radius,
      }));
    }
  }, [dispatch, optimusLanesData, configConstants]);

  const handleViewLane = (item: any) => {
    setSelectedLane(item);
    executeScroll(myRef);
    dispatch(getOptimusCordinates({
      lane_name: item?.origin + "_" + item.destination,
      lane_id: item?.id,
      fuel_type: "OPTIMUS",
      radius: configConstants?.data?.optimus_radius,
    }));
  };

  const handleChangeLocation = (origin: string, destination: string) => {
    setSelectedLane(null);
    setOriginCity(origin);
    setDestinationCity(destination);
    setPageSize({ label: 10, value: 10 });
    setPageNumber(1)
  };


  const resetOptimus = () => {
    setOriginCity(null);
    setDestinationCity(null);
    setPageNumber(1);
    setPageSize({ label: 10, value: 10 });
    dispatch(resetLaneOdPair());
    dispatch(getOptimusLanes({
      page_size: 10,
      page_number: 1,
      origin: null,
      destination: null
    }));
  };


  useEffect(() => {
    if (checkLaneFuelData) {
      const isValidFuel = checkLaneFuelData?.data?.results?.find((res: any) => res.fuel === selectedFuelOption)?.isValid;
      setOptimusLaneListDto((prevList: any) =>
        prevList.map((item: any) =>
          item.id === activeLane ? { ...item, isChecked: isValidFuel } : item
        )
      );

    }
  }, [checkLaneFuelData, selectedFuelOption, activeLane])

  const handleThresholdChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    laneId: string
  ) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      if (value === "0") {
        toast.error("Threshold distance can't be 0");
      }
      setOptimusLaneListDto((prevList: any) =>
        prevList.map((item: any) =>
          item.id === laneId ? { ...item, thresholdDistance: value, isChecked: '' } : item
        )
      );
    }
  };

  const handleBlur = (lane: any) => {
    dispatch(resetCheckLaneFuelData());
    setActiveLane(lane?.id);
    if (lane?.thresholdDistance === '' || Number(lane?.thresholdDistance) === 0) {
      return;
    }
    const data = {
      thresholdDistance: Number(lane?.thresholdDistance),
      lane_name: lane?.origin + "_" + lane.destination,
      lane_id: lane?.id,
      k_count: 1,
      product_type_id: selectedFuelOption,
      radius: 50,
    };
    dispatch(checkLaneFuelStop(data));
  };
  // Return the required variables and functions from the component
  return {
    selectedLane,
    optimusLanesData,
    optimusLanesLoading,
    optimusCordinatesData,
    optimusCordinatesLoading,
    pageNumber,
    setPageNumber,
    setPageSize,
    pageSize,
    myRef,
    handleViewLane,
    showFullScreen,
    setShowFullScreen,
    originCity,
    setOriginCity,
    destinationCity,
    setDestinationCity,
    handleGetOptimusLanes,
    resetOptimus,
    handleChangeLocation,
    childRef,
    configConstants,
    activeLane,
    handleBlur,
    handleThresholdChange,
    isCheckLaneFuelLoading,
    optimusLaneListDto
  };
};

// Export the ProjectController component
export default OptimusController;
