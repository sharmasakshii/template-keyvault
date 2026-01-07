import sequelize, { Op, Sequelize } from "sequelize";
import { getLaneIntensity, routePayloadFn, whereClauseFn } from "../services/commonServices";
import htmlConstant from "../services/htmlConstant";
import { comapnyDbAlias, convertToMillion, styles } from "../constant";
import axios from 'axios';
import * as XLSX from "xlsx";
import { ModuleKey } from "../constant/moduleConstant";
import * as jwt from "jsonwebtoken";
const secretKey: any = process.env.JWT_TOKEN;
const crypto = require("crypto");

export const checkNUllValue = (value: any) => value || null

/**
 * @description Filters and sorts intermodal lanes based on specified criteria.
 * @param {Array} inputLanes - The array of intermodal lane data.
 * @returns {Array} - The filtered and sorted array of intermodal lane data.
 */
export async function filterAndSortLanes(inputLanes: any) {
  // Initialize result array and variables for smallest distance, highest fuel stops, and seen distances
  let result = [];
  let smallestDistance = 10000000;
  let highestFuelStops = 0;
  let seenDistances = new Set();
  // Iterate through the inputLanes array
  for (const row of inputLanes) {
    // Check if fuel_count is greater than highestFuelStops and greater than 0
    if (row.fuel_count > highestFuelStops && row.fuel_count > 0) {
      // Check if distance is not already seen
      if (!seenDistances.has(parseFloat(row.distance))) {
        // Update smallestDistance, highestFuelStops, and add the row to result
        smallestDistance = parseFloat(row.distance);
        highestFuelStops = row.fuel_count;
        result.push(row);
        seenDistances.add(parseFloat(row.distance));
      }

      // Check if distance is equal to smallestDistance and fuel_count is greater than highestFuelStops
      else if (
        parseFloat(row.distance) == smallestDistance &&
        row.fuel_count > highestFuelStops
      ) {
        // Remove the last row from result, update smallestDistance, highestFuelStops, and add the current row to result
        result.pop();
        smallestDistance = parseFloat(row.distance);
        highestFuelStops = row.fuel_count;
        result.push(row);
      }
    }
  }

  // Return the filtered and sorted result array
  return result;
}


export async function getCarrierRanking(request: any, carrierCode: any, Op: any) {
  let carrier_ranking = await request.smartdataRanking.findAll({
    attributes: [
      ['carrier_code', 'code'],
      'ranking',
      'year'
    ],
    where: [{ carrier_code: carrierCode },
    {
      ranking: { [Op.ne]: null }
    }
    ],
    group: ['ranking', 'year', 'carrier_code'],
    order: [['year', 'asc']],
  });
  return carrier_ranking;
}


export const createRoute = (
  method: string,
  route: string,
  controller: any,
  controllerInstance: string,
  role: string = "",
  extraParameter?: any,
) => {
  let without_middleware = role == ModuleKey.WithoutMiddleware

  const handler = routePayloadFn({
    role,
    Controller: controller,
    controllerInstance,
    extraParameter,
    without_middleware,
    route
  });

  return {
    method,
    route,
    handler,
  };
};


/**
  * @description Gets intermodal lane data for a specified lane name.
  * @param {string} name - The lane name.
  * @param {any} initMainDbConnection - The initialized main database connection.
  * @returns {Promise<any>} - The intermodal lane data.
  */
