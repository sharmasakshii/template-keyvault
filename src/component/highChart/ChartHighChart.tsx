import React from "react";
import Highcharts from "highcharts";
import highchartsMore from "highcharts/highcharts-more";
import ChartView from "./ChartView";
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import HCAccessibility from "highcharts/modules/accessibility";
import { isOldSafari } from 'utils';

highchartsMore(Highcharts);
Exporting(Highcharts);
OfflineExporting(Highcharts);
if (isOldSafari(14)) {
  Highcharts.setOptions({
    accessibility: {
      enabled: false,
    },
  });
} else {
  HCAccessibility(Highcharts);
}
interface ChartProps {
  options: any;
  constructorType: any;
  isLoading?: boolean;
  reloadData?: boolean;
  database?: any;
  noDataMessage?: string;
  testId?: string;
  loadingTestId?: string;
  noDataFoundTestId?: string;
  classname?: string;
  chartComponentRef?: any
}
const ChartHighChart: React.FC<ChartProps> = ({ testId, noDataFoundTestId, loadingTestId, options, constructorType, reloadData, isLoading, database, noDataMessage = "No Data Found", classname = "highchart-bar", chartComponentRef = null }) => {

  if (isLoading) {
    return <div className="graph-loaderPie d-flex justify-content-center align-items-center" data-testid={loadingTestId}>
      <div className="spinner-border spinner-ui">
        <span className="visually-hidden"></span>
      </div>
    </div>
  }

  if (!database) {
    return <div className="text-center text-between my-5 py-4" data-testid={noDataFoundTestId}>
      <p className="text-dark font-14">{noDataMessage}</p>
    </div>
  }

  return <div data-testid={testId} className={classname}>

    <ChartView options={options} constructorType={constructorType} reloadData={reloadData} chartComponentRef={chartComponentRef} />
  </div>

}

export default ChartHighChart;