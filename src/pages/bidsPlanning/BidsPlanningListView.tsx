import ButtonComponent from "component/forms/button";
import Heading from "component/heading";
import ImageComponent from "component/images";
import SelectDropdown from "component/forms/dropdown";
import { FormGroup, Input } from "reactstrap";
import { getBidFileStatusIcon, getDropDownOptions, getOrder, sortIcon } from "utils";
import moment from "moment";
import { valueConstant } from "constant";
import { ProgressBar } from 'react-bootstrap';
import CountdownTimer from "./ProcessingCountDown";

const BidsPlanningListView = ({ processFilePercent, processFileStatusData, handleProcessFile, handleUploadButtonClick, handleDownLoadFile, handleSampleFileDownload, multiSelectFileForDelete, setShowFileDeleteModal, getFileCount, bidStatusList, handleMultiSelectFile, fileStatus, setFileStatus, bidFileList, selectFile, order, setOrder, handleShowOutputSummary, showBidmatrixProgress, handleShowInputFile, setCurrentPage }: any) => {

  return (
    <div className="additionalBids-Wrapper">
      <div className="filesList-heading border-bottom pb-3 d-flex flex-wrap justify-content-between align-items-center p-3">
        <div className="d-flex gap-3 align-items-center">
          <Heading level="4" className="font-18 mb-0">
            Files List
          </Heading>
          {multiSelectFileForDelete?.length > 0 && <ButtonComponent
            text="Delete"
            btnClass="dangerBtn px-2 py-1"
            imagePath="/images/delete.svg"
            onClick={() => setShowFileDeleteModal(true)}
          />}
        </div>

        <div>
          <div className="d-flex flex-wrap gap-2 justify-content-md-end  align-items-center">
            <div className="d-flex gap-2 mt-md-0 mt-3">
              <div className="d-flex align-items-center gap-1">
                <ImageComponent
                  path="/images/processed.svg"
                  alt="processed"
                  className="pe-0"
                />
                <Heading level="4" className="font-14 font-xxl-16 fw-semibold mb-0">
                  Processed : <span className="fw-normal">{getFileCount(5)} Files</span>
                </Heading>
              </div>
              <div className="verticalLine mx-0"></div>
              <div className="d-flex align-items-center gap-1">
                <ImageComponent
                  path="/images/failedIcon.svg"
                  alt="failed"
                  className="pe-0"
                />
                <Heading level="4" className="font-14 font-xxl-16 fw-semibold mb-0">
                  Failed : <span className="fw-normal">{getFileCount(3)} Files</span>
                </Heading>
              </div>
            </div>

            <div className="select-box d-flex align-items-center gap-3">
              <SelectDropdown
                menuPlacement="bottom"
                options={getDropDownOptions(
                  bidStatusList?.data,
                  "status_name",
                  "id"
                )}
                placeholder="Status"
                selectedValue={fileStatus}
                onChange={(e: any) => {
                  setFileStatus(e);
                  setCurrentPage(1)
                }}
              />
            </div>
            <div className="d-flex gap-2 btns">
              <ButtonComponent
                text="Sample File"
                btnClass="btn-deepgreen font-12 font-xxl-14 py-2" onClick={handleSampleFileDownload} />
              <ButtonComponent
                imagePath="/images/uploadFilesIcon.svg"
                text="Upload Files"
                btnClass="btn-deepgreen font-12 font-xxl-14 py-2"
                onClick={() => { handleUploadButtonClick() }}
              />
            </div>

          </div>
        </div>
      </div>

      <div className="pb-3 pt-0 additionalbids-dataSection">
        <div className="static-table fileList">
          <table>
            <thead>
              <tr>
                <th>
                  <div className="d-flex align-items-center gap-2">
                    <FormGroup check>
                      <Input
                        type="checkbox"
                        checked={multiSelectFileForDelete?.length === bidFileList?.data?.data?.length}
                        onChange={(e) => handleMultiSelectFile("all", e)} />
                    </FormGroup>
                    File Name
                  </div>
                </th>
                <th>Owner</th>
                <th>Status</th>
                <th onClick={() => setOrder(getOrder(order))}>
                  <div className="pointer d-flex">
                    Uploaded on<span><ImageComponent imageName={`${sortIcon("uploaded_on", "uploaded_on", order)}`} /></span>
                  </div>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className=" text-start ">
              {
                bidFileList?.data?.data?.length > 0 ? (
                  bidFileList.data.data.map((file: any) => (
                    <tr key={file?.id} className={file?.status?.status_name?.toLowerCase()}>
                      <td>
                        <div className="d-flex gap-2 align-items-center">
                          <FormGroup check>
                            <Input type="checkbox"
                              checked={multiSelectFileForDelete.some((ele: any) => ele?.id === file?.id)}
                              onChange={(e) => handleMultiSelectFile(file, e)} />
                          </FormGroup>
                          <div className="d-flex gap-1 align-items-center">
                            <ImageComponent
                              className=" pe-0 fileIcon"
                              path="/images/file.svg"
                            />
                            <Heading
                              level="5"
                              className="font-14 font-xxl-16  fw-normal mb-0 file-name">
                              {file?.name}
                              <div className="tootltip-div">
                                {file?.name}
                              </div></Heading>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Heading
                          level="4"
                          content={file?.user?.user_name}
                          className="font-14 font-xxl-16  fw-normal mb-0"
                        />
                      </td>
                      <td>
                        <div className="d-flex gap-1 align-items-center">
                          <ImageComponent path={`/images/${getBidFileStatusIcon(file?.status?.id)}`} />
                          <Heading
                            level="4"
                            content={file?.status?.status_name}
                            className="font-14 font-xxl-16  fw-normal mb-0"
                          />
                        </div>
                      </td>
                      <td>
                        <Heading
                          level="4"
                          content={moment(file?.created_on).format(`${valueConstant?.DATE_FORMAT}`)}
                          className="font-14 font-xxl-16  fw-normal mb-0"
                        />
                      </td>
                      <td>
                        {file?.status?.id === 6 &&
                          <div>
                            <CountdownTimer endTime={moment(file?.processing?.expected_time)} handleDownLoadFile={handleDownLoadFile} handleShowOutputSummary={handleShowOutputSummary} file={file} handleShowInputFile={handleShowInputFile} />
                          </div>
                        }
                        {(file?.status?.id === 2 && (selectFile ? selectFile?.fileId !== file?.id : true)) &&
                          <div className="d-flex gap-3 align-item-center">
                            <ButtonComponent
                              text="Process File"
                              btnClass="btn-deepgreen justify-content-center font-12 font-xxl-14 gap-1 processFile"
                              imagePath="/images/processFile.svg"
                              onClick={() => handleProcessFile(file?.name, file.id)}
                            />
                            <ButtonComponent
                              text="View File Input"
                              onClick={() => handleShowInputFile(file)}
                              btnClass="justify-content-center font-12 font-xxl-14 gap-1 previewFile"
                            />
                          </div>
                        }

                        {showBidmatrixProgress && file?.status?.id !== 6 && file?.id === selectFile?.fileId && (<>
                          <Heading
                            level="4"
                            content={`Ingesting  ${processFileStatusData?.data?.total || 0} lanes`}
                            className="font-12 font-xxl-14  fw-normal mb-1"
                          />
                          <div className="processFile-bar d-flex align-items-center gap-2">
                            <ProgressBar now={processFilePercent} className="w-100" />
                            <Heading
                              level="4"
                              content={(Math.floor(processFilePercent * 10) / 10) + "%"}
                              className="font-14 fw-medium mb-0"
                            />
                          </div>
                        </>
                        )}

                        {file?.status?.id === 5 && <div className="d-flex gap-2 align-items-center"><ButtonComponent
                          text="Download"
                          btnClass="justify-content-center font-12 font-xxl-14 gap-1 download downloadListView"
                          imagePath="/images/download.svg"
                          onClick={() => {
                            handleDownLoadFile(file);
                            handleShowOutputSummary(file)
                          }
                          }
                        />
                          <ButtonComponent
                            text="Preview File"
                            btnClass="justify-content-center font-12 font-xxl-14 gap-1 previewFile"
                            onClick={() => handleShowOutputSummary(file)}
                          />
                          <span className="line"></span>
                          <ButtonComponent
                            text="View File Input"
                            onClick={() => handleShowInputFile(file)}
                            btnClass="justify-content-center font-12 font-xxl-14 gap-1 previewFile"
                          />
                        </div>}
                        {file?.status?.id === 3 &&
                          <div className="d-flex align-items-center gap-2">
                            <ButtonComponent
                              text="Upload again"
                              onClick={() => { handleUploadButtonClick() }}
                              btnClass="dangerBtn justify-content-center font-12 font-xxl-14 px-1 gap-1"
                              imagePath="/images/Retry.svg"
                            />
                            <div className="toolTip">
                              <span className="tooltipText">{file?.bidError?.[0]?.error_message}</span>
                              <ImageComponent
                                className="pe-0 failedIcon"
                                path="/images/failedIcon.svg"
                                alt="failed"
                              />
                            </div>
                          </div>
                        }
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">No Record Found</td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BidsPlanningListView;
