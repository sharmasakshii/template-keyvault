import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import { useParams } from "react-router-dom";
import {
  divisionOverviewDetail,
  getDivisionRegionComparisonData,
  businessUnitEmissionDivision,
  businessUnitEmissionDivisionList,
  laneBreakdownDetailForDivision
} from "store/scopeThree/track/division/divisionOverviewSlice";
import { getOrder, getTimeCheck, getTimeIds, isCompanyEnable } from "utils";
import { companySlug } from "constant";
import { getDivisionList } from "store/commonData/commonSlice";
import { getConfigConstants } from "store/sustain/sustainSlice";

// Define a functional component named VendorOverViewController
const DivisionOverViewController = () => {

  const params = useParams();
  const [yearlyData, setYearlyData] = useState<any>(Number(params?.years));
  const [quarterDetails, setQuarterDetails] = useState<any>(Number(params?.quarters));
  const [orderCarrier, setOrderCarrier] = useState<string>("desc");
  const [colName, setColName] = useState<string>("intensity");
  const [pId, setPId] = useState<any>(params?.pId);
  const [weekId, setWeekId] = useState<any>(params?.weekId);
  const [timeId, setTimeId] = useState<any>(0);

  const [orderCarrierBusiness, setOrderCarrierBusiness] = useState<string>("desc");
  const [colNameBusiness, setColNameBusiness] = useState<string>("intensity");


  const dispatch = useAppDispatch();
  // Destructure data from the Redux store using useAppSelector
  const {
    divisionOverviewDetailDto,
    divisionOverviewDetailDtoLoading,
    laneBreakdownDetailIsLoading,
    getDivisionRegionComparisonDataDto,
    getDivisionRegionComparisonDataDtoLoading,
    businessUnitEmissionDivisionListDto,
    businessUnitEmissionDivisionListDtoLoading,
    businessUnitEmissionDivisionDto,
    businessUnitEmissionDivisionDtoLoading,
    laneBreakdownDetailForDivisionDto
    // regionCarrierComparisonDataTable,
    // isLoadingRegionCarrierTable
  } = useAppSelector((state) => state.divisionOverview);
  const {
    configConstants,
  } = useAppSelector((state: any) => state.sustain);
  const { divisions, timePeriodList } = useAppSelector((state) => state.commonData);
  const { loginDetails } = useAppSelector((state: any) => state.auth);

  useEffect(() => {
    setTimeId(getTimeIds(pId, weekId, timePeriodList))
  }, [pId, weekId, timePeriodList])

  useEffect(() => {
    if (isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo])) {
      dispatch(getDivisionList())
    }
  }, [dispatch, loginDetails]);

  // useEffect to fetch data when the 'params' object changes
  useEffect(() => {
    if (params?.divisionId) {
      // Dispatch Redux actions to fetch carrier overview data and lane breakdown data
      dispatch(divisionOverviewDetail({
        ...getTimeCheck(yearlyData, quarterDetails, timeId),
        division_id: params?.divisionId,
      }));
      dispatch(businessUnitEmissionDivision({
        ...getTimeCheck(yearlyData, quarterDetails, timeId),
        division_id: params?.divisionId
      }));

      dispatch(laneBreakdownDetailForDivision({
        division_id: params?.divisionId,
        ...getTimeCheck(yearlyData, quarterDetails, timeId),
        page_size: 10,
      }))
    }
  }, [params, yearlyData, timeId, quarterDetails, dispatch]);

  // useEffect to scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (params?.divisionId) {
      dispatch(getDivisionRegionComparisonData({
        division_id: params?.divisionId,
        order_by: orderCarrier,
        col_name: colName,
        region_id: "",
        ...getTimeCheck(yearlyData, quarterDetails, timeId)

      }))
    }
  }, [dispatch, colName, orderCarrier, timeId, params, yearlyData, quarterDetails])

  useEffect(() => {
    if (params?.divisionId) {
      dispatch(businessUnitEmissionDivisionList({
        division_id: params?.divisionId,
        order_by: orderCarrierBusiness,
        col_name: colNameBusiness,
        region_id: "",
        ...getTimeCheck(yearlyData, quarterDetails, timeId),
        dataType: "business"

      }))
    }
  }, [dispatch, colNameBusiness, orderCarrierBusiness, timeId, params, yearlyData, quarterDetails])

  const handleChangeOrderCarrier = (colName: string, type: string) => {
    if (type === "business") {
      setOrderCarrierBusiness(getOrder(orderCarrierBusiness));
      setColNameBusiness(colName);
    } else {
      setOrderCarrier(getOrder(orderCarrier));
      setColName(colName);

    }
  };

  useEffect(() => {
    dispatch(getConfigConstants({ region_id: "", division_id: "" }));
  }, [dispatch]);

  // Return the data and functions used in the component
  return {
    loginDetails,
    laneBreakdownDetailIsLoading,
    yearlyData,
    setQuarterDetails,
    setYearlyData,
    quarterDetails,
    handleChangeOrderCarrier,
    colName,
    orderCarrier,
    getDivisionRegionComparisonDataDto,
    getDivisionRegionComparisonDataDtoLoading,
    pId,
    setPId,
    divisionOverviewDetailDto,
    divisionOverviewDetailDtoLoading,
    businessUnitEmissionDivisionListDto,
    businessUnitEmissionDivisionListDtoLoading,
    orderCarrierBusiness,
    colNameBusiness,
    businessUnitEmissionDivisionDto,
    businessUnitEmissionDivisionDtoLoading,
    laneBreakdownDetailForDivisionDto,
    timePeriodList,
    params,
    divisions,
    weekId,
    setWeekId,
    configConstants
  };
};

export default DivisionOverViewController
