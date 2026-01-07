import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';
import { trailerTableData, trailerGraphData } from '../../store/trailer/trailerSlice';
import { useNavigate } from 'react-router-dom';
import { getCompanyName, getGraphDataHorizontal, getOrder, getQuarterOptions, getRegionOptions, getYearOptions } from '../../utils'; // Importing from a constant file
import { useAuth } from 'auth/ProtectedRoute';
import { handleDownloadCsvFile } from "utils"
import { defaultQuarter } from 'constant';
import { regionShow } from 'store/commonData/commonSlice';
import { getConfigConstants } from "store/sustain/sustainSlice";
import { useTranslation } from 'react-i18next';


/**
 * A custom hook that contains all the states and functions for the TrailerController
 */
const TrailerController = (props: any) => {
  const {regionalId} = useAppSelector((state)=>state.auth);

  // Define and initialize all the necessary states
  const [yearlyData, setYearlyData] = useState<any>(null);
  const [quarterDetails, setQuarterDetails] = useState<string | number>(defaultQuarter);
  const [order, setOrder] = useState<string>("desc");
  const [colName, setColName] = useState<string>("intensity");
  const [reloadData, setReloadData] = useState(true);
  const [checked, setChecked] = useState<boolean>(false);
  const dataCheck = useAuth()
  // Get relevant data from Redux store using selector hooks
  const { trailerTableDto, trailerTableDtoLoading, trailerGraphDtoLoading, trailerGraphDto } = useAppSelector((state: any) => state.trailer);
  const { dbName, tableLabel } = props;
  const { regions, emissionDates } = useAppSelector((state) => state.commonData);
  const [regionalLevel, setRegionalLevel] = useState(regionalId);
  // Define dispatch and navigate functions
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {t} = useTranslation()
  const { configConstants } = useAppSelector((state: any) => state.sustain);

  const {loginDetails} = useAppSelector((state)=>state.auth)

  useEffect(() => {
    dispatch(getConfigConstants({ region_id: "" }));
  }, [dispatch]);

  useEffect(() => {
    if (configConstants) {
      setYearlyData(Number.parseInt(configConstants?.data?.DEFAULT_YEAR));
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
        trailerGraphData({
          year: yearlyData,
          quarter: quarterDetails,
          toggle_data: checked ? 1 : 0,
          tableName: dbName,
          regionId: regionalLevel
        })
      );
    }
  }, [dispatch, yearlyData, quarterDetails, checked, dbName, regionalLevel]);

  useEffect(() => {
    if (yearlyData) {
      dispatch(
        trailerTableData({
          year: yearlyData,
          quarter: quarterDetails,
          order_by: order,
          col_name: colName,
          tableName: dbName,
        })
      );
    }
  }, [dispatch, yearlyData, quarterDetails, order, colName, dbName]);

  // Function to handle changing order and column name
  const handleChangeOrder = (chooseColName: string) => {
    setOrder(getOrder(order));
    setColName(chooseColName);
  };

  // Options for selectors

  let yearOption = getYearOptions(emissionDates?.data?.emission_dates)

  let quarterOption = getQuarterOptions(yearlyData)

  const companyName = getCompanyName(dataCheck?.userdata, true)

  let regionOption = getRegionOptions(regions?.data?.regions)

  // Process graph data using getGraphDataHorizontal function
  let fuelArrayList = getGraphDataHorizontal(trailerGraphDto);

  const handleDownloadCsv = () => {
    handleDownloadCsvFile({
      selectedRegion: regionalLevel,
      year: yearlyData,
      quarterDto: quarterDetails,
      list: trailerTableDto,
      fileName: 'trailer-data',
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
    trailerTableDto,
    trailerTableDtoLoading,
    fuelArrayList,
    navigate,
    setChecked,
    setYearlyData,
    setQuarterDetails,
    setReloadData,
    handleChangeOrder,
    yearOption,
    quarterOption,
    regionOption,
    regionalLevel,
    setRegionalLevel,
    trailerGraphDtoLoading,
    trailerGraphDto,
    dataCheck,
    dispatch,
    loginDetails,
    configConstants
  };
};

export default TrailerController;
