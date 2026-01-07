import React, { useEffect } from "react";
import ImageComponent from "../../images";
import { Link } from "react-router-dom";
import { useAppDispatch } from "store/redux.hooks";
import { clearData } from "store/benchmark/benchmarkSlice";
const BackLink = ({ link, btnText = "Back", backBtnTestId}: { link: string, btnText?: string, backBtnTestId?:string }): any => {
  
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(clearData());
  }, [dispatch]);

  return (
    <div className="backBtn" data-testid={backBtnTestId}>
      <Link
        to={`/${link}`}
        className="btn-deepgreen py-2 px-3 d-flex align-items-center font-14 text-decoration-none"
      >
        <span>
          {" "}
          <ImageComponent path="/images/back.svg" />
        </span>
         {btnText}
      </Link>
    </div>
  );
};

export default BackLink;
