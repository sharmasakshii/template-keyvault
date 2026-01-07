// Import necessary assets
import moment from "moment";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import {
  companySlug,
  listCode,
  monthOption,
  scopeSlug,
  routeKey,
  evProductCode,
  nodeUrl,
  reportScope1Slug,
  fuelTypeKeyValue,
} from "constant";
import { imageToken, imageURL } from "./InterceptorApi";
import styles from "scss/config/_variable.module.scss";
import { Priority } from "interface/priority";
const CryptoJS = require("crypto-js");
const staticStates = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

// Create a mapping from abbreviation → full name
const stateMap: Record<string, string> = Object.entries(staticStates).reduce(
  (acc, [abbr, name]) => {
    acc[abbr] = name;
    return acc;
  },
  {} as Record<string, string>
);

export const kmToMilesConst = 0.621371;
export const MilesTokmConst = 1.60934;
export const currentYear = 2024;

// Define interfaces for Contributor and Detractor data
interface ContributorItem {
  name: string;
  value: number;
  color: string;
}

interface DetractorItem {
  name: string;
  value: number;
  color: string;
}

// Define a union type for GraphDataItem
type GraphDataItem = ContributorItem | DetractorItem;

interface Contributor {
  name: string;
  value: number;
  color: string;
}

interface Detractor {
  name: string;
  value: number;
  color: string;
}

//Get value from local storage or default to an empty string
export const getLocalStorage = (key: string) => {
  const localStorageData = localStorage.getItem(key);
  if (!localStorageData) {
    return "";
  }
  return JSON.parse(localStorageData);
};

// Function to handle error responses
export const getErrorMessage = (error: AxiosError): any => {
  const errorData: any = error?.response?.data;
  const errorMessage =
    errorData?.message.toString() ||
    error.message.toString() ||
    "Something went wrong!";
  errorData && toast.error(errorMessage);
  return { code: error?.code, message: errorMessage };
};

const getOnBoardUrl = (
  loginDetails: any,
  userProfile: any,
  type: any,
  key: any,
  link: any
) => {
  let url = "";
  if (
    isApplicationTypeChecked(
      normalizedList(loginDetails?.permissionsData),
      routeKey.AdministratorAccess
    )
  ) {
    url = userProfile?.[key] ? link : `/${type}/onboard`;
  } else {
    url = userProfile?.[key] ? link : "/scope-selection";
  }

  return url;
};

// Helper function to get defalut url
export const getBaseUrl = (
  loginDetails: any,
  scopeType: any,
  userProfile?: any,
  applicationType = ""
) => {
  let url = "";
  switch (scopeType) {
    case scopeSlug?.scope1:
      url = getOnBoardUrl(
        loginDetails,
        userProfile,
        "scope1",
        "scope_1",
        isCompanyEnable(loginDetails, [companySlug?.pep])
          ? `/scope1/fuel-report/PBNA`
          : "/scope1/fuel-report"
      );
      break;
    case scopeSlug?.scope2:
      url = getOnBoardUrl(
        loginDetails,
        userProfile,
        "scope2",
        "scope_2",
        "/scope2/dashboard"
      );
      break;
    case scopeSlug?.scope3:
      if (applicationType === "chatbot") {
        url = "/scope3/ai-agent";
      } else if (checkRolePermission(loginDetails, "regionalManager")) {
        url = "/scope3/regional-level";
      } else {
        url = "/scope3/sustainable";
      }
      break;
    default:
      url = "/scope-selection";
      break;
  }

  return url;
};

// Function to generate a list of years based on date range
export const yearList = (dto: { start_date?: any; end_date?: any }) => {
  let a: number[] = [];

  const normalizeDate = (date: any) => {
    if (date == null) return moment(); // fallback

    if ((date + "").length === 4 && !isNaN(Number(date))) {
      return moment().year(Number(date)).startOf("year");
    }
    return moment(date);
  };

  const startDate = normalizeDate(dto?.start_date);
  const endDate = normalizeDate(dto?.end_date);

  for (let i = startDate.year(); i <= endDate.year(); i++) {
    a.push(i);
  }
  return a;
};

// Function to generate a list of quarters based on the current year and selected year
export const getQuarters = (yearlyData: string | number) => {
  const latestYear = new Date().getFullYear();
  const quarter = Math.floor((new Date().getMonth() + 3) / 3);

  let list: { value: string | number; label: string }[] = [
    { value: 0, label: quarter <= 4 ? "YTD" : "All" },
    { value: 1, label: "Q1" },
  ];

  // Add quarters based on current year and selected year
  if (Number.parseInt(yearlyData?.toString(), 10) >= latestYear) {
    if (quarter >= 2) {
      list.push({ value: 2, label: "Q2" });
    }
    if (quarter >= 3) {
      list.push({ value: 3, label: "Q3" });
    }
    if (quarter >= 4) {
      list.push({ value: 4, label: "Q4" });
    }
  } else {
    list = [
      { value: 0, label: "All" },
      { value: 1, label: "Q1" },
      { value: 2, label: "Q2" },
      { value: 3, label: "Q3" },
      { value: 4, label: "Q4" },
    ];
  }
  return list;
};

// Function to get the name of a quarter based on its numeric value and year

export const isCompanyEnable = (userDetail: any, companyList: any): boolean => {
  return companyList.includes(userDetail?.Company?.slug);
};

export const getCompanyName = (
  userDetail: any,
  islabel: boolean = false
): string => {
  if (userDetail?.Company?.slug === "LW") {
    return "Lowe's";
  } else {
    return userDetail?.Company?.name || "";
  }
};

export const checkRolePermission = (userDataRole: any, role: any) => {
  if (role === "regionalManager") {
    return userDataRole?.region_id;
  } else if (role === "divisionManager") {
    return isCompanyEnable(userDataRole, [companySlug?.pep])
      ? userDataRole?.division_id
      : "";
  }
};

// Function to prevent spaces in input for certain fields.
export const removeSpaceOnly = (e: any) => {
  const inputValue = e.target.value;
  const key = e.keyCode ? e.keyCode : e.which;

  // Allowing spaces only if the input value is not empty and not starting with a space
  if (inputValue.length === 0 && key === 32) {
    e.preventDefault();
  }
};

export const numberOnly = (e: any) => {
  const key = e.keyCode ? e.keyCode : e.which;
  if (
    !(
      [8, 9, 13, 27, 46].indexOf(key) !== -1 ||
      (key === 65 && (e.ctrlKey || e.metaKey)) ||
      (key >= 35 && key <= 40) ||
      (key >= 48 && key <= 57 && !(e.shiftKey || e.altKey)) ||
      (key >= 96 && key <= 105)
    )
  )
    e.preventDefault();
};

// Function to determine which sort icon to display
export const sortIcon = (
  key: string,
  col_name: string,
  order: string
): string => {
  if (col_name === key) {
    return order === "asc" ? "topactiveArrow.svg" : "downactiveArrow.svg";
  } else {
    return "disabledArrow.svg";
  }
};

