export interface BusinessUnitState {
  isError: any,
  isSuccess: boolean,
  isLoading: boolean,
  message: any,
  businessUnitTableDetails: any,
  businessUnitGraphDetails: any,
  businessUnitGraphDetailsLoading: boolean
}

export interface BusinessUnitOverviewState {
  isError: any;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  businessUnitOverviewDetailData: any,
  businessUnitOverviewDetailLoading: boolean,
  businessUnitLevelGlideData: any
  isLoadingBusinessUnitLevelGlidePath: boolean,
  businessLaneGraphDetailsLoading: boolean,
  businessLaneGraphDetails: any,
  businessCarrierComparisonData: any,
  businessCarrierComparisonLoading: boolean,
  businessUnitRegionGraphDetailsLoading: boolean,
  businessUnitRegionGraphDetails: any
}