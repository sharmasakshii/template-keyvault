export interface SustainState {
    isError: any,
    isSuccess: boolean,
    isLoading: boolean,
    message: string,
    graphRegionChart: regionGlidePath[] | null,
    regionEmission: RegionEmissionData[]| null,
    isLoadingGraphRegionEmission: boolean,
    regionEmissionIsLoading: any,
    configConstantsIsLoading: boolean,
    configConstants: SustainCardInterface | null,
    isShowPasswordExpire: boolean
    
}


export interface SustainCardInterface {
    EMISSION_REDUCTION_TARGET_1: string;
    EMISSION_REDUCTION_TARGET_1_YEAR: string;
    EMISSION_REDUCTION_TARGET_2: number;
    EMISSION_REDUCTION_TARGET_2_YEAR: string;
    GAP_TO_TARGET: number;
    GAP_TO_TARGET_YEAR: string;
    GAP_TO_TARGET_COLOR: string;
    rail_intensity: string;
    contributor_color: string;
    detractor_color: string;
    medium_color: string;
    PASSWORD_EXPIRE_DAYS_LIMIT: string;
    PASSWORD_EXPIRE_WARNIN:string;
}

export interface EmissionDetail {
    emission_per_ton: number;
    emission: number;
    year: string;
    intensity: number;
    regionName: string;
  }
  
  export interface DataItem {
    name: string;
    data: number | string | number[] | EmissionDetail[];
    year?: string;
    color?: string;
  }
  
  export type regionGlidePath = DataItem[];
  

 export interface RegionEmissionData {
    company_level: number[];
    targer_level: number[]; 
    base_level: number[];
    max: number;
    year: number[];
  }