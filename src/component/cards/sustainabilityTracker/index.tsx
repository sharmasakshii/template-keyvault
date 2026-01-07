import ImageComponent from 'component/images'
interface CardData {
  testid?: string;
  isLoadingTestid?: string;
  cardSubHeading?: string;
  cardValueColor?: string;
  cardValue?: any;
  cardDate: any;
  className?: string;
  showPercentage?: boolean;
  isLoading?: boolean;
  imagePath?: string;
  unit?: number | string;
  imagePathArrow?: any;
  children?: any;
  isData?: boolean;
}

const SustainViewCard: React.FC<CardData> = ({
  testid,
  imagePath,
  cardDate,
  cardSubHeading,
  isLoading = false,
  isLoadingTestid,
  cardValueColor,
  className,
  cardValue = "",
  showPercentage = false,
  unit,
  imagePathArrow = false,
  children,
  isData = true
}) => {
  return (
    <div data-testid={testid} className={`primaryCard d-flex align-items-center justify-content-center  ${className}`}>
      {isLoading ? <div data-testid={isLoadingTestid} className="card-loader d-flex justify-content-center align-items-center">
        <div className="spinner-border spinner-ui">
          <span className="visually-hidden"></span>
        </div>
      </div> : <div className="primaryCardInnerWprpper d-flex align-items-center gap-3 justify-content-center">
        {imagePath && <ImageComponent
          path={imagePath}
          alt="files"
          className='pe-0'
        />}
        <div>
          <div className="by-date mt-0 font-18 d-flex flex-wrap gap-1 align-items-center">
            <h3 className="mb-0 font-14 font-xxl-18 fw-medium cardDate">
              {cardDate}
                {cardSubHeading && <span className="font-xxl-14 font-12 fw-light mb-0 cardSub">({cardSubHeading})</span>}
                </h3>
          </div>
          {
            isData ? <div className="co-txt d-flex gap-2 align-items-center justify-content-center ">
              <h4 className={`mb-0 titleMain font-30 font-xl-34 font-xxl-46 ${cardValueColor}`}>
                {cardValue || 0}
                {showPercentage ? "%" : ""}
                {unit && <span className='valueTxt'>
                  {unit}
                </span>}
              </h4>
              {children}
              {imagePathArrow && <ImageComponent className='pe-0' path={imagePathArrow} />}
            </div> : <div className="co-txt d-flex gap-2 align-items-center justify-content-center ">
              <h4 className={`mb-0 titleMain`}>
               No Data Found
              </h4>
            </div>
          }
        </div>
      </div>}
    </div>
  );
};

export default SustainViewCard;
