import ImageComponent from 'component/images';
import TableBodyLoad from 'component/tableBodyHandle';
import { formatNumber, normalizedList, sortIcon } from "utils";
import { useTranslation } from 'react-i18next';

const EmissionsIntensityTable = (props: any) => {
    const { t } = useTranslation()

    const {
        nameKey = "name",
        handleChangeOrder,
        order,
        colName,
        loadingTableData,
        emissionList,
        navigateLink,
        colLabel,
        isBusiness = false,
        configConstants
    } = props

    return (
        <div className="static-table pb-3">
            <div className="tWrap">
                <div className="tWrap__body">
                    <table data-testid="table-graph-data">
                        <thead>
                            <tr>
                                <th>
                                    <div className="d-flex align-items-center">
                                        {colLabel}
                                    </div>
                                </th>

                                <th data-testid="change-order-intensity" onClick={() => handleChangeOrder("intensity")}>
                                    <div className="d-flex text-capitalize pointer" >
                                        {t('emissionIntensityHeading')}
                                        <span><ImageComponent imageName={`${sortIcon("intensity", colName, order)}`} /></span>
                                    </div>
                                    <h6 className="font-10 mb-0">
                                        gCO2e/Ton-{configConstants === "miles" ? "Mile" : "Kms"}
                                        <br /> of freight
                                    </h6>
                                </th>
                                <th data-testid="change-order-shipments" className="pointer" onClick={() => handleChangeOrder("shipments")}>
                                    {t('totalShipmentHeading')}
                                    <span><ImageComponent imageName={`${sortIcon("shipments", colName, order)}`} /></span>
                                </th>
                                <th data-testid="change-order-emission" className="pointer" onClick={() => handleChangeOrder("emission")}>
                                    {t('totalEmissionHeading')}
                                    <span>
                                        <ImageComponent imageName={`${sortIcon("emission", colName, order)}`} />
                                    </span>

                                    <h6 className="font-10 mb-0">tCO2e</h6>
                                </th>

                            </tr>
                        </thead>
                        <TableBodyLoad isLoading={loadingTableData} noDataMsg="No Data Found" isData={normalizedList(emissionList)?.length > 0} colSpan={4}>
                            <tbody className=" text-start ">
                                {normalizedList(emissionList)?.map((row: any, index: number) => (
                                    <tr data-testid={`table-row-data${index}`} onClick={() => navigateLink(row)} key={row?.name} className="">
                                        <td>   {isBusiness ? `${row?.description} (${row?.name})` : row?.[nameKey]}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div
                                                    className="orange-div me-2"
                                                    style={{
                                                        backgroundColor: row?.intensity?.color,
                                                    }}
                                                ></div>
                                                {formatNumber(true,
                                                    row?.intensity?.value, 1
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            {formatNumber(true, row?.shipments, 0)}
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div
                                                    className="orange-div me-2"
                                                    style={{
                                                        backgroundColor: row?.cost?.color,
                                                    }}
                                                ></div>
                                                {formatNumber(true,
                                                    row?.cost?.value, 2
                                                )}
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
    )
}

export default EmissionsIntensityTable