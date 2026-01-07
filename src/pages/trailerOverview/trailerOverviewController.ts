import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';
import { trailerCarrierEmissionGraph, getTrailerLaneBreakdownByEmissionsIntensity, getTrailerOverviewDto } from '../../store/trailer/trailerSlice';
import { useAuth } from 'auth/ProtectedRoute';
import { useParams, useNavigate } from "react-router-dom";
import { getOrder } from "utils";
import { regionShow } from "store/commonData/commonSlice";
import { getConfigConstants } from 'store/sustain/sustainSlice';
import { useTranslation } from 'react-i18next';

/**
 * A custom hook that contains all the states and functions for the TrailerOverviewController
 */
const TrailerOverviewController = (props: any) => {
  const dataCheck = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const {regionalId} = useAppSelector((state)=>state.auth)

  const [yearlyData, setYearlyData] = useState<any>(Number(params?.years));
  const [quarterDetails, setQuarterDetails] = useState<string | number>(Number(params?.quarters) || 0);
  const [orderCarrier, setOrderCarrier] = useState<string>("desc");
  const [colName, setColName] = useState<string>("intensity");
  const { dbName } = props;


  const dispatch = useAppDispatch();
  // Destructure data from the Redux store using useAppSelector
  const {
    trailerOverviewDto,
    trailerOverviewDtoLoading,
    trailerCarrierEmissionTableDto,
    trailerCarrierEmissionTableDtoLoading,
    trailerLaneBreakdown,
    trailerLaneBreakdownLoading
  } = useAppSelector((state) => state.trailer);

  const { emissionDates } = useAppSelector((state) => state.commonData);
  const {t} = useTranslation()
  const {loginDetails} = useAppSelector((state)=>state.auth)
    const { configConstants } = useAppSelector((state: any) => state.sustain);
  
  
    useEffect(() => {
      dispatch(getConfigConstants({ region_id: "" }));
    }, [dispatch]);

  // useEffect to fetch data when the 'params' object changes
  useEffect(() => {
    if (params?.id) {
      // Dispatch Redux actions to fetch carrier overview data and lane breakdown data
      dispatch(getTrailerOverviewDto({ fetch_id: params?.id, region_id: regionalId, year: yearlyData, quarter: quarterDetails, tableName: dbName }));
      dispatch(getTrailerLaneBreakdownByEmissionsIntensity({ fetch_id: params?.id, region_id: regionalId, year: yearlyData, quarter: quarterDetails, tableName: dbName }));
    }
  }, [params, yearlyData, regionalId, quarterDetails, dbName, dispatch]);

  useEffect(() => {
    dispatch(regionShow({division_id:""}));
  }, [dispatch])

  // useEffect to scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  useEffect(() => {
    if (params?.id) {
      dispatch(trailerCarrierEmissionGraph({
        fetch_id: params?.id,
        year: yearlyData,
        quarter: quarterDetails,
        order_by: orderCarrier,
        col_name: colName,
        region_id: regionalId,
        tableName: dbName
      }))
    }
  }, [dispatch, colName, regionalId, orderCarrier, params, yearlyData, quarterDetails, dbName])

  const handleChangeOrderCarrier = (colName: string) => {
    setOrderCarrier(getOrder(orderCarrier));
    setColName(colName);
  };

  const backBtnTitle = () => {
    return "Trailer"
  }

  // Return all the states and functions
  return {
    emissionDates,
    dataCheck,
    trailerOverviewDto,
    trailerLaneBreakdown,
    trailerLaneBreakdownLoading,
    trailerOverviewDtoLoading,
    yearlyData,
    setQuarterDetails,
    setYearlyData,
    quarterDetails,
    handleChangeOrderCarrier,
    colName,
    orderCarrier,
    trailerCarrierEmissionTableDtoLoading,
    navigate,
    backBtnTitle,
    trailerCarrierEmissionTableDto,
    loginDetails,
    configConstants,
    t
  };
};

export default TrailerOverviewController;
