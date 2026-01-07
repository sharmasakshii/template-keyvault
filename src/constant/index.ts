import state from "./state.json";
export const pageSizeList = [10, 20, 30, 40, 50];
export const cardViewPageSizeList = [12, 24, 36, 48, 60];

export const listCode = state;

export const aboutUsLink = "https://smartfreightcentre.org/en/about-sfc/about-us/";

export const millionT = 1000000
export const evEmissionT = 22.5

export const nodeUrl = 'node/'

export const evDashboardEnable = false
export const evFuelId = '297'
export enum Provider {
  evNetwork = 4,
  optimus = 5
}

export const requiredCarrierItems = ['HJBT', 'XPOC'];

export const defaultQuarter = 0

export const companySlug = {
  pep: "PEP",
  adm: "ADM",
  lw: "LW",
  tql: "TQL",
  demo: "GEN",
  rb: "RB",
  bmb: "BMB",
}

export const scopeSlug = {
  scope1: "scope1",
  scope2: "scope2",
  scope3: "scope3"
}

export const reportScope1Slug: any = {
  emp: "EMP",
  flt: "FLT",
  biod: "BIOD",
  r99: "ER99",
  elc: "ELC"
}
export const valueConstant = {
  DATE_FORMAT: "MM-DD-YYYY",
  STATUS_ACTIVE: 1,
  STATUS_DEACTIVATE: 2
}

export const evProductCode = "EV"
export const rdProductCode = "RD"

export const instructions = [
  {
    fileicon: "/images/xlsFile.svg",
    text: "Only excel files are accepted for upload. Ensure that your file has the '.xlsx' extension.",
  },
  {
    fileicon: "/images/xlsFile.svg",
    text: "Each field in your excel file should be labeled appropriately to indicate the type of data it contains.",
  },
  {
    fileicon: "/images/fileListIcon.svg",
    text: "Remove any unnecessary data.",
  },
  {
    fileicon: "/images/fileListIcon.svg",
    text: "All data should be in correct format.",
  },
  {
    fileicon: "/images/toDo.svg",
    text: " Required fields: Origin City, Origin State, Destination City, Destination State, SCAC, and RPM.",
  }
];

export const routeKey: any = {
  Visibility: "VIS",
  Recommendations: "REC",
  Manage: "MAN",
  Segmentation: "SEG",
  Benchmarks: "BEN",
  UserManagement: "USM",
  RoleManagement: "USM",
  DataManagement: "DAM",
  ApplicationManagement: "APM",
  AlternativeFuel: "AMS",
  ModalShift: "AMS",
  CarrierShift: "CAS",
  AdministratorAccess: "ADA",
  ApplicationAccess: "APA",
  EvDashboard: "EVD",
  BidPlanning: "BIP",
  Scope1: "SC1",
  PPPReport: "PPR",
  ChevronFuelReport: "CFR",
  FritoLayTransactions: "FLT",
  LeasedCarsReport: "LCR",
  PropaneReport: "PRR",
  BioDieselReport: "BDR",
  R99Report: "R9R",
}

export const monthOption = [
  {
    value: 0,
    quarter: 0,
    label: "All Months"
  },
  {
    value: 1,
    quarter: 1,
    label: "January"
  }, {
    value: 2,
    quarter: 1,
    label: "February"
  }, {
    value: 3,
    quarter: 1,
    label: "March"
  }, {
    value: 4,
    quarter: 2,
    label: "April"
  }, {
    value: 5,
    quarter: 2,
    label: "May"
  }, {
    value: 6,
    quarter: 2,
    label: "June"
  }, {
    value: 7,
    quarter: 3,
    label: "July"
  }, {
    value: 8,
    quarter: 3,
    label: "August"
  }, {
    value: 9,
    quarter: 3,
    label: "September"
  }, {
    value: 10,
    quarter: 4,
    label: "October"
  }, {
    value: 11,
    quarter: 4,
    label: "November"
  }, {
    value: 12,
    quarter: 4,
    label: "December"
  }]

export const graphRadius = 24;

export const generalAnswers = [
  "We're currently processing your request and retrieving the latest data. This will only take a short moment.\n",
  "Your request has been received. We’re working on it and will have a response for you shortly.\n",
  "Just a moment while we contact our servers and gather the most up-to-date information for you.\n",
  "Hang tight! We’re fetching your data and ensuring everything is accurate before displaying the results.\n",
  "We're almost there. Our system is working in the background to get you the most relevant results.\n",
];

