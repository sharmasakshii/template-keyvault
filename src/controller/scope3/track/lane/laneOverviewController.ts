import sequelize, { Sequelize, Op } from "sequelize";
import { MyUserRequest } from "../../../../interfaces/commonInterface";
import { generateResponse } from "../../../../services/response";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { getHKey, setHKey } from "../../../../redisServices";
import { redisMasterKeyApi } from "../../../../constant/moduleConstant";
import { getAverageIntensity, getConfigConstants, getLaneEmissionTopBottomLaneData, paginate, processContributorAndDetractorCommonFn, processEmissionReductionData, roundToDecimal, targetValuesFnEmission, targetValuesFnEmissionPeriodWise, updateColors, whereClauseFn } from "../../../../services/commonServices";
import { getCarrierEmissionQuery, getCarrierRanking, getContributorDetractorGraphColor, isCompanyEnable } from "../../../../utils";
import { comapnyDbAlias, convertToMillion } from "../../../../constant";
class LaneOverviewController {
    private readonly connection: Sequelize;

    // Constructor to initialize the database connection for each instance
    constructor(connectionData: Sequelize) {
        this.connection = connectionData; // Assign the passed Sequelize instance to the private property
    }

    async getLaneCarrierTableData(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            // Authenticate the request using JWT middleware
            let authenticate: any = this.connection;

            let companyConnection = authenticate[authenticate.company];
            // Extract request parameters
            const {
                region_id,
                year,
                quarter,
                page,
                page_size,
                search_name,
                col_name,
                order_by,
                lane_name,
                time_id,
                division_id } = request.body;

            let page_server = page !== undefined ? parseInt(page) - 1 : 0;

            let page_server_size = page_size ? parseInt(page_size) : 30;


            let where: any = {}
            let where1: any = {}

            where[Op.and] = []
            where1[Op.and] = []


            const payload = [{ region_id: region_id }, { name: lane_name }, { division_id: division_id }, { time_id: time_id }]

            const whereClause = await whereClauseFn(payload)

            if (year) {
                where[Op.and].push(
                    sequelize.where(sequelize.fn("YEAR", sequelize.col("date")), year)
                );
                where1[Op.and].push({ year: year })
            }
            if (quarter) {
                where[Op.and].push(
                    sequelize.literal(`DATEPART(quarter, date) = ${quarter}`)
                );
                where1[Op.and].push({ quarter: quarter })
            }
            if (search_name) {
                const seq = sequelize.where(
                    sequelize.fn("lower", sequelize.literal("carrier_name")),
                    {
                        [Op.like]: `%${search_name.toLowerCase()}%`,
                    }
                )
                where[Op.and].push(
                    seq
                );
                where1[Op.and].push(
                    seq
                );
            }

            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]]

            let total_count = await companyConnection.models.Emission.findAll({
                attributes: [
                    [sequelize.fn('COUNT', sequelize.fn("DISTINCT", sequelize.col("carrier_name"))),
                        "count",
                    ],
                ],
                where: where,
                raw: true
            });

            let averageIntensity = await companyConnection.models.Emission.findAll({
                attributes: [
                    [
                        sequelize.literal(
                            "AVG(emission / total_ton_miles) "
                        ),
                        "average",
                    ],
                    [
                        sequelize.literal(`AVG(emission)/ ${convertToMillion}`),
                        "average_emission",
                    ],
                ],
                where: where,
                raw: true
            });


            where1[Op.and] = [...where1[Op.and], ...whereClause[Op.and]]

            let getVendorEmissionData = await companyConnection.models.CarrierEmissions.findAll(
                paginate(
                    {
                        ...getCarrierEmissionQuery(where1, col_name, order_by),
                        raw: true
                    },
                    {
                        page: page_server,
                        pageSize: page_server_size,
                    }
                )
            );
            if (getVendorEmissionData.length > 0) {
                let configData = await getConfigConstants(companyConnection.models);
                const { average } = await this.processVendorEmissionData(getVendorEmissionData, averageIntensity, configData, companyConnection);

                const data = {
                    responseData: getVendorEmissionData,
                    average: roundToDecimal(average),
                    pagination: {
                        page_size: page_server_size,
                        total_count: total_count[0].count,
                    },
                };

                return generateResponse(res, 200, true, "Get Vendor Table Data", data);
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
        } catch (error) {
            console.log(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getLaneCarrierComparisonGraph(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            let authenticate: any = this.connection;

            const { region_id, year, quarter, toggel_data, lane_name, time_id, division_id } = request.body;
            const masterKey = { company: authenticate.company, key: redisMasterKeyApi.getLaneCarrierComparisonGraph }

            const childKey = request.body

            const cachedData = await getHKey({ masterKey: masterKey, childKey: childKey });

            if (cachedData) {
                return generateResponse(res, 200, true, "Carrier Emissions", cachedData);
            }

            const where: any = this.getBaseContition();;
            where[Op.and] = []
            const whereIntensity: any = {};
            whereIntensity[Op.and] = []
            const payload = [{ region_id: region_id }, { year: year }, { name: lane_name }, { quarter: quarter }, { time_id: time_id }, { division_id: division_id }]
            const payload2 = [{ region_id: region_id }, { name: lane_name }, { time_id: time_id }, { division_id: division_id }]

            const whereClause = await whereClauseFn(payload)
            const whereClause2 = await whereClauseFn(payload2)

            if (year) {
                whereIntensity[Op.and].push(
                    sequelize.where(sequelize.fn("YEAR", sequelize.col("date")), year)
                );
            }

            if (quarter) {
                whereIntensity[Op.and].push(
                    sequelize.literal(`DATEPART(quarter, date) = ${quarter}`)
                );
            }

            let averageIntensity = await getAverageIntensity(authenticate[authenticate.company].models, [...where[Op.and], ...whereIntensity[Op.and], ...whereClause2[Op.and]], "Emission");


            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];
            let order_by = this.determineOrderBy(toggel_data);

            let getTopCarrierEmissionData = await getLaneEmissionTopBottomLaneData({
                tableName: "CarrierEmissions", initDbConnection: authenticate[authenticate.company], where: where, order_by: order_by, sortOrder: 'asc', limit: 10, group: ['carrier_name'], attr: ['carrier_name']
            })

            let getButtomCarrierEmissionData = await getLaneEmissionTopBottomLaneData({
                tableName: "CarrierEmissions", initDbConnection: authenticate[authenticate.company], where: where, order_by: order_by, sortOrder: 'desc', limit: 10, group: ['carrier_name'], attr: ['carrier_name']
            })

            if (getTopCarrierEmissionData?.length > 0 || getButtomCarrierEmissionData?.length > 0) {

                const { contributor, detractor, unit, average } = await processContributorAndDetractorCommonFn(
                    { toggleData: toggel_data, topData: getTopCarrierEmissionData, bottomData: getButtomCarrierEmissionData, configData: authenticate, averageIntensity: averageIntensity, fetchKey: "carrier_name" }
                );

                const data = {
                    contributor: contributor,
                    detractor: detractor,
                    unit: unit,
                    average: roundToDecimal(average),
                };
                await setHKey({ masterKey: masterKey, childKey: childKey, value: data, expTime: 300 })

                return generateResponse(res, 200, true, "Carrier Emissions", data);
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }

            // Return a successful response with the data.
        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getLaneReductionGraph(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            const authenticate: any = this.connection
            let companyConnection = authenticate[authenticate.company];
            
            let { region_id, year, lane_name, toggel_data, division_id } = request.body
            let current_year: number = parseInt(year);
            let next_year = current_year + 1;

            const where: any = {};
            where[Op.and] = [];
            where[Op.and].push({ ["name"]: lane_name });
            where[Op.and].push(
                {
                    total_ton_miles: {
                        [Op.ne]: 0,
                    },
                },
                {
                    total_ton_miles: {
                        [Op.not]: null,
                    },
                })
            where[Op.and].push(
                {
                    emission: {
                        [Op.ne]: 0,
                    },
                },
                {
                    emission: {
                        [Op.not]: null,
                    },
                })

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

            if (year) {
                if (!isCompanyEnable(authenticate.company, [comapnyDbAlias.PEP, comapnyDbAlias.BMB])) {
                    where[Op.or] = [];
                    where[Op.or].push(
                        sequelize.where(
                            sequelize.fn("YEAR", sequelize.col("date")),
                            current_year
                        )
                    );
                    where[Op.or].push(
                        sequelize.where(sequelize.fn("YEAR", sequelize.col("date")), next_year)
                    );
                }else{
                    where[Op.and].push(sequelize.where(
                        sequelize.col("Emission.year"),
                        current_year
                    ));
                }
            }

            let attributeArray = this.getLaneEmissionAttributes(
                authenticate,
                toggel_data
            );

            let groupBy: any[] = [];
            let include: any[] = [];

            if (isCompanyEnable(authenticate.company, [comapnyDbAlias.PEP, comapnyDbAlias.BMB])) {
                groupBy = [
                    sequelize.col("Emission.year"),
                    sequelize.col("[EmissionTimeMapping->TimePeriod].[id]"),
                    sequelize.col("[EmissionTimeMapping->TimePeriod].[name]")
                ];
                include = [
                    {
                        model: authenticate[authenticate.company].models.TimeMapping,
                        as: "EmissionTimeMapping",
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
                groupBy = [
                    sequelize.fn("YEAR", sequelize.col("date")),
                    sequelize.literal("DATEPART(quarter, date)"),
                ];
            }

            const getRegionEmissionsReduction = await companyConnection['models'].Emission.findAll({
                attributes: attributeArray,
                include,
                where: where,
                group: groupBy,
                order: groupBy,
            });

            if (getRegionEmissionsReduction?.length > 0) {

                let requiredData = {
                    year: current_year,
                    toggel_data: toggel_data,
                    tableName: 'Emission',
                    columnName: 'emission'
                }
                let targetValues: any = [];
                if (!isCompanyEnable(authenticate.company, [comapnyDbAlias.PEP,comapnyDbAlias.BMB])) {
                    targetValues = await targetValuesFnEmission(companyConnection['models'], { name: lane_name }, requiredData, authenticate['schema']);
                } else {
                    targetValues = await targetValuesFnEmissionPeriodWise(companyConnection['models'], { name: lane_name }, requiredData, authenticate['schema']);
                }
                let data = processEmissionReductionData({
                    fetchKey: "intensity", current_year: current_year, next_year: next_year, emissionData: getRegionEmissionsReduction, targetValues: targetValues, company: authenticate?.company
                });
                return generateResponse(res, 200, true, "Emissions Reduction", data);
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
        } catch (error) {
            console.log("error ", error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    private getLaneEmissionAttributes(
        authenticate: any,
        toggelData: number
    ) {

        if (isCompanyEnable(authenticate.company, [comapnyDbAlias.PEP, comapnyDbAlias.BMB])) {
            let commonPepAtt = [[sequelize.col("[EmissionTimeMapping->TimePeriod].[id]"), "period_id"],
            [sequelize.literal("Emission.year"), "year"],
            [sequelize.col("[EmissionTimeMapping->TimePeriod].[name]"), "period_name"]
            ]
            if (toggelData === 1) {
                return [
                    [sequelize.literal(`SUM(emission) / SUM(total_ton_miles)`), "intensity"],
                    ...commonPepAtt
                ];
            }

            return [
                [
                    sequelize.literal(`SUM(emission) / ${convertToMillion}`),
                    "intensity",
                ],
                ...commonPepAtt
            ];
        }
        let commonAtt = [[sequelize.literal("DATEPART(quarter, date)"), "quarter"],
        [sequelize.literal("year(date)"), "year"],]
        if (toggelData === 1) {
            return [
                [sequelize.literal(`SUM(emission) / SUM(total_ton_miles)`), "intensity"],
                ...commonAtt
            ];
        }

        return [
            [
                sequelize.literal(`SUM(emission) / ${convertToMillion}`),
                "intensity",
            ],
            ...commonAtt
        ];
    };

    private readonly getBaseContition = () => {
        const baseConditions = [
            sequelize.literal("total_ton_miles != 0"),
            sequelize.literal("emission  IS NOT NULL"),
            sequelize.literal("total_ton_miles IS NOT NULL"),
        ];

        return { [Op.and]: [...baseConditions] };
    }

    private async processVendorEmissionData(getVendorEmissionData: any, averageIntensity: any, configData: any, companyConnection: any) {
        let intensityArray = [];
        let emissionArray = [];
        const { contributorColor, detractorColor, mediumColor } = getContributorDetractorGraphColor(configData, "graph")
        let average = 0;
        let avgEmission = 0;

        if (averageIntensity.length > 0) {
            average = roundToDecimal(averageIntensity[0].average);
            avgEmission = roundToDecimal(averageIntensity[0].average_emission);
        }

        let carrierCode = getVendorEmissionData.map((item: any) => item.carrier);
        let carrier_ranking = await getCarrierRanking(companyConnection.models, carrierCode, Op);

        for (const property of getVendorEmissionData) {
            let smartwayData = this.getSmartwayData(property.carrier, carrier_ranking);

            let intensity = property.intensity;
            let emissions = property.emissions;

            property.intensity =
                intensity < average
                    ? { value: intensity, color: contributorColor }
                    : { value: intensity, color: detractorColor };

            property.emissions =
                emissions <= avgEmission
                    ? { value: emissions, color: contributorColor }
                    : { value: emissions, color: detractorColor };

            intensityArray.push(intensity);
            emissionArray.push(emissions);

            property.SmartwayData = smartwayData;
        }

        intensityArray = intensityArray.slice().sort((a, b) => a - b);
        emissionArray = emissionArray.slice().sort((a, b) => a - b);

        updateColors(getVendorEmissionData, intensityArray, average, 'intensity', mediumColor);
        updateColors(getVendorEmissionData, emissionArray, avgEmission, 'emissions', mediumColor);

        average = roundToDecimal(average)
        return { getVendorEmissionData, average };
    }

    private getSmartwayData(carrier: string, carrierRanking: any) {
        return carrierRanking.filter((item: any) => item.dataValues.code === carrier);
    }

    private determineOrderBy(toggel_data: number) {
        return toggel_data == 1 ? "emission" : "intensity";
    }


}

export default LaneOverviewController