import Heading from "../../heading";
import { Form, Button } from "react-bootstrap";
import ImageComponent from "../../images";
import ChartHighChart from "../../highChart/ChartHighChart";
import moment from "moment";
import { Input } from "reactstrap";
import { isCompanyEnable } from "utils";
import { companySlug } from "constant";
import { useAppSelector } from "store/redux.hooks";

const RGPGraph = ({
  yearlyData1,
  setYearlyData1,
  emissionDates,
  setReloadData,
  checked,
  setChecked,
  graphHeading,
  graphSubHeading,
  quartelyDataText = true,
  headingUnit,
  isLoading,
  dataArr,
  testId,
  options,
  isLoadingtestId,
  emissionIntensityToggleId,
  totalEmissionToggleId,
  toggleBtn = true,
}: any) => {
  const { loginDetails } = useAppSelector((state: any) => state.auth);
  return (
    <div data-testid={testId} className="mainGrayCards rgpGraph p-3 h-100 slider-icons position-relative">
      <div className="">
        <div className="emi-inten">
          {!isLoading && graphSubHeading && (
            <h6 className="m-0 mb-1 fw-semibold">{graphSubHeading}</h6>
          )}

          <div className="d-flex align-items-center justify-content-between">
            {graphHeading && (
              <h4 className="fw-semibold font-xxl-20 font-16 mb-2">
                {graphHeading}
                <span className="fw-normal">{headingUnit}</span>
              </h4>
            )}
            <Button
              color="primary"
              className="px-3 py-2 btn-deepgreen font-12"
            >
              On Track
            </Button>
          </div>
          {toggleBtn && (
            <div className="emi-inten pb-4">
              <div className="d-flex align-items-center">
                <div className="d-flex align-items-center">
                  <Form>
                    <Input
                    data-testid={emissionIntensityToggleId}
                      type="radio"
                      id="custom-switch"
                      name="switch"
                      className="ps-0 fw-semibold mb-0"
                      checked={!checked}
                      disabled={isLoading}
                      onChange={() => setChecked(!checked)}
                    />
                  </Form>
                  <Heading
                    level="6"
                    content="Emissions intensity"
                    className="mb-0 ps-2 fw-semibold text-capitalize font-xxl-14 font-12"
                  />
                </div>
                <div className="ms-4 d-flex align-items-center">
                  <Form>
                    <Input
                      type="radio"
                      data-testid={totalEmissionToggleId}
                      id="custom-switch"
                      name="switch"
                      className="ps-0 fw-semibold mb-0"
                      checked={checked}
                      disabled={isLoading}
                      onChange={() => setChecked(!checked)}
                    />
                  </Form>
                  <Heading
                    level="6"
                    content="Total Emissions"
                    className="mb-0 ps-2 fw-semibold text-capitalize font-xxl-14 font-12"
                  />
                </div>
              </div>
            </div>
          )}
          <div className="chartDiv position-relative">
            {!isLoading && dataArr?.data && (
              <>
                <div className="left-arrow-slider">
                  {yearlyData1 >
                    Number.parseInt(
                      moment(
                        emissionDates?.data?.emission_dates?.start_date
                      ).format("YYYY")
                    ) && (
                    <button
                      onClick={() => {
                        setReloadData(false);
                        setYearlyData1(
                          (prev: any) => Number.parseInt(prev) - 1
                        );
                      }}
                    >
                      <svg
                        width="11"
                        height="20"
                        viewBox="0 0 11 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M-1.07292e-06 9.99996C-1.07015e-06 10.2325 0.0888614 10.4652 0.266361 10.6427L9.35726 19.7336C9.71248 20.0888 10.2877 20.0888 10.6427 19.7336C10.9977 19.3784 10.9979 18.8031 10.6427 18.4481L2.19454 9.99996L10.6427 1.55179C10.9979 1.19656 10.9979 0.621334 10.6427 0.266335C10.2875 -0.088665 9.71226 -0.088892 9.35726 0.266335L0.266361 9.35723C0.0888613 9.53473 -1.0757e-06 9.76746 -1.07292e-06 9.99996Z"
                          fill="#5f9a80"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="right-arrow-slider">
                  {yearlyData1 < moment().format("YYYY") && (
                    <button 
                    data-testid="yearly-data-click"
                      disabled={isCompanyEnable(loginDetails?.data, [companySlug?.pep]) ? yearlyData1 >= moment().format('YYYY') : yearlyData1 >= (parseInt(moment().format('YYYY')) - 1)}
                      onClick={() => {
                        setReloadData(false);
                        setYearlyData1(
                          (prev: any) => Number.parseInt(prev) + 1
                        );
                      }}
                    >
                      <svg
                        width="11"
                        height="20"
                        viewBox="0 0 11 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.9091 9.99996C10.9091 10.2325 10.8203 10.4652 10.6428 10.6427L1.55187 19.7336C1.19665 20.0888 0.62142 20.0888 0.26642 19.7336C-0.0885794 19.3784 -0.0888067 18.8031 0.26642 18.4481L8.71459 9.99996L0.26642 1.55179C-0.0888064 1.19656 -0.0888064 0.621334 0.26642 0.266335C0.621647 -0.088665 1.19687 -0.088892 1.55187 0.266335L10.6428 9.35723C10.8203 9.53473 10.9091 9.76746 10.9091 9.99996Z"
                          fill="#5f9a80"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </>
            )}
            <ChartHighChart
              options={options}
              constructorType=""
              loadingTestId={isLoadingtestId}
              isLoading={isLoading}
              database={dataArr?.data?.region_level?.[0] || dataArr?.data?.targer_level?.[0]}
            />
          </div>
        </div>
      </div>
      {!isLoading && quartelyDataText && (dataArr?.data?.region_level?.[0] || dataArr?.data?.targer_level?.[0]) && (
        <div className="d-lg-flex quartely-wrapper  p-3">
          <div className="quartely pe-3">
            <Heading
              level="4"
              content={`${isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.bmb]) ? "Periodically" : "Quarterly"
                } emissions reduction goal`}
              className="mb-1 font-14"
            />
            <div>
              <h3 className="d-flex align-items-center">
                <span>
                  <ImageComponent path="/images/g-arrow.svg" />
                </span>
                {' '}
                4%
              </h3>
            </div>
          </div>
          <div className="quartely pe-3">
            <Heading
              level="4"
              content={`Achieved reduction for this ${isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.bmb]) ? 'period' : 'quarter'
                }`}
              className="mb-1 font-14"
            />
            <div>
              <h3 className="d-flex align-items-center">
                <span>
                  <ImageComponent path="/images/g-arrow.svg" />
                </span>
                {' '}
                2%
              </h3>
            </div>
          </div>
          <div className="quartely">
            <Heading
              level="4"
              content={`Time left to reach this ${isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.bmb]) ? "period's" : "quarter's"
                } target`}
              className="mb-1 font-14"
            />

            <div>
              <h3 className="d-flex align-items-end">
                4<span>Weeks</span>
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RGPGraph;
