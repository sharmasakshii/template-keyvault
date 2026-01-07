export interface RegionOverviewState {
  isError: any;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  regionFacilityEmissionDto: any;
  regionFacilityEmissionIsLoading: boolean;
}

export interface RegionState {
  isError: any,
  isSuccess: boolean,
  isLoading: boolean,
  message: any,
  regionTableDetails: any,
  regionGraphDetails: RegionGraphsData[] | null,
  regionGraphDetailsLoading: boolean
}


  export interface EmissionSource {
  name: string;
  value: number;
  color: string;
}

export interface RegionGraphsData {
  contributor: EmissionSource[];
  detractor: EmissionSource[];
  unit: string;
  average: number;
}

