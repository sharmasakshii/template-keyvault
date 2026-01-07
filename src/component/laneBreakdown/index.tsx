import { Table } from "reactstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { formatNumber } from "utils";
import Heading from "component/heading";
import TableBodyLoad from "component/tableBodyHandle";
import { useTranslation } from "react-i18next";

const LaneBreakdown = (props: any) => {
    const {
        laneBreakdownIsLoading,
        contributorList,
        detractorList,
        totalShipment,
        heading,
        defaultUnit
    } = props
    
    const { t } = useTranslation()

    return <div className="mainGrayCards py-3 h-100 static-table">
        <div className="px-3">
        <Heading
            level="6"
            className="fw-semibold font-14 mb-1"
            content={heading}
        />
        <Heading
            level="4"
            content={t('laneBreakdownTableTitle')}
            className="fw-semibold font-xxl-20 font-16 mb-2"
        />
        </div>
       
        <Tabs
            defaultActiveKey="home"
            transition={false}
            id="noanim-tab-example"
            className="mb-3 px-3"
        >
            <Tab eventKey="home" title="High Emissions Intensity Lanes">
                <Table
                    data-testid="high-emission-table-data"
                    responsive
                    className="mt-0 mb-0"
                >
                    <thead>
                        <tr>
                            <th>
                                <div className="d-flex align-items-center ">
                                    {t('laneTitle')}
                                </div>
                            </th>

                            <th>
                                <div className="d-flex align-items-center">
                                    Emissions Intensity
                                </div>
                                <h6 className="font-10 mb-0">
                                    {t(defaultUnit === "miles" ? "gco2eUnitMile" : "gco2eUnitKms")}
                                    <br /> of freight
                                </h6>
                            </th>
                            <th>
                                <div className="d-flex align-items-center">
                                    Total Emissions
                                </div>
                                <h6 className="font-10 mb-0">tCO2e</h6>
                            </th>
                            <th  className="w-auto">
                                <div className="d-flex align-items-center">
                                    Share of Tonnage
                                    <br />
                                    Shipped on this Lane
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <TableBodyLoad colSpan={4} noDataMsg="No Lane Found" isLoading={laneBreakdownIsLoading} isData={detractorList?.length > 0}>
                        <tbody>
                            {detractorList?.map((item: any) => (
                                <tr key={item?.name}>
                                    <td>
                                        <div className="d-flex align-items-center text-decoration-none">
                                            {item?.name.split("_").join(" to ")}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <div className="orange-div me-2"></div>
                                            {formatNumber(
                                                true,
                                                item?.total_intensity,
                                                1
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <div className="orange-div me-2"></div>
                                            {formatNumber(
                                                true,
                                                item?.total_emission,
                                                2
                                            )}
                                        </div>
                                    </td>
                                    <td  className="w-auto">
                                        <div className="d-flex align-items-center">
                                            {formatNumber(
                                                true,
                                                (item?.shipment_count / totalShipment) * 100,
                                                1
                                            )}%
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </TableBodyLoad>
                </Table>
            </Tab>
            <Tab
                eventKey="profile"
                title="Low Emissions Intensity Lanes"
            >

                <Table
                    data-testid="low-emission-tab-table"
                    responsive
                    className="mt-0 mb-0"
                >
                    <thead>
                        <tr>
                            <th>
                                <div className="d-flex align-items-center ">
                                    Lanes
                                </div>
                            </th>
                            <th>
                                <div className="d-flex align-items-center">
                                    Emissions Intensity
                                </div>
                                <h6 className="font-10 mb-0"> {t(defaultUnit === "miles" ? "gco2eUnitMile" : "gco2eUnitKms")}  <br /> of freight</h6>
                               
                            </th>
                            <th>
                                <div className="d-flex align-items-center">
                                    Total Emissions
                                </div>
                                <h6 className="font-10 mb-0">tCO2e</h6>
                            </th>
                            <th className="w-auto">
                                <div className="d-flex align-items-center">
                                    Share of Tonnage
                                    <br />
                                    Shipped on this Lane
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <TableBodyLoad colSpan={4} noDataMsg="No Lane Found" isLoading={laneBreakdownIsLoading} isData={contributorList?.length > 0}>
                        <tbody>
                            {contributorList
                                ?.map((item: any) => (
                                    <tr key={item?.name}>
                                        <td>
                                            <div className="d-flex align-items-center text-decoration-none">
                                                {item?.name.split("_").join(" to ")}
                                            </div>
                                        </td>

                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="primary-div me-2"></div>
                                                {formatNumber(
                                                    true,
                                                    item?.total_intensity,
                                                    1
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="primary-div me-2"></div>
                                                {formatNumber(
                                                    true,
                                                    item?.total_emission,
                                                    2
                                                )}
                                            </div>
                                        </td>
                                        <td  className="w-auto">
                                            <div className="d-flex align-items-center">

                                                {formatNumber(
                                                    true,
                                                    (item?.shipment_count / totalShipment) * 100,
                                                    1
                                                )}%
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </TableBodyLoad>
                </Table>

            </Tab>
        </Tabs>
    </div>;
};

export default LaneBreakdown;