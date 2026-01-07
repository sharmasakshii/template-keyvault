import {
  ContainerSASPermissions,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import HttpStatusMessage from "../constant/responseConstant";
import { MyUserRequest, PayloadFnProps } from "../interfaces/commonInterface";
import jwtMiddleware from "../middleware";
import { generateResponse } from "./response";
const sequelize = require("sequelize");
const Op = sequelize.Op;
const Validator = require("validatorjs");
import bcrypt = require("bcrypt");
import { NextFunction } from "express";
import { Literal } from "sequelize/types/utils";
import { allPeriods, allQuaters, comapnyDbAlias, convertToMillion, monthNames } from "../constant";
import moment = require("moment");
import { checkNUllValue, constructLatLngStringCom, getConfigValue, getContributorDetractorGraphColor, isCompanyEnable } from "../utils";
import { Sequelize } from "sequelize";
import { countryConstant } from "../constant/moduleConstant";
const constants: any = {
  accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME ?? "",
  accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY ?? "",
};
const crypto = require("crypto");
import axios from "axios";


export async function getDateDiffrenceInDays(startDate: any, endDate: any) {
  if (startDate && endDate) {
    //define two date object variables with dates inside it
    let date1 = new Date(startDate);
    let date2 = new Date(endDate);
    //calculate time difference
    let time_difference = date2.getTime() - date1.getTime();
    //calculate days difference by dividing total milliseconds in a day
    return time_difference / (1000 * 60 * 60 * 24);
  }
  return 0;
}

/**
 * @description Function to calculate standard deviation
 * @param {Object} notificationInfo - Object containing carrier intensity or emission
 * @returns {data} data with standard deviationand mean
 */

export const whereClauseFn = async (prop: any, where: any = {}) => {
  where[Op.and] = [];
  prop?.forEach((cond: any) => {
    const keys = Object.keys(cond);
    if (cond[keys[0]]) {
      where[Op.and].push({ [keys[0]]: cond[keys[0]] });
    }
  });
  return where;
};

export const getConfigConstants = async (request: any) => {
  try {
    const data = await request.ConfigConstants.findAll({
      attributes: ["config_key", "config_value"],
    });
    return data
  } catch (error: any) {
    throw new Error(error)
  }
};

export const roundToDecimal = (number: number) => {
  return parseFloat((Math.round(number * 10) / 10).toFixed(1));
};

export const getPropertyValue = (
  intensity: any,
  avg: any,
  contributorColor: any,
  detractorColor: any
) => {
  return intensity < avg
    ? { value: intensity, color: contributorColor }
    : { value: intensity, color: detractorColor };
};

export const routePayloadFn: any = (prop: PayloadFnProps) => {
  const { role, Controller, controllerInstance, extraParameter, without_middleware = false, route } = prop;
  return [jwtMiddleware(role, without_middleware, route),
  async (req: MyUserRequest, res: any, next: NextFunction) => {
    try {
      req.extraParameter = extraParameter
      const controller = new Controller(req.connectionData);

      return await controller?.[controllerInstance](req, res);
    } catch (error) {
      console.error("Error while fetching role details:", error);
      return generateResponse(
        res,
        500,
        false,
        HttpStatusMessage.INTERNAL_SERVER_ERROR
      );
    }
  },
  ];
};

export const closestValueToAverage = (value: number, array: any[]) => {
  let result: any = [];
  array.some(function (a) {
    if (a > value) {
      return result.push(a);
    }
    result = [a];
    return a === value;
  });
  return result;
};

export const updateColors = (
  data: any[],
  array: number[],
  average: number,
  key: string,
  mediumColor: string
) => {
  let closestValues = closestValueToAverage(average, array);

  closestValues.forEach((prop: any) => {
    data.forEach((x: any) => {
      if (x[key].value == prop) {
        x[key].color = mediumColor || x[key].color;
      }
    });
  });
};

export const calculateTotals = (data: any[]) => {
  const totalIntensity = [];
  const totalEmission = [];
  for (const property of data) {
    totalIntensity.push(property.intensity);
    totalEmission.push(property.emission / convertToMillion);
  }
  return { totalIntensity, totalEmission };
};

export const calculateAverage = (values: number[]) => {
  return (values.length > 0) ? values.reduce((a, b) => a + b, 0) / values.length : 0;
};

export const paginate = (
  query: any,
  { page, pageSize }: { page: any; pageSize: number }
) => {
  const offset = page * pageSize;
  const limit = pageSize;
  return {
    ...query,
    offset,
    limit,
  };
};

export const formatNumber = (
  isDecimalNumber: boolean,
  number: any,
  place?: number
) => {
  let numberData: any = 0;
  let decimalPoint = Math.pow(10, place ?? 1);
  if (number) {
    if (!isDecimalNumber) {
      numberData = Number.parseInt(number ?? 0);
    } else {
      numberData =
        Math.floor(Math.round(Number.parseFloat(number ?? 0) * decimalPoint)) /
        decimalPoint;
    }
  }
  return numberData;
};

export const validator = async (data: any, rules: any) => {
  for (const field in rules) {
    if (rules[field].includes("nullable")) {
      // Remove 'nullable' from the rule
      rules[field] = rules[field].replace("nullable|", "").replace("|nullable", "").replace("nullable", "");
      // Treat empty strings as null to bypass validation
      if (data[field] === null || data[field] === undefined || data[field] === "") {
        delete data[field]; // Remove the field from data to bypass validation
      }
    }
  }
  let validator = new Validator(data, rules);

  return {
    status: validator.fails(),
    messages: validator.errors.all(),
  };
};

export const encryptPassword = async (password: any) => {
  return bcrypt
    .hash(password, 12)
    .then((hash: any) => {
      return hash;
    })
    .catch((err: { message: any }) => console.error(err.message));
};
export async function fetchIndustryData(request: any) {
  return await request["models"].BenchmarkDates.findAll({
    attributes: ["average_intensity"],
  });
}

export function toCamelCase(str: any) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|[\s-_])/g, (match: any, index: any) => {
    if (/\s|_|-/.test(match)) return "";
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

// Utility function to create a lookup map from configData
export function createConfigLookup(configData: any[]) {
  return configData.reduce((lookup: Record<string, any>, item: any) => {
    const key = item?.dataValues?.config_key;
    const value = item?.config_value;
    if (key) lookup[key] = value;
    return lookup;
  }, {});
}

export const getSasToken = async () => {
  const sharedKeyCredential = new StorageSharedKeyCredential(
    constants.accountName,
    constants.accountKey
  );
  const currentDate = new Date(); // Current date and time
  const updatedDate = new Date(currentDate); // Clone the date object to avoid mutating the original
  updatedDate.setMinutes(currentDate.getMinutes() - 5); // Subtract 5 minutes
  const sasOptions = {
    containerName: "appdata",
    permissions: ContainerSASPermissions.parse("rlcw"),
    startsOn: updatedDate,
    expiresOn: new Date(new Date().valueOf() + 3600 * 1000),
  };
  const sasToken = generateBlobSASQueryParameters(
    sasOptions,
    sharedKeyCredential
  ).toString();
  return sasToken;
};
export const getImageUrl = async (imageName: string, token: string) => {
  let url = `https://${constants.accountName}.blob.core.windows.net/appdata/assets${imageName}?${token}`;
  return url;
};

export async function getLaneIntensity(request: any, where: any) {
  // Query the database to get the average intensity and average emissions data.
  let laneIntensityObj = await request.EmissionLanes.findAll(
    {
      attributes: [
        [sequelize.literal(' (sum(emission) / sum(total_ton_miles)) '), 'average'],
      ],
      where: where,
    }
  );
  return laneIntensityObj
}

export async function callStoredProcedure(params: any, connection: any, query: any) {
  try {
    return await connection.query(query, {
      replacements: params,
      type: connection.QueryTypes.SELECT,
    });

  } catch (error: any) {
    console.log('error ', error);
    throw new Error(error)
  }
}

export const emailVerification = async (dbConnection: any, email: any, user_id: any) => {
  try {
    const checkEmail = await dbConnection.models.User.findOne({
      attributes: ['id'],
      where: {
        [Op.and]: [
          { id: { [Op.notIn]: [user_id] } },
          Sequelize.where(
            decryptByPassPhraseColumn(process.env.EMAIL_PHONE_PASSPHRASE, 'email'),
            email
          ),
          { is_deleted: 0 },
        ],
      },
    });
    if (checkEmail) {
      return false;
    }
    return true;
  } catch (error: any) {
    console.log(error, "err");
    throw new Error(error)
  }
};

export const validatePassword = (password: any) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\-]).{8,}$/;
  return passwordRegex.test(password);
}


