import { Response } from "express";
import { Sequelize } from "sequelize";
import { MyUserRequest } from "../../../../interfaces/commonInterface";
import { generateResponse } from "../../../../services/response";
import HttpStatusMessage from "../../../../constant/responseConstant";
import {
    getConfigConstants,
    roundToDecimal,
    whereClauseFn,
    paginate,
    callStoredProcedure,
    buildWhereClauseSearch
} from "../../../../services/commonServices";

import { getHKey, setHKey } from "../../../../redisServices";
import { redisMasterKeyApi } from "../../../../constant/moduleConstant";
import { getStandardDeviation, parseValue, getCarrierRanking, getCarrierEmissionQuery, getContributorDetractorGraphColor } from "../../../../utils"
import { comapnyDbAlias, convertToMillion } from "../../../../constant";
const sequelize = require("sequelize");
const Op = sequelize.Op;

class LaneController {
    // Private property for the database connection (Sequelize instance)
    private readonly connection: Sequelize;

    // Constructor to initialize the database connection for each instance
    constructor(connectionData: Sequelize) {
        this.connection = connectionData; // Assign the passed Sequelize instance to the private property
    }

    async getLaneEmissionTableData(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            let authenticate: any = this.connection;

            const { region_id, year, quarter, page, page_size, origin, dest, col_name, order_by, time_id, division_id } = request.body;



            let page_server = parseValue(page, 'page');
            let page_server_size = parseValue(page_size, 'page_size');

            const where: any = {};
            where[Op.and] = []

            const payload = [{ region_id: region_id }, { year: year }, { quarter: quarter }, { time_id: time_id }, { division_id: division_id }]

            const whereClause = await whereClauseFn(payload)


            if (origin && dest) {
                where[Op.and].push(sequelize.where(sequelize.fn('lower', sequelize.literal('name')), {
                    [Op.like]: `${origin.toLowerCase()}_${dest.toLowerCase()}`
                }));
            }
            else if (origin) {
                where[Op.and].push(sequelize.where(sequelize.fn('lower', sequelize.literal('name')), {
                    [Op.like]: `${origin.toLowerCase()}%`
                }));
            } else if (dest) {
                where[Op.and].push(sequelize.where(sequelize.fn('lower', sequelize.literal('name')), {
                    [Op.like]: `%_${dest.toLowerCase()}`
                }));
            }

            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];
            let sortColumn = col_name || 'emissions';
            const order = sortColumn === 'name'
                ? [[sortColumn, order_by || "desc"]]
                : [[sortColumn, order_by || "desc"], ['name']];
            let averageEmission = await authenticate[authenticate.company].models.EmissionLanes.findAll(
                {
                    attributes: [
                        [sequelize.literal('(sum(emission) / sum(total_ton_miles))'), 'intensity'],
                        [sequelize.literal(`sum(emission)/${convertToMillion}`), 'emissions'],
                    ],
                    where: where,
                    group: ['name'],
                }
            );
            if (averageEmission.length === 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, {
                    responseData: [],
                    pagination: {
                        page: page_server,
                        page_size: page_server_size,
                        total_count: 0,
                    }
                })
            }

            const totalIntensity = averageEmission?.map((i: any) => i.dataValues.emissions);
            const averageIntensity = totalIntensity.reduce((a: number, b: number) => a + b, 0) / totalIntensity.length;
            const standardDeviationData: any = await getStandardDeviation(totalIntensity, 2, 'DIV');

            let query: any = {
                attributes: [
                    [sequelize.literal('(sum(emission) / sum(total_ton_miles))'), 'intensity'],
                    [sequelize.literal(`sum(emission)/${convertToMillion}`), 'emissions'],
                    [sequelize.literal('sum(shipments)'), 'shipment_count'],
                    [sequelize.literal(`((sum(emission)/${convertToMillion}) - ${averageIntensity})`), 'ab_average'],
                    'name'
                ],
                where: where,
                group: ['name'],
                order,
            };
            const { count, rows } = await authenticate[authenticate.company].models.EmissionLanes.findAndCountAll(paginate(
                query, {
                page: page_server,
                pageSize: page_server_size
            }
            ));

            if (!rows) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND)
            }
            const configData = await getConfigConstants(authenticate[authenticate.company].models);

            const { contributorColor, detractorColor, mediumColor } = getContributorDetractorGraphColor(configData, "graph")

            for (const property of rows) {

                let compareValue = property.dataValues.intensity;
                if (compareValue > standardDeviationData.to) {
                    property.dataValues.color = detractorColor;
                } else if (compareValue >= standardDeviationData.from && compareValue <= standardDeviationData.to) {
                    property.dataValues.color = mediumColor;
                } else {
                    property.dataValues.color = contributorColor;
                }
            }
            const data = {
                responseData: rows,
                average: roundToDecimal(averageIntensity),
                standardDeviationData: standardDeviationData,
                pagination: {
                    page: page_server,
                    page_size: page_server_size,
                    total_count: count.length,
                }
            };

            return generateResponse(res, 200, true, "Lane Emission Data", data);
        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }

    }

    async getCarrierEmissionData(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            // Authenticate the request using JWT middleware
            let authenticate: any = this.connection;
            // Extract request parameters
            const { region_id, year, quarter, lane_name, division_id, time_id } = request.body;

            // Create a unique cache key based on the request payload
            const masterKey = { company: authenticate.company, key: redisMasterKeyApi.getCarrierEmissionData }

            const childKey = request.body
            // Check if the response is cached in Redis
            const cachedData = await getHKey({ masterKey: masterKey, childKey: childKey });
            if (cachedData) {
                return generateResponse(res, 200, true, "Lane Emission Data", cachedData);
            }
            const where: any = {};
            where[Op.and] = []
            const payload = [{ region_id: region_id }, { year: year }, { name: lane_name }, { quarter: quarter }, { time_id: time_id }, { division_id: division_id }]

            const whereClause = await whereClauseFn(payload)

            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];

            // Query the database to get the average intensity and average emissions data.
            let query: any = getCarrierEmissionQuery(where, "carrier", "ASC");

            let getVendorEmissionData = await authenticate[authenticate?.company]?.models.CarrierEmissions.findAll(query);

            if (getVendorEmissionData?.length > 0) {

                let carrierCode = getVendorEmissionData.map((item: any) => item.carrier);
                let carrier_ranking = await getCarrierRanking(authenticate[authenticate.company].models, carrierCode, Op);

                this.processData(getVendorEmissionData, carrier_ranking)

                // Cache the result in Redis for future use
                await setHKey({ masterKey: masterKey, childKey: childKey, value: JSON.stringify(getVendorEmissionData), expTime: 300 });

                // Return a successful response with the data.
                return generateResponse(res, 200, true, "Carrier Emission Data", getVendorEmissionData);
            } else {
                // Return a 204 response if no records were found.
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND)
            }
            // Return a successful response with the data.
        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getLaneEmissionLanesOriginDest(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            // Authenticate the request using JWT middleware
            let authenticate: any = this.connection;

            let companyConnection = authenticate[authenticate.company];
            // Destructure and initialize variables from the parsed request body.
            let { keyword, page_limit, type, source, dest, region_id, year, quarter } = request.body;

            if (this.shouldExecuteStoredProc(type, keyword, source, dest)) {
                let conditions = { region_id, year, quarter }

                const replacement = {
                    filterPrefix: keyword || null,
                    region_id: conditions?.region_id || null,
                    year: conditions?.year || null,
                    quarter: conditions?.quarter || null
                };

                const query = `EXEC ${authenticate.schema}.getEmissionLanes_dest
                @filterPrefix = :filterPrefix, 
                @region_id=:region_id,
                @quarter=:quarter,
                @year=:year`

                const data = await callStoredProcedure(replacement, companyConnection, query);
                return generateResponse(res, 200, true, "Lane Planing data", data);
            }
            // Build the 'where' and 'having' conditions based on the provided parameters.
            const payload = [{ region_id: region_id }, { year: year }, { quarter: quarter }]

            const where: any = { [Op.and]: [] };

            const whereData = await whereClauseFn(payload)
            const attr = this.getAttributes(type, 'EmissionLanes');
            const whereSeacrh = await buildWhereClauseSearch(type, keyword, source, dest, 'name')

            where[Op.and] = [...where[Op.and], ...whereData[Op.and], ...whereSeacrh[Op.and]];

            let query: any = {
                attributes: attr,
                where: where,
                order: [type.toLowerCase()],
                limit: parseInt(page_limit),
            };

            let getOriginDestinations = await authenticate[authenticate.company].models.EmissionLanes.findAll(query);
            // Check if vendor emission data was retrieved successfully.
            if (getOriginDestinations.length > 0) {
                // Return a successful response with the data.
                return generateResponse(res, 200, true, "Lane Emission Data", getOriginDestinations);
            } else {
                // Return a 204 response if no records were found.
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, [])
            }
        }
        catch (error) {
            console.log("error ", error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async locationSearchLanePlaning(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            let authenticate: any = this.connection;

            let companyConnection = authenticate[authenticate?.company];
            let { keyword, page_limit, type, source, dest } = request.body

            const attr = this.getAttributes(type, 'Emission');

            const keyName: any = comapnyDbAlias?.PEP ? "division_id" : "region_id"
            
            const checkIfExist = authenticate["userData"][keyName]

            const where = await buildWhereClauseSearch(type, keyword, source, dest, 'name')

            if (checkIfExist) {
                where[Op.and].push({ [keyName]: checkIfExist })
            }

            if (this.shouldExecuteStoredProc(type, keyword, source, dest)) {
                const data = await callStoredProcedure({ filterPrefix: keyword }, authenticate[authenticate.company], `EXEC ${authenticate["schema"]}.getfiltername_dest @filterPrefix = :filterPrefix`);
                return generateResponse(res, 200, true, "Lane Planing data", data);
            }
          
            const originData = await companyConnection.models.Emission.findAll({
                attributes: attr,
                where: where,
                order: [type.toLowerCase()],
                raw: true,
                limit: parseInt(page_limit),
            });

            if (originData && originData.length > 0) {
                return generateResponse(res, 200, true, "Lane Planing data", originData);
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }
        } catch (error) {
            console.log(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getLaneOverviewDetails(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            const authenticate: any = this.connection
            let companyConnection = authenticate[authenticate.company];

            let { region_id, year, quarter, lane_name, time_id, division_id } = request.body

            const where: any = {}
            where[Op.and] = []
            where[Op.and].push({ ['name']: lane_name })
            where[Op.and].push(sequelize.literal('emission  IS NOT NULL'))
            where[Op.and].push(sequelize.literal('total_ton_miles  IS NOT NULL'))

            const payload = [
                { region_id: region_id }, { time_id: time_id }, { division_id: division_id }]
            const whereClause = await whereClauseFn(payload)

            if (year) {
                comapnyDbAlias.BMB ? where[Op.and].push({ year: year }) : where[Op.and].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year))
            }
            if (quarter) {
                where[Op.and].push(sequelize.literal(`DATEPART(quarter, date) = ${quarter}`),);
            }

            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]]

            let geLaneOverviewDetails = await companyConnection["models"].Emission.findAll(
                {
                    attributes: [
                        [sequelize.literal('SUM(emission)/ SUM(total_ton_miles)'), 'intensity'],
                        [sequelize.literal('SUM(emission) / 1000000'), 'emission'],
                        [sequelize.literal('SUM(shipments)'), 'shipment_count'],
                        'source',
                        'destination'
                    ],
                    where: where,
                    group: ['source', 'destination'],
                });

            if (geLaneOverviewDetails.length > 0) {
                return generateResponse(res, 200, true, 'Lane Overview Data', geLaneOverviewDetails)
            } else { return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND) }
        } catch (error) {
            console.log(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    private async processData(getVendorEmissionData: any, carrier_ranking: any) {
        for (const property of getVendorEmissionData) {
            let smartwayData: any = [];
            carrier_ranking.map((item: any) => { if (item.dataValues.code == property.dataValues.carrier) smartwayData.push(item) });
            const result = [];
            for (const prop of smartwayData) {
                if (prop) {
                    result.push(prop);
                }
            }
            property.dataValues.SmartwayData = result;
        }
    }

    private shouldExecuteStoredProc(type: string, keyword: string, source: string, dest: string) {
        return type.toLowerCase() === "dest" && keyword && !dest && !source;
    }

    private getAttributes(type: string, tableName: string) {
        return type.toLowerCase() === "dest" ?
            [[sequelize.fn('DISTINCT', sequelize.literal(`SUBSTRING([${tableName}].[name], CHARINDEX('_', [${tableName}].[name]) + 1, LEN([${tableName}].[name]))`)), type.toLowerCase()]] :
            [[sequelize.fn('DISTINCT', sequelize.literal(`SUBSTRING([${tableName}].[name], 1, CHARINDEX('_', [${tableName}].[name]) - 1)`)), type.toLowerCase()]];
    }
}

export default LaneController;
