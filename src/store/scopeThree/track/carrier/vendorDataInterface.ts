// Define the initial state for the reducer



export interface VendorDataInterface {
    isError: boolean;
    isSuccess: boolean;
    isLoading: boolean;
    isLoadingVendorTableDetails: boolean;
    message: string | null;
    error: any;
    vendorTableDetails: any;
    carrierOverviewDetail: any;
    carrierOverviewDetailLoading: boolean;
    laneBreakdownDetail: any;
    laneBreakdownDetailLoading: boolean;
    laneCarrierListName: any;
    laneCarrierListNameLoading: boolean;
    getLaneCarrierCompaireDto: any;
    getLaneCarrierCompaireDtoLoading: boolean;
    laneCarrierTableDtoLoading: any;
    laneCarrierTableDto: any;
    isLoadingExportVendorTableDetails: boolean;
    vendorTableDetailsExport: any;
    isLoadingRegionCarrierTable: boolean;
    regionCarrierComparisonDataTable: any
    isLoadingCarrierEmission: boolean;
    isLoadingCarrierTable: boolean;
    carrierTypeTableDto: any;
    carrierTypeEmissionDto: any;
    isLoadingTypeOverviewDetail: boolean;
    carrierTypeOverviewDetailDto: any;
    isLoadingCarrierTypeReductionGraph: boolean;
    carrierTypeReductionGraphDto: any;
    carrierTypeLaneEmissionGraphDto: any;
    carrierTypeLaneEmissionGraphDtoLoading: boolean;
}
