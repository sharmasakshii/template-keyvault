import ImageComponent from "../images"
import { Row, Col } from "reactstrap";

/**
 * Renders a tooltip component for displaying Smartway Ranking data.
 *
 * @param {object} item - The item object containing Smartway Ranking data.
 * @return {JSX.Element} The rendered tooltip component.
 */
const RankingTooltip = ({item} :any) => {
    return (
        <div> <div className="carrierLogoTooltip_text">
            <div className="arrowDiv"></div>
            <h4 className="font-14 fw-bold mb-2 px-3 pe-1 pt-3 pb-2"><span><ImageComponent path="/images/smartwayRanking.svg" /></span>Smartway Ranking</h4>
            <div className="d-flex flex-column pe-3 pb-3 pt-1 dataRank">
                {!item?.SmartwayData?.length ? <h6 className="font-14 ps-4">
                    No rank available
                </h6>
                    : item?.SmartwayData?.map((ranking: any) =>
                        <div key={ranking?.year} className="d-flex align-items-center rankingLine">
                            <ImageComponent path="/images/rankingYear.svg" className="pe-2" />
                            <Row className="w-100">
                                <Col sm="6" className="px-2">
                                    <h5 className="font-14 mb-0 linebefore">Year: <span className="font-14 fw-bold">{ranking?.year}</span></h5>
                                </Col>
                                <Col sm="6" className="px-2">
                                    <h5 className="font-14 mb-0">Rank: <span className="font-14 fw-bold">{ranking?.ranking}</span></h5>
                                </Col>
                            </Row>
                        </div>
                    )}
            </div>
        </div></div>
    )
}

export default RankingTooltip