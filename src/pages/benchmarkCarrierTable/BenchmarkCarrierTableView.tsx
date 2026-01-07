import Heading from "component/heading";
import TitleComponent from "component/tittle";
import BackBtn from "../../component/forms/backLink/index";
import { Col, Row } from "reactstrap";
import ButtonComponent from "component/forms/button";
import { BenchmarkCarrierTableController } from "./benchmarkCarrierTableController";
import { formatNumber, getCompanyName } from "utils";
import Logo from "component/logo";
import { useAuth } from "auth/ProtectedRoute";
import TableHeader from "./CarrierTableHeader";
import CarrierRankingTooltip from "../../component/carrierRankingTooltip"
import Pagination from 'component/pagination';
import TableBodyLoad from 'component/tableBodyHandle';

const BenchmarkCarrierTableView = () => {
  const {
    benchmarkCompanyCarrierEmissionsList,
    pageSize,
    currentPage,
    handlePageChange,
    setCurrentPage,
    backLink,
    benchmarkLCompanyarrierEmissionsLoading,
  } = BenchmarkCarrierTableController();
  const dataCheck = useAuth();

  return (
    <section className="benchmarkTable pb-4 pt-2 px-2" data-testid="benchmark-carrier-table">
      <TitleComponent title={"Benchmark lane table"} pageHeading={`Carrier Emissions Intensity`} />
      <div className="benchmarkTable-heading">
        <div className="heading d-flex justify-content-start align-items-start">
          <BackBtn backBtnTestId="back-btn-benchmark-carrier" link={backLink} />
        </div>
      </div>
      <div className="benchmarkTable-section ">
        <div className="py-4 px-3 innerTitle d-xxl-flex align-items-center justify-content-between">
          <div className="d-md-flex gap-2 align-items-center">
            <h4 className="font-xxl-24 font-20 fw-medium mb-0">
              Carrier Emissions Intensity
            </h4>
            <h6 className="font-xxl-16 font-14 fw-semibold mb-0 mt-1">
              {getCompanyName(dataCheck?.userdata, true)} Standard:{" "}
              {formatNumber(
                true,
                benchmarkCompanyCarrierEmissionsList?.data?.intensity
                  ?.company_intensity,
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
        <div className="py-3 px-3">
          <Row>
            <Col lg="6" className="mt-2">
              <div className="mainGrayCards pb-3 h-100">
                <div className="innerTitle py-3 px-2 ">
                  <h4 className="font-xxl-20 font-18 fw-semibold mb-0">
                    {getCompanyName(dataCheck?.userdata, true)} Carriers
                  </h4>
                </div>
                <div className="py-4 px-2 d-xl-flex justify-content-between align-items-center">
                  <h6 className="font-xxl-16 font-14 fw-semibold mb-2 mt-1">
                    {getCompanyName(dataCheck?.userdata, true)} Standard: {formatNumber(
                      true,
                      benchmarkCompanyCarrierEmissionsList?.data?.intensity
                        ?.company_intensity,
                      1
                    )}{" "}
                    <span className="font-12 fw-normal">
                      gCO2e / Ton-Mile of freight
                    </span>
                  </h6>
                  <div className="text-end">
                    <ButtonComponent
                      text="Recommend Carrier"
                      btnClass="outlineBtn-deepgreen opacity-25 mb-2 border-0 fw-medium text-decoration-underline font-12 font-xxl-14 py-1"
                    />
                  </div>
                </div>
                <div className="static-table">
                  <div className="tWrap">
                    <div className="tWrap__head">
                      <table>
                        <TableHeader />
                      </table>
                    </div>
                    <div className="tWrap__body">

                      <table data-testid="table-graph-data-carrier-table">
                        <TableBodyLoad loaderTestId="spinner-loader" isLoading={benchmarkLCompanyarrierEmissionsLoading} isData={benchmarkCompanyCarrierEmissionsList?.data?.company_carrier?.length > 0} colSpan={5}>
                          {benchmarkCompanyCarrierEmissionsList?.data?.company_carrier?.map(
                            (companyCarrier: any, index: any) => {
                              return (
                                <tr key={companyCarrier.name} >
                                  <td>
                                    <div className="d-flex align-items-center text-capitalize gap-1" >
                                      <div className="logo-icon-name-wrapper">
                                        <div className="carrierLogoTooltip">
                                          <CarrierRankingTooltip item={companyCarrier} />
                                          <Logo
                                            path={
                                              companyCarrier.carrier_logo
                                            }
                                            name={companyCarrier?.name}
                                          />
                                        </div>
                                      </div>
                                      {companyCarrier?.name}({companyCarrier?.carrier})
                                    </div>
                                  </td>
                                  <td >
                                    <div className="d-flex align-items-center mb-0" data-testid={`table-row-click ${index}`}>
                                      <div
                                        className={`mb-0 ${companyCarrier?.emission_intensity <
                                          benchmarkCompanyCarrierEmissionsList
                                            ?.data?.intensity
                                            ?.company_intensity
                                          ? "primary-div"
                                          : "orange-div"
                                          } me-2`}
                                      ></div>


                                      {formatNumber(
                                        true,
                                        companyCarrier?.emission_intensity,
                                        1
                                      )}

                                    </div>
                                  </td>
                                  <td>{companyCarrier?.total_shipment}</td>

                                  <td>
                                    <div className="d-flex align-items-center mb-0">
                                      {formatNumber(
                                        true,
                                        companyCarrier?.total_emission,
                                        1
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </TableBodyLoad>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg="6" className="mt-2">
              <div className="mainGrayCards pb-3 h-100">
                <div className="innerTitle py-3 px-2 ">
                  <h4 className="font-xxl-20 font-18 fw-semibold mb-0">
                    Industry Carriers
                  </h4>
                </div>
                <div className="py-4 px-2 d-xl-flex justify-content-between align-items-center">
                  <h6 className="font-xxl-16 font-14 fw-semibold mb-2 mt-1">
                    Industry Standard:{" "}
                    {formatNumber(
                      true,
                      benchmarkCompanyCarrierEmissionsList?.data?.intensity
                        ?.industry_intensity,
                      1
                    )}{" "}
                    <span className="font-12 fw-normal">
                      gCO2e / Ton-Mile of freight
                    </span>
                  </h6>
                  <div className="text-end invisible">
                    <ButtonComponent
                      text="Carrier"
                      btnClass="outlineBtn-deepgreen mb-2 border-0 fw-medium text-decoration-underline font-12 py-1"
                    />
                  </div>
                </div>
                <div className="static-table">
                  <div className="tWrap">
                    <div className="tWrap__head">
                      <table>
                        <TableHeader />
                      </table>
                    </div>
                    <div className="tWrap__body">

                      <table data-testid="table-graph-data-carrier-table2">
                        <TableBodyLoad isLoading={benchmarkLCompanyarrierEmissionsLoading} isData={benchmarkCompanyCarrierEmissionsList?.data?.industry_carrier?.length > 0} colSpan={5}>
                          {benchmarkCompanyCarrierEmissionsList?.data?.industry_carrier?.map(
                            (industryCarrier: any) => {
                              return (
                                <tr key={industryCarrier?.name}>
                                  <td>
                                    <div className="d-flex align-items-center text-capitalize gap-1">
                                      <div className="logo-icon-name-wrapper">
                                        <div className="carrierLogoTooltip">
                                          <CarrierRankingTooltip item={industryCarrier} />
                                          <Logo
                                            path={
                                              industryCarrier.carrier_logo
                                            }
                                            name={industryCarrier?.name}
                                          />
                                        </div>

                                      </div>
                                      {industryCarrier?.name}({industryCarrier?.carrier})
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center mb-0">
                                      <div
                                        className={`mb-0 ${industryCarrier?.emission_intensity <
                                          benchmarkCompanyCarrierEmissionsList
                                            ?.data?.intensity
                                            ?.industry_intensity
                                          ? "primary-div "
                                          : "orange-div"
                                          } me-2`}
                                      ></div>
                                      {formatNumber(
                                        true,
                                        industryCarrier?.emission_intensity,
                                        1
                                      )}
                                    </div>
                                  </td>

                                  <td>
                                    {industryCarrier?.total_shipment}
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center mb-0">
                                      {formatNumber(
                                        true,
                                        industryCarrier?.total_emission,
                                        1
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            }
                          )
                          }
                        </TableBodyLoad>
                      </table>

                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <div className="mt-3 lane-pagination">
            <nav
              aria-label="Page navigation example"
              className=" d-flex justify-content-end select-box"
            >
              <Pagination
                currentPage={currentPage}
                pageSize={pageSize}
                total={benchmarkCompanyCarrierEmissionsList?.data?.pagination?.total_count}
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
      </div>
    </section>
  );
};

export default BenchmarkCarrierTableView;
