import SearchODPair from "component/forms/searchODpair/SearchODPair";
import Heading from 'component/heading';
import MapComponent from "component/map/MapComponent";
import OptimusMap from 'component/map/OptimusMap';
import Pagination from "component/pagination";
import TitleComponent from 'component/tittle';
import EvController from "./evController";
import { Provider } from 'constant';
import MapTable from 'component/MapTable';
import FuelStopMap from 'component/map/FuelStopMap';

const EvView = () => {
    const {
        evLocationLoading,
        evLocationDto,
        showFullScreen,
        setShowFullScreen,
        showLaneFullScreen,
        setShowLaneFullScreen,
        pageNumber,
        myRef,
        handleChangeLocation,
        evNetworkLanesData,
        evNetworkLanesLoading,
        optimusCordinatesData,
        setPageNumber,
        setPageSize,
        pageSize,
        resetEvNetwork,
        selectedLane,
        handleViewLane,
        childRef,
        configConstants,
        optimusCordinatesLoading,
        activeLane,
        handleBlur,
        handleThresholdChange,
        isCheckLaneFuelLoading,
        evLaneListDto
    } = EvController();

    const mapStyles = {
        height: !showFullScreen ? "450px" : '100vh',
        width: '100%',
    };

    return <><TitleComponent title={"Pepsi EV Network"} pageHeading={'Pepsi EV Network'} />
        <section className="evdahboard optimusScreen px-2" data-testid="evView">
            <div className='mainGrayCards mb-4 pb-3 text-start'>
                <div className='border-bottom p-3 d-flex gap-2 flex-wrap align-items-center justify-content-between'>
                    <Heading level="4"
                        content="Pepsi EV Locations"
                        className="font-20 fw-semibold mb-0"
                    />
                </div>
                <div className='d-flex flex-wrap align-items-center gap-2 justify-content-between'>
                    <SearchODPair
                        ref={childRef}
                        handleChangeLocation={handleChangeLocation}
                        handleGetSearchData={() => { }}
                        handleResetODpair={resetEvNetwork}
                        page="optimus"
                        isDisabled={!configConstants?.data?.ev_radius}
                        odParams={{ ev_radius: configConstants?.data?.ev_radius, provider_id: Provider.evNetwork }}
                    />
                    <Heading level="3" className="font-xxl-16 font-14 fw-semibold px-3">EV Stations Radius: {configConstants?.data?.ev_radius} {configConstants?.data?.default_distance_unit === "miles" ? "Mile" : "Kms"}</Heading>
                </div>
                <MapTable
                    isLoading={evNetworkLanesLoading}
                    mapList={evLaneListDto}
                    handleViewLane={handleViewLane}
                    selectedLane={selectedLane}
                    configConstants={configConstants}
                    activeLane={activeLane}
                    handleBlur={handleBlur}
                    handleThresholdChange={handleThresholdChange}
                    isCheckLaneFuelLoading={isCheckLaneFuelLoading}
                />
                <Pagination currentPage={pageNumber}
                    pageSize={pageSize}
                    pageSelectDisabled={evNetworkLanesLoading}
                    handlePageSizeChange={(e: any) => { setPageSize(e); setPageNumber(1) }}
                    total={evNetworkLanesData?.data?.pagination?.total}
                    handlePageChange={(e: any) => { setPageNumber(e); }}
                />
                <div ref={myRef} className='mt-4 p-3 ev-map-outer optimus-map'>
                    {selectedLane &&
                        <MapComponent isLoading={optimusCordinatesLoading} showFullScreen={showLaneFullScreen} setShowFullScreen={setShowLaneFullScreen} isFullScreen={true}>
                            <OptimusMap
                                laneData={optimusCordinatesData?.data}
                            />
                        </MapComponent>
                    }
                </div>
                <div className=" p-3 ev-map-outer optimus-map">
                    <Heading level="4"
                        content="Pepsi EV Network"
                        className="font-20 fw-semibold mb-2"
                    />
                    <MapComponent isLoading={evLocationLoading} showFullScreen={showFullScreen} setShowFullScreen={setShowFullScreen} isFullScreen={true}>
                        <FuelStopMap page="ev" containerStyle={mapStyles} fuelStopData={evLocationDto?.data} />
                    </MapComponent>
                </div>
            </div>
        </section>
    </>;

};

export default EvView;
