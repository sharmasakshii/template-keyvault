import { useEffect, useRef, useState } from "react";
import { getOptimusCordinates } from "store/scopeThree/track/decarb/decarbSlice";
import { evLocation, getEVNetworkLanes } from "store/ev/evSlice";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import { getConfigConstants } from "store/sustain/sustainSlice";
import { executeScroll } from "utils";
import {
    resetLaneOdPair,
    checkLaneFuelStop,
    resetCheckLaneFuelData,
} from "store/scopeThree/track/lane/laneDetailsSlice";
import { fuelSlug } from "constant";
import { toast } from "react-toastify";
/**
 * A custom hook that contains all the states and functions for the Facility Overview View Controller
 */
const EvController = () => {
    const dispatch = useAppDispatch();
    // Select specific data from the Redux store using custom hooks
    const { evLocationDto, evLocationLoading, evNetworkLanesData, evNetworkLanesLoading } = useAppSelector((state) => state.ev);
    const { optimusCordinatesData, optimusCordinatesLoading } = useAppSelector((state) => state.decarb);
    const [showFullScreen, setShowFullScreen] = useState(false);
    const [showLaneFullScreen, setShowLaneFullScreen] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [selectedLane, setSelectedLane] = useState<any>(null);
    const myRef = useRef<HTMLDivElement>(null);
    const childRef = useRef<any>(null);
    const [originCity, setOriginCity] = useState<any>(null);
    const [destinationCity, setDestinationCity] = useState<any>(null);
    const [pageSize, setPageSize] = useState({ label: 10, value: 10 });
    const [activeLane, setActiveLane] = useState<number | null>(null);
    const [evLaneListDto, setEvLaneListDto] = useState<any>([]);

    const [selectedFuelOption, setSelectedFuelOption] = useState(null);
    const { fuelStopListDto } = useAppSelector(
        (state: any) => state.auth
    );
    const {
        checkLaneFuelData,
        isCheckLaneFuelLoading,
    } = useAppSelector((state) => state.lane);
    const handleViewLane = (item: any) => {
        setSelectedLane(item);
        executeScroll(myRef);
        dispatch(getOptimusCordinates({
            lane_name: item?.origin + "_" + item.destination,
            lane_id: item?.id,
            fuel_type: "ev",
            radius: configConstants?.data?.ev_radius
        }));
    };

    useEffect(() => {
        dispatch(getConfigConstants({ region_id: "" }));
    }, [dispatch]);
    useEffect(() => {
        setSelectedFuelOption(fuelStopListDto?.data?.find((x: any) => x?.code === fuelSlug?.ev)?.id?.toString());
    }, [fuelStopListDto]);

    const { configConstants, configConstantsIsLoading } = useAppSelector((state: any) => state.sustain);

    const resetEvNetwork = () => {
        setOriginCity(null);
        setDestinationCity(null);
        setSelectedLane(null);
        setPageNumber(1);
        setPageSize({ label: 10, value: 10 });
        dispatch(resetLaneOdPair());
        dispatch(getEVNetworkLanes({
            page_size: 10,
            page_number: 1,
            origin: null,
            destination: null,
            ev_radius: configConstants?.data?.ev_radius
        }));
    };

    useEffect(() => {
        if (configConstants?.data?.ev_radius) {
            dispatch(getEVNetworkLanes({
                page_size: pageSize?.value,
                page_number: pageNumber,
                origin: originCity || null,
                destination: destinationCity || null,
                ev_radius: configConstants?.data?.ev_radius
            }))
        };
    }, [dispatch, pageSize, pageNumber, originCity, destinationCity, configConstants]);

    useEffect(() => {
        if (evNetworkLanesData?.data?.data?.length > 0 && configConstants?.data?.ev_radius) {
            setSelectedLane(evNetworkLanesData?.data?.data?.[0]);
            setEvLaneListDto(evNetworkLanesData?.data?.data);
            setEvLaneListDto(evNetworkLanesData?.data?.data?.map((item: any) => ({
                ...item,
                thresholdDistance: "",
                isChecked: '',
            })));
            dispatch(getOptimusCordinates({
                lane_name: evNetworkLanesData?.data?.data?.[0]?.origin + "_" + evNetworkLanesData?.data?.data?.[0].destination,
                lane_id: evNetworkLanesData?.data?.data?.[0]?.id,
                fuel_type: "ev",
                radius: configConstants?.data?.ev_radius
            }));
        }
    }, [dispatch, evNetworkLanesData, configConstants]);


    const handleChangeLocation = (origin: string, destination: string) => {
        setSelectedLane(null);
        setPageNumber(1);
        setPageSize({ label: 10, value: 10 });
        setOriginCity(origin);
        setDestinationCity(destination);
    };


    // Dispatch action to fetch facility reduction graph data
    useEffect(() => {
        dispatch(evLocation());
    }, [dispatch]);

    useEffect(() => {
        if (checkLaneFuelData) {
            const isValidFuel = checkLaneFuelData?.data?.results?.find((res: any) => res.fuel === selectedFuelOption)?.isValid;
            setEvLaneListDto((prevList: any) =>
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
            setEvLaneListDto((prevList: any) =>
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
    // Return all the states and functions as an object
    return {
        evLocationDto,
        showFullScreen,
        setShowFullScreen,
        showLaneFullScreen,
        setShowLaneFullScreen,
        pageNumber,
        myRef,
        handleChangeLocation,
        evNetworkLanesData,
        evNetworkLanesLoading,
        optimusCordinatesData,
        optimusCordinatesLoading,
        setPageNumber,
        setPageSize,
        pageSize,
        resetEvNetwork,
        selectedLane,
        handleViewLane,
        childRef,
        configConstants,
        configConstantsIsLoading,
        evLocationLoading,
        activeLane,
        handleBlur,
        handleThresholdChange,
        isCheckLaneFuelLoading,
        evLaneListDto
    };
};


// Export the custom hook for use in other components
export default EvController;
