import Highcharts from "highcharts";
import { formatNumber, numberFormatShort, getImageUrl } from 'utils';
import styles from '../../scss/config/_variable.module.scss'

export const doubleColumnChart = (props: any) => {

    const { xTitle, yTitle, options, categories, decimalPoint = 0, pointWidth = 36, dataLabels = true, radius = 10, graphTitle = null, enableDownload = false } = props
    return {
        chart: {
            type: 'column',
            zoomType: 'x'
        },
        title: {
            useHTML: true,
            text: graphTitle,
            align: 'left',
            style: {
                fontSize: '12px',
                whiteSpace: 'nowrap'
            }
        },
        lang: {
            contextButtonTitle: "Download Snapshot"
        },

        exporting: {
            enabled: enableDownload,
            buttons: {
                contextButton: {
                    align: 'right', // Align the button to the right
                    verticalAlign: 'top', // Align the button to the top
                    x: -10, // Fixed horizontal offset
                    y: 10, // Fixed vertical offset
                    theme: {
                        fill: styles.white,
                        states: {
                            hover: {
                                fill: styles.white
                            }
                        }
                    },
                    symbol: `url(${getImageUrl("/images/download.svg")})`,
                    symbolX: 14,
                    symbolY: 17,
                    symbolWidth: 10,
                    symbolHeight: 10,
                    titleKey: "contextButtonTitle",
                    menuItems: null,
                    onclick(this: Highcharts.Chart) {
                        this.exportChartLocal({
                            type: 'image/png'
                        });
                    }
                }
            }
        },
        xAxis: {
            categories: categories,
            crosshair: true,
            accessibility: {
                description: 'Countries'
            },
            title: {
                text: xTitle,
                margin: 10
            }
        },
        yAxis: {
            min: 0,
            softThreshold: false,
            title: {
                text: yTitle,
            }
        },
        tooltip: {
            enabled: true,
            formatter(_: any) {
                const point: any = this;
                return `<div>
                     ${point.series.name + " : " + formatNumber(true, point.y, decimalPoint)}
                </div>`
            }
        },
        plotOptions: {
            column: {
                borderRadius: radius, // Set the radius here (adjust for your preference)
                groupPadding: 0.1,    // Space between series
                pointPadding: 0.2,    // Space between bars within a category
                maxPointWidth: 15     // Limit bar width
            },

            series: {
                borderRadiusTopLeft: "20%",
                borderRadiusTopRight: "20%",
                pointWidth: pointWidth,
                dataLabels: {
                    enabled: dataLabels,
                    crop: false, // Allow labels to appear outside the plot area
                    overflow: 'none', // Prevent labels from overlapping
                    formatter(_: any) {
                        const point: any = this;
                        return numberFormatShort(decimalPoint).format(point.y)
                    }
                }
            }
        },
        credits: {
            enabled: false
        },
        legend: {
            symbolWidth: 14,
            symbolHeight: 14,
            symbolRadius: 3
        },
        series: options.map((series: any) => ({
            ...series,
            data: [...series.data], // clone inner data array
        }))
    }
}