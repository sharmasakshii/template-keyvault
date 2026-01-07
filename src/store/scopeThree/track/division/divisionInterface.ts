export interface DivisionState {
  divisionTableDto: any,
  divisionGraphDto: any,
  divisionGraphDtoLoading: boolean,
  divisionTableDtoLoading: boolean
}

export interface DivisionOverviewState {
  divisionOverviewDetailDto: any,
  divisionOverviewDetailDtoLoading: boolean,
  laneBreakdownDetailIsLoading: boolean,
  getDivisionRegionComparisonDataDto: any,
  getDivisionRegionComparisonDataDtoLoading: boolean
  laneBreakdownDetailForDivisionDto: any,
  laneBreakdownDetailForDivisionDtoLoading: boolean,
  businessUnitEmissionDivisionListDto: any,
  businessUnitEmissionDivisionListDtoLoading: boolean,
  businessUnitEmissionDivisionDto: any,
  businessUnitEmissionDivisionDtoLoading: boolean
}