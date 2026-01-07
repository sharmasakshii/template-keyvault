export interface IntermodalReportState {
  isError: any;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  intermodalReportMatrixData: any
  isLoadingIntermodalReportMatrixData: boolean,
  topLanesByShipmentData: any,
  isLoadingTopLanesByShipmentData: boolean,
  intermodalFilterData: any,
  isLoadingIntermodalFilterData: boolean,
  getViewLanesData: any,
  isLoadingViewLanesData: boolean,
  getLaneByShipmentMilesGraph: any,
  isLoadingLaneByShipmentMilesGraph: boolean,
  intermodalMaxDateGraph: any,
  isLoadingIntermodalMaxDate: boolean
  
}