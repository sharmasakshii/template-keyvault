import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';
import { getPfnaTransactionDetails, getFuelReportFilters, getFuelTransactionFilter, getFuelReportMatrics, getFuelConsumptionReport, getFuelEmissionReport, getTransactionLocation, getFuelConsumptionByPeriod, getFuelEmissionByPeriod, resetScopeOneFuelReport } from 'store/scope1/fuelReport/fuelReportSlice'
import { getOrder, getYearDateRange, normalizedList } from 'utils'
import moment from "moment";
import { toast } from 'react-toastify';
import { getFuelConsumptionReportLocation, getFuelConsumptionReportEmissionLocation, resetScopeOnePfnaReport, getSearchLocationFilter } from 'store/scope1/pfnaReport/pfnaReportSlice'


const initialTransactionFilter = (year: number | string) => {
    return {
        StartDate: getYearDateRange(year).startDate,
        EndDate: getYearDateRange(year)?.endDate,
        Location: { label: "All Locations", value: "" },
        FuelType: { label: "All Fuel Types", value: "" }
    }
}

const filterOptions = [
    { key: "Location", placeholder: "Location", ariaLabel: "location-dropdown", isValid: ["bulk", "cng", "b100"] },
    { key: "FuelType", placeholder: "Fuel Type", ariaLabel: "fuel-dropdown", isValid: ["bulk"] }
];

/**
 * A custom hook that contains all the states and functions for the BulkCngController
 */
