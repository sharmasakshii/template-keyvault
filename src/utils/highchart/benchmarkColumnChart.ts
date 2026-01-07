import { formatNumber, getImageUrl } from "utils"
import styles from '../../scss/config/_variable.module.scss';

export const benchmarkColumnChart = (props: any) => {
    return props.database ? {
        chart: {
            type: 'column',
            borderRadius: 10
        },
        title: {
            text: props?.heading,
            align: 'left'
        },
        xAxis: {
            lineColor: (styles.lilac),
            categories: props?.options?.data?.map((i: any) => i?.label) || [],
            crosshair: true,
            accessibility: {
                description: 'Countries'
            },
            min: 0,
            title: {
                text: props.xLabel,
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: props.yLabel
            }
        },
        exporting: {
            buttons: {
                contextButton: {
                    theme: {
                        fill: (styles.white),
                        states: {
                            hover: {
                                fill: (styles.white)
                            },
                        }
                    },
                    symbol: `url(${getImageUrl("/images/download.svg")})`,
                    symbolX: 11,
                    symbolY: 15,
                    symbolWidth: 30,
                    symbolHeight: 30,
                    titleKey: "contextButtonTitle",
                    menuItems: null,
                    onclick(this: Highcharts.Chart) {
                        this.exportChartLocal({
                            type: 'image/png'
                        }, {});
                    }
                }
            },
        },
        tooltip: {
            enabled: false,
            formatter: function (this: any) {
                return formatNumber(true, this.y, 1)
            }
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
                borderRadius: 10
            },
            series: {
                dataLabels: {
                    enabled: true,
                    y: -6,
                    formatter: function (this: any) {
                        return formatNumber(true, this.y, 1)
                    }
                },
                pointPadding: 0.1,
                groupPadding: props.benchmarkType === "mile" ? 0.1 : 0,
            }
        },
        legend: {
            align: 'center',
            symbolRadius: 0,
            itemStyle: {
                font: '9pt Helvetica, Arial, sans-serif',
                activecolor: (styles.silver),
                'font-weight': 'bold',
                'text-decoration': 'none'
            }
        },
        series: [
            {
                color: (styles.lightgreen),
                name: 'Industry Standard',
                data: props?.options?.data?.map((i: any) => Number.parseFloat(i?.industry)) || [],
                cursor: 'pointer',
                pointWidth: 30,

                point: {
                    events: {
                        click: function (r: any) {
                            if (props?.isClickable) {
                                props.navigate(`/scope3/benchmarks/${props.benchmarkType}/${props?.options?.data[r.point.index]?.band}/${props.yearId}/${props.quarterId}/${props.wtwType}`);

                            } else {
                                return false;

                            }
                        },
                    }
                },
                dataLabels: {
                    color: (styles.charcoal),
                    fontWeight: "500"
                }
            },
            {
                color: (styles.primary),
                name: props?.companyName,
                data: props?.options?.data?.map((i: any) => Number.parseFloat(i?.company)) || [],
                cursor: 'pointer',
                pointWidth: 30,
                point: {
                    events: {
                        click: function (r: any) {
                            if (props?.isClickable) {

                                props.navigate(`/scope3/benchmarks/${props.benchmarkType}/${props?.options?.data[r.point.index]?.band}/${props.yearId}/${props.quarterId}/${props.wtwType}`);
                            } else {
                                return false;

                            }
                        },
                    }
                },
                dataLabels: {
                    color: (styles.charcoal),
                    fontWeight: "500"
                }
            }
        ],
    } : true

}