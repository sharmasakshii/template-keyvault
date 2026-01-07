import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'store/redux.hooks'
import { getFuelConsumptionReport, getPfnaTotaEmissionFuel, getPfnaFuelConsumptionReportPeriod, getPfnaFuelEmissionsReportPeriod, getPfnaFuelConsumptionByPercentage, getPfnaFuelEmissionByPercentage, getPfnaFuelList } from 'store/scope1/pfnaReport/pfnaReportSlice'
import { currentYear, normalizedList } from 'utils'
import { getFuelReportFilters } from 'store/scope1/fuelReport/fuelReportSlice'

const PfnaReportController = (props: any) => {
    const { fuelSlug } = props;
    const [yearlyData, setYearlyData] = useState<any>({ label: currentYear, value: currentYear })
    const [pId, setPId] = useState<any>({ label: "All Periods", value: "" });
    const [fuelType, setFuelType] = useState<any>(null);
    const dispatch = useAppDispatch()
    const { isLoadingfuelConsumptionReportGraph, fuelConsumptionReportGraphData,isLoadingPfnaTotalEmissionFuel, pfnaTotalEmissionFuelData, pfnaFuelConsumptionReportPeriodGraphData, isLoadingPfnaFuelConsumptionReportPeriodGraph, isLoadingPfnaFuelEmissionsReportPeriodGraph, pfnaFuelEmissionsReportPeriodData, pfnaFuelConsumptionPercentageData, isLoadingPfnaFuelConsumptionPercentage, pfnaFuelEmissionPercentageData, isLoadingPfnaFuelEmissionPercentage, isLoadingPfnaFuelList,
        pfnaFuelListData } = useAppSelector((state: any) => state.scopeOnePfnaReport)
    const { isLoadingFuelFilters, fuelReportFilterData

    } = useAppSelector((state: any) => state.scopeOneFuelReport)
    // Destructure data from the Redux store using useAppSelector

    useEffect(() => {
        dispatch(getFuelReportFilters({
            year: yearlyData?.value,
            period_id: pId?.value,
            slug: fuelSlug
        }))
    }, [dispatch, yearlyData, pId, fuelSlug])

    useEffect(() => {
        dispatch(getPfnaFuelList())
    }, [dispatch])

    useEffect(() => {
        if ((normalizedList(pfnaFuelListData?.data?.fuelTypes)?.length > 0)) {
            setFuelType({ label: pfnaFuelListData?.data?.fuelTypes?.[0]?.fuel_name ?? "", value: pfnaFuelListData?.data?.fuelTypes?.[0]?.id ?? "" })
        }
    }, [pfnaFuelListData])

    useEffect(() => {
        dispatch(getFuelConsumptionReport({
            year: yearlyData?.value,
            period_id: pId?.value,
        }))
        dispatch(getPfnaTotaEmissionFuel({
            year: yearlyData?.value,
            period_id: pId?.value,
        }))
        dispatch(getPfnaFuelConsumptionByPercentage({
            year: yearlyData?.value,
            period_id: pId?.value,
            type: "consumption"
        }))
        dispatch(getPfnaFuelEmissionByPercentage({
            year: yearlyData?.value,
            period_id: pId?.value,
            type: "emissions"
        }))
    }, [dispatch, pId, yearlyData]);

    useEffect(() => {
        if (fuelType?.value) {
            dispatch(getPfnaFuelConsumptionReportPeriod({
                year: yearlyData?.value,
                period_id: pId?.value,
                fuel_type_id: fuelType?.value,
                type: "consumption"
            }))
            dispatch(getPfnaFuelEmissionsReportPeriod({
                year: yearlyData?.value,
                period_id: pId?.value,
                fuel_type_id: fuelType?.value,
                type: "emissions"
            }))
        }
    }, [dispatch, yearlyData, pId, fuelType])

    return {
        isLoadingfuelConsumptionReportGraph,
        fuelConsumptionReportGraphData,
        setPId, yearlyData, pId, setYearlyData,
        isLoadingPfnaTotalEmissionFuel, pfnaTotalEmissionFuelData,
        pfnaFuelConsumptionReportPeriodGraphData, isLoadingPfnaFuelConsumptionReportPeriodGraph,
        isLoadingPfnaFuelEmissionsReportPeriodGraph, pfnaFuelEmissionsReportPeriodData,
        fuelType, setFuelType,
        pfnaFuelConsumptionPercentageData, isLoadingPfnaFuelConsumptionPercentage,
        pfnaFuelEmissionPercentageData, isLoadingPfnaFuelEmissionPercentage,
        isLoadingPfnaFuelList,
        pfnaFuelListData,
        isLoadingFuelFilters, fuelReportFilterData
    }
}

export default PfnaReportController