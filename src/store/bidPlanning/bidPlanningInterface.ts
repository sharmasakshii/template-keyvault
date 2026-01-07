export interface BidPlanningState {
    isError: any;
    isSuccess: boolean;
    isLoading: boolean;
    message: string;
    bidFileList: any;
    isLoadingStatusList: boolean;
    bidStatusList: any;
    isLoadingBidFileList: boolean;
    isLoadingCheckFile: boolean;
    checkBidFileExist : any;
    isLoadingSaveFile : boolean;
    isLoadingDeleteFile : boolean;
    bidFileDataMatrics: any;
    isLoadingProcessFile: boolean;
    processFileData: any;
    fileUploadError: any;  
    isLoadingAddBidFile: boolean;
    addBidFileData: any;
    isLoadingKeyMetricsDetail: boolean;
    keyMetricsDetail: any;
    isLoadinBidFileLanesTableGraph: boolean;
    bidFileLanesTableGraph: any;
    isLoadinFileInputError: boolean;
    fileInputErrorData: any;
    isLoadingProcessFileStatusData: boolean;
    processFileStatusData: any;
    isLoadingEmissionCostImpactBarChartBid: boolean
    costImpactBarChartBid: any
    isLoadingKeyMetricsSummaryOutput: boolean
    keyMetricsSummaryOutput: any
    isLoadingOutputDataOfBidPlanning:boolean
    outputDataOfBidPlanning: any
    isLoadingOriginBidOutput: boolean
    originBidOutput : any
    isLoadingDestinationBidOutput: boolean
    destinationBidOutput : any
    isLoadingScacBidOutput: boolean
    scacBidOutput: any
    isLoadingOutputOfBidPlanningExport: boolean,
    outputOfBidPlanningExportData: any,
    processFileStatusDataError: any
    processNewLaneData: any
    isLoadingSingleFile: boolean
    singleFileDetails: any
    isLoadingErrorInputBidExport: boolean,
    errorInputBidExportData: any,
    isLoadingProcessNewLaneData: boolean
}