// Function to process graph data and return an array of GraphDataItems
export const getGraphDataHorizontal = (
  res: {
    data: { contributor?: ContributorItem[]; detractor?: DetractorItem[] };
  },
  key: any = null
): GraphDataItem[] => {
  let regionPageArr: GraphDataItem[] = [];
  let regionPageArrMerge: GraphDataItem[] = [];

  // Process contributor data
  if (res?.data?.contributor) {
    regionPageArr = res.data.contributor
      .filter((i) => i.name !== key)
      .map((i) => ({
        ...i,
        name: i.name,
        y: i.value,
        color: i.color,
        yAxis: 1,
        dataLabels: [
          {
            inside: false,
            enabled: true,
            rotation: 0,
            x: 32,
            overflow: "none",
            allowOverlap: false,
            color: styles.darkGray,
            align: "center",
            crop: false,
            formatter() {
              return "";
            },
          },
        ],
        type: "column",
      }));
  }

  // Process detractor data
  if (res?.data?.detractor) {
    const detractorData = res.data.detractor;
    regionPageArrMerge = res?.data?.detractor
      .filter((i) => i.name !== key)
      .map((i) => {
        const yValue =
          -Number(i.value) -
          ((detractorData[detractorData?.length - 1]?.value || 0) -
            (detractorData[0]?.value || 0));
        return {
          ...i,
          name: i.name,
          y: yValue,
          yValue: -Number(i.value),
          color: i.color,
          yAxis: 0,
          type: "column",
          dataLabels: [
            {
              inside: false,
              enabled: true,
              rotation: 0,
              x: -30,
              overflow: "none",
              allowOverlap: false,
              color: styles.darkGray,
              align: "center",
              crop: false,
              formatter() {
                return "";
              },
            },
          ],
        };
      });
  }

  // Return merged array of contributor and detractor data
  return [...regionPageArr, ...regionPageArrMerge];
};

//   region select Dropdown
export const getRegionOptions = (data: any) => {
  let regionOption =
    data?.length !== 0 &&
    data?.map((elem: any) => {
      return { label: elem?.name, value: elem?.id?.toString() };
    });

  if (regionOption?.length) {
    regionOption = [{ label: "All Regions", value: "" }, ...regionOption];
  } else {
    regionOption = [{ label: "All Regions", value: "" }];
  }
  return regionOption;
};

export const getDivisionOptions = (data: any, defalut: any = "") => {
  let divisionOption =
    data?.length !== 0 &&
    data?.map((elem: any) => {
      return { label: elem?.name, value: elem?.id?.toString() };
    });

  if (divisionOption?.length) {
    divisionOption = [
      { label: "All Divisions", value: defalut },
      ...divisionOption,
    ];
  } else {
    divisionOption = [{ label: "All Divisions", value: defalut }];
  }
  return divisionOption;
};

export const getRegionOptionsBenchmark = (data: any) => {
  let regionOption =
    data?.length !== 0 &&
    data?.map((elem: any) => {
      return { label: elem?.region_name, value: elem?.id.toString() };
    });

  if (regionOption?.length) {
    regionOption = [...regionOption];
  } else {
    regionOption = [];
  }
  return regionOption;
};
//   Quarter select Dropdown
export const getQuarterOptions = (data: any) => {
  return getQuarters(data).map((i: any) => ({
    value: i?.value,
    label: i?.label,
  }));
};
//   Yearly select Dropdown
export const getYearOptions = (
  data: any,
  isBrambles: boolean = false,
  dateType: string = "",
  lastPart: string = ""
) => {
  if (!data) return [];

  const showFY = isBrambles && lastPart !== "benchmarks";

  if (isBrambles && dateType === "benchmark_dates") {
    return yearList(data).map((x: any) => ({
      label: showFY ? `FY-${x}` : String(x),
      value: x,
    }));
  } else if (isBrambles) {
    const years = [data?.start_year, data?.end_year]
      .filter((y) => y != null)
      .map((y) => Number(y));

    const uniqueYears = Array.from(new Set(years));

    return uniqueYears.map((y) => ({
      label: showFY ? `FY-${y}` : String(y),
      value: y,
    }));
  }

  return yearList(data).map((x: any) => ({
    label: showFY ? `FY-${x}` : String(x),
    value: x,
  }));
};

// pagination dropdown option
export const getPaginationOptions = (data: any) => {
  return data.map((x: any) => ({ label: x, value: x }));
};

export const capitalizeText = (str: string, isUppercase = false): string => {
  if (isUppercase) return str.toUpperCase();
  return str
    ?.toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getDropDownOptions = (
  list: any,
  key: any,
  value: any,
  labelKey = "All",
  labelValue: any = "",
  isCapital = true,
  isUppsercase = false
) => {
  let options = normalizedList(
    list?.length > 0 &&
    list?.map((x: any) => ({
      label: isCapital ? capitalizeText(x[key], isUppsercase) : x[key],
      value: x[value],
      isDisabled: x["isDisabled"] ?? false,
    }))
  );
  if (labelKey) {
    return [{ label: labelKey, value: labelValue }, ...options];
  }
  return options;
};

export const getGraphData = (
  res: { data: { contributor?: Contributor[]; detractor?: Detractor[] } },
  key: any = null
) => {
  let regionPageArr: any = [];
  let regionPageArrMerge: any = [];

  if (res?.data?.contributor) {
    regionPageArr = res?.data?.contributor
      ?.filter((i) => i?.name !== key)
      ?.map((i) => ({
        ...i,
        name: i.name?.split("_").join(" to "),
        y: i.value,
        color: i.color,
        yAxis: 1,
        dataLabels: [
          {
            inside: false,
            enabled: true,
            rotation: 0,
            x: 32,
            overflow: "none",
            allowOverlap: false,
            color: styles.darkGray,
            align: "center",
            crop: false,
            formatter(_: any) {
              const point: any = this;
              let value: any = Math.abs(point.y).toFixed(1);
              let returnValue = formatNumber(true, value, 1);
              return `+ ${returnValue}`;
            },
          },
        ],
        type: "column",
      }));
  }

  if (res?.data?.detractor) {
    regionPageArrMerge = res?.data?.detractor
      ?.filter((i) => i?.name !== key)
      ?.map((i) => ({
        ...i,
        name: i.name,
        y: -Number(i.value),
        color: i.color,
        yAxis: 0,
        type: "column",
        dataLabels: [
          {
            inside: false,
            enabled: true,
            rotation: 0,
            x: -30,
            overflow: "none",
            allowOverlap: false,
            color: styles.darkGray,
            align: "center",
            crop: false,
            formatter: function (_: any) {
              const point: any = this;
              let value: any = Math.abs(point.y).toFixed(1);
              let returnValue = formatNumber(true, value, 1);
              return `- ${returnValue}`;
            },
          },
        ],
      }));
  }

  return [...regionPageArr, ...regionPageArrMerge];
};

export const formatNumber = (
  isDecimalNumber: boolean,
  number: any,
  place: number = 0,
  maxPlace?: number
) => {
  let numberData: any = "0";
  let decimalPoint = Math.pow(10, place ?? 1);
  if (number !== "N/A") {
    if (!isDecimalNumber) {
      numberData = Number.parseInt(number || 0)?.toLocaleString("en-US");
    } else {
      numberData = (
        Math.floor(Math.round(Number.parseFloat(number || 0) * decimalPoint)) /
        decimalPoint
      )?.toLocaleString("en-US", {
        minimumFractionDigits: place,
        maximumFractionDigits: maxPlace ?? place,
      });
    }
  }
  return numberData;
};
export const numberFormatShort = (decimalNumber: number) => {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: decimalNumber,
  });
};

export const getLaneSubTitle = (isChecked: boolean) =>
  isChecked ? "Total Lane Emissions" : "Lane Emissions Intensity";

export const getRevenueType = (
  revenueType: number,
  unit: "miles" | "kms" = "miles"
) => {
  if (revenueType === 0) {
    return unit === "miles" ? "Ton-Mile" : "Ton-Kms";
  }
  return "revenue dollar";
};
export const sortList = (list: any, colName: string, order: string) => {
  let name = colName;
  const newList = [...list]?.sort((a: any, b: any) => {
    if (order === "asc") {
      if (a[name] < b[name]) return -1;
      if (a[name] > b[name]) return 1;
      return 0;
    } else {
      if (a[name] > b[name]) return -1;
      if (a[name] < b[name]) return 1;
      return 0;
    }
  });
  return newList;
};

