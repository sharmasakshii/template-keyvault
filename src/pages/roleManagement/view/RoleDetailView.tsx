import TitleComponent from "../../../component/tittle";
import { Row, Col } from "reactstrap";
import Heading from "../../../component/heading";
import ButtonComponent from "../../../component/forms/button/index";
import BackLink from "../../../component/forms/backLink/index";
import RoleDetailController from "./roleDetailController"
import UserListView from "../../userManagement/UserListView"
import { Link } from "react-router-dom";
import { UserPermission } from "component/userPermission";
import Spinner from "component/spinner";

const RoleDetailView = () => {

    const {
        roleDetail,
        isRoleDetailByIdLoading,
        pageSize,
        handlePageChange,
        currentPage,
        setCurrentPage,
        isUserListLoading,
        userList,
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
        setIsDeleted,
        handlEditUser,
        params,
        isDeleted,
        setMultiSelectUserForDelete
    } = RoleDetailController();

    return (
        <section className='roleManagement-screen py-2 px-2'>
            <TitleComponent title={"Role Details"} pageHeading={"Role Details"} />
            <div data-testid="role-detail-screen" className='role-Management'>
                <div className="roleView-manager border-bottom p-3 mb-3">
                    <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <BackLink btnText="Back" link="role-management" />
                        <Link to={`/role-management/edit-role/${params?.roleId}`} >
                            <ButtonComponent
                                text="Edit"
                                btnClass="outlineBtn-deepgreen font-14 px-3 py-2"
                                disabled={isRoleDetailByIdLoading}
                            />
                        </Link>
                    </div>
                </div>
                <div className="roleview-manager-userlist">
                    {isRoleDetailByIdLoading ? <Spinner spinnerClass="py-5 my-5 justify-content-center align-items-center" /> : <>
                        <div className="border-bottom pb-4 mb-3 px-3">
                            <Row>
                                <Col xl={6}>
                                    <div className="uploadImageSection pe-4">
                                        <Heading
                                            level="4"
                                            content="Role Details"
                                            className="font-18 font-xxl-20 fw-semibold mb-4"
                                        />
                                        <Row>
                                            <Col sm={5}>
                                                <Heading
                                                    level="4"
                                                    content="Role Name"
                                                    className="font-14 font-xxl-16 fw-normal mb-3 text-lightGray"
                                                />
                                                <Heading
                                                    level="4"
                                                    content={roleDetail?.data?.roleData?.name}
                                                    className="font-14 font-xxl-16 fw-medium mb-2"
                                                />
                                            </Col>
                                            <Col sm={7} className="ps-sm-0">
                                                <Heading
                                                    level="4"
                                                    content="Description"
                                                    className="font-14 font-xxl-16 fw-normal mb-3 text-lightGray"
                                                />
                                                <Heading
                                                    level="4"
                                                    content={roleDetail?.data?.roleData?.description}
                                                    className="font-14 font-xxl-16 fw-normal mb-2"
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                                <Col xl={6} className="align-self-center">
                                    <div>
                                        <Heading
                                            level="4"
                                            content="Permissions"
                                            className="font-18 font-xxl-20 fw-semibold mb-2"
                                        />
                                        <UserPermission permissionDetail={roleDetail?.data?.permissionsData} />

                                    </div>
                                </Col>
                            </Row>
                        </div>
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
                            setIsDeleted={setIsDeleted}
                            isShowfilter={false}
                            handlEditUser={handlEditUser}
                            isDeleted={isDeleted}
                            setMultiSelectUserForDelete={setMultiSelectUserForDelete}
                        />
                    </>}
                </div>



            </div>
        </section>
    )
}

export default RoleDetailView