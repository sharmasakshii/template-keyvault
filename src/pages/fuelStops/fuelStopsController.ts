// Import necessary modules and functions from external files
import { useState, useRef, useEffect } from 'react';
import { getFuelStopProviderList, getFuelStopsList } from 'store/fuelStops/fuelStopSlice';
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';

const FuelStopsController = () => {
    // Define dispatch and navigate functions
    const [showFullScreen, setShowFullScreen] = useState(false)
    const [selectedProvider, setSelectedProvider] = useState<any>([])
    const myRef = useRef<any>(null)

    const dispatch = useAppDispatch()
    const {isLoadingFuelStopProvider, fuelProviderListData, isLoadingFuelStopData,
        fuelListData} = useAppSelector((state)=>state.fuelStops)

    useEffect(()=>{
        dispatch(getFuelStopProviderList())
    },[dispatch])

    useEffect(()=>{
        if(fuelProviderListData?.data.length>0){
            let fuelStop =  fuelProviderListData?.data?.find((el:any)=> el.code === "RD")
            setSelectedProvider([{ value: fuelStop?.id, label: fuelStop?.name }])
        }
    },[fuelProviderListData])

    useEffect(()=>{
        dispatch(getFuelStopsList({productTypeIds: selectedProvider?.map((el:any)=>el.value)}))
    },[dispatch, selectedProvider])

    return {
        myRef,
        showFullScreen, 
        setShowFullScreen,
        isLoadingFuelStopProvider, fuelProviderListData,
        selectedProvider, setSelectedProvider,
        isLoadingFuelStopData,
        fuelListData
    };
};

export default FuelStopsController;