export const avgList = (list: any, colName: string) => {
  return (
    list?.reduce(function (acc: any, obj: any) {
      return acc + obj[colName];
    }, 0) / list.length
  );
};

export const normalizedList = (list: any) => {
  return Array.isArray(list) ? list : [];
};

export const getSubTitleFacility = (
  isChecked: boolean,
  regionalLevel: string,
  list: any
) => {
  let regionalName = "All Regions";
  if (regionalLevel !== "" && list) {
    const region = list.filter((e: any) => {
      return e.id === Number.parseInt(regionalLevel);
    })[0]?.name;
    regionalName = region + " Region";
  }

  return `${getEmmisonName(isChecked)} of ${regionalName}`;
};

export const showSign = (isChecked: boolean) => (isChecked ? "-" : "+");

export const getUnitSign = (isUnit: boolean, defaultUnit?: string): string => {
  if (!isUnit) return "tCO2e";

  if (!defaultUnit) {
    return "gCO2e/Ton-Km of freight"; // fallback
  }

  const normalized = defaultUnit.toLowerCase();

  switch (normalized) {
    case "mile":
    case "miles":
      return "gCO2e/Ton-Mile of freight";
    case "km":
      return "gCO2e/Ton-Km of freight";
    case "kms":
      return "gCO2e/Ton-Kms of freight";
    default:
      return `gCO2e/Ton-${normalized.charAt(0).toUpperCase() + normalized.slice(1)
        } of freight`;
  }
};

export const formatTransportUnit = (unit?: string): string => {
  if (!unit) return "Ton-Km";

  const normalized = unit.toLowerCase();

  switch (normalized) {
    case "mile":
    case "miles":
      return "Ton-Mile";
    case "km":
      return "Ton-Km";
    case "kms":
      return "Ton-Kms";
    default:
      return `Ton-${normalized.charAt(0).toUpperCase() + normalized.slice(1)}`;
  }
};

export const getGramUnitSign = (isUnit: boolean) => (isUnit ? "tCO2e" : "g");

export const getMaxValue = (list: any) => Math.max(...(list || [1])) * 1.1;

export const checkName = (name: string) => `${name || ""}`;

export const getEmmisonName = (checkedRegion: boolean) =>
  checkedRegion ? "Total Emissions" : "Emissions Intensity";

export const getColumnChartHeading = (
  data: any,
  type: string
) => `Average of all ${type} (
    ${formatNumber(true, data?.average, 1)}
    ${data?.unit} )`;

export const getEmissionDetailId = (list: any, code: number, type: any) => {
  let slugcode = listCode?.filter((i: any) => i?.post_code === code)[0]?.slug;
  return list?.data?.filter((i: any) => i?.slug === slugcode)[0]?.[type] || 0;
};
export const listCodeFuc = (code: any) => {
  let regionCode = listCode?.filter((i) => i?.post_code === code)[0]
    ?.region_code;
  return listCode
    ?.filter((i) => i?.region_code === regionCode)
    ?.map((i) => i?.post_code);
};
export const getRegionNameDetail = (list: any, code: any, type: any) => {
  let slugcode = listCode?.filter((i: any) => i?.post_code === code)[0]?.slug;
  return list?.data?.filter((i: any) => i?.slug === slugcode)[0]?.[type] || "";
};

export const getEmissionDetail = (list: any, code: any, type: any) => {
  let slugcode = listCode?.filter((i: any) => i?.post_code === code)[0]?.slug;
  return (
    Math.round(
      (list?.data?.filter((i: any) => i?.slug === slugcode)[0]?.[type] || 0) *
      10
    ) / 10
  )?.toLocaleString("en-US", { minimumFractionDigits: 1 });
};

export const getPriority = (type: number) => {
  let priority = "";

  switch (type) {
    case 1:
      priority = "HIGHEST PRIORITY";
      break;
    case 2:
      priority = "MEDIUM PRIORITY";
      break;
    default:
      priority = "LOW PRIORITY";
  }
  return priority;
};

export const getPriorityColor = (type: string) => {
  let colorCode = "";

  switch (type) {
    case "HIGHEST PRIORITY":
      colorCode = "high_priority";
      break;
    case "MEDIUM PRIORITY":
      colorCode = "medium_priority";
      break;
    default:
      colorCode = "low_priority";
  }
  return colorCode;
};

export const getQuarterData = (id: any) => {
  return id !== "" ? Number.parseInt(id) : "";
};

export const getCarrierEmissions = (
  emissionValue: any,
  shipment: any,
  carrierEmissionValue: any,
  carrierShipment: any
) => {
  const emmisionPerShipment = emissionValue / shipment;
  const carrierEmmisionPerShipment = carrierEmissionValue / carrierShipment;
  return (
    100 -
    ((emmisionPerShipment - carrierEmmisionPerShipment) / emmisionPerShipment) *
    100
  )?.toFixed(1);
};

export const getTitleDecarb = (key: any) => {
  if (key === "modal_shift") {
    return "Modal Shift";
  }
  if (key === "alternative_fuel") {
    return "Alternative Fuel";
  }
  if (key === "carrier_shift") {
    return "Carrier Shift";
  }
  if (key === "fuel_stop") {
    return "Fuel Stop Recommendations";
  }
};

export const getStrokeOpacity = (type: string) => (type === "TRANSIT" ? 0 : 1);
export const getMapPath = (type: string) =>
  type === "TRANSIT"
    ? google.maps.SymbolPath.CIRCLE
    : google.maps.SymbolPath.FORWARD_OPEN_ARROW;

export const getMapIcon = (type: string) =>
  type === "TRANSIT"
    ? [
      {
        icon: {
          path: getMapPath(type),
          fillColor: styles.orange,
          fillOpacity: 1,
          scale: 2,
          strokeColor: styles.orange,
          strokeOpacity: 1,
        },
        offset: "0",
        repeat: "10px",
      },
    ]
    : null;

export const typeCheck = (
  condition: boolean,
  firstStatment: any,
  secondStatment: any
) => (condition ? firstStatment : secondStatment);

export const checkNumberUndefined = (data: any) => {
  return data || 0;
};

export const returnBandNumber = (benchmarkDto: any) => {
  return benchmarkDto?.data?.map((x: any) => ({
    label: x.band_name,
    value: x.band_no,
  }));
};

export const returnBinary = (value: boolean): number => Number(value);

export const benchmarkType = (params: any) =>
  params?.type === "region" ? "US Region" : "Freight Lanes";

export const getOrder = (order: string) => (order === "desc" ? "asc" : "desc");

export const getFirstLastElement = (list: any) => {
  const listCopy: any = [...list];
  return [listCopy[0], listCopy?.pop()];
};

export const timeConverter = (time: number) => {
  if (time) {
    return `${Math.trunc(time / 3600)}Hr ${Math.trunc(time / 60) % 60}Mins`;
  } else {
    return 0;
  }
};

export const distanceConverter = (
  distance: number,
  unit: "miles" | "kms" = "miles"
) => {
  if (!distance) return 0;

  if (unit === "miles") {
    return distance * kmToMilesConst;
  }

  if (unit === "kms") {
    return distance * 1;
  }

  return distance;
};

