import { useAppSelector, useAppDispatch } from "store/redux.hooks";
import { checkRolePermission, isCompanyEnable } from 'utils';
import SelectDropdown from "../dropdown";
import { companySlug } from 'constant';
import { getDivisionList } from "store/commonData/commonSlice";
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';

const RegionFilter = ({ isDisabled = false, divisionLevel, regionAriaLabel = "region-dropdown", divisionOptions = [], regionOption = [], regionalLevel = "", handleChangeDivision, handleChangeRegion }: any) => {
  const dispatch = useAppDispatch();

  const { loginDetails } = useAppSelector((state: any) => state.auth)

  useEffect(() => {
    if (isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo])) {
      dispatch(getDivisionList())
    }
  }, [dispatch, loginDetails])
  const { t } = useTranslation()
  return (
    <>
      {!checkRolePermission(loginDetails?.data, "divisionManager") && isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo]) &&
        <SelectDropdown
          aria-label="divison-dropdown"
          disabled={isDisabled}
          options={divisionOptions}
          placeholder={t('division')}
          selectedValue={divisionOptions?.filter(
            (el: any) => el.value === divisionLevel?.toString()
          )}
          onChange={handleChangeDivision}
        />
      }
      {!checkRolePermission(loginDetails?.data, "regionalManager") && <SelectDropdown
        aria-label={regionAriaLabel}
        disabled={isDisabled}
        options={regionOption}
        placeholder={t('region')}
        selectedValue={regionOption?.filter(
          (el: any) => el.value === regionalLevel?.toString()
        )}
        onChange={handleChangeRegion}
      />}
    </>
  )
}

export default RegionFilter