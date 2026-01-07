import styles from '../../scss/config/_variable.module.scss';
import { formatNumber } from "utils";


// Define the array of quarters
const emissionYear1 = ["Q1", "Q2", "Q3", "Q4", "Q1", "Q2", "Q3", "Q4"];

export const rgpChart = (props: any) => {
    let emissionsReduction: any = [];
    if (props?.options) {
        props.label?.map((i: any) => {
            const list = props?.options?.[i?.key] || []
            props?.options?.[i?.key] && emissionsReduction.push(
                {
                    name: i?.name,
                    data: [...list],
                    color: i?.color,
                    marker: {
                        symbol: 'circle',
                        radius: 10,
                    },
                    zoneAxis: 'x',
                    threshold: 2,
                    zones: [
                        { value: 4 + 0.33 * (new Date().getMonth() + 1) },
                        { dashStyle: props?.options?.year?.[1] === new Date().getFullYear() ? 'dot' : '' },
                    ],
                    dataLabels: {
                        enabled: true,
                        y: -4,
                        x: -30,
                        color: (styles.primary),
                        useHTML: true,
                        crop: false,
                        overflow: 'none',
                        allowOverlap: false,
                        formatter: function (_: any) {
                            return ''
                        },
                    },
                });
            return true
        })

    }

    return {
        credits: {
            enabled: false,
        },
        chart: {
            zoomType: 'xy',
        },
        title: {
            text: '',
        },
        legend: {
            enabled: true,
            itemMarginBottom: 5,
            floating: false,

            symbolWidth: 16,
            symbolRadius: 0,
            squareSymbol: true,
            itemStyle: {
                font: '9pt Helvetica, Arial, sans-serif',
                activecolor: (styles.silver),
                'font-weight': 'bold',
                'text-decoration': 'none'
            }

        },
        yAxis: {
            min: 0,
            max: props?.options?.max || 100,
            title: {
                text: '',
            },
            enabled: false,
            gridLineColor: 'transparent',
            labels: {
                formatter: function (_: any) {
                    const point: any = this;

                    return formatNumber(true, point?.value, 1)
                },
            },
            plotLines: [

            ],
        },
        tooltip: {
            formatter: function (_: any) {
                const point: any = this;
                return (
                    `<b>${point?.key}</b> <br>` + formatNumber(true, point?.y, props?.isChecked ? 2 : 1)
                );
            },
        },
        dataLabels: {
            enabled: false,
            rotation: 0,
            color: (styles.white),
            align: 'center',
            crop: false,
            format: '{point.y:.2f}',
        },

        xAxis: {
            min: 0,
            labels: {
                enabled: true,
                useHTML: true,
                formatter: function (_: any) {
                    const point: any = this;
                    if (point?.pos === 0) {
                        return `${point?.value} <br/><div style='font-weight:bold;padding-top:12px;'>${props?.options?.year?.[0]}</div>`;
                    } else if (point?.pos === 4) {
                        return `${point?.value} <br/> <div style='font-weight:bold;padding-top:12px;'>${props?.options?.year?.[1]}</div>`;
                    }

                    return point?.value;
                },
            },
            categories: props?.options?.categories ?? emissionYear1,
            lineColor: (styles.lilac),
            plotLines: [
                {
                    color: (styles.patina),
                    width: 1,
                    value:
                        props?.options?.year?.[1] === new Date().getFullYear()
                            ? 3 + 0.33 * (new Date().getMonth() + 1)
                            : 14.1,
                    label: {
                        text: 'Now',
                        rotation: 0,
                        x: 5,
                        y: 20,

                        useHTML: true,
                        style: {
                            color: (styles.primary),
                            fontSize: '12px',
                        },
                    },
                },
            ],
        },

        exporting: {
            enabled: false,
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false,
                },
            },
        },

        series: emissionsReduction,

        responsive: {
            rules: [
                {
                    condition: {},
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom',
                        },
                    }
                },
            ],
        },
    };
}