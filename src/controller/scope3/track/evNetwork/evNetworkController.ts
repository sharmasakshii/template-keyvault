import { Sequelize } from "sequelize";
import { MyUserRequest } from "../../../../interfaces/commonInterface";
import { comapnyDbAlias } from "../../../../constant";
import { generateResponse } from "../../../../services/response";
import HttpStatusMessage from "../../../../constant/responseConstant";
import { isCompanyEnable } from "../../../../utils";

const sequelize = require("sequelize");

class EvNetworkController {
    // Private property for the database connection (Sequelize instance)
    private readonly connection: Sequelize;

    // Constructor to initialize the database connection for each instance
    constructor(connectionData: Sequelize) {
        this.connection = connectionData; // Assign the passed Sequelize instance to the private property
    }

    async evNetworkFuelStopLanes(req: MyUserRequest, res: Response): Promise<Response> {
        try {

            const connection: any = this.connection

            if (!isCompanyEnable(connection.company, [comapnyDbAlias.PEP])) {
                return generateResponse(res, 400, false, "You are not authorized to access this end point");
            }

            // Extract container name and other parameters from the request

            const { page_number, page_size, origin, destination, ev_radius } = req.body

            let thresholdEv = ev_radius
            const laneListData = await connection["main"].query(`
            EXEC greensight_master.GetPepsiEVFuelStops  @PageSize = :PageSize , @PageNumber=:PageNumber, @origin=:Origin, @destination=:Destination, @threshold_distance=:threshold_distance`, {
                replacements: {
                    PageSize: page_size,
                    PageNumber: page_number,
                    Origin: origin,
                    Destination: destination,
                    threshold_distance: thresholdEv
                },
                type: sequelize.QueryTypes.SELECT,
            });
            const totalLaneData = await connection["main"].query(`
            EXEC greensight_master.GetPepsiEVFuelStops @origin=:Origin, @destination=:Destination,  @threshold_distance=:threshold_distance`, {
                replacements: {
                    Origin: origin,
                    Destination: destination,
                    threshold_distance: thresholdEv
                },
                type: sequelize.QueryTypes.SELECT,
            });

            if (laneListData?.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }

            const separatedData = laneListData.map((item: any) => {
                const [origin, destination] = item.name.split('_');
                return {
                    origin,
                    destination,
                    distance: item?.distance,
                    id: item.id
                };
            });
            const result = {
                data: separatedData,
                pagination: {
                    page: page_number,
                    page_size: page_size,
                    total: totalLaneData?.length
                }
            }
            return generateResponse(res, 200, true, "optimus fuel stop lanes data", result);


        } catch (error) {
            console.log(error, " error ");
            // Handle errors and return a 500 response in case of an error.
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @description Function to EV Locations 
     * @param {HttpRequest} request 
     * @returns {Promise} Returns the json for ev locations
     */

    async getEvLocations(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            if (!isCompanyEnable(authenticate.company, [comapnyDbAlias.PEP])) {
                return generateResponse(res, 400, false, "You are not authorized to access this end point");
            }
            let getEvLocations = await authenticate[authenticate.company].models.EvLocations.findAll();



            //check password is matched or not then exec
            if (getEvLocations?.length > 0) {
                return generateResponse(res, 200, true, "Ev Locations Data.", getEvLocations);
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }
        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

}

export default EvNetworkController