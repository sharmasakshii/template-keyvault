import TitleComponent from "../../../component/tittle";
import { Row, Col } from "reactstrap";
import InputField from 'component/forms/input';
import { Form } from 'react-bootstrap';
import ButtonComponent from "../../../component/forms/button/index";
import EditRoleDetailController from "./editRoleDetailController"
import { removeSpaceOnly } from "utils";
import Loader from "component/loader/Loader";
import PermissionView from "../Permission"
import ErrorMessaage from "component/forms/errorMessaage";

const EditRoleView = () => {
    const {
        isRoleListLoading,
        isRoleDetailByIdLoading,
        formikRole,
        showErrorMessage,
        handleChangePremission,
        moduleListDto,
        navigate
    } = EditRoleDetailController();

    return (
        <section className='roleManagement-screen py-2 px-2'>
            <TitleComponent title={"Edit Role"} pageHeading={"Edit Role"} />
            <Loader
                isLoading={[
                    isRoleDetailByIdLoading,
                    isRoleListLoading
                ]}
            />
            <div data-testid="edit-role-form" className='role-Management p-3'>
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
                            <ErrorMessaage
                                touched={formikRole.touched.name}
                                errors={formikRole.errors.name}
                            />
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
                            <ErrorMessaage
                                touched={formikRole.touched.description}
                                errors={formikRole.errors.description}
                            />
                        </Col>
                    </Row>
                    <div>
                        <PermissionView moduleListDto={moduleListDto} handleChangePremission={handleChangePremission} showErrorMessage={showErrorMessage} />
                        <div className='d-flex w-100 justify-content-end gap-3'>
                            <ButtonComponent
                                text="Cancel"
                                btnClass="outlineBtn-deepgreen font-14 px-3"
                                type="button"
                                disabled={isRoleListLoading}
                                onClick={() => navigate("/role-management")}
                                data-testid="cancel-update-role"

                            />
                            <ButtonComponent
                                text="Update "
                                btnClass="btn-deepgreen font-14"
                                type="submit"
                                disabled={isRoleListLoading}
                                data-testid="submit-update-role"

                            />
                        </div>
                    </div>
                </Form>
            </div>
        </section>
    )
}

export default EditRoleView