export const aiAgentType = [
  {
    type: "track",
    image: "/images/chatbot/ai-track.svg",
    title: "Track",
    description: "Analyze segmented emissions data to identify key sources.",
    action: "Beta"
  },
  {
    type: "benchmark",
    image: "/images/chatbot/ai-benchmark.svg",
    title: "Benchmarks",
    description: "Compare emissions with industry standards for insights.",
    action: "Coming Soon"
  },
  {
    type: "act",
    image: "/images/chatbot/ai-act.svg",
    title: "Act",
    description: "Optimize lanes with efficient routes and alternative fuels.",
    action: "Coming Soon"
  },
  {
    type: "suprise",
    image: "/images/chatbot/ai-suprise.svg",
    title: "Surprise Me",
    description: "Discover GreenSight GPT’s insights, and recommendations.",
    action: "Coming Soon"
  }
];

export const sampleQuestions = [
  {
    "id": "2600",
    "title": "PBCI Region Emissions",
    "question": "What were the emissions for the PBCI region in 2024?",
    "response_type": "text",
    "response": "The PBCI region generated 28,801.77 metric tons of CO₂e in 2024, with 70% from diesel-powered shipments and 30% from natural gases/alternative fuel.",
    "date": "2025-04-25T05:20:38.000Z",
    "data": null
  },
  {
    "id": "2601",
    "title": "Carrier JB Hunt Emissions",
    "question": "What are the total emissions for Carrier JB Hunt in Q1 2024?",
    "response_type": "text",
    "response": "In Q1 of 2024 J.B. Hunt (HJBT) generated 12.11 metric tons of CO₂ emission, with an emissions intensity of 72.9 gram CO₂e per ton-mile.",
    "date": "2025-04-25T05:21:01.000Z",
    "data": null
  },
  {
    "id": "2602",
    "title": "Carrier TQYL Emissions",
    "question": "Which carrier has the highest emissions intensity for the SEDC region?",
    "response_type": "text",
    "response": "TOTAL QUALITY LOGISTICS (TQYL) has generated 345.58 metric tons of CO₂ emission for the SEDC region.",
    "date": "2025-04-25T05:21:17.000Z",
    "data": null
  },
  {
    "id": "2603",
    "title": "Q3 2024 Emissions",
    "question": "What were our emissions for Q3 2024?",
    "response_type": "text",
    "response": "In Q3 2024, total emissions were 316,832.66 metric tons of CO₂e.",
    "date": "2025-04-25T05:21:53.000Z",
    "data": null
  },
  {
    "id": "2604",
    "title": "DECATUR-to-JOPLIN Lane Emissions",
    "question": "What are the emissions for the DECATUR-to-JOPLIN lane in 2024?",
    "response_type": "text",
    "response": "The DECATUR-to-JOPLIN lane generated 1.59 metric tons of CO₂e in 2024, with an average intensity of 164.5 g CO₂e per ton-mile.",
    "date": "2025-04-25T05:22:59.000Z",
    "data": null
  },
  {
    "id": "2605",
    "title": "PBC Region Emissions",
    "question": "Which lane has the highest emissions in the PBC region?",
    "response_type": "text",
    "response": "The MISSISSAUGA-to-MONCTON lane had the highest emissions in the PBC region, totaling 1,971.05 metric tons of CO₂e.",
    "date": "2025-04-25T05:24:06.000Z",
    "data": null
  },
  {
    "id": "2606",
    "title": "PBCI vs PBC Emissions",
    "question": "Compare emissions between the PBCI and PBC regions in Q2 2024.",
    "response_type": "text",
    "response": "In Q2 2024, the PBC region emitted 50,159.57 metric tons of CO₂e, while the PBCI region emitted 6,505.74 metric tons of CO₂e.",
    "date": "2025-04-25T05:24:21.000Z",
    "data": null
  },
  {
    "id": "2607",
    "title": "Top 10 Lanes by Emissions",
    "question": "Show emissions intensity for the top 10 lanes by ton-mile.",
    "response_type": "text",
    "response": '{\n "Response_type": "graph",\n  "Graph_type": "bar",\n "data": {\n   "title": "Emissions Intensity for Top 10 Lanes by Ton-Mile (2024-2025)",\n        "xTitle": "Lanes",\n        "yTitle": "Emission Intensity",\n        "categories": [\n            "STEVENS POINT, WI, 54481_KATHLEEN, GA, 31047",\n            "SAINT JOSEPH, MO, 64503_MODESTO, CA, 95357",\n            "STEVENS POINT, WI, 54481_FAYETTEVILLE, TN, 37334",\n            "ALLIANCE, NE, 69301_ROSENBERG, TX, 77471",\n            "LITTLETON, MA, 01460_INDIANAPOLIS, IN, 46241",\n            "SAINT JOSEPH, MO, 64503_RANCHO CUCAMONGA, CA, 91730",\n            "GRAND FORKS, ND, 58201_FRANKFORT, IN, 46041",\n            "WYTHEVILLE, VA, 24382_INDIANAPOLIS, IN, 46241",\n            "WAINWRIGHT, AB, T9W1S8_KATHLEEN, GA, 31047",\n            "MEMPHIS, TN, 38113_MODESTO, CA, 95357"\n        ],\n        "series": [\n            {\n                "name": "Emission Intensity",\n                "data": [140.5, 140.5, 140.5, 140.5, 135.4, 140.5, 140.5, 87.6, 140.4, 140.5],\n                "color": "#D8856B"\n            }\n        ]\n    }\n}',
    "date": "2025-04-25T05:24:51.000Z",
    "data": null
  },
  {
    "id": "2609",
    "title": "Carrier Emissions Comparison",
    "question": "How do the emissions of JB Hunt (HJBT) and NFI Canada (NFCA) compare on the Brampton to Airdrie lane during the period from March 1, 2024, to October 31, 2024?",
    "response_type": "image",
    "response": "J.B. Hunt has an emissions intensity of 72.9 gCO₂e/Ton-Mile of freight for the BRAMPTON to AIRDRIE lane, compared to NFI CANADA’s 98.9 gCO₂e/Ton-Mile of freight for the period between 03/01/24 and 31/10/24.",
    "data": "/images/chatbot/response/pieChart.png",
    "date": "2025-04-25T05:27:21.000Z"
  }
]

