import Heading from "../../../component/heading";
import { Form } from "react-bootstrap";
import SelectDropdown from "../../../component/forms/dropdown";
import ButtonComponent from "../../../component/forms/button";
import { handleProfileImage, numberOnly, removeSpaceOnly } from "utils";
import { EditUserController } from "./editUserController";
import BackLink from "../../../component/forms/backLink/index";
import TitleComponent from "../../../component/tittle";
import { Row, Col } from "reactstrap";
import ImageComponent from "../../../component/images";
import ConfirmBox from "component/DailogBox/ConfirmBox";
import { UserPermission } from "component/userPermission";
import Spinner from "component/spinner";

const EditUserView = () => {
  const {
    formikUser,
    showModal,
    handleClose,
    handleUpdateUserWithPwd,
    singleUserDetail,
    navigate,
    userRoleList,
    backLinkUrl,
    statusList,
    setShowModal,
    isUserListByIdLoading,
    messages,
    handleChangeStatus,
    setUserAction,
    userAction,
    regionList,
    divisionOptions,
    isPepsiClient
  } = EditUserController();

  const userRoleListDto = userRoleList?.data?.map((i: any) => {
    return { label: i?.name, value: i?.id };
  })

  return (
    <section className="userManagement-screen pt-0 py-3">
      <TitleComponent
        title={"Edit User Details"}
        pageHeading={"Edit User Details"}
      />
      <div data-testid="user-management-list-view" className="userManagement-Wraper pt-3">
        {/* user management user listing html starts */}
        <div className="userManagement_List">
          {isUserListByIdLoading ? <Spinner spinnerClass="justify-content-center py-5 my-5 " /> :
            <>
              <div className="bottomline pb-3 p-3">
                <div className="d-flex gap-3 align-items-center justify-content-between mb-2 mb-lg-0 flex-wrap">
                  <div className="d-flex align-items-center gap-3">
                    <BackLink btnText="Back" link={backLinkUrl()} />
                    <div className="userName">
                      <Heading
                        level="4"
                        content={singleUserDetail?.data?.name}
                        className="font-20 fw-semibold"
                      />
                      <Heading
                        level="6"
                        content={singleUserDetail?.data?.userDetailsRole?.name}
                        className="font-16 fw-normal mb-0"
                      />
                    </div>
                  </div>
                  <div className="d-flex select-box gap-3 ">
                    <div className="d-flex gap-3">
                      {singleUserDetail?.data?.userDetail?.status !== 0 && <div className="d-flex align-items-center gap-3">
                        <Heading level="5" className="font-16 fw-medium mb-0">
                          Status
                        </Heading>
                        <SelectDropdown
                          aria-label="status-dropdown-edit-user"
                          options={statusList}
                          placeholder="Select Status"
                          onChange={(e: { value: number, label: string }) => handleChangeStatus(e)}
                          selectedValue={statusList?.filter(
                            (el: any) => el.value === Number.parseInt(singleUserDetail?.data?.userDetail?.status)
                          )}
                        />
                      </div>}
                      <ButtonComponent
                        data-testid="btn-delete-id"
                        text="Delete"
                        btnClass="dangerBtn px-2 py-1"
                        imagePath="/images/delete.svg"
                        onClick={() => {
                          setShowModal(true)
                          setUserAction("delete")
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="userDetail-outerCard mt-3">
                <div className="createProfileCard p-3">
                  <Row>
                    <Col xl={3}>
                      <div className="uploadImageSection d-flex align-items-end gap-3">
                        <div className="uploadImage ">
                          <ImageComponent
                            imageName="defaultSquareImg.png"
                            className="img-fluid pe-0"
                            path={singleUserDetail?.data?.userDetail?.image}
                            handleImageError={handleProfileImage}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col xl={9} className="align-self-center">
                      <div>
                        <Heading
                          level="4"
                          content="Permissions"
                          className="font-18 font-xxl-20 fw-semibold mb-2"
                        />
                        <UserPermission permissionDetail={singleUserDetail?.data?.userPermission} />
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className="personalDetail py-5 px-4">
                <div>
                  <Heading
                    level="4"
                    content="Personal Details"
                    className="font-20 fw-semibold mb-3"
                  />
                  <Form
                    data-testid="edit-user-fields"
                    className="d-flex flex-wrap gap-3"
                    onSubmit={formikUser.handleSubmit}
                  >
                    <Form.Group className="mb-3 forms">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="first_name"
                        id="first_name"
                        data-testid="first_name"

                        placeholder="Enter First Name"
                        onChange={formikUser.handleChange}
                        value={formikUser.values.first_name}
                        onKeyDown={(e: any) => removeSpaceOnly(e)}
                      />
                      {formikUser.touched.first_name &&
                        formikUser.errors.first_name && (
                          <span className="text-danger font-14">
                            {formikUser.errors.first_name}
                          </span>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3 forms">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="last_name"
                        id="last_name"
                        data-testid="last_name"
                        placeholder="Enter Last Name"
                        onChange={formikUser.handleChange}
                        value={formikUser.values.last_name}
                        onKeyDown={(e: any) => removeSpaceOnly(e)}
                      />
                      {formikUser.touched.last_name &&
                        formikUser.errors.last_name && (
                          <span className="text-danger font-14">
                            {formikUser.errors.last_name}
                          </span>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3 forms">
                      <Form.Label>Contact Number</Form.Label>
                      <Form.Control
                        type="text"
                        id="phone"
                        name="phone"
                        data-testid="phone"
                        placeholder="Enter Contact Number"
                        onChange={formikUser.handleChange}
                        value={formikUser.values.phone}
                        onKeyDown={(e: any) => numberOnly(e)}
                      />
                      {formikUser.touched.phone && formikUser.errors.phone && (
                        <span className="text-danger font-14">
                          {formikUser.errors.phone}
                        </span>
                      )}
                    </Form.Group>
                    <Form.Group className="mb-3 forms">
                      <Form.Label>Email Address </Form.Label>
                      <Form.Control
                        type="email"
                        id="email"
                        data-testid="email"
                        placeholder="Enter Email address"
                        onChange={formikUser.handleChange}
                        value={formikUser.values.email}
                      />
                      {formikUser.touched.email && formikUser.errors.email && (
                        <span className="text-danger font-14">
                          {formikUser.errors.email}
                        </span>
                      )}
                    </Form.Group>
                    <Form.Group
                      className="mb-3 forms"
                    >
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        id="password"
                        type="password"
                        data-testid="password"
                        placeholder="Enter Password"
                        onChange={formikUser.handleChange}
                        value={formikUser.values.password}
                        autoComplete="new-password" // Add this line
                      />
                      {formikUser.touched.password &&
                        formikUser.errors.password && (
                          <span className="text-danger font-14">
                            {formikUser.errors.password}
                          </span>
                        )}
                    </Form.Group>
                    <Form.Group className="forms">
                      <Form.Label>Role </Form.Label>
                      <div className="select-box">
                        <SelectDropdown
                          aria-label="role-user"
                          options={userRoleListDto}
                          placeholder="Select Role"
                          customClass="w-100"
                          onChange={(e: any) => {
                            formikUser.setFieldValue("role_id", {
                              value: e?.value,
                              label: e.label,
                            });
                          }}
                          selectedValue={userRoleListDto?.filter(
                            (el: any) => el.value === Number.parseInt(formikUser?.values?.role_id?.value)
                          )[0]}
                        />
                      </div>
                    </Form.Group>
                    <Form.Group className="forms">
                      <Form.Label>{isPepsiClient ? "Division" : "Region"}</Form.Label>
                      <div className="select-box">
                        {isPepsiClient ? (
                          <SelectDropdown
                            aria-label="divisions-data-dropdown-edit-user"
                            options={divisionOptions}
                            placeholder="Select Division"
                            customClass="w-100"
                            onChange={(e: any) => {
                              formikUser.setFieldValue("divisionId", {
                                value: e?.value,
                                label: e?.label,
                              });
                            }}
                            selectedValue={
                              divisionOptions?.find(
                                (el: any) =>
                                  Number.parseInt(el.value) === Number.parseInt(formikUser.values.divisionId?.value))}

                          />
                        ) : (
                          <SelectDropdown
                            aria-label="regions-data-dropdown-edit-user"
                            options={regionList}
                            placeholder="Select Region"
                            customClass="w-100"
                            onChange={(e: any) => {
                              formikUser.setFieldValue("regionId", {
                                value: e?.value,
                                label: e?.label,
                              });
                            }}
                            selectedValue={
                              regionList?.find(
                                (el: any) =>
                                  Number.parseInt(el.value) === Number.parseInt(formikUser.values.regionId?.value))}

                          />
                        )}
                      </div>
                      {(isPepsiClient
                        ? formikUser.touched.divisionId && formikUser.errors.divisionId
                        : formikUser.touched.regionId && formikUser.errors.regionId) && (
                          <span className="text-danger font-14">
                            Please select {isPepsiClient ? "division" : "region"}
                          </span>
                        )}
                    </Form.Group>


                    <div className="d-flex gap-3 justify-content-end w-100 modalbuttons align-items-end">
                      <ButtonComponent
                        onClick={() => {
                          navigate(`/${backLinkUrl()}`);
                        }}
                        text="Cancel"
                        btnClass="gray-btn py-0 btnHeight backBtn font-14 px-4 py-2"
                        data-testid="cancel-btn"
                      />
                      <ButtonComponent
                        text="Update"
                        type="submit"
                        btnClass="btn-deepgreen px-4 py-0 font-16 btnHeight"
                        data-testid="update-btn"
                      />
                    </div>
                  </Form>
                </div>
              </div></>

          }

        </div>
      </div>
      <ConfirmBox
        show={showModal}
        primaryButtonClick={handleClose}
        handleClose={handleClose}
        secondaryButtonClick={() => handleUpdateUserWithPwd()}
        secondaryButtonTextDataTestId={`user-password-confirm-btn`}
        primaryButtonTextDataTestId={`user-password-cancel-btn`}

        modalHeader={messages[userAction]}
        primaryButtonText={"No"}
        primaryButtonClass="gray-btn font-14 px-4 py-2"
        secondaryButtonText={"Yes"}
        secondaryButtonclass="btn-deepgreen font-14 px-4 py-2"
      />
    </section>
  );
};

export default EditUserView;


