import Heading from 'component/heading';
import TitleComponent from 'component/tittle';
import ImageComponent from 'component/images';
import OptimusController from './optimusController';
import Pagination from 'component/pagination';
import OptimusMap from 'component/map/OptimusMap';
import MapComponent from 'component/map/MapComponent';
import SearchODPair from 'component/forms/searchODpair/SearchODPair';
import { Provider } from 'constant';
import MapTable from 'component/MapTable';

const OptimusView = () => {

    const {
        selectedLane,
        optimusLanesData,
        optimusLanesLoading,
        optimusCordinatesData,
        pageNumber,
        setPageNumber,
        setPageSize,
        pageSize,
        myRef,
        handleViewLane,
        showFullScreen,
        setShowFullScreen,
        handleGetOptimusLanes,
        resetOptimus,
        handleChangeLocation,
        childRef,
        configConstants,
        optimusCordinatesLoading,
        activeLane,
        handleBlur,
        handleThresholdChange,
        isCheckLaneFuelLoading,
        optimusLaneListDto
    } = OptimusController();
    return (
        <>
            <TitleComponent title={"Optimus"} pageHeading="Optimus Network" />
            <section className="optimusScreen p-2" data-testid="OptimusView">
                <div className='mainGrayCards pb-3 px-0' >
                    <div className='border-bottom p-3 d-flex gap-2 flex-wrap align-items-center justify-content-between'>
                        <Heading
                            level="3"
                            content="Optimus Locations"
                            className="font-16 font-xl-20 font-xxl-24 mb-0 fw-semibold"
                        />
                        <div className='d-flex align-items-center gap-3'>
                            <ImageComponent path="/images/optimusLogo.svg" className="pe-0" />
                        </div>
                    </div>
                    <div className='d-flex flex-wrap align-items-center gap-2 justify-content-between'>
                        <SearchODPair
                            ref={childRef}
                            handleChangeLocation={handleChangeLocation}
                            handleGetSearchData={() => { }}
                            handleResetODpair={resetOptimus}
                            page="optimus"
                            odParams={{ ev_radius: configConstants?.data?.optimus_radius, provider_id: Provider.optimus }}
                        />
                        <Heading level="3" className="font-xxl-16 font-14 fw-semibold px-3">Optimus Fuel Radius: {configConstants?.data?.optimus_radius} {""}
                            {configConstants?.data?.default_distance_unit === "miles" ? "Mile" : "Kms"}
                        </Heading>
                    </div>
                    <MapTable
                        isLoading={optimusLanesLoading}
                        mapList={optimusLaneListDto}
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
                        pageSelectDisabled={optimusLanesLoading}
                        handlePageSizeChange={(e: any) => { handleGetOptimusLanes(1, e?.value); setPageSize(e); setPageNumber(1) }}
                        total={optimusLanesData?.data?.pagination?.total}
                        handlePageChange={(e: any) => { handleGetOptimusLanes(e, pageSize?.value); setPageNumber(e); }}
                    />
                    <div ref={myRef} className='mt-4 px-2 optimus-map'>
                        {selectedLane &&
                            <MapComponent isLoading={optimusCordinatesLoading} showFullScreen={showFullScreen} setShowFullScreen={setShowFullScreen} isFullScreen={true}>
                                <OptimusMap
                                    reloadData={false}
                                    laneData={optimusCordinatesData?.data}
                                />
                            </MapComponent>
                        }
                    </div>
                </div>
            </section>
        </>
    );
};

export default OptimusView;