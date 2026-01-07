import Heading from "component/heading";
import TitleComponent from "component/tittle";
import BackBtn from "../../component/forms/backLink/index";
import benchmarkLaneTableViewController from "./benchmarkLaneTableViewController";
import { formatNumber, getCompanyName } from "../../utils";
import { useAuth } from "../../auth/ProtectedRoute";
import LaneTableHeader from "./LaneTableHeader";
import Pagination from 'component/pagination';
import TableBodyLoad from 'component/tableBodyHandle';

const BenchmarkLane = () => {
  const {
    pageSize,
    params,
    currentPage,
    industryStandardEmissionsList,
    industryStandardEmissionsLoading,
    setCurrentPage,
    handlePageChange,
  } = benchmarkLaneTableViewController();
  const dataCheck = useAuth();

  return (
    <section className="benchmarkTable pb-4 pt-2 px-2" data-testid="benchmark-lane-table">
      <TitleComponent title={"Benchmark lane table"} pageHeading={`${getCompanyName(
        dataCheck?.userdata,
        true
      )} Emissions Intensity by Lanes`} />

      <div className="benchmarkTable-heading">
        <div className="heading d-flex justify-content-start align-items-start">
          <BackBtn backBtnTestId="back-btn-benchmark-lane"
            link={`scope3/benchmarks/${params.type}/${params.band_no}/${params.yearId}/${params.quarterId}/${params.wtwType}`}
          />
        </div>
      </div>
      <div className="benchmarkTable-section pb-4">
        <div className="py-4 px-3 innerTitle d-xxl-flex align-items-center justify-content-between">
          <div className="d-md-flex gap-2 align-items-center">
            <h4 className="font-xxl-24 font-18 fw-medium mb-0">
              {getCompanyName(dataCheck?.userdata, true)} Emissions Intensity
            </h4>
            <h6 className="font-xxl-16 font-14 fw-semibold mb-0 mt-1">
              {getCompanyName(dataCheck?.userdata, true)} Standard:{" "}
              {formatNumber(
                true,
                industryStandardEmissionsList?.data?.emissionIntensityAverage
                  ?.industrial_average,
                1
              )}{" "}
              <span className="font-12 fw-normal">
                gCO2e / Ton-Mile of freight
              </span>
            </h6>
          </div>
          <div className="d-flex gap-3 align-items-center justify-content-end">
            <div className="d-flex gap-1 align-items-center">
              <p className="orange-div mb-0"></p>
              <Heading
                level="6"
                content="High Emissions intensity"
                className="font-14 mb-0 fw-normal"
              />
            </div>
            <div className="d-flex gap-1 align-items-center">
              <p className="primary-div mb-0"></p>
              <Heading
                level="6"
                content="Low Emissions intensity"
                className="font-14 mb-0 fw-normal"
              />
            </div>
          </div>
        </div>
        <div className="py-3 laneTable">
          <div className="static-table">
            <div className="tWrap">
              <div className="tWrap__head">
                <table>
                  <LaneTableHeader companyName={getCompanyName(dataCheck?.userdata, true)} />
                </table>
              </div>
              <div className="tWrap__body">
                <table data-testid="table-graph-data-lane-table">
                  <TableBodyLoad loaderTestId="spinner-loader" isLoading={industryStandardEmissionsLoading} isData={industryStandardEmissionsList?.data.emissionIntensityLanes?.length > 0} colSpan={5}>
                    <tbody>
                      {
                        industryStandardEmissionsList?.data.emissionIntensityLanes?.map(
                          (company_emission: any) => (
                            <tr key={company_emission.name}>
                              <td>{company_emission?.name.split("_").join(" to ")}</td>
                              <td>
                                <div className="d-flex align-items-center mb-0">
                                  <div
                                    className={`mb-0 ${company_emission?.company_intensity <
                                      industryStandardEmissionsList?.data?.emissionIntensityAverage
                                        ?.industrial_average
                                      ? " primary-div"
                                      : "orange-div"
                                      } me-2`}
                                  ></div>
                                  {formatNumber(
                                    true,
                                    company_emission?.company_intensity,
                                    1
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center mb-0">
                                  <div
                                    className={`mb-0 ${company_emission?.industrial_intensity <
                                      industryStandardEmissionsList?.data?.emissionIntensityAverage
                                        ?.industrial_average
                                      ? "primary-div"
                                      : "orange-div"
                                      } me-2`}
                                  ></div>
                                  {formatNumber(
                                    true,
                                    company_emission?.industrial_intensity,
                                    1
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        )
                      }
                    </tbody>
                  </TableBodyLoad>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-0 lane-pagination pe-3">
          <nav
            aria-label="Page navigation example"
            className=" d-flex justify-content-end select-box"
          >
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              total={industryStandardEmissionsList?.data?.pagination?.total_count}
              handlePageSizeChange={(e: any) => {
                handlePageChange(e);
              }}
              handlePageChange={(page: number) => {
                setCurrentPage(page);
              }}
            />
          </nav>
        </div>
      </div>
    </section>
  );
};

export default BenchmarkLane;
