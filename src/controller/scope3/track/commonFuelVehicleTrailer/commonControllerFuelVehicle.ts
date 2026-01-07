import { Sequelize, Op } from "sequelize";
import { MyUserRequest } from "../../../../interfaces/commonInterface";
import { calculateAverage, fetchIndustryData, getAverageIntensity, getConfigConstants, getLaneEmissionTopBottomLaneData, getPropertyValue, processContributorAndDetractor, processContributorAndDetractorCommonFn, roundToDecimal, updateColors, whereClauseFn } from "../../../../services/commonServices";
import { generateResponse } from "../../../../services/response";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { getContributorDetractorGraphColor } from "../../../../utils";
import { convertToMillion } from "../../../../constant";

const sequelize = require("sequelize");


class FuelVehicleTrailerController {
    // Private property for the database connection (Sequelize instance)
    private readonly connection: Sequelize;

    // Constructor to initialize the database connection for each instance
    constructor(connectionData: Sequelize) {
        this.connection = connectionData; // Assign the passed Sequelize instance to the private property
    }


    async graphData(
        req: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            const companyConnections: any = this.connection;

            let { year, quarter, toggle_data, tableName, regionId } = req.body;
            const where: any = {};

            const payload = [
                { year: year },
                { quarter: quarter },
                { region_id: regionId },
            ];

            const whereClause = await whereClauseFn(payload);

            where[Op.and] = [
                Sequelize.literal("CAST(total_ton_miles AS FLOAT) != 0"),
            ];
            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];

            // Get region emissions based on toggle data
            const regionEmissions = await this.getEmissions(
                companyConnections[companyConnections.company].models,
                where,
                toggle_data,
                tableName
            );