export const distanceConverterInterModal = (
  distance: number,
  unit: "miles" | "kms" = "miles"
) => {
  if (!distance) return 0;

  if (unit === "miles") {
    return distance * 1;
  }

  if (unit === "kms") {
    return distance * MilesTokmConst;
  }

  return distance;
};

export const formatUnit = (unit?: string): string => {
  if (!unit) return "Km";

  const normalized = unit.toLowerCase();

  if (normalized === "mile" || normalized === "miles") return "Miles";

  if (normalized === "km") return "Km";
  if (normalized === "kms") return "Kms";

  const capitalized = normalized.charAt(0).toUpperCase() + normalized.slice(1);
  return capitalized;
};

export const formatPerUnit = (unit?: string) => {
  if (!unit) return "per Kilometer"; // fallback

  const normalized = unit.toLowerCase();

  switch (normalized) {
    case "mile":
    case "miles":
      return "Mile";
    case "km":
    case "kms":
      return "Kilometer";
    default:
      return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  }
};

export const getLowHighImage = (
  value1: any,
  value2: any,
  isClassName?: boolean,
  place: number = 1
) => {
  if (isClassName) {
    return Number(value1?.toFixed(place)) > Number(value2?.toFixed(place))
      ? "highData"
      : "";
  }
  return Number(value1?.toFixed(place)) > Number(value2?.toFixed(place))
    ? "redDownArrow.svg"
    : "greenArrowDowm.svg";
};

export const isCancelRequest = (res: any) => {
  return res?.code === "ERR_CANCELED" || res === "canceled";
};

