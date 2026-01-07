import sequelize, { Sequelize, Op } from "sequelize"
import { MyUserRequest } from "../../../../interfaces/commonInterface";
import { generateResponse } from "../../../../services/response";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { calculateAverage, calculateTotals, getAverageIntensity, getConfigConstants, getLaneEmissionTopBottomLaneData, getPropertyValue, processContributorAndDetractorCommonFn, processContributorWithAverageReduce, roundToDecimal, updateColors, whereClauseFn } from "../../../../services/commonServices";
import { checkNUllValue, getContributorDetractorGraphColor } from "../../../../utils";
import { convertToMillion } from "../../../../constant";
class BusinessController {

    private readonly connection: Sequelize;

    constructor(connectionData: Sequelize) {
        this.connection = connectionData
    }

    async getBusinessEmissionV1(request: MyUserRequest, res: Response): Promise<Response> {
        let authenticate: any = this.connection
        try {
            let { bu_id, region_id, year, quarter, toggel_data, page, page_size, time_id, division_id } = request.body

            let page_server = (page) ? parseInt(page) - 1 : 1;
            let page_server_size = (page_size) ? parseInt(page_size) : 10;

            const where: any = {}
            where[Op.and] = []

            where[Op.and].push(Sequelize.literal('(CAST(emission AS FLOAT)) != 0 '));
            where[Op.and].push(Sequelize.literal('(CAST(total_ton_miles AS FLOAT)) != 0 '));


            const where1: any = {}
            where1[Op.and] = []

            if (year) {
                where[Op.and].push(Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('date')), year))
            }
            if (quarter) {
                where[Op.and].push(Sequelize.literal(`DATEPART(quarter, date) = ${quarter}`),);
            }

            const payload = [{ bu_id: bu_id }, { region_id: region_id }, { time_id: time_id }, { division_id: division_id }]

