// Import necessary modules and functions from external files
import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';

import {
    getKeyMetricsAlternative,
    getListOfAllLanesByShipments,
    getLanesByFuelUsageAndMileage,
    getStackedGraphByLaneAndFuelTypeMileage,
    getStackedGraphByLaneAndFuelTypeQuantity,
    getStackedGraphByLaneAndFuelTypeEmission,
    getTotalEmissionGraphByLaneAndFuelType,
    getLaneStatistics,
    getAlternativeCarriers,
    isLoadingAlternativeDashboard,
    getAlternativeLaneFuelFilters,
    getAlternativeFuelTotalShipments,
    getAlternativeFuelsType,
    getAlternativeCountryList,
    getTotalEmissionsDataByCarrier,
    getMileageDataByCarrier,
    getSchneider
} from 'store/localFreight/localFreightSlice';
import { getYearOptions, getCurrentMonths, getOrder, normalizedList } from "utils";
import { getConfigConstants } from "store/sustain/sustainSlice";
import { toast } from 'react-toastify';
/**
 * A custom hook that contains all the states and functions for the LocalFreightController
 */
const AlternativeFuelController = () => {
    // Define dispatch and navigate functions
    const [showAll, setShowAll] = useState(false);
    const dispatch = useAppDispatch();
    const [laneName, setLaneName] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState({ label: 10, value: 10 })
    const [month, setMonth] = useState<any>(null);
    const [country, setCountry] = useState("")
    const [year, setYear] = useState<any>(null)
    const [showFullScreen, setShowFullScreen] = useState(false)
    const myRef = useRef<any>(null)
    const [currentShipmentPage, setCurrentShipmentPage] = useState(1)
    const [order, setOrder] = useState<string>("desc");
    const [colName, setColName] = useState<string>("emission");
    const [orderShipment, setOrderShipment] = useState<string>("desc");
    const [laneFuelType, setLaneFuelType] = useState<any>({});
    const [selectedCarrier, setSelectedCarrier] = useState<any>([]);
    const [fuelType, setFuelType] = useState<any>({ label: "All Fuel Types", value: "" });
    const [fuelTypeEmissions, setFuelTypeEmissions] = useState<any>({ label: "All Fuel Types", value: "" });
    const [fuelTypeMileage, setFuelTypeMileage] = useState<any>({ label: "All Fuel Types", value: "" });
    const [laneAccordion, setLaneAccordion] = useState(false);
    const [carrierAccordion, setCarrierAccordion] = useState(false);
    const [activeKey, setActiveKey] = useState(null);
    const [type, setType] = useState("");
    const [schneider, setSchneider] = useState(false);
    const { loginDetails } = useAppSelector((state: any) => state.auth);

    const {
        configConstants,
    } = useAppSelector((state: any) => state.sustain);
    // Get relevant data from Redux store using selector hooks
    const {
        isLoadingCountryList,
        countryListData,
        listOfAllLanesByShipmentsDtoLoading,
        listOfAllLanesByShipmentsDto,
        keyMetricsAlternativeDtoLoading,
        keyMetricsAlternativeDto,
        lanesByFuelUsageAndMileageDto,
        lanesByFuelUsageAndMileageDtoLoading,
        lanesByFuelStackeByEmissionsDto,
        lanesByFuelStackeByEmissionsDtoLoading,
        lanesByFuelStackeByQuantityDto,
        lanesByFuelStackeByQuantityDtoLoading,
        lanesByFuelStackeByMileageDto,
        lanesByFuelStackeByMileageDtoLoading,
        totalEmissionGraphByLaneAndFuelTypeLoading,
        totalEmissionGraphByLaneAndFuelType,
        isLoadinglaneStatistics,
        alternativeCarrierList,
        isLoadingAlternativeCarriers,
        alternativeFuelFiltersDto,
        alternativeFuelTotalShipmentsLoading,
        alternativeFuelTotalShipmentsDto,
        alternativeFuelListLoading,
        alternativeFuelListDto,
        isLoadingTotalEmissionsbyCarrierList,
        totalEmissionsbyCarrierListData,
        isLoadingMileagebyCarrierList,
        mileagebyCarrierListData,
        isLoadingSchneider,
        schneiderData

    } = useAppSelector((state) => state.localFreight);
    const { emissionSavedFilters } = useAppSelector((state) => state.emissionSaved);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(getAlternativeCountryList())
        dispatch(getConfigConstants({ region_id: "" }));
    }, [dispatch])

    useEffect(() => {
        if (configConstants) {
            setYear(Number.parseInt(configConstants?.data?.alternative_fuel_default_year));
            setMonth(Number.parseInt(configConstants?.data?.alternative_fuel_default_month))
        }
    }, [configConstants])

    useEffect(() => {
        setSelectedCarrier([]);
        resetFiltersAndPagination()
        dispatch(isLoadingAlternativeDashboard(true))
        dispatch(getAlternativeCarriers(country))
    }, [dispatch, country]);

    const handleChangeCarrier = (selected: any[]) => {
        if (selected.length < 1) {
            toast.error("You must choose at least one carrier for comparison");
            return;
        }

        const filteredCarrier = carrierList.filter((item1: any) =>
            selected.some((item2: any) => item1.value === item2.value)
        );
        setSelectedCarrier(filteredCarrier.map((res: any) => res?.scac));

        resetFiltersAndPagination();
    };
    useEffect(() => {
        if (schneider) {
            const data = {
                month: month,
                year: year,
                is_intermodal: type,
            }
            dispatch(getSchneider(data))
        }
    }, [dispatch, month, year, type, schneider])


    const handleCarrierChange = (scacCode: any) => {
        if (selectedCarrier.length <= 1) {
            toast.error("You must choose at least one carrier for comparison");
            return;
        }

        setSelectedCarrier(selectedCarrier.filter((res: any) => res !== scacCode));

        resetFiltersAndPagination();
    };

    const resetFiltersAndPagination = () => {
        setActiveKey(null);
        setCarrierAccordion(false);
        setLaneAccordion(false);
        setCurrentPage(1);
        setFuelType({ label: "All Fuel Types", value: "" });
        setFuelTypeEmissions({ label: "All Fuel Types", value: "" });
        setFuelTypeMileage({ label: "All Fuel Types", value: "" });
    };

    useEffect(() => {
        if (alternativeCarrierList?.data?.length > 0) {
            setSelectedCarrier(alternativeCarrierList?.data?.filter((dto: any) => dto?.scac_priority)?.map((res: any) => (res?.scac)))
        } else {
            dispatch(isLoadingAlternativeDashboard(false))
        }
    }, [alternativeCarrierList, dispatch]);


    // Effect to fetch data
    useEffect(() => {
        if (selectedCarrier?.length > 0) {
            dispatch(getKeyMetricsAlternative({
                country_code: country,
                month: month,
                year: year,
                carrier_scac: selectedCarrier
            }));

            dispatch(getAlternativeFuelsType({
                country_code: country,
                month: month,
                year: year,
                carrier_scac: selectedCarrier
            }))

            dispatch(getTotalEmissionGraphByLaneAndFuelType({
                country_code: country,
                month: month,
                year: year,
                carrier_scac: selectedCarrier
            }));
        }

    }, [dispatch, country, month, year, selectedCarrier]);

    useEffect(() => {
        if (selectedCarrier?.length > 0 && laneAccordion) {
            dispatch(getStackedGraphByLaneAndFuelTypeEmission({
                month: month,
                country_code: country,
                year: year,
                carrier_scac: selectedCarrier,
                column: 'emission'
            }));
            dispatch(getStackedGraphByLaneAndFuelTypeQuantity({
                country_code: country,
                month: month,
                year: year,
                carrier_scac: selectedCarrier,
                column: 'fuel_consumption'
            }));
            dispatch(getStackedGraphByLaneAndFuelTypeMileage({
                country_code: country,
                month: month,
                year: year,
                carrier_scac: selectedCarrier,
                column: 'fuel_mileage'
            }));
        }
    }, [dispatch, country, month, year, selectedCarrier, laneAccordion])

    useEffect(() => {
        if (selectedCarrier.length > 0 && carrierAccordion) {
            dispatch(getMileageDataByCarrier({
                country_code: country,
                month: month,
                year: year,
                carrier_scac: selectedCarrier,
                column: 'fuel_mileage',
                fuel_id: fuelTypeMileage?.value
            }));
        }
    }, [dispatch, country, month, year, selectedCarrier, fuelTypeMileage, carrierAccordion]);

    useEffect(() => {
        if (selectedCarrier.length > 0 && carrierAccordion) {
            dispatch(getAlternativeFuelTotalShipments({
                month: month,
                country_code: country,
                year: year,
                scac: selectedCarrier,
                fuel_id: fuelType?.value
            }));
        }
    }, [dispatch, country, month, year, selectedCarrier, fuelType, carrierAccordion]);

    useEffect(() => {
        if (selectedCarrier.length > 0 && carrierAccordion) {
            dispatch(getTotalEmissionsDataByCarrier({
                country_code: country,
                month: month,
                year: year,
                carrier_scac: selectedCarrier,
                column: 'emission',
                fuel_id: fuelTypeEmissions?.value
            }));
        }
    }, [dispatch, country, month, year, selectedCarrier, fuelTypeEmissions, carrierAccordion]);

    useEffect(() => {
        if (selectedCarrier?.length > 0) {
            dispatch(getListOfAllLanesByShipments({
                month: month,
                year: year,
                country_code: country,
                carrier_scac: selectedCarrier,
                "page_size": 7,
                "page": currentShipmentPage,
                "order_by": orderShipment,
            }));
        }
    }, [dispatch, country, month, year, orderShipment, currentShipmentPage, selectedCarrier]);

    useEffect(() => {
        if (alternativeFuelFiltersDto?.data?.length > 0) {
            setLaneFuelType(normalizedList(alternativeFuelFiltersDto?.data)?.reduce(
                (acc, item) => {
                    if (item?.id !== undefined) {
                        acc[item.id] = true;
                    }
                    return acc;
                },
                {} as Record<string | number, boolean>
            ))
        }
    }, [alternativeFuelFiltersDto])

    useEffect(() => {
        if (selectedCarrier?.length > 0) {
            dispatch(getAlternativeLaneFuelFilters({
                month: month,
                year: year,
                country_code: country,
                carrier_scac: selectedCarrier,
            }))
        }

    }, [dispatch, country, month, year, selectedCarrier])



    const getLaneName = (dto: any) => {
        setLaneName({
            origin: dto?.lane_name?.split("_")[0],
            destination: dto?.lane_name?.split("_")[1],
            source: `${dto?.lane_name}_${dto?.fuel_type}`,
            dto: dto
        })
        dispatch(getLaneStatistics({
            month: month,
            year: year,
            lane_name: dto?.lane_name,
            carrier_scac: selectedCarrier || []
        }))
    }

    const handlePageChange = (e: any) => {
        setPageSize(e);
        setCurrentPage(1);
    };

    useEffect(() => {
        if (selectedCarrier?.length > 0 && alternativeFuelFiltersDto?.data) {
            dispatch(getLanesByFuelUsageAndMileage({
                page: currentPage,
                page_size: pageSize?.value,
                month: month,
                year: year,
                country_code: country,
                order_by: order,
                column: colName,
                fuelType: Object.keys(laneFuelType).filter(key => laneFuelType[key]),
                carrier_scac: selectedCarrier
            }));
        }
    }, [dispatch, country, currentPage, pageSize, month, year, order, colName, laneFuelType, selectedCarrier, alternativeFuelFiltersDto]);

    useEffect(() => {
        if (lanesByFuelUsageAndMileageDto?.data?.list?.length > 0 && selectedCarrier?.length > 0) {
            setLaneName({
                origin: lanesByFuelUsageAndMileageDto?.data?.list[0]?.lane_name?.split("_")[0],
                destination: lanesByFuelUsageAndMileageDto?.data?.list[0]?.lane_name?.split("_")[1],
                source: `${lanesByFuelUsageAndMileageDto?.data?.list[0]?.lane_name}_${lanesByFuelUsageAndMileageDto?.data?.list[0]?.fuel_type}`,
                dto: lanesByFuelUsageAndMileageDto?.data?.list[0]
            })

            dispatch(getLaneStatistics({
                month: month,
                year: year,
                country_code: country,
                lane_name: lanesByFuelUsageAndMileageDto?.data?.list[0]?.lane_name,
                carrier_scac: selectedCarrier
            }))
        }

    }, [lanesByFuelUsageAndMileageDto, country, dispatch, month, year, selectedCarrier]);

    const handleChangeOrder = (chooseColName: string) => {
        setOrder(getOrder(order));
        setColName(chooseColName);
    };

    const handleChangeOrderShipment = () => {
        setOrderShipment(getOrder(orderShipment));
    };

    const handleLaneFuelType = (e: any, value: any) => {
        setLaneFuelType((prev: any) => ({ ...prev, [value]: e?.target.checked }));
        setCurrentPage(1);
    };

    let yearOption = getYearOptions({
        "start_date": "2024-01-04T00:00:00.000Z",
        "end_date": "2025-03-29T00:00:00.000Z"
    })
    let monthOption = getCurrentMonths(year)

    const MAX_VISIBLE_CARRIERS = 6;
    const carrierList = alternativeCarrierList?.data?.map((res: any) => ({ ...res, value: res?.scac, label: res?.name })) || []
    const selectedAlternativeCarrierList = carrierList?.filter((item: any) => selectedCarrier?.includes(item?.value))
    const visibleCarriers = showAll ? selectedAlternativeCarrierList : selectedAlternativeCarrierList?.slice(0, MAX_VISIBLE_CARRIERS);
    const hiddenCount = selectedAlternativeCarrierList.length - MAX_VISIBLE_CARRIERS;

    // Effect to fetch lane reduction detail graph data
    // Return all the states and functions
    return {
        isLoadingCountryList,
        countryListData,
        getLaneName,
        laneName,
        yearOption,
        currentPage,
        pageSize,
        handlePageChange,
        setCurrentPage,
        myRef,
        month, setMonth,
        year,
        setYear,
        showFullScreen,
        setShowFullScreen,
        keyMetricsAlternativeDto,
        keyMetricsAlternativeDtoLoading,
        listOfAllLanesByShipmentsDto,
        listOfAllLanesByShipmentsDtoLoading,
        lanesByFuelUsageAndMileageDto,
        lanesByFuelUsageAndMileageDtoLoading,
        currentShipmentPage,
        lanesByFuelStackeByEmissionsDto,
        lanesByFuelStackeByEmissionsDtoLoading,
        lanesByFuelStackeByQuantityDto,
        lanesByFuelStackeByQuantityDtoLoading,
        lanesByFuelStackeByMileageDto,
        lanesByFuelStackeByMileageDtoLoading,
        setCurrentShipmentPage,
        handleChangeOrder,
        order,
        colName,
        totalEmissionGraphByLaneAndFuelTypeLoading,
        totalEmissionGraphByLaneAndFuelType,
        orderShipment,
        handleChangeOrderShipment,
        laneFuelType,
        handleLaneFuelType,
        isLoadinglaneStatistics,
        monthOption,
        isLoadingAlternativeCarriers,
        selectedCarrier,
        handleCarrierChange,
        alternativeCarrierList,
        alternativeFuelFiltersDto,
        alternativeFuelTotalShipmentsLoading,
        alternativeFuelTotalShipmentsDto,
        fuelType, setFuelType,
        alternativeFuelListLoading,
        alternativeFuelListDto,
        showAll, setShowAll,
        visibleCarriers,
        hiddenCount,
        country, setCountry,
        configConstants,
        handleChangeCarrier,
        carrierList,
        setSelectedCarrier,
        isLoadingTotalEmissionsbyCarrierList,
        totalEmissionsbyCarrierListData,
        isLoadingMileagebyCarrierList,
        mileagebyCarrierListData,
        fuelTypeEmissions, setFuelTypeEmissions,
        fuelTypeMileage, setFuelTypeMileage,
        laneAccordion, setLaneAccordion,
        carrierAccordion, setCarrierAccordion,
        activeKey, setActiveKey,
        resetFiltersAndPagination,
        setSchneider,
        schneider,
        type,
        setType,
        isLoadingSchneider,
        schneiderData,
        loginDetails,
        emissionSavedFilters
    };
};

export default AlternativeFuelController;
