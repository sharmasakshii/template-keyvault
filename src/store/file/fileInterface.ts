export interface FileInterface{
    isError: boolean;
    isSuccess: boolean;
    isLoading: boolean;
    message: any;
    isLoadingFileList: boolean;
    fileList: any;
    isLoadingUploadFolder: boolean;
    folderUploadData: boolean;
    folderUploadDataDto: any
    fileStatusList: any;
    isFileStatusLoading: boolean;
    fileLogList: any;
    isLoadingFileLogList: boolean;
    fileDownloadLoading: boolean;
    fileDownload: any;
    isLoadingCheckFile:boolean;
    checkFileExist: any;
    isLoadingFileStatus: boolean;
    fileStatusUpdateDto: any;
    deletefileFolder: any;
    deletefileFolderLoading: boolean
    folderList: any;
    folderListLoading: boolean;
    moveFileLoading: boolean;
    moveFile: any;
    
}