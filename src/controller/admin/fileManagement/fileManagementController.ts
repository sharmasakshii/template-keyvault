import { Sequelize, Op } from "sequelize";
import { MyUserRequest } from "../../../interfaces/commonInterface";
import { paginate, updateFileManagementStatusFn } from "../../../services/commonServices";
import { generateResponse } from "../../../services/response";
import HttpStatusMessage from "../../../constant/responseConstant";
import { blobConnection } from "../../../BlobService/helper";
import {
    ContainerSASPermissions,
    generateBlobSASQueryParameters,
    StorageSharedKeyCredential
} from "@azure/storage-blob";
import { blobMove } from "../../../utils";
import { dbConst } from "../../../connectionDb/dbconst";
import path from "path";

class FileManagementController {
    private readonly connection: Sequelize;

    constructor(connectionData: Sequelize) {
        this.connection = connectionData;
    }

    async getBlobContainer(
        request: MyUserRequest,
        res: Response
    ): Promise<Response> {
        try {
            let authenticate: any = this.connection

            const checkContainer: any = dbConst;

            const container_name = checkContainer[authenticate.company].bucketName;

            const { folder_path, page_size = 10, page = 0, status, file_management_id } = request.body

            let page_server = page ? parseInt(page) - 1 : 0;

            if (file_management_id) {
                await authenticate[authenticate.company].models.FileManagement.update(
                    { last_access: Sequelize.literal("CURRENT_TIMESTAMP") },
                    {
                        where: {
                            id: file_management_id,
                        },
                    }
                );
            }

            let basePathData: string = "/"

            if (folder_path && folder_path != "") {
                basePathData = folder_path
            }

            const [fileManagementResult, FileManagementFailedCount] = await Promise.all([
                authenticate[authenticate.company].models.FileManagement.findAndCountAll(
                    paginate(
                        {
                            attributes: [
                                "type",
                                "name",
                                "base_path",
                                "id",
                                "updated_on",
                                ["User_id", "user_id"],
                            ],
                            order: [
                                ["type", "DESC"],
                                ["created_on", "DESC"],
                            ],
                            where: {
                                [Op.and]: [
                                    { base_path: { [Op.like]: basePathData } },
                                    status && { status_id: status },
                                    { is_deleted: 0 },
                                ],
                            },
                            include: [
                                {
                                    model: authenticate[authenticate.company].models.FileStatus,
                                    attributes: ['status_name', ['id', 'status_code']],
                                    as: "fileStatus",
                                },
                                {
                                    attributes: ['user_id', ['user_name', 'first_name']],
                                    model: authenticate[authenticate.company].models.GetUserDetails,
                                    as: "user",
                                },
                            ],
                        },
                        {
                            page: page_server,
                            pageSize: page_size,
                        }
                    )
                ),
                authenticate[authenticate.company].models.FileManagement.count({
                    where: {
                        [Op.and]: [
                            { base_path: { [Op.like]: basePathData } },
                            status && { status_id: 4 },
                            { is_deleted: 0 },
                        ],
                    },
                }),
            ]);

            const { count, rows } = fileManagementResult;
            if (rows?.length > 0) {
                const responseData = {
                    path: rows,
                    failed_count: FileManagementFailedCount || 0,
                    pagination: {
                        page: page_server,
                        page_size: page_size,
                        total_count: count || 0,
                    },
                };
                return generateResponse(res,
                    200,
                    true,
                    `Successfully listed blobs for container ${container_name}`,
                    responseData
                );
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }

        } catch (error) {
            console.log(error, "check error ");
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async FileManagementStatusList(request: MyUserRequest, res: Response): Promise<Response> {

        let authenticate: any = this.connection

        try {
            let statusListing = await authenticate[authenticate.company].models.FileStatus.findAll({
                attributes: ['status_name', 'id'],
                where: {
                    status_name: {
                        [Op.not]: 'Moved',
                    },
                },
            })
            if (statusListing?.length > 0) {
                return generateResponse(res, 200, true, "File Management Status List", statusListing);
            } else {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND);
            }
        } catch (error) {
            console.log(error, "error ")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async CreateFolderDataManagement(request: MyUserRequest, res: Response): Promise<Response> {
        let authenticate: any = this.connection

        try {
            const { folderPath, folderName, fileManagementId } = request.body;

            let { containerClient }: any = await blobConnection(authenticate);

            const dummyFileName = "index.txt";
            const dummyContent = "This is a dummy file.";

            const checkFolderExist =
                folderPath != "/" ? `${folderPath}/${folderName}` : folderName;

            const blobName = folderPath != "/" ? `${folderPath}/${folderName}/${dummyFileName}`
                : `${folderName}/${dummyFileName}`;

            const checkBlob = containerClient.getBlockBlobClient(checkFolderExist);
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            const isUploaded = await checkBlob.exists();

            if (isUploaded) {
                return generateResponse(res, 400, false, "Folder name already exist!");
            }
            let isValid: boolean = false;
            if (folderName) {
                const pattern = /^[^\\/:*?"<>|]*[^.\\/:*?"<>|]$/;
                isValid = pattern.test(folderName);
            }
            if (isValid) {
                await blockBlobClient.upload(dummyContent, dummyContent.length);
                let where = { id: fileManagementId };

                const payloadData = { status: 2, authenticate: authenticate, blobData: folderName, basePath: folderPath, type: "folder", where: where, file_management_id: fileManagementId }

                await updateFileManagementStatusFn(payloadData);

                return generateResponse(res, 200, true, "Folder created successfully ");
            } else {
                return generateResponse(
                    res,
                    400,
                    false,
                    "Invalid folder name. Special characters are not allowed."
                );
            }
        } catch (error) {
            console.log(error, "err");
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async statusUpdate(request: MyUserRequest, res: Response): Promise<Response> {
        let authenticate: any = this.connection

        try {
            const { status, file_management_id, folderPath, fileName } = request.body

            const checkStatus = await authenticate[authenticate.company].models.FileStatus.findOne({
                where: { id: status }
            });

            if (!checkStatus) {
                return generateResponse(res, 400, false, "Invalid payload");
            }

            let basePath: any
            let blobData: any;

            if (!fileName && !folderPath) {
                return generateResponse(res, 400, false, "Please add file name and folder name");
            }

            function checkBasePathName(folder_path: any, fileName: any) {

                basePath = fileName || "/"
                blobData = fileName && folder_path ? fileName : folder_path

                let dataArray = folder_path.split('/');
                if (dataArray?.length > 1) {
                    const payload = { dataArray: dataArray, folder_path: folder_path }

                    checkFnOnDataArrHaveLenght(payload)
                }
                else if (dataArray?.length == 1) {
                    basePath = fileName && folderPath ? `${folder_path}` : "/"
                    blobData = fileName && folder_path ? fileName : dataArray[0]
                }

            }
            const checkFnOnDataArrHaveLenght = (prop: any) => {
                const { dataArray, folder_path } = prop
                let newArray = dataArray.slice(0, -1);
                basePath = !fileName && folder_path ? newArray.join('/') : folderPath
                blobData = fileName && folder_path ? fileName : dataArray[dataArray?.length - 1]
            }
            if (fileName && !folderPath) {
                basePath = "/"
                blobData = fileName
            }
            if (!fileName && folderPath) {
                checkBasePathName(folderPath, "")
            }
            if (fileName && folderPath) {
                checkBasePathName(folderPath, fileName)
                blobData = fileName;
            }



            let where = { id: file_management_id }

            const payload = { status: status, authenticate: authenticate, blobData: blobData, basePath: basePath, type: "file", where: where, file_management_id: file_management_id, }

            await updateFileManagementStatusFn(payload);

            return generateResponse(res, 200, true, "Status updated succesfully");
        } catch (error) {
            console.log(error, "error ")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async DownloadFileBlob(request: MyUserRequest, res: Response): Promise<Response> {

        let authenticate: any = this.connection

        const constants = {
            accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME ?? "",
            accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY ?? ""
        };
        try {
            const { file_management_id, fileName, downloadPath, folderPath, status } = request.body

            let { containerClient, containerName } = await blobConnection(authenticate)

            let destinationFile = (folderPath == "/" ? `${fileName}` : `${folderPath}/${fileName}`)

            if (downloadPath) {
                destinationFile = downloadPath
            }

            const newBlobClient = await containerClient.getBlockBlobClient(destinationFile);

            const exist = await newBlobClient.exists()
            if (!exist) {
                return generateResponse(res, 400, false, "This file has been deleted or moved to another folder. Please refresh the page.")
            }

            const sharedKeyCredential = new StorageSharedKeyCredential(
                constants.accountName,
                constants.accountKey
            );
            const sasOptions = {
                containerName: containerName,
                permissions: ContainerSASPermissions.parse("r"),
                startsOn: new Date(),
                expiresOn: new Date(new Date().valueOf() + 3600 * 1000)
            };
            const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();

            if (file_management_id) {
                let where = { id: file_management_id }

                const payloadData = { status: status, authenticate: authenticate, blobData: fileName, basePath: folderPath, type: "file", where: where, file_management_id: file_management_id, }

                await Promise.all([
                    updateFileManagementStatusFn(payloadData),
                    authenticate[authenticate.company].models.FileManagement.update(
                        { last_access: Sequelize.literal('CURRENT_TIMESTAMP') },
                        {
                            where: {
                                id: file_management_id,
                            },
                        }
                    ),
                ]);
            }
            const data = {
                containerName: containerName,
                url: containerClient.url,
                sasToken: sasToken,
            }
            return generateResponse(res, 200, true, "Return Sas Token for download the  file", data)
        } catch (error) {
            console.log(error, "err")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async ActivityLogs(request: MyUserRequest, res: Response): Promise<Response> {
        let authenticate: any = this.connection

        try {
            const { file_management_id } = request.body

            let activityData = await authenticate[authenticate.company].models.ActivityLog.findAll({
                attributes: ['file_management_id', 'created_on'],
                where: { file_management_id: file_management_id },
                order: [['created_on', 'DESC']],
                include: [
                    {
                        model: authenticate[authenticate.company].models.FileManagement,
                        attributes: ['type', 'name', 'base_path', 'id'],
                        where: { is_deleted: 0 },
                        as: "fileManagement"
                    },
                    {
                        model: authenticate[authenticate.company].models.FileStatus,
                        attributes: ['status_name', 'id'],
                        as: "status"
                    }
                ],
            })
            if (activityData?.length > 0) {
                return generateResponse(res, 200, true, "Activity logs of a particular file or folder", activityData)
            }

            return generateResponse(res, 400, false, "This file has been deleted or moved to another folder. Please refresh the page.");

        } catch (error) {
            console.log(error, "errr")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteFolderFile(request: MyUserRequest, res: Response): Promise<Response> {

        let authenticate: any = this.connection

        try {
            const { file_id } = request.body
            let { containerClient } = await blobConnection(authenticate);

            const archiveDirectory = 'Archive/';
            let deletedIds = []
            const blobDeleteFileList = []
            for (const property of file_id) {
                try {
                    const d = new Date();
                    let time = d.getTime();

                    let fileArray = property.name.split('.');

                    let blobNameTo = `${archiveDirectory}${fileArray[0]}-${time}.${fileArray[1]}`;

                    let destinationFile = (property.base_path == "/" ? `${property.name}` : `${property.base_path}/${property.name}`)

                    const [blobClient, newBlobClient] = await Promise.all([
                        containerClient.getBlobClient(destinationFile),
                        containerClient.getBlobClient(blobNameTo),
                    ]);

                    const exist = await blobClient.exists()
                    if (!exist) {
                        await authenticate[authenticate.company].models.FileManagement.update({ is_deleted: 1 }, {
                            where: {
                                id: property?.id
                            }
                        });
                        return generateResponse(res, 400, false, "This file has been deleted or moved to another folder. Please refresh the page.")
                    }
                    blobDeleteFileList.push({
                        blobClient: blobClient,
                        newBlobClient: newBlobClient,
                    });

                    deletedIds.push(property?.id)
                }
                catch (err) {
                    console.log(err, "err")
                    throw err
                }
            }

            await Promise.all([
                ...blobDeleteFileList.map(async ({ newBlobClient, blobClient }) => {
                    await blobMove(blobClient, newBlobClient);
                    await blobClient.delete();
                }),
                authenticate[authenticate.company].models.FileManagement.update(
                    { is_deleted: 1 },
                    {
                        where: {
                            id: {
                                [Op.in]: deletedIds,
                            },
                        },
                    }
                ),
            ]);
            return generateResponse(res, 200, true, `Files deleted successfully.`,);

        } catch (error) {
            console.log(error, "error")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    };

    async getFolderList(_request: MyUserRequest, res: Response): Promise<Response> {

        let authenticate: any = this.connection

        try {
            const companyConnection = authenticate[authenticate.company]

            let getFolderList = await companyConnection["models"].FileManagement.findAll({
                attributes: ["name", "base_path"],
                where: { type: 'folder', is_deleted: 0 }
            });

            if (getFolderList?.length == 0) {
                return generateResponse(res, 200, true, HttpStatusMessage.NOT_FOUND, []);
            }
            let data = [];
            for (const property of getFolderList) {
                let name = property.name.replace(/\//g, '');
                let base_path = property.base_path.replace(/\//g, '');
                let pathData = `${base_path}/${name}`;
                let path = pathData.endsWith('/') ? pathData.slice(0, -1) : pathData;
                path = pathData.startsWith('/') ? pathData.substring(1, pathData.length) : pathData;
                data.push({ base_path: `${path}/` });
            }
            data.unshift({ base_path: "/" });
            return generateResponse(res, 200, true, "Get Folder Data.", data);

        } catch (error) {
            console.log(error);
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);;
        }
    }

    async moveFile(request: MyUserRequest, res: Response): Promise<Response> {

        let authenticate: any = this.connection

        try {
            let { move_to, move_from, fileName, file_id } = request.body

            let blobNameFrom = move_from ? `${move_from}/${fileName}` : fileName;
            let blobNameTo = move_to ? `${move_to}${fileName}` : fileName;

            blobNameTo = blobNameTo.startsWith('/') ? blobNameTo.substring(1, blobNameTo.length) : blobNameTo;

            const { containerClient } = await blobConnection(authenticate)

            const blobClient = containerClient.getBlobClient(blobNameFrom);
            const newBlobClient = containerClient.getBlobClient(blobNameTo);

            const existCheck = await blobClient.exists()

            const destinationExistCheck = await newBlobClient.exists()

            if (!existCheck) {
                return generateResponse(res, 400, false, "This file has been deleted or moved to another folder. Please refresh the page.")
            }
            if (destinationExistCheck) {
                return generateResponse(res, 400, false, "File already exist on destination!");
            }

            await blobMove(blobClient, newBlobClient);

            await blobClient.delete();

            let file_path = move_to;
            if (move_to != "/") {
                file_path = move_to.endsWith('/') ? move_to.slice(0, -1) : move_to;
            }

            let updateObject = await authenticate[authenticate.company].models.FileManagement.findOne({
                where: { id: file_id }
            });

            if (!updateObject) {
                return generateResponse(res, 400, false, "File Not Found!");
            }

            updateObject.base_path = file_path;
            await updateObject.save();
            await authenticate[authenticate.company].models.ActivityLog.create({
                status_id: 8,
                file_management_id: file_id
            });
            return generateResponse(res, 200, true, "File Moved Successfully.");

        } catch (error) {
            console.log("error", error)
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }

    async CheckFileExistInContainer(request: MyUserRequest, res: Response): Promise<Response> {

        let authenticate: any = this.connection

        const constants = {
            accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME ?? "",
            accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY ?? ""
        };

        try {
            const { fileName, folderName, file_id } = request.body

            if (!fileName) {
                return generateResponse(res, 400, false, "No file found");
            }

            let { containerClient, containerName }: any = await blobConnection(authenticate)

            let blobName = folderName === "/" ? fileName : `${folderName}/${fileName}`;
            blobName = blobName.startsWith('/') ? blobName.substring(1) : blobName;

            const destinationList = await containerClient.listBlobsFlat()
            let failedValidation = "";
            const safeName = this.sanitizeFileName(fileName);

            for await (const blob of destinationList) {
                if (blobName == blob.name) {
                    failedValidation = "File already exist on destination!";
                    break;
                }
            }
            if (failedValidation) {
                let data = {
                    id: file_id
                }
                return generateResponse(res, 400, false, `File ${fileName} already exist`, data);
            } else {

                const sharedKeyCredential = new StorageSharedKeyCredential(
                    constants.accountName,
                    constants.accountKey
                );

                const sasOptions = {
                    containerName: containerName,
                    blobName: safeName,
                    permissions: ContainerSASPermissions.parse("cw"),
                    startsOn: new Date(),
                    expiresOn: new Date(new Date().valueOf() + 3600 * 1000)
                };
                const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();

                const data = {
                    containerName: containerName,
                    url: containerClient.url,
                    sasToken: sasToken,
                    id: file_id
                }
                return generateResponse(res, 200, true, "Blob Container Detail", data);
            }
        } catch (error) {
            console.log(error, "error")
            return generateResponse(res, 500, false, HttpStatusMessage.INTERNAL_SERVER_ERROR);
        }
    }
    public sanitizeFileName(name: string): string {
        try {
            // 1) Remove any path info (just keep the base name)
            name = path.basename(name);

            // 2) Normalize Unicode (remove hidden characters)
            name = name.normalize("NFKD");

            // 3) Replace unsafe characters with underscores
            name = name.replace(/[^a-zA-Z0-9._-]/g, "_");

            // 4) Collapse multiple underscores
            name = name.replace(/_+/g, "_");

            // 5) Prevent names like "." or ""
            if (!name || name === "." || name === "..") {
                name = "file";
            }

            // 6) Enforce max length (Azure supports long names, but keep reasonable)
            if (name.length > 150) {
                const ext = path.extname(name);
                const base = path.basename(name, ext).slice(0, 140);
                name = base + ext;
            }

            return name;
        } catch (error) {
            console.log("Error sanitizing file name:", error);
            throw new Error("Invalid file name");
        }
    }
}

export default FileManagementController