// Function to generate and download CSV
export const downloadCSV = (csvData: any, fileName: string, type?: string) => {
  // Create a Blob and create a link to trigger the download
  const blob = new Blob([csvData], { type: type ?? "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${fileName}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Navigate to carrier from lane intermodal map
export const navigateToCarrier = (
  code: string,
  laneName: string,
  projectId?: any,
  year?: any
) => {
  if (projectId) {
    return `/scope3/carrier-overview/${code}/detail/${laneName}/${year}/0/${projectId}`;
  } else {
    return `/scope3/carrier-overview/${code}/detail/${laneName}/${year}/0`;
  }
};

export const executeScroll = (ref: any) => {
  if (ref?.current) {
    return ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const parseCostPremiumConst = (value: any) => {
  if (!value) return 0;

  // Handle string-like input
  if (value?.split) {
    const nums = value
      .split(",")
      .map((v: string) => parseFloat(v.trim()))
      .filter((n: number) => !isNaN(n));

    if (!nums.length) return 0;

    // Return average of all numbers in the string
    return nums.reduce((sum: number, n: number) => sum + n, 0) / nums.length;
  }

  // Handle numbers directly
  return Number.isFinite(value) ? value : 0;
};

export const getProjectedCost = (
  total: any,
  avg: any,
  dollarPerMile: number,
  lane: any,
  routeType: string,
  fuelStops?: any,
  laneDto?: any
) => {
  if (routeType === "alternative_fuel") {
    const selectedFuelStopList = fuelStops?.selectedFuelStop;
    const countSelectedFuelStop = selectedFuelStopList?.length || 0;

    // sum of selected fuel stops (each parsed to a number)
    const sumSelectedFuelStop =
      selectedFuelStopList?.reduce((acc: number, obj: any) => {
        const val = Number(obj?.cost_premium_const || 0);
        // multiply by 100 to make integer math, then divide at end
        return acc + Math.round(val * 100);
      }, 0) / 100 || 0;

    // maintain total sum and count across *all* considered stops
    let totalCostPremiumSum = 0;
    let totalCount = 0;

    if (countSelectedFuelStop > 0) {
      totalCostPremiumSum += sumSelectedFuelStop;
      totalCount += countSelectedFuelStop;
    }

    // if no selected stops but baseline fuel stop should be used
    if (fuelStops?.showFuelStops && countSelectedFuelStop === 0) {
      totalCostPremiumSum +=
        parseCostPremiumConst(lane?.fuel_stop?.cost_premium_const) || 0;
      totalCount += 1;
    }

    // add EV fuel stop as its own sample if requested
    if (fuelStops?.showFuelStopsEV) {
      totalCostPremiumSum +=
        parseCostPremiumConst(laneDto?.ev_fuel_stop?.cost_premium_const) || 0;
      totalCount += 1;
    }

    // compute final average safely
    const avgCostPremiumConst =
      totalCount > 0 ? totalCostPremiumSum / totalCount : 0;

    // rounding & guard for divide by zero
    const roundedTotal = Math.round(total * 10) / 10;
    const roundedAvg = Math.round(avg * 10) / 10;

    if (roundedAvg === 0) {
      return {
        cost: formatNumber(true, 0, 0),
        costPremiumConstFraction: avgCostPremiumConst,
      };
    }

    const costPercent =
      (Math.abs(roundedTotal * avgCostPremiumConst - roundedAvg) / roundedAvg) *
      100;

    return {
      cost: formatNumber(true, costPercent, 0),
      costPremiumConstFraction: avgCostPremiumConst,
    };
  } else {
    return {
      cost: intermodalCost(
        avg,
        lane?.laneIntermodalDto?.laneIntermodalCordinateData?.road_distance,
        dollarPerMile,
        parseCostPremiumConst(
          lane?.laneIntermodalDto?.baseLine?.fuel_stop?.cost_premium_const
        ),
        lane?.laneIntermodalDto?.laneIntermodalCordinateData?.rail_distance,
        lane?.laneIntermodalDto?.laneIntermodalCordinateData?.cost_per_mile
      ),
      costPremiumConstFraction: parseCostPremiumConst(
        lane?.laneIntermodalDto?.baseLine?.fuel_stop?.cost_premium_const
      ),
    };
  }
};

export const intermodalCost = (
  avg: number,
  road_distance: number,
  dollarPerMile: number,
  cost_premium_const: number,
  rail_distance: number,
  cost_per_mile: number
) => {
  let cost =
    road_distance * kmToMilesConst * dollarPerMile * cost_premium_const +
    rail_distance * kmToMilesConst * cost_per_mile;

  return formatNumber(
    true,
    (Math.abs(
      Math.round(cost * 10) / 10 - (Math.round(avg * 10) / 10) * dollarPerMile
    ) /
      ((Math.round(avg * 10) / 10) * dollarPerMile)) *
    100,
    0
  );
};

export const getCheckedValue = (
  isCheckedObj: any,
  isChecked: boolean,
  laneFuelStop: any
) => {
  const alternativeFuel = laneFuelStop?.filter(
    (res: any) => res.product_codes !== evProductCode
  ).length;
  const evFuel = laneFuelStop?.filter(
    (res: any) => res.product_codes === evProductCode
  ).length;
  // const rdFuel = laneFuelStop?.filter((res: any) => (res.product_code === rdProductCode)).length
  const rdFuel = 0;
  if (Object.values(isCheckedObj)?.filter((res: any) => res).length === 0) {
    if (alternativeFuel > 0) {
      return { ...isCheckedObj, showFuelStops: true };
    }
    if (evFuel > 0) {
      return { ...isCheckedObj, showFuelStopsEV: true };
    }

    if (rdFuel > 0) {
      return { ...isCheckedObj, showFuelStopsRD: true };
    }
  }
  return isCheckedObj;
};

const parseImpactFraction = (
  value: any,
  isWeighted: boolean = false
): number => {
  if (!value) return 0;

  // Handle string input
  if (value?.split) {
    const nums = value
      .split(",")
      .map((v: string) => parseFloat(v.trim()))
      .filter((n: number) => !isNaN(n));

    if (!nums.length) return 0;

    if (isWeighted) {
      const total = nums.reduce((sum: number, n: number) => sum + n, 0);
      return nums.reduce((sum: number, n: number) => sum + (n * n) / total, 0);
    }

    return nums.reduce((sum: number, n: number) => sum + n, 0) / nums.length;
  }

  // Handle numbers directly
  return Number.isFinite(value) ? value : 0;
};

export const getLaneEmission = (
  lane: any,
  scenarioDetails: any,
  totalMiles: number,
  routeType: string,
  fuelStops?: any,
  laneDto?: any
) => {
  let oldEmission = 0;
  let newEmission = 0;
  let percentEmissions = 0;

  if (routeType === "alternative_fuel") {
    oldEmission = scenarioDetails?.data?.emission_intensity * totalMiles * 22.5;

    const selectedFuelStopList = fuelStops?.selectedFuelStop;
    const countSelectedFuelStop = selectedFuelStopList?.length || 0;

    // track total impact fraction and total count
    let totalImpactSum = 0;
    let totalCount = 0;

    if (countSelectedFuelStop > 0) {
      const sumSelectedFuelStop =
        selectedFuelStopList?.reduce(
          (acc: number, obj: any) =>
            acc + parseImpactFraction(obj.impact_fraction),
          0
        ) || 0;

      totalImpactSum += sumSelectedFuelStop;
      totalCount += countSelectedFuelStop;
    }

    if (fuelStops?.showFuelStops && countSelectedFuelStop === 0) {
      totalImpactSum +=
        parseImpactFraction(lane?.fuel_stop?.impact_fraction) || 0;
      totalCount += 1;
    }

    if (fuelStops?.showFuelStopsEV) {
      totalImpactSum +=
        parseImpactFraction(laneDto?.ev_fuel_stop?.impact_fraction) || 0;
      totalCount += 1;
    }

    const avgImpactFraction = totalCount > 0 ? totalImpactSum / totalCount : 0;

    newEmission =
      scenarioDetails?.data?.emission_intensity *
      totalMiles *
      22.5 *
      avgImpactFraction;

    percentEmissions = Math.abs(avgImpactFraction - 1) * 100;

    return { oldEmission, newEmission, percentEmissions };
  }

  const totalRoadDistance =
    lane?.laneIntermodalDto?.laneIntermodalCordinateData?.road_distance;
  const totalRailDistance =
    lane?.laneIntermodalDto?.laneIntermodalCordinateData?.rail_distance;

  const emissionIntermodal = intermodalReduction(
    totalRoadDistance,
    totalRailDistance,
    scenarioDetails?.data?.emission_intensity,
    lane?.laneIntermodalDto?.baseLine?.distance,
    parseImpactFraction(
      lane?.laneIntermodalDto?.baseLine?.fuel_stop?.impact_fraction
    ),
    lane?.laneIntermodalDto?.laneIntermodalCordinateData?.emission_const
  );

  oldEmission = emissionIntermodal?.oldEmission || 0;
  newEmission = emissionIntermodal?.newEmission || 0;
  percentEmissions = emissionIntermodal?.percentEmissions || 0;

  return { oldEmission, newEmission, percentEmissions };
};

export const intermodalReduction = (
  road_distance: any,
  rail_distance: any,
  emission_intensity: any,
  distance: any,
  impact_fraction: any,
  emission_const: any
) => {
  let oldEmission: number = emission_intensity * distance * 22.5;
  let newEmission: number =
    emission_intensity *
    22.5 *
    (impact_fraction * road_distance + emission_const * rail_distance);
  let percentEmissions: number =
    (Math.abs(newEmission - oldEmission) / oldEmission) * 100;

  return { oldEmission, newEmission, percentEmissions };
};

export const getPercentageDistanceTime = (
  actualValue: number,
  total: number
) => {
  if (total > 0) {
    return ((actualValue - total) / total) * 100;
  } else {
    return 0;
  }
};

export const getFileStatusIcon = (status: number | string) => {
  switch (status) {
    case 1:
      return "cancel.svg";
    case 2:
      return "uploaded.svg";
    case 4:
      return "failedIcon.svg";
    case 3:
      return "ingested.svg";
    case 7:
      return "partiallyIngested.svg";
    case 5:
      return "analyzed.svg";
    case 6:
      return "uploadingIcon.svg";
    case "folder":
      return "folder.svg";
    case "file":
      return "file.svg";
    default:
      return "uploadingIcon.svg";
  }
};

export const getBidFileStatusIcon = (status: number | string) => {
  switch (status) {
    case 1:
      return "cancel.svg";
    case 2:
      return "uploaded.svg";
    case 3:
      return "failedIcon.svg";
    case 5:
      return "processed.svg";
    case "file":
      return "file.svg";
    default:
      return "uploaded.svg";
  }
};

export const getUserStatus = (status: any) => {
  switch (status) {
    case 0:
      return { name: "Inactive", color: "inactive" };
    case 1:
      return { name: "Active", color: "active" };
    default:
      return { name: "Deactivated", color: "deactive" };
  }
};

export const getFileStatusCode = (status: string) => {
  switch (status) {
    case "Cancelled":
      return 1;
    case "Uploaded":
      return 2;
    case "Failed":
      return 4;
    case "Ingested":
      return 3;
    case "Ingestion in progress":
      return 7;
    case "Analyzed":
      return 5;
    case "Uploading":
      return 6;
    default:
      return 6;
  }
};

export const getBidFileStatusCode = (status: string) => {
  switch (status) {
    case "Cancelled":
      return 1;
    case "Uploaded":
      return 2;
    case "Failed":
      return 3;
    case "Uploading":
      return 4;
    case "Processed":
      return 5;
    case "Processing":
      return 5;
    default:
      return 2;
  }
};

export const getFilePath = (folderPath: any, name?: string) => {
  return folderPath ? `${folderPath}/${name}` : name;
};

export const getFolderPath = (folderPath: any) => {
  return folderPath || "/";
};

export const getfolderPath = (
  folderPath: any,
  isFilePath: boolean,
  name?: string
) => {
  if (isFilePath) {
    return folderPath ? `${folderPath}/${name}` : name;
  }
  return folderPath || "/";
};

export const getCurrentQuarter = (showQuarter?: boolean) => {
  const date = new Date();
  return showQuarter ? `Q${Math.floor(date.getMonth() / 3 + 1)}` : "";
};

// Function to download a file with fileUrl
export const downloadFile = async (fileUrl: string, fileName: string) => {
  try {
    // Create a download link with appropriate filename
    const response = await fetch(fileUrl);
    // Check if the response is OK
    if (!response.ok) {
      throw new Error("Error fetching file");
    }
    // Convert the response into a blob (binary large object)
    const blob = await response.blob();
    const link = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", fileName); // This will force the download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    toast.error("Error downloading file");
  }
};

export const ecryptDataFunction = (password: any) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(password),
    process.env.REACT_APP_EN_KEY
  ).toString();
};

export const decryptDataFunction = (data: string) => {
  if (data) {
    const bytes = CryptoJS.AES.decrypt(data, process.env.REACT_APP_EN_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  }
  return "";
};

export const addIsChecked = (list: any) => {
  return list.map((item: any) => {
    // iteam?.child[0]?.parent_id
    const newItem = {
      ...item,
      id: item?.parent_id === 0 ? item?.child?.[0]?.parent_id : item?.id,
      isChecked: false,
    }; // Create a new object with isChecked property
    if (newItem?.child && newItem?.child?.length > 0) {
      newItem.child = addIsChecked(newItem.child); // Recursively add isChecked property to child items
    }
    return newItem;
  });
};

export const updateIsCheckedBySlug = (data: any, slug: any) => {
  return data.map((item: any) => {
    if (slug.includes(item.slug)) {
      item.isChecked = true;
      if (item.child && item.child.length > 0) {
        item.child = updateIsCheckedById(item.child, item?.id, item?.id, true);
      }
    }
    return item;
  });
};

export const updateIsCheckedById = (
  list: any,
  id: number,
  parentId: number,
  status: boolean
) => {
  return list.map((item: any) => {
    if (item.id === id || item.parent_id === parentId) {
      return {
        ...item,
        isChecked: status,
        child: item.child
          ? updateIsCheckedById(item.child, id, item?.id, status)
          : [],
      };
    } else if (item.child && item.child.length > 0) {
      return {
        ...item,
        child: updateIsCheckedById(item.child, id, parentId, status),
      };
    }
    return item;
  });
};

export const updateIsCheckedParentById = (
  list: any,
  id: number,
  status: boolean
) => {
  const updateParentChecked = (item: any) => {
    if (!item?.parent_id) return;
    const parent = list?.find(
      (parentItem: any) => parentItem?.id === item?.parent_id
    );
    if (!parent) return;
    parent.isChecked = status;
    updateParentChecked(parent);
  };

  const updateChecked = (item: any) => {
    if (item.id === id) {
      item.isChecked = status;
      updateParentChecked(item);
    }
    if (item?.child) {
      item?.child?.forEach((child: any) => updateChecked(child));
    }
  };

  list?.forEach((item: any) => updateChecked(item));
  return list;
};

export const updateIsCheckedParentByIdT = (list: any) => {
  const updateChecked = (item: any) => {
    if (item?.child && item?.child?.length > 0) {
      item.isChecked = item?.child?.every((child: any) => child?.isChecked);
      item?.child?.forEach(updateChecked);
    }
  };

  list?.forEach((item: any) => updateChecked(item));

  const parentIds = new Set(
    list
      .filter((item: any) => item?.parent_id !== 0)
      .map((item: any) => item?.parent_id)
  );
  parentIds?.forEach((parentId) => {
    const parent = list?.find((item: any) => item?.id === parentId);
    if (parent) {
      parent.isChecked = list
        ?.filter((item: any) => item?.parent_id === parentId)
        ?.every((item: any) => item?.isChecked);
    }
  });

  // Update top-level parent elements
  const topLevelParents = list?.filter((item: any) => item?.parent_id === 0);
  topLevelParents?.forEach((parent: any) => {
    parent.isChecked = parent?.child?.every((child: any) => child?.isChecked);
  });

  return list;
};

export const getCheckedIds = (list: any) => {
  let checkedIds: any = [];
  list.forEach((item: any) => {
    if (item.isChecked) {
      checkedIds.push(item.id);
    }
    if (item.child && item.child.length > 0) {
      checkedIds = checkedIds.concat(getCheckedIds(item.child));
    }
  });
  return checkedIds;
};
export const handleProfileImage = (
  e: React.SyntheticEvent<HTMLImageElement, Event>
) => {
  const target = e.target as HTMLImageElement;
  target.src = require("assets/images/defaultError.png");
};

export const getImageUrl = (imageName: string) => {
  return imageURL + imageName + "?" + imageToken;
};
export const isPermissionChecked = (data: any, identifier: any) => {
  const userdata: any = getLocalStorage("persist:root");
  const updatedState =
    userdata && decryptDataFunction(JSON.parse(userdata?.loginDetails))?.data;

  if (
    isCompanyEnable(updatedState, [companySlug.adm]) &&
    identifier === routeKey?.CarrierShift
  ) {
    return false;
  }

  for (let item of data) {
    if (item?.slug === identifier) {
      return item;
    }
    if (item?.child?.length > 0) {
      let childChecked: any = isPermissionChecked(item?.child, identifier);
      if (childChecked) {
        return childChecked;
      }
    }
  }
  return false;
};

export const isPermissionCheckedChild = (
  data: any,
  slug: any,
  identifier: any
) => {
  const userdata: any = getLocalStorage("persist:root");
  const updatedState =
    userdata && decryptDataFunction(JSON.parse(userdata?.loginDetails))?.data;

  if (
    isCompanyEnable(updatedState, [companySlug.adm]) &&
    identifier === routeKey?.CarrierShift
  ) {
    return false;
  }

  for (let item of data) {
    if (item?.slug === slug) {
      return (
        item?.child?.filter((i: any) => i?.slug !== identifier && i?.isChecked)
          .length > 0
      );
    }
    if (item?.child?.length > 0) {
      let childChecked: any = isPermissionCheckedChild(
        item?.child,
        slug,
        identifier
      );
      if (childChecked) {
        return childChecked;
      }
    }
  }
  return false;
};
export const isApplicationTypeChecked = (data: any, identifier: any) => {
  for (let item of normalizedList(data)) {
    if (item?.slug === identifier) {
      return isAnyChildChecked(item.child);
    }
    if (item?.child?.length > 0) {
      let childChecked: any = isApplicationTypeChecked(item?.child, identifier);
      if (childChecked) {
        return true;
      }
    }
  }
  return false;
};

const isAnyChildChecked = (data: any) => {
  for (let item of data) {
    if (item?.isChecked) {
      return true;
    }
    if (item?.child?.length > 0) {
      if (isAnyChildChecked(item?.child)) {
        return true;
      }
    }
  }
  return false;
};

export const filterLeverOption = (data: any) => {
  const byLeverOption = [{ value: "", label: "By Lever" }];
  if (isPermissionChecked(data, routeKey?.ModalShift)?.isChecked) {
    byLeverOption.push({ value: "modal_shift", label: "Modal Shift" });
  }
  if (isPermissionChecked(data, routeKey?.AlternativeFuel)?.isChecked) {
    byLeverOption.push({
      value: "alternative_fuel",
      label: "Alternative Fuel",
    });
  }
  if (isPermissionChecked(data, routeKey?.CarrierShift)?.isChecked) {
    byLeverOption.push({ value: "carrier_shift", label: "Carrier Shift" });
  }
  return byLeverOption;
};

export const getAdminUrl = (data: any) => {
  if (isPermissionChecked(data, routeKey?.UserManagement)?.isChecked) {
    return "/user-management";
  } else if (isPermissionChecked(data, routeKey?.DataManagement)?.isChecked) {
    return "/data-management";
  } else {
    return "/user-management";
  }
};

export const getProductTypeImpactFraction = (
  data: any,
  fuelStopList: any,
  fuelStopDto: any
) => {
  let sum = 0;
  let count = 0;

  if (data?.is_ev) {
    sum = sum + fuelStopDto?.ev_fuel_stop?.impact_fraction;
    count = count + 1;
  }
  if (data?.fuel_type !== "") {
    const selectedEV = fuelStopList?.filter((item: any) =>
      data?.fuel_type?.split(",")?.includes(item.code)
    );
    sum =
      sum +
      selectedEV?.reduce((acc: any, obj: any) => {
        return acc + obj.impact_fraction;
      }, 0);
    count = count + selectedEV?.length;
  }
  return sum / count;
};

export const getFuleType = (
  fuelName: string,
  productCode: string,
  projectDetail: any,
  alternativeFuelCount: number
) => {
  if (projectDetail?.is_ev && !projectDetail?.is_alternative)
    return fuelName || "N/A";
  if (projectDetail?.is_alternative) return fuelName ?? productCode;
  if (alternativeFuelCount === 0) return "N/A";
  return fuelName;
};

export const getAddressName = (
  center: any,
  callback: (address: string | null) => void
) => {
  const geocoder = new google.maps.Geocoder();

  const latLng = new window.google.maps.LatLng(
    center?.latitude,
    center?.longitude
  );
  geocoder.geocode({ location: latLng }, (results, status) => {
    if (status === "OK" && results && results.length > 0) {
      callback(results[0].formatted_address);
    } else {
      callback(null);
    }
  });
};

export const getActiveClass = (
  routeList: any,
  location: any,
  isBar: boolean
) => {
  let length = routeList.filter((e: any) =>
    location.pathname.includes(e)
  ).length;
  if (length > 0) {
    return isBar ? "activebar" : "active";
  } else {
    return "";
  }
};

export const getPercentageData = (total: number, fileProcessCount: number) => {
  if (total > 0) {
    return (fileProcessCount / total) * 100;
  } else {
    return 0;
  }
};

export const getSearchodpairUrl = (page: string = "") => {
  if (page === "optimus") {
    return `${nodeUrl}optimus-origin-destination`;
  } else if (page === "problemLanes") {
    return `${nodeUrl}search-origin-dest-problem-lanes`;
  } else if (page === "LaneEmissionsComparison") {
    return `${nodeUrl}get-lane-emission-lanes-origin-dest`;
  } else if (page === "laneReport") {
    return `${nodeUrl}lane-search-report-management`;
  } else if (page === "intermodalReport") {
    return `${nodeUrl}search-origin-dest`;
  } else {
    return `${nodeUrl}carrier-search-lane-planing`;
  }
};

export const handleDownloadCsvFile = (props: any) => {
  const {
    rowKey = null,
    nameKey = "name",
    regionalLevel,
    year,
    quarterDto,
    list,
    fileName,
    tableLabel,
    pId,
    weekId,
    timePeriodList,
    loginDetails,
    regionOption,
    divisionOptions,
    divisionLevel,
    defaultUnit,
    t,
  } = props;

  let data: any[] = [];
  const quarterOption = getQuarterOptions(year);
  const quarter =
    quarterOption?.filter((el: any) => el.value === quarterDto)?.[0]?.label ||
    "";
  const selectedRegion =
    regionOption?.filter(
      (el: any) => el.value === regionalLevel?.toString()
    )?.[0]?.label || "";

  data.push(["Selected filters"]);

  if (
    isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo])
  ) {
    const selectedDivision =
      divisionOptions?.filter(
        (el: any) => el.value === divisionLevel?.toString()
      )?.[0]?.label || "All Divisions";
    data.push(["Division", selectedDivision]);
  }

  if (selectedRegion) {
    data.push(["Region", selectedRegion]);
  }
  if (
    isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.bmb])
  ) {
    data.push([
      "Period",
      getTimeName(pId, weekId, timePeriodList, loginDetails),
    ]);
  }
  data.push(["Year", year]);
  if (
    !isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.bmb])
  ) {
    data.push(["Quarter", quarter]);
  }
  data.push([""]);

  data.push([
    tableLabel,
    t("emissionsIntensity", { unit: formatUnit(defaultUnit) }),
    "Total Shipments",
    "Total Emissions \n (tCO2e)",
    ...(isCompanyEnable(loginDetails?.data, [
      companySlug?.pep,
      companySlug?.bmb,
    ])
      ? []
      : ["Quarter"]),
    "Year",
  ]);

  // Add data rows
  list?.data?.forEach((row: any) => {
    const rowData = [
      rowKey ? `${row?.[rowKey]} (${row?.[nameKey]})` : row[nameKey],
      formatNumber(true, row?.intensity?.value, 1),
      formatNumber(true, row?.shipments, 0),
      formatNumber(true, row?.cost?.value, 2),
      ...(isCompanyEnable(loginDetails?.data, [
        companySlug?.pep,
        companySlug?.bmb,
      ])
        ? []
        : [quarter]),
      year,
    ];
    data.push(rowData);
  });

  const csvData = data
    .map((row: any) => row.map((value: any) => `"${value}"`).join(","))
    .join("\n");
  downloadCSV(csvData, `${fileName}-${quarter}-${year}.csv`);
};

