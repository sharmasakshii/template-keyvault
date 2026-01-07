import { raw, Response } from "express";
import { Op, Sequelize } from "sequelize";
import { MyUserRequest } from "../../interfaces/commonInterface";
import { generateResponse } from "../../services/response";
import HttpStatusMessage from "../../constant/responseConstant";
import { comapnyDbAlias } from "../../constant";
import { isCompanyEnable } from "../../utils";
import { callStoredProcedure, getConfigConstantByKey, processFuelTypeCheck } from "../../services/commonServices";
const sequelize = require('sequelize');
const axios = require('axios');

class UpdateEVlanesController {
    // Private property for the database connection (Sequelize instance)
    private readonly connection: Sequelize;

    // Constructor to initialize the database connection for each instance
    constructor(connectionData: Sequelize) {
        this.connection = connectionData; // Assign the passed Sequelize instance to the private property
    }

    private constructLatLngString(dataArray: any) {
        const latLngStringArray = dataArray.map((item: any) => `${item.dataValues.Longitude},${item.dataValues.Latitude}`);
        return latLngStringArray.join(';');
    }

    private checkDistanceValidity(legs: any, thresholdDistanceEv: any) {
        const milesDistances = legs.map((distance: any) => distance.distance / 1609.34); // converting meters to miles
        const invalidDistances = milesDistances.filter((distance: any) => distance > thresholdDistanceEv);
        if (invalidDistances.length > 0) {
            return false;
        } else {
            return true;
        }
    }

    private readonly getConfigConstantsEV = async (request: any) => {
        return await request.ConfigConstants.findAll({
            attributes: ["config_key", "config_value"],
            where: {
                config_key: "threshold_distance_ev"
            }
        });
    };

