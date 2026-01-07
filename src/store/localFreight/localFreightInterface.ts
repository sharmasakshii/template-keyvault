

export interface LocalFreightState {
    isError: any;
    isSuccess: boolean;
    isLoading: boolean;
    message: string;
    isLoadingTruckFuelTypesPieChart: boolean
    truckFuelTypesPieChart: any
    isLoadingEmissionIntensityRNGBarChart: boolean
    costEmissionIntensityRNGBarChart: any
    isLoadingKeyMetricsSummaryLocalFreight: boolean
    keyMetricsSummaryLocalFreight: any
    isLoadingLaneNameLocalFreight: boolean
    laneNameLocalFreight: any
    rngFreightDate: any
    keyMetricsAlternativeDto: any
    keyMetricsAlternativeDtoLoading: boolean,
    listOfAllLanesByShipmentsDto: any,
    listOfAllLanesByShipmentsDtoLoading: boolean
    lanesByFuelUsageAndMileageDto: any,
    lanesByFuelUsageAndMileageDtoLoading: boolean
    lanesByFuelStackeByEmissionsDto: any,
    lanesByFuelStackeByEmissionsDtoLoading: boolean
    lanesByFuelStackeByQuantityDto: any,
    lanesByFuelStackeByQuantityDtoLoading: boolean
    lanesByFuelStackeByMileageDto: any,
    lanesByFuelStackeByMileageDtoLoading: boolean
    totalEmissionGraphByLaneAndFuelType: any,
    totalEmissionGraphByLaneAndFuelTypeLoading: boolean
    laneStatisticsDto: any;
    isLoadinglaneStatistics:boolean
    alternativeCarrierList: any;
    isLoadingAlternativeCarriers: boolean;
    alternativeFuelFiltersLoading: boolean,
    alternativeFuelFiltersDto: any
    alternativeFuelTotalShipmentsLoading: boolean,
    alternativeFuelTotalShipmentsDto: any,
    alternativeFuelListLoading: boolean
    alternativeFuelListDto: any,
    isLoadingCountryList: boolean,
    countryListData: any,
    isLoadingTotalEmissionsbyCarrierList: boolean,
    totalEmissionsbyCarrierListData: any,
    isLoadingMileagebyCarrierList: boolean,
    mileagebyCarrierListData: any,
    isLoadingSchneider:boolean,
    schneiderData:any,
}