export const updateUserTokenOnRoleUpdate = async (prop: any) => {
  try {
    const { userId, status } = prop

    const mainSequelizeInstances = prop.main

    await mainSequelizeInstances.models.UserToken.update(
      { logout_reason: status, is_logout: 1 }, {
      where: {
        user_id: {
          [Op.in]: userId,
        },
      },
    });
  }
  catch (error: any) {
    console.log(error, "err")
    throw new Error(error)
  }
}

export const getRolePermissions = async (databaseReq: any, role_id: number) => {
  try {
    let getAllModules = await databaseReq.Module.findAll({
      where: { is_deleted: 0 },
    });
    let accessData = await databaseReq?.RoleAccess.findAll({
      where: { role_id: role_id, is_deleted: 0 },
    });
    const nestedStructure = createNestedStructureWithAccess(
      getAllModules,
      accessData
    );
    return nestedStructure;
  } catch (error: any) {
    console.log("error", error);
    throw new Error(error)
  }
};


function createNestedStructureWithAccess(modules: any, accessData: any) {
  const result: any = [];

  // Filter modules based on accessData
  const accessibleModuleIds = new Set(
    accessData.map((access: any) => access.module_id)
  );
  // Create nested structure
  modules.forEach((module: any) => {
    if (module.parent_id === 0) {
      let obj: any = {
        id: module.id,
        title: module.title,
        parent_id: module.parent_id,
        slug: module.slug,
        isChecked: false,
      };
      let child = createChildItemsWithAccess(
        module.id,
        modules,
        accessibleModuleIds,
        accessData
      );
      if (accessibleModuleIds.has(module.id)) {
        obj["isChecked"] = true;
      }
      if (child.length > 0) {
        obj["child"] = child;
      } else {
        obj["child"] = [];
      }

      result.push(obj);
    }
  });

  return result;
}

function createChildItemsWithAccess(
  parentId: any,
  modules: any,
  accessibleModuleIds: any,
  accessData: any
) {
  const childItems: any = [];

  modules.forEach((module: any) => {
    if (module.parent_id === parentId) {
      const childItem: any = {
        id: module.id,
        title: module.title,
        parent_id: module.parent_id,
        slug: module.slug,
        isChecked: false,
      };
      if (accessibleModuleIds.has(module.id)) {
        childItem["isChecked"] = true;
      }
      const childModules = createChildItemsWithAccess(
        module.id,
        modules,
        accessibleModuleIds,
        accessData
      );
      if (childModules.length > 0) {
        childItem.child = childModules;
      } else {
        childItem.child = [];
      }
      childItems.push(childItem);
    }
  });

  return childItems;
}

export const isPermissionChecked = (data: any, identifier: any) => {
  for (let item of data) {
    if (item.slug === identifier) {
      return item;
    }
    if (item.child.length > 0) {
      let childChecked: any = isPermissionChecked(item.child, identifier);
      if (childChecked) {
        return childChecked;
      }
    }
  }
  return false;
};

export function encryptByPassPhrase(passphrase: string | undefined, value: string): Literal {
  return sequelize.literal(
    `EncryptByPassPhrase('${passphrase}', CONVERT(NVARCHAR(MAX), '${value}'))`
  );
}

/**
 * Decrypt a value using a passphrase
 * @param passphrase - The passphrase used for decryption
 * @param column - The encrypted column to decrypt
 * @returns - The decrypted value as a Sequelize literal
 */
export function decryptByPassPhraseColumn(passphrase: string | undefined, column: string): Literal {
  return sequelize.literal(
    `CONVERT(NVARCHAR(MAX), DecryptByPassPhrase('${passphrase}', ${column}))`
  );
}


export function buildWhereCondition(filterObject: any, excludeKeys: string[] = []): any {
  const whereCondition: any = { [Op.and]: [] };

  for (const key in filterObject) {
    if (filterObject.hasOwnProperty(key) && !excludeKeys.includes(key)) {
      // You can customize condition handling here, for example, to support 'gte', 'lte', etc.
      if (filterObject[key]) {
        whereCondition[Op.and].push({
          [key]: filterObject[key],
        });
      }
    }
  }

  return whereCondition;
}
export function formattedMonths(months: []) {
  return months.map((m: any) => ({
    id: m.month,
    name: monthNames[m.month - 1], // Convert numeric month to name
  }));
}

/**
 * Returns the value if it's truthy; otherwise, returns 0.
 *
 * @param value - The value to check.
 * @returns The value if truthy, otherwise 0.
 */
export function getValueOrDefault(value: any): number {
  return value || 0;
}


export function getWeekDateRange(year: any, week: any) {
  // Calculate the start and end of the week
  const startOfWeek = moment().year(year).week(week).startOf('week');
  const endOfWeek = moment(startOfWeek).endOf('week');

  // Calculate the year's boundaries
  const yearStart = moment().year(year).startOf('year'); // January 1st
  const yearEnd = moment().year(year).endOf('year');     // December 31st

  if (endOfWeek.isAfter(yearEnd)) {
    // Week spans across the year's end
    return `${startOfWeek.format('DD MMM')} - ${yearEnd.format('DD MMM')}`;
  } else if (startOfWeek.isBefore(yearStart)) {
    // Week spans across the start of the year
    return `${yearStart.format('DD MMM')} - ${endOfWeek.format('DD MMM')}`;
  } else {
    // Week is fully within the same year
    return `${startOfWeek.format('DD MMM')} - ${endOfWeek.format('DD MMM')}`;
  }
}

export function getBase64Image(image: Buffer): string {
  return `data:image/png;base64,${image.toString("base64")}`;
}



