import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';
import { fuelTableData } from '../../store/fuel/fuelSlice';
import { useNavigate } from 'react-router-dom';
import { getCompanyName, getGraphDataHorizontal, getQuarterData, getOrder, getRegionOptions } from '../../utils'; // Importing from a constant file
import { useAuth } from 'auth/ProtectedRoute';
import { handleDownloadCsvFile } from "utils"
import { regionShow } from 'store/commonData/commonSlice';
import { getConfigConstants } from "store/sustain/sustainSlice";
import { useTranslation } from 'react-i18next';

/**
 * A custom hook that contains all the states and functions for the FuelController
 */
const FuelController = (props: any) => {
  const { regionalId, loginDetails } = useAppSelector((state) => state.auth)
  // Define and initialize all the necessary states
  const [yearlyData, setYearlyData] = useState<any>(null);
  const [quarterDetails, setQuarterDetails] = useState<any>(null);
  const [order, setOrder] = useState<string>("desc");
  const [colName, setColName] = useState<string>("intensity");
  const [reloadData, setReloadData] = useState(true);
  const [checked, setChecked] = useState<boolean>(false);
  const dataCheck = useAuth()
  // Get relevant data from Redux store using selector hooks
  const { fuelTableDto, fuelTableDtoLoading } = useAppSelector((state: any) => state.fuel);
  const { dbName, tableLabel, pageTitle, graphDto, handleGraphData } = props;
  const { regions } = useAppSelector((state) => state.commonData);
  const [regionalLevel, setRegionalLevel] = useState(regionalId);

  // Define dispatch and navigate functions
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    configConstants,
  } = useAppSelector((state: any) => state.sustain);
  const { t } = useTranslation()
  useEffect(() => {
    dispatch(getConfigConstants({ region_id: "" }));
  }, [dispatch]);

  useEffect(() => {
    if (configConstants) {
      setYearlyData(Number.parseInt(configConstants?.data?.DEFAULT_YEAR));
      setQuarterDetails(getQuarterData(configConstants?.data?.DEFAULT_QUARTER))

    }
  }, [configConstants])

  // Fetch regions data when the component mounts
  useEffect(() => {
    dispatch(regionShow({ division_id: "" }));;
  }, [dispatch]);

  // Fetch data when necessary states change using useEffect
  useEffect(() => {
    if (yearlyData) {

      dispatch(
        handleGraphData({
          year: yearlyData,
          quarter: quarterDetails,
          toggle_data: checked ? 1 : 0,
          tableName: dbName,
          regionId: regionalLevel
        })
      );
    }
  }, [dispatch, handleGraphData, yearlyData, quarterDetails, checked, dbName, regionalLevel]);

  useEffect(() => {
    if (yearlyData) {
      dispatch(
        fuelTableData({
          year: yearlyData,
          quarter: quarterDetails,
          order_by: order,
          col_name: colName,
          tableName: dbName,
          regionId: regionalLevel
        })
      );
    }
  }, [dispatch, yearlyData, regionalLevel, quarterDetails, order, colName, dbName]);

  // Function to handle changing order and column name
  const handleChangeOrder = (chooseColName: string) => {
    setOrder(getOrder(order));
    setColName(chooseColName);
  };

  // Options for selectors

  const companyName = getCompanyName(dataCheck?.userdata, true)

  let regionOption = getRegionOptions(regions?.data?.regions)

  // Process graph data using getGraphDataHorizontal function
  let fuelArrayList = getGraphDataHorizontal(graphDto);



  const handleDownloadCsv = () => {
    handleDownloadCsvFile({
      regionalLevel: regionalLevel,
      year: yearlyData,
      quarterDto: quarterDetails,
      list: fuelTableDto,
      fileName: pageTitle === 'Fuel' ? 'fuel-data' : 'vehicle-data',
      tableLabel,
      regionOption: regionOption,
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
    fuelTableDto,
    fuelTableDtoLoading,
    fuelArrayList,
    navigate,
    setChecked,
    setYearlyData,
    setQuarterDetails,
    setReloadData,
    handleChangeOrder,
    regionOption,
    regionalLevel,
    setRegionalLevel,
    dataCheck,
    dispatch,
    loginDetails,
    configConstants
  };
};

export default FuelController;
