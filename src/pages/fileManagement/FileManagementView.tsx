import TitleComponent from "../../component/tittle";
import Heading from "../../component/heading";
import ButtonComponent from "../../component/forms/button/index";
import { Row, Col } from "reactstrap";
import ImageComponent from "../../component/images";
import CustomModal from "../../component/DailogBox/CustomModal";
import FileManagementController from "./fileManagementController";
import FileManagemantListView from "./fileManagemantList/FileManagemantListView";
import Spinner from "component/spinner";
/**
 * Renders the User Management view.
 *
 * @return {JSX.Element} The rendered User Management view.
 */
const FileManagementView = () => {
  const {
    breadCrumbFolder,
    handleFolderBack,
    newFolderName,
    showFolderCreateModal,
    isLoadingUploadFolder,
    handleNewFolderInput,
    getRootProps,
    isDragActive,
    getInputProps,
    onFilesSelected,
    handleCreateFolder,
    fileList,
    handleClose,
    handleNewFolderModalShow,
    showFileListView,
    isLoadingFileList,
    uploadingFiles,
    folderPath,
    handleUploadButtonClick,
    fileInputRef,
    pageSize,
    handlePageChange,
    currentPage,
    setCurrentPage,
    fileStatusList,
    fileStatus,
    setFileStatus,
    showFileOption,
    handelShowFileOption,
    showActivityLogModal,
    handelShowActivityLog,
    handelhideActivityLog,
    fileLogList,
    isLoadingFileLogList,
    downLoadFile,
    setFileDto,
    showFileDownloadOptin,
    setShowFileDownloadOptin,
    showFileRename,
    setShowFileRename,
    setNewFolderName,
    setShowFileOption,
    handleFolderNextClick,
    folderList,
    showMoveToFileModal,
    setShowMoveToFileModal,
    handleMoveToFile,
    selectFileModal,
    setSelectFileModal,
    fileDto,
    showSuccessModal,
    moveFileLoading,
    folderListLoading,
    showFileDeleteModal,
    deletefileFolderLoading,
    setShowFileDeleteModal,
    deleteFile,
    handleHideMoveToFolderModal,
    handleHideMoveFileSuccessModal,
    handleCancelRequest,
    handleClickCrumb,
    handleMultiSelectFile,
    multiSelectFileForDelete,
    handleMultiDelete,
    setDeleteType,
    resetMoveFile,
    dispatch
  } = FileManagementController();

  return (
    <section
      data-testid="data-mManagement"
      className="dataManagement-screen pb-4 pt-2 px-1"
    >
      <TitleComponent
        title={"Data Management"}
        pageHeading={"Data Management"}
      />
      <div className="d-flex justify-content-start mb-2 backBtn-ui">
        <ButtonComponent
          text={"Back"}
          onClick={handleFolderBack}
          btnClass="btn-deepgreen view-recommend font-14 px-3 py-1"
          disabled={!folderPath}
          data-testid="back-button"
        />
      </div>
      {/* breadcrums */}
      <button className="d-flex gap-1 breadCrumbs pe-auto bg-transparent p-0 border-0 text-start">
        {breadCrumbFolder?.map((ele: any, index: number) => {
          return (
            <button key={ele?.label}
              data-testid={`back-button-crumb-${index}`}

              onClick={(e) => {
                handleClickCrumb(ele, index, e);
              }}
              className={index === breadCrumbFolder?.length - 1 ? "primaryTxt mb-2 bg-transparent p-0 border-0 text-start" : "default mb-2 bg-transparent p-0 border-0 text-start"}
            >
              {ele?.label}<span>{" >"}</span>
            </button>
          );
        })}
      </button>
      {isLoadingFileList && !showFileListView && <Spinner spinnerClass="justify-content-center" />}
      {showFileListView && (<FileManagemantListView
        fileList={fileList}
        fileInputRef={fileInputRef}
        handleUploadButtonClick={handleUploadButtonClick}
        handleNewFolderModalShow={handleNewFolderModalShow}
        uploadingFiles={uploadingFiles}
        folderPath={folderPath}
        onFilesSelected={onFilesSelected}
        isLoadingFileList={isLoadingFileList || deletefileFolderLoading || moveFileLoading || isLoadingUploadFolder}
        pageSize={pageSize}
        handlePageChange={handlePageChange}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        fileStatusList={fileStatusList}
        fileStatus={fileStatus}
        setFileStatus={setFileStatus}
        showFileOption={showFileOption}
        handelShowFileOption={handelShowFileOption}
        showActivityLogModal={showActivityLogModal}
        handelShowActivityLog={handelShowActivityLog}
        handelhideActivityLog={handelhideActivityLog}
        fileLogList={fileLogList}
        isLoadingFileLogList={isLoadingFileLogList}
        downLoadFile={downLoadFile}
        setFileDto={setFileDto}
        showFileDownloadOptin={showFileDownloadOptin}
        setShowFileDownloadOptin={setShowFileDownloadOptin}
        showFileRename={showFileRename}
        setShowFileRename={setShowFileRename}
        handleNewFolderInput={handleNewFolderInput}
        setNewFolderName={setNewFolderName}
        newFolderName={newFolderName}
        setShowFileOption={setShowFileOption}
        handleFolderNextClick={handleFolderNextClick}
        folderList={folderList}
        showMoveToFileModal={showMoveToFileModal}
        setShowMoveToFileModal={setShowMoveToFileModal}
        handleMoveToFile={handleMoveToFile}
        selectFileModal={selectFileModal}
        setSelectFileModal={setSelectFileModal}
        fileDto={fileDto}
        showSuccessModal={showSuccessModal}
        folderListLoading={folderListLoading}
        showFileDeleteModal={showFileDeleteModal}
        setShowFileDeleteModal={setShowFileDeleteModal}
        deleteFile={deleteFile}
        handleHideMoveToFolderModal={handleHideMoveToFolderModal}
        handleHideMoveFileSuccessModal={handleHideMoveFileSuccessModal}
        handleCancelRequest={handleCancelRequest}
        handleMultiSelectFile={handleMultiSelectFile}
        multiSelectFileForDelete={multiSelectFileForDelete}
        handleMultiDelete={handleMultiDelete}
        setDeleteType={setDeleteType}
        moveFileLoading={moveFileLoading}
        resetMoveFile={resetMoveFile}
        dispatch={dispatch}
      />)}
      {!showFileListView && !isLoadingFileList && (
        <div className="dataManagementUser" data-testid="show-file-upload">
          <div className="dataManagementInnerCard py-lg-0 py-3 px-3">
            <Row className="align-items-center justify-content-center g-3">
              <Col lg="5">
                <div className="mainGrayCards text-center createUserCard h-100">
                  <div className="pb-3">
                    <ImageComponent path="/images/folderIcon.svg" alt="folder" />
                  </div>
                  <div className="mb-4">
                    <Heading
                      level="3"
                      content="Create a new folder"
                      className="font-16 font-xl-20 font-xxl-24 "
                    />
                    <Heading
                      level="6"
                      content="Support csv and rar files"
                      className="font-12 font-xl-14 font-xxl-16 invisible"
                    />
                  </div>
                  <ButtonComponent
                    text="Create Folder"
                    onClick={handleNewFolderModalShow}
                    btnClass="btn-deepgreenLg font-14 font-xl-16"
                  />
                </div>
              </Col>
              <Col lg="5">
                <div
                  data-testid="upload-file"
                  {...getRootProps({
                    onClick: (event: any) => event.stopPropagation(),
                  })}
                  className={`mainGrayCards borderCard ${isDragActive ? "active" : ""
                    }`}
                >
                  <div className="text-center createUserCard h-100">
                    <div className="mb-4">
                      <div className="pb-3">
                        <ImageComponent
                          path="/images/multipleFilesIcon.svg"
                          alt="files"
                        />
                      </div>
                      <input {...getInputProps()} />
                      <Heading
                        level="3"
                        content="Drag and drop multiple files"
                        className="font-16 font-xl-20 font-xxl-24 "
                      />
                      <Heading
                        level="6"
                        content="Support csv and excel files"
                        className="font-12 font-xl-14 font-xxl-16 "
                      />
                    </div>
                    <input
                      id="fileInput"
                      type="file"
                      multiple
                      data-testid="hidden-file-input"
                      ref={fileInputRef}
                      className="d-none"
                      onChange={(e) => {
                        if (e.target.files) {
                          const filesArray = Array.from(e.target.files);
                          onFilesSelected(filesArray);
                        }
                      }}
                    />
                    <ButtonComponent
                      text="Upload File"
                      btnClass="btn-deepgreenLg font-14 font-xl-16 "
                      onClick={handleUploadButtonClick}
                      data-testid="upload-file-btn"

                    />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      )}

      <CustomModal
        show={showFolderCreateModal}
        primaryButtonClick={handleCreateFolder}
        primaryButtonTestId="create-folder-btn"
        secondaryButtonTestId="cancel-folder-btn"
        primaryBtnDisabled={!newFolderName.length}
        handleInput={handleNewFolderInput}
        inputTestId="create-folder-input-modal"
        handleClose={handleClose}
        inputValue={newFolderName}
        modalHeader="Create New Folder"
        isInputBox={true}
        inputPlaceholder="Type folder name"
        primaryButtonText={"Create Folder"}
        modalClass="dataManagement"
      />
    </section>
  );
};

export default FileManagementView;
