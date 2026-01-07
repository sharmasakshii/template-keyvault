import { formatNumber } from "utils";
import styles from '../../scss/config/_variable.module.scss'



export const verticalColumnChart = (props: any) => {
    return {
        credits: {
            enabled: false
        },
        title: {
            text: ''
        },
        chart: {
            type: 'column',
        },
        legend: {
            enabled: false, // Set this to false to hide the legend
        },
        yAxis: [{
            title: {
                text: ''
            },
            labels: {
                style: {
                    color: (styles.darkGray)
                },
                formatter: function (_: any) {
                    const point: any = this;

                    return `${formatNumber(true, point.value, 0)}`
                }
            }
        }],
        xAxis: {
            labels: {
                style: {
                    color: (styles.primary),
                },
            },
            categories: props?.options?.find((ele: any) => ele?.name === "lables")?.data
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
                        return `<div class='text-center' style='color:${styles.primary}; font-size:13px'}>${formatNumber(true, point.y, 2)}</br></div>`
                    },
                    useHTML: true,
                    style: {
                        color: 'white',
                        textOutline: false,
                    }
                },
            }
        },
        series: [{
            data: props?.options?.find((ele: any) => ele?.name === "list")?.data?.map((x: any, index: number) => ({
                y: Number(x.emission),
                color: index === props?.options?.find((ele: any) => ele?.name === "list")?.data?.length - 1 ? (styles.primary) : (styles.lightgreen), // Generate a random color for each column
                pointWidth: 50,
            }))
        }],
    };
}