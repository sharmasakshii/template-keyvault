import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import { vendorTableDataForExport } from "store/scopeThree/track/carrier/vendorSlice";
import { getDivisionList, regionShow } from "store/commonData/commonSlice";
import { downloadCSV, formatNumber, getQuarterData, getQuarterOptions, getRegionOptions, getYearOptions, getDivisionOptions, getTimeIds, getTimeCheck, getTimeName, isCompanyEnable, formatUnit } from "utils";
import { getConfigConstants } from "store/sustain/sustainSlice";
import { companySlug } from "constant";
import { setRegionalId } from "store/auth/authDataSlice";
import { useTranslation } from "react-i18next";

/**
 * A custom hook that contains all the states and functions for the VendorViewController
 */
const VendorViewController = () => {
  // Get the regional level from local storage or default to an empty string
  const { loginDetails, regionalId, divisionId } = useAppSelector((state: any) => state.auth);
  const [divisionLevel, setDivisionLevel] = useState(divisionId)
  // Define and initialize various states
  const dispatch = useAppDispatch();
  const [regionalLevel, setRegionalLevel] = useState<string>(regionalId);
  const [yearlyData, setYearlyData] = useState<any>(null);
  const [quarterDetails, setQuarterDetails] = useState<any>(null);
  const [searchCarrier, setSearchCarrier] = useState<string>("");
  const [rangeValues, setRangeValues] = useState<any>(null);
  const [emissionsValue, setEmissionsValue] = useState<any>(null);
  const [exportClick, setExportClick] = useState(false)
  const [pId, setPId] = useState<any>(0);
  const [weekId, setWeekId] = useState<any>(0);
  const [timeId, setTimeId] = useState<any>(0);
  const { t } = useTranslation()
  // Select relevant data from Redux store
  const { regions, emissionDates, divisions, timePeriodList } = useAppSelector((state: any) => state.commonData);
  const { vendorTableDetails, vendorTableDetailsExport, isLoadingExportVendorTableDetails, isLoadingVendorTableDetails } = useAppSelector((state: any) => state.carrier);
  const { configConstants } = useAppSelector((state: any) => state.sustain);
  // Handle carrier search input change
  const handleSearchCarrier = async (e: any) => {
    setSearchCarrier(e.target.value);
  };

  useEffect(() => {
    setTimeId(getTimeIds(pId, weekId, timePeriodList))
  }, [pId, weekId, timePeriodList])

  useEffect(() => {
    dispatch(getConfigConstants({ region_id: "", division_id: "", carrierIntensity: true }));
  }, [dispatch]);

  const showLatestYear = isCompanyEnable(loginDetails?.data, [companySlug?.bmb]);
  useEffect(() => {
    if (configConstants?.data) {
      setYearlyData(Number.parseInt(configConstants?.data?.DEFAULT_YEAR));
      if (configConstants?.data?.MIN_CARRIER_INTENSITY) {
        setRangeValues([Math.trunc(configConstants?.data?.MIN_CARRIER_INTENSITY), Math.trunc(configConstants?.data?.MAX_CARRIER_INTENSITY) + 1]);
        setEmissionsValue([Math.trunc(configConstants?.data?.MIN_CARRIER_INTENSITY), Math.trunc(configConstants?.data?.MAX_CARRIER_INTENSITY) + 1])
      }
      setQuarterDetails(getQuarterData(configConstants?.data?.DEFAULT_QUARTER))
      const period = Number(configConstants.data.DEFAULT_PERIOD);
      const month = configConstants.data.DEFAULT_MONTH;

      setPId(month && !Number.isNaN(period) ? period : 0);
      setWeekId(0)
    }
  }, [configConstants]);

  // Fetch region data when the component mounts
  useEffect(() => {
    dispatch(regionShow({ division_id: divisionLevel }));;
  }, [dispatch, divisionLevel]);

  useEffect(() => {
    if (isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo])) {
      dispatch(getDivisionList())
    }
  }, [dispatch, loginDetails])

  const handleRegionSelect = (value: any) => {
    setRegionalLevel(value);
    dispatch(setRegionalId(value))
  }

  // Scroll to the top of the page on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle range change for intensity values
  const handleChangeRange = (value: any) => {
    setRangeValues(value);
  };

  const handleFinalRangeChange = () => {
    setEmissionsValue(rangeValues);
  }
  const defaultUnit = configConstants?.data?.default_distance_unit;
  const handleDownloadCsv = async () => {
    const tableDataPayload = {
      region_id: regionalLevel,
      division_id: divisionLevel,
      ...getTimeCheck(yearlyData, quarterDetails, timeId),
      page: 1,
      page_size: vendorTableDetails?.data?.pagination?.total_count || 1,
      order_by: "desc",
      col_name: "shipment_count",
      search_name: searchCarrier?.length >= 3 ? searchCarrier : "",
      min_range: emissionsValue?.[0],
      max_range: emissionsValue?.[1],
    };
    setExportClick(true)
    await dispatch(vendorTableDataForExport(tableDataPayload));
  }

  // Options for selectors
  let regionOption = getRegionOptions(regions?.data?.regions)
  let yearOption = getYearOptions(emissionDates?.data?.emission_dates)
  let quarterOption = getQuarterOptions(yearlyData)
  let divisionOptions = getDivisionOptions(divisions?.data)
  const getSearchCarrier = (searchCarrier: any) => searchCarrier?.length >= 3 ? searchCarrier : "-"

  useEffect(() => {
    if (exportClick && vendorTableDetailsExport?.data?.responseData.length > 0) {
      let data = [];
      const year = yearlyData;
      const quarter = quarterOption?.filter((el: any) => el.value === quarterDetails)?.[0]?.label || ""
      const selectedRegion = regionOption?.filter((el: any) => el.value === regionalLevel?.toString())?.[0]?.label || "";

      data.push(["Selected filters"]);
      if (isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo])) {
        const selectedDivision = divisionOptions?.filter((el: any) => el.value === divisionLevel?.toString())?.[0]?.label || "All Divisions"
        data.push(["Division", selectedDivision]);
      }
      data.push(["Region", selectedRegion]);
      if (isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.bmb])) {
        data.push(["Period", getTimeName(pId, weekId, timePeriodList, loginDetails)]);
      }
      data.push(["Year", year]);
      if (!isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.bmb])) {
        data.push(["Quarter", quarter]);
      }
      data.push([
        t("selectedEmissionsIntensityRange"),
        t("emissionsRangeValue", {
          min: emissionsValue?.[0],
          max: emissionsValue?.[1],
          unit: formatUnit(defaultUnit)
        })
      ]);
      data.push(["Searched Carrier by Name", getSearchCarrier(searchCarrier)]);
      data.push([""]);
      data.push([
        "Carrier Name",
        "Smartway Ranking",
        t("emissionsIntensity", { unit: formatUnit(defaultUnit) }),
        "Total Shipments",
        "Total Emissions \n (tCO2e)",
        "Region",
        ...(isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.bmb]) ? [] : [quarter]),
        "Year"
      ]);

      // Add data rows
      vendorTableDetailsExport?.data?.responseData?.forEach((row: any) => {
        const rowData = [
          row?.carrier_name,
          row?.SmartwayData.map((elem: any) => `${elem?.year}-${elem.ranking}`).join(", ") || "-",
          formatNumber(true, row?.intensity, 1),
          formatNumber(true, row?.shipment_count, 0),
          formatNumber(true, row?.emissions, 2),
          selectedRegion,
          ...(isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.bmb]) ? [] : [quarter]),
          year
        ];
        data.push(rowData);
      });
      const csvData = data.map((row: any) => row.map((value: any) => `"${value}"`).join(',')).join('\n');
      downloadCSV(csvData, `carrier-data-${quarter}-${year}.csv`);
      setExportClick(false)
    }
  }, [vendorTableDetailsExport, defaultUnit, t, exportClick, emissionsValue, quarterDetails, quarterOption, pId, weekId, regionOption, timePeriodList, divisionOptions, regionalLevel, divisionLevel, searchCarrier, yearOption, yearlyData, loginDetails])

  // Return all the states and functions
  return {
    regions,
    regionalLevel,
    yearlyData,
    quarterDetails,
    emissionsValue,
    searchCarrier,
    handleDownloadCsv,
    isLoadingExportVendorTableDetails,
    rangeValues,
    vendorTableDetails,
    isLoadingVendorTableDetails,
    handleFinalRangeChange,
    handleChangeRange,
    handleSearchCarrier,
    handleRegionSelect,
    configConstants,
    pId,
    weekId,
    setWeekId,
    timeId,
    setPId,
    setQuarterDetails,
    setYearlyData,
    divisionOptions,
    divisionLevel,
    setDivisionLevel,
    regionOption,
    yearOption,
    timePeriodList,
    loginDetails,
    divisions,
    dispatch,
    showLatestYear
  };
};

// Exporting the custom hook for use in other components
export default VendorViewController;