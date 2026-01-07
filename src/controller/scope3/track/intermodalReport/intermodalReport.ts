import { Response } from "express";
import sequelize, { Sequelize } from "sequelize";
import { MyUserRequest } from "../../../../interfaces/commonInterface";
import { generateResponse } from "../../../../services/response";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { whereClauseFn, paginate, buildWhereClauseSearch, callStoredProcedure } from "../../../../services/commonServices";
import moment from "moment";
import { Op } from "sequelize";
import { comapnyDbAlias } from "../../../../constant";

class IntermodalController {
  private readonly connection: Sequelize;

  constructor(connectionData: Sequelize) {
    this.connection = connectionData;
  }

  async fetchIntermodalMetrics(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {
    try {
      const { year, carrier_name, start_date, end_date } = request.body;

      const authenticate: any = this.connection;
      const company = authenticate.company;
      const companyModels = authenticate[company].models;

      const IntermodalReport = companyModels.IntermodalReport;

      const dateTest = await this.getDateWhere({ start_date, end_date, authenticate });

      const payload = [
        { year },
        { carrier_name }
      ];

      const where = await whereClauseFn(payload);

      where[Op.and] = [{ ...dateTest }, ...where[Op.and]];
      let col_name = comapnyDbAlias["BMB"] == company ? "lane_name_zipcode" : 'lane_name';
      // Single query for all three metrics
      const result = await IntermodalReport.findAll({
        attributes: [
          [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col(`${col_name}`))), 'total_lanes'],
          [Sequelize.fn('SUM', Sequelize.col('shipments')), 'total_shipments'],
          [Sequelize.fn('SUM', Sequelize.col('distance')), 'total_distance'],
        ],
        where,
        raw: true,
      });

      const metrics = result[0] || {};

      const data = {
        totalLanes: Number(metrics.total_lanes || 0),
        totalShipments: Number(metrics.total_shipments || 0),
        totalMiles: Number(metrics.total_distance || 0),
      };

      return generateResponse(res, 200, true, "Intermodal metrics", data);
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

  async ListByShipmentandMiles(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {
    try {
      const authenticate: any = this.connection;
      const companyConnection = authenticate[authenticate.company];

      const {
        year,
        carrier_name,
        page_size = 10,
        page = 1,
        order_by = 'ASC',
        column = 'total_shipments',
        start_date,
        end_date,
        lane_name
      } = request.body;

      const payload = [{ year }, { carrier_name }];
      const where = await whereClauseFn(payload);

      const page_server = page ? parseInt(page) - 1 : 0;

      const dateTest = await this.getDateWhere({ start_date, end_date, authenticate });

      where[Op.and] = [{ ...dateTest }, ...where[Op.and]];

      if (lane_name) {
        where[Op.and].push({
          lane_name_zipCode: {
            [Op.like]: `%${lane_name}%`
          }
        });
      }

      const baseQuery = {
        attributes: [
          [Sequelize.fn('CONCAT', Sequelize.col('origin_city'), ', ', Sequelize.col('origin_state')), 'origin'],
          [Sequelize.fn('CONCAT', Sequelize.col('dest_city'), ', ', Sequelize.col('dest_state')), 'destination'],
          'carrier_name',
          'lane_name',
          [Sequelize.fn('SUM', Sequelize.col('shipments')), 'total_shipments'],
          [Sequelize.fn('SUM', Sequelize.col('distance')), 'total_distance'],
          
        ],
        where,
        group: [
          Sequelize.fn('CONCAT', Sequelize.col('origin_city'), ', ', Sequelize.col('origin_state')),
          Sequelize.fn('CONCAT', Sequelize.col('dest_city'), ', ', Sequelize.col('dest_state')),
          'carrier_name',
          'lane_name'
        ],
        order: [[column, order_by]],
        raw: true,
      };

      if (comapnyDbAlias["BMB"] === authenticate.company) {
        baseQuery.attributes.push('o_global', 'd_global', 'o_plantType', 'd_plantType', [Sequelize.fn('SUM', Sequelize.col('quantity')), 'quantity'], 'origin_zip', 'dest_zip');
        baseQuery.group.push('o_global', 'd_global', 'o_plantType', 'd_plantType', 'origin_zip', 'dest_zip');
      }

      const IntermodalReport = companyConnection['models'].IntermodalReport;

      const lanes = await IntermodalReport.findAll(
        paginate(baseQuery, {
          page: page_server,
          pageSize: page_size,
        })
      );



      const totalRecordsResult = await IntermodalReport.findAll({
        attributes: [
          [Sequelize.fn('COUNT', Sequelize.literal('DISTINCT CONCAT(origin_city, dest_city, carrier_name)')), 'count']
        ],
        where,
        raw: true,
      });

      const total_count = parseInt(totalRecordsResult[0]?.count || 0);

      const responseData = {
        list: lanes,
        pagination: {
          page,
          page_size,
          total_count,
        },
      };

      return generateResponse(res, 200, true, "Intermodal lanes list.", responseData);
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

  async fetchIntermodalFilterOptions(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {
    try {
      const authenticate: any = this.connection;
      const companyConnections = authenticate[authenticate.company];

      const { year, search_carrier, start_date, end_date } = request.body;

      const payload = [
        { year }
      ];
      const where = await whereClauseFn(payload);

      if (search_carrier) {
        where[sequelize.Op.and] = where[sequelize.Op.and] || [];
        where[sequelize.Op.and].push(
          sequelize.where(
            sequelize.fn('LOWER', sequelize.col('carrier_name')),
            {
              [sequelize.Op.like]: `%${search_carrier.toLowerCase()}%`
            }
          )
        );
      }
      let carrierWhere: any = { [Op.and]: [] };
      const dateTest = await this.getDateWhere({ start_date, end_date, authenticate });
      carrierWhere[Op.and] = [{ ...dateTest }, ...where[Op.and]];

      const [years, carriers, tranTableCarrier] = await Promise.all([
        companyConnections.models.IntermodalReport.findAll({
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('year')), 'year']
          ],
          order: [[sequelize.col('year'), 'DESC']],
          raw: true
        }),
        companyConnections.models.IntermodalReport.findAll({
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('carrier_name')), 'carrier_name']
          ],
          where,
          order: [[sequelize.col('carrier_name'), 'ASC']],
          raw: true
        }),
        companyConnections.models.IntermodalReport.findAll({
          attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('carrier_name')), 'carrier_name']],
          where: carrierWhere,
          raw: true,
        })
      ]);

      const result = {
        years: years.map((item: any) => item.year),
        carriers: carriers.map((item: any) => item.carrier_name),
        tranTableCarrier: tranTableCarrier.map((item: any) => item.carrier_name)
      };
      return generateResponse(res, 200, true, "Filter options fetched", result);
    } catch (error) {
      console.error(error);
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }

  async fetchLaneDetails(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {
    try {
      const authenticate: any = this.connection;
      const companyConnections = authenticate[authenticate.company];
      const { lane_name, year, carrier_name, start_date, end_date } = request.body;

      const dateTest = await this.getDateWhere({ start_date, end_date, authenticate });
      const payload = [{ lane_name, year, carrier_name }];
      const where = await whereClauseFn(payload);

      where[Op.and] = [{ ...dateTest }, ...where[Op.and]];

      const result = await companyConnections.models.IntermodalReport.findAll({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('shipments')), 'total_shipments'],
          [sequelize.fn('SUM', sequelize.col('distance')), 'total_distance']
        ],
        where,
        raw: true
      });

      return generateResponse(
        res,
        200,
        true,
        "Lane details fetched successfully",
        {
          total_shipments: Number(result[0]?.total_shipments || 0),
          total_distance: Number(result[0]?.total_distance || 0)
        }
      );
    } catch (error) {
      console.error(error);
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }

  async fetchTopLanesByCarrier(
    request: MyUserRequest,
    res: Response
  ): Promise<Response> {
    try {
      const authenticate: any = this.connection;
      const companyConnections = authenticate[authenticate.company];
      const { carrier_name, year, start_date, end_date } = request.body;

      const payload = [{ year }, { carrier_name }];
      const where = await whereClauseFn(payload);
      const dateTest = await this.getDateWhere({ start_date, end_date, authenticate });
      let col_name = comapnyDbAlias["BMB"] == authenticate?.company ? "lane_name_zipcode" : 'lane_name';

      where[Op.and] = [{ ...dateTest }, ...where[Op.and]];

      const topShipments = await companyConnections.models.IntermodalReport.findAll({
        attributes: [
          [`${col_name}`, 'name'],
          [sequelize.fn('SUM', sequelize.col('shipments')), 'counts']
        ],
        where,
        group: [`${col_name}`],
        order: [[sequelize.fn('SUM', sequelize.col('shipments')), 'DESC']],
        limit: 10,
        raw: true
      });

      const topMiles = await companyConnections.models.IntermodalReport.findAll({
        attributes: [
          [`${col_name}`, 'name'],
          [sequelize.fn('SUM', sequelize.col('distance')), 'counts']
        ],
        where,
        group: [`${col_name}`],
        order: [[sequelize.fn('SUM', sequelize.col('distance')), 'DESC']],
        limit: 10,
        raw: true
      });

      return generateResponse(res, 200, true, "Top lanes fetched", {
        shipments: topShipments,
        miles: topMiles
      });
    } catch (error) {
      console.error(error);
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }


  async fetchMaxDate
    (
      request: MyUserRequest,
      res: Response
    ): Promise<Response> {
    try {
      const authenticate: any = this.connection;
      const { carrier_name } = request.body;

      const payload = [{ carrier_name }];
      const where = await whereClauseFn(payload);
      let maxDateRow = await this.getDates({ authenticate, where, type: 'min_max' });
      return generateResponse(res, 200, true, "Max date fetched", maxDateRow);
    } catch (error) {
      console.error(error);
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }

  private async getDates(props: any) {
    const { authenticate, where, type = '' } = props;
    const companyConnections = authenticate[authenticate.company];
    return await companyConnections.models.IntermodalReport.findAll({
      attributes: [
        ...(type ? [[sequelize.fn('MIN', sequelize.col('date')), 'min_date']] : []),
        [sequelize.fn('MAX', sequelize.col('date')), 'date'] // 👈 fetch max date
      ],
      where: where || {},
      raw: true
    });
  }


  private async getDateWhere(props: any) {

    const { start_date, end_date, authenticate } = props;

    if (comapnyDbAlias["BMB"] !== authenticate.company) {
      return {};
    }

    let startDate = start_date ? moment.utc(start_date) : null;
    let endDate = end_date ? moment.utc(end_date) : null;

    if (!startDate && !endDate) {
      const maxDateRow = await this.getDates({ authenticate });
      const maxDate = moment.utc(maxDateRow[0]?.date);
      if (maxDate.isValid()) {
        endDate = maxDate;
        startDate = maxDate.clone().subtract(1, "month");
      }
    }

    else if (startDate && !endDate) {
      endDate = startDate.clone().add(1, "month");
    }

    else if (!startDate && endDate) {
      startDate = endDate.clone().subtract(1, "month");
    }

    const whereCondition: any = {};

    if (startDate && endDate) {
      whereCondition.date = {
        [Op.between]: [startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD")],
      };
    }
    return whereCondition

  }

  async fetchOriginDestinationDetails
    (
      request: MyUserRequest,
      res: Response
    ): Promise<Response> {
    try {
      const authenticate: any = this.connection;
      const { keyword, page_limit, type, source, dest, carrier_name, start_date, end_date } = request.body;

      let tableName = 'IntermodalReport';
      const where = await buildWhereClauseSearch(type, keyword, source, dest, 'lane_name_zipCode')
      const dateTest = await this.getDateWhere({ start_date, end_date, authenticate });

      if (carrier_name) {
        where[Op.and].push({ carrier_name });
      }
      where[Op.and] = [{ ...dateTest }, ...where[Op.and]];


      if (this.shouldExecuteStoredProc(type, keyword, source, dest)) {

        const data = await callStoredProcedure({ filterPrefix: keyword, TableName: tableName, AliasName: tableName, ColumnName: 'lane_name_zipCode' }, authenticate[authenticate.company], `EXEC ${authenticate["schema"]}.getfiltername_dest @filterPrefix = :filterPrefix,@TableName = :TableName,@AliasName = :AliasName,@ColumnName = :ColumnName`);

        return generateResponse(res, 200, true, "Origin destination details fetched", data);
      }

      const odData = await authenticate[authenticate.company].models.IntermodalReport.findAll({
        attributes: type.toLowerCase() === "dest" ?
          [[sequelize.fn('DISTINCT', sequelize.literal(`SUBSTRING([${tableName}].[lane_name_zipCode], CHARINDEX('_', [${tableName}].[lane_name_zipCode]) + 1, LEN([${tableName}].[lane_name_zipCode]))`)), type.toLowerCase()]] :
          [[sequelize.fn('DISTINCT', sequelize.literal(`SUBSTRING([${tableName}].[lane_name_zipCode], 1, CHARINDEX('_', [${tableName}].[lane_name_zipCode]) - 1)`)), type.toLowerCase()]],
        where: where,
        order: [type.toLowerCase()],
        raw: true,
        limit: parseInt(page_limit),
      });

      return generateResponse(res, 200, true, "Origin destination details fetched", odData);
    } catch (error) {
      console.error(error);
      return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
  }

  private shouldExecuteStoredProc(type: string, keyword: string, source: string, dest: string) {
    return type.toLowerCase() === "dest" && keyword && !dest && !source;
  }



}


export default IntermodalController;
