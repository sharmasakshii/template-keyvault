import ReactStars from "react-stars";
import moment from "moment";
import ImageComponent from "../../component/images";
import ErrorMessaage from "../../component/forms/errorMessaage";
import SelectDropdown from "../../component/forms/dropdown";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Button,
  Row,
  Col,
  Label,
  Input,
} from "reactstrap";
import ButtonComponent from "component/forms/button";

const CreateProjectModal = (props: any) => {
  const {
    modal,
    args,
    feedBackModalShow,
    handleClose,
    ratingChanged,
    setFeedbackMessage,
    handleSubmitFeedback,
    handleDeleteInvite,
    formik,
    feedBackRating,
    feedbackMessage,
    isLoadingSaveProject,
    handleSearchUser,
    searchedUsers,
    handleSelectUser,
    feedBackRatingError,
    handleSelectInviteUser,
    createModalId,
    savaAndCreateId,
    deleteBtnId,
    isLoadingEmailSearch
  } = props;
  return (
    <Modal
      isOpen={modal}
      toggle={handleClose}
      {...args}
      className="create-project-modal"
    >
      {!feedBackModalShow && (
        <ModalHeader toggle={handleClose} className="pb-0 px-4">
          <div className="d-lg-flex justify-content-between align-items-center w-100">
            <h2 className="mb-2 fw-semibold font-20 font-xxl-26">
              Create a new project
            </h2>
            <p className="text-decoration-none me-2 mb-2 font-14">
              Created {moment().format("DD/MM/yyyy h:mma")}
            </p>
          </div>
        </ModalHeader>
      )}

      {feedBackModalShow ? (
        <div className="save-create-modal p-4 my-0">
          <div className="heading">
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="fs-4">
                Your project has been saved and created!
              </h3>
              <ImageComponent path="/images/modal-cross.svg" className="pe-0" handleOnClick={() => handleClose()} />
            </div>
          </div>
          <div className="experience p-4 ">
            <div className="heading d-xl-flex align-items-center justify-content-between mb-4">
              <h4 className="fs-5 text-white">
                How was your experience with GreenSight?
              </h4>
              <div>
                <ReactStars
                  className="react-stars-03915892202261626"
                  count={5}
                  value={feedBackRating}
                  onChange={ratingChanged}
                  size={24}
                  color2="#FDCC0D"
                />
              </div>
            </div>
            <div>
              <FormGroup className="message">
                <Input
                  id="exampleText"
                  name="text"
                  type="textarea"
                  placeholder="We'd love to get your feedback"
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e?.target?.value)}
                />
              </FormGroup>
            </div>
          </div>
          {feedBackRatingError && <p className="text-danger font-14 my-2">*Please provide a rating before submitting your feedback.</p>}
          <div className="feedback-btn mt-5 d-flex align-items-center justify-content-end">
            <Button
              onClick={() => handleSubmitFeedback()}
              className="px-4 py-2"
            >
              Submit feedback
            </Button>
          </div>
        </div>
      ) : (
        <Form onSubmit={formik.handleSubmit}>
          <ModalBody className="pt-0 px-4">
            <h5 className="font-16 fw-normal mb-3">
              Please enter the information for your project.
            </h5>
            <div className="create-project-body p-3" data-testid={createModalId}>
              <div className="heading">
                <Row>
                  <Col lg="12" md="12">
                    <div className="mt-3">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <Label htmlFor="exampletext">Name the project*</Label>
                            <Input
                              data-testid="project-field-name"
                              placeholder="Project name"
                              type="text"
                              className="py-2"
                              name="projectName"
                              onChange={formik.handleChange}
                              value={formik.values.projectName}
                            />
                            <ErrorMessaage
                              touched={formik.touched.projectName}
                              errors={formik.errors.projectName}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup className="select-box">
                            <Label htmlFor="exampleemail">
                              Project manager email*
                            </Label>
                            <div
                              className="search-icon-img lane"
                            >
                              {isLoadingEmailSearch ?
                                <div data-testid="dropdownSpinner-loading-benchmark" className="dropdownSpinner">
                                  <div className="spinner-border ">
                                    <span className="sr-only"></span>
                                  </div>
                                </div>
                                :
                                <span className="height-0 d-block">
                                  <ImageComponent path="/images/search.svg" className="search-img pe-0" />
                                </span>
                              }
                              <SelectDropdown
                                id="exampleemail"
                                aria-label="project-manager-dropdown"
                                name="projectManagerEmail"
                                placeholder="Project manager email"
                                selectedValue={formik.values.projectManagerEmail}
                                isSearchable={true}
                                onChange={handleSelectUser}
                                isClearable={true}
                                onInputChange={handleSearchUser}
                                options={searchedUsers?.data?.map((user: any) => { return { label: user?.email, value: user?.id } }) || []}
                                customClass="ms-0 mt-2 mt-lg-0 searchdropdown text-capitalize w-auto"
                              />
                              <ErrorMessaage
                                touched={formik.touched.projectManagerEmail}
                                errors={formik.errors.projectManagerEmail}
                              />
                            </div>

                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="invite-people-wrapper p-4">
                <h5>Invite people:</h5>

                <div className="position-relative gap-2 d-flex justify-content-between w-100">
                  <FormGroup className="input-email select-box w-100">
                    <SelectDropdown
                      id="inviteemail"
                      aria-label="email-address-dropdown"
                      name="email"
                      placeholder="Enter email address"
                      isSearchable={true}
                      selectedValue={{ label: "Enter email address", value: "" }}
                      onChange={(e: any) => {
                        handleSelectInviteUser(e);
                      }}
                      onInputChange={(e: any) => {
                        handleSearchUser(e);
                      }}
                      options={searchedUsers?.data?.filter((ele: any) => !formik?.values?.invitedUser?.includes(ele) && ele?.id !== formik.values.projectManagerEmail?.value)?.map((user: any) => { return { label: user?.email, value: user } })}
                      customClass="w-100 ms-0 mt-2 mt-lg-0 text-capitalize"
                    />
                  </FormGroup>
                </div>

               
                  {formik?.values?.invitedUser?.map((i: any) => (
                    <Row key={i?.email} className="align-items-center">
                      <Col lg="10" sm="6" key={i?.id}>
                        <div data-testid="invite-people" className="invite-people-name mt-4 d-lg-flex align-items-center justify-content-between">
                          <div className="d-md-flex align-items-center letter-icon">
                          <ImageComponent path="/images/letter-icon.svg" className="pe-0"/>
                            <div className="ms-3">
                              <h3 className="fw-semibold font-14 mb-0">
                                {i?.email}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col lg="2" sm="6">
                        <div className="edit-dlt-btn invite-people-name d-flex mt-4 justify-content-end">
                          <ButtonComponent data-testid={deleteBtnId} imagePath="/images/delete.svg" btnClass="" text="Delete" onClick={() => handleDeleteInvite(i)}/>
                        </div>
                      </Col>
                    </Row>
                  ))}
              
              </div>
              <div className="intermodal-wrapper py-2 pb-0">
                <div className="project-desc py-2 pb-0">
                  <Row>
                    <Col lg="12">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <Label htmlFor="exampleDate">
                              Project starts*
                            </Label>
                            <Input
                              data-testid="start-date"
                              id="exampleDate"
                              name="projectStart"
                              placeholder="date placeholder"
                              className="text-uppercase"
                              type="date"
                              onChange={formik.handleChange}
                              value={formik.values.projectStart}
                            />
                            <ErrorMessaage
                              touched={formik.touched.projectStart}
                              errors={formik.errors.projectStart}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <Label htmlFor="exampleDate">
                              Estimated ending date*
                            </Label>
                            <Input
                              id="exampleDate"
                              data-testid="end-date"

                              name="projectEnd"
                              placeholder="date placeholder"
                              className="text-uppercase"
                              type="date"
                              onChange={formik.handleChange}
                              value={formik.values.projectEnd}
                            />
                            <ErrorMessaage
                              touched={formik.touched.projectEnd}
                              errors={formik.errors.projectEnd}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <FormGroup className="message">
                    <Label htmlFor="exampleText">Project description*</Label>
                    <Input
                      id="exampleText"
                      name="projectDesc"
                      data-testid="project-desc"

                      type="textarea"
                      placeholder="Project description"
                      onChange={formik.handleChange}
                      value={formik.values.projectDesc}
                    />
                    <ErrorMessaage
                      touched={formik.touched.projectDesc}
                      errors={formik.errors.projectDesc}
                    />
                  </FormGroup>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <ButtonComponent
              data-testid={savaAndCreateId}
              disabled={isLoadingSaveProject}
              type="submit"
              btnClass="px-4 py-2 font-14 btn-deepgreen"
              text="Save and create"
            />
          </ModalFooter>
        </Form>
      )}
    </Modal>
  );
};
export default CreateProjectModal;
