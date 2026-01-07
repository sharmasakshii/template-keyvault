import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';
import { fuelCarrierEmissionGraph, getFuelLaneBreakdownByEmissionsIntensity, getFuelOverviewDto } from '../../store/fuel/fuelSlice';
import { useAuth } from 'auth/ProtectedRoute';
import { useParams, useNavigate } from "react-router-dom";
import { getOrder } from "utils";
import { regionShow } from "store/commonData/commonSlice";
import { getConfigConstants } from 'store/sustain/sustainSlice';
import { useTranslation } from 'react-i18next';


/**
 * A custom hook that contains all the states and functions for the FuelOverviewController
 */
const FuelOverviewController = (props: any) => {
  const dataCheck = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const {t} = useTranslation()
  const [yearlyData, setYearlyData] = useState<any>(Number(params?.years));
  const [quarterDetails, setQuarterDetails] = useState<string | number>(Number(params?.quarters) || 0);
  const [orderCarrier, setOrderCarrier] = useState<string>("desc");
  const [colName, setColName] = useState<string>("intensity");
  const { dbName, pageTitle } = props;
  const {regionalId, loginDetails } = useAppSelector((state) => state.auth)

  const dispatch = useAppDispatch();
  // Destructure data from the Redux store using useAppSelector
  const {
    fuelOverviewDto,
    fuelOverviewDtoLoading,
    fuelCarrierEmissionTableDto,
    fuelCarrierEmissionTableDtoLoading,
    fuelLaneBreakdown,
    fuelLaneBreakdownLoading
  } = useAppSelector((state) => state.fuel);

  const { emissionDates, regions } = useAppSelector((state) => state.commonData);
  const { configConstants } = useAppSelector((state: any) => state.sustain);
  // useEffect to fetch data when the 'params' object changes
  useEffect(() => {
    if (params?.id) {
      // Dispatch Redux actions to fetch carrier overview data and lane breakdown data
      dispatch(getFuelOverviewDto({
        regionId: regionalId,
        fetch_id: params?.id, year: yearlyData, quarter: quarterDetails, tableName: dbName
      }));
    }
  }, [params, regionalId, yearlyData, quarterDetails, dbName, dispatch]);

  useEffect(() => {
    dispatch(getConfigConstants({ region_id: "", division_id: "" }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(regionShow({ division_id: "" }));
  }, [dispatch])

  // useEffect to scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (params?.id) {
      // Dispatch Redux actions to fetch carrier overview data and lane breakdown data
      dispatch(getFuelLaneBreakdownByEmissionsIntensity({ regionId: regionalId, fetch_id: params?.id, year: yearlyData, quarter: quarterDetails, tableName: dbName }));
    }
  }, [params, regionalId, yearlyData, quarterDetails, dbName, dispatch]);


  useEffect(() => {
    if (params?.id) {
      dispatch(fuelCarrierEmissionGraph({
        fetch_id: params?.id,
        year: yearlyData,
        quarter: quarterDetails,
        order_by: orderCarrier,
        col_name: colName,
        regionId: regionalId,
        tableName: dbName
      }))
    }
  }, [dispatch, regionalId, colName, orderCarrier, params, yearlyData, quarterDetails, dbName])

  const handleChangeOrderCarrier = (colName: string) => {
    setOrderCarrier(getOrder(orderCarrier));
    setColName(colName);
  };

  const backLinkUrl = () => {
    return pageTitle === "Fuel" ? "scope3/fuel" : "scope3/vehicle"
  }

  const backBtnTitle = () => {
    return pageTitle === "Fuel" ? "Fuel" : "Vehicle"
  }

  // Return all the states and functions
  return {
    emissionDates,
    dataCheck,
    fuelOverviewDto,
    fuelLaneBreakdown,
    fuelLaneBreakdownLoading,
    fuelOverviewDtoLoading,
    yearlyData,
    setQuarterDetails,
    setYearlyData,
    quarterDetails,
    handleChangeOrderCarrier,
    colName,
    orderCarrier,
    fuelCarrierEmissionTableDtoLoading,
    navigate,
    backLinkUrl,
    backBtnTitle,
    fuelCarrierEmissionTableDto,
    regionalId,
    regions,
    loginDetails,
    configConstants,
    t
  };
};

export default FuelOverviewController;
