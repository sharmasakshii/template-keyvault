import Highcharts from "highcharts";
import { formatNumber, getImageUrl, numberFormatShort } from 'utils';
import styles from '../../scss/config/_variable.module.scss'

export const stackChart = (props: any) => {
    const { yTitle, chartType, options, xTitle, showXtitle, categories, roundUpto, isXLabelLaneName = false, enabledExport = false, xValue=0 } = props
    const scrollWidth = categories?.length > 14 ? categories?.length * 60 : 0;
    return {
        chart: {
            type: chartType,
            scrollablePlotArea: {
                minWidth: scrollWidth,
            },
        },
        credits: {
            enabled: false
        },
        title: {
            text: ''
        },

        lang: {
            contextButtonTitle: "Download Snapshot"
        },

        exporting: {
            enabled: enabledExport,
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
        legend: {
            enabled: true,
            symbolRadius: 0,
            fontSize: '14px',
            margin: 40,
            y: -14
        },
        tooltip: {
            enabled: true,
            formatter(_: any) {
                const point: any = this;
                return ` <div>${formatNumber(true, point.y, roundUpto)}</div>`
            },
        },
        plotOptions: {
            column: {
                borderRadius: 10,
                stacking: "normal",
                pointWidth: 30
            },
        },
        xAxis: {

            title: {
                enabled: showXtitle,
                useHTML: true,
                text: `
                <p class="font-14 mb-0 xtitle-value">${xTitle}</p>`,
                x: xValue, 
                y: 5,
            },
            categories: categories,

            labels: {
                useHTML: true,
                rotation: -80,
                align: "right", // Align labels properly
                x: -2, // Adjust position slightly
                y: 5, // Move labels slightly down
                formatter: function (_: any) {
                    const point: any = this;
                    const laneName = point?.value?.toString() ?? "";
                    // Check if there's an underscore in the category
                    if (isXLabelLaneName) {
                        return `<div class="d-flex gap-3 rotatedata justify-content-center align-items-center">${laneName?.split('_')?.[0]} - <br/>${laneName?.split('_')?.[1]} </div>`;
                    } else {
                        // Return the category as is if no underscore
                        return `<div class="d-flex chart-Labels gap-3 rotatedata justify-content-center align-items-center">${laneName}</div>`;
                    }
                },
            },

        },
        yAxis: {
            title: {
                useHTML: true,
                text: `
                <p class="font-14 mb-0">
                  ${yTitle}
                </p>`,
                align: 'middle', // Align vertically

            },
            gridLineWidth: 0,
            stackLabels: {
                enabled: true,
                align: 'center',
                formatter: function (_: any) {
                    const point: any = this;
                    return numberFormatShort(roundUpto).format(point.total)
                },
            },

        },
        series: options
    }
}