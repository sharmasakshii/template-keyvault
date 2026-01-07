import TitleComponent from "../../component/tittle";
import Heading from "../../component/heading";
import ButtonComponent from "../../component/forms/button/index";
import { Row, Col } from "reactstrap";
import ImageComponent from "../../component/images";
import RoleManagementController from "./roleManagementController"
import RoleListView from "./RoleListView";
import AddUser from "../userManagement/AddUser"
import { Link } from "react-router-dom";
import Spinner from "component/spinner";

const RoleManagementView = () => {

    const {
        pageSize,
        handlePageChange,
        currentPage,
        setCurrentPage,
        isRoleListLoading,
        showRoleListView,
        handleSearchText,
        searchText,
        handleChangeOrder,
        colName,
        order,
        handelShowRoleOption,
        showRoleOption,
        showRoleDeleteModal,
        setShowRoleDeleteModal,
        handleDeleteRole,
        setShowRoleOption,
        roleDto,
        setRoleDto,
        multiSelectRoleForDelete,
        roleList,
        handlEditRole,
        handleShowAddRoleForm,
        showAddRoleForm,
        handleCloseAddRoleForm,
        userRoleList,
        setSearchText
    } = RoleManagementController();

    return (
        <section data-testid="roleManagement-screen" className='roleManagement-screen py-2 px-2'>
            <TitleComponent title={"Role Management"} pageHeading={"Role Management"} />
            <div className='role-ManagementUser'>
                {isRoleListLoading && !showRoleListView && <Spinner spinnerClass="justify-content-center" />}
                {showRoleListView && (
                    <RoleListView
                        pageSize={pageSize}
                        handlePageChange={handlePageChange}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        isRoleListLoading={isRoleListLoading}
                        roleList={roleList}
                        handleSearchText={handleSearchText}
                        searchText={searchText}
                        handleChangeOrder={handleChangeOrder}
                        colName={colName}
                        order={order}
                        handelShowRoleOption={handelShowRoleOption}
                        showRoleOption={showRoleOption}
                        deleteRole={handleDeleteRole}
                        showRoleDeleteModal={showRoleDeleteModal}
                        setShowRoleDeleteModal={setShowRoleDeleteModal}
                        setShowRoleOption={setShowRoleOption}
                        roleDto={roleDto}
                        setRoleDto={setRoleDto}
                        multiSelectRoleForDelete={multiSelectRoleForDelete}
                        handlEditRole={handlEditRole}
                        handleShow={handleShowAddRoleForm}
                    />)}
                {!showRoleListView && !isRoleListLoading && (
                    <div className="role-ManagementouterCard py-lg-0 py-3 ">
                        <div className='px-3 role-ManagementInnerCard'>
                            <Row className="align-items-center justify-content-center">
                                <Col xxl="6" xl="7" lg="8">
                                    <div className="mainGrayCards text-center createUserCard h-100 py-5">
                                        <div className="mb-4">
                                            <Heading level="3" content="To add a user start with Creating a Role" />
                                        </div>
                                        <div className="pb-4">
                                            <ImageComponent path="/images/createUser.svg" />
                                        </div>
                                        <Link to="/role-management/create-role">
                                            <ButtonComponent
                                                text="Create Role"
                                                btnClass="btn-deepgreenLg font-14"
                                            />
                                        </Link>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                )}
            </div>
            <AddUser
                show={showAddRoleForm}
                handleClose={handleCloseAddRoleForm}
                roleList={userRoleList}
                isRole
                setCurrentPage={setCurrentPage}
                setSearchText={setSearchText}
                pageSize={pageSize}
                colName={colName}
                order={order}
            />
        </section>
    )
}

export default RoleManagementView