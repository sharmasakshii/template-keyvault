import sequelize, { Sequelize, Op } from "sequelize";
import { MyUserRequest } from "../../../interfaces/commonInterface";
import { generateResponse } from "../../../services/response";
import HttpStatusMessage from "../../../constant/responseConstant";
import { blobMove, chunkArray, chunkToSize, createBufferSingle, getBidFileCount, isCompanyEnable, parseExcelTabsToJSON, parseTabsData, saveErrorOfBidPlanning, sendLogicAppRequest, timeAlgo } from "../../../utils";
import { blobConnection } from "../../../BlobService/helper";
import { callStoredProcedure, getConfigConstants, getLaneDistance, getTotalLanes, getTotalNewLanes, paginate, whereClauseFn, validator } from "../../../services/commonServices";
import { comapnyDbAlias } from "../../../constant";
import { dbConst } from "../../../connectionDb/dbconst";
const archiveDirectory = 'Archive/';
const logicAppUrl: any = process.env.LOGIC_APP_URL;
const logicCookie: any = process.env.LOGIC_COOKIE;
import { BlobServiceClient } from "@azure/storage-blob";

type CompanyKeys = 'lowes' | 'pepsi' | 'adm' | 'tql' | 'generic' | 'redbull';

class BidPlanningController {
    // Private property for the database connection (Sequelize instance)
    private readonly connection: Sequelize;

    // Constructor to initialize the database connection for each instance
    constructor(connectionData: Sequelize) {
        this.connection = connectionData; // Assign the passed Sequelize instance to the private property
    }

