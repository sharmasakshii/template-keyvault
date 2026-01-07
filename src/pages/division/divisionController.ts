import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';
import { divisionGraphData, divisionTableData } from 'store/scopeThree/track/division/divisionSlice';
import { useNavigate } from 'react-router-dom';
import {
  getCompanyName,
  getGraphDataHorizontal,
  getOrder,
  getQuarterData,
  handleDownloadCsvFile,
  getTimeIds,
  getTimeCheck
} from 'utils'; // Importing from a constant file
import { getConfigConstants } from "store/sustain/sustainSlice";
import { useTranslation } from 'react-i18next';

/**
 * A custom hook that contains all the states and functions for the RegionalController
 */
const DivisionController = () => {
  // Get the regional level from local storage or default to an empty string

  // Define and initialize all the necessary states
  const [yearlyData, setYearlyData] = useState<any>(null);
  const [quarterDetails, setQuarterDetails] = useState<any>(null);
  const [order, setOrder] = useState<string>("desc");
  const [colName, setColName] = useState<string>("emission");
  const [reloadData, setReloadData] = useState(true);
  const [checked, setChecked] = useState<boolean>(false);
  const [pId, setPId] = useState<any>(0);
  const [weekId, setWeekId] = useState<any>(0);
  const [timeId, setTimeId] = useState<any>(0);

  // Get relevant data from Redux store using selector hooks
  const { timePeriodList } = useAppSelector((state: any) => state.commonData);
  const {
    divisionGraphDto,
    divisionTableDto,
    divisionGraphDtoLoading,
    divisionTableDtoLoading,

  } = useAppSelector((state: any) => state.division);
  const { loginDetails, divisionId } = useAppSelector((state: any) => state.auth);

  // Define dispatch and navigate functions
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation()
  const {
    configConstants,
  } = useAppSelector((state: any) => state.sustain);

  useEffect(() => {
    setTimeId(getTimeIds(pId, weekId, timePeriodList))
  }, [pId, weekId, timePeriodList])

  useEffect(() => {
    dispatch(getConfigConstants({ region_id: "" }));
  }, [dispatch,]);

  useEffect(() => {
    if (configConstants) {
      setYearlyData(Number.parseInt(configConstants?.data?.DEFAULT_YEAR));
      setQuarterDetails(getQuarterData(configConstants?.data?.DEFAULT_QUARTER))
      setPId(Number.parseInt(configConstants?.data?.DEFAULT_PERIOD || 0));
      setWeekId(0)
    }
  }, [configConstants])

  // Fetch data when necessary states change using useEffect
  useEffect(() => {
    if (yearlyData) {
      dispatch(
        divisionGraphData({
          region_id: "",
          toggel_data: checked ? 1 : 0,
          ...getTimeCheck(yearlyData, quarterDetails, timeId ),
          division_id: divisionId ?? ""
        })
      );
    }
  }, [dispatch, divisionId, yearlyData, quarterDetails, timeId, checked]);

  useEffect(() => {
    if (yearlyData) {
      dispatch(
        divisionTableData({
          division_id: divisionId ?? "",
          region_id: "",
          toggel_data: checked ? 1 : 0,
          order_by: order,
          col_name: colName,
          ...getTimeCheck(yearlyData, quarterDetails, timeId )

        })
      );
    }
  }, [dispatch, yearlyData, quarterDetails, divisionId, timeId, checked, order, colName]);

  // Function to handle changing order and column name
  const handleChangeOrder = (choose_ColName: string) => {
    setOrder(getOrder(order));
    setColName(choose_ColName);
  };

  // Options for selectors

  const companyName = getCompanyName(loginDetails?.data, true)

  // Process graph data using getGraphDataHorizontal function
  let businessUnitList = getGraphDataHorizontal(divisionGraphDto, "OTHER");

  const handleDownloadCsv = () => {
    handleDownloadCsvFile({
      selectedRegion: null,
      year: yearlyData,
      quarterDto: quarterDetails,
      list: divisionTableDto,
      fileName: 'division-data',
      tableLabel: "Division",
      pId: pId,
      weekId: weekId,
      timePeriodList: timePeriodList,
      loginDetails,
      divisionOptions: [],
      divisionLevel: null,
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
    checked,
    businessUnitList,
    navigate,
    setChecked,
    setYearlyData,
    setQuarterDetails,
    setReloadData,
    handleChangeOrder,
    pId,
    setPId,
    divisionGraphDto,
    divisionTableDto,
    divisionGraphDtoLoading,
    divisionTableDtoLoading,
    timePeriodList,
    loginDetails,
    weekId, 
    setWeekId,
    configConstants,
    t
  };
};

export default DivisionController;
