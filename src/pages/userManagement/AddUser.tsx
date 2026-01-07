import { Modal, Form } from "react-bootstrap";
import { Row, Col } from "reactstrap";
import InputField from "component/forms/input";
import { removeSpaceOnly, numberOnly } from "utils";
import SelectDropdown from "../../component/forms/dropdown";
import ButtonComponent from "component/forms/button";
import AddUserController from "./addUserController"

const AddUser = (props: any) => {
    const {
        show,
        roleList,
        addUserId,
    } = props

    const {
        formikUser,
        regions,
        divisions,
        handleCloseModal,
        isPepsiClient
    } = AddUserController(props);

    return (
        <Modal
            show={show}
            onHide={handleCloseModal}
            backdrop="static"
            keyboard={false}
            className="userDetail"
        >
            <Modal.Header closeButton className="p-0 pb-4">
                <Modal.Title>Add Users Detail</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
                <div data-testid={addUserId} className="select-box">
                    <Form onSubmit={formikUser.handleSubmit}>
                        <Row >
                            <Col lg="6">
                                <div>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="exampleForm.ControlInput1"
                                    >
                                        <InputField
                                            testid="first_name"
                                            type="text"
                                            name="first_name"
                                            Id="first_name"
                                            placeholder="Enter First Name"
                                            label="First Name *"
                                            onChange={formikUser.handleChange}
                                            value={formikUser.values.first_name}
                                            onKeyDown={(e: any) => removeSpaceOnly(e)}
                                        />
                                        {formikUser.touched.first_name &&
                                            formikUser.errors.first_name && (
                                                <span data-testid="first-name-error" className="text-danger font-14">
                                                    {formikUser.errors.first_name}
                                                </span>
                                            )}
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="exampleForm.ControlInput1"
                                    >
                                        <InputField
                                            testid="email_address"
                                            type="text"
                                            name="email"
                                            Id="email"
                                            placeholder="Enter Email Address"
                                            label="Email Address *"
                                            onChange={formikUser.handleChange}
                                            value={formikUser.values.email}
                                        />
                                        {formikUser.touched.email &&
                                            formikUser.errors.email && (
                                                <span data-testid="email-address-error" className="text-danger font-14">
                                                    {formikUser.errors.email}
                                                </span>
                                            )}
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="exampleForm.ControlInput1"
                                    >
                                        <InputField
                                            testid="phone_number"
                                            type="text"
                                            name="phone"
                                            Id="phone"
                                            placeholder="Enter Contact Number"
                                            label="Contact Number"
                                            onChange={formikUser.handleChange}
                                            value={formikUser.values.phone}
                                            onKeyDown={(e: any) => numberOnly(e)}
                                        />
                                        {formikUser.touched.phone &&
                                            formikUser.errors.phone && (
                                                <span data-testid="phone-number-error" className="text-danger font-14">
                                                    {formikUser.errors.phone}
                                                </span>
                                            )}
                                    </Form.Group>
                                    {isPepsiClient ? (
                                        <Form.Group>
                                            <Form.Label>Select Division</Form.Label>
                                            <SelectDropdown
                                                aria-label="divisions-data-dropdown-add-user"
                                                options={[
                                                    { label: "All Divisions", value: "" },
                                                    ...(divisions?.data?.map((i: any) => ({ label: i.name, value: i.id })) || [])
                                                ]}
                                                placeholder="Select Division"
                                                customClass="w-100"
                                                selectedValue={formikUser.values.divisionId}
                                                onChange={(e: any) => formikUser.setFieldValue("divisionId", { value: e?.value, label: e?.label })}
                                            />
                                        </Form.Group>
                                    ) : (
                                        <Form.Group>
                                            <Form.Label>Select Region</Form.Label>
                                            <SelectDropdown
                                                aria-label="regions-data-dropdown-add-user"
                                                options={[
                                                    { label: "All Regions", value: "" },
                                                    ...(regions?.data?.regions.map((i: any) => ({ label: i.name, value: i.id })) || [])
                                                ]}
                                                placeholder="Select Region"
                                                customClass="w-100"
                                                selectedValue={formikUser.values.regionId}
                                                onChange={(e: any) => formikUser.setFieldValue("regionId", { value: e?.value, label: e?.label })}
                                            />
                                        </Form.Group>
                                    )}
                                </div>
                            </Col>
                            <Col lg="6">
                                <Form.Group
                                    className="mb-3"
                                    controlId="exampleForm.ControlInput1"
                                >
                                    <InputField
                                        testid="last_name"
                                        type="text"
                                        name="last_name"
                                        Id="last_name"
                                        placeholder="Enter Last Name"
                                        label="Last Name *"
                                        onChange={formikUser.handleChange}
                                        value={formikUser.values.last_name}
                                        onKeyDown={(e: any) => removeSpaceOnly(e)}
                                    />
                                    {formikUser.touched.last_name &&
                                        formikUser.errors.last_name && (
                                            <span data-testid="last-name-error" className="text-danger font-14">
                                                {formikUser.errors.last_name}
                                            </span>
                                        )}
                                </Form.Group>
                                <Form.Group
                                    className="mb-3"
                                    controlId="exampleForm.ControlInput1"
                                >
                                    <InputField
                                        testid="password_field"
                                        type="password"
                                        name="password"
                                        Id="password"
                                        placeholder="Enter Password"
                                        label="Password *"
                                        onChange={formikUser.handleChange}
                                        value={formikUser.values.password}
                                    />
                                    {formikUser.touched.password &&
                                        formikUser.errors.password && (
                                            <span data-testid="password-field-error" className="text-danger font-14">
                                                {formikUser.errors.password}
                                            </span>
                                        )}
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>User Role *</Form.Label>
                                    <SelectDropdown
                                        aria-label="role-user"
                                        options={roleList?.data?.map((i: any) => { return { label: i?.name, value: i?.id } })}
                                        placeholder="Select Role"
                                        customClass="w-100"
                                        selectedValue={formikUser?.values?.roleId}
                                        onChange={(e: any) => {
                                            formikUser.setFieldValue("roleId", { value: e?.value, label: e.label })
                                        }} />
                                    {formikUser.touched.roleId &&
                                        formikUser.errors.roleId && (
                                            <span data-testid="role-user-error" className="text-danger font-14">
                                                {formikUser?.errors?.roleId}
                                            </span>
                                        )}
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="d-flex gap-3 justify-content-end modalbuttons">
                            <ButtonComponent data-testid="cancel-btn" text="Cancel" onClick={handleCloseModal} btnClass="cancelbtn" />
                            <ButtonComponent data-testid="submit-btn" text="Submit" type="submit" btnClass="btn-deepgreen px-4 font-16" />
                        </div>

                    </Form>
                </div>
            </Modal.Body>
        </Modal>

    )

}

export default AddUser