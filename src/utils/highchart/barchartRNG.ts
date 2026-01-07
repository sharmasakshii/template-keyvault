import { formatNumber } from 'utils';

export const barchartRNG = (props: any) => {
    const { yTitle, chartType, options, xTitle, showXtitle } = props

    return {
        chart: {
            type: chartType
        },
        credits: {
            enabled: false
        },
        title: {
            text: ''
        },
        exporting: {
            enabled: false
        },
        legend: {
            enabled: true,
            symbolRadius: 0,
            // x:-40,
            fontSize: '14px',
        },

        tooltip: {
            enabled: true,
            formatter(_: any) {
                const point: any = this;
                return ` <div>${formatNumber(true, point.y, 2)}</div>`
            },
        },
        plotOptions: {
            
            bar: {
                pointPadding: 0.2,
                borderWidth: 0,
                dataLabels: {
                    enabled: false
                },
                groupPadding: 0.1,
                pointWidth: 50
            },
            column: {
                borderRadius: 8, // Set the radius here (adjust for your preference)
                groupPadding: 0.8,    // Space between series
                pointPadding: 0.9,    // Space between bars within a category
                maxPointWidth: 50,   // Limit bar width
                dataLabels: {
                    enabled: true,
                    inside: false,
                    align: "center",
                    formatter: function (_: any) {
                        const point: any = this;
                        return `${formatNumber(
                            true,
                            point?.y,
                            2
                        )}`;
                    },
                }
            },
        },
        xAxis: {

            title: {
                enabled: showXtitle,
                useHTML: true,
                margin:14,
                text: `<div class="d-flex gap-3 justify-content-center align-items-center">
                <p class="font-14 mb-1">${xTitle}</p>
              </div>`
            },
            crosshair: true,
            categories: [],

            labels: {
                enabled: false // Hides the category labels
            }

        },
        yAxis: {
            title: {
                useHTML: true,
                text: `<div class="d-flex gap-3 justify-content-center align-items-center">
                <p class="font-14 mb-1">
                  ${yTitle}
                </p>
              </div>`
            },
            gridLineWidth: 0,

        },
        series: options
    }
}