            const whereClause = await whereClauseFn(payload)
            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]]

            const payload1 = [{ year: year }, { quarter: quarter }, { bu_id: bu_id }, { region_id: region_id }, { time_id: time_id }, { division_id: division_id }]

            const whereClause1 = await whereClauseFn(payload1)
            where1[Op.and] = [...where1[Op.and], ...whereClause1[Op.and]]

            let order_by = this.getOrderBy(toggel_data)

            let averageIntensity = await getAverageIntensity(authenticate[authenticate.company]['models'], where, "Emission")

            if (averageIntensity.length === 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND)
            }
            let getTopLaneEmissionData = await getLaneEmissionTopBottomLaneData({ tableName: "BusinessUnitLane", initDbConnection: authenticate[authenticate.company], where: where1, order_by: order_by, sortOrder: 'asc', limit: 10, group: ["name"], attr: [['name', 'lane_name']] })

            let getButtomLaneEmissionData = await getLaneEmissionTopBottomLaneData({ tableName: "BusinessUnitLane", initDbConnection: authenticate[authenticate.company], where: where1, order_by: order_by, sortOrder: 'desc', limit: 10, group: ["name"], attr: [['name', 'lane_name']] })

            const { contributor, detractor, unit, average } = await processContributorAndDetractorCommonFn({ toggleData: toggel_data, topData: getTopLaneEmissionData, bottomData: getButtomLaneEmissionData, configData: authenticate, averageIntensity: averageIntensity, fetchKey: "lane_name" })

            const data = {
                contributor: contributor,
                detractor: detractor,
                unit: unit,
                average: roundToDecimal(average),
                pagination: {
                    page: page_server,
                    page_size: page_server_size,
                    total_count: 10,
                }
            };
            return generateResponse(res, 200, true, "Business Unit Emissions", data);
        }
        catch (error) {
            console.log(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }
    readonly getOrderBy = (toggel_data: any) => toggel_data == 1 ? 'emission' : 'intensity'

    async getBusinessCarrierOverviewDetail(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            const companyConnections: any = this.connection;
            const company = companyConnections.company;
            const initCompDbConnection = companyConnections[company];
            let { bu_id, region_id, year, quarter, time_id, division_id } = request.body; // Extract parameters from the request body
            const payload1 = [
             { region_id: region_id }, { division_id: division_id }
            ]
            const where1 = await whereClauseFn(payload1);
            let businessUnit = await initCompDbConnection["models"].SummerisedBusinessUnit.findOne({
                
                include: [
                    {
                        model: initCompDbConnection["models"].BusinessUnit,
                        attributes: ["name", "description"],
                        where : { id: bu_id },
                        as: "businessUnit",
                    },
                ],
                where: where1,
                raw:true
            })
            if (!businessUnit) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }

            const where: any = {};
            where[Op.and] = [];
            const payload = [
                { bu_id: bu_id }, { region_id: region_id }, { year: year }, { quarter: quarter },
                { time_id: time_id }, { division_id: division_id }
            ]
            const whereClause = await whereClauseFn(payload)
            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]]

            // Query the database to get summarized emission data based on the conditions in the WHERE clause
            const getBusinessEmissions = await initCompDbConnection[
                "models"
            ].SummerisedBusinessUnit.findAll({
                attributes: [
                    [
                        Sequelize.literal(
                            "ROUND(sum(emissions) / SUM(total_ton_miles), 1)"
                        ),
                        "intensity",
                    ],
                    [
                        Sequelize.literal(`SUM(emissions)/${convertToMillion}`),
                        "emissions",
                    ],
                    [Sequelize.literal("SUM(shipments)"), "shipment_count"],
                ],
                where: where, // Apply the WHERE clause to the query
            });

            // Create a response data object
            const data = {
                carrierDto: getBusinessEmissions,
                businessUnit: {
                    name : businessUnit['businessUnit.name'],
                    description : businessUnit['businessUnit.description']
                }
            };


            // Generate a successful response with a status code of 200
            return generateResponse(res, 200, true, "Vendor Emissions", data);
        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getBusinessCarrierComparisonGraph(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            let { region_id, year, quarter, toggel_data, bu_id, time_id, division_id } = request.body;

            const where: any = {};
            where[Op.and] = [];
            where[Op.and].push(Sequelize.literal('CAST(emission AS FLOAT) != 0 '));
            where[Op.and].push(Sequelize.literal('CAST(total_ton_miles AS FLOAT) != 0 '));
            const payload = [
                { bu_id: bu_id }, { region_id: region_id }, { year: year }, { quarter: quarter },
                { time_id: time_id }, { division_id: division_id }
            ]
            const whereClause = await whereClauseFn(payload)
            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]]

            let order_by = 'intensity';
            if (toggel_data == 1) {
                order_by = 'emission';
            }
            let averageIntensity = await getAverageIntensity(authenticate[authenticate.company]['models'], where, "BusinessUnitCarrierEmission")

            if (averageIntensity?.length === 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND)
            }
            let getTopCarrierEmissionData = await getLaneEmissionTopBottomLaneData({ tableName: "BusinessUnitCarrierEmission", initDbConnection: authenticate[authenticate.company], where: where, order_by: order_by, sortOrder: 'asc', limit: 10, group: ['carrier_name', 'carrier'], attr: ['carrier', 'carrier_name',] })

            let getButtomCarrierEmissionData = await getLaneEmissionTopBottomLaneData({
                tableName: "BusinessUnitCarrierEmission", initDbConnection: authenticate[authenticate.company], where: where, order_by: order_by, sortOrder: 'desc', limit: 10, group: ['carrier_name', 'carrier'], attr: ['carrier', 'carrier_name',]
            })

            const data = await processContributorAndDetractorCommonFn({ toggleData: toggel_data, topData: getTopCarrierEmissionData, bottomData: getButtomCarrierEmissionData, configData: authenticate, averageIntensity: averageIntensity, fetchKey: "carrier_name" })

            return generateResponse(res, 200, true, 'Business Unit Emissions', data)
        }
        catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getBusinessUnitTableData(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            let authenticate: any = this.connection

            let { region_id, year, quarter, col_name, order_by, time_id, division_id } = request.body

            const companyConnection = authenticate[authenticate?.company]?.models

            const where: any = {};
            where[Op.and] = [
                sequelize.literal("(total_ton_miles) != 0"),
            ];
            const payload = [{ year: year }, { quarter: quarter }, { region_id: region_id }, { time_id: time_id }, { division_id: division_id }]

            const whereClause = await whereClauseFn(payload)
            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]]

            let getBusinessData: any = await companyConnection.SummerisedBusinessUnit.findAll({
                attributes: [
                    [
                        sequelize.literal("ROUND(SUM(emissions) / NULLIF(SUM(total_ton_miles), 0), 1)"),
                        "intensity",
                    ],
                    [sequelize.fn("SUM", sequelize.col("emissions")), "emission"],
                    [sequelize.fn("SUM", sequelize.col("total_ton_miles")), "total_ton_miles"],
                    [sequelize.fn("SUM", sequelize.col("shipments")), "shipments"],
                    "bu_id",
                ],
                where,
                include: [
                    {
                        model: companyConnection.BusinessUnit,
                        attributes: ["name", "description"],
                        as: "businessUnit",
                    },
                ],
                group: ["bu_id", "[businessUnit].[name]", "[businessUnit].[description]"],
                order: [
                    [
                        sequelize.literal(col_name || "intensity"),
                        order_by || "desc",
                    ],
                ],
                raw: true,
            });
            ;

            if (getBusinessData.length > 0) {
                //get Config Constants
                let configData = await getConfigConstants(companyConnection);
                await this.processRegionData(getBusinessData, configData);
                return generateResponse(res, 200, true, "Get Business Unit Table Data", getBusinessData);
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
        } catch (error) {
            console.log(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getBusinessEmissionDataBYRegion(request: MyUserRequest, res: Response): Promise<Response> {

        try {
            const authenticate: any = this.connection

            let { bu_id, region_id, year, quarter, toggel_data, time_id, division_id } = request.body

            const companyConnection = authenticate[authenticate.company]
            const where: any = {}
            where[Op.and] = [sequelize.literal("CAST(total_ton_miles AS FLOAT) != 0")]

            const payload = [{
                bu_id: bu_id
            }, { region_id: region_id }, { 'year': year }, { 'quarter': quarter }, {
                time_id: time_id
            }, {
                division_id: division_id
            }
            ]

            const whereClause = await whereClauseFn(payload)
            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]]

            const getRegionEmissions = await companyConnection['models'].SummerisedBusinessUnit.findAll({
                attributes: [
                    [
                        sequelize.literal('ROUND(SUM(emissions) / SUM(total_ton_miles), 1)'),
                        'intensity'
                    ],
                    [
                        sequelize.fn('SUM', sequelize.cast(sequelize.col('emissions'), 'FLOAT')),
                        'emission'
                    ],
                    'region_id'
                ],
                where: where,
                include: [
                    {
                        model: companyConnection['models'].Region,
                        attributes: ['name'],
                        as: "Region"
                    }],
                group: ['Region.name', 'region_id'],
                order: [
                    [sequelize.literal(toggel_data ? 'emission' : 'intensity'), 'DESC']
                ],
                raw: true
            })


            if (getRegionEmissions?.length > 0) {

                let configData = await getConfigConstants(companyConnection["models"])

                const data = processContributorWithAverageReduce({ toggleData: toggel_data, data: getRegionEmissions, configDataFetch: configData, fetchkey: 'Region' });

                return generateResponse(res, 200, true, 'Business Unit Emissions by region.', data)
            }
            else { return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND) }
        } catch (error) {
            console.log(error, "error");
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getBusinessEmissionData(request: MyUserRequest, res: Response): Promise<Response> {
        let authenticate: any = this.connection

        try {

            let { region_id, year, quarter, toggel_data, time_id, division_id } = request.body
            const where: any = {}
            where[Op.and] = [sequelize.literal("total_ton_miles != 0")]

            const payload = [{ year: year }, { quarter: quarter }, { region_id: region_id }, { time_id: time_id }, { division_id: division_id }]

            const whereClause = await whereClauseFn(payload)

            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]]


            let getBusinessEmissionsObj = await authenticate[authenticate.company]['models'].SummerisedBusinessUnit.findAll({
                attributes: [
                    [
                        sequelize.literal('ROUND(SUM(emissions) / SUM(total_ton_miles), 1)'),
                        'intensity'
                    ],
                    [
                        sequelize.fn('SUM', sequelize.cast(sequelize.col('emissions'), 'FLOAT')),
                        'emission'
                    ]],
                where: where,
                include: [
                    {
                        model: authenticate[authenticate.company]['models'].BusinessUnit,
                        attributes: ["name", "description"],
                        as: 'businessUnit'
                    },
                ],
                group: ["businessUnit.name", "businessUnit.description"],
                order: [
                    [sequelize.literal(toggel_data ? 'emission' : 'intensity'), 'DESC']
                ],
                raw: true
            });

            if (getBusinessEmissionsObj?.length > 0) {
                let configData = await getConfigConstants(authenticate[authenticate.company]["models"])

                const data = processContributorWithAverageReduce({ toggleData: toggel_data, data: getBusinessEmissionsObj, configDataFetch: configData, fetchkey: 'businessUnit' });

                return generateResponse(res, 200, true, 'Business Unit Emissions.', data)
            } else { return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND) }
        } catch (error) {
            console.log(error, "error");
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }


    private readonly processRegionData = async (getBusinessData: any, configData: any) => {

        const { contributorColor, detractorColor, mediumColor } = getContributorDetractorGraphColor(configData, "graph")

        // Calculate total intensity and emission
        const { totalIntensity, totalEmission } = calculateTotals(getBusinessData);

        // Calculate averages
        const averageIntensity = calculateAverage(totalIntensity);
        const averageEmission = calculateAverage(totalEmission);

        // Process each property in getBusinessData
        const { intensityArray, emissionArray } = this.processProperties(getBusinessData, averageIntensity, averageEmission, contributorColor, detractorColor);

        // Find closest values and update colors
        updateColors(getBusinessData, intensityArray, averageIntensity, 'intensity', mediumColor);
        updateColors(getBusinessData, emissionArray, averageEmission, 'cost', mediumColor);

        return getBusinessData;
    };

    private readonly processProperties = (
        data: any[],
        averageIntensity: number,
        averageEmission: number,
        contributorColor: string,
        detractorColor: string
    ) => {
        let intensityArray = [];
        let emissionArray = [];

        for (const property of data) {
            property["name"] = checkNUllValue(property["businessUnit.name"]);
            property["description"] = checkNUllValue(property["businessUnit.description"]);
            let intensity = roundToDecimal(property.intensity);
            let cost = property.emission ? property.emission / convertToMillion : 0;

            property["intensity"] = getPropertyValue(intensity, averageIntensity, contributorColor, detractorColor);
            property["cost"] = getPropertyValue(cost, averageEmission, contributorColor, detractorColor);

            intensityArray.push(intensity);
            emissionArray.push(cost);
        }

        return {
            intensityArray: intensityArray.slice().sort((a, b) => a - b),
            emissionArray: emissionArray.slice().sort((a, b) => a - b),
        };
    };
}

export default BusinessController