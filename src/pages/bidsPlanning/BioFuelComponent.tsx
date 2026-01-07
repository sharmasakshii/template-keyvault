import Heading from 'component/heading'
import ImageComponent from 'component/images'
import BioFuelMap from "component/map/BioFuelMap"
import MapComponent from 'component/map/MapComponent'
import { useState } from 'react'

const BioFuelComponent = (props: any) => {
    const { bioFuelDto, resFuel } = props
    const [showFullScreen, setShowFullScreen] = useState(false)

    return (
        <div className='biofuel-wrapper p-2'>
            <div>
                <Heading level="5" content="Lane" className="font-xxl-14 font-12 fw-normal" />
                <Heading level="5" content={bioFuelDto?.lane_name.split("_").join(" to ")} className="font-xxl-16 font-14 fw-semibold laneName mb-3" />
                <div className='d-flex gap-2 mb-2'>
                    <ImageComponent path="/images/fuelNew.svg" alt="files" className='pe-0' />
                   
                    <Heading level="5" content={resFuel?.[bioFuelDto?.lane_name]?.fuel_stop_type?.split(",").join(", ")} className="font-xxl-18 font-14 fw-semibold laneName mb-0" />
                </div>
                <Heading level="5" content="Fuel Availability" className="font-xxl-14 font-12 fw-normal" />
            </div>
            <MapComponent showFullScreen={showFullScreen} setShowFullScreen={setShowFullScreen} isFullScreen={true} containerClass="outputMap">
                <BioFuelMap laneName={bioFuelDto?.lane_name}
                    fuelStops={resFuel?.[bioFuelDto?.lane_name]?.fuel_stops}
                    locations={resFuel?.[bioFuelDto?.lane_name]?.locations || []}
                    showFullScreen={showFullScreen}
                    zoom={showFullScreen ? 5 : 3} strokeWeight={showFullScreen ? 4 : 2} scaledSize={showFullScreen ? 40 : 20}
                />
            </MapComponent>
        </div>
    )
}

export default BioFuelComponent