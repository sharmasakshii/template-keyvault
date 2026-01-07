import { companySlug } from 'constant'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store/redux.hooks'
import { getFuelConsumptionByDivision, getFuelConsumptionByPeriod, getFuelConsumptionReport, getFuelEmissionByDivision, getFuelEmissionByPeriod, getFuelEmissionReport, getFuelReportFilters, getFuelReportMatrics, getFuelTransactionData, getFuelTransactionFilter, getTransactionLocation } from 'store/scope1/fuelReport/fuelReportSlice'
import { currentYear, getOrder, isCompanyEnable } from 'utils'

const FuelReportController = () => {

    const params = useParams()

    const initialTransactionFilter = {
        BusinessUnitScope1: { label: "All Business Units", value: "" },
        Location: { label: "All Locations", value: "" },
        Company: { label: "All Companies", value: "" },
        Market: { label: "All MU Names", value: "" },
        FuelType: { label: "All Fuel Types", value: "" }
    }

    const filterOptions = [
        { key: "Location", placeholder: "Location", ariaLabel: "location-dropdown" },
        { key: "BusinessUnitScope1", placeholder: "Business Unit", ariaLabel: "business-dropdown" },
        { key: "Market", placeholder: "MU Name", ariaLabel: "mu-dropdown" },
        { key: "Company", placeholder: "Company", ariaLabel: "company-dropdown" },
        { key: "FuelType", placeholder: "Fuel Type", ariaLabel: "fuel-dropdown" }
    ];

    const [yearlyData, setYearlyData] = useState<any>({ label: currentYear, value: currentYear })
    const [pId, setPId] = useState<any>({ label: "All Periods", value: "" });
    const [divisionLevel, setDivisionLevel] = useState({ label: "All Divisions", value: "" })
    const [transportType, setTransportType] = useState({ label: "All Types", value: "" })
    const [selectedFilters, setSelectedFilters] = useState(initialTransactionFilter)
    const [isFilterApplied, setIsFilterApplied] = useState({ ...initialTransactionFilter, isFilterApplied: false })
    const [order, setOrder] = useState<string>("desc");
    const [col_name, setCol_name] = useState<string>("location");
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState({ label: 10, value: 10 })
    const [showFullScreen, setShowFullScreen] = useState(false);
    const dispatch = useAppDispatch()

    const { isLoadingTransactionFilter, transactionFilterData, isLoadingTransactionLocation, 
        transactionLocationData, isLoadingEmissionsByDivision, emissionsByDivisionData, isLoadingConsumptionByDivision,
        consumptionByDivisionData, isLoadingFuelConsumption, fuelConsumptionData, isLoadingFuelEmission, fuelEmissionData, 
        isLoadingFuelMatrics, fuelReportMatricsData, isLoadingFuelFilters, fuelReportFilterData, isLoadingTransactionList, 
        transactionListData,  isLoadingFuelConsumptionByPeriod, fuelConsumptionByPeriodData, isLoadingFuelEmissionByPeriod, 
        fuelEmissionByPeriodData} = useAppSelector((state: any) => state.scopeOneFuelReport)

    const { loginDetails } = useAppSelector((state)=>state.auth)

    const handleClickColumn = (column: string) => {
        setOrder(getOrder(order));
        setCol_name(column);
    }

    const handleResetTable = () => {
        filterOptions.forEach((el: any) => (
            handleSearchFilters(el.key, "")
        ))
        setSelectedFilters(initialTransactionFilter);
        setIsFilterApplied({ ...initialTransactionFilter, isFilterApplied: false });
        setPageNumber(1)
    }

    useEffect(() => {
        dispatch(getFuelReportFilters({
            year: yearlyData?.value,
            period_id: pId?.value,
            divisionId: divisionLevel?.value,
            slug: "pbna"
        }))
    }, [dispatch, yearlyData, pId, divisionLevel])

    useEffect(() => {
        const payload = {
            year: yearlyData?.value,
            period_id: pId?.value,
            divisionId: divisionLevel?.value,
            transport_id: transportType?.value,
            slug: "pbna"
        }
        dispatch(getFuelReportMatrics(payload))

        dispatch(getFuelConsumptionReport(payload))

        dispatch(getFuelEmissionReport(payload))

        dispatch(getFuelConsumptionByDivision({
            year: yearlyData?.value,
            period_id: pId?.value,
            divisionId: divisionLevel?.value,
            transport_id: transportType?.value,
            type: "fuel"
        }))

        dispatch(getFuelEmissionByDivision({
            year: yearlyData?.value,
            period_id: pId?.value,
            divisionId: divisionLevel?.value,
            transport_id: transportType?.value,
            type: "emissions"
        }))

       
        if(!isCompanyEnable(loginDetails?.data, [companySlug?.demo])){
            dispatch(getFuelEmissionByPeriod(payload))
            dispatch(getFuelConsumptionByPeriod(payload))
        }
    }, [dispatch, yearlyData, pId, divisionLevel, transportType, loginDetails]);

    useEffect(() => {
        !isCompanyEnable(loginDetails?.data, companySlug?.demo) && ["BusinessUnitScope1", "Location", "Company", "Market", "FuelType"].forEach((el: string) => {
            dispatch(getFuelTransactionFilter({
                searchType: el,
                searchName: "",
                year: yearlyData?.value,
                period_id: pId?.value,
                divisionId: divisionLevel?.value,
                transport_id: transportType?.value,
                slug: "pbna"
            }));
        })
    }, [dispatch, yearlyData, pId, divisionLevel, transportType, loginDetails])

    const handleSearchFilters = (key: string, name: any) => {
        dispatch(getFuelTransactionFilter({
            searchType: key,
            searchName: name,
            year: yearlyData?.value,
            period_id: pId?.value,
            divisionId: divisionLevel?.value,
            transport_id: transportType?.value,
            "slug": "pbna"
        }));
    }

    useEffect(() => {
      !isCompanyEnable(loginDetails?.data, companySlug?.demo) &&  dispatch(getTransactionLocation({
            year: yearlyData?.value,
            period_id: pId?.value,
            divisionId: divisionLevel?.value,
            transport_id: transportType?.value,
            bu_id: isFilterApplied?.BusinessUnitScope1?.value,
            mu_id: isFilterApplied?.Market?.value,
            company_id: isFilterApplied?.Company?.value,
            fuel_type_id: isFilterApplied?.FuelType?.value,
            location_id: isFilterApplied?.Location?.value,
            "slug": "pbna"
        }))
    }, [dispatch, yearlyData, pId, divisionLevel, transportType, isFilterApplied, loginDetails])

    useEffect(() => {
        !isCompanyEnable(loginDetails?.data, companySlug?.demo) && dispatch(getFuelTransactionData({
            year: yearlyData?.value,
            period: pId?.value,
            divisionId: divisionLevel?.value,
            transport_id: transportType?.value,
            bu_id: isFilterApplied?.BusinessUnitScope1?.value,
            mu_id: isFilterApplied?.Market?.value,
            company_id: isFilterApplied?.Company?.value,
            fuel_type_id: isFilterApplied?.FuelType?.value,
            location_id: isFilterApplied?.Location?.value,
            order_by: col_name,
            sortOrder: order,
            page: pageNumber,
            page_size: pageSize?.value
        }))
    }, [dispatch, yearlyData, pId, divisionLevel, transportType, pageNumber, pageSize, col_name, order, isFilterApplied, loginDetails])

    return {
        params,
        isLoadingFuelFilters, fuelReportFilterData,
        isLoadingFuelMatrics, fuelReportMatricsData,
        isLoadingFuelConsumption, fuelConsumptionData,
        isLoadingFuelEmission, fuelEmissionData,
        isLoadingConsumptionByDivision, consumptionByDivisionData,
        isLoadingEmissionsByDivision, emissionsByDivisionData,
        isLoadingTransactionFilter, transactionFilterData,
        isLoadingTransactionList, transactionListData,
        isLoadingTransactionLocation, transactionLocationData,
        yearlyData, setYearlyData,
        pId, setPId,
        divisionLevel, setDivisionLevel,
        transportType, setTransportType,
        handleSearchFilters,
        selectedFilters, setSelectedFilters,
        isFilterApplied, setIsFilterApplied,
        initialTransactionFilter,
        setPageNumber, setPageSize,
        pageNumber, pageSize,
        order,
        col_name,
        handleClickColumn,
        handleResetTable,
        filterOptions,
        isLoadingFuelConsumptionByPeriod, fuelConsumptionByPeriodData, isLoadingFuelEmissionByPeriod, 
        fuelEmissionByPeriodData,
        showFullScreen, setShowFullScreen,
        loginDetails
    }
}

export default FuelReportController