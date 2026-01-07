import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import { decarbLineData } from "../../store/scopeThree/track/decarb/decarbSlice";
import { checkRolePermission, getOrder } from "../../utils";
import { getConfigConstants } from "store/sustain/sustainSlice";

/**
 * Controller component for the LanesView page.
 * Manages state and logic for the LanesView page.
 * @returns All controllers and state variables for the LanesView page.
 */
const DecarbController = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loginDetails } = useAppSelector((state: any) => state.auth);
  const [gridType, setGridType] = useState("card");
  const [order, setOrder] = useState<string>("desc");
  const [col_name, setCol_name] = useState<string>("intensity");
  const { decarbLaneList, decarbLaneListLoading } = useAppSelector(
    (state: any) => state.decarb
  );
  let regionalLevelId = checkRolePermission(
    loginDetails?.data,
    "regionalManager"
  )
    ? loginDetails?.data?.region_id
    : "";

  const handleDecarb = (id: any) => {
    navigate(`/scope3/decarb-problem-lanes/${id}`);
  };
  const { configConstants } = useAppSelector((state: any) => state.sustain);
  const companySlug = loginDetails?.data?.Company?.slug;
  const [boundType, setBoundType] = useState("0");

 const handleChangeBoundType = () => {
  setBoundType(prev => (prev === "0" ? "1" : "0"));
};

  useEffect(() => {
    dispatch(getConfigConstants({ region_id: "" }));
  }, [dispatch]);
  useEffect(() => {
    if (loginDetails?.data) {
      dispatch(
        decarbLineData({
          region_id: regionalLevelId,
          ...(companySlug === "BMB" && { in_out_bound: boundType }),
        })
      );
    }
  }, [dispatch, regionalLevelId, loginDetails, boundType]);
 
  const handleChangeOrder = (choose_Col_name: string) => {
    setOrder(getOrder(order));
    setCol_name(choose_Col_name);
  };

  // Return the state variables and functions for use in the component
  return {
    decarbLaneList,
    decarbLaneListLoading,
    handleDecarb,
    setGridType,
    gridType,
    handleChangeOrder,
    col_name,
    order,
    navigate,
    loginDetails,
    configConstants,
    handleChangeBoundType,
    boundType
  };
};

export default DecarbController;
