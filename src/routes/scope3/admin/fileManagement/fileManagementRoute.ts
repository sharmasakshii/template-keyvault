import { ModuleKey } from "../../../../constant/moduleConstant";
import FileManagementController from "../../../../controller/admin/fileManagement/fileManagementController";
import { createRoute } from "../../../../utils";


const fileManagementRouteConstant = [
    createRoute("post", "/get-file-management-list", FileManagementController, "getBlobContainer", ModuleKey.DataManagement),
    createRoute("get", "/status-list", FileManagementController, "FileManagementStatusList", ModuleKey.DataManagement),
    createRoute("post", "/blob-create-folder", FileManagementController, "CreateFolderDataManagement", ModuleKey.DataManagement),
    createRoute("post", "/status-update", FileManagementController, "statusUpdate", ModuleKey.DataManagement),
    createRoute("post", "/download-blob-file", FileManagementController, "DownloadFileBlob", ModuleKey.DataManagement),
    createRoute("post", "/get-activity-log", FileManagementController, "ActivityLogs", ModuleKey.DataManagement),
    createRoute("post", "/delete-folder-file", FileManagementController, "deleteFolderFile", ModuleKey.DataManagement),
    createRoute("get", "/get-folder-list", FileManagementController, "getFolderList", ModuleKey.DataManagement),
    createRoute("post", "/move-blob-file", FileManagementController, "moveFile", ModuleKey.DataManagement),
    createRoute("post", "/file-exist-check", FileManagementController, "CheckFileExistInContainer", ModuleKey.DataManagement),
];

export default fileManagementRouteConstant;
