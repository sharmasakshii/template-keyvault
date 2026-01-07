import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import {
  checkLaneFuelStop,
  getLaneScenarioDetail,
  getLaneSortestPath,
  laneDestinationSearch,
  laneOriginSearch,
  resetLaneOdPair,
  resetLanePlanning,
} from "../../store/scopeThree/track/lane/laneDetailsSlice";
import { useCallback, useEffect, useState } from "react";
import {
  sortList,
  getCheckedValue,
  isCompanyEnable,
  decryptDataFunction,
  getBaseLine,
  buildIntermodal,
  buildHighway,
  buildCarrierShift,
  kmToMilesConst,
  ecryptDataFunction,
} from "utils";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  saveProjectDetailData,
  saveProjectRatingData,
  searchByEmail,
  resetProject,
} from "store/project/projectSlice";
import { useNavigate, useParams, useLocation, useSearchParams } from "react-router-dom";
import { OptionType } from "../../component/forms/multiSelect/MultiSelect";
import { getConfigConstants } from "store/sustain/sustainSlice";
import { companySlug, evProductCode, radiusOptions, evFuelId } from "constant";
import { getDivisionList } from "store/commonData/commonSlice";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export const LanePlanningController = () => {
  const [originCity, setOriginCity] = useState<any>("");
  const [destinationCity, setDestinationCity] = useState<any>("");
  const [selectHighWay, setSelectHighWay] = useState<any>(true);
  const [selectRail, setSelectRail] = useState<any>(true);
  const [priority, setPriority] = useState({
    emission: true,
    time: true,
    cost: true,
    distance: true,
  });
  const [menuIsOpen1, setMenuIsOpen1] = useState(false);
  const [menuIsOpen2, setMenuIsOpen2] = useState(false);
  const [showNoLane, setShowNoLane] = useState(false);
  const [showLaneCalculation, setShowLaneCalculation] = useState(false);
  const [selectedRecommondation, setSelectedRecommondation] = useState(0);
  const [recommondedLanes, setRecommondedLanes] = useState<any[]>([]);
  const [submit, setSubmit] = useState(false);
  const [showFuelStops, setShowFuelStops] = useState(true);
  const [showFuelStopsEV, setShowFuelStopsEV] = useState(false);
  const [showFuelStopsRD, setShowFuelStopsRD] = useState(true);
  const [createProjectModalShow, setCreateProjectModalShow] = useState(false);
  const [feedBackModalShow, setFeedBackModalShow] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedBackRating, setFeedBackRating] = useState(0);
  const [feedBackRatingError, setFeedBackRatingError] = useState(false);
  const [selectedFuelStop, setSelectedFuelStop] = useState<OptionType[]>([]);
  const [projectValues, setProjectValues] = useState({});
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [originInput, setOriginInput] = useState("");
  const [threshold, setThreshold]: any = useState("");
  const [radius, setRadius] = useState(50);
  const [destinationInput, setDestinationInput] = useState("");
  const { loginDetails } = useAppSelector((state: any) => state.auth);
  const [thresholdV, setThresholdV]: any = useState("");
  const [thresholdValue, setThresholdValue] = useState(true);
  const [laneName, setLaneName] = useState<string | null>(null);
  const {
    isLaneOriginLoading,
    isLaneDestinationLoading,
    laneOriginData,
    laneDestinationData,
    laneSortestPathData,
    laneSortestPathLoading,
    isLaneScenarioDetailLoading,
    laneScenarioDetail,
    checkLaneFuelData,
    isCheckLaneFuelLoading,
  } = useAppSelector((state: any) => state.lane);
  const {
    isLoadingSaveProject,
    saveProject,
    searchedUsers,
    isLoadingEmailSearch,
  } = useAppSelector((state: any) => state.project);
  const [filterList, setFilterList] = useState<any[]>([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { t } = useTranslation();
  const location = useLocation(); // includes pathname + search + hash

  const isCreateProject = isCompanyEnable(loginDetails?.data, [
    companySlug?.bmb,
  ]);
  const [searchParams] = useSearchParams();
  const priorityFlt = searchParams?.get('priority') || "";
  const boundTyp: any = searchParams?.get('boundType') || null
  const lessThan: any = searchParams?.get("isLessThan") || null

  useEffect(() => {
    setLaneName(null);
    setOriginCity("");
    setDestinationCity("");
    if (params?.laneName) {
      setShowLaneCalculation(true);
      setSubmit(true);
      setLaneName(params?.laneName);
    } else {
      setShowLaneCalculation(false);
    }
  }, [location, params?.laneName]);

  useEffect(() => {
    dispatch(getConfigConstants({ region_id: "" }));
  }, [dispatch]);
  const selectedLane = recommondedLanes.find(
    (obj) => obj["recommondationId"] === selectedRecommondation
  );

  const handleRadiusChange = (e: any) => {
    setRadius(e.value);
    setThresholdV(threshold);
  };
  useEffect(() => {
    if (
      isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo])
    ) {
      dispatch(getDivisionList());
    }
  }, [dispatch, loginDetails]);

  const { configConstants } = useAppSelector((state: any) => state.sustain);

  useEffect(() => {
    if (setThresholdV === "") {
      let finalThreshold = configConstants?.data?.threshold_distance || 0;
      setThreshold(finalThreshold);
      setThresholdV(finalThreshold);
    }
  }, [configConstants, setThresholdV]);

  const handleSearchOrigin = (data: any) => {
    if (data) {
      dispatch(laneOriginSearch({ type: "origin", keyword: data }));
    }
  };

  const searchDestination = (e: any) => {
    if (e?.value) {
      dispatch(
        laneDestinationSearch({ type: "dest", source: e?.value, keyword: "" })
      );
    }
  };

  const handleSearchDestination = (data: any) => {
    if (data && !originCity?.value) {
      dispatch(
        laneDestinationSearch({
          type: "dest",
          source: originCity?.value || "",
          keyword: data,
        })
      );
    }
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      if (value === "0") {
        toast.error("Threshold distance can't be 0");
      }
      setThreshold(value);

    }
  };

  const handleBlur = () => {
    if (threshold === "") {
      const distanceMiles =
        (laneSortestPathData?.data?.baseLine?.distance || 0) * kmToMilesConst;
      const finalThreshold =
        distanceMiles > configConstants?.data?.threshold_distance
          ? configConstants?.data?.threshold_distance
          : Math.floor(distanceMiles);
      setThreshold(finalThreshold);
    }
  };

  const processFuelStops = (selectedFuelStops: any[], threshold: number) => {
    const data = laneSortestPathData?.data;

    if (!data?.baseLine?.recommendedKLaneCoordinate?.length) return null;

    const firstCoord = data?.baseLine?.recommendedKLaneCoordinate[0];
    const lastCoord =
      data?.baseLine.recommendedKLaneCoordinate[
      data?.baseLine.recommendedKLaneCoordinate.length - 1
      ];
    const selectedCodes = selectedFuelStops.map((fuelStop: any) =>
      fuelStop.product_type_id?.toLowerCase().trim()
    );
    if (showFuelStopsEV) {
      selectedCodes.push(evFuelId);
    }
    return {
      thresholdDistance: Number(threshold),
      // fuel_types,
      lane_name: laneName,
      lane_id: data?.lane_id,
      k_count: data?.baseLine?.k_count,
      product_type_id: selectedCodes?.toString(),
      originCordinates: {
        latitude: firstCoord.latitude,
        longitude: firstCoord.longitude,
      },
      destCordinates: {
        latitude: lastCoord.latitude,
        longitude: lastCoord.longitude,
      },
      radius: radius,
    };
  };
  const handleChange = (selected: OptionType[]) => {
    if (!selected || selected.length < 1) {
      toast.error("Please select at least one fuel stop.");
    } else {
      setSelectedFuelStop(selected);
      setShowFuelStops(true);
      setThresholdV(threshold);
    }
  };
  const handleClearSelectSelection = (optionToRemove?: any) => {
    if (!optionToRemove) {
      toast.error("Please select at least one fuel stop.");
      return;
    }
    setThresholdV(threshold);
    setSelectedFuelStop((prev: any[]) => {
      const updated = prev.filter((o: any) => o.value !== optionToRemove.value);

      if (updated.length === 0) {
        toast.error("Please select at least one fuel stop.");
        return prev;
      }

      return updated;
    });
  };

  const handleAlternativeFuelCheckbox = () => {
    if (showFuelStops && !showFuelStopsEV) {
      toast.error("At least one option must remain selected");
      return;
    }
    const data = !showFuelStops
      ? laneSortestPathData?.data?.baseLine?.unique_fuel_stops
        ?.filter(
          (res: any) =>
            res.product_code ===
            laneSortestPathData?.data?.baseLine?.fuel_stop?.product_code
        )
        ?.map((i: any) => ({ ...i, label: i?.name, value: i?.id }))
      : [];
    setSelectedFuelStop(data);
    setShowFuelStops(!showFuelStops);
  };

  const handleEvCheckbox = () => {
    if (showFuelStopsEV && !showFuelStops) {
      toast.error("At least one option must remain selected");
      return;
    }
    setShowFuelStopsEV(!showFuelStopsEV);
    const payload = processFuelStops(selectedFuelStop, thresholdV);

    const ids = payload?.product_type_id?.split(",") ?? [];
    const evFuelId = "297";

    let updatedIds;

    if (!showFuelStopsEV) {
      updatedIds = [...new Set([...ids, evFuelId])];
    } else {
      updatedIds = ids.filter((id) => id !== evFuelId);
    }

    const modifiedPayload = {
      ...payload,
      product_type_id: updatedIds.join(","),
    };
    dispatch(checkLaneFuelStop(modifiedPayload));
  };

  const handleSearch = () => {
    const baseLine = laneSortestPathData?.data;
    if (!baseLine) return;
    setThresholdV(threshold);
  };

  const reverseLocation = () => {
    const origin = originCity;
    setOriginCity(destinationCity);
    setDestinationCity(origin);
  };

  const handleViewLaneCalculation = (e: any) => {
    e.preventDefault();
    setLaneName(`${originCity?.value}_${destinationCity?.value}`);
  };

  const handleResetLane = () => {
    setShowNoLane(false);
    setShowFuelStops(true);
    setShowFuelStopsEV(true);
    setShowLaneCalculation(false);
    setSelectedRecommondation(0);
    setRecommondedLanes([]);
    setSubmit(false);
    setOriginCity("");
    setDestinationCity("");
    dispatch(resetLanePlanning());
    setFeedBackModalShow(false);
    setCreateProjectModalShow(false);
    handleReset();
    navigate({
      pathname:
        params?.regionId
          ? `/scope3/decarb-problem-lanes/${params?.regionId}/${params?.backPage}`
          : `/scope3/${params?.pageUrl ?? 'lane-planning'}`,
      search: new URLSearchParams({
        ...(priorityFlt !== "" && { priority: priorityFlt }),
        ...(lessThan !== null && { isLessThan: String(lessThan) }),
        ...(boundTyp !== null && { boundType: String(boundTyp) }),
      }).toString(),
    });
  };
  const handleSectionClick = () => {
    setMenuIsOpen1(false);
    setMenuIsOpen2(false);
  };

  const handleOriginMenuChange = (event: any) => {
    event.stopPropagation();
    setMenuIsOpen1(!menuIsOpen1);
    setMenuIsOpen2(false);
  };
  const handleDestinationMenuChange = (event: any) => {
    event.stopPropagation();
    setMenuIsOpen1(false);
    setMenuIsOpen2(!menuIsOpen2);
  };

  const handleSelectRecommondation = (index: number, key: string) => {
    setSelectedRecommondation(index);
  };

  const handleOpenCreateProject = (index: number) => {
    setSelectedRecommondation(index);
    setCreateProjectModalShow(true);
    handleReset();
  };

  const schema = yup.object().shape({
    projectManagerEmail: yup
      .object()
      .required("Project manager email should not be empty"),
    projectName: yup
      .string()
      .trim("Space are not allow")
      .min(3, "Please enter the min 3 letter")
      .required("Project name should not be empty"),
    projectDesc: yup
      .string()
      .trim("Space are not allow")
      .min(3, "Please enter the min 3 letter")
      .required("Project description should not be empty"),
    projectStart: yup.date().required("Project start date should not be empty"),
    projectEnd: yup
      .date()
      .required("Project end date should not be empty")
      .min(yup.ref("projectStart"), "Project end date cannot be in the past"),
  });

  let _Fields: any = {
    projectName: "",
    projectManagerEmail: "",
    invitedUser: [],
    projectDesc: "",
    projectStart: "",
    projectEnd: "",
  };

  const handleSearchUser = (user: string) => {
    if (user.length > 0) {
      dispatch(searchByEmail({ email: user }));
    }
  };

  const handleSelectUser = (e: any) => {
    formik.setFieldValue("projectManagerEmail", e);
  };

  const handleSelectInviteUser = (e: any) => {
    formik.setFieldValue("invitedUser", [
      ...formik.values.invitedUser,
      e.value,
    ]);
  };

  const handleDeleteInvite = (e: any) => {
    formik.setFieldValue(
      "invitedUser",
      formik.values.invitedUser?.filter((user: any) => user?.email !== e?.email)
    );
  };

  const handleReset = () => {
    formik.resetForm();
    setFeedbackMessage("");
    setFeedBackRating(0);
    setFeedBackRatingError(false);
  };

  const handleClose = () => {
    setFeedBackModalShow(false);
    setCreateProjectModalShow(false);
    dispatch(resetProject());
    handleReset();
  };

  const ratingChanged = (newRating: number) => {
    setFeedBackRating(newRating);
  };

  const handleSubmitFeedback = () => {
    if (feedBackRating) {
      dispatch(
        saveProjectRatingData({
          description: feedbackMessage,
          rating: feedBackRating,
          project_id: saveProject?.data?.id,
        })
      );
      handleClose();
    } else {
      setFeedBackRatingError(true);
    }
  };

  useEffect(() => {
    dispatch(resetLaneOdPair());
  }, [dispatch]);

  useEffect(() => {
    if (saveProject) {
      setFeedBackModalShow(true);
    }
  }, [saveProject]);

  const handleSubmitForm = () => {
    const lane = recommondedLanes.find(
      (obj) => obj["recommondationId"] === selectedRecommondation
    );
    let payload = {
      manager_id: formik.values?.projectManagerEmail?.value,
      project_name: formik.values.projectName,
      description: formik.values.projectDesc,
      start_date: formik.values.projectStart,
      end_date: formik.values.projectEnd,
      type: lane?.key,
      lane_id: laneSortestPathData?.data?.lane_id,
      recommendation_id: lane?.k_count,
      users_invited: formik?.values?.invitedUser.map((ele: any) => ele?.id),
      product_type_code: lane?.fuel_stop?.product_code || "",
      carrier_code: lane?.carriers?.[0]?.carrier || "",
      project_summary: projectValues,
      is_rd: getCheckedValue(
        { showFuelStops, showFuelStopsEV, showFuelStopsRD },
        showFuelStopsRD,
        lane?.recommendedKLaneFuelStop
      ).showFuelStopsRD,
      is_alternative: getCheckedValue(
        { showFuelStops, showFuelStopsEV, showFuelStopsRD },
        showFuelStops,
        lane?.recommendedKLaneFuelStop
      ).showFuelStops,
      is_ev: getCheckedValue(
        { showFuelStops, showFuelStopsEV, showFuelStopsRD },
        showFuelStopsEV,
        lane?.recommendedKLaneFuelStop
      ).showFuelStopsEV,
      fuel_type:
        selectedFuelStop?.length === 0 &&
          getCheckedValue(
            { showFuelStops, showFuelStopsEV, showFuelStopsRD },
            showFuelStops,
            lane?.recommendedKLaneFuelStop
          ).showFuelStops
          ? lane?.fuel_stop?.product_code
          : selectedFuelStop?.map((i: any) => i?.product_code)?.toString(),
      rd_radius: configConstants?.data?.rd_radius,
      bio_1_20_radius: configConstants?.data?.bio_1_20_radius,
      bio_21_99_radius: configConstants?.data?.bio_21_99_radius,
      bio_100_radius: configConstants?.data?.bio_100_radius,
      ev_radius: configConstants?.data?.ev_radius,
      optimus_radius: configConstants?.data?.optimus_radius,
      rng_radius: configConstants?.data?.rng_radius,
      hydrogen_radius: configConstants?.data?.hydrogen_radius,
      hvo_radius: configConstants?.data?.hvo_radius,
      threshold_distance: Number(thresholdV),
      ...(isCompanyEnable(loginDetails?.data, [companySlug?.demo])
        ? {
          b99_radius: configConstants?.data?.b99_radius,
        }
        : {}),
    };
    payload = ecryptDataFunction(payload);
    dispatch(saveProjectDetailData({ payload: payload }));
    setProjectValues({});
  };

  const formik = useFormik({
    initialValues: _Fields,
    validationSchema: schema,
    onSubmit: handleSubmitForm,
  });

  const getFuelStopList = (laneSortestPathData: any, filterList: any[]) => {
    const uniqueStops =
      laneSortestPathData?.data?.baseLine?.unique_fuel_stops ?? [];
    return uniqueStops
      .filter((res: any) => filterList?.includes(res?.product_code))
      .map((i: any) => ({ ...i, label: i?.name, value: i?.id }));
  };

  const hasRecommendedStops = (baseLine: any) =>
    Boolean(baseLine?.recommendedKLaneFuelStop?.length > 0);

  const hasMatchingUniqueStops = (baseLine: any, list: any[]) =>
    Boolean(
      baseLine?.unique_fuel_stops?.some((res: any) => {
        return list?.includes(res?.product_code)
      })
    );

  const hasMatchingRecommendedCodes = (baseLine: any, list: any[]) =>
    Boolean(
      baseLine?.recommendedKLaneFuelStop?.some((res: any) =>
        list?.includes(res?.product_codes)
      )
    );

  const shouldIncludeBaseLine = (baseLine: any, filterList: any[]) =>
    baseLine &&
    hasRecommendedStops(baseLine) &&
    (hasMatchingUniqueStops(baseLine, filterList) ||
      hasMatchingRecommendedCodes(baseLine, filterList));

  const addAlternativePathsWithFilter = (
    alternativePath: any[],
    baseLine: any,
    highway: any[],
    carrierShift: any,
    intermodal: any,
    filterList: any[]
  ) => {
    if (shouldIncludeBaseLine(baseLine, filterList)) {
      alternativePath.push(baseLine);
    }

    if (selectHighWay && hasMatchingUniqueStops(baseLine, filterList)) {
      alternativePath.push(...highway);
    }
    if (carrierShift && filterList?.includes("carrier")) {
      alternativePath.push(carrierShift);
    }
    if (
      selectRail &&
      intermodal &&
      hasRecommendedStops(baseLine) &&
      filterList?.includes("intermodal")
    ) {
      alternativePath.push(intermodal);
    }
  };

  const addAlternativePathsWithoutFilter = (
    alternativePath: any[],
    baseLine: any,
    highway: any[],
    carrierShift: any,
    intermodal: any
  ) => {
    if (baseLine && hasRecommendedStops(baseLine)) {
      alternativePath.push(baseLine);
    }
    if (selectHighWay) {
      alternativePath.push(...highway);
    }
    if (carrierShift) {
      alternativePath.push(carrierShift);
    }
    if (selectRail && intermodal) {
      alternativePath.push(intermodal);
    }
  };

  // main refactored callback
  const getLaneList = useCallback(() => {
    const data = laneSortestPathData?.data;
    const baseLine = getBaseLine(laneSortestPathData);
    let alternativePath: any[] = [];

    // Prebuild options
    const intermodal = buildIntermodal(laneSortestPathData);
    const highway = buildHighway(laneSortestPathData);
    const carrierShift = buildCarrierShift(laneSortestPathData);

    // If filter param present, prepare UI state related to fuel stops
    if (params?.filter) {
      const fuelStopList = getFuelStopList(laneSortestPathData, filterList);
      setShowFuelStops(fuelStopList?.length > 0);

      const evPresent =
        data?.baseLine?.recommendedKLaneFuelStop?.filter(
          (res: any) => res.product_codes === evProductCode
        ) && filterList?.includes(evProductCode);

      setShowFuelStopsEV(Boolean(evPresent));

      addAlternativePathsWithFilter(
        alternativePath,
        baseLine,
        highway,
        carrierShift,
        intermodal,
        filterList
      );
    } else {
      addAlternativePathsWithoutFilter(
        alternativePath,
        baseLine,
        highway,
        carrierShift,
        intermodal
      );
    }

    // assign recommendation id
    alternativePath.forEach((element: any, index: number) => {
      element.recommondationId = index;
    });

    // sort and set UI flags
    const finalRecommondation: any[] = sortList(
      alternativePath,
      "distance",
      "asc"
    );
    const hasAny = finalRecommondation.length > 0;
    setShowNoLane(!hasAny);
    setShowLaneCalculation(hasAny);
    setRecommondedLanes(finalRecommondation);
  }, [
    laneSortestPathData,
    selectHighWay,
    selectRail,
    filterList,
    params?.filter,
  ]);

  useEffect(() => {
    if (laneSortestPathData && submit) {
      if (
        !laneSortestPathData?.data?.baseLine &&
        !laneSortestPathData?.data?.laneCarriers?.length
      ) {
        setShowNoLane(true); // Adjust based on your UI logic
        setShowLaneCalculation(false);
      } else {
        getLaneList();
      }
    }
  }, [laneSortestPathData, submit, getLaneList]);

  useEffect(() => {
    if (
      thresholdValue &&
      laneSortestPathData?.data?.baseLine?.distance &&
      configConstants?.data?.threshold_distance
    ) {
      const distanceMiles =
        (laneSortestPathData?.data?.baseLine?.distance || 0) * kmToMilesConst;
      const finalThreshold =
        distanceMiles > configConstants?.data?.threshold_distance
          ? configConstants?.data?.threshold_distance
          : Math.floor(distanceMiles);
      setThresholdValue(false);
      setThreshold(finalThreshold);
      setThresholdV(finalThreshold);
    }
  }, [laneSortestPathData, configConstants, thresholdValue]);

  useEffect(() => {
    if (params?.filter) {
      let input = params?.filter.replace(/-/g, "+").replace(/_/g, "/");
      while (input.length % 4) input += "=";
      setFilterList(decryptDataFunction(input));
    }
  }, [dispatch, params]);

  useEffect(() => {
    if (laneName) {
      setSubmit(true);
      setShowLaneCalculation(true);

      let laneData = laneName.split("_");
      setOriginCity({ label: laneData?.[0], value: laneData?.[0] });
      setDestinationCity({ label: laneData?.[1], value: laneData?.[1] });
      setSelectedFuelStop([]);
      dispatch(getLaneScenarioDetail({ name: laneName }));

      // First load API call
      dispatch(getLaneSortestPath({ name: laneName, radius: radius }));
    }
  }, [dispatch, laneName, radius]);

  const originOptions =
    (Array.isArray(laneOriginData?.data) &&
      laneOriginData?.data?.map((ele: any) => {
        return { label: ele?.origin, value: ele?.origin };
      })) ||
    [];

  const destinationOptions =
    (Array.isArray(laneDestinationData?.data) &&
      laneDestinationData?.data?.map((ele: any) => {
        return { label: ele?.dest, value: ele?.dest };
      })) ||
    [];

  useEffect(() => {
    if (selectedFuelStop?.length > 0 || showFuelStopsEV) {
      const payload = processFuelStops(selectedFuelStop, thresholdV);
      if (payload) {
        dispatch(checkLaneFuelStop(payload));
      }
    }
  }, [selectedFuelStop, dispatch, thresholdV, showFuelStopsEV]);

  return {
    originInput,
    setOriginInput,
    destinationInput,
    setDestinationInput,
    originCity,
    setOriginCity,
    originOptions,
    destinationCity,
    setDestinationCity,
    destinationOptions,
    handleSearchOrigin,
    handleSearchDestination,
    selectHighWay,
    setSelectHighWay,
    selectRail,
    setSelectRail,
    reverseLocation,
    handleViewLaneCalculation,
    handleResetLane,
    priority,
    setPriority,
    menuIsOpen1,
    setMenuIsOpen1,
    isLaneOriginLoading,
    menuIsOpen2,
    setMenuIsOpen2,
    isLaneDestinationLoading,
    handleSectionClick,
    handleOriginMenuChange,
    handleDestinationMenuChange,
    searchDestination,
    laneSortestPathLoading,
    isLaneScenarioDetailLoading,
    showNoLane,
    showLaneCalculation,
    selectedRecommondation,
    recommondedLanes,
    laneSortestPathData,
    laneScenarioDetail,
    showFuelStops,
    setShowFuelStops,
    handleSelectRecommondation,
    navigate,
    handleOpenCreateProject,
    createProjectModalShow,
    formik,
    handleClose,
    feedBackModalShow,
    isLoadingSaveProject,
    feedBackRating,
    ratingChanged,
    feedbackMessage,
    setFeedbackMessage,
    handleSubmitFeedback,
    handleSearchUser,
    searchedUsers,
    handleSelectUser,
    handleSelectInviteUser,
    handleDeleteInvite,
    feedBackRatingError,
    params,
    showFuelStopsEV,
    selectedFuelStop,
    setSelectedFuelStop,
    setShowFuelStopsEV,
    setProjectValues,
    showFullScreen,
    setShowFullScreen,
    configConstants,
    showFuelStopsRD,
    setShowFuelStopsRD,
    isLoadingEmailSearch,
    isCreateProject,
    selectedLane,
    filterList,
    t,
    handleSearch,
    thresholdV,
    threshold,
    handleThresholdChange,
    checkLaneFuelData,
    isCheckLaneFuelLoading,
    handleClearSelectSelection,
    handleChange,
    radiusOptions,
    radius,
    handleRadiusChange,
    handleAlternativeFuelCheckbox,
    handleEvCheckbox,
    handleBlur,
  };
};
