import SelectDropdown from "../../component/forms/dropdown";
import { monthOption, typeOptionListDto } from "constant";
import { countryListDto, getDropDownOptions } from 'utils';
import { emissionReportFilters } from 'store/scopeThree/track/emissionSaveReport/emissionSavedSlice';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';

interface CountryFilterProps {
    country: any;
    year: any;
    month: any;
    handleUpdateCountry: (val: any) => void;
    handleUpdateyear: (val: any) => void;
    handleUpdateMonth: (val: any) => void;
    schneider?: boolean;
    tblSlug?: string;
    handleUpdateType?: (val: any) => void;
    type?: string;
}

const CountryFilter = ({
    country,
    year,
    month,
    handleUpdateCountry,
    handleUpdateyear,
    handleUpdateMonth,
    tblSlug = 'SFB',
    schneider = false,
    handleUpdateType,
    type
}: CountryFilterProps) => {
    const dispatch = useAppDispatch();

    const { isLoadingFilters, emissionSavedFilters } = useAppSelector((state) => state.emissionSaved);

    useEffect(() => {
        dispatch(emissionReportFilters({
            "country": country?.value,
            "year": year?.value,
            tblSlug: tblSlug
        }))
    }, [dispatch, country?.value, year?.value, tblSlug]);
    const selectedMonthValues = new Set(emissionSavedFilters?.data?.monthData?.map((m: any) => m.month));
    selectedMonthValues.add(0);
    return (
        <div className="d-flex gap-2">
            {/* Country */}
            {!schneider && <SelectDropdown
                aria-label="country-dropdown"
                placeholder="Select Country"
                customClass="ms-0 mt-2 mt-lg-0 searchdropdown text-capitalize"
                selectedValue={country}
                onChange={(e: any) => {
                    handleUpdateCountry(e);
                }}
                disabled={isLoadingFilters}
                options={countryListDto(emissionSavedFilters?.data?.countryData)}
            />}

            {/* Year */}
            <SelectDropdown
                aria-label="year-dropdown"
                placeholder="Year"
                selectedValue={year}
                onChange={(e: any) => {
                    handleUpdateyear(e);
                }}
                disabled={isLoadingFilters}
                options={getDropDownOptions(
                    emissionSavedFilters?.data?.yearData,
                    "year",
                    "year",
                    "",
                    "",
                    false
                )}
            />

            {/* Month */}
            <SelectDropdown
                aria-label="month-dropdown"
                placeholder="Month"
                selectedValue={month}
                onChange={(e: any) => {
                    handleUpdateMonth(e);
                }}
                disabled={isLoadingFilters}
                options={monthOption?.filter((el: any) =>
                    selectedMonthValues?.has(el.value)
                )}
            />
            {schneider &&
                <SelectDropdown
                    aria-label="type-dropdown"
                    options={typeOptionListDto}
                    placeholder="Type"
                    selectedValue={(typeOptionListDto?.filter((el: any) => el.value === type))}
                    onChange={((e: any) => {
                        handleUpdateType?.(e);
                    })}
                />
            }
        </div>
    );
};

export default CountryFilter;
