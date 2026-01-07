import { formatNumber, getImageUrl } from 'utils';

import styles from '../../scss/config/_variable.module.scss'

export const barCompareChart = (props: any) => {
    const { options, yTitle } = props

    const optionsDto = [{
        name: 'Highest Bid',
        data: options?.map((i: any) => i?.max_rpm),
        color: (styles.lightgreen),

    }, {
        name: 'Average Bid',
        data: options?.map((i: any) => i?.avg_rpm),
        color: (styles.primary),

    }, {
        name: 'Lowest Bid',
        data: options?.map((i: any) => i?.min_rpm),
        color: (styles.green),
    }]

    return {
        credits: {
            enabled: false
        },
        title: {
            text: ''
        },
        chart: {
            type: 'bar'
        },

        legend: {
            enabled: false,
        },
        yAxis: {
            min: 0,
            title: {
                useHTML: true,
                text: `<div class="d-flex gap-3 verticaldata justify-content-center align-items-center">
                <div class="linesbefore"></div>
                <p class="font-14 mb-1">
                  ${yTitle}
                </p>
                <div class="linesbefore"></div>
              </div>`
            },
            enabled: false,
            gridLineColor: 'transparent',

        },

        xAxis: {
            categories: options?.map((i: any) => i?.lane_name),
            title: {
                useHTML: true,
                text: `<div class="d-flex gap-3 verticaldata justify-content-center align-items-center">
                <div class="linesbefore"></div>
                <p class="font-14 mb-1">Lane</p>
                <div class="linesbefore"></div>
              </div>`
            },
            labels: {
                useHTML: true,
                formatter: function (_: any) {
                    const point: any = this;
                    const laneName = point?.value?.toString() ?? "";
                    return `<div>${laneName?.split('_')?.[0]} to <br/>${laneName?.split('_')?.[1]} </div>`;
                },
                align: 'left',
                reserveSpace: true

            },
        },
        tooltip: {
            enabled: true,
            positioner: function (boxWidth: number, boxHeight: number, point: any) {
                return {
                    x: point.plotX, // Adjust the value as needed
                    y: point.plotY - boxHeight / 2
                };
            },
            useHTML: true,

            formatter: function (_: any) {
                const point: any = this;
                const pointDetail = options?.filter((i: any) => i?.lane_name === point?.x)?.[0];
                const imageUrl = point?.series?.name === "Lowest Bid" ? pointDetail?.carrier_logo_min : pointDetail?.carrier_logo_max;
                const imageCode = point?.series?.name === "Lowest Bid" ? pointDetail?.carrier_min : pointDetail?.carrier_max;
                if (point?.series?.name !== "Average Bid") {
                    if (imageUrl) {
                        return `<div class="text-center">
                        <img
                            width="50"
                            height="30"
                            src="${getImageUrl(imageUrl)}"
                            alt="logo"
                            class="mb-1 inputGraph-tooltipimage"
                        />
                   </br>
                    ${point?.series?.name} : <b>$${formatNumber(true, point?.y, 2)}</b>
                    </div>`;
                    } else {
                        return `<div>
                                <div class="d-flex justify-content-center">
                                    <span class="text-center logo-icon-name">
                                        ${imageCode?.substring(0, 2)}
                                    </span>
                                </div>
                                    ${point?.series?.name}: <b>$${formatNumber(true, point?.y, 2)}</b>
                                </div>

                   `;
                    }
                } else {
                    return `<div>
                    ${point?.series?.name}: <b>$${formatNumber(true, point?.y, 2)}</b></div>`
                }
            },
        },
        exporting: {
            enabled: false,
        },

        plotOptions: {
            bar: {
                borderRadius: '20%',
                dataLabels: {
                    enabled: true,
                    inside: false,
                    x: 40,
                    align: "center",
                    formatter: function (_: any) {
                        const point: any = this;
                        if (point?.series?.name !== "Average Bid") {
                            const pointDetail = options?.filter((i: any) => i?.lane_name === point?.x)?.[0];
                            const imageCode = point?.series?.name === "Lowest Bid" ? pointDetail?.carrier_min : pointDetail?.carrier_max;
                            return `<div>
                                        <span class="text-black">
                                            ${imageCode}
                                        </span>
                                    </div>
                                `;
                        }
                    },
                    useHTML: true,
                },
                groupPadding: 0.1
            }
        },
        series: optionsDto,
    }
}