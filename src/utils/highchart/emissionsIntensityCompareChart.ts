import styles from '../../scss/config/_variable.module.scss';
import { capitalizeText, formatNumber } from "utils";

export const emissionsIntensityCompareChart = (props: any) => {

    return {
        credits: {
            enabled: false,
        },
        title: {
            text: "",
        },
        chart: {
            type: "column",
        },
        legend: {
            enabled: false, // Set this to false to hide the legend
          },
        yAxis: {
            title: {
                text: "",
            },
            enabled: false,
            gridLineColor: "transparent",
            plotLines: [
                {
                    dashStyle: "dot",
                    color: (styles.primary),
                    width: 2,
                    value: props?.baseLine,
                    zIndex: 10,
                    label: {
                        text: "Baseline",
                        align: "left",
                        x: 0,
                        y:Math.round( ((props?.max - props?.baseLine) / props?.max) * 100 ) > 0 ? 20 : -10,
                        useHTML: true,
                        style: {
                            color: (styles.primary),
                            fontSize: "12px",
                        },
                    },
                },
                {
                    dashStyle: "dot",
                    color: (styles.primary),
                    width: 2,
                    value: props?.industrialAverage,
                    zIndex: 10,
                    label: {
                        text: "Industry average",
                        align: "left",
                        x: 0,
                        y: Math.round( ((props?.max - props?.industrialAverage) / props?.max) * 100 ) > 0 ? 20 : -10,
                        useHTML: true,
                        style: {
                            fontSize: "12px",
                            color: (styles.primary),
                        },
                    },
                },
            ],
        },
        xAxis: {
            categories: [props?.carrierName, capitalizeText(props?.name)],
            crosshair: true,
            labels: {
                style: {
                  color: (styles.primary),
                },
              },
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
                borderRadiusTopLeft: "20%",
                borderRadiusTopRight: "20%",
                dataLabels: {
                    enabled: true,
                    inside: false,
                    y: -10,
                    align: "center",
                    verticalAlign: "bottom",
                    formatter: function (_: any) {
                        const point: any = this;
                        return `<div class='text-center' style='color:${styles.primary}; font-size:13px'}>
                        ${formatNumber(true, point.y, 1)}
                        </br></div>`
                    },
                    useHTML: true,
                    style: {
                        color: "white",
                        textOutline: false,
                    },
                },
            },
        },
        series:[ {data: props?.options?.map((x: any, index: number) =>({
            y: Number(x.intensity),
            name: x.year,
            color: index === 0 ? (styles.lightgreen) : (styles.primary), // Generate a random color for each column
            pointWidth: 50,
          }) )}]        
    };
}