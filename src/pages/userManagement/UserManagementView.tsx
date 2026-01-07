import TitleComponent from "../../component/tittle";
import Heading from "../../component/heading";
import ButtonComponent from "../../component/forms/button/index";
import { Row, Col } from "reactstrap";
import AddUser from "./AddUser";
import ImageComponent from "../../component/images";
import UserManagementController from "./userManagementController";
import UserListView from "./UserListView";
import Spinner from "component/spinner";

/**
 * Renders the User Management view.
 *
 * @return {JSX.Element} The rendered User Management view.
 */
const UserManagementView = () => {
  const {
    pageSize,
    handlePageChange,
    currentPage,
    setCurrentPage,
    isUserListLoading,
    userList,
    showUserListView,
    handleSearchText,
    searchText,
    handleChangeOrder,
    colName,
    order,
    handelShowUserOption,
    showUserOption,
    showUserDeleteModal,
    setShowUserDeleteModal,
    handleDeleteUser,
    setShowUserOption,
    userDto,
    setUserDto,
    handleMultiSelectUser,
    multiSelectUserForDelete,
    handleSelectAll,
    showAddUserForm,
    handleCloseAddUserForm,
    handleShowAddUserForm,
    userRoleList,
    handlEditUser,
    selectAllUser,
    setIsDeleted,
    setSearchText,
    formikSearch,
    showAdvanceSearch,
    setShowAdvanceSearch,
    handleAdvanceSearchForm,
    handleShowAdvanceSearch,
    handleDropdownChange,
    options,
    handleResetForm,
    showResetAdvanceSearch,
    isDeleted,
    startMaxDate,
    setStartMaxDate,
    endMinDate,
    setEndMinDate,
    navigate,
    setMultiSelectUserForDelete,
    setIsStartDate,
    handleLoginActivity,
    isLoadingActivityLog, loginActivityData,
    handleUserGuideDownload,
    fileDownloadLoading
  } = UserManagementController();
  return (
    <section data-testid="user-management-view" className="userManagement-screen pb-4 pt-2 px-2">
      <TitleComponent title={"User Management"} pageHeading={"User Management"} />
      <div className="userManagement-Wraper" data-testid="user-list-view">
        {isUserListLoading && !showUserListView && <Spinner spinnerClass="justify-content-center" />}

        {showUserListView && (
          <UserListView
            userListId="user-list-id"
            deleteBtnId="btn-delete-id"
            tableIdDelete="table-select-id"
            searchId="search-lane-filter"
            dotsImageId="dots-id"
            ViewBtn="view-details"
            EditBtn="edit-details"
            statusBtn="status-1"
            activateBtn="status-2"
            statusDeleteBtn="status-3"
            resetFormId="reset-form"
            addUserId="add-user-id"
            pageSize={pageSize}
            navigate={navigate}
            handlePageChange={handlePageChange}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isUserListLoading={isUserListLoading}
            userList={userList}
            handleSearchText={handleSearchText}
            searchText={searchText}
            handleChangeOrder={handleChangeOrder}
            colName={colName}
            order={order}
            handelShowUserOption={handelShowUserOption}
            showUserOption={showUserOption}
            deleteUser={handleDeleteUser}
            showUserDeleteModal={showUserDeleteModal}
            setShowUserDeleteModal={setShowUserDeleteModal}
            setShowUserOption={setShowUserOption}
            userDto={userDto}
            setUserDto={setUserDto}
            handleMultiSelectUser={handleMultiSelectUser}
            multiSelectUserForDelete={multiSelectUserForDelete}
            setMultiSelectUserForDelete={setMultiSelectUserForDelete}
            handleSelectAll={handleSelectAll}
            handleShow={handleShowAddUserForm}
            handleShowSearch={handleShowAdvanceSearch}
            handlEditUser={handlEditUser}
            selectAllUser={selectAllUser}
            setIsDeleted={setIsDeleted}
            formikSearch={formikSearch}
            showAdvanceSearch={showAdvanceSearch}
            setShowAdvanceSearch={setShowAdvanceSearch}
            handleToggle={handleAdvanceSearchForm}
            userRoleList={userRoleList}
            roleList={userRoleList}
            options={options}
            handleDropdownChange={handleDropdownChange}
            handleResetForm={handleResetForm}
            isDeleted={isDeleted}
            showResetAdvanceSearch={showResetAdvanceSearch}
            startMaxDate={startMaxDate}
            setStartMaxDate={setStartMaxDate}
            endMinDate={endMinDate}
            setEndMinDate={setEndMinDate}
            checkStartDate={setIsStartDate}
            handleLoginActivity={handleLoginActivity}
            loginActivityData={loginActivityData}
            isLoadingActivityLog={isLoadingActivityLog}
            handleUserGuideDownload={handleUserGuideDownload}
            fileDownloadLoading={fileDownloadLoading}
          />)}
        {!showUserListView && !isUserListLoading && (
          <div className="userManagementUser bg-transparent" data-testid="user-list-empty">
            <div className="text-end">
              <ButtonComponent
                onClick={() => navigate("/role-management")}
                data-testid="role-management-btn"
                text="Role Management"
                btnClass="btn-deepgreen font-14 fw-normal"
              />

            </div>
            <Row className="item">
              <Col xl="10" className="mx-auto">
                <div className="userManagementInnerCard py-lg-0 py-3 px-3">
                  <Row className="align-items-center justify-content-center">
                    <Col lg="6">
                      <div className="mainGrayCards bg-white text-center createUserCard h-100">
                        <div className="mb-4">
                          <Heading
                            level="3"
                            content="Start creating a user"
                          />
                        </div>
                        <div className="pb-3">
                          <ImageComponent path="/images/createUser.svg" />
                        </div>

                        <ButtonComponent
                          data-testid="add-new-user-btn"
                          text="Add New User"
                          onClick={handleShowAddUserForm}
                          btnClass="btn-deepgreenLg"
                        />
                        <div></div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>)}

        <AddUser
          addUserId="add-user-modal"
          show={showAddUserForm}
          handleClose={handleCloseAddUserForm}
          roleList={userRoleList}
          isRole={false}
          setCurrentPage={setCurrentPage}
          setSearchText={setSearchText}
          pageSize={pageSize}
          colName={colName}
          order={order}
        />
      </div>
    </section>
  );
};

export default UserManagementView;



