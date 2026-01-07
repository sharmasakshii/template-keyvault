import DecarbController from "./decarbController";
import DecarbMapView from "./DecarbMapView";
import DecarbView from "./DecarbView";
import TitleComponent from "component/tittle";

const DecarbSummaryView = () => {
  const { loginDetails } = DecarbController();

  const companySlug = loginDetails?.data?.Company?.slug;

  return <>
    <TitleComponent title={"Decarb Levers"} pageHeading={`Decarb Levers`} />
    {companySlug === "BMB" ? <DecarbMapView /> : <DecarbView />}
    </>;
};

export default DecarbSummaryView;
