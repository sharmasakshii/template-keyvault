import { formatNumber } from 'utils';
const lagendKey: any = {
    'rd_gallons': 'RD',
    'bio_gallons': 'Bio'
};

export const barColumnChartCompare = (props: any) => {
    const { yTitle, options } = props

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
            enabled: true,
            labelFormatter: function (_: any) {
                const point: any = this;
                return lagendKey[point.name];
            }
        },

        tooltip: {
            enabled: true,

            formatter: function (_: any) {
                const point: any = this;
                return `
                        <div>
                               <b>${' '}${formatNumber(true, point?.y, 0)}</b>
                        </div>`;
            }
        },
        plotOptions: {
            column: {
                pointPadding: 0,   // spacing between columns (default ~0.1)
                groupPadding: 0.38,
                borderRadius: 10,
                pointWidth: 20,
                borderWidth: 0,

            },
        },
        xAxis: {
            categories: options?.categories,
            title: {
                useHTML: true,
                text: `<div class="d-flex gap-3 verticaldata justify-content-center align-items-center" style="margin-left:80px;">
                <div class="linesbefore"></div>
                <p class="font-14 mb-1">Months</p>
                <div class="linesbefore"></div>
              </div>
                     
        </div>
              `
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
        series: options?.series
    }
}