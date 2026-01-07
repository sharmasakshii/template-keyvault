import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';
import { getlistOfCarriers, getCarriersMaterData, getEvFilterDates, getTotalTonMileData, getEvDataDownload, resetEvGraphsData } from "store/scopeThree/track/evDashboard/evDashboardSlice";
import moment from "moment";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAlternativeCountryList } from 'store/localFreight/localFreightSlice';
import { getConfigConstants } from 'store/sustain/sustainSlice';

/**
 * A custom hook that contains all the states and functions for the EV master
 */
const EvMasterController = () => {
    // Define and initialize all the necessary states
    const [showAll, setShowAll] = useState(false);
    const [startDate, setStartDate] = useState<any>()
    const [endDate, setEndDate] = useState<any>()
    const [selectedCarrier, setSelectedCarrier] = useState<any>([]);
    const [country, setCountry] = useState("")
    const [selectCarrierToNext, setSelectCarrierToNext] = useState("");
    const [isLcvView, setIsLcvView] = useState(false);
    const { isLoadingEvFilterDate, evFilterData, listOfCarriers, masterCarrierData, isLoadingMasterCarrierData, totalTonMileData, isLoadingTotalTonMileData, isLoadingDwonloadEvData } = useAppSelector((state) => state.evDashboard);
    const { isLoadingCountryList, countryListData } = useAppSelector((state) => state.localFreight);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const prevLcvView = useRef(isLcvView);
    const { configConstants } = useAppSelector((state: any) => state.sustain);
    const handleSetInitialDate = (filterDates: any) => {
        if (filterDates?.end_date) {
            const endDate = moment.utc(filterDates?.end_date);
            const calculatedStartDate = endDate.clone().subtract(30, "days");
            const startDateFromData = moment.utc(filterDates?.start_date);
            setStartDate(moment.max(calculatedStartDate, startDateFromData).format("YYYY-MM-DD"));
            setEndDate(endDate.format("YYYY-MM-DD"))
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(getAlternativeCountryList())
        dispatch(getConfigConstants({ region_id: "" }));
    }, [dispatch])

    useEffect(() => {
        handleSetInitialDate(evFilterData?.data)
    }, [evFilterData]);

    useEffect(() => {
        if (country !== undefined) {
            setSelectedCarrier([]);
            dispatch(resetEvGraphsData())
            dispatch(getEvFilterDates({ country: country, code: "" }))
            dispatch(getlistOfCarriers({
                country: country
            }));
        }
    }, [dispatch, country]);

    useEffect(() => {
        if (startDate && endDate && country !== undefined && selectedCarrier?.length > 0) {
            let payload = {
                start_date: moment(startDate).format("YYYY-MM-DD"),
                end_date: moment(endDate).format("YYYY-MM-DD"),
                selected_scacs: selectedCarrier?.map((res: any) => res?.scac),
                country_code: country
            }
            dispatch(
                getCarriersMaterData({ ...payload, is_lcv: isLcvView })
            );
            if (prevLcvView.current === isLcvView) {
                dispatch(getTotalTonMileData(payload));
            }
            prevLcvView.current = isLcvView;
        }
    }, [dispatch, startDate, endDate, country, selectedCarrier, isLcvView]);

    useEffect(() => {
        if (listOfCarriers?.data) {
            let list = listOfCarriers?.data?.filter((el: any) => el.scac_priority).map((res: any) => ({ ...res, value: res?.scac, label: res?.name }))
            setSelectedCarrier(list)
        }
    }, [listOfCarriers]);

    const handleCarrierChange = (scacCode: any) => {
        const list = selectedCarrier?.filter((res: any) => res?.scac !== scacCode)
        if (list?.length < 2) {
            toast.error("You must choose at least two carriers for comparison")
            return null
        }
        setSelectedCarrier(list)

    }

    const handleDownloadClick = () => {
        dispatch(getEvDataDownload({
            start_date: moment(startDate).format("YYYY-MM-DD"),
            end_date: moment(endDate).format("YYYY-MM-DD"),
            country_code: country
        }))
    }

    const handleToggleChange = (e: any) => {
        const checked = e.target.checked;
        setIsLcvView(checked);
    };

    const MAX_VISIBLE_CARRIERS = 7;
    const visibleCarriers = showAll ? selectedCarrier : selectedCarrier.slice(0, MAX_VISIBLE_CARRIERS);
    const hiddenCount = selectedCarrier.length - MAX_VISIBLE_CARRIERS;
    // Return all the states and functions

    return {
        evFilterData,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        selectedCarrier,
        listOfCarriers,
        handleCarrierChange,
        setSelectedCarrier,
        masterCarrierData,
        isLoadingMasterCarrierData,
        navigate,
        selectCarrierToNext,
        setSelectCarrierToNext,
        isLoadingEvFilterDate,
        totalTonMileData, isLoadingTotalTonMileData,
        handleDownloadClick,
        isLoadingDwonloadEvData,
        visibleCarriers,
        hiddenCount,
        showAll,
        setShowAll,
        isLoadingCountryList, countryListData,
        country, setCountry,
        configConstants,
        isLcvView,
        handleToggleChange
    };
};

export default EvMasterController;