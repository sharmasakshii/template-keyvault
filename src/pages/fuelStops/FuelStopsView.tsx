import TitleComponent from 'component/tittle'
import MultiSelect from 'component/forms/multiSelect/MultiSelect';
import MapComponent from 'component/map/MapComponent';
import FuelStopsController from './fuelStopsController';
import FuelStopMap from 'component/map/FuelStopMap';

const FuelStopsView = () => {
    const {
        showFullScreen,
        setShowFullScreen,
        myRef,
        isLoadingFuelStopProvider,
        fuelProviderListData,
        selectedProvider, setSelectedProvider,
        isLoadingFuelStopData,
        fuelListData
    } = FuelStopsController();

    const mapStyles = {
        height: !showFullScreen ? "450px" : '100vh',
        width: '100%',
    };

    return (
        <>
            <TitleComponent title="Fuel Locations" pageHeading="Fuel Locations" />
            <section className='fuelStops-screen p-2'>
                <div data-testid="fuel-stops" className="select-box d-flex border-bottom pb-3 mb-3">
                    <MultiSelect
                        key="example_id"
                        menuPlacement={"bottom"}
                        options={fuelProviderListData?.data?.map((res: any) => ({ value: res?.id, label: res.name }))}
                        onChange={(selected: any) => setSelectedProvider(selected)}
                        selectedOptions={selectedProvider}
                        isClearable={false}
                        disableClear={true}
                        className={"selectFuel-dropdown"}
                        clearMessage="Fuel Type"
                        placeHolder="Fuel Type"
                    />
                </div>

                <div ref={myRef} className='mb-0 map-outer'>
                    <MapComponent isLoading={isLoadingFuelStopProvider || isLoadingFuelStopData} showFullScreen={showFullScreen} setShowFullScreen={setShowFullScreen} isFullScreen={true}>
                        <FuelStopMap page="fuelStop" containerStyle={mapStyles} fuelStopData={fuelListData?.data} />
                    </MapComponent>
                </div>

            </section>
        </>
    )
}

export default FuelStopsView