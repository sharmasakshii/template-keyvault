import TitleComponent from "component/tittle";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { getBaseUrl } from "utils";
import { useAppSelector } from "store/redux.hooks";

const ErrorPage = ({
  title = "Error",
  description = "",
  showCode = false,
  code = "404",
  buttonText = "Home",
  buttonLink = "/",
  pageTestId= ""
}) => {
  const { loginDetails, scopeType, userProfile } = useAppSelector((state: any) => state.auth);

  return (
    <section data-testid={pageTestId} className="error-page-wrap h-100vh">
      <TitleComponent title={title} />
      <Container className="h-100vh">
        <Row className="justify-content-center align-items-center h-100vh">
          <Col lg="9" className="mx-auto">
            <div className="error-inner text-center py-5 d-flex justify-content-center align-items-center flex-column">
              {showCode && <h3 className="text-white display-1 fw-bold">{code}</h3>}
              <h4 className="text-white fs-2">{title}</h4>
              {description && <h6 className="text-white fs-6">{description}</h6>}
              <div className="mt-4">
                <Link
                  to={buttonLink || getBaseUrl(loginDetails?.data, showCode ? scopeType : null, userProfile?.data)}
                  className="btn btn-lightGreen text-decoration-none px-5 py-2"
                >
                  {buttonText}
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ErrorPage;
