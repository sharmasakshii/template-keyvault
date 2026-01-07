import { Response } from "express";
import { Sequelize, col } from "sequelize";
import { MyUserRequest } from "../../../../interfaces/commonInterface";
import { generateResponse } from "../../../../services/response";
import HttpStatusMessage from "../../../../constant/responseConstant";
import {
    roundToDecimal,
    whereClauseFn,
    fetchIndustryData,
    getConfigConstants,
    targetValuesFn,
    processContributorAndDetractorCommonFn,
    getLaneEmissionTopBottomLaneData,
    getAverageIntensity,
    processEmissionReductionData,
    processRegionData,
    processContributorAndDetractor,
    targetValuesPeriodWiseFn
} from "../../../../services/commonServices";

const sequelize = require("sequelize");
const Op = sequelize.Op;
import { comapnyDbAlias, convertToMillion } from "../../../../constant";
import { getEmissionAttributes, isCompanyEnable } from "../../../../utils";
class RegionController {
    // Private property for the database connection (Sequelize instance)
    private readonly connection: Sequelize;

    // Constructor to initialize the database connection for each instance
    constructor(connectionData: Sequelize) {
        this.connection = connectionData; // Assign the passed Sequelize instance to the private property
    }

    async getRegionEmissionReduction(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            const { region_id, year, toggel_data, division_id }: any = request.body;
            let current_year: number = new Date().getFullYear() - 1;
            let next_year = current_year + 1;

            const where: any = {};
            where[Op.and] = []
            where[Op.or] = [];

            const payload = [{ region_id: region_id }, { division_id: division_id }]

            const whereClause = await whereClauseFn(payload)

            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];

            if (year) {
                current_year = parseInt(year);
                next_year = parseInt(year) + 1;

                where[Op.or].push(
                    sequelize.where(sequelize.literal("SummerisedEmission.year"), current_year)
                );
                if (!isCompanyEnable(authenticate.company, [comapnyDbAlias.PEP, comapnyDbAlias.BMB])) {
                    where[Op.or].push(
                        sequelize.where(sequelize.literal("year"), next_year)
                    );
                }
            }

            let having: any = null;
            let groupBy: any[] = [];
            let include: any[] = [];

            if (toggel_data == 1) {
                if (!region_id) {
                    having = {}
                    having[Op.and] = [];
                    having[Op.and].push(sequelize.literal(`SUM(total_ton_miles) !=0`));
                }
            }

            let attributeArray = getEmissionAttributes(
                authenticate,
                toggel_data
            );


            if (isCompanyEnable(authenticate.company, [comapnyDbAlias.PEP, comapnyDbAlias.BMB])) {
                groupBy = [
                    sequelize.literal("SummerisedEmission.year"),
                    sequelize.col("[SummerisedEmissionTimeMapping->TimePeriod].[id]"),
                    sequelize.col("[SummerisedEmissionTimeMapping->TimePeriod].[name]")
                ];
                include = [
                    {
                        model: authenticate[authenticate.company].models.TimeMapping,
                        as: "SummerisedEmissionTimeMapping",
                        required: true,
                        attributes: [],
                        include: [
                            {
                                model: authenticate[authenticate.company].models.TimePeriod,
                                as: "TimePeriod",
                                required: true,
                                attributes: []
                            }
                        ]
                    }
                ];

            } else {
                groupBy = [sequelize.literal("year"), sequelize.literal("quarter")];
            }

            let getRegionEmissionsReduction = await authenticate[authenticate.company].models.SummerisedEmission.findAll({
                attributes: attributeArray,
                where: where,
                include,
                group: groupBy,
                having: having,
                order: groupBy,
            });

