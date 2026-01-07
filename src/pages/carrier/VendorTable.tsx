import { useEffect, useState } from 'react'
import { vendorTableData } from 'store/scopeThree/track/carrier/vendorSlice'
import { useAppDispatch, useAppSelector } from 'store/redux.hooks'
import ImageComponent from "component/images/index"
import { formatNumber, getOrder, sortIcon, checkedNullValue, getTimeCheck } from 'utils'
import Logo from 'component/logo'
import { useNavigate } from 'react-router-dom'
import CarrierRankingTooltip from "component/carrierRankingTooltip";
import PerformanceHeading from "component/PerfomanceHeading"
import { useTranslation } from 'react-i18next'
import Pagination from 'component/pagination';
import TableBodyLoad from 'component/tableBodyHandle';

const VendorTable = ({
    regionalLevel,
    yearlyData,
    quarterDetails,
    emissionsValue,
    searchCarrier,
    performanceTestId,
    tableTestId,
    carrierTestId,
    emissionTestId,
    shipmentTestId,
    totalEmissionTestId,
    clickRowTestId,
    pId,
    weekId,
    timeId,
    divisionLevel,
    showLatestYear,
    defaultUnit,
    isDashbord = false }: any) => {

    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState({
        label: 10,
        value: 10,
    })
    const [order, setOrder] = useState<string>("desc");
    const [col_name, setCol_name] = useState<string>("intensity");
    const { vendorTableDetails, isLoadingVendorTableDetails } = useAppSelector((state: any) => state.carrier);
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const handlePageChange = (e: any) => {
        setPageSize(e);
        setCurrentPage(1);
    };

    const handleChangeOrder = (choose_Col_name: string) => {
        setOrder(getOrder(order));
        setCol_name(choose_Col_name);
    };


    useEffect(() => {
        if (searchCarrier.length >= 3 || searchCarrier.length === 0) {
            setCurrentPage(1);
        }
    }, [regionalLevel, emissionsValue, searchCarrier, quarterDetails, yearlyData, divisionLevel])

    useEffect(() => {
        if (searchCarrier.length >= 3 || searchCarrier.length === 0) {
            if (yearlyData && quarterDetails !== null) {
                const tableDataPayload = {
                    region_id: regionalLevel,
                    division_id: divisionLevel,
                    page: currentPage,
                    page_size: pageSize?.value,
                    order_by: order,
                    col_name: col_name,
                    search_name: searchCarrier?.length >= 3 ? searchCarrier : "",
                    min_range: emissionsValue?.[0],
                    max_range: emissionsValue?.[1],
                    ...getTimeCheck(yearlyData, quarterDetails, timeId)
                };
                dispatch(vendorTableData(tableDataPayload));
            }
        }
    }, [dispatch, searchCarrier, yearlyData, timeId, emissionsValue, quarterDetails, regionalLevel, currentPage, order, col_name, pageSize, divisionLevel]);
    const { t } = useTranslation()
    return (<div className="static-table static-vendor-table mt-0 py-4">
        <div className="static-table static-vendor-table">
            <div className="d-lg-flex performance px-3 pb-3" data-testid={performanceTestId}>
                <PerformanceHeading />
                <div className="d-flex align-items-center ps-lg-2 mb-2">
                    <h6 className="mb-0 ps-2 font-xxl-14 font-12">
                        {t('avgEmissions')} (
                        {vendorTableDetails?.data?.average} g)
                    </h6>
                </div>
            </div>
            <div className="tWrap">
                <div className="tWrap__body">

                    <table data-testid={tableTestId}>
                        <thead>
                            <tr>
                                <th data-testid={carrierTestId} onClick={() => handleChangeOrder("carrier_name")}>
                                    <div className="pointer d-flex">
                                        {t('carrierTitle')}<span><ImageComponent imageName={`${sortIcon("carrier_name", col_name, order)}`} /></span>
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex">{t('rankingTitle')} {showLatestYear ? "(2023)" : "(2022)"}</div>
                                </th>
                                <th data-testid={emissionTestId} onClick={() => handleChangeOrder("intensity")}>
                                    <div className="d-flex pointer">
                                        {t('emissionIntensityHeading')}<span><ImageComponent imageName={`${sortIcon("intensity", col_name, order)}`} /></span>
                                    </div>
                                    <h6 className="font-10 mb-0">
                                        {`*gCO2e / Ton-${defaultUnit === "miles" ? "Mile" : "Kms"} of freight`}
                                    </h6>
                                </th>
                                <th data-testid={shipmentTestId} className="pointer" onClick={() => handleChangeOrder("shipment_count")}>
                                    {t('totalShipmentHeading')}<span><ImageComponent imageName={`${sortIcon("shipment_count", col_name, order)}`} /></span>
                                </th>
                                <th data-testid={totalEmissionTestId} className="pointer" onClick={() => handleChangeOrder("emissions")}>
                                    {t('totalEmissionHeading')}<span><ImageComponent imageName={`${sortIcon("emissions", col_name, order)}`} /></span>
                                    <br />
                                    <h6 className="font-10 mb-0">tCO2e</h6>
                                </th>
                            </tr>
                        </thead>
                        <TableBodyLoad loaderTestId="spinner-loader" isLoading={isLoadingVendorTableDetails} isData={vendorTableDetails?.data?.responseData?.length > 0} colSpan={5}>
                            {
                                vendorTableDetails?.data.responseData?.map(
                                    (xx: any, index: number) => {
                                        const data2023 = xx?.SmartwayData?.find((x: any) => x?.year === 2023);
                                        const data2022 = xx?.SmartwayData?.find((x: any) => x?.year === 2022);
                                        return (
                                            <tr data-testid={`${clickRowTestId}-${index}`} key={xx?.carrier} onClick={() => isDashbord ? navigate(`/scope3/carrier-overview/${xx?.["carrier"]}/lane-detail/0/${yearlyData}/${checkedNullValue(quarterDetails)}/${checkedNullValue(pId)}/${checkedNullValue(weekId)}/regional-level`) : navigate(`/scope3/carrier-overview/${xx?.["carrier"]}/${yearlyData}/${checkedNullValue(quarterDetails)}/${checkedNullValue(pId)}/${checkedNullValue(weekId)}`)}>
                                                <td>
                                                    <div className="d-flex align-items-center text-capitalize gap-2">
                                                        <div className="carrierLogoTooltip">
                                                            <CarrierRankingTooltip item={xx} />
                                                            <Logo path={xx?.carrier_logo} name={xx?.carrier} />
                                                        </div>
                                                        {xx?.carrier_name}{" "}
                                                        ({xx?.carrier})
                                                    </div>
                                                </td>

                                                <td>
                                                    {(data2023?.ranking || data2022?.ranking) ? (
                                                        <div className="d-flex align-items-center">
                                                            {showLatestYear ? data2023?.ranking : data2022?.ranking}
                                                        </div>
                                                    ) : (
                                                        "N/A"
                                                    )}
                                                </td>

                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="orange-div me-2" style={{ backgroundColor: xx?.color }}></div>
                                                        {formatNumber(true, xx?.intensity, 1)}
                                                    </div>
                                                </td>
                                                <td>
                                                    {formatNumber(true, xx?.shipment_count, 0)}
                                                </td>
                                                <td>
                                                    {formatNumber(true, xx?.emissions, 2)}
                                                </td>
                                            </tr>
                                        )
                                    }


                                )}

                        </TableBodyLoad>
                    </table>
                </div>
            </div>
        </div>
        <div className="d-flex justify-content-end pt-3 px-3 ">
            <div className="lane-pagination ">
                <nav aria-label="Page navigation example" className=" d-flex justify-content-end select-box">
                    <Pagination
                        currentPage={currentPage}
                        pageSize={pageSize}
                        total={vendorTableDetails?.data?.pagination?.total_count}
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
    )
}

VendorTable.defaultProps = {
    emissionsValue: [60, 390],
    searchCarrier: ""
}

export default VendorTable