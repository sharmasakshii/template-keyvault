// Import necessary libraries and components
import { useEffect, useState } from "react"; // Import React and required hooks
import { useNavigate, useParams, useLocation } from "react-router-dom"; // Import 'useParams' hook from 'react-router-dom'
import { useAppDispatch, useAppSelector } from "store/redux.hooks"; // Import custom Redux hooks
import { getProjectDetails, resetProjectDetails } from "../../store/project/projectSlice"; // Import Redux action 'getProjectDetails'
import { checkLaneFuelStop, getLaneScenarioDetail } from "store/scopeThree/track/lane/laneDetailsSlice";
import { getConfigConstants } from "store/sustain/sustainSlice";
import { isCompanyEnable } from "utils";
import { companySlug } from "constant";

// Define a functional component named 'ProjectDetailController'
const ProjectDetailController = () => {
  // Initialize state variables and Redux-related variables
  const dispatch = useAppDispatch(); // Redux dispatch function
  const navigate = useNavigate()
  const [recommondedLanes, setRecommondedLanes] = useState<any>([])
  const [showFuelStops, setShowFuelStops] = useState(true)
  const [showFullScreen, setShowFullScreen] = useState(false)
  // Retrieve data from Redux store using custom Redux selectors
  const { projectDetails, isLoadingProjectDetails } = useAppSelector((state: any) => state.project);
  const { laneScenarioDetail, isLaneScenarioDetailLoading, checkLaneFuelData,
    isCheckLaneFuelLoading } = useAppSelector((state: any) => state.lane)
  // Extract the 'id' parameter from the URL
  let { id, laneName }: any = useParams();
  const { loginDetails } = useAppSelector((state) => state.auth);
  const isRBCompany = isCompanyEnable(loginDetails?.data, [companySlug?.rb]);
  const location = useLocation();

  useEffect(() => {
    dispatch(getConfigConstants({ region_id: "" }));
  }, [dispatch]);

  const {
    configConstants,
  } = useAppSelector((state: any) => state.sustain);

  const [showFuelStopsEV, setShowFuelStopsEV] = useState(true)
  const [showFuelStopsRD, setShowFuelStopsRD] = useState(true)


  // useEffect to scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    return () => {
      dispatch(resetProjectDetails());
    };
  }, [dispatch, location.pathname]);
  // Retrieve project details from Redux store when 'id' changes
  useEffect(() => {
    dispatch(getProjectDetails({ id: id }));
    dispatch(getLaneScenarioDetail({ name: laneName }))
  }, [dispatch, id, laneName]);

  useEffect(() => {
    const data = projectDetails?.data;
    if (!data) return;
    const fuels = data?.fuel_stops;
    const fuelCodes = data?.projectDetail?.fuel_type.split(",");
    const selectedIds = fuels?.filter((fuel: any) => fuelCodes.includes(fuel.code))?.map((fuel: any) => fuel.id);
    if (data?.projectDetail?.is_ev) {
      if (!selectedIds.includes("297")) {
        selectedIds.push("297");
      }
    }
    const payload = {
      thresholdDistance: Number(data?.projectDetail?.threshold_distance || configConstants?.data?.threshold_distance),
      lane_name: laneName,
      lane_id: data?.laneData?.id,
      k_count: data?.laneRecommendation?.recommendedLane?.costByLane?.k_count,
      product_type_id: selectedIds?.toString(),
      radius: data?.projectDetail?.bio_1_20_radius,
    }
    if (payload && data?.projectDetail?.type === "alternative_fuel") {
      dispatch(checkLaneFuelStop(payload));
    }
  }, [dispatch, projectDetails, laneName, configConstants]);

  useEffect(() => {
    let alternativePath: any = {};
    if (projectDetails?.data?.projectDetail) {
      setShowFuelStops(projectDetails?.data?.projectDetail?.is_alternative)
      setShowFuelStopsEV(projectDetails?.data?.projectDetail?.is_ev)
    }

    alternativePath = { ...alternativePath, deltaMetrix: projectDetails?.data?.laneRecommendation?.delta_metrix }
    const baseLine = projectDetails?.data?.laneRecommendation?.baseLine
      ? {
        ...projectDetails?.data?.laneRecommendation?.baseLine, ev_fuel_stop: projectDetails?.data?.ev_fuel_stop, key: "alternative_fuel", isBaseLine: true, ...projectDetails.data?.laneRecommendation.baseLine?.highwayLaneMetrix
      }
      : null;
    alternativePath = { ...alternativePath, baseLine: baseLine, ev_fuel_stop: projectDetails?.data?.ev_fuel_stop };
    if (projectDetails?.data?.projectDetail?.type === "alternative_fuel") {
      const highway = projectDetails?.data?.laneRecommendation?.recommendedLane && { ...projectDetails?.data?.laneRecommendation?.recommendedLane, key: "alternative_fuel", ...projectDetails?.data?.laneRecommendation?.recommendedLane?.highwayLaneMetrix }
      alternativePath = { ...alternativePath, lane: highway, ev_fuel_stop: projectDetails?.data?.ev_fuel_stop };

    } else if (projectDetails?.data?.projectDetail?.type === "carrier_shift") {
      const carrierShift = projectDetails?.data?.laneRecommendation?.getCarriesOfLane
        && {
        ...projectDetails?.data?.laneRecommendation?.baseLine, fuel_stop: {}, key: "carrier_shift", k_count: 1, cost: null,
        emission: null, carriers: projectDetails?.data?.laneRecommendation?.getCarriesOfLane
        , ...projectDetails?.data?.laneRecommendation?.baseLine?.highwayLaneMetrix
      }
      alternativePath = { ...alternativePath, lane: carrierShift };
    } else if (projectDetails?.data?.projectDetail?.type === "modal_shift") {
      const intermodal = projectDetails?.data?.laneRecommendation?.laneIntermodalCordinateData &&
      {
        key: "modal_shift",
        cost: null,
        emission: null,
        k_count: 1,
        fuel_stop: projectDetails?.data?.laneRecommendation?.baseLine?.fuel_stop,
        carrier_image: projectDetails?.data?.laneRecommendation?.laneIntermodalCordinateData?.carrier_image,
        carrier_code: projectDetails?.data?.laneRecommendation?.laneIntermodalCordinateData?.carrier_code,
        provider_image: projectDetails?.data?.laneRecommendation?.laneIntermodalCordinateData?.provider_image,
        distance: projectDetails?.data?.laneRecommendation?.laneIntermodalCordinateData?.rail_distance + projectDetails?.data?.laneRecommendation?.laneIntermodalCordinateData?.road_distance,
        recommendedTerminalData: projectDetails?.data?.laneRecommendation?.laneIntermodalCordinateData?.recommendedTerminalData,
        recommendedIntermodalData: projectDetails?.data?.laneRecommendation?.laneIntermodalCordinateData?.recommendedIntermodalData,
        time: projectDetails?.data?.laneRecommendation?.laneIntermodalCordinateData?.rail_time + projectDetails?.data?.laneRecommendation?.laneIntermodalCordinateData?.road_time,
        laneIntermodalDto: { ...projectDetails?.data?.laneRecommendation, baseLine: baseLine }
      };
      alternativePath = { ...alternativePath, lane: intermodal };
    }
    setRecommondedLanes(alternativePath);
  }, [projectDetails])

  return {
    projectDetails,
    isLoadingProjectDetails,
    recommondedLanes,
    isLaneScenarioDetailLoading,
    laneScenarioDetail,
    navigate,
    laneName,
    showFuelStops,
    setShowFuelStops,
    id,
    loginDetails,
    showFuelStopsEV,
    setShowFuelStopsEV,
    showFullScreen,
    setShowFullScreen,
    configConstants,
    showFuelStopsRD,
    setShowFuelStopsRD,
    isRBCompany,
    checkLaneFuelData,
    isCheckLaneFuelLoading,
  };
};

export default ProjectDetailController; // Export the 'ProjectDetailController' component
