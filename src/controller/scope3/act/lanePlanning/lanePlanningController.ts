import { Response } from "express";
import { Sequelize } from "sequelize";
import { MyUserRequest } from "../../../../interfaces/commonInterface";
import { generateResponse } from "../../../../services/response";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { isPermissionChecked } from "../../../../services/rolePermissionCheck";
import { ModuleKey, redisMasterKeyApi } from "../../../../constant/moduleConstant";
import { comapnyDbAlias, convertToMillion } from "../../../../constant";
import { addRadiusParams, calculateMaxFuelStopsKSort, checkReturnNullValue, checkReturnNullValueFloat, filterAndSortLanes, getCarrierRanking, isCompanyEnable } from "../../../../utils";
import { getLaneIntensity, validateLane } from "../../../../services/commonServices";
import { getHKey, setHKey } from "../../../../redisServices";
const sequelize = require("sequelize");
const Op = sequelize.Op;

class LanePlanningController {
  private readonly connection: Sequelize;

  constructor(connectionData: Sequelize) {
    this.connection = connectionData; // Assign the passed Sequelize instance to the private property
  }

  /**
   * @description Main function to get lane scenario data
   * @param {HttpRequest} request
   * @param {InvocationContext} context
   * @returns {Promise<HttpResponseInit>} Returns the HTTP response for lane scenario details
   */
  async getLaneScenarioDetail(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {
    try {
      const companyConnections: any = this.connection;
      const company = companyConnections.company;
      const companyModels = companyConnections[company].models;
      // Extract the state abbreviation from the request body
      const { name }: any = request.body;

      const masterKey = { company: company, key: redisMasterKeyApi.getLaneScenarioDetail }

      if (!(await validateLane({ name, connection: companyConnections[company] }))) {
        return generateResponse(res, 200, false, "No data found for this lane", {});
      }

      const childKey = request.body

      const cachedData = await getHKey({ masterKey: masterKey, childKey: childKey });
      if (cachedData) {
        return generateResponse(res, 200, true, "Problem lane by regions.", cachedData);
      }

      const whereCond: any = {};
      whereCond[Op.and] = [];

      whereCond[Op.and].push({ ["name"]: name });

      let requiredData = {
        name: name
      };

      const laneScenarioData = await this.fetchLaneEmissionIntensityShipment(
        companyModels,
        requiredData
      );

      if (laneScenarioData.length > 0) {
        await setHKey({ masterKey: masterKey, childKey: childKey, value: laneScenarioData[0], expTime: 300 })

        return generateResponse(res, 200, true, "Lane Scenario Data.", laneScenarioData[0]);
      } else {
        return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, {});
      }
    } catch (error) {
      // Log any errors that occur during the process
      console.error(error);
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }

  /**
 * @description Function to fetch lane scenario details
 * @param {any} request
 * @returns {Promise} Returns the details of all lane scenario
 */
  async fetchLaneEmissionIntensityShipment(
    initDbConnection: any,
    requiredData: any
  ): Promise<any> {
    let { name } = requiredData;
    let where: any = {};
    where[Op.and] = [];

    where[Op.and].push({ ["name"]: name });

    let emissionIntensityShipment =
      await initDbConnection.Emission.findAll({
        attributes: [
          [
            sequelize.literal("sum(emission)/sum(total_ton_miles)"),
            "emission_intensity",
          ]
        ],
        where: where,
        raw: true
      });

    return emissionIntensityShipment;
  };


  /**
* @description Handles the alternate K shortest path API request.
* @param {HttpRequest} request - The HTTP request.
* @param {InvocationContext} context - The Azure Function invocation context.
* @returns {Promise<HttpResponseInit>} - The HTTP response initialization.
*/
  public async alternateKShortestPath(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {
    try {
      const companyConnections: any = this.connection;
      const company = companyConnections.company;
      const initMainDbConnection = companyConnections["main"];
      const initCompDbConnection = companyConnections[company];

      let { name, radius } = request.body;

      if (!(await validateLane({ name, connection: initCompDbConnection }))) {
        return generateResponse(res, 200, false, "No data found for this lane", {});
      }
      
      const loggenInUser = companyConnections['userData'];
      //carrier shift
      const CASPermission = isPermissionChecked(loggenInUser.permissionsData, ModuleKey.CarrierShift).isChecked;
      //Alternative
      const AMSPermission = isPermissionChecked(loggenInUser.permissionsData, ModuleKey.ALTERNATIVEMODAL).isChecked;

      let companySlug = company;
      let lane_segment_attr = ["name", "id"];

      const whereCond: any = {};
      whereCond[Op.and] = [];

      whereCond[Op.and].push({ ["name"]: name });

      const laneData = await initMainDbConnection.models.Lane.findOne({
        attributes: lane_segment_attr,
        where: whereCond,
      });

      if (!laneData) {
        return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
      }
      let divisionIds = [];

      const lane_id = laneData.dataValues.id;

      const where: any = {};
      where[Op.and] = [];

      // Add conditions for filtering by year and/or quarter

      if (name) {
        where[Op.and].push({ ["name"]: name });
      }

      let query1 = `EXEC [greensight_master].kLanesRecommended 
      @lane_id = :lane_id,
      @bio_1_20_radius=:bio_1_20_radius,
      @company=:company`;


      let configKeys = ["bio_1_20_radius"];

      if (isCompanyEnable(companySlug, [comapnyDbAlias.PEP, comapnyDbAlias.GEN, comapnyDbAlias.RBL, comapnyDbAlias.BMB])) {

        if (isCompanyEnable(companySlug, [comapnyDbAlias.PEP])) {
          configKeys = [
            ...configKeys,
            "bio_21_99_radius",
            "bio_100_radius",
            "rd_radius",
            "ev_radius",
            "optimus_radius",
            "rng_radius",
            "hydrogen_radius",
            "hvo_radius"
          ];
        }
        if (isCompanyEnable(companySlug, [comapnyDbAlias.GEN])) {
          configKeys = [
            ...configKeys,
            "bio_100_radius",
            "rd_radius",
            "rng_radius",
            "hydrogen_radius",
            "b99_radius"
          ]
        }

        if (isCompanyEnable(companySlug, [comapnyDbAlias.RBL, comapnyDbAlias.BMB])) {
          configKeys = [
            ...configKeys,
            "bio_100_radius",
            "bio_21_99_radius",
            "rd_radius",
            "rng_radius"
          ]
        }

        query1 = addRadiusParams(companySlug, query1)

        if (isCompanyEnable(companySlug, [comapnyDbAlias.PEP, comapnyDbAlias.GEN])) {
          //Get Division ids
          divisionIds = await initCompDbConnection.models.EmissionLanes.findAll(
            {
              attributes: [
                [sequelize.literal('DISTINCT(division_id)'), 'division_id']
              ],
              where: { name },
            }
          );
        }
      }

      const configData = await initCompDbConnection.models.ConfigConstants.findAll({
        where: { config_key: { [Op.in]: configKeys } }
      })

      const radiusConfigValues = configData.reduce((acc: any, ele: any) => {
        acc[ele.config_key] = radius  //parseFloat(ele.config_value); // Convert config_value to a number
        return acc;
      }, {});

      const recommendedKLanes: any = await initMainDbConnection.query(query1,
        {
          replacements: { lane_id: lane_id, company: companySlug, ...radiusConfigValues },
          type: sequelize.QueryTypes.SELECT,
        });

      let laneArray = await filterAndSortLanes(recommendedKLanes);
      // Define parameters object
      const params = {
        laneArray,
        AMSPermission,
        companySlug,
        lane_id,
        initMainDbConnection,
        initCompDbConnection,
        CASPermission,
        name,
        sequelize,
        radiusConfigValues
      };

      const { actualLaneData, data, baseLine, laneIntermodalCordinateData, getCarriesOfLane }: any = await this.processLaneData(params);
      let delta_metrix: any = {};
      let costByLane = await initMainDbConnection.models.CostByLane.findOne({
        attributes: ["lane_id", "dollar_per_mile"],
        where: { lane_id: lane_id },
        raw: true
      });
      if (actualLaneData) {
        delta_metrix["distance"] = actualLaneData?.distance || null;
        delta_metrix["time"] = baseLine?.time || null;
      } else {
        let highwayLaneMetrix = await initMainDbConnection.models.HighwayLaneMetrix.findAll({
          attributes: [
            [sequelize.fn('MIN', sequelize.col('distance')), 'distance'],
            'time',
            'cost'
          ],
          where: { lane_id: lane_id },
          group: ['time', 'cost'],
          raw: true
        });
        delta_metrix["distance"] = highwayLaneMetrix[0]?.distance || null;
        delta_metrix["time"] = highwayLaneMetrix[0]?.time || null;
      }

      delta_metrix["dollar_per_mile"] =
        costByLane?.dollar_per_mile || null;

      let ev_fuel_stop = await initMainDbConnection.models.ProductType.findOne({
        where: {
          code: 'EV'
        }
      })
      let rd_fuel_stop = await initMainDbConnection.models.ProductType.findOne({
        where: {
          code: 'RD'
        }
      })
      let fuelStops = await initMainDbConnection.models.ProductType.findAll({
        where: {
          is_access: 1
        }
      })

      let DatByLane = await initMainDbConnection.models.DatByLane.findOne({
        attributes: ["lane_name", "dollar_per_mile"],
        where: { lane_name: laneData?.dataValues?.name },
      });

      let responseData = {
        lane_id,
        ev_fuel_stop: ev_fuel_stop,
        rd_fuel_stop: rd_fuel_stop,
        fuelStops: fuelStops,
        sortestPaths: data,
        laneIntermodalCordinateData,
        laneCarriers: getCarriesOfLane,
        baseLine,
        delta_metrix,
        dat_by_lane: DatByLane,
        divisionIds
      };
      return generateResponse(
        res,
        200,
        true,
        "Lane top 5 shortest path.",
        responseData
      );
    } catch (error) {
      console.error(error);
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }

  async getThresholdValues(companySlug: any, initCompDbConnection: any) {
    try {
      if (isCompanyEnable(companySlug, [comapnyDbAlias.PEP, comapnyDbAlias.GEN, comapnyDbAlias.RBL, comapnyDbAlias.BMB])) {
        let thresholdKeys = [
          "rng_radius",
          "rd_radius",
          "hydrogen_radius",
          "bio_21_100_radius",
          "bio_1_20_radius"
        ];

        if (isCompanyEnable(companySlug, [comapnyDbAlias.PEP])) {
          thresholdKeys = [...thresholdKeys, "hvo_radius", "optimus_radius", "ev_radius"]
        }

        if (isCompanyEnable(companySlug, [comapnyDbAlias.GEN])) {
          thresholdKeys.push("b99_radius")
        }

        // Fetch threshold values from the database
        const thresholdValues = await this.getConfigDataThresValue(initCompDbConnection);
        // Utility function to retrieve the threshold value based on config key
        const getThresholdValue = (key: any) => {
          const item = thresholdValues.find((item: any) => item?.dataValues?.config_key === key);
          return item ? parseFloat(item.config_value) : 0;
        };
        // Map the keys to their corresponding threshold values
        const result: any = {};
        thresholdKeys.forEach(key => {
          result[`threshold${key.charAt(0).toUpperCase() + key.slice(1).replace(/_radius/, '')}`] = getThresholdValue(key);
        });

        return result;
      }

      return null;
    } catch (err) {
      console.log(err, "err");
      throw err;
    }
  }

  async checkLaneForOptimusAndEv(params: any) {
    try {
      const { initMainDbConnection, lane_id, k_count, thresholdValues, companySlug } = params;
      let excludedCode = params.excludedCode;
      if (thresholdValues) {
        excludedCode.push('b1_20')
        // Function to check thresholds
        const checkThreshold = async (fuel_code: string, threshold: number) => {
          return await initMainDbConnection.models['LaneFuelstopThreshold'].findOne({
            attributes: ["id", "lane_id", "k_count", 'is_available', "threshold_distance"],
            where: { lane_id, k_count, threshold_distance: threshold, fuel_code },
            order: [["id", "ASC"]],
            raw: true
          });
        };
        // Array of fuel codes and their corresponding threshold values
        let fuelCodes = [
          { code: 'HYDROGEN', threshold: thresholdValues?.thresholdHydrogen },
          { code: 'RNG', threshold: thresholdValues?.thresholdRng },
          { code: 'RD', threshold: thresholdValues?.thresholdRd },
          { code: 'b100', threshold: thresholdValues?.thresholdbio_21_100 },
          { code: 'b1_20', threshold: thresholdValues?.thresholdBio_1_20 }
        ];

        if (isCompanyEnable(companySlug, [comapnyDbAlias.PEP])) {
          fuelCodes = [...fuelCodes, { code: 'EV', threshold: thresholdValues?.thresholdEv },
          { code: 'OPTIMUS', threshold: thresholdValues?.thresholdOptimus },
          { code: 'HVO', threshold: thresholdValues?.thresholdHvo },]
        }
        if (isCompanyEnable(companySlug, [comapnyDbAlias.GEN])) {
          fuelCodes = [...fuelCodes, { code: 'b99', threshold: thresholdValues?.thresholdB99 }]
        }
        // Check availability for each fuel code
        for (const { code, threshold } of fuelCodes) {
          const checkResult = await checkThreshold(code, threshold);
          if (checkResult?.is_available) {
            excludedCode = excludedCode.filter((excluded: any) => excluded !== code);
          }
        }
        // Filter out CNG directly
        excludedCode = excludedCode.filter((code: string) => code !== 'CNG');
      }

      return excludedCode;
    } catch (error) {
      console.log('error ', error);
      throw error; // Re-throwing the error for further handling
    }
  }


  async processLaneData(params: any) {
    const {
      laneArray,
      AMSPermission,
      companySlug,
      lane_id,
      initMainDbConnection,
      initCompDbConnection,
      CASPermission,
      name,
      sequelize,
      radiusConfigValues
    } = params;

    let actualLaneData = laneArray[0];
    let data = [];
    let baseLine;
    let laneIntermodalCordinateData;
    let getCarriesOfLane;
    if (AMSPermission) {
      for (const k of laneArray) {

        let excludedCode = ['PD'];

        if (k.fuel_count >= actualLaneData.fuel_count) {
          let route: any = {};
          let excludedCodeStr = excludedCode.join(',');

          let recommendedKLaneCoordinate = await initMainDbConnection.models.RecommendedKLaneCoordinate.findAll({
            attributes: ["lane_id", "latitude", "longitude"],
            where: { lane_id: lane_id, k_count: k?.k_count },
            order: [["id", "ASC"]],
          });

          let query1 = `EXEC [greensight_master].recommendedKLaneFuelStops 
           @lane_id = :lane_id,
           @k_count=:k_count , 
           @excludedCodeStr = :excludedCodeStr,
           @bio_1_20_radius=:bio_1_20_radius
            `
          query1 = addRadiusParams(companySlug, query1)

          const recommendedKLaneFuelStop = await initMainDbConnection.query(
            query1,
            {
              replacements: { lane_id: lane_id, k_count: k?.k_count, excludedCodeStr: excludedCodeStr, ...radiusConfigValues },
              type: sequelize.QueryTypes.SELECT,
            }
          );

          let highwayLaneMetrix = await initMainDbConnection.models.HighwayLaneMetrix.findOne({
            attributes: ["distance", "time", "cost"],
            where: { lane_id: lane_id, k_count: k?.k_count },
            raw: true
          });

          route["k_count"] = k?.k_count;
          route["recommendedKLaneCoordinate"] = recommendedKLaneCoordinate;
          route["recommendedKLaneFuelStop"] = recommendedKLaneFuelStop;
          let { maxTimeFuelStop, providerArrayUnique } = await calculateMaxFuelStopsKSort(
            recommendedKLaneFuelStop
          );
          route["fuel_stop"] = maxTimeFuelStop;
          route["unique_fuel_stops"] = providerArrayUnique;

          route["distance"] = checkReturnNullValue(highwayLaneMetrix.distance);
          route["time"] = checkReturnNullValue(highwayLaneMetrix.time);
          route["cost"] = checkReturnNullValue(highwayLaneMetrix.cost);

          if (actualLaneData?.k_count == k?.k_count) {
            baseLine = route;
          } else {
            data.push(route);
          }
        }
      }
      laneIntermodalCordinateData = await this.getIntermodalLane(
        name,
        initMainDbConnection,
        initCompDbConnection,
        companySlug
      );
    }

    if (CASPermission) {
      getCarriesOfLane = await this.getLaneCarriers(
        name,
        initCompDbConnection
      );
    }

    return {
      actualLaneData,
      data,
      baseLine,
      laneIntermodalCordinateData,
      getCarriesOfLane
    };
  }

  /**
  * @description Gets intermodal lane data for a specified lane name.
  * @param {string} name - The lane name.
  * @param {any} initMainDbConnection - The initialized main database connection.
  * @returns {Promise<any>} - The intermodal lane data.
  */
  async getIntermodalLane(name: string, initMainDbConnection: any, initCompDbConnection: any, companySlug: string) {
    try {
      const where: any = {};
      where[Op.and] = [];

      if (name) {
        where[Op.and].push({ ["name"]: name });
      }

      let intermodalLaneData = await this.getIntermodalLaneData(initMainDbConnection, where);
      if (!intermodalLaneData) {
        return null;
      }

      let recommendedTerminalData = await this.getRecommendedTerminalData(initMainDbConnection, intermodalLaneData);
      if (!recommendedTerminalData) {
        return null;
      }

      let recommendedIntermodalData = await this.getRecommendedIntermodalData(initMainDbConnection, intermodalLaneData, companySlug);
      if (!recommendedIntermodalData || recommendedIntermodalData.length == 0) {
        return null;
      }

      let railImage = await this.getRailImage(initMainDbConnection, recommendedIntermodalData);
      let laneDistance = await this.getLaneDistance(initMainDbConnection, intermodalLaneData);

      let costByIntermodal = await this.getCostByIntermodal(initMainDbConnection, intermodalLaneData);
      let laneIntensity = await getLaneIntensity(initCompDbConnection.models, { name: name });
      let getConfigData = await this.getConfigDataFn(initCompDbConnection);

      let emission_const = this.calculateEmissionConst(getConfigData, laneIntensity);

      let data = {
        recommendedTerminalData,
        recommendedIntermodalData,
        rail_distance: checkReturnNullValue(laneDistance[0].dataValues.distance),
        rail_time: checkReturnNullValueFloat(laneDistance[0].dataValues.time),
        road_distance: checkReturnNullValue(laneDistance[0].dataValues.road_distance),
        road_time: checkReturnNullValueFloat(laneDistance[0].dataValues.road_time),
        rail_time_const: checkReturnNullValue(costByIntermodal[0].dataValues.rail_time_const),
        cost_per_mile: checkReturnNullValue(costByIntermodal[0].dataValues.cost_per_mile),
        emission_const,
        provider_image: checkReturnNullValue(railImage.dataValues.provider_image),
        carrier_image: checkReturnNullValue(railImage.dataValues.carrier_image),
        rail_provider: checkReturnNullValue(railImage.dataValues.rail_provider),
        carrier_code: checkReturnNullValue(railImage.dataValues.carrier_code)
      };

      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getIntermodalLaneData(initMainDbConnection: any, where: any) {
    return await initMainDbConnection.models.IntermodalLanes.findOne({
      attributes: ["id", "name", "route_number", "rail_provider", "provider_image", "carrier_image", "carrier_code"],
      where: where,
    });
  }

  async getRecommendedTerminalData(initMainDbConnection: any, intermodalLaneData: any) {
    let lane_id = intermodalLaneData.dataValues.id;
    return await initMainDbConnection.models.RecommendedIntermodalCoordinates.findAll({
      attributes: ["intermodal_lane_id", "latitude", "longitude"],
      where: { ["intermodal_lane_id"]: lane_id },
      order: [["id", "ASC"]],
    });
  }

  async getRecommendedIntermodalData(initMainDbConnection: any, intermodalLaneData: any, companySlug: string) {
    let lane_id = intermodalLaneData?.dataValues?.id;
    return await initMainDbConnection.query(
      `EXEC [greensight_master].recommendedIntermodalData 
     @lane_id = :lane_id,
     @company = :company
    `,
      {
        replacements: { lane_id: lane_id, company: companySlug },
        type: sequelize.QueryTypes.SELECT,
      }
    );
  }

  async getLaneDistance(initMainDbConnection: any, intermodalLaneData: any) {
    let lane_id = intermodalLaneData?.dataValues?.id;
    return await initMainDbConnection.models.IntermodalMetrix.findAll({
      attributes: ["distance", "time", "road_distance", "road_time"],
      where: { ["intermodal_lane_id"]: lane_id },
    });
  }

  async getCostByIntermodal(initMainDbConnection: any, intermodalLaneData: any) {
    let lane_id = intermodalLaneData.dataValues.id;
    return await initMainDbConnection.models.CostByIntermodal.findAll({
      attributes: ["rail_time_const", "cost_per_mile"],
      where: { ["intermodal_id"]: lane_id },
    });
  }

  async getConfigDataFn(initCompDbConnection: any) {
    return await initCompDbConnection.models.ConfigConstants.findOne({
      attributes: ['config_key', 'config_value'],
      where: { config_key: 'rail_intensity' }
    });
  }

  async getConfigDataThresValue(initCompDbConnection: any) {
    try {
      return await initCompDbConnection.models.ConfigConstants.findAll({
        attributes: ['config_key', 'config_value'],
        where: {
          config_key: {
            [Op.in]: ['threshold_distance_ev', 'optimus_radius', 'ev_radius', 'rng_radius', 'rd_radius', 'hydrogen_radius', 'hvo_radius', 'bio_21_100_radius', 'bio_1_20_radius', 'b99_radius']
          }
        }
      });
    }
    catch (err) {
      console.log(err, "err")
      throw err
    }
  }

  private calculateEmissionConst(getConfigData: any, laneIntensity: any) {
    let emission_const = getConfigData?.dataValues?.config_value / laneIntensity[0]?.dataValues?.average;
    return emission_const;
  }


  async getRailImage(initMainDbConnection: any, terminalData: any) {
    try {
      let terminalRailProvider = terminalData[0].terminal_company;
      terminalData = terminalRailProvider.split(',');
      return await initMainDbConnection.models.IntermodalLanes.findOne({
        attributes: ["id", "name", "route_number", "rail_provider", "provider_image", "carrier_image", "carrier_code"],
        where: { rail_provider: terminalData[0] },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async enrichEmissionDataWithSmartwayAsync(emissionData: any, carrierRanking: any) {
    for (const property of emissionData) {
      const smartwayData = carrierRanking.filter((item: any) => item.dataValues.code === property.dataValues.carrier);
      const result = smartwayData.filter(Boolean); // Filters out any falsy values
      property.dataValues.SmartwayData = result;
    }
  }

  /**
  * @description Gets lane carriers.
  * @param {string} name - The lane name.
  * @param {any} initMainDbConnection - The initialized main database connection.
  * @returns {Promise<any>} - The lane carriers data.
  */
  async getLaneCarriers(name: string, initCompDbConnection: any) {
    try {
      const where = this.buildWhereClause(name);

      let min_carrier_emission_reduction = await initCompDbConnection.models.ConfigConstants.findOne({
        attributes: ['config_key', 'config_value'],
        where: { 'config_key': 'min_carrier_emission_reduction' }
      });

      let query: any = {
        attributes: [
          [sequelize.literal('sum(emission)/sum(total_ton_miles)'), 'intensity'],
          [sequelize.literal(`sum(emission)/${convertToMillion}`), 'emissions'],
          [sequelize.literal('sum(shipments)'), 'shipment_count'],
          'carrier', 'carrier_name', 'carrier_logo'
        ],
        where: where,
        group: ['[CarrierEmissions].[carrier]',
          '[CarrierEmissions].[carrier_name]',
          '[CarrierEmissions].[carrier_logo]',
          '[carrierEmissionsReduction].[id]',
          '[carrierEmissionsReduction].[cost]',
          '[carrierEmissionsReduction].[emission_reduction]',
          '[carrierEmissionsReduction].[dollar_per_reduction]'],
        include: [
          {
            model: initCompDbConnection.models.CarrierEmissionReduction,
            attributes: ['cost', 'emission_reduction', 'dollar_per_reduction'],
            where: {
              'emission_reduction': {
                [Op.gt]: parseInt(min_carrier_emission_reduction.dataValues.config_value)
              },
              lane_name: name
            },
            as: 'carrierEmissionsReduction'
          },
        ],
        order: [[sequelize.literal('[carrierEmissionsReduction].[emission_reduction]'), "DESC"]]
      };
      let getVendorEmissionData = await initCompDbConnection.models.CarrierEmissions.findAll(query);
      // Check if vendor emission data was retrieved successfully.
      if (getVendorEmissionData) {

        let carrierCode = getVendorEmissionData.map((item: any) => item.carrier);
        let carrier_ranking = await getCarrierRanking(initCompDbConnection.models, carrierCode, Op);

        await this.enrichEmissionDataWithSmartwayAsync(getVendorEmissionData, carrier_ranking);

        // Return a successful response with the data.
        return getVendorEmissionData;
      } else {
        return null
      }
    } catch (error) {
      console.log(error);
    }
  }

  private buildWhereClause(name: string) {
    const where: any = { [Op.and]: [] };
    if (name) {
      where[Op.and].push({ 'name': name });
    }
    return where;
  }


}

export default LanePlanningController;
