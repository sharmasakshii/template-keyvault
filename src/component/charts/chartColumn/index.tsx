import Heading from "../../heading";
import { FormGroup, Input } from "reactstrap";
import ChartHighChart from "../../highChart/ChartHighChart";
const ChartColumn = ({
  name,
  checked,
  setChecked,
  graphHeading,
  graphSubHeading,
  heading,
  headingUnit,
  isLoading,
  dataArr,
  options,
  noDataMessage,
  testId,
  chartTestId,
  regionEmissionId,
  totalEmissionId
}: any) => {
  return (
    <div className="mainGrayCards p-3 h-100" data-testid={chartTestId}>
      <div className="regionWiseTxt">
        <div className="emi-inten">
          {graphSubHeading && (
            <h6 className="fw-semibold font-xxl-20 font-16 mb-2 leftTitle">{graphSubHeading}</h6>
          )}

          {graphHeading && (
            <h3 className="fw-semibold font-xxl-20 font-16 mb-2">
              {graphHeading}
            </h3>
          )}
        </div>
        <div className="emi-inten d-flex flex-wrap justify-content-between pb-4">
          <div className="d-flex">
            <FormGroup className=" d-flex gap-2">
              <div className="d-flex align-items-center gap-1" data-testid={testId}>
                <Input
                  name={`${name} Emissions intensity`}
                  type="radio"
                  data-testid={regionEmissionId}
                  checked={!checked}
                  disabled={isLoading}
                  onChange={() => setChecked(!checked)}
                  className="mt-0"
                />

                <Heading
                  level="6"
                  content="Emissions intensity"
                  className="mb-0 pe-1 fw-semibold text-capitalize font-xxl-14 font-12"
                />
              </div>

              <div className="d-flex align-items-center gap-1">
                <Input
                  name={`${name} Total Emissions`}
                  data-testid={totalEmissionId}
                  type="radio"
                  checked={checked}
                  disabled={isLoading}
                  onChange={() => setChecked(!checked)}
                  className="mt-0"
                />
                <Heading
                  level="6"
                  content="Total Emissions"
                  className="mb-0 pe-1 fw-semibold text-capitalize font-xxl-14 font-12"
                />
              </div>

            </FormGroup>


          </div>
          <div className="ps-1">
            <div className="d-flex align-items-center mb-1 detractor">
              <div className="orange-div"></div>
              <Heading
                level="6"
                content="Detractor"
                className="ps-1 mb-0 font-xxl-14 font-12"
              />
            </div>
            <div className="d-flex align-items-center detractor">
              <div className="primary-div"></div>
              <Heading
                level="6"
                content="Contributor"
                className="ps-1 mb-0 font-xxl-14 font-12"
              />
            </div>
          </div>
        </div>
        <div className="avg-region text-center x-axis-hide">
          <div className="avg-img region-avg-img">
            {!isLoading && dataArr?.length > 0 && (<Heading level="6" content={heading} spanText={headingUnit} />)}
            <ChartHighChart options={options} constructorType="" isLoading={isLoading} database={dataArr?.length > 0} noDataMessage={noDataMessage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartColumn;
