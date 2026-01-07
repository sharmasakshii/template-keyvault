import styles from '../../scss/config/_variable.module.scss';
import ImageComponent from "../../component/images";
import { Range, getTrackBackground } from "react-range";
import DateFilter from "component/forms/dateFilter";
import RegionFilter from 'component/forms/regionFilter';
import { t } from 'i18next';
import { setDivisionId } from 'store/auth/authDataSlice';

/**
 *
 * @returns Carrier Table Filters
 */

const VendorTableFilter = ({
    isLoadingVendorTableDetails,
    regionalLevel,
    yearlyData,
    quarterDetails,
    handleRegionSelect,
    rangeValues,
    handleFinalRangeChange,
    handleChangeRange,
    searchCarrier,
    handleSearchCarrier,
    vendorTableFilterId,
    configConstants,
    pId,
    setPId,
    weekId,
    setWeekId,
    setQuarterDetails,
    setYearlyData,
    divisionOptions,
    divisionLevel,
    setDivisionLevel,
    dispatch,
    regionOption
}: any) => {

    const STEP = 1;
    const MIN = Math.trunc(configConstants?.data?.MIN_CARRIER_INTENSITY || 0);
    const MAX = Math.trunc(configConstants?.data?.MAX_CARRIER_INTENSITY || 0) + 1;
    const rtl = false;
    return (
        <div className="select-box filters p-3 my-3 pb-5" data-testid={vendorTableFilterId}>
            <div className=" d-flex flex-wrap gap-2 align-items-center filters-inner">
                {/* Dropdown for selecting regional level */}
                <RegionFilter
                    isDisabled={isLoadingVendorTableDetails}
                    regionAriaLabel="regions-data-dropdown"
                    regionOption={regionOption}
                    divisionOptions={divisionOptions}
                    regionalLevel={regionalLevel}
                    divisionLevel={divisionLevel}
                    handleChangeDivision={(e: any) => {
                        setDivisionLevel(e.value)
                        dispatch(setDivisionId(e.value))
                        handleRegionSelect("")
                    }}
                    handleChangeRegion={(e: any) => handleRegionSelect(e.value)}
                />
                {/* Dropdown for selecting yearly data */}

                <DateFilter
                    yearDropDownId="year-dropdown"
                    quarterDropDownId="quarter-dropdown"
                    isLoading={isLoadingVendorTableDetails}
                    yearlyId={yearlyData}
                    quarterId={quarterDetails}
                    pId={pId}
                    setPId={setPId}
                    weekId={weekId}
                    setWeekId={setWeekId}
                    updateYear={(e: any) => {
                        setYearlyData(e.value)
                        setQuarterDetails(0)
                        setPId(0)
                        setWeekId(0)
                    }}
                    updateQuarter={(e: any) => {
                        setQuarterDetails(e.value)
                        setPId(0)
                        setWeekId(0)
                    }}
                />
            </div>
            <div className='d-flex flex-wrap justify-content-between align-items-center mt-3'>
                <div className="d-flex flex-xxl-row flex-wrap align-items-center justify-content-center gap-2 gap-xxl-4 mb-lg-0 mb-5">
                    <h6 className="mb-0 color-primary font-14 fw-semibold pe-2">
                        {t('emissionRangeSliderTitle')}
                    </h6>
                    <div data-testid="range-selector">
                        {(configConstants?.data?.MIN_CARRIER_INTENSITY && rangeValues) &&
                            <Range
                                values={rangeValues}
                                step={STEP}
                                min={MIN}
                                max={MAX}
                                rtl={rtl}
                                onChange={(range) => handleChangeRange(range)}
                                onFinalChange={handleFinalRangeChange}
                                renderTrack={({ props, children }) => (
                                    <button
                                        onMouseDown={props.onMouseDown}
                                        onTouchStart={props.onTouchStart}
                                        style={{
                                            ...props.style,
                                            height: "36px",
                                            display: "flex",
                                            width: "250px",
                                            maxWidth: "350px",
                                        }}
                                        className='range-slider-wrapper bg-transparent border-0'
                                    >
                                        <div
                                            ref={props.ref}
                                            style={{
                                                height: "8px",
                                                width: "100%",
                                                borderRadius: "4px",
                                                background: getTrackBackground({
                                                    values: rangeValues,
                                                    colors: [(styles.silver), (styles.primary), (styles.silver)],
                                                    min: MIN,
                                                    max: MAX,
                                                    rtl,
                                                }),
                                                alignSelf: "center",
                                            }}
                                            data-testid="range-track"
                                        >
                                            {children}
                                        </div>
                                    </button>
                                )}
                                renderThumb={({ index, props, isDragged }) => (
                                    <div className='range-thumb-outer'
                                        {...props}
                                        style={{
                                            ...props.style,
                                            height: "35px",
                                            width: "35px",
                                            borderRadius: "50px",
                                            backgroundColor: (styles.primary),
                                            border: "transparent",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                        data-testid="thumb"
                                    >
                                        <div className='range-thumb-inner'
                                            style={{
                                                position: "absolute",
                                                top: "0px",
                                                color: (styles.white),
                                                fontWeight: "bold",
                                                fontSize: "12px",
                                                fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                                                padding: "4px",
                                                height: "40px",
                                                width: "40px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                borderRadius: "50px",
                                                backgroundColor: (styles.primary),
                                            }}
                                        >

                                        </div>

                                        <div className="tooltip-range">
                                            <p className="mb-0 font-12 fw-medium">{rangeValues[index]?.toFixed(1)}</p>
                                            <span></span>
                                        </div>
                                    </div>
                                )}
                            />}
                    </div>
                </div>
                <div className="search-carrier">
                    <div className="position-relative">
                        <span>
                            <ImageComponent path="/images/search.svg" className='search-img' />
                        </span>
                        <input
                            type="text"
                            data-testid="vendor-table-search-filter"
                            placeholder="Search Carrier Name"
                            value={searchCarrier}
                            onChange={handleSearchCarrier}
                            className="font-14"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorTableFilter;
