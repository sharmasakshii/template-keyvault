import { Sequelize, Op } from "sequelize";
import { MyUserRequest } from "../../../interfaces/commonInterface";
import { generateResponse } from "../../../services/response";
import HttpStatusMessage from "../../../constant/responseConstant";
import { isPermissionChecked } from "../../../services/rolePermissionCheck";
import { callStoredProcedure, whereClauseFn, decryptByPassPhraseColumn } from "../../../services/commonServices";
const sequelize = require("sequelize");
import { addRadiusParams, buildProjectSummary, calculateMaxFuelStopsKSort, capitalizeFirstLetter, checkNUllValue, filterAndSortLanes, getCarrierRanking, getIntermodalLaneDetail, isCompanyEnable } from "../../../utils"
import { comapnyDbAlias, convertToMillion } from "../../../constant";
import moment from "moment";
import { projectSummary } from "../../../email_template/project_summary";
import { azurEmailFunction } from "../../../emailSender/emailSentWithAttachment";
import { decryptDataFunction } from "../../../services/encryptResponseFunction";
const randomstring = require("randomstring");
const baseUrl: any = process.env.BASE_URL;

class ProjectController {
  // Private property for the database connection (Sequelize instance)
  private readonly connection: Sequelize;

  // Constructor to initialize the database connection for each instance
  constructor(connectionData: Sequelize) {
    this.connection = connectionData; // Assign the passed Sequelize instance to the private property
  }

