import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import { facilityGraphData, facilityTableData } from "../../store/scopeThree/track/facility/facilityDataSlice";
import { regionShow } from "../../store/commonData/commonSlice";
import {
  handleDownloadCsvFile, getCompanyName, getQuarterData, getGraphDataHorizontal, getOrder, getRegionOptions
} from '../../utils';
import { useAuth } from "auth/ProtectedRoute";
import { getConfigConstants } from "store/sustain/sustainSlice";
import { useTranslation } from "react-i18next";

/**
 * A custom hook that contains all the states and functions for the FacilityViewController
 */

const FacilityViewController = () => {

  // Get the regional level from local storage or default to an empty string
  const { loginDetails, regionalId } = useAppSelector((state: any) => state.auth);

  const dataCheck = useAuth();

  // Define and initialize various states
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [regionalLevel, setRegionalLevel] = useState<string>(regionalId);
  const [checked, setChecked] = useState<boolean>(true);
  const [yearlyData, setYearlyData] = useState<any>(null);
  const [reloadData, setReloadData] = useState<boolean>(true);
  const [quarterDetails, setQuarterDetails] = useState<any>(null);
  const [order, setOrder] = useState<string>("desc");
  const [col_name, setCol_name] = useState<string>("intensity");

  const { regions } = useAppSelector((state) => state.commonData);
  const { facilityTableDetails, facilityGraphDetails, facilityGraphDetailLoading, facilityTableDetailLoading } = useAppSelector((state: any) => state.facility);
  const { t } = useTranslation()
  const {
    configConstants,
  } = useAppSelector((state: any) => state.sustain);

  useEffect(() => {
    dispatch(getConfigConstants({ region_id: "" }));
  }, [dispatch]);

  useEffect(() => {
    if (configConstants) {
      setYearlyData(Number.parseInt(configConstants?.data?.DEFAULT_YEAR));
      setQuarterDetails(getQuarterData(configConstants?.data?.DEFAULT_QUARTER))
    }
  }, [configConstants])

  // Function to handle changing the sorting order and column name
  const handleChangeOrder = (choose_Col_name: string) => {
    setOrder(getOrder(order));
    setCol_name(choose_Col_name);
  };

  // Fetch region data when the component mounts
  useEffect(() => {
    dispatch(regionShow({ division_id: "" }));;
  }, [dispatch]);

  // Fetch facility table data when relevant state changes
  useEffect(() => {
    if (yearlyData) {
      dispatch(facilityTableData({
        region_id: regionalLevel,
        ffacility_id: "",
        year: yearlyData,
        quarter: quarterDetails,
        order_by: order,
        col_name: col_name
      }));
    }
  }, [dispatch, yearlyData, quarterDetails, regionalLevel, order, col_name]);

  // Fetch facility graph data when relevant state changes
  useEffect(() => {
    if (yearlyData) {
      dispatch(facilityGraphData({
        region_id: regionalLevel,
        ffacility_id: "",
        year: yearlyData,
        quarter: quarterDetails,
        toggel_data: checked ? 1 : 0,
      }));
    }
  }, [dispatch, yearlyData, quarterDetails, regionalLevel, checked]);



  // Calculate regionPageArr using the facilityGraphDetails
  let regionPageArr = getGraphDataHorizontal(facilityGraphDetails);

  // Options for selectors
  let regionOption = getRegionOptions(regions?.data?.regions)

  const companyName = getCompanyName(dataCheck?.userdata, true)

  const handleDownloadCsv = () => {
    handleDownloadCsvFile({
      nameKey: "Facility.name",
      year: yearlyData,
      quarterDto: quarterDetails,
      list: facilityTableDetails,
      fileName: 'facility-data',
      tableLabel: "Facility",
      timePeriodList: [],
      loginDetails,
      divisionOptions: [],
      divisionLevel: null,
      regionalLevel: regionalLevel,
      regionOption: regionOption,
      t,
      defaultUnit: configConstants?.data?.default_distance_unit

    })

  }
  // Return all the states and functions as an object
  return {
    dataCheck,
    handleDownloadCsv,
    companyName,
    regionalLevel,
    regions,
    yearlyData,
    quarterDetails,
    checked,
    facilityGraphDetails,
    regionPageArr,
    facilityGraphDetailLoading,
    reloadData,
    setRegionalLevel,
    setReloadData,
    setYearlyData,
    setQuarterDetails,
    setChecked,
    regionOption,
    col_name,
    order,
    facilityTableDetails,
    facilityTableDetailLoading,
    handleChangeOrder,
    navigate,
    dispatch,
    loginDetails,
    configConstants,
    t
  };
};

// Exporting the custom hook for use in other components
export default FacilityViewController;
