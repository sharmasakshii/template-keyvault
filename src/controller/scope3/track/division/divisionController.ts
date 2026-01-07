import { Response } from "express";
import sequelize, { col, Op, Sequelize } from "sequelize";
import { generateResponse } from "../../../../services/response";
import {
    whereClauseFn, fetchIndustryData, roundToDecimal, getConfigConstants, getPropertyValue, processRegionData,
    processContributorAndDetractorCommonFn,
    getLaneEmissionTopBottomLaneData,
    getAverageIntensity,
    calculateAverage,
    calculateTotals,
    updateColors,
    processContributorAndDetractor
} from "../../../../services/commonServices";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { MyUserRequest } from "../../../../interfaces/commonInterface";
import { convertToMillion } from "../../../../constant";
import { getContributorDetractorGraphColor } from "../../../../utils";
class DivisionController {
    private readonly connection: Sequelize;

    // Constructor to initialize the database connection for each instance
    constructor(connectionData: Sequelize) {
        this.connection = connectionData; // Assign the passed Sequelize instance to the private property
    }

    async getDivisionOverview(request: MyUserRequest,
        res: Response): Promise<Response> {
        try {
            const connection: any = this.connection;
            const companyConnection = connection[connection.company];

            const { division_id, region_id, year, quarter, time_id } = request.body;
            let where: any = {};

            where[Op.and] = [Sequelize.literal("CAST(total_ton_miles AS FLOAT) != 0")];
            where[Op.and].push({ division_id: division_id })

            const payload = [{ year: year }, { quarter: quarter }, { region_id: region_id }, { time_id: time_id }]

            const whereClause = await whereClauseFn(payload)

            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]]

            let whereNot: any = {};
            whereNot[Op.and] = [Sequelize.literal("CAST(total_ton_miles AS FLOAT) != 0")];

            const whereNotClause = await whereClauseFn(payload)

            whereNot[Op.and] = [...whereNot[Op.and], ...whereNotClause[Op.and]]
            // Query the database to get total vendor emission data
            let getTotalDivisionEmissionData: any = await companyConnection["models"].SummerisedBusinessUnit.findAll({
                attributes: [
                    [
                        Sequelize.literal(
                            'ROUND(sum(CAST(emissions AS FLOAT)) / SUM(CAST(total_ton_miles AS FLOAT)), 1) '
                        ),
                        "intensity",
                    ],
                    [
                        Sequelize.literal(
                            'SUM(CAST(emissions AS FLOAT))/1000000'
                        ),
                        "emissions",
                    ],
                    [
                        Sequelize.literal(
                            'SUM(CAST(shipments AS FLOAT))'
                        ),
                        "shipment_count",
                    ],
                ],
                where: whereNot,
                group: ["division_id"],

            });

            // Query the database to get summerized carrier data
            let summerisedDivisiondata = await companyConnection["models"].SummerisedBusinessUnit.findAll({
                attributes: [
                    [
                        Sequelize.literal(
                            'ROUND(sum(emissions) / SUM(total_ton_miles), 1) '
                        ),
                        "intensity",
                    ],
                ],
                where: where,
                include: [
                    {
                        model: companyConnection["models"].BusinessUnitDivision,
                        attributes: ["id", "name"],
                        as: "businessUnitDivision"
                    },
                ],
                group: ["businessUnitDivision.id", "businessUnitDivision.name"],
            });

            let summerisedDivisiondetail = await companyConnection["models"].BusinessUnitDivision.findOne({
                attributes: ["id", "name"],
                where: {
                    id: division_id
                },
            });


            let reduceValue
            let baseLine: any;
            if (getTotalDivisionEmissionData.length > 0) {
                const reduceArr = getTotalDivisionEmissionData.map((ele: any) => ele.dataValues.intensity)
                reduceValue = reduceArr.reduce((a: any, b: any) => a + b, 0) / reduceArr.length;
                baseLine = reduceValue * (20 / 100);
            }


