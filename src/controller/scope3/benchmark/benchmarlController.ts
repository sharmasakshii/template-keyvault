import { Response } from "express";
import { Sequelize } from "sequelize";
import { MyUserRequest } from "../../../interfaces/commonInterface";
import { generateResponse } from "../../../services/response";
import HttpStatusMessage from "../../../constant/responseConstant";
import { handlePagination, paginate, whereClauseFn } from "../../../services/commonServices";
import moment from "moment";
import { bandData } from "../../../constant/moduleConstant";
const sequelize = require("sequelize");
const Op = sequelize.Op;

class BenchmarkController {
    private readonly connection: Sequelize;

    constructor(connectionData: Sequelize) {
        this.connection = connectionData; // Assign the passed Sequelize instance to the private property
    }

    /**
     * @description Main function to get lane scenario data
     * @param {HttpRequest} request
     * @param {InvocationContext} context
     * @returns {Promise<HttpResponseInit>} Returns the HTTP response for lane scenario details
     */
    async getDistanceWeightBand(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            const companyConnections: any = this.connection;
            const company = companyConnections.company;
            const companyModels = companyConnections[company].models;
            // Extract the state abbreviation from the request body
            const { toggle_data, year, quarter }: any = request.body;
            const { type } = request.extraParameter;
            const payload = [{ type: type }, { year: year }, { quarter: quarter }]
            let where = await whereClauseFn(payload)

            const emissionType = toggle_data == 1 ? 'ttw' : 'wtw';
            const attr = [
                [sequelize.literal(`(sum(industry_emission_${emissionType})/NULLIF(sum(industry_total_ton_miles),0))`), 'industrial_intensity'],
                [sequelize.literal(`(sum(company_emission_${emissionType})/NULLIF(sum(company_total_ton_miles),0))`), 'company_intensity'],
                'band_no',
                [sequelize.literal(
                    `case 
                    when band_no = '1' then '0-50'
                    when band_no = '2' then '50-150'
                    when band_no = '3' then '150-400'
                    else '400 and above'
                    end`
                ), 'label',
                ],
            ];
            const distanceBand = await companyModels.EmissionBands.findAll({
                attributes: attr,
                where,
                group: ['band_no'],
            });

            if (distanceBand.length > 0) {
                const data = distanceBand.map((property: any) => ({
                    industry: property.dataValues.industrial_intensity,
                    company: property.dataValues.company_intensity,
                    band: property.dataValues.band_no,
                    label: property.dataValues.label,
                }));

                // Return a successful response with the data.
                return generateResponse(res, 200, true, 'Distance Band data.', data);
            } else {
                // Return a 404 response if no records were found.
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND)
            }
        }
        catch (error) {
            console.log(error, "error")
            // Handle errors and return a 500 response in case of an error.
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async emissionTrendGraph(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            const companyConnections: any = this.connection;
            const company = companyConnections.company;
            const companyModels = companyConnections[company].models;

            const { type } = request.extraParameter

            // Extract the state abbreviation from the request body
            const { region_id, bound_type, toggle_data, year, quarter, origin, dest }: any = request.body;

            let where: any = { month: { [Op.ne]: null } };
            let modelName;
            let payload = [];
            if (type === "region") {
                payload = [{ bound_type: bound_type }, { year: year }, { quarter: quarter }, { region: region_id }];
                modelName = "RegionBenchmarks"
            } else {
                payload = [{ ORIGIN: origin }, { DEST: dest }, { year: year }, { quarter: quarter }];
                modelName = "LaneBenchmarks"
            }
            where = await whereClauseFn(payload, where);
            const emissionType = toggle_data == 1 ? 'ttw' : 'wtw';

            const attr = [
                [sequelize.literal('(SUM(company_intermodal_shipments) / NULLIF(SUM(company_shipment),0)) / NULLIF(SUM(industry_intermodal_shipments) / SUM(industry_shipments),0)'), 'intermodal_index'],
                [sequelize.literal(`(SUM(company_emission_${emissionType} ) / NULLIF(SUM(company_total_ton_miles),0)) / NULLIF(SUM(industry_emission_${emissionType}) / SUM(industry_total_ton_miles),0)`), 'emission_index'],
                [sequelize.literal('month'), 'month']
            ];

            const emissionTrend = await companyModels[modelName].findAll({
                attributes: attr,
                where: where,
                group: ['month'],
                order: [['month', 'ASC']]
            });

            if (emissionTrend?.length) {
                let data = emissionTrend.map((property: any) => ({
                    intermodal_index: this.typeCheck(property.dataValues.intermodal_index, this.roundOff(property.dataValues.intermodal_index), null),
                    emission_index: this.typeCheck(property.dataValues.emission_index, this.roundOff(property.dataValues.emission_index), null),
                    month: moment(property.dataValues.month, 'MM').format('MMM'),
                    month_no: property.dataValues.month
                }));
                return generateResponse(res, 200, true, 'Weight Band data.', data);
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
        } catch (error) {
            console.log(error, "erro")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async intermodelTrendGraph(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            const companyConnections: any = this.connection;
            const company = companyConnections.company;
            const companyModels = companyConnections[company].models;

            const { type } = request.extraParameter;

            // Extract the state abbreviation from the request body
            const { region_id, bound_type, year, quarter, origin, dest }: any = request.body;

            let where: any = { month: { [Op.ne]: null } };
            let modelName = "";
            let payload: any = [];
            if (type === "region") {
                payload = [{ bound_type: bound_type }, { year: year }, { quarter: quarter }, { region: region_id }]
                modelName = "RegionBenchmarks"
            }
            if (type === "lane") {
                payload = [{ ORIGIN: origin }, { DEST: dest }, { year: year }, { quarter: quarter }];
                modelName = "LaneBenchmarks"
            }

            where = await whereClauseFn(payload, where);

            let attr = [
                [sequelize.literal('(SUM(company_intermodal_shipments) / NULLIF(SUM(company_shipment),0)) / NULLIF(SUM(industry_intermodal_shipments) / SUM(industry_shipments),0)'), 'company_intermodal_index'],
                [sequelize.literal('SUM(industry_intermodal_shipments) / NULLIF(SUM(industry_shipments),0)'), 'intermodal_index'],
                [sequelize.literal('month'), 'month']
            ];

            const emissionTrend = await companyModels[modelName].findAll({
                attributes: attr,
                where: where,
                group: ['month'],
                order: [['month', 'ASC']]
            });

            if (emissionTrend.length > 0) {
                let data = emissionTrend.map((property: any) => ({
                    company_intermodal_index: this.typeCheck(property.dataValues.company_intermodal_index, this.roundOff(property.dataValues.company_intermodal_index), null),
                    intermodal_index: this.typeCheck(property.dataValues.intermodal_index, this.roundOff(property.dataValues.intermodal_index), null),
                    month: moment(property.dataValues.month, 'MM').format('MMM'),
                    month_no: property.dataValues.month
                }));

                return generateResponse(res, 200, true, 'Weight Band data.', data);
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
        } catch (error) {
            console.log(error, "erro")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    };

    async emissionByRegion(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            const companyConnections: any = this.connection;
            const company = companyConnections.company;
            const companyModels = companyConnections[company].models;

            const { type } = request.extraParameter;
            let { region_id, bound_type, toggle_data, year, quarter, dest, origin }: any = request.body;

            const emissionType = toggle_data == 1 ? 'ttw' : 'wtw';

            let attr = [[sequelize.literal(`SUM(industry_emission_${emissionType}) / NULLIF(SUM(industry_total_ton_miles),0)`), 'industry_intensity'],
            [sequelize.literal(`SUM(company_emission_${emissionType}) / NULLIF(SUM(company_total_ton_miles),0)`), 'company_intensity'],
            [sequelize.literal('SUM(industry_shipments)'), 'industry_shipments'],
            [sequelize.literal('SUM(company_shipment)'), 'company_shipment']]
            let modalName = "";
            let payload: any = [];
            if (type === "region") {
                payload = [{ bound_type }, { year }, { quarter }, { region: region_id }]
                attr = [
                    ...attr,
                    [sequelize.literal('SUM(industry_lane_count)'), 'industry_lane_count'],
                    [sequelize.literal('SUM(company_lane_count)'), 'company_lane_count']
                ];
                modalName = "RegionBenchmarks"
            }

            if (type === "lane") {
                payload = [{ year: year }, { quarter: quarter }, { ORIGIN: origin }, { DEST: dest }]
                modalName = "LaneBenchmarks"
            };

            const where = await whereClauseFn(payload);

            let attr2 = [
                [sequelize.literal('(SUM(company_intermodal_shipments) / NULLIF (SUM(company_shipment),0)) / (SUM(industry_intermodal_shipments) / NULLIF (SUM(industry_shipments),0))'), 'company_intermodal_index'],
                [sequelize.literal('SUM(industry_intermodal_shipments) / NULLIF (SUM(industry_shipments),0)'), 'intermodal_index']
            ];

            const [benchmarksData, interModelIndex] = await Promise.all([
                companyModels[modalName].findAll({
                    attributes: attr,
                    where: where,
                    raw: true
                }),

                companyModels[modalName].findOne({
                    attributes: attr2,
                    where: where,
                    group: ['id']
                })
            ]);

            if (!benchmarksData || !interModelIndex) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }

            let alternateFuelIndex = {
                company_index: 2.7,
                industry_index: 2.0
            };

            let result = {
                benchmarksData: benchmarksData[0] ?? null,
                interModelIndex,
                alternateFuelIndex
            };
            return generateResponse(res, 200, true, 'Emission Benchmarks data.', result);
        } catch (error) {
            console.log(error, "error")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async benchmarkCompanyEmission(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            const companyConnections: any = this.connection;
            const company = companyConnections.company;
            const companyModels = companyConnections[company].models;

            let { low_emission, band_no, toggle_data, year, quarter, type, page = 1, page_size = 5 }: any = request.body;

            const emissionType = toggle_data == 1 ? 'ttw' : 'wtw';

            let attr = [
                [sequelize.literal(`(sum(emissions_${emissionType}) / sum(total_ton_miles))`), 'industrial_intensity'],
                [sequelize.literal(`(sum(company_emission_${emissionType}) / sum(company_total_ton_miles))`), 'company_intensity'],
                'name'
            ];

            const payload = [{ year }, { quarter }, { band_no }, { type }, { 'total_ton_miles': { [Op.gt]: 0 } }, { 'company_total_ton_miles': { [Op.gt]: 0 } }];
            const where = await whereClauseFn(payload);

            let orderBy = low_emission == 1 ? [['company_intensity', 'ASC']] : [['company_intensity', 'DESC']];

            let attr2 = [[sequelize.literal(`SUM(company_emission_${emissionType}) / SUM(company_total_ton_miles)`), 'industrial_average']];

            let page_server = (page) ? parseInt(page) - 1 : 0;

            const [emissionIntensityAverage, emissionIntensityLanes] = await Promise.all([
                companyModels.EmissionIntensityLanes.findAll({
                    attributes: attr2,
                    where: where
                }),
                companyModels.EmissionIntensityLanes.findAndCountAll(paginate(
                    {
                        attributes: attr,
                        where: where,
                        group: ['name'],
                        having: sequelize.literal('sum(company_total_ton_miles) > 0'),
                        order: orderBy
                    },
                    {
                        page: page_server,
                        pageSize: page_size,
                    }))
            ]);

            if (!emissionIntensityLanes.rows.length) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }

            let result = {
                emissionIntensityLanes: emissionIntensityLanes.rows,
                emissionIntensityAverage: emissionIntensityAverage.length > 0 ? emissionIntensityAverage[0] : null,
                pagination: {
                    page: page,
                    page_size: page_size,
                    total_count: emissionIntensityLanes.count?.length
                }
            };
            return generateResponse(res, 200, true, "Lane Benchmarks data", result);
        } catch (error) {
            console.log(error, "error");
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async companyEmissionGraph(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            const companyConnections: any = this.connection;
            const company = companyConnections.company;
            const companyModels = companyConnections[company].models;

            let { region, band_no, toggle_data, year, quarter, type }: any = request.body;

            const emissionType = toggle_data == 1 ? 'ttw' : 'wtw';

            let attr = [
                [sequelize.literal(`(sum(industry_emission_${emissionType}) / NULLIF(sum(industry_total_ton_miles),0))`), 'industry_intensity'],
                [sequelize.literal(`(sum(company_emission_${emissionType}) / NULLIF(sum(company_total_ton_miles),0))`), 'company_intensity'],
                [sequelize.literal('month'), 'month'],
            ];

            const payload = [{ year }, { quarter }, { band_no }, { type }, { region }];
            const where = await whereClauseFn(payload);

            const emissionMileTrend = await companyModels.EmissionMileTrend.findAll({
                attributes: attr,
                where: where,
                group: ['month'],
                order: ['month'],
                raw: true
            });
            if (emissionMileTrend.length) {
                let data = emissionMileTrend.map((property: any) => ({
                    industry_intensity: property.industry_intensity,
                    company_intensity: property.company_intensity,
                    month: moment(property.month, 'MM').format('MMM'),
                    month_no: property.month,
                }));
                return generateResponse(res, 200, true, "Company emission graph  data.", data);
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, [])
            }
        }
        catch (error) {
            console.log(error, "error")
            // Handle errors and return a 500 response in case of an error.
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async emissionInLane(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            const companyConnections: any = this.connection;
            const company = companyConnections.company;
            const companyModels = companyConnections[company].models;

            let { origin, dest, toggle_data, year, quarter }: any = request.body;

            let attr = ['ORIGIN', 'DEST', 'name'];

            const where: any = {};
            where[Op.and] = [];

            if (origin) {
                where[Op.and].push({ 'ORIGIN': { [Op.like]: "%" + origin + "%" } })
            }
            if (dest) {
                where[Op.and].push({ 'DEST': { [Op.like]: "%" + dest + "%" } })
            }

            const emissionType = toggle_data == 1 ? 'ttw' : 'wtw';

            let intermodalAttr = [
                [sequelize.literal('1'), 'alternative_fuel_index'],
                [sequelize.literal('(SUM(company_intermodal_shipments) / NULLIF(SUM(company_shipment),0)) / (SUM(industry_intermodal_shipments) / NULLIF(SUM(industry_shipments),0))'), 'company_intermodal_index'],
                [sequelize.literal('SUM(industry_intermodal_shipments) / NULLIF(SUM(industry_shipments),0)'), 'intermodal_index'],
                [sequelize.literal(`(SUM(company_emission_${emissionType}) / NULLIF(SUM(company_total_ton_miles),0)) / (SUM(industry_emission_${emissionType}) / NULLIF(SUM(industry_total_ton_miles),0))`), 'company_emission_index'],
            ];

            const payload = [{ ORIGIN: origin }, { DEST: dest }, { year }, { quarter }];

            const where1 = await whereClauseFn(payload)

            const [laneBenchmarks, interModelIndex] = await Promise.all([
                companyModels.LaneBenchmarks.findOne({
                    attributes: attr,
                    where: where,
                }),
                companyModels.LaneBenchmarks.findAll({
                    attributes: intermodalAttr,
                    where: where1,
                    group: ['name'],
                    raw: true
                })
            ]);

            if (!laneBenchmarks) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }

            if (interModelIndex.length > 0) {
                let DatByLane = await companyConnections["main"].models.DatByLane.findOne({
                    attributes: ["lane_name", "dollar_per_mile"],
                    where: { lane_name: laneBenchmarks?.dataValues?.name },
                    raw: true
                });
                let data = {
                    "alternative_fuel_index": interModelIndex[0].alternative_fuel_index,
                    "company_intermodal_index": interModelIndex[0].company_intermodal_index,
                    "intermodal_index": interModelIndex[0].intermodal_index,
                    "company_emission_index": interModelIndex[0].company_emission_index
                }
                return generateResponse(res, 200, true, 'Lane Benchmarks data.', { laneBenchmarks, data, dat_by_lane: DatByLane });
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, {});
            }
        } catch (error) {
            console.log(error, "error")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async laneSearch(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            const companyConnections: any = this.connection;
            const company = companyConnections.company;
            const companyModels = companyConnections[company].models;

            let { keyword, page_limit, type, source }: any = request.body;

            let attr = type.toLowerCase() == "dest" ? ['dest'] : ['origin'];

            const where: any = {};
            where[Op.and] = [];
            where[Op.and].push({ [type]: { [Op.like]: "%" + keyword + "%" } })
            if (type.toLowerCase() == "dest") {
                where[Op.and].push({ 'origin': { [Op.like]: "%" + source + "%" } })
            }
            const laneBenchmarks = await companyModels.LaneBenchmarks.findAll({
                attributes: attr,
                where: where,
                group: [type],
                order: [type],
                limit: parseInt(page_limit),
            });
            if (laneBenchmarks.length > 0) {
                return generateResponse(res, 200, true, "Lane list data", laneBenchmarks);
            } else { return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []) }
        }
        catch (error) {
            console.log(error, "error")
            // Handle errors and return a 500 response in case of an error.
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    // Define an Azure Function for getting vendor table data.
    async getRegionBenchmarks(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            let { toggle_data, bound_type, year, quarter } = request.body;
            const emissionType = toggle_data == 1 ? 'ttw' : 'wtw';
            let attr = [
                [sequelize.literal('(sum(company_intermodal_shipments) / NULLIF(sum(company_shipment),0)) / NULLIF((sum(industry_intermodal_shipments) / sum(industry_shipments)),0)'), 'intermodal_index'],
                [sequelize.literal(`(sum(company_emission_${emissionType}) / NULLIF(sum(company_total_ton_miles),0)) / NULLIF(sum(industry_emission_${emissionType}) / sum(industry_total_ton_miles),0)`), 'emission_index'],
                [sequelize.literal('1'), 'alternative_fuel_index'],
                'region',
            ]

            const payload = [{ 'bound_type': bound_type }, { year }, { quarter }];

            const where = await whereClauseFn(payload);
            const regionBenchmarks = await authenticate[authenticate.company]?.models.RegionBenchmarks.findAll({
                attributes: attr,
                where: where,
                group: ['region', 'BenchmarkRegions.id', 'BenchmarkRegions.region_name', 'BenchmarkRegions.slug'],
                include: [
                    {
                        model: authenticate[authenticate?.company]?.models.BenchmarkRegions,
                        attributes: ['id', 'region_name', 'slug'],
                        "as": "BenchmarkRegions"
                    }]
            });

            if (regionBenchmarks?.length > 0) {
                let data = [];
                for (const property of regionBenchmarks) {
                    data.push(
                        {
                            intermodal_index: property.dataValues.intermodal_index,
                            emission_index: property.dataValues.emission_index,
                            alternative_fuel_index: property.dataValues.alternative_fuel_index,
                            region: property.dataValues.region,
                            region_name: property.dataValues.BenchmarkRegions?.region_name,
                            slug: property.dataValues.BenchmarkRegions?.slug

                        }
                    )
                }
                return generateResponse(res, 200, true, "Region Benchmark  data.", data);

            } else { return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND) }
        }
        catch (error) {
            console.error(error, "error")
            // Handle errors and return a 500 response in case of an error.
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getBandsName(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            let { band_type }: { band_type: "weight" | "mile" } = request.body;

            const data: any = bandData?.[band_type] || ""
            if (data) {
                return generateResponse(res, 200, true, "Band name data", data);
            }
            else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
        }
        catch (error) {
            // Handle errors and return a 500 response in case of an error.
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    // Define an Azure Function for getting vendor table data.
    async companyBenchmark(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            let authenticate: any = this.connection;

            let { band_no, toggle_data, year, quarter, type } = request.body;
            const emissionType = toggle_data == 1 ? 'ttw' : 'wtw';

            let attr = [[sequelize.literal('SUM(industry_shipments)'), 'industry_shipments'],
            [sequelize.literal('SUM(company_shipment)'), 'company_shipment'],
            [sequelize.literal('SUM(industry_lane_count)'), 'industry_lane_count'],
            [sequelize.literal('SUM(company_lane_count)'), 'company_lane_count'],
            [sequelize.literal(`SUM(industry_emission_${emissionType}) / NULLIF(SUM(industry_total_ton_miles), 0)`), 'industry_intensity'],
            [sequelize.literal(`SUM(company_emission_${emissionType}) / NULLIF(SUM(company_total_ton_miles), 0)`), 'company_intensity']
            ];

            const payload = [{ ['type']: type }, { year }, { quarter }, { ['band_no']: band_no }];

            let where = await whereClauseFn(payload)

            const mileBands = await authenticate[authenticate?.company]?.models.EmissionBands.findAll({
                attributes: attr,
                where: where,
            });
            if (!mileBands) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND)
            }
            let attr2 = [
                [sequelize.literal('(SUM(company_intermodal_shipments) / NULLIF(SUM(company_shipment), 0)) / (SUM(industry_intermodal_shipments) / NULLIF(SUM(industry_shipments),0))'), 'company_intermodal_index'],
                [sequelize.literal('SUM(industry_intermodal_shipments) / NULLIF(SUM(industry_shipments), 0)'), 'intermodal_index'],
            ];
            const payload1 = [{ year }, { quarter }, { ['band_no']: band_no }];

            let where1 = await whereClauseFn(payload1)
            const interModelIndex = await authenticate[authenticate?.company]?.models.EmissionBands.findAll({
                attributes: attr2,
                where: where1,
            });
            if (!interModelIndex) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND)
            }
            let alternateIndex = {
                company_alternate_index: 2.7,
                alternate_index: 2
            }
            let result = {
                "mileBands": {
                    industry_intensity: mileBands[0].dataValues.industry_intensity,
                    company_intensity: mileBands[0].dataValues.company_intensity,
                    industry_shipments: mileBands[0].dataValues.industry_shipments,
                    company_shipment: mileBands[0].dataValues.company_shipment,
                    industry_lane_count: mileBands[0].dataValues.industry_lane_count,
                    company_lane_count: mileBands[0].dataValues.company_lane_count,
                },
                "interModelIndex": {
                    company_intermodal_index: interModelIndex[0].dataValues.company_intermodal_index,
                    intermodal_index: interModelIndex[0].dataValues.intermodal_index,
                },
                alternateIndex
            }
            return generateResponse(res, 200, true, "Lane Benchmarks data", result);
        }
        catch (error) {
            console.error(error, "error")
            // Handle errors and return a 500 response in case of an error.
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async carrierEmissionTable(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            const companyConnections: any = this.connection;
            const company = companyConnections.company;
            const companyModels = companyConnections[company].models;

            let { band_no, toggle_data, year, quarter, type, low_emission, page, page_size, region_id, origin, dest, bound_type }: any = request.body;

            let { page_server, page_server_size } = handlePagination(page, page_size);
            let payload: any = [{ band_no }, { year }, { quarter }];

            if (type) {
                switch (type) {
                    case 'region':
                        if (region_id) {
                            payload.push({ region: region_id });
                        }
                        break;
                    case 'lane':
                        payload.push({ name: `${origin}_${dest}` });
                        break;
                    default:
                        payload.push({ type });
                }
            }


            let where = await whereClauseFn(payload)

            const attr = this.toggleDataKey(toggle_data);

            const [total_count, company_carrier] = await Promise.all([
                companyModels.BenchmarkCarriers.findAll(
                    {
                        attributes: [[sequelize.fn('DISTINCT', sequelize.col('carrier_name')), 'total_count']],
                        where: where,
                    }
                ),
                companyModels.BenchmarkCarriers.findAll(
                    paginate({
                        attributes: [
                            [sequelize.literal('carrier_name'), 'name'],
                            [sequelize.literal('carrier_logo'), 'carrier_logo'],
                            [sequelize.literal('carrier'), 'carrier'],
                            [sequelize.literal(`(sum(emission_${attr})/ 1000000)`), 'total_emission'],
                            [sequelize.literal(`(sum(emission_${attr})/ NULLIF(sum(total_ton_miles),0))`), 'emission_intensity'],
                            [sequelize.literal('(sum(shipments))'), 'total_shipment']
                        ],
                        where: { ...where, 'total_ton_miles': { [Op.not]: 0 } },
                        group: ['carrier', 'carrier_name', 'carrier_logo'],
                        order: low_emission == 0 ? [['emission_intensity', 'DESC']] : ['emission_intensity'],
                    }, {
                        page: page_server,
                        pageSize: page_server_size
                    })
                )
            ])

            let carrierCode = company_carrier.map((item: any) => (item.dataValues.carrier));
            let carrier_ranking = await companyModels.smartdataRanking.findAll({
                attributes: [
                    ['carrier_code', 'code'],
                    'ranking',
                    'year'
                ],
                where: [{ carrier_code: carrierCode },
                {
                    ranking: { [Op.ne]: null }
                }],
                group: ['ranking', 'year', 'carrier_code'],
                order: [['year', 'asc']],
            });
            for (const property of company_carrier) {
                let smartwayData: any = [];
                carrier_ranking.map((item: any) => {
                    if (item.dataValues.code == property.dataValues.carrier)
                        smartwayData.push(item)
                });
                const result = [];
                for (const prop of smartwayData) {
                    if (prop) {
                        result.push(prop);
                    }
                }
                property.dataValues.SmartwayData = result;
            }

            let industry_carrier = company_carrier;

            const attr2 = [
                [sequelize.literal(`SUM(industry_emission_${attr}) / NULLIF(SUM(industry_total_ton_miles), 0)`), 'industry_intensity'],
                [sequelize.literal(`SUM(company_emission_${attr}) / NULLIF(SUM(company_total_ton_miles),0)`), 'company_intensity'],
            ]

            // fetch intensity data
            const fetchIntensityDataPayload = { companyModels, attr2, type, where, origin, dest, bound_type, year, quarter, region_id }

            let intensity = await this.fetchIntensityData(fetchIntensityDataPayload);
            if (!intensity) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND)
            }
            let result = {
                intensity: intensity[0].dataValues,
                company_carrier,
                industry_carrier,
                pagination: {
                    page: page_server,
                    page_size: page_server_size,
                    total_count: total_count?.length,
                }
            }
            return generateResponse(res, 200, true, "Lane Benchmarks data", result);
        }
        catch (error) {
            console.error(error, "error")
            // Handle errors and return a 500 response in case of an error.
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async benchmarkRegion(_request: MyUserRequest, res: Response): Promise<Response> {

        let authenticate: any = this.connection

        try {
            let attr = [
                'region_name',
                'slug',
                'id',
            ]
            const region = await authenticate[authenticate.company].models.BenchmarkRegions.findAll({
                attributes: attr,
            });
            if (region?.length > 0) {
                return generateResponse(res, 200, true, "Bemchmark region data.", region);
            }
            else { return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND); }
        }
        catch (error) {
            console.log(error, "error")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    private async fetchIntensityData(prop: any) {
        const { companyModels, attr2, type, where, origin, dest, bound_type, year, quarter, region_id } = prop
        let intensity = [];

        if (type === 'mile' || type === 'weight') {
            intensity = await this.fetchIntensityForMileOrWeight(companyModels, where, attr2);
        } else if (type === 'lane') {
            intensity = await this.fetchIntensityForLane(companyModels, origin, dest, attr2, year, quarter);
        } else {
            intensity = await this.fetchIntensityForRegion(companyModels, attr2, region_id, bound_type, year);
        }

        return intensity;
    }

    private async fetchIntensityForMileOrWeight(request: any, where: any, attr2: any) {
        return await request.EmissionBands.findAll({
            attributes: attr2,
            where: where,
        });
    }

    private async fetchIntensityForLane(request: any, origin: any, dest: any, attr2: any, year: any, quarter: any) {
        let where = await whereClauseFn([{ year }, { quarter }, { 'ORIGIN': origin }, { 'DEST': dest }]);
        return await request.LaneBenchmarks.findAll({
            attributes: attr2,
            where: where,
        });
    }

    private async fetchIntensityForRegion(request: any, attr2: any, region_id: any, bound_type: any, year: any) {
        let where = await whereClauseFn([{ region: region_id }, { year }, { bound_type }])

        return await request.RegionBenchmarks.findAll({
            attributes: attr2,
            where: where,
        });
    }

    private readonly typeCheck = (cond: any, stm1: any, stm2: any) => {
        return cond ? stm1 : stm2;
    }

    private readonly roundOff = (number: any) => {
        return Math.round(Number.parseFloat(number || 0) * 10) / 10
    }
    private readonly toggleDataKey = (toggle_data: any) => {
        return toggle_data !== 0 ? "ttw" : "wtw";
    }
}

export default BenchmarkController;
