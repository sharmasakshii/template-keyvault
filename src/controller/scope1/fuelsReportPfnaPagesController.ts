import { Response } from "express";
import { generateResponse } from "../../services/response";
import HttpStatusMessage from "../../constant/responseConstant";
import { Sequelize, Op, fn, col } from "sequelize";
import { MyUserRequest } from "../../interfaces/commonInterface";
import { callStoredProcedure, whereClauseFn } from "../../services/commonServices";
import { convertToMillion } from "../../constant";
import { Scope1TableConstant } from "../../constant/moduleConstant";

class FuelsReportPfnaPagesController {
    private readonly connection: Sequelize;

    constructor(connectionData: Sequelize) {
        this.connection = connectionData;
    }

    async getFuelConsumptionReport(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const companyConnections: any = this.connection;
            const company = companyConnections.company;
            const companyModels = companyConnections[company].models;

            const { year = new Date().getFullYear(), period_id, location_ids, reportSlug, type, supplier, fuel_type_id, transport_id } = req.body;
            const payload = [{ year }, { period_id }, { location_id: location_ids }, { parent_slug: reportSlug }, { supplier }, { fuel_type_id }, { transport_id }];
            const where = await whereClauseFn(payload);
            let attr: any = [[Sequelize.col("pfnaTransactionLocation.name"), "location"]]
            if (type == 'emissions') {
                attr.push([Sequelize.literal(`sum(emissions)/${convertToMillion}`), "value"],)
            } else {
                attr.push([Sequelize.fn("SUM", Sequelize.col("gallons")), "value"])
            }
            const fuelConsumption = await companyModels.PfnaTransactions.findAll({
                attributes: attr,
                include: [
                    {
                        model: companyModels.Location,
                        as: "pfnaTransactionLocation",
                        attributes: [],
                        required: true
                    }
                ],
                where: where,
                group: ["location_id", "pfnaTransactionLocation.name"],
                raw: true
            });

            return generateResponse(res, 200, true, "Fuel consumption report generated.", fuelConsumption);
        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getTransactionDetails(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const companyConnections: any = this.connection;
            const company = companyConnections.company;
            const companyModels = companyConnections[company].models;

            let { year, period_id, startDate, endDate, supplier, location_id, page = 1,
                page_size = 10, order_by, sortOrder, reportSlug, fuel_type_id, transport_id } = req.body;
            order_by = order_by == 'location_id' ? 'location_name' : order_by
            const payload = [
                { supplier },
                { fuel_type_id },
                { location_id },
                { parent_slug: reportSlug },
                { year }, { period_id }, { transport_id }
            ];

            const where = await whereClauseFn(payload);
            if (startDate && endDate) {
                where[Op.and].push({
                    date: {
                        [Op.gte]: startDate,
                        [Op.lte]: endDate,
                    },
                });
            }
            const transactionDetails = await companyModels.PfnaTransactions.findAndCountAll({
                attributes: [
                    'id',
                    'supplier',
                    [Sequelize.col("pfnaFuelType.name"), "fuel_name"],
                    "date",
                    [Sequelize.col("pfnaTransactionLocation.name"), "location_name"],
                    "fuel_type_id",
                    "gallons",
                    "invoice",
                    [Sequelize.literal(`emissions/${convertToMillion}`), "emissions"]
                ],
                include: [
                    {
                        model: companyModels.Location,
                        as: "pfnaTransactionLocation",
                        attributes: [],
                        required: true
                    },
                    {
                        model: companyModels.FuelType,
                        as: "pfnaFuelType",
                        attributes: [],
                        required: true
                    }
                ],
                where: where,
                order: [[order_by, sortOrder]],
                offset: (page - 1) * page_size,
                limit: page_size,
                raw: true
            });

            const responseData = {
                list: transactionDetails.rows,
                pagination: {
                    page: page,
                    page_size: page_size,
                    total_count: transactionDetails.count,
                    totalPages: Math.ceil(transactionDetails.count / page_size)
                }
            };

            return generateResponse(res, 200, true, "Transaction details fetched successfully.", responseData);
        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getFuelsReportMetrics(req: MyUserRequest, res: Response): Promise<Response> {
        try {

            const { year, period_id, divisionId, supplier, transport_id, slug = "" } = req.body;

            const constantData: any = Scope1TableConstant[slug]

            if (!constantData) {
                return generateResponse(res, 400, false, 'Paylod missing');
            }
            const companyConnections: any = this.connection;

            const company = companyConnections.company;
            const companyModels = companyConnections[company].models;

            const table = constantData.table

            const payload = [{ year }, { period_id }, { [divisionId ? 'division_id' : 'supplier']: divisionId ?? supplier }, { transport_id }, { parent_slug: constantData.parent_slug }];

            const where = await whereClauseFn(payload);
            let attr = [Sequelize.literal(`sum(emissions)/${convertToMillion}`), "total_ghg_emissions"]
            if (slug == 'cng') {
                attr = [
                    Sequelize.literal(`(sum(emissions) + sum(dge_emissions)) / ${convertToMillion}`), "total_ghg_emissions"
                ]
            }
            const serviceConfig: any = {
                'totalEmissions': {
                    attributes: [
                        attr
                    ],
                    where: where,
                },
                'fuelConsumptionB100': {
                    attributes: [
                        attr,
                        [Sequelize.fn("SUM", Sequelize.col("gallons")), "fuel_consumption"],
                        [Sequelize.fn("COUNT", Sequelize.literal("distinct location_id")), "location"]

                    ],
                    where,
                    raw: true,
                },
                'fuelConsumption': this.getTransportQuery({ is_convertMillion: false, withSum: true, companyModels: companyModels, sector: constantData.sector, where: where }),

                'emissionByType': this.getTransportQuery({ is_convertMillion: true, withSum: true, companyModels: companyModels, sector: constantData.sector, where: where }),

                'location': {
                    distinct: true,
                    col: 'location_id',
                    fetchType: 'count',
                    where: where,
                },
            }

            const results: any = await this.serviceResult({ constantData: constantData.metricsList, companyModels: companyModels, serviceConfig: serviceConfig, table: table });
            if (slug == 'b100') {
                return generateResponse(res, 200, true, 'Fuel emissions report metrics data.', { ...results?.fuelConsumptionB100[0] });
            }
            return generateResponse(res, 200, true, 'Fuel emissions report metrics data.', results);

        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getFuelConsumptionAndEmissionsGraph(req: MyUserRequest, res: Response): Promise<Response> {
        try {

            const companyConnections: any = this.connection;

            const company = companyConnections.company;
            const companyModels = companyConnections[company].models;

            let graph = req.extraParameter.graph;

            const { year, period_id, divisionId, supplier, transport_id, slug } = req.body;


            const constantData: any = Scope1TableConstant[slug]

            if (!constantData) {
                return generateResponse(res, 400, false, 'Paylod missing');
            }

            let table = constantData.table

            const payload = [{ year }, { period_id }, { [divisionId ? 'division_id' : 'supplier']: divisionId ?? supplier }, { transport_id }, { parent_slug: constantData.parent_slug }];

            const where = await whereClauseFn(payload);

            let attributes: any = [
                [Sequelize.col(`${constantData.sector.toLowerCase()}FuelType.name`), "name"],
                [Sequelize.col(`${constantData.sector.toLowerCase()}FuelType.color`), "color"]
            ]

            if (graph === 'emissions') {
                attributes.push([Sequelize.literal(`sum(emissions)/${convertToMillion}`), "data"]);
            } else {
                attributes.push([Sequelize.fn("SUM", Sequelize.col("gallons")), "data"])
            }

            const field = graph === 'emissions' ? `emissions / ${convertToMillion}` : 'gallons';
            const literalQuery = `sum(${field})`;

            const field2 = graph === 'emissions' ? `dge_emissions / ${convertToMillion}` : 'dge_gallons';
            const literalQuery2 = `sum(${field2})`;

            const cngAttr = [
                [Sequelize.literal(literalQuery), "GGE"],
                [Sequelize.literal(literalQuery2), "DGE"],
            ]
            const queryCommon = {
                attributes: attributes,
                where: where,
                include: [
                    {
                        model: companyModels.FuelType,
                        as: `${(constantData.sector).toLowerCase()}FuelType`,
                        attributes: ['name', 'color'],
                        required: false
                    }
                ],
                group: [`${constantData.sector.toLowerCase()}FuelType.name`, `${constantData.sector.toLowerCase()}FuelType.color`],
                raw: true
            }

            const serviceConfig: any = {
                'pbna': queryCommon,
                'bulk': queryCommon,
                'cng': {
                    attributes: cngAttr,
                    where: where,
                    raw: true
                },
                'rd': queryCommon,
            }

            const emissionsFuelConsByFuelType = await companyModels[table].findAll(serviceConfig[slug]);


            if (emissionsFuelConsByFuelType?.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }

            const formattedData = this.getFormattedData({ data: emissionsFuelConsByFuelType, slug });

            const categories = formattedData.map((item: any) => item.name);

            return generateResponse(res, 200, true, 'Fuel emissions report data.', {
                data: formattedData,
                categories
            });

        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getFuelsReportFilters(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const companyConnections: any = this.connection;
            const company = companyConnections.company;

            const companyModels = companyConnections[company].models;

            const { year = new Date().getFullYear, period_id, divisionId, slug, supplier } = req.body;

            const constantData: any = Scope1TableConstant[slug]

            if (!constantData) {
                return generateResponse(res, 400, false, 'Paylod missing');
            }

            let table = constantData.table

            const payload = [{ year }, { period_id }, { [divisionId ? 'division_id' : 'supplier']: divisionId ?? supplier }, { parent_slug: constantData.parent_slug }];

            const where = await whereClauseFn(payload);

            const serviceConfig: any = {
                periods: {
                    attributes: [
                        [Sequelize.col("period_id"), "id"],
                        [Sequelize.col(`${(constantData.sector).toLowerCase()}Period.name`), "period_name"]
                    ],
                    include: [{
                        model: companyModels.TimePeriodScope1,
                        as: `${(constantData.sector).toLowerCase()}Period`,
                        attributes: [],
                        required: false
                    }],
                    group: ["period_id", `${(constantData.sector).toLowerCase()}Period.name`],
                    where: {
                        year,
                        ...(constantData.parent_slug && { parent_slug: constantData.parent_slug })
                    },
                    order: [
                        [Sequelize.literal(`CAST(SUBSTRING(${(constantData.sector).toLowerCase()}Period.name, 2, LEN(${(constantData.sector).toLowerCase()}Period.name)) AS INT)`), 'ASC']
                    ],
                },
                divisions: {
                    attributes: [
                        [Sequelize.col("division_id"), "id"],
                        [Sequelize.col("transactionDivision.name"), "division_name"]
                    ],
                    include: [{
                        model: companyModels.Division,
                        as: "transactionDivision",
                        attributes: [],
                        required: false
                    }],
                    group: ["division_id", "transactionDivision.name"],
                    where: { [Op.and]: [{ year: year }, period_id && { period_id: period_id }] },
                    order: [
                        [Sequelize.col("transactionDivision.name"), "ASC"]
                    ]
                },
                supplier: {
                    attributes: [
                        [Sequelize.col("supplier"), "name"],
                    ],
                    group: ["supplier"],
                    where: {
                        [Op.and]: [
                            { year },
                            ...(constantData.parent_slug ? [{ parent_slug: constantData.parent_slug }] : []),
                            ...(period_id ? [{ period_id }] : [])
                        ]
                    },
                    order: [
                        [Sequelize.col("supplier"), "ASC"]
                    ]
                },
                transports: this.getTransportQuery({ companyModels: companyModels, sector: constantData.sector, where: where }),
                years: {
                    attributes: [
                        [Sequelize.fn('Distinct', Sequelize.col('year')), 'year']
                    ],
                    where: {
                        ...(constantData.parent_slug && { parent_slug: constantData.parent_slug })
                    },
                    order: [
                        [Sequelize.col('year'), 'ASC']
                    ]
                },
            };
            const results: any = await this.serviceResult({ constantData: constantData.filterList, companyModels: companyModels, serviceConfig: serviceConfig, table: table })

            return generateResponse(res, 200, true, 'List of all filter data.', results);

        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async listOfLocation(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const companyConnections: any = this.connection;
            const company = companyConnections.company;
            const companyModels = companyConnections[company].models;

            // Extract filters from request body
            const { year, period_id, divisionId, transport_id, bu_id, mu_id, company_id, fuel_type_id,
                location_id, slug, supplier, startDate, endDate
            } = req.body;


            const constantData: any = Scope1TableConstant[slug]

            if (!constantData) {
                return generateResponse(res, 400, false, 'Paylod missing');
            }

            const payload = [{ business_unit_id: bu_id }, { market_id: mu_id }, { company_id: company_id }, { fuel_type_id: fuel_type_id }, { location_id: location_id },
            {
                year: year
            }, { period_id: period_id }, { transport_id: transport_id }, { division_id: divisionId }, { supplier }, { parent_slug: constantData.parent_slug }]

            const where = await whereClauseFn(payload);
            if (startDate && endDate) {
                where[Op.and].push({
                    date: {
                        [Op.gte]: startDate,
                        [Op.lte]: endDate,
                    },
                });
            }


            let table = constantData.table;
            // Define attributes for selection
            const attributes: any = [
                [Sequelize.fn("COUNT", Sequelize.literal('1')), "total_transactions"],
                [Sequelize.fn("SUM", Sequelize.col("gallons")), "total_fuel_consumption"],
                [Sequelize.col("location_id"), "location_id"],
                [Sequelize.col(`${(constantData.sector).toLowerCase()}TransactionLocation.name`), "name"],
                [Sequelize.col(`${(constantData.sector).toLowerCase()}TransactionLocation.latitude`), "latitude"],
                [Sequelize.col(`${(constantData.sector).toLowerCase()}TransactionLocation.longitude`), "longitude"],
                constantData.sector == 'PFNA' && [Sequelize.literal(`sum(emissions)/${convertToMillion}`), "emissions"]
            ].filter(Boolean)
            // Query the database
            const locationData = await companyModels[table].findAll({
                attributes: attributes,
                where,
                include: [
                    {
                        model: companyModels.Location,
                        as: `${(constantData.sector).toLowerCase()}TransactionLocation`,
                        attributes: [],
                        required: false
                    }
                ],
                group: [
                    "location_id",
                    `${(constantData.sector).toLowerCase()}TransactionLocation.name`,
                    `${(constantData.sector).toLowerCase()}TransactionLocation.latitude`,
                    `${(constantData.sector).toLowerCase()}TransactionLocation.longitude`
                ],
                raw: true
            });

            return generateResponse(res, 200, true, 'Location-wise fuel consumption data.', locationData
            );

        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getFuelLineChartData(req: MyUserRequest, res: Response): Promise<Response> {
        try {

            const { year, period_id, supplier, transport_id, slug = "" } = req.body;

            const constantData: any = Scope1TableConstant[slug]

            if (!constantData) {
                return generateResponse(res, 400, false, 'Paylod missing');
            }
            const companyConnections: any = this.connection;

            const company = companyConnections.company;
            const companyModels = companyConnections[company].models;

            const table = constantData.table
            let graph = req.extraParameter.graph;

            const payload = [{ year }, { period_id }, { 'supplier': supplier }, { transport_id }, { parent_slug: constantData.parent_slug }];

            const where = await whereClauseFn(payload);
            let attr: any = [fn('COALESCE', fn('ROUND', fn('SUM', col('gallons')), 2), 0),
                'total_gallons'];

            if (graph === 'emissions') {
                attr = [Sequelize.literal(`ROUND(SUM(emissions)/${convertToMillion}, 2)`), "total_emission"]
            }

            if (slug == 'b100') { 
                const transactions = await companyModels[table].findAll({
                    attributes: [
                        attr,
                        'period_id',
                        'location_id',
                        [col(`${(constantData.sector).toLowerCase()}Period.name`), 'period_name'],
                        [col(`pfnaTransactionLocation.name`), 'location_name'],
                        [col(`pfnaTransactionLocation.color`), 'location_color']
                    ],
                    where: where,
                    include: [
                        {
                            model: companyModels.TimePeriodScope1,
                            as: `${(constantData.sector).toLowerCase()}Period`,
                            attributes: [],
                        },
                        {
                            model: companyModels.Location,
                            as: `pfnaTransactionLocation`,
                            attributes: [],
                        }
                    ],
                    group: ['location_id', 'period_id', `${(constantData.sector).toLowerCase()}Period.name`, `pfnaTransactionLocation.name`, `pfnaTransactionLocation.color`],
                    raw: true,
                });

                const response = await this.formatLocationWiseChartData(transactions, graph);
                return generateResponse(res, 200, true, 'Fuel emissions report metrics data.', response);
            }
            else {

                const transactions = await companyModels[table].findAll({
                    attributes: [
                        attr,
                        'period_id',
                        'fuel_type_id',
                        [col(`${(constantData.sector).toLowerCase()}Period.name`), 'period_name'],
                        [col(`${(constantData.sector).toLowerCase()}FuelType.name`), 'fuel_name'],
                        [col(`${(constantData.sector).toLowerCase()}FuelType.color`), 'fuel_color']
                    ],
                    where: where,
                    include: [
                        {
                            model: companyModels.TimePeriodScope1,
                            as: `${(constantData.sector).toLowerCase()}Period`,
                            attributes: [],
                        },
                        {
                            model: companyModels.FuelType,
                            as: `${(constantData.sector).toLowerCase()}FuelType`,
                            attributes: [],
                        }
                    ],
                    group: ['fuel_type_id', 'period_id', `${(constantData.sector).toLowerCase()}Period.name`, `${(constantData.sector).toLowerCase()}FuelType.color`, `${(constantData.sector).toLowerCase()}FuelType.name`],
                    raw: true,
                });

                const periods = [...new Set(transactions.map((item: any) => item.period_name))];

                const fuelTypeMap: any = {};

                transactions.forEach((item: any) => {
                    let { fuel_name, fuel_color, total_gallons, total_emission, period_name } = item;
                    if (graph === 'emissions') {
                        total_gallons = total_emission
                    }

                    if (!fuelTypeMap[fuel_name]) {
                        fuelTypeMap[fuel_name] = {
                            name: fuel_name,
                            color: fuel_color ?? '#019d52',
                            data: [],
                        };
                    }

                    fuelTypeMap[fuel_name].data.push({
                        period: period_name,
                        gallons: total_gallons,
                    });
                });

                const formattedData = Object.values(fuelTypeMap).map((fuel: any) => {
                    const data = periods.map(period => {
                        const periodData = fuel.data.find((d: any) => d.period === period);
                        return periodData ? periodData.gallons : 0;
                    });

                    return {
                        name: fuel.name,
                        color: fuel.color,
                        data,
                    };
                });

                const response = {
                    data: formattedData,
                    periods,
                };

                return generateResponse(res, 200, true, 'Fuel emissions report metrics data.', response);
            }

        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    private async formatLocationWiseChartData(transactions: any[], graph:any) {
        // Get unique list of periods and sort them based on P<number>
        const periods = [...new Set(transactions.map(item => item.period_name))]
            .sort((a, b) => {
                const aNum = parseInt(a.replace(/[^0-9]/g, '')) || 0;
                const bNum = parseInt(b.replace(/[^0-9]/g, '')) || 0;
                return aNum - bNum;
            });
    
        const locationMap: any = {};
    
        transactions.forEach((item) => {
            let { location_name, location_color,  total_gallons, total_emission, period_name } = item;
            if (graph === 'emissions') {
                total_gallons = total_emission
            }
            // Assign random unused color
            if (!locationMap[location_name]) {
                locationMap[location_name] = {
                    name: location_name,
                    color:location_color,
                    data: []
                };
            }
    
            locationMap[location_name].data.push({
                period: period_name,
                gallons: total_gallons
            });
        });
    
        // Prepare final formatted dataset
        const formattedData = Object.values(locationMap).map((location: any) => {
            const data = periods.map(period => {
                const entry = location.data.find((d: any) => d.period === period);
                return entry ? entry.gallons : 0;
            });
    
            return {
                name: location.name,
                color: location.color,
                data
            };
        });
    
        return {
            data: formattedData,
            periods
        };
    }


    async getSearchFilterTransaction(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const authenticate: any = this.connection

            const companyConnection = authenticate[authenticate.company]
            const { year, divisionId, period_id, transport_id, supplier, fuel_id } = req.query

            const searchType = req.query.searchType as string | undefined;
            const searchName = req.query.searchName as string | undefined;
            const slug: any = req.query.slug ?? 'bulk'

            const limit = req.query.limit as any

            const constantData: any = Scope1TableConstant[slug]


            if (!constantData) {
                return generateResponse(res, 400, false, 'Paylod missing');
            }
            const table = constantData.table

            const payload = [{ year: year }, { period_id: period_id, }, { [divisionId ? 'division_id' : 'supplier']: divisionId ?? supplier }, { transport_id: transport_id }, { fuel_type_id: fuel_id }, { parent_slug: constantData?.parent_slug }]

            const whereClause = await whereClauseFn(payload)
            const validTables = constantData?.associateTable ?? [];

            if (!searchType || !validTables.includes(searchType)) {
                return generateResponse(res, 400, false, "Invalid search type");
            }

            const where = {} as any
            where[Op.and] = []

            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]]

            let whereSQL = where[Op.and].map((condition: any) => {
                const key = Object.keys(condition)[0];
                const value = Object.values(condition)[0];

                const formattedValue = typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : value;

                return `${key} = ${formattedValue}`;
            }).join(' AND ');

            const query = `EXEC ${companyConnection['models'][searchType].getTableName().schema}.sectorWiseTransactionfilters @join_table = :join_table, @join_condition = :join_condition,@limit=:limit,@search=:search,@where=:where,@table=:table`

            const replacements = {
                join_table: `${companyConnection['models'][searchType].getTableName().schema}.${companyConnection['models'][searchType].getTableName().tableName}`,
                join_condition: `${companyConnection['models'][searchType].getTableName().tableName}_id`,
                limit: limit,
                search: searchName,
                where: whereSQL,
                table: `${companyConnection['models'][table].getTableName()}`
            }

            const activityData = await callStoredProcedure(replacements, authenticate[authenticate.company], query)

            if (activityData?.length > 0) {
                return generateResponse(res, 200, true, "Get search  list", activityData)
            }
            return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND)

        }
        catch (err) {
            console.log(err, "err")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR)

        }
    }

    private async getServiceData(prop: any) {
        try {
            let { serviceConfig, serviceName, companyModels, table } = prop
            const config = serviceConfig[serviceName];
            if (!config) {
                throw new Error(`Invalid service: ${serviceName}`);
            }
            let fetchType = config?.fetchType || 'findAll';
            return await companyModels[table][fetchType]({
                'attributes': config.attributes,
                where: config.where ?? {},
                include: config.include,
                [config?.distinct && 'distinct']: config?.distinct,
                [config?.col && 'col']: config?.col,
                [config?.group && 'group']: config?.group,
                [config.order && 'order']: config?.order,
                raw: true,
            });
        }
        catch (err) {
            console.log(err, "err")
            throw err
        }
    }

    private async serviceResult(prop: any) {
        try {
            const { constantData, companyModels, serviceConfig, table } = prop
            const results: any = {};
            for (const service of constantData) {
                let data = await this.getServiceData({ serviceConfig: serviceConfig, serviceName: service, companyModels, table })
                if (service == 'totalEmissions') {
                    results["total_ghg_emissions"] = data[0]?.total_ghg_emissions;
                } else {
                    results[service] = data;
                };
            }
            return results
        }
        catch (err) {
            console.log(err, "err")
            throw err
        }
    }

    private readonly getTransportQuery = (prop: any) => {
        const { sector, where, companyModels, is_convertMillion = false, withSum = false } = prop
        let attr: any = [Sequelize.fn("SUM", Sequelize.col("gallons")), "fuel_consumption"]
        if (is_convertMillion) {
            attr = [Sequelize.literal(`sum(emissions) / ${convertToMillion} `), "emissions"]
        }
        return {
            attributes: [
                [Sequelize.col("transport_id"), "id"],
                [Sequelize.col(`${(sector).toLowerCase()}Transport.name`), "transport_name"],
                withSum && attr
            ].filter(Boolean),
            where,
            include: [
                {
                    model: companyModels.Transport,
                    as: `${(sector).toLowerCase()}Transport`,
                    attributes: [],
                    where: {
                        sector: sector,
                    },
                    required: true
                }
            ],
            group: ["transport_id", `${sector.toLowerCase()}Transport.name`],
            order: [
                [Sequelize.col(`${(sector).toLowerCase()}Transport.name`), "ASC"]
            ],
            raw: true
        }
    }
    private readonly getFormattedData = (prop: any) => {
        const { data, slug } = prop

        let formattedData
        if (slug == 'cng') {
            formattedData = Object.entries(data[0]).map(([key, value]) => ({
                name: key,
                data: value,
            }));
        }
        else {
            formattedData = data.map((item: any) => (
                {
                    name: item.name,
                    color: item.color,
                    data: Number(item.data)
                }
            ));
        }
        return formattedData
    }
}

export default FuelsReportPfnaPagesController;
