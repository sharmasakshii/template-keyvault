import { Sequelize } from "sequelize";
import { MyUserRequest } from "../../../interfaces/commonInterface";
import { callStoredProcedure } from "../../../services/commonServices";
import { generateResponse } from "../../../services/response";
import HttpStatusMessage from "../../../constant/responseConstant";
import { comapnyDbAlias } from "../../../constant";
import { isCompanyEnable } from "../../../utils";



class LaneSettingController {
    private readonly connection: Sequelize;

    constructor(connectionData: Sequelize) {
        this.connection = connectionData;
    }

    async B100FuelStopLanes(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        let authenticate: any = this.connection

        try {
            if(isCompanyEnable(authenticate.company, [comapnyDbAlias.PEP, comapnyDbAlias.RBL])) {
                const { page_number, page_size, origin, destination, optimus_radius }: any = request.body
                const query = `EXEC greensight_master.GetPepsiOptimusFuelStops  @PageSize = :PageSize , 
             @PageNumber=:PageNumber, @origin=:Origin,
             @destination=:Destination,
             @threshold_distance=:threshold_distance`

            const laneListData = await callStoredProcedure({
                PageSize: page_size,
                PageNumber: page_number,
                Origin: origin,
                Destination: destination,
                threshold_distance: optimus_radius

            },  authenticate['main'], query)

                const totalDataQuery = `EXEC greensight_master.GetPepsiOptimusFuelStops @origin=:Origin, 
             @destination=:Destination,
             @threshold_distance=:threshold_distance`

                const totalLaneData = await callStoredProcedure({
                    Origin: origin,
                    Destination: destination,
                    threshold_distance: optimus_radius

                }, authenticate['main'], totalDataQuery)


                if (laneListData?.length > 0) {
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
                }
                else {
                    return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
                }
            }
            else {
                return generateResponse(res, 400, false, "You are not authorized to access this end point");
            }
        } catch (error) {
            console.log(error, "check error ");
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async getOriginDestination(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        let authenticate: any = this.connection

        try {
            let { keyword, type, source, provider_id, ev_radius }: any = request.body

            let origin = null;
            let destination = null;
            source = source || null;

            if(isCompanyEnable(authenticate.company, [comapnyDbAlias.PEP])){
                if (type.toLowerCase() === "dest") {
                    destination = keyword;
                } else {
                    origin = keyword;
                }

                let thresholdEv = ev_radius
                const query = `EXEC greensight_master.getFilterLaneNameOptimusEV @origin = :origin, @destination = :destination , @source = :source, @provider_id = :provider_id, @threshold_distance = :threshold_distance`

                const data = await callStoredProcedure({
                    origin: origin,
                    destination: destination,
                    source: source,
                    provider_id: provider_id,
                    threshold_distance: thresholdEv
                },  authenticate['main'], query)


                if (data?.length > 0) {
                    return generateResponse(res, 200, true, "optimus origin destination data.", data);
                }
                else {
                    return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
                }
            }
            else {
                return generateResponse(res, 400, false, "You are not authorized to access this end point");
            }
        } catch (error) {
            console.log(error, "check error ");
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }
}

export default LaneSettingController