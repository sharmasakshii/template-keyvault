import TitleComponent from 'component/tittle'
import BidsPlanningController from './bidsPlanningController'
import Loader from 'component/loader/Loader'
import BidPlanningListView from './BidsPlanningListView'
import BidPlanningDropBox from './FileUploadDropBox'
import FileUploadProgress from './FileUploadProgress'
import CustomModal from 'component/DailogBox/CustomModal'
import Pagination from 'component/pagination';
import Spinner from 'component/spinner'
import { normalizedList } from 'utils'

const BidsPlanningView = () => {

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        handleUploadButtonClick,
        fileInputRef,
        onFilesSelected,
        showFileUploadProgress,
        progressValue,
        isLoadingBidFileList,
        showFileListView,
        uploadingFiles,
        isLoadingSaveFile,
        isLoadingDeleteFile,
        handleProcessFile,
        isLoadingCheckFile,
        isLoadingProcessFile,
        handleCancelRequest,
        showUploadError,
        fileUploadError,
        handleUploadAgain,
        handleDownLoadFile,
        handleSampleFileDownload,
        fileDownloadLoading,
        showDropBoxView,
        handleCloseProgressModal,
        fileStatus,
        getFileCount,
        setFileStatus,
        bidFileList,
        handleMultiSelectFile,
        multiSelectFileForDelete,
        showFileDeleteModal,
        setShowFileDeleteModal,
        deleteFile,
        pageSize,
        setPageSize,
        currentPage,
        setCurrentPage,
        bidStatusList,
        isLoadingKeyMetricsDetail,
        isLoadinBidFileLanesTableGraph,
        selectFile,
        setSelectFile,
        processFileStatusData,
        order,
        setOrder,
        handleShowOutputSummary,
        showBidmatrixProgress,
        processFilePercent,
        handleShowInputFile,
        isLoadingProcessFileStatusData,
        isAnalysingFile
    } = BidsPlanningController()

    return (
        <>
            <TitleComponent title="Bid Planning" pageHeading="Bid Planning" />
            <Loader isLoading={[isLoadingDeleteFile, isLoadingBidFileList, fileDownloadLoading, isLoadingProcessFile, isLoadingKeyMetricsDetail, isLoadinBidFileLanesTableGraph, isLoadingProcessFileStatusData]} />
            <section data-testid="bid-planning">
                {!isLoadingBidFileList && <div className="bidsPlanning-outerScreen p-0 mt-0">
                    <input
                        id="fileInput"
                        type="file"
                        multiple={false}
                        ref={fileInputRef}
                       className="d-none"
                        disabled={isLoadingCheckFile}
                        onChange={(e) => {
                            if (e.target.files) {
                                const filesArray = Array.from(e.target.files);
                                onFilesSelected(filesArray);
                            }
                        }}
                    />
                    <input {...getInputProps()} multiple={false} />
                    {showDropBoxView && <BidPlanningDropBox isDragActive={isDragActive}
                        getRootProps={getRootProps}
                        handleUploadButtonClick={handleUploadButtonClick}
                        showFileUploadProgress={showFileUploadProgress}
                        uploadingFiles={uploadingFiles}
                        progressValue={progressValue}
                        isLoadingSaveFile={isLoadingSaveFile}
                        handleCancelRequest={handleCancelRequest}
                        handleSampleFileDownload={handleSampleFileDownload}
                        handleCloseProgressModal={handleCloseProgressModal}
                        showUploadError={showUploadError}
                        handleUploadAgain={handleUploadAgain}
                        bidFileList={bidFileList}
                        isAnalysingFile={isAnalysingFile}
                    />}
                    {showFileListView && <>
                        <BidPlanningListView
                            processFilePercent={processFilePercent}
                            handleProcessFile={handleProcessFile}
                            handleUploadButtonClick={handleUploadButtonClick}
                            handleDownLoadFile={handleDownLoadFile}
                            handleSampleFileDownload={handleSampleFileDownload}
                            multiSelectFileForDelete={multiSelectFileForDelete}
                            setShowFileDeleteModal={setShowFileDeleteModal}
                            getFileCount={getFileCount}
                            bidStatusList={bidStatusList}
                            handleMultiSelectFile={handleMultiSelectFile}
                            fileStatus={fileStatus}
                            setFileStatus={setFileStatus}
                            bidFileList={bidFileList}
                            selectFile={selectFile}
                            setSelectFile={setSelectFile}
                            processFileStatusData={processFileStatusData}
                            order={order}
                            setOrder={setOrder}
                            handleShowOutputSummary={handleShowOutputSummary}
                            showBidmatrixProgress={showBidmatrixProgress}
                            handleShowInputFile={handleShowInputFile}
                            setCurrentPage={setCurrentPage}
                        />

                        <div className="mt-0 lane-pagination d-flex justify-content-end p-3 pt-0">
                            <nav aria-label="Page navigation example"
                                className=" d-flex justify-content-end select-box mt-3">
                                <Pagination
                                    currentPage={currentPage}
                                    pageSize={pageSize}
                                    total={bidFileList?.data?.pagination?.total_count}
                                    handlePageSizeChange={(e: any) => {
                                        setPageSize(e);
                                        setCurrentPage(1)
                                    }}
                                    handlePageChange={(page: number) => {
                                        setCurrentPage(page);
                                    }}
                                />
                               
                            </nav>
                        </div>
                    </>
                    }
                    {(showFileUploadProgress || isAnalysingFile) && normalizedList(bidFileList?.data?.data)?.length > 0 && (
                        <div className='fade-modal'>
                            <div className="fileUploadModal">
                                <div className="pt-5 pb-4 px-4">
                                    {isAnalysingFile ? (
                                        <div className="uploadfileStatus w-100 justify-content-center px-4 align-items-center gap-3">
                                            <Spinner spinnerClass="justify-content-center mb-4" />
                                            <p className="font-xxl-16 font-14 mb-0 text-center">Analysing the file data...</p>
                                        </div>
                                    ) : (
                                        <FileUploadProgress
                                            uploadingFiles={uploadingFiles}
                                            progressValue={progressValue}
                                            isLoadingSaveFile={isLoadingSaveFile}
                                            handleCancelRequest={handleCancelRequest}
                                            showUploadError={showUploadError}
                                            fileUploadError={fileUploadError}
                                            handleUploadAgain={handleUploadAgain}
                                            handleCloseProgressModal={handleCloseProgressModal}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    <CustomModal show={showFileDeleteModal} primaryButtonClick={() => setShowFileDeleteModal(false)} handleClose={() => setShowFileDeleteModal(false)} secondaryButtonClick={() => deleteFile()} modalHeader="Do you want to delete the file?" primaryButtonText={"No"} primaryButtonClass="gray-btn font-14 px-4 py-2" secondaryButtonText={"Yes"} secondaryButtonclass="btn-deepgreen font-14 px-4 py-2" modalClass="dataManagement" />
                </div >
                }
            </section>
        </>
    )
}

export default BidsPlanningView 