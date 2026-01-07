import { valueConstant } from "constant";
import moment from "moment";

// DateTimeShow component to display the last update date and time
const DateShow = ({ dateInfo = null, dateFormate = valueConstant?.DATE_FORMAT, isActive = false }: any) => {
  return (
    <>
      {isActive ? (
        dateInfo && (
          <div className="lates-update">
            <p className="d-flex align-items-center mb-0 justify-content-start font-14">
              Data available from{" "}
              {moment
                .utc(dateInfo?.start_date)
                .format(dateFormate)}{" "}
              to{" "}
              {moment
                .utc(dateInfo?.end_date)
                .format(dateFormate)}
            </p>
          </div>
        )
      ) : (
        <>
          {/*  Paragraph to display the last update date and time */}
          <p className="font-12 mb-1 d-flex align-items-center">
            {/* Display the last updated time in "hh:mm A" format */}
            Last updated at {moment().format("hh:mm A")} on{" "}
            {/* Display the last updated date in "DD MMM YY" format */}
            {moment().format(dateFormate)}
            {/* Display the LatestUpdate icon */}

          </p>
        </>
      )}
    </>
  );
};


export default DateShow;