export const getCurrentMonths = (year: any) => {
  const date = new Date();
  return year?.value === date.getFullYear()
    ? monthOption.filter((res: any) => res?.value <= date.getMonth())
    : monthOption;
};

export const checkedNullValue = (value: any, defaultValue: any = 0) => {
  return value === null || value === undefined || isNaN(value)
    ? defaultValue
    : value;
};

export const getQuarterName = (
  loginDetails: any,
  data: string | number,
  year: string | number
): string => {
  if (
    isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.bmb])
  ) {
    return "";
  }

  const latestYear = new Date().getFullYear();
  let quarterName: string | number = Number.parseInt(data?.toString(), 10);

  if (!isNaN(quarterName)) {
    // Convert quarter number to its name
    if (quarterName === 0) {
      quarterName = "All Quarters of";
    } else if (quarterName === 1) {
      quarterName = "Q1";
    } else if (quarterName === 2) {
      quarterName = "Q2";
    } else if (quarterName === 3) {
      quarterName = "Q3";
    } else if (quarterName === 4) {
      quarterName = "Q4";
    }
  } else if (latestYear === Number.parseInt(year?.toString(), 10)) {
    // Handle cases where quarter is not provided
    quarterName = "";
  } else {
    quarterName = "All Quarters of";
  }

  return quarterName as string;
};

