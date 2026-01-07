export interface FuelReportInterface {
    isError: any,
    isSuccess: boolean,
    isLoading: boolean,
    message: string,
    isLoadingTransactionList: boolean,
    transactionListData: any,
    isLoadingFuelFilters: boolean;
    fuelReportFilterData: any;
    isLoadingFuelMatrics: boolean;
    fuelReportMatricsData: any;
    isLoadingFuelConsumption: boolean,
    fuelConsumptionData: any;
    isLoadingFuelEmission: boolean;
    fuelEmissionData: any;
    isLoadingConsumptionByDivision: boolean;
    consumptionByDivisionData: any;
    isLoadingEmissionsByDivision: boolean;
    emissionsByDivisionData: any;
    isLoadingTransactionLocation: boolean;
    transactionLocationData: any;
    isLoadingTransactionFilter: boolean;
    transactionFilterData: any
    isLoadingPfnaTransactionDetail: boolean;
    pfnaTransactionDetailDto: any;
    isLoadingFuelConsumptionByPeriod: boolean;
    fuelConsumptionByPeriodData: any;
    isLoadingFuelEmissionByPeriod: boolean,
    fuelEmissionByPeriodData:any
}