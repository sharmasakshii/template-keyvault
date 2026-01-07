import styles from '../../scss/config/_variable.module.scss'
import { formatNumber, getImageUrl } from "utils";

export const donutchart = (props: any) => {
    const { options, title, dataKey="y", enableDownload=false, donutInnerTitle } = props
    return {
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            useHTML: true,
            style: {
                fontWeight: 'bold',
                color: (styles.black),
            },
            text: `<div class="font-14 fw-medium text-center">  ${donutInnerTitle?.replace("", "<br/>")}</div>`,
            align: 'center',
            verticalAlign: 'middle',
            y: -10

        },
        lang: {
            contextButtonTitle: "Download Snapshot"
        },

        exporting: {
            enabled: enableDownload,
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
        subtitle: {
            useHTML: true,
            text: title,
            floating: true,
            verticalAlign: 'middle',
            y: -10
            // x:-95
        },
        tooltip: {
            enabled: true,
            useHTML: true,
            formatter: function (_: any) {
                const point: any = this;
                return `<div ><b>${formatNumber(true, point?.y, 1)}%</b></div>`
            },
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
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
                colorByPoint: true,
                size: '90%',
                innerSize: '70%',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true,
            }
        },

        series: [
            {
                type: 'pie',
                name: 'pie',
                data: options?.map((res: any) => ({ name: res?.name, y: res?.[dataKey], color: res?.color })),
            }
        ]
    }

}