export function buildWhereClauseSearch(type: string, keyword: string, source: string, dest: string, col_name: string) {
  const where: any = { [Op.and]: [] };
  const lowerType = type.toLowerCase();
  if (lowerType == "origin" && keyword && !dest && !source) {
    where[Op.and].push({ [col_name]: { [Op.like]: `${keyword}%` } });
  } else if (lowerType == "dest" && source && !keyword && !dest) {
    where[Op.and].push({ [col_name]: { [Op.like]: `${source}_%` } });
  } else if (lowerType == "dest" && source && keyword && !dest) {
    where[Op.and].push({ [col_name]: { [Op.like]: `${source}_%${keyword}%` } });
  } else if (lowerType == "origin" && !source && !keyword && dest) {
    where[Op.and].push({ [col_name]: { [Op.like]: `%_${dest}` } });
  } else if (lowerType == "origin" && !source && keyword && dest) {
    where[Op.and].push({ [col_name]: { [Op.like]: `%${keyword}%_${dest}` } });
  }
  return where;
}

export const targetValuesFn = async (request: any, where: any, requiredData: any, schema: string) => {
  try {
    let { year, toggel_data, tableName, columnName, dataBaseTable, authenticate } = requiredData;
    let minWhere: any = {};
    minWhere[Op.and] = [];
    let query = `year = (SELECT MIN(year)
  FROM ${schema}.${dataBaseTable} where 1=1`

    //added all conditions
    Object.entries(where)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .forEach(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number') {
          query += ` AND ${key} = '${value}'`;
          minWhere[Op.and].push({ [key]: value });
        }
      });

    query += ` )`;
    minWhere[Op.and].push(sequelize.literal(query));
    let minDate = await request[tableName].findOne({
      attributes: [
        [sequelize.literal("( SELECT MIN(year) )"), "year"],
        [sequelize.literal("( SELECT MIN(quarter) )"), "quarter"],
      ],
      where: minWhere,
      group: ["year", "quarter"],
      order: [sequelize.literal("year"), sequelize.literal("quarter")],
    });

    if (!minDate) {
      return [];
    }

    let stWhere: any = {};
    if (isCompanyEnable(authenticate?.company, [comapnyDbAlias.RBL])) {
      stWhere[Op.and] = [];
      stWhere[Op.and].push({ year: 2024 })
      stWhere[Op.and].push({ quarter: 4 })
    } else {
      stWhere[Op.and] = [];
      stWhere[Op.and].push(
        sequelize.where(sequelize.literal("year"), minDate?.dataValues?.year)
      );
      stWhere[Op.and].push(
        sequelize.where(sequelize.literal("quarter"), minDate?.dataValues?.quarter)
      );
    }

    for (const [key, value] of Object.entries(where)) {
      if (value) {
        stWhere[Op.and].push({ [key]: value });
      }
    }

    //attributes
    const emissionsCalculation = toggel_data === 1
      ? `( SELECT SUM(${columnName}) / NULLIF(SUM(total_ton_miles), 0) )`
      : `( SELECT SUM(${columnName}) / ${convertToMillion} )`;

    let startedYearEmission = await request[tableName].findOne({
      attributes: [[sequelize.literal(emissionsCalculation), "emissions"],
      [sequelize.literal("quarter"), "quarter"],
      [sequelize.literal("year"), "year"],],
      where: stWhere,
      group: [sequelize.literal("year"), sequelize.literal("quarter")],
      order: [sequelize.literal("year"), sequelize.literal("quarter")],
    });

    if (!startedYearEmission) {
      return [];
    }

    ///Getconstants
    let where1: any = {};
    where1[Op.or] = [];
    where1[Op.or].push(
      sequelize.where(
        sequelize.literal("config_key"),
        "EMISSION_REDUCTION_TARGET_1"
      )
    );
    where1[Op.or].push(
      sequelize.where(
        sequelize.literal("config_key"),
        "EMISSION_REDUCTION_TARGET_1_YEAR"
      )
    );


    let getConfigData = await request.ConfigConstants.findAll({
      attributes: ["config_key", "config_value"],
      where: where1,
    });

    let emissionReductionTYear = Math.abs(getConfigValue(getConfigData, "EMISSION_REDUCTION_TARGET_1_YEAR"));

    let emissionReductionT = Math.abs(getConfigValue(getConfigData, "EMISSION_REDUCTION_TARGET_1"));

    let baseYear = minDate?.dataValues?.year;
    let emission = startedYearEmission?.dataValues?.emissions;

    let emissionPercentConst = emissionReductionT / 100;

    let totalQuatersDiv = (emissionReductionTYear - baseYear + 1) * 4;
    let constEmission = (emission * emissionPercentConst) / totalQuatersDiv;
    let skipQuarters = (year - baseYear) * 4;
    let intialEmision = emission - constEmission * skipQuarters;
    let targetValue = [];
    for (let i = 1; i < 9; i++) {
      targetValue.push(intialEmision - constEmission * i);
    }

    return targetValue;
  } catch (error: any) {
    throw new Error(error)
  }
};