export const getRegionName = (
  regions: any,
  regionalLevel: string | null,
  isList = false,
  isBenchmark = false
) => {
  if (regionalLevel && regions) {
    if (isList) {
      return `${regions} Region`;
    } else if (isBenchmark) {
      return `${regions?.data?.filter((e: any) => {
        return e.id === Number.parseInt(regionalLevel);
      })[0]?.region_name
        } Region`;
    } else {
      return `${regions?.data?.regions?.filter((e: any) => {
        return e.id === Number.parseInt(regionalLevel);
      })[0]?.name
        } Region`;
    }
  } else {
    return "All Regions";
  }
};

export const getDivisionName = (divisionId: any, divisionList: any) => {
  return divisionId !== ""
    ? `${divisionList?.data?.filter((e: any) => {
      return Number.parseInt(e.id) === Number.parseInt(divisionId);
    })[0]?.name || ""
    } Division`
    : `All Divisions`;
};

export const getStateName = (stateAbbr: string) => {
  return stateMap[stateAbbr] || stateAbbr;
};

export const getTimeName = (
  pId: number | string,
  weekId: number | string,
  timeList: any,
  loginDetails?: any
): string => {
  if (!pId || Number(pId) === 0) return "All Periods";

  const period = timeList?.data?.find(
    (period: any) => period.id === Number(pId)
  );
  if (!period) return "All Periods";

  if (weekId && Number(weekId) > 0) {
    const foundMapping = period.timeMappings.find(
      (mapping: any) => mapping.id === Number(weekId)
    );
    if (foundMapping) {
      return `${period.name}${foundMapping.name}`;
    }
  }

  if (isCompanyEnable(loginDetails?.data, [companySlug?.bmb])) {
    return period.name;
  }

  return `${period.name}, All Weeks`;
};

export const getTimeIds = (
  pId: string | number,
  weekId: string | number,
  timeList: any
) => {
  if (Number(pId) === 0) {
    return 0;
  }

  if (Number(weekId) === 0) {
    const period = timeList?.data?.find(
      (period: any) => period.id === Number(pId)
    );
    if (period) {
      return period.timeMappings.map((mapping: any) => mapping.id); // Return all week IDs
    }
  }

  if (Number(weekId) > 0) {
    return [weekId];
  }

  return 0;
};

