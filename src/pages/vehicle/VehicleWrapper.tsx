import FuelView from "pages/fuel/FuelView";
import { vehicleGraphData } from "store/fuel/fuelSlice";
import { useAppSelector } from "store/redux.hooks";

const VehicleWrapperView = () => {

  const { vehicleGraphDtoLoading, vehicleGraphDto } = useAppSelector((state: any) => state.fuel);

  return (
    <FuelView dbName="VehicleModel" pageTitle="Vehicle" tableLabel="Vehicle Model" handleGraphData= {vehicleGraphData} graphDto={vehicleGraphDto} graphDtoLoading={vehicleGraphDtoLoading} />
  );
};

export default VehicleWrapperView;
