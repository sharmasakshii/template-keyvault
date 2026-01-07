export interface LaneState {
  isError: any;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  laneGraphDetails: any;
  laneGraphDetailsLoading: boolean;
  regionCarrierComparisonData: any ;
  getRegionOverviewDetailData: any;
  getRegionOverviewDetailLoading: boolean;
  regionCarrierComparisonLoading: boolean;
  laneCarrierEmission: any;
  laneCarrierEmissionIsloading: boolean;
  laneReductionDetailGraphLoading: boolean;
  laneReductionDetailGraphData: any;
  getLaneOverDetailsEmissionData: any;
  getLaneOverDetailsEmissionLoading: boolean;
  laneSortestPathData: LaneData[] | null;
  laneSortestPathLoading: boolean;
  isLaneScenarioDetailLoading: boolean;
  laneScenarioDetail: LaneScenarioDetailData[] | null;
  isLaneDestinationLoading: boolean;
  laneDestinationData: any;
  isLaneOriginLoading: boolean;
  laneOriginData: any;
  isLaneEmissionDataLoading: boolean;
  laneEmissionData: any;
  carrierEmissionData: any;
  isCarrierEmissionDataLoading: boolean;
  isLaneRangeLoading: boolean;
  laneRangeData: any;
  updateRangeSelections: any; 
  isCheckLaneFuelLoading:boolean;
  checkLaneFuelData: any;
  
}

//interface for recommendeddata
export interface RecommendedKLaneResponse {
  k_count: number;
  recommendedKLaneCoordinate: LaneCoordinate[];
  recommendedKLaneFuelStop: LaneFuelStop[];
}

export interface LaneCoordinate {
  lane_id: string;
  latitude: number;
  longitude: number;
}
export interface LaneFuelStop {
  id: number;
  product_type_id: string;
  name: string;
  product_name: string;
  product_code: string;
  impact_fraction: number;
  cost_premium_const: number;
  lane_id: string;
  fuel_stop_id: string;
  latitude: number;
  longitude: number;
  provider_name: string;
  provider_id: number;
}
export interface LaneScenarioDetailData {
  emission_intensity: number;
  emission_intensity_industry: number;
  shipments: number;
  shipments_industry: number;
  alternative_fuel_index: number;
  alternative_fuel_index_industry: number | null;
  company_intermodal_index: number | null;
  industry_intermodal_index: number | null;
  fromDate: string;
  toDate: string;
}

export interface LaneData {
  lane_id: number;
  sortestPaths: string;
  laneIntermodalCordinateData: string | null;
  laneCarriers: LaneCarrier[];
  baseLine: BaseLineData;
  delta_metrix: DeltaMetrix;
}

interface LaneCarrier {
  intensity: number;
  emissions: number;
  shipment_count: number;
  carrier: string;
  carrier_name: string;
  carrier_logo: string;
  SmartwayData: SmartwayDatum[];
}

interface SmartwayDatum {
  code: string;
  ranking: number;
  year: number;
}

interface BaseLineData {
  k_count: number;
  recommendedKLaneCoordinate: RecommendedKLaneCoordinate[];
  recommendedKLaneFuelStop: RecommendedKLaneFuelStop[];
  fuel_stop: FuelStop;
  distance: number;
  time: number;
  cost: number | null;
}

interface RecommendedKLaneCoordinate {
  lane_id: string;
  latitude: number;
  longitude: number;
}

interface RecommendedKLaneFuelStop {
  id: number;
  product_type_id: string;
  name: string;
  product_name: string;
  product_code: string;
  impact_fraction: number;
  cost_premium_const: number;
  lane_id: string;
  fuel_stop_id: string;
  latitude: number;
  longitude: number;
  provider_name: string;
  provider_id: number;
  provider_image: string;
}

interface FuelStop {
  product_code: string;
  occurrence: number;
  impact_fraction: number;
  cost_premium_const: number;
}

interface DeltaMetrix {
  dollar_per_mile: number;
  distance: number;
  time: number;
}

