import TitleComponent from "../../../component/tittle";
import { Row, Col } from "reactstrap";
import InputField from 'component/forms/input';
import { Form } from 'react-bootstrap';
import { removeSpaceOnly } from "utils";

import ButtonComponent from "../../../component/forms/button/index";
import CreateRolController from "./createRolController"
import AddUser from "../../userManagement/AddUser"
import Loader from "component/loader/Loader";
import BackLink from "component/forms/backLink";
import PermissionView from "../Permission"

const CreateRoleView = () => {

    const {
        moduleListDto,
        formikRole,
        handleSubmitRoleUserForm,
        showAddRoleForm,
        handleCloseAddRoleForm,
        userRoleList,
        createRoleDto,
        isCreateRoleDtoLoading,
        handleChangePremission,
        showErrorMessage,
        isRoleListLoading,
        isModuleList
    } = CreateRolController();
    return (
        <section className='roleManagement-screen py-2 px-2'>
            <TitleComponent title={"Role Management"} pageHeading={"Create Role"} />
            <Loader
                isLoading={[
                    isCreateRoleDtoLoading,
                    isRoleListLoading,
                    isModuleList
                ]}
            />
            <div data-testid="create-role-form" className='role-Management p-3'>
                <div className="d-flex border-bottom mb-3">
                    <BackLink btnText="Back" link="role-management" />
                </div>

                <Form onSubmit={formikRole.handleSubmit}>

                    <Row>
                        <Col lg="6">

                            <InputField
                                type="text"
                                name="name"
                                Id="name"
                                placeholder="Enter Role Name"
                                label="Role Name *"
                                onChange={formikRole.handleChange}
                                value={formikRole.values.name}
                                onKeyDown={(e: any) => removeSpaceOnly(e)}
                                testid="role-name"
                            />
                            {formikRole.touched.name &&
                                formikRole.errors.name && (
                                    <span className="text-danger font-14">
                                        {formikRole.errors.name}
                                    </span>
                                )}
                        </Col>
                        <Col lg="6">
                            <InputField
                                type="textarea"
                                name="description"
                                Id="description"
                                placeholder="Enter Description"
                                label="Description"
                                onChange={formikRole.handleChange}
                                value={formikRole.values.description}
                                testid="role-desc"
                            />
                            {formikRole.touched.description &&
                                formikRole.errors.description && (
                                    <span className="text-danger font-14">
                                        {formikRole.errors.description}
                                    </span>
                                )}
                        </Col>
                    </Row>
                    <div>
                        <PermissionView moduleListDto={moduleListDto} handleChangePremission={handleChangePremission} showErrorMessage={showErrorMessage} />

                        <div className='d-flex w-100 justify-content-end gap-3'>
                            <ButtonComponent
                                text="Submit"
                                btnClass="outlineBtn-deepgreen font-14 px-3"
                                type="submit"
                                disabled={isCreateRoleDtoLoading}
                            />
                            <ButtonComponent
                                text="Submit and Add User"
                                btnClass="btn-deepgreen font-14"
                                type="button"
                                disabled={isCreateRoleDtoLoading}
                                onClick={handleSubmitRoleUserForm}
                                data-testid="submit-and-add-user"
                            />
                        </div>
                    </div>
                </Form>

                <AddUser
                    show={showAddRoleForm}
                    handleClose={handleCloseAddRoleForm}
                    roleList={userRoleList}
                    isRole
                    isAddUser
                    selectedRoleDto={createRoleDto?.data}
                />
            </div>
        </section>
    )
}

export default CreateRoleView