import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBenchmarkCarrierEmissions } from "store/benchmark/benchmarkSlice";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";

export const BenchmarkCarrierTableController = () => {
    const [pageSize, setPageSize] = useState<any>({
        label: 10,
        value: 10,
    });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [backLink, setBackLink] = useState<any>(String)


    const dispatch = useAppDispatch();
    const params = useParams()
    const { benchmarkCompanyCarrierEmissionsList, benchmarkLCompanyarrierEmissionsLoading } = useAppSelector((state: any) => state.benchmark)

    useEffect(() => {
        dispatch(
            getBenchmarkCarrierEmissions({
                toggle_data: Number(params.wtwType),
                [params.type === "region" ? "bound_type" : ""]: params.boundType === "0" ? "inbound" : "outbound",
                [params?.type === "region" ? "region_id" : ""]: Number(params?.id),
                [params?.type === "lane" ? "origin" : ""]: params.id?.split("_")?.[0],
                [params?.type === "lane" ? "dest" : ""]: params.id?.split("_")?.[1],
                [params?.type === "weight" || params?.type === "mile" ? "band_no" : ""]: params.bandNumber,
                year: Number(params.yearId),
                quarter: params.quarterId === "all" ? "" : Number(params.quarterId),
                type: params.type,
                low_emission: Number(params.emissionId),
                page: currentPage,
                page_size: pageSize?.value
            }))
    }, [dispatch, pageSize, currentPage, params])

    useEffect(() => {
        let link
        if (params.type === "region") {
            link = `scope3/benchmarks/${params?.type}/detail/${params?.id}/${params.yearId}/${params.quarterId ? params.quarterId : "all"}/${params.wtwType}/${params.boundType === "0" ? "inbound" : "outbound"}`
        }
        else if (params.type === "lane") {
            link = `scope3/benchmarks/${params?.type}/detail/${params?.id}/${params.yearId}/${params.quarterId ? params.quarterId : "all"}/${params.wtwType}`
        }
        else if (params.type === "weight" || params.type === "mile") {
            link = `scope3/benchmarks/${params?.type}/${params.bandNumber}/${params.yearId}/${params.quarterId ? params.quarterId : "all"}/${params.wtwType}`
        }
        setBackLink(link)
    }, [params])

    const handlePageChange = (e: any) => {
        setPageSize(e);
        setCurrentPage(1);
    };
    return {
        benchmarkCompanyCarrierEmissionsList,
        benchmarkLCompanyarrierEmissionsLoading,
        pageSize,
        currentPage,
        handlePageChange,
        setCurrentPage,
        params,
        backLink
    }

}