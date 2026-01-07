import Heading from "../../component/heading";
import ImageComponent from "../../component/images";
import CarrierRankingTooltip from "../../component/carrierRankingTooltip";
import Logo from "component/logo";
import {
  distanceConverter,
  formatNumber,
  getLaneEmission,
  getLowHighImage,
  getPercentageDistanceTime,
  getProjectedCost,
  timeConverter,
  getCheckedValue,
} from "utils";
const LaneDataCard = ({
  lane,
  deltaMetrix,
  scenarioDetails,
  showFuelStops,
  showFuelStopsEV,
  laneFuelStopDto,
  selectedFuelStop,
  showFuelStopsRD,
  configConstants,
}: any) => {
  const defaultUnit = configConstants?.data?.default_distance_unit;
  const totalMiles = distanceConverter(
    lane?.key === "carrier_shift" ? deltaMetrix?.distance : lane?.distance,
    defaultUnit
  );
  const totalTime =
    lane?.key === "carrier_shift" ? deltaMetrix?.time : lane?.time;
  const avgMiles = distanceConverter(deltaMetrix?.distance, defaultUnit);
  const avgTime = deltaMetrix?.time;
  const dollarPerMile: number = deltaMetrix?.dollar_per_mile || 0;
  const routeType =
    lane?.key === "modal_shift" ? "modal_shift" : "alternative_fuel";

  const fuelStopsDto = {
    showFuelStops: getCheckedValue(
      { showFuelStops, showFuelStopsEV, showFuelStopsRD },
      showFuelStops,
      lane?.recommendedKLaneFuelStop
    ).showFuelStops,
    showFuelStopsEV: getCheckedValue(
      { showFuelStops, showFuelStopsEV, showFuelStopsRD },
      showFuelStopsEV,
      lane?.recommendedKLaneFuelStop
    ).showFuelStopsEV,
    showFuelStopsRD: getCheckedValue(
      { showFuelStops, showFuelStopsEV, showFuelStopsRD },
      showFuelStopsRD,
      lane?.recommendedKLaneFuelStop
    ).showFuelStopsRD,
    selectedFuelStop,
  };
  const emissions = getLaneEmission(
    lane,
    scenarioDetails,
    totalMiles,
    routeType,
    fuelStopsDto,
    laneFuelStopDto
  );
  const projectedCost = getProjectedCost(
    totalMiles,
    avgMiles,
    dollarPerMile,
    lane,
    routeType,
    fuelStopsDto,
    laneFuelStopDto
  );
  const costPremiumConst = projectedCost.costPremiumConstFraction;
 
  return (
    <div>
      <div className="distanceWrapper border-0 pb-4">
        {lane?.key === "carrier_shift" && (
          <div className="carrierLogoTooltip text-start  d-inline-flex mb-3">
            <CarrierRankingTooltip item={lane?.carriers?.[0]} />
            <span className="tableImage">
              <div className="d-flex gap-2 align-items-center carrierplanning mb-0 cursor">
                <Logo
                  path={lane?.carriers?.[0]?.carrier_logo}
                  name={lane?.carriers?.[0]?.carrier_name}
                />
                <Heading
                  level="6"
                  className="font-14 font-xxl-16 mb-0 fw-semibold"
                  content={`${lane?.carriers?.[0]?.carrier_name} (${lane?.carriers?.[0]?.carrier})`}
                />
              </div>
            </span>
          </div>
        )}
        <div>
          <div className="grid-container">
            <div className="">
              <div className="d-flex gap-1 align-items-center">
                <ImageComponent
                  path="/images/projectDistance.svg"
                  className="pe-0"
                />
                <div>
                  <div className="d-flex gap-1 align-items-center">
                    <Heading
                      level="4"
                      className="font-14 font-xxl-16 mb-0 fw-normal"
                    >
                      Distance
                    </Heading>
                    <Heading
                      level="4"
                      className={`font-14 font-xxl-16 mb-0 fw-semibold distance ${getLowHighImage(
                        getPercentageDistanceTime(totalMiles, avgMiles),
                        0,
                        true
                      )}`}
                    >
                      {formatNumber(true, totalMiles, 1)}{" "}
                      {configConstants?.data?.default_distance_unit === "miles"
                        ? "Miles"
                        : "Kms"}{" "}
                      <span>
                        {" "}
                        (
                        {formatNumber(
                          true,
                          getPercentageDistanceTime(totalMiles, avgMiles),
                          1
                        )}
                        %){" "}
                        {Number(
                          getPercentageDistanceTime(
                            totalMiles,
                            avgMiles
                          ).toFixed(1)
                        ) !== 0 && (
                          <ImageComponent
                            path={`/images/${getLowHighImage(
                              getPercentageDistanceTime(totalMiles, avgMiles),
                              0
                            )}`}
                            className="pe-0"
                          />
                        )}
                      </span>
                    </Heading>
                  </div>
                  {!lane?.isBaseLine && (
                    <Heading
                      level="4"
                      className="font-10 font-xxl-12 mb-0 fw-normal"
                    >
                      Baseline: {formatNumber(true, avgMiles, 1)}{" "}
                      {configConstants?.data?.default_distance_unit === "miles"
                        ? "Miles"
                        : "Kms"}
                    </Heading>
                  )}
                </div>
              </div>
            </div>
            <div className="">
              <div className="d-flex gap-1 align-items-center">
                <ImageComponent
                  path="/images/projectTime.svg"
                  className="pe-0"
                />
                <div>
                  <div className="d-flex gap-1 align-items-center">
                    <Heading
                      level="4"
                      className="font-14 font-xxl-16 mb-0 fw-normal"
                    >
                      Transit Time
                    </Heading>
                    <Heading
                      level="4"
                      className={`font-14 font-xxl-16 mb-0 fw-semibold distance ${getLowHighImage(
                        getPercentageDistanceTime(totalTime, avgTime),
                        0,
                        true
                      )}`}
                    >
                      {timeConverter(totalTime)}
                      <span>
                        {" "}
                        (
                        {formatNumber(
                          true,
                          getPercentageDistanceTime(totalTime, avgTime),
                          1
                        )}
                        %){" "}
                        {Number(
                          getPercentageDistanceTime(
                            lane?.time,
                            avgTime
                          ).toFixed(1)
                        ) !== 0 && (
                          <ImageComponent
                            path={`/images/${getLowHighImage(
                              getPercentageDistanceTime(totalTime, avgTime),
                              0
                            )}`}
                            className="pe-0"
                          />
                        )}
                      </span>
                    </Heading>
                  </div>
                  {!lane?.isBaseLine && (
                    <Heading
                      level="4"
                      className="font-10 font-xxl-12 mb-0 fw-normal"
                    >
                      Baseline: {timeConverter(avgTime)}
                    </Heading>
                  )}
                </div>
              </div>
            </div>
            <div className="">
              <div className="d-flex gap-1 align-items-center">
                <ImageComponent
                  path="/images/projectCost.svg"
                  className="pe-0"
                />
                <div>
                  <div className="d-flex gap-1 align-items-center">
                    <Heading
                      level="4"
                      className="font-14 font-xxl-16 mb-0 fw-normal"
                    >
                      Cost
                    </Heading>
                    {lane?.key === "carrier_shift" ? (
                      <Heading
                        level="4"
                        className={`font-14 font-xxl-16 mb-0 fw-semibold distance ${getLowHighImage(
                          lane?.carriers?.[0]?.carrierEmissionsReduction?.cost,
                          0,
                          true
                        )}`}
                      >
                        {formatNumber(
                          true,
                          Math.abs(
                            lane?.carriers?.[0]?.carrierEmissionsReduction?.cost
                          ),
                          0
                        )}
                        %{" "}
                        <span className="tableArrow">
                          <ImageComponent
                            path={`/images/${getLowHighImage(
                              lane?.carriers?.[0]?.carrierEmissionsReduction
                                ?.cost,
                              0
                            )}`}
                            className="pe-0"
                          />
                        </span>
                      </Heading>
                    ) : (
                      <Heading
                        level="4"
                        className={`font-14 font-xxl-16 mb-0 fw-semibold distance ${getLowHighImage(
                          lane?.distance * costPremiumConst,
                          deltaMetrix?.distance,
                          true
                        )}`}
                      >
                        {formatNumber(true, projectedCost.cost, 0)}%{" "}
                        <span>
                          <ImageComponent
                            path={`/images/${getLowHighImage(
                              lane?.distance * costPremiumConst,
                              deltaMetrix?.distance
                            )}`}
                            className="pe-0"
                          />
                        </span>
                      </Heading>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <div className="d-flex gap-1 align-items-center">
                <ImageComponent
                  path="/images/projectEmission.svg"
                  className="pe-0"
                />
                <div>
                  <div className="d-flex gap-1 align-items-center">
                    <Heading
                      level="4"
                      className="font-14 font-xxl-16 mb-0 fw-normal"
                    >
                      Emissions Reduction*
                    </Heading>
                    {lane?.key === "carrier_shift" ? (
                      <Heading
                        level="4"
                        className="font-14 font-xxl-16 mb-0 fw-semibold distance"
                      >
                        {formatNumber(
                          true,
                          lane?.carriers?.[0]?.carrierEmissionsReduction
                            ?.emission_reduction || 0,
                          0
                        )}
                        %{" "}
                        <span className="tableArrow">
                          <ImageComponent
                            path="/images/greenArrowDowm.svg"
                            className="pe-0"
                          />
                        </span>
                      </Heading>
                    ) : (
                      <Heading
                        level="4"
                        className={`font-14 font-xxl-16 mb-0 fw-semibold distance ${getLowHighImage(
                          emissions?.newEmission,
                          emissions?.oldEmission,
                          true
                        )}`}
                      >
                        {lane?.key === "alternative_fuel"
                          ? formatNumber(true, emissions?.percentEmissions, 0)
                          : formatNumber(
                              true,
                              Math.abs(emissions?.percentEmissions || 0),
                              0
                            )}
                        %{" "}
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
                    )}
                  </div>
                </div>
              </div>
            </div>
            {lane?.key === "carrier_shift" && (
              <div className="">
                <div className="d-flex gap-1 align-items-center">
                  <ImageComponent
                    path="/images/projectEmission.svg"
                    className="pe-0"
                  />
                  <div>
                    <div className="d-flex gap-1 align-items-center">
                      <Heading
                        level="4"
                        className="font-14 font-xxl-16 mb-0 fw-normal "
                      >
                        {" "}
                        Emission Reduction/$ spent
                      </Heading>
                      <Heading
                        level="4"
                        className="font-14 font-xxl-16 mb-0 fw-semibold distance"
                      >
                        {formatNumber(
                          true,
                          lane?.carriers?.[0]?.carrierEmissionsReduction
                            ?.dollar_per_reduction,
                          2
                        )}
                      </Heading>
                    </div>
                    <Heading
                      level="4"
                      className="font-10 font-xxl-12 mb-0 fw-normal"
                    >
                      {" "}
                      tCO2e
                    </Heading>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaneDataCard;
