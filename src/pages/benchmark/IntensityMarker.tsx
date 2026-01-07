
interface MarkerProps {
    isLoading?: boolean;
  }

const IntensityMarker = ({isLoading}:MarkerProps) => {
    if(!isLoading){ return (<div className="intensity-list mt-3 mt-sm-0">
            <ul>
                <li>
                    <p>
                        <span className="table-box"></span>High Emissions Intensity
                    </p>
                </li>
                <li>
                    <p>
                        <span className="table-box green-box ms-sm-4"></span>Low Emissions Intensity
                    </p>
                </li>
            </ul>
        </div>)
    }else{
        return <div></div>
    }
}

IntensityMarker.defaultProps = {
    isLoading:false
}

export default IntensityMarker