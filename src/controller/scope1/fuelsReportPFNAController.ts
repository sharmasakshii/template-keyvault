import { Response } from "express";
import { generateResponse } from "../../services/response";
import HttpStatusMessage from "../../constant/responseConstant";
import { Sequelize } from "sequelize";
import { MyUserRequest } from "../../interfaces/commonInterface";
import { whereClauseFn } from "../../services/commonServices";
import { convertToMillion } from "../../constant";


class FuelsReportPFNAController {
    private readonly connection: Sequelize;

    constructor(connectionData: Sequelize) {
        this.connection = connectionData;
    }

    async getFuelConsumptionReport(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const companyConnections: any = this.connection;
            const company = companyConnections.company;
            const companyModels = companyConnections[company].models;
            const { year = new Date().getFullYear(), period_id } = req.body;
            const payload = [{ year }, { period_id }];
            const where = await whereClauseFn(payload);
            const fuelConsumption = await companyModels.FuelReportPfna.findAll({
                attributes: [
                    [Sequelize.fn("SUM", Sequelize.col("frct_consumption")), "forecast_consumption"],
                    [Sequelize.fn("SUM", Sequelize.col("act_consumption")), "actual_consumption"],
                    [Sequelize.col("FuelType.name"), "name"]
                ],
                include: [
                    {
                        model: companyModels.FuelType,
                        as: "FuelType",
                        attributes: [],
                        required: false // LEFT JOIN
                    }
                ],
                where: where,
                group: ["fuel_type_id", "FuelType.name"],
                raw: true
            });
            let actualData: any = [];
            let forecastData: any = [];
            let categories: any = [];

            fuelConsumption.map((fuel: any) => {
                actualData.push(fuel.actual_consumption);
                forecastData.push(fuel.forecast_consumption);
                categories.push(fuel.name);
            })

            const responseData = {
                options: [
                    {
                        name: "Actual",
                        color: "#019d52",
                        data: actualData
                    },
                    {
                        name: "Forecast",
                        color: "#D8856B",
                        data: forecastData
                    }
                ],
                categories: categories
            };

            return generateResponse(res, 200, true, 'Fuel consumption report.', responseData);

        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }


