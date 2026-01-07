import React from 'react'
import FuelView from './FuelView'
import { useAppSelector } from 'store/redux.hooks';
import { fuelGraphData } from 'store/fuel/fuelSlice';

const FuelWrapperView = () => {

    const { fuelGraphDto, fuelGraphDtoLoading } = useAppSelector((state: any) => state.fuel);

    return (
        <FuelView dbName="FuelType" pageTitle="Fuel" tableLabel="Fuel"  handleGraphData= {fuelGraphData} graphDto={fuelGraphDto} graphDtoLoading={fuelGraphDtoLoading} />
    )
}

export default FuelWrapperView