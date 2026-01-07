import { Row, Col } from 'reactstrap';
import Heading from "component/heading";
import ButtonComponent from "component/forms/button";
import { useNavigate } from "react-router-dom";
import ImageComponent from "../../component/images"
import { distanceConverter, formatNumber, getLowHighImage, getProjectedCost, intermodalCost, intermodalReduction, getProductTypeImpactFraction } from 'utils';

const ProjectCardView = (props: any) => {
    const { selectByLever, projectList, showAll, setShowAll, removeProject, headingTitle, projectKey, fuelStopList, rdFuelStopDto, evFuelStopDto } = props
    const navigate = useNavigate();
    let maxCount = showAll ? projectList?.length : 3
    return (
        <>
            {/* Modal Shift Projects */}
            {(selectByLever?.value === "" || selectByLever?.value === projectKey) && <div className="modalShiftCard mainGrayCards p-3 mb-3">
                <div className="pacific-overview mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex gap-2">
                            <Heading level="4"
                                content={headingTitle}
                                className="font-20 font-xxl-24 fw-semibold mb-0" />
                            <div className="total-projects-shown d-flex justify-content-center align-items-center">
                                <span>{projectList?.length}</span>
                            </div>
                        </div>

                        {(projectList?.length > 3) &&
                            <ButtonComponent data-testid="show-all" text={`${!showAll ? 'Show All' : 'Hide'}`} btnClass="removeLink" onClick={() => setShowAll(!showAll)} />
                        }
                    </div>
                </div>
                <Row className='g-4'>
                    {projectList?.length > 0 ? projectList?.slice(0, maxCount)?.map((i: any) => {
                        const avgMiles = distanceConverter(i?.avgDistance)
                        const totalMiles = distanceConverter(i?.distance);
                        let emissions = { newEmission: 0, oldEmission: 0, percentEmissions: 0 };
                        if (projectKey === "modal_shift") {
                            emissions = intermodalReduction(i?.laneIntermodalCordinateData?.road_distance, i?.laneIntermodalCordinateData?.rail_distance, i?.laneIntermodalCordinateData?.emission_intensity, i?.distance, i?.productTypeImpactFraction, i?.laneIntermodalCordinateData?.emission_const)
                        }

                        return (
                            <Col
                                data-testid={`project-card-link-${i?.id}`}
                                onClick={() => navigate(`/scope3/project-detail/${i?.id}/${i?.lane_name}`)}
                                xl="4" lg="6" md="6"
                                key={i?.id}>
                                <div className="inner-data-region h-100">
                                    <div className="priority-btn-wrap position-relative">
                                        <div className="priority-btn">
                                            <label htmlFor='track' className="px-4 py-1">
                                                On Track
                                            </label>
                                        </div>
                                        <div className="id-data p-3">
                                            <div className="text-end">
                                                <ButtonComponent data-testid={`remove-project-${i?.id}`} text="Remove" btnClass="removeLink" onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeProject(i?.id)
                                                }} />

                                            </div>
                                            <Heading level="6"
                                                content={`ID : #${i?.project_unique_id}`}
                                                className="font-14 fw-semibold"
                                            />
                                            <Heading level="4"
                                                content={`${i?.project_name}`}
                                                className="font-20 font-xxl-24 fw-bold mb-3"
                                            />

                                            <div className="d-flex flex-wrap gap-2">
                                                <ButtonComponent text={i?.lane_name?.split("_")[0]} btnClass="outlineBtn-deepgreen px-xxl-3 px-1 py-1 fw-semibold" />
                                                <ButtonComponent text={i?.lane_name?.split("_")[1]} btnClass="outlineBtn-deepgreen px-xxl-3 px-1 py-1 fw-semibold" />
                                            </div>
                                        </div>
                                        <div className="quartely-wrapper p-3">
                                            <Row>
                                                <Col lg="6">
                                                    <div className="quartely">
                                                        <Heading level="4"
                                                            content="Estimated cost impact"
                                                            className="font-14"
                                                        />
                                                        {projectKey === "carrier_shift" && <Heading
                                                            level="6"
                                                            className={`font-14 font-xxl-16 mb-2 fw-semibold d-flex align-items-center gap-1 distance ${getLowHighImage(i?.cost, 0, true)}`}>
                                                            {formatNumber(true, Math.abs(i?.cost), 0)}%{" "}
                                                            <span className="tableArrow ms-1">
                                                                <ImageComponent
                                                                    path={`/images/${getLowHighImage(i?.cost, 0)}`}
                                                                    className="pe-0"
                                                                />
                                                            </span>
                                                        </Heading>}
                                                        {projectKey === "alternative_fuel" && <Heading
                                                            level="6"
                                                            className={`font-14 font-xxl-16 mb-2 fw-semibold d-flex align-items-center gap-1 distance ${getLowHighImage(i?.distance * (i?.productTypeCostPremiumConst ? i?.productTypeCostPremiumConst : evFuelStopDto?.cost_premium_const), i?.avgDistance, true)}`}
                                                        >
                                                            {formatNumber(true, getProjectedCost(
                                                                totalMiles,
                                                                avgMiles,
                                                                i?.costByLaneDollarPerMile,
                                                                {
                                                                    fuel_stop: { cost_premium_const: i?.productTypeCostPremiumConst, impact_fraction: i?.productTypeImpactFraction, product_code: i?.productTypeCode },
                                                                    ev_fuel_stop: evFuelStopDto,
                                                                    rd_fuel_stop: rdFuelStopDto,
                                                                    recommendedKLaneFuelStop: [{ product_code: i?.is_ev ? "EV" : "" }, { product_code: i?.is_rd ? "RD" : "" }]
                                                                }, projectKey,
                                                                {
                                                                    showFuelStops: i?.is_alternative,
                                                                    showFuelStopsEV: i?.is_ev,
                                                                    showFuelStopsRD: i?.is_rd,
                                                                    selectedFuelStop: fuelStopList?.filter((item: any) => i?.fuel_type?.split(",")?.includes(item.code))?.map((i: any) => ({ ...i, product_code: i.code }))
                                                                }, {
                                                                ev_fuel_stop: evFuelStopDto,
                                                                rd_fuel_stop: rdFuelStopDto
                                                            }
                                                            ).cost, 0)}
                                                            %{" "}
                                                            <span>
                                                                <ImageComponent path={`/images/${getLowHighImage(i?.distance * (i?.productTypeCostPremiumConst ? i?.productTypeCostPremiumConst : evFuelStopDto?.cost_premium_const), i?.avgDistance)}`} className="pe-0" />
                                                            </span>
                                                        </Heading>}
                                                        { projectKey === "modal_shift" && 
                                                                <Heading
                                                                    level="6"
                                                                    className={`font-14 font-xxl-16 mb-2 fw-semibold d-flex align-items-center gap-1 distance ${getLowHighImage(
                                                                        i?.distance * i?.productTypeCostPremiumConst,
                                                                        i?.avgDistance,
                                                                        true
                                                                    )}`}
                                                                >
                                                                    {formatNumber(
                                                                        true,
                                                                        intermodalCost(
                                                                            avgMiles,
                                                                            i?.laneIntermodalCordinateData?.road_distance,
                                                                            i?.costByLaneDollarPerMile,
                                                                            i?.productTypeCostPremiumConst,
                                                                            i?.laneIntermodalCordinateData?.rail_distance,
                                                                            i?.laneIntermodalCordinateData?.cost_per_mile
                                                                        ),
                                                                        0
                                                                    )}
                                                                    %{" "}
                                                                    <span>
                                                                        <ImageComponent
                                                                            path={`/images/${getLowHighImage(
                                                                                i?.distance * i?.productTypeCostPremiumConst,
                                                                                i?.avgDistance
                                                                            )}`}
                                                                            className="pe-0"
                                                                        />
                                                                    </span>
                                                                </Heading>
                                                            
                                                        }
                                                    </div>
                                                </Col>
                                                <Col lg="6">
                                                    <div className="quartely">
                                                        <Heading level="4"
                                                            content={`Projected emissions reduction`}
                                                            className="font-14"
                                                        />
                                                        {projectKey === "carrier_shift" && <Heading level="4" className="font-14 font-xxl-16 mb-2 fw-semibold distance" >
                                                            {formatNumber(true, i?.emission_reduction, 0)}%{" "}
                                                            <span className="tableArrow">
                                                                <ImageComponent
                                                                    path="/images/greenArrowDowm.svg"
                                                                    className="pe-0"
                                                                />
                                                            </span></Heading>}
                                                        {projectKey === "alternative_fuel" &&
                                                            <Heading level="4" className={`font-14 font-xxl-16 mb-2 fw-semibold distance ${getLowHighImage(getProductTypeImpactFraction(i, fuelStopList, evFuelStopDto), 1, true)}`}>

                                                                {formatNumber(true, Math.abs((1 - getProductTypeImpactFraction(i, fuelStopList, {
                                                                    ev_fuel_stop: evFuelStopDto,
                                                                    rd_fuel_stop: rdFuelStopDto
                                                                })) * 100), 0)}%{" "}
                                                                {Math.abs(getProductTypeImpactFraction(i, fuelStopList, {
                                                                    ev_fuel_stop: evFuelStopDto,
                                                                    rd_fuel_stop: rdFuelStopDto
                                                                })) !== 0 && <span>
                                                                        <ImageComponent path={`/images/${getLowHighImage(getProductTypeImpactFraction(i, fuelStopList, evFuelStopDto), 1)}`} className="pe-0" />
                                                                    </span>}

                                                            </Heading>}
                                                        {projectKey === "modal_shift" && 
                                                                <Heading
                                                                    level="4"
                                                                    className={`font-14 font-xxl-16 mb-2 fw-semibold distance ${getLowHighImage(
                                                                        emissions?.newEmission,
                                                                        emissions?.oldEmission,
                                                                        true
                                                                    )}`}
                                                                >
                                                                    {formatNumber(true, emissions?.percentEmissions, 0)}%{" "}
                                                                    {Math.abs(emissions?.percentEmissions) !== 0 && (
                                                                        <span>
                                                                            <ImageComponent
                                                                                path={`/images/${getLowHighImage(
                                                                                    emissions?.newEmission,
                                                                                    emissions?.oldEmission
                                                                                )}`}
                                                                                className="pe-0"
                                                                            />
                                                                        </span>
                                                                    )}
                                                                </Heading>
                                                           }
                                                        <Heading level="6"
                                                            content={`By Q${i?.quarter} ${i?.year}`}
                                                            className="font-14 fw-semibold"
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        )
                    }) : (
                        <Row>
                            <Col lg="12">
                                <div className='d-flex justify-content-center align-items-center py-5 my-3'>
                                    No Project Found
                                </div>

                            </Col>
                        </Row>
                    )}
                </Row>
            </div>}

        </>
    )
}
export default ProjectCardView