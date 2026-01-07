import ButtonComponent from "../../component/forms/button";
import Heading from "../../component/heading";
import ImageComponent from "../../component/images";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { sortIcon } from "utils";
import { DebounceInput } from "react-debounce-input";
import ConfirmBox from "../../component/DailogBox/ConfirmBox";
import { Link } from "react-router-dom";
import TableBodyLoad from "component/tableBodyHandle";
import Pagination from 'component/pagination';

const RoleListView = (props: any) => {

    const {
        roleList,
        handlePageChange,
        pageSize,
        currentPage,
        setCurrentPage,
        searchText,
        handleSearchText,
        handleChangeOrder,
        colName,
        order,
        handelShowRoleOption,
        showRoleOption,
        showRoleDeleteModal,
        setShowRoleDeleteModal,
        deleteRole,
        setShowRoleOption,
        setRoleDto,
        handleShow,
        handlEditRole,
        isRoleListLoading
    } = props;


    return (
        <section
            data-testid="user-management-list-view"
            className="userManagement-screen roleManagement-screen pt-0 py-3"
        >
            <div className="userManagement-Wraper">
                {/* user management user listing html starts */}
                <div className="userManagement_List">
                    <div className="d-lg-flex justify-content-between align-items-center bottomline pb-3 px-3">
                        <div className="d-flex gap-3 align-items-center mb-2 mb-lg-0">
                            <Heading level="4" content="List of Roles" />
                        </div>
                        <div className="d-md-flex justify-content-end gap-2 mb-2 mb-lg-0">
                            <div className="position-relative searchWrapper d-sm-flex align-items-center mb-2 mb-lg-0">
                                <div className=" search-carrier">
                                    <div className="position-relative" data-testid="role-search-input-wrapper">
                                        <span className="height-0 d-block">
                                            <ImageComponent
                                                path="/images/search.svg"
                                                className="pe-0 searchIcon search-img"
                                            />
                                        </span>
                                        <DebounceInput
                                            type="text"
                                            data-testid="role-search-input"
                                            minLength={3}
                                            debounceTimeout={300}
                                            placeholder="Search Role Name"
                                            value={searchText}
                                            onChange={handleSearchText}
                                            className="font-14 form-control"
                                        />
                                    </div>
                                </div>

                            </div>
                            <div className="d-flex gap-2 ">
                                <ButtonComponent
                                    data-testid="add-role"
                                    onClick={() => handleShow()}
                                    text="Add User"
                                    btnClass="btn-deepgreen font-14"
                                    disabled={isRoleListLoading}
                                />
                                <Link to={"/role-management/create-role"} >
                                    <ButtonComponent
                                        text=" Create Role"
                                        btnClass="btn-deepgreen font-14"
                                        disabled={isRoleListLoading}
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="">
                        <div className="static-table roleList-Table mt-4 pb-4">
                            <div className="tWrap">
                                <div className="tWrap__head ">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>
                                                    <div className="d-flex align-items-center gap-3">

                                                        <div>
                                                            Role Name
                                                            {''}
                                                            <button
                                                                type="button"
                                                                data-testid="role-name-sort-icon"
                                                                onClick={() => handleChangeOrder("name")}
                                                                className="bg-transparent border-0 "
                                                            >
                                                                <ImageComponent
                                                                    className="pe-0"
                                                                    imageName={`${sortIcon(
                                                                        "name",
                                                                        colName,
                                                                        order
                                                                    )}`}
                                                                />
                                                            </button>
                                                        </div>

                                                    </div>
                                                </th>
                                                <th>
                                                    No. of users
                                                </th>
                                                <th>
                                                    Created by
                                                </th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <TableBodyLoad colSpan={4} noDataMsg="No Record Found" isLoading={isRoleListLoading} isData={roleList?.data?.roleUserCounts?.length > 0}>
                                            <tbody>
                                                {roleList?.data?.roleUserCounts?.map((item: any, index: number) => (
                                                    <tr key={item?.id} className="position-relative">
                                                        <td>
                                                            <div className="d-flex gap-3 align-items-center">

                                                                <div className="d-flex align-items-center">

                                                                    <h6 className="mb-0">
                                                                        {item?.name}
                                                                    </h6>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <h6 className="mb-0">{item?.userCount}</h6>
                                                        </td>
                                                        <td>
                                                            <h6 className="mb-0">
                                                                {item?.created_by}
                                                            </h6>
                                                        </td>


                                                        <td>
                                                            <div className="d-flex justify-content-start action-btn-dropdown">
                                                                <Dropdown
                                                                    data-testid={`role-dropdown-${index}`}
                                                                    isOpen={showRoleOption === item?.id}
                                                                    toggle={() => {
                                                                        handelShowRoleOption(item?.id);
                                                                    }}
                                                                >
                                                                    <DropdownToggle
                                                                        caret
                                                                        className={
                                                                            showRoleOption === item?.id
                                                                                ? "bgAction_circle"
                                                                                : "bg_circle"
                                                                        }
                                                                        data-testid={`role-dropdown-caret-${index}`}

                                                                    >
                                                                        <ImageComponent
                                                                            path="/images/dots3.svg"
                                                                            className="pe-0"
                                                                        />
                                                                    </DropdownToggle>
                                                                    <DropdownMenu>
                                                                        <div
                                                                            className={`action-btnlist flex-column gap-2 `}
                                                                        >
                                                                            <DropdownItem onClick={() => handlEditRole(item, "view")} className="gray-btn justify-content-start rounded-2 font-14 w-100 mb-2">
                                                                                <div data-testid={`role-view-${index}`}>
                                                                                    <ImageComponent path="/images/eyeicon.svg" />
                                                                                    View
                                                                                </div>
                                                                            </DropdownItem>
                                                                            <DropdownItem onClick={() => handlEditRole(item, "edit-role")} className="gray-btn justify-content-start rounded-2 font-14 w-100 mb-2">
                                                                                <div data-testid={`role-edit-${index}`}>
                                                                                    <ImageComponent path="/images/edit.svg" />
                                                                                    Edit
                                                                                </div>
                                                                            </DropdownItem>
                                                                            <DropdownItem onClick={() => {
                                                                                setRoleDto({
                                                                                    userInfo: item,
                                                                                    status: 1,
                                                                                    isDelete: true
                                                                                });
                                                                                setShowRoleDeleteModal(true);
                                                                                setShowRoleOption(null);
                                                                            }} className="dangerBtn justify-content-start rounded-2 font-14 w-100">
                                                                                <div data-testid={`role-delete-${index}`}>
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
                                        total={roleList?.data?.pagination?.total_count}
                                        handlePageSizeChange={(e: any) => {
                                            handlePageChange(e);
                                        }}
                                        handlePageChange={(page: number) => {
                                            setCurrentPage(page);
                                        }}
                                    />
                                </nav>
                            </div>
                            {/* download modal */}
                            <ConfirmBox
                                show={showRoleDeleteModal}
                                primaryButtonClick={() => setShowRoleDeleteModal(false)}
                                handleClose={() => setShowRoleDeleteModal(false)}
                                secondaryButtonClick={() => deleteRole()}
                                secondaryButtonTextDataTestId={`role-delete-confirm-btn`}
                                primaryButtonTextDataTestId={`role-delete-cancel-btn`}
                                modalHeader="Do you want to delete this role?"
                                primaryButtonText={"No"}
                                primaryButtonClass="gray-btn font-14 px-4 py-2"
                                secondaryButtonText={"Yes"}
                                secondaryButtonclass="btn-deepgreen font-14 px-4 py-2"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RoleListView;
