import { Response } from "express";
import { Op, Sequelize } from "sequelize";
import { generateResponse } from "../../../../services/response";
import { formatNumber, paginate, whereClauseFn, validator, callStoredProcedure, fetchScacByCountry, mapScacCountryWise } from "../../../../services/commonServices";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { MyUserRequest } from "../../../../interfaces/commonInterface";
import { convertToMillion, monthsABs } from "../../../../constant";
import { countryConstant } from "../../../../constant/moduleConstant";
class AlternateFuelTypeController {
    private readonly connection: Sequelize;

    constructor(connectionData: Sequelize) {
        this.connection = connectionData;
    }

    async getLanesByFuelUsageAndMileage(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            const connection: any = this.connection;
            const companyConnection = connection[connection.company];

            let { year, month, page_size, page, order_by, column, fuelType, carrier_scac, country_code } = request.body;

            carrier_scac = await mapScacCountryWise({ country_code: country_code, carrier_scac: carrier_scac, companyConnection: companyConnection, tableName: "AlternateFueltypeCarrier" })


            if (carrier_scac?.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }
            const pageSize = page_size || 10;
            const pageIndex = page ? parseInt(page) - 1 : 0;

            const fuelTypeParam = fuelType.join(',');
            const carrierScacParam = carrier_scac.join(',');

            const query = `EXEC ${connection.schema}.GetLaneAlternateFuelTypeDataList 
                            @Year = :year, 
                            @Month = :month, 
                            @PageSize = :pageSize, 
                            @Page = :page, 
                            @OrderBy = :orderBy, 
                            @Column = :column, 
                            @FuelType = :fuelType, 
                            @CarrierScac = :carrierScac`;
            let replacement: any = {
                year: year || 2024, // Default to 2024 if year is not provided
                month: month || null,
                pageSize: pageSize,
                page: pageIndex + 1, // SQL Server uses 1-based index
                orderBy: order_by || 'DESC',
                column: column || 'emission',
                fuelType: fuelTypeParam,
                carrierScac: carrierScacParam,
            }
            const list = await callStoredProcedure(replacement, companyConnection, query);
            replacement['pageSize'] = null;
            replacement['page'] = null;
            const total = await callStoredProcedure(replacement, companyConnection, query);

            const responseData = {
                list: list,
                pagination: {
                    page: pageIndex + 1,
                    page_size: pageSize,
                    total_count: total.length,
                    totalPages: Math.ceil(total.length / pageSize),
                },
            };

            return generateResponse(res, 200, true, "Lanes fetched successfully.", responseData);
        } catch (error) {
            console.log(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }


    async getLaneStatistics(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            const connection: any = this.connection
            const companyConnection = connection[connection.company]

            let { year, month, lane_name, carrier_scac, country_id, country_code } = request.body

            if (!lane_name) {
                return generateResponse(res, 400, false, "Route is required.");
            }

            carrier_scac = await mapScacCountryWise({ country_code: country_code, carrier_scac: carrier_scac, companyConnection: companyConnection, tableName: "AlternateFueltypeCarrier" })
            if (carrier_scac?.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }
            const where: any = {
                [Op.and]: [
                    { is_deleted: 0 },
                    { lane_name: lane_name }
                ],
            }
            const payload = [{ year: year }, { month: month }, { scac: carrier_scac }, { country_id: country_id }]

            const whereClause = await whereClauseFn(payload)

            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];


            // Get the route statistics
            const [emissionsData, shipmentData] = await Promise.all([
                this.getLaneAlternateFuelTypeData(companyConnection, where),
                this.getLaneShipmentData(companyConnection, where)
            ]);

            const data = await this.transformRouteData(emissionsData, shipmentData);

            return generateResponse(res, 200, true, "Route statistics fetched successfully.", data);
        } catch (error) {
            console.log('error ', error)
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getTotalDataByLaneAndFuelType(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            const connection: any = this.connection
            const companyConnection = connection[connection.company]

            let { year, month, column, carrier_scac, country_code } = request.body

            if (!column) {
                return generateResponse(res, 400, false, "Column required.");
            }
            const where: any = {
                [Op.and]: [
                    { is_deleted: 0 }
                ],
            }

            carrier_scac = await mapScacCountryWise({ country_code: country_code, carrier_scac: carrier_scac, companyConnection: companyConnection, tableName: "AlternateFueltypeCarrier" })

            if (carrier_scac?.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }

            const payload = [{ year: year }, { month: month }, { scac: carrier_scac }]

            const whereClause = await whereClauseFn(payload)

            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];

            let attr: any = await this.getAttributes(column);
            attr.push('lane_name')
            attr.push('fuel_type')
            // Get the total emissions by lane and fuel type
            const emissionsData = await companyConnection.models.LaneAlternateFuelType.findAll({
                where: where,
                attributes: attr,
                include: [
                    {
                        model: companyConnection.models.AlternateFuelTypeConstant,
                        as: 'afc',
                        required: false
                    }
                ],
                group: ['lane_name', 'fuel_type', '[afc].[id]', '[afc].[name]', '[afc].[code]', '[afc].[color]', '[afc].[fuel_constant]'],
                having: await this.getHaving(column),
                order: [[column, 'DESC']],
                raw: true
            });
            const { options, categories } = await this.transformData(emissionsData, column);
            let data = {
                options,
                categories
            }
            return generateResponse(res, 200, true, "Emissions data fetched successfully.", data);
        } catch (error) {
            console.log(error, "err")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getTotalEmissionsByFuelType(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            const connection: any = this.connection
            const companyConnection = connection[connection.company]

            let { year, month, carrier_scac, country_code } = request.body
            const where: any = {
                [Op.and]: [
                    { is_deleted: 0 }
                ],
            }
            carrier_scac = await mapScacCountryWise({ country_code: country_code, carrier_scac: carrier_scac, companyConnection: companyConnection, tableName: "AlternateFueltypeCarrier" })

            if (carrier_scac?.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }
            const payload = [{ year: year }, { month: month }, { scac: carrier_scac }]

            const whereClause = await whereClauseFn(payload)

            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];

            // Get the total emissions by lane and fuel type
            const emissionsData = await companyConnection.models.LaneAlternateFuelType.findAll({
                attributes: [
                    'fuel_type',
                    [Sequelize.literal(`sum(emission)/ ${convertToMillion}`), 'emission']],
                include: [
                    {
                        model: companyConnection.models.AlternateFuelTypeConstant,
                        as: 'afc',
                        required: false
                    }
                ],
                where: where,
                group: ['fuel_type', '[afc].[id]', '[afc].[name]', '[afc].[code]', '[afc].[color]', '[afc].[fuel_constant]'],
                order: [['emission', 'DESC']],
                raw: true
            });
            if (emissionsData?.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
            const { options, categories } = await this.totalEmissiontransformData(emissionsData, 'emission');
            let data = {
                options,
                categories
            }
            return generateResponse(res, 200, true, "Emissions data fetched successfully.", data);
        } catch (error) {
            console.log(error, "err")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async listOfAllLanesByShipments(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {

            const connection: any = this.connection
            let { year, month, page_size, page, order_by, carrier_scac, country_code } = request.body

            const companyConnection = connection[connection.company]

            let validation = await validator(
                {
                    page_size: page_size,
                    page: page,
                    order_by: order_by
                },
                {
                    page_size: "required",
                    page: "required",
                    order_by: "required|string"
                }
            );
            if (validation.status) {
                return generateResponse(res, 400, false, "Validation Errors!");
            }

            const where: any = {
                [Op.and]: [
                    { is_deleted: 0 }
                ],
            }

            carrier_scac = await mapScacCountryWise({ country_code: country_code, carrier_scac: carrier_scac, companyConnection: companyConnection, tableName: "AlternateFueltypeCarrier" })

            if (carrier_scac?.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }
            const payload = [{ year: year }, { month: month }, { scac: carrier_scac },]

            const whereClause = await whereClauseFn(payload)

            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];

            let page_server = page ? parseInt(page) - 1 : 0;
            // Get the all lanes
            const lanesByShipmentsTotal = await companyConnection.models.LaneAlternateFuelType.findAll({
                attributes: ['lane_name'],
                where: where,
                group: ['lane_name'],
            });

            const lanesByShipments = await companyConnection.models.LaneAlternateFuelType.findAll(
                paginate(
                    {
                        attributes: ['lane_name', [Sequelize.literal('sum(shipments)'), 'shipment']],
                        where: where,
                        group: ['lane_name'],
                        order: [['shipment', order_by], ['lane_name', "ASC"]]
                    },
                    {
                        page: page_server,
                        pageSize: page_size,
                    }
                ));

            if (lanesByShipments.length > 0) {
                const responseData = {
                    list: lanesByShipments,
                    pagination: {
                        page: page,
                        page_size: page_size,
                        total_count: lanesByShipmentsTotal.length
                    },
                };
                return generateResponse(res, 200, true, "List of all lanes by shipments", responseData);
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
        } catch (error) {
            console.log(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getMetrics(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {

            let { year, month, carrier_scac, country_code } = request.body

            const connection: any = this.connection

            const companyConnection = connection[connection.company]

            const where: any = {
                [Op.and]: [
                    { is_deleted: 0 }
                ],
            }

            carrier_scac = await mapScacCountryWise({ country_code: country_code, carrier_scac: carrier_scac, companyConnection: companyConnection, tableName: "AlternateFueltypeCarrier" })

            if (carrier_scac?.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }

            const payload = [{ year: year }, { month: month }, { scac: carrier_scac },]

            const whereClause = await whereClauseFn(payload)

            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];

            const result = await companyConnection.models.LaneAlternateFuelType.findAll({
                attributes: [
                    [Sequelize.literal(`SUM(emission) / ${convertToMillion}`), 'total_emissions']
                ],
                where: where,
                raw: true
            });

            const totalEmissions = result[0]?.total_emissions ?? 0;
            const totalLanesCount = await companyConnection.models.LaneAlternateFuelType.count({
                where: where,
                col: 'lane_name',
                distinct: true,
                raw: true
            });

            const totalLanes = totalLanesCount ?? 0;

            // Get the total shipments
            const shipments = await companyConnection.models.LaneAlternateFuelType.findAll({
                attributes: [
                    [Sequelize.fn('SUM', Sequelize.col('shipments')), 'total_shipments']
                ],
                where: where,
                raw: true
            });
            let totalShipments = shipments[0]?.total_shipments || 0;

            const metrics = {
                totalLanes,
                totalShipments,
                totalEmissions
            };

            return generateResponse(res, 200, true, "Metrics fetched successfully.", metrics);
        } catch (error) {
            console.log(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }


    async getFuelCarrierData(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            const connection: any = this.connection
            const companyConnection = connection[connection.company]

            let { fuel_id, scac = [], year, month, country_code } = request.body

            const where = await whereClauseFn([{ fuel_type: Number(fuel_id) }, { year: year }, { month: month }])

            scac = await mapScacCountryWise({ country_code: country_code, carrier_scac: scac, companyConnection: companyConnection, tableName: "AlternateFueltypeCarrier" })

            if (scac?.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }

            where[Op.and].push({ scac: { [Op.in]: scac } });

            const result = await companyConnection.models.LaneAlternateFuelType.findAll({
                attributes: [
                    [Sequelize.literal('afc2.name'), 'name'],
                    [Sequelize.fn("SUM", Sequelize.col("LaneAlternateFuelType.shipments")), "total_shipments"]
                ],
                where: where,
                include: [
                    {
                        model: companyConnection.models.AlternateFueltypeCarrier,
                        as: 'afc2',
                        required: false
                    }
                ],
                group: ['[afc2].[id]',
                    'afc2.image',
                    'afc2.scac',
                    'afc2.name',
                    'afc2.color'],
                raw: true
            });
            if (result.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }
            return generateResponse(res, 200, true, "Alternative carrier by fuel.", result);
        } catch (error) {
            console.log(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getCarrierList(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {

            const connection: any = this.connection
            const companyConnection = connection[connection.company]

            let { country_code = countryConstant.all } = request.query

            const result = await fetchScacByCountry({ companyConnection: companyConnection, country_code: country_code, tableName: "AlternateFueltypeCarrier" })

            if (result.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }

            return generateResponse(res, 200, true, "Alternative carrier by country.", result);
        } catch (error) {
            console.log(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getCountryList(
        _request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            const connection: any = this.connection
            const companyConnection = connection[connection.company]

            const result = await companyConnection['models'].CountryAlternate.findAll({
                attributes: ['country_name', 'country_code'],
            })

            if (result.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }

            return generateResponse(res, 200, true, "Country list.", result);
        } catch (error) {
            console.log(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    private async totalEmissiontransformData(data: any, column: any) {

        const fuelTypesSet = new Set(data.map((item: any) => item['afc.code']));
        const fuelTypes: any = Array.from(fuelTypesSet);
        // Initialize the options array with empty data arrays for each fuel type
        const options = fuelTypes.map((fuelType: string) => {
            return {
                name: fuelType,
                data: []
            };
        });

        // Initialize a set to keep track of unique lane names for categories
        const categoriesSet = new Set();
        // Process the input data
        data.forEach((item: any) => {
            categoriesSet.add(item['afc.code']);
            const fuelIndex = fuelTypes.indexOf(item['afc.code']);
            if (fuelIndex !== -1) {
                options[fuelIndex]['color'] = item['afc.color']
                options[fuelIndex].data.push(item[column]);
            }
        });

        // Convert the set to an array for categories
        const categories = Array.from(categoriesSet);
        options.sort((a: any, b: any) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });

        return { options, categories };
    }

    private async transformRouteData(emissionsData: any, shipmentData: any) {
        const routeStats: any = {
            total_shipments: 0,
            total_emissions: 0,
            fuel_types: []
        };
        if (shipmentData.length > 0) {
            routeStats.total_shipments = parseInt(shipmentData[0].dataValues.shipment);
        }
        emissionsData.forEach((item: any) => {
            const values = item.dataValues;
            routeStats.total_emissions += parseFloat(values.emission);

            routeStats.fuel_types.push({
                fuel_type: values.name,
                fuel_consumption: values.fuel_consumption,
                mileage: parseFloat(values.fuel_mileage).toFixed(1)
            });
        });

        routeStats.total_emissions = routeStats.total_emissions.toFixed(2);

        return routeStats;
    }

    private async getLaneAlternateFuelTypeData(connections: any, where: any) {
        return await connections.models.LaneAlternateFuelType.findAll({
            attributes: [
                [Sequelize.literal(`sum(emission) / ${convertToMillion}`), 'emission'],
                [Sequelize.literal('sum(fuel_mileage)'), 'fuel_mileage'],
                [Sequelize.literal('sum(fuel_consumption)'), 'fuel_consumption'],
                [Sequelize.col('afc.code'), 'name'],
                'lane_name'
            ],
            where: where,
            include: [
                {
                    model: connections.models.AlternateFuelTypeConstant,
                    as: 'afc', // Alias used to join with AlternateFuelTypeConstant
                    required: false, // LEFT OUTER JOIN
                    attributes: [] // We only need 'name' from the joined table
                }
            ],
            group: ['lane_name', '[afc].[code]'], // Group by fuel_type and name
        });
    }

    private async getLaneShipmentData(connections: any, where: any) {
        return await connections.models.LaneAlternateFuelType.findAll({
            attributes: [
                [Sequelize.literal('sum(shipments)'), 'shipment'],
                'lane_name'
            ],
            where: where,
            group: ['lane_name']
        });
    }

    private async transformData(data: any, column: any) {

        // Extract unique lane names in the order they appear
        const categories: any = [...new Set(data.map((item: any) => item.lane_name))];

        // Extract unique fuel types dynamically
        const fuelTypes = [...new Set(data.map((item: any) => {
            return item['afc.code']
        }))];
        // Initialize the options array with empty data arrays for each fuel type
        const options: any = fuelTypes.map((fuelType: any) => ({
            name: fuelType,
            data: new Array(categories.length).fill(0) // Initialize with 0s to ensure correct length
        }));
        // Create a map to quickly find the index of a lane name
        const laneNameIndexMap: any = {};
        categories.forEach((name: string, index: any) => {
            laneNameIndexMap[name] = index;
        });

        // Process the input data
        data.forEach((item: any) => {
            const fuelIndex = fuelTypes.indexOf(item['afc.code']);
            const laneIndex = laneNameIndexMap[item.lane_name];
            if (fuelIndex !== -1 && laneIndex !== undefined) {
                options[fuelIndex]['color'] = item['afc.color'];
                options[fuelIndex].data[laneIndex] = formatNumber(true, item[column], 2)
            }
        });

        // Step 1: Calculate total values for each category
        const categoryTotals = categories.map((_: any, index: number) =>
            options.reduce((sum: any, option: any) => sum + option.data[index], 0)
        );

        // Step 2: Get sorted indices of categories based on total values in descending order
        const sortedIndices = categoryTotals
            .map((total: any, index: number) => ({ total, index }))
            .sort((a: any, b: any) => b.total - a.total)
            .map((item: any) => item.index);

        // Step 3: Reorder categories based on sorted indices
        const sortedCategories = sortedIndices.map((index: any) => categories[index]);
        // Step 4: Reorder data within each fuel type based on sorted indices
        const sortedOptions: any = options.map((option: any) => ({
            name: option.name,
            color: option.color,
            data: sortedIndices.map((index: any) => option.data[index]),
        }));
        // Sort options by fuel type name
        const sortFn = this.compareOptions
        sortedOptions.sort(sortFn);

        return { options: sortedOptions, categories: sortedCategories };
    }

    private async compareOptions(a: any, b: any) {
        if (a.name < b.name) {
            return -1;
        } else if (a.name > b.name) {
            return 1;
        } else {
            return 0;
        }
    }

    private async getAttributes(column: any) {
        if (column == 'emission') {
            return [[Sequelize.literal(`Top 15 sum(emission)/ ${convertToMillion}`), 'emission']]
        }
        else if (column == 'fuel_consumption') {
            return [[Sequelize.literal('Top 15 sum(fuel_consumption)'), 'fuel_consumption']]
        }
        else if (column == 'fuel_mileage') {
            return [[Sequelize.literal('Top 15 sum(fuel_mileage)'), 'fuel_mileage']]
        }
        return [];
    }

    private async getHaving(column: any) {
        if (column == 'emission') {
            return Sequelize.literal(`SUM(${column}) / ${convertToMillion} > 0`)
        }
        else {
            return Sequelize.literal(`SUM(${column}) > 0`)
        }
    }

    public async getFuelTypeList(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {

            const isCarrier = request.extraParameter

            const connection: any = this.connection;
            const companyConnection = connection[connection.company];

            const { year, month, carrier_scac = [] } = request.body;

            if (!isCarrier?.type && (!year || carrier_scac.length === 0)) {
                return generateResponse(res, 400, false, "Year and atleast one carrier required.");
            }

            const where: any = {
                [Op.and]: [
                    { is_deleted: 0 }
                ],
            }

            const payload = [{ year: year }, { month: month }]

            const whereClause = await whereClauseFn(payload)

            if (carrier_scac?.length > 0) {
                where[Op.and].push({ scac: { [Op.in]: carrier_scac } });
            }

            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];

            const attributes: any = [['fuel_type', 'id'], [Sequelize.col('afc.code'), 'name']];

            const fuelTypeData = await companyConnection.models.LaneAlternateFuelType.findAll({
                where: where,
                attributes: attributes,
                include: [
                    {
                        model: companyConnection.models.AlternateFuelTypeConstant,
                        as: 'afc',
                        required: false,
                        attributes: []
                    }
                ],
                group: ['fuel_type', '[afc].[code]'],
                order: ['name'],
                raw: true
            });

            if (!fuelTypeData || fuelTypeData.length === 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }

            return generateResponse(res, 200, true, "Fuel type data fetched successfully.", fuelTypeData);

        } catch (error) {
            console.log(error, "err");
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getTotalDataByCarrier(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            const connection: any = this.connection
            const companyConnection = connection[connection.company]

            let { year, month, column, carrier_scac, country_code, fuel_id } = request.body

            if (!column) {
                return generateResponse(res, 400, false, "Column required.");
            }
            const where: any = {
                [Op.and]: [
                    { is_deleted: 0 }
                ],
            }

            carrier_scac = await mapScacCountryWise({ country_code: country_code, carrier_scac: carrier_scac, companyConnection: companyConnection })

            if (carrier_scac?.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }


            const payload = [{ year: year }, { month: month }, { scac: carrier_scac }, { fuel_type: Number(fuel_id) }]

            const whereClause = await whereClauseFn(payload)

            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];
            let attr: any = await this.getAttributes(column);

            attr.push([Sequelize.literal('afc2.name'), 'name'])

            const emissionsData = await companyConnection.models.LaneAlternateFuelType.findAll({
                where: where,
                attributes: attr,
                include: [
                    {
                        model: companyConnection.models.AlternateFueltypeCarrier,
                        as: 'afc2',
                        required: false
                    }
                ],
                group: ['[afc2].[id]',
                    'afc2.image',
                    'afc2.scac',
                    'afc2.name',
                    'afc2.color'],
                having: await this.getHaving(column),
                order: [[column, 'DESC']],
                raw: true
            });

            return generateResponse(res, 200, true, "Data by carrier fetched successfully.", emissionsData);
        } catch (error) {
            console.log(error, "err")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getSchinderReport(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            const connection: any = this.connection
            const companyConnection = connection[connection.company]

            let { year, month = 0, is_intermodal = 1 } = request.body

            const where: any = {
                [Op.and]: [],
            }

            const payload = [{ year: year }, { month: month }, { is_intermodal: is_intermodal }]

            const whereClause = await whereClauseFn(payload)

            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];

            const emissionsData = await companyConnection.models.SchneiderRDReport.findAll({
                where: where,
                attributes: [
                    'month',
                    [Sequelize.fn('SUM', Sequelize.literal(`rd_gallons`)), 'rd_gallons'],
                    [Sequelize.fn('SUM', Sequelize.literal(`bio_gallons`)), 'bio_gallons']
                ],
                group: ['month'],
                order: [['month', 'ASC']],
                raw: true
            });

            if (emissionsData.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }

            const colorMapping: any = {
                'rd_gallons': '#019D52',
                'bio_gallons': '#D8856B'
            };
            const series = Object.keys(emissionsData[0])
                .filter(k => k !== 'month')
                .map(key => ({
                    name: key,
                    color: colorMapping[key] || '#000000',
                    data: emissionsData.map((item: any) => item[key] ?? 0)
                }));

            const categories = emissionsData.map((item: any) => monthsABs[item.month - 1]);

            return generateResponse(res, 200, true, "Schneider report fetched successfully.", { series, categories });
        } catch (error) {
            console.log(error, "err")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }
}

export default AlternateFuelTypeController