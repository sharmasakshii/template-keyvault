import { fn, literal, Sequelize, Op } from "sequelize";
import { generateResponse } from "../../../services/response";
import { MyUserRequest } from "../../../interfaces/commonInterface";
import HttpStatusMessage from "../../../constant/responseConstant";
import { callStoredProcedure, getCommonFilterList, mapScacCountryWise, whereClauseFn } from "../../../services/commonServices";
import { countryConstant } from "../../../constant/moduleConstant";
import { convertToMillion, monthsABs } from "../../../constant";

class FuelType {
    name: string;
    color: string;
    data: any[];

    constructor(name: string, color: string, result: any) {
        this.name = name;
        this.color = color;
        this.data = Array(result?.length).fill(0);
    }
}

class CommonAltrEVController {
    private readonly connection: Sequelize;
    constructor(connectionData: Sequelize) {
        this.connection = connectionData;
    }

    async filterCombineDash(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const connection: any = this.connection
            const companyConnection = connection[connection.company]['models']
            const { country, year, tblSlug = "SFB" } = req.body

            const tableNameSlug = {
                SFB: "SummarisedFuelBoard",
                LAFT: "LaneAlternateFuelType"
            } as any

            const tableName = tableNameSlug[tblSlug] || "SummarisedFuelBoard";

            const whereclause = await whereClauseFn([{ year: year }, { country: country }])
            const { countryData, yearData, monthData } = await getCommonFilterList({ companyConnection, country, whereclause, tableName: tableName })
            const uniqueYears = {
                countryData, yearData, monthData
            }
            return generateResponse(res, 200, true, 'filter list', uniqueYears)
        }
        catch (err) {
            console.log(err, "Err")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getScacListCombineDash(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const connection: any = this.connection


            let { country_code = countryConstant.all } = req.query

            const where = await whereClauseFn([{ country: country_code }])
            let whereJoin = await whereClauseFn([{ country_code }]);
            let result = await connection[connection.company].models["SummarisedFuelBoard"].findAll({
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('SummarisedFuelBoard.carrier_scac')), 'carrier_scac'], [Sequelize.literal(`combineDashCarCtry."combined_priority"`), 'scac_priority'],
                [
                    Sequelize.literal(`COALESCE("combineDashCarCtry->combineDashCarrAltr"."name", "combineDashCarCtry->combineDashCarrEv"."name")`),
                    'scac_name'
                ],
                [
                    Sequelize.literal(`COALESCE("combineDashCarCtry->combineDashCarrAltr"."image", "combineDashCarCtry->combineDashCarrEv"."image")`),
                    'scac_image'
                ]
                ],
                include: this.CommonInclude(connection, whereJoin),
                where: where,
                order: [[Sequelize.literal(`COALESCE("combineDashCarCtry->combineDashCarrAltr"."name", "combineDashCarCtry->combineDashCarrEv"."name")`), 'ASC']],
                raw: true,
            });
            if (result.length > 0) {
                return generateResponse(res, 200, true, 'filter scac list', result)
            }
            return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, [])

        }
        catch (err) {
            console.log(err, "Err")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }


    async metricsData(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const connection: any = this.connection

            const companyConnection = connection[connection.company]['models']

            let { country_code = countryConstant.all, year = new Date().getFullYear(), month = '', carrier_scac = [] } = req.body

            const where = await whereClauseFn([{ country: country_code }, { year: year }, { month: month }])

            function getQuery(prop: any) {
                const { type, isIntr, attr = 'fuel_emissions' } = prop
                return companyConnection.SummarisedFuelBoard.findAll({
                    attributes: [
                        [Sequelize.literal(`SUM(${attr}) / ${convertToMillion}`), 'emission'],
                        [Sequelize.fn('SUM', Sequelize.col('shipments')), 'shipments'],
                        [
                            Sequelize.literal(`( SUM(standard_emissions/${convertToMillion}) - SUM(${attr}/${convertToMillion}) ) / SUM(standard_emissions/${convertToMillion}) * 100`),
                            'reduction'
                        ]
                    ],
                    where: {
                        [Op.and]: [
                            ...where[Op.and],
                            type && { carrier_type: type },
                            carrier_scac?.length > 0 && { carrier_scac: { [Op.in]: carrier_scac } },
                            isIntr && { is_intermodal: 1 }
                        ]
                    },
                    raw: true
                })
            }

            const [evEmission, alternateEmission, interModalEmission] = await Promise.all([
                getQuery({ type: 'ev' }),
                getQuery({ type: 'alternate' }),
                getQuery({ type: '', isIntr: true, attr: "intermodal_emissions" })
            ]);

            const result = {
                evEmission,
                alternateEmission,
                interModalEmission
            }
            return generateResponse(res, 200, true, 'Metrics data ', result)
        }
        catch (err) {
            console.log(err, "Err")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }


    async totalShipmentsByFuel(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const connection: any = this.connection

            const companyConnection = connection[connection.company]['models']

            let { country_code = countryConstant.all, year = new Date().getFullYear(), month = '', carrier_scac = [] } = req.body

            carrier_scac = await mapScacCountryWise({ attr: [[Sequelize.fn('DISTINCT', Sequelize.col('SummarisedFuelBoard.carrier_scac')), 'carrier_scac'], [Sequelize.literal(`combineDashCarCtry."combined_priority"`), 'scac_priority']], country_code: country_code, carrier_scac: carrier_scac, companyConnection: connection[connection.company], tableName: "SummarisedFuelBoard", keyName: "carrier_scac" })

            const where = await whereClauseFn([{ country: country_code }, { year: year }, { month: month }])
            let whereJoin = await whereClauseFn([{ country_code }]);

            const result = await
                companyConnection.SummarisedFuelBoard.findAll({
                    attributes: [
                        'carrier_scac',
                        'month',
                        [Sequelize.fn('SUM', Sequelize.col('[SummarisedFuelBoard].shipments')), 'shipments'],
                        [
                            Sequelize.literal(`COALESCE("combineDashCarCtry->combineDashCarrAltr"."color", "combineDashCarCtry->combineDashCarrEv"."color")`),
                            'color'
                        ],
                        [
                            Sequelize.literal(`COALESCE("combineDashCarCtry->combineDashCarrAltr"."name", "combineDashCarCtry->combineDashCarrEv"."name")`),
                            'carrier_name'
                        ]
                    ],
                    include: this.CommonInclude(connection, whereJoin),
                    where: {
                        [Op.and]: [
                            ...where[Op.and],
                            { carrier_scac: { [Op.in]: carrier_scac } }
                        ]
                    },
                    group: ['SummarisedFuelBoard.month', 'SummarisedFuelBoard.carrier_scac', '[combineDashCarCtry->combineDashCarrAltr].color', '[combineDashCarCtry->combineDashCarrEv].color', '[combineDashCarCtry->combineDashCarrEv].name', '[combineDashCarCtry->combineDashCarrAltr].name'],
                    order: [['month', 'asc']],
                    raw: true
                })

            const allMonths = [...new Set(result.map((r: any) => r.month))];
            const formatted: any = {};

            result.forEach(({ carrier_name, month, shipments, color }: any) => {
                if (!formatted[carrier_name]) {
                    formatted[carrier_name] = {
                        name: carrier_name,
                        color: color || '#000000',
                        data: Object.fromEntries(allMonths.map(m => [m, 0]))
                    };
                }
                formatted[carrier_name].data[month] = Number(shipments);
            });

            const chartData = Object.values(formatted).map((carrier: any) => ({
                ...carrier,
                data: allMonths.map((month: any) => carrier.data[month])
            }));

            return generateResponse(res, 200, true, 'Graph data ', { option: chartData, categories: allMonths.map((m: any) => monthsABs[m - 1]) })
        }
        catch (err) {
            console.log(err, "Err")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }


    async totalEmissionByFuel(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const connection: any = this.connection

            const companyConnection = connection[connection.company]['models']

            let { country_code = countryConstant.all, year = new Date().getFullYear(), month = '', carrier_scac = [] } = req.body

            carrier_scac = await mapScacCountryWise({ attr: [[Sequelize.fn('DISTINCT', Sequelize.col('SummarisedFuelBoard.carrier_scac')), 'carrier_scac'], [Sequelize.literal(`combineDashCarCtry."combined_priority"`), 'scac_priority']], country_code: country_code, carrier_scac: carrier_scac, companyConnection: connection[connection.company], tableName: "SummarisedFuelBoard", keyName: "carrier_scac" })

            const where = await whereClauseFn([{ country: country_code }, { year: year }, { month: month }])

            const result = await companyConnection.SummarisedFuelBoard.findAll({
                attributes: [
                    'month',
                    [fn('SUM', literal(`fuel_emissions / ${convertToMillion}`)), 'total_emissions'],
                    [
                        literal(`
                            CASE 
                              WHEN SUM(CASE WHEN carrier_type = 'ev' THEN shipments ELSE 0 END) > 0 
                              THEN SUM(CASE WHEN carrier_type = 'ev' THEN (fuel_emissions / ${convertToMillion}) ELSE 0 END) 
                                   - SUM(standard_emissions / ${convertToMillion}) 
                              ELSE 0 
                            END
                          `),
                        'ev_emissions'
                    ],
                    [
                        literal(`
                          CASE 
                            WHEN SUM(CASE WHEN is_intermodal = 1 THEN shipments ELSE 0 END) > 0 
                            THEN SUM(CASE WHEN is_intermodal = 1 THEN intermodal_emissions / ${convertToMillion} ELSE 0 END) 
                                 - SUM(standard_emissions / ${convertToMillion}) 
                            ELSE 0 
                          END
                        `),
                        'intermodal_emissions'
                    ],
                    [
                        literal(`
                          CASE 
                            WHEN SUM(CASE WHEN carrier_type = 'alternate' THEN shipments ELSE 0 END) > 0 
                            THEN SUM(CASE WHEN carrier_type = 'alternate' THEN fuel_emissions / ${convertToMillion} ELSE 0 END) 
                                 - SUM(standard_emissions / ${convertToMillion}) 
                            ELSE 0 
                          END
                        `),
                        'alternate_emissions'
                    ],
                    [fn('SUM', literal(`standard_emissions / ${convertToMillion}`)), 'diesel_emissions']
                ],
                where: {
                    [Op.and]: [
                        ...where[Op.and],
                        { carrier_scac: { [Op.in]: carrier_scac } }
                    ]
                },

                group: ['month'],
                order: [['month', 'ASC']],
                raw: true
            });

            if (result.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, [])
            }
            const allMonths = [...new Set(result.map((r: any) => r.month))].map((m: any) => monthsABs[m - 1]);

            const chartData: any = [
                new FuelType("Diesel", "#d8856b", result),
                new FuelType("EV", "#019d52", result),
                new FuelType("Alternative", "#D8B06B", result)
            ];

            await result.forEach((entry: any, index: number) => {
                chartData[0].data[index] = Math.abs(entry.diesel_emissions);
                chartData[1].data[index] = Math.abs(entry.ev_emissions);
                chartData[2].data[index] = Math.abs(entry.alternate_emissions);
            });

            return generateResponse(res, 200, true, 'Graph emission data ', { option: chartData, categories: allMonths })
        }
        catch (err) {
            console.log(err, "Err")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }


    async TransactionData(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const connection: any = this.connection


            let { country_code = countryConstant.all, year = new Date().getFullYear(), month = '', carrier_scac = [], page = 0, page_size = 10, shipment_type, fuel_type, order_by = 'shipments', sort_order = 'asc' } = req.body

            carrier_scac = await mapScacCountryWise({ attr: [[Sequelize.fn('DISTINCT', Sequelize.col('SummarisedFuelBoard.carrier_scac')), 'carrier_scac'], [Sequelize.literal(`combineDashCarCtry."combined_priority"`), 'scac_priority']], country_code: country_code, carrier_scac: carrier_scac, companyConnection: connection[connection.company], tableName: "SummarisedFuelBoard", keyName: "carrier_scac" })

            let where = await whereClauseFn([{ country: country_code }, { year: year }, { month: month }, { fuel_type: fuel_type }])

            where[Op.and] = [
                ...where[Op.and],
                { carrier_scac: { [Op.in]: carrier_scac } },
                shipment_type && { is_intermodal: shipment_type == 'OTR' ? 0 : 1 }
            ]

            let page_server = page && parseInt(page) - 1

            let whereSQL = where[Op.and]
                .filter(Boolean)
                .map((condition: any) => {
                    const key = Object.keys(condition)[0];
                    const value: any = Object.values(condition)[0];

                    if (typeof value === 'object' && value[Op.in]) {
                        const valuesArray = value[Op.in]
                            .map((val: any) =>
                                typeof val === 'string' ? `N'${val.replace(/'/g, "''")}'` : val
                            )
                            .join(', ');
                        return `SummarisedFuelBoard.${key} IN (${valuesArray})`;
                    }

                    const formattedValue =
                        typeof value === 'string' ? `N'${value.replace(/'/g, "''")}'` : value;

                    return `SummarisedFuelBoard.${key} = ${formattedValue}`;
                })
                .join(' AND ');

            const query = `EXEC ${connection?.schema}.get_combined_carrier_summary @where = :where,@FetchNext=:FetchNext,@Offset=:Offset,@order_by=:order_by,@sort_order=:sort_order,@country=:country`;

            const activityTotalquery = `EXEC ${connection?.schema}.get_combined_carrier_summary @where = :where,@order_by=:order_by,@sort_order=:sort_order,@country=:country`

            let replacements = {
                country: country_code,
                where: `${whereSQL}`,
                FetchNext: page_size,
                Offset: page_server * 10,
                order_by: order_by,
                sort_order: sort_order
            };

            const { FetchNext, Offset, ...secondCallReplacements } = replacements;


            const [transactionData, totalData] = await Promise.all([
                callStoredProcedure(replacements, connection[connection?.company], query),
                callStoredProcedure(secondCallReplacements, connection[connection?.company], activityTotalquery),
            ]);

            if (transactionData?.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, [])
            }

            return generateResponse(res, 200, true, 'Transaction list', {
                rows: transactionData,
                pagination: {
                    page: page_server,
                    page_size: page_size,
                    total_count: totalData?.length,
                },
            })
        }
        catch (err) {
            console.log(err, "Err")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }


    async fuelTypeList(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const connection: any = this.connection

            const companyConnection = connection[connection.company]['models']

            let { country_code = countryConstant.all, year = new Date().getFullYear(), month = '' } = req.body

            const where = await whereClauseFn([{ country: country_code }, { year: year }, { month: month }])

            const result = await companyConnection["SummarisedFuelBoard"].findAll({
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('SummarisedFuelBoard.fuel_type')), 'fuel'],
                ],
                where: where,
                order: ['fuel_type'],
                raw: true,
            });
            return generateResponse(res, 200, true, 'Fuel  list ', result)
        }
        catch (err) {
            console.log(err, "Err")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }


    private readonly CommonInclude = (connection: any, where: any) => {
        return [
            {
                model: connection[connection.company].models.CarrierCountry,
                required: true,
                attributes: [],
                where: where,
                as: "combineDashCarCtry",
                include: [
                    {
                        model: connection[connection.company].models.AlternateFueltypeCarrier,
                        required: false,
                        attributes: [],
                        as: "combineDashCarrAltr"
                    },
                    {
                        model: connection[connection.company].models.EvCarriers,
                        required: false,
                        attributes: [],
                        as: "combineDashCarrEv"
                    },
                ]
            }
        ];
    }
}

export default CommonAltrEVController