import { Response } from "express";
import { Sequelize } from "sequelize";
import { MyUserRequest } from "../../interfaces/commonInterface";
import { generateResponse } from "../../services/response";
import HttpStatusMessage from "../../constant/responseConstant";
import { isCompanyEnable } from "../../utils";
import { comapnyDbAlias } from "../../constant";
const sequelize = require('sequelize');

class FuelLocationsController {
    // Private property for the database connection (Sequelize instance)
    private readonly connection: Sequelize;

    // Constructor to initialize the database connection for each instance
    constructor(connectionData: Sequelize) {
        this.connection = connectionData; // Assign the passed Sequelize instance to the private property
    }

    // API handler function
    async getFuelStopProviders(
        _request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            let authenticate: any = this.connection;

            const companySlug = authenticate['company'];

            if (!isCompanyEnable(companySlug, [comapnyDbAlias.PEP])) {
                return generateResponse(res, 403, false, "You don't have access for this route.");
            }

            // Fetch the fuel stop providers where filter equals 1
            const fuelStopProviders = await authenticate['main'].models.ProductType.findAll({
                attributes: ['id', 'name', 'code'], // Select only name and description
                where: {
                    is_filterable: 1
                },
            });

            // If no data found, return an appropriate response
            if (!fuelStopProviders || fuelStopProviders.length === 0) {
                return generateResponse(res, 200, true, "No fuel stop providers found.", []);
            }

            return generateResponse(res, 200, true, "All providers.", fuelStopProviders);
        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getFuelStopProvidersList(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            let authenticate: any = this.connection;

            const companySlug = authenticate['company'];

            if (!isCompanyEnable(companySlug, [comapnyDbAlias.PEP])) {
                return generateResponse(res, 403, false, "You don't have access for this route.");
            }

            let { productTypeIds }: any = request.body;

            let query = `EXEC [greensight_master].[getFuelStops]
            @productTypeIDs = :productTypeID`

            const getFuelStops = await authenticate["main"].query(
                query,
                {
                    replacements: {
                        productTypeID: productTypeIds.join()
                    },
                    type: sequelize.QueryTypes.SELECT,
                }
            );
            return generateResponse(res, 200, true, "All providers.", getFuelStops);
        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

}

export default FuelLocationsController;
