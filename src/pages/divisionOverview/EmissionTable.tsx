import React from 'react';
import { Col } from 'reactstrap';
import Heading from 'component/heading';
import ImageComponent from 'component/images';
import PerformanceHeading from 'component/PerfomanceHeading';
import TableBodyLoad from 'component/tableBodyHandle';
import { formatNumber, sortIcon } from 'utils';
import { useTranslation } from 'react-i18next';
const EmissionsTable = ({
  graphTitle,
  data,
  handleChangeOrder,
  colName,
  order,
  title,
  type,
  firstColName,
  intensityTitle,
  shipmentTitle,
  emissionTitle,
  isLoading,
  colSpan,
  rowIdentifier,
  rowFields,
  configConstants
  
}: any) => {
  const { t } = useTranslation()
  const defaultUnit = configConstants?.data?.default_distance_unit;
  return (
    <Col lg="6">
      <div className="mainGrayCards h-100">
        <div className="regionWiseTxt">
          <div className="p-3">
            <Heading
              level="6"
              className="mb-3 laneBreakdownHeading font-14 font-xxl-20 fw-semibold"
            >
              {`${title} for ${graphTitle}`}
            </Heading>
            <PerformanceHeading />
          </div>
          <div className="static-table">
            <div className="tWrap">
              <div className="tWrap__body">
                <table>
                  <thead>
                    <tr>
                      <th>
                        <div className="d-flex align-items-center">{firstColName}</div>
                      </th>
                      <th data-testid={`change-order-intensity-${type}`} onClick={() => handleChangeOrder('intensity', type)}>
                        <div className="d-flex text-capitalize pointer">
                          {intensityTitle}
                          <span>
                            <ImageComponent
                              className="pe-0"
                              imageName={sortIcon('intensity', colName, order)}
                            />
                          </span>
                        </div>
                        <h6 className="font-10 mb-0">
                          {t(defaultUnit === "miles" ? "gco2eUnitMile" : "gco2eUnitKms")}
                          <br />of freight
                        </h6>
                      </th>
                      <th data-testid={`change-order-shipments-${type}`}className="pointer" onClick={() => handleChangeOrder('shipment_count', type)}>
                        <div className="d-flex">
                          {shipmentTitle}
                          <span>
                            <ImageComponent
                              className="pe-0"
                              imageName={sortIcon('shipment_count', colName, order)}
                            />
                          </span>
                        </div>
                      </th>
                      <th  data-testid={`change-order-emission-${type}`} className="pointer" onClick={() => handleChangeOrder('emission', type)}>
                        <div className="d-flex">
                          {emissionTitle}
                          <span>
                            <ImageComponent
                              className="pe-0"
                              imageName={sortIcon('emission', colName, order)}
                            />
                          </span>
                        </div>
                        <h6 className="font-10 mb-0">{t('tco2eUnit')}</h6>
                      </th>
                    </tr>
                  </thead>
                  <TableBodyLoad isLoading={isLoading} isData={data?.length > 0} colSpan={colSpan}>
                    <tbody>
                      {data?.map((row: any, index: number) => (
                        <tr key={row[rowIdentifier]} data-testid={`table-row-data-carrier-overview${index}`}>
                          <td>{row?.[`${rowFields}.name`]}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className="orange-div me-2"
                                style={{ backgroundColor: row?.intensity?.color }}
                              ></div>
                              {formatNumber(true, row?.intensity?.value, 1)}
                            </div>
                          </td>
                          <td>{formatNumber(true, row?.shipment_count, 0)}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className="orange-div me-2"
                                style={{ backgroundColor: row?.cost?.color }}
                              ></div>
                              {formatNumber(true, row?.cost?.value, 2)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </TableBodyLoad>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default EmissionsTable;
