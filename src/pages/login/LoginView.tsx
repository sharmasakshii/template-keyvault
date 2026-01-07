import ImageComponent from "../../component/images"
import TitleComponent from "../../component/tittle";
import { Modal, Button } from "react-bootstrap";
import LoginFormController from "./loginFormController";
import OtpInput from 'react-otp-input';
import Lottie from 'lottie-react';
import lottieJson from "./USA_Map.json";
import { Row, Col } from 'reactstrap';
import ErrorMessaage from 'component/forms/errorMessaage';
/**
 * 
 * @returns LoginView Component
 */
const LoginView: React.FC = () => {

    // imported functions and variables from LoginController
    const {
        formik,
        show,
        showPassword,
        otpNumber,
        otpErrorShow,
        handleClose,
        setOtpNumber,
        handleSubmitOtp,
        isAuthLoginLoading,
        isOtpVerifyLoading,
        handleResendOTP,
        togglePasswordVisibility,
        isTimerActive,
        timer
    } = LoginFormController();

    return (
        <>
            <TitleComponent title={"Login"} />
            {/* login page */}

            <section className="login bg-white" data-testid="view-login">
                <div className="container-fluid px-0">
                    <Row className="gx-0 align-items-center ">
                        {/* left side content start */}
                        <Col md={6}>
                            <div className="left-side-wrapper">
                                <div className="p-lg-4 pb-lg-0 p-3 d-flex justify-content-between gap-2">
                                    <div className="img-logo">
                                        <ImageComponent path="/images/login/greensightLogo.png" className="greensight-logo pe-0" />
                                    </div>
                                    <ImageComponent path="/images/powered-by.svg" className="pe-0 powereb-by" />
                                </div>
                                <div className="login-map text-center px-4" data-testid="left-map">
                                    {lottieJson && <Lottie
                                        autoplay
                                        loop
                                        animationData={lottieJson}
                                    />}
                                    <h4 className="login-heading font-xxl-50 font-xl-40 font-45 fw-bold mb-0">
                                        Green<span className='fw-light'>Sight</span>
                                    </h4>
                                </div>
                            </div>
                        </Col>
                        {/* left side content ends */}

                        {/* Login Form starts */}
                        <Col md={6}>
                            <div className="right-side-wrapper mx-auto mt-3 mt-md-0 px-4 px-lg-0">
                                <h4 className="fw-semibold font-48">Login</h4>
                                <form onSubmit={formik.handleSubmit} >
                                    <div className="d-flex flex-column fields-wrapper">
                                        <div className="mail">
                                            <label htmlFor="login-email" className="font-xxl-20 font-18">Enter email</label>
                                            <div className="position-relative">
                                                <input
                                                    type="text"
                                                    name="email"
                                                    data-testid="login-email"
                                                    className="form-control"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.email}
                                                    aria-describedby="emailHelp"
                                                    placeholder="Enter your email"
                                                />
                                                <ImageComponent path="/images/login/useremail.svg" className="pe-0" />
                                            </div>
                                            <ErrorMessaage testId="error-email"
                                                touched={formik.touched.email}
                                                errors={formik.errors.email}
                                            />
                                        </div>
                                        <div className="mail ">
                                            <label htmlFor="login-password" className="font-xxl-20 font-18">Password</label>
                                            <div className="position-relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    data-testid="login-password"
                                                    className="form-control"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.password}
                                                    placeholder="Enter your password"
                                                />
                                                <ImageComponent testid="password-icon" imageName={showPassword ? "login/eyeclosed.svg" : "login/eyeopen.svg"} className="pe-0 eyeicon" handleOnClick={togglePasswordVisibility} />
                                            </div>
                                            <ErrorMessaage testId="error-password"
                                                touched={formik.touched.password}
                                                errors={formik.errors.password}
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" disabled={isAuthLoginLoading} data-testid="login_btn" className="btn btn-deepgreen w-100 mb-md-0 my-xxl-4 my-2">

                                        {isAuthLoginLoading ? <div className="spinner-border" data-testid="login-spinner">
                                            <span className="visually-hidden">Loading...</span>
                                        </div> : 'Login'}
                                    </button>
                                    <div className='privacyPolicy text-center mt-3'>
                                        <p className='font-16 fw-medium'>By logging in you agree to our <span>Privacy Policy</span></p>
                                    </div>

                                    {/* Modal start for OTP verification*/}
                                    <div className="valid-otp-wrap">
                                        <Modal show={show} className="modalLogin" onHide={handleClose} data-testid="authentication-modal">
                                            <Modal.Header closeButton className="border-modal-login pb-2 pt-4 px-4 mx-2">
                                                <h3 className=" font-22 mb-0 fw-semibold">
                                                    Authentication
                                                </h3>
                                            </Modal.Header>
                                            <Modal.Body className="py-0 px-4 mx-2">
                                                <div className="authentication-txt">
                                                    <p className="mb-0 font-16">Enter the 6 digits code that you have received on your registered contact number.</p>
                                                </div>

                                                {" "}
                                                <div className="inputotp">
                                                    <OtpInput
                                                        data-testid="otp-input"
                                                        value={otpNumber}
                                                        numInputs={6}
                                                        onChange={setOtpNumber}
                                                        renderInput={(props:any) => <input {...props} />}
                                                    />
                                                </div>
                                                {otpErrorShow && (
                                                    <h6 className="error-code text-danger ps-0 pt-2">
                                                        Please enter the authentication code
                                                    </h6>
                                                )}
                                                <div className="border-bottom-modal mb-4 pb-2">
                                                    <Button
                                                        type="submit"
                                                        data-testid="submit-otp"
                                                        onClick={handleSubmitOtp}
                                                        className="btn btn-deepgreen fs-6"
                                                        disabled={isOtpVerifyLoading}
                                                    >
                                                        {isOtpVerifyLoading ? <div className="spinner-border">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div> : 'Continue'}
                                                    </Button>
                                                    <div className="recieveCode mt-3 d-flex justify-content-center align-items-center">
                                                        <p className="mb-0">Didn't recieve a code? </p><button data-testid="resend-otp" className="fw-semibold" onClick={handleResendOTP} disabled={isTimerActive} >Resend Code
                                                            {isTimerActive ? <> in (00:{timer})</> : ""}</button>
                                                    </div>
                                                </div>
                                            </Modal.Body>
                                        </Modal>
                                    </div>
                                    {/*  Modal end*/}

                                </form>
                            </div>
                        </Col>
                        {/* login form ends */}
                    </Row>
                </div>
            </section>
        </>
    );
}

export default LoginView