// Import necessary modules and functions from external files

import { useEffect, useState } from "react";
import { getLaneRangeOptions, getUpdateRangeSelections } from "store/scopeThree/track/lane/laneDetailsSlice";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import { getConfigConstants } from "store/sustain/sustainSlice";
import { getBoolean, isCompanyEnable } from "utils";
import { companySlug } from "constant";

/**
 * A custom hook that contains all the states and functions for the LocalFreightController
 */

type FuelType =
    | 'bio_100'
    | 'bio_1_20'
    | 'rd'
    | 'rng'
    | 'hvo'
    | 'optimus'
    | 'hydrogen'
    | 'b99'
    | 'ev';
const LaneSettingController = () => {

    const [selectedFuelRadius, setSelectedFuelRadius] = useState<{ [key: string]: any }>({})

    const dispatch = useAppDispatch()
    const { isLaneRangeLoading, laneRangeData } = useAppSelector((state: any) => state.lane)
    const { loginDetails } = useAppSelector((state) => state.auth)
    const { configConstants, configConstantsIsLoading } = useAppSelector((state: any) => state.sustain);
  
    const handleChange = (fuelType: string, radius: number) => {
        setSelectedFuelRadius((prevSelectedFuelRadius) => ({
            ...prevSelectedFuelRadius,
            [fuelType]: radius,
        }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        dispatch(getUpdateRangeSelections(selectedFuelRadius))
    }

    useEffect(() => {
        dispatch(getLaneRangeOptions())
        dispatch(getConfigConstants({ region_id: "" }));
    }, [dispatch])

    useEffect(() => {
        if (configConstants && laneRangeData) {
            let selectedValues: { [key: string]: any } = {};
            for (let fuelType in laneRangeData?.data) {
                if (fuelType) {
                    selectedValues[fuelType] = configConstants?.data[fuelType + "_radius"];
                }
            }
            setSelectedFuelRadius(selectedValues);
        }
    }, [configConstants, laneRangeData]);

    const initialChecks: Record<FuelType, number> = {
        bio_100: getBoolean(
            isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo, companySlug?.rb])
        ),

        bio_1_20: getBoolean(
            (
                // bio_1_20 is allowed for all companies with permission
                true
            )
        ),

        rd: getBoolean(
            isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo, companySlug?.rb])
        ),

        rng: getBoolean(
            isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo, companySlug?.rb])
        ),

        hvo: getBoolean(
            isCompanyEnable(loginDetails?.data, [companySlug?.pep])
        ),

        optimus: getBoolean(
            isCompanyEnable(loginDetails?.data, [companySlug?.pep])
        ),

        hydrogen: getBoolean(
            isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo])
        ),

        ev: getBoolean(
            !companySlug?.rb // show EV only if not `rb`
        ),
        b99: getBoolean(
            isCompanyEnable(loginDetails?.data, [companySlug?.demo])
        )
    };
    const fuelList: FuelType[] = Object.keys(initialChecks).filter(
        (fuel): fuel is FuelType => initialChecks[fuel as FuelType] && laneRangeData?.data?.[fuel as FuelType]
    );

    // Return all the states and functions
    return {
        loginDetails,
        isLaneRangeLoading,
        configConstantsIsLoading,
        laneRangeData,
        selectedFuelRadius,
        handleChange,
        handleSubmit,
        fuelList
    };
};

export default LaneSettingController;