export const getGraphTitle = ({
  year,
  regionId,
  division,
  quarter,
  pId,
  weekId,
  regionList,
  divisionList,
  isList = false,
  timeList,
  loginDetails,
}: any) => {
  const quarterName = getQuarterName(loginDetails, quarter, year);
  let result = "";
  let isComma = false;

  if (
    isCompanyEnable(loginDetails?.data, [
      companySlug?.pep,
      companySlug?.demo,
      companySlug?.bmb,
    ]) &&
    division &&
    divisionList
  ) {
    result = result.concat("", getDivisionName(division, divisionList));
    isComma = true;
  }

  if (regionId !== null) {
    result = result.concat(
      `${isComma ? ", " : ""}`,
      getRegionName(regionList, regionId, isList)
    );
    isComma = true;
  }

  if (
    isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.bmb]) &&
    timeList &&
    pId !== null
  ) {
    result = result.concat(
      `${isComma ? ", " : ""}`,
      getTimeName(pId, weekId, timeList, loginDetails)
    );
    isComma = true;
  }

  result = result.concat(
    `${isComma ? ", " : ""}`,
    `${quarterName} ${year || ""}`
  );
  return result;
};

export const getTimeCheck = (
  year: string | number,
  quarter: string | number,
  period: string | number
) => {
  if (period) {
    return { time_id: period };
  } else {
    return {
      quarter: quarter,
      year: year,
    };
  }
};

export const getBoolean = (isBoolean: boolean) => (isBoolean ? 1 : 0);

export const isOldSafari = (versionToMatch: number = 16) => {
  const ua = navigator.userAgent;
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  const versionMatch = /Version\/(\d+)/.exec(ua || "");
  const version = versionMatch ? parseInt(versionMatch[1], 10) : 0;

  return isSafari && version < versionToMatch; // Adjust version number for older Safari
};

export const createPngTileLayer = () => {
  return new google.maps.ImageMapType({
    getTileUrl: function (coord, zoom) {
      return `https://mt1.google.com/vt/lyrs=m&x=${coord.x}&y=${coord.y}&z=${zoom}&format=png`;
    },
    tileSize: new google.maps.Size(256, 256),
    name: "Custom Tiles",
    maxZoom: 20,
  });
};

export const getPercentage = (a: number = 0, b: number = 0) => {
  return a ? Math.round(((a - b) * 100) / (b || 1)) : 0;
};

export const getLabel = (key: any, defaultValue: string) => {
  return key?.value === 0 || key?.value === ""
    ? `All ${defaultValue}s`
    : `${key?.label ?? ""} ${defaultValue}`;
};

export const getStartDate = (year: any, month: any = 1) => {
  if (month === 0) {
    month = 1;
  }
  return new Date(Date.UTC(year, month - 1, 1));
};

export const getEndDate = (year: any, month: any = 12) => {
  if (month === 0) {
    month = 12;
  }
  return new Date(Date.UTC(year, month, 0));
};

export const dateToUTC = (date: any) => {
  return moment(date).utc().format("YYYY-MM-DD");
};

export const dateFormatValue = (
  startDate: any,
  endDate: any,
  format = "DD MMMM YYYY"
) => {
  return (
    moment(startDate).format(format) + " - " + moment(endDate).format(format)
  );
};

export const getFuelReportPage = (slug: string) => {
  return Object.keys(reportScope1Slug).find(
    (key: any) => reportScope1Slug[key] === slug
  );
};

export const exportChart = (
  chartReference: any,
  {
    mainTitle,
    subTitle,
    unit,
  }: { mainTitle: string; subTitle: string; unit: string }
) => {
  if (chartReference.current?.chart) {
    chartReference.current.chart.exportChartLocal(
      {
        type: "image/png",
        filename: `${subTitle.replace(/\s+/g, "_")}`,
      },
      {
        title: {
          useHTML: true,
          text: `<p>${mainTitle} <br /> ${subTitle} <span>${unit}</span></p>`,
          align: "left",
          verticalAlign: "top",
          y: 10,
          style: {
            fontSize: "12px",
            whiteSpace: "nowrap",
          },
        },
      }
    );
  }
};

export const isValidJSON = (text: any) => {
  try {
    JSON.parse(text);
    return true;
  } catch (e) {
    return false;
  }
};

export const getYearDateRange = (year: number | string) => {
  const currentYear = moment().year();

  const startDate = moment(`${Number(year)}-01-01`).format("YYYY-MM-DD");
  const endDate =
    Number(year) === currentYear
      ? moment().format("YYYY-MM-DD")
      : moment(`${Number(year)}-12-31`).format("YYYY-MM-DD");

  return { startDate, endDate };
};

export const postRequest = async (apiUrl: string, userData: any) => {
  try {
    const response = await axios.post(`${nodeUrl}${apiUrl}`, userData);
    return response?.data;
  } catch (error: any) {
    throw error;
  }
};

export const toStringSafe = (v: any) => (v == null ? "" : v.toString());

export const getBaseLine = (laneSortestPathData: any) =>
  laneSortestPathData?.data?.baseLine
    ? {
      ...laneSortestPathData.data.baseLine,
      key: "alternative_fuel",
      isBaseLine: true,
    }
    : null;

export const buildIntermodal = (laneSortestPathData: any) => {
  const data = laneSortestPathData?.data;
  if (!data?.laneIntermodalCordinateData) return null;
  const inter = data.laneIntermodalCordinateData;
  return {
    ...inter,
    key: "modal_shift",
    cost: null,
    emission: null,
    k_count: 1,
    fuel_stop: data.baseLine?.fuel_stop,
    distance: (inter?.rail_distance || 0) + (inter?.road_distance || 0),
    time: (inter?.rail_time || 0) + (inter?.road_time || 0),
    laneIntermodalDto: data,
    recommendedKLaneFuelStop: data.baseLine?.recommendedKLaneFuelStop,
    unique_fuel_stops: data.baseLine?.unique_fuel_stops,
  };
};

export const buildHighway = (laneSortestPathData: any) =>
  laneSortestPathData?.data?.sortestPaths
    ?.filter((item: any) => item?.recommendedKLaneFuelStop?.length > 0)
    ?.map((item: any) => ({ ...item, key: "alternative_fuel" })) ?? [];

export const buildCarrierShift = (laneSortestPathData: any) => {
  const carriers = laneSortestPathData?.data?.laneCarriers;
  if (!carriers?.length) return null;
  return {
    ...laneSortestPathData.data.baseLine,
    fuel_stop: {},
    key: "carrier_shift",
    k_count: 1,
    cost: null,
    emission: null,
    carriers,
  };
};

export const encryptFuelType = (selectedFilters: any) => {
  let result = ecryptDataFunction(selectedFilters)
    .split("+")
    .join("-") // replace + with -
    .split("/")
    .join("_"); // replace / with _

  while (result.endsWith("=")) {
    result = result.slice(0, -1);
  }
  return result;
};
export const getSelectedFilterList = (filter: any) => {
  const selectedFilters = Object.entries(filter)
    .filter(([_, value]) => value === 1) // Keep only keys with value 1
    .map(([key]) => fuelTypeKeyValue[key]);

  return encryptFuelType(selectedFilters);
};

export const checKEmptyValue = (value: any) => value ?? "N/A";

export const countryListDto = (list: any) => [
  { label: "All Countries", value: "" },
  ...getDropDownOptions(list, "country", "country_code", "", "", false),
];

export const priorityColors: Record<Priority, string> = {
  low: "#019D52",
  medium: "#929597",
  high: "#D8856B",
};

