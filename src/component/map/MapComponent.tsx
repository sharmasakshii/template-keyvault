import CustomModal from 'component/DailogBox/CustomModal'
import ButtonComponent from 'component/forms/button'
import Spinner from 'component/spinner';

const MapComponent = ({ showFullScreen, isLoading = false, setShowFullScreen, isFullScreen = false, children, containerClass = "", modalClass = "bioFuel-map" }: any) => {
    return (
        <div className='position-relative'>
            {isLoading ? (
                <div className='position-relative'>
                    <Spinner spinnerClass='justify-content-center spinner' />
                </div>
            ) : (
                <>
                    <div className={containerClass}>
                        {children}
                        {isFullScreen && <ButtonComponent imagePath={showFullScreen ? "/images/exitFullScreen.svg" : "/images/fullScreen.svg"} onClick={() => setShowFullScreen(!showFullScreen)} btnClass="mapbtn-screen" />}
                    </div>
                    {
                        isFullScreen &&
                        <CustomModal show={showFullScreen} handleClose={() => setShowFullScreen(false)} modalClass={modalClass}>
                            {children}
                            {isFullScreen && <ButtonComponent imagePath={showFullScreen ? "/images/exitFullScreen.svg" : "/images/fullScreen.svg"} onClick={() => setShowFullScreen(!showFullScreen)} btnClass="mapbtn-screen" />}
                        </CustomModal>
                    }
                </>
            )}
        </div >
    )

}

export default MapComponent