export const targetValuesPeriodWiseFn = async (
  request: any,
  where: any,
  requiredData: any,
  schema: string
) => {
  try {
    const {
      year,
      toggel_data,
      tableName,
      columnName,
      dataBaseTable
    } = requiredData;

    const minWhere: any = { [Op.and]: [] };
    let yearSubQuery = `(SELECT MIN(year) FROM ${schema}.${dataBaseTable} WHERE 1=1`;

    Object.entries(where)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .forEach(([key, value]) => {
        yearSubQuery += ` AND ${key} = '${value}'`;
        minWhere[Op.and].push({ [key]: value });
      });

    yearSubQuery += `)`;
    minWhere[Op.and].push(sequelize.literal(`[${tableName}].year = ${yearSubQuery}`));

    const minDate = await request[tableName].findAll({
      attributes: [
        [sequelize.fn('MIN', sequelize.col(`${tableName}.year`)), 'year'],
        [sequelize.literal(`MIN([${tableName}TimeMapping->TimePeriod].id)`), 'period_id']
      ],
      include: [
        {
          attributes: [],
          model: request.TimeMapping,
          as: `${tableName}TimeMapping`,
          required: true,
          include: [
            {
              attributes: [],
              model: request.TimePeriod,
              as: 'TimePeriod',
              required: true
            }
          ]
        }
      ],
      where: minWhere,
      subQuery: false,
      raw: true

    });

    if (minDate.length == 0) return [];

    const baseYear = minDate[0].year;
    const basePeriod = minDate[0].period_id;
    const emissionsWhere: any = {
      [Op.and]: [
        { year: baseYear },
        { [`$${tableName}TimeMapping.period_id$`]: basePeriod },
        ...Object.entries(where).map(([key, value]) => value && { [key]: value }).filter(Boolean)
      ]
    };

    const emissionsCalculation = toggel_data === 1
      ? sequelize.literal(`SUM(${columnName}) / NULLIF(SUM(total_ton_miles), 0)`)
      : sequelize.literal(`SUM(${columnName}) / ${convertToMillion}`);

    const startedYearEmission = await request[tableName].findAll({
      attributes: [
        [emissionsCalculation, 'emissions'],
        [sequelize.col(`${tableName}.year`), 'year'],
        [sequelize.col(`${tableName}TimeMapping->TimePeriod.id`), 'period_id']
      ],
      include: [
        {
          attributes: [],
          model: request.TimeMapping,
          as: `${tableName}TimeMapping`,
          required: true,
          include: [
            {
              attributes: [],
              model: request.TimePeriod,
              as: 'TimePeriod',
              required: true
            }
          ]
        }
      ],
      where: emissionsWhere,
      group: [`${tableName}.year`, `${tableName}TimeMapping->TimePeriod.id`],
      order: [
        [sequelize.col(`${tableName}.year`), 'ASC'],
        [sequelize.col(`${tableName}TimeMapping->TimePeriod.id`), 'ASC']
      ],
      subQuery: false,
      raw: true
    });

    if (startedYearEmission.length == 0) return [];

    const getConfigData = await request.ConfigConstants.findAll({
      attributes: ['config_key', 'config_value'],
      where: {
        config_key: {
          [Op.in]: ['EMISSION_REDUCTION_TARGET_1', 'EMISSION_REDUCTION_TARGET_1_YEAR']
        }
      }
    });

    const emissionReductionTYear = Math.abs(getConfigValue(getConfigData, 'EMISSION_REDUCTION_TARGET_1_YEAR'));
    const emissionReductionT = Math.abs(getConfigValue(getConfigData, 'EMISSION_REDUCTION_TARGET_1'));

    const emission = startedYearEmission[0].emissions;
    const emissionPercentConst = emissionReductionT / 100;
    const totalPeriodsDiv = (emissionReductionTYear - baseYear + 1) * 13;
    const constEmission = (emission * emissionPercentConst) / totalPeriodsDiv;
    const skipPeriods = (year - baseYear) * 13;
    const initialEmission = emission - constEmission * skipPeriods;
    const targetValue = [];
    for (let i = 1; i <= 13; i++) {
      targetValue.push(initialEmission - constEmission * i);
    }
    return targetValue;
  } catch (error: any) {
    console.log("error >>>>>> ", error)
    throw new Error(error.message);
  }
};


export const processContributorAndDetractor = (
  toggleData: any,
  emissionsData: any,
  configData: any,
  tableName: string
) => {
  let contributor = [];
  let detractor = [];

  const { contributorColor, detractorColor, mediumColor } = getContributorDetractorGraphColor(configData)
  //NEW CODE
  const { totalIntensity, totalEmission } = calculateTotals(emissionsData)
  const average = calculateAverage(toggleData == 1 ? totalEmission : totalIntensity);
  for (const property of emissionsData) {
    let intensityData = roundToDecimal(property.intensity - average);
    let compareValue = property.intensity;
    if (toggleData == 1) {
      compareValue = property.emission / convertToMillion;
      intensityData = roundToDecimal(
        property.emission / convertToMillion - average
      );
    }
    if (compareValue > average) {
      contributor.push({
        name: property[`${tableName}.name`],
        value: Math.abs(intensityData),
        color: detractorColor,
      });
    } else {
      detractor.push({
        name: property[`${tableName}.name`],
        value: Math.abs(intensityData),
        color: contributorColor,
      });
    }
  }

  if (contributor.length > 0) {
    contributor[contributor.length - 1].color = mediumColor;
  }
  if (detractor.length > 0) {
    detractor[0].color = mediumColor;
  }

  return {
    contributor: contributor,
    detractor: detractor,
    unit: toggleData == 1 ? 'tCO2e' : 'g',
    average: roundToDecimal(average)
  };

}

export const processContributorAndDetractorCommonFn = async ({
  toggleData,
  topData,
  bottomData,
  configData,
  averageIntensity,
  fetchKey,
  type = ""
}: {
  toggleData: number;
  topData: any[];
  bottomData: any[];
  configData: any;
  averageIntensity: any[];
  fetchKey: string;
  type?: string
}) => {
  let contributor: any[] = [];
  let detractor: any[] = [];
  let unit = "g";

  let configDataFetch = await getConfigConstants(configData[configData.company].models)
  const { contributorColor, detractorColor, mediumColor } = getContributorDetractorGraphColor(configDataFetch);

  let average = averageIntensity[0]?.dataValues?.average_intensity;
  if (toggleData === 1) {
    average = averageIntensity[0]?.dataValues?.average_emission;
    unit = "tCO2e";
  }
  const seen = new Set();
  let combinedData = [...topData, ...bottomData];

  const filteredArr = combinedData.filter((el) => {
    const duplicate = seen.has(el.dataValues[fetchKey]);
    seen.add(el.dataValues[fetchKey]);
    return !duplicate;
  });
  for (const property of filteredArr) {
    let compareValue = property.dataValues.intensity;
    let totalEmission = property.dataValues.emission;
    if (toggleData === 1) {
      compareValue = totalEmission;
    }
    addDataPoint(
      {
        property: property,
        average: average,
        compareValue: compareValue,
        fetchKey: fetchKey,
        contributor: contributor,
        detractor: detractor,
        contributorColor: contributorColor,
        detractorColor: detractorColor,
        type: type
      }
    );
  }
  if (!type) {
    contributor.sort((a, b) => b.value - a.value)
    detractor.sort((a, b) => a.value - b.value)
  }
  else {
    detractor.sort((a, b) => b.value - a.value)
    contributor.sort((a, b) => a.value - b.value)
  }
  if (contributor.length > 0) {
    contributor[contributor.length - 1].color = mediumColor;
  }
  if (detractor.length > 0) {
    detractor[0].color = mediumColor;
  }

  return {
    detractor,
    contributor,
    unit,
    average: roundToDecimal(average),
  };
};

export const getLaneEmissionTopBottomLaneData = async (prop: any) => {
  const { initDbConnection, where, order_by, sortOrder, limit, group, tableName, attr, column } = prop
  try {
    let key = column ?? 'emission';
    return initDbConnection.models[tableName].findAll({
      attributes: [
        ...attr,
        [sequelize.literal(`SUM(${key})/ NULLIF(SUM(total_ton_miles),0)`), 'intensity'],
        [sequelize.literal(`SUM(${key})/ ${convertToMillion}`), 'emission'],
        [sequelize.literal('SUM(shipments)'), 'shipment_count']
      ],
      where: where,
      group: group,
      order: [[order_by, sortOrder]],
      limit: limit,
    });
  } catch (error: any) {
    throw new Error(error)
  }
}

export const getAverageIntensity = async (initDbConnection: any, where: any, tableName: string, column = 'emission') => {
  try {
    return await initDbConnection[tableName].findAll({
      attributes: [
        [sequelize.literal(`AVG(${column} / total_ton_miles)`), "average_intensity"],
        [sequelize.literal(`AVG(${column})/ ${convertToMillion}`), "average_emission"]
      ],
      where: where,
    });
  } catch (error: any) {
    throw new Error(error)
  }

}

