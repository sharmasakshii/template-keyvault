import { Sequelize } from "sequelize";
import { MyUserRequest } from "../../../../interfaces/commonInterface";
import { fetchIndustryData, getAverageIntensity, getConfigConstants, getLaneEmissionTopBottomLaneData, paginate, processContributorAndDetractorCommonFn, processRegionData, roundToDecimal, whereClauseFn } from "../../../../services/commonServices";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { generateResponse } from "../../../../services/response";
import { getCarrierRanking, getContributorDetractorGraphColor, getStandardDeviation } from "../../../../utils";
import { convertToMillion } from "../../../../constant";
const sequelize = require("sequelize");
const Op = sequelize.Op;

class CarrierController {
    private readonly connection: Sequelize;

    constructor(connectionData: Sequelize) {
        this.connection = connectionData;
    }

    async getVendorTableData(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            // Authenticate the request using JWT middleware
            let authenticate: any = this.connection;

            const companyConnections = authenticate[authenticate.company];

            const { region_id, year, quarter, toggel_data = 1, page, page_size, search_name, col_name, order_by, min_range, max_range, time_id, division_id } = request.body;


            let page_server = (page) ? parseInt(page) - 1 : 0;
            let page_server_size = (page_size) ? parseInt(page_size) : 30;

            const payloadDataWhere = [{ region_id: region_id }, { year: year }, { quarter: quarter }, { time_id: time_id }, { division_id: division_id }]
            let where: any = {}
            let whereClause = await whereClauseFn(payloadDataWhere)

            const having: any = {
                [Op.and]: []
            }

            where[Op.and] = [sequelize.literal('(total_ton_miles) != 0')]
            if (search_name) {
                where[Op.and].push({
                    [Op.or]: [
                        sequelize.where(
                            sequelize.fn('lower', sequelize.col('carrier_name')),
                            { [Op.like]: `%${search_name.toLowerCase()}%` }
                        ),
                        sequelize.where(
                            sequelize.fn('lower', sequelize.col('carrier')),
                            { [Op.like]: `%${search_name.toLowerCase()}%` }
                        )
                    ]
                });
            }

            if (min_range && max_range) {
                having[Op.and].push(sequelize.literal(`ROUND(SUM(emissions) / SUM(total_ton_miles), 1) BETWEEN ${min_range} AND ${max_range}`))
            }
            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]]


            let sortColumn = this.getColName(col_name);

            let group = ['carrier_name', 'carrier_logo', 'carrier']


            let carriersData = await companyConnections?.models.SummerisedCarrier.findAll(
                {
                    attributes: [[sequelize.literal(' SUM(emissions) / SUM(total_ton_miles) '), 'intensity'],
                    [sequelize.literal(`SUM(emissions) / ${convertToMillion}`), 'emission']],
                    where: where,
                    group: ['carrier_name'],
                }
            );

            const totalIntensity = carriersData.map((i: { dataValues: { intensity: number; }; }) => i.dataValues.intensity);

            const averageIntensity = totalIntensity.reduce((a: number, b: number) => a + b, 0) / totalIntensity.length;
            const standardDeviationData: any = await getStandardDeviation(totalIntensity, 2, 'DIV');
            // Query the database to get vendor emission data with pagination and sorting.

            const order = sortColumn === 'carrier_name'
                ? [[sortColumn, order_by || "desc"]]
                : [[sortColumn, order_by || "desc"], ['carrier']];

            let query: any = {
                attributes: [
                    [sequelize.literal('SUM(emissions) / SUM(total_ton_miles)'), 'intensity'],
                    [sequelize.literal(`SUM(emissions/${convertToMillion})`), 'emissions'],
                    [sequelize.literal('SUM(shipments)'), 'shipment_count'],
                    'carrier_name',
                    'carrier_logo',
                    'carrier'
                ],
                where: where,
                group: ['carrier_name', 'carrier_logo', 'carrier'],
                having: having,
                order: order,
            };

            let totalVendorEmissionData = await companyConnections.models.SummerisedCarrier.findAll({
                attributes: [
                    'carrier_name',
                ],
                where: where,
                group: group,
                having: having,
                raw: true
            });

            let getVendorEmissionData = await companyConnections?.models.SummerisedCarrier.findAll(paginate(
                query,
                {
                    page: page_server,
                    pageSize: page_server_size
                }
            ));
            if (getVendorEmissionData?.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, [])
            }
            const configData = await getConfigConstants(companyConnections?.models);

            let carrierCode = getVendorEmissionData.map((item: any) => (item?.carrier));

            let carrier_ranking = await getCarrierRanking(companyConnections?.models, carrierCode, Op);
            // Iterate through the result data and set a color property based on a comparison.
            for (const property of getVendorEmissionData) {
                let smartwayData = [];

                smartwayData = carrier_ranking?.filter((item: any) => item.dataValues.code == property.dataValues.carrier);

                let compareValue = this.getCompareValue(toggel_data, property.dataValues)

                const { contributorColor, detractorColor, mediumColor } = getContributorDetractorGraphColor(configData, "graph")


                if (compareValue > standardDeviationData.to) {
                    property.dataValues.color = detractorColor;
                } else if (compareValue >= standardDeviationData.from && compareValue <= standardDeviationData.to) {
                    property.dataValues.color = mediumColor;
                } else {
                    property.dataValues.color = contributorColor;
                }
                property.dataValues.SmartwayData = this.getSmartwayDataRank(smartwayData);
            }

            const data = {
                responseData: getVendorEmissionData,
                average: roundToDecimal(averageIntensity),
                pagination: {
                    page: page_server,
                    page_size: page_server_size,
                    total_count: totalVendorEmissionData?.length,
                }
            };
            // Return a successful response with the data.
            return generateResponse(res, 200, true, "vendor Data", data);

        }
        catch (error) {
            console.log(error, "error")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }

    }

    async getVendorCarrierOverview(request: MyUserRequest, res: Response): Promise<Response> {

        try {
            const authenticate: any = this.connection

            const { id, region_id, year, quarter, division_id, time_id } = request.body
            let where: any = {};

            where[Op.and] = [sequelize.literal("total_ton_miles  != 0")];
            where[Op.and].push({ carrier: id })
            where[Op.and] = [sequelize.literal("total_ton_miles  != 0")]

            const payload = [{ carrier: id }, { region_id: region_id }, { 'year': year }, { 'quarter': quarter }, {
                division_id: division_id
            }, { time_id: time_id }]

            const whereClause = await whereClauseFn(payload)

            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]]

            const companyConnection = authenticate[authenticate.company]

            const attr = [
                [sequelize.literal('ROUND(sum(emissions) / SUM(total_ton_miles), 1)'), "intensity"],
                [sequelize.literal('SUM(emissions)/1000000'), "emissions"],
                [sequelize.literal('SUM(shipments)'), "shipment_count"]
            ]

            let getVendorEmissionData = await companyConnection["models"].SummerisedCarrier.findAll({
                attributes: attr,
                where: where,
                group: ["carrier_name"],
            });

            let whereNot: any = {};
            whereNot[Op.and] = [sequelize.literal("total_ton_miles != 0")];

            const payloadWhereNot = [{ region_id }, { year }, { quarter }, { division_id }, { time_id }]

            const whereClauseNot = await whereClauseFn(payloadWhereNot)

            whereNot[Op.and] = [...whereNot[Op.and], ...whereClauseNot[Op.and]]

            let getTotalVendorEmissionData: any = await companyConnection["models"].SummerisedCarrier.findAll({
                attributes: attr,
                where: whereNot,
                group: ["carrier_name"],
            });

            if (getVendorEmissionData?.length == 0 || getTotalVendorEmissionData?.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND)
            }

            let reduceValue
            let baseLine = 0

            const reduceArr = getTotalVendorEmissionData?.map((ele: any) => ele?.dataValues?.intensity)
            reduceValue = reduceArr.reduce((a: number, b: number) => a + b, 0) / reduceArr.length;
            baseLine = reduceValue * (20 / 100);

            let summerisedCarrierdata = await companyConnection["models"].SummerisedCarrier.findAll({
                attributes: [
                    [sequelize.literal('ROUND(sum(emissions) / SUM(total_ton_miles), 1)'), "intensity"],
                    'carrier_name',
                    'carrier_logo',
                    'carrier'
                ],
                where: where,
                group: ['carrier_name', 'carrier_logo', 'carrier']
            });

            let carrierCode = [];
            let smartwayData: any = [];

            carrierCode.push(summerisedCarrierdata?.[0]?.dataValues?.carrier);

            let carrier_ranking = await getCarrierRanking(companyConnection["models"], carrierCode, Op);

            carrier_ranking?.map((item: any) => {
                if (item.dataValues.code == summerisedCarrierdata?.[0]?.dataValues?.carrier)
                    smartwayData.push(item);
            });

            let industryData = await fetchIndustryData(companyConnection);

            const data = {
                responseData: {
                    carrier_name: summerisedCarrierdata?.[0]?.dataValues?.carrier_name,
                    carrier_logo: summerisedCarrierdata?.[0]?.dataValues?.carrier_logo,
                    carrier: summerisedCarrierdata?.[0]?.dataValues?.carrier,
                    SmartwayData: this.getSmartwayDataRank(smartwayData),
                    intensity: summerisedCarrierdata?.[0]?.dataValues?.intensity,
                    data: [
                        {
                            year: year,
                            intensity: reduceValue,
                        },
                        {
                            year: year,
                            intensity: summerisedCarrierdata?.[0]?.dataValues?.intensity,
                        },
                    ],
                    industrialAverage: industryData[0] ? industryData[0]?.dataValues?.average_intensity : 0,
                    baseLine: roundToDecimal(baseLine),
                    vendorEmissionData: getVendorEmissionData[0],
                    totalVendorEmissionData: getTotalVendorEmissionData[0],
                    max: getTotalVendorEmissionData[0]?.dataValues?.intensity,
                },
            }
            return generateResponse(res, 200, true, "Vendor Emissions", data);
        } catch (error) {
            console.log(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getLaneBreakdown(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        const authenticate: any = this.connection
        try {
            const { id, year, region_id, quarter, toggel_data, division_id, time_id } = request.body

            const where: any = {};
            where[Op.and] = [];
            where[Op.and].push({ carrier: id });
            where[Op.and].push(
                sequelize.where(sequelize.literal("emission"), {
                    [Op.not]: 0,
                })
            );
            if (year) {
                where[Op.and].push(
                    sequelize.where(sequelize.fn("YEAR", sequelize.col("date")), year)
                );
            };
            if (quarter) {
                where[Op.and].push(
                    sequelize.literal(`DATEPART(quarter, date) = ${quarter}`)
                );
            };

            const payload = [{
                division_id: division_id
            }, {
                time_id: time_id
            }, {
                region_id: region_id
            }]

            const whereClause = await whereClauseFn(payload)
            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]]

            let order_by = "intensity";
            if (toggel_data == 1) {
                order_by = "emission";
            }

            let averageIntensity = await getAverageIntensity(authenticate[authenticate.company]['models'], where, "Emission")

            let getTopLaneEmissionData = await getLaneEmissionTopBottomLaneData({ tableName: "Emission", initDbConnection: authenticate[authenticate.company], where: where, order_by: order_by, sortOrder: 'asc', limit: 10, group: ["name"], attr: ['name'] })

            let getButtomLaneEmissionData = await getLaneEmissionTopBottomLaneData({ tableName: "Emission", initDbConnection: authenticate[authenticate.company], where: where, order_by: order_by, sortOrder: 'desc', limit: 10, group: ["name"], attr: ['name'] })

            const data = await processContributorAndDetractorCommonFn({ toggleData: toggel_data, topData: getTopLaneEmissionData, bottomData: getButtomLaneEmissionData, configData: authenticate, averageIntensity: averageIntensity, fetchKey: "name", type: "breakDown" })

            return generateResponse(res, 200, true, "Lane break down data", data);

        } catch (error) {
            console.log(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getCarrierRegionComparisonTable(request: MyUserRequest, res: Response): Promise<Response> {
        let authenticate: any = this.connection

        try {
            const companyConnection = authenticate[authenticate.company]
            let { carrier, region_id, year, quarter, col_name, order_by, division_id, time_id } = request.body

            const where: any = {}
            where[Op.and] = []
            where[Op.and].push(sequelize.literal('emissions != 0 '));
            where[Op.and].push(sequelize.literal('total_ton_miles  != 0 '));

            const payload = [{ year: year }, { quarter: quarter }, { carrier: carrier }, {
                region_id: region_id
            }, {
                division_id: division_id
            },
            {
                time_id: time_id
            }]

            const whereClause = await whereClauseFn(payload)
            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];

            let getTopCarrierEmissionData = await companyConnection["models"].SummerisedCarrier.findAll(
                {
                    attributes: ['carrier',
                        'carrier_name',
                        'region_id',
                        [sequelize.literal('SUM(emissions) / SUM(total_ton_miles)'), 'intensity'],
                        [sequelize.literal('SUM(emissions)'), 'emission'],
                        [sequelize.literal('SUM(emissions)'), 'cost'],
                        [sequelize.literal('SUM(shipments)'), 'shipment_count'],
                    ],
                    where: where,
                    include: [
                        {
                            model: companyConnection["models"].Region,
                            attributes: ['id', 'name'],
                            as: "regions"
                        }
                    ],
                    group: ['region_id', 'regions.id', 'regions.name', 'carrier_name', 'carrier'],
                    order: [
                        [col_name ?? "intensity", order_by ?? "desc"],
                    ],
                    raw: true,
                });

            if (getTopCarrierEmissionData.length === 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }

            let configData = await getConfigConstants(companyConnection["models"])

            let data = await processRegionData(getTopCarrierEmissionData, configData, "regions", "regions", 'cost');

            return generateResponse(
                res,
                200,
                true,
                "Get Carrier Region Table Data",
                data
            );
        } catch (error) {
            console.log(error, "error");
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getRegionCarrierComparisonGraph(request: MyUserRequest, res: Response): Promise<Response> {
        let authenticate: any = this.connection
        try {
            let { region_id, year, quarter, toggel_data, time_id, division_id } = request.body

            const where: any = {}
            where[Op.and] = []
            where[Op.and].push(sequelize.literal('emissions != 0 '));
            where[Op.and].push(sequelize.literal('total_ton_miles != 0 '));

            const payload = [{ year: year }, { quarter: quarter }, { region_id: region_id }, { time_id: time_id }, { division_id: division_id }]

            const whereClause = await whereClauseFn(payload)

            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]]

            let order_by = 'intensity';
            if (toggel_data == 1) {
                order_by = 'emission';
            }

            let averageIntensity = await getAverageIntensity(authenticate[authenticate.company]['models'], where, "SummerisedCarrier", "emissions")

            if (averageIntensity?.length === 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND)
            }

            let getTopCarrierEmissionData = await getLaneEmissionTopBottomLaneData({ tableName: "SummerisedCarrier", initDbConnection: authenticate[authenticate.company], where: where, order_by: order_by, sortOrder: 'asc', limit: 10, group: ['carrier_name', 'carrier'], attr: ['carrier', 'carrier_name',], column: 'emissions' })

            let getButtomCarrierEmissionData = await getLaneEmissionTopBottomLaneData({
                tableName: "SummerisedCarrier", initDbConnection: authenticate[authenticate.company], where: where, order_by: order_by, sortOrder: 'desc', limit: 10, group: ['carrier_name', 'carrier'], attr: ['carrier', 'carrier_name',], column: 'emissions'
            })

            const data = await processContributorAndDetractorCommonFn({ toggleData: toggel_data, topData: getTopCarrierEmissionData, bottomData: getButtomCarrierEmissionData, configData: authenticate, averageIntensity: averageIntensity, fetchKey: "carrier_name" })

            return generateResponse(res, 200, true, 'Region carrier comparission data', data)

        } catch (error) {
            console.log(error, "error");
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }

    }

    private readonly getSmartwayDataRank = (smartwayData: any) => {
        const result = [];
        for (const prop of smartwayData) {
            if (prop) {
                result.push(prop);
            }
        }
        return result
    }

    private readonly getColName = (col_name: any) => col_name === "carrier_name" ? 'carrier_name' : col_name

    private readonly getCompareValue = (toggel_data: any, property: any) => toggel_data === 1 ? property.intensity : property.emissions

    async getLaneCarrierName(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            const authenticate: any = this.connection
            let companyConnection = authenticate[authenticate.company];
            let { region_id, division_id, time_id, quarter, year } = request.body;

            const payload = [{
                division_id: division_id
            }, {
                time_id: time_id
            }, {
                quarter: quarter
            },
            {
                year: year
            },
            {
                region_id: region_id
            }
            ]
            const whereClause = await whereClauseFn(payload);

            let carrierList = await companyConnection["models"].SummerisedCarrier.findAll({
                attributes: [
                    [sequelize.fn("DISTINCT", sequelize.col("carrier")), "carrier_code"],
                    "carrier_name",
                ],
                where: whereClause,
                group: ["carrier", "carrier_name"],
                order: [sequelize.literal("carrier_name")],
            });
            const carrierDto = [];

            let carrierCode = carrierList.map((item: any) => item.dataValues.carrier_code);
            let carrier_ranking = await getCarrierRanking(
                companyConnection["models"],
                carrierCode,
                Op
            );

            for (const property of carrierList) {
                let smartwayData: any = [];
                carrier_ranking.map((item: any) => {
                    if (item.dataValues.code == property.dataValues.carrier_code)
                        smartwayData.push(item);
                });

                const n = 2; // Number of elements to extract
                const result = [];
                for (let i = 0; i < n; i++) {
                    if (smartwayData[i]) {
                        result.push(smartwayData[i]);
                    }
                }

                carrierDto.push({
                    carrier_code: property.dataValues.carrier_code,
                    carrier_name: property.dataValues.carrier_name,
                    SmartwayData: result,
                });
            }
            const data = {
                carrierList: carrierDto,
            };
            return generateResponse(res, 200, true, "Vendor Emissions", data);
        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    /**
 * @description API to get region table data.
 * @exception Target level is static as of now because of no info avialble.
 * @param {region_id, year, quarter, col_name, order_by} request 
 * @version V.1
 * @returns 
 */
    async getVendorEmissionComparison(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            const authenticate: any = this.connection
            let companyConnection = authenticate[authenticate.company];
            // Read the request body
            let { toggel_data, carrier1, carrier2 } =
                request.body;
            let carrierArray = [carrier1, carrier2];
            const where = await this.buildWhereClause(request.body);

            const attributeQuery = this.getAttributeQuery(toggel_data);

            let getVendorEmissionData = await companyConnection["models"].SummerisedCarrier.findAll({
                attributes: this.buildAttributes(attributeQuery),
                where: where,
                group: ["carrier", "carrier_name", "carrier_logo"],
            });

            if (getVendorEmissionData) {
                const data = await this.processData(companyConnection, getVendorEmissionData, carrierArray);
                return generateResponse(res, 200, true, "Vendor Emissions Comparison Data", data);
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
        } catch (error) {
            console.log('error  ', error)
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    private async buildWhereClause(requiredData: any) {
        let { region_id, year, quarter, carrier1, carrier2, time_id, division_id } =
            requiredData;

        const payloadDataWhere = [{ region_id: region_id }, { year: year }, { quarter: quarter }, { time_id: time_id }, { division_id: division_id }]
        let where = await whereClauseFn(payloadDataWhere)
        const carrierArray = [carrier1, carrier2];
        where[Op.and].push(
            sequelize.where(sequelize.literal('carrier'), {
                [Op.in]: carrierArray,
            })
        );

        return where;
    }

    private getAttributeQuery(toggel_data: any) {
        let attributeQuery;
        if (toggel_data == 0) {
            attributeQuery = [
                sequelize.literal(
                    'ROUND(sum(CAST(emissions AS FLOAT)) / SUM(CAST(total_ton_miles AS FLOAT)), 1)'
                ),
                'intensity',
            ];
        } else {
            attributeQuery = [
                sequelize.literal('SUM(CAST(emissions AS FLOAT))/1000000'),
                'emission',
            ];
        }
        return attributeQuery;
    }

    private buildAttributes(attributeQuery: any) {
        let attributes = [
            [sequelize.fn('MAX', sequelize.col('id')), 'id'],
            attributeQuery,
            [
                sequelize.literal(
                    'ROUND(sum(CAST(emissions AS FLOAT)) / SUM(CAST(total_ton_miles AS FLOAT)), 1)'
                ),
                'intensity',
            ],
            [
                sequelize.literal('SUM(CAST(emissions AS FLOAT))/1000000'),
                'emission',
            ],
            [
                sequelize.literal('SUM(CAST(shipments AS FLOAT))'),
                'shipments',
            ],
            'carrier_name',
            'carrier',
            'carrier_logo',
        ];

        return attributes;
    }

    private async processData(companyConnection: any, getVendorEmissionData: any, carrierArray: any) {
        let data = [];
        let baseDataIntensity = [];
        let baseDataEmission = [];
        let responseData: any = [];

        for (const property1 in carrierArray) {
            let searchProperty = getVendorEmissionData.find(
                (x: any) =>
                    x.dataValues.carrier === carrierArray[property1]
            );
            if (searchProperty) {
                let carrier_name =
                    searchProperty.dataValues.carrier_name;

                let carrier =
                    searchProperty.dataValues.carrier;

                responseData.push({
                    intensity: searchProperty.dataValues.intensity,
                    emission: searchProperty.dataValues.emission,
                    shipments: searchProperty.dataValues.shipments,
                    carrier_name: carrier_name,
                    carrier: carrier,
                    carrier_logo: searchProperty.dataValues.carrier_logo,
                });
                baseDataIntensity.push(searchProperty.dataValues.intensity);
                baseDataEmission.push(searchProperty.dataValues.emission);
            } else {
                let carrier = await companyConnection["models"].Emission.findOne({
                    attributes: ['carrier', 'carrier_logo'],
                    where: { carrier: carrierArray[property1] },
                });
                responseData.push({
                    intensity: 0,
                    emission: 0,
                    shipments: 0,
                    carrier_name: "",
                    carrier: carrierArray[property1],
                    carrier_logo: carrier?.dataValues?.carrier_logo
                });
                baseDataIntensity.push(0);
                baseDataEmission.push(0);
            }
        }

        let maxIntensity = Math.max(...baseDataIntensity);
        let maxEmission = Math.max(...baseDataEmission);
        let baseIntensity = maxIntensity * (20 / 100);
        let baseEmission = maxEmission * (20 / 100);

        let carrierCode = responseData?.map((item: any) => (item.carrier));
        let carrier_ranking = await getCarrierRanking(companyConnection["models"], carrierCode, Op);

        for (const property of responseData) {
            let smartwayData: any = [];
            carrier_ranking.map((item: any) => { if (item.dataValues.code == property.carrier) smartwayData.push(item) });

            const result = [];
            for (const prop of smartwayData) {
                if (prop) {
                    result.push(prop);
                }
            }
            property.SmartwayData = result;
        }

        data.push({
            dataset: responseData,
            label: carrierArray,
            baseLineIntensity: roundToDecimal(maxIntensity + baseIntensity),
            maxIntensity: roundToDecimal(maxIntensity),
            graphMaxIntensity: roundToDecimal(
                maxIntensity +
                baseIntensity +
                (maxIntensity + baseIntensity) * (15 / 100)
            ),
            baseLineEmission: roundToDecimal(maxEmission + baseEmission),
            maxEmission: roundToDecimal(maxEmission),
            graphMaxEmission: roundToDecimal(
                maxEmission + baseEmission + (maxEmission + baseEmission) * (15 / 100)
            ),
        });

        return data;
    }
}

export default CarrierController;
