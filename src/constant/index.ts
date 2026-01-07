export const comapnyDbAlias = {
    "PEP": "pepsi",
    "LW": "lowes",
    "ADM": "adm",
    "TQL": "tql",
    "GEN": "generic",
    "RBL": "redbull",
    "BMB": "brambles"
} as any

export const styles: any = {
    default: "#019D52"
};

export const validationConstant = {
    Required: 'required'
}

export const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\-]).{8,}$/;

export const convertToMillion = 1000000
export const fuelColors = {
    B100: "#019D52",
    Diesel: "#B3DEC1",
    Electricity: "#3357FF",
    Gasoline: "#D8B06B",
    Propane: "#F7A131",
    RD: '#019D52',
    CNG: '#016E50',
    Biodiesel: '#BCD7EC',
    RNG: '#D8856B',
    Electric: '#5097E2',
    "B100 Pilot": '#86CA9C',
    rCNG: '#FFD387',
    rDiesel: '#FFCAB9',
    kWh: '#5F9A80',
};

export const monthNames = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
export const monthsABs = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const units = {
    emissionsIntensity: "Emissions Intensity (gCO2e/Ton-Mile)",
    emissions: "Emissions (tCO2e)"
};

export const pdfLaneCarrierColors = ["#5F9A80", "#1D83BA", "#D8856B", "#F0BA4C", "#215154"];

export const allPeriods = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10", "P11", "P12", "P13"];

export const allQuaters = ["Q1", "Q2", "Q3", "Q4"];

export const locationColors = ["#D8856B", "#215154", "#019D52", "#D8B06B"]


export const companyBasedKeyForDecarb = {
    [comapnyDbAlias.PEP]: "division_id",
    [comapnyDbAlias.LW]: "region_id",
    [comapnyDbAlias.ADM]: "region_id",
    [comapnyDbAlias.TQL]: "region_id",
    [comapnyDbAlias.GEN]: "division_id",
    [comapnyDbAlias.RBL]: "region_id",
    [comapnyDbAlias.BMB]: "state_abbr"
} as any


export const decarbPriority = {
    "high": "HIGHEST PRIORITY",
    "low": "LOW PRIORITY",
    "med": "MEDIUM PRIORITY"
}


export const companyAllowedKeys = {
    pepsi: [
        "division_id",
        "bio_100", "bio_100_threshold_distance",
        "rd", "rd_threshold_distance",
        "rng", "rng_threshold_distance",
        "hydrogen", "hydrogen_threshold_distance",
        "hvo", "hvo_threshold_distance",
        "optimus", "optimus_threshold_distance",
        "ev", "ev_threshold_distance",
    ],
    generic: [
        "division_id",
        "bio_100", "bio_100_threshold_distance",
        "rd", "rd_threshold_distance",
        "rng", "rng_threshold_distance",
        "b99", "b99_threshold_distance"
    ],
    lowes: [
        "region_id",
    ],
    redbull: [
        "region_id",
        "bio_100", "bio_100_threshold_distance",
        "rd", "rd_threshold_distance",
        "rng", "rng_threshold_distance",
    ],
    brambles: [
        "state_abbr",
        "is_inbound",
        "is_less_than_150",
        "bio_100", "bio_100_threshold_distance",
        "rd", "rd_threshold_distance",
        "rng", "rng_threshold_distance",
    ],

} as any;