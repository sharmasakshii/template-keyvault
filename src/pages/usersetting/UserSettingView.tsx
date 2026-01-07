import { Form, Row, Col } from "reactstrap";
import ButtonComponent from "../../component/forms/button";
import Heading from "../../component/heading";
import ImageComponent from "component/images";
import InputField from "component/forms/input";
import UserSettingsController from "./userSettingsController";
import TitleComponent from "component/tittle";
import ErrorMessaage from "component/forms/errorMessaage";
import { handleProfileImage, numberOnly, removeSpaceOnly } from "utils";
import Loader from "component/loader/Loader";
import Spinner from "component/spinner";

// Define the UserSetting functional component.
const UserSettingView = () => {
  // Extract data and functions from the UserSettingsController.
  const {
    userProfile,
    hiddenFileInput,
    handleChange,
    formik,
    formikUser,
    isLoading,
    handleClick,
    isLoadingProfilePic
  } = UserSettingsController();

  return (
    <>
      <TitleComponent title={"User Setting"} pageHeading="Profile" />
      <section className="profile-screen pb-4 px-2" data-testid="user-setting">
        <div className="profile-screen-wraper">
          <Loader isLoading={[isLoading]} />
          <div className="profile-section">
            <div className="headingBorder pb-3 mb-3">
              <Heading
                level="4"
                content={`Personal Details`}
                className="fw-semibold mb-0"
              />
            </div>
            <div className="p-0">
              <Form onSubmit={formikUser.handleSubmit} aria-disabled={isLoading}>
                {/* Create a card for creating/updating the user's profile */}
                <div className="createProfileCard p-3 mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Heading
                      level="4"
                      content={`Update Profile`}
                      className="fw-semibold mb-0 font-16 font-lg-20"
                    />
                    <ButtonComponent
                      text="Update"
                      type="submit"
                      disabled={isLoading}
                      btnClass="btn-deepgreen py-2 font-14"
                      data-testid="update-profile"

                    />
                  </div>
                  <div className="uploadImageSection d-flex gap-5 align-items-center mb-4">
                    {/* Display user's profile image */}
                    <div className="uploadImage ">
                      {isLoadingProfilePic ? <Spinner spinnerClass='justify-content-center align-items-center h-100' /> :
                        <>
                          <ImageComponent
                            imageName="profile-img-auto.png"
                            path={userProfile?.data?.profile?.image}
                            handleImageError={handleProfileImage}
                          />
                          <ImageComponent
                            path="/images/upload-img.svg"
                            handleImageError={handleProfileImage}
                            className="imageupload"
                            alt="profile-img"
                            handleOnClick={() => handleClick()}
                            testid="profile_pic"
                          />
                        </>
                      }
                      <input
                        type="file"
                        ref={hiddenFileInput}
                        onChange={handleChange}
                        className="d-none"
                        data-testid="hidden-file-input"
                      />
                    </div>
                  </div>
                  <div className="formDetailsSection">
                    <Row className="gx-3">
                      <Col xl="3" lg="4" md="6">
                        {/* Input field for First Name */}
                        <InputField
                          type="text"
                          name="first_name"
                          Id="first_name"
                          placeholder="Enter First Name"
                          label="First Name"
                          onChange={formikUser.handleChange}
                          value={formikUser.values.first_name}
                          onKeyDown={(e: any) => removeSpaceOnly(e)}
                          testid="first-name"

                        />
                        {formikUser.touched.first_name &&
                          formikUser.errors.first_name && (
                            <span className="text-danger font-14">
                              {formikUser.errors.first_name}
                            </span>
                          )}
                      </Col>
                      <Col xl="3" lg="4" md="6">
                        {/* Input field for Last Name */}
                        <InputField
                          type="text"
                          name="last_name"
                          Id="last_name"
                          placeholder="Enter Last Name"
                          label="Last Name"
                          onChange={formikUser.handleChange}
                          value={formikUser.values.last_name}
                          onKeyDown={(e: any) => removeSpaceOnly(e)}
                          testid="last-name"

                        />
                        {formikUser.touched.last_name &&
                          formikUser.errors.last_name && (
                            <span className="text-danger font-14">
                              {formikUser.errors.last_name}
                            </span>
                          )}
                      </Col>
                      <Col xl="3" lg="4" md="6">
                        {/* Input field for Email Address */}
                        <InputField
                          type="text"
                          name="email"
                          Id="email"
                          disabled={true}
                          placeholder="Enter Email Address"
                          label="Email Address"
                          onChange={formikUser.handleChange}
                          value={formikUser.values.email}
                          testid="email-name"

                        />
                        {formikUser.touched.email &&
                          formikUser.errors.email && (
                            <span className="text-danger font-14">
                              {formikUser.errors.email}
                            </span>
                          )}
                      </Col>
                      <Col xl="3" lg="4" md="6">
                        {/* Input field for Profile Title */}
                        <div className="profiletitle">
                          <InputField
                            type="text"
                            name="title"
                            Id="title"
                            placeholder="Enter Profile Title"
                            label="Profile Title"
                            onChange={formikUser.handleChange}
                            value={formikUser.values.title}
                            onKeyDown={(e: any) => removeSpaceOnly(e)}
                            testid="title-name"

                          />
                          {formikUser.touched.title &&
                            formikUser.errors.title && (
                              <span className="text-danger font-14">
                                {formikUser.errors.title}
                              </span>
                            )}
                        </div>
                      </Col>
                      {!userProfile?.data?.profile?.phone_number && (
                        <h4 className="authentication font-20 fw-semibold mt-3">
                          {" "}
                          Secure Your Account with Two-Factor Authentication.{" "}
                        </h4>
                      )}
                      <Col md="12">
                        {/* Input field for Contact Number */}
                        <Row>
                          <Col xl="3" lg="4" md="6">
                          <div className="spacebelow">
<InputField
                              type="text"
                              name="phone"
                              Id="phone"
                              placeholder="Enter Contact Number"
                              label="Contact Number"
                              onChange={formikUser.handleChange}
                              value={formikUser.values.phone}
                              onKeyDown={(e: any) => numberOnly(e)}
                              testid="phone-number"

                            />
                          </div>
                            
                          </Col>
                        </Row>

                        {formikUser.touched.phone &&
                          formikUser.errors.phone && (
                            <span className="text-danger font-14">
                              {formikUser.errors.phone}
                            </span>
                          )}
                        <p className="font-14">A one-time authentication code will be sent to this number each time you log in.</p>
                      </Col>

                    </Row>
                  </div>
                </div>
              </Form>
              {/* Create a card for updating login security */}
              <div className="createProfileCard p-3 mb-4">
                <Form onSubmit={formik.handleSubmit}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Heading
                      level="4"
                      content={`Login Security`}
                      className="fw-semibold mb-0 font-16 font-lg-20"
                    />
                    <ButtonComponent
                      text="Update"
                      type="submit"
                      btnClass="btn-deepgreen py-2 font-14"
                      data-testid="update-password"
                    />
                  </div>

                  <div className="formDetailsSection">
                    <Row className="gx-3">
                      <Col xl="3" lg="4" md="6">
                        {/* Input field for Current Password */}
                        <InputField
                          type="password"
                          name="oldPassword"
                          id="oldPassword"
                          placeholder="Enter Current Password"
                          label="Password"
                          onChange={formik.handleChange}
                          value={formik.values.oldPassword}
                          onKeyDown={(e: any) => removeSpaceOnly(e)}
                          testid="old-password"

                        />
                        <ErrorMessaage
                          touched={formik.touched.oldPassword}
                          errors={formik.errors.oldPassword}
                        />
                      </Col>
                      <Col xl="3" lg="4" md="6">
                        {/* Input field for New Password */}
                        <InputField
                          type="password"
                          name="password"
                          id="password"
                          placeholder="Enter New Password"
                          label="New Password"
                          onChange={formik.handleChange}
                          value={formik.values.password}
                          onKeyDown={(e: any) => removeSpaceOnly(e)}
                          testid="new-password"

                        />
                        <ErrorMessaage
                          touched={formik.touched.password}
                          errors={formik.errors.password}
                        />
                      </Col>
                      <Col xl="3" lg="4" md="6">
                        {/* Input field for Confirm Password */}
                        <InputField
                          type="password"
                          name="currentPassword"
                          id="currentPassword"
                          placeholder="Enter Confirm Password"
                          label="Confirm Password"
                          onChange={formik.handleChange}
                          value={formik.values.currentPassword}
                          onKeyDown={(e: any) => removeSpaceOnly(e)}
                          testid="confirm-password"

                        />
                        <ErrorMessaage
                          touched={formik.touched.currentPassword}
                          errors={formik.errors.currentPassword}
                        />
                      </Col>
                    </Row>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UserSettingView;
