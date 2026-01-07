import { columnChart } from "utils/highchart/columnChart";
import ChartHighChart from "component/highChart/ChartHighChart";
import Heading from "component/heading";
import CarrierRankingTooltip from "component/carrierRankingTooltip";
import Logo from "component/logo";

interface CarrierGraphProps {
  isLoadingFilter: boolean;
  laneCarrierCompaireDto: any;
  graphHeading: string;
  getActiveClass: (index: number) => string;
  isDisable: () => boolean;
  dataytpe: string;
  headingC: string;
  subtitle: string;
}

const CarrierGraph = ({
  isLoadingFilter,
  laneCarrierCompaireDto,
  graphHeading,
  getActiveClass,
  isDisable,
  dataytpe,
  headingC,
  subtitle,
}: CarrierGraphProps) => {
  const showEmptyState = isDisable() && !isLoadingFilter;

  const renderCarrierLogos = () => (
    <div className="d-flex justify-content-center mt-0 border-0">
      <div className="d-flex justify-content-between gap-2">
        {laneCarrierCompaireDto?.data[0]?.dataset?.map((item: any, index: number) => (
          <div className="carrierLogoTooltip" key={item.carrier}>
            <CarrierRankingTooltip item={item} />
            <Logo path={item.carrier_logo} name={item.carrier} active={getActiveClass(index)} />
          </div>
        ))}
      </div>
    </div>
  );

  if (showEmptyState) {
    return (
      <div className="mainGrayCards p-2 p-xxl-3 h-100 position-relative">
        <div className="graph-loaderPie d-flex justify-content-center align-items-center" data-testid="carrier-graph-heading">
          <Heading level="5" content="No Data Found" />
        </div>
      </div>
    );
  }

  return (
    <div className="mainGrayCards p-2 p-xxl-3 h-100 position-relative">
      <ChartHighChart
        testId="chart-intensity"
        options={columnChart({
          chart: "optionCarrierComparison",
          options: laneCarrierCompaireDto?.data[0],
          dataytpe,
          content: graphHeading,
          heading: headingC,
          subtitle
        })}
        constructorType=""
        isLoading={isLoadingFilter}
        database={laneCarrierCompaireDto?.data?.[0]?.dataset?.length > 0}
      />
      {!showEmptyState && renderCarrierLogos()}
    </div>
  );
};

export default CarrierGraph;