export const sampleQuestionsDEMO = [
  {
    "id": "2600",
    "title": "R16 Region Emissions",
    "question": "What were the emissions for the R16 region in 2024?",
    "response_type": "text",
    "response": "The R16 region generated 28,801.77 metric tons of CO₂e in 2024, with 70% from diesel-powered shipments and 30% from natural gases/alternative fuel.",
    "date": "2025-04-25T05:20:38.000Z",
    "data": null
  },
  {
    "id": "2601",
    "title": "Carrier JB Hunt Emissions",
    "question": "What are the total emissions for Carrier JB Hunt in Q1 2024?",
    "response_type": "text",
    "response": "In Q1 of 2024 J.B. Hunt (HJBT) generated 12.11 metric tons of CO₂ emission, with an emissions intensity of 72.9 gram CO₂e per ton-mile.",
    "date": "2025-04-25T05:21:01.000Z",
    "data": null
  },
  {
    "id": "2602",
    "title": "Carrier TQYL Emissions",
    "question": "Which carrier has the highest emissions intensity for the R3 region?",
    "response_type": "text",
    "response": "TOTAL QUALITY LOGISTICS (TQYL) has generated 345.58 metric tons of CO₂ emission for the R3 region.",
    "date": "2025-04-25T05:21:17.000Z",
    "data": null
  },
  {
    "id": "2603",
    "title": "Q3 2024 Emissions",
    "question": "What were our emissions for Q3 2024?",
    "response_type": "text",
    "response": "In Q3 2024, total emissions were 316,832.66 metric tons of CO₂e.",
    "date": "2025-04-25T05:21:53.000Z",
    "data": null
  },
  {
    "id": "2604",
    "title": "DECATUR-to-JOPLIN Lane Emissions",
    "question": "What are the emissions for the DECATUR-to-JOPLIN lane in 2024?",
    "response_type": "text",
    "response": "The DECATUR-to-JOPLIN lane generated 1.59 metric tons of CO₂e in 2024, with an average intensity of 164.5 g CO₂e per ton-mile.",
    "date": "2025-04-25T05:22:59.000Z",
    "data": null
  },
  {
    "id": "2605",
    "title": "R7 Region Emissions",
    "question": "Which lane has the highest emissions in the R7 region?",
    "response_type": "text",
    "response": "The MISSISSAUGA-to-MONCTON lane had the highest emissions in the R7 region, totaling 1,971.05 metric tons of CO₂e.",
    "date": "2025-04-25T05:24:06.000Z",
    "data": null
  },
  {
    "id": "2606",
    "title": "R16 vs R7 Emissions",
    "question": "Compare emissions between the R16 and R7 regions in Q2 2024.",
    "response_type": "text",
    "response": "In Q2 2024, the R7 region emitted 50,159.57 metric tons of CO₂e, while the R16 region emitted 6,505.74 metric tons of CO₂e.",
    "date": "2025-04-25T05:24:21.000Z",
    "data": null
  },
  {
    "id": "2607",
    "title": "Top 10 Lanes by Emissions",
    "question": "Show emissions intensity for the top 10 lanes by ton-mile.",
    "response_type": "text",
    "response": '{\n "Response_type": "graph",\n  "Graph_type": "bar",\n "data": {\n   "title": "Emissions Intensity for Top 10 Lanes by Ton-Mile (2024-2025)",\n        "xTitle": "Lanes",\n        "yTitle": "Emission Intensity",\n        "categories": [\n            "STEVENS POINT, WI, 54481_KATHLEEN, GA, 31047",\n            "SAINT JOSEPH, MO, 64503_MODESTO, CA, 95357",\n            "STEVENS POINT, WI, 54481_FAYETTEVILLE, TN, 37334",\n            "ALLIANCE, NE, 69301_ROSENBERG, TX, 77471",\n            "LITTLETON, MA, 01460_INDIANAPOLIS, IN, 46241",\n            "SAINT JOSEPH, MO, 64503_RANCHO CUCAMONGA, CA, 91730",\n            "GRAND FORKS, ND, 58201_FRANKFORT, IN, 46041",\n            "WYTHEVILLE, VA, 24382_INDIANAPOLIS, IN, 46241",\n            "WAINWRIGHT, AB, T9W1S8_KATHLEEN, GA, 31047",\n            "MEMPHIS, TN, 38113_MODESTO, CA, 95357"\n        ],\n        "series": [\n            {\n                "name": "Emission Intensity",\n                "data": [140.5, 140.5, 140.5, 140.5, 135.4, 140.5, 140.5, 87.6, 140.4, 140.5],\n                "color": "#D8856B"\n            }\n        ]\n    }\n}',
    "date": "2025-04-25T05:24:51.000Z",
    "data": null
  },
  {
    "id": "2609",
    "title": "Carrier Emissions Comparison",
    "question": "How do the emissions of JB Hunt (HJBT) and NFI Canada (NFCA) compare on the Brampton to Airdrie lane during the period from March 1, 2024, to October 31, 2024?",
    "response_type": "image",
    "response": "J.B. Hunt has an emissions intensity of 72.9 gCO₂e/Ton-Mile of freight for the BRAMPTON to AIRDRIE lane, compared to NFI CANADA’s 98.9 gCO₂e/Ton-Mile of freight for the period between 03/01/24 and 31/10/24.",
    "data": "/images/chatbot/response/pieChart.png",
    "date": "2025-04-25T05:27:21.000Z"
  }
]

