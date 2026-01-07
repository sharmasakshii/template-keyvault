import RankingTooltip from "component/carrierRankingTooltip";
import Logo from "component/logo";
import React from "react";
import { checkNumberUndefined, formatNumber, normalizedList, typeCheck } from "utils";
import { Table } from "reactstrap";
import CarrierTableHeader from "pages/benchmarkCarrierTable/CarrierTableHeader";
import TableBodyLoad from "component/tableBodyHandle";
import IntensityMarker from "../IntensityMarker";

interface EmissionsTableBodyProps {
  data: any[];
  isLoading: boolean;
  testId: string;
  emissionType: string; // "company_intensity" or "industry_intensity"
  emissionByRegionDto: any;
}

const EmissionsTableBody: React.FC<EmissionsTableBodyProps> = ({
  data,
  testId,
  isLoading,
  emissionType,
  emissionByRegionDto,
}) => {
  return (
    <>
      <div className="custom-table table-bg">
        <Table data-testid={testId} responsive>
          <CarrierTableHeader />
          <TableBodyLoad isLoading={isLoading} noDataMsg="No Data Found"
            isData={normalizedList(data)?.length > 0} colSpan={5}>
            <tbody>
              {data?.map((i: any) => (
                <tr key={i?.name}>
                  <td>
                    <div className="logo-list">
                      <div className="carrierLogoTooltip">
                        <RankingTooltip item={i} />
                        <Logo path={i?.carrier_logo} name={i?.name} />
                      </div>
                      <span className="custom-title">
                        {i?.name} ({i?.carrier})
                      </span>
                    </div>
                  </td>

                  <td>
                    <p
                      className={typeCheck(
                        Number.parseFloat(
                          emissionByRegionDto?.data?.benchmarksData?.[emissionType]
                        ) >
                        Number.parseFloat(checkNumberUndefined(i?.emission_intensity)),
                        "custom-green",
                        ""
                      )}
                    >
                      <span className="table-box"></span>
                      {formatNumber(true, i?.emission_intensity, 1)}
                    </p>
                  </td>
                  <td>{formatNumber(true, i?.total_shipment, 0)}</td>
                  <td>
                    <p>{formatNumber(true, i?.total_emission, 2)}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableBodyLoad>
        </Table>
      </div>
      <IntensityMarker
        isLoading={isLoading}
      />
    </>
  );
};

export default EmissionsTableBody;