    /**
     * @description Handles the alternate K shortest path API request.
     * @param {HttpRequest} request - The HTTP request.
     * @param {InvocationContext} context - The Azure Function invocation context.
     * @returns {Promise<HttpResponseInit>} - The HTTP response initialization.
     */
    async updateEVLanes(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            const initMainDbConnection = authenticate['main'];
            let companyConnection = authenticate[authenticate.company];
            let { start, end, radius_distance } = request.body;
            let companySlug = authenticate.company;

            if (isCompanyEnable(companySlug, [comapnyDbAlias.PEP])) {
                const thresholdDistanceEv = await this.getThresholdDistanceEV(companyConnection["models"]);

                const result = await initMainDbConnection.query(
                    `EXEC [greensight_master].getRecommendedkLanesEV @threshold_distance = :threshold_distance, @start = :start, @end = :end`,
                    {
                        replacements: { threshold_distance: thresholdDistanceEv, start: start, end: end },
                        type: sequelize.QueryTypes.SELECT,
                    }
                );

                for (let obj of result) {
                    await this.processLane(obj, initMainDbConnection, radius_distance, thresholdDistanceEv);
                }
            }

            return generateResponse(res, 200, true, "Completed", {});
        } catch (error) {
            console.error(error);
            return generateResponse(
                res,
                500,
                false,
                HttpStatusMessage.INTERNAL_SERVER_ERROR
            );
        }
    }

    private async getThresholdDistanceEV(models: any): Promise<number> {
        const configData = await this.getConfigConstantsEV(models);
        const config = configData.find((item: any) => item?.dataValues?.config_key === 'threshold_distance_ev');
        return parseFloat(config?.config_value);
    }

    private async processLane(
        laneData: any,
        initMainDbConnection: any,
        radius_distance: number,
        thresholdDistanceEv: number
    ): Promise<void> {
        const coordinates = await initMainDbConnection["models"].LaneEvDistance.findAll({
            where: {
                lane_id: laneData?.lane_id,
                k_count: laneData?.k_count,
                distance: { [Op.lte]: radius_distance },
            },
        });

        if (coordinates.length > 0) {
            const latLngString = this.constructLatLngString(coordinates);
            const distanceObj = await this.fetchDistanceData(latLngString);
            const isValidLane = this.checkDistanceValidity(distanceObj?.legs, thresholdDistanceEv);

            const laneDetails = {
                lane_id: laneData?.lane_id,
                k_count: laneData?.k_count,
                is_ev: isValidLane ? 1 : 0,
                threshold_distance: thresholdDistanceEv,
            };

            await initMainDbConnection["models"].LaneEvDetails.create(laneDetails);
        }
    }

    private async fetchDistanceData(latLngString: string): Promise<any> {
        const url = `https://router.project-osrm.org/route/v1/driving/${latLngString}?overview=false`;
        try {
            const response = await axios.get(url, { maxBodyLength: Infinity });
            return response?.data?.routes[0];
        } catch (error) {
            console.error("Error fetching distance data:", error);
            return null;
        }
    }

    async checklaneIsvalid(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            let companyConnection = authenticate[authenticate.company];
            let mainConnection = authenticate['main'];

            const {
                lane_name,
                lane_id,
                k_count,
                product_type_id,
                // originCordinates,
                // destCordinates,
                thresholdDistance,
                radius
            } = request.body;

            if (!lane_id || !product_type_id || !thresholdDistance) {
                return generateResponse(res, 400, false, "Missing required parameters");
            }
            const idsArray = Array.isArray(product_type_id)
                ? product_type_id.map(Number)
                : product_type_id.split(",").map((v: any) => Number(v.trim()));

            const checkIsValidProductId = await companyConnection.models.ProductTypeAvailability.findAll({
                attributes: ["product_type_id"],
                where: {
                    product_type_id: {
                        [Op.in]: idsArray,
                    },
                },
                raw: true,
            });

            if (checkIsValidProductId?.length == 0) {
                return generateResponse(res, 400, false, "Invalid payload");
            }
            const validIds = await checkIsValidProductId.map((r: any) => r.product_type_id);

            let query = `EXEC [greensight_master].[lane_fuelstops]
                @laneid = :lane_id,
                @kcount = :k_count,
                @product_type_id = :product_type_id,
                @distance_radius = :radius`
            let replacement = {
                lane_id,
                k_count: k_count || 1,
                product_type_id: validIds.join(','),
                radius
            }
            const laneFuelStops: any[] = await callStoredProcedure(replacement, mainConnection, query);

            if (!laneFuelStops || laneFuelStops.length === 0) {
                return generateResponse(res, 404, false, "No fuel stops found for given lane");
            }

            const fuelMap: Record<string, { fuelStopCord: { latitude: number; longitude: number }[] }> = {};

            laneFuelStops.forEach((row: any) => {
                const { product_type_id, latitude, longitude } = row;
                if (!fuelMap[product_type_id]) {
                    fuelMap[product_type_id] = { fuelStopCord: [] };
                }
                fuelMap[product_type_id].fuelStopCord.push({ latitude, longitude });
            });
            const fuel_types = Object.keys(fuelMap).map((key) => ({
                fuel: key,
                fuelStopCord: [
                    ...fuelMap[key].fuelStopCord,
                ]
            }));

            const chunkValue = await getConfigConstantByKey(companyConnection.models, "coordinates_chunks");

            const results: any[] = [];
            for (const fuelObj of fuel_types) {
                const isValid = await processFuelTypeCheck(
                    fuelObj.fuelStopCord,
                    thresholdDistance,
                    parseInt(chunkValue)
                );

                results.push({
                    fuel: fuelObj.fuel,
                    isValid: isValid ? 1 : 0,
                });
            }

            return generateResponse(res, 200, true, "Lane validation completed", {
                lane_name,
                results
            });

        } catch (error) {
            console.error("Error in checklaneIsvalid:", error);
            return generateResponse(
                res,
                500,
                false,
                HttpStatusMessage.INTERNAL_SERVER_ERROR
            );
        }
    }



}

export default UpdateEVlanesController;