            if (getRegionEmissionsReduction.length === 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, {
                    company_level: [],
                    targer_level: [],
                    base_level: [],
                    max: 0,
                    year: [current_year, next_year],
                });
            }
            let requiredData = {
                year: year,
                toggel_data: toggel_data,
                tableName: 'SummerisedEmission',
                columnName: 'emissions',
                dataBaseTable: 'summerised_emissions',
                authenticate
            }

            let targetValues = [];
            if (isCompanyEnable(authenticate.company, [comapnyDbAlias.PEP, comapnyDbAlias.BMB])) {
                targetValues = await targetValuesPeriodWiseFn(authenticate[authenticate.company].models, { region_id: region_id, division_id: division_id }, requiredData, authenticate['schema']);
            } else {
                targetValues = await targetValuesFn(authenticate[authenticate.company].models, { region_id: region_id, division_id: division_id }, requiredData, authenticate['schema']);
            }

            let data = processEmissionReductionData({
                fetchKey: "intensity",
                current_year: current_year, next_year: next_year, emissionData: getRegionEmissionsReduction, targetValues: targetValues, company: authenticate?.company
            }
            );
            return generateResponse(res, 200, true, "Emissions Reduction", data);

        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getRegionEmissionsMonthly(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            // Authenticate the request using JWT middleware
            let authenticate: any = this.connection;
            // Extract request parameters
            const { region_id, year, toggel_data, time_id, division_id } = request.body;


            let result: any = await authenticate[authenticate?.company]?.models.SummerisedEmission.findAll({
                attributes: [
                    [sequelize.fn('MIN', sequelize.col('year')), 'min_year'],
                    [sequelize.fn('MAX', sequelize.col('year')), 'max_year']
                ],
                where: {
                    ...(region_id && { region_id }),
                    ...(division_id && { division_id })
                }

            });

            let numbersBetween = Array.from({ length: Number(result[0]?.dataValues?.max_year) - Number(result[0]?.dataValues?.min_year) + 1 }, (v, i) => Number(result[0]?.dataValues?.min_year) + i);
            let where: any = {};

            const payload = [{ region_id: region_id }, { year: year }, { time_id: time_id }, { division_id: division_id }]
            where = await whereClauseFn(payload)

            where[Op.or] = numbersBetween.map((year) =>
                sequelize.where(sequelize.literal('year'), year)
            );

            let getRegionEmissions = await this.queryDatabase(
                region_id,
                where,
                authenticate[authenticate?.company]?.models
            );
            if (getRegionEmissions?.length > 0) {
                const dataObject = await this.transformData(
                    toggel_data,
                    getRegionEmissions
                );
                return generateResponse(res, 200, true, 'Region Emissions', dataObject)
            } else { return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND); }
        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }


    }

    async getRegion(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            const { division_id } = request.query;

            const where = division_id ? { division_id: division_id } : {}

            let getRegionEmissions: any = await authenticate[authenticate?.company]?.models.SummerisedEmission.findAll({
                attributes: [
                    'region_id',
                    [col('region_summerisedEmission.name'), 'name'],  // Aliasing the `name` field from the `Regions` model
                    [col('region_summerisedEmission.id'), 'id'],
                ],
                include: [
                    {
                        model: authenticate[authenticate?.company]?.models?.Region,  // The related model
                        attributes: [],  // No additional attributes from `Regions`, just the `name`
                        as: 'region_summerisedEmission',    // Alias used for the joined table
                    },
                ],
                where: where,
                group: ['region_id', 'region_summerisedEmission.name', 'region_summerisedEmission.id'],  // Grouping by both the region_id and name
                raw: true,  // Return plain JSON objects instead of Sequelize model instances

            });


            if (getRegionEmissions.length > 0) {
                let data = {
                    regions: getRegionEmissions
                }
                return generateResponse(res, 200, true, 'Region Emissions', data)
            } else { return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND); }
            // Return a successful response with the data.
        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getRegionIntensityByYear(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            // Authenticate the request using JWT middleware
            let authenticate: any = this.connection;
            // Extract request parameters
            const { region_id, company_id, year, quarter, time_id, division_id } = request.body;
            let current_year: number = new Date().getFullYear() - 1;
            let past_year = new Date().getFullYear() - 2;

            let where: any = {};
            where[Op.and] = []
            where[Op.or] = []

            const payload = [{ region_id: region_id }, { company_id: company_id }, { division_id: division_id }]

            const attributeArray = [
                [sequelize.fn('SUM', sequelize.cast(sequelize.col('total_ton_miles'), 'FLOAT')), 'total_ton_miles'],
                [sequelize.fn('SUM', sequelize.cast(sequelize.col('emissions'), 'FLOAT')), 'emission'],
                [sequelize.literal('year'), 'year']
            ];
            if (year) {
                current_year = parseInt(year);
                past_year = year - 1;
                where[Op.or].push(sequelize.where(sequelize.literal('year'), past_year));
                where[Op.or].push(sequelize.where(sequelize.literal('year'), current_year));
            }

            if (quarter) {
                where[Op.and].push(sequelize.where(sequelize.literal('quarter'), quarter));
            }
            if (time_id) {
                where[Op.and].push(sequelize.where(sequelize.literal('time_id'), time_id));
            }


            const whereClause = await whereClauseFn(payload)
            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];


            let result: any = await authenticate[authenticate?.company]?.models.SummerisedEmission.findAll({
                attributes: attributeArray,
                where: where,
                group: [sequelize.col('year')],
                order: [sequelize.literal('year')],
                raw: true
            });

            if (result?.length > 0) {
                let industryData = await fetchIndustryData(authenticate[authenticate.company]);
                let data = await this.processData(result, year, quarter, past_year, current_year, industryData);
                return generateResponse(res, 200, true, 'Region Emissions', data)
            } else { return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND); }
            // Return a successful response with the data.
        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }


    }

    async getRegionEmissionData(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            // Authenticate the request using JWT middleware
            let authenticate: any = this.connection;
            // Extract request parameters
            const { region_id, year, quarter, toggel_data, time_id, division_id } = request.body;
            const payloadDataWhere = [{ region_id: region_id }, { year: year }, { quarter: quarter }, { time_id: time_id }, { division_id: division_id }]

            const where = await whereClauseFn(payloadDataWhere);
            where[Op.and].push(sequelize.literal("total_ton_miles != 0"))

            // Get region emissions based on toggle data
            const regionEmissions = await this.getRegionEmissions(authenticate[authenticate?.company]?.models, where, toggel_data);

            if (regionEmissions?.length > 0) {
                // Process contributor and detractor data
                let configData = await getConfigConstants(authenticate[authenticate?.company]?.models)
                const data = processContributorAndDetractor(
                    toggel_data,
                    regionEmissions,
                    configData,
                    "region_summerisedEmission"
                );
                return generateResponse(res, 200, true, 'Region Emissions', data)
            } else { return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND) }

        } catch (error) {
            console.log(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getLaneEmission(request: MyUserRequest, res: Response): Promise<Response> {
        let authenticate: any = this.connection
        try {
            let { region_id, year, quarter, toggel_data, page, page_size, time_id, division_id } = request.body
            let page_server = this.getPageNumber(page);
            let page_server_size = this.getPageSize(page_size);

            const where: any = {}
            where[Op.and] = []
            where[Op.and].push(sequelize.literal('(emission) != 0 '));
            where[Op.and].push(sequelize.literal('(total_ton_miles) != 0 '));

            if (year) {
                where[Op.and].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year))
            }
            if (quarter) {
                where[Op.and].push(sequelize.literal(`DATEPART(quarter, date) = ${quarter}`),);
            }

            const payload = [{ time_id: time_id }, { division_id: division_id }, { region_id: region_id }];

            const whereClause = await whereClauseFn(payload)

            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]]

            let order_by = this.getOrderBy(toggel_data)

            let averageIntensity = await getAverageIntensity(authenticate[authenticate.company].models, where, "Emission");


            if (averageIntensity.length === 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND)
            }

            const where1: any = {}
            where1[Op.and] = []

            const payload1 = [{ year: year }, { time_id: time_id }, { division_id: division_id }, { quarter: quarter }, { region_id: region_id }]

            const whereClause1 = await whereClauseFn(payload1)

            where1[Op.and] = [...where1[Op.and], ...whereClause1[Op.and]]

            let getTopLaneEmissionData = await getLaneEmissionTopBottomLaneData({ tableName: "EmissionLanes", initDbConnection: authenticate[authenticate.company], where: where1, order_by: order_by, sortOrder: 'asc', limit: page_server_size, group: ['name'], attr: [['name', 'lane_name']], })

            let getBottomLaneEmissionData = await getLaneEmissionTopBottomLaneData({
                tableName: "EmissionLanes", initDbConnection: authenticate[authenticate.company], where: where1, order_by: order_by, sortOrder: 'desc', limit: page_server_size, group: ['name'], attr: [['name', 'lane_name']]
            })

            const {
                contributor,
                detractor,
                unit,
                average
            } = await processContributorAndDetractorCommonFn({ toggleData: toggel_data, topData: getTopLaneEmissionData, bottomData: getBottomLaneEmissionData, configData: authenticate, averageIntensity: averageIntensity, fetchKey: "lane_name" })

            const data = {
                contributor: contributor,
                detractor: detractor,
                contributor_count: contributor.length,
                detractor_count: detractor.length,
                unit: unit,
                average: roundToDecimal(average),
                pagination: {
                    page: page_server,
                    page_size: page_server_size,
                    total_count: 10,
                }
            };
            return generateResponse(res, 200, true, "Lane Emissions", data);

        }
        catch (error) {
            console.log(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    };

    async getRegionTableData(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            // Authenticate the request using JWT middleware
            let authenticate: any = this.connection;
            // Extract request parameters
            const { region_id, year, quarter, col_name, order_by, time_id, division_id } = request.body;


            let where: any = {};
            where[Op.and] = [
                sequelize.literal("CAST(total_ton_miles AS FLOAT) != 0"),
            ];
            const payload = [{ region_id: region_id }, { quarter: quarter }, { year: year }, { time_id: time_id }, { division_id: division_id }]
            const whereClause = await whereClauseFn(payload)
            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];

            let getRegionData = await
                authenticate[authenticate?.company]?.models?.SummerisedEmission.findAll({
                    attributes: [
                        [
                            sequelize.literal(
                                "(SELECT ROUND(SUM(CAST(emissions AS FLOAT)) / SUM(CAST(total_ton_miles AS FLOAT)), 1))"
                            ),
                            "intensity",
                        ],
                        [
                            sequelize.fn(
                                "SUM",
                                sequelize.cast(sequelize.col("emissions"), "FLOAT")
                            ),
                            "emission",
                        ],
                        [
                            sequelize.fn(
                                "SUM",
                                sequelize.cast(sequelize.col("total_ton_miles"), "FLOAT")
                            ),
                            "total_ton_miles",
                        ],
                        [
                            sequelize.fn(
                                "SUM",
                                sequelize.cast(sequelize.col("emissions"), "FLOAT")
                            ),
                            "cost",
                        ],
                        [
                            sequelize.fn(
                                "SUM",
                                sequelize.cast(sequelize.col("shipments"), "FLOAT")
                            ),
                            "shipments",
                        ],
                    ],
                    where: where,
                    include: [
                        {
                            model: authenticate[authenticate?.company]?.models.Region,
                            attributes: ["name"],
                            as: "region_summerisedEmission",
                        },
                    ],
                    group: ["region_summerisedEmission.name"],
                    order: [
                        [col_name || "intensity", order_by || "desc"],
                    ],
                    raw: true,
                });


            if (getRegionData?.length > 0) {
                let configData = await getConfigConstants(authenticate[authenticate?.company]?.models)
                let data = await processRegionData(getRegionData, configData, "region_summerisedEmission", "region", 'cost');

                return generateResponse(res, 200, true, 'Region Emissions', data)
            } else { return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND); }
            // Return a successful response with the data.
        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }


    };

    async getLaneCarrierOverviewDetail(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            // Authenticate the request using JWT middleware
            let authenticate: any = this.connection;
            // Extract request parameters
            const { region_id, year, quarter, time_id, division_id } = request.body;


            let where: any = {};
            where[Op.and] = [
                sequelize.literal("CAST(total_ton_miles AS FLOAT) != 0"),
            ];
            const payload = [{ region_id: region_id }, { quarter: quarter }, { year: year }, { time_id: time_id }, { division_id: division_id }]
            const whereClause = await whereClauseFn(payload)
            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];

            let getRegionEmissions = await
                authenticate[authenticate?.company]?.models?.SummerisedEmission.findAll({
                    attributes: [
                        [
                            sequelize.literal(
                                "ROUND(sum(CAST(emissions AS FLOAT)) / SUM(CAST(total_ton_miles AS FLOAT)), 1)"
                            ),
                            "intensity",
                        ],
                        [
                            sequelize.literal(`SUM(emissions)/${convertToMillion}`),
                            "emissions",
                        ],
                        [sequelize.literal("SUM(CAST(shipments AS FLOAT))"), "shipment_count"],
                    ],
                    where: where, // Apply the WHERE clause to the query
                });
            const data = {
                carrierDto: getRegionEmissions,
            };

            return generateResponse(res, 200, true, 'Region Emissions', data)
            // Return a successful response with the data.
        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }


    };

    private readonly getOrderBy = (toggel_data: any) => toggel_data == 1 ? 'emission' : 'intensity'
    private readonly getPageSize = (page_size: any) => (page_size) ? parseInt(page_size) : 10;
    private readonly getPageNumber = (page: any) => (page) ? parseInt(page) - 1 : 1;

    private async queryDatabase(region_id: any, where: {}, sequelizeInstances: { SummerisedEmission: { findAll: (arg0: { attributes: any[][]; where: {}; include: { model: any; attributes: string[]; }[]; group: any[]; order: any[]; raw: boolean; }) => any; }; Region: any; }) {
        let attributes = [
            [sequelize.literal(`SUM(total_ton_miles)`), 'emission_per_ton'],
            [sequelize.literal(`SUM(emissions)/${convertToMillion}`), 'emission'],

            [sequelize.literal('year'), 'year'],
        ];
        let group = [sequelize.literal('year')];
        let includes = [];
        if (region_id) {
            attributes.push(['region_id', 'region_id']);
            includes.push({
                model: sequelizeInstances.Region,
                attributes: ['name'],
                as: 'region_summerisedEmission'
            })
            group.push('region_id');
            group.push('region_summerisedEmission.name')
        }
        return sequelizeInstances.SummerisedEmission.findAll({
            attributes: attributes,
            where: where,
            include: includes,
            group: group,
            order: [sequelize.literal('year')],
            raw: true
        });
    }

    private async transformData(
        toggle_data: number,
        getRegionEmissions: any[]
    ) {

        let dataObject = [];
        const lables = [...new Set(getRegionEmissions.map((item: any) => item.year))];

        dataObject.push({
            name: 'Unit',
            data: this.getUnit(toggle_data),
        });

        dataObject.push({
            name: 'lables',
            data: lables,
        });

        for (const property of getRegionEmissions) {
            let intensityData = roundToDecimal(property.emission / property.emission_per_ton);
            let region_name_string = property['region_summerisedEmission.name'] || 'OTHER';
            property.intensity = intensityData;
            property.regionName = region_name_string;

        }

        dataObject.push({
            name: 'list',
            data: getRegionEmissions,
        });
        return dataObject;
    }
    private getUnit(toggle_data: number) {
        return toggle_data == 1 ? 'tCO2e' : 'g'
    }
    private async processData(getRegionEmissions: any, year: any, quarter: any, past_year: any, current_year: any, industryData: any) {
        let data = [];
        let baseData = [];
        for (const property of getRegionEmissions) {
            let intensityData = roundToDecimal(property.emission / property.total_ton_miles);
            property.intensity = intensityData;
            property.quarter = (quarter) ? property.quarter : "";
            baseData.push(intensityData);
        }
        let max = Math.max(...baseData);
        let baseLine = max * (20 / 100);
        data.push({
            dataset: getRegionEmissions,
            label: [past_year, current_year],
            industrialAverage: industryData[0] ? industryData[0]?.dataValues?.average_intensity : 0,
            baseLine: roundToDecimal(max + baseLine),
            max: roundToDecimal(max),
            graphMax: roundToDecimal((max + baseLine) + (max + baseLine) * (15 / 100))
        });
        return data;
    }

    private async getRegionEmissions(initDbConnection: any, where: any, toggleData: any) {
        const attributes = [
            [sequelize.literal('SUM(emissions) / SUM(total_ton_miles)'), 'intensity'],
            [sequelize.fn('SUM', sequelize.col('emissions')), 'emission'],
            'region_id'
        ];

        const orderBy = toggleData == 1 ? sequelize.literal('emission') : sequelize.literal('intensity');

        return await initDbConnection.SummerisedEmission.findAll({
            attributes,
            where,
            include: [
                {
                    model: initDbConnection.Region,
                    attributes: ['name'],
                    as: 'region_summerisedEmission',
                }
            ],
            group: ['region_summerisedEmission.name', 'region_id'],
            order: [[orderBy, 'DESC']],
            raw: true
        });
    }
}

export default RegionController;
