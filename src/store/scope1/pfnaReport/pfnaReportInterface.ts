export interface PfnaReportInterface {
    isError: any,
    isSuccess: boolean,
    isLoading: boolean,
    message: string,
    fuelConsumptionReportLocationData: any;
    isLoadingfuelConsumptionReportLocation: boolean;
    fuelConsumptionReportEmissionLocationData: any;
    isLoadingfuelConsumptionReportEmissionLocation: boolean;
    searchLocationFilterData: any;
    isLoadingsearchLocationFilter: boolean;
    fuelConsumptionReportGraphData: any;
    isLoadingfuelConsumptionReportGraph: boolean;
    isLoadingPfnaTotalEmissionFuel: boolean;
    pfnaTotalEmissionFuelData: any;
    pfnaFuelConsumptionReportPeriodGraphData: any;
    isLoadingPfnaFuelConsumptionReportPeriodGraph: boolean;
    pfnaFuelEmissionsReportPeriodData: any;
    isLoadingPfnaFuelEmissionsReportPeriodGraph: boolean;
    pfnaFuelConsumptionPercentageData: any;
    isLoadingPfnaFuelConsumptionPercentage: boolean;
    pfnaFuelEmissionPercentageData: any;
    isLoadingPfnaFuelEmissionPercentage: boolean;
    isLoadingPfnaFuelList: boolean,
    pfnaFuelListData:any,
}