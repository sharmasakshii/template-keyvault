import { formatNumber, getImageUrl } from 'utils';

export const barchart = (props: any) => {
    const { yTitle, options, yKey, barColor, costImpact } = props

    return {
        chart: {
            type: 'column'
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
            enabled: false
        },

        tooltip: {
            enabled: true,
            useHTML: true,

            formatter: function(_: any) {
                const point: any = this;
                const pointDetail = options?.find((i: any) => i?.lane_name === point?.x);
                const imageUrl = pointDetail?.path;
                const imageCode = pointDetail?.SCAC;
            
                let content = '';
            
                if (imageUrl) {
                    content = `
                        <div class="text-center">
                            <img
                                width="40"
                                src="${getImageUrl(imageUrl)}"
                                alt="logo"
                                class="profileimgWrap"
                            />
                            <div>
                               <b>${costImpact}${' '}${formatNumber(true, point?.y, 0)}%</b>
                            </div>
                        </div>`;
                } else if (imageCode) {
                    content = `
                        <div>
                            <div class="d-flex justify-content-center">
                                <span class="text-center logo-icon-name">
                                    ${imageCode?.substring(0, 2)}
                                </span>
                            </div>
                            <div>
                                <b>${costImpact}${' '}${formatNumber(true, point?.y, 0)}%</b>
                            </div>
                        </div>`;
                } else {
                    content = `
                        <div>
                            <div>
                               <b>${costImpact}${' '}${formatNumber(true, point?.y, 0)}%</b>
                            </div>
                        </div>`;
                }
            
                return content;
            }
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderRadius:10,

                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    inside: false,
                    align: "center",
                    formatter: function (_: any) {
                        const point: any = this;
                        const pointDetail = options?.filter((i: any) => i?.lane_name === point?.x)?.[0];
                        return `${pointDetail?.SCAC || ''}`;
                    },
                }
            },
        },
        xAxis: {
            categories: options?.map((i: any) => i?.lane_name?.split("_").join(" to ")),
            title: {
                useHTML: true,
                text: `<div class="d-flex gap-3 verticaldata justify-content-center align-items-center">
                <div class="linesbefore"></div>
                <p class="font-14 mb-1">Lane</p>
                <div class="linesbefore"></div>
              </div>`
            },
            gridLineWidth: 0,

        },
        yAxis: {
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
            gridLineWidth: 0,

        },
        series: [
            {
                name: 'lane',
                color: barColor,
                data: options?.map((i: any) => Math.abs(i?.[yKey] || 0))
            },

        ]
    }
}