import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import { getIndustryStandardEmissions } from "../../store/benchmark/benchmarkSlice";

/**
 * A custom hook that contains all the states and functions for the VendorViewController
 */
const BenchmarkLaneTableViewController = () => {
  // Define and initialize various states
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<any>({
    label: 10,
    value: 10,
  });
  const params = useParams();

  const { industryStandardEmissionsList, industryStandardEmissionsLoading } =
    useAppSelector((state: any) => state.benchmark);

  // Function to fetch data
  const fetchData = useCallback(() => {
    // Check for a valid searchCarrier length before making the API call
    const tableDataPayload = {
      page: currentPage,
      page_size: pageSize?.value,
      toggle_data: Number(params.wtwType),
      band_no: Number(params?.band_no),
      year: Number(params?.yearId),
      quarter: params?.quarterId === "all" ? "" : Number(params?.quarterId),
      low_emission: Number(params?.emission),
      type: params?.type,
    };
    dispatch(getIndustryStandardEmissions(tableDataPayload));
  }, [currentPage, pageSize, params?.wtwType, params?.band_no, params?.yearId, params?.quarterId, params?.emission, params?.type, dispatch]);

  // Fetch table and graph data when relevant states change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Scroll to the top of the page on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle page size change for pagination
  const handlePageChange = (e: any) => {
    setPageSize(e);
    setCurrentPage(1);
  };

  // Return all the states and functions
  return {
    pageSize,
    params,
    currentPage,
    industryStandardEmissionsList,
    industryStandardEmissionsLoading,
    setCurrentPage,
    handlePageChange,
  };
};

// Exporting the custom hook for use in other components
export default BenchmarkLaneTableViewController;