export const otpAttempts = async (sequelizeInstances: any, userId: any, code: any) => {
  const recentAttempts = await sequelizeInstances.models.UserOtp.findOne({
    attributes: ["id", "user_id", "otp", "status", "attempts", "createdAt", "updatedAt",
      [sequelizeInstances.Sequelize.literal(`DATEADD(MINUTE, -30, CURRENT_TIMESTAMP)`), "thirtyMinutesAgo"]
    ],
    where: {
      user_id: userId,
    },
  });
  const thirtyMinutesAgo: any = recentAttempts?.dataValues?.thirtyMinutesAgo
    ? moment(recentAttempts?.dataValues?.thirtyMinutesAgo).utc()
    : null;
  let updateValues;

  if (recentAttempts) {
    const attempts = recentAttempts?.dataValues?.attempts || 0;
    if (attempts + 1 > 5 && recentAttempts.dataValues.updatedAt >= thirtyMinutesAgo) {
      return {
        isRequest: false,
        statusCode: 400,
        message: "Exceeded maximum attempts in the last 30 minutes.",
      };
    } else if (recentAttempts.dataValues.updatedAt < thirtyMinutesAgo) {
      updateValues = {
        isRequest: true,
        user_id: userId,
        otp: code,
        status: 0,
        attempts: 1,
      };
    } else {
      updateValues = {
        isRequest: true,
        user_id: userId,
        otp: code,
        status: 0,
        attempts: attempts + 1,
      };
    }
  } else {
    updateValues = {
      isRequest: true,
      user_id: userId,
      otp: code,
      status: 0,
      attempts: 1,
    };
  }

  return updateValues;
};

export function generateUniqueAlphanumeric(length: any) {
  const alphanumeric =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const characterSetLength = alphanumeric.length;

  // Get timestamp with higher precision
  const timestamp = process.hrtime.bigint();

  let result = "";

  for (let i = 0; i < length; i++) {
    // Generate random index using cryptographically secure randomness
    const randomIndex = getRandomInt(characterSetLength);
    result += alphanumeric.charAt(randomIndex);
  }

  return `${result}_${timestamp}`;
}

function getRandomInt(max: any) {
  const randomBytes = crypto.randomBytes(4); // Adjust byte length for larger max
  return randomBytes.readUInt32BE() % max;
}

export const processContributorWithAverageReduce = (prop: any) => {

  const { toggleData, configDataFetch, data, fetchkey } = prop

  let contributor = [];
  let detractor = [];
  let unit = 'g';

  const { contributorColor, detractorColor, mediumColor } = getContributorDetractorGraphColor(configDataFetch);

  let total = [];

  if (toggleData == 1) {
    unit = 'tCO2e';
  }

  let convertToMillion = 1000000;

  for (const property of data) {
    let intensityData = property.intensity;
    if (toggleData == 1) {
      intensityData = property.emission / convertToMillion;
    }
    total.push(roundToDecimal(intensityData));
  }
  const average = (total.length > 0) ? roundToDecimal(total.reduce((a, b) => a + b, 0) / total.length) : 0;

  for (const property of data) {

    let intensityData = roundToDecimal(property.intensity - average);
    let compareValue = property.intensity;
    if (toggleData == 1) {
      compareValue = property.emission / convertToMillion;
      intensityData = roundToDecimal((property.emission / convertToMillion) - average);
    }
    if (compareValue > average) {
      contributor.push({
        name: property[`${fetchkey}.name`] || null,
        value: Math.abs(intensityData),
        color: detractorColor
      })
    } else {
      detractor.push({
        name: property[`${fetchkey}.name`] || null,
        description: property[`${fetchkey}.description`],
        value: Math.abs(intensityData),
        color: contributorColor
      })
    }
  }

  let contributorLenght = contributor.length;
  if (contributorLenght > 0) {
    contributor[contributorLenght - 1]['color'] = mediumColor;
  }
  let detractorLenght = detractor.length;
  if (detractorLenght > 0) {
    detractor[0]['color'] = mediumColor;
  }
  return {
    contributor: contributor,
    detractor: detractor,
    unit: unit,
    average: roundToDecimal(average)
  };

}

export const processEmissionReductionData = (prop: any) => {
  try {
    const {
      current_year,
      next_year,
      emissionData,
      targetValues,
      fetchKey,
      company_level,
      region_level,
      base_level,
      max_override,
      company
    } = prop;

    let max_array = [];
    let result: any = [];
    let yearWise: any = [current_year, current_year];

    let categories: any = isCompanyEnable(company, [comapnyDbAlias.PEP])
      ? allPeriods
      : monthNames;

    const isPeriodWise = emissionData?.[0]?.dataValues?.period_id !== undefined;

    if (isPeriodWise) {
      emissionData.forEach((entry: any) => {
        const periodName = entry.dataValues.period_name;
        const index = categories.indexOf(periodName);
        if (index !== -1) {
          result[index] = entry.dataValues[fetchKey];
        }
      });
    } else {
      const years = [current_year, next_year];
      const quarters = [1, 2, 3, 4];

      years.forEach(year => {
        quarters.forEach(quarter => {
          const match = emissionData.find(
            (i: any) =>
              i?.dataValues?.quarter === quarter &&
              i?.dataValues?.year === year
          );
          result.push(match?.dataValues?.[fetchKey] || 0);
        });
      });
      yearWise = years;
      categories = [...allQuaters, ...allQuaters];
    }

    max_array = emissionData.map((entry: any) => entry.dataValues[fetchKey] || 0);
    const maxCalculated = Math.max(...max_array);
    const maxData = max_override ?? roundToDecimal(maxCalculated + (maxCalculated * 30) / 100);
    const finalMax = roundToDecimal(maxData + (maxData * 20) / 100);

    return {
      company_level: company_level ?? result,
      region_level: region_level ?? [],
      targer_level: targetValues,
      base_level: base_level ?? [maxData],
      max: finalMax,
      year: yearWise,
      categories
    };
  } catch (err) {
    console.error("processEmissionReductionData error:", err);
    throw err;
  }
};



