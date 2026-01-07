import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';
import { getCarrierTypeEmissionDto, getCarrierTypeTableDto } from 'store/scopeThree/track/carrier/vendorSlice';
import { useNavigate } from 'react-router-dom';
import {
  getQuarterData,
  getCompanyName,
  getGraphDataHorizontal,
  getOrder,
  getDivisionOptions,
  handleDownloadCsvFile,
  getTimeIds,
  getTimeCheck,
  isCompanyEnable
} from 'utils'; // Importing from a constant file
import { getConfigConstants } from "store/sustain/sustainSlice";
import { companySlug } from 'constant';
import { getDivisionList } from 'store/commonData/commonSlice';
import { useTranslation } from 'react-i18next';

/**
 * A custom hook that contains all the states and functions for the CarrierTypeController
 */
const CarrierTypeController = () => {

  // Define and initialize all the necessary states
  const { loginDetails, divisionId } = useAppSelector((state: any) => state.auth)
  const {t} = useTranslation()
  const [divisionLevel, setDivisionLevel] = useState(divisionId)
  const [yearlyData, setYearlyData] = useState<any>(null);
  const [quarterDetails, setQuarterDetails] = useState<any>(null);
  const [pId, setPId] = useState<any>(0);
  const [weekId, setWeekId] = useState<any>(0);
  const [timeId, setTimeId] = useState<any>(0);
  const [order, setOrder] = useState<string>("desc");
  const [colName, setColName] = useState<string>("intensity");
  const [reloadData, setReloadData] = useState(true);
  const [checked, setChecked] = useState<boolean>(isCompanyEnable(loginDetails?.data, [companySlug?.bmb]));

  // Get relevant data from Redux store using selector hooks
  const { divisions, timePeriodList } = useAppSelector((state: any) => state.commonData);
  const { carrierTypeTableDto, isLoadingCarrierTable, carrierTypeEmissionDto, isLoadingCarrierEmission } = useAppSelector((state: any) => state.carrier);

  const {
    configConstants,
  } = useAppSelector((state: any) => state.sustain);

  // Define dispatch and navigate functions
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getConfigConstants({ region_id: "", division_id: "" }));

  }, [dispatch]);

  useEffect(() => {
      if (isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo])) {
          dispatch(getDivisionList())
      }
  }, [dispatch, loginDetails])

  useEffect(() => {
    setTimeId(getTimeIds(pId, weekId, timePeriodList))
  }, [pId, weekId, timePeriodList])

  useEffect(() => {
    if (configConstants?.data) {
      setYearlyData(Number.parseInt(configConstants?.data?.DEFAULT_YEAR));
      setQuarterDetails(getQuarterData(configConstants?.data?.DEFAULT_QUARTER))
      setPId(Number.parseInt(configConstants?.data?.DEFAULT_PERIOD || 0))
      setWeekId(0)
    }
  }, [configConstants])

  // Fetch data when necessary states change using useEffect
  useEffect(() => {
    if (yearlyData && loginDetails?.data) {
      dispatch(
        getCarrierTypeEmissionDto({
          region_id: "",
          division_id: divisionLevel,
          toggel_data: checked ? 1 : 0,
          ...getTimeCheck(yearlyData, quarterDetails, timeId )
        })
      );

    }
  }, [dispatch, yearlyData, quarterDetails, checked, timeId, divisionLevel, loginDetails]);

  useEffect(() => {
    if (yearlyData && loginDetails?.data) {

      dispatch(
        getCarrierTypeTableDto({
          region_id: "",
          division_id: divisionLevel,
          order_by: order,
          col_name: colName,
          ...getTimeCheck(yearlyData, quarterDetails, timeId )
        })
      );
    }
  }, [dispatch, yearlyData, quarterDetails, order, colName, timeId, divisionLevel, loginDetails]);

  // Function to handle changing order and column name
  const handleChangeOrder = (chooseColName: string) => {
    setOrder(getOrder(order));
    setColName(chooseColName);
  };

  // Options for selectors
  let divisionOptions = getDivisionOptions(divisions?.data)

  const companyName = getCompanyName(loginDetails?.data, true)

  // Process graph data using getGraphDataHorizontal function
  let regionPageArr = getGraphDataHorizontal(carrierTypeEmissionDto, "OTHER");
  const defaultUnit = configConstants?.data?.default_distance_unit;
  const handleDownloadCsv = () => {
    handleDownloadCsvFile({
      nameKey: "region.name",
      selectedRegion: null,
      year: yearlyData,
      quarterDto: quarterDetails,
      list: carrierTypeTableDto,
      fileName: 'region-data',
      tableLabel: "Regions",
      pId: pId,
      weekId: weekId,
      timePeriodList: timePeriodList,
      loginDetails,
      divisionOptions,
      divisionLevel,
      defaultUnit,
      t
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
    isLoadingCarrierTable,
    checked,
    carrierTypeTableDto,
    carrierTypeEmissionDto,
    isLoadingCarrierEmission,
    regionPageArr,
    navigate,
    setChecked,
    setYearlyData,
    setQuarterDetails,
    setReloadData,
    handleChangeOrder,
    pId,
    setPId,
    loginDetails,
    divisionOptions,
    divisionLevel,
    setDivisionLevel,
    timePeriodList,
    divisions,
    weekId, 
    setWeekId,
    dispatch,
    configConstants
  };
};

export default CarrierTypeController;
