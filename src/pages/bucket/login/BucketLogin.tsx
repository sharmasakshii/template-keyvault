import TitleComponent from "../../../component/tittle";
import { BucketLoginController } from "./bucketLoginController";
import ErrorMessaage from "../../../component/forms/errorMessaage";
import ImageComponent from "../../../component/images"
/**
 * Renders the login component for the BucketLogin feature.
 *
 * @returns {JSX.Element} The rendered login component.
 */
const BucketLoginView = () => {
  const {
    formik
  } = BucketLoginController();
  return (
    <section data-testid="bucket-login" className="login">
      <TitleComponent title={"Bucket Login"} />

      <div className="container-fluid px-0 ">
        <div className="bucketLogin">
          <div className="row gx-0 align-items-center ">
            <div className="col-md-6">
              <div className="left-side-wrapper p-4">
                <div className="left-logo">
                <ImageComponent path="/images/login/greensightLogo.png" className="w-25"/>
                </div>
                <div className="login-map text-center">
                  <h4 className="login-heading fw-semibold font-40 font-lg-52">
                    Bucket Login
                  </h4>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="right-side-wrapper w-75 mx-auto mt-3 mt-md-0">
                <h4 className="font-34 font-lg-40">Sign In</h4>
                <p className="fw-normal mb-4 font-14 font-lg-18">
                  Enter your username and password to sign in.
                </p>
                <form onSubmit={formik.handleSubmit}>
                  <div className="mb-3">
                    <div className="mail ">
                      <div className="position-relative">
                        <ImageComponent path="/images/login/useremail.svg" />{" "}

                        <input
                          type="text"
                          name="email"
                          className="form-control ps-5 py-3"
                          onChange={formik.handleChange}
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                          placeholder="Enter your username"
                        />
                      </div>
                      <ErrorMessaage
                        touched={formik.touched.email}
                        errors={formik.errors.email}
                      />

                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="mail ">
                      <div className="position-relative">
                      <ImageComponent path="/images/login/password.svg" className="position-absolute password-icon"/>
                      
                        <input
                          type="password"
                          name="password"
                          className="form-control ps-5 py-3"
                          onChange={formik.handleChange}
                          value={formik.values.password}
                          id="exampleInputPassword1"
                          placeholder="Enter your password"
                        />
                      </div>
                      <ErrorMessaage
                        touched={formik.touched.password}
                        errors={formik.errors.password}
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-deepgreen w-100 mb-md-0 mb-4 mt-4">
                    Sign In
                  </button>
                  <div className="valid-otp-wrap"></div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BucketLoginView 