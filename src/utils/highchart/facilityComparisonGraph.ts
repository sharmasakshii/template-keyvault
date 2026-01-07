import styles from '../../scss/config/_variable.module.scss'

export const facilityComparisonGraph = (props: any) => {

    let arrNew1: any = []
    props?.options?.data?.length > 0 && props?.options?.data.map((x: any, index: number) => {
        arrNew1.push({
            events: {
                legendItemClick: function () {
                    return false;
                }    
            },
            name: x.year, data: [Number(x.intensity)], color: index === 0 ? (styles.lightgreen) : (styles.primary), pointWidth: 50
        })
        return true

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
                const point: any = this
                let textData = `<div class='pointer-cursor text-center'style='color:${styles.primary}'><div>All Facilities</div>`
                return point.index === 1 ? `<div  class='pointer-cursor text-center' style='padding-left: 4.5em;color:${styles.primary}'><div>` + props?.facilityName + "</div></div>" : textData;
            }
        },
        yAxis: {
            max: props.options?.[0]?.graphMax,
            title: {
                text: ''
            },
            enabled: false,
            gridLineColor: 'transparent',

            plotLines: [
                {
                    dashStyle: 'dot',
                    color:(styles.orange),
                    width: 2,
                    value: props?.options?.intensity,
                    label: {
                        y: Math.round(((props?.options?.intensity - props?.options?.industrialAverage) / props?.options?.intensity) * 100) > 0 ? -20 : 20,
                        text: `${Math.round(((props?.options?.intensity - props?.options?.industrialAverage) / props?.options?.intensity) * 100) > 0 ? '+' : ''} ${Math.round(((props?.options?.intensity - props?.options?.industrialAverage) / props?.options?.intensity) * 100)}%`,
                        x: -30,

                        align: 'right',
                        paddingBottom: 10,
                        verticalAlign: "bottom",
                        color:(styles.orange),
                        useHTML: true,
                        style: {
                            color:(styles.orange),
                            fontSize: "20px",
                        }
                    }
                }, {
                    color: (styles.primary),
                    width: 2,
                    value: props?.options?.industrialAverage,
                    zIndex: 10,

                    label: {
                        text: 'Industry average',
                        align: 'left',
                        x: 0,
                        y: Math.round(((props?.options?.intensity - props?.options?.industrialAverage) / props?.options?.intensity) * 100) > 0 ? 20 : -20,
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
            enabled:false,
          },
        plotOptions: {
            column: {
                borderRadius: 10, // Set the radius here (adjust for your preference)
            },
            series: {
                dataLabels: {
                    enabled: true,
                    inside: false,
                    y: -10,
                    align: 'center',
                    verticalAlign: "bottom",
                    formatter: function (_: any) {
                        const point: any = this;

                        return point.color === (styles.lightgreen) ? `<div class='text-center' style='color:${styles.primary}; font-size:13px'}>` + point.y + "</br></div></div>" : `<div   class='text-center'  style='color:${styles.primary};font-size:13px'}>` + point.y + "</br></div></div>"
                    },
                    useHTML: true,
                    style: {
                        color: 'white',
                        textOutline: false,
                    }
                }
            }
        },
        series: arrNew1
    }
}