    async getPFNAFuelsList(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const companyConnections: any = this.connection;
            const company = companyConnections.company;
            const companyModels = companyConnections[company].models;

            const fuelTypes = await companyModels.FuelReportPfna.findAll({
                attributes: [
                    [Sequelize.col("fuel_type_id"), "id"],
                    [Sequelize.col("FuelType.name"), "fuel_name"]
                ],
                include: [
                    {
                        model: companyModels.FuelType,
                        as: "FuelType",
                        attributes: [],
                        required: false
                    }
                ],
                group: ["fuel_type_id", "FuelType.name"],
                raw: true
            });

            return generateResponse(res, 200, true, 'List of all filters.', { fuelTypes });

        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getTotalEmissionsByFuelTypePFNA(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const companyConnections: any = this.connection;
            const company = companyConnections.company;
            const companyModels = companyConnections[company].models;
            const { year = new Date().getFullYear(), period_id } = req.body;
            const payload = [{ year }, { period_id }];
            const where = await whereClauseFn(payload);
            const fuelConsumption = await companyModels.FuelReportPfna.findAll({
                attributes: [
                    [Sequelize.literal(`sum(act_emissions)/${convertToMillion}`), "total_emissions"],
                    [Sequelize.col("FuelType.name"), "name"]
                ],
                include: [
                    {
                        model: companyModels.FuelType,
                        as: "FuelType",
                        attributes: [],
                        required: false // LEFT JOIN
                    }
                ],
                where: where,
                group: ["fuel_type_id", "FuelType.name"],
                raw: true
            });

            let options: any = [];
            const fuelTypes = [...new Set(fuelConsumption.map((item: any) => item.name))];

            fuelTypes.forEach((fuel) => {
                let obj: any = {
                    label: fuel
                };
                let record: any = fuelConsumption.find((item: any) => item.name === fuel);
                obj['total_emissions'] = record.total_emissions;
                options.push(obj);
            })

            const responseData = {
                options: options,
                categories: fuelTypes
            };

            return generateResponse(res, 200, true, 'Total Emissiosns by fuel type.', responseData);

        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getFuelConsumptionReportByPeriod(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const companyConnections: any = this.connection;
            const company = companyConnections.company;
            const companyModels = companyConnections[company].models;
            const { year = new Date().getFullYear(), period_id, fuel_type_id, type } = req.body;
            const payload = [{ year }, { period_id }, { fuel_type_id }];
            const where = await whereClauseFn(payload);
            let attr:any = [[Sequelize.col("pfnaPeriod.name"), "name"]];
            if(type === 'emissions'){
                attr.push([Sequelize.literal(`round(SUM(frct_emissions)/${convertToMillion}, 2)`), "forecast_value"]);
                attr.push([Sequelize.literal(`round(SUM(act_emissions)/${convertToMillion}, 2)`), "act_value"]);
            }else{
                attr.push([Sequelize.literal(`round(SUM(frct_consumption), 2)`), "forecast_value"]);
                attr.push([Sequelize.literal(`round(SUM(act_consumption), 2)`), "act_value"]);
            }
            const fuelConsumption = await companyModels.FuelReportPfna.findAll({
                attributes: attr,
                include: [
                    {
                        model: companyModels.TimePeriodScope1,
                        as: "pfnaPeriod",
                        attributes: [],
                        required: false
                    }
                ],
                where: where,
                group: ["period_id", "pfnaPeriod.name"],
                order: ["period_id"],
                raw: true
            });

            let periods: any = [];
            let actualData: any = new Array(periods.length).fill(0);
            let forecastData: any = new Array(periods.length).fill(0);
            fuelConsumption.map((period: any) => {
                periods.push(period.name);
                actualData.push(period.act_value);
                forecastData.push(period.forecast_value);
            });

            const responseData = {
                data: [
                    {
                        name: "Actual",
                        color: "#019d52",
                        data: actualData
                    },
                    {
                        name: "Forecast",
                        color: "#D8856B",
                        data: forecastData
                    }
                ],
                periods: periods
            };

            return generateResponse(res, 200, true, 'Fuel consumption report by periods.', responseData);

        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getFuelConsumptionReportByFuelTypePer(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const companyConnections: any = this.connection;
            const company = companyConnections.company;
            const companyModels = companyConnections[company].models;
            const { year = new Date().getFullYear(), period_id , type} = req.body;
    
            const payload = [{ year }, { period_id }];
            const where = await whereClauseFn(payload);
            let attr:any =  [
                [Sequelize.col("FuelType.name"), "name"],
                [Sequelize.col("FuelType.color"), "color"]
            ]
            if(type == 'emissions'){
                attr.push([Sequelize.literal(`sum(act_emissions)/${convertToMillion}`), "value"],)
            }else{
               attr.push([Sequelize.fn("SUM", Sequelize.col("act_consumption")), "value"])
            }
    
            // Fetch fuel consumption data grouped by fuel type
            const fuel = await companyModels.FuelReportPfna.findAll({
                attributes:attr,
                include: [
                    {
                        model: companyModels.FuelType,
                        as: "FuelType",
                        attributes: [],
                        required: false
                    }
                ],
                where: where,
                group: ["FuelType.name", "FuelType.color", "fuel_type_id"],
                order: ["fuel_type_id"],
                raw: true
            });
            let total = fuel.reduce(
                (acc: any, item: any) => acc + (item.value || 0),
                0
            );
            let data = fuel.map((item: any) => ({
                ...item,
                percentage: (item.value / total) * 100
            }));
    
            return generateResponse(res, 200, true, 'Fuel consumption report by fuel type.',{total, data});
    
        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

}

export default FuelsReportPFNAController;
