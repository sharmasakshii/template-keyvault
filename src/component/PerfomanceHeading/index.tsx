import { useTranslation } from 'react-i18next'

const PerfomanceHeading = ({className}:any) => {
    const { t } = useTranslation()
    return (
        <div className={`d-flex flex-wrap gap-3 mb-2 ${className}`} data-testid="performance-data-heading">
            <div className="d-flex align-items-center">
                <div className="orange-div"></div>
                <h6 className="mb-0 ps-2 font-xxl-14 font-12">{t('lowPerformance')}</h6>
            </div>
            <div className="d-flex align-items-center">
                <div className="white-div"></div>
                <h6 className="mb-0 ps-2 font-xxl-14 font-12">{t('mediumPerformance')}</h6>
            </div>
            <div className="d-flex align-items-center">
                <div className="primary-div"></div>
                <h6 className="mb-0 ps-2 font-xxl-14 font-12">{t('highPerformance')}</h6>
            </div>
        </div>
    )
}

export default PerfomanceHeading