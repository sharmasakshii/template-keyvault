import ImageComponent from 'component/images'
import Heading from 'component/heading';
import ButtonComponent from 'component/forms/button';
import ExpensiveLanesTable from "./ExpensiveLanesTable"
import SustainViewCard from 'component/cards/sustainabilityTracker';
import { Col, Row } from 'reactstrap';
import ChartHighChart from "../../component/highChart/ChartHighChart";
import { barCompareChart } from "utils/highchart/barCompareChart"
import { formatNumber } from "utils";
import { ProgressBar } from 'react-bootstrap';
import TableBodyLoad from 'component/tableBodyHandle';
import Pagination from 'component/pagination';
import BidMatricsController from './bidMatricsController';
import CountdownTimer from './ProcessingCountDown';
import moment from 'moment';
import Loader from 'component/loader/Loader';


const BidMarker = () => {
  return (
    <div className="d-flex justify-content-center gap-4 mt-3 align-items-center">
      <div className='d-flex gap-2 align-items-center'>
        <div className='lightgreen-div'>
        </div>
        <Heading level="5" content="Highest Bid" className="font-14 fw-normal mb-0" />
      </div>
      <div className='d-flex gap-2 align-items-center'>
        <div className='primary-div'>
        </div>
        <Heading level="5" content="Average Bid" className="font-14 fw-normal mb-0" />
      </div>
      <div className='d-flex gap-2 align-items-center'>
        <div className='green-div'>
        </div>
        <Heading level="5" content="Lowest Bid" className="font-14 fw-normal mb-0" />
      </div>
    </div>
  )
}
const BidMatricsView = () => {

  const {
    processFilePercent,
    handleProcessFile,
    file_name,
    handleBidFileList,
    pageSize,
    setPageSize,
    pageNumber,
    setPageNumber,
    isLoadinFileInputError,
    isLoadingProcessFile,
    fileInputErrorData,
    bidFileLanesTableGraph,
    isLoadingProcessFileStatusData,
    processFileStatusData,
    keyMetricsDetail,
    isLoadingSingleFile,
    singleFileDetails,
    isLoadinBidFileLanesTableGraph,
    handleClickDownloadErrorReport,
    isLoadingErrorInputBidExport,
    downloadFile,
    fileDownloadLoading
  } = BidMatricsController()

  return (
    <div className="bidsPlanning-outerScreen p-3 mt-0" data-testid="bid-matrics">
      <Loader isLoading={[isLoadingSingleFile, isLoadingErrorInputBidExport, fileDownloadLoading]} />
      <div className='d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3 position-relative'>
        <div className='d-flex gap-2 align-items-center'>
          <ImageComponent
            path="/images/Excel.svg"
            alt="files"
            className='pe-0'
          />
          <Heading level="3" className="font-18 font-xxl-20 fw-semibold mb-0 file-name">
            {file_name}
            <div className="tootltip-div">
              {file_name}
            </div>
          </Heading>
        </div>
        <div className='d-flex flex-wrap gap-2 align-items-center progressBtn'>
          {singleFileDetails?.data?.file_detail?.status_id === 2 && 
          <ButtonComponent
            imagePath="/images/processFile.svg"
            text="Process File"
            isLoading={isLoadingProcessFileStatusData || isLoadingProcessFile}
            btnClass="btn-deepgreen font-14 font-xxl-16 py-2  upload"
            onClick={handleProcessFile}
          />}
          {singleFileDetails?.data?.file_detail?.status_id === 6 &&
            <div>
              <CountdownTimer endTime={moment(singleFileDetails?.data?.file_detail?.processing?.expected_time)} file={singleFileDetails?.data?.file_detail} isDataMatrix={true} />
            </div>
          }
          {singleFileDetails?.data?.file_detail?.status_id === 7 && 
          <div>
            <Heading
              level="4"
              content={`Ingesting ${processFileStatusData?.data?.total || 0} lanes`}
              className="font-12 font-xxl-14  fw-normal mb-1"
            />
            <div className="processFile-bar d-flex align-items-center gap-2">
              <ProgressBar now={processFilePercent} />
              <Heading
                level="4"
                content={formatNumber(
                  true, processFilePercent, 0) + "%"}
                className="font-14 fw-medium mb-0"
              /></div>
          </div>
          }

          <ButtonComponent
            imagePath="/images/download.svg"
            text="Uploaded File"
            btnClass="btn-deepgreen font-14 font-xxl-16 py-2  upload"
            onClick={downloadFile}
          />

          < ButtonComponent
            imagePath="/images/eyeicon.svg"
            text="View All Files"
            btnClass="btn-lightGreen font-14 font-xxl-16 py-2  viewFile"
            onClick={handleBidFileList}
          />
        </div>
      </div>
      <div className="reagionCards mb-3">

        <Heading level="5" content="Key Metrics" className="font-18 font-xxl-20 fw-semibold mb-3" />
        <Row className='g-3'>
          <Col md="4">
            <SustainViewCard
              isLoading={false}
              cardValue={formatNumber(
                true,
                keyMetricsDetail?.data?.bid_detail?.total_count,
                0
              )}
              cardDate="Total Records"
              imagePath="/images/records.svg"
              className='firstCard'
            />
          </Col>
          <Col md="4">
            <SustainViewCard
              isLoading={false}
              cardValue={formatNumber(
                true,
                keyMetricsDetail?.data?.bid_detail?.lane_count,
                0
              )}
              cardDate="Number of  Lanes"
              imagePath="/images/total-lanes.svg"
              className='firstCard carrier'
            />
          </Col>
          <Col md="4">
            <SustainViewCard
              isLoading={false}
              cardValue={formatNumber(
                true,
                keyMetricsDetail?.data?.bid_detail?.carrier_count,
                0
              )}
              cardDate="Number of Carriers"
              imagePath="/images/carriers.svg"
              className='firstCard carrier'
            />
          </Col>
        </Row>
      </div>
      <div>
        <Row className='g-3'>
          <ExpensiveLanesTable
            title="Most Expensive Lanes (Rate per mile)"
            laneData={bidFileLanesTableGraph?.data?.maxTableData}
            isloading={isLoadinBidFileLanesTableGraph}
          />
          <Col lg="6">
            <div className='mainGrayCards h-100'>
              <div className='headingLine p-3 border-bottom'>
                <Heading level="5" content="Most Expensive Lanes (Rate per mile)" className="font-18 font-xxl-20 fw-semibold mb-0" />
              </div>
              <div className='p-3'>
                <ChartHighChart
                  loadingTestId="high-chart-emission-intensity-loader"
                  testId="high-chart-emission-intensity"
                  options={barCompareChart({
                    options: bidFileLanesTableGraph?.data?.maxTableData,
                    yTitle: 'Rate per mile ($)',
                    chart: 2,
                    reloadData: true,
                  })}
                  constructorType=""
                  isLoading={isLoadinBidFileLanesTableGraph}
                  database={bidFileLanesTableGraph?.data?.maxTableData}
                />
                <BidMarker />

              </div>
            </div>
          </Col>
          <ExpensiveLanesTable
            title="Least Expensive Lanes (Rate per mile)"
            laneData={bidFileLanesTableGraph?.data?.minTableData}
            isloading={isLoadinBidFileLanesTableGraph}
          />
          <Col lg="6">
            <div className='mainGrayCards h-100'>
              <div className='headingLine p-3 border-bottom'>
                <Heading level="5" content="Least Expensive Lanes (Rate per mile)" className="font-18 font-xxl-20 fw-semibold mb-0" />
              </div>
              <div className='p-3'>
                <ChartHighChart
                  loadingTestId="high-chart-emission-intensity-loader"
                  testId="high-chart-emission-intensity"
                  options={barCompareChart({
                    options: bidFileLanesTableGraph?.data?.minTableData,
                    yTitle: 'Rate per mile ($)',
                    chart: 2,
                    reloadData: true,
                  })}
                  constructorType=""
                  isLoading={isLoadinBidFileLanesTableGraph}
                  database={bidFileLanesTableGraph?.data?.minTableData}
                />
                <BidMarker />
              </div>
            </div>
          </Col>
        </Row>
        <div className='my-3'>
          <div className='mainGrayCards lanesTableBid h-100'>
            <div className='headingLine p-3 d-flex justify-content-between align-items-center'>
              <Heading level="5" content="Erroneous Records" className="font-18 font-xxl-20 fw-semibold mb-0" />
              {fileInputErrorData?.data?.data?.length > 0 && <ButtonComponent
                imagePath="/images/download.svg"
                text="Download"
                btnClass="btn-deepgreen font-14 py-2 px-3  downloadReport"
                onClick={handleClickDownloadErrorReport}
              />}
            </div>
            <div className="static-table erroneousTable pb-3">
              <table>
                <thead>
                  <tr>
                    <th>
                      Row Number
                    </th>
                    <th>
                      Tab Name
                    </th>

                    <th>
                      Lane
                    </th>
                    <th>
                      SCAC
                    </th>
                    <th className='w-auto'>
                      Reason
                    </th>
                  </tr>
                </thead>
                <TableBodyLoad isLoading={isLoadinFileInputError} noDataMsg="No Erroneous Records Found" isData={fileInputErrorData?.data?.data?.length>0} colSpan={5}>
                  <tbody>
                    {fileInputErrorData?.data?.data?.map((item: any) =>
                      <tr key={item?.id}>

                        <td>
                          {item?.row_number}
                        </td>
                        <td>
                          {item?.tab_name}
                        </td>
                        <td className='position-relative'>
                          <Heading
                            level="5"
                            className="font-14 font-xxl-16 fw-normal mb-0 ">
                            {item?.lane_name.split("_").join(" to ")}
                          </Heading>
                        </td>
                        <td className='w-auto'>
                          {item?.scac}
                        </td>
                        <td className='w-auto reasonTxt'>
                          {item?.error_message}
                        </td>
                      </tr>)
                    }
                  </tbody>
                </TableBodyLoad>
              </table>
              <Pagination currentPage={pageNumber}
                pageSize={pageSize}
                total={fileInputErrorData?.data?.pagination?.total_count}
                handlePageSizeChange={(e: any) => {
                  setPageSize(e);
                  setPageNumber(1)
                }}
                handlePageChange={(page: number) => {
                  setPageNumber(page)
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BidMatricsView