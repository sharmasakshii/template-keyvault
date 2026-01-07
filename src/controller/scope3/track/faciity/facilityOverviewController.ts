import { Response } from "express";
import { Sequelize } from "sequelize";
import { MyUserRequest } from "../../../../interfaces/commonInterface";
import { generateResponse } from "../../../../services/response";
import HttpStatusMessage from "../../../../constant/responseConstant";
import {
  roundToDecimal,
  fetchIndustryData,
  whereClauseFn,
  targetValuesFn,
  processContributorAndDetractorCommonFn,
  getLaneEmissionTopBottomLaneData,
  getAverageIntensity
} from "../../../../services/commonServices";
import { convertToMillion } from "../../../../constant";
const sequelize = require("sequelize");
const Op = sequelize.Op;

export class FacilityOverviewController {
  // Private property for the database connection (Sequelize instance)
  private readonly connection: Sequelize;

  // Constructor to initialize the database connection for each instance
  constructor(connectionData: Sequelize) {
    this.connection = connectionData; // Assign the passed Sequelize instance to the private property
  }

  // API handler function
  async getFacilityEmissionReductionGraph(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {
    try {
      // Authenticate the request using JWT middleware
      let authenticate: any = this.connection;

      let companyConnection = authenticate[authenticate.company];
      // Parse the incoming request body
      const { facility_id, year, toggel_data, region_id } = request.body;

      let current_year: number = year;
      let next_year = current_year + 1;

      const { whereFacility, where } = this.constructWhereClauses(facility_id, year, region_id);

      const attributeArray = this.getAttributeArray(toggel_data, sequelize);

      const [getFacilityEmissionsReduction, facilityEmissionsReduction] =
        await this.fetchEmissionReductionData(
          companyConnection["models"],
          where,
          whereFacility,
          attributeArray
        );

      if (getFacilityEmissionsReduction.length > 0) {
        const params = {
          getFacilityEmissionsReduction,
          facilityEmissionsReduction,
          current_year,
          next_year,
          facility_id,
          year,
          toggel_data,
          companyConnection,
          schema: authenticate['schema']
        };

        const data = await this.processDataFacilityEmissionReductionGraph(
          params
        );

        return generateResponse(res, 200, true, "Emissions Reduction", data);
      } else {
        return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
      }
    } catch (error) {
      console.log(error);
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }

  async getFacilityOverviewDetails(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {
    try {
      // Authenticate the request using JWT middleware
      let authenticate: any = this.connection;

      let companyConnection = authenticate[authenticate.company];
      // Parse the incoming request body
      let { facility_id, region_id, year, quarter } = request.body;

      const where: any = {}
      where[Op.and] = []

      // Build the query filter based on provided parameters

      if (facility_id) {
        where[Op.and].push({
          facilities_id: facility_id
        })
      };
      if (region_id) {
        where[Op.and].push({
          region_id: region_id,
        });
      };
      if (year) {
        where[Op.and].push({ 'year': year })
      }
      if (quarter) {
        where[Op.and].push({ 'quarter': quarter })
      }


      // Get facility overview details
      let getFacilityOverviewDetails = await companyConnection["models"].SummerisedFacilities.findAll({
        attributes: [
          [sequelize.literal('SUM(emission) / SUM(CAST(total_ton_miles AS FLOAT ))'), 'intensity'],
          [sequelize.literal(`SUM(emission)/ ${convertToMillion}`), 'emission'],
          [sequelize.literal('SUM(shipments)'), 'shipment_count'],
        ],
        include: [
          {
            model: companyConnection["models"].Facility,
            attributes: ['id', 'name'],
            as: 'facility'
          }
        ],
        where: where,
        group: ["facility.id", "facility.name"],
      });

      if (getFacilityOverviewDetails.length > 0) {
        return generateResponse(
          res,
          200,
          true,
          "Facility Overview Data",
          getFacilityOverviewDetails[0]
        );
      } else {
        return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
      }
    } catch (error) {
      console.log(error);
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }

  async getFacilityComparison(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {
    try {
      // Authenticate the request using JWT middleware
      let authenticate: any = this.connection;
      let companyConnection = authenticate[authenticate.company];

      let { facility_id, region_id, year, quarter } = request.body;

      const payload = [{
        facilities_id: facility_id,
      }, {
        region_id: region_id,
      }, {
        year: year,
      }, {
        quarter: quarter
      }]
      const where = await whereClauseFn(payload)

      // Get vendor emission data for the specified facility
      let getVendorEmissionData = await companyConnection["models"].SummerisedFacilities.findAll({
        attributes: [
          [
            sequelize.literal(
              " ROUND(SUM(TRY_CAST(emission AS FLOAT)) / SUM(TRY_CAST(total_ton_miles AS FLOAT)), 1) "
            ),
            "intensity",
          ],
          [
            sequelize.literal(`SUM(emission)/${convertToMillion}`),
            "emissions",
          ],
          [sequelize.literal(" SUM(TRY_CAST(shipments AS FLOAT))"), "shipment_count"],
        ],
        where: where
      });
      // Get total vendor emission data
      let getTotalVendorEmissionData: any = await companyConnection["models"].SummerisedFacilities.findAll({
        attributes: [
          [
            sequelize.literal(
              "ROUND(SUM(TRY_CAST(emission AS FLOAT)) / SUM(TRY_CAST(total_ton_miles AS FLOAT)), 1) "
            ),
            "intensity",
          ],
          [
            sequelize.literal(`SUM(emission)/${convertToMillion}`),
            "emissions",
          ],
          [sequelize.literal(" SUM(TRY_CAST(shipments AS FLOAT))"), "shipment_count"],
        ],
      });

      // Get summerised carrier data for the specified facility
      let summerisedCarrierdata: any = await companyConnection["models"].SummerisedFacilities.findAll({
        attributes: [
          [
            sequelize.literal(
              "ROUND(SUM(CAST(emission AS FLOAT)) / SUM(CAST(total_ton_miles AS FLOAT)), 1) "
            ),
            "intensity",
          ],
        ],
        include: [
          {
            model: companyConnection["models"].Facility,
            attributes: ["name"],
            as: 'facility'
          },
        ],
        where: where,
        group: ["facility.id", "facility.name"],
      });

      // Calculate the baseline
      let baseLine =
        getTotalVendorEmissionData[0]?.dataValues?.intensity * (20 / 100);
      if (summerisedCarrierdata?.length > 0) {
        let industryData = await fetchIndustryData(companyConnection);
        const data = {
          responseData: {
            facility_name: summerisedCarrierdata[0]?.facility?.name || null,
            intensity: summerisedCarrierdata[0]?.dataValues?.intensity,
            data: [
              {
                year: year,
                intensity: getTotalVendorEmissionData[0]?.dataValues?.intensity,
              },
              {
                year: year,
                intensity: getVendorEmissionData[0]?.dataValues?.intensity,
              },
            ],
            industrialAverage: industryData[0]?.dataValues?.average_intensity || 0,
            baseLine: roundToDecimal(
              getTotalVendorEmissionData[0]?.dataValues?.intensity + baseLine
            ),
            vendorEmissionData: getVendorEmissionData,
            totalVendorEmissionData: getTotalVendorEmissionData,
            max: getTotalVendorEmissionData?.dataValues?.intensity,
          },
        };
        return generateResponse(res, 200, true, "Vendor Emissions", data);
      }
      else {
        return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND)
      }
    } catch (error) {
      console.log(error);
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }

  async getFacilityInboundData(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {
    try {
      // Authenticate the request using JWT middleware
      let authenticate: any = this.connection;
      let companyConnection = authenticate[authenticate.company];

      let { facility_id, region_id, year, quarter, toggel_data } = request.body;
      const where: any = {};
      where[Op.and] = [];
      where[Op.and].push(sequelize.literal("emission != 0 "));
      where[Op.and].push(sequelize.literal("total_ton_miles != 0 "));


      // Get the facility name
      let facility_name = await companyConnection["models"].Facility.findOne({
        attributes: ["id", "name"],
        where: { id: facility_id },
      });
      if (!facility_name) {
        return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
      }

      facility_name = facility_name.dataValues.name
        ? facility_name.dataValues.name.toUpperCase()
        : null;

      if (facility_name) where[Op.and].push(sequelize.literal(`destination LIKE '%${facility_name}%' `));

      const payload = [{ YEAR: year }, { facilities_id: facility_id }, { quarter: quarter }, { region_id: region_id }]

      return await this.laneEmissionResponse({ where: where, toggel_data: toggel_data, payload: payload, authenticate: authenticate, res: res, message: "Lane Emissions" })

    } catch (error) {
      console.log(error);
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }

  async getFacilityOutBoundData(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {
    try {
      let authenticate: any = this.connection;
      let companyConnection = authenticate[authenticate.company];

      let { facility_id, region_id, year, quarter, toggel_data } = request.body;

      const where: any = { [Op.and]: [] };
      // Get facility name
      let facility_name = await companyConnection["models"].Facility.findOne({
        attributes: ["id", "name"],
        where: { id: facility_id },
      });
      if (!facility_name) {
        return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
      }

      facility_name = facility_name.dataValues.name
        ? facility_name.dataValues.name.toUpperCase()
        : null;

      if (facility_name) where[Op.and].push(sequelize.literal(`origin LIKE '%${facility_name}%' `));
      const payload = [{ facilities_id: facility_id }, { YEAR: year }, { quarter: quarter }, { region_id: region_id }]

      return await this.laneEmissionResponse({ where: where, toggel_data: toggel_data, payload: payload, authenticate: authenticate, res: res, message: "Lane Emissions" })

    } catch (error) {
      console.log(error);
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }

  async getFacilityCarrierComparisonGraph(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {
    try {
      let authenticate: any = this.connection;

      let { facility_id, region_id, year, quarter, toggel_data } = request.body;

      const payload = [{ facilities_id: facility_id }, { region_id: region_id }, { YEAR: year }, { quarter: quarter }];
      const where = await this.privateWhereClause({ payload: payload })
      let order_by = this.determineOrderBy(toggel_data);

      const averageIntensity = await getAverageIntensity(authenticate[authenticate.company].models, where, "SummerisedFacilities");

      let getTopCarrierEmissionData = await getLaneEmissionTopBottomLaneData({
        tableName: "SummerisedFacilities", initDbConnection: authenticate[authenticate.company], where: where, order_by: order_by, sortOrder: 'asc', limit: 10, group: ['carrier_name'], attr: ['carrier_name']
      })

      let getButtomCarrierEmissionData = await getLaneEmissionTopBottomLaneData({
        tableName: "SummerisedFacilities", initDbConnection: authenticate[authenticate.company], where: where, order_by: order_by, sortOrder: 'desc', limit: 10, group: ['carrier_name'], attr: ['carrier_name']
      })
      const {
        contributor,
        detractor,
        unit,
        average,
      } = await processContributorAndDetractorCommonFn({ toggleData: toggel_data, topData: getTopCarrierEmissionData, bottomData: getButtomCarrierEmissionData, configData: authenticate, averageIntensity: averageIntensity, fetchKey: "carrier_name" })

      const data = {
        contributor: contributor,
        detractor: detractor,
        unit: unit,
        average: average,
      };
      return generateResponse(res, 200, true, "Carrier Emissions", data);

    } catch (error) {
      console.log(error);
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }

  async getFacilityLaneEmissionData(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {
    try {
      let authenticate: any = this.connection;
      let { facility_id, region_id, year, quarter, toggel_data } = request.body;

      const payload = [{
        facilities_id: facility_id,
      }, {
        region_id: region_id,
      }, { YEAR: year }, { quarter: quarter }]


      const where = await this.privateWhereClause({ payload: payload })
      let order_by = toggel_data == 1 ? "emission" : "intensity";

      let averageIntensity = await getAverageIntensity(authenticate[authenticate.company]['models'], where, "SummerisedFacilities")

      let getTopLaneEmissionData = await getLaneEmissionTopBottomLaneData({ tableName: "SummerisedFacilities", initDbConnection: authenticate[authenticate.company], where: where, order_by: order_by, sortOrder: 'asc', limit: 10, group: ["SummerisedFacilities.name"], attr: [['name', 'lane_name']] })

      let getButtomLaneEmissionData = await getLaneEmissionTopBottomLaneData({ tableName: "SummerisedFacilities", initDbConnection: authenticate[authenticate.company], where: where, order_by: order_by, sortOrder: 'desc', limit: 10, group: ["SummerisedFacilities.name"], attr: [['name', 'lane_name']] })

      if (getTopLaneEmissionData) {

        const data = await processContributorAndDetractorCommonFn({ toggleData: toggel_data, topData: getTopLaneEmissionData, bottomData: getButtomLaneEmissionData, configData: authenticate, averageIntensity: averageIntensity, fetchKey: "lane_name" })

        return generateResponse(res, 200, true, "Lane Emissions", data);
      } else {
        return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
      }
    } catch (error) {
      console.log(error);
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }

  private readonly privateWhereClause = async (props: any) => {
    const where: any = {};
    where[Op.and] = [];
    where[Op.and].push(
      {
        total_ton_miles: {
          [Op.ne]: 0, // Not equal to 0
        },
      },
      {
        total_ton_miles: {
          [Op.not]: null, // Is not null
        },
      }
    );

    const whereCaluse = await whereClauseFn(props.payload)
    where[Op.and] = [...where[Op.and], ...whereCaluse[Op.and]];
    return where
  }

  private constructWhereClauses(facility_id: any, year: any, region_id: any) {
    let current_year, next_year;
    const whereFacility: any = {};
    const where: any = {};
    if (facility_id || year) {
      whereFacility[Op.and] = [];
      where[Op.and] = [];
      where[Op.or] = [];
      whereFacility[Op.or] = [];
      if (facility_id) {
        whereFacility[Op.and].push({
          facilities_id: facility_id,
        });
      }
      if (region_id) {
        whereFacility[Op.and].push({
          region_id: region_id,
        });
        where[Op.and].push({
          region_id: region_id,
        });
      }
      if (year) {
        current_year = parseInt(year);
        next_year = parseInt(year) + 1;
        where[Op.or].push({ year: current_year });
        whereFacility[Op.or].push({ year: current_year });
        where[Op.or].push({ year: next_year });
        whereFacility[Op.or].push({ year: next_year });
      }
    }
    return { whereFacility, where };
  };
  private getAttributeArray(toggel_data: any, sequelize: any) {
    let attributeArray = [
      [sequelize.literal(`SUM(emission) / ${convertToMillion}`), "intensity"],
      [sequelize.literal("quarter"), "quarter"],
      [sequelize.literal("year"), "year"],
    ];
    if (toggel_data == 1) {
      attributeArray = [
        [
          sequelize.literal(
            "SUM(emission) / SUM(total_ton_miles)"
          ),
          "intensity",
        ],
        [sequelize.literal("quarter"), "quarter"],
        [sequelize.literal("year"), "year"],
      ];
    }
    return attributeArray;
  };
  private async fetchEmissionReductionData(
    initDbConnection: any,
    where: any,
    whereFacility: any,
    attributeArray: any,
  ) {

    const getFacilityEmissionsReduction = await initDbConnection.SummerisedFacilities.findAll({
      attributes: attributeArray,
      where: where,
      group: [sequelize.literal("year"), sequelize.literal("quarter")],
      order: [sequelize.literal("year"), sequelize.literal("quarter")],
    });
    const facilityEmissionsReduction = await initDbConnection.SummerisedFacilities.findAll({
      attributes: attributeArray,
      where: whereFacility,
      group: [sequelize.literal("year"), sequelize.literal("quarter")],
      order: [sequelize.literal("year"), sequelize.literal("quarter")],
    });

    return [getFacilityEmissionsReduction, facilityEmissionsReduction];
  };

  private async processDataFacilityEmissionReductionGraph(
    params: any
  ) {
    const {
      getFacilityEmissionsReduction,
      facilityEmissionsReduction,
      current_year,
      next_year,
      facility_id,
      year,
      toggel_data,
      companyConnection,
      schema
    } = params;
    let company_level = [];
    let max_array = [];
    let base_level = [];
    let count = 0;
    let facility_data = [];
    let intialCompanyLevel;

    for (const property of getFacilityEmissionsReduction) {
      company_level.push(roundToDecimal(property.dataValues.intensity));
      count++;
    }

    for (const property of facilityEmissionsReduction) {
      facility_data.push(roundToDecimal(property.dataValues.intensity));
      intialCompanyLevel ??= property.dataValues.intensity;
      intialCompanyLevel = roundToDecimal(
        intialCompanyLevel - (intialCompanyLevel * 10) / 100
      );
      max_array.push(property.dataValues.intensity);
    }

    let requiredData = {
      year: year,
      toggel_data: toggel_data,
      tableName: 'SummerisedFacilities',
      columnName: 'emission',
      dataBaseTable: 'summerised_facilities'
    }

    let targetValues = await targetValuesFn(companyConnection['models'], { facilities_id: facility_id }, requiredData, schema);

    let max = Math.max(...max_array);
    let maxData = roundToDecimal(max + (max * 30) / 100);
    base_level.push(maxData);
    let data = {
      company_level: company_level,
      targer_level: targetValues,
      facility_level: facility_data,
      base_level: base_level,
      max: roundToDecimal(maxData + (maxData * 20) / 100),
      year: [current_year, next_year],
    };

    return data;
  };

  private determineOrderBy(toggel_data: any) {
    return toggel_data == 1 ? "emission" : "intensity";
  }


  private readonly laneEmissionResponse = async (prop: any) => {

    const { where, toggel_data, payload, authenticate, res, message } = prop
    const whereClause = await whereClauseFn(payload)
    where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];

    let order_by = "intensity";
    if (toggel_data == 1) {
      order_by = "emission";
    }

    let averageIntensity = await getAverageIntensity(authenticate[authenticate.company]['models'], where, "SummerisedFacilities")

    let getTopLaneEmissionData = await getLaneEmissionTopBottomLaneData({ tableName: "SummerisedFacilities", initDbConnection: authenticate[authenticate.company], where: where, order_by: order_by, sortOrder: 'asc', limit: 10, group: ["SummerisedFacilities.name"], attr: [['name', 'lane_name']] })

    let getButtomLaneEmissionData = await getLaneEmissionTopBottomLaneData({ tableName: "SummerisedFacilities", initDbConnection: authenticate[authenticate.company], where: where, order_by: order_by, sortOrder: 'desc', limit: 10, group: ["SummerisedFacilities.name"], attr: [['name', 'lane_name']] })

    const data = await processContributorAndDetractorCommonFn({ toggleData: toggel_data, topData: getTopLaneEmissionData, bottomData: getButtomLaneEmissionData, configData: authenticate, averageIntensity: averageIntensity, fetchKey: "lane_name" })

    return generateResponse(res, 200, true, message, data);
  }
}

export default FacilityOverviewController;