export const targetValuesFnEmission = async (request: any, where: any, requiredData: any, schema: any) => {

  let { year, toggel_data, region_id, tableName, columnName } = requiredData;
  let minWhere = where;
  minWhere[Op.and] = [];
  let query = `YEAR([date]) = (SELECT MIN(YEAR([date])) FROM ${schema}.[emissions] where [name] = N'${where?.name}')`
  if (region_id) {
    query += ` and [region_id] =${region_id}`;
    minWhere[Op.and].push({ region_id: region_id });
  }
  minWhere[Op.and].push(sequelize.literal(query));
  let minDate = await request[tableName].findOne({
    attributes: [
      [sequelize.fn("YEAR", sequelize.col("date")), "year"],
      [sequelize.literal("(DATEPART(quarter, date))"), "quarter"],
    ],
    where: minWhere,
    group: [
      sequelize.fn("YEAR", sequelize.col("date")),
      sequelize.literal("DATEPART(quarter, date)"),
    ],
    order: [
      sequelize.fn("YEAR", sequelize.col("date")),
      sequelize.literal("DATEPART(quarter, date)"),
    ],
  });

  if (!minDate) {
    return null;
  }

  where[Op.and] = [];
  where[Op.and].push(
    sequelize.where(
      sequelize.literal("YEAR([date])"),
      minDate?.dataValues?.year
    )
  );
  where[Op.and].push(
    sequelize.where(
      sequelize.literal("DATEPART(quarter, date)"),
      minDate?.dataValues?.quarter
    )
  );

  if (region_id) {
    where[Op.and].push({
      region_id: region_id,
    });
  }

  let attributeArray: any = [
    [
      sequelize.literal(
        `( SELECT SUM(CAST(${columnName} AS FLOAT)) / 1000000)`
      ),
      "emissions",
    ],
    [sequelize.literal("DATEPART(quarter, date)"), "quarter"],
    [sequelize.literal("YEAR([date])"), "year"],
  ];
  if (toggel_data == 1) {
    attributeArray = [
      [
        sequelize.literal(
          `( SELECT SUM(CAST(${columnName} AS FLOAT)) / NULLIF(SUM(CAST(total_ton_miles AS FLOAT)),0))`
        ),
        "emissions",
      ],
      [sequelize.literal("DATEPART(quarter, date)"), "quarter"],
      [sequelize.literal("YEAR([date])"), "year"],
    ];
  }

  let startedYearEmission = await request[tableName].findOne({
    attributes: attributeArray,
    where: where,
    group: [
      sequelize.fn("YEAR", sequelize.col("date")),
      sequelize.literal("DATEPART(quarter, date)"),
    ],
    order: [
      sequelize.fn("YEAR", sequelize.col("date")),
      sequelize.literal("DATEPART(quarter, date)"),
    ],
  });

  if (!startedYearEmission) {
    return null;
  }

  ///Getconstants
  let where1: any = {};
  where1[Op.or] = [];
  where1[Op.or].push(
    sequelize.where(
      sequelize.literal("config_key"),
      "EMISSION_REDUCTION_TARGET_1"
    )
  );
  where1[Op.or].push(
    sequelize.where(
      sequelize.literal("config_key"),
      "EMISSION_REDUCTION_TARGET_1_YEAR"
    )
  );
  let getConfigData = await request.ConfigConstants.findAll({
    attributes: ["config_key", "config_value"],
    where: where1,
  });
  let emissionReductionTYear = Math.abs(
    getConfigData.find(
      (item: any) =>
        item?.dataValues?.config_key === "EMISSION_REDUCTION_TARGET_1_YEAR"
    )?.config_value
  );

  let emissionReductionT = Math.abs(
    getConfigData.find(
      (item: any) => item?.dataValues?.config_key === "EMISSION_REDUCTION_TARGET_1"
    )?.config_value
  );

  let baseYear = minDate?.dataValues?.year;
  let emission = startedYearEmission?.dataValues?.emissions;

  let emissionPercentConst = emissionReductionT / 100;

  let totalQuatersDiv = (emissionReductionTYear - baseYear + 1) * 4;
  let constEmission = (emission * emissionPercentConst) / totalQuatersDiv;
  let skipQuarters = (year - baseYear) * 4;
  let intialEmision = emission - constEmission * skipQuarters;
  let targetValue = [];
  for (let i = 1; i < 9; i++) {
    targetValue.push(intialEmision - constEmission * i);
  }

  return targetValue;
};

export const targetValuesFnEmissionPeriodWise = async (request: any, where: any, requiredData: any, schema: any) => {

  let { year, toggel_data, region_id, tableName, columnName } = requiredData;
  let minWhere = where;
  minWhere[Op.and] = [];
  let query = `YEAR([date]) = (SELECT MIN(YEAR([date])) FROM ${schema}.[emissions] where [name] = N'${where?.name}')`
  if (region_id) {
    query += ` and [region_id] =${region_id}`;
    minWhere[Op.and].push({ region_id: region_id });
  }
  minWhere[Op.and].push(sequelize.literal(query));
  let minDate = await request[tableName].findAll({
    attributes: [
      [sequelize.fn("MIN", sequelize.literal(`${tableName}.year`)), "year"],
      [sequelize.literal(`MIN([${tableName}TimeMapping->TimePeriod].id)`), 'period_id']
    ],
    include: [
      {
        model: request.TimeMapping,
        as: "EmissionTimeMapping",
        required: true,
        attributes: [],
        include: [
          {
            model: request.TimePeriod,
            as: "TimePeriod",
            required: true,
            attributes: []
          }
        ]
      }
    ],
    where: minWhere,
    subQuery: false,
    raw: true
  });
  if (minDate.length == 0) {
    return null;
  }

  where[Op.and] = [];
  where[Op.and].push(
    sequelize.where(
      sequelize.literal(`${tableName}.year`),
      minDate[0]?.year
    )
  );
  where[Op.and].push({ [`$${tableName}TimeMapping.period_id$`]: minDate[0]?.period_id }
  );

  if (region_id) {
    where[Op.and].push({
      region_id: region_id,
    });
  }

  let attributeArray: any = [
    [
      sequelize.literal(
        `( SELECT SUM(CAST(${columnName} AS FLOAT)) / 1000000)`
      ),
      "emissions",
    ],
    [sequelize.literal(`[${tableName}TimeMapping->TimePeriod].id`), 'period_id'],
    [sequelize.literal(`${tableName}.year`), "year"],
  ];
  if (toggel_data == 1) {
    attributeArray = [
      [
        sequelize.literal(
          `( SELECT SUM(CAST(${columnName} AS FLOAT)) / NULLIF(SUM(CAST(total_ton_miles AS FLOAT)),0))`
        ),
        "emissions",
      ],
      [sequelize.literal(`[${tableName}TimeMapping->TimePeriod].id`), 'period_id'],
      [sequelize.literal(`${tableName}.year`), "year"],
    ];
  }
  let group = [sequelize.literal(`${tableName}.year`),
  sequelize.literal(`[${tableName}TimeMapping->TimePeriod].id`),]
  let startedYearEmission = await request[tableName].findAll({
    attributes: attributeArray,
    include: [
      {
        model: request.TimeMapping,
        as: "EmissionTimeMapping",
        required: true,
        attributes: [],
        include: [
          {
            model: request.TimePeriod,
            as: "TimePeriod",
            required: true,
            attributes: []
          }
        ]
      }
    ],
    where: where,
    group: group,
    order: group,
    subQuery: false,
    raw: true
  });

  if (startedYearEmission.length == 0) {
    return null;
  }

  ///Getconstants
  let where1: any = {};
  where1[Op.or] = [];
  where1[Op.or].push(
    sequelize.where(
      sequelize.literal("config_key"),
      "EMISSION_REDUCTION_TARGET_1"
    )
  );
  where1[Op.or].push(
    sequelize.where(
      sequelize.literal("config_key"),
      "EMISSION_REDUCTION_TARGET_1_YEAR"
    )
  );
  let getConfigData = await request.ConfigConstants.findAll({
    attributes: ["config_key", "config_value"],
    where: where1,
  });
  let emissionReductionTYear = Math.abs(
    getConfigData.find(
      (item: any) =>
        item?.dataValues?.config_key === "EMISSION_REDUCTION_TARGET_1_YEAR"
    )?.config_value
  );

  let emissionReductionT = Math.abs(
    getConfigData.find(
      (item: any) => item?.dataValues?.config_key === "EMISSION_REDUCTION_TARGET_1"
    )?.config_value
  );
  let baseYear = minDate[0]?.year;
  let emission = startedYearEmission[0]?.emissions;

  let emissionPercentConst = emissionReductionT / 100;
  let totalQuatersDiv = (emissionReductionTYear - baseYear + 1) * 13;
  let constEmission = (emission * emissionPercentConst) / totalQuatersDiv;
  let skipQuarters = (year - baseYear) * 13;
  let intialEmision = emission - constEmission * skipQuarters;
  let targetValue = [];
  for (let i = 1; i < 14; i++) {
    targetValue.push(intialEmision - constEmission * i);
  }

  return targetValue;
};

