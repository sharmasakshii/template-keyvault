import { Response } from "express";
import { Sequelize } from "sequelize";
import { whereClauseFn } from "../../../services/commonServices";

import HttpStatusMessage from "../../../constant/responseConstant";
import { generateResponse } from "../../../services/response";
import { MyUserRequest } from "../../../interfaces/commonInterface";
import { comapnyDbAlias, convertToMillion } from "../../../constant";
import { isCompanyEnable } from "../../../utils";
const sequelize = require("sequelize");
const Op = sequelize.Op;

class CommonController {
  // Private property for the database connection (Sequelize instance)
  private readonly connection: Sequelize;

  // Constructor to initialize the database connection for each instance
  constructor(connectionData: Sequelize) {
    this.connection = connectionData; // Assign the passed Sequelize instance to the private property
  }


  async saveUrl(request: MyUserRequest, res: Response): Promise<Response> {
    const clientIp = request.get("x-forwarded-for") || "0.0.0.0";

    try {
      const connection: any = this.connection;

      // Parse the request body directly (Express stores the parsed body in request.body)
      const { url } = request.body;

      if (!url) {
        return generateResponse(res, 400, false, "URL not provided");
      }

      // Create a record in UserAnalytics
      const userId = connection.userData.id;


      await connection["main"].models.UserAnalytics.create({
        name: url.split("/")[1],
        action_url: url,
        user_id: userId,
        client_ip: clientIp,
      });

      return generateResponse(res, 200, true, "URL saved successfully.");
    } catch (error) {
      console.log("err", error)
      return generateResponse(
        res,
        500,
        false,
        HttpStatusMessage.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getCMSContent(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {
    try {
      const authenticate: any = this.connection;
      // Parse the request body directly (Express stores the parsed body in request.body)
      const { page_slug } = request.body;

      let cmsPagesContent = await authenticate[
        authenticate.company
      ].models.CmsPages.findOne({
        where: {
          page_slug: page_slug,
        },
      });

      if (cmsPagesContent) {
        return generateResponse(
          res,
          200,
          true,
          "page detail.",
          cmsPagesContent
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

  async getUserNotifications(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {
    try {
      const authenticate: any = this.connection;
      const loggenInUser = authenticate?.userData.id;

      // Parse the request body directly (Express stores the parsed body in request.body)

      const notificationList = await authenticate[
        authenticate.company
      ].models.Notification.findAll({
        where: {
          is_deleted: 0,
          [Op.or]: [{ receiver_id: loggenInUser }, { receiver_id: null }],
        },
        order: [["created_on", "DESC"]],
      });

      if (notificationList?.length > 0) {
        return generateResponse(
          res,
          200,
          true,
          "notification list.",
          notificationList
        );
      } else {
        return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
      }
    } catch (error) {
      console.log(error, " err")
      return generateResponse(
        res,
        500,
        false,
        HttpStatusMessage.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getConfigConstants(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {
    try {
      const authenticate: any = this.connection;
      // Parse the request body directly (Express stores the parsed body in request.body)
      const { region_id, division_id, targetValues, carrierIntensity } = request.body;
      const configDetail = await authenticate[
        authenticate.company
      ].models.ConfigConstants.findAll({
        attributes: ["config_key", "config_value"],
      });
      if (configDetail?.length > 0) {
        const data: any = {};
        for (const property of configDetail) {
          data[property.config_key] = property.config_value;
        }
        if (targetValues) {
          let reductionData: any = {};
          if (isCompanyEnable(authenticate.company, [comapnyDbAlias.PEP, comapnyDbAlias.BMB])) {
            reductionData = await this.emissionReductionToCurrentYearPeriodWise(authenticate[authenticate.company].models, {}, region_id, authenticate, division_id, authenticate.company);
            data["CURRENT_PERIOD"] = reductionData?.currentPeriod
          } else {
            reductionData = await this.emissionReductionToCurrentYear(authenticate[authenticate.company].models, {}, region_id, authenticate, division_id);
          }
          data['EMISSION_REDUCTION_TARGET_2'] = reductionData?.emissionReductionToCurrentYearPercent;
          data['GAP_TO_TARGET'] = reductionData?.gapEmissionPercent;
        }
        if (carrierIntensity) {
          let carrierIntensityDto: any = await this.fetchCarrierIntensity(authenticate[authenticate.company].models, region_id, authenticate, division_id);
          data['MAX_CARRIER_INTENSITY'] = carrierIntensityDto?.maxIntensity;
          data['MIN_CARRIER_INTENSITY'] = carrierIntensityDto?.minIntensity;
        } else {
          data['MAX_CARRIER_INTENSITY'] = null;
          data['MIN_CARRIER_INTENSITY'] = null;
        }
        return generateResponse(res, 200, true, "Config Constants Data.", data);
      } else {
        return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
      }
    } catch (error) {
      console.log("error : ", error);
      return generateResponse(
        res,
        500,
        false,
        HttpStatusMessage.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async emissionReductionToCurrentYearPeriodWise(
    request: any,
    where: any,
    region_id: any,
    request1: any,
    division_id: any,
    company: any
  ) {
    let minW: any = {};
    minW[Op.and] = [];

    let query = `SummerisedEmission.year =   (SELECT MIN(summerised_emissions.year)
      FROM ${request1["schema"]}.[summerised_emissions]`;

    if (region_id) {
      query += ` WHERE [region_id] =${region_id}`;
      minW[Op.and].push({
        region_id: region_id,
      });
    }

    if (division_id) {
      minW[Op.and].push({
        division_id: division_id,
      });
    }

    query += `)`;
    minW[Op.and].push(sequelize.literal(query));
    let minDate = await request.SummerisedEmission.findAll({
      attributes: [
        [sequelize.fn('MIN', sequelize.col(`SummerisedEmission.year`)), 'year'],
        [sequelize.literal(`MIN([SummerisedEmissionTimeMapping->TimePeriod].id)`), 'period_id']
        ,
      ],
      include: [
        {
          model: request.TimeMapping,
          as: "SummerisedEmissionTimeMapping",
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
      where: minW,
      subQuery: false,
      raw: true
    });

    if (minDate.length == 0) {
      return null;
    }

    where[Op.and] = [];
    where[Op.and].push(
      sequelize.where(
        sequelize.literal(`SummerisedEmission.year`),
        minDate[0]?.year
      )
    );
    where[Op.and].push({ [`$SummerisedEmissionTimeMapping.period_id$`]: minDate[0]?.period_id }
    );

    if (region_id) {
      where[Op.and].push({
        region_id: region_id,
      });
    }

    if (division_id) {
      where[Op.and].push({
        division_id: division_id,
      });
    }

    //attributes
    let attributeArray: any = [
      [
        sequelize.literal(`SUM(emissions) / ${convertToMillion}`),
        "emissions",
      ],
      [sequelize.literal(`[SummerisedEmissionTimeMapping->TimePeriod].id`), 'period_id'],
      [sequelize.literal(`SummerisedEmission.year`), "year"],
    ];

    let group = [sequelize.literal(`SummerisedEmission.year`),
    sequelize.literal(`[SummerisedEmissionTimeMapping->TimePeriod].id`),]

    let startedYearEmission = await request.SummerisedEmission.findAll({
      attributes: attributeArray,
      include: [
        {
          model: request.TimeMapping,
          as: "SummerisedEmissionTimeMapping",
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
        (item: any) =>
          item?.dataValues?.config_key === "EMISSION_REDUCTION_TARGET_1"
      )?.config_value
    );

    let baseYear = minDate[0]?.year;
    let totalEmission = startedYearEmission[0]?.emissions;
    // Get the current year
    let currentYear = new Date().getFullYear();
    if (isCompanyEnable(company, [comapnyDbAlias.BMB])) {
      currentYear = 2024;
    }

    //Get the total periods in current year
    const periodCount = await request.TimePeriod.count({
      where: {
        year: currentYear
      }
    });

    let emissionPercentConst = emissionReductionT / 100;

    let totalPeriodsDiv = (emissionReductionTYear - (baseYear + 1)) * periodCount;

    let constEmission =
      (totalEmission * emissionPercentConst) / totalPeriodsDiv;


    const totalCurrentPeriods = await request.TimePeriod.count({
      where: {
        year: currentYear,
        id: {
          [Op.lte]: sequelize.literal(`(
            SELECT MAX(period_id)
            FROM ${request1["schema"]}.time_mapping
            WHERE year = ${currentYear}
          )`),
        },
      },
    });
    let totalPeriodToCurrentYear =
      (currentYear - baseYear) * periodCount + totalCurrentPeriods;

    ///<><><><>Total percentage of reduction till current quater and year<><><><><><>
    let emissionReduction =
      constEmission * totalPeriodToCurrentYear;
    let emissionReductionToCurrentYearPercent = Math.round(
      100 -
      ((totalEmission - emissionReduction) / totalEmission) * 100
    );

    //<><><>Gap to current Target and last Target<><><><>
    let totalPeriodsToSecondLastCurrentYear = (currentYear - baseYear) * periodCount;

    //gap reduction between second last period and current period
    let gapReduction =
      emissionReduction -
      constEmission * totalPeriodsToSecondLastCurrentYear;
    let gapEmissionPercent = Math.round(
      100 - ((totalEmission - gapReduction) / totalEmission) * 100
    );

    // Current period
    const currentPeriod = await request.TimePeriod.findOne({
      attributes: [['name', 'current_period']],
      where: {
        year: currentYear,
        id: {
          [Op.eq]: sequelize.literal(`(
            SELECT MAX(period_id)
            FROM ${request1["schema"]}.time_mapping
            WHERE year = ${currentYear}
          )`)
        },
      },
      raw: true,
    });
    let data = {
      emissionReductionToCurrentYearPercent,
      gapEmissionPercent,
      currentPeriod: currentPeriod?.current_period
    };
    return data;
  }


  private async emissionReductionToCurrentYear(
    request: any,
    where: any,
    region_id: any,
    request1: any,
    division_id: any
  ) {
    let minW: any = {};
    minW[Op.and] = [];

    let query = `year =   (SELECT MIN(year)
      FROM ${request1["schema"]}.[summerised_emissions]`;

    if (region_id) {
      query += ` WHERE [region_id] =${region_id}`;
      minW[Op.and].push({
        region_id: region_id,
      });
    }

    if (division_id) {
      minW[Op.and].push({
        division_id: division_id,
      });
    }

    query += `)`;
    minW[Op.and].push(sequelize.literal(query));
    let minDate = await request.SummerisedEmission.findOne({
      attributes: [
        [sequelize.literal("( SELECT MIN(year) )"), "year"],
        [sequelize.literal("( SELECT MIN(quarter) )"), "quarter"],
      ],
      where: minW,
      order: [sequelize.literal("year"), sequelize.literal("quarter")],
    });

    if (!minDate) {
      return null;
    }

    where[Op.and] = [];
    where[Op.and].push(
      sequelize.where(sequelize.literal("year"), minDate?.dataValues?.year)
    );
    where[Op.and].push(
      sequelize.where(
        sequelize.literal("quarter"),
        minDate?.dataValues?.quarter
      )
    );

    if (region_id) {
      where[Op.and].push({
        region_id: region_id,
      });
    }

    if (division_id) {
      where[Op.and].push({
        division_id: division_id,
      });
    }

    //attributes
    let attributeArray: any = [
      [
        sequelize.literal(`SUM(emissions) / ${convertToMillion}`),
        "emissions",
      ],
      [sequelize.literal("quarter"), "quarter"],
      [sequelize.literal("year"), "year"],
    ];

    let startedYearEmission = await request.SummerisedEmission.findOne({
      attributes: attributeArray,
      where: where,
      group: [sequelize.literal("year"), sequelize.literal("quarter")],
      order: [sequelize.literal("year"), sequelize.literal("quarter")],
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
        (item: any) =>
          item?.dataValues?.config_key === "EMISSION_REDUCTION_TARGET_1"
      )?.config_value
    );

    let baseYear = minDate?.dataValues?.year;
    let totalEmission = startedYearEmission?.dataValues?.emissions;

    let emissionPercentConst = emissionReductionT / 100;

    let totalQuatersDiv = (emissionReductionTYear - baseYear + 1) * 4;

    let constEmission =
      (totalEmission * emissionPercentConst) / totalQuatersDiv;

    // Get the current year
    const currentYear = new Date().getFullYear();

    // Get the current quarter
    const currentMonth = new Date().getMonth() + 1; // Adding 1 because months are zero-based
    const currentQuarter = Math.ceil(currentMonth / 3);
    let totalQuarterToCurrentYear =
      (currentYear - baseYear) * 4 + currentQuarter;

    ///<><><><>Total percentage of reduction till current quater and year<><><><><><>
    let emissionReduction =
      constEmission * totalQuarterToCurrentYear;
    let emissionReductionToCurrentYearPercent = Math.round(
      100 -
      ((totalEmission - emissionReduction) / totalEmission) * 100
    );

    //<><><>Gap to current Target and last Target<><><><>
    let totalQuarterToSecondLastCurrentYear = (currentYear - baseYear) * 4;

    //gap reduction between second last quater and current quater
    let gapReduction =
      emissionReduction -
      constEmission * totalQuarterToSecondLastCurrentYear;
    let gapEmissionPercent = Math.round(
      100 - ((totalEmission - gapReduction) / totalEmission) * 100
    );

    let data = {
      emissionReductionToCurrentYearPercent,
      gapEmissionPercent,
    };
    return data;
  }

  private async fetchCarrierIntensity(
    request: any,
    region_id: any,
    request1: any,
    division_id: any
  ) {
    try {
      const payload = [{ region_id: region_id }, { division_id: division_id }];
      const whereClause = await whereClauseFn(payload);
      let carriersData = await request.SummerisedCarrier.findAll(
        {
          attributes: [
            [sequelize.fn('SUM', sequelize.cast(sequelize.col('emissions'), 'FLOAT')), 'total_emissions'],
            [sequelize.fn('SUM', sequelize.cast(sequelize.col('total_ton_miles'), 'FLOAT')), 'total_ton_miles'],
          ],
          where: whereClause,
          group: ['carrier_name'],
        }
      );
      const intensities = carriersData.map((row: any) => row?.dataValues?.total_emissions / row?.dataValues?.total_ton_miles);
      const minIntensity = Math.min(...intensities);
      const maxIntensity = Math.max(...intensities);
      let data = {
        minIntensity,
        maxIntensity
      };
      return data;
    } catch (e) {
      return {}
    }
  }
  async updateKeyFuelRadius(request: MyUserRequest, res: Response): Promise<Response> {
    try {

      const authenticate: any = this.connection;
      // Parse the request body directly (Express stores the parsed body in request.body)
      const radius_key = request.body;

      const configListData = await authenticate[authenticate.company].models.LaneRadiusConfig.findAll({
        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('fuel_type')), 'fuel_type']
        ]
      })
      const fuelTypeName = configListData?.map((ele: any) => { return `${ele?.dataValues?.fuel_type}_radius` })

      for (let keys in radius_key) {
        if (fuelTypeName.includes(`${keys}_radius`)) {
          await authenticate[authenticate.company].models.ConfigConstants.update({ config_value: radius_key[keys] }, { where: { config_key: `${keys}_radius` } })
        }
      }
      return generateResponse(res, 200, true, "Fuel radius key updated succesfully", []);

    } catch (error) {
      console.log("error", error)
      return generateResponse(
        res,
        500,
        false,
        HttpStatusMessage.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllConfigFuelRadius(req: MyUserRequest, res: Response): Promise<Response> {
    try {
      const authenticate: any = this.connection;
      if (!isCompanyEnable(authenticate.company, [comapnyDbAlias.PEP, comapnyDbAlias.GEN, comapnyDbAlias.RBL])) {
        return generateResponse(res, 400, false, "You don't have access for this route");
      }
      const getConfigList = await authenticate[authenticate.company].models.LaneRadiusConfig.findAll()
      if (getConfigList?.length > 0) {
        const transformedData = getConfigList.reduce((acc: any, item: any) => {
          if (!acc[item.fuel_type]) {
            acc[item.fuel_type] = [];
          }
          acc[item.fuel_type].push(item);
          return acc;
        }, {});

        return generateResponse(res, 200, true, "Fuel radius list", transformedData);
      }

      return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
    } catch (error) {
      console.log(error);
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }

  async getDivisionList(request: MyUserRequest, res: Response): Promise<Response> {

    try {

      const connection: any = this.connection
      let request = connection[connection.company]

      const businessEmissions = await request["models"].BusinessUnitDivision.findAll({})

      if (businessEmissions?.length > 0) {
        return generateResponse(res, 200, true, 'Division List.', businessEmissions)
      }
      else {
        return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND)
      }
    } catch (error) {
      console.log(error);
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }


  async getFilterDates(_req: MyUserRequest, res: Response): Promise<Response> {
    try {
      const connection: any = this.connection
      const request = connection[connection.company]
      const isBrambles = isCompanyEnable(connection.company, [comapnyDbAlias.BMB]);
      const query = {
        benchmark: {
          attributes: [
            [
              sequelize.literal(`
              (
                SELECT MIN(DATEFROMPARTS(year, 
                  CASE quarter 
                    WHEN 1 THEN 1 
                    WHEN 2 THEN 4 
                    WHEN 3 THEN 7 
                    WHEN 4 THEN 10 
                  END, 
                1))
              )
            `),
              'start_date',
            ],
            [
              sequelize.literal(`
              (
                SELECT MAX(DATEFROMPARTS(year, 
                  CASE quarter 
                    WHEN 1 THEN 1 
                    WHEN 2 THEN 4 
                    WHEN 3 THEN 7 
                    WHEN 4 THEN 10 
                  END, 
                1))
              )
            `),
              'end_date',
            ],
          ],
        },

        others: {
          attributes: [
            [sequelize.literal('(SELECT MIN(date))'), 'start_date'],
            [sequelize.literal('(SELECT MAX(date))'), 'end_date'],
          ],
          raw: true
        }
      };

      let emissionDates = await request["models"]?.["Emission"].findAll(query["others"]);
      let datesYear = { ...emissionDates[0] };
      let benchmarkDates = await request["models"]?.["EmissionIntensityLanes"].findAll(query["benchmark"])
      if (isBrambles) {
        let emissionYears = await request["models"]?.["Emission"].findAll({
          attributes: [
            [sequelize.literal('(SELECT MIN(year))'), 'start_year'],
            [sequelize.literal('(SELECT MAX(year))'), 'end_year'],
          ],
          raw: true
        });
        datesYear = { ...datesYear, ...emissionYears[0] }
      }
      const responseData = {
        emission_dates: datesYear,
        benchmark_dates: benchmarkDates?.[0] ?? null,
      };

      return generateResponse(res, 200, true, "User Filter Dates", responseData);

    } catch (error) {
      console.log(error);
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);;
    }

  }

  async timeMappingList(request: MyUserRequest, res: Response): Promise<Response> {
    try {
      const authenticate: any = this.connection;
      if (!isCompanyEnable(authenticate.company, [comapnyDbAlias.PEP, comapnyDbAlias.BMB])) {
        return generateResponse(res, 400, false, "You don't have access for this route");
      }
      const { year, quarter, month } = await request.body;

      let where: any = {}
      where[Op.and] = [];
      if (year) {
        where[Op.and].push({ year: year });
      }
      if (quarter) {
        where[Op.and].push({ quarter: quarter });
      }
      if (month) {
        where[Op.and].push({ month: month });
      }



      const getTimeMap = await authenticate[authenticate.company].models.TimePeriod.findAll(
        {
          attributes: ['id', 'name'],
          where: where,
          include: [
            {
              model: authenticate[authenticate?.company]?.models.TimeMapping,
              attributes: ['id', 'name', 'period_id'],
              as: 'timeMappings', // This should match the alias used in TimePeriod model
              required: true // This ensures only matching records are returned
            }
          ]

        }
      )
      if (getTimeMap?.length > 0) {

        return generateResponse(res, 200, true, "Time mapping list", getTimeMap);
      }

      return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
    } catch (error) {
      console.log(error);
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }

  async fuelList(_request: MyUserRequest, res: Response): Promise<Response> {
    try {
      const authenticate: any = this.connection;
      const getFuelList = await authenticate[authenticate.company].models.ProductTypeAvailability.findAll({
        attributes: [['product_type_id', 'id'], [Sequelize.col('productTypeExternal.name'), 'name'], [Sequelize.col('productTypeExternal.code'), 'code']],
        include: [
          {
            model: authenticate[authenticate.company].models.ProductTypeExternal,
            as: 'productTypeExternal',
            attributes: []
          }
        ],
        raw: false
      });

      if (getFuelList?.length > 0) {
        return generateResponse(res, 200, true, "Time mapping list", getFuelList);
      }

      return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
    } catch (error) {
      console.log(error);
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }



}

export default CommonController;
