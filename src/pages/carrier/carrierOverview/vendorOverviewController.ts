import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import { useParams, useNavigate } from "react-router-dom";
import { getCarrierOverviewData, getLaneBreakdown, getCarrierRegionComparisonTable } from "store/scopeThree/track/carrier/vendorSlice";
import { getOrder, getTimeCheck, getTimeIds } from "utils";
import { regionShow } from "store/commonData/commonSlice";
import { getConfigConstants } from "store/sustain/sustainSlice";

// Define a functional component named VendorOverViewController
export const VendorOverViewController = () => {

  const params = useParams();
  const navigate = useNavigate();
  const [yearlyData, setYearlyData] = useState<any>(Number(params?.years));
  const [quarterDetails, setQuarterDetails] = useState<any>(Number(params?.quarters));
  const [orderCarrier, setOrderCarrier] = useState<string>("desc");
  const [colName, setColName] = useState<string>("intensity");
  const [carrierDetails, setCarrierDetails] = useState({ carrier: "", carrier_name: "", carrier_logo: "" })
  const [pId, setPId] = useState<any>(params?.pId);
  const [weekId, setWeekId] = useState<any>(params?.weekId);
  const [timeId, setTimeId] = useState<any>(0);

  const dispatch = useAppDispatch();
  // Destructure data from the Redux store using useAppSelector
  const {
    carrierOverviewDetail,
    laneBreakdownDetail,
    laneBreakdownDetailLoading,
    carrierOverviewDetailLoading,
    regionCarrierComparisonDataTable,
    isLoadingRegionCarrierTable
  } = useAppSelector((state) => state.carrier);

  const { emissionDates, timePeriodList } = useAppSelector((state) => state.commonData);

  const { loginDetails, regionalId, divisionId } = useAppSelector((state) => state.auth);
  const { configConstants } = useAppSelector((state: any) => state.sustain);
  // useEffect to fetch data when the 'params' object changes

  useEffect(() => {
    setTimeId(getTimeIds(pId, weekId, timePeriodList))
  }, [pId, weekId, timePeriodList])

  useEffect(() => {
    dispatch(getConfigConstants({ region_id: "", division_id: "" }));
  }, [dispatch]);

  useEffect(() => {
    if (params?.id) {
      // Dispatch Redux actions to fetch carrier overview data and lane breakdown data
      dispatch(getCarrierOverviewData({
        id: params?.id,
        region_id: regionalId,
        division_id: divisionId,
        ...getTimeCheck(yearlyData, quarterDetails, timeId)
      }));

      dispatch(getLaneBreakdown({
        id: params?.id,
        region_id: regionalId,
        division_id: divisionId,
        ...getTimeCheck(yearlyData, quarterDetails, timeId),
      }));
    }
  }, [params, yearlyData, regionalId, timeId, quarterDetails, dispatch, divisionId]);

  useEffect(() => {
    dispatch(regionShow({ division_id: divisionId }));
  }, [dispatch, divisionId])

  // useEffect to scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (carrierOverviewDetail?.data?.responseData?.carrier) {
      setCarrierDetails({
        carrier: carrierOverviewDetail.data?.responseData?.carrier,
        carrier_logo: carrierOverviewDetail.data?.responseData?.carrier_logo,
        carrier_name: carrierOverviewDetail.data?.responseData?.carrier_name
      });
    }
  }, [carrierOverviewDetail])

  useEffect(() => {
    if (params?.id) {
      dispatch(getCarrierRegionComparisonTable({
        carrier: params?.id,
        order_by: orderCarrier,
        col_name: colName,
        region_id: regionalId,
        ...getTimeCheck(yearlyData, quarterDetails, timeId),
        division_id: divisionId,
      }))
    }
  }, [dispatch, colName, regionalId, orderCarrier, timeId, params, yearlyData, quarterDetails, divisionId])

  const handleChangeOrderCarrier = (colName: string) => {
    setOrderCarrier(getOrder(orderCarrier));
    setColName(colName);
  };
  const backLinkUrl = () => {
    if (params?.projectId) {
      return `scope3/project-detail/${params?.projectId}/${params?.laneName}`
    }
    if (params?.routeUrl === "lanes-overview") {
      return `scope3/${params?.routeUrl}/${params?.laneName}/${params?.years}/${params?.quarters}/${params?.pId}/${params?.weekId}`
    }
    if (params?.routeUrl === "regional-level") {
      return `scope3/${params?.routeUrl}`
    }
    return params?.laneName ? `scope3/lane-planning/${params?.laneName}` : "scope3/carrier"
  }

  const backBtnTitle = () => {
    if (params?.projectId) {
      return "Project Details"
    }
    if (params?.routeUrl === "lanes-overview") {
      return "Lanes Overview"
    }
    if (params?.routeUrl === "regional-level") {
      return "Regional Level"
    }
    return params?.laneName ? "Lane Planning" : "Carriers"
  }
  // Return the data and functions used in the component
  return {
    emissionDates,
    carrierOverviewDetail,
    laneBreakdownDetail,
    laneBreakdownDetailLoading,
    carrierOverviewDetailLoading,
    yearlyData,
    setQuarterDetails,
    setYearlyData,
    quarterDetails,
    handleChangeOrderCarrier,
    colName,
    orderCarrier,
    regionCarrierComparisonDataTable,
    isLoadingRegionCarrierTable,
    navigate,
    backLinkUrl,
    backBtnTitle,
    carrierDetails,
    pId,
    setPId,
    weekId,
    setWeekId,
    timePeriodList,
    loginDetails,
    configConstants
  };
};