export function processRegionData(getRegionData: any, configData: any, fetchKey: any, keyName: string, costFindKey: string) {
  if (!getRegionData) return getRegionData;

  const { contributorColor, detractorColor, mediumColor } = getContributorDetractorGraphColor(configData, "graph")

  // Calculate totals and averages
  const { totalIntensity, totalEmission } = calculateTotals(getRegionData);
  const averageIntensity = calculateAverage(totalIntensity);
  const averageEmission = calculateAverage(totalEmission);

  // Process properties and get arrays
  const { intensityArray, emissionArray } = processProperties(
    {
      data: getRegionData,
      averageIntensity: averageIntensity,
      averageEmission: averageEmission,
      contributorColor: contributorColor,
      detractorColor: detractorColor,
      keyName: keyName,
      fetchKey: fetchKey,
      costFindKey: costFindKey
    }
  );
  updateColors(getRegionData, intensityArray, averageIntensity, 'intensity', mediumColor);
  updateColors(getRegionData, emissionArray, averageEmission, 'cost', mediumColor);

  return getRegionData;
};

export function processProperties(
  prop: any
) {
  const { data,
    averageIntensity,
    averageEmission,
    contributorColor,
    detractorColor,
    keyName,
    fetchKey,
    costFindKey } = prop

  const intensityArray = [];
  const emissionArray = [];

  for (const property of data) {
    property["name"] = checkNUllValue(property[`${fetchKey}.name`]);
    property[`${keyName}_id`] = checkNUllValue(property[`${fetchKey}.id`]);

    property[`${keyName}.name`] = checkNUllValue(property[`${fetchKey}.name`]);
    property[`${keyName}.id`] = checkNUllValue(property[`${fetchKey}.id`]);

    const intensity = roundToDecimal(property?.intensity);
    const cost = property[costFindKey] ? property[costFindKey] / convertToMillion : 0;

    property["intensity"] = getPropertyValue(intensity, averageIntensity, contributorColor, detractorColor);
    property["cost"] = getPropertyValue(cost, averageEmission, contributorColor, detractorColor);

    intensityArray.push(intensity);
    emissionArray.push(cost);
  }

  return {
    intensityArray: intensityArray.slice().sort((a, b) => a - b),
    emissionArray: emissionArray.slice().sort((a, b) => a - b),
  };
};

export const fetchScacByCountry = async (prop: any) => {
  let { companyConnection, country_code = countryConstant.all, defaultScac = 0, tableName = 'AlternateFueltypeCarrier', attr, orderBy = 'scac', parentWhere = {} } = prop


  const aliasNameObj = {
    AlternateFueltypeCarrier: "countryScac",
    EvCarriers: "countryScacEv",
    SummarisedFuelBoard: "combineDashCarCtry"
  } as any

  let aliasName = aliasNameObj[tableName]

  attr = attr ?? ['name', 'scac', 'image', [Sequelize.literal(`${aliasName}."scac_priority"`), 'scac_priority']]

  let where: any = {};
  if (country_code) {
    where = { country_code: country_code }
  }

  if (defaultScac) {
    if (tableName === "SummarisedFuelBoard") {
      where.combined_priority = 1;
    } else {
      where.scac_priority = 1;
    }
  }

  return await companyConnection.models[tableName].findAll({
    attributes: [...attr],
    include: [
      {
        model: companyConnection.models.CarrierCountry,
        required: true,
        attributes: [],
        where: where,
        as: aliasName
      },
    ],
    where: parentWhere,
    order: [[orderBy, 'asc']],
    raw: true,
  });
}

export const mapScacCountryWise = async (prop: any) => {
  const { companyConnection, country_code, carrier_scac, tableName, attr, keyName = 'scac', parentWhere } = prop

  const countryWiseScac = await fetchScacByCountry({ companyConnection: companyConnection, country_code: country_code, defaultScac: carrier_scac?.length == 0 ? 1 : 0, tableName: tableName, attr: attr, orderBy: keyName, parentWhere: parentWhere })

  if (countryWiseScac?.length > 0) {
    return countryWiseScac.filter((item: any) => carrier_scac?.length > 0 && !carrier_scac.includes('all') ? carrier_scac.includes(item[keyName]) : item)
      .map((item: any) => item[keyName]);
  }
  return []
}

export async function getTotalNewLanes(request: any, file_id: any) {
  let totalNewLanes = await request[request.company].models.BidImport.findAll({
    attributes: [[sequelize.literal("DISTINCT lane_name"), "lane_name"]],
    where: {
      [sequelize.Op.and]: [
        {
          lane_name: {
            [sequelize.Op.notIn]: sequelize.literal(
              `(SELECT lane_name FROM ${request["schema"]}.bid_lanes)`
            ),
          },
        },
        {
          file_id: file_id,
        },
        {
          is_error: 0,
        },
      ],
    },
  });
  return totalNewLanes;
}

export async function getTotalLanes(request: any, file_id: any) {
  let totalNewLanes = await request.models.BidImport.findAll({
    attributes: [[sequelize.literal("DISTINCT lane_name"), "lane_name"]],
    where: {
      [sequelize.Op.and]: [
        {
          file_id: file_id,
        },
        {
          is_error: 0,
        },
      ],
    },
  });

  return totalNewLanes;
}

export async function getLaneDistance(origin: any, destination: any, instance: any) {
  let latLog: any = [];
  latLog.push(origin);
  latLog.push(destination);

  let payload = await getPayload(latLog, origin, destination);

  if (!payload?.start_location || !payload?.destination_location) {
    return null;
  }

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: process.env.LANE_ROUTES_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: payload,
  };
  let data;
  try {
    data = await axios.request(config);
  } catch (err) {
    //integrate google api for distance...

    let obj = {
      lane_name: `${origin}_${destination}`,
      distance: 0,
      fuel_type: 'N/A',
    };

    await instance.models.BidLanes.create(obj);
    return null;
  }
  let distance: any = data?.data[0]?.distance ? data?.data[0]?.distance : 0;
  let fuel_type = data?.data[0]?.fuel_stop_type
    ? data?.data[0]?.fuel_stop_type
    : 'N/A';

  let obj = {
    lane_name: `${origin}_${destination}`,
    distance: parseFloat(distance.toFixed(2)),
    fuel_type: fuel_type,
  };

  await instance.models.BidLanes.create(obj);
}

