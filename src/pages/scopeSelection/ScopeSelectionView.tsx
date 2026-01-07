import Heading from "component/heading"
import { Col, FormGroup, Input, Row } from "reactstrap"
import ImageComponent from "component/images"
import ButtonComponent from "component/forms/button"
import ScopeSelectionController from "./scopeSelectionController"
import Lottie from 'lottie-react';
import lottieJson from "../login/USA_Map.json";
import "../../scss/scopeDashboard/_index.scss";
import { isCompanyEnable } from 'utils';
import { companySlug } from 'constant';

const ScopeSelectionView = () => {

  const {
    scopeSlug,
    setScope,
    scope,
    moveToNextPage,
    loginDetails
  } = ScopeSelectionController()

  const isScope1Enabled = isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo]);

  return (
    <div className="scope bg-white" data-testid="scope-selection-view">
      <Row className="align-items-xxl-center g-0">
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
        <Col md={6}>
          <Row className="justify-content-center g-0">
            <Col xxl="9" lg="10">
              <div className="scopeDashboard pt-3 px-lg-0 px-2">
                <Heading content="Choose your emissions scope" level="2" className="font-xxl-28 font-24 fw-medium text-center mb-3" />
                <Row className="g-3">
                  {
                    [
                      {
                        scopeName: 'Scope 1',
                        isSelected: scopeSlug?.scope1 === scope,
                        description: 'Direct emissions from vehicles that are physically controlled or owned, such as company fleets.',
                        isDisabled: !isScope1Enabled ? "disabled" : "",
                        imagePath: '/images/scope/scope-1.svg',
                        onClick: () => {
                          if (isScope1Enabled) {
                            setScope(scopeSlug?.scope1);
                          }
                        },
                      },
                      {
                        scopeName: 'Scope 2',
                        isSelected: scopeSlug?.scope2 === scope,
                        description: 'Purchased energy, such as electricity, steam, heating, or cooling.',
                        isDisabled: !isScope1Enabled ? "disabled" : "",
                        imagePath: '/images/scope/scope-2.svg',
                        onClick: () => {
                          if (isScope1Enabled) {
                            setScope(scopeSlug?.scope2);
                          }
                        },
                      },
                      {
                        scopeName: 'Scope 3',
                        isSelected: scopeSlug?.scope3 === scope,
                        description: 'Value chain emissions, such as third-party transportation and distribution.',
                        isDisabled: false,
                        imagePath: '/images/scope/scope-3.svg',
                        onClick: () => setScope(scopeSlug?.scope3),
                      },
                    ].map((el: any, index: number) => 
                    <button data-testid={`scope-button-${index}`} type="button" key={el.scopeName} onClick={el.onClick} className="border-0 bg-transparent h-100 w-100">
                      <div className={`chooseScope ${el.isSelected ? 'checked' : el.isDisabled} p-3 h-100`}>
                        <div className="d-flex justify-content-between align-items-center mb-xxl-3 mb-2">
                          <div className="d-flex gap-2 align-items-center">
                            <ImageComponent path={el.isSelected ? el.imagePath.replace('.svg', '-white.svg') : el.imagePath} className="pe-0" />
                            <Heading className="font-xxl-28 font-24 fw-semibold mb-0" content={el.scopeName} level="3" />
                          </div>
                          <FormGroup check>
                            <Input type="checkbox" checked={el.isSelected} readOnly disabled={el.isDisabled} />
                          </FormGroup>
                        </div>
                        <p className="font-xxl-20 font-16 fw-normal mb-0 text-start">{el.description}</p>
                      </div>
                    </button>)
                  }
                </Row>
                <div className="d-flex gap-3 align-items-center justify-content-end mb-3 mt-xxl-4 mt-3 w-100">
                  <ButtonComponent data-testid="continue-button" onClick={moveToNextPage} text="Continue" imagePath="/images/back.svg" btnClass="btn-deepgreen font-14 d-flex flex-row-reverse px-4" />
                </div>
              </div>
            </Col>
          </Row>

        </Col>
      </Row>
    </div>
  )
}

export default ScopeSelectionView