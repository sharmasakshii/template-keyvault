import Heading from '../../component/heading';
import ButtonComponent from "../../component/forms/button"
import DecarbController from "./decarbController";
import { Row, Col, Progress } from "reactstrap";
import { getPriorityColor, sortIcon, sortList, isCompanyEnable } from "../../utils"
import ImageComponent from '../../component/images';
import PerformanceHeading from "component/PerfomanceHeading"
import { DecarbLane } from "store/scopeThree/track/decarb/decarbInterface";
import { companySlug } from "constant"
/**
 * 
 * @returns Decarb view page
 */


const DecarbView = () => {

    // Importing all states and functions from Decarb controller
    const {
        decarbLaneList,
        decarbLaneListLoading,
        handleDecarb,
        setGridType,
        gridType,
        handleChangeOrder,
        col_name,
        order,
        configConstants,
        loginDetails,
    } = DecarbController();
    const defaultUnit = configConstants?.data?.default_distance_unit
    return (
        <>
            {/* Decarb Levers dashboard starts */}
            <section className="decarb-screen pb-3 pt-2 px-2" data-testid="decarb-levers">
                <div className="decarb-screen-wraper">
                    <div className="decarb-section pb-3 py-0">
                        <div className="decarb-heading px-3 pt-3">
                            <div className='d-flex justify-content-end gap-2 align-items-center mb-3'>
                                <div className={`text-center ${gridType === "card" && "activeView"}`}>
                                    <ButtonComponent data-testid="decarb-grid-card" imagePath="/images/cardview.svg" text="" btnClass="p-0 border-0" onClick={() => setGridType("card")} />
                                </div>
                                <div className={`text-center ${gridType === "table" && "activeView"}`}>
                                    <ButtonComponent data-testid="decarb-grid-table" imagePath="/images/tabularview.svg" text="" btnClass="p-0 border-0" onClick={() => setGridType("table")} />
                                </div>
                            </div>
                        </div>
                        <div className="px-3 pt-3">

                            {/* cards ui */}
                            <Row className="gx-3">
                                {decarbLaneListLoading && <div className="graph-loader d-flex justify-content-center align-items-center" data-testid="decarb-loading-div">
                                    <div className="spinner-border  spinner-ui">
                                        <span className="visually-hidden"></span>
                                    </div>
                                </div>}
                                <div>
                                    {!decarbLaneListLoading && decarbLaneList?.data?.length === 0 && (
                                        <Col lg="12" data-testid="no-data-found">
                                            <div className="pb-3 pt-3 text-center">
                                                <Heading level="4"
                                                    content={`There were no recommended levers found.`}
                                                    className="font-18 fw-semibold"
                                                />
                                            </div>
                                        </Col>
                                    )
                                    }</div>
                            </Row>
                            {!decarbLaneListLoading && decarbLaneList?.data?.length !== 0 && <>
                                {gridType === "card" ?
                                    <div data-testid="decarb-cardView" className="pb-4">
                                        <Row className="g-4">
                                            {decarbLaneList?.data?.map((i: DecarbLane, index: number) => (
                                                <Col lg="4" md="6" key={i?.region_id}>
                                                    <button type="button" className="inner-data-region h-100 border-0 bg-transparent w-100 h-100" data-testid={`click-regionid-${index}`} onClick={() => handleDecarb(i?.[isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo]) ? "division_id" : "region_id"])}>
                                                        <div className="priority-btn-wrap">
                                                            <div className="priority-btn">
                                                                <label data-testid={`showing-heading-prority-base-${index}`} className={`px-4 py-1 priority ${getPriorityColor(i?.type)}`}>
                                                                    {i?.type}
                                                                </label>
                                                            </div>

                                                            <div className="id-data p-3">
                                                                <div className="pb-3 pt-3">
                                                                    <Heading level="5"
                                                                        content={`${isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo]) ? "Division :" : "Region :"} ${i?.name} `}
                                                                        className="mb-3 fw-normal font-14 text-start"
                                                                    />

                                                                    <div className="d-flex flex-wrap gap-1 mb-2">
                                                                        <Heading level="5"
                                                                            content="Emissions Intensity"
                                                                            className="mb-0 font-14 mb-0"
                                                                        />
                                                                        <Heading level="4"
                                                                            content={`${i?.intensity || 0}`}
                                                                            spanText={`gCO2e/Ton-${defaultUnit === "miles" ? "Mile" : "Kms"} of freight`}
                                                                            className="fw-bold font-14 mb-0"
                                                                        />
                                                                    </div>
                                                                    <Progress
                                                                        className={`${getPriorityColor(i?.type)}`} value={Number.parseInt(i?.intensity.toString()) || 0}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="quartely-wrapper p-3">
                                                                <div className="d-flex gap-1 justify-content-between flex-wrap">
                                                                    <div className="quartely d-inline-block">
                                                                        <Heading level="4"
                                                                            content="Opportunity Lanes"
                                                                            className="font-12 font-xxl-14 text-center fw-normal"
                                                                        />
                                                                        <div className="d-flex justify-content-center">
                                                                            <Heading level="4"
                                                                                content={i?.problem_lanes || 0}
                                                                                className="font-18 font-xxl-20 fw-semibold"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="quartely d-inline-block">
                                                                        <Heading level="4"
                                                                            content="Total lanes"
                                                                            className="font-12 font-xxl-14 text-center fw-normal"
                                                                        />
                                                                        <div className="d-flex justify-content-center">
                                                                            <Heading level="4"
                                                                                content={i?.lane_count || 0}
                                                                                className="font-18 font-xxl-20 fw-semibold"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    {!isCompanyEnable(loginDetails?.data, [companySlug?.adm]) && <div className="quartely d-inline-block">
                                                                        <Heading level="4"
                                                                            content="Carriers"
                                                                            className="font-12 font-xxl-14 text-center fw-normal"
                                                                        />
                                                                        <div className="d-flex justify-content-center">
                                                                            <Heading level="4"
                                                                                content={i?.carrier_count || 0}
                                                                                className="font-18 font-xxl-20 fw-semibold"
                                                                            />
                                                                        </div>
                                                                    </div>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div> : <div className="static-table mb-4" data-testid='decarb-table'>
                                        <table className="w-100">
                                            <thead>
                                                <tr>
                                                    <th data-testid="decrab-change-order-priority" onClick={() => handleChangeOrder("priority")}>
                                                        <div className="d-flex align-items-center">
                                                            Region Priority <span><ImageComponent imageName={`${sortIcon("priority", col_name, order)}`} className="pe-0" /></span>
                                                        </div>
                                                    </th>

                                                    <th data-testid="decrab-change-order-intensity" onClick={() => handleChangeOrder("intensity")}>
                                                        <div className="d-flex text-capitalize pointer">
                                                            Emissions intensity <span><ImageComponent imageName={`${sortIcon("intensity", col_name, order)}`} className="pe-0" /></span>
                                                        </div>
                                                    </th>

                                                    <th data-testid="decrab-change-order-problem_lenes" onClick={() => handleChangeOrder("problem_lanes")}>
                                                        Opportunity Lanes <span><ImageComponent imageName={`${sortIcon("problem_lanes", col_name, order)}`} className="pe-0" /></span>
                                                    </th>
                                                    <th data-testid="decrab-change-order-lane_count" onClick={() => handleChangeOrder("lane_count")}>
                                                        Total Lanes <span><ImageComponent imageName={`${sortIcon("lane_count", col_name, order)}`} className="pe-0" /></span>
                                                    </th>
                                                    <th data-testid="decrab-change-order-carrier_count" onClick={() => handleChangeOrder("carrier_count")}>
                                                        Carriers <span><ImageComponent imageName={`${sortIcon("carrier_count", col_name, order)}`} className="pe-0" /></span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className=" text-start ">
                                                {!decarbLaneListLoading && sortList([...decarbLaneList?.data || []], col_name, order).map((i: DecarbLane, index: number) => (
                                                    <tr data-testid={`click-row-regionid-${index}`} onClick={() => handleDecarb(i?.[isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo]) ? "division_id" : "region_id"])} key={i?.region_id || i?.division_id}>
                                                        <td>
                                                            <div className="d-flex gap-2 align-items-center">
                                                                <Heading level="5"
                                                                    content={i?.type}
                                                                    className={`mb-0 fw-semibold font-8 font-xxl-10 priority ${getPriorityColor(i?.type)}`}
                                                                />

                                                                <Heading level="5"
                                                                    content={`${isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo]) ? "Division" : "Region"} ${i?.name} `}
                                                                    className="mb-0 fw-semibold font-14 text-decoration-underline"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <Heading level="4"
                                                                    content={i?.intensity || 0}
                                                                    className="font-12 font-xxl-12 text-center fw-normal mb-0"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <Heading level="4"
                                                                    content={i?.problem_lanes || 0}
                                                                    className="font-12 font-xxl-12 text-center fw-normal mb-0"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <Heading level="4"
                                                                    content={i?.lane_count || 0}
                                                                    className="font-12 font-xxl-12 text-center fw-normal mb-0"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <Heading level="4"
                                                                    content={i?.carrier_count || 0}
                                                                    className="font-12 font-xxl-12 text-center fw-normal mb-0"
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>}
                                <PerformanceHeading />
                            </>
                            }


                            {/* tablular ui */}
                        </div>
                    </div>
                </div>
            </section >
           
        </>
    );
}

export default DecarbView