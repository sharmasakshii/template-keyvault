import SelectDropdown from "component/forms/dropdown";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import { getQuarterOptions, getYearOptions, isCompanyEnable } from "utils"; // Importing from a constant file
import { companySlug } from "constant";
import { useEffect, useState } from "react";
import { getTimePeriod } from "store/commonData/commonSlice";
import { useLocation } from "react-router-dom";

const DateFilter = ({
  dateType = "emission_dates",
  isLoading,
  yearlyId,
  quarterId,
  pId = 0,
  setPId,
  setCurrentPage,
  setPageSize,
  updateYear,
  updateQuarter,
  yearDropDownId = "year-dropdown",
  quarterDropDownId = "quarter-dropdown",
  weekId = 0,
  setWeekId,
  isWeekDropdownShow = true,
}: any) => {
  const dispatch = useAppDispatch();

  const [yearOption, setYearOption] = useState<any>([]);
  const [quarterOption, setQuarterOption] = useState<any>([]);
  const [pOption, setPOption] = useState<any>([]);
  const [periodWeekOption, setPeriodWeekOption] = useState<any>([]);
  const location = useLocation()
  const parts = location?.pathname.split("/").filter(Boolean)

  const lastPart = parts[parts.length - 1]

  const { emissionDates, timePeriodList, isLoadingFilterDates } =
    useAppSelector((state: any) => state.commonData);
  const { loginDetails } = useAppSelector((state: any) => state.auth);

  const isPepsiEnable = isCompanyEnable(loginDetails?.data, [companySlug?.pep]);
  const isBrambleEnable = isCompanyEnable(loginDetails?.data, [companySlug?.bmb]);
  // Options for selectors

  useEffect(() => {
    setYearOption(getYearOptions(emissionDates?.data?.[dateType], isBrambleEnable, dateType, lastPart));
  }, [emissionDates, dateType, isBrambleEnable, lastPart]);

  useEffect(() => {
    if (!(isPepsiEnable || isBrambleEnable) || !isWeekDropdownShow) {
      setQuarterOption(getQuarterOptions(yearlyId));
    }
  }, [yearlyId, loginDetails?.data, isPepsiEnable, isBrambleEnable, isWeekDropdownShow]);

  useEffect(() => {
    if (isWeekDropdownShow && (isPepsiEnable || isBrambleEnable)) {
      setPOption([
        { value: 0, label: "All Periods" },
        ...(timePeriodList?.data?.map((el: any) => ({
          value: el?.id,
          label: el.name,
        })) || []),
      ]);
    }
  }, [timePeriodList, isWeekDropdownShow, isPepsiEnable, loginDetails, isBrambleEnable]);
  useEffect(() => {
    if (isWeekDropdownShow && (isPepsiEnable) && pId) {
      setPeriodWeekOption([
        { value: 0, label: "All Weeks" },
        ...(timePeriodList?.data
          .find((p: any) => p.id === Number(pId))
          ?.timeMappings?.map((el: any) => ({
            value: el.id,
            label: el.name,
          })) || []),
      ]);
    }
  }, [pId, timePeriodList, isWeekDropdownShow, isPepsiEnable, loginDetails]);

  useEffect(() => {
    if (isWeekDropdownShow && yearlyId && (isPepsiEnable || isBrambleEnable)) {
      dispatch(getTimePeriod({ year: yearlyId }));
    }
  }, [dispatch, yearlyId, loginDetails, isWeekDropdownShow, isPepsiEnable, isBrambleEnable]);

  return (
    <>
      <SelectDropdown
        disabled={isLoading || isLoadingFilterDates}
        aria-label={yearDropDownId}
        options={yearOption}
        placeholder="Year"
        customClass=" yearDropdown"
        selectedValue={yearOption?.filter((el: any) => el.value === yearlyId)}
        onChange={updateYear}
      />

      {/* Dropdown for selecting quarter details */}
      {(!(isPepsiEnable || isBrambleEnable) || !isWeekDropdownShow) && (
        <SelectDropdown
          disabled={isLoading}
          aria-label={quarterDropDownId}
          options={quarterOption}
          placeholder="Quarter"
          customClass="quarterDropdown"
          selectedValue={quarterOption?.filter(
            (el: any) => el.value === quarterId
          )}
          onChange={updateQuarter}
        />
      )}

      {/* Dropdown for selecting pId details */}
      {isWeekDropdownShow && yearlyId && (isPepsiEnable || isBrambleEnable) && (
        <SelectDropdown
          disabled={isLoading}
          aria-label="month-dropdown"
          options={pOption}
          placeholder="Time Period"
          customClass="quarterDropdown"
          selectedValue={pOption?.filter((el: any) => el.value === Number(pId))}
          onChange={(e: any) => {
            setPId(e.value);
            setWeekId(0);
            setCurrentPage(1);
            setPageSize({ label: 10, value: 10 });

          }}
        />
      )}

      {/* Dropdown for selecting pId details */}
      {isWeekDropdownShow && yearlyId && Number(pId) !== 0 && isPepsiEnable && (
        <SelectDropdown
          disabled={isLoading}
          aria-label="month-dropdown"
          options={periodWeekOption}
          placeholder="Time Period Week"
          customClass="quarterDropdown"
          selectedValue={periodWeekOption?.filter(
            (el: any) => el.value === Number(weekId)
          )}
          onChange={(e: any) => {
            setWeekId(e.value);
            setCurrentPage(1);
            setPageSize({ label: 10, value: 10 });
          }}
        />
      )}
    </>
  );
};

export default DateFilter;
