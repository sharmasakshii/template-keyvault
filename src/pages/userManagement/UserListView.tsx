import { useState } from "react";
import { Form } from "react-bootstrap";
import ButtonComponent from "../../component/forms/button";
import Heading from "../../component/heading";
import ImageComponent from "../../component/images";
import { FormGroup, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import moment from "moment";
import { getUserStatus, sortIcon, handleProfileImage } from "utils";
import SelectDropdown from "component/forms/dropdown";
import { DebounceInput } from "react-debounce-input";
import ConfirmBox from "../../component/DailogBox/ConfirmBox";
import InputField from "component/forms/input";
import CustomModal from "component/DailogBox/CustomModal";
import Spinner from "component/spinner";
import TableBodyLoad from "component/tableBodyHandle";
import Pagination from 'component/pagination';

const UserListView = (props: any) => {

  const {
    userListId,
    userList,
    handlePageChange,
    pageSize,
    currentPage,
    setCurrentPage,
    searchText,
    handleSearchText,
    handleChangeOrder,
    colName,
    order,
    handelShowUserOption,
    showUserOption,
    showUserDeleteModal,
    setShowUserDeleteModal,
    deleteUser,
    setShowUserOption,
    userDto,
    setUserDto,
    handleMultiSelectUser,
    multiSelectUserForDelete,
    handleSelectAll,
    handleShow,
    selectAllUser,
    handlEditUser,
    setIsDeleted,
    showAdvanceSearch,
    formikSearch,
    handleToggle,
    isShowfilter,
    userRoleList,
    isDeleted,
    options,
    handleDropdownChange,
    handleResetForm,
    showResetAdvanceSearch,
    setMultiSelectUserForDelete,
    deleteBtnId,
    tableIdDelete,
    ViewBtn,
    dotsImageId,
    EditBtn,
    statusBtn,
    activateBtn,
    statusDeleteBtn,
    resetFormId,
    addUserId,
    navigate,
    startMaxDate,
    setStartMaxDate,
    endMinDate,
    setEndMinDate,
    checkStartDate,
    handleLoginActivity,
    loginActivityData,
    isLoadingActivityLog,
    handleUserGuideDownload,
    isUserListLoading,
    fileDownloadLoading
  } = props;

  let message = "";
  if (userDto?.status === 1) {
    message = "Do you want to activate this user?";
  } else if (userDto?.status === 2) {
    message = "Do you want to deactivate this user?";
  } else if (isDeleted && (multiSelectUserForDelete?.length === 0 || !multiSelectUserForDelete)) {
    message = "Do you want to delete this user?";
  } else if (isDeleted && multiSelectUserForDelete?.length > 0) {
    message = `Do you want to delete ${multiSelectUserForDelete?.length} ${multiSelectUserForDelete?.length > 1 ? "users" : "user"
      }?`;
  }

  const [showLoginActivityModal, setShowLoginActivityModal] = useState(false);
  const loginActivity = (userId: number | string) => {
    handleLoginActivity(userId)
    setShowLoginActivityModal(true)
  };

  const emptyValues = (values: any) => {
    const { role_id, name, start_date, end_date, email, status } = values;
    return (
      !name &&
      !start_date &&
      !end_date &&
      !status &&
      !email &&
      !role_id
    )
  }

  return (
    <section
      data-testid={userListId}
      className="userManagement-screen pt-0 py-3"
    >
      <div className="userManagement-Wraper" >
        {/* user management user listing html starts */}
        <div className="userManagement_List">
          <div className="d-xxl-flex gap-2 justify-content-between align-items-center bottomline pb-3 p-3 pt-0 w-100">
            <div className="d-flex gap-3 align-items-center mb-xxl-0 mb-2">
              <Heading level="4" content="Users List" />
              {multiSelectUserForDelete?.length > 0 && (
                <ButtonComponent
                  data-testid={deleteBtnId}
                  onClick={() => {
                    setIsDeleted(true);
                    setUserDto("");
                    setShowUserDeleteModal(true);
                  }}
                  text="Delete"
                  btnClass="dangerBtn font-14"
                  imagePath="/images/delete.svg"
                />
              )}
            </div>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2 mb-lg-0">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <div className="position-relative searchWrapper d-sm-flex align-items-center mb-2 mb-lg-0">
                  <div className=" search-carrier">
                    <div className="position-relative" data-testid="search-user-filter">
                      <span className="height-0 d-block">
                        <ImageComponent
                          path="/images/search.svg"
                          className="pe-0 searchIcon search-img"
                        />
                      </span>
                      <DebounceInput
                        type="text"
                        minLength={3}
                        debounceTimeout={300}
                        placeholder="Search User Name"
                        value={searchText}
                        onChange={handleSearchText}
                        className="font-14 form-control"
                      />
                    </div>
                  </div>
                  {isShowfilter &&
                    <Dropdown isOpen={showAdvanceSearch} toggle={handleToggle}>
                      <DropdownToggle data-testid="Advanced-Search" className="advanceSearch">Advanced Search</DropdownToggle>
                      <DropdownMenu>
                        <Form onSubmit={formikSearch?.handleSubmit}>
                          <div data-testid="Advanced-Search-fields" className="">
                            <div className="select-box d-flex gap-3" >
                              <Form.Group className="w-100">
                                <Form.Label>Role </Form.Label>
                                <SelectDropdown
                                  aria-label="role-user"
                                  options={userRoleList?.data?.map((i: any) => { return { label: i?.name, value: i?.id } })}
                                  selectedValue={formikSearch?.values?.role_id}
                                  placeholder="Role"
                                  customClass="w-100"
                                  onChange={(e: any) => {
                                    formikSearch?.setFieldValue("role_id", e)
                                  }} />

                              </Form.Group>

                              <Form.Group
                                className="w-100"
                                controlId="exampleForm.ControlInput1"
                              >
                                <InputField
                                  testid="search-fliter-name"
                                  type="text"
                                  name="name"
                                  Id="name"
                                  placeholder="Enter Name"
                                  label="Enter Name"
                                  onChange={formikSearch?.handleChange}
                                  value={formikSearch?.values.name}
                                />
                              </Form.Group>
                            </div>

                            <div className="d-flex gap-3 mb-0">
                              <Form.Group
                                className="mb-3 w-100"
                                controlId="exampleForm.ControlInput1"
                              >
                                <Form.Label>Start Date</Form.Label>
                                <Input
                                  data-testid="search-start-date"
                                  id="start_date"
                                  name="start_date"
                                  placeholder="date placeholder"
                                  className="text-uppercase"
                                  type="date"
                                  max={startMaxDate || moment().format("YYYY-MM-DD")}
                                  onChange={(e) => {
                                    setEndMinDate(e.target.value)
                                    formikSearch?.handleChange?.(e)
                                    checkStartDate(false)
                                  }}
                                  value={formikSearch?.values.start_date}
                                />
                              </Form.Group>
                              <Form.Group
                                className="mb-3 w-100"
                                controlId="exampleForm.ControlInput1"
                              >
                                <Form.Label>End Date</Form.Label>
                                <Input
                                  data-testid="search-end-date"
                                  id="end_date"
                                  name="end_date"
                                  placeholder="date placeholder"
                                  className="text-uppercase"
                                  type="date"
                                  min={endMinDate}
                                  max={moment(new Date()).format("YYYY-MM-DD")}
                                  onChange={(e) => {
                                    setStartMaxDate(e.target.value)
                                    formikSearch?.handleChange?.(e)
                                    !endMinDate && checkStartDate(true)
                                  }
                                  }
                                  value={formikSearch?.values.end_date}
                                />
                              </Form.Group>

                            </div>
                            <div className="select-box d-flex gap-3 mb-3">

                              <Form.Group
                                className="w-50"
                                controlId="exampleForm.ControlInput1"
                              >
                                <InputField
                                  testid="search-email-address"
                                  type="text"
                                  name="email"
                                  Id="email"
                                  placeholder="Enter Email"
                                  label="Email Address"
                                  onChange={formikSearch.handleChange}
                                  value={formikSearch.values.email}
                                />
                              </Form.Group>
                              <Form.Group
                                className="w-50"
                                controlId="exampleForm.ControlInput1"
                              >
                                <Form.Label>Status </Form.Label>
                                <SelectDropdown
                                  aria-label="search-status"
                                  placeholder="Status"
                                  options={options}
                                  onChange={handleDropdownChange}
                                  selectedValue={formikSearch.values.status}
                                />
                              </Form.Group>
                            </div>
                            <ButtonComponent
                              text="Submit"
                              data-testid="submit-search-fields"
                              btnClass="btn-deepgreen font-14 w-100"
                              type="submit"
                              disabled={emptyValues(formikSearch.values)}
                            />
                          </div>
                        </Form>
                      </DropdownMenu>
                    </Dropdown>}
                </div>
                {isShowfilter &&
                  <div className="d-flex gap-2 ">
                    {showResetAdvanceSearch === true &&
                      <ButtonComponent
                        onClick={() => handleResetForm()}
                        text="Reset"
                        btnClass="btn-deepgreen font-14"
                        data-testid={resetFormId}
                      />
                    }
                    <ButtonComponent
                      onClick={() => handleShow()}
                      text=" Add User"
                      btnClass="btn-deepgreen font-14"
                      data-testid={addUserId}
                    />
                    <ButtonComponent
                      onClick={() => navigate("/role-management/create-role")}
                      text=" Create Role"
                      btnClass="btn-deepgreen font-14"
                      data-testid="create-role-user"
                    />
                  </div>}
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="line"></span>
                <ButtonComponent data-testid="handleUserGuideDownload" onClick={handleUserGuideDownload} isLoading={fileDownloadLoading} text="User Management Document" imagePath="/images/download-icon.svg" btnClass="px-0 btn-transparent download-btn d-flex align-items-center gap-2 text-deepgreen font-14 fw-medium text-decoration-underline" />
              </div>
            </div>
          </div>

          <div className="">
            <div className="static-table mt-4 pb-4">
              <div className="tWrap">
                <div className="tWrap__head">
                  <table>
                    <thead>
                      <tr>
                        <th>
                          <div className="d-flex gap-3" >
                            {isShowfilter && <FormGroup check>
                              <Input
                                data-testid={tableIdDelete}
                                type="checkbox"
                                checked={selectAllUser}
                                onChange={(e) => handleSelectAll(e)}
                              />
                            </FormGroup>}
                            <button
                            className="border-0 bg-transparent"
                              type="button"
                              data-testid="change-order-name-user-btn" onClick={() => handleChangeOrder("name")}>
                              Full Name <span data-testid="change-order-name-user">
                                <ImageComponent
                                  className="pe-0"
                                  imageName={`${sortIcon(
                                    "name",
                                    colName,
                                    order
                                  )}`}
                                />
                              </span>
                            </button>
                          </div>
                        </th>
                        <th onClick={() => handleChangeOrder("createdAt")}>
                          Created on <span data-testid="change-order-createdAt-user">
                            <ImageComponent
                              className="pe-0"
                              imageName={`${sortIcon(
                                "createdAt",
                                colName,
                                order
                              )}`}
                            />
                          </span>
                        </th>
                        <th onClick={() => handleChangeOrder("role")}>
                          Role <span data-testid="change-order-role-user">
                            <ImageComponent
                              className="pe-0"
                              imageName={`${sortIcon("role", colName, order)}`}
                            />
                          </span>
                        </th>
                        <th onClick={() => handleChangeOrder("email")}>
                          Email Address <span data-testid="change-order-email-user">
                            <ImageComponent
                              className="pe-0"
                              imageName={`${sortIcon("email", colName, order)}`}
                            />
                          </span>
                        </th>
                        <th>Contact Number</th>
                        <th onClick={() => handleChangeOrder("status")}>
                          Status <span data-testid="change-order-status-user">
                            <ImageComponent
                              className="pe-0"
                              imageName={`${sortIcon(
                                "status",
                                colName,
                                order
                              )}`}
                            />
                          </span>
                        </th>
                        <th>Action</th>
                      </tr>
                    </thead>
                  </table>
                </div>
                <div className="tWrap__body">
                  <table>
                    <TableBodyLoad colSpan={7} noDataMsg="No Record Found" isLoading={isUserListLoading} isData={userList?.data?.list?.length > 0}>
                      <tbody>
                        {userList?.data?.list?.map((item: any, index: any) => (
                          <tr key={item?.id} className="position-relative" >
                            <td>
                              <div className="d-flex gap-3 align-items-center" data-testid={`multi-select-checkbox ${index}`}>
                                <FormGroup check>
                                  {isShowfilter && <Input
                                    data-testid={`multi-select-field ${index}`}
                                    type="checkbox"
                                    checked={multiSelectUserForDelete?.some(
                                      (ele: any) => ele === item?.id
                                    )}
                                    onChange={(e) =>
                                      handleMultiSelectUser(item?.id, e)
                                    }
                                  />}
                                </FormGroup>
                                <div className="d-flex align-items-center">
                                  <ImageComponent
                                    className=" pe-0"
                                    imageName="default.svg"
                                    path={item?.image}
                                    handleImageError={handleProfileImage}
                                  />
                                  <h6 className="mb-0 ps-2">
                                    {item?.first_name}{" "}
                                    {item?.last_name}
                                  </h6>
                                </div>
                              </div>
                            </td>
                            <td>
                              <h6 className="mb-0">
                                {moment(item?.createdAt).format("DD-MMM-YYYY")}
                              </h6>
                            </td>
                            <td>
                              <h6 className="mb-0">{item?.userDetailsRole?.name}</h6>
                            </td>
                            <td>
                              <h6 className="mb-0">{item?.email}</h6>
                            </td>
                            <td>
                              <h6 className="mb-0">
                                {item?.phone_number}{" "}
                              </h6>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div
                                  className={`${getUserStatus(item?.status).color
                                    }  me-2`}
                                ></div>
                                <h6 className="mb-0">
                                  {getUserStatus(item?.status).name}
                                </h6>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex justify-content-start action-btn-dropdown">
                                <Dropdown
                                  isOpen={showUserOption === item.id}
                                  toggle={() => {
                                    handelShowUserOption(item?.id);
                                  }}
                                >
                                  <DropdownToggle
                                    caret
                                    data-testid={`user-dropdown-caret-${index}`}
                                    className={
                                      showUserOption === item?.id
                                        ? "bgAction_circle"
                                        : "bg_circle"
                                    }
                                  >
                                    <ImageComponent
                                      path="/images/dots3.svg"
                                      testid={`${dotsImageId} ${index}`}
                                      className="pe-0"
                                    />
                                  </DropdownToggle>
                                  <DropdownMenu>
                                    <div
                                      className={`action-btnlist flex-column gap-2`}>
                                      <DropdownItem className="gray-btn justify-content-start rounded-2 font-14 w-100 mb-2" onClick={() => handlEditUser(item, "view")}>
                                        <div data-testid={`${ViewBtn} ${index}`}>
                                          <ImageComponent path="/images/eyeicon.svg" />
                                          View
                                        </div>
                                      </DropdownItem>
                                      <DropdownItem className="gray-btn justify-content-start rounded-2 font-14 w-100 mb-2" onClick={() => loginActivity(item?.id)}>
                                        <div data-testid={`login_activity_${index}`}>
                                          <ImageComponent path="/images/login-activity.svg" />
                                          Login Activity
                                        </div>

                                      </DropdownItem>
                                      <DropdownItem className="gray-btn justify-content-start rounded-2 font-14 w-100 mb-2" onClick={() => handlEditUser(item, "edit")}>
                                        <div data-testid={`${EditBtn} ${index}`}>
                                          <ImageComponent path="/images/edit.svg" />
                                          Edit
                                        </div>
                                      </DropdownItem>
                                      {item?.status === 1 && (<DropdownItem onClick={() => {
                                        setUserDto({
                                          userInfo: item,
                                          status: 2,
                                        });
                                        setShowUserDeleteModal(true);
                                        setShowUserOption(null);
                                      }} className="gray-btn justify-content-start rounded-2 font-14 w-100 mb-2">
                                        <div data-testid={`${statusBtn} ${index}`}>
                                          <ImageComponent path="/images/deactivate.svg" />
                                          Deactivate
                                        </div>
                                      </DropdownItem>)}
                                      {item?.status === 2 && (<DropdownItem onClick={() => {
                                        setUserDto({
                                          userInfo: item,
                                          status: 1,
                                        });
                                        setShowUserDeleteModal(true);
                                        setShowUserOption(null);
                                      }} className="btn-deepgreen justify-content-start rounded-2 font-14 w-100 mb-2">
                                        <div data-testid={`${activateBtn} ${index}`}>
                                          <ImageComponent path="/images/reactivate.svg" />
                                          Activate
                                        </div>
                                      </DropdownItem>)}
                                      <DropdownItem onClick={() => {
                                        setIsDeleted(true);
                                        setUserDto({
                                          userInfo: item,
                                          status: 3,
                                        });
                                        setMultiSelectUserForDelete([])
                                        setShowUserDeleteModal(true);
                                        setShowUserOption(null);
                                      }} className="dangerBtn justify-content-start rounded-2 font-14">
                                        <div data-testid={`${statusDeleteBtn} ${index}`}>
                                          <ImageComponent path="/images/delete.svg" />
                                          Delete
                                        </div>

                                      </DropdownItem>
                                    </div>
                                  </DropdownMenu>
                                </Dropdown>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </TableBodyLoad>
                  </table>
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
                    total={userList?.data?.pagination?.total_count}
                    handlePageSizeChange={(e: any) => {
                      handlePageChange(e);
                    }}
                    handlePageChange={(page: number) => {
                      setCurrentPage(page);
                    }}
                  />

                </nav>
              </div>
              <CustomModal
                show={showLoginActivityModal}
                handleClose={() => setShowLoginActivityModal(false)}
                modalHeader={"Login Activity Overview"}
                modalClass="loginActivity"
              >
                {isLoadingActivityLog ? <Spinner spinnerClass="justify-content-center my-5" /> :
                  <div className="activityBody p-3 pb-0">
                    {loginActivityData?.data?.lastLogin && <>
                      <div className="mb-3 data-height d-flex align-items-center gap-2 justify-content-between border-bottom pb-3">
                        <Heading level="3" content="Last Login" className="font-16 fw-medium mb-0" />
                        <Heading level="3" content={moment(loginActivityData?.data?.lastLogin).format(`MMM DD YYYY | hh:mm A`)} className="font-18 fw-medium mb-0" />
                      </div>
                      <div className="mb-3 data-height d-flex gap-2 justify-content-between border-bottom pb-3">
                        <div>
                          <Heading level="3" content="Weekly Login Count" className="font-16 fw-medium mb-2" />
                          <Heading level="5" content={`${moment(loginActivityData?.data?.weeklyLoginCount?.startDate).format("MMM DD YYYY")} to ${moment(loginActivityData?.data?.weeklyLoginCount?.endDate).format("MMM DD YYYY")}`} className="font-12 fw-normal mb-0" />
                        </div>
                        <Heading level="3" content={loginActivityData?.data?.weeklyLoginCount?.count} className="font-18 fw-medium mb-0" />
                      </div>
                      <div className="data-height d-flex gap-2 justify-content-between mb-2">
                        <div>
                          <Heading level="3" content="Monthly Login Count" className="font-16 fw-medium mb-2" />
                          <Heading level="5" content={`${moment(loginActivityData?.data?.monthlyLoginCount?.startDate).format("MMM DD YYYY")} to ${moment(loginActivityData?.data?.monthlyLoginCount?.endDate).format("MMM DD YYYY")}`} className="font-12 fw-normal mb-0" />
                        </div>
                        <Heading level="3" content={loginActivityData?.data?.monthlyLoginCount?.count} className="font-18 fw-medium mb-0" />
                      </div></>}
                    {!loginActivityData?.data?.lastLogin && <Heading level="3" content="It looks like the user hasn't logged in yet." className="font-16 text-center fw-medium mb-0 mt-5" />}

                  </div>
                }

              </CustomModal>

              {/* download modal */}
              <ConfirmBox
                show={showUserDeleteModal}
                primaryButtonClick={() => setShowUserDeleteModal(false)}
                handleClose={() => setShowUserDeleteModal(false)}
                secondaryButtonClick={() => deleteUser()}
                modalHeader={message}
                primaryButtonText={"No"}
                secondaryButtonTextDataTestId={`user-delete-confirm-btn`}
                primaryButtonTextDataTestId={`user-delete-cancel-btn`}

                primaryButtonClass="gray-btn font-14 px-4 py-2"
                secondaryButtonText={"Yes"}
                secondaryButtonclass="btn-deepgreen font-14 px-4 py-2"
              />
            </div>
          </div>
        </div>
      </div>
    </section >
  );
};

UserListView.defaultProps = {
  isShowfilter: true,
}


export default UserListView;
