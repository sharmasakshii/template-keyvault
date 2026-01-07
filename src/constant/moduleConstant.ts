
export const ModuleKey = {
  Visibility: "VIS",
  Recommendations: "REC",
  Manage: "MAN",
  Segmentation: "SEG",
  Benchmarks: "BEN",
  UserManagement: "USM",
  RoleManagement: "USM",
  DataManagement: "DAM",
  ApplicationManagement: "APM",
  AlternativeFuel: "ALF",
  ModalShift: "MOS",
  ALTERNATIVEMODAL: "AMS",
  CarrierShift: "CAS",
  AdministratorAccess: "ADA",
  BIDPLANNING: "BIP",
  EVDASHBOARD: "EVD",
  FuelsReport: "FUR",
  PPPReport: "PPR",
  ChevronFuelReport: "CFR",
  FritoLayTransactions: "FLT",
  LeasedCarsReport: "LCR",
  PropaneReport: "PRR",
  BioDieselReport: "BDR",
  R99Report: "R9R",
  WithoutMiddleware: "without"
}

export const reportScope1Slug: any = {
  emp: "EMP",
  flt: "FLT",
  biod: "BIOD",
  r99: "ER99",
  elc: "ELC"
}

export const fuelEmissionConsumptionTableName = {
  ELC: "EmissionsLeasecars",
  FLT: "FritoLayTransactions",
  EMP: "EmissionsPropane",
  ER99: "EmissionsR99",
  BIOD: "EmissionsBiodiesel"
} as any


export const redisMasterKeyApi = {
  getLaneEmissionTableData: "laneEmissionTableData",
  getCarrierEmissionData: "carrierEmission",
  downloadCarrierDataExcel: "downloadCarrierDataExcel",
  getLaneCarrierComparisonGraph: "getLaneCarrierComparisonGraph",
  getRegionProblemLane: "getRegionProblemLane",
  getLaneScenarioDetail: "getLaneScenarioDetail"
}

export enum valueConstant {
  BLOB_ROLE = 3
}
export enum countryConstant {
  all = '',
  usa = 'USA',
  can = 'CAN'
}

export const Scope1TableConstant = {
  'pbna': { table: 'FuelReport', sector: 'PBNA', associateTable: ["Location", "Company", "BusinessUnitScope1", "Market", "FuelType"], filterList: ['periods', 'years', 'transports', 'divisions'], metricsList: ['totalEmissions', 'fuelConsumption', 'emissionByType'], },

  'pfna': { table: 'FuelReportPfna', sector: 'PFNA', filterList: ['periods', 'years'], associateTable: [] },

  'bulk': { table: 'PfnaTransactions', sector: 'PFNA', parent_slug: 'bulk', associateTable: ['Location', 'FuelType'], filterList: ['periods', 'years', 'supplier', 'transports'], metricsList: ['totalEmissions', 'fuelConsumption', 'location'] },

  'cng': { table: 'PfnaTransactions', sector: 'PFNA', parent_slug: 'cng', associateTable: ['Location', 'FuelType'], filterList: ['periods', 'years', 'supplier', 'transports'], metricsList: ['totalEmissions', 'fuelConsumption', 'location'] },

  'rd': { table: 'PfnaTransactions', sector: 'PFNA', parent_slug: 'rd', associateTable: ['Location', 'FuelType'], filterList: ['periods', 'years', 'supplier', 'transports'], metricsList: ['totalEmissions', 'fuelConsumption', 'location'] },
  'b100': { table: 'PfnaTransactions', sector: 'PFNA', parent_slug: 'b100', associateTable: ['Location', 'FuelType'], filterList: ['periods', 'years', 'supplier'], metricsList: ['fuelConsumptionB100'] },
} as any;

export const bandData =
{
  "weight":
    [
      { "band_name": "0-10k", "band_no": 1 },
      { "band_name": "10k-20k", "band_no": 2 },
      { "band_name": "20k-30k", "band_no": 3 },
      { "band_name": "30k-40k", "band_no": 4 },
      { "band_name": "40k and above", "band_no": 5 }
    ]
  ,
  "mile": [
    { "band_name": "0-50", "band_no": 1 },
    { "band_name": "50-150", "band_no": 2 },
    { "band_name": "150-400", "band_no": 3 },
    { "band_name": "400 and above", "band_no": 4 },
  ]
}

export const mapHeaderKeys = {
  mapHeaderDownload: {
    lane_name: "lane_name",
    carrier_scac: "scac",
    "rate_per_mile ($)": "rpm",
    distance_miles: "distance",
    "emission_intensity (gCo2e/Ton-Mile)": "intensity",
    "emissions (tCo2e)": "emissions",
    "cost_impact (%)": "cost_impact",
    "emission_impact (%)": "emission_impact",
    tab_name: "tab_name",
    Fuel_type: "fuel_type",
  },
  mapHeadersFilter: {
    "Lane Name": "lane_name",
    Carrier_SCAC: "scac",
    "Rate Per Mile ($)": "rpm",
    Distance_miles: "distance",
    "Emission_intensity(gCO2e/Ton-Mile of freight)": "intensity",
    "Emissions (tCO2e)": "emissions",
    "Cost_impact(%)": "cost_impact",
    "Emission_impact(%)": "emission_impact",
    Alternate_fuels: "fuel_type",
  }
} as any

export const logoutStatus = {
  DEACTIVATE: 1,
  DEL: 2,
  ROLE_UPD: 3,
  ROLE_CHG: 4,
  DIV_UPD: 5,
  REG_UPD: 6
} as any

export const logoutErrorConstatnt = {
  1: "Your account has been deactivated, please contact administrator for assistance",
  2: "Your account has been deleted, please contact administrator for assistance",
  3: "Your role access has been updated by administrator, please login again",
  4: "Your role has been changed by administrator, please login again",
  5: "Your division access has been updated by administrator, please login again",
  6: "Your region access has been updated by administrator, please login again"
} as any


export const restrictRoutesDivRegionWise = ["/get-region-emission-monthly", "/get-regions", "/get-region-intensity-yearly", "/get-region-emission-data", "/get-lane-emission", "/get-region-table-data", "/get-region-overview-detail", "/get-lane-scenario-detail", "/alternate-k-shortest-path", "/get-carrier-region-comparison-table-data", "/get-lane-carrier", "/get-business-emission-data", "/get-business-carrier-overview-detail", "/get-business-carrier-comparison-graph", "/get-business-unit-table-data", "/get-business-unit-emission-by-region", "/get-business-reduction", "/get-region-carrier-comparison-data","report-lane-data","report-lane-matrix"] as any;


export const restrictUrlForChatbot = ["/get-chat-history", "/get-chat-response", "/get-chat-list", "/search-chat-history", "/remove-chat-history"] as any;