export async function getIntermodalLaneDetail(name: string, initMainDbConnection: any, connection: any) {
  try {
    const where: any = {};
    where[Op.and] = [];
    // Add conditions for filtering by year and/or quarter
    if (name) {
      where[Op.and].push({ ["name"]: name });
    }

    let intermodalLaneData =
      await initMainDbConnection.models.IntermodalLanes.findOne({
        attributes: [
          "id",
          "name",
          "route_number",
          "rail_provider",
          "provider_image",
          "carrier_image",
          "carrier_code",
        ],
        where: where,
      });
    let lane_id = intermodalLaneData?.dataValues?.id;
    if (!intermodalLaneData) {
      return null;
    }

    let recommendedTerminalData =
      await initMainDbConnection.models.RecommendedIntermodalCoordinates.findAll(
        {
          attributes: ["intermodal_lane_id", "latitude", "longitude"],
          where: { ["intermodal_lane_id"]: lane_id },
          order: [["id", "ASC"]],
        }
      );

    if (!recommendedTerminalData) {
      return null;
    }
    // Check if the company is enabled for recommended intermodal data for Project details
    const isRecommendedIntermodalData
      = isCompanyEnable(connection.company, [comapnyDbAlias.RBL, comapnyDbAlias.PEP
      ])
    const recommendedFuelStopQuery = `SELECT ${!isRecommendedIntermodalData ? "TOP(1)" : ""} [RTC].[uuid] AS [uuid], [RTC].[intermodal_lane_id] AS [lane_id] , [RTC].[latitude] , [RTC].[longitude],
        [RTN].[terminal_id] AS [terminal_id] , [RTN].terminal_name AS [terminal_name], [RTN].terminal_company AS [terminal_company]
         FROM greensight_master.recommended_terminal_coordinates  AS [RTC]
        INNER JOIN greensight_master.rail_terminal_nodes AS [RTN] ON
            [RTC].[terminal_id]  = [RTN].[terminal_id]
            where RTC.intermodal_lane_id = ${lane_id}
            ORDER BY  [RTC].[id] ASC;`;

    let sequelizeInstances = initMainDbConnection;
    const [recommendedIntermodalData] = await sequelizeInstances.query(
      recommendedFuelStopQuery
    );
    if (!recommendedIntermodalData) {
      return null;
    }

    let railImage = await getRailImage(
      initMainDbConnection,
      recommendedIntermodalData
    );

    let laneDistance =
      await initMainDbConnection.models.IntermodalMetrix.findAll({
        attributes: ["distance", "time", "road_distance", "road_time"],
        where: { ["intermodal_lane_id"]: lane_id },
      });

    let costByIntermodal =
      await initMainDbConnection.models.CostByIntermodal.findAll({
        attributes: ["rail_time_const", "cost_per_mile"],
        where: { ["intermodal_id"]: lane_id },
      });

    let laneIntensity = await getLaneIntensity(connection[connection.company].models, { name: name });
    let getConfigData = await connection[connection.company].models.ConfigConstants.findOne({
      attributes: ["config_key", "config_value"],
      where: { config_key: "rail_intensity" },
    });

    //Emission const
    let emission_const =
      getConfigData?.dataValues?.config_value /
      laneIntensity[0]?.dataValues?.average;
    let data = {
      recommendedTerminalData,
      recommendedIntermodalData,
      rail_distance: checkNUllValue(laneDistance[0]?.dataValues?.distance),
      rail_time: laneDistance[0]?.dataValues?.time
        ? parseFloat(laneDistance[0]?.dataValues?.time)
        : null,
      road_distance: checkNUllValue(laneDistance[0]?.dataValues?.road_distance),
      road_time: laneDistance[0]?.dataValues?.road_time
        ? parseFloat(laneDistance[0]?.dataValues?.road_time)
        : null,
      rail_time_const: checkNUllValue(costByIntermodal[0]?.rail_time_const),
      cost_per_mile: checkNUllValue(costByIntermodal[0]?.dataValues?.cost_per_mile),
      emission_const: emission_const,
      provider_image: checkNUllValue(railImage.dataValues.provider_image),
      carrier_image: checkNUllValue(railImage.dataValues.carrier_image),
      rail_provider: checkNUllValue(railImage.dataValues.rail_provider),
      carrier_code: checkNUllValue(railImage.dataValues.carrier_code),
    };
    // Generate and return the HTTP response
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function getRailImage(initMainDbConnection: any, terminalData: any) {
  try {
    let terminalRailProvider = terminalData[0].terminal_company;
    terminalData = terminalRailProvider.split(",");
    return await initMainDbConnection.models.IntermodalLanes.findOne({
      attributes: [
        "id",
        "name",
        "route_number",
        "rail_provider",
        "provider_image",
        "carrier_image",
        "carrier_code",
      ],
      where: { rail_provider: terminalData[0] },
    });
  } catch (error) {
    console.log(error);
  }
}

export const buildProjectSummary = (
  project_summary: any,
  carrier_code: any,
  type: any,
  is_alternative: any
) => {
  let summaryHtml: any = {};
  if (project_summary.carrier_provider.value) {
    let carrier_data = project_summary.carrier_provider.value.split(",");
    let carrierProvider = "";
    let carrier_name = carrier_code.find(
      (x: any) => x.dataValues.carrier_code == carrier_data[0]
    );
    if (carrier_name) {
      carrierProvider += `${carrier_name.dataValues.carrier_name}, `;
    }
    carrierProvider = carrierProvider.replace(/,\s*$/, "");
    project_summary.carrier_provider.value = carrierProvider;
  }
  for (const property in project_summary) {
    console.log(property, "property")
    if (htmlConstant[property] && project_summary[property].value) {

      if (property == "fuel_type") {
        summaryHtml[property] = formatFuelType(project_summary, htmlConstant, property, is_alternative);
      }
      else if (property == "emissions_reduction_spent") {
        if (type == "carrier_shift") {
          summaryHtml[property] = htmlConstant[property].replace(
            "#VALUE#",
            project_summary[property].value
          );
        } else {
          summaryHtml[property] = null;
        }
      }
      else {
        let propValue = project_summary[property].value;
        if (property == "ev_charger") {
          propValue = project_summary[property].value ? "Yes" : "No";
        }
        summaryHtml[property] = htmlConstant[property].replace(
          "#VALUE#",
          propValue
        );
        if (project_summary[property].arrow) {
          let replaceValue = htmlConstant[property].replace(
            "#VALUE#",
            `${project_summary[property].value} ${htmlConstant[project_summary[property].arrow]
            }`
          );
          if (project_summary[property].arrow == "redDownArrow.svg") {
            replaceValue = replaceValue.replace("#5F9A80", "#D8856B");
            summaryHtml[property] = replaceValue;
          } else if (project_summary[property].arrow == "greenArrowDowm.svg") {
            replaceValue = replaceValue.replace("#D8856B", "#5F9A80");
            summaryHtml[property] = replaceValue;
          } else {
            summaryHtml[property] = replaceValue;
          }
        }
      }
    }
    else {
      summaryHtml[property] = null;
    }

  }
  return summaryHtml;
};


export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export function getStartAndEndMonths(quarter: any) {
  quarter = quarter ? parseInt(quarter) : 1;
  const startMonth = (quarter - 1) * 3 + 1; // Starting month
  const endMonth = quarter * 3; // Ending month
  return { start: startMonth, end: endMonth };
}

/**
* @description Function to calculate standard deviation
* @param {Object} notificationInfo - Object containing carrier intensity or emission
* @returns {data} data with standard deviationand mean
*/
export const getStandardDeviation = async (
  array: any[],
  factor: any,
  operator: string
) => {
  try {
    const operatorsObject: any = {
      PLUS: function (a: number, b: number) {
        return a + b;
      },
      MULTIPLY: function (a: number, b: number) {
        return a * b;
      },
      DIV: function (a: number, b: number) {
        return a / b;
      },
      SUB: function (a: number, b: number) {
        return a - b;
      },
    };
    let n = array.length;
    const mean = array?.reduce((a: number, b: number) => a + b, 0) / n;
    const sd = Math.sqrt(
      array
        .map((x: number) => Math.pow(x - mean, 2))
        .reduce((a: number, b: number) => a + b, 0) / n
    );
    const from = mean - operatorsObject[operator](sd, factor);
    const to = mean + operatorsObject[operator](sd, factor);
    const mediumPerformance = { from: from, to: to };
    return {
      standardDeviation: sd,
      mean: mean,
      from: from,
      mediumPerformance: mediumPerformance,
      to: to,
    };
  } catch (error) {
    console.log("error", error);
  }
};


export const parseValue = (value: any, type: any) => {
  switch (type) {
    case 'page':
      return value ? parseInt(value) - 1 : 0;
    case 'page_size':
      return value ? parseInt(value) : 30;
    default:
      return value;
  }
}

export const splitArrayIntoTwoHalves = (array: any[]) => {
  const middleIndex = Math.ceil(array.length / 2);
  const firstHalf = array.slice(0, middleIndex);
  const secondHalf = array.slice(middleIndex);
  return { firstHalf, secondHalf };
};


export async function buildWhereClause(payload: Array<{ [key: string]: any }>, start_date?: string, end_date?: string, column: string = 'date') {
  const where: any = {};
  where[Op.and] = [];
  // Add date conditions to the where clause
  if (start_date) {
    where[Op.and].push(Sequelize.literal(`${column} >= '${start_date}'`));
  }
  if (end_date) {
    where[Op.and].push(Sequelize.literal(`${column} <= '${end_date}'`));
  }
  // Add additional conditions from whereClauseFn
  const whereClause = await whereClauseFn(payload);
  where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];

  return where;
}


// Function to add radius parameters based on company
export function addRadiusParams(companySlug: string, query: string): string {
  if (isCompanyEnable(companySlug, [comapnyDbAlias.PEP])) {
    query += `, @ev_radius = :ev_radius, @rd_radius = :rd_radius,
         @optimus_radius = :optimus_radius,
      @bio_100_radius=:bio_100_radius, @rng_radius = :rng_radius, @hydrogen_radius = :hydrogen_radius, @hvo_radius = :hvo_radius, @bio_21_99_radius=:bio_21_99_radius`;
  }
  if (isCompanyEnable(companySlug, [comapnyDbAlias.GEN])) {
    query += `, @rd_radius = :rd_radius, @bio_100_radius=:bio_100_radius, @rng_radius = :rng_radius, @hydrogen_radius = :hydrogen_radius, @b99_radius = :b99_radius`;
  }

  if (isCompanyEnable(companySlug, [comapnyDbAlias.RBL, comapnyDbAlias.BMB])) {
    query += `, @rd_radius = :rd_radius, @bio_100_radius=:bio_100_radius, @rng_radius = :rng_radius, @bio_21_99_radius=:bio_21_99_radius`;
  }

  return query;
}

export const calculateMaxFuelStopsKSort = async (
  recommendedKLaneFuelStop: any[]
) => {
  let providerArray: any[] = [];
  let providerSet = new Set<string>();
  let providerArrayUnique: any[] = [];

  recommendedKLaneFuelStop.forEach((stop: any) => {
    const ids = stop["product_ids"]?.split(", ") || [];
    const codes = stop["product_codes"]?.split(",") || [];
    const names = stop["product_names"]?.split(",") || [];
    const impactFractions = stop["impact_fraction"]?.split(",") || [];
    const costPremiums = stop["cost_premium_const"]?.split(",") || [];

    codes.forEach((code: string, index: number) => {
      code = code.trim();
      if (code !== "EV") {
        // Add to unique list if not present
        if (!providerSet.has(code)) {
          providerSet.add(code);
          providerArrayUnique.push({
            id: 10 + (crypto.randomInt(0, 90)),
            product_type_id: ids[index] || null,
            product_code: code,
            product_name: names[index] || null,
            impact_fraction: impactFractions[index] || null,
            cost_premium_const: costPremiums[index] || null
          });
        }

        // Count occurrences
        const existing = providerArray.find((item) => item.product_code === code);
        if (existing) {
          existing.occurrence++;
        } else {
          providerArray.push({
            product_code: code,
            occurrence: 1,
            impact_fraction: impactFractions[index] || null,
            cost_premium_const: costPremiums[index] || null
          });
        }
      }
    });
  });

  const max = Math.max(...providerArray.map((o) => o.occurrence));
  const maxTimeFuelStop = providerArray.find((x) => x.occurrence === max);

  return { maxTimeFuelStop, providerArrayUnique };
};


export function checkReturnNullValue(value: any) {
  return value || null
}

export function checkReturnNullValueFloat(value: any) {
  return value ? parseFloat(value) : null
}

export const getCarrierEmissionQuery = (where: any, col_name: string, order_by: string) => {
  return {
    attributes: [
      [sequelize.literal("(SUM(emission)/ SUM(total_ton_miles))"), "intensity"],
      [sequelize.literal(`(SUM(emission)/ ${convertToMillion})`), "emissions"],
      [sequelize.literal("SUM(shipments)"), "shipment_count"],
      "carrier",
      "carrier_name",
      "carrier_logo",
    ],
    where: where,
    group: ["carrier_name", "carrier", "carrier_logo"],
    order: [[col_name || "intensity", order_by || "desc"]]
  }
}

export const getContributorDetractorGraphColor = (configData: any, type?: any) => {

  let contributorColor = getConfigValue(configData, (type ? "contributor_color" : 'graph_contributor_color'));
  let detractorColor = getConfigValue(configData, (type ? 'detractor_color' : 'graph_detractor_color'));
  let mediumColor = getConfigValue(configData, (type ? 'medium_color' : 'graph_medium_color'));

  return { contributorColor, detractorColor, mediumColor }
}

export async function getProblemLanesCount(region_id: number, connection: any, schema: any, company: string) {
  try {
    const configKeys = ["bio_1_20_radius", "bio_21_99_radius"];
    if (isCompanyEnable(company, [comapnyDbAlias.PEP])) {
      configKeys.push("bio_100_radius", "ev_radius", "rd_radius", "optimus_radius",
        "rng_radius", "hydrogen_radius", "hvo_radius", "b99_radius");
    }

    if (isCompanyEnable(company, [comapnyDbAlias.GEN])) {
      configKeys.push("bio_100_radius", "rd_radius",
        "rng_radius", "hydrogen_radius", "b99_radius");
    }

    if (isCompanyEnable(company, [comapnyDbAlias.RBL, comapnyDbAlias.BMB])) {
      configKeys.push("bio_100_radius", "rd_radius",
        "rng_radius");
    }

    const configData = await connection?.models?.ConfigConstants?.findAll({
      where: { config_key: { [Op.in]: configKeys } }
    });
    const radiusConfigValues = configData.reduce((acc: any, ele: any) => {
      acc[ele.config_key] = parseFloat(ele.config_value); // Convert config_value to a number
      return acc;
    }, {});
    const replacements = {
      region_id: region_id,
      carrier_shift: 1,
      modal_shift: 1,
      bio_1_20: 1,
      bio_21_99: 1,
      ...radiusConfigValues
    };

    let query = `
    EXEC ${schema}.[GetProblemLanes]
      @bio_1_20_threshold_distance = :bio_1_20_radius,
      @bio_21_99_threshold_distance = :bio_21_99_radius,
      @carrier_shift = :carrier_shift,
      @modal_shift = :modal_shift,
      @bio_1_20 = :bio_1_20,
      @bio_21_99 = :bio_21_99`;

    if (isCompanyEnable(company, [comapnyDbAlias.PEP, comapnyDbAlias.GEN])) {
      query += `
      ,@division_id = :region_id
      ,@bio_100 = :bio_100
      ,@bio_100_threshold_distance = :bio_100_radius
      ,@rd_threshold_distance = :rd_radius
      ,@rd = :rd
      ,@rng = :rng
      ,@hydrogen = :hydrogen
	    ,@rng_threshold_distance = :rng_radius
	    ,@hydrogen_threshold_distance = :hydrogen_radius`;

      // Add the conditional replacements for 'pepsi'
      replacements['rd'] = 1;
      replacements['rng'] = 1;
      replacements['hydrogen'] = 1;

      replacements['bio_100'] = 1;
    } else {
      query += `,@region_id = :region_id`;
    }

    if (isCompanyEnable(company, [comapnyDbAlias.PEP])) {
      query += `,@hvo= :hvo,@optimus = :optimus,@hvo_threshold_distance =:hvo_radius,
      @optimus_threshold_distance = :optimus_radius,@ev = :ev,@ev_threshold_distance = :ev_radius`;
      replacements['hvo'] = 1;
      replacements['optimus'] = 1;
      replacements['ev'] = 1;
    }

    if (isCompanyEnable(company, [comapnyDbAlias.GEN])) {
      query += `,@b99_threshold_distance= :b99_radius,@b99 =:b99`;
      replacements['b99'] = 1;
    }

    if (isCompanyEnable(company, [comapnyDbAlias.RBL, comapnyDbAlias.BMB])) {
      query += `
      ,@bio_100 = :bio_100
      ,@bio_100_threshold_distance = :bio_100_radius
      ,@rd_threshold_distance = :rd_radius
      ,@rd = :rd
      ,@rng = :rng
	    ,@rng_threshold_distance = :rng_radius`;
      replacements['rd'] = 1;
      replacements['rng'] = 1;
      replacements['bio_100'] = 1;
    }

    const recommendedKLanes = await connection.query(query, {
      replacements: replacements,
      type: connection.QueryTypes.SELECT,
    });
    return recommendedKLanes?.length || 0;
  } catch (error) {
    console.log('error ', error);
  }
}
export const getConfigValue = (configData: any, key: any) => {
  return configData?.find((item: any) => item?.dataValues?.config_key === key)?.config_value;
};

/**
 * @description Time Algo
 * @param {lenght} companyConnection
 * @param {number} fileId
 * @returns {object} Returns count of different status.
 */
export const getBidFileCount = async (companyConnection: { models: { BidLanes: { count: (arg0: { where: { is_processed: number; file_id: any; } | { is_error: number; file_id: any; } | { file_id: any; }; }) => any; }; }; }, fileId: any) => {
  let getProcessed = await companyConnection.models.BidLanes.count({
    where: { is_processed: 1, file_id: fileId }
  });
  let getErrorCount = await companyConnection.models.BidLanes.count({
    where: { is_error: 1, file_id: fileId }
  });
  let getTotal = await companyConnection.models.BidLanes.count({
    where: { file_id: fileId }
  });
  return { total: getTotal, is_processed: getProcessed, is_error: getErrorCount, status: 0, data: [] };
}

export const blobMove = async (blobClient: any, newBlobClient: any) => {
  const poller = await newBlobClient.beginCopyFromURL(blobClient.url);
  await poller.pollUntilDone();

  // test code to ensure that blob and its properties/metadata are copied over  
  const prop1 = await blobClient.getProperties();
  const prop2 = await newBlobClient.getProperties();
  let status = {
    status: 200,
    bool: true,
    message: "File moved successfully."
  }
  if (prop1.contentLength !== prop2.contentLength) {
    status.status = 400;
    status.bool = false;
    status.message = "Expecting same size between copy source and destination!";
  }

  if (prop1.contentEncoding !== prop2.contentEncoding) {
    status.status = 400;
    status.bool = false;
    status.message = "Expecting same content encoding between copy source and destination!";
  }

  if (prop1.metadata.keya !== prop2.metadata.keya) {
    status.status = 400;
    status.bool = false;
    status.message = "Expecting same metadata between copy source and destination!";
  }

  return status;
}

/**
 * @description Function chunkArray
 * @param {array} array
 * @param {number} chunkSize
 * @returns {Promise} Returns the list of all files
 */
export function chunkToSize<T>(array: T[], numChunks: number): T[][] {
  const chunkSize = Math.ceil(array.length / numChunks); // Calculate the chunk size
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

export const sendLogicAppRequest = (data: string, logicAppUrl: string, logicCookie: string) => {
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: logicAppUrl,
    headers: {
      'Content-Type': 'application/json',
      'Cookie': logicCookie
    },
    data: data
  };

  axios.request(config)
}

export const createBufferSingle = async (data1: any) => {
  const Excel = require("excel4node");

  // Create a new Excel workbook
  const workbook = new Excel.Workbook();

  // Add a worksheet to the workbook
  const worksheet = workbook.addWorksheet("Summarized Report");

  // Define style for headers
  const headerStyle = workbook.createStyle({
    font: {
      bold: true,
      color: "#000000", // Black color for font
    },
    fill: {
      type: "pattern",
      patternType: "none", // No fill color
    },
    alignment: {
      horizontal: "center",
    },
    border: {
      left: {
        style: "thick", // Thick left border
        color: styles?.default,
      },
      right: {
        style: "thick", // Thick right border
        color: styles?.default, // Black color for border
      },
      top: {
        style: "thick", // Thick top border
        color: styles?.default, // Black color for border
      },
      bottom: {
        style: "thick", // Thick bottom border
        color: styles?.default, // Black color for border
      },
    },
  });

  // Write headers and style them
  const headers = [
    "Lane Name",
    "Carrier_SCAC",
    "Rate Per Mile ($)",
    "Distance_miles",
    "Emission_intensity(gCO2e/Ton-Mile of freight)",
    "Emissions (tCO2e)",
    "Cost_impact(%)",
    "Emission_impact(%)",
    "Alternate _fuels",
  ];

  headers.forEach((header, index) => {
    const cell = worksheet.cell(6, index + 1);
    cell.string(header).style(headerStyle);
    if (index < 3) {
      cell.style({
        border: {
          left: { style: "none" },
          right: { style: "none" },
          top: { style: "none" },
          bottom: { style: "none" },
        },
      });
    }
    // Increase the height of all headers
    worksheet.row(6).setHeight(25); // Adjust height as needed
  });

  // Determine the maximum width required for each column
  const dataHeaders = Object.keys(data1[0] || {});
  const maxLengths = dataHeaders.map((header) =>
    Math.max(
      header.length,
      ...data1.map((row: any) => row[header]?.toString().length || 0)
    )
  );

  // Set the column width to the maximum width
  maxLengths.forEach((maxLength, index) => {
    worksheet.column(index + 1).setWidth(maxLength + 5); // Add extra padding
  });

  // Write data
  data1.forEach((data: any, rowIndex: any) => {
    dataHeaders.forEach((header, colIndex) => {
      const value = data[header];
      const cell = worksheet.cell(rowIndex + 8, colIndex + 1);
      cell.string(value?.toString() || ""); // Convert null/undefined to empty string
      cell.style({
        border: {
          left: {
            style: "thin",
            color: "#000000", // Black color for border
          },
          right: {
            style: "thin",
            color: "#000000",
          },
          top: {
            style: "thin",
            color: "#000000",
          },
          bottom: {
            style: "thin",
            color: "#000000",
          },
        },
      });
    });
  });

  // Add image to the top row
  worksheet.addImage({
    path: "logo.png",
    type: "picture",
    position: {
      type: "twoCellAnchor",
      from: {
        col: 5,
        colOff: 0,
        row: 1,
        rowOff: 0,
      },
      to: {
        col: 8, // Assuming you want the image to span two columns
        colOff: 0,
        row: 5,
        rowOff: 0,
      },
      yScale: 7, // Increase the height of the image
    },
  });

  const buffer = workbook.writeToBuffer();
  return buffer;
};

export const saveErrorOfBidPlanning = async (prop: any) => {
  try {
    const checkFileStatus = await prop.db.BidManagement.findOne({
      where: {
        id: prop.file_id
      }
    })
    if (checkFileStatus) {
      await prop.db.BidErrorLog.create({
        status_id: checkFileStatus?.dataValues?.status_id,
        file_id: prop?.file_id ? prop?.file_id : checkFileStatus?.dataValues?.id,
        error_code: 500,
        error_message: prop?.error?.message,
        error: JSON.stringify(prop?.error),
      }, { fields: ['status_id', 'file_id', 'error_code', 'error_message', 'error', 'created_on'] })
    }
  }
  catch (error) {
    console.log(error, "error")
    throw error
  }
}

export async function parseExcelTabsToJSON(content: Buffer): Promise<any> {
  const workbook = XLSX.read(content, { type: "buffer" });
  const result: any = {};

  workbook.SheetNames.forEach((sheetName: any) => {
    const sheet = workbook.Sheets[sheetName];
    result[sheetName] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  });

  return result;
}

export function parseTabsData(data: { [tabName: string]: any[][] }, file_name: any, file_id: any): any[] {
  const result: any[] = [];
  const seen = new Map();
  for (const tabName in data) {
    const tabData = data[tabName];
    const columns = tabData[0];
    const rowData = tabData.slice(1);
    let row_number = 1;
    for (const row of rowData) {
      row_number = row_number + 1;
      if (row.length > 0) {
        const obj: any = {};
        obj["file_name"] = file_name;
        obj["tab_name"] = tabName;
        obj["file_id"] = file_id;

        columns.forEach((column, index) => {
          const c_name = formatColumnName(column);
          obj[c_name] = row[index];
        });
        let validData = validateDataRow(obj);
        if (validData?.is_error == 0) {
          checkDuplicateRow(validData, seen);
        }
        validData.row_number = row_number;
        result.push(validData);
      }
    }
  }
  return result;
}

function checkDuplicateRow(validData: any, seen: Map<string, boolean>) {
  const key = validData?.lane_name + validData?.scac + validData?.rpm;
  if (seen.has(key)) {
    validData.is_error = 1;
    validData.error_message = "Duplicate row.";
  } else {
    seen.set(key, true);
  }
}

function formatColumnName(name: any) {
  name = name.replace(/\s+|\/|\(|\)|_+/g, "_");
  return name.toLowerCase();
}

export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

function validateDataRow(obj: any) {
  const validatedObj: any = { ...obj };
  const regexPatterns = {
    scac: /^[a-zA-Z]{2,4}$/,
    city: /^[a-zA-Z\s\-’.]+$/,
    state: /^[a-zA-Z]{2}$/,
  };

  let isError = 0;
  let errorMessage = "";
  const nullMessage = "Empty";

  // Helper function to validate and trim object properties
  const validateAndTrimProperty = (
    key: string,
    regex: RegExp,
    errorLabel: string
  ) => {
    if (obj[key]) {
      const trimmedValue = obj[key].toString().trim();
      if (validateString(trimmedValue, regex)) {
        validatedObj[key] = trimmedValue;
      } else {
        errorMessage += `Invalid ${errorLabel} (${trimmedValue || nullMessage}), `;
        isError = 1;
      }
    } else {
      errorMessage += `${errorLabel} is missing, `;
      isError = 1;
    }
  };

  // Validate RPM separately
  if (obj["rpm"]) {
    let rpm = obj["rpm"].toString().replace(/$/g, "").trim();
    validatedObj["rpm"] = isNaN(rpm) ? null : parseFloat(rpm);
    if (isNaN(rpm)) {
      errorMessage += `Invalid rpm (${rpm || nullMessage}), `;
      isError = 1;
    }
  } else {
    validatedObj["rpm"] = null;
    errorMessage += `Invalid rpm (${nullMessage}), `;
    isError = 1;
  }

  // List of properties to validate
  const propertiesToValidate = [
    { key: "scac", regex: regexPatterns.scac, label: "scac" },
    { key: "destination_city", regex: regexPatterns.city, label: "destination city" },
    { key: "origin_city", regex: regexPatterns.city, label: "origin city" },
    { key: "origin_state", regex: regexPatterns.state, label: "origin state" },
    { key: "destination_state", regex: regexPatterns.state, label: "destination state" },
  ];

  // Validate properties dynamically
  propertiesToValidate.forEach(({ key, regex, label }) =>
    validateAndTrimProperty(key, regex, label)
  );

  // Generate lane_name
  validatedObj["lane_name"] = `${validatedObj["origin_city"] || ""}, ${validatedObj["origin_state"] || ""
    }_${validatedObj["destination_city"] || ""}, ${validatedObj["destination_state"] || ""
    }`;

  // Finalize error handling
  validatedObj.is_error = isError;
  validatedObj.error_message = errorMessage.trim().endsWith(", ")
    ? errorMessage.slice(0, -2)
    : errorMessage;

  return validatedObj;
}


function validateString(value: any, pattern: any) {
  return pattern.test(value);
}

export const generateToken = async (user: any, expiresIn: any) => {
  return jwt.sign(
    {
      data: user,
    },
    secretKey,
    { expiresIn: expiresIn }
  );
};

export const timeAlgo = (length: number): number => {
  let time = 60;
  if (length < 1000) {
    time = 120;
  } else if (length >= 1000 && length < 10000) {
    time = 300
  } else if (length >= 10000 && length < 50000) {
    time = 480
  } else if (length >= 50000) {
    time = 720
  }
  return time;
}


export const isCompanyEnable = (company: any, companyList: any): boolean => {
  return companyList.includes(company);
};

export const getEmissionAttributes = (
  authenticate: any,
  toggelData: number
) => {

  if (isCompanyEnable(authenticate.company, [comapnyDbAlias.PEP, comapnyDbAlias.BMB])) {
    if (toggelData === 1) {
      return [
        [sequelize.literal(`SUM(emissions) / SUM(total_ton_miles)`), "intensity"],
        [sequelize.col("[SummerisedEmissionTimeMapping->TimePeriod].[id]"), "period_id"],
        [sequelize.col("[SummerisedEmissionTimeMapping->TimePeriod].[name]"), "period_name"],
        [sequelize.literal("SummerisedEmission.year"), "year"]
      ];
    }

    return [
      [
        sequelize.literal(`SUM(emissions) / ${convertToMillion}`),
        "intensity",
      ],
      [sequelize.col("[SummerisedEmissionTimeMapping->TimePeriod].id"), "period_id"],
      [sequelize.col("[SummerisedEmissionTimeMapping->TimePeriod].name"), "period_name"],
      [sequelize.literal("SummerisedEmission.year"), "year"]
    ];
  }

  if (toggelData === 1) {
    return [
      [sequelize.literal(`SUM(emissions) / SUM(total_ton_miles)`), "intensity"],
      [sequelize.literal("quarter"), "quarter"],
      [sequelize.literal("year"), "year"],
    ];
  }

  return [
    [
      sequelize.literal(`SUM(emissions) / ${convertToMillion}`),
      "intensity",
    ],
    [sequelize.literal("quarter"), "quarter"],
    [sequelize.literal("year"), "year"],
  ];
};

export const getCarrierTypeEmissionAttributes = (
  authenticate: any,
  toggelData: number
) => {

  if (isCompanyEnable(authenticate.company, [comapnyDbAlias.PEP, comapnyDbAlias.BMB])) {
    if (toggelData === 1) {
      return [
        [sequelize.literal(`SUM(emissions) / SUM(total_ton_miles)`), "intensity"],
        [sequelize.col("[SummerisedCarrierTypeTimeMapping->TimePeriod].[id]"), "period_id"],
        [sequelize.col("[SummerisedCarrierTypeTimeMapping->TimePeriod].[name]"), "period_name"],
        [sequelize.literal("SummerisedCarrierType.year"), "year"]
      ];
    }

    return [
      [
        sequelize.literal(`SUM(emissions) / ${convertToMillion}`),
        "intensity",
      ],
      [sequelize.col("[SummerisedCarrierTypeTimeMapping->TimePeriod].id"), "period_id"],
      [sequelize.col("[SummerisedCarrierTypeTimeMapping->TimePeriod].name"), "period_name"],
      [sequelize.literal("SummerisedCarrierType.year"), "year"]
    ];
  }

  if (toggelData === 1) {
    return [
      [sequelize.literal(`SUM(emissions) / SUM(total_ton_miles)`), "intensity"],
      [sequelize.literal("quarter"), "quarter"],
      [sequelize.literal("year"), "year"],
    ];
  }

  return [
    [
      sequelize.literal(`SUM(emissions) / ${convertToMillion}`),
      "intensity",
    ],
    [sequelize.literal("quarter"), "quarter"],
    [sequelize.literal("year"), "year"],
  ];
};

export async function constructLatLngStringCom(dataArray: any) {
  const latLngStringArray = dataArray.map((item: any) => `${item.longitude},${item.latitude}`);
  return latLngStringArray.join(';');
}


function formatFuelType(project_summary: any, htmlConstant: any, property: string, is_alternative: boolean): string | null {
  const fuelRecommendation = project_summary["fuel_type_recommondation"]?.value || [];
  const fuelValue = project_summary[property]?.value;

  if (!fuelValue && fuelRecommendation.length === 0) return null;

  const fuelArray = fuelRecommendation.length > 0 ? [...fuelRecommendation] : [fuelValue];
  const uniqueFuels = [...new Set(fuelArray)];

  const fuelLabels = uniqueFuels.map((fuel) => {
    const fuelMapping: Record<string, string> = {
      b100: "B100",
      b1_20: "Upto B20",
      b21_99: "B21 to B99",
    };
    return fuelMapping[fuel] || fuel;
  }).join(", ");

  const replacementValue = is_alternative ? fuelLabels : "N/A";

  return htmlConstant[property].replace("#VALUE#", replacementValue);
}


