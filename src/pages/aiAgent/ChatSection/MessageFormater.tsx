import { downloadFile, getImageUrl, isValidJSON } from "utils";
import TableHead from 'component/tableHeadHandle';
import TableBodyLoad from 'component/tableBodyHandle';
import Heading from "component/heading";
import ImageComponent from "component/images"
import ChartHighChart from 'component/highChart/ChartHighChart';
import { ThreeDots } from "react-loader-spinner";


const GrpahTableView = (props: any) => {
    const { responseDto } = props
    const categories = responseDto?.data?.categories || [];

    const minWidth = categories.length > 10
        ? `${categories.length * 40}px`
        : '100%';

    switch (responseDto?.Response_type) {
        case "table":
            return (
                <table className="table">
                    <TableHead columns={responseDto?.data?.columns?.map((col: any) => ({ key: col, label: col, isSorting: false }))} />
                    <TableBodyLoad colSpan={responseDto?.data?.columns?.length} isLoading={false} isData={true}>
                        <tbody>
                            {responseDto?.data?.rows?.map((res: any) => (
                                <tr key={`${res[0]}`}>
                                    {responseDto?.data?.columns?.map((data: any) => (<td key={`${res[data]}`}>{res[data]}</td>))}
                                </tr>
                            ))}
                        </tbody>
                    </TableBodyLoad>
                </table>
            )
        case "graph":
            if (responseDto?.Graph_type === "bar") {
                return (
                    <div className=" mt-3 d-flex gap-2 align-items-start ">
                        <div style={{ width: '1260px', overflowX: 'auto' }}>
                            <div style={{ minWidth }}>
                                <ChartHighChart
                                    database={true}
                                    options={{
                                        chart: {
                                            type: 'column',
                                            height: 400 // Optional
                                        },
                                        title: {
                                            text: responseDto?.data?.title || '',
                                            align: 'left',
                                            marginBottom: '10px'
                                        },
                                        subtitle: {
                                            text: responseDto?.data?.subtitle || ''
                                        },
                                        xAxis: {
                                            categories: responseDto?.data?.categories,
                                            title: {
                                                enabled: true,
                                                useHTML: true,
                                                margin: 14,
                                                text: `<div class="d-flex gap-3 justify-content-center align-items-center">
              <p class="font-14 mb-1">${responseDto?.data?.xTitle ?? ''}</p>
            </div>`
                                            }
                                        },
                                        legend: {
                                            enabled: responseDto?.data?.series?.length > 1
                                        },
                                        yAxis: {
                                            min: 0,
                                            title: {
                                                enabled: true,
                                                useHTML: true,
                                                margin: 14,
                                                text: `<div class="d-flex gap-3 justify-content-center align-items-center">
              <p class="font-14 mb-1">${responseDto?.data?.yTitle ?? ''}</p>
            </div>`
                                            }
                                        },
                                        plotOptions: {
                                            column: {
                                                borderRadius: 6,
                                                groupPadding: 0.1,
                                                pointPadding: 0.1,
                                                maxPointWidth: 20
                                            }
                                        },
                                        tooltip: {
                                            enabled: true
                                        },
                                        series: responseDto?.data?.series
                                    }}
                                    constructorType=""
                                    isLoading={false}
                                />
                            </div>
                        </div>

                    </div>
                )
            } else if (responseDto?.Graph_type === "pie") {
                return <div className=" mt-3 pie-chart">
                    <ChartHighChart
                        database={true}
                        options={{
                            credits: { enabled: false },
                            chart: {
                                plotBorderWidth: 0,
                                plotShadow: false,
                                type: "pie",
                            },
                            title: {
                                text: responseDto?.data?.title || "",
                                align: 'left',
                                marginBottom: '10px'
                            },
                            subtitle: {
                                text: responseDto?.data?.subtitle || ""
                            },
                            tooltip: {
                                enabled: true,
                                pointFormat: "<b>{point.y} ({point.percentage:.1f}%)</b>",
                            },
                            accessibility: {
                                point: { valueSuffix: "%" },
                            },
                            legend: {
                                align: 'center',
                                symbolRadius: 0,
                                fontSize: '14px',
                                position: 'bottom',
                                alignment: 'center',
                                orientation: 'vertical',
                            },
                            plotOptions: {
                                pie: {
                                    borderWidth: 0,
                                    size: "95%",
                                    innerSize: "70%",
                                    dataLabels: {
                                        enabled: false,
                                    },
                                    showInLegend: true,
                                },
                            },
                            series: [
                                {
                                    type: 'pie',
                                    name: 'pie',
                                    data: responseDto?.data?.series?.[0]?.data || []
                                },
                            ],
                        }}
                        constructorType=""
                        isLoading={false}
                    />
                </div>;
            }
            return null;

        default:
            return (
                <></>
            )
    }
}


const MessageFormater = (props: any) => {
    const { chat } = props
    const handleDownloadImage = (file: string) => {
        downloadFile(getImageUrl(file), file)
    }

    return (
        <div>
            {chat?.question && <div className='senders-msg mb-3 mt-1'>
                <div className='msg-outer'>
                    <Heading level="6" className="fw-medium font-12 font-xxl-16 mb-1">You</Heading>
                    <div className='msg-inner'>
                        <ImageComponent path="/images/chatbot/userAvtar.svg" className='user pe-0' />
                        <Heading level="4" content={chat?.question} className="fw-medium font-12 font-xxl-16 mb-0" />
                    </div>
                </div>
            </div>}
            {chat?.response &&
                <div className='ai-msg mb-3 ps-4'>
                    <div className='msg-outer'>
                        <Heading level="6" className="fw-medium font-12 font-xxl-16 mb-1">AI Assistant</Heading>
                        <div className='msg-inner'>
                            <ImageComponent path="/images/chatbot/ai-agent.svg" className="user pe-0" />
                            {chat.response_type === "error" ? <Heading level="4" className="fw-medium font-12 font-xxl-16 mb-0">
                                <ImageComponent path="/images/failedIcon.svg" />{chat.response ?? ""}
                            </Heading> : <Heading level="4" className="fw-medium font-12 font-xxl-16 mb-0">
                                <div className="chatResponse">
                                    {isValidJSON(chat?.response) ? <GrpahTableView responseDto={JSON.parse(chat?.response)} /> : (chat?.response?.answer || chat?.response || "").toString()}</div>
                            </Heading>}

                            {chat.isLoading && 
                                            <ThreeDots
                                              visible={true}
                                              height="40"
                                              width="40"
                                              color="#B6B3B3"
                                              radius="9"
                                              ariaLabel="three-dots-loading"
                                              wrapperStyle={{}}
                                              wrapperClass=""
                                            />
                            }

                        </div>
                        {chat?.response_type === "image" && <div className=" mt-3 d-flex gap-2 align-items-start chartImage-outer">
                            <ImageComponent path={chat?.data} className="chartImage pe-0" />
                            <button type='button' onClick={() => handleDownloadImage(chat?.data)} className="btn btn-transparent download-img p-0 h-0"> <ImageComponent path="/images/download.svg" className="pe-0 mt-2" /></button>
                        </div>}
                    </div>
                </div>
            }
        </div>
    )
}

export default MessageFormater