async function getPayload(latLog: any, origin: string, destination: string) {
  let payload = {
    routes_count: 1,
    flag: 0,
    start_location: {
      latitude: 0,
      longitude: 0,
    },
    destination_location: {
      latitude: 0,
      longitude: 0,
    },
  };
  for (let city of latLog) {
    if (city) {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${process.env.APP_GOOGLE_API_KEY}`
      );
      await compareOriginDestination(payload, response, city, origin, destination);
    }
  }
  return payload
}

async function compareOriginDestination(payload: any, response: any, city: string, origin: string, destination: string) {
  if (city == origin) {
    payload["start_location"]["latitude"] = response.data.results[0]
      ?.geometry?.location?.lat
      ? response.data.results[0]?.geometry?.location?.lat
      : 0;
    payload["start_location"]["longitude"] = response.data.results[0]
      ?.geometry?.location?.lng
      ? response.data.results[0]?.geometry?.location?.lng
      : 0;
  } else if (city == destination) {
    payload["destination_location"]["latitude"] = response.data.results[0]
      ?.geometry?.location?.lat
      ? response.data.results[0]?.geometry?.location?.lat
      : 0;
    payload["destination_location"]["longitude"] = response.data.results[0]
      ?.geometry?.location?.lng
      ? response.data.results[0]?.geometry?.location?.lng
      : 0;
  }
}

export const updateFileManagementStatusFn = async (prop: any) => {
  try {
    const { status, authenticate, blobData, basePath, type, where, file_management_id } = prop
    const request = authenticate
    let fileManagementData: any
    let updateStatus: any
    if (file_management_id) {
      fileManagementData = await request[request.company].models.FileManagement.findOne({
        attribute: ['id', 'status_id'],
        where: where
      })
    }
    else {
      fileManagementData = await request[request.company].models.FileManagement.findOne({
        attribute: ['id', 'status_id'],
        where: {
          [Op.and]: [
            { name: { [Op.like]: blobData } },
            { base_path: { [Op.like]: basePath } },
            { is_deleted: 0 }
          ]
        }
      })
    }
    if (fileManagementData) {
      if (fileManagementData?.dataValues?.status_id !== 5) {
        fileManagementData.update({ status_id: status })
      }
    }
    else {
      fileManagementData = await request[request.company].models.FileManagement.create({
        name: blobData,
        User_id: request?.userData?.id,
        base_path: basePath,
        status_id: status,
        is_deleted: 0,
        type: type,
      });
    }
    await request[request.company].models.ActivityLog.create({
      status_id: status,
      file_management_id: fileManagementData?.dataValues?.id,
    })
    return updateStatus
  }
  catch (err: any) {
    console.log(err, "err")
    throw err
  }
}

export const handlePagination = (page = "1", page_size = "10") => {
  let page_server_size = page_size ? parseInt(page_size) : 5;
  let page_server = page ? parseInt(page) - 1 : 0;
  return { page_server, page_server_size };
}


export function addDataPoint(
  prop: any
) {
  const { property,
    average,
    compareValue,
    fetchKey,
    contributor,
    detractor,
    contributorColor,
    detractorColor,
    type } = prop

  const dataPoint = {
    name: property.dataValues[fetchKey],
    value: Math.abs(compareValue - average),
    total_emission: property.dataValues.emission,
    total_intensity: property.dataValues.intensity,
    shipment_count: property.dataValues.shipment_count,
    color: compareValue > average ? detractorColor : contributorColor,
  };

  let isAboveAverage = compareValue > average;

  let targetArray;
  if (!type) {
    targetArray = isAboveAverage ? contributor : detractor;
  } else {
    targetArray = isAboveAverage ? detractor : contributor;
  }

  targetArray.push(dataPoint);
}

export const getConfigConstantByKey = async (request: any, key: string) => {
  try {
    const record = await request.ConfigConstants.findOne({
      attributes: ["config_value"],
      where: { config_key: key },
      raw: true,   // ✅ ensures plain object
    });

    return record ? record.config_value : null;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const processFuelTypeCheck = async (
  coordinatesArray: { latitude: number; longitude: number }[],
  thresholdDistanceEv: number,
  chunkSize: number
) => {

  const chunks: { latitude: number; longitude: number }[][] = [];
  for (let i = 0; i < coordinatesArray.length; i += chunkSize) {
    chunks.push(coordinatesArray.slice(i, i + chunkSize));
  }

  for (const chunk of chunks) {
    const latLngString = await constructLatLngStringCom(chunk);
    const distanceObj = await fetchDistanceData(latLngString);
    const isValidChunk = checkDistanceValidity(distanceObj?.legs, thresholdDistanceEv);
    if (!isValidChunk) {
      return false;
    }
  }
  return true;
}

export const fetchDistanceData = async (latLngString: string): Promise<any> => {
  const url = `https://router.project-osrm.org/route/v1/driving/${latLngString}?overview=false`;
  try {
    console.log("url >>>>> ", url);
    const response = await axios.get(url, { maxBodyLength: Infinity });
    return response?.data?.routes?.[0] || null;
  } catch (error) {
    console.error("Error fetching distance data:", error);
    return null;
  }
};

export const checkDistanceValidity = (legs: any[], thresholdDistanceEv: number): boolean => {
  const milesDistances = legs?.map((leg: any) => leg?.distance / 1609.34); // meters → miles
  const invalidDistances = milesDistances?.filter((distance: number) => distance > thresholdDistanceEv);
  return invalidDistances?.length === 0;
};



export const getCommonFilterList = async (prop: any) => {
  try {
    const { companyConnection, country, whereclause, tableName = "SummarisedFuelBoard" } = prop
    const [countryData, yearData, monthData] = await Promise.all([

      await companyConnection[tableName].findAll({
        attributes: [
          [Sequelize.fn("DISTINCT", Sequelize.col("countryMaster.country_name")), "country"],
          [Sequelize.col("countryMaster.country_code"), "country_code"]
        ],
        include: [
          {
            model: companyConnection.Country,
            as: "countryMaster",
            attributes: []
          }
        ],
        order: [[Sequelize.literal("country"), "DESC"]],
        raw: true
      }),
      companyConnection[tableName].findAll({
        attributes: [[Sequelize.literal(`Distinct(${tableName}.year)`), 'year']],
        where: country && { country: country },
        raw: true,
        order: [[Sequelize.literal('year'), 'ASC']]
      }),
      companyConnection[tableName].findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('month')), 'month']
        ],
        where: whereclause,
        raw: true,
        order: [[Sequelize.literal('month'), 'ASC']] // Order by year
      })
    ])
    return { countryData, yearData, monthData }
  }
  catch (err) {
    console.log(err, "err")
    throw new Error("Error while fetching common filter list");
  }
}

export const validateLane = async (prop: any) => {
  try {
    const { connection, name } = prop
    return await connection.models.EmissionLanes.findOne({
      attributes: ['name'],
      where: { name },
      raw: true
    });

  }
  catch (err) {
    console.log(err, "err")
    throw new Error("Error while validate lane");
  }
}

