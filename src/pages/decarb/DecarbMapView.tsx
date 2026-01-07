import React from "react";
import Highcharts from "highcharts";
import HC_map from "highcharts/modules/map";
import { Col } from "reactstrap";
import Heading from "component/heading";
import { Form } from "react-bootstrap";
import ChartHighChart from "../../component/highChart/ChartHighChart";
import DecarbController from "./decarbController";
import { useNavigate } from "react-router-dom";
import Spinner from "component/spinner";
import { priorityColors } from "utils";
import { Priority } from "interface/priority";
import { decarbLeversStateMap } from "utils/highchart/decarbLeversStateMap";
HC_map(Highcharts);

interface DecarbStateItem {
  state_abbr: string;
  type: string; // "LOW PRIORITY" | "MEDIUM PRIORITY" | "HIGHEST PRIORITY"
  color: string;
}

const priorityMap: Record<Priority, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

const getPriorityKey = (type: string): Priority => {
  if (type === "HIGHEST PRIORITY") return "high";
  if (type === "MEDIUM PRIORITY") return "medium";
  return "low"; // default fallback
};



const DecarbMapView: React.FC = () => {
  const {
    decarbLaneList,
    decarbLaneListLoading,
    handleChangeBoundType,
    boundType,
  } = DecarbController();
  const navigate = useNavigate();

  const formattedData =
    decarbLaneList?.data?.map((item: DecarbStateItem) => {
      const priorityKey = getPriorityKey(item.type);

      return {
        "hc-key": `us-${item.state_abbr?.toLowerCase()}`,
        value: priorityMap[priorityKey],
        priority: item.type?.toLowerCase(),
        color: item?.color || priorityColors[priorityKey],
      };
    }) || [];

  return (
    <Col lg="12">
      <div className="mainGrayCards chart-map company-level p-3 position-relative">
        <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-4">
          <Heading
            level="4"
            className="mb-0 fw-semibold font-20"
            content="Statewise Priority Distribution"
          />

          <div className="d-flex align-items-center">
            <Heading
              level="6"
              content="Inbound"
              className="mb-0 pe-1 fw-semibold text-capitalize font-xxl-14 font-12"
            />
            <Form.Check
              type="switch"
              id="custom-switch"
              data-testid="toggle-benchmark-region"
              className="fw-semibold ps-0 fs-14 mb-0"
              onChange={handleChangeBoundType}
              disabled={decarbLaneListLoading}
            />
            <Heading
              level="6"
              content="Outbound"
              className="mb-0 ps-1 fw-semibold text-capitalize font-xxl-14 font-12"
            />
          </div>
        </div>
        {decarbLaneListLoading ? (
          <Spinner
            data-testid="decarb-loading-div"
            spinnerClass="py-5 my-4 justify-content-center"
          />
        ) : (
          <div className="highchartMap">
            <ChartHighChart
              options={decarbLeversStateMap({ formattedData, navigate, boundType })}
              constructorType="mapChart"
              database={formattedData}
            />
            <div className="legends">
              <ul>
                <li>
                  <span className="low-priority"></span>Low Priority
                </li>
                <li>
                  <span className="medium-priority"></span>Medium Priority
                </li>
                <li>
                  <span className="high-priority"></span>High Priority{" "}
                </li>
                <li>
                  <span className=" "></span>NA{" "}
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </Col>
  );
};

export default DecarbMapView;
