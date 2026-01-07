import { Sequelize } from "sequelize";
import { MyUserRequest } from "../../../../interfaces/commonInterface";
import { getAverageIntensity, getConfigConstants, getLaneEmissionTopBottomLaneData, processContributorAndDetractor, processContributorAndDetractorCommonFn, processEmissionReductionData, processRegionData, roundToDecimal, targetValuesFn, targetValuesPeriodWiseFn, whereClauseFn } from "../../../../services/commonServices";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { generateResponse } from "../../../../services/response";
import { getCarrierTypeEmissionAttributes, isCompanyEnable } from "../../../../utils";
import { comapnyDbAlias } from "../../../../constant";
const sequelize = require("sequelize");
const Op = sequelize.Op;

class CarrierTypeController {
    private readonly connection: Sequelize;

    constructor(connectionData: Sequelize) {
        this.connection = connectionData;
    }

    async getCarrierTypeTableData(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            const authenticate: any = this.connection;
            const { year, time_id, col_name, order_by, region_id } = request.body;

            let where: any = {};
            where[Op.and] = [
                sequelize.literal("CAST(total_ton_miles AS FLOAT) != 0"),
            ];

            const payload = [{ year }, { time_id }, { region_id }];
            const whereClause = await whereClauseFn(payload);
            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];

