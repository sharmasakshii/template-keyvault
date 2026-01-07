import ButtonComponent from "component/forms/button";
import Heading from "component/heading";
import ImageComponent from "../../component/images";
import Accordion from "react-bootstrap/Accordion";
import CarrierRankingTooltip from "../../component/carrierRankingTooltip"
import {
  distanceConverter,
  formatNumber,
  getLaneEmission,
  getLowHighImage,
  getProjectedCost,
  timeConverter,
  getCheckedValue,
  formatPerUnit,
} from "utils";
import Logo from "component/logo";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { evProductCode } from "constant";



const RecommondationCard = ({
  index,
  lane,
  selectedRecommondation,
  handleSelectRecommondation,
  deltaMetrix,
  scenarioDetails,
  routeType,
  btnIndex,
  handleOpenCreateProject,
  laneName,
  showFuelStops,
  showFuelStopsEV,
  laneDto,
  isLanePlanning,
  selectedFuelStop,
  setProjectValues,
  configConstants,
  projectId,
  showFuelStopsRD,
  isCreateProject,
  checkLaneFuelData,
  isCheckLaneFuelLoading
}: any) => {

  const defaultUnit = configConstants?.data?.default_distance_unit

  const avgMiles = distanceConverter(deltaMetrix?.distance,
    defaultUnit
  );
  const totalMiles = distanceConverter(lane?.key === "carrier_shift" ? deltaMetrix?.distance : lane?.distance, defaultUnit);
  const totalTime = lane?.key === "carrier_shift" ? deltaMetrix?.time : lane?.time
  const dollarPerMile: number = deltaMetrix?.dollar_per_mile || 0;

  const accordionInnerRef = useRef<HTMLDivElement>(null);


  const fuelStopsDto = {
    showFuelStops: getCheckedValue({ showFuelStops, showFuelStopsEV, showFuelStopsRD }, showFuelStops, lane?.recommendedKLaneFuelStop)?.showFuelStops,
    showFuelStopsEV: getCheckedValue({ showFuelStops, showFuelStopsEV, showFuelStopsRD }, showFuelStopsEV, lane?.recommendedKLaneFuelStop)?.showFuelStopsEV,
    showFuelStopsRD: getCheckedValue({ showFuelStops, showFuelStopsEV, showFuelStopsRD }, showFuelStopsRD, lane?.recommendedKLaneFuelStop)?.showFuelStopsRD,
    selectedFuelStop
  }

  const handleAccordionChange = () => {
    if (accordionInnerRef.current) {
      accordionInnerRef.current.scrollTop = 0;
    }
  };

  const calculateEmissionReduction = () => {
    let emissionReduction = 0
    let valueImageName = ""
    let imageClass = ""
    if (lane?.key === "carrier_shift") {
      emissionReduction = formatNumber(true, lane?.carriers?.[0]?.carrierEmissionsReduction?.emission_reduction, 0)
      valueImageName = "greenArrowDowm.svg"
    } else {
      const emissions = getLaneEmission(
        lane,
        scenarioDetails,
        totalMiles,
        routeType,
        fuelStopsDto,
        laneDto?.data
      );
      emissionReduction = lane?.key === "alternative_fuel" ? formatNumber(true, emissions?.percentEmissions, 0) : formatNumber(true, Math.abs(emissions?.percentEmissions), 0);
      valueImageName = Math.abs(emissions?.percentEmissions) !== 0 ? getLowHighImage(emissions?.newEmission, emissions?.oldEmission) : ""
      imageClass = getLowHighImage(
        emissions?.newEmission,
        emissions?.oldEmission,
        true
      )
    }
    return {
      emissionReduction,
      valueImageName,
      imageClass
    }
  }

  const calculateCost = () => {
    let cost = 0
    let emissionReductionPerSpent = ""
    let valueImageName = ""
    let imageClass = ""
    let heading = ""

    if (lane?.key === "carrier_shift") {
      heading = "Emission Reduction/$ spent"
      cost = formatNumber(true, lane?.carriers?.[0]?.carrierEmissionsReduction?.cost, 0)
      emissionReductionPerSpent = formatNumber(true, lane?.carriers?.[0]?.carrierEmissionsReduction?.dollar_per_reduction, 2)
      valueImageName = getLowHighImage(lane?.carriers?.[0]?.carrierEmissionsReduction?.cost, 0)

    } else {
      heading = "Cost"

      const projectedCost = getProjectedCost(totalMiles, avgMiles, dollarPerMile, lane, routeType, fuelStopsDto, laneDto?.data)
      const costPremiumConst = projectedCost.costPremiumConstFraction


      cost = formatNumber(true, projectedCost.cost, 0);
      valueImageName = getLowHighImage(lane?.distance * costPremiumConst, deltaMetrix?.distance)
      imageClass = getLowHighImage(
        lane?.distance * costPremiumConst,
        deltaMetrix?.distance,
        true
      )
    }
    return {
      cost,
      emissionReductionPerSpent,
      valueImageName,
      imageClass,
      heading
    }

  }

  let emissionReductionValue = calculateEmissionReduction()

  let costValue = calculateCost()
  const enableCreateProject = isCreateProject || (lane?.key === "alternative_fuel" && checkLaneFuelData?.data?.results?.filter((res: any) => res.isValid === 1)?.length === 0);
  return (
    <button onClick={() => isLanePlanning && handleSelectRecommondation(index, lane?.key)}
      className={`recomendedCard p-0 w-100 cursorAuto${selectedRecommondation === index && "activeGreen"}  mb-2`}>
      <div className="recommendationTxt p-3" data-testid={`recommendation-card-accordion-${btnIndex}`} >
        <Accordion onSelect={handleAccordionChange}>
          <Accordion.Item eventKey="0">
            <Accordion.Header className={`${lane?.key === "carrier_shift" && "carrier-accordion"} p-0`}>
              <div className="">
                <Heading level="4" className="font-16 font-xl-16 font-xxl-20 mb-0 fw-semibold">Recommendation {isLanePlanning && lane?.recommondationId + 1}</Heading>
                <Heading level="4" className="font-14 fw-medium mb-0 infoImg d-flex align-items-center">
                  {(lane?.key === "alternative_fuel" || lane?.isBaseLine) &&
                    `Alternate Fuel Stops: ${lane?.recommendedKLaneFuelStop?.length}`}
                  {lane?.key === "carrier_shift" && " Carrier Shift"}
                  {lane?.key === "modal_shift" && "Modal Shift"}
                  <span>
                    <ImageComponent path="/images/infoPrimary.svg" className="pe-0 ps-2" />
                  </span>
                </Heading>
              </div>
            </Accordion.Header>
            {lane?.key === "carrier_shift" && <Accordion.Body ref={accordionInnerRef} className="p-2 bg-white mt-2 pb-5">

              <div className="border carrier-details text-start">
                {lane?.carriers?.map((carrier: any) =>
                  <div className=" border-bottom p-3 text-start" key={carrier?.carrier} >
                    <div className="carrier mb-3 text-start">
                      <div className="carrierLogoTooltip text-start d-inline-flex">
                        <CarrierRankingTooltip item={carrier} />
                        <span className="tableImage">
                          <Link to={`/scope3/carrier-overview/${carrier?.carrier}/detail/${laneName}/${configConstants?.data?.DEFAULT_YEAR}/0/${projectId || ""}`}>
                            <Logo
                              path={carrier?.carrier_logo}
                              name={carrier?.carrier_name}
                            />                          
                          </Link>
                        </span>
                      </div>
                       <Heading level="4" className="font-14 fw-bold mt-2">
    {carrier?.carrier_name}{" "} <span>  ({carrier?.carrier})</span>
                    
                       </Heading>
                   
                    </div>
                    <div className="emissions d-flex justify-content-between gap-2 mb-2">
                      <Heading level="5" className="font-16 mb-0 fw-normal">
                        Emissions
                      </Heading>
                      <div className={` distance ${getLowHighImage(0, carrier?.carrierEmissionsReduction?.emission_reduction, true)}`}>
                        <span className="font-16 fw-semibold">{formatNumber(
                          true,
                          carrier?.carrierEmissionsReduction?.emission_reduction,
                          0
                        )}%</span>
                        <span className="tableArrow ms-1">
                          <ImageComponent
                            path={`/images/${getLowHighImage(0, carrier?.carrierEmissionsReduction?.emission_reduction)}`}
                            className="pe-0"
                          />
                        </span>
                      </div>
                    </div>
                    <div className="emissions d-flex justify-content-between gap-2 mb-2">
                      <Heading level="5" className="font-16 mb-0 fw-normal">
                        Cost
                      </Heading>
                      <div className={`distance ${getLowHighImage(carrier?.carrierEmissionsReduction?.cost, 0, true)}`}>
                        <span className="font-16 fw-semibold">{formatNumber(
                          true,
                          Math.abs(carrier?.carrierEmissionsReduction?.cost),
                          0
                        )}%</span>
                        <span className="tableArrow ms-1">
                          <ImageComponent
                            path={`/images/${getLowHighImage(carrier?.carrierEmissionsReduction?.cost, 0)}`}
                            className="pe-0"
                          />
                        </span>
                      </div>
                    </div>
                    <div className="emissions d-flex justify-content-between gap-2">
                      <Heading level="5" className="font-16 mb-0 fw-normal">
                        Emission Reduction/$ spent <span className="font-10 mb-0">tCO2e</span>
                      </Heading>
                      <div className="distance">
                        <span className="font-16 fw-semibold">{formatNumber(
                          true,
                          carrier?.carrierEmissionsReduction?.dollar_per_reduction,
                          2
                        )}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </Accordion.Body>}
          </Accordion.Item>
        </Accordion>
      </div>
      <div className="emissionsTxt p-3">
        <div className="mb-2 d-flex justify-content-between flex-wrap align-items-center gap-2">
          <Heading level="5" className="font-16 mb-0 fw-normal">
            Emissions Reduction
          </Heading>
          <Heading
            level="6"
            className={`font-18 mb-0 fw-semibold d-flex align-items-center gap-1 distance ${emissionReductionValue?.imageClass}`}
          >


            <>
              {emissionReductionValue?.emissionReduction || 0}%{" "}
              {emissionReductionValue?.valueImageName && (
                <span>
                  <ImageComponent
                    path={`/images/${emissionReductionValue?.valueImageName}`}
                    className="pe-0"
                  />
                </span>
              )}
            </>

          </Heading>
        </div>
        <div className="mb-2 d-flex justify-content-between align-items-center gap-2">
          <Heading level="5" className="font-16 mb-0 fw-normal">
            {costValue?.heading}
          </Heading>
          <Heading
            level="6"
            className={`font-18 mb-0 fw-semibold d-flex align-items-center gap-1 distance ${costValue?.imageClass}`}
          >

            <>
              {lane?.key === "carrier_shift"
                ? costValue?.emissionReductionPerSpent
                : `${costValue?.cost}%`}{" "}
              {lane?.key !== "carrier_shift" && (
                <span>
                  <ImageComponent
                    path={`/images/${costValue?.valueImageName}`}
                    className="pe-0"
                  />
                </span>
              )}
            </>

          </Heading>
        </div>
        {isLanePlanning && (
          <div className="text-end mt-4">
            <ButtonComponent
              data-testid={`create-project-btn ${btnIndex}`}
              text="Create Project"
              isLoading={isCheckLaneFuelLoading}
              btnClass="btn-deepgreen fw-medium font-14 py-2 px-4"
               disabled={enableCreateProject}
              onClick={(e: any) => {
                e.stopPropagation();
                handleOpenCreateProject(index);
                setProjectValues({
                  distance: {
                    value: `${formatNumber(true, totalMiles, 1)} ${formatPerUnit(defaultUnit)}`,
                    arrow: null
                  },
                  transit_time: { value: timeConverter(totalTime), arrow: null },
                  cost: { value: `${costValue?.cost}%`, arrow: costValue?.valueImageName },
                  emissions_reduction: { value: `${emissionReductionValue?.emissionReduction}%`, arrow: emissionReductionValue?.valueImageName },
                  emissions_reduction_spent: { value: `$${costValue?.emissionReductionPerSpent}`, arrow: null },
                  rail_provider: { value: lane?.rail_provider, arrow: null },
                  carrier_provider: {
                    value: lane?.key === "modal_shift"
                      ? lane?.carrier_code
                      : lane?.carriers?.map((res: any) => res?.carrier)?.toString(),
                    arrow: null
                  },
                  fuel_type: lane?.key !== "carrier_shift" && {
                    value: lane?.fuel_stop?.product_code,
                    arrow: null
                  },
                  ev_charger: lane?.key === "alternative_fuel" && {
                    value: lane?.recommendedKLaneFuelStop?.filter((res: any) => res.product_codes === evProductCode)?.length > 0
                      ? showFuelStopsEV
                      : false,
                    arrow: null
                  },
                  fuel_type_recommondation: { value: selectedFuelStop?.map((obj: any) => obj?.product_code), arrow: null },
                });

              }}
            />
          </div>
        )}

      </div>
    </button>
  );
};

export default RecommondationCard;