    /**
* @description Function to get the all bid file distinct cities
* @param {HttpRequest} request 
* @returns {Promise} Returns the list of all bid file distinct cities
*/
    async getScacList(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const connection: any = this.connection
            const companyConnection = connection[connection.company].models

            let { keyword, page_limit, file_id } = req.body;
            const where: any = {};
            where[Op.and] = [];
            where[Op.and].push({ is_error: 0 })
            if (file_id) {
                where[Op.and].push({ file_id: file_id })
            }

            if (keyword) {
                where[Op.and].push({ 'scac': { [Op.like]: `%${keyword}%` } })
            }

            const bidFileData = await companyConnection.BidImport.findAll({
                attributes: [[sequelize.fn('DISTINCT', sequelize.literal(`scac`)), "scac"]],
                where: where,
                order: ["scac"],
                limit: parseInt(page_limit),
            });

            if (bidFileData && bidFileData.length > 0) {
                return generateResponse(res, 200, true, "Bid file cities.", bidFileData);
            } else { return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND) }
        }
        catch (error) {
            console.error(error);
            // Handle errors and return a 500 response in case of an error.
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    };

    /**
 * @description Function to get the all bid file distinct cities
 * @param {HttpRequest} request 
 * @returns {Promise} Returns the list of all bid file distinct cities
 */
    async searchBidFileLaneOriginDest(req: MyUserRequest, res: Response): Promise<Response> {
        try {
            const connection: any = this.connection
            const companyConnection = connection[connection.company].models
            let { keyword, page_limit, type, source, dest, file_id } = req.body;
            let attr = []

            if (type.toLowerCase() === "dest") {
                attr = [
                    [sequelize.fn('DISTINCT', sequelize.literal(`SUBSTRING([BidImport].[lane_name], CHARINDEX('_', [BidImport].[lane_name]) + 1, LEN([BidImport].[lane_name]))`)), type.toLowerCase()]
                ];
            } else {
                attr = [
                    [sequelize.fn('DISTINCT', sequelize.literal(`SUBSTRING([BidImport].[lane_name], 1, CHARINDEX('_', [BidImport].[lane_name]) - 1)`)), type.toLowerCase()]
                ];
            }

            let params = {
                file_id, source, dest, type, keyword
            }
            let where = await this.whereClauseFunction(params);

            const bidFileData = await companyConnection.BidImport.findAll({
                attributes: attr,
                where: where,
                order: [type.toLowerCase()],
                limit: parseInt(page_limit),
            });


            if (bidFileData && bidFileData.length > 0) {
                return generateResponse(res, 200, true, "Bid file cities.", bidFileData);
            } else { return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []) }
        }
        catch (error) {
            console.error(error);
            // Handle errors and return a 500 response in case of an error.
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    };

    async whereClauseFunction(params: any) {
        let {
            file_id, source, dest, type,
            keyword
        } = params;
        const where: any = {}
        where[Op.and] = [];
        where[Op.and].push({ is_error: 0 })
        if (file_id) {
            where[Op.and].push({ file_id: file_id })
        }
        //when searching on origin without destination
        if (type.toLowerCase() == "origin" && keyword && !dest && !source) {
            where[Op.and].push({ 'lane_name': { [Op.like]: `${keyword}%` } })
        }
        //when selecting on origin then, gives destionation 
        else if (type.toLowerCase() == "dest" && source && !keyword && !dest) {
            where[Op.and].push({ 'lane_name': { [Op.like]: `${source}_%` } })
        }
        //when searching on dest after selecting origin then , give dest
        else if (type.toLowerCase() == "dest" && source && keyword && !dest) {
            where[Op.and].push({ 'lane_name': { [Op.like]: `${source}_%${keyword}%` } })
        }
        //searching dest without selecting origin , then gives destination 
        else if (type.toLowerCase() == "dest" && keyword && !dest && !source) {
            //processer
            where[Op.and].push({ 'lane_name': { [Op.like]: `%_${keyword}%` } })
        }
        //when selecting destination dropdown then , give origin 
        else if (type.toLowerCase() == "origin" && !source && !keyword && dest) {
            where[Op.and].push({ 'lane_name': { [Op.like]: `%_${dest}` } })
        }
        //when searching on origin after selecting dest then , give origin
        else if (type.toLowerCase() == "origin" && !source && keyword && dest) {
            where[Op.and].push({ 'lane_name': { [Op.like]: `%${keyword}%_${dest}` } })
        }
        return where
    }

    async uploadBidFile(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            const connection: any = this.connection
            const companyConnection = connection[connection.company];

            const {
                name,
                base_path,
                statusId,
            } = request.body;
            const loggenInUser = connection['userData'];
            const uploadedBidFile = await companyConnection['models'].BidManagement.create({
                name: name,
                base_path: base_path,
                user_id: loggenInUser.id,
                type: "bid",
                is_deleted: 0,
                status_id: statusId
            });
            return generateResponse(
                res,
                200,
                true,
                "File uploaded sucessfully.",
                uploadedBidFile
            );
        }
        catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    };

    /**
 * @description Function to get the all bid files
 * @param {HttpRequest} request
 * @returns {Promise} Returns the list of all files
 */
    async getBidDetail(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            const { file_id } = request.body;
            const companyConnection = authenticate[authenticate['company']];
            let fileDetail = await companyConnection.models.BidManagement.findOne(
                {

                    where: {
                        id: file_id
                    },
                    include: [
                        {
                            model: companyConnection.models.BidFileStatus,
                            attributes: ['status_name', 'id'],
                            as: "status"
                        },
                        {
                            model: companyConnection.models.GetUserDetails,
                            attributes: ['user_id', 'user_name'],
                            as: "user"
                        },
                        {
                            model: companyConnection.models.BidErrorLog,
                            attributes: ['error_message', 'status_id'],
                            limit: 1,
                            order: [['created_on', 'DESC']],
                            as: "bidError"
                        },
                        {
                            model: companyConnection.models.BidProcessing,
                            as: "processing"
                        }
                    ],
                }
            );

            if (fileDetail) {
                return generateResponse(res, 200, true, "File detail fetched.", { 'file_detail': fileDetail });
            }
            return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, { 'file_detail': [] });
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


    /**
     * Azure function to fetch bid details.
     * @param {object} request - The HTTP request object.
     * @returns {object} - The Sequelize connection object.
     */
    async checkProcessStatus(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            const { fileId } = request.body;

            const companyConnection = authenticate[authenticate['company']];
            const bidData = await companyConnection.models.BidManagement.findOne({
                where: { id: fileId },
                include: [
                    {
                        model: companyConnection.models.BidProcessing,
                        "as": "processing"
                    }
                ],
            });
            const responseData = await getBidFileCount(companyConnection, fileId);
            responseData.status = bidData?.dataValues.status_id;
            responseData.data = bidData;
            return generateResponse(res, 200, true, "Bid Lanes Data", responseData);
        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    /**
   * Azure function to fetch bid details.
   * @param {object} request - The HTTP request object.
   * @returns {object} - The Sequelize connection object.
   */
    async fetchBidDetail(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            const { file_id } = request.body;

            const companyConnection = authenticate[authenticate['company']];
            let getBidDetails = await companyConnection.models.BidImport.findAll({
                attributes: [
                    [sequelize.literal('COUNT(DISTINCT lane_name)'), 'lane_count'],
                    [sequelize.literal('COUNT(DISTINCT scac)'), 'carrier_count'],
                    [sequelize.literal('COUNT(id)'), 'total_count']],
                where: { file_id: file_id }
            });

            if (getBidDetails.length > 0) {
                return generateResponse(res, 200, true, "Bid Details Data", { bid_detail: getBidDetails[0] });
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    /**
   * @description Azure function to delete Multiple bid file.
   * @param {*} res
   * @version V.1
   * @returns 
   */
    async deleteMiltipleBidFile(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            const { file_id } = request.body;
            let { containerClient }: any = await blobConnection(authenticate);
            const fileIdArray = [];
            const fileErrors = [];
            const fileNameArray = [];
            for (const property of file_id) {
                if (property.is_movable == 0) {
                    fileIdArray.push(property.id);
                    continue;
                }
                try {
                    const d = new Date();
                    let time = d.getTime();
                    let fileArray = property.name.split('.');
                    let blobNameTo = `${archiveDirectory}${fileArray[0]}-${time}.${fileArray[1]}`;
                    // Delete a specific file
                    let destinationFile = (property.base_path == "/" ? `${property.name}` : `${property.base_path}/${property.name}`)
                    const blobClient = containerClient.getBlobClient(destinationFile);
                    //Move file to Archive
                    const newBlobClient = containerClient.getBlobClient(blobNameTo);
                    let blobMoveResponse = await blobMove(blobClient, newBlobClient);
                    if (blobMoveResponse.status == 400) {
                        fileErrors.push({ file_id: property.id, error: blobMoveResponse });
                    } else {
                        await blobClient.delete();
                        fileIdArray.push(property.id);
                        fileNameArray.push(property.name);
                    }
                } catch (error) {
                    fileIdArray.push(property.id);
                    fileNameArray.push(property.name);
                    fileErrors.push({ file_id: property.id, error: error });
                }
            }
            let file = await authenticate[authenticate.company].models.BidManagement.update({ is_deleted: 1 }, {
                where: {
                    id: fileIdArray
                }
            });

            if (!file) {
                return generateResponse(res, 200, false, "File Not Found!");
            }
            await authenticate[authenticate.company].models.BidImport.destroy({
                where: {
                    file_name: fileNameArray
                },
            });
            await authenticate[authenticate.company].models.BidProcessing.destroy({
                where: {
                    file_name: fileNameArray
                },
            });
            return generateResponse(res, 200, true, `Files deleted successfully.`, fileErrors);


        } catch (error) {
            console.error(error);
            // Handle errors and return a 500 response in case of an error.
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    };

    /**
     * @description Function to get the all bid files
     * @param {HttpRequest} request
     * @returns {Promise} Returns the list of all files
     */
    async processLogicApp(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            const companyConnection = authenticate[authenticate['company']];
            const masterConnection = authenticate.main;
            let companyData = await masterConnection.models.Company.findOne({
                attributes: ['id', 'slug'],
                where: {
                    slug: authenticate.userData['companies'][0].slug
                },
            });

            const { file_id } = request.body;

            let statusCount = await this.checkForCurrentProcess(companyConnection);
            if (statusCount) {
                return generateResponse(res, 400, false, `File ${statusCount.dataValues.name} is under proccessing.`);
            }

            await companyConnection.models.BidLanes.update({ is_error: 0 }, {
                where: { file_id: file_id }
            });

            await companyConnection.models.BidManagement.findOne({ where: { id: file_id, is_deleted: 0 } }).then(
                async function (obj: { update: (arg0: { [x: string]: any }) => any }) {
                    if (obj) return await obj.update({ status_id: 7 });
                }
            );
            let configData = await getConfigConstants(companyConnection.models);
            let chunkLength = configData.find((item: any) => item?.dataValues?.config_key === 'BID_LANE_CHUNK_SIZE')?.config_value;
            let token: any = request.cookies.token;
            let bidLanes = await companyConnection.models.BidLanes.findAll({
                attributes: ['id', 'lane_name'],
                where: {
                    file_id: file_id,
                    distance: {
                        [Op.eq]: null
                    },
                    is_processed: 0
                },
                order: [['id', 'ASC']],
            });
            if (bidLanes.length > 0) {
                let bidData = [];
                for (let prop of bidLanes) {
                    let split = prop.lane_name.split("_");
                    bidData.push({
                        "origin": split[0],
                        "destination": split[1],
                        "origin_latitude": 0,
                        "origin_longitude": 0,
                        "destination_latitude": 0,
                        "destination_longitude": 0,
                        "record_id": prop.id,
                        "company_id": companyData.dataValues.id
                    });
                }

                let chunkData = chunkToSize(bidData, chunkLength);
                for (const prop of chunkData) {
                    let data = JSON.stringify({
                        "file_id": file_id,
                        "token": token,
                        "data": prop
                    });
                    sendLogicAppRequest(data, logicAppUrl, logicCookie);
                }
            }
            return generateResponse(res, 200, true, "File is processing.", { 'bidLanes': bidLanes.length });
        } catch (error) {
            console.error(error);
            return generateResponse(res,
                500,
                false,
                HttpStatusMessage.INTERNAL_SERVER_ERROR
            );
        }
    }

    async checkForCurrentProcess(companyConnection: any) {
        return await companyConnection.models.BidManagement.findOne({
            where: {
                [Op.or]: [
                    {
                        status_id: 7
                    },
                    {
                        status_id: 6
                    }
                ], is_deleted: 0
            }
        });
    }

    /**
 * @description Function to get the all bid files
 * @param {HttpRequest} request 
 * @returns {Promise} Returns the list of all files
 */
    async getAllBidFileErrorRows(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            const companyConnection = authenticate[authenticate['company']];
            const { page_size, page, fileName, search } = request.body;
            let page_server = page ? parseInt(page) - 1 : 0;
            let where: any = {};
            where[Op.and] = [{ is_error: 1 }];

            if (fileName) {
                where[Op.and].push({ file_name: fileName })
            }
            if (search) {
                where[Op.and].push({
                    file_name: {
                        [Op.like]: `%${search}%`
                    }
                })
            }

            let getAllErrorRows = await companyConnection.models.BidImport.findAll(
                {
                    where: where
                }
            );
            const getErrorRows = await companyConnection.models.BidImport.findAll(
                paginate(
                    {
                        attributes: ["id", "lane_name", "scac", "error_message", "is_error", "row_number", "tab_name"],
                        where: where
                    },
                    {
                        page: page_server,
                        pageSize: page_size,
                    }
                )
            );
            if (getErrorRows.length > 0) {
                let data = {
                    data: getErrorRows,
                    pagination: {
                        page: page,
                        page_size: page_size,
                        total_count: getAllErrorRows.length,
                    }
                }
                return generateResponse(res, 200, true, "List of Bid Files.", data);
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    };

    async bidOutputDetail(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            const companyConnection = authenticate[authenticate['company']];
            const schema = authenticate.schema;
            const { file_name, file_id } = request.body;
            let minBidImportQuery = `Select SUM(min_impact.value) as emission_impact,SUM(bi.cost_impact_value) as cost_impact
      FROM 
          [${schema}].[bid_import] bi join
  (SELECT lane_name, min(emission_impact_value) as value
    FROM [${schema}].[bid_import] where file_id =${file_id}
    group by lane_name)  min_impact
      ON bi.lane_name = min_impact.lane_name 
      AND bi.emission_impact_value = min_impact.value
      where file_id =${file_id}`;
            const bidImportDetail = await companyConnection.query(minBidImportQuery);

            let topBidLanes = await companyConnection.models.BidImport.findAll({
                attributes: ['lane_name', 'fuel_type', [sequelize.literal('MIN(emission_impact)'), 'emission_impact']],
                where: {
                    file_id: file_id,
                    [Op.and]: [
                        {
                            fuel_type: {
                                [Op.ne]: 'N/A'
                            }
                        },
                        {
                            fuel_type: {
                                [Op.ne]: null
                            }
                        }
                    ],
                    [Op.or]: [
                        {
                            fuel_type: {
                                [Op.like]: '%B20%'
                            }
                        },
                        isCompanyEnable(authenticate.company, [comapnyDbAlias.GEN]) && {
                            fuel_type: {
                                [Op.like]: '%B99%'
                            }
                        },
                        isCompanyEnable(authenticate.company, [comapnyDbAlias.PEP]) && {
                            fuel_type: {
                                [Op.like]: '%EV%'
                            }
                        },
                        isCompanyEnable(authenticate.company, [comapnyDbAlias.PEP]) && {
                            fuel_type: {
                                [Op.like]: '%HVO%'
                            }
                        },
                        isCompanyEnable(authenticate.company, [comapnyDbAlias.PEP]) && {
                            fuel_type: {
                                [Op.like]: '%OPTIMUS%'
                            }
                        },
                    ]
                },
                group: ['lane_name', 'fuel_type'],
                order: [['emission_impact', 'ASC']],
                limit: 5
            });
            if (bidImportDetail.length > 0) {
                let laneMatrix = await this.calcultelaneMatrix(bidImportDetail);
                return generateResponse(res, 200, true, "Bid details fetched.", { 'bid_details': laneMatrix, 'bid_lanes': topBidLanes, 'file_name': file_name });
            }
            return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
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

    private async calcultelaneMatrix(laneData: any) {
        try {
            let bidData = laneData[0][0] || null;
            let emission = bidData.emission_impact || 0;
            let cost = bidData.cost_impact || 0;
            return {
                emissions: {
                    value: Math.abs(emission),
                    sign: Math.sign(emission) == -1 ? 'down' : 'up'
                },
                rpm: {
                    value: Math.abs(cost) / (Math.abs(emission)),
                    sign: Math.sign(cost / (emission)) == -1 ? 'down' : 'up'
                },
                cost_impact: {
                    value: Math.floor(Math.abs(cost)),
                    sign: Math.sign(cost) == -1 ? 'down' : 'up'
                },
                unit: 'tco2e'
            };

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
   * @description Function to get the all bid file lanes
   * @param {HttpRequest} request 
   * @returns {Promise} Returns the list of all bid file lanes
   */
    async getBidFileOutputTable(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            const companyConnection = authenticate[authenticate['company']];
            const { page_size, page, file_id, scac, origin, dest } =
                request.body;
            let page_server = page ? parseInt(page) - 1 : 0;

            const where: any = {};
            where[Op.and] = [{ is_error: 0 }]
            const payload = [{ file_id: file_id }, { scac: scac }]

            const whereClause = await whereClauseFn(payload)

            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];


            if (origin && dest) {
                where[Op.and].push({ lane_name: `${origin}_${dest}` })
            } else if (origin && !dest) {
                where[Op.and].push({
                    lane_name: {
                        [Op.like]: `${origin}_%`
                    }
                });
            } else if (!origin && dest) {
                where[Op.and].push({
                    lane_name: {
                        [Op.like]: `%_${dest}`
                    }
                });
            }

            const uploadedBidFile = await companyConnection.models.BidManagement.findOne(
                {
                    where: {
                        id: file_id
                    }
                }
            );

            let getAllFiles = await companyConnection.models.BidImport.count({ where: where });

            const getAllFilesP = await companyConnection.models.BidImport.findAll(
                paginate(
                    {
                        attributes: [
                            "id",
                            "lane_name",
                            "scac",
                            "rpm",
                            "distance",
                            "intensity",
                            "emissions",
                            "cost_impact",
                            "emission_impact",
                            "file_name",
                            "tab_name",
                            [sequelize.literal(`REPLACE(REPLACE([fuel_type], 'b100', 'B100'), 'b1_20', 'Upto B20')`), 'fuel_type'],
                            "is_error",
                            "error_message",
                            "file_id"
                        ],
                        order: [
                            ["lane_name", "ASC"]
                        ],
                        where: where,
                    },
                    {
                        page: page_server,
                        pageSize: page_size,
                    }
                )
            );
            if (!getAllFilesP.length) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
            let data = {
                uploadedBidFile: uploadedBidFile,
                data: getAllFilesP,
                pagination: {
                    page: page,
                    page_size: page_size,
                    total_count: getAllFiles,
                },
                total: getAllFiles
            }
            return generateResponse(res, 200, true, "List of Bid File lanes.", data);
        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    };

    /**
 * @description Function to download the filter data of bid file.
 * @param {string} request
 * @returns {Promise} Returns the confirmation method of successfull upload.
 */
    async downloadBidFilterData(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            let company: CompanyKeys = authenticate["company"];
            const companyConnection = authenticate[company];
            let dir = "filterDownloads";

            const { file_name, file_id, scac, origin, dest } = request.body;

            if (!file_id) {
                return generateResponse(res, 422, true, "File not specified!");
            }

            const where: any = {};
            where[Op.and] = [{ is_error: 0 }]
            const payload = [{ file_id: file_id }, { scac: scac }]

            const whereClause = await whereClauseFn(payload)

            where[Op.and] = [...where[Op.and], ...whereClause[Op.and]];

            if (origin && dest) {
                where[Op.and].push({ lane_name: `${origin}_${dest}` });
            } else if (origin && !dest) {
                where[Op.and].push({
                    lane_name: {
                        [Op.like]: `${origin}_%`,
                    },
                });
            } else if (!origin && dest) {
                where[Op.and].push({
                    lane_name: {
                        [Op.like]: `%_${dest}`,
                    },
                });
            }

            const fileName = `${Date.now()}_${file_name}`;
            const blobName = `${dir}/${fileName}`;
            // Extract the image binary data from the request body
            const bidData = await companyConnection["models"].BidImport.findAll({
                attributes: [
                    "lane_name",
                    "scac",
                    "rpm",
                    "distance",
                    "intensity",
                    "emissions",
                    "cost_impact",
                    "emission_impact",
                    "tab_name",
                    "fuel_type",
                ], order: [
                    ["lane_name", "ASC"]
                ],
                where: where,
                raw: true,
            });
            const createData = bidData;
            const mappedData = await this.mapHeaders(createData);
            const excelBuffer: any = await createBufferSingle(mappedData);
            const containerName = dbConst[company].bucketName;
            const connectionString: any = process.env.AZURE_STORAGE_CONNECTION_STRING

            const blobService: any = BlobServiceClient.fromConnectionString(connectionString);

            const containerClient = await blobService.getContainerClient(containerName);
            const blockBlobClient = await containerClient.getBlockBlobClient(blobName);

            await blockBlobClient.uploadData(excelBuffer);
            return generateResponse(res, 200, true, "File Uploaded Successfully.", {
                fileName: fileName,
                folderPath: blobName,
                status: 1
            });
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

    private async mapHeaders(data: any) {
        return data.map((item: any) => {
            const mappedItem = {
                "Lane Name": item.lane_name,
                "Carrier_SCAC": item.scac,
                "Rate Per Mile ($)": item.rpm,
                "Distance_miles": item.distance,
                "Emission_intensity(gCO2e/Ton-Mile of freight)": item.intensity,
                "Emissions (tCO2e)": item.emissions,
                "Cost_impact(%)": item.cost_impact,
                "Emission_impact(%)": item.emission_impact,
                "Alternate_fuels": item.fuel_type,
            };
            return mappedItem;
        });
    };

    /**
   * @description Function to get the all bid files
   * @param {HttpRequest} request 
   * @returns {Promise} Returns the list of all files
   */
    async getAllBidFiles(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            let company: CompanyKeys = authenticate["company"];
            const companyConnection = authenticate[company];
            const { page_size, page, name, search, status_id, order_by } =
                request.body;
            let page_server = page ? parseInt(page) - 1 : 0;
            let where: any = {};
            where[Op.and] = [{ is_deleted: 0 }];

            if (name) {
                where[Op.and].push({ name: name })
            }
            if (search) {
                where[Op.and].push({
                    name: {
                        [Op.like]: `%${search}%`
                    }
                })
            }

            if (status_id) {
                where[Op.and].push({ status_id: status_id })
            }
            let getAllFiles = await companyConnection.models.BidManagement.findAll({ where: where });
            let getAllFileCount = await companyConnection.models.BidManagement.count({ where: { 'is_deleted': 0 } });
            const getAllFilesP = await companyConnection.models.BidManagement.findAll(
                paginate(
                    {
                        order: [
                            ["created_on", order_by || "DESC"]
                        ],
                        where: where,
                        include: [
                            {
                                model: companyConnection.models.BidFileStatus,
                                attributes: ['status_name', 'id'],
                                "as": "status"
                            },
                            {
                                model: companyConnection.models.GetUserDetails,
                                attributes: ['user_id', 'user_name'],
                                "as": "user"
                            },
                            {
                                model: companyConnection.models.BidErrorLog,
                                attributes: ['error_message', 'status_id'],
                                limit: 1, // Limit the result to one entry
                                order: [['created_on', 'DESC']],
                                "as": "bidError"
                            },
                            {
                                model: companyConnection.models.BidProcessing,
                                "as": "processing"
                            }
                        ],
                    },
                    {
                        page: page_server,
                        pageSize: page_size,
                    }
                )
            );
            if (getAllFiles.length > 0) {
                let data = {
                    data: getAllFilesP,
                    pagination: {
                        page: page,
                        page_size: page_size,
                        total_count: getAllFiles.length,
                    },
                    total: getAllFileCount
                }
                return generateResponse(res, 200, true, "List of Bid Files.", data);
            }
            return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
        } catch (error) {
            console.error("error ", error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    };

    async getAllBidStatus(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            let company: CompanyKeys = authenticate["company"];
            const companyConnection = authenticate[company];
            let where: any = {};
            where[Op.and] = [{ is_deleted: 0 }];

            let getAllStatus = await companyConnection.models.BidFileStatus.findAll({ where: where });

            if (getAllStatus.length > 0) {
                return generateResponse(res, 200, true, "List of Bid Files.", getAllStatus);
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    };


    /**
 * @description API to save bid files data from blob.
 * @param {name,base_path} req
 * @version V.1
 * @returns
 */
    async saveBidFileData(
        request: Request,
        res: Response
    ): Promise<Response> {
        let authenticate: any = this.connection
        const { name, base_path, statusId, type, error_message }: any = request.body;
        if (!request.body || !name || !base_path) {
            return generateResponse(res, 400, false, "Invalid request body");
        }
        const destinationFile = base_path == "/" ? `${name}` : `${base_path}/${name}`;

        try {
            // save bid file
            const loggenInUser = authenticate.userData;
            const uploadedBidFile = await authenticate[authenticate.company].models.BidManagement.create(
                {
                    name: name,
                    base_path: base_path,
                    user_id: loggenInUser?.id,
                    type: "bid",
                    is_deleted: 0,
                    status_id: statusId ?? 2,
                }
            );


            if (type === "error") {
                try {
                    saveErrorOfBidPlanning({
                        db: authenticate[authenticate.company].models,
                        error: error_message,
                        file_id: uploadedBidFile?.dataValues?.id
                    })
                    return generateResponse(res, 200, true, "File saved successfully bid management", []);
                }
                catch (error) {
                    console.log(error, "check error ")
                    return generateResponse(
                        res,
                        500,
                        false,
                        HttpStatusMessage.INTERNAL_SERVER_ERROR
                    );
                }
            }
            let file_id = uploadedBidFile?.dataValues?.id;
            const { containerClient } = await blobConnection(authenticate);
            const blobClient =
                containerClient.getBlobClient(destinationFile);
            // Read the blob content
            const downloadBlockBlobResponse: any = await blobClient.download();
            const downloadedContent = await this.streamToBuffer(
                downloadBlockBlobResponse.readableStreamBody
            );

            let jsonData;
            if (destinationFile.endsWith(".xlsx")) {
                jsonData = await parseExcelTabsToJSON(downloadedContent);
            } else {
                return generateResponse(res, 400, false, "Unsupported file format");
            }
            const result = parseTabsData(jsonData, name, file_id);
            const chunks = chunkArray(result, 1500);
            for (let chunk of chunks) {
                // Insert chunkData into the database
                try {
                    await authenticate[authenticate?.company].models.BidImport.bulkCreate(chunk);
                } catch (error) {
                    throw new Error("An error occurred while inserting bid imports chunk.");
                }
            }
            let laneData = await getTotalNewLanes(authenticate, file_id);
            let obj = [];
            for (let lane of laneData) {
                let origin = lane?.dataValues?.lane_name.split("_")[0];
                let dest = lane?.dataValues?.lane_name.split("_")[1];
                obj.push({
                    lane_name: `${origin.trim()}_${dest.trim()}`,
                    file_id: uploadedBidFile.id,
                });
            }
            // insert into bid lanes
            await authenticate[authenticate.company].models.BidLanes.bulkCreate(obj);
            return generateResponse(res, 200, true, "File uploaded successfully", {
                total: result.length,
                uploadedBidFile: uploadedBidFile,
            });
        } catch (error) {
            console.error(error);
            saveErrorOfBidPlanning({
                db: authenticate[authenticate.company].models,
                error: error,
                fileName: name
            })
            return generateResponse(
                res,
                500,
                false,
                HttpStatusMessage.INTERNAL_SERVER_ERROR
            );
        }
    }

    async streamToBuffer(
        readableStream: NodeJS.ReadableStream
    ): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const chunks: any = [];
            readableStream.on("data", (data) => {
                chunks.push(data instanceof Buffer ? data : Buffer.from(data));
            });
            readableStream.on("end", () => {
                resolve(Buffer.concat(chunks));
            });
            readableStream.on("error", reject);
        });
    }

    /**
   * @description Function to get the all bid files
   * @param {HttpRequest} request
   * @returns {Promise} Returns the list of all files
   */
    async processBidFiles(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        let authenticate: any = this.connection;
        const { file_id } = request.body;
        try {
            const loggenInUser = authenticate?.userData.id;

            //get new lanes
            let allLanes = await getTotalLanes(authenticate[authenticate.company], file_id)
            //In seconds
            let processTime = allLanes.length > 0 ? timeAlgo(allLanes.length) : 0;
            let processDate = sequelize.literal(
                `DATEADD(SECOND, ${processTime}, GETDATE())`
            );
            let values = {
                file_id: file_id,
                expected_time: processDate,
                processed_by: loggenInUser,
            }
            await authenticate[authenticate.company].models.BidProcessing.findOne({ where: { file_id: file_id } }).then(
                async function (obj: { update: (arg0: { [x: string]: any }) => any }) {
                    if (obj) {
                        return await obj.update(values);
                    } else {
                        return await authenticate[authenticate.company].models.BidProcessing.create(values);
                    }
                }
            );
            let bidFileData = await authenticate[authenticate.company].models.BidManagement.findOne({ where: { id: file_id, is_deleted: 0 } }).then(
                async function (obj: { update: (arg0: { [x: string]: any }) => any }) {
                    if (obj) return await obj.update({ status_id: 6 });
                }
            );
            //Re-ingesting data for those APIs where distance was not received from the Rust API.
            let laneData = await getTotalNewLanes(authenticate, file_id);
            for (let lane of laneData) {
                let origin = lane?.dataValues?.lane_name.split("_")[0];
                let dest = lane?.dataValues?.lane_name.split("_")[1];
                await getLaneDistance(origin, dest, authenticate[authenticate.company]);
            }
            let query = `EXEC ${authenticate.schema}.update_bid_planning_emissions @file_id = :file_id`;

            await callStoredProcedure({
                file_id: file_id,
            }, authenticate[authenticate.company], query);
            let bidProcessing = await authenticate[authenticate.company].models.BidProcessing.findOne({ where: { file_id: file_id } });
            let obj = {
                bid_file_Data: bidFileData,
                processing: bidProcessing
            }

            return generateResponse(res, 200, true, "File is processing.", obj);
        } catch (error) {
            console.error(error);
            saveErrorOfBidPlanning({
                db: authenticate[authenticate.company].models,
                error: error,
                file_id: file_id
            })
            return generateResponse(
                res,
                500,
                false,
                HttpStatusMessage.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
   * Azure function to fetch bid details.
   * @param {object} request - The HTTP request object.
   * @returns {object} - The Sequelize connection object.
   */
    async bidFileMostExpensiveLanes(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            const { fileName } = request.body;
            const companyConnection = authenticate[authenticate['company']];
            const maxTableData = await this.fetchQueryData(companyConnection, fileName, 'DESC', authenticate['schema']);
            const minTableData = await this.fetchQueryData(companyConnection, fileName, 'ASC', authenticate['schema']);
            const combinedData = [...maxTableData, ...minTableData];
            const carrierArray = [];
            for (const prop of combinedData) {
                carrierArray.push(prop?.carrier_min);
                carrierArray.push(prop?.carrier_max);
            }
            const carrierData = await companyConnection.models.CarrierLogo.findAll({
                attributes: ['carrier_code', 'carrier_name', 'path'],
                where: { 'carrier_code': carrierArray }
            });
            const maxModifiedData = this.createResponseData(maxTableData, carrierData);
            const minModifiedData = this.createResponseData(minTableData, carrierData);
            if (combinedData.length > 0) {
                let data = {
                    maxTableData: maxModifiedData,
                    minTableData: minModifiedData
                }
                return generateResponse(res, 200, true, "Bid Details Data", data);
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Query to fetch bid details.
     * @param {object} - The Sequelize connection object.
     * @param {fileName} - fileName.
     * @param {order} - order by ASC OR DESC.
     * @param {schema} - Schema Name.
     * @returns {object} - The Sequelize connection object.
     */
    private async fetchQueryData(companyConnection: any, fileName: any, order: string, schema: any) {
        try {
            let query = `EXEC ${schema}.GetBidStatistics @fileName = :fileName, @order = :order`;
            return await callStoredProcedure({
                fileName: fileName,
                order: order
            }, companyConnection, query);
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    /**
     * Create return object
     * @param {data} - The Sequelize connection object.
     * @param {carrierData} - fileName.
     * @returns {object} - The Sequelize connection object.
     */
    private createResponseData(data: any, carrierData: any): object {
        try {
            for (let prop of data) {
                let carrierMinSearch = carrierData.find((x: any) => x.dataValues.carrier_code == prop.carrier_min);
                let carrierMaxSearch = carrierData.find((x: any) => x.dataValues.carrier_code == prop.carrier_max);
                prop.name_max = carrierMaxSearch?.dataValues?.carrier_name ?? null;
                prop.carrier_logo_max = carrierMaxSearch?.dataValues?.path ?? null;
                prop.name_min = carrierMinSearch?.dataValues?.carrier_code ?? null;
                prop.carrier_logo_min = carrierMinSearch?.dataValues?.path ?? null;
            }
            return data;
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    /**
  * @description API to delete role data.
  * @param {Object} request - The HTTP request object.
  * @param {Object} context - The invocation context.
  * @returns {Promise<HttpResponseInit>} The HTTP response initialization object.
  */
    async emissionImpactGraphView(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            const companyConnection = authenticate[authenticate['company']];
            const { file_id } = request.body;

            let query = `EXEC ${authenticate.schema}.GetTopEmissionLanes @fileId = :fileId, @order = :order`;
            let result = await callStoredProcedure({
                fileId: file_id,
                order: 'ASC'
            }, companyConnection, query);

            if (result.length > 0) {
                const carrierLogo = await authenticate[authenticate.company].models.CarrierLogo.findAll({
                    attributes: ['carrier_code', 'path'],
                    where: {
                        carrier_code: {
                            [sequelize.Op.in]: result.map((code: any) => {
                                return code?.SCAC
                            }),
                        },
                    }
                })
                result.forEach((item: any) => {
                    const matchedLogo = carrierLogo.find((logoItem: any) => logoItem.dataValues?.carrier_code === item.SCAC);
                    item.max_emission = Math.abs(item.max_emission);
                    item.path = matchedLogo ? matchedLogo.path : null;
                });
                return generateResponse(res, 200, true, "Emission impact  graph data", result);
            }
            return generateResponse(res, 200, false, HttpStatusMessage.NOT_FOUND, []);
        } catch (error) {
            console.error(error, "check error ");
            // Handle errors and return a 500 response in case of an error.
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @description Function to download the filter data of bid file.
     * @param {string} request
     * @returns {Promise} Returns the confirmation method of successfull upload.
     */
    async downloadBidErrorData(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            let dir = "filterDownloads";
            let company: CompanyKeys = authenticate["company"];

            const { file_name, file_id } = request.body;

            if (!file_id) {
                return generateResponse(res, 422, true, "File not specified!");
            }

            let where: any = {};
            where[Op.and] = [{ is_error: 1 }];

            if (file_id) {
                where[Op.and].push({ file_id: file_id });
            }

            const fileName = `${Date.now()}_${file_name}`;
            const blobName = `${dir}/${fileName}`;
            // Extract the image binary data from the request body
            const bidData = await authenticate[authenticate.company].models.BidImport.findAll({
                attributes: [
                    "lane_name",
                    "scac",
                    "rpm",
                    "row_number",
                    "distance",
                    "intensity",
                    "emissions",
                    "cost_impact",
                    "emission_impact",
                    "tab_name",
                    "fuel_type",
                    'error_message'
                ],
                where: where,
                raw: true,
            });

            const headers = [
                "Row Number",
                "Origin City",
                "Origin State",
                "Destination City",
                "Destination State",
                "SCAC",
                "RPM",
                "Reason"
            ];
            const createData = bidData;
            const mappedData = this.mapHeadersErr(createData);

            const excelBuffer: any = await this.createBufferErr(mappedData, headers);

            const containerName = dbConst[company].bucketName;

            const connectionString: any = process.env.AZURE_STORAGE_CONNECTION_STRING
            const blobService: any = BlobServiceClient.fromConnectionString(connectionString);
            const containerClient = blobService.getContainerClient(containerName);
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            await blockBlobClient.uploadData(excelBuffer);

            return generateResponse(res, 200, true, "File downloaded Successfully.", {
                fileName: fileName,
                folderPath: blobName,
                status: 1,
            });
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

    private mapHeadersErr(data: any) {
        return data.map((item: any) => {
            const parts = item?.lane_name.split('_');
            // Extract origin and destination
            const origin = parts[0].split(',')[0].trim(); // Get the city part before '_'
            const originState = parts[0].split(',')[1].trim(); // Get the state part before '_'
            const destination = parts[1].split(',')[0].trim(); // Get the city part after '_'
            const destinationState = parts[1].split(',')[1].trim(); // Get the state part after '_'
            const mappedItem = {
                "Row Number": item?.row_number,
                "Origin City": origin,
                "Origin State": originState,
                "Destination City": destination,
                "Destination State": destinationState,
                "SCAC": item.scac,
                "RPM": item?.rpm,
                "Reason": item?.error_message,
                tab_name: item?.tab_name
            };
            return mappedItem;
        });
    };

    private async createBufferErr(data: any, headers: any) {
        const Excel = require("excel4node");

        // Create a new Excel workbook
        const workbook = new Excel.Workbook();

        // Organize data by tab_name
        const organizedData: any = {};
        data.forEach((item: any) => {
            const tabName = item.tab_name;
            if (!organizedData[tabName]) {
                organizedData[tabName] = [];
            }
            organizedData[tabName].push(item);
        });

        // Iterate over each tab
        Object.keys(organizedData).forEach(tabName => {
            const worksheet = workbook.addWorksheet(tabName);

            // Define style for headers
            const headerStyle = workbook.createStyle({
                font: {
                    bold: true,
                    color: "#000000", // Black color for font
                },
                fill: {
                    type: "pattern",
                    patternType: "none", // No fill color
                },
                alignment: {
                    horizontal: "left",
                },
            });
            // Write headers and style them (excluding tab_name column)
            headers.filter((header: any) => header !== 'tab_name').forEach((header: any, index: any) => {
                const cell = worksheet.cell(1, index + 1);
                cell.string(header).style(headerStyle);
                worksheet.row(4).setHeight(25); // Adjust height as needed
            });
            // Write data (excluding tab_name column)
            organizedData[tabName].forEach((rowData: any, rowIndex: any) => {
                headers.filter((header: any) => header !== 'tab_name').forEach((header: any, colIndex: any) => {
                    const value = rowData[header];
                    const cell = worksheet.cell(rowIndex + 2, colIndex + 1);
                    cell.string(value?.toString() || ""); // Convert null/undefined to empty string
                });
            });
        });
        const buffer = workbook.writeToBuffer();
        return buffer;
    };

    /**
 * Azure function to fetch bid details.
 * @param {object} request - The HTTP request object.
 * @returns {object} - The Sequelize connection object.
 */
    async checkLogicApp(request: MyUserRequest, res: Response): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            const { fileId } = request.body;
            const responseObject = {
                info: {},
                is_processed: false
            }

            const loggenInUser = authenticate.userData.id;
            const companyConnection = authenticate[authenticate['company']];

            const responseData = await getBidFileCount(companyConnection, fileId);
            if (responseData.total == responseData.is_processed + responseData.is_error) {
                let allLanes = await getTotalLanes(authenticate[authenticate.company], fileId)
                let processTime = allLanes.length > 0 ? timeAlgo(allLanes.length) : 0;
                let processDate = sequelize.literal(
                    `DATEADD(SECOND, ${processTime}, GETDATE())`
                );
                let values = {
                    file_id: fileId,
                    expected_time: processDate,
                    processed_by: loggenInUser,
                }
                await authenticate[authenticate.company].models.BidProcessing.findOne({ where: { file_id: fileId } }).then(
                    async function (obj: { update: (arg0: { [x: string]: any }) => any }) {
                        if (obj) {
                            return await obj.update(values);
                        } else {
                            return await authenticate[authenticate.company].models.BidProcessing.create(values);
                        }
                    }
                );
                let bidFileData = await authenticate[authenticate.company].models.BidManagement.findOne({ where: { id: fileId, is_deleted: 0 } }).then(
                    async function (obj: { update: (arg0: { [x: string]: any }) => any }) {
                        if (obj) return await obj.update({ status_id: 6 });
                    }
                );

                let query = `EXEC ${authenticate.schema}.update_bid_planning_emissions @file_id = :file_id`;

                await callStoredProcedure({
                    file_id: fileId,
                }, authenticate[authenticate.company], query);

                let bidProcessing = await authenticate[authenticate.company].models.BidProcessing.findOne({ where: { file_id: fileId } });
                responseObject.info = {
                    bid_file_Data: bidFileData,
                    processing: bidProcessing
                };
                responseObject.is_processed = true;
            }

            return generateResponse(res, 200, true, "File is processing.", responseObject);

        } catch (error) {
            console.error(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    /**
   * @description Function to get the all bid files
   * @param {HttpRequest} request
   * @returns {Promise} Returns the list of all files
   */
    async updateBidImportLane(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            let authenticate: any = this.connection;
            const companyConnection = authenticate[authenticate['company']];

            const { record_id, distance, fuel_stop_type, error } = request.body;
            let fuel_type_data = fuel_stop_type || 'N/A';
            let bidDistance = (distance) ? distance.toFixed(2) : null;
            let updateAttributes = { distance: bidDistance, is_processed: 1, fuel_type: fuel_type_data, is_error: 0 };
            if (error) {
                updateAttributes.distance = null;
                updateAttributes.is_processed = 0;
                updateAttributes.fuel_type = null;
                updateAttributes.is_error = 1;
            }
          
            let bidLanes = await companyConnection.models.BidLanes.update(updateAttributes, {
                where: { id: record_id }
            });
            if (bidLanes) {
                return generateResponse(
                    res,
                    200,
                    true,
                    "Distance updated Successfully.",
                    bidLanes,
                );
            }
            return generateResponse(
                res,
                200,
                true,
                HttpStatusMessage.NOT_FOUND,
                [],
            );
        } catch (error) {
            console.error(error, "error");
            return generateResponse(
                res,
                500,
                false,
                HttpStatusMessage.INTERNAL_SERVER_ERROR
            );
        }
    }

    async createBlobForDownload(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            let authenticate: any = this.connection

            let dir = "Downloads";

            const { name, file_id } = request.body

            let validation = await validator(
                {
                    file_id: file_id,
                    name: name
                },
                {
                    name: "required",
                    file_id: "required"
                }
            );
            if (validation.status) {
                return generateResponse(res, 400, false, "Validation Errors!");
            }
            const fileName = `${Date.now()}_${name}`;
            const blobName = `${dir}/${fileName}`;

            const bidData = await authenticate[authenticate.company]['models'].BidImport.findAll({
                attributes: [
                    "lane_name",
                    "scac",
                    "rpm",
                    "distance",
                    "intensity",
                    "emissions",
                    "cost_impact",
                    "emission_impact",
                    "tab_name",
                    "fuel_type"
                ],
                where: { [Op.and]: [{ file_id: file_id }, { is_error: 0 }] },
                raw: true,
            });

            const createData = bidData;

            const headers = [
                "lane_name",
                "carrier_scac",
                "rate_per_mile ($)",
                "distance_miles",
                "emission_intensity (gCo2e/Ton-Mile)",
                "emissions (tCo2e)",
                "cost_impact (%)",
                "emission_impact (%)",
                "tab_name",
                "Fuel_type"
            ];

            const mappedData = await this.mapHeadersCommon(createData, "mapHeaderDownload");

            const excelBuffer: any = await this.createBufferCreateDownload(mappedData, headers);

            const { containerClient } = await blobConnection(authenticate)

            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            await blockBlobClient.uploadData(excelBuffer);

            await authenticate[authenticate.company]['models'].BidProcessing.update(
                { download_path: blobName },
                { where: { file_id: file_id } }
            );
            return generateResponse(res, 200, true, "File Uploaded Successfully.", {
                fileName: fileName,
                folderPath: blobName,
                status: 1,
            });
        } catch (error) {
            console.log("error ", error);
            return generateResponse(res,
                500,
                false,
                HttpStatusMessage.INTERNAL_SERVER_ERROR
            );
        }
    }


    private readonly mapHeadersCommon = (data: any, type: any) => {
        try {
            return data.map((item: any) => {
                const mappedItem = {
                    lane_name: item.lane_name,
                    carrier_scac: item.scac,
                    "rate_per_mile ($)": item.rpm,
                    "distance_miles": item.distance,
                    "emission_intensity (gCo2e/Ton-Mile)": item.intensity,
                    "emissions (tCo2e)": item.emissions,
                    "cost_impact (%)": item.cost_impact,
                    "emission_impact (%)": item.emission_impact,
                    "tab_name": item.tab_name,
                    "Fuel_type": item.fuel_type
                };
                return mappedItem;
            });
        }
        catch (err) {
            console.log(err, "err")
            throw err
        }
    }
    private readonly createBufferCreateDownload = async (data: any, headers: any) => {
        try {
            const Excel = require("excel4node");

            const workbook = new Excel.Workbook();

            const organizedData: any = {};
            data.forEach((item: any) => {
                const tabName = item.tab_name;
                if (!organizedData[tabName]) {
                    organizedData[tabName] = [];
                }
                organizedData[tabName].push(item);
            });

            Object.keys(organizedData).forEach(tabName => {
                const worksheet = workbook.addWorksheet(tabName);
                const headerStyle = workbook.createStyle({
                    font: {
                        bold: true,
                        color: "#000000",
                    },
                    fill: {
                        type: "pattern",
                        patternType: "none",
                    },
                    alignment: {
                        horizontal: "center",
                    },
                    border: {
                        left: {
                            style: "thick", // Thick left border
                            color: "#215154", // Black color for border
                        },
                        right: {
                            style: "thick", // Thick right border
                            color: "#215154", // Black color for border
                        },
                        top: {
                            style: "thick", // Thick top border
                            color: "#215154", // Black color for border
                        },
                        bottom: {
                            style: "thick", // Thick bottom border
                            color: "#215154", // Black color for border
                        },
                    },
                });

                // Write headers and style them (excluding tab_name column)
                headers.filter((header: any) => header !== 'tab_name').forEach((header: any, index: number) => {
                    const cell = worksheet.cell(4, index + 1);
                    cell.string(header).style(headerStyle);
                    if (index < 3) {
                        cell.style({
                            border: {
                                left: { style: "none" },
                                right: { style: "none" },
                                top: { style: "none" },
                                bottom: { style: "none" },
                            },
                        });
                    }
                    worksheet.row(4).setHeight(25); // Adjust height as needed
                });

                // Write data (excluding tab_name column)
                organizedData[tabName].forEach((rowData: any, rowIndex: any) => {
                    headers.filter((header: any) => header !== 'tab_name').forEach((header: any, colIndex: number) => {
                        const value = rowData[header];
                        const cell = worksheet.cell(rowIndex + 6, colIndex + 1);
                        cell.string(value?.toString() || ""); // Convert null/undefined to empty string
                        cell.style({
                            border: {
                                left: {
                                    style: "thin",
                                    color: "#000000", // Black color for border
                                },
                                right: {
                                    style: "thin",
                                    color: "#000000",
                                },
                                top: {
                                    style: "thin",
                                    color: "#000000",
                                },
                                bottom: {
                                    style: "thin",
                                    color: "#000000",
                                },
                            },
                        });
                    });
                });
                worksheet.addImage({
                    path: "logo.png",
                    type: "picture",
                    position: {
                        type: "twoCellAnchor",
                        from: {
                            col: 5,
                            colOff: 0,
                            row: 1,
                            rowOff: 0,
                        },
                        to: {
                            col: 8, // Assuming you want the image to span two columns
                            colOff: 0,
                            row: 3,
                            rowOff: 0,
                        },
                        yScale: 7, // Increase the height of the image
                    },
                });
            });

            const buffer = workbook.writeToBuffer();
            return buffer;
        }
        catch (err) {
            console.log(err, "err")
            throw err
        }
    }

}


export default BidPlanningController