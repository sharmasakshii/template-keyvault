import React from 'react'
import { Col } from 'react-bootstrap'
import { formatNumber } from 'utils'
import ImageComponent from "../../component/images";
import { useTranslation } from 'react-i18next';

const ProjectCount = ({projectCountData}:any) => {
      const { t } = useTranslation()
    return (
        <Col md="12" xl="6" className="p-0">
            {[
                { key: 'completed', value: 0, percentage: '0%', divClass: 'lightgreen-div', containerClass: '' },
                { key: 'onTrack', value: formatNumber(true, projectCountData?.data?.Total, 0), percentage: '5%', divClass: 'green-div', containerClass: 'track-btn-green' },
                { key: 'actionNeeded', value: 0, percentage: '0%', divClass: 'orange-div', containerClass: 'track-btn-orange' }
            ].map((item) => (
                <div className="py-2" key={item.key}>
                    <div className={`ps-4 ps-lg-0 d-flex align-content-center justify-content-between ${item.containerClass}`}>
                        <div className="co-txt d-flex gap-1 align-items-center pt-0">
                            <div className={item.divClass}></div>
                            <h4 className="mb-0 font-14 font-xxl-16 fw-medium">
                                {t(item.key)}
                            </h4>
                            <h5 className="mb-0 font-xxl-20 font-16 fw-medium">
                                {item.value}
                            </h5>
                        </div>

                        <h4 className="d-flex align-items-center mb-0 overNumber">
                            <span><ImageComponent path="/images/g-arrow.svg" /></span> {item.percentage}
                        </h4>
                    </div>
                </div>
            ))}
            <div className="font-xxl-14 font-12">
                *Estimated emissions
            </div>
        </Col>
    )
}

export default ProjectCount