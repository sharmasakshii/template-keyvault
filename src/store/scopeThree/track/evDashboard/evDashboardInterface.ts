export interface EvDashboardInterface {
    isError: boolean;
    isSuccess: boolean;
    isLoading: boolean;
    evDashboardLoading: boolean;
    isLoadingShipmentLane: boolean;
    listOfCarriers: any;
    isLoadingListOfCarriers: boolean;
    isLoadingMasterCarrierData: boolean;
    masterCarrierData: any
    shipmentLaneData: any,
    isLoadingShipmentByDate: boolean,
    shipmentByDateData: any;
    isLoadingEvMatrics: boolean;
    evMatricsData: any;
    isLoadingEvFilterDate: boolean;
    evFilterData: any;
    isLoadingEvShipmentLaneList: boolean;
    evShipmentLaneListData: any;
    isLoadingDwonloadEvData: boolean;
    totalTonMileData: any,
    isLoadingTotalTonMileData: boolean,
    dwonloadEvData: null
}
