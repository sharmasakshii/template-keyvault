import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';
import { businessUnitGraphData, businessUnitTableData } from 'store/businessUnit/businessUnitSlice';
import { useNavigate } from 'react-router-dom';
import {
  getCompanyName, getGraphDataHorizontal, getOrder, getRegionOptions,
  getQuarterData,
  getDivisionOptions,
  handleDownloadCsvFile,
  getTimeIds,
  getTimeCheck
} from 'utils'; // Importing from a constant file
import { useAuth } from 'auth/ProtectedRoute';
import { regionShow } from "store/commonData/commonSlice";
import { getConfigConstants } from "store/sustain/sustainSlice";
import { useTranslation } from 'react-i18next';

/**
 * A custom hook that contains all the states and functions for the RegionalController
 */
const BusinessUnit = () => {
  // Get relevant data from Redux store using selector hooks
  const { regions, divisions, timePeriodList } = useAppSelector((state: any) => state.commonData);
  const { businessUnitTableDetails, isLoading, businessUnitGraphDetails, businessUnitGraphDetailsLoading } = useAppSelector((state: any) => state.businessUnit);
  const { loginDetails, regionalId, divisionId } = useAppSelector((state) => state.auth);

  // Define and initialize all the necessary states
  const [yearlyData, setYearlyData] = useState<any>(null);
  const [divisionLevel, setDivisionLevel] = useState(divisionId)
  const [quarterDetails, setQuarterDetails] = useState<any>(null);
  const [order, setOrder] = useState<string>("desc");
  const [colName, setColName] = useState<string>("intensity");
  const [reloadData, setReloadData] = useState(true);
  const [checked, setChecked] = useState<boolean>(false);
  const dataCheck = useAuth()
  const [region, setRegion] = useState<string>(regionalId);
  const [pId, setPId] = useState<any>(0);
  const [weekId, setWeekId] = useState<any>(0);
  const [timeId, setTimeId] = useState<any>(0);
  const { t } = useTranslation()
  // Define dispatch and navigate functions
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    configConstants,
  } = useAppSelector((state: any) => state.sustain);

  useEffect(() => {
    setTimeId(getTimeIds(pId, weekId, timePeriodList))
  }, [pId, weekId, timePeriodList])

  useEffect(() => {
    dispatch(getConfigConstants({ region_id: "", division_id: "" }));
  }, [dispatch]);

  useEffect(() => {
    if (configConstants) {
      setYearlyData(Number.parseInt(configConstants?.data?.DEFAULT_YEAR));
      setQuarterDetails(getQuarterData(configConstants?.data?.DEFAULT_QUARTER))
      setPId(Number.parseInt(configConstants?.data?.DEFAULT_PERIOD || 0));
      setWeekId(0)
    }
  }, [configConstants])

  useEffect(() => {
    dispatch(regionShow({ division_id: divisionLevel }));
  }, [dispatch, divisionLevel]);

  // Fetch data when necessary states change using useEffect
  useEffect(() => {
    if (yearlyData) {
      dispatch(
        businessUnitGraphData({
          region_id: region,
          division_id: divisionLevel,
          toggel_data: checked ? 1 : 0,
          ...getTimeCheck(yearlyData, quarterDetails, timeId)
        })
      );
    }
  }, [dispatch, yearlyData, quarterDetails, timeId, checked, region, divisionLevel]);

  useEffect(() => {
    if (yearlyData) {
      dispatch(
        businessUnitTableData({
          region_id: region,
          division_id: divisionLevel,
          toggel_data: checked ? 1 : 0,
          order_by: order,
          col_name: colName,
          ...getTimeCheck(yearlyData, quarterDetails, timeId)

        })
      );
    }
  }, [dispatch, yearlyData, quarterDetails, timeId, checked, order, colName, region, divisionLevel]);

  // Function to handle changing order and column name
  const handleChangeOrder = (colname: string) => {
    setOrder(getOrder(order));
    setColName(colname);
  };


  // Options for selectors

  let divisionOptions = getDivisionOptions(divisions?.data)

  const companyName = getCompanyName(dataCheck?.userdata, true)
  let regionOption = getRegionOptions(regions?.data?.regions)

  // Process graph data using getGraphDataHorizontal function
  let businessUnitList = getGraphDataHorizontal(businessUnitGraphDetails, "OTHER");

  const handleDownloadCsv = () => {

    handleDownloadCsvFile({
      rowKey: "description",
      regionalLevel: region,
      year: yearlyData,
      quarterDto: quarterDetails,
      list: businessUnitTableDetails,
      fileName: 'business-unit-data',
      tableLabel: "Business Unit",
      pId: pId,
      weekId: weekId,
      timePeriodList: timePeriodList,
      loginDetails,
      divisionOptions,
      divisionLevel,
      regionOption,
      t,
      defaultUnit: configConstants?.data?.default_distance_unit
    })

  }

  // Return all the states and functions
  return {
    companyName,
    handleDownloadCsv,
    quarterDetails,
    yearlyData,
    order,
    colName,
    reloadData,
    isLoading,
    checked,
    businessUnitTableDetails,
    businessUnitGraphDetails,
    businessUnitGraphDetailsLoading,
    businessUnitList,
    navigate,
    setChecked,
    setYearlyData,
    setQuarterDetails,
    setReloadData,
    handleChangeOrder,
    regionOption,
    region,
    setRegion,
    pId,
    setPId,
    divisionLevel,
    setDivisionLevel,
    divisionOptions,
    loginDetails,
    divisions,
    timePeriodList,
    regions,
    weekId,
    setWeekId,
    dispatch,
    configConstants,
    t
  };
};

export default BusinessUnit;
