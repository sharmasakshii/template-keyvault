import TableBodyLoad from 'component/tableBodyHandle';
import { distanceConverter, formatNumber } from 'utils';
import ButtonComponent from 'component/forms/button';
import { Spinner } from "reactstrap";
import InputField from 'component/forms/input';
import ImageComponent from "component/images"

const MapTable = (props: any) => {
    const {
        isLoading,
        mapList,
        selectedLane,
        configConstants,
        handleViewLane,
        activeLane,
        handleBlur,
        handleThresholdChange,
        isCheckLaneFuelLoading
    } = props
    return (
        <div className='static-table mb-4'>
            <table>
                <thead>
                    <tr>
                        <th>
                            Origin
                        </th>
                        <th>
                            Destination
                        </th>
                        <th>
                            Distance<span className='fw-normal ps-1'>
                                ({`${configConstants?.data?.default_distance_unit === "miles" ? "Miles" : "Kms"}`})
                            </span>
                        </th>
                        <th>
                            <div className="pointer">
                                Threshold Distance
                                <div className='d-flex align-items-center'>
                                    <span className="fw-normal ps-1">(Miles)</span>
                                </div>
                            </div>
                        </th>
                        <th>
                            Action
                        </th>
                    </tr>
                </thead>
                <TableBodyLoad colSpan={5} isLoading={isLoading} isData={mapList?.length > 0}>
                    <tbody>
                        {mapList?.map((item: any, index: number) => (
                            <tr data-testid={`map-table-row-${index}`} key={item?.id} className={selectedLane?.id === item.id ? 'activeRow' : ''} onClick={() => handleViewLane(item)}>
                                <td>
                                    {item?.origin}
                                </td>
                                <td>
                                    {item?.destination}
                                </td>
                                <td>
                                    {formatNumber(
                                        true,
                                        distanceConverter(item?.distance, configConstants?.data?.default_distance_unit),
                                        2
                                    )}
                                </td>
                                <td className="customWidth">
                                    {(activeLane === item?.id && isCheckLaneFuelLoading) ? (
                                        <div className="d-flex justify-content-center align-items-center" style={{ height: '38px' }}>
                                            <Spinner />
                                        </div>
                                    ) : (<div className="d-flex gap-1 align-items-center">
                                        <InputField
                                            testid={`threshold-input-${index}`}
                                            type="text"
                                            name="text"
                                            placeholder=""
                                            value={item?.thresholdDistance || ""}
                                            onClick={(e: React.ChangeEvent<HTMLInputElement>) => e.stopPropagation()}
                                            onFocus={(e: React.ChangeEvent<HTMLInputElement>) => e.stopPropagation()}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleThresholdChange(e, item?.id)}
                                            onBlur={() => {
                                                handleBlur(item);
                                            }}
                                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleBlur(item);
                                                }
                                            }}
                                        />
                                        <div >
                                            {item?.isChecked !== "" && (
                                                <ImageComponent
                                                    path={item?.isChecked === 1 ? "/images/filled-tick.svg" : "/images/filled-cross.svg"}
                                                    className="pe-0"
                                                />
                                            )}

                                        </div>
                                    </div>
                                    )}
                                </td>

                                <td>
                                    <div className='d-flex align-items-center gap-2 cursor'>
                                        <ButtonComponent
                                            imagePath="/images/mapView.svg"
                                            text="View"
                                            btnClass='d-flex align-items-center border-0 viewmap-btn'
                                            data-testid={`view-map-${index}`}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </TableBodyLoad>
            </table>
        </div>
    )
}

export default MapTable