            if (regionEmissions.length) {
                // Process contributor and detractor data
                let configData = await getConfigConstants(
                    companyConnections[companyConnections.company].models
                );
                const data = processContributorAndDetractor(
                    toggle_data,
                    regionEmissions,
                    configData,
                    tableName
                );
                
                return generateResponse(
                    res,
                    200,
                    true,
                    `By ${tableName} graph data`,
                    data
                );
            } else {
                return generateResponse(res, 200, false, HttpStatusMessage.NOT_FOUND);
            }
        } catch (error) {
            return generateResponse(
                res,
                500,
                false,
                HttpStatusMessage.INTERNAL_SERVER_ERROR
            );
        }
    }

    async tableData(
        req: MyUserRequest,
        res: Response
    ): Promise<Response> {

        try {
            const authenticate: any = this.connection;

            // Read the request body
            let { year, quarter, col_name, order_by, tableName, regionId } = req.body;
            const where: any = {};

            where[Op.and] = [
                sequelize.literal("(total_ton_miles) != 0"),
            ];

            const payload = [{ year: year }, { quarter: quarter }, { region_id: regionId }]

            const whereClause = await whereClauseFn(payload)

            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];


            const attributes = [
                [
                    sequelize.literal(
                        "(SELECT ROUND(SUM(emissions) / SUM(total_ton_miles), 1))"
                    ),
                    "intensity",
                ],
                [
                    sequelize.fn(
                        "SUM", (sequelize.col("emissions"))
                    ),
                    "emission",
                ],
                [
                    sequelize.fn(
                        "SUM", (sequelize.col("total_ton_miles"))
                    ),
                    "total_ton_miles",
                ],
                [
                    sequelize.fn(
                        "SUM", (sequelize.col("emissions"))
                    ),
                    "cost",
                ],
                [
                    sequelize.fn(
                        "SUM", (sequelize.col("shipments"))
                    ),
                    "shipments",
                ],
            ]

            const include = [
                {
                    model: authenticate[authenticate.company].models[tableName],
                    as: tableName,
                    attributes: ["name", "id"],
                },
            ]

            const group = [
                `${tableName}.name`,
                `${tableName}.id`,
            ]

            const order = [[col_name || "intensity", order_by || "desc"]];

            let getRegionData: any = await this.fetchData(
                authenticate,
                tableName,
                where,
                attributes,
                include,
                group,
                order
            )
            //get Config Constants
            if (getRegionData?.length) {
                let configData = await getConfigConstants(authenticate[authenticate?.company]?.models)

                let data = await this.processRegionData(getRegionData, configData, tableName);

                return generateResponse(res,
                    200,
                    true,
                    `Get ${tableName} table Data`,
                    data
                );
            }
            return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
        } catch (error) {
            return generateResponse(
                res,
                500,
                false,
                HttpStatusMessage.INTERNAL_SERVER_ERROR
            );
        }
    }


    async overviewData(
        req: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            const authenticate: any = this.connection;
            const { fetch_id, year, quarter, tableName, regionId } = req.body;

            const fetchSummeriseTableName = this.fetchTableAndColumName(tableName).table;

            let where: any = {};

            where[Op.and] = [
                sequelize.literal("CAST(total_ton_miles AS FLOAT) != 0"),
            ];

            let whereNot: any = {};
            whereNot[Op.and] = [
                sequelize.literal("CAST(total_ton_miles AS FLOAT) != 0"),
            ];

            where[Op.and] = [
                sequelize.literal("CAST(total_ton_miles AS FLOAT) != 0"),
            ];

            if (fetch_id) {
                where[Op.and].push({
                    [`${this.fetchTableAndColumName(tableName)?.column}_id`]:
                        fetch_id,
                });
            };

            if (year) {
                where[Op.and].push({ year: year });
                whereNot[Op.and].push({ year: year });
            }
            if (quarter) {
                where[Op.and].push({ quarter: quarter });
                whereNot[Op.and].push({ quarter: quarter });
            }

            if (regionId) {
                where[Op.and].push({ region_id: regionId });
                whereNot[Op.and].push({ region_id: regionId });
            }

            const attributes = [
                [
                    sequelize.literal(
                        "ROUND(sum(CAST(emissions AS FLOAT)) / SUM(CAST(total_ton_miles AS FLOAT)), 1) "
                    ),
                    "intensity",
                ],
                [
                    sequelize.literal(`SUM(emissions)/${convertToMillion}`),
                    "emissions",
                ],
                [
                    sequelize.literal("SUM(CAST(shipments AS FLOAT))"),
                    "shipment_count",
                ],
            ]

            const include = [
                {
                    model: authenticate[authenticate.company].models[tableName],
                    as: tableName,
                    attributes: ["name"],
                },
            ]

            const group = [
                `${tableName}.name`,
                `${tableName}.id`,
            ]

            // Query the database to get vendor emission data
            let getVendorEmissionData =
                await this.fetchData(
                    authenticate,
                    tableName,
                    where,
                    attributes,
                    include,
                    group,
                    null
                )

            // Query the database to get total vendor emission data
            let getTotalVendorEmissionData: any = await authenticate[authenticate?.company]?.models[fetchSummeriseTableName].findAll({
                attributes: [
                    [
                        sequelize.literal(
                            "ROUND(sum(CAST(emissions AS FLOAT)) / SUM(CAST(total_ton_miles AS FLOAT)), 1) "
                        ),
                        "intensity",
                    ],
                    [
                        sequelize.literal(`SUM(emissions)/${convertToMillion}`),
                        "emissions",
                    ],
                    [
                        sequelize.literal("SUM(CAST(shipments AS FLOAT))"),
                        "shipment_count",
                    ],
                ],
                where: whereNot
            });

            let summerisedCarrierdata = await authenticate[authenticate?.company]?.models[fetchSummeriseTableName].findAll({
                attributes: [
                    [
                        sequelize.literal(
                            'ROUND(sum(CAST(emissions AS FLOAT)) / SUM(CAST(total_ton_miles AS FLOAT)), 1) '
                        ),
                        "intensity",
                    ],
                ],
                where: where,
            });

            // Calculate a baseline value based on total vendor emission data
            let baseLine =
                getTotalVendorEmissionData[0]?.dataValues?.intensity * (20 / 100);

            let industryData = await fetchIndustryData(
                authenticate[authenticate.company]
            );

            // Prepare the response data
            const response = {
                responseData: {
                    intensity: summerisedCarrierdata?.[0]?.dataValues?.intensity,
                    data: [
                        {
                            year: year,
                            intensity: getTotalVendorEmissionData[0]?.dataValues?.intensity,
                        },
                        {
                            year: year,
                            intensity: summerisedCarrierdata[0]?.dataValues?.intensity,
                        },
                    ],
                    industrialAverage: industryData[0]
                        ? industryData[0]?.dataValues?.average_intensity
                        : 0,
                    baseLine: roundToDecimal(baseLine),
                    vendorEmissionData: getVendorEmissionData[0],
                    totalVendorEmissionData: getTotalVendorEmissionData[0],
                    max: getTotalVendorEmissionData[0]?.dataValues?.intensity,
                },
            };
            // Generate and return a successful response
            return generateResponse(res, 200, true, "Vendor Emissions", response);
        } catch (error) {
            console.log(error, "error")
            // Generate and return a 500 Internal Server Error response in case of an error
            return generateResponse(
                res,
                500,
                false,
                HttpStatusMessage.INTERNAL_SERVER_ERROR
            );
        }
    }


    async getLaneBreakdown(
        req: MyUserRequest,
        res: Response
    ): Promise<Response> {
        const authenticate: any = this.connection;
        try {
            const { fetch_id, year, quarter, toggle_data, tableName, regionId } =
                req.body;

            const where = this.constructWhereClause(
                fetch_id,
                year,
                quarter,
                tableName,
                regionId
            );

            let order_by = toggle_data ? "emission" : "intensity";

            const fetchName = await authenticate[authenticate.company].models[
                tableName
            ].findOne({
                attributes: ["name"],
                where: {
                    id: fetch_id,
                },
            });
            const averageIntensity = await getAverageIntensity(authenticate[authenticate.company].models, where, "Emission");

            let getTopCarrierEmissionData = await getLaneEmissionTopBottomLaneData({
                tableName: "Emission", initDbConnection: authenticate[authenticate.company], where: where, order_by: order_by, sortOrder: 'asc', limit: 10, group: ['name'], attr: ['name']
            })

            let getButtomCarrierEmissionData = await getLaneEmissionTopBottomLaneData({
                tableName: "Emission", initDbConnection: authenticate[authenticate.company], where: where, order_by: order_by, sortOrder: 'desc', limit: 10, group: ['name'], attr: ['name']
            })

            const { contributor, detractor, average } = await processContributorAndDetractorCommonFn({ toggleData: toggle_data, topData: getTopCarrierEmissionData, bottomData: getButtomCarrierEmissionData, configData: authenticate, averageIntensity: averageIntensity, fetchKey: "name", type: "breakdown" })



            return generateResponse(res, 200, true, "Vendor Emissions", {
                responseData: {
                    headerName: fetchName,
                    contributor: contributor,
                    detractor: detractor,
                    average: average,
                },
            });
        } catch (error) {
            console.log(error, "err")
            return generateResponse(
                res,
                500,
                false,
                HttpStatusMessage.INTERNAL_SERVER_ERROR
            );
        }
    }

    async RegionData(
        req: MyUserRequest,
        res: Response
    ): Promise<Response> {
        const authenticate: any = this.connection;
        try {
            let { fetch_id, year, quarter, col_name, order_by, tableName, regionId } = req.body;
            // Initialize a WHERE clause for Sequelize
            const where: any = {};
            where[Op.and] = [];
            where[Op.and].push(sequelize.literal("emissions != 0 "));
            where[Op.and].push(sequelize.literal("(total_ton_miles) != 0 "));

            // Check if region_id, year, or quarter is provided and add them to the WHERE clause
            const payload = [
                { year: year },
                { quarter: quarter },
                { region_id: regionId },
                {
                    [`${this.fetchTableAndColumName(tableName)?.column}_id`]:
                        fetch_id,
                },
            ];

            const whereClause = await whereClauseFn(payload);

            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];

            const attributes = [
                "region_id",
                [
                    sequelize.literal(
                        "SUM(emissions) / SUM(total_ton_miles)"
                    ),
                    "intensity",
                ],
                [sequelize.literal("SUM(emissions)"), "emission"],
                [sequelize.literal("SUM(emissions)"), "cost"],
                [
                    sequelize.literal("SUM(shipments)"),
                    "shipments",
                ],
            ]

            const group = ["region_id", "Region.id", "Region.name"];
            const order = [[col_name || "intensity", order_by || "desc"]]
            const include = [
                {
                    model: authenticate[authenticate.company].models.Region,
                    as: "Region",
                    attributes: ["id", "name"],
                },
            ]

            // Query the database to get top carrier emission data
            let getTopCarrierEmissionData = await
                this.fetchData(
                    authenticate,
                    tableName,
                    where,
                    attributes,
                    include,
                    group,
                    order
                )

            if (getTopCarrierEmissionData) {
                let configData = await getConfigConstants(
                    authenticate[authenticate.company].models
                );
                let data = await this.processRegionDataFuelVehicleRegionData(
                    getTopCarrierEmissionData,
                    configData
                );

                if (data?.length) {
                    return generateResponse(
                        res,
                        200,
                        true,
                        "Get Carrier Region Table Data",
                        data
                    );
                } else {
                    return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
                }
            } else {
                return generateResponse(res, 200, false, HttpStatusMessage.NOT_FOUND);
            }
        } catch (error) {
            return generateResponse(
                res,
                500,
                false,
                HttpStatusMessage.INTERNAL_SERVER_ERROR
            );
        }
    }

    private fetchTableAndColumName(tableName: any) {
        let table = "SummerisedVehicleModel"
        let column = "vehicle_model"
        if (tableName == "FuelType") {
            table = "SummerisedFuelType"
            column = "fuel_type"
        }
        else if (tableName == "TrailerType") {
            table = "SummerisedTrailerType"
            column = "trailer_type"
        }
        return {
            table, column
        }

    }

    private async getEmissions(
        initDbConnection: any,
        where: any,
        toggleData: any,
        tableName: string
    ) {
        const orderColumn = toggleData == 1 ? "emission" : "intensity";
        const fetchTableColumn: any = this.fetchTableAndColumName(tableName)
        const columnName = fetchTableColumn?.column;
        const fetchSummeriseTableName = fetchTableColumn?.table;
        const query = {
            attributes: [
                [Sequelize.literal("SUM(emissions) / SUM(total_ton_miles)"), "intensity"],
                [Sequelize.fn("SUM", (Sequelize.col("emissions"))), "emission"],
                `${columnName}_id`,
            ],
            where: where,
            include: [
                {
                    model: initDbConnection[tableName],
                    as: tableName,
                    attributes: ["name"],
                },
            ],
            group: [`${tableName}.name`, `${columnName}_id`],
            order: [[Sequelize.literal(`${orderColumn}`), "DESC"]],
            raw: true,
        };

        let getRegionEmissionsObj = await initDbConnection[
            fetchSummeriseTableName
        ].findAll(query);
        return getRegionEmissionsObj;
    }

    private fetchData(
        authenticate: any,
        tableName: string,
        where: any,
        attributes: any[],
        include: any[],
        group: string[],
        order: any
    ) {
        const fetchSummeriseTableName = this.fetchTableAndColumName(tableName)?.table;

        return authenticate[authenticate.company].models[fetchSummeriseTableName].findAll({
            attributes,
            where,
            include,
            group,
            order,
            raw: true,
        });
    }

    private constructWhereClause(
        id: any,
        year: any,
        quarter: any,
        tableName: any,
        regionId: any
    ) {
        const where: any = {};
        where[Op.and] = [];
        where[Op.and].push({
            [`${this.fetchTableAndColumName(tableName)?.column}_id`]: id,
        });
        where[Op.and].push(
            sequelize.where(
                sequelize.literal("(emission)"),
                {
                    [Op.not]: 0,
                }
            )
        );
        if (year) {
            where[Op.and].push(
                sequelize.where(sequelize.fn("YEAR", sequelize.col("date")), year)
            );
        }

        if (quarter) {
            where[Op.and].push(
                sequelize.literal(`DATEPART(quarter, date) = ${quarter}`)
            );
        }
        if (regionId) {
            where[Op.and].push({ region_id: regionId });
        }

        return where;
    }

    private readonly processRegionDataFuelVehicleRegionData = async (
        getRegionData: any,
        configData: any
    ) => {
        if (getRegionData) {
            let totalIntensity = [];
            let totalEmission = [];
            let intensityArray = [];
            let costArray = [];
            const { contributorColor, detractorColor, mediumColor } = getContributorDetractorGraphColor(configData, "graph")
            //NEW CODE
            for (const property of getRegionData) {
                let data = property.intensity;
                let data2 = property.emission / convertToMillion;
                totalIntensity.push(data);
                totalEmission.push(data2);
            }

            const averageIntensity =
                totalIntensity.reduce((a, b) => a + b, 0) / totalIntensity.length;
            const averageEmission =
                totalEmission.reduce((a, b) => a + b, 0) / totalEmission.length;

            for (const property of getRegionData) {
                let intensity = property.intensity;
                let cost = roundToDecimal(property.cost / convertToMillion);

                property["intensity"] = getPropertyValue(intensity, averageIntensity, contributorColor, detractorColor)

                property["cost"] = getPropertyValue(cost, averageEmission, contributorColor, detractorColor)

                intensityArray.push(intensity);
                costArray.push(cost);
            }

            intensityArray = intensityArray.sort((a, b) => a - b);
            costArray = costArray.sort((a, b) => a - b);

            updateColors(getRegionData, intensityArray, averageIntensity, 'intensity', mediumColor);
            updateColors(getRegionData, costArray, averageEmission, 'cost', mediumColor);
        }

        return getRegionData;

    };

    private readonly processRegionData = async (getRegionData: any, configData: any, tableName: string) => {
        let totalIntensity = [];
        let totalEmission = [];
        let intensityArray = [];
        let emissionArray = [];
        const { contributorColor, detractorColor, mediumColor } = getContributorDetractorGraphColor(configData, "graph")
        //NEW CODE
        for (const property of getRegionData) {
            let data = property.intensity;
            let data2 = property.emission / convertToMillion;
            totalIntensity.push(data);
            totalEmission.push(data2);
        }

        const averageIntensity = calculateAverage(totalIntensity);
        const averageEmission = calculateAverage(totalEmission);

        for (const property of getRegionData) {
            property["name"] = property[`${tableName}.name`]
                || null;

            property[`${tableName}_id`] = property[`${tableName}.id`] || null;

            let intensity = roundToDecimal(property.intensity);
            let cost = roundToDecimal(property.cost / convertToMillion);

            property["intensity"] = getPropertyValue(intensity, averageIntensity, contributorColor, detractorColor)

            property["cost"] = getPropertyValue(cost, averageEmission, contributorColor, detractorColor)

            intensityArray.push(intensity);
            emissionArray.push(cost);
        }

        intensityArray = intensityArray.sort((a, b) => a - b);
        emissionArray = emissionArray.sort((a, b) => a - b);

        updateColors(getRegionData, intensityArray, averageIntensity, 'intensity', mediumColor);
        updateColors(getRegionData, emissionArray, averageEmission, 'cost', mediumColor);

        return getRegionData;
    };

}

export default FuelVehicleTrailerController;