export const fuelIcons: any = {
  b1_20: "/images/b1Fuel.svg",
  "b21_99": "/images/b20-b99.svg",
  b100: "/images/b100Fuel.svg",
  ev: "/images/grid-icon.svg",
  rd: "/images/rd-icon.svg",
  rng: "/images/rng-icon-new.svg",
  hvo: "/images/hvoFuel-icon.svg",
  optimus: "/images/rng-icon.svg",
  hydrogen: "/images/hydrogen-icon.svg",
  b99: "/images/b99.svg",
  carrier_shift: "/images/carrier-icon.svg",
  modal_shift: "/images/rail-icon.svg",
  default: "/images/sidebar/fuelStop.svg"
};

export const fuelSlug = {
  b1_20: "b1_20",
  b21_99: "b21_99",
  b100: "b100",
  ev: "EV",
  rd: "RD",
  rng: "RNG",
  hvo: "HVO",
  optimus: "OPTIMUS",
  hydrogen: "HYDROGEN",
  b99: "/images/b99.svg",
};


export const radiusOptions = [
  { label: '3.5 Miles', value: 3.5 },
  { label: '5 Miles', value: 5 },
  { label: '10 Miles', value: 10 },
  { label: '20 Miles', value: 20 },
  { label: '50 Miles', value: 50 }
];

export const fuelTypeKeyValue: { [key: string]: string } = {
  is_bio_100: 'b100',
  is_bio_21_99: 'b21_99',
  is_bio_1_20: 'b1_20',
  is_rd: 'RD',
  is_hvo: 'HVO',
  is_rng: 'RNG',
  is_hydrogen: 'HYDROGEN',
  is_optimus: 'OPTIMUS',
  carrier: 'carrier',
  intermodal: 'intermodal',
  is_b99: 'B99',
  is_ev: 'EV'
}


export const typeOptionListDto = [
  { label: "All Types", value: "" },
  { label: 'OTR', value: '0' },
  { label: 'Intermodal', value: '1' },
];
