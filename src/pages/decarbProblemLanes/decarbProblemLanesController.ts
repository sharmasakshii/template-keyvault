import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  getDivisionList,
  regionShow,
} from "../../store/commonData/commonSlice";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import {
  decarbProblemLanes,
  resetDecarbData,
} from "store/scopeThree/track/decarb/decarbSlice";
import {
  getOrder,
  isPermissionChecked,
  getBoolean,
  isCompanyEnable,
  getSelectedFilterList,
  getStateName,
  getDivisionName,
  getRegionName,
} from "utils";
import { companySlug, routeKey } from "constant";
import { resetLaneOdPair } from "store/scopeThree/track/lane/laneDetailsSlice";
import { getConfigConstants } from "store/sustain/sustainSlice";
import { useTranslation } from "react-i18next";

const initialChecksModal = {
  is_bio_100: 0,
  is_bio_21_99: 0,
  is_bio_1_20: 0,
  is_rd: 0,
  is_ev: 0,
  is_rng: 0,
  is_optimus: 0,
  is_hydrogen: 0,
  carrier: 0,
  intermodal: 0,
  is_b99: 0,
};

const DecarbProblemLaneController = () => {
  const { t } = useTranslation();

  const params: any = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const priority = searchParams?.get('priority') || "";
  const boundTyp: any = searchParams?.get('boundType') || null
  const lessThan: any = searchParams?.get("isLessThan") || null

  let id: any = params?.id;

  const [boundType, setBoundType] = useState<any>(boundTyp);
  const state = id;
  const [isLessThan, setIsLessThan] = useState<number | null>(lessThan);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [order, setOrder] = useState<string>("desc");
  const [gridType, setGridType] = useState("card");
  const [col_name, setCol_name] = useState<string>("emission");
  const [pageSize, setPageSize] = useState({
    label: 12,
    value: 12,
  });
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<any>(
    Number(params?.page) || 1
  );
  const { regions, divisions } = useAppSelector(
    (state: any) => state.commonData
  );
  const [fuelTypeModalOpen, setFuelTypeModalOpen] = useState(false);
  const toggleFuelTypeModal = () => setFuelTypeModalOpen(!fuelTypeModalOpen);
  const { loginDetails } = useAppSelector((state: any) => state.auth);
  const permissionsDto = loginDetails?.data?.permissionsData || [];
  const isPEPCompany = isCompanyEnable(loginDetails?.data, [companySlug?.pep]);
  // Add state for tracking user interaction and no data message
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [showNoDataMessage, setShowNoDataMessage] = useState(false);
  const companySlugBMB = loginDetails?.data?.Company?.slug;
  const companyLocationMapping = {
    [companySlug.bmb]: getStateName(state),
    [companySlug?.pep]: getDivisionName(id, divisions),
    [companySlug?.rb]: getRegionName(regions, id, false, false),
    [companySlug?.demo]: getDivisionName(id, divisions),
    [companySlug?.lw]: getRegionName(regions, id, false, false),
    [companySlug?.tql]: getRegionName(regions, id, false, false),
    [companySlug?.adm]: getRegionName(regions, id, false, false),
  };
  const initialChecks = {
    is_bio_100: getBoolean(
      isPermissionChecked(permissionsDto, routeKey?.AlternativeFuel)
        ?.isChecked &&
      isCompanyEnable(loginDetails?.data, [
        companySlug?.pep,
        companySlug?.demo,
        companySlug?.rb,
        companySlug?.bmb,
      ])
    ),
    is_bio_1_20: getBoolean(
      isPermissionChecked(permissionsDto, routeKey?.AlternativeFuel)?.isChecked
    ),
    is_bio_21_99: getBoolean(
      isPermissionChecked(permissionsDto, routeKey?.AlternativeFuel)?.isChecked
    ),
    is_b99: getBoolean(
      isPermissionChecked(permissionsDto, routeKey?.AlternativeFuel)
        ?.isChecked && isCompanyEnable(loginDetails?.data, [companySlug?.demo])
    ),
    is_rd: getBoolean(
      isPermissionChecked(permissionsDto, routeKey?.AlternativeFuel)
        ?.isChecked &&
      isCompanyEnable(loginDetails?.data, [
        companySlug?.pep,
        companySlug?.demo,
        companySlug?.rb,
        companySlug?.bmb,
      ])
    ),
    is_ev: getBoolean(
      isPermissionChecked(permissionsDto, routeKey?.AlternativeFuel)
        ?.isChecked && isCompanyEnable(loginDetails?.data, companySlug?.pep)
    ),
    is_rng: getBoolean(
      isPermissionChecked(permissionsDto, routeKey?.AlternativeFuel)
        ?.isChecked &&
      isCompanyEnable(loginDetails?.data, [
        companySlug?.pep,
        companySlug?.demo,
        companySlug?.rb,
        companySlug?.bmb,
      ])
    ),
    is_hvo: getBoolean(
      isPermissionChecked(permissionsDto, routeKey?.AlternativeFuel)
        ?.isChecked && isCompanyEnable(loginDetails?.data, companySlug?.pep)
    ),
    is_optimus: getBoolean(
      isPermissionChecked(permissionsDto, routeKey?.AlternativeFuel)
        ?.isChecked && isCompanyEnable(loginDetails?.data, companySlug?.pep)
    ),
    is_hydrogen: getBoolean(
      isPermissionChecked(permissionsDto, routeKey?.AlternativeFuel)
        ?.isChecked &&
      isCompanyEnable(loginDetails?.data, [
        companySlug?.pep,
        companySlug?.demo,
      ])
    ),
    carrier: getBoolean(
      isPermissionChecked(permissionsDto, routeKey?.CarrierShift)?.isChecked
    ),
    intermodal: getBoolean(
      isPermissionChecked(permissionsDto, routeKey?.ModalShift)?.isChecked
    ),
  };
  const [fuelTypeChecks, setFuelTypeChecks] = useState<any>(initialChecks);
  const [modalChecks, setModalChecks] = useState<any>(initialChecksModal);
  const { decarbProblemLanesData, decarbProblemLanesLoading } = useAppSelector(
    (state: any) => state.decarb
  );
  const childRef = useRef<any>(null);

  const [originCity, setOriginCity] = useState<any>(null);
  const [destinationCity, setDestinationCity] = useState<any>(null);
  const { configConstants, configConstantsIsLoading } = useAppSelector(
    (state: any) => state.sustain
  );

  const checkNullValue = (value: any) => (value !== 0 ? value : null);

  const getFuelCheck = (company: any, value: string) => {
    return isCompanyEnable(loginDetails?.data, company)
      ? checkNullValue(value)
      : null;
  };

  useEffect(() => {
    dispatch(regionShow({ division_id: "" }));
    dispatch(getConfigConstants({ region_id: "" }));
    setIsPageLoading(true);
  }, [dispatch]);

  useEffect(() => {
    if (
      isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo])
    ) {
      dispatch(getDivisionList());
    }
  }, [dispatch, loginDetails]);

  useEffect(() => {
    if (isPageLoading && configConstants?.data) {
      const activeCompany = companySlugBMB;

      const isPEPOrGEN = isCompanyEnable(loginDetails?.data, [
        companySlug?.pep,
        companySlug?.demo,
      ]);

      const isBMB = activeCompany === companySlug?.bmb;

      let baseFilters;

      if (isPEPOrGEN) {
        baseFilters = {
          division_id: id,
        };
      } else if (isBMB) {
        baseFilters = {
          state_abbr: id,
          in_out_bound: boundType ? Number(boundType) : null,
          is_less_than_150: isLessThan ? Number(isLessThan) : null,
        };
      } else {
        baseFilters = {
          region_id: id,
        };
      }
      dispatch(
        decarbProblemLanes({
          ...baseFilters,
          page: currentPage,
          page_size: pageSize?.value,
          col_name: col_name,
          order_by: order,

          // Fuel type filters
          carrier_shift: checkNullValue(fuelTypeChecks?.carrier),
          modal_shift: checkNullValue(fuelTypeChecks?.intermodal),

          is_rd: getFuelCheck(
            [
              companySlug?.pep,
              companySlug?.demo,
              companySlug?.rb,
              companySlug?.bmb,
            ],
            fuelTypeChecks?.is_rd
          ),
          is_ev: getFuelCheck([companySlug?.pep], fuelTypeChecks?.is_ev),
          is_hvo: getFuelCheck([companySlug?.pep], fuelTypeChecks?.is_hvo),
          is_bio_1_20: checkNullValue(fuelTypeChecks?.is_bio_1_20),
          is_bio_21_99: checkNullValue(fuelTypeChecks?.is_bio_21_99),
          is_bio_100: getFuelCheck(
            [
              companySlug?.pep,
              companySlug?.demo,
              companySlug?.rb,
              companySlug?.bmb,
            ],
            fuelTypeChecks?.is_bio_100
          ),
          optimus: getFuelCheck([companySlug?.pep], fuelTypeChecks?.is_optimus),
          rng: getFuelCheck(
            [
              companySlug?.pep,
              companySlug?.demo,
              companySlug?.rb,
              companySlug?.bmb,
            ],
            fuelTypeChecks?.is_rng
          ),
          hydrogen: getFuelCheck(
            [companySlug?.pep, companySlug?.demo],
            fuelTypeChecks?.is_hydrogen
          ),

          // Radius filters
          rd_radius: configConstants?.data?.rd_radius,
          hvo_radius: configConstants?.data?.hvo_radius,
          bio_1_20_radius: configConstants?.data?.bio_1_20_radius,
          bio_100_radius: configConstants?.data?.bio_100_radius,
          bio_21_99_radius: configConstants?.data?.bio_21_99_radius,
          ev_radius: configConstants?.data?.ev_radius,
          optimus_radius: configConstants?.data?.optimus_radius,
          rng_radius: configConstants?.data?.rng_radius,
          hydrogen_radius: configConstants?.data?.hydrogen_radius,

          // Cities
          origin: originCity,
          destination: destinationCity,

          // Only for GEN (demo)
          ...(isCompanyEnable(loginDetails?.data, [companySlug?.demo])
            ? {
              b99_radius: configConstants?.data?.b99_radius,
              is_b99: checkNullValue(fuelTypeChecks?.is_b99),
            }
            : {}),
        })
      );
    }
  }, [
    dispatch,
    id,
    isPageLoading,
    loginDetails,
    configConstants,
    currentPage,
    pageSize,
    col_name,
    order,
    fuelTypeChecks,
    originCity,
    destinationCity,
    boundType,
    isLessThan,
  ]);

  // Add effect to monitor data changes and show no data message
  useEffect(() => {
    if (hasUserInteracted && !decarbProblemLanesLoading) {
      const hasData =
        decarbProblemLanesData?.data?.getDecarbSummary &&
        decarbProblemLanesData?.data?.getDecarbSummary?.length > 0;

      if (!hasData) {
        setShowNoDataMessage(true);
      } else {
        setShowNoDataMessage(false);
      }
    }
  }, [decarbProblemLanesData, decarbProblemLanesLoading, hasUserInteracted]);

  const handleChangeOrder = (choose_Col_name: string) => {
    setOrder(getOrder(order));
    setCol_name(choose_Col_name);
    setHasUserInteracted(true);
  };

  const handleResetODpair = () => {
    setOriginCity(null);
    setDestinationCity(null);
    setCurrentPage(1);
    setHasUserInteracted(true);
    setShowNoDataMessage(false);
    dispatch(resetLaneOdPair());
  };

  const handleCheckboxChange = async (checkboxType: any) => {
    setHasUserInteracted(true);
    setShowNoDataMessage(false);

    setFuelTypeChecks((prev: any) => {
      // Calculate the new state based on the previous state
      const updatedChecks = {
        ...prev,
        [checkboxType]: prev[checkboxType] === 0 ? 1 : 0,
      };
      // Count the number of checkboxes with value 1
      const hasOneValue = Object.values(updatedChecks).includes(1);
      if (!hasOneValue) {
        setModalChecks(prev);
        setFuelTypeModalOpen(true);
        return prev;
      }
      setCurrentPage(1);
      return updatedChecks; // Return the updated state
    });
  };

  const handleCheckboxChangeModal = async (checkboxType: any) => {
    setModalChecks((prev: any) => {
      const updatedChecks = {
        ...prev,
        [checkboxType]: prev[checkboxType] === 0 ? 1 : 0,
      };
      return updatedChecks; // Return the updated state
    });
    setCurrentPage(1);
  };

  const handleSubmitFuelModal = () => {
    setFuelTypeChecks(modalChecks);
    setFuelTypeModalOpen(false);
    setHasUserInteracted(true); // Mark user interaction
  };

  const handleChangeLocation = (origin: string, destination: string) => {
    setOriginCity(origin);
    setDestinationCity(destination);
    setCurrentPage(1);
    setHasUserInteracted(true); // Mark user interaction
    setShowNoDataMessage(false); // Hide any existing message

    if (gridType === "card") {
      setPageSize({
        label: 12,
        value: 12,
      });
    } else {
      setPageSize({
        label: 10,
        value: 10,
      });
    }
  };

  const handleLanePlanning = (lane: string) => {
    navigate({
      pathname: `/scope3/decarb-problem-lanes-planning/${lane}/${id}/${currentPage}/${getSelectedFilterList(
        fuelTypeChecks
      )}`,
      search: new URLSearchParams({
        ...(priority != "" && { priority: String(priority) }),
        ...(lessThan != null && { isLessThan: String(lessThan) }),
        ...(boundTyp != null && { boundType: String(boundTyp) }),
      }).toString(),
    });
    resetDecarbData()
  };

  useEffect(() => {
    if (gridType === "card") {
      setPageSize({
        label: 12,
        value: 12,
      });
    } else {
      setPageSize({
        label: 10,
        value: 10,
      });
    }
  }, [gridType]);

  // Function to manually hide the no data message
  const hideNoDataMessage = () => {
    setShowNoDataMessage(false);
  };

  const handleChangeBoundType = (e: any) => {
    const value = e.target.checked
    let val = value ? "1" : "0"
    setBoundType(val);
    updateQueryParams({ boundType: val });
  };

  const handleChangeisLessThan = (e: any) => {
    const value = e.value;
    setIsLessThan(value === null ? null : Number(value));
    setCurrentPage(1);
    updateQueryParams({ isLessThan: value });
  };

  const updateQueryParams = (updates: Record<string, string | number | null>) => {
    const sp = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        sp.delete(key);
      } else {
        sp.set(key, String(value));
      }
    });
    setSearchParams(sp, { replace: true });
    handleResetODpair()
  };

  return {
    id,
    regions,
    decarbProblemLanesData,
    decarbProblemLanesLoading,
    handleChangeOrder,
    col_name,
    order,
    handleLanePlanning,
    pageSize,
    gridType,
    setPageSize,
    currentPage,
    setCurrentPage,
    setGridType,
    fuelTypeModalOpen,
    modalChecks,
    setModalChecks,
    handleCheckboxChange,
    toggleFuelTypeModal,
    handleSubmitFuelModal,
    fuelTypeChecks,
    permissionsDto,
    childRef,
    handleChangeLocation,
    handleResetODpair,
    handleCheckboxChangeModal,
    loginDetails,
    configConstants,
    checkNullValue,
    configConstantsIsLoading,
    divisions,
    getFuelCheck,
    // New additions for no data message
    showNoDataMessage,
    hasUserInteracted,
    hideNoDataMessage,
    isPEPCompany,
    t,
    state,
    boundType,
    handleChangeBoundType,
    handleChangeisLessThan,
    companySlugBMB,
    companyLocationMapping,
    priority,
    isLessThan
  };
};

export default DecarbProblemLaneController;
