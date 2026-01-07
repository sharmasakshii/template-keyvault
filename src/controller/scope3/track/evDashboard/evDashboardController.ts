import { Op, Sequelize } from "sequelize";
import { createBuffer, getDashboardMatrixDataController, getEVShipmentByDateGraphDataController, getEVTTMByDateGraphMasterController, getTruckShipmentsLaneDataContoller } from "../../../../services/evDashboardFn";
import { Response } from 'express';
import { MyUserRequest } from "../../../../interfaces/commonInterface";
import { generateResponse } from "../../../../services/response";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { fetchScacByCountry, mapScacCountryWise, paginate, whereClauseFn } from "../../../../services/commonServices";
import { convertToMillion } from "../../../../constant";

class EvDashboardController {

    private readonly connection: Sequelize;

    constructor(connectionData: Sequelize) {
        this.connection = connectionData;
    }

    async downloadCarrierDataExcel(req: MyUserRequest, res: Response): Promise<Response> {
        try {

            const connection: any = this.connection

            const { start_date, end_date, country_code } = req.body;

            let carriers = await fetchScacByCountry({ companyConnection: connection[connection.company], country_code: country_code, tableName: "EvCarriers" })

            if (carriers && carriers.length > 0) {

                const dataMatrix = await this.createDataMatrix(carriers, start_date, end_date, connection);
                // Create a workbook and convert it to a buffer
                const workbook = await createBuffer(dataMatrix);
                await workbook.writeToBuffer()

                // Set response headers for file download
                res.setHeader('Content-Disposition', 'attachment; filename="ev_report.xlsx"');
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                return res.send(await workbook.writeToBuffer());

            } else {
                // Return error response if no data is found
                return generateResponse(res, 400, false, "No Record Found!");
            }

        } catch (error) {
            console.error('Error while creating Excel document:', error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllCarriersGraphsData(req: MyUserRequest, res: Response): Promise<Response> {

        try {
            const connection: any = this.connection

            let { start_date, end_date, platform_mode, selected_scacs, country_code, is_lcv } = req.body;
            const companyConnection = connection[connection.company]

            if (!start_date) {
                return generateResponse(res, 400, false, "Start date is required");
            }
            selected_scacs = await mapScacCountryWise({ country_code: country_code, carrier_scac: selected_scacs, companyConnection: companyConnection, tableName: "EvCarriers" })

            if (selected_scacs?.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }

            const where: any = {};
            where[Op.and] = [];

            const payload = [{ is_bev: '1' }, { platform_mode: platform_mode }, { is_lcv: is_lcv }]
            if (start_date) {
                where[Op.and].push(Sequelize.literal(`date >= '${start_date}'`))
            }
            if (end_date) {
                where[Op.and].push(Sequelize.literal(`date <= '${end_date}'`));
            }
            if (selected_scacs?.length > 0) {
                where[Op.and].push({ scac: { [Op.in]: selected_scacs } });
            }
            const whereClause = await whereClauseFn(payload)
            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]]
            let getEvShipmentData = await connection[connection.company].models.EvEmissions.findAll(
                {
                    attributes: [
                        [Sequelize.literal(`round(SUM(ev_emission)/${convertToMillion},2)`), 'ev_emission'],
                        [Sequelize.literal('COUNT(shipment)'), 'total_shipment'],
                        [Sequelize.literal('round(SUM(loaded_ton_miles),2)*2'), 'kwh'],
                        [Sequelize.literal('count( DISTINCT EvEmissions.name)'), 'total_ev_lanes'],
                        [Sequelize.literal(`ROUND((SUM(ev_emission) - SUM(standard_emission)) / ${convertToMillion}, 2) * -1`), 'emissions_saved'],
                        'SCAC'
                    ],
                    where: where,
                    include: [
                        {
                            model: companyConnection.models.EvCarriers, // Add the EvCarriers model
                            attributes: ['name', 'image'], // Select name and image fields
                            as: 'carrier',
                            required: true // Ensure only records with a matching carrier are returned
                        }
                    ],
                    group: ['EvEmissions.SCAC', 'carrier.name', 'carrier.image', '[carrier].[id]'],
                    order: [['SCAC', 'asc']]
                }
            );
            if (getEvShipmentData?.length > 0) {
                return generateResponse(res, 200, true, "Ev Master dashboard all graphs data.", getEvShipmentData);
            }
            else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }
        } catch (error) {
            console.log(error, "error ")
            // Handle errors and return a 500 response in case of an error.
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getEvCarriersList(req: MyUserRequest, res: Response): Promise<Response> {

        try {
            const connection: any = this.connection
            let { country_code } = req.query

            let carriers = await fetchScacByCountry({ companyConnection: connection[connection.company], country_code: country_code, tableName: "EvCarriers" })

            if (carriers?.length > 0) {
                return generateResponse(res, 200, true, "Carriers data fetched successfully.", carriers);
            }
            return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
        } catch (error) {

            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getDashboardMatrixData(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const connection: any = this.connection
            let { start_date, end_date, platform_mode, scac, country_code } = req.body;
            const companyConnection = connection[connection.company].models

            try {
                scac = await mapScacCountryWise({ country_code: country_code, carrier_scac: scac, companyConnection: connection[connection.company], tableName: "EvCarriers" })
                if (scac?.length == 0) {
                    return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
                }
                let getEvShipmentData = await getDashboardMatrixDataController(start_date, end_date, platform_mode, scac, companyConnection);

                if (getEvShipmentData?.[0]) {
                    return generateResponse(res, 200, true, "Ev dashboard matrix.", getEvShipmentData[0]);
                }
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
            catch (err: any) {
                return generateResponse(res, 400, false, err?.message);
            }
        } catch (error) {
            console.log(error, "error ")
            // Handle errors and return a 500 response in case of an error.
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getEVShipmentByDateGraphData(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const connection: any = this.connection
            let { start_date, end_date, platform_mode, scac, country_code } = req.body;

            const companyConnection = connection[connection.company].models;

            scac = await mapScacCountryWise({ country_code: country_code, carrier_scac: scac, companyConnection: connection[connection.company], tableName: "EvCarriers" })
            if (scac?.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }
            const responseData = await getEVShipmentByDateGraphDataController(start_date, end_date, platform_mode, scac, companyConnection);
            if (responseData.length > 0) {
                return generateResponse(res, 200, true, 'Shipments data fetched.', responseData);
            } else {
                return generateResponse(res, 200, true, 'No Record Found!', []);
            }
        } catch (error) {
            console.error('Error in getEVShipmentGraphData:', error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getEVShipmentLaneList(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            const connection: any = this.connection

            let { page, page_size, start_date, end_date, platform_mode, col_name, order_by, scac, country_code } = request.body

            scac = await mapScacCountryWise({ country_code: country_code, carrier_scac: scac, companyConnection: connection[connection.company], tableName: "EvCarriers" })

            if (scac?.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }
            let page_server = (page) ? page - 1 : 1;
            let page_server_size = (page_size) ? parseInt(page_size) : 10;

            const where: any = {};
            where[Op.and] = [];

            const payload = [{ is_bev: '1' }, { scac: scac }, { platform_mode: platform_mode }]
            if (start_date) {
                where[Op.and].push(Sequelize.literal(`date >= '${start_date}'`))
            }
            if (end_date) {
                where[Op.and].push(Sequelize.literal(`date <= '${end_date}'`));
            }
            const whereClause = await whereClauseFn(payload)
            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]]

            let total_count = await connection[connection.company].models.EvEmissions.findAll({
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('name')), 'total_count']],
                where: where,
            });

            let getEvShipmentData = await connection[connection.company].models.EvEmissions.findAll(paginate({
                attributes: [
                    [Sequelize.literal('(SELECT round(SUM(ev_intensity), 2))'), 'ev_intensity'],
                    [Sequelize.literal(`(SELECT round(SUM(ev_emission)/${convertToMillion}, 2))`), 'ev_emission'],
                    [Sequelize.literal('(SELECT round(COUNT(shipment), 2))'), 'shipment'],
                    [Sequelize.literal('(SELECT round(SUM(total_ton_miles), 2))'), 'total_ton_miles'],
                    [Sequelize.literal('(SELECT round(SUM(loaded_ton_miles), 2))'), 'loaded_ton_miles'],
                    [Sequelize.literal('(SELECT round(SUM(loaded_ton_miles), 2) * 2)'), 'total_hours'],
                    'name', 'origin', 'destination'
                ],
                where: where,
                group: ['name', 'origin', 'destination'],
                order: [[col_name, order_by || "desc"]],
            }, {
                page: page_server,
                pageSize: page_server_size
            }));

            if (getEvShipmentData?.length > 0) {
                let data = {
                    responseData: getEvShipmentData,
                    pagination: {
                        page: page_server,
                        page_size: page_server_size,
                        total_count: total_count.length,
                    }
                };
                return generateResponse(res, 200, true, "Shipments data fetched.", data);
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }
        } catch (error) {
            console.log(error, "error ")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getEVTTMGraphByDateMaster(request: MyUserRequest, res: Response): Promise<Response> {
        try {

            const connection: any = this.connection
            let { start_date, end_date, selected_scacs, country_code } = request.body

            const companyConnection = connection[connection.company].models;

            selected_scacs = await mapScacCountryWise({ country_code: country_code, carrier_scac: selected_scacs, companyConnection: connection[connection.company], tableName: "EvCarriers" })
            if (selected_scacs?.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }
            const responseData = await getEVTTMByDateGraphMasterController(start_date, end_date, selected_scacs, companyConnection);

            return generateResponse(res, 200, true, 'Total Ton Miles fetched.', responseData);

        } catch (error) {
            console.error('Error in getEVShipmentGraphData:', error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getTruckShipmentsLaneData(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            const connection: any = this.connection
            let { start_date, end_date, scac, country_code } = request.body;

            if (!start_date) {
                return generateResponse(res, 400, false, "Start date is required");
            }
            scac = await mapScacCountryWise({ country_code: country_code, carrier_scac: scac, companyConnection: connection[connection.company], tableName: "EvCarriers" })

            if (scac?.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }
            let getEvShipmentData = await getTruckShipmentsLaneDataContoller(start_date, end_date, scac, connection);
            if (getEvShipmentData?.length > 0) {
                return generateResponse(res, 200, true, "Ev shipment lane data.", getEvShipmentData);
            }
            else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }
        } catch (error) {
            console.log(error, "error ")
            // Handle errors and return a 500 response in case of an error.
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async filterEmissionDatesEv(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            const connection: any = this.connection
            let scac = request.query.scac
            let country_code = request.query.country_code
            const companyConnection = connection[connection.company].models

            scac = await mapScacCountryWise({ country_code: country_code, carrier_scac: scac, companyConnection: connection[connection.company], tableName: "EvCarriers" })

            if (scac?.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }

            let where = (scac) ? { "scac": scac } : {};
            let attributes = [[Sequelize.literal('( SELECT MIN(date) )'), 'start_date'], [Sequelize.literal('( SELECT MAX(date) )'), 'end_date']];
            let dateData = await companyConnection.EvEmissions.findAll({
                attributes: attributes,
                where: where,
            });
            if (dateData?.length > 0) {
                let obj = {
                    start_date: dateData[0]?.dataValues?.start_date || null,
                    end_date: dateData[0]?.dataValues?.end_date || null,
                    scac
                }
                return generateResponse(res, 200, true, "User Filter Dates.", obj);
            }
            else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
        } catch (error) {
            console.log(error, "error ")
            // Handle errors and return a 500 response in case of an error.
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    private async createDataMatrix(scacObject: any, start_date: any, end_date: any, connection: any) {
        try {
            const companyConnection = connection[connection.company].models;
            let data: any = {};
            const scacValues = scacObject.map((item: any) => item.scac);
            const [matrics, datewiseShipment, lanewiseShipment] = await Promise.all([
                getDashboardMatrixDataController(start_date, end_date, '', scacValues, companyConnection),
                getEVShipmentByDateGraphDataController(start_date, end_date, '', scacValues, companyConnection),
                getTruckShipmentsLaneDataContoller(start_date, end_date, scacValues, connection),
            ]);

            for (const prop of scacObject) {
                data[prop.scac] = {
                    date: {
                        'start date': start_date,
                        'end date': end_date,
                    },
                    'matrics': matrics.find((el: any) => el?.scac === prop?.scac) || {},
                    'Datewise Shipment': datewiseShipment.filter((item: any) => item.scac === prop?.scac),
                    'Lanewise Shipment': lanewiseShipment.filter((item: any) => item.scac === prop?.scac),
                }
            }
            return data;
        } catch (error) {
            console.log('error', error);
        }
    }

}

export default EvDashboardController