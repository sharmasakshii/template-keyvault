import { Sequelize, col, fn, Op } from "sequelize";
import { MyUserRequest } from "../../../interfaces/commonInterface";
import { generateResponse } from "../../../services/response";
import HttpStatusMessage from "../../../constant/responseConstant";
import { buildWhereClauseSearch, whereClauseFn } from "../../../services/commonServices";
import { comapnyDbAlias } from "../../../constant";
import { getIntermodalLaneDetail, isCompanyEnable } from "../../../utils";
const sequelize = require("sequelize");

class ReportController {
    // Private property for the database connection (Sequelize instance)
    private readonly connection: Sequelize;

    // Constructor to initialize the database connection for each instance
    constructor(connectionData: Sequelize) {
        this.connection = connectionData; // Assign the passed Sequelize instance to the private property
    }

    async getLaneMatrixData(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const connection: any = this.connection

            const { fuelType, radius, division_id, quarter, region_id, year, time_id } = req.body;

            const payload = [{ ['fuel_type']: fuelType }, { ['radius_distance']: radius }, { year: year }, { quarter: quarter },
            { region_id: region_id }, { division_id: division_id }, { time_id: time_id }]

            const whereClause = await whereClauseFn(payload)

            const laneData = await connection[connection.company]["models"].Reporting.findAll(
                {
                    attributes: [
                        [fn('COUNT', col('id')), 'lane_count'],
                        [
                            Sequelize.literal(
                                '(SUM(impact_emissions) - NULLIF(SUM(emissions), 0)) / NULLIF(SUM(emissions), 0) * 100'
                            ),
                            'emission_reduction_percentage'
                        ]
                    ],
                    where: whereClause,
                    raw: true // This option will return raw data without model instances
                }
            )
            if (laneData?.length > 0) {
                return generateResponse(res, 200, true, "Lane matrix data", laneData[0]);
            }
            return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);


        } catch (error) {
            console.log('error', error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getLaneReportTableData(req: MyUserRequest, res: Response): Promise<Response> {
        try {

            const companyConnections: any = this.connection

            const { fuelType, radius, destination, page, page_size, origin,
                sortColumn, order_by, division_id, time_id, year, quarter, region_id }: any = await req.body;

            let page_server = page ? parseInt(page) - 1 : 0;

            let replacementsObj = {
                PageSize: page_size,
                PageNumber: page,
                FuelType: fuelType,
                RadiusDistance: radius || null,
                SortColumn: sortColumn,
                SortOrder: order_by,
                Origin: origin || null,
                Destination: destination || null,
                division_id: division_id || null,
                time_id: time_id ? time_id.join(',') : null,
                year: year || null,
                quarter: quarter || null,
                region_id: region_id || null
            }

            let query = `
                        EXEC ${companyConnections["schema"]}.GetReportingData  
                            @PageSize = :PageSize, 
                            @PageNumber = :PageNumber, 
                            @FuelType = :FuelType,
                            @RadiusDistance = :RadiusDistance,
                            @SortColumn = :SortColumn,
                            @SortOrder = :SortOrder,
                            @Origin = :Origin,
                            @Destination = :Destination,
                            @DivisionID = :division_id,
                            @TimeID = :time_id,
                            @Year = :year,
                            @Quarter = :quarter,
                            @RegionId = :region_id`;

            const laneData = await companyConnections[companyConnections.company].query(query, {
                replacements: replacementsObj, // Ensure replacementsObj has all the required values
                type: companyConnections[companyConnections.company].QueryTypes.SELECT,
            });

            replacementsObj['PageSize'] = null;
            replacementsObj['PageNumber'] = null;

            const laneDataTotal = await companyConnections[companyConnections.company].query(query, {
                replacements: replacementsObj,
                type: companyConnections[companyConnections.company].QueryTypes.SELECT,
            });

            if (laneData?.length > 0) {
                const result = {
                    laneData: laneData,
                    pagination: {
                        page: page_server,
                        page_size: page_size,
                        total_count: laneDataTotal[0]?.lane_count,
                    }
                }
                return generateResponse(res, 200, true, "Lane detail", result);

            }
            return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
        } catch (error) {
            console.log(error, "error")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async optimusFuelStopLanes(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const connection: any = this.connection;
            const initMainDbConnection = connection["main"];

            if (!isCompanyEnable(connection.company, [comapnyDbAlias.PEP, comapnyDbAlias?.RBL])) {
                return generateResponse(res, 400, false, HttpStatusMessage.NOT_ACCESS);
            }

            const { lane_name, lane_id, fuel_type, radius }: any = await req.body;

            const checkIsValidProductId = await connection[connection.company].models.ProductTypeExternal.findAll({
                attributes: ['id', 'name'],
                include: [
                    {
                        model: connection[connection.company].models.ProductTypeAvailability,
                        as: 'checkProductFromMaster',
                        attributes: [],
                        required: true,
                    }
                ],
                where: { code: fuel_type },
                raw: false
            });

            if (checkIsValidProductId?.length == 0 && fuel_type != 'is_intermodal') {
                return generateResponse(res, 400, false, "Invalid fuel type");
            }

            let fuelStopData = [];
            if (fuel_type != 'is_intermodal') {
                let thresholdEv = radius;
                fuelStopData = await initMainDbConnection.query(`
                  EXEC [greensight_master].[optimusEVFuelLocations]  @LaneName = :LaneName, @ProductCode = :productCode, @radius_distance=:radius_distance`, {
                    replacements: {
                        LaneName: lane_name,
                        productCode: fuel_type,
                        radius_distance: thresholdEv
                    },
                    type: sequelize.QueryTypes.SELECT,
                });
            }

            let laneCordinates: any = {};
            if (fuel_type == 'is_intermodal') {
                laneCordinates =
                    await getIntermodalLaneDetail(
                        lane_name,
                        initMainDbConnection,
                        connection
                    );
            } else {
                laneCordinates = await initMainDbConnection.models.RecommendedKLaneCoordinate.findAll({
                    where: {
                        lane_id: lane_id,
                        k_count: 1
                    },
                    order: [['id', 'ASC']],
                })
            }


            if (laneCordinates) {
                const result = {
                    fuelStopData: fuelStopData,
                    laneCordinates: laneCordinates
                }
                return generateResponse(res, 200, true, "OPTIMUS fuel stop lanes data", result);
            }
            else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
        } catch (error) {
            console.log(error, " error ");
            // Handle errors and return a 500 response in case of an error.
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async laneSearch(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const connection: any = this.connection
            let companyConnection = connection[connection.company];

            let { keyword, page_limit, type, source, dest, radius, fuel_type,
                division_id,
                region_id,
                time_id,
                year
            } = await req.body;

            const attr = this.getAttributes(type);
            const where = await buildWhereClauseSearch(type, keyword, source, dest, 'lane_name')
            const payload = [
                { time_id: time_id },
                { division_id: division_id },
                { region_id: region_id },
                { year },
                { fuel_type },
                { radius_distance: radius }
            ];
            const whereClause = await whereClauseFn(payload);
            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];

            const searchSourceDest = await companyConnection.models.Reporting.findAll({
                attributes: attr,
                where: where,
                order: [type.toLowerCase()],
                limit: parseInt(page_limit),
            });

            if (searchSourceDest && searchSourceDest.length > 0) {
                return generateResponse(res, 200, true, "Report OD data", searchSourceDest);
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }
        } catch (error) {
            console.log(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    private getAttributes(type: string) {
        return type.toLowerCase() === "dest" ?
            [[sequelize.fn('DISTINCT', sequelize.literal(`SUBSTRING([Reporting].[lane_name], CHARINDEX('_', [Reporting].[lane_name]) + 1, LEN([Reporting].[lane_name]))`)), type.toLowerCase()]] :
            [[sequelize.fn('DISTINCT', sequelize.literal(`SUBSTRING([Reporting].[lane_name], 1, CHARINDEX('_', [Reporting].[lane_name]) - 1)`)), type.toLowerCase()]];
    }

}

export default ReportController