            const carrierData = await authenticate[authenticate.company].models.SummerisedCarrierType.findAll({
                attributes: [
                    [sequelize.fn('SUM', sequelize.col('SummerisedCarrierType.emissions')), 'emission'],
                    [sequelize.fn('SUM', sequelize.col('SummerisedCarrierType.emissions')), 'cost'],
                    [sequelize.fn('SUM', sequelize.col('SummerisedCarrierType.total_ton_miles')), 'total_ton_miles'],
                    [sequelize.fn('SUM', sequelize.col('SummerisedCarrierType.shipments')), 'shipments'],
                    [
                        sequelize.literal(`ROUND(
                SUM("SummerisedCarrierType"."emissions") / NULLIF(SUM("SummerisedCarrierType"."total_ton_miles"), 0), 1
            )`),
                        'intensity'
                    ],
                ],
                include: [
                    {
                        model: authenticate[authenticate.company].models.CarrierType,
                        attributes: ["id", "name"],
                        as: 'carrier_type',
                    }
                ],
                where,
                group: ["carrier_type.id", "carrier_type.name"],
                order: [
                    [col_name || "intensity", order_by || "desc"],
                ],
                raw: true
            });
            if (carrierData.length > 0) {
                const configData = await getConfigConstants(authenticate[authenticate.company].models);
                const data = await processRegionData(carrierData, configData, "carrier_type", "carrier_type", "cost");

                return generateResponse(res, 200, true, "Carrier Type Emissions", data);
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getCarrierTypeEmissionData(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            const authenticate: any = this.connection;
            const { year, toggel_data, time_id, region_id } = request.body;

            const payloadDataWhere = [
                { year: year },
                { time_id: time_id },
                { region_id: region_id }
            ];

            const where = await whereClauseFn(payloadDataWhere);
            where[Op.and].push(sequelize.literal("total_ton_miles != 0"));

            // Fetch carrier type emissions
            const carrierTypeEmissions = await this.getCarrierTypeEmissions(
                authenticate[authenticate.company].models,
                where,
                toggel_data
            );

            if (carrierTypeEmissions?.length > 0) {
                const configData = await getConfigConstants(authenticate[authenticate.company].models);

                const data = processContributorAndDetractor(
                    toggel_data,
                    carrierTypeEmissions,
                    configData,
                    "carrier_type"
                );

                return generateResponse(res, 200, true, "Carrier Type Emissions", data);
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }

        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    private async getCarrierTypeEmissions(
        initDbConnection: any,
        where: any,
        toggleData: any
    ) {
        const attributes = [
            [
                sequelize.literal(
                    "SUM(SummerisedCarrierType.emissions) / NULLIF(SUM(SummerisedCarrierType.total_ton_miles), 0)"
                ),
                "intensity"
            ],
            [sequelize.fn("SUM", sequelize.col("SummerisedCarrierType.emissions")), "emission"],
            "carrier_type_id"
        ];

        const orderBy =
            toggleData == 1
                ? sequelize.literal("emission")
                : sequelize.literal("intensity");

        return await initDbConnection.SummerisedCarrierType.findAll({
            attributes,
            where,
            include: [
                {
                    model: initDbConnection.CarrierType,
                    attributes: ["name"],
                    as: "carrier_type"
                }
            ],
            group: ["carrier_type.name", "carrier_type_id"],
            order: [[orderBy, "DESC"]],
            raw: true
        });
    }

    async getCarrierTypeMatrixData(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            const { region_id, year, time_id, carrier_type_id } = request.body;

            const payloadDataWhere = [
                { region_id: region_id },
                { year: year },
                { time_id: time_id },
                { carrier_type_id: carrier_type_id },
            ];

            const where = await whereClauseFn(payloadDataWhere);

            const matrixData = await authenticate[authenticate.company].models.SummerisedCarrierType.findAll({
                attributes: [
                    [sequelize.literal('SUM(emissions) / SUM(total_ton_miles)'), 'emissions_intensity'],
                    [sequelize.literal('SUM(emissions) / 1000000'), 'total_emissions'],
                    [sequelize.fn('SUM', sequelize.col('shipments')), 'total_shipments']
                ],
                include: [
                    {
                        model: authenticate[authenticate.company].models.CarrierType,
                        attributes: ["name"],
                        as: "carrier_type"
                    }

                ],
                group: ["carrier_type.name", "carrier_type_id"],
                where,
                raw: true
            });

            if (matrixData.length > 0) {
                return generateResponse(res, 200, true, 'Carrier Type Matrix Data', {
                    emissionsIntensity: roundToDecimal(matrixData[0].emissions_intensity),
                    totalEmissions: roundToDecimal(matrixData[0].total_emissions),
                    totalShipments: parseInt(matrixData[0].total_shipments, 10),
                    unitIntensity: "gCO2e/Ton-Mile",
                    unitEmissions: "tCO2e",
                    name: matrixData[0]['carrier_type.name']
                });
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
        } catch (error) {
            console.log(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getCarrierTypeComparisonGraph(request: MyUserRequest, res: Response): Promise<Response> {
        let authenticate: any = this.connection;
        try {
            let { carrier_type_id, year, toggel_data, time_id, region_id } = request.body;

            const where: any = {};
            where[Op.and] = [
                sequelize.literal('emissions != 0'),
                sequelize.literal('total_ton_miles != 0')
            ];

            const payload = [
                { year },
                { carrier_type_id },
                { time_id },
                { region_id }
            ];

            const whereClause = await whereClauseFn(payload);
            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];

            let order_by = toggel_data == 1 ? 'emission' : 'intensity';

            let averageIntensity = await getAverageIntensity(
                authenticate[authenticate.company]['models'],
                where,
                "SummerisedCarrierType",
                "emissions"
            );

            if (!averageIntensity?.length) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }

            let topData = await getLaneEmissionTopBottomLaneData({
                initDbConnection: authenticate[authenticate.company],
                tableName: 'SummerisedCarrierType',
                attr: ['carrier_name'],
                column: 'emissions',
                where,
                group: ['carrier_name'],
                order_by,
                sortOrder: 'DESC',
                limit: 10
            });

            let bottomData = await getLaneEmissionTopBottomLaneData({
                initDbConnection: authenticate[authenticate.company],
                tableName: 'SummerisedCarrierType',
                attr: ['carrier_name'],
                column: 'emissions',
                where,
                group: ['carrier_name'],
                order_by,
                sortOrder: 'ASC',
                limit: 10
            });

            const data = await processContributorAndDetractorCommonFn({
                toggleData: toggel_data,
                topData,
                bottomData,
                configData: authenticate,
                averageIntensity,
                fetchKey: "carrier_name"
            });

            return generateResponse(res, 200, true, 'Carrier comparison data', data);

        } catch (error) {
            console.error(error, "error");
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getCarrierTypeLaneEmission(request: MyUserRequest, res: Response): Promise<Response> {
        let authenticate: any = this.connection;
        try {
            let { carrier_type_id, year, toggel_data, page, page_size, time_id, region_id } = request.body;

            let page_server = this.getPageNumber(page);
            let page_server_size = this.getPageSize(page_size);

            const where: any = {};
            where[Op.and] = [
                sequelize.literal('(emissions) != 0'),
                sequelize.literal('(total_ton_miles) != 0')
            ];

            const payload = [
                { time_id },
                { carrier_type_id },
                { year },
                { region_id }
            ];

            const whereClause = await whereClauseFn(payload);
            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];

            let order_by = this.getOrderBy(toggel_data);


            let averageIntensity = await getAverageIntensity(
                authenticate[authenticate.company].models,
                where,
                "SummerisedCarrierType",
                "emissions"
            );

            if (averageIntensity.length === 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }

            const where1: any = {};
            where1[Op.and] = [];

            const payload1 = [
                { year },
                { time_id },
                { carrier_type_id }
            ];

            const whereClause1 = await whereClauseFn(payload1);
            where1[Op.and] = [...where1[Op.and], ...whereClause1[Op.and]];

            // TOP carriers
            let getTopCarrierEmissionData = await getLaneEmissionTopBottomLaneData({
                tableName: "SummerisedCarrierType",
                initDbConnection: authenticate[authenticate.company],
                where: where1,
                order_by,
                sortOrder: 'asc',
                limit: page_server_size,
                group: ['SummerisedCarrierType.name'],
                attr: [['name', 'lane_name']],
                column: 'emissions'
            });

            // BOTTOM carriers
            let getBottomCarrierEmissionData = await getLaneEmissionTopBottomLaneData({
                tableName: "SummerisedCarrierType",
                initDbConnection: authenticate[authenticate.company],
                where: where1,
                order_by,
                sortOrder: 'desc',
                limit: page_server_size,
                group: ['SummerisedCarrierType.name'],
                attr: [['name', 'lane_name']],
                column: 'emissions'
            });

            const {
                contributor,
                detractor,
                unit,
                average
            } = await processContributorAndDetractorCommonFn({
                toggleData: toggel_data,
                topData: getTopCarrierEmissionData,
                bottomData: getBottomCarrierEmissionData,
                configData: authenticate,
                averageIntensity,
                fetchKey: "lane_name"
            });

            const data = {
                contributor,
                detractor,
                contributor_count: contributor.length,
                detractor_count: detractor.length,
                unit,
                average: roundToDecimal(average),
                pagination: {
                    page: page_server,
                    page_size: page_server_size,
                    total_count: 10
                }
            };

            return generateResponse(res, 200, true, "Carrier Type Lane Emissions", data);

        } catch (error) {
            console.log(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    private readonly getOrderBy = (toggel_data: any) => toggel_data == 1 ? 'emission' : 'intensity'
    private readonly getPageSize = (page_size: any) => (page_size) ? parseInt(page_size) : 10;
    private readonly getPageNumber = (page: any) => (page) ? parseInt(page) - 1 : 1;

    async getCarrierTypeEmissionReduction(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            const { carrier_type_id, year, toggel_data, region_id }: any = request.body;

            let current_year: number = new Date().getFullYear() - 1;
            let next_year = current_year + 1;

            const where: any = {};
            where[Op.and] = [];
            where[Op.or] = [];

            const payload = [{ carrier_type_id: carrier_type_id }, { region_id }];
            const whereClause = await whereClauseFn(payload);
            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];

            if (year) {
                current_year = parseInt(year);
                next_year = parseInt(year) + 1;

                where[Op.or].push(
                    sequelize.where(sequelize.literal("SummerisedCarrierType.year"), current_year)
                );
                if (!isCompanyEnable(authenticate.company, [comapnyDbAlias.BMB])) {
                    where[Op.or].push(
                        sequelize.where(sequelize.literal("year"), next_year)
                    );
                }
            }

            let having: any = null;
            let groupBy: any[] = [];
            let include: any[] = [];

            
            if (toggel_data == 1) {
                if (!carrier_type_id) {
                    having = {};
                    having[Op.and] = [];
                    having[Op.and].push(sequelize.literal(`SUM(total_ton_miles) !=0`));
                }
            }

            let attributeArray = getCarrierTypeEmissionAttributes(
                authenticate,
                toggel_data
            );

            if (isCompanyEnable(authenticate.company, [comapnyDbAlias.BMB])) {
                groupBy = [
                    sequelize.literal("SummerisedCarrierType.year"),
                    sequelize.col("[SummerisedCarrierTypeTimeMapping->TimePeriod].[id]"),
                    sequelize.col("[SummerisedCarrierTypeTimeMapping->TimePeriod].[name]")
                ];
                include = [
                    {
                        model: authenticate[authenticate.company].models.TimeMapping,
                        as: "SummerisedCarrierTypeTimeMapping",
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
            let getCarrierTypeEmissionsReduction = await authenticate[authenticate.company].models.SummerisedCarrierType.findAll({
                attributes: attributeArray,
                where: where,
                include,
                group: groupBy,
                having: having,
                order: groupBy,
            });

            if (getCarrierTypeEmissionsReduction.length === 0) {
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
                tableName: 'SummerisedCarrierType',
                columnName: 'emissions',
                dataBaseTable: 'summerised_carrier_type',
                authenticate
            };

            let targetValues = [];
            if (isCompanyEnable(authenticate.company, [comapnyDbAlias.PEP, comapnyDbAlias.BMB])) {
                targetValues = await targetValuesPeriodWiseFn(
                    authenticate[authenticate.company].models,
                    { carrier_type_id: carrier_type_id },
                    requiredData,
                    authenticate['schema']
                );
            } else {
                targetValues = await targetValuesFn(
                    authenticate[authenticate.company].models,
                    { carrier_type_id: carrier_type_id },
                    requiredData,
                    authenticate['schema']
                );
            }

            let data = processEmissionReductionData({
                fetchKey: "intensity",
                current_year: current_year,
                next_year: next_year,
                emissionData: getCarrierTypeEmissionsReduction,
                targetValues: targetValues,
                company: authenticate.company
            });

            return generateResponse(res, 200, true, "Carrier Type Emissions Reduction", data);

        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }



}

export default CarrierTypeController;