            let industryData = await fetchIndustryData(companyConnection);
            if (summerisedDivisiondata.length === 0) {
                return generateResponse(res, 200, true, "No Record Found", { data: [], summerisedDivisiondetail: summerisedDivisiondetail });

            }
            const data = {

                intensity: summerisedDivisiondata[0].dataValues.intensity,
                summerisedDivisiondetail: summerisedDivisiondetail,
                data: [
                    {
                        year: year,
                        intensity: reduceValue,
                    },
                    {
                        year: year,
                        intensity: summerisedDivisiondata[0].dataValues.intensity,
                    },
                ],
                industrialAverage: industryData[0] ? industryData[0].dataValues.average_intensity : 0,
                baseLine: roundToDecimal(
                    baseLine
                ),
                divisionEmissionData: summerisedDivisiondata[0],
                totalDivisionEmissionData: getTotalDivisionEmissionData[0],
                max: getTotalDivisionEmissionData[0].dataValues.intensity,
            };
            // Generate and return a successful response
            return generateResponse(res, 200, true, "Division Emissions", data);
        } catch (error) {
            console.error(error);
            // Generate and return a 500 Internal Server Error response in case of an error
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }

    }

    /**
 * @description Azure function to delete Multiple bid file.
 * @param {*} context
 * @version V.1
 * @returns 
 */
    async divisionBuissnessUnitData(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            const { year, quarter, division_id, time_id } = request.body;

            const payload = [{ year: year }, { quarter: quarter }, { division_id: division_id }, { time_id: time_id }]

            const where = await whereClauseFn(payload)

            let attr = [
                [Sequelize.literal('ROUND(SUM(emissions) / SUM(total_ton_miles), 1)'), 'data'],
                [col('businessUnit.name'), 'name'],
            ]

            const result = await authenticate[authenticate.company]["models"].SummerisedBusinessUnit.findAll({
                attributes: attr,
                include: [
                    {
                        model: authenticate[authenticate.company]["models"].BusinessUnit,
                        attributes: ["name"],
                        as: "businessUnit",
                        required: true,
                    },
                ],
                where: where,
                group: ['bu_id', 'businessUnit.name'],
                raw: true,
            });

            if (result.length > 0) {
                return generateResponse(res, 200, true, `By Division graph data`, result);
            }
            return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);

        } catch (error) {
            console.error(error, "error")
            // Handle errors and return a 500 response in case of an error.
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    };

    async getDivisionTableData(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            const connection: any = this.connection;
            const companyConnection = connection[connection.company];

            const { region_id, year, quarter, col_name, order_by, time_id, division_id } = request.body;
            let where: any = {};
            where[Op.and] = [
                sequelize.literal("total_ton_miles != 0"),
            ];
            const payload = [{ region_id: region_id }, { quarter: quarter }, { year: year }, { time_id: time_id }, { division_id: division_id }]

            const whereClause = await whereClauseFn(payload)

            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];

            let getBusinessData: any = await companyConnection["models"].SummerisedBusinessUnit.findAll({
                attributes: [
                    [sequelize.literal("ROUND(SUM(emissions) / SUM(total_ton_miles), 1)"), "intensity"],
                    [sequelize.literal("SUM(emissions)"), "emission"],
                    [sequelize.literal("SUM(total_ton_miles)"), "total_ton_miles"],
                    [sequelize.literal("SUM(shipments)"), "shipments"]
                ],
                where: where,
                include: [
                    {
                        model: companyConnection["models"]?.BusinessUnitDivision,
                        attributes: ["id", "name"],
                        as: "businessUnitDivision"
                    },
                ],
                group: ["businessUnitDivision.id", "businessUnitDivision.name"],
                order: [
                    [col_name ?? "intensity", order_by ?? "desc"],
                ],
                raw: true,
            });

            if (getBusinessData.length > 0) {
                let configData = await getConfigConstants(companyConnection?.models);
                let data = await processRegionData(getBusinessData, configData, "businessUnitDivision", "division", 'emission');
                return generateResponse(
                    res,
                    200,
                    true,
                    "Get Division Unit Table Data",
                    data
                );
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
        } catch (error) {
            console.error(error, "error ")
            return generateResponse(
                res,
                500,
                false,
                HttpStatusMessage.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getByDivisionLaneBreakdown(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            const { year, region_id, quarter, toggel_data, time_id, division_id } = request.body

            const payload = [{ year: year }, { region_id: region_id }, { quarter: quarter }, { time_id: time_id }, { division_id: division_id }]

            let where: any = {}
            where[Op.and] = [];

            const whereclause = await whereClauseFn(payload);

            where[Op.and] = [...where[Op.and], ...whereclause[Op.and]]

            let order_by = "intensity";
            if (toggel_data == 1) {
                order_by = "emission";
            }

            const averageIntensity = await getAverageIntensity(authenticate[authenticate.company].models, where, "EmissionLanes");

            let getTopCarrierEmissionData = await getLaneEmissionTopBottomLaneData({
                tableName: "EmissionLanes", initDbConnection: authenticate[authenticate.company], where: where, order_by: order_by, sortOrder: 'asc', limit: 10, group: ['name'], attr: ['name']
            })

            let getButtomCarrierEmissionData = await getLaneEmissionTopBottomLaneData({
                tableName: "EmissionLanes", initDbConnection: authenticate[authenticate.company], where: where, order_by: order_by, sortOrder: 'desc', limit: 10, group: ['name'], attr: ['name']
            })

            const { contributor, detractor, average } = await processContributorAndDetractorCommonFn({ toggleData: toggel_data, topData: getTopCarrierEmissionData, bottomData: getButtomCarrierEmissionData, configData: authenticate, averageIntensity: averageIntensity, fetchKey: "name", type: "breakdown" })

            return generateResponse(res, 200, true, "By division lane breakdown Emissions",
                {
                    responseData: {
                        contributor: contributor,
                        detractor: detractor,
                        average: average,
                    }
                });
        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    // Define the Azure Function to get region carrier comparison graph data
    async getDivisionRegionComparisonTable(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            let { region_id, year, quarter, col_name, order_by, division_id, time_id, dataType } = request.body;
            // Initialize a WHERE clause for Sequelize
            const where: any = {}
            where[Op.and] = []
            where[Op.and].push(sequelize.literal('emissions != 0 '));
            where[Op.and].push(sequelize.literal('total_ton_miles != 0 '));

            // Check if region_id, year, or quarter is provided and add them to the WHERE clause
            const payload = [{ year: year }, { quarter: quarter }, { division_id: division_id }, { region_id: region_id }, { time_id: time_id }]

            const whereClause = await whereClauseFn(payload)

            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]]


            const groupBy = dataType == "business" ? ['bu_id', 'businessUnit.id', 'businessUnit.name'] : ['region_id', 'region.id', 'region.name']

            const includeList = dataType == "business" ? [
                {
                    model: authenticate[authenticate.company]["models"].BusinessUnit,
                    attributes: ['id', 'name'],
                    as: "businessUnit"
                }
            ] : [
                {
                    model: authenticate[authenticate.company]["models"].Region,
                    attributes: ['id', 'name'],
                    as: "region"
                }
            ]

            // Query the database to get top carrier emission data
            let getTopCarrierEmissionData = await authenticate[authenticate.company]["models"].SummerisedBusinessUnit.findAll(
                {
                    attributes: [
                        dataType == "business" ? 'bu_id' : 'region_id',
                        [sequelize.literal('SUM(emissions) / SUM(total_ton_miles)'), 'intensity'],
                        [sequelize.literal('SUM(emissions)'), 'emission'],
                        [sequelize.literal('SUM(emissions)'), 'cost'],
                        [sequelize.literal('SUM(shipments)'), 'shipment_count'],
                    ],
                    where: where,
                    include: includeList,

                    group: groupBy,
                    order: [
                        [col_name ?? "intensity", order_by ?? "desc"],
                    ],
                    raw: true
                });

            if (getTopCarrierEmissionData) {
                let configData = await getConfigConstants(authenticate[authenticate.company]["models"])
                let data = await this.processRegionDataCompare(getTopCarrierEmissionData, configData);
                return generateResponse(
                    res,
                    200,
                    true,
                    "Get Carrier Region Table Data",
                    data
                );
            }
            return generateResponse(res, 200, false, HttpStatusMessage.NOT_FOUND);
        } catch (error) {
            console.error("error >>>>>..... ", error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getDivisionEmissionData(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            const companyConnections: any = this.connection;
            const company = companyConnections.company;
            const companyModels = companyConnections[company].models;

            let { region_id, year, quarter, toggel_data, time_id, division_id }: any = request.body;

            const where: any = {}

            where[Op.and] = [sequelize.literal("total_ton_miles != 0")]

            const payload = [{ year }, { quarter }, { time_id }, { division_id }, { region_id }]

            const whereClause = await whereClauseFn(payload)

            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];

            // Get business unit emissions based on toggle data
            const [businessEmissions, configData] = await Promise.all([
                companyModels.SummerisedBusinessUnit.findAll({
                    attributes: [
                        [sequelize.literal('ROUND(SUM(emissions) / NULLIF(SUM(total_ton_miles), 0), 1)'), 'intensity'],
                        [sequelize.fn('SUM', sequelize.col('emissions')), 'emission'],
                    ],
                    where,
                    include: [
                        {
                            model: companyModels.BusinessUnitDivision,
                            attributes: ['id', 'name'],
                            as: 'businessUnitDivision',
                        },
                    ],
                    group: ['businessUnitDivision.id', 'businessUnitDivision.name'],
                    order: [[sequelize.literal(toggel_data === 1 ? 'emission' : 'intensity'), 'DESC']],
                    raw: true
                }),
                getConfigConstants(companyModels)
            ])

            if (businessEmissions) {
                // Process contributor and detractor data
                const data = processContributorAndDetractor(
                    toggel_data,
                    businessEmissions,
                    configData,
                    "businessUnitDivision"
                );
                return generateResponse(res, 200, true, 'Division Emissions.', data)
            } else { return generateResponse(res, 200, false, HttpStatusMessage.NOT_FOUND) }

            // Read the request body

        } catch (error) {
            console.log(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    private async processRegionDataCompare(getRegionData: any, configData: any) {
        if (getRegionData) {
            let intensityArray = [];
            let emissionArray = [];
            const { contributorColor, detractorColor, mediumColor } = getContributorDetractorGraphColor(configData, "graph")

            const { totalIntensity, totalEmission } = calculateTotals(getRegionData)

            const averageIntensity = calculateAverage(totalIntensity);

            const averageEmission = calculateAverage(totalEmission)
            
            for (const property of getRegionData) {
                let intensity = property.intensity;
                let cost = roundToDecimal(property.cost / convertToMillion);

                property["intensity"] = getPropertyValue(intensity, averageIntensity, contributorColor, detractorColor);
                property["cost"] = getPropertyValue(cost, averageEmission, contributorColor, detractorColor);

                intensityArray.push(intensity);
                emissionArray.push(cost);
            }

            intensityArray = intensityArray.sort((a, b) => a - b);
            emissionArray = emissionArray.sort((a, b) => a - b);

            updateColors(getRegionData, intensityArray, averageIntensity, 'intensity', mediumColor);
            updateColors(getRegionData, emissionArray, averageEmission, 'cost', mediumColor);
        }
        return getRegionData;
    };

}

export default DivisionController