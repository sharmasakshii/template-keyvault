import { formatNumber } from "utils";
import styles from '../../scss/config/_variable.module.scss'






export const verticalColumnEmissionChart = (props: any) => {
    let totalEmissionIntensity: any = [];
    let quarter = ''
    if (props.showQuarter) {
        quarter = props.quartelyData === 0 ? `All Quarters ` : `Q${props.quartelyData} `
    }
    props.options?.[0]?.dataset?.forEach((x: any, index: number) => {
        totalEmissionIntensity.push({ name: `${quarter} ${x.year}`, data: [Number(x.intensity)], color: index === 0 ? (styles.lightgreen) : (styles.primary), pointWidth: 50 })

    })
    return {
        credits: {
            enabled: false
        },
        title: {
            text: ''
        },
        chart: {
            type: 'column'
        },

        legend: {
            symbolPadding: 0,
            symbolWidth: 0,
            symbolHeight: 0,
            squareSymbol: false,
            useHTML: true,
            margin: 0,
            padding: 0,
            x: 20,
            itemMarginTop: 10,
            labelFormatter: function (_: any) {
                const point: any = this;

                let textData = `<div style='color:${styles.primary}' class='text-center'><div>Last Year</div><br>(${point.name} )</div>`
                return point.index === 1 ? `<div style='padding-left: 4.5em;color:${styles.primary}' class='text-center'><div>This Year</div><br>(${point.name} )</div>` : textData;
            }

        },
        yAxis: {
            max: props?.options?.[0]?.graphMax,
            title: {
                text: ''
            },
            enabled: false,
            gridLineColor: 'transparent',
            plotLines: [
                {
                    dashStyle: 'dot',
                    color: (styles.orange),
                    width: 2,
                    value: props.options?.[0]?.max,

                    label: {
                        y: Math.round(
                            Number(
                                (
                                    (props.options?.[0]?.max - props?.options?.[0]?.industrialAverage) /
                                    props.options?.[0]?.max *
                                    100
                                ).toFixed(2)
                            )
                        ) > 0 ? -20 : 20,
                        text: `${+Math.round(((props.options?.[0]?.max - props?.options?.[0]?.industrialAverage) / props.options?.[0]?.max) * 100).toFixed(2) > 0 ? '+' : ''} ${Math.round(((props.options?.[0]?.max - props?.options?.[0]?.industrialAverage) / props.options?.[0]?.max) * 100)} %`,
                        x: -30,

                        align: 'right',
                        paddingBottom: 10,
                        verticalAlign: "bottom",
                        color: (styles.orange),
                        useHTML: true,
                        style: {
                            color: (styles.orange),
                            fontSize: "20px",
                        }
                    }
                }, {
                    color: (styles.primary),
                    width: 2,
                    value: props?.options?.[0]?.industrialAverage,
                    zIndex: 10,

                    label: {
                        text: 'Industry average',
                        align: 'left',
                        x: 0,
                        y: Math.round(
                            Number(
                                (
                                    (props.options?.[0]?.max - props?.options?.[0]?.industrialAverage) /
                                    props.options?.[0]?.max *
                                    100
                                ).toFixed(2)
                            )
                        ) > 0 ? 20 : -20,
                        useHTML: true,
                        style: {

                            fontSize: "12px",
                            color: (styles.primary)
                        }
                    }
                }]
        },
        xAxis: {
            categories: [""
            ],
            crosshair: true
        },
        tooltip: {
            enabled: false,
        },
        exporting: {
            enabled: false,
        },

        plotOptions: {
            column: {
                borderRadius: 10, // Set the radius here (adjust for your preference)
            },

            series: {
                borderRadiusTopLeft: "20%",
                borderRadiusTopRight: "20%",

                dataLabels: {
                    enabled: true,
                    inside: false,
                    y: -10,
                    align: 'center',
                    verticalAlign: "bottom",
                    formatter: function (_: any) {
                        const point: any = this;
                        return `<div class='text-center' style='color:${styles.primary}; font-size:12px'}> ${formatNumber(true, point.y, 1)}  </br></div></div>`
                    },
                    useHTML: true,
                    style: {
                        color: 'white',
                        textOutline: false,
                    }
                }
            }
        },
        series: totalEmissionIntensity

    }
}