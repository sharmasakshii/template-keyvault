import SustainViewCard from 'component/cards/sustainabilityTracker'
import { Col, Row } from 'reactstrap'

const ScopeMatrix = ({isLoading=false, unit, matrixEmissionsValue, matrixFuelValue, matrixLocationValue, matrixEmissionTxt, matrixConsumptionTxt, matrixLocationTxt,locationIcon }: any) => {
    return (
        <div className='mb-3'>
            <Row className="g-3">
                <Col md="4">
                    <SustainViewCard
                        isLoading={isLoading}
                        cardValue={matrixEmissionsValue}
                        imagePath="/images/emission-icon-bold.svg"
                        cardDate={matrixEmissionTxt}
                        cardSubHeading="tCO2e"
                    />
                </Col>
                <Col md="4">
                    <SustainViewCard
                        isLoading={isLoading}
                        cardValue={matrixFuelValue}
                        imagePath={"/images/fuel-icon-bold.svg"}
                        cardDate={matrixConsumptionTxt}
                        cardSubHeading="Gallons"
                    />
                </Col>
                <Col md="4">
                    <SustainViewCard
                        isLoading={isLoading}
                        cardValue={matrixLocationValue}
                        imagePath={locationIcon}
                        cardDate={matrixLocationTxt}
                        cardSubHeading={unit}
                    />
                </Col>
            </Row>
        </div>


    )
}

export default ScopeMatrix