  async deleteProject(req: MyUserRequest, res: Response): Promise<Response> {
    try {
      const connection: any = this.connection;
      // Read the request body
      let { project_id } = await req.body;
      const projectData = await connection[connection.company]["models"].Project.update(
        { is_deleted: 1 },
        { where: { id: project_id }, });
      if (projectData) {
        return generateResponse(
          res,
          200,
          true,
          "Project deleted successfully.",
          projectData
        );
      } else {
        return generateResponse(res, 200, true, "Project not found.");
      }
    } catch (error) {
      console.error(error);
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }

  async getProjectList(req: MyUserRequest, res: Response): Promise<Response> {
    try {
      const connection: any = this.connection;
      const { project_name, project_unique_id, year, lever, search } = req.body;
      const loggenInUser = connection["userData"];

      if (connection.company == comapnyDbAlias.ADM || connection.company == comapnyDbAlias.TQL) {
        return generateResponse(res, 200, true, "Project listing fetched successfully", []);
      }

      // Determine permissions
      const permissionsData = loggenInUser.permissionsData;
      const CASPermission = isPermissionChecked(permissionsData, "CAS").isChecked;
      const AMSPermission = isPermissionChecked(permissionsData, "AMS").isChecked;
      // Determine project type
      const project_type = this.getProjectType(CASPermission, AMSPermission);

      // Prepare query replacements
      let replacements: any = {
        project_name: checkNUllValue(project_name),
        project_unique_id: checkNUllValue(project_unique_id),
        search: checkNUllValue(search),
        lever: checkNUllValue(lever),
        year: checkNUllValue(year),
        project_type,
      };

      if (isCompanyEnable(connection.company, [comapnyDbAlias.PEP])) {
        replacements['division_id'] = checkNUllValue(loggenInUser.division_id);
      } else {
        replacements['region_id'] = checkNUllValue(loggenInUser.region_id);
      }
      // Execute stored procedure
      const projectData = await this.fetchProjectData(connection, replacements);
      if (projectData.length === 0) {
        return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
      }

      // Fetch fuel data
      const fuelData = await this.fetchFuelData(connection);

      // Categorize and process projects
      const categorizedProjects = await this.processProjects(
        projectData,
        connection,
        CASPermission,
        AMSPermission
      );

      // Prepare response
      const data = {
        length: projectData.length,
        ...categorizedProjects,
        ...fuelData,
      };

      return generateResponse(
        res,
        200,
        true,
        "Project listing fetched successfully",
        data
      );
    } catch (error) {
      console.error(error);
      return generateResponse(
        res,
        500,
        false,
        HttpStatusMessage.INTERNAL_SERVER_ERROR
      );
    }
  }

  private getProjectType(CASPermission: boolean, AMSPermission: boolean): string {
    let project_type = "";
    if (AMSPermission) project_type = "alternative_fuel,modal_shift";
    if (CASPermission) project_type = `${project_type},carrier_shift`;
    return project_type;
  }

  private async fetchProjectData(connection: any, replacements: any): Promise<any[]> {
    let query = `EXEC ${connection["schema"]}.getprojectslist
                   @project_name = :project_name,
                   @project_unique_id = :project_unique_id,
                   @search = :search,
                   @lever = :lever,
                   @year = :year,
                   @project_type = :project_type`;

    if (isCompanyEnable(connection.company, [comapnyDbAlias.PEP])) {
      query += `, @division_id = :division_id`;
    } else {
      query += `, @region_id = :region_id`;
    }

    return callStoredProcedure(replacements, connection[connection.company], query);
  }

  private async fetchFuelData(connection: any): Promise<any> {
    const ev_fuel_stop = await connection["main"].models.ProductType.findOne({ where: { code: "EV" } });
    const rd_fuel_stop = await connection["main"].models.ProductType.findOne({ where: { code: "RD" } });
    const fuel_stops = await connection["main"].models.ProductType.findAll({ where: { is_access: 1 } });

    return {
      ev_fuel_stop,
      rd_fuel_stop: checkNUllValue(rd_fuel_stop),
      fuel_stops,
    };
  }

  private async processProjects(
    projectData: any[],
    connection: any,
    CASPermission: boolean,
    AMSPermission: boolean
  ): Promise<any> {
    const modal_shift: any[] = [];
    const alternative_fuel: any[] = [];
    const carrier_shift: any[] = [];

    for (const project of projectData) {
      // Categorize projects based on permissions
      if (project.type === "modal_shift" && AMSPermission) {
        let data = {
          rail_distance: project.rail_distance,
          rail_time: project.rail_distance,
          road_distance: project.road_distance,
          road_time: project.road_time,
          rail_time_const: project.rail_time_const,
          cost_per_mile: project.cost_per_mile,
          emission_const: project.emission_const,
          emission_intensity: project.emission_intensity,
        };
        project.laneIntermodalCordinateData = data;
        modal_shift.push(project);
      } else if (project.type === "carrier_shift" && CASPermission) {
        carrier_shift.push(project);
      } else if (project.type === "alternative_fuel" && AMSPermission) {
        alternative_fuel.push(project);
      }
    }

    return { modal_shift, alternative_fuel, carrier_shift };
  }

  /**
 * @description API to get project details.
 * @param {id} request
 * @version V.1
 * @returns
 */
  async getProjectDetails(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {
    try {
      const connection: any = this.connection;
      const { id } = request.body;
      let company = connection.company;
      const loggedInUser = connection["userData"];

      if (checkNUllValue(loggedInUser.region_id)) {
        let replacements = { project_id: id, region_id: loggedInUser.region_id };
        const query = `EXEC ${connection["schema"]}.GetProjectRegionalAccessStatus 
                   @ProjectId = :project_id,
                   @RegionId = :region_id`;
        let isRegionalAccess = await callStoredProcedure(replacements, connection[connection.company], query);
        if (isRegionalAccess.length == 0) {
          return generateResponse(res, 403, false, `You are not authorized to access this project.`);
        }
      }

      const where: any = { [Op.and]: [{ id }, { is_deleted: 0 }] };
      if (loggedInUser?.division_id) {
        where[Op.and].push({ division_id: loggedInUser?.division_id });
      }
      const projectDetails = await this.fetchProjectDetails(connection, where, company);
      if (!projectDetails) {
        return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
      }

      // Determine permissions
      const permissionsData = loggedInUser.permissionsData;
      const CASPermission = isPermissionChecked(permissionsData, "CAS").isChecked;
      const AMSPermission = isPermissionChecked(permissionsData, "AMS").isChecked;
      if ((projectDetails.type == 'carrier_shift' && !CASPermission)
        ||
        ((projectDetails.type == 'alternative_fuel' || projectDetails.type == 'modal_shift') && !AMSPermission)) {
        return generateResponse(res, 403, false, `You are not authorized to access this project.`);
      }

      const invitedUsers = await this.fetchInvitedUsers(connection, projectDetails.id);
      const userDetails = await this.fetchUserDetails(connection, projectDetails.manager_id, invitedUsers);

      const laneData = await this.fetchLaneData(connection, projectDetails.lane_id);
      const laneEmissionData = laneData
        ? await this.fetchLaneEmissions(connection, laneData.name)
        : null;

      const laneRecommendation = laneData ? await this.fetchLaneRecommendations(connection, projectDetails, company, laneData) : null;

      const fuelStops = await this.fetchFuelStops(connection);

      const data = {
        ev_fuel_stop: fuelStops.ev,
        rd_fuel_stop: fuelStops.rd,
        projectDetail: projectDetails,
        allUsersDaetails: userDetails.allUsers,
        managerData: userDetails.manager,
        laneData: laneData,
        laneEmissionData: laneEmissionData[0],
        laneRecommendation: laneRecommendation,
        fuel_stops: fuelStops.all,
      };

      return generateResponse(res, 200, true, "Project Details Fetched!", data);
    } catch (error) {
      console.error(error);
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }

  // Helper Functions
  private async fetchProjectDetails(connection: any, where: any, company: string) {
    const baseAttributes = [
      "id",
      "project_name",
      "start_date",
      "end_date",
      "desc",
      "type",
      "project_unique_id",
      "recommendation_id",
      "lane_id",
      "manager_id",
      "is_ev",
      "is_rd",
      "fuel_type",
      "threshold_distance",
      [
        sequelize.literal(`REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(
                  REPLACE(
                    LOWER(fuel_type),
                    'b100', 'B100'
                  ),
                  'b21_99', 'B21 to B99'
                ),
                'b1_20', 'Upto B20'
              ),
              'ev', 'EV Pepsi'
            ),
            'rd', 'Renewable Diesel'
          ),
          'optimus', 'OPTIMUS'
        ),
        'rng', 'RNG'
      ),
      'hydrogen', 'Hydrogen'
    )`),
        'fuel_type_name'
      ],
      "is_alternative",
      "bio_1_20_radius",
      "bio_21_99_radius",
    ];



    const extraAttributes = [
      ...(isCompanyEnable(company, [comapnyDbAlias.PEP, comapnyDbAlias.GEN]) ? ["bio_100_radius", "rd_radius", "rng_radius", "hydrogen_radius"] : []),
      ...(isCompanyEnable(company, [comapnyDbAlias.PEP]) ? ["ev_radius", "hvo_radius", "optimus_radius",] : []),
      ...(isCompanyEnable(company, [comapnyDbAlias.GEN]) ? ["b99_radius",] : []),
      ...(isCompanyEnable(company, [comapnyDbAlias.PEP, comapnyDbAlias.RBL]) ? ["bio_100_radius", "rd_radius", "rng_radius"] : [])
    ];

    const attributes = [...baseAttributes, ...extraAttributes];

    return await connection[connection.company].models.Project.findOne({
      attributes,
      where,
    });
  }

  private async fetchInvitedUsers(connection: any, projectId: number) {
    return await connection[connection.company].models.ProjectInvite.findAll({
      where: { project_id: projectId },
    });
  }

  private async fetchUserDetails(connection: any, managerId: number, invitedUsers: any[]) {
    const userIds = [managerId, ...invitedUsers.map((user) => user.dataValues.user_id)];
    const users = await connection['main'].models.User.findAll({
      attributes: ['id', 'name', [decryptByPassPhraseColumn(process.env.EMAIL_PHONE_PASSPHRASE, 'email'), 'email']],
      where: { id: { [sequelize.Op.in]: userIds } },
      include: [
        {
          model: connection['main'].models.Profile,
          attributes: ["first_name", "last_name", "country_code",
            [decryptByPassPhraseColumn(process.env.EMAIL_PHONE_PASSPHRASE, 'phone_number'), "phone_number"],
            "image", "title"],
          as: "profile"
        },
      ],
    });

    const allUsers = [];
    let manager = null;

    for (const user of users) {
      if (user.dataValues.id === managerId) {
        manager = user;
      } else {
        allUsers.push(user);
      }
    }

    return { allUsers, manager };
  }

  private async fetchLaneData(connection: any, laneId: number) {
    return await connection['main'].models.Lane.findOne({
      attributes: [["name", "name"], ["id", "id"]],
      where: { id: laneId },
    });
  }

  private async fetchLaneEmissions(connection: any, laneName: string) {
    return await connection[connection.company].models.EmissionLanes.findAll({
      attributes: [
        [sequelize.literal("(sum(emission) / sum(total_ton_miles))"), "intensity"],
        [sequelize.literal(`sum(emission)/${convertToMillion}`), "emissions"],
        [sequelize.literal("sum(shipments)"), "shipment_count"],
        [sequelize.literal("sum(total_ton_miles)"), "total_ton_miles"],
        "name",
      ],
      where: { name: laneName },
      group: ["name"],
    });
  }

  private async fetchLaneRecommendations(connection: any, project: any, company: string, laneData: any) {
    const radiusParams = {
      bio_1_20_radius: project.dataValues.bio_1_20_radius,
      ...(isCompanyEnable(company, [comapnyDbAlias.PEP, comapnyDbAlias.GEN]) && {
        bio_100_radius: project.dataValues.bio_100_radius,
        rd_radius: project.dataValues.rd_radius,
        rng_radius: project.dataValues.rng_radius,
        hydrogen_radius: project.dataValues.hydrogen_radius,
        bio_21_99_radius: project.dataValues.bio_21_99_radius,
      }),
      ...(isCompanyEnable(company, [comapnyDbAlias.PEP]) && {
        ev_radius: project.dataValues.ev_radius,
        optimus_radius: project.dataValues.optimus_radius,
        hvo_radius: project.dataValues.hvo_radius,
        bio_21_99_radius: project.dataValues.bio_21_99_radius,
      }),
      ...(isCompanyEnable(company, [comapnyDbAlias.GEN]) && {
        b99_radius: project.dataValues.b99_radius
      }),
      ...(isCompanyEnable(company, [comapnyDbAlias.RBL]) && {
        bio_100_radius: project.dataValues.bio_100_radius,
        rd_radius: project.dataValues.rd_radius,
        rng_radius: project.dataValues.rng_radius,
        bio_21_99_radius: project.dataValues.bio_21_99_radius,
      })
    };

    const query = `EXEC greensight_master.kLanesRecommended
      @lane_id = :lane_id,
      @company=:company,
      ${Object.keys(radiusParams).map((key) => `@${key} = :${key}`).join(", ")}
    `;
    let replacements = { lane_id: project.lane_id, company: company, ...radiusParams };

    const recommendedLanes: any = await callStoredProcedure(replacements, connection['main'], query);
    return await this.processRecommendations(connection, recommendedLanes, project, laneData, company, radiusParams);
  }

  private async fetchFuelStops(connection: any) {
    const ev = await connection['main'].models.ProductType.findOne({ where: { code: 'EV' } });
    const rd = await connection['main'].models.ProductType.findOne({ where: { code: 'RD' } });
    const all = await connection['main'].models.ProductType.findAll({ where: { is_access: 1 } });

    return { ev, rd, all };
  }

  private async processRecommendations(
    connection: any,
    recommendedLanes: any,
    getProject: any,
    laneData: any,
    company: any,
    objRadius: any
  ): Promise<any> {
    let laneRecommendation: any = {};
    let recommendedLane: any = {};
    let baseLane: any = {};
    const lane_id = getProject.dataValues.lane_id;
    let base;

    if (recommendedLanes.length) {
      const laneArray = await filterAndSortLanes(recommendedLanes);
      if (laneArray.length) {
        base = laneArray[0];
        baseLane = await this.recommendLaneFun(
          connection["main"],
          base?.k_count,
          getProject,
          company,
          objRadius
        );

        if (getProject.dataValues.type === "alternative_fuel") {
          recommendedLane = await this.recommendLaneFun(
            connection["main"],
            getProject?.dataValues?.recommendation_id,
            getProject,
            company,
            objRadius
          );
        }

        if (getProject.dataValues.type === "modal_shift") {
          laneRecommendation["laneIntermodalCordinateData"] =
            await getIntermodalLaneDetail(
              laneData?.dataValues?.name,
              connection["main"],
              connection
            );
        }

        laneRecommendation["baseLine"] = baseLane;
        laneRecommendation["recommendedLane"] = recommendedLane;
      }
    }

    if (getProject.dataValues.type === "carrier_shift") {
      laneRecommendation["getCarriesOfLane"] = await this.getLaneCarriers(
        laneData?.dataValues?.name,
        connection
      );
    }

    const delta_metrix: any = await this.fetchDeltaMetrics(connection, lane_id, baseLane, base);;

    laneRecommendation["delta_metrix"] = delta_metrix;

    return laneRecommendation;
  }

  private async fetchDeltaMetrics(connection: any, lane_id: number, baseLane: any = null, base: any = null) {
    const deltaMetrics: any = {};

    // Fetch cost per mile for the lane
    const costByLane = await connection["main"].models.CostByLane.findOne({
      attributes: ["lane_id", "dollar_per_mile"],
      where: { lane_id },
    });

    deltaMetrics["dollar_per_mile"] = checkNUllValue(costByLane?.dataValues?.dollar_per_mile);
    // If baseLane is provided, populate metrics from baseLane and base
    if (baseLane && Object.keys(baseLane).length > 0) {
      deltaMetrics["distance"] = checkNUllValue(base.distance);
      deltaMetrics["time"] = checkNUllValue(baseLane.highwayLaneMetrix.dataValues.time);
    } else {
      let highwayLaneMetrix = await connection["main"].models.HighwayLaneMetrix.findAll({
        attributes: [
          [sequelize.fn('MIN', sequelize.col('distance')), 'distance'],
          'time',
          'cost'
        ],
        where: { lane_id: lane_id },
        group: ['time', 'cost'],
      });
      deltaMetrics["distance"] = highwayLaneMetrix[0].dataValues.distance || null;
      deltaMetrics["time"] = highwayLaneMetrix[0].dataValues.time || null;
    }

    return deltaMetrics;
  }


  private async recommendLaneFun(initMainDbConnection: any, k_count: any, project: any, company: any, objRadius: any) {
    try {
      let { lane_id, fuel_type, is_ev } = project.dataValues;
      const where: any = {};
      where[Op.and] = [];
      if (lane_id) {
        where[Op.and].push({ ["lane_id"]: lane_id });
      }

      let recommendedKLaneCoordinate =
        await initMainDbConnection.models.RecommendedKLaneCoordinate.findAll({
          attributes: ["lane_id", "latitude", "longitude"],
          where: { lane_id: lane_id, k_count: k_count },
          order: [["id", "ASC"]],
        });
      if (recommendedKLaneCoordinate.length == 0) {
        return null;
      }

      where[Op.and] = [];
      if (lane_id) {
        where[Op.and].push({ ["id"]: lane_id });
      }

      if (is_ev) {
        fuel_type = `${fuel_type}, EV`
      };

      let query = `EXEC [greensight_master].getProjectRecommendedFuelstops 
       @lane_id = :lane_id,
       @k_count=:k_count , 
       @includedCodeStr = :includedCodeStr,
       @bio_1_20_radius=:bio_1_20_radius`;

      query = addRadiusParams(company, query)

      let replacements = { lane_id: lane_id, k_count: k_count, includedCodeStr: fuel_type, ...objRadius };

      // Final query
      const recommendedKLaneFuelStop = await callStoredProcedure(replacements, initMainDbConnection, query);

      if (recommendedKLaneFuelStop.length == 0) {
        return null;
      }

      let highwayLaneMetrix =
        await initMainDbConnection.models.HighwayLaneMetrix.findOne({
          attributes: ["distance", "time", "cost"],
          where: { lane_id: lane_id, k_count: k_count },
        });

      let costByLane = await initMainDbConnection.models.CostByLane.findOne({
        attributes: ["lane_id", "dollar_per_mile"],
        where: { lane_id: lane_id },
      });
      if (costByLane?.dataValues) {
        costByLane.dataValues["k_count"] = k_count;
      }

      let { maxTimeFuelStop } = await calculateMaxFuelStopsKSort(
        recommendedKLaneFuelStop
      );
      let data = {
        recommendedKLaneCoordinate,
        recommendedKLaneFuelStop,
        fuel_stop: maxTimeFuelStop,
        highwayLaneMetrix,
        costByLane,
      };
      return data;
    } catch (error) {
      console.log("error ", error);
    }
  }

  /**
   * @description Gets lane carriers.
   * @param {string} name - The lane name.
   * @param {any} initMainDbConnection - The initialized main database connection.
   * @returns {Promise<any>} - The lane carriers data.
   */
  async getLaneCarriers(name: string, connection: any) {
    try {

      const payload = [{ name: name }]
      const where: any = {};
      where[Op.and] = [];
      const whereClause = await whereClauseFn(payload)
      where[Op.and] = [...where[Op.and], ...whereClause[Op.and]]

      let min_carrier_emission_reduction = await connection[connection.company].models.ConfigConstants.findOne({
        attributes: ['config_key', 'config_value'],
        where: { 'config_key': 'min_carrier_emission_reduction' }
      });

      let query: any = {
        attributes: [
          [
            sequelize.literal(
              "sum(CAST(emission AS DECIMAL(35,10)))/sum(CAST(total_ton_miles  AS DECIMAL(35,10)))"
            ),
            "intensity",
          ],
          [
            sequelize.literal(`sum(emission)/${convertToMillion}`),
            "emissions",
          ],
          [
            sequelize.literal("sum(CAST(shipments  AS DECIMAL(35,10)))"),
            "shipment_count",
          ],
          "carrier",
          "carrier_name",
          "carrier_logo",
        ],
        where: where,
        group: [
          "[CarrierEmissions].[carrier]",
          "[CarrierEmissions].[carrier_name]",
          "[CarrierEmissions].[carrier_logo]",
          "[carrierEmissionsReduction].[id]",
          "[carrierEmissionsReduction].[cost]",
          "[carrierEmissionsReduction].[emission_reduction]",
          "[carrierEmissionsReduction].[dollar_per_reduction]",
        ],
        include: [
          {
            model: connection[connection.company].models.CarrierEmissionReduction,
            attributes: ["cost", "emission_reduction", "dollar_per_reduction"],
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

      let getVendorEmissionData = await connection[connection.company].models.CarrierEmissions.findAll(query);

      // Check if vendor emission data was retrieved successfully.
      if (getVendorEmissionData) {
        let carrierCode = getVendorEmissionData.map((item: any) => item.carrier);
        let carrier_ranking = await getCarrierRanking(
          connection[connection.company].models,
          carrierCode,
          Op
        );

        this.addSmartwayData(getVendorEmissionData, carrier_ranking);
        // Return a successful response with the data.
        return getVendorEmissionData;
      }

      return null;

    } catch (error) {
      console.log(error);
    }
  }

  private addSmartwayData(vendorEmissionData: any, carrierRanking: any) {
    vendorEmissionData.forEach((item: any) => {
      const smartwayData = carrierRanking.filter((rank: any) => rank.dataValues.code === item.carrier);
      item.dataValues.SmartwayData = smartwayData;
    });
  }



  async getProjectSearchList(
    req: MyUserRequest,
    res: Response
  ): Promise<Response> {
    const authenticate: any = this.connection;
    try {
      let query = req.body;
      const where = this.buildWhereQuery(query);
      const projectData = await authenticate[
        authenticate.company
      ].models.Project.findAll({
        attributes: ["project_name", "project_unique_id"],
        where: where,
      });

      if (projectData.length > 0) {
        for (const property of projectData) {
          property.project_name = checkNUllValue(property.project_name);
        }
        return generateResponse(
          res,
          200,
          true,
          "Project Search listing fetched Successfully",
          projectData
        );
      } else {
        return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
      }
    } catch (error) {
      return generateResponse(
        res,
        500,
        false,
        HttpStatusMessage.INTERNAL_SERVER_ERROR
      );
    }
  }

  async saveProjectRating(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {
    // Authenticate the request using JWT middleware
    const authenticate: any = this.connection;
    try {
      let { project_id, description, rating } = request.body;
      const RatingData = await authenticate[
        authenticate.company
      ].models.ProjectFeedback.create({
        project_id: project_id,
        user_id: authenticate["userData"].id,
        rating: rating,
        description: description,
      }).then(function (obj: any) {
        return obj;
      });
      if (RatingData) {
        return generateResponse(
          res,
          200,
          true,
          "Project Rating Submited Successfully.",
          RatingData
        );
      } else {
        return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
      }
    } catch (error) {
      console.log(error)
      return generateResponse(
        res,
        500,
        false,
        HttpStatusMessage.INTERNAL_SERVER_ERROR
      );
    }
  }

  private buildWhereQuery(query: any) {
    let { region_id } = query;
    const where: any = {};
    where[Op.and] = [{ is_deleted: 0 }];
    if (region_id) {
      where[Op.and].push({
        region_id: region_id,
      });
    }
    return where;
  }

  /**
 * @description API to save project details.
 * @param {region_id, project_name, description, start_date, end_date, manager_name,
 * manager_email, type, decarb_id, customize_emission, emission_percent, actual_emission} req
  * @version V.1
  * @returns
  */
  async saveProject(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {

    try {
      let authenticate: any = this.connection;
      request.body = decryptDataFunction(request.body.payload);
      const {
        project_name,
        description,
        start_date,
        end_date,
        manager_id,
        type,
        lane_id,
        recommendation_id,
        users_invited,
        product_type_code,
        carrier_code,
        is_alternative,
        is_ev,
        is_rd,
        fuel_type,
        project_summary,
        rd_radius,
        bio_1_20_radius,
        bio_100_radius,
        bio_21_99_radius,
        ev_radius,
        optimus_radius,
        rng_radius,
        hydrogen_radius,
        hvo_radius,
        b99_radius,
        threshold_distance
      } = request.body;
      const project_type = type;
      const emailInvites = [];

      if (project_name.length > 50) {
        return generateResponse(
          res,
          422,
          false,
          "Name exceeds the character limit (50 characters)."
        );
      }

      if (description.length > 250) {
        return generateResponse(
          res,
          422,
          false,
          "Description exceeds the character limit (250 characters)."
        );
      }

      const isInValid = await this.isLaneValid({ laneId: lane_id, projectType: type, authenticate, recommendation_id });
      if (!isInValid) {
        return generateResponse(res, 200, true, "Not a valid lane.", {});
      }

      let randomString = randomstring.generate(10);
      let startDate = moment(start_date).format("YYYY-MM-DD HH:mm:ss");
      let endDate = moment(end_date).format("YYYY-MM-DD HH:mm:ss");

      let attr = ["region_id"];
      if (isCompanyEnable(authenticate.company, [comapnyDbAlias.PEP, comapnyDbAlias.GEN])) {
        attr.push("division_id")
      }

      const laneName = await authenticate[authenticate.company].models.Lane.findOne({
        attributes: ['id', 'name'], // Ensure 'name' is selected
        where: { id: lane_id },
        include: [
          {
            model: authenticate[authenticate.company].models.EmissionLanes,
            attributes: attr,
            as: 'laneDetails'
          }
        ],
        raw: true
      });

      const projectDataObj: any = {
        project_unique_id: randomString,
        manager_id: manager_id,
        project_name: project_name,
        desc: description,
        start_date: startDate,
        status: 1,
        type: type,
        end_date: endDate,
        lane_id: lane_id,
        recommendation_id: recommendation_id, // recommendation_id is lane k_count
        is_deleted: 0,
        product_type_code: product_type_code,
        carrier_code: carrier_code,
        is_alternative: is_alternative,
        is_ev: is_ev,
        is_rd: is_rd,
        fuel_type: fuel_type,
        rd_radius,
        bio_1_20_radius,
        bio_100_radius,
        bio_21_99_radius,
        ev_radius,
        optimus_radius,
        rng_radius,
        hydrogen_radius,
        hvo_radius,
        b99_radius,
        region_id: laneName?.[`laneDetails.region_id`],
        threshold_distance
      };

      if (isCompanyEnable(authenticate.company, [comapnyDbAlias.PEP, comapnyDbAlias.GEN])) {
        projectDataObj.division_id = laneName?.[`laneDetails.division_id`]
      }

      const ProjectData = await authenticate[authenticate.company].models.Project.create(projectDataObj);
      emailInvites.push(manager_id);

      const carrier_code_list = await authenticate[authenticate.company].models.CarrierLogo.findAll({
        attributes: ['carrier_code', 'carrier_name']
      });

      //Assigning users for project.
      let invites = [];
      for (const userId of users_invited) {
        invites.push({
          user_id: userId,
          project_id: ProjectData.dataValues.id
        });
        emailInvites.push(userId);
      }
      await authenticate[authenticate.company].models.ProjectInvite.bulkCreate(
        invites
      );

      const removeDuplicates = [...new Set(emailInvites)];
      let userEmails = await authenticate[authenticate.company].models.GetUserDetails.findAll({
        attributes: [[decryptByPassPhraseColumn(process.env.EMAIL_PHONE_PASSPHRASE, 'user_email'), 'user_email'], 'user_name', 'user_id'],
        where: { user_id: removeDuplicates }
      });
      let inviteData = userEmails.filter((prop: any) => (prop.dataValues.user_id != manager_id));
      let inviteObject = inviteData.map((prop: { dataValues: { user_email: any; user_name: any; }; }) =>
        ({ address: prop.dataValues.user_email, displayName: prop.dataValues.user_name }));
      let manager_data = userEmails.find((x: { dataValues: { user_id: any; }; }) => x.dataValues.user_id == manager_id);
      let projectSummaryHtml = buildProjectSummary(project_summary, carrier_code_list, project_type, is_alternative);
      let html = await projectSummary();
      html = html.replace('#PROJECT_NAME#', project_name);
      html = html.replace('#SUGGESTED_CHANGES#', capitalizeFirstLetter(type.replace(`_`, ' ')));
      html = html.replace('#DESCRIPTION#', description);
      html = html.replace('#LANE_NAME#', laneName.name);
      if (projectSummaryHtml) {
        for (const property in projectSummaryHtml) {
          html = html.replace(`#${property}#`, (projectSummaryHtml[property]) ? projectSummaryHtml[property] : '');

        }
      }
      html = html.replace(/#base_url#/g, baseUrl);
      let emailObject = {
        subject: 'Project Summary',
        html: html,
        module: 'Save Project',
        to: [{
          address: manager_data.dataValues.user_email,
          displayName: manager_data.dataValues.user_name
        }],
        cc: inviteObject
      };

      azurEmailFunction(emailObject, authenticate[authenticate.company].models);

      return generateResponse(
        res,
        200,
        true,
        "Project Created Successfully.",
        ProjectData
      );
    } catch (error) {
      console.log(error);
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }

  async isLaneValid({
    laneId,
    projectType,
    authenticate,
    recommendation_id
  }: {
    laneId: any;
    projectType: string;
    authenticate: any;
    recommendation_id: any
  }): Promise<boolean> {
    if (projectType !== 'carrier_shift' && projectType !== 'modal_shift' && projectType !== 'alternative_fuel') return false;

    const replacements = {
      lane_id: laneId,
      project_type: projectType,
    };

    const query = `EXEC ${authenticate?.schema}.GetLaneValidationforProject 
    @lane_id = :lane_id, 
    @project_type = :project_type`;

    try {
      const result = await callStoredProcedure(
        replacements,
        authenticate[authenticate?.company],
        query
      );
      if (result.length > 0 && result[0]?.valid) {
        if (projectType === 'alternative_fuel') {
          let recommendedKLaneCoordinate =
            await authenticate['main'].models.RecommendedKLaneCoordinate.findAll({
              attributes: ["lane_id", "latitude", "longitude"],
              where: { lane_id: laneId, k_count: recommendation_id },
              order: [["id", "ASC"]],
            });
          if (recommendedKLaneCoordinate.length == 0) {
            return false;
          } else {
            return true;
          }
        }
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error validating lane:", error);
      return false; // assume invalid if error
    }
  }


  async searchUserByEmail(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {
    try {
      let authenticate: any = this.connection;
      let { email } = request.body;
      let company = authenticate['userData']['companies'][0].db_alias;

      let getAllUsers: any = await authenticate['main'].models.User.findAll({
        attributes: ["id", "name", [decryptByPassPhraseColumn(process.env.EMAIL_PHONE_PASSPHRASE, 'email'), 'email']],
        where: {
          [Op.and]: [
            sequelize.where(
              decryptByPassPhraseColumn(process.env.EMAIL_PHONE_PASSPHRASE, 'email'),
              {
                [Op.like]: `%${email}%`, // Use LIKE operator for partial matching
              } // Compares the decrypted value with the email
            ),
            { status: 1 },
            { is_deleted: 0 }
          ]
        },
        include: [
          {
            model: authenticate['main'].models.Company,
            attributes: ["name", "db_alias"],
            as: "companies",
            where: {
              db_alias: company
            }
          },
        ],
      });

      //check password is matched or not then exec
      if (getAllUsers.length > 0) {
        return generateResponse(res, 200, true, "List of Users.", getAllUsers);
      } else {
        return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
      }
    } catch (error) {
      console.log(error);
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }

  async getProjectCount(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {
    let authenticate: any = this.connection;

    try {

      let { region_id, year, division_id } = request.body;
      const where: any = {}
      where[Op.and] = [{ is_deleted: 0 }]
      if (region_id) {
        where[Op.and].push({
          region_id: region_id
        })
      }
      if (division_id) {
        where[Op.and].push({
          division_id: division_id
        })
      }
      if (year) {
        year = parseInt(year);
        where[Op.and].push(Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('createdAt')), year))
      }
      let getProject = await authenticate[authenticate.company].models.Project.findAll({
        attributes: [
          'id',
          'status',
          'manager_id',
        ],
        where: where,
        include: [
          {
            model: authenticate[authenticate.company].models.ProjectInvite,
            attributes: ['user_id'],
            as: "projectInvite"
          }
        ],
      });

      if (getProject.length > 0) {
        const data = {
          Inactive: getProject.filter((res: any) => res.dataValues.status == 0).length,
          active: getProject.filter((res: any) => res.dataValues.status == 1).length,
          Total: getProject.length
        }
        return generateResponse(res, 200, true, "Active/Inactive count", data);
      }
      else {
        return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
      }
    } catch (error) {
      console.log(error, "error");
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }

}

export default ProjectController;