const BulkCngController = (props: any) => {
    const { fuelSlug } = props;
    const dispatch = useAppDispatch();
    const yearValue = fuelSlug === "rd" || fuelSlug === "b100" ? 2024 : 2025;

    const initialFilter = {
        year: { label: yearValue, value: yearValue },
        period: { label: "All Periods", value: "" },
        supplier: { label: "All Suppliers", value: "" },
        transport: { label: "All Types", value: "" }
    };
    useEffect(() => {
        dispatch(resetScopeOneFuelReport());
        dispatch(resetScopeOnePfnaReport())
        setYearlyData(initialFilter.year);
        setPId(initialFilter?.period);
        setSupplierId(initialFilter?.supplier);
        setTransportType(initialFilter?.transport)
        setSelectedFilters(initialTransactionFilter(initialFilter.year?.value))
        setIsFilterApplied({ ...initialTransactionFilter(initialFilter.year?.value), isFilterApplied: false })
        setOrder("desc")
        setColName("location_name")
        setFuelType({ label: "All Fuel Types", value: "" })
        setPageNumber(1)
        setPageSize({ label: 10, value: 10 })
        setSelectedLocation([])
    }, [fuelSlug, dispatch])

    const [yearlyData, setYearlyData] = useState<any>(initialFilter.year)
    const [pId, setPId] = useState<any>(initialFilter.period);
    const [supplierId, setSupplierId] = useState(initialFilter.supplier)
    const [transportType, setTransportType] = useState(initialFilter?.transport)
    const [fuelType, setFuelType] = useState<any>({ label: "All Fuel Types", value: "" });
    const [showFullScreen, setShowFullScreen] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState({ label: 10, value: 10 })
    const [order, setOrder] = useState<string>("desc");
    const [colName, setColName] = useState<string>("location_name");
    const [selectedFilters, setSelectedFilters] = useState(initialTransactionFilter(initialFilter.year?.value))
    const [isFilterApplied, setIsFilterApplied] = useState({ ...initialTransactionFilter(initialFilter.year?.value), isFilterApplied: false })
    const [selectedLocation, setSelectedLocation] = useState([])


    const { isLoadingTransactionFilter, isLoadingTransactionLocation,
        transactionLocationData, transactionFilterData,
        isLoadingFuelMatrics, fuelReportMatricsData, isLoadingFuelFilters, fuelReportFilterData, isLoadingFuelConsumptionByPeriod, fuelConsumptionByPeriodData,
        isLoadingFuelConsumption, fuelConsumptionData, fuelEmissionData, isLoadingFuelEmission, isLoadingPfnaTransactionDetail, pfnaTransactionDetailDto, isLoadingFuelEmissionByPeriod,
        fuelEmissionByPeriodData

    } = useAppSelector((state: any) => state.scopeOneFuelReport)

    const { fuelConsumptionReportLocationData, isLoadingfuelConsumptionReportLocation, fuelConsumptionReportEmissionLocationData, isLoadingfuelConsumptionReportEmissionLocation,
        searchLocationFilterData, isLoadingsearchLocationFilter
    } = useAppSelector((state: any) => state.scopeOnePfnaReport)

    // Destructure data from the Redux store using useAppSelector

    useEffect(() => {
        if(fuelSlug === "cng" || fuelSlug === "bulk"){
            dispatch(getFuelReportFilters({
                year: yearlyData?.value,
                period_id: pId?.value,
                supplier: supplierId?.value,
                slug: fuelSlug
            }))
        }
       
    }, [dispatch, yearlyData, pId, supplierId, fuelSlug])

    useEffect(() => {
        if(fuelSlug === "rd"  || fuelSlug === "b100"){
            dispatch(getFuelReportFilters({
                year: yearlyData?.value,
                period_id: pId?.value,
                slug: fuelSlug
            }))
        }
       
    }, [dispatch, yearlyData, pId, fuelSlug])
    useEffect(() => {
        if(normalizedList(searchLocationFilterData?.data)?.length > 0){
            setSelectedLocation(searchLocationFilterData?.data?.slice(0, fuelSlug==="b100" ? 4 : 2)?.map((res: any) => ({ label: res?.name, value: res?.id })) || [])
        }
    }, [searchLocationFilterData, fuelSlug])

    useEffect(() => {
        const payload = {
            year: yearlyData?.value,
            period_id: pId?.value,
            supplier: supplierId?.value,
            transport_id: transportType?.value,
            slug: fuelSlug
        }
        dispatch(getFuelReportMatrics(payload))

        if(fuelSlug !== "b100"){
            dispatch(getFuelConsumptionReport(payload))
            dispatch(getFuelEmissionReport(payload))
        }
        dispatch(getFuelConsumptionByPeriod(payload))

        dispatch(getFuelEmissionByPeriod(payload))

    }, [dispatch, yearlyData, pId, supplierId, transportType, fuelSlug])


    const handleClickColumn = (column: string) => {
        setOrder(getOrder(order));
        setColName(column);
    }

    useEffect(() => {
        dispatch(getSearchLocationFilter({
            searchType: "Location",
            searchName: "",
            year: yearlyData?.value,
            period_id: pId?.value,
            transport_id: transportType?.value,
            supplier: supplierId?.value,
            fuel_id: fuelType?.value,
            slug: fuelSlug
        }))
    }, [dispatch, yearlyData, pId, transportType, supplierId, fuelType, fuelSlug])

    useEffect(() => {
        if(selectedLocation?.length> 0){
            const payload = {
                year: yearlyData?.value,
                period_id: pId?.value,
                transport_id: transportType?.value,
                "reportSlug": fuelSlug,
                supplier: supplierId?.value,
                fuel_type_id: fuelType?.value,
                location_ids: selectedLocation.map((el: any) => el.value) ?? []
            }
            dispatch(getFuelConsumptionReportEmissionLocation({
                ...payload,
                type: "emissions"
            }))
            dispatch(getFuelConsumptionReportLocation({
                ...payload,
                type: "consumption"
            }))
        }
    }, [dispatch, yearlyData, pId, transportType, fuelSlug, fuelType, supplierId, selectedLocation])

    useEffect(() => {
        if(fuelSlug !== "rd"){
        dispatch(getPfnaTransactionDetails({
            year: yearlyData?.value,
            period_id: pId?.value,
            supplier: supplierId?.value,
            "transport_id": transportType?.value,
            "reportSlug": fuelSlug,
            ...(fuelSlug !== 'b100' && {
                startDate: moment(isFilterApplied?.StartDate).format("YYYY-MM-DD"),
                endDate: moment(isFilterApplied?.EndDate).format("YYYY-MM-DD"),
              }),
            order_by: colName,
            sortOrder: order,
            page: pageNumber,
            page_size: pageSize?.value,
            fuel_type_id: isFilterApplied?.FuelType?.value,
            location_id: isFilterApplied?.Location?.value,
        }))}
    }, [dispatch, yearlyData, isFilterApplied, colName, pageSize, pageNumber, order, pId, supplierId, transportType, fuelSlug])

    useEffect(() => {
        if(fuelSlug !== "rd"){
        dispatch(getTransactionLocation({
            year: yearlyData?.value,
            period_id: pId?.value,
            supplier: supplierId?.value,
            transport_id: transportType?.value,
            ...(fuelSlug !== 'b100' && {
                startDate: moment(isFilterApplied?.StartDate).format("YYYY-MM-DD"),
                endDate: moment(isFilterApplied?.EndDate).format("YYYY-MM-DD"),
              }),
            fuel_type_id: isFilterApplied?.FuelType?.value,
            location_id: isFilterApplied?.Location?.value,
            slug: fuelSlug,
        }))}
    }, [dispatch, yearlyData, pId, supplierId, fuelSlug, transportType, isFilterApplied])

    useEffect(() => {
        if(fuelSlug !== "rd"){
        ["Location", "FuelType"].forEach((el: string) => {
            dispatch(getFuelTransactionFilter({
                searchType: el,
                searchName: "",
                year: yearlyData?.value,
                period_id: pId?.value,
                supplier: supplierId?.value,
                transport_id: transportType?.value,
                slug: fuelSlug
            }));
        })}
    }, [dispatch, yearlyData, pId, supplierId, transportType, fuelSlug])

    const handleSearchFilters = (key: string, name: any) => {
        dispatch(getFuelTransactionFilter({
            searchType: key,
            searchName: name,
            year: yearlyData?.value,
            period_id: pId?.value,
            transport_id: transportType?.value,
            slug: fuelSlug
        }));
    }

    const handleResetTable = (year:any) => {
        filterOptions.forEach((el: any) => {
            if (el.isValid.includes(fuelSlug)) {
                handleSearchFilters(el.key, "");
            }
        });
        setSelectedFilters(initialTransactionFilter(year));
        setIsFilterApplied({ ...initialTransactionFilter(year), isFilterApplied: false });
        setPageNumber(1);
    }
    
    const handleLocationChange = (selected: any) => {
            if (selected?.length < 1) {
                toast.error("At least one location should be selected")
            } else if(selected.length > 10){
                toast.error("You must select at most 10 locations for comparision")
            } else {
                setSelectedLocation(selected);
            }
        };

    const handleClearLocation = (location: any) => {
        if (selectedLocation.length === 1) {
            toast.error("At least one location should be selected");
            return;
        }
        setSelectedLocation((prev: any) =>
            prev.some((el: any) => el.value === location.value)
                ? prev.filter((el: any) => el.value !== location.value)
                : [...prev, location]
        );
        
    };

    // Return all the states and functions
    return {
        fuelSlug,
        yearlyData, setYearlyData,
        pId, setPId,
        supplierId, setSupplierId,
        transportType, setTransportType,
        showFullScreen, setShowFullScreen,
        pageNumber, setPageNumber,
        pageSize, setPageSize,
        isLoadingFuelMatrics,
        fuelReportMatricsData,
        isLoadingFuelFilters,
        fuelReportFilterData,
        isLoadingPfnaTransactionDetail,
        pfnaTransactionDetailDto,
        handleClickColumn,
        colName,
        order,
        fuelType, setFuelType,
        fuelConsumptionReportLocationData, isLoadingfuelConsumptionReportLocation,
        fuelConsumptionReportEmissionLocationData, isLoadingfuelConsumptionReportEmissionLocation,
        isLoadingFuelConsumption, fuelConsumptionData, fuelEmissionData, isLoadingFuelEmission,
        handleSearchFilters,
        selectedFilters, setSelectedFilters,
        isFilterApplied, setIsFilterApplied,
        initialTransactionFilter,
        handleResetTable,
        filterOptions,
        transactionFilterData,
        isLoadingTransactionFilter,
        isLoadingTransactionLocation,
        transactionLocationData,
        isLoadingFuelConsumptionByPeriod, fuelConsumptionByPeriodData,
        isLoadingFuelEmissionByPeriod, fuelEmissionByPeriodData,
        searchLocationFilterData,
        selectedLocation, setSelectedLocation,
        handleClearLocation,
        isLoadingsearchLocationFilter,
        handleLocationChange
    };
};

export default BulkCngController;
