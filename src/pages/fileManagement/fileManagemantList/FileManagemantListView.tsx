import ButtonComponent from "../../../component/forms/button";
import Heading from '../../../component/heading';
import ImageComponent from '../../../component/images';
import CustomModal from '../../../component/DailogBox/CustomModal';
import { getFileStatusIcon, getDropDownOptions, capitalizeText, getFileStatusCode } from "utils"
import moment from "moment";
import { valueConstant } from "constant";
import SelectDropdown from "component/forms/dropdown";
import { Modal, ButtonDropdown, DropdownToggle, ModalHeader, ModalBody, FormGroup, Input, DropdownMenu, DropdownItem } from 'reactstrap';
import TableBodyLoad from "component/tableBodyHandle";
import Pagination from 'component/pagination';
const Loader = () => <div className="graph-loader  d-flex justify-content-center align-items-center">
  <div className="spinner-border  spinner-ui d-flex justify-content-center align-items-center">
    <span className="visually-hidden"></span>
  </div>
</div>

/**
 * Renders the User Management view.
 *
 * @return {JSX.Element} The rendered User Management view.
 */
const FileManagementListView = (props: any) => {
  const { fileList,
    uploadingFiles,
    onFilesSelected,
    handleNewFolderModalShow,
    fileInputRef,
    handleUploadButtonClick,
    handlePageChange,
    pageSize,
    currentPage,
    setCurrentPage,
    fileStatusList,
    fileStatus,
    setFileStatus,
    handelShowFileOption,
    showFileOption,
    handelShowActivityLog,
    showActivityLogModal,
    handelhideActivityLog,
    fileLogList,
    isLoadingFileLogList,
    downLoadFile,
    setFileDto,
    showFileDownloadOptin,
    setShowFileDownloadOptin,
    setNewFolderName,
    newFolderName,
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
    folderListLoading,
    showFileDeleteModal,
    setShowFileDeleteModal,
    deleteFile,
    handleHideMoveToFolderModal,
    handleHideMoveFileSuccessModal,
    handleCancelRequest,
    handleMultiSelectFile,
    multiSelectFileForDelete,
    handleMultiDelete,
    setDeleteType,
    deletefileFolderLoading,
    isLoadingFileList,
    isLoadingUploadFolder,
    moveFileLoading,
    resetMoveFile,
    dispatch
  } = props

  const fileLogListData = Array.isArray(fileLogList?.data) ? fileLogList?.data : []

  const fileListed = [...(fileList?.data?.path ?? [])]
  return (
    <div className="dataManagement-Wraper ">
      {/* user management user listing html starts */}
      <div className="dataManagement_List" data-testid="dataManagement-List">
        <div className="d-xl-flex justify-content-between align-items-center bottomline p-3">

          <div className="d-flex gap-3 align-items-center mb-2 mb-lg-0 deleteBtn-sec">
            <Heading
              level="4"
              content="Folders & Files List"
              className="font-xxl-24 font-18 fw-semibold"
            />
            <ButtonComponent data-testid="multi-delete-button" disabled={multiSelectFileForDelete?.length === 0} onClick={(e) => { handleMultiDelete(e) }} text="Delete" btnClass="dangerBtn px-2 py-1" imagePath="/images/delete.svg" />
          </div>
          <div className='d-md-flex gap-3 justify-content-end'>
            <div className='currentStatus-Wrapper d-flex gap-4 align-items-center'>
              {uploadingFiles.length > 0 && <div className='d-flex'>
                <ImageComponent path="/images/uploadingIcon.svg" />
                <h6 className='fw-semibold font-14 font-xxl-16 mb-0'>Uploading: <span className='fw-normal'>{uploadingFiles.length} Files</span></h6>
              </div>}
              <div className='select-box'>
                <SelectDropdown
                  menuPlacement="bottom"
                  aria-label="status-dropdown"

                  options={getDropDownOptions(fileStatusList?.data, "status_name", "id")}
                  placeholder="Status"
                  selectedValue={fileStatus}
                  onChange={(e: any) => {
                    setFileStatus(e);
                    setCurrentPage(1)
                  }}
                />
              </div>
            </div>
            <div className='d-flex gap-2 mt-3 mt-md-0 '>
              <ButtonComponent
                text="Create Folder"
                onClick={handleNewFolderModalShow}
                btnClass="btn-deepgreen font-14 font-xl-16 py-2"
                imagePath='/images/createFolderIcon.svg'
                data-testid="create-folder-button"
              ></ButtonComponent>
              <input
                id="fileInput"
                type="file"
                multiple
                data-testid="hidden-file-input-list"
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
                text="Upload Files"
                btnClass="btn-deepgreen font-14 font-xl-16 py-2"
                imagePath='/images/uploadFilesIcon.svg'
                onClick={handleUploadButtonClick}
                data-testid="upload-file-list-compnent-button"

              ></ButtonComponent>

            </div>
          </div>

        </div>
        <div className=" pb-4">
          <div className="static-table mt-4">
            <div className="tWrap">
              <div className="tWrap__body">
                <table>
                  <thead>
                    <tr>
                      <th>
                        <div className="d-flex align-items-center">
                          <div className="checkboxOuter">
                            <FormGroup check className="invisible mb-0">
                              <Input
                                type="checkbox"
                              />
                            </FormGroup>
                          </div>
                          Name
                        </div>

                      </th>
                      <th>
                        Owner
                      </th>
                      <th>
                        Status
                      </th>
                      <th>
                        Last Access
                      </th>
                      <th>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <TableBodyLoad colSpan={5} noDataMsg=" No Record Found" isLoading={isLoadingFileList || deletefileFolderLoading || isLoadingUploadFolder || moveFileLoading} isData={fileListed?.length > 0}>
                    <tbody>
                      {fileListed?.map((item: any) => (
                        <tr key={item?.id || item?.file_id} className="position-relative">
                          <td>
                            {item?.type === "folder" ? (
                              <button data-testid={`go-to-folder-${item?.id}`} onClick={() => { handleFolderNextClick(item?.base_path, item?.name, item?.id) }}
                                className="d-flex align-items-center border-0 bg-transparent">
                                <div className="checkboxOuter">
                                  <FormGroup check className="invisible mb-0">
                                    <Input
                                      type="checkbox"
                                    />
                                  </FormGroup>
                                </div>
                                <ImageComponent path={`/images/${getFileStatusIcon(item?.type)}`} />
                                <h6 className="mb-0 ps-2 fw-normal text-break text-start file-name">{item?.name}
                                  <div className="tootltip-div">
                                    {item?.name}
                                  </div>
                                </h6>
                              </button>
                            ) : (
                              <div className="d-flex align-items-center">
                                <div className="checkboxOuter">
                                  <FormGroup check className="mb-0">
                                    {fileStatus?.status_code !== getFileStatusCode("Ingested") && <Input
                                      type="checkbox"
                                      data-testid={`file-checkbox-${item?.id}`}
                                      checked={multiSelectFileForDelete.some((ele: any) => ele?.id === item?.id)}
                                      onChange={(e) => handleMultiSelectFile(item, e)}
                                    />}
                                  </FormGroup>
                                </div>
                                <ImageComponent path={`/images/${getFileStatusIcon(item?.type)}`} />
                                <h6 className="mb-0 ps-2 fw-normal text-break file-name">{item?.name}
                                  <div className="tootltip-div">
                                    {item?.name}
                                  </div></h6>
                              </div>
                            )}
                          </td>
                          <td>
                            <h6 className="mb-0 fw-normal owner-name">
                              {item?.user?.first_name ? item?.user?.first_name : "N/A"}
                            </h6>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <ImageComponent path={`/images/${getFileStatusIcon(item?.fileStatus?.status_code)}`} />
                              <h6 className="mb-0 ps-1 fw-normal">{item?.fileStatus?.status_name}</h6>
                            </div>
                          </td>
                          <td>
                            <h6 className="mb-0 fw-normal">{moment(item?.updated_on).format(`${valueConstant?.DATE_FORMAT} | hh:mm A`)}</h6>
                          </td>
                          <td>
                            <div className="d-flex justify-content-end action-btn-dropdown">

                              {item?.fileStatus?.status_code === getFileStatusCode("Uploading") ?
                                <ButtonComponent data-testid={`cancel-request-${item?.id}`} text="Cancel" btnClass="gray-btn" imagePath="/images/cancel.svg"
                                  onClick={() => {
                                    handleCancelRequest(item?.id)
                                  }} /> : (
                                  <ButtonDropdown
                                    data-testid={`file-dropdown-${item?.id}`}

                                    isOpen={showFileOption === item?.id} toggle={() => {
                                      handelShowFileOption(item?.id)
                                    }}>
                                    <DropdownToggle
                                      data-testid={`file-dropdown-caret-${item?.id}`}
                                      caret className={showFileOption === item?.id ? 'bgAction_circle' : 'bg_circle'}>
                                      <ImageComponent path="/images/dots3.svg" className="pe-0" />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                      <div className={`action-btnlist flex-column gap-2 ${showFileOption === item?.id ? 'action-btnlistVisible' : ''}`}>
                                        <DropdownItem className="gray-btn justify-content-start rounded-2" onClick={() => handelShowActivityLog(item?.id)}>
                                          <div data-testid={`file-dropdown-view-log-${item?.id}`} >
                                            <ImageComponent path="/images/eyeicon.svg" />
                                            View Activity
                                          </div>
                                        </DropdownItem>

                                        {item?.type !== "folder" && (
                                          <>

                                            {item?.fileStatus?.status_code !== getFileStatusCode("Cancelled") &&
                                              <DropdownItem className="gray-btn justify-content-start rounded-2" onClick={() => {
                                                setFileDto(item)
                                                setSelectFileModal(null)
                                                setShowMoveToFileModal(true)
                                                dispatch(resetMoveFile())
                                                setNewFolderName(item?.name)
                                                setShowFileOption(null)
                                              }}>
                                                <div data-testid={`file-dropdown-move-${item?.id}`} >
                                                  <ImageComponent path="/images/moveFolder.svg" />
                                                  Move to folder
                                                </div>
                                              </DropdownItem>
                                            }
                                            {item?.fileStatus?.status_code !== getFileStatusCode("Cancelled") &&
                                              <DropdownItem className="gray-btn justify-content-start rounded-2" onClick={() => {
                                                setFileDto(item)
                                                setShowFileDownloadOptin(true)
                                                setShowFileOption(null)
                                              }}>
                                                <div data-testid={`file-dropdown-download-${item?.id}`} >
                                                  <ImageComponent path="/images/download.svg" />
                                                  Download
                                                </div>
                                              </DropdownItem>

                                            }
                                            {item?.fileStatus?.status_code !== getFileStatusCode("Ingested") &&
                                              <DropdownItem className="dangerBtn justify-content-start rounded-2" onClick={() => {
                                                setFileDto(item)
                                                setDeleteType("single")
                                                setShowFileDeleteModal(true)
                                                setShowFileOption(null)
                                              }}>
                                                <div data-testid={`file-dropdown-delete-${item?.id}`} >
                                                  <ImageComponent path="/images/delete.svg" />
                                                  Delete
                                                </div>
                                              </DropdownItem>

                                            }
                                          </>)}
                                      </div>
                                    </DropdownMenu>

                                  </ButtonDropdown>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </TableBodyLoad>
                </table>

                {/* download modal */}
                <CustomModal show={showFileDownloadOptin} primaryButtonTestId="cancel-download" primaryButtonClick={() => setShowFileDownloadOptin(false)} handleClose={() => setShowFileDownloadOptin(false)} secondaryButtonTestId="download-file" secondaryButtonClick={() => downLoadFile()} modalHeader="Do you want to download the file?" primaryButtonText={"No"} primaryButtonClass="gray-btn font-14 px-4 py-2" secondaryButtonText={"Yes"} secondaryButtonclass="btn-deepgreen font-14 px-4 py-2" modalClass="dataManagement" />
                <CustomModal show={showFileDeleteModal} primaryButtonTestId="cancel-delete" primaryButtonClick={() => setShowFileDeleteModal(false)} handleClose={() => setShowFileDeleteModal(false)} secondaryButtonTestId="delete-file" secondaryButtonClick={() => deleteFile()} modalHeader="Do you want to delete the file?" primaryButtonText={"No"} primaryButtonClass="gray-btn font-14 px-4 py-2" secondaryButtonText={"Yes"} secondaryButtonclass="btn-deepgreen font-14 px-4 py-2" modalClass="dataManagement" />
                {/* activity detail modal */}
                <Modal
                  isOpen={showActivityLogModal}
                  toggle={handelhideActivityLog}
                  className="dataManagement-Activity"
                >
                  <ModalHeader toggle={handelhideActivityLog} >
                    <p className="modal-title">Activity</p>
                  </ModalHeader>
                  <ModalBody className="p-0">
                    {isLoadingFileLogList ?
                      <div className="graph-loader  d-flex justify-content-center align-items-center">
                        <div className="spinner-border  spinner-ui d-flex justify-content-center align-items-center">
                          <span className="visually-hidden"></span>
                        </div>
                      </div> : (
                        <div className="activityBody">
                          <h4 className="fw-semibold font-18 mt-3 mb-3 text-capitalized">{capitalizeText(fileLogListData[0]?.fileManagement?.type)} Name: {fileLogListData[0]?.fileManagement?.name}</h4>
                          {fileLogListData?.map((logDto: any) => (
                            <div key={logDto?.file_management_id} className="d-flex align-items-center justify-content-between firstRow">
                              <h5 className="fw-medium font-16 mb-0 text-capitalize">{logDto?.status?.status_name} On</h5>
                              <h6 className="fw-normal font-12 mb-0">{moment(logDto?.created_on).format("DD MMM | hh:mm A")} </h6>
                            </div>
                          ))}
                          {fileLogListData[0]?.fileManagement?.type === "file" && <div className="d-flex align-items-center justify-content-between firstRow">
                            <h5 className="fw-medium font-16 mb-0 text-capitalize">File Downloaded Count</h5>
                            <h6 className="fw-normal font-12 mb-0">{fileLogListData?.reduce((acc: number, ele: any) => { return (ele?.status?.id === 5) ? acc + 1 : acc }, 0)}</h6>
                          </div>}
                        </div>
                      )}
                  </ModalBody>
                </Modal>
                {/* Move to folder modal */}
                <Modal
                  isOpen={showMoveToFileModal}
                  className="dataManagement-folder"
                  toggle={handleHideMoveToFolderModal}
                >
                  <ModalHeader toggle={handleHideMoveToFolderModal} >
                    <p className="modal-title">Move <span className="fw-normal">"{newFolderName}"</span> to folder</p>
                  </ModalHeader>
                  <ModalBody className="p-0">
                    {showSuccessModal ? (<>
                      {moveFileLoading ? (
                        <Loader />
                      ) : (

                        <div className="activityBody mb-4 text-center">
                          <ImageComponent path="/images/uploadFolder.svg" className="mb-3" />
                          <h4 className="fw-semibold font-18 mt-3 mb-4 text-capitalized text-center">File successfully moved to “{selectFileModal}”</h4>

                          <div className=" mt-3 px-4">
                            <ButtonComponent
                              text="Continue"
                              data-testid="move-file-success-modal-continue"
                              btnClass="btn-deepgreenLg font-14 w-100"
                              onClick={handleHideMoveFileSuccessModal}
                            />
                          </div>
                        </div>
                      )}

                    </>
                    ) : (
                      <>
                        {moveFileLoading || folderListLoading ?
                          (
                            <Loader />
                          ) : (
                            <div className="activityBody mb-3">
                              <h4 className="fw-semibold font-18 mt-3 mb-3 text-capitalized">Folder Name</h4>
                              <div className="mb-3 data-height px-3">
                                {folderList?.data?.filter((res: any) => res?.base_path !== (fileDto?.base_path === "/" ? fileDto?.base_path : fileDto?.base_path + "/"))?.map((file: any) => (
                                  <button data-testid={`move-selected-file-modal-${file?.base_path}`} onClick={() => setSelectFileModal(file?.base_path)} key={file?.base_path} className={`d-flex gap-4 mb-1 align-items-center justify-content-between firstRow py-2 px-3 border-0 text-start ${selectFileModal === file?.base_path ? "selectFolder" : ""}`}>
                                    <h5 className="fw-medium font-16 mb-0">{file?.base_path}</h5>
                                    <ImageComponent path="/images/rightarrow.svg" className="arrow" />
                                  </button>
                                ))}
                              </div>
                              <div className="d-flex justify-content-end gap-2 mt-3 pe-4">
                                <ButtonComponent
                                  text="Cancel"
                                  data-testid="move-file-modal-cancel"
                                  btnClass="gray-btn font-14 px-3"
                                  onClick={handleHideMoveToFolderModal}
                                />
                                <ButtonComponent
                                  text="Move"
                                  btnClass="btn-deepgreen font-14 px-3"
                                  data-testid="move-file-modal-move"
                                  onClick={() => handleMoveToFile()}
                                />
                              </div>
                            </div>)}
                      </>)}
                  </ModalBody>
                </Modal>
              </div>
            </div>
            <div className="mt-3 px-3 lane-pagination">
              <nav
                aria-label="Page navigation example"
                className=" d-flex justify-content-end select-box"
              >
                <Pagination
                  currentPage={currentPage}
                  pageSize={pageSize}
                  total={fileList?.data?.pagination?.total_count}
                  handlePageSizeChange={(e: any) => {
                    handlePageChange(e);
                  }}
                  handlePageChange={(page: number) => {
                    setCurrentPage(page);
                  }}
                />
              </nav>
            </div>

          </div>
        </div>
      </div>
    </div >


  );
};

export default FileManagementListView;