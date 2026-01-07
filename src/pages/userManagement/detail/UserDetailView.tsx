import TitleComponent from "../../../component/tittle";
import Heading from "../../../component/heading";
import { Row, Col } from "reactstrap";
import ImageComponent from "../../../component/images";
import ButtonComponent from "../../../component/forms/button";
import SelectDropdown from "../../../component/forms/dropdown";
import BackLink from "../../../component/forms/backLink/index";
import ConfirmBox from "component/DailogBox/ConfirmBox";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Table from "react-bootstrap/Table";
import UserDetailController from "./userDetailController";
import { Link } from "react-router-dom";
import moment from "moment";
import { handleProfileImage, normalizedList } from "utils";
import { UserPermission } from "component/userPermission";
import { valueConstant } from "constant";
import UserActivityView from "../userActivityLog/UserActivityView";
import TableBodyLoad from "component/tableBodyHandle";
import Spinner from "component/spinner";
/**
 * Renders the User Management view.
 *
 * @return {JSX.Element} The rendered User Management view.
 */
const UserDetailView = () => {
  const {
    isUserListByIdLoading,
    singleUserDetail,
    regions,
    statusList,
    handleUpdateUserStatus,
    setIsDeleted,
    userFilListDetail,
    setIsStatusUpdate,
    backLinkUrl,
    handleChangeStatus,
    isDeleted,
    isStatusUpdate,
    handleDownloadFile,
    handleDeleteUser,
    isFileDownloadingDetail,
    userFileListLoading,
    isPepsiClient,
    divisions
  } = UserDetailController();
  return (
    <section
      data-testid="user-management-view"
      className="userManagement-screen pb-4 px-2 pt-2"
    >
      <TitleComponent title={"User Detail"} pageHeading={"User Details"} />
      <div className="userManagement-Wraper" data-testid="user-detail">
        {/* user management user listing html starts */}
        <div className="userManagement_List">
          <div className="bottomline border-bottom pb-3 px-3">
            <div className="d-flex gap-3 align-items-center justify-content-between mb-2 mb-lg-0 flex-wrap">
              <div className="d-flex align-items-center gap-2">
                <BackLink btnText="Back" link={backLinkUrl()} />
                <div className="userName">
                  <Heading
                    level="4"
                    content={singleUserDetail?.data?.userDetail?.name}
                    className="font-20 fw-semibold"
                  />
                  <Heading
                    level="6"
                    content={singleUserDetail?.data?.userDetail?.userDetailsRole?.name}
                    className="font-16 fw-normal mb-0"
                  />
                </div>
              </div>
              <div className="d-flex flex-wrap select-box gap-3 ">
                {singleUserDetail?.data?.userDetail?.status !== 0 && <div className="d-flex align-items-center gap-3">
                  <Heading level="5" className="font-16 fw-medium mb-0">
                    Status
                  </Heading>
                  <SelectDropdown
                    aria-label="user-status-dropdown"
                    options={statusList}
                    disabled={isUserListByIdLoading}
                    placeholder="Select Status"
                    onChange={(e: { value: number, label: string }) => handleChangeStatus(e)}
                    selectedValue={statusList?.filter(
                      (el: any) => el.value === Number.parseInt(singleUserDetail?.data?.userDetail?.status)
                    )}
                  />
                </div>}
                <Link
                  to={`/user-management-edit/${singleUserDetail?.data?.userDetail?.id}`}
                  className="editLink"
                >
                  <ButtonComponent
                    text="Edit"
                    disabled={isUserListByIdLoading}
                    btnClass="outlineBtn-deepgreen px-4 py-1"
                  />
                </Link>
                <ButtonComponent
                  onClick={() => { setIsDeleted(true) }}
                  text="Delete"
                  data-testid="delete-btn"
                  btnClass="dangerBtn px-2 py-1"
                  imagePath="/images/delete.svg"
                  disabled={isUserListByIdLoading}
                />
              </div>
            </div>
          </div>
          <div className="userDetail-outerCard mt-3">
            <div className="createProfileCard p-3">
              {singleUserDetail?.data?.userDetail?.last_logged_in &&
                <div className="text-end font-16">
                  <span className="fw-medium">Last Logged in:</span> {moment(singleUserDetail?.data?.userDetail?.last_logged_in).format(valueConstant?.DATE_FORMAT)}
                </div>}{" "}
              <Row>
                {isUserListByIdLoading ? <Spinner spinnerClass="justify-content-center" /> : <>
                  <Col xl={6}>
                    <div className="uploadImageSection d-flex align-items-center gap-3">
                      <div className="uploadImage ">
                        <ImageComponent
                          imageName="defaultSquareImg.png"
                          className="img-fluid pe-0"
                          path={singleUserDetail?.data?.userDetail?.image}
                          handleImageError={handleProfileImage}
                        />
                      </div>
                      <div className="personalDetails">
                        <Heading
                          level="4"
                          content="Personal Details"
                          className="font-18 font-xxl-20 fw-semibold my-3"
                        />
                        <Row>
                          <Col lg="4" className="pe-0">
                            <Heading level="5" className="font-14 font-xxl-16 fw-medium">
                              Contact Number:{" "}
                            </Heading>
                          </Col>
                          <Col lg="6" className="px-0">
                            <Heading level="5" className="font-14 font-xxl-16 fw-normal">
                              {singleUserDetail?.data?.userDetail?.phone_number || "N/A"}
                            </Heading>
                          </Col>
                          <Col lg="4" className="pe-0">
                            <Heading level="5" className="font-14 font-xxl-16 fw-medium">
                              Email Address:
                            </Heading>
                          </Col>
                          <Col lg="6" className="px-0">
                            <Heading level="5" className="font-14 font-xxl-16 fw-normal">
                              {singleUserDetail?.data?.userDetail?.email}
                            </Heading>
                          </Col>
                          <Col lg="4" className="pe-0">
                            <Heading level="5" className="font-14 font-xxl-16 fw-medium">
                              {isPepsiClient ? "Division:" : "Region:"}{" "}
                            </Heading>
                          </Col>
                          <Col lg="6" className="px-0">
                            <Heading level="5" className="font-14 font-xxl-16 fw-normal">
                              {isPepsiClient
                                ? divisions?.data?.find(
                                    (i: any) =>
                                      i?.id ===
                                      Number.parseInt(
                                        singleUserDetail?.data?.userDetail?.division_id
                                      )
                                  )?.name || "N/A"
                                : regions?.data?.regions.find(
                                    (i: any) =>
                                      i?.id ===
                                      Number.parseInt(
                                        singleUserDetail?.data?.userDetail?.region_id
                                      )
                                  )?.name || "N/A"}
                            </Heading>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Col>
                  <Col xl={6} className="align-self-center">
                    <div>
                      <Heading
                        level="4"
                        content="Permissions"
                        className="font-18 font-xxl-20 fw-semibold mb-2"
                      />

                      <UserPermission permissionDetail={singleUserDetail?.data?.userPermission} />
                    </div>
                  </Col>
                </>}
              </Row>
            </div>
          </div>
          <div className="py-5 px-4 fileStatus">
            <Tabs
              defaultActiveKey="Files Uploaded"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab eventKey="Files Uploaded" title="Files Uploaded">
                <Table striped>
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Uploaded on</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <TableBodyLoad colSpan={3} noDataMsg="Currently no file uploaded by the user" isLoading={userFileListLoading} isData={userFilListDetail?.data?.length > 0}>
                    <tbody>
                      {normalizedList(userFilListDetail?.data)?.map((file: any) => (
                          <tr key={file?.id}>
                            <td>
                              <ImageComponent
                                path="/images/file.svg"
                                className="img-fluid pe-2 pb-1"
                              />
                              {file?.name}
                            </td>
                            <td>{moment(file?.created_on).format(valueConstant?.DATE_FORMAT)}</td>
                            <td>
                              <ButtonComponent
                                data-testid={`download-file-${file?.id}`}
                                onClick={() => { handleDownloadFile(file) }}
                                text="Download"
                                imagePath="/images/download.svg"
                                btnClass="btn-deepgreen downloadImg font-14 px-4 py-1"
                                isLoading={isFileDownloadingDetail?.id === file?.id && isFileDownloadingDetail?.isDownloading}
                              />
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </TableBodyLoad>
                </Table>
              </Tab>

              <Tab eventKey="Activity" title="Activity" >
                <UserActivityView />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
      <ConfirmBox
        show={isDeleted}
        primaryButtonClick={() => setIsDeleted(false)}
        handleClose={() => { setIsDeleted(false) }}
        secondaryButtonClick={handleDeleteUser}
        modalHeader="Do you want to delete the user?"
        primaryButtonText={"No"}
        secondaryButtonTextDataTestId={`user-delete-confirm-btn`}
        primaryButtonTextDataTestId={`user-delete-cancel-btn`}

        primaryButtonClass="gray-btn font-14 px-4 py-2"
        secondaryButtonText={"Yes"}
        secondaryButtonclass="btn-deepgreen font-14 px-4 py-2"
      />

      <ConfirmBox
        show={isStatusUpdate}
        primaryButtonClick={() => setIsStatusUpdate(false)}
        handleClose={() => { setIsStatusUpdate(false) }}
        secondaryButtonClick={handleUpdateUserStatus}
        modalHeader={`Do you want to ${singleUserDetail?.data?.userDetail?.status !== 1 ? 'Activate' : 'Deactivate'} the user?`}
        secondaryButtonTextDataTestId={`user-status-confirm-btn`}
        primaryButtonTextDataTestId={`user-status-cancel-btn`}
        primaryButtonText={"No"}
        primaryButtonClass="gray-btn font-14 px-4 py-2"
        secondaryButtonText={"Yes"}
        secondaryButtonclass="btn-deepgreen font-14 px-4 py-2"
      />
    </section>
  );
};

export default UserDetailView;
