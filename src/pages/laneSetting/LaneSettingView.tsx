import Heading from 'component/heading'
import TitleComponent from 'component/tittle'
import ImageComponent from 'component/images'
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap'
import ButtonComponent from 'component/forms/button'
import LaneSettingController from './laneSettingController'
import Loader from 'component/loader/Loader'
import { isCompanyEnable } from 'utils'
import { companySlug } from 'constant'

const RadiusInputs = ({ fuel, laneRangeData, selectedFuelRadius, handleChange }: any) => {
  return <div className='p-3 different-fuel'>
    <Heading level="3" className="font-xxl-18 font-16 fw-medium mb-3" content={laneRangeData?.data?.[fuel]?.[0]?.label} />
    <div>
      <Heading level="3" className="font-14 fw-normal mb-2" content="Select radius:" />
      <div className='d-flex align-items-center gap-3 flex-wrap'>
        {laneRangeData?.data?.[fuel]?.map((radius: any) => {
          const isChecked = Number(selectedFuelRadius[radius?.fuel_type]) === Number(radius?.radius);
          return (
            <button type='button' data-testid={`${fuel}_${radius?.id}`} key={radius?.id} className={`checkbox-outer bg-transparent ${isChecked ? 'checked' : ''}`} onClick={() => handleChange(radius?.fuel_type, radius?.radius)}>
              <FormGroup check>
                <Input
                  name={fuel}
                  type="radio"
                  checked={isChecked}
                  readOnly
                />
                {' '}
                <Label check className='font-14'>{radius?.radius} Miles</Label>
              </FormGroup>
            </button>
          );
        })}
      </div>
    </div>
  </div>
}

const LaneSettingView = () => {

  const {
    loginDetails,
    isLaneRangeLoading,
    configConstantsIsLoading,
    laneRangeData,
    selectedFuelRadius,
    handleChange,
    handleSubmit,
    fuelList
  } = LaneSettingController()

  return (
    <>
      <TitleComponent title={"Lane Settings"} pageHeading="Lane Settings" />
      <section className="laneSetting-screen pb-4 pt-2" data-testid="lane-settings">
        <Loader isLoading={[configConstantsIsLoading, isLaneRangeLoading]} />
        <div className='p-3 border-bottom'>
          <Heading level="3" className="font-xxl-24 font-20 fw-semibold" content="Set Fuel Stop Radius" />
          <Heading level="4" content="Set the fuel stops radius for lane planning." className="font-14 fw-normal" />
        </div>
        <div className='p-3'>
          <Row>
            <Col lg="12">
              <Form onSubmit={handleSubmit}>
                <div className='fuel-card mb-3'>
                  <div className='border-bottom p-3 d-flex align-items-center gap-2'>
                    <ImageComponent path='/images/fuelNew.svg' className='pe-0' />
                    <Heading level="4" content="Alternative Fuels" className="font-20 fw-semibold mb-0 text-deepgreen" />
                  </div>
                  <div className='d-flex flex-wrap'>
                    {fuelList.map((el: string) =>
                      laneRangeData?.data?.[el] ? (
                        <RadiusInputs
                          key={el}
                          fuel={el}
                          laneRangeData={laneRangeData}
                          selectedFuelRadius={selectedFuelRadius}
                          handleChange={handleChange}
                        />
                      ) : null
                    )}
                  </div>

                </div>
                <Row>
                  {laneRangeData?.data?.["ev"] &&
                    isCompanyEnable(loginDetails?.data, [companySlug?.demo, companySlug?.pep]) && (
                      <Col lg="6">
                        <div className='fuel-card ev-card mb-3 h-100'>
                          <div className='border-bottom p-3 d-flex align-items-center gap-2'>
                            <ImageComponent path='/images/fuelNew.svg' className='pe-0' />
                            <Heading
                              level="4"
                              content="EV Charging Stations"
                              className="font-20 fw-semibold mb-0 text-deepgreen"
                            />
                          </div>
                          <RadiusInputs
                            fuel={"ev"}
                            laneRangeData={laneRangeData}
                            selectedFuelRadius={selectedFuelRadius}
                            handleChange={handleChange}
                          />
                        </div>
                      </Col>
                    )}
                  <Col lg="6">
                    <div className='radius-view p-3 h-100'>
                      <Heading level="4" content="Fuel Stop Radius View" className="font-20 fw-semibold" />
                      <ImageComponent path='/images/radius-view.svg' className='pe-0 w-100' />
                    </div>
                  </Col>
                </Row>

                <div className='pt-4'>
                  <ButtonComponent data-testid="form-submit" text='Submit' type='submit' btnClass='btn-deepgreen px-4 py-2 font-14' />
                </div>
              </Form>
            </Col>
          </Row>

        </div>
      </section>
    </>
  )
}

export default LaneSettingView