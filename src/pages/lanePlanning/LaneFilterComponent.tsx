import Heading from 'component/heading'
import Accordion from 'react-bootstrap/Accordion';
import ImageComponent from "../../component/images"
import { useAppSelector } from 'store/redux.hooks';
import { distanceConverterInterModal, isCompanyEnable } from 'utils';
import { companySlug } from 'constant';

export const FuelStopRadiusComponent = ({ configConstants, loginDetails, radius }: any) => {
    return (
        <div>
            <Heading level="3" content="Fuel Stops Radius" className="font-16 fw-semibold text-dark mt-2 mb-2" />
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2 mt-3">
                <ImageComponent path="/images/fuelNew.svg" className="pe-0" />
                <Heading level="4" className="font-14 fw-semibold destinationName mb-0">Alternative Fuels</Heading>
            </div>
            <ul>
                {[
                    { label: 'Upto B20', key: 'bio_1_20_radius', companies: [companySlug?.pep, companySlug?.demo, companySlug.lw, companySlug?.bmb, companySlug?.rb] },
                    { label: 'B21 to B99', key: 'bio_21_99_radius', companies: [companySlug?.pep, companySlug?.demo, companySlug.lw, companySlug?.bmb, companySlug?.rb] },
                    { label: 'B100', key: 'bio_100_radius', companies: [companySlug?.pep, companySlug?.demo, companySlug?.rb, companySlug?.bmb] },
                    { label: 'B99', key: 'b99_radius', companies: [companySlug?.demo] },
                    { label: 'RD', key: 'rd_radius', companies: [companySlug?.pep, companySlug?.demo, companySlug?.rb, companySlug?.bmb] },
                    { label: 'Optimus', key: 'optimus_radius', companies: [companySlug?.pep] },
                    { label: 'RNG', key: 'rng_radius', companies: [companySlug?.pep, companySlug?.demo, companySlug?.rb, companySlug?.bmb] },
                    { label: 'HVO', key: 'hvo_radius', companies: [companySlug?.pep] },
                    { label: 'HYDROGEN', key: 'hydrogen_radius', companies: [companySlug?.pep, companySlug?.demo] }
                ].filter((el) => isCompanyEnable(loginDetails?.data, el.companies)).map(({ label, key }) => <li key={key}>
                    <Heading level="6" className="font-16 mb-1 fw-normal">
                        {label}: {" "}
                        {companySlug?.bmb
                            ?
                            Number(
                                Math.floor(
                                    distanceConverterInterModal(
                                        radius,
                                        configConstants?.data?.default_distance_unit
                                    ) * 10
                                ) / 10
                            ).toFixed(1)
                            : configConstants?.data?.[key]}{" "}
                        {configConstants?.data?.default_distance_unit === "miles" ? "Miles" : "Kms"}
                    </Heading>
                </li>)}
            </ul>
            {isCompanyEnable(loginDetails?.data, [companySlug?.pep]) && <>
                <div className="d-flex flex-wrap align-items-center gap-2 my-2">
                    <ImageComponent path="/images/evChargeIcon.svg" className="pe-0" />
                    <Heading level="4" className="font-14 fw-semibold destinationName mb-0">EV Charging Stations </Heading>
                </div>
                <ul>
                    <li>
                        <Heading level="6" className="font-16 mb-1 fw-normal">EV Stations: {radius} {""}
                            {configConstants?.data?.default_distance_unit === "miles" ? "Miles" : "Kms"}
                        </Heading>
                    </li>
                </ul>
            </>
            }
        </div>)
}

const LaneFilterComponent = ({
    selectHighWay,
    selectRail,
    city,
    laneSortestPathData,
    defaultUnit,
    radius
}: any) => {

    const { configConstants } = useAppSelector((state: any) => state.sustain);
    const { loginDetails } = useAppSelector((state: any) => state.auth);
    const { divisions } = useAppSelector((state: any) => state.commonData);
    return (
        <div>
            {isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo]) && <div className='border-bottom mb-3'><div className='d-flex flex-wrap gap-2'>
                <Heading level="6" className="font-16 mb-1 fw-semibold">Divisions :</Heading>
                <Heading level="6" className="font-16 mb-1 fw-semibold">{laneSortestPathData?.data?.divisionIds?.map((el: any) => divisions?.data?.find((divi: any) => (el?.division_id === divi?.id))?.name)?.join(", ")}</Heading>
            </div></div>
            }
            <div className="mb-3">
                <Heading level="3" content="Lane Name" className="font-16 fw-semibold text-dark mb-2" />
                <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                    <div className="d-flex gap-2 mb-0">
                        <ImageComponent path="/images/lane-icon-small.svg" className="pe-0" />
                        <Heading level="4" className="font-14 fw-semibold destinationName mb-0 text-decoration-underline">{city}</Heading>
                    </div>
                    <div className="text-end">
                        <Heading level="6" className="font-8 compare-tag mb-0">Compare</Heading>
                    </div>
                </div>
                <ul>

                    {selectHighWay && <li>
                        <Heading level="6" className="font-16 mb-1 fw-normal">Highway</Heading>
                    </li>}
                    {selectRail && <li>
                        <Heading level="6" className="font-16 mb-1 fw-normal">Rail</Heading>
                    </li>}
                </ul>
            </div>
            <Accordion className="mb-1">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Lane Calculations Based on</Accordion.Header>
                    <Accordion.Body>
                        <FuelStopRadiusComponent configConstants={configConstants} loginDetails={loginDetails} defaultUnit={defaultUnit} radius={radius} />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    )
}

export default LaneFilterComponent