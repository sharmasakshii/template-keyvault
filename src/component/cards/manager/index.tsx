import Heading from "component/heading";
import ImageComponent from "component/images";
import BackLink from "component/forms/backLink/index";
import DateFilter from "component/forms/dateFilter";

const ManagerDetailOverviewCard = ({
  managerName,
  showManger,
  transportManager = false,
  profileImg = true,
  projectHolder,
  backBtnTxt,
  backBtnLink,
  name,
  title,
  onChangeYear,
  onChangeYearQuarter,
  disabledYear,
  showDropdown,
  backBtnTestId,
  yearDropDownOverviewId,
  quarterDropDownOverviewId,
  pId,
  setPId,
  weekId, 
  setWeekId,
  yearlyData,
  quarterDetails,
  isWeekDropdownShow = true
}: any) => {

  return (
    <div>
      <div className="gap-2 d-flex flex-wrap align-items-center pb-sm-0 pb-3">
        <BackLink backBtnTestId={backBtnTestId} btnText={backBtnTxt} link={backBtnLink} />

        {showDropdown && (
          <div className="select-box d-flex gap-2 me-sm-4">
            <DateFilter
              isLoading={disabledYear}
              yearlyId={yearlyData}
              quarterId={quarterDetails}
              yearDropDownId={yearDropDownOverviewId}
              quarterDropDownId={quarterDropDownOverviewId}
              pId={pId}
              setPId={setPId}
              weekId={weekId} 
              setWeekId={setWeekId}
              updateYear={onChangeYear}
              updateQuarter={onChangeYearQuarter}
              isWeekDropdownShow={isWeekDropdownShow}
            />
          </div>
        )}

        {showManger && (
          <div>
            <div className="emission d-flex gap-3 align-items-center">
              <span className="line"></span>
              <div className="d-flex align-items-center manager">
                {profileImg && (
                  <div className="manager-img-default pe-2">
                    <ImageComponent path="/images/profile-img-auto.png" />
                  </div>
                )}

                <div className="ps-0">
                  <Heading
                    level="4"
                    content={projectHolder}
                    className="emi-txt mb-0 font-xxl-14 fw-semibold font-14"
                  />
                  <h5 className="mb-0 font-14">{name}</h5>
                  <h6 className="mb-0 font-14 fw-normal text-capitalize">
                    {managerName}
                  </h6>
                  <h6 className="mb-0 font-12 fw-normal text-capitalize">
                    {title}
                  </h6>
                  {transportManager && (
                    <Heading
                      level="6"
                      content={`Transport Manager`}
                      className="mb-0 mt-2 font-12 fw-light text-capitalize"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ManagerDetailOverviewCard.defaultProps = {
  title: "",
  showManger: true,
  yearlyData: "",
  quarterDetails: "",
  disabledYear: false,
  disabledQuarter: false,
  showDropdown: false,
};

export default ManagerDetailOverviewCard;
