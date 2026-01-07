// Import necessary modules and functions from external files
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import { toast } from "react-toastify";
import {
  emissionReportScacs,
  emissionSavedEmissionGraph,
  emissionSavedEmissionTransactionTable,
  emissionSavedFuelList,
  emissionSavedMatrics,
  emissionSavedShipmentGraph,
} from "store/scopeThree/track/emissionSaveReport/emissionSavedSlice";
import { getOrder } from "utils";
import { getConfigConstants } from "store/sustain/sustainSlice";

/**
 * A custom hook that contains all the states and functions for the LocalFreightController
 */
const EmissionSavingReport = () => {
  const currentYear = new Date().getFullYear();

  const initialFilter = {
    country: { label: "All Countries", value: "" },
    year: { label: currentYear, value: currentYear },
    month: { label: "All Months", value: 0 },
  };
  const mapRef = useRef<any>(null);
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);
  const [country, setCountry] = useState(initialFilter.country);
  const [year, setYear] = useState<any>(null);
  const [month, setMonth] = useState<any>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState({ label: 10, value: 10 });
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [order, setOrder] = useState("desc");
  const [colName, setColName] = useState("shipments");
  const [showAll, setShowAll] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<any>([]);
  const [selectedLane, setSelectedLane] = useState<any>({});
  const [transactionFilter, setTransactionFilter] = useState<any>({
    shipment_type: "",
    fuel_type: "",
    carrier_scac: [],
    isSelected: false,
  });
  const [isFilterApplied, setIsFilterApplied] = useState({
    shipment_type: "",
    fuel_type: "",
    carrier_scac: [],
  });

  const [carrierFilter, setCarrierFilter] = useState<any>(null);

  const {
    emissionSavedScacs,
    isLoadingScacList,
    emissionSavedMatricsData,
    isLoadingEmissionMatricsData,
    isLoadingEmissionSavedShipmentGraph,
    emissionSavedShipmentGraphData,
    emissionSavedEmissionGraphData,
    isLoadingEmissionSavedEmissionGraph,
    emissionSavedTransactionTableData,
    isLoadingEmissionSavedTransactionTable,
    emissionSavedFuelType,
    isLoadingEmissionSavedFuelType,
  } = useAppSelector((state) => state.emissionSaved);
  const { configConstants } = useAppSelector((state: any) => state.sustain);

  // Define dispatch and navigate functions
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getConfigConstants({ region_id: "" }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      emissionReportScacs({
        country_code: country?.value,
      })
    );
  }, [dispatch, country]);

  useEffect(() => {
    if (configConstants) {
      setYear(
        Number.parseInt(configConstants?.data?.emission_saving_report_year)
      );
      setMonth(
        Number.parseInt(configConstants?.data?.emission_saving_report_month)
      );
    }
  }, [configConstants]);

  useEffect(() => {
    if (selectedCarrier?.length > 0 && year) {
      let payload = {
        country_code: country?.value,
        year: year,
        month: month,
        carrier_scac: selectedCarrier,
      };
      dispatch(emissionSavedMatrics(payload));
      dispatch(emissionSavedShipmentGraph(payload));
      dispatch(emissionSavedEmissionGraph(payload));
      dispatch(emissionSavedFuelList(payload));
    }
  }, [dispatch, country, year, month, selectedCarrier]);

  useEffect(() => {
    if (emissionSavedScacs?.data?.length > 0) {
      let scacs = emissionSavedScacs?.data
        ?.filter((dto: any) => dto?.scac_priority)
        ?.map((res: any) => res?.carrier_scac);
      setSelectedCarrier(scacs);

      setTransactionFilter({
        shipment_type: "",
        fuel_type: "",
        carrier_scac: scacs,
        isSelected: false,
      });
      setIsFilterApplied({
        shipment_type: "",
        fuel_type: "",
        carrier_scac: scacs,
      });
    }
  }, [emissionSavedScacs]);

  useEffect(() => {
    if (selectedCarrier?.length > 0 && year) {
      dispatch(
        emissionSavedEmissionTransactionTable({
          country_code: country?.value,
          year: year,
          month: month,
          carrier_scac: isFilterApplied?.carrier_scac,
          page: pageNumber,
          page_size: pageSize?.value,
          shipment_type: isFilterApplied.shipment_type,
          fuel_type: isFilterApplied.fuel_type,
          order_by: colName,
          sort_order: order,
        })
      );
    }
  }, [
    dispatch,
    country,
    year,
    month,
    selectedCarrier,
    isFilterApplied,
    colName,
    order,
    pageNumber,
    pageSize,
  ]);

  const handleCarrierChange = (scacCode: any) => {
    if (!selectedCarrier || selectedCarrier.length <= 2) {
      toast.error("You must choose at least two carrier for comparison");
      return;
    }
    setSelectedCarrier(selectedCarrier.filter((res: any) => res !== scacCode));
    handleResetTable(selectedCarrier.filter((res: any) => res !== scacCode));
  };

  const handleResetTable = (carriers: any) => {
    setTransactionFilter({
      shipment_type: "",
      fuel_type: "",
      carrier_scac: carriers,
      isSelected: false,
    });
    setIsFilterApplied({
      shipment_type: "",
      fuel_type: "",
      carrier_scac: carriers,
    });
    setCarrierFilter(null);
    setPageNumber(1);
  };

  const handleSelectCarrier = (selected: any) => {
    if (selected?.length < 2) {
      toast.error("You must choose at least two carriers for comparison");
    } else {
      let filteredCarrier = carrierList.filter((item1: any) =>
        selected.some((item2: any) => item1.value === item2.value)
      );
      setSelectedCarrier(filteredCarrier.map((res: any) => res?.value));
      handleResetTable(filteredCarrier.map((res: any) => res?.value));
    }
  };

  const handleClickColumn = (column: string) => {
    setColName(column);
    setOrder(getOrder(order));
  };

  useEffect(() => {
    if (emissionSavedTransactionTableData?.data?.rows?.length > 0) {
      setSelectedRowKey("row-0");
      setSelectedLane(emissionSavedTransactionTableData?.data?.rows[0]);
    }
  }, [emissionSavedTransactionTableData]);

  const MAX_VISIBLE_CARRIERS = 6;
  const carrierList =
    emissionSavedScacs?.data?.map((res: any) => ({
      ...res,
      value: res?.carrier_scac,
      label: res?.scac_name,
    })) ?? [];
  const selectedAlternativeCarrierList = carrierList?.filter((item: any) =>
    selectedCarrier?.includes(item?.value)
  );
  const visibleCarriers = showAll
    ? selectedAlternativeCarrierList
    : selectedAlternativeCarrierList?.slice(0, MAX_VISIBLE_CARRIERS);
  const hiddenCount =
    selectedAlternativeCarrierList.length - MAX_VISIBLE_CARRIERS;

  // Return all the states and functions
  return {
    handleCarrierChange,
    handleSelectCarrier,
    setSelectedCarrier,
    showAll,
    setShowAll,
    visibleCarriers,
    hiddenCount,
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
    setShowFullScreen,
    showFullScreen,
    country,
    setCountry,
    year,
    setYear,
    month,
    setMonth,
    emissionSavedScacs,
    isLoadingScacList,
    emissionSavedMatricsData,
    isLoadingEmissionMatricsData,
    isLoadingEmissionSavedShipmentGraph,
    emissionSavedShipmentGraphData,
    carrierList,
    selectedCarrier,
    emissionSavedEmissionGraphData,
    isLoadingEmissionSavedEmissionGraph,
    emissionSavedTransactionTableData,
    isLoadingEmissionSavedTransactionTable,
    handleClickColumn,
    order,
    colName,
    selectedLane,
    setSelectedLane,
    mapRef,
    emissionSavedFuelType,
    isLoadingEmissionSavedFuelType,
    transactionFilter,
    setTransactionFilter,
    setIsFilterApplied,
    isFilterApplied,
    handleResetTable,
    selectedRowKey,
    setSelectedRowKey,
    carrierFilter,
    setCarrierFilter,
    configConstants
  };
};

export default EmissionSavingReport;
