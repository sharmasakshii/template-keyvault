import Heading from "component/heading";
import ImageComponent from "../../component/images";
import { formatNumber } from "utils";
import { Row, Col } from "reactstrap";
import Logo from "component/logo";

const ProjectDetailCard = ({ projectDetail, configConstants }: any) => {

  return (
    <div>
      <div className="mt-3">
        <Row className="g-2 justify-content-between">
          <Col xl="5" className="align-self-center mt-0">
            <div className="emission ">
              <div className="d-flex align-items-center manager ">
                <Row className="w-100">
                  <Col xxl="6">
                    <div>
                      <Heading
                        level="6"
                        content={projectDetail?.managerData?.name}
                        className="mb-1 font-16 font-xxl-20 fw-semibold text-capitalize"
                      />
                      <Heading
                        level="6"
                        content={projectDetail?.managerData?.profile?.title}
                        className="mb-0 font-14 font-xxl-16 text-capitalize"
                      />
                      <div className="mail mt-2 ">
                        <span className="pe-1">
                          <ImageComponent
                            path="/images/mail.svg"
                            className="p-0"
                          />
                        </span>
                        {projectDetail?.managerData?.email}
                      </div>
                    </div>
                  </Col>
                  <Col xxl="6">
                    <div>
                      <div className="font-14 fw-medium">Invited People</div>
                      <div className="people mt-2">
                        {projectDetail?.allUsersDaetails?.map((user: any) => <div key={user?.email} className="peopleImage">
                          <Logo path={user?.profile?.image} name={user?.profile?.first_name} />
                        </div>)}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
          <Col xl="6" className="align-self-center mt-0">
            <div className="lane-data-wrapper d-lg-flex justify-content-between  gap-4 mt-3 mt-xl-0">
              <div className="emission ">
                <Heading
                  level="4"
                  content={`Emissions Intensity`}
                  className="mb-0 font-xxl-20 font-16"
                />
                <Heading
                  level="6"
                  content={`gCO2e/Ton-${configConstants?.data?.default_distance_unit === "miles" ? "Mile" : "Kms"} of freight`}
                  className="fw-light font-12 "
                />
                <div className="d-flex align-items-center">
                  <div className="orange-div"></div>
                  <Heading
                    level="3"
                    content={formatNumber(true, projectDetail?.laneEmissionData?.intensity, 1)}
                    className="font-xxl-20 font-16  mb-0 ps-2"
                  />
                </div>
              </div>
              <div className="emission">
                <Heading
                  level="4"
                  content={`Total Emissions`}
                  className="mb-0 font-xxl-20 font-16"
                />
                <Heading
                  level="6"
                  content={`tCO2e`}
                  className="fw-light font-12"
                />
                <div className="d-flex align-items-center">
                  <div className="primary-div"></div>
                  <Heading
                    level="3"
                    content={formatNumber(true, projectDetail?.laneEmissionData?.emissions, 2)}
                    className="font-xxl-20  font-16 mb-0 ps-2"
                  />
                </div>
              </div>
              <div className="emission">
                <Heading
                  level="4"
                  content={`Total Shipments`}
                  className="mb-0 font-xxl-20 font-16"
                />
                <Heading
                  level="6"
                  content={`tCO2e`}
                  className="fw-light font-12 invisible"
                />
                <div className="d-flex align-items-center">
                  <Heading
                    level="3"
                    content={formatNumber(true, projectDetail?.laneEmissionData?.shipment_count, 0)}
                    className="font-xxl-20 font-16 mb-0 ps-